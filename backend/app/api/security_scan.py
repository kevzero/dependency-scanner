import json
from datetime import datetime
import re

async def scan_python(file):
    content = await file.read()
    text = content.decode()

    if not text.strip():
        return {"error": "The file is empty. Nothing to analyze."}

    # Validazione linguaggio (deve contenere almeno uno di questi pattern tipici Python)
    if not any(keyword in text for keyword in ["def ", "import ", "class ", ":"]):
        return {"error": "The file does not appear to be Python code. Please select the correct language."}

    lines = text.splitlines()
    total_lines = len(lines)
    comments = sum(1 for l in lines if l.strip().startswith("#"))

    # Analisi strutturale
    functions = re.findall(r"def (\w+)\(", text)
    classes = re.findall(r"class (\w+)\(", text)
    imports = re.findall(r"import (\w+)", text) + re.findall(r"from (\w+)", text)

    # Analisi data types
    data_types = []
    if re.search(r"\d+", text): data_types.append("int")
    if re.search(r"\".*?\"|'.*?'", text): data_types.append("str")
    if re.search(r"\[.*?\]", text): data_types.append("list")
    if re.search(r"\{.*?:.*?\}", text): data_types.append("dict")

    # Parole chiave Python
    keywords = ["def", "class", "import", "from", "return", "if", "else", "try", "except"]
    keyword_count = sum(text.count(k) for k in keywords)

    return {
        "language": "Python",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_lines": total_lines,
        "comments": comments,
        "functions": functions,
        "classes": classes,
        "imports": list(set(imports)),
        "data_types": list(set(data_types)),
        "keyword_count": keyword_count
    }

async def scan_node(file):
    content = await file.read()
    text = content.decode()

    if not text.strip():
        return {"error": "The file is empty. Nothing to analyze."}

    # Validazione linguaggio (deve contenere almeno uno di questi pattern tipici JS)
    if not any(keyword in text for keyword in ["function", "require", "module.exports", "=>"]):
        return {"error": "The file does not appear to be Node.js code. Please select the correct language."}

    lines = text.splitlines()
    total_lines = len(lines)
    comments = sum(1 for l in lines if l.strip().startswith("//"))

    functions = re.findall(r"function (\w+)\(", text)
    imports = re.findall(r"require\(['\"](.+?)['\"]\)", text)

    # Analisi data types
    data_types = []
    if re.search(r"\d+", text): data_types.append("number")
    if re.search(r"\".*?\"|'.*?'", text): data_types.append("string")
    if re.search(r"\[.*?\]", text): data_types.append("array")
    if re.search(r"\{.*?\}", text): data_types.append("object")

    # Parole chiave JS
    keywords = ["function", "var", "let", "const", "return", "if", "else", "try", "catch"]
    keyword_count = sum(text.count(k) for k in keywords)

    return {
        "language": "Node.js",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_lines": total_lines,
        "comments": comments,
        "functions": functions,
        "classes": [],
        "imports": list(set(imports)),
        "data_types": list(set(data_types)),
        "keyword_count": keyword_count
    }
