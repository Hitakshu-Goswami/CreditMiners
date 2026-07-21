# Coding Standards

## Purpose

This document defines the coding standards, repository conventions, and development workflow for the CreditMiners project.

All contributors, including AI coding assistants, should follow these standards unless a documented architectural decision specifies otherwise.

---

# General Principles

- Write clear, readable, and maintainable code.
- Prefer simplicity over clever implementations.
- Avoid premature optimization.
- Keep functions focused on a single responsibility.
- Document non-obvious logic.
- Remove unused code instead of commenting it out.

---

# Repository Structure

```text
backend/      FastAPI backend
frontend/     React application
ml/           Machine learning models and pipelines
data/         Sample and processed datasets
docs/         Project documentation for judges
.project/     Internal project documentation
tests/        Test cases
presentation/ Presentation assets
```

Code should remain within its designated module.

---

# Naming Conventions

## Files

Python

snake_case.py

Examples

```
credit_score.py
feature_engineering.py
risk_analysis.py
```

React Components

PascalCase.jsx

Examples

```
Dashboard.jsx
RiskProfile.jsx
InvestmentCard.jsx
```

Folders

lowercase

```
api
models
services
utils
```

---

# Python Standards

Follow PEP 8.

Use

- type hints
- docstrings
- descriptive variable names

Example

```python
def calculate_credit_score(features: dict) -> float:
    """
    Calculate the user's credit score.
    """
    ...
```

Maximum line length

```
88–100 characters
```

---

# React Standards

- Functional components only
- Hooks instead of class components
- One component per file
- Keep components small

Example

```
Dashboard.jsx
RiskChart.jsx
InvestmentCard.jsx
```

---

# API Standards

All APIs should follow REST conventions.

Example

```
GET /health

POST /credit-score

POST /risk-profile

POST /investment-plan
```

Responses should be JSON.

Use meaningful HTTP status codes.

---

# Git Workflow

Branch naming

```
feature/<name>

bugfix/<name>

docs/<name>

refactor/<name>
```

Examples

```
feature/credit-score-api

feature/react-dashboard

docs/update-api

bugfix/input-validation
```

---

# Commit Message Convention

Format

```
type: short description
```

Examples

```
feat: implement credit scoring endpoint

fix: correct SHAP explanation

docs: update architecture

refactor: simplify preprocessing pipeline

test: add API unit tests

chore: update dependencies
```

---

# Code Reviews

Before committing, verify:

- Code builds successfully.
- No unnecessary files are included.
- Documentation is updated if behavior changed.
- Tests pass.
- No secrets or credentials are committed.

---

# Documentation Rules

Whenever a significant change is made:

Update

- API.md
- ARCHITECTURE.md
- TASKS.md
- DECISIONS.md (if applicable)

Keep documentation synchronized with implementation.

---

# Testing

Every new feature should include tests where practical.

Backend

- Unit tests
- API tests

Frontend

- Component tests (future)

ML

- Model validation
- Pipeline tests

---

# Dependencies

Do not introduce new dependencies without justification.

Prefer widely adopted libraries.

Current stack

Backend

- FastAPI

Frontend

- React
- Vite

Machine Learning

- scikit-learn
- pandas
- NumPy
- SHAP

Database

- SQLite

---

# AI Development Guidelines

AI-generated code must:

- Compile successfully.
- Follow repository conventions.
- Avoid unnecessary complexity.
- Preserve existing project structure.
- Not rewrite unrelated code.
- Keep functions modular and readable.

---

# Definition of Done

A task is complete when:

- Implementation is finished.
- Tests pass.
- Documentation is updated.
- Code follows these standards.
- Changes are committed with a descriptive message.