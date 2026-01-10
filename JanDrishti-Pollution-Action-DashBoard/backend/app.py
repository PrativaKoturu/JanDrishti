"""
Vercel entrypoint for FastAPI application
This file is required by Vercel to find the FastAPI app instance
"""
import sys
import os

# Add the current directory to the path to ensure imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

# Export the app for Vercel
# Vercel Python runtime looks for 'app' or 'handler'
# The handler must be the ASGI app instance
handler = app

__all__ = ["app", "handler"]
