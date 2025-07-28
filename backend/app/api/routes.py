from fastapi import APIRouter, UploadFile
from fastapi.responses import FileResponse
from .security_scan import scan_python, scan_node
from .report import generate_pdf

router = APIRouter()

@router.post("/scan/python")
async def scan_python_file(file: UploadFile):
    return await scan_python(file)

@router.post("/scan/node")
async def scan_node_file(file: UploadFile):
    return await scan_node(file)

@router.post("/report")
async def create_report(data: dict):
    pdf_path = generate_pdf(data)
    return FileResponse(pdf_path, media_type="application/pdf", filename="report.pdf")
