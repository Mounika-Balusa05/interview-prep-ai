require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const {generateInterviewQuestions, generateConceptExplanation, evaluateAnswer} = require("./controllers/aiController");

const app = express();

app.use(
    cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
})
);

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/questions',questionRoutes);

app.post('/api/ai/generate-questions' , protect, generateInterviewQuestions);
app.post('/api/ai/generate-explanation',protect,generateConceptExplanation);
app.post('/api/ai/evaluate-answer', protect, evaluateAnswer); // ← add this
// app.use("/api/questions", protect, questionRoutes);
// app.use("/api/sessions", protect, sessionRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));