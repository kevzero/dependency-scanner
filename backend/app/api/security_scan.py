import subprocess
import tempfile
import json

async def scan_python(file):
    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        tmp.write(content)
        tmp.flush()
        result = subprocess.run(["pip-audit", "-r", tmp.name, "--format", "json"], capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"error": "Invalid output"}
    return {"vulnerabilities": data}

async def scan_node(file):
    content = await file.read()
    with tempfile.TemporaryDirectory() as tmpdir:
        package_path = f"{tmpdir}/package.json"
        with open(package_path, "wb") as f:
            f.write(content)
        subprocess.run(["npm", "install", "--package-lock-only"], cwd=tmpdir)
        result = subprocess.run(["npm", "audit", "--json"], cwd=tmpdir, capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"error": "Invalid output"}
    return {"vulnerabilities": data}
