# Treento – Backend REST API

This repository contains the backend REST APIs supporting user authentication,
tree visualization and report creation.

## Technologies
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT Authentication

## Implemented Features
- User registration (Sign up)
- User authentication (Login with JWT)
- Public retrieval of trees data
- Creation of reports by authenticated users

## API Endpoints

### Authentication
- POST /auth/signup  
- POST /auth/login  

### Trees
- GET /trees  
  - Optional query parameter: `limit`

### Reports
- POST /reports  
  - Protected endpoint (JWT required)

## Authentication
Protected endpoints require a valid JWT token sent in the HTTP header:


Authorization: Bearer <JWT_TOKEN>

## Run the project locally

1. Install dependencies:

npm install

2. Create a `.env` file with the following variables:

PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

3. Start the server:

npm start

The server will run on `http://localhost:3000`.

## Testing
API endpoints were tested using Postman following black-box testing principles.
