import json
from datetime import datetime
import re

async def scan_python(file):
    content = await file.read()
    text = content.decode()
    lines = text.splitlines()

    total_lines = len(lines)
    comments = sum(1 for l in lines if l.strip().startswith("#"))
    functions = re.findall(r"def (\w+)\(", text)
    classes = re.findall(r"class (\w+)\(", text)
    imports = re.findall(r"import (\w+)", text) + re.findall(r"from (\w+)", text)

    return {
        "language": "Python",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_lines": total_lines,
        "comments": comments,
        "functions": functions,
        "classes": classes,
        "imports": list(set(imports))
    }

async def scan_node(file):
    content = await file.read()
    text = content.decode()
    lines = text.splitlines()

    total_lines = len(lines)
    comments = sum(1 for l in lines if l.strip().startswith("//"))
    functions = re.findall(r"function (\w+)\(", text)
    imports = re.findall(r"require\(['\"](.+?)['\"]\)", text)

    return {
        "language": "Node.js",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_lines": total_lines,
        "comments": comments,
        "functions": functions,
        "classes": [],  # opzionale
        "imports": list(set(imports))
    }
