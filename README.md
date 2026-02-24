# Horse Management Application

This repository contains a full-stack application for managing horse details. It includes a .NET Core backend API and a React frontend.

## Technologies Used

### Frontend
*   React
*   TypeScript
*   Cypress (for E2E testing)

### Backend
*   ASP.NET Core
*   C#

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
*   [Docker](https://www.docker.com/get-started)
*   [Node.js](https://nodejs.org/en/download/) (which includes npm)
*   [.NET SDK](https://dotnet.microsoft.com/download) (for backend development, though running via Docker is sufficient for local execution)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/brandonp2412/FE-Test-2025.git
    cd FE-Test-2025
    ```

## Running the Application

To run the application locally, follow these steps:

### 1. Start the Backend API (using Docker)

First, pull and run the backend API Docker image. This will make the API available on `http://localhost:3016`.

```bash
docker run -d -p 3016:3016 firstaml/horse-test:latest
```

### 2. Start the Frontend

Navigate to the `frontend` directory, install dependencies, and start the React development server:

```bash
cd frontend
npm install
npm start
```

The frontend application will open in your browser at `http://localhost:3000`.

## Running Tests

### Frontend Tests (Cypress)

To run the Cypress end-to-end tests for the frontend:

1.  Ensure the backend API is running (as described above).
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Run Cypress tests:
    ```bash
    npm run cypress:open
    ```
    This will open the Cypress Test Runner, where you can select and run tests.

