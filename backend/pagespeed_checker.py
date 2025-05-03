# pagespeed_checker.py
import aiohttp
from fastapi import HTTPException

async def run_pagespeed(url: str, api_key: str):
    api_endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
    params = {
        'url': url,
        'key': api_key
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(api_endpoint, params=params) as response:
            if response.status != 200:
                raise HTTPException(
                    status_code=response.status,
                    detail=f"PageSpeed API error: {await response.text()}"
                )
            return await response.json()
