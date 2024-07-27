const sql = require("mssql");
const dbConfig = require("../../dbConfig");

const createFeedback = async (req, res) => {
    const { username, rating, feedback } = req.body;

    if (!username || !rating || !feedback) {
        return res.status(400).send({ success: false, message: 'All fields are required' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const accountCheck = await pool.request()
            .input('Username', sql.VarChar, username)
            .query('SELECT * FROM Account WHERE AccName = @Username');

        if (accountCheck.recordset.length === 0) {
            return res.status(404).send({ success: false, message: 'Username not found in Account table' });
        }

        await pool.request()
            .input('Username', sql.VarChar, username)
            .input('RatingStar', sql.Int, rating)
            .input('FeedbackDescription', sql.VarChar, feedback)
            .query(`INSERT INTO Feedback (Username, RatingStar, FeedbackDescription) 
                    VALUES (@Username, @RatingStar, @FeedbackDescription)`);

        res.status(201).send({ success: true, message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Database insertion error:', err);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};

const getFeedback = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Feedback');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Database retrieval error:', err);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};

const updateFeedback = async (req, res) => {
    const { feedbackID } = req.params;
    const { rating, feedback } = req.body;

    if (!feedbackID || !rating || !feedback) {
        return res.status(400).send({ success: false, message: 'All fields are required' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('FeedbackID', sql.Int, feedbackID)
            .input('RatingStar', sql.Int, rating)
            .input('FeedbackDescription', sql.VarChar, feedback)
            .query(`UPDATE Feedback 
                    SET RatingStar = @RatingStar, FeedbackDescription = @FeedbackDescription
                    WHERE FeedbackID = @FeedbackID`);

        res.status(200).send({ success: true, message: 'Feedback updated successfully' });
    } catch (err) {
        console.error('Database update error:', err);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};

const deleteFeedback = async (req, res) => {
    const { feedbackID } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('FeedbackID', sql.Int, feedbackID)
            .query('DELETE FROM Feedback WHERE FeedbackID = @FeedbackID');
        
        res.status(200).send({ success: true, message: 'Feedback deleted successfully' });
    } catch (err) {
        console.error('Database deletion error:', err);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createFeedback,
    getFeedback,
    updateFeedback,
    deleteFeedback
};
