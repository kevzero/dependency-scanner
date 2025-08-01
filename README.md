# Dependency & Security Scanner

## ✅ Overview

This project is a **full-stack application** to analyze dependencies in Python and Node.js projects, detect vulnerabilities, and generate detailed PDF reports. It features:

* **Backend:** FastAPI + `pip-audit` + `bandit` + `npm audit`
* **Frontend:** React UI (modern, responsive)
* **Dockerized setup** with `docker-compose`

---

## ✅ Features

* Upload a dependency file:

  * Python: `requirements.txt`
  * Node.js: `package.json`
* Perform vulnerability analysis:

  * Python: Uses **pip-audit** (checks CVEs) and **bandit** (static analysis)
  * Node.js: Uses **npm audit**
* Display results in the UI:

  * Vulnerabilities with **severity colors**
  * Library name, version, fix suggestions
* Generate **detailed PDF report**:

  * Includes vulnerabilities, CVEs, severity, and recommendations
* **Reset option** to start a new scan

**Currently supports:** Python and Node.js. The architecture is modular, so additional languages and tools can be added easily in future updates.

---

## ✅ Tech Stack

* **Backend:** Python 3.11, FastAPI, pip-audit, bandit, reportlab
* **Frontend:** React, Vite, Pure CSS (No Tailwind/Bootstrap)
* **Containerization:** Docker & Docker Compose

---

## ✅ Project Structure

```
dependency-scanner/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── pdf_report.py    # PDF generation
│   │   ├── utils.py         # Helpers (optional)
│   │   └── requirements.txt # Backend dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── components/
│   │   │   ├── Upload.jsx   # File upload component
│   │   │   └── ResultsTable.jsx # Displays vulnerabilities
│   │   └── styles.css       # Custom CSS
│   ├── index.html
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

---

## ✅ Prerequisites

* **Docker & Docker Compose** installed
* Alternatively: Python 3.11 + Node.js if running locally

---

## ✅ Running with Docker

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dependency-scanner.git
cd dependency-scanner
```

2. Build and start containers:

```bash
docker-compose up --build
```

3. Access the app:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ✅ Local Development (Without Docker)

### Backend:

```bash
cd backend
pip install -r app/requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend:

```bash
cd frontend
npm install
npm run dev
```

Access frontend at: `http://localhost:3000`

---

## ✅ API Endpoints

### **POST /scan/python**

Uploads `requirements.txt` and returns vulnerabilities.

### **POST /scan/node**

Uploads `package.json` and returns vulnerabilities.

### **POST /report**

Generates a PDF report and returns the file.

---

## ✅ Features in Progress

* Adding support for additional languages and tools
* CI/CD integration with GitHub Actions
* Multi-file scan support

---

## ✅ Example Workflow

1. Open UI → Upload `requirements.txt`
2. Select language → Click **Scan File**
3. View vulnerabilities (colored by severity)
4. Click **Download PDF Report** for detailed export
5. Click **Reset** to analyze another file

---

## ✅ License

MIT License
