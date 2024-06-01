const Discussion = require("../models/discussion");

const getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.getAllDiscussions();
        res.json(discussions);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussions");
    }
};

const getDiscussionById = async (req, res) => {
    const dscId = parseInt(req.params.dscId);
    try {
        const discussion = await Discussion.getDiscussionById(dscId);
        if (!discussion) {
            return res.status(404).send("Discussion not found");
        }
        res.json(discussion);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion");
    }
};

module.exports = {
    getAllDiscussions,
    getDiscussionById,
};