# CourseWork Lite Frontend

A clean, modular React/Vite scaffold for the CourseWork Lite application.

## Description

This software provides the frontend rendering for the CourseWork-Lite Application. It provides access to a landing side, login/register capabilities. A central Dashboard (SPA) to view courses, tasks, and perform CRUD operations on these. It also provides account management tools to update email & password for users.

## Getting Started

To get a local copy up and running, follow these steps. Please note that this assumes you are running Linux, commands may be different for Windows.

### Prerequisites

* Node.js (v18 or higher is recommended)
* npm (comes bundled with Node.js)
* A running instance of the [backend server](https://github.com/Kolkenn/CourseWork-Lite/tree/main/backend).

### Installation & Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    * Create a new file in the `frontend` directory named `.env.local`. ( You can make a copy of the ```.env.example``` file and rename it.)
    * Add the following line to this file to connect to your local backend server:
        ```
        VITE_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
        ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:5173`.