frontend link :  https://interview-prep-ai-topaz.vercel.app/login
backend link : https://interview-prep-ai-dg2z.onrender.com

# 🎯 CrucibleAI

> An AI-powered interview preparation platform that helps students and job seekers practice smarter and get hired faster.

---

## 📌 About The Project

As a final year Computer Science student actively looking for internship opportunities, I realized that most interview preparation tools are either too expensive, too generic, or don't give real feedback.

So I built **Interview Prep AI** — a full-stack web application that:
- 🤖 **AI Question Generator** — Generates 5, 10, or 15 custom interview questions based on your job role, experience level, and topics using Google Gemini API — you choose the number!
- Lets you **study answers** with AI explanations
- Simulates a **real mock interview** with a timer and voice support
- **Scores your answers** using AI and gives constructive feedback

This project helped me learn full-stack development, REST APIs, AI integration, authentication, and cloud deployment — all in one real-world project.

---

## 📸 Screenshots

### 🏠 Dashboard
<!-- Add your dashboard screenshot here -->
![Dashboard](./screenshots/dashboard.png)

### 📚 Session Page — Questions & Answers
<!-- Add your session page screenshot here -->
![Session Page](./screenshots/session.png)

### 🎯 Mock Interview & Score Report
<!-- Add your mock interview screenshot here -->
![Mock Interview](./screenshots/mock-interview.png)

---

## ✨ Features

- 🤖 **AI Question Generator** — Generates custom interview questions based on your job role, experience level, and topics using Google Gemini API
- 📚 **Study Mode** — Read AI-generated questions and detailed answers
- ✨ **AI Explanations** — Get beginner-friendly explanations for any question
- 🎯 **Mock Interview Mode** — Timed mock interview with one question at a time
- 🎙️ **Voice Support** — Questions are read aloud and you can speak your answers
- 📊 **AI Scoring & Feedback** — Each answer is scored out of 10 with detailed feedback
- 📌 **Pin & Organize** — Pin important sessions and questions to the top
- 🔐 **Secure Authentication** — JWT-based login and registration

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — UI development
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **React Router** — Page navigation
- **React Markdown** — Render formatted answers
- **Web Speech API** — Voice input and output (built into browser)

### Backend
- **Node.js & Express.js** — Server and REST API
- **MongoDB & Mongoose** — Database
- **JWT (JSON Web Token)** — Authentication
- **Bcrypt.js** — Password hashing
- **Google Gemini API** — AI question generation, explanations, and answer evaluation

### Deployment
- **Vercel** — Frontend hosting
- **Render** — Backend hosting
- **MongoDB Atlas** — Cloud database

---

## 🚀 Live Demo

🌐 **App:** [https://interview-prep-ai-topaz.vercel.app](https://interview-prep-ai-topaz.vercel.app)  
⚙️ **Backend:** [https://interview-prep-ai-dg2z.onrender.com](https://interview-prep-ai-dg2z.onrender.com)

---

## 🗂️ Project Structure & Explanation

```
ai-interview-prep/
│
├── backend/                        # Node.js + Express server
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   │
│   ├── controllers/                # Business logic
│   │   ├── aiController.js         # Handles Gemini AI API calls
│   │   ├── authController.js       # Register, login, get profile
│   │   ├── questionController.js   # Pin/unpin questions
│   │   └── sessionController.js   # Create, get, delete sessions
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js       # JWT token verification
│   │   └── uploadMiddleware.js     # Profile image upload handler
│   │
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js                 # User model (name, email, password)
│   │   ├── Session.js              # Session model (role, questions)
│   │   └── Question.js             # Question model (question, answer, isPinned)
│   │
│   ├── routes/                     # API route definitions
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── sessionRoutes.js        # /api/sessions routes
│   │   └── questionRoutes.js       # /api/questions routes
│   │
│   ├── utils/
│   │   └── prompts.js              # Gemini AI prompt templates
│   │
│   └── server.js                   # Main server entry point
│
└── frontend/                       # React.js app
    ├── src/
    │   ├── Context/
    │   │   └── userContext.jsx      # Global user state management
    │   │
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx        # Login page
    │   │   │   └── SignUp.jsx       # Sign up page
    │   │   │
    │   │   ├── Home/
    │   │   │   └── Dashboard.jsx    # Main dashboard with prep kits
    │   │   │
    │   │   └── InterviewPrep/
    │   │       ├── LandingPage.jsx  # Session page with Q&A
    │   │       └── MockInterview.jsx # Mock interview + score report
    │   │
    │   └── App.jsx                  # Routes configuration
    │
    └── vercel.json                  # Vercel routing config for React
```

---

## ⚙️ How It Works

```
1. User signs up / logs in
        ↓
2. Creates a Prep Kit (role + experience + topics)
        ↓
3. Gemini AI generates custom questions & answers
        ↓
4. User studies questions, answers & AI explanations
        ↓
5. User clicks "Start Mock Interview" on dashboard
        ↓
6. One question at a time with 2-minute timer
   Voice reads the question aloud
   User types or speaks their answer
        ↓
7. AI evaluates all answers → gives score & feedback
        ↓
8. Final report shows total score and improvement tips
```

---

## 🏃 Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/Mounika-Balusa05/interview-prep-ai.git
cd interview-prep-ai
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env` in backend folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=8000
```

```bash
npm start
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `.env` in frontend folder:
```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## 👩‍💻 Author

**Mounika Balusa**  
4th Year Computer Science Student  
Passionate about Full Stack Development & AI Integration

---

⭐ If you liked this project, give it a star on GitHub!
