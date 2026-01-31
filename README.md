# Treento – REST API

This repository contains the backend REST APIs for the **Treento** project and a minimal frontend demo used for demonstration purposes.  
The application focuses on urban green space management.

The system exposes RESTful services for:
  - tree data consultation,
  - report creation and management,
  - tree adoption requests.

Authentication and authorization are handled via JWT tokens.

---

## Technologies

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Token)

### Frontend
- HTML5/CSS
- JavaScript (ES6)
- Leaflet.js
- OpenStreetMap

### Tools & Deploy
- Apiary
- Postman
- Git & GitHub
- Render
- npm

---

## Implemented Features
- User registration (Sign up)
- User authentication (Login with JWT)
- Role-based authorization (user / admin)
- Public retrieval of trees data
- Tree detail retrieval
- Import and management of a real tree dataset
- Creation of reports by authenticated users
- Administrative management of reports
- Tree adoption requests and management
- Minimal frontend demo with interactive map

---

## API Endpoints

### Authentication
- POST /auth/signup  
- POST /auth/login  
- GET /auth/me (protected, debug endpoint)

### Trees
- GET /trees  
  - Optional query parameter: `limit`
- GET /trees/:id

### Reports
- POST /reports (protected)
- GET /reports/me (protected)
- GET /reports (admin only)
- PATCH /reports/:id/status (admin only)

### Adoptions
- POST /adoptions (protected)
- GET /adoptions/me (protected)
- GET /adoptions (admin only)
- PATCH /adoptions/:id/status (admin only)

---

## Authentication
Protected endpoints require a valid JWT token sent in the HTTP header:

```
Authorization: Bearer <JWT_TOKEN>
```
Admin endpoints additionally require the authenticated user to have admin privileges.

---

## Dataset Import (Database Population)

The project includes a dedicated script `importTreesCsv.js` to populate the database with a real dataset of trees.

### Import command
```bash
npm run import:trees
```

What the script does:
  - reads tree data from CSV file,
  - normalizes dataset headers,
  - converts GIS coordinates (DMS → decimal),
  - populates the MongoDB database with tree documents.

This step is required when running the project locally to correctly visualize tree data and the interactive map.

### Dataset

The `data/` folder contains:
- the original public dataset in Excel format (for reference),
- a preprocessed CSV file used to populate the database.

The dataset comes from public open data sources and is included for educational and reproducibility purposes.

### Legacy seed script

During the early development phase, a simple seed script (`seedTrees.js`) was used to populate the database with a small set of sample tree data for testing purposes.

This script is no longer used in the final version of the project, as it has been
superseded by the CSV-based dataset import (`importTreesCsv.js`), which allows the
use of a real public dataset and better reflects a production-like scenario.

The file has been kept in the repository for completeness and traceability of the development process.

---

## Frontend Demo

A minimal frontend demo is included in the `static/` folder to demonstrate:
  - authentication flow,
  - tree listing and detail view,
  - interactive map visualization (Leaflet),
  - report creation,
  - adoption request workflow.

The frontend communicates with the backend exclusively via REST APIs and is intended for demonstration purposes.

---

## Deployment

The application is deployed on Render and is accessible at:

https://treento.onrender.com

The deployed version includes:
  - backend REST APIs,
  - static frontend demo,
  - populated database with a real tree dataset.

---

## Run the project locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
ADMIN_EMAIL=<admin_email_used_for_initial_setup>
```
3. Populate the database:
```bash
npm run import:trees
```
4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`.

## API Documentation

The complete API documentation is available on Apiary, following the API Blueprint specification.

### Testing
API endpoints were tested using Postman following black-box testing principles and verifying:
  - correct behavior of REST endpoints,
  - authentication and authorization constraints,
  - error handling for invalid requests.

---

## Project Structure

```
treento/
│
├── apiary/                   # API documentation
│   └── apiary.apib
│
├── data/                     # Public dataset
│   ├── alberi_monumentali.xls
│   └── trees_trento.csv
│
├── src/
│   ├── models/               # Mongoose schemas
│   │   ├── Adoption.js
│   │   ├── Report.js
│   │   ├── Tree.js
│   │   └── User.js
│   ├── routes/               # REST API routes
│   │   ├── adoptions.js
│   │   ├── auth.js
│   │   ├── reports.js
│   │   └── trees.js
│   ├── middleware/           # Authentication & authorization
│   │   ├── admin.js
│   │   └── auth.js   
│   ├── app.js                # Express application setup        
│   ├── importTreesCsv.js     # CSV dataset import script (used in final version)
│   └── seedTrees.js          # Legacy seed script (used in early development)
│
├── static/                   # Frontend demo (HTML + JS)
│   ├── index.html
│   └── script.js
│
├── .gitignore
├── LICENSE
├── README.md
├── package-lock.json
└── package.json
```
