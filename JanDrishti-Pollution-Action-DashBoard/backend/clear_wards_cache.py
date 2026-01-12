#!/usr/bin/env python3
"""
Script to clear the cache for /api/aqi/wards endpoint
Run this after updating selected_wards.json to see changes immediately
"""
import sys
import os
from chat_cache import get_chat_cache
import hashlib

def clear_wards_cache():
    """Clear Redis cache for the wards endpoint"""
    try:
        chat_cache = get_chat_cache()
        
        # Generate the cache key (same logic as middleware)
        cache_key_pattern = "cache:api:*"
        
        # Get all cache keys
        keys = []
        cursor = 0
        while True:
            cursor, partial_keys = chat_cache.redis_client.scan(cursor, match=cache_key_pattern, count=100)
            keys.extend(partial_keys)
            if cursor == 0:
                break
        
        # Find and delete the wards endpoint cache
        wards_path = "/api/aqi/wards"
        key_parts = [wards_path]
        key_string = "|".join(key_parts)
        key_hash = hashlib.md5(key_string.encode()).hexdigest()
        cache_key = f"cache:api:{key_hash}"
        
        deleted = chat_cache.redis_client.delete(cache_key)
        
        if deleted:
            print(f"✅ Successfully cleared cache for {cache_key}")
            print(f"   The next request to /api/aqi/wards will fetch fresh data")
        else:
            print(f"ℹ️  Cache key {cache_key} not found (may have already expired)")
            print(f"   This is fine - the endpoint will work normally")
        
        # Also try to delete any other variations
        for key in keys:
            if "wards" in key.decode() if isinstance(key, bytes) else "wards" in key:
                chat_cache.redis_client.delete(key)
                print(f"   Also cleared: {key}")
        
    except Exception as e:
        print(f"❌ Error clearing cache: {e}")
        print("   You may need to restart the backend server instead")
        sys.exit(1)

if __name__ == "__main__":
    clear_wards_cache()
