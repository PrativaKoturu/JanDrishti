"""
Vercel entrypoint for FastAPI application
This file is required by Vercel to find the FastAPI app instance
"""
from main import app

# Export the app for Vercel
# Vercel Python runtime looks for 'app' or 'handler'
# Both are exported for compatibility
handler = app

__all__ = ["app", "handler"]
