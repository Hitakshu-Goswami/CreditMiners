# Developer Guide

## Overview

This guide provides instructions for developers who want to set up, run, and contribute to the CreditMiners project. The project is organized into separate frontend, backend, and machine learning components to encourage modular development.

---

# Project Structure

```
CreditMiners/
│
├── backend/
├── frontend/
├── ml/
├── sample_data/
├── tests/
├── docs/
├── presentation/
├── README.md
├── LICENSE
└── .gitignore
```

---

# Technology Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- Recharts

## Backend

- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic

## Machine Learning

- Scikit-learn
- Pandas
- NumPy
- SHAP

## Database

- SQLite (Prototype)

---

# Development Environment

## Clone the Repository

```bash
git clone <repository-url>
cd CreditMiners
```

---

## Create a Virtual Environment

```bash
python -m venv venv
```

Activate the environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Running the Backend

Navigate to the backend directory:

```bash
cd backend
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at:

```
http://localhost:8000
```

Interactive API documentation:

```
http://localhost:8000/docs
```

---

# Running the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# Machine Learning Workflow

The ML module is responsible for:

- Data preprocessing
- Feature engineering
- Credit score prediction
- Explainable AI generation
- Risk classification
- Investment recommendation

During development, use synthetic or user-consented datasets.

---

# Coding Standards

To maintain consistency:

- Use descriptive variable and function names.
- Follow PEP 8 for Python code.
- Keep functions focused on a single responsibility.
- Add comments where complex logic is used.
- Write reusable and modular code.

---

# Testing

Before committing changes:

- Verify backend endpoints.
- Check frontend functionality.
- Test ML predictions with sample data.
- Confirm documentation remains up to date.

Future improvements may include automated unit and integration tests.

---

# Git Workflow

Recommended workflow:

1. Create a feature branch.
2. Implement changes.
3. Test locally.
4. Commit with meaningful messages.
5. Push changes.
6. Open a pull request.

Example commit messages:

```
feat: implement credit scoring endpoint
fix: correct feature engineering logic
docs: update API documentation
refactor: simplify risk assessment module
```

---

# Future Development

Potential areas for contribution include:

- Improved machine learning models
- Enhanced explainability
- Additional REST APIs
- Authentication and authorization
- Cloud deployment
- CI/CD pipeline
- Docker support
- Real financial API integrations

---

# Contributing

Contributions are welcome. Please:

- Follow the coding standards.
- Update documentation when necessary.
- Test your changes before submitting.
- Keep pull requests focused on a single feature or fix.

---

# Disclaimer

This project is developed as part of a hackathon and uses synthetic or user-consented data for demonstration purposes. Any future production deployment should include appropriate security, privacy, and regulatory compliance measures.