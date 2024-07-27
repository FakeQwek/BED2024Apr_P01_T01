//Question controller returns question json responses and logs internal server error if unsuccessful
const Question = require("../models/question");

const getAllQuestions = async (req, res) => {
    try {
        const question = await Question.getAllQuestions();
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving question");
    }
};

const getQuestionById = async (req, res) => {
    const questionId = parseInt(req.params.questionId);
    try {
        const question = await Question.getQuestionById(questionId);
        res.json(question);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving question");
    }
};



const createQuestion = async (req, res) => {
    const newQuestion = req.body;
   
    try {
        const createdQuestion = await Question.createQuestion(newQuestion);
        if (!createdQuestion) {
            return res.status(404).send("Question not found");
        }
        res.status(204).json(createdQuestion);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating question");
    }
}
module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion
};

