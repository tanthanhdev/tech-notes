#!/usr/bin/env python3
"""
Script to automatically generate SUMMARY.md by scanning the docs/ directory.
"""

import os
import re
from pathlib import Path

def generate_summary():
    """Generate summary based on docs structure"""
    docs_dir = Path("docs")
    summary_path = Path("SUMMARY.md")
    
    # Start with header
    summary_content = "# Tech Notes Hub\n\n"
    summary_content += "## Table of Contents\n\n"
    
    # Process each directory in docs/
    for path in sorted(docs_dir.glob("*")):
        if path.is_dir():
            dir_name = path.name
            pretty_dir_name = dir_name.replace('-', ' ').title()
            summary_content += f"### {pretty_dir_name}\n\n"
            
            # Process files in the directory
            for file in sorted(path.glob("*.md")):
                file_name = file.stem
                
                # Skip files that start with underscore (like _category_.json files)
                if file_name.startswith('_'):
                    continue
                
                # Get the title from the file's first heading
                title = get_title_from_file(file)
                if not title:
                    title = file_name.replace('-', ' ').title()
                
                relative_path = os.path.join(path.name, file.name)
                summary_content += f"- [{title}](docs/{relative_path})\n"
            
            summary_content += "\n"
    
    # Write the summary file
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(summary_content)
    
    print(f"Generated {summary_path}")

def get_title_from_file(file_path):
    """Extract the title from the first heading in the file"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Look for first # heading
            match = re.search(r'^# (.+)$', content, re.MULTILINE)
            if match:
                return match.group(1)
    except Exception as e:
        print(f"Warning: Could not extract title from {file_path}: {e}")
    
    return None

if __name__ == "__main__":
    generate_summary() 