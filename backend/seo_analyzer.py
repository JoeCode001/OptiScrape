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
                {{"property": "og:title", "content": "improved content"}}
            ]
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
