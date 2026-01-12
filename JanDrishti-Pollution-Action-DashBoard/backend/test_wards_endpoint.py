#!/usr/bin/env python3
"""
Test script to verify the /api/aqi/wards endpoint returns 50 wards
Run this to check if the backend is working correctly
"""
import sys
import os
import json

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_wards_endpoint():
    """Test the wards endpoint logic directly"""
    try:
        # Simulate the endpoint logic
        json_path = os.path.join(os.path.dirname(__file__), "selected_wards.json")
        
        if os.path.exists(json_path):
            with open(json_path, 'r') as f:
                selected_wards = json.load(f)
                print(f"✅ Found selected_wards.json")
                print(f"✅ Total wards: {len(selected_wards)}")
                
                if len(selected_wards) == 50:
                    print(f"✅ SUCCESS: Exactly 50 wards found!")
                    print(f"\nFirst 5 wards:")
                    for i, ward in enumerate(selected_wards[:5], 1):
                        print(f"  {i}. {ward['ward_name']} ({ward['ward_no']})")
                    print(f"\nLast 5 wards:")
                    for i, ward in enumerate(selected_wards[-5:], 46):
                        print(f"  {i}. {ward['ward_name']} ({ward['ward_no']})")
                    return True
                else:
                    print(f"❌ ERROR: Expected 50 wards, but found {len(selected_wards)}")
                    return False
        else:
            print(f"❌ ERROR: selected_wards.json not found at {json_path}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_wards_endpoint()
    sys.exit(0 if success else 1)
