from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import urlparse
import os
import json
import re
from typing import List, Dict
from pydantic_settings import BaseSettings
from openai import AsyncOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration Management
class Settings(BaseSettings):
    openai_api_key: str = os.getenv("OPENAI_API_KEY")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.openai_api_key)

# --- Utilities ---

def is_valid_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return all([parsed.scheme in ("http", "https"), parsed.netloc])
    except:
        return False

def scrape_all_meta_tags(url: str) -> Dict:
    """Scrape all meta tags from the page using Selenium."""
    # Set up headless Chrome
    chrome_options = ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = ChromeService()  # Assumes chromedriver is in PATH
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get(url)

        # Wait until <head> is loaded (max 15 seconds)
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "head")))

        # Get the title
        title = driver.title

        # Get all meta tags
        meta_elements = driver.find_elements(By.TAG_NAME, "meta")
        meta_tags = []
        for meta in meta_elements:
            tag_info = {
                "name": meta.get_attribute("name"),
                "property": meta.get_attribute("property"),
                "content": meta.get_attribute("content"),
                "charset": meta.get_attribute("charset"),
                "http_equiv": meta.get_attribute("http-equiv")
            }
            if any(tag_info.values()):
                meta_tags.append(tag_info)

        return {
            "title": title,
            "meta_tags": meta_tags
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to scrape URL: {str(e)}"
        )
    finally:
        driver.quit()

def categorize_meta_tags(meta_tags: List[Dict]) -> Dict:
    """Organize meta tags by type for better analysis."""
    categories = {
        "standard": [],
        "opengraph": [],
        "twitter": [],
        "other": []
    }
    
    for tag in meta_tags:
        if not any(tag.values()):
            continue
        
        property_attr = tag.get('property') or ''
        name_attr = tag.get('name') or ''
        http_equiv_attr = tag.get('http_equiv') or ''
        
        if property_attr.startswith('og:'):
            categories["opengraph"].append(tag)
        elif property_attr.startswith('twitter:'):
            categories["twitter"].append(tag)
        elif name_attr or http_equiv_attr:
            categories["standard"].append(tag)
        else:
            categories["other"].append(tag)
    
    return categories


def extract_json(text: str) -> Dict:
    """Safely extract JSON object from AI response."""
    try:
        match = re.search(r"\{[\s\S]*\}", text.strip())
        if match:
            return json.loads(match.group(0))
    except json.JSONDecodeError:
        pass
    raise ValueError("No valid JSON found in AI response")

# --- Routes ---

@app.get("/analyze")
async def analyze_seo(url: str = Query(..., description="URL to analyze (include http/https)")):
    if not is_valid_url(url):
        raise HTTPException(status_code=400, detail="Invalid URL format. Include http:// or https://")
    
    try:
        # Step 1: Scrape meta tags (Selenium)
        scraped_data = scrape_all_meta_tags(url)
        categorized = categorize_meta_tags(scraped_data["meta_tags"])
        
        # Step 2: Prepare prompt
        prompt = f"""
        Analyze these meta tags for SEO effectiveness:

        Current URL: {url}
        Current Title: {scraped_data['title']}

        Meta Tags:
        {json.dumps(categorized, indent=2)}

        Provide analysis in this exact JSON format:
        {{
            "performance_score": 0-100,
            "weaknesses": ["list", "of", "issues"],
            "improvements": {{
                "title": "improved title",
                "standard": [
                    {{"name": "description", "content": "improved content"}}
                ],
                "opengraph": [
                    {{"property": "og:title", "content": "improved content"}}
                ]
            }}
        }}
        """
        
        # Step 3: AI analysis
        ai_response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        ai_text = ai_response.choices[0].message.content
        ai_data = extract_json(ai_text)
        
        # Step 4: Response
        return {
            "url": url,
            "current_data": {
                "title": scraped_data["title"],
                "meta_tags": categorized
            },
            "analysis": ai_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"SEO analysis failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
