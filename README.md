# CourseWork Lite 📚

CourseWork Lite is a web application designed to help students efficiently manage their academic tasks. It aims to solve the common challenge of managing multiple courses and deadlines by providing a centralized, user-friendly platform that streamlines the organization of academic workloads.

## Key Features

  * **User Management:** Secure user registration, login, logout, and password management capabilities.
  * **Course Management:** Users can create, view, edit, and delete their academic courses, each with an optional color tag.
  * **Task Management:** Create detailed tasks with fields for a due date, associated course, priority, and description.
  * **Intuitive Views & Filtering:** View all active tasks in a central dashboard and sort them by due date, priority, or course.
  * **Task Archiving:** Mark tasks as complete, which automatically moves them to an archive to keep the main view focused on active items.
  * **Basic Reminders:** The system delivers in-app reminders for tasks that are due within 24 hours or are past their due date.

## Technology Stack

The application is built with a modern technology stack using a layered architecture.

  * **Frontend:** React.js (Single-Page Application)
  * **Backend:** Python (RESTful API)
  * **Database:** MongoDB Atlas
  * **Data Access:** Mongoose
  * **Deployment:**
      * **Frontend:** Vercel / Netlify
      * **Backend:** Render / Heroku

## Getting Started

To get a local copy up and running, follow these steps. Please note that this assumes you are running Linux, commands may be different for Windows.

### Prerequisites

  * Python (3.10+)
  * uv (install from [Astral's official site](https://github.com/astral-sh/uv))

### Installation & Setup

#### **Backend (Python)**

1.  **Clone the repository:**
    ```
    git clone https://github.com/SlyyJavii/CourseWork-Lite/tree/develop
    ```

2.  **Navigate to the backend directory:**
    ```
    cd backend
    ```

3.  **Create a virtual environment with `uv`:**

    ```
    uv venv
    ```

    This creates a virtual environment in a `.venv` folder.
    Activate it by running
    ```
    source .venv/bin/activate
    ```

4.  **Install dependencies using `uv`:**

    ```
    uv sync
    ```

5.  **Set up environment variables:**

      * Create a `.env` file in the backend root by copying the `.env.example` file.
      * Add your `MONGO_URI` and a secure `JWT_SECRET_KEY`.
      * I used [JWTSecrets](https://jwtsecrets.com/#generator) to generate a token.

6.  **Run the backend server:**

    ```sh
    uv run uvicorn main:app --reload
    ```

## Project Team

This project was developed by a dedicated team of five students for the CEN 4010 Software Engineering I course.

  * **Leonel Ponce:** Project Manager & Full Stack Developer
  * **Ehab Kayyali:** Infrastructure, Deployment, & Testing Support
  * **Anelys Izquierdo:** Frontend Developer (UI Elements)
  * **Hazel Hernandez:** Frontend Developer (Views, Filters, & Reminders)
  * **Javier Brasil:** Backend Developer & System Integration Testing


## Technology Stack

The application is built with a modern technology stack using a layered architecture.

  * **Backend:** Python / FastAPI
  * **Frontend:** React.js
  * **Database:** MongoDB Atlas
  * **Package Management:** uv (Python) / npm (Node.js)
  * **Deployment:**
      * **Frontend:** Vercel / Netlify
      * **Backend:** Render / Heroku
