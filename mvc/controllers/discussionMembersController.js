const DiscussionMember = require("../models/discussionMember");

const getAllDiscussionMembers = async (req, res) => {
    try {
        const discussionMembers = await DiscussionMember.getAllDiscussionMembers();
        res.json(discussionMembers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion member");
    }
};

const createDiscussionMember = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;

    try {
        const createdDiscussionMember = await DiscussionMember.createDiscussionMember(accName, dscName);
        res.status(201).send(createDiscussionMember);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating discussion Member");
    }
}

module.exports = {
    getAllDiscussionMembers,
    createDiscussionMember,
}