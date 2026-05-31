const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
    You are an AI trained to generate technical interview questions and answers.
    
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience}
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a concise, clear answer (max 80 words).
    - Only include a code example if absolutely necessary, keep it short.
    - No long paragraphs. Use simple bullet points if needed.
    - Return a pure JSON array like:
    [
        {
          "question": "Question here?",
          "answer": "Answer here."
        }
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
`)

const conceptExplainPrompt = (question) => (`
    You are an AI trained to explain interview questions simply and clearly.
    
    Task:
    - Question: "${question}"
    - Give a beginner-friendly explanation in max 120 words.
    - Provide a short title summarizing the concept.
    - Only include a code example if absolutely necessary, keep it under 5 lines.
    - Use simple language. No essays.
    - Return valid JSON:
    {
        "title": "Short title here",
        "explanation": "Explanation here."
    }
    Important: Do NOT add any extra text outside the JSON. Only return valid JSON.
`)

const evaluateAnswerPrompt = (question, answer) => (`
    You are an expert interview evaluator.
    
    Question: "${question}"
    Candidate's Answer: "${answer}"
    
    Evaluate the answer and return:
    - score: a number from 1 to 10
    - feedback: 2 sentences max, constructive and clear
    
    Return only valid JSON:
    {
        "score": 7,
        "feedback": "Good understanding shown. Could mention X for a stronger answer."
    }
    Important: Only return valid JSON. No extra text.
`)

module.exports = { questionAnswerPrompt, conceptExplainPrompt, evaluateAnswerPrompt }; // ← add evaluateAnswerPrompt

