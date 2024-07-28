//Question model contains crud operations to manipulate data for questions asked in contact us page

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

    //Posts question data to the local database
    static async createQuestion(newQuestionData) {
        const connection = await sql.connect(dbConfig);
        //Question id will always be 1 up from the max question id
        const sqlQuery = `INSERT INTO Question (QuestionID, Name, Email, Query) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(QuestionID) + 1 END, @name, @email, @query FROM Question;`;

        const request = connection.request();
        request.input('name', newQuestionData.name);
        request.input('email', newQuestionData.email);
        request.input('query', newQuestionData.query);
        const result = await request.query(sqlQuery);

        connection.close();
    }

    

}

module.exports = Question;