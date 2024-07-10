const Question = require("../models/question");

const getAllQuestions = async (req, res) => {
    try {
        const question = await Question.getAllQuestions();
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(404).send("Error retrieving question");
    }
};

const getQuestionById = async (req, res) => {
    const questionId = parseInt(req.params.questionId);
    try {
        const question = await Question.getQuestionById(questionId);
        if (!question) {
            return res.status(404).send("Question not found");
        }
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(404).send("Error retrieving question");
    }
};



const createQuestion = async (req, res) => {
    const newQuestion = req.body;
   
    try {
        const createdQuestion = await Question.createQuestion(newQuestion);
        res.status(201).json(createdQuestion);
    } catch (error) {
        console.log(error);
        res.status(404).send("Error creating question");
    }
}
module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion
};

