import re
import json

html_file = 'stitch_jobs.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract colors from tailwind config
colors_match = re.search(r'"colors":\s*({.*?})', html, re.DOTALL)
colors = {}
if colors_match:
    colors = json.loads(colors_match.group(1).replace('\n', ''))

# Extract spacing from tailwind config
spacing = {
    "xs": "1",
    "sm": "2",
    "md": "4",
    "lg": "6",
    "xl": "10",
    "gutter": "6",
    "container-max": "1280px"
}

body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
body = body_match.group(1) if body_match else ""

# Remove script and style tags
body = re.sub(r'<script.*?>.*?</script>', '', body, flags=re.DOTALL)
body = re.sub(r'<style.*?>.*?</style>', '', body, flags=re.DOTALL)

# HTML to JSX conversions
jsx = body.replace('class=', 'className=')
jsx = jsx.replace('for=', 'htmlFor=')
jsx = jsx.replace('tabindex=', 'tabIndex=')
jsx = jsx.replace('datetime=', 'dateTime=')

# Self-closing tags
for tag in ['input', 'img', 'br', 'hr']:
    jsx = re.sub(r'(<' + tag + r'[^>]*)(?<!/)>', r'\1 />', jsx)

# Replace classNames with generic tailwind or hex codes
def replace_classes(match):
    class_str = match.group(1)
    # Replace colors
    for color_name, hex_code in colors.items():
        class_str = re.sub(rf'\bbg-{color_name}\b', f'bg-[{hex_code}]', class_str)
        class_str = re.sub(rf'\btext-{color_name}\b', f'text-[{hex_code}]', class_str)
        class_str = re.sub(rf'\bborder-{color_name}\b', f'border-[{hex_code}]', class_str)
        class_str = re.sub(rf'\bring-{color_name}\b', f'ring-[{hex_code}]', class_str)
    
    # Replace spacing
    for sp_name, tw_val in spacing.items():
        for prefix in ['p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'gap']:
            class_str = re.sub(rf'\b{prefix}-{sp_name}\b', f'{prefix}-{tw_val}', class_str)
            
    # Remove custom fonts
    class_str = re.sub(r'\bfont-headline-[a-z]+\b', '', class_str)
    class_str = re.sub(r'\bfont-body-[a-z]+\b', '', class_str)
    class_str = re.sub(r'\bfont-label-[a-z]+\b', '', class_str)
    class_str = re.sub(r'\btext-headline-[a-z]+\b', 'text-2xl', class_str)
    class_str = re.sub(r'\btext-body-[a-z]+\b', 'text-base', class_str)
    class_str = re.sub(r'\btext-label-[a-z]+\b', 'text-sm', class_str)
    
    # Replace glass-panel and job-card-shadow
    class_str = class_str.replace('glass-panel', 'bg-white/70 backdrop-blur-md border border-[#dbe1ff]/50 shadow-sm')
    class_str = class_str.replace('job-card-shadow', 'shadow-md')
    
    # Replace material-symbols-outlined with regular classes
    class_str = class_str.replace('material-symbols-outlined', 'material-icons')
    
    return f'className="{class_str}"'

jsx = re.sub(r'className="([^"]+)"', replace_classes, jsx)

# Replace <span class="material-icons">icon_name</span> with Lucide Icons
jsx = re.sub(r'<span[^>]*className="[^"]*material-icons[^"]*"[^>]*>\s*([a-z_]+)\s*</span>', r'<Icon name="\1" />', jsx)
jsx = re.sub(r'<button[^>]*className="[^"]*material-icons[^"]*"[^>]*>\s*([a-z_]+)\s*</button>', r'<button><Icon name="\1" /></button>', jsx)

# Now extract Sidebar and Jobs Grid
sidebar_match = re.search(r'<aside[^>]*>.*?</aside>', jsx, re.DOTALL)
sidebar_jsx = sidebar_match.group(0) if sidebar_match else ""

main_match = re.search(r'<main[^>]*>.*?</main>', jsx, re.DOTALL)
main_jsx = main_match.group(0) if main_match else ""

with open('extracted_ui.jsx', 'w', encoding='utf-8') as f:
    f.write("=== SIDEBAR ===\n" + sidebar_jsx + "\n\n=== MAIN ===\n" + main_jsx)

print("Extraction complete. Check extracted_ui.jsx")
