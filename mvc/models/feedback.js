const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Feedback {
    constructor(feedbackID, username, ratingStar, feedbackDescription) {
        this.feedbackID = feedbackID;
        this.username = username;
        this.ratingStar = ratingStar;
        this.feedbackDescription = feedbackDescription;
    }

    static async getAllFeedback() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(row => new Feedback(
            row.FeedbackID,
            row.Username,
            row.RatingStar,
            row.FeedbackDescription
        ));
    }
}

module.exports = Feedback;
