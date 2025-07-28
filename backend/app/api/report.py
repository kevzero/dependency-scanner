from reportlab.lib.pagesizes import A4 # type: ignore
from reportlab.lib import colors # type: ignore
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer # type: ignore
from reportlab.lib.styles import getSampleStyleSheet # type: ignore
import tempfile

def generate_pdf(data):
    pdf_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    title = Paragraph("Dependency Analysis Report", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 20))

    # Info
    info = f"""
    File analyzed: {data.get('analyzed_file', 'N/A')}<br/>
    Language: {data.get('language', 'N/A')}<br/>
    Date: {data.get('date', '')}<br/>
    Note: This report lists packages found in the file. No CVE check performed.
    """
    elements.append(Paragraph(info, styles["Normal"]))
    elements.append(Spacer(1, 20))

    # Table
    table_data = [["Package", "Version"]]
    for pkg in data.get("packages", []):
        table_data.append([pkg["name"], pkg["version"]])

    table = Table(table_data, colWidths=[200, 100])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
    ]))
    elements.append(table)

    doc.build(elements)
    return pdf_path
