# CourseWork Lite Backend

This repository contains the backend source code for CourseWork-Lite, a lightweight application for managing coursework and related academic activities.

## Description

This software provides server-side login and API endpoints for the CourseWork-Lite application. It handles user authentication, data storage and business logic for managing courses and tasks. This backend is built using Python and open source libraries such as [uvicorn](https://www.uvicorn.org/) and [FastAPI](https://fastapi.tiangolo.com/).

## Getting Started

To get a local copy up and running, follow these steps. Please note that this assumes you are running Linux, commands may be different for Windows.

### Prerequisites

  * Python (3.10+)
  * uv (install from [Astral's official site](https://github.com/astral-sh/uv))

### Installation & Setup

#### **Backend (Python)**

1.  **Clone the repository:**
    ```
    git clone https://github.com/SlyyJavii/CourseWork-Lite/tree/main
    ```

2.  **Navigate to the backend directory:**
    ```
    cd backend
    ```

4.  **Install dependencies using `uv` & Create the VENV:**

    ```
    uv sync
    ```

    This creates a virtual environment in a `.venv` folder.
    Activate it by running
    ```
    source .venv/bin/activate
    ```

5.  **Set up environment variables:**

      * Create a `.env` file in the backend root by copying the `.env.example` file.
      * Add your `MONGO_URI`, a secure `JWT_SECRET_KEY`, the `MONGO_DB_NAME`, and adjust your `CORS_ORIGINS` if needed.
        * Please note that this project was design for MongoDB Atlas in mind so there are no instructions for Local MongoDB. If you wish to use that please follow those instructions.
        * If testing locally, utilize the CORS_ORIGINS value in the ```.env.example```.
        * The JWT Key can be generated here: [JWTSecrets](https://jwtsecrets.com/#generator)

6.  **Run the backend server:**

    ```sh
    uv run uvicorn main:app
    ```