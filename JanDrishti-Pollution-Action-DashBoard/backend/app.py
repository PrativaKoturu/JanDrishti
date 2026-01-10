"""
Vercel entrypoint for FastAPI application
This file is required by Vercel to find the FastAPI app instance
"""
from main import app

# Export the app for Vercel
__all__ = ["app"]
