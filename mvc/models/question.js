//Note id is equivalent to name

const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

class Question {
    constructor(questionId, name, email, query) {
        this.questionId = questionId;
        this.name = name;
        this.email = email;
        this.query = query;
        
    }

    static async getAllQuestions() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Question`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Question(row.QuestionId, row.name, row.email, row.query));
    }

    static async getQuestionById(questionId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Question WHERE QuestionID = @questionId`;

        const request = connection.request();
        request.input("questionId", questionId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Question(
                result.recordset[0].QuestionID,
                result.recordset[0].Name,
                result.recordset[0].Email,
                result.recordset[0].Query,
            )
            : null;
    }

    

    static async createQuestion(newQuestionData) {
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `INSERT INTO Question (QuestionID, Name, Email, Query) SELECT MAX(QuestionID) + 1, @name, @email, @query FROM Question;`;

        const request = connection.request();
        request.input('name', newQuestionData.name);
        request.input('email', newQuestionData.email);
        request.input('query', newQuestionData.query);
        const result = await request.query(sqlQuery);

        connection.close();
    }

    

}

module.exports = Question;