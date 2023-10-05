# CLLeMens Project

This web project utilizes Django for the backend and React for the frontend.

## Prerequisites

- Python 3.10.13
- Node.js 18.18.0 and npm 9.8.1

## Installation and Setup

Clone the repository and navigate to the project directory.

### Backend Setup (CLLeMensWebServer)

1. Navigate to the `CLLeMensWebServer` directory:
    ```bash
    cd CLLeMensWebServer
    ```

2. Django is the only required package for the backend. Start the Django server:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup (CLLeMensWebClient)

1. Open a new terminal and navigate to the `CLLeMensWebClient` directory:
    ```bash
    cd CLLeMensWebClient
    ```

2. Install npm packages:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm run dev
    ```

Both servers should now be running. Open your web browser and navigate to the respective URLs to use the application.

- The backend server runs on port 8000.
- The frontend server runs on port 3000.
