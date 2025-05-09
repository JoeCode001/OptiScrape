# seo_analyzer.py
import json
import re
from fastapi import HTTPException
from openai import AsyncOpenAI

def extract_json(text: str):
    """Extract JSON object from AI response."""
    try:
        match = re.search(r"\{[\s\S]*\}", text.strip())
        if match:
            return json.loads(match.group(0))
    except json.JSONDecodeError:
        pass
    raise ValueError("No valid JSON found in AI response")

def generate_preview_data(scraped_data: dict, categorized: dict) -> dict:
    """Generate debugger-style preview data similar to Facebook's Sharing Debugger."""
    preview = {
        "url": scraped_data.get("url", ""),
        "title": scraped_data.get("title", ""),
        "meta_description": categorized.get("standard", {}).get("description", {}).get("content", ""),
        "og_data": {
            "og:title": categorized.get("opengraph", {}).get("og:title", {}).get("content", ""),
            "og:description": categorized.get("opengraph", {}).get("og:description", {}).get("content", ""),
            "og:image": categorized.get("opengraph", {}).get("og:image", {}).get("content", ""),
            "og:url": categorized.get("opengraph", {}).get("og:url", {}).get("content", ""),
            "og:type": categorized.get("opengraph", {}).get("og:type", {}).get("content", ""),
        },
        "twitter_data": {
            "twitter:title": categorized.get("twitter", {}).get("twitter:title", {}).get("content", ""),
            "twitter:description": categorized.get("twitter", {}).get("twitter:description", {}).get("content", ""),
            "twitter:image": categorized.get("twitter", {}).get("twitter:image", {}).get("content", ""),
            "twitter:card": categorized.get("twitter", {}).get("twitter:card", {}).get("content", ""),
        },
        "warnings": [],
        "notices": []
    }
    
    # Add validation warnings/notices
    if not preview["og_data"]["og:title"]:
        preview["warnings"].append("Missing og:title tag")
    if not preview["og_data"]["og:description"]:
        preview["warnings"].append("Missing og:description tag")
    if not preview["og_data"]["og:image"]:
        preview["warnings"].append("Missing og:image tag")
    
    if not preview["twitter_data"]["twitter:title"]:
        preview["notices"].append("Consider adding twitter:title for better Twitter sharing")
    
    return preview

async def analyze_meta_tags_with_openai(url: str, title: str, categorized: dict, api_key: str):
    """Analyze SEO using OpenAI and return structured JSON."""
    prompt = f"""
    Analyze these meta tags for SEO effectiveness:

    Current URL: {url}
    Current Title: {title}

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
                {{"property": "og:title", "content": "improved content"}},
                {{"property": "og:description", "content": "improved content"}},
                {{"property": "og:image", "content": "improved image URL"}}
            ],
            "twitter": [
                {{"name": "twitter:title", "content": "improved content"}},
                {{"name": "twitter:description", "content": "improved content"}},
                {{"name": "twitter:image", "content": "improved image URL"}}
            ]
        }},
        "preview_analysis": {{
            "expected_sharing_appearance": "Description of how this link would appear when shared",
            "critical_missing_tags": ["list", "of", "missing", "critical", "tags"]
        }}
    }}
    """

    openai_client = AsyncOpenAI(api_key=api_key)

    ai_response = await openai_client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        response_format={"type": "json_object"}
    )

    ai_text = ai_response.choices[0].message.content
    return extract_json(ai_text)