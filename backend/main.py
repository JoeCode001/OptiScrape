# main.py
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
from dotenv import load_dotenv

from seo_analyzer import analyze_meta_tags_with_openai
from pagespeed_checker import run_pagespeed
from seo_analyzer import generate_preview_data

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PAGESPEED_API_KEY = os.getenv("PAGESPEED_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utilities
def is_valid_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return all([parsed.scheme in ("http", "https"), parsed.netloc])
    except:
        return False

def scrape_all_meta_tags(url: str):
    chrome_options = ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-dev-shm-usage")
    service = ChromeService()
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get(url)
        WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "head")))
        title = driver.title
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
    finally:
        driver.quit()

def categorize_meta_tags(meta_tags):
    categories = {
        "standard": [],
        "opengraph": [],
        "twitter": [],
        "other": []
    }
    
    for tag in meta_tags:
        if not tag or not any(tag.values()):
            continue
            
        # Safely get attributes with None checks
        name = tag.get('name')
        prop = tag.get('property')
        http_equiv = tag.get('http_equiv')
        
        # Convert to lowercase strings if they exist, otherwise empty string
        name_lower = name.lower() if name else ''
        prop_lower = prop.lower() if prop else ''
        http_equiv_lower = http_equiv.lower() if http_equiv else ''

        # Check for Twitter cards (name or property)
        if (name_lower.startswith('twitter:') or 
            prop_lower.startswith('twitter:')):
            categories["twitter"].append(tag)
        # Check for OpenGraph (typically property)
        elif prop_lower.startswith('og:'):
            categories["opengraph"].append(tag)
        # Standard meta tags
        elif (name_lower in {'description', 'keywords', 'author', 'viewport', 
                            'theme-color', 'robots'} or 
              http_equiv_lower):
            categories["standard"].append(tag)
        else:
            categories["other"].append(tag)
            
    return categories
# Routes
@app.get("/analyze")
async def analyze_seo(url: str = Query(..., description="URL to analyze (include http/https)")):
    if not is_valid_url(url):
        raise HTTPException(status_code=400, detail="Invalid URL format. Include http:// or https://")

    try:
        scraped_data = scrape_all_meta_tags(url)
        categorized = categorize_meta_tags(scraped_data["meta_tags"])
        # Generate debugger-style preview data
        preview_data = generate_preview_data(scraped_data, categorized)

        ai_data = await analyze_meta_tags_with_openai(
            url,
            scraped_data['title'],
            categorized,
            api_key=OPENAI_API_KEY
        )

        return {
            "url": url,
            "current_data": {
                "title": scraped_data["title"],
                "meta_tags": categorized,
                "preview_data": preview_data
            },
            "analysis": ai_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SEO analysis failed: {str(e)}")

@app.get("/pagespeed")
async def check_pagespeed(url: str = Query(..., description="URL to analyze (include http/https)")):
    if not is_valid_url(url):
        raise HTTPException(status_code=400, detail="Invalid URL format. Include http:// or https://")
    try:
        data = await run_pagespeed(url, PAGESPEED_API_KEY)
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PageSpeed analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
