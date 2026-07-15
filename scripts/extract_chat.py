import json
import re
from bs4 import BeautifulSoup

html_file = r'C:\Users\VNAV-PC\.gemini\antigravity-ide\brain\867c7f10-0527-49eb-bc89-7a337c492b6a\.system_generated\steps\5\content.md'
output_file = r'c:\Users\VNAV-PC\Desktop\AWS\scripts\chat_output_utf8.txt'

try:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    with open(output_file, 'w', encoding='utf-8') as out_f:
        soup = BeautifulSoup(content, 'html.parser')
        
        # In newer ChatGPT pages, the conversation is often rendered as div with data-testid="conversation-turn-[n]"
        turns = soup.find_all(lambda tag: tag.name == 'div' and tag.has_attr('data-testid') and tag['data-testid'].startswith('conversation-turn-'))
        
        if turns:
            for turn in turns:
                # Find author role
                author_el = turn.find(attrs={"data-message-author-role": True})
                role = author_el['data-message-author-role'] if author_el else "Unknown"
                
                # Get the actual message text. Usually it's in a div with data-message-id inside the turn, 
                # or just get text of the whole turn. We can just use get_text
                
                # We need to remove code block copy buttons or header texts if any, but get_text is mostly fine.
                text = turn.get_text(separator='\n', strip=True)
                out_f.write(f"--- {role.upper()} ---\n")
                out_f.write(f"{text}\n\n")
        else:
            out_f.write("No conversation turns found in DOM.\n")

except Exception as e:
    import traceback
    with open(output_file, 'w', encoding='utf-8') as out_f:
        out_f.write(f"Error: {traceback.format_exc()}\n")
