# CourseWork Lite Frontend

A clean, modular React/Vite scaffold for the CourseWork Lite application.

---

## 📁 Folder Structure
frontend/
├── public/ # Static assets & index.html
├── src/
│ ├── api/ # Axios wrappers for talking to the FastAPI backend
│ ├── components/ # Shared UI pieces (Navbar, etc.)
│ ├── pages/ # Route‑level components (Login, Register, Dashboard…)
│ ├── styles/ # One CSS file per page/component
│ ├── App.jsx # Main router & layout
│ └── main.jsx # ReactDOM entrypoint
├── .env # (optional) override VITE_API_BASE_URL
├── package.json
└── README.md # (this file)

## 🛠 Work By: Ehab Kayyali

As the Infrastructure, Deployment, and Testing Support lead, I:

- Created the initial scaffold with React + Vite
- Set up routing using React Router (Login, Register, Dashboard, Courses, Profile, Tasks)
- Verified all routing and UI page transitions
- Configured frontend hosting via Vercel
- Ensured working build for team push
- Confirmed that all current pages render correctly

✅ **Register is working.**
🚫 **Login does not yet authenticate — backend connection needed.**

⚠️ UI is currently functional but unstyled (design/layout pass pending).

---

## Quick Start

1. **Install Dependencies**  
   ```bash
   cd frontend
   npm install

2. **Run Dev Server**
    npm run dev
Open your browser at http://localhost:5173

3. **Build For Production**
    npm run build
Outputs static files to dist/