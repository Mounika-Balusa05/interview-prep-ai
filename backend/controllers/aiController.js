const { GoogleGenerativeAI } = require("@google/generative-ai");
const { conceptExplainPrompt, questionAnswerPrompt, evaluateAnswerPrompt } = require("../utils/prompts"); // ← add evaluateAnswerPrompt

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let rawText = response.text();
        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
};

const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const prompt = conceptExplainPrompt(question);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let rawText = response.text();
        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate explanation", error: error.message });
    }
};

// ← NEW
const evaluateAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const prompt = evaluateAnswerPrompt(question, answer);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let rawText = response.text();
        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to evaluate answer", error: error.message });
    }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation, evaluateAnswer }; // ← add evaluateAnswer