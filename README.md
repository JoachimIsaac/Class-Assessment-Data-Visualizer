# Class Assessment Data Visualizer

Visualize student learning objective (SLO) assessment results over time. The frontend renders interactive plots (D3) and supports adding/editing assessment entries. The backend is a FastAPI service backed by a local `TinyDB` JSON file.

## What this app does

- **Plot assessment trends** across academic terms (e.g. `17-18`, `18-19`, …).
- **Compare targets** (Target 1 / Target 2) and see percentage-met over time.
- **Input / edit results** for a given SLO + measure + target + term.

## Tech stack

- **Frontend**: Vite, Vanilla JS, D3, SCSS, Bootstrap (CDN)
- **Backend**: Python, FastAPI, Uvicorn, TinyDB
- **Data**: `visualization-practice-api/visualization-practice-api-act/db.json` (TinyDB)

## Repo layout

```text
.
├─ visualization-frontend/
│  └─ Visualzation-of-Assessment-Data-SWE-V2-main/   # Vite frontend
├─ visualization-practice-api/
│  └─ visualization-practice-api-act/               # FastAPI backend + TinyDB json
├─ start-services.ps1                               # Start backend + frontend (Windows)
└─ start-services.bat                               # Start backend + frontend (Windows)
```

## Prerequisites

- **Node.js**: 18+ recommended
- **Python**: 3.9+ recommended

## Quickstart (run both locally)

### Windows (PowerShell)

From the repo root:

```powershell
.\start-services.ps1
```

### Windows (cmd)

From the repo root:

```bat
start-services.bat
```

This starts:

- **Backend API**: `http://localhost:8000`
- **Frontend dev server**: Vite prints the URL (usually `http://localhost:5173`)

## Run backend (FastAPI) only

```powershell
cd .\visualization-practice-api\visualization-practice-api-act
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend files of interest:

- **API implementation**: `visualization-practice-api/visualization-practice-api-act/main.py`
- **Database file**: `visualization-practice-api/visualization-practice-api-act/db.json`

## Run frontend (Vite) only

```powershell
cd .\visualization-frontend\Visualzation-of-Assessment-Data-SWE-V2-main
npm install
npm run dev
```

### Important: frontend API base URL

Right now the frontend **hard-codes** the deployed API base URL:

- `https://class-assessment-data-visualizer.onrender.com`

If you want the frontend to use your **local** backend (`http://localhost:8000`), update the hard-coded URLs in these files:

- `visualization-frontend/Visualzation-of-Assessment-Data-SWE-V2-main/js/plotModal.js`
- `visualization-frontend/Visualzation-of-Assessment-Data-SWE-V2-main/js/plotting.js`
- `visualization-frontend/Visualzation-of-Assessment-Data-SWE-V2-main/js/inputModal.js`
- `visualization-frontend/Visualzation-of-Assessment-Data-SWE-V2-main/js/inputting.js`

Quick approach:

- Replace `https://class-assessment-data-visualizer.onrender.com` with `http://localhost:8000`

The backend already allows CORS from anywhere (`'*'`), so local frontend ↔ local backend works once the base URL matches.

## Tests (frontend)

```powershell
cd .\visualization-frontend\Visualzation-of-Assessment-Data-SWE-V2-main
npm run test
```

## Backend API (summary)

Base URL (local): `http://localhost:8000`

- **GET** `/slo/all`: list SLO keys
- **GET** `/slo/description/{slo}`: SLO description
- **GET** `/measure/{slo}`: list measures for an SLO
- **GET** `/measure/description/{slo}/{measure}`: measure description
- **GET** `/dates/{slo}/{measure}`: list available academic terms for an SLO/measure
- **GET** `/startdate/{slo}/{measure}?start={term}`: terms from `start` onward
- **GET** `/targets/{slo}/{measure}`: available targets (e.g. `T1`, `T2`)
- **GET** `/target/T2/exist/{slo}/{measure}`: whether `T2` exists for that SLO/measure
- **GET** `/plot?slo={S1}&measure={M1}&start_date={17-18}&end_date={21-22}`: plot payload (dates, values, % met, legend text, title)
- **POST** `/input/{slo}/{measure}/{target}/{date}`: add a new entry for a term (fails if that date already exists)
- **PUT** `/edit/{slo}/{measure}/{target}/{date}`: edit an existing entry

### Request body (POST/PUT)

The backend expects JSON shaped like:

```json
{
  "target": 50,
  "num_student": 26,
  "num_student_met": 15,
  "percentage": 58,
  "description": "Group avg > 50%"
}
```

## Data model (TinyDB)

All assessment data is stored in `db.json`. At a high level it’s nested like:

`SLO → Measure → Target (T1/T2) → Term (e.g. 17-18) → { target, percentage, description, ... }`

## Troubleshooting

- **Backend won’t start / missing deps**: run `python -m pip install -r requirements.txt` inside `visualization-practice-api/visualization-practice-api-act`.
- **Frontend runs but plots don’t load locally**: make sure the frontend is pointing at `http://localhost:8000` (see “frontend API base URL”).
- **Port already in use**:
  - backend: change `--port 8000`
  - frontend: Vite will pick another port automatically, or run `npm run dev -- --port 5173`

