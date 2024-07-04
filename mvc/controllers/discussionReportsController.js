const DiscussionReport = require("../models/discussionReport");
const { getPostById } = require("../models/post");

const getAllDiscussionReports = async(req, res) => {
    try {
        const discussionReports = await DiscussionReport.getAllDiscussionReports();
        res.json(discussionReports);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion reports");
    }
};

const getDiscussionReportById = async (req, res) => {
    const dscRptId = parseInt(req.params.dscRptId);
    try {
        const discussionReport = DiscussionReport.getDiscussionReportById(dscRptId);
        if (!discussionReport) {
            return res.status(404).send("Discussion Report not found");
        } res.json(discussionReport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion report");
    }
};

const createDiscussionReport = async (req, res) => {
    const newDiscussionReport = req.body;
    try {
        const createdDiscussionReport = await DiscussionReport.createDiscussionReport(newDiscussionReport);
        res.status(201).json(createDiscussionReport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating discussion report");
    }
};

module.exports = {
    getAllDiscussionReports,
    getDiscussionReportById,
    createDiscussionReport,
};