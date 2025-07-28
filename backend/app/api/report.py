from reportlab.lib.pagesizes import A4 # type: ignore
from reportlab.lib import colors # type: ignore
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer # type: ignore
from reportlab.lib.styles import getSampleStyleSheet # type: ignore
import tempfile


def generate_pdf(data):
    pdf_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    title = Paragraph("Detailed Code Analysis Report", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 20))

    info = f"""
    <b>File:</b> {data.get('analyzed_file')}<br/>
    <b>Language:</b> {data.get('language')}<br/>
    <b>Date:</b> {data.get('date')}<br/>
    <b>Total Lines:</b> {data.get('total_lines')}<br/>
    <b>Comments:</b> {data.get('comments')}<br/>
    <b>Functions:</b> {', '.join(data.get('functions', [])) or 'None'}<br/>
    <b>Classes:</b> {', '.join(data.get('classes', [])) or 'None'}<br/>
    <b>Imports:</b> {', '.join(data.get('imports', [])) or 'None'}<br/>
    <b>Data Types:</b> {', '.join(data.get('data_types', [])) or 'None'}<br/>
    <b>Keyword Count:</b> {data.get('keyword_count')}
    """
    elements.append(Paragraph(info, styles["Normal"]))
    doc.build(elements)
    return pdf_path
