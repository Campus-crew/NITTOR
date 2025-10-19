#!/usr/bin/env python3
import json
import re

# Read the RTF file
with open('api.rtf', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Try to find JSON content
json_pattern = r'\{["\']openapi["\'].*?\}(?=\\cf|\}$)'
matches = re.findall(json_pattern, content, re.DOTALL)

if matches:
    json_str = matches[0]
    # Remove RTF formatting artifacts
    json_str = json_str.replace('\\', '')
    json_str = re.sub(r'\{\\[^}]+\}', '', json_str)
    
    try:
        # Try to parse and pretty print
        data = json.loads(json_str)
        print(json.dumps(data, indent=2))
    except:
        # If parsing fails, just print the raw string
        print(json_str[:50000])
else:
    print("No JSON found")
