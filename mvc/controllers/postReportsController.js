const PostReport = require("../models/postReport");

const getAllPostReports = async (req, res) => {
    try {
        const postReports = await PostReport.getAllPostReports();
        res.json(postReports);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post reports");
    }
};



const getPostReportById = async (req, res) => {
    const postRptId = parseInt(req.params.postRptId);
    try {
        const postReport = await PostReport.getPostReportById(postRptId);
        if (!postReport) {
            return res.status(404).send("Post report not found");
        }
        res.json(postReport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post report");
    }
};

const createPostReport = async (req, res) => {
    const newPostReport = req.body;
    try {
        const createdPostReport = await PostReport.createPostReport(newPostReport);
        res.status(201).json(createdPostReport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating post report");
    }
};

module.exports = {
    getAllPostReports,
    getPostReportById,
    createPostReport
};