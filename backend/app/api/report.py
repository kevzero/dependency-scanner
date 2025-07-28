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
    File: {data.get('analyzed_file')}<br/>
    Language: {data.get('language')}<br/>
    Date: {data.get('date')}<br/>
    Total Lines: {data.get('total_lines')}<br/>
    Comments: {data.get('comments')}<br/>
    Functions: {', '.join(data.get('functions', [])) or 'None'}<br/>
    Classes: {', '.join(data.get('classes', [])) or 'None'}<br/>
    Imports: {', '.join(data.get('imports', [])) or 'None'}
    """
    elements.append(Paragraph(info, styles["Normal"]))
    elements.append(Spacer(1, 20))

    doc.build(elements)
    return pdf_path
