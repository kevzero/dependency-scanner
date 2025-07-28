from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import tempfile

def generate_pdf(data):
    pdf_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    title = Paragraph("Dependency Security Report", styles["Title"])
    elements.append(title)

    table_data = [["Package", "Version", "CVE", "Severity", "Fix"]]
    for vuln in data.get("vulnerabilities", []):
        table_data.append([
            vuln.get("name", "-"),
            vuln.get("version", "-"),
            vuln.get("id", "-"),
            vuln.get("severity", "-"),
            ", ".join(vuln.get("fix_versions", []))
        ])

    table = Table(table_data, colWidths=[100, 60, 80, 60, 100])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
    ]))
    elements.append(table)
    doc.build(elements)
    return pdf_path
