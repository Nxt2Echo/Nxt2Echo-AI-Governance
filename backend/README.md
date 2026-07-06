# Nxt2Echo Backend

A complete production-ready backend built with Express.js, TypeScript, Firebase, and Gemini AI integration.

## Architecture & Tech Stack

- **Node.js & Express.js**
- **TypeScript**
- **Firebase Authentication & Firestore & Storage**
- **Google Gemini API**
- **MVC Architecture**

## Prerequisites

- Node.js (v18+ recommended)
- Firebase Project with Firestore and Storage enabled
- Google Gemini API Key

## Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and fill in your details:
   - `JWT_SECRET`: A secure random string
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_CLIENT_EMAIL`: Found in Firebase Admin SDK service account JSON
   - `FIREBASE_PRIVATE_KEY`: Found in Firebase Admin SDK service account JSON
   - `GEMINI_API_KEY`: Your Google Gemini API key

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints & Functions

The backend exposes several RESTful endpoints. Here are the core functionalities:

### 1. Authentication (`/api/auth`)

- **POST `/api/auth/register`**: Registers a new user. Expects `email`, `password`, `name`, and `role` (e.g., Citizen, Admin).
- **POST `/api/auth/login`**: Authenticates a user using their Firebase `uid` and returns a JWT token.

### 2. Complaints Management (`/api/complaints`)

_Note: All complaint routes require JWT authentication (`Bearer <token>`)._

- **POST `/api/complaints/`**: Creates a new complaint. Supports `multipart/form-data` for file uploads (max 1 `image` and 1 `voice` note). Expects `title`, `description`, `category`, `severity`, `latitude`, `longitude`, `ward`, and `address`.
- **GET `/api/complaints/`**: Retrieves a list of complaints.
- **GET `/api/complaints/dashboard/stats`**: Admin route. Retrieves aggregated statistics of complaints (by status, category, ward).
- **GET `/api/complaints/heatmap`**: Retrieves coordinate and priority weight data for Google Maps Heatmap layer.
- **GET `/api/complaints/:id`**: Retrieves details of a specific complaint by ID.
- **PUT `/api/complaints/:id`**: Updates an existing complaint. Restricted to the user who created it (Citizen) or an Admin.
- **DELETE `/api/complaints/:id`**: Deletes a complaint. Restricted to Admin role only.
- **POST `/api/complaints/analyze`**: Admin utility route to analyze a complaint using Gemini AI.

### 3. Gemini AI Integration (`/api/gemini`)

- **POST `/api/gemini/chat`**: Initiates a chat request with the Gemini AI model. Expects a JSON body with a `prompt`.
- **GET `/api/gemini/chat`**: Alternative GET endpoint for Gemini AI chat.

## API Documentation

Once the server is running, you can access the Swagger UI documentation at:
`http://localhost:5000/api-docs`

## Postman Collection

Import `postman_collection.json` into Postman to test the APIs quickly.
