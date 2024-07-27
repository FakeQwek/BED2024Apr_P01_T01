const DiscussionReport = require("../models/discussionReport");

const getAllDiscussionReports = async (req, res) => {
    try {
        const discussionReports = await DiscussionReport.getAllDiscussionReports();
        res.json(discussionReports);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion reports");
    }
};

const getDiscussionReportById = async (req, res) => {
    const dscRptId = req.params.dscRptId; // Treat as string
    try {
        const discussionReport = await DiscussionReport.getDiscussionReportById(dscRptId);
        if (!discussionReport) {
            return res.status(404).send("Discussion Report not found");
        }
        res.json(discussionReport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion report");
    }
};

const createDiscussionReport = async (req, res) => {
    const newDiscussionReport = req.body;
    try {
        const createdDiscussionReport = await DiscussionReport.createDiscussionReport(newDiscussionReport);
        res.status(201).json(createdDiscussionReport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating discussion report");
    }
};

const warnDiscussionReport = async (req, res) => {
    const dscRptId = req.params.dscRptId; // Treat as string
    try {
        const discussionReport = await DiscussionReport.getDiscussionReportById(dscRptId);
        if (!discussionReport) {
            return res.status(404).send("Discussion Report not found");
        }

        await DiscussionReport.warnDiscussionReport(dscRptId);
        res.status(200).send("Discussion Report warned successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error warning discussion report");
    }
};

const deleteDiscussionReport = async (req, res) => {
    const dscRptId = req.params.dscRptId; // Treat as string
    try {
        console.log(`Attempting to delete discussion report with ID: ${dscRptId}`);
        const discussionReport = await DiscussionReport.getDiscussionReportById(dscRptId);
        
        if (!discussionReport) {
            console.log(`Discussion Report with ID: ${dscRptId} not found`);
            return res.status(404).send("Discussion Report not found");
        }

        await DiscussionReport.deleteDiscussionReport(dscRptId);
        console.log(`Successfully deleted discussion report with ID: ${dscRptId}`);
        res.status(200).send("Discussion Report deleted successfully");
    } catch (error) {
        console.log(`Error deleting discussion report with ID: ${dscRptId}`, error);
        res.status(500).send("Error deleting discussion report");
    }
};

module.exports = {
    getAllDiscussionReports,
    getDiscussionReportById,
    createDiscussionReport,
    warnDiscussionReport,
    deleteDiscussionReport,
};
