import json
from datetime import datetime
import re

async def scan_python(file):
    content = await file.read()
    text = content.decode()

    if not text.strip():
        return {"error": "Empty file. Nothing to analyze."}

    # Linguaggio check: deve contenere almeno "def", "import" o ":" tipico Python
    if not any(keyword in text for keyword in ["def ", "import ", "class ", ":"]):
        return {"error": "File does not appear to be valid Python code."}

    lines = text.splitlines()
    total_lines = len(lines)
    comments = sum(1 for l in lines if l.strip().startswith("#"))
    functions = re.findall(r"def (\w+)\(", text)
    classes = re.findall(r"class (\w+)\(", text)
    imports = re.findall(r"import (\w+)", text) + re.findall(r"from (\w+)", text)

    # Detect common Python data types
    data_types = []
    if re.search(r"\d+", text): data_types.append("int")
    if re.search(r"\".*?\"|'.*?'", text): data_types.append("str")
    if re.search(r"\[.*?\]", text): data_types.append("list")
    if re.search(r"\{.*?:.*?\}", text): data_types.append("dict")

    return {
        "language": "Python",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_lines": total_lines,
        "comments": comments,
        "functions": functions,
        "classes": classes,
        "imports": list(set(imports)),
        "data_types": list(set(data_types))
    }

async def scan_node(file):
    content = await file.read()
    text = content.decode()

    if not text.strip():
        return {"error": "Empty file. Nothing to analyze."}

    # Linguaggio check: deve contenere almeno "require" o "import" tipico Node.js
    if not any(keyword in text for keyword in ["require(", "import "]):
        return {"error": "File does not appear to be valid Node.js code."}

    lines = text.splitlines()
    total_lines = len(lines)
    comments = sum(1 for l in lines if l.strip().startswith("//"))
    functions = re.findall(r"function (\w+)\(", text)
    classes = re.findall(r"class (\w+)\(", text)
    imports = re.findall(r"require\(['\"](.+?)['\"]\)", text) + re.findall(r"import ['\"](.+?)['\"]", text)

    # Detect common Node.js data types
    data_types = []
    if re.search(r"\d+", text): data_types.append("int")
    if re.search(r"\".*?\"|'.*?'", text): data_types.append("str")
    if re.search(r"\[.*?\]", text): data_types.append("list")
    if re.search(r"\{.*?:.*?\}", text): data_types.append("dict")

    return {
        "language": "Node.js",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_lines": total_lines,
        "comments": comments,
        "functions": functions,
        "classes": classes,
        "imports": list(set(imports)),
        "data_types": list(set(data_types))
    }
