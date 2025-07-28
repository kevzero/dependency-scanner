import json
from datetime import datetime

async def scan_python(file):
    content = await file.read()
    lines = content.decode().splitlines()
    packages = []
    for line in lines:
        if "==" in line:
            name, version = line.split("==")
            packages.append({"name": name.strip(), "version": version.strip()})
    return {
        "language": "Python",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "packages": packages
    }

async def scan_node(file):
    content = await file.read()
    data = json.loads(content.decode())
    packages = []
    if "dependencies" in data:
        for name, version in data["dependencies"].items():
            packages.append({"name": name, "version": version})
    return {
        "language": "Node.js",
        "analyzed_file": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "packages": packages
    }
