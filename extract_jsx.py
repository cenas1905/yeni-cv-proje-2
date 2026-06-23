import re
import json

def convert_html_to_jsx(html):
    jsx = html.replace('class=', 'className=')
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx)
    jsx = jsx.replace('for=', 'htmlFor=')
    jsx = jsx.replace('tabindex=', 'tabIndex=')
    jsx = jsx.replace('datetime=', 'dateTime=')
    
    # Self-close specific tags
    tags_to_close = ['input', 'img', 'br', 'hr']
    for tag in tags_to_close:
        jsx = re.sub(r'(<' + tag + r'[^>]*)(?<!/)>', r'\1 />', jsx)
        
    return jsx

with open('stitch_utf8.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Extract the Sidebar
sidebar_match = re.search(r'<aside[^>]*>(.*?)</aside>', html_content, re.DOTALL)
sidebar_html = '<aside className="w-full md:w-80 flex-shrink-0">' + sidebar_match.group(1) + '</aside>'

# Extract the Job Card (Card 1)
card_match = re.search(r'<!-- Card 1 -->(.*?)<!-- Card 2 -->', html_content, re.DOTALL)
card_html = card_match.group(1).strip()

print("Parsed HTML parts successfully.")
