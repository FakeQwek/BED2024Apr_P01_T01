//PostReport controller returns post report responses and logs internal server error if unsuccessful

const PostReport = require("../models/siteadmin-postReport");

const getAllPostReports = async (req, res) => {
    try {
        const postreport = await PostReport.getAllPostReports();
        res.json(postreport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post reports");
    }
};


//Report id is taken in as the parameter
const deletePostReport = async (req, res) => {
    const reportId = parseInt(req.params.reportId);
    try {
        const success = await PostReport.deletePostReport(reportId);
        //Unsuccessful request will return 404
        if (!success) {
            return res.status(404).send("Post report not found")
        }
        res.status(204).send("Success");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting report");
    }
};

//Post id is taken in as parameter
const denyPost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const success = await PostReport.denyPost(postId);
        //Unsuccessful request will return 404
        if (!success) {
            return res.status(404).send("Post report not found")
        }
        res.status(204).send("Success");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error denying post");
    }
};

const getAllPostReportsByNewest = async (req, res) => {
    try {
        const postreport = await PostReport.getAllPostReportsByNewest();
        res.json(postreport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post reports");
    }
};

const getAllCountOfPostReports = async (req, res) => {
    try {
        const postreport = await PostReport.getAllCountOfPostReports();
        res.json(postreport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post reports");
    }
};

//Post id is taken in as the parameter
const getPostReportById = async (req,res) => {
    const postId = parseInt(req.params.postId);
    try {
        const postreport = await PostReport.getPostReportById(postId);
        if (!postreport) {
            return res.status(404).send("Post report not found")
        }
      
        res.json(postreport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving post report");
    }
};





module.exports = {
    getAllPostReports,
    deletePostReport,
    denyPost,
    getAllPostReportsByNewest,
    getAllCountOfPostReports,
    getPostReportById
};