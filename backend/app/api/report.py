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

    title = Paragraph("Dependency Analysis Report", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 20))

    info = f"File: {data['analyzed_file']}<br/>Language: {data['language']}<br/>Date: {data['date']}"
    elements.append(Paragraph(info, styles["Normal"]))
    elements.append(Spacer(1, 20))

    table_data = [["Package", "Version"]]
    for pkg in data["packages"]:
        table_data.append([pkg["name"], pkg["version"]])

    table = Table(table_data, colWidths=[250, 150])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.grey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.whitesmoke),
        ("GRID", (0,0), (-1,-1), 1, colors.black)
    ]))
    elements.append(table)

    doc.build(elements)
    return pdf_path
