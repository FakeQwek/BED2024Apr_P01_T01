const DiscussionMember = require("../models/discussionMember");

const getAllDiscussionMembers = async (req, res) => {
    try {
        const discussionMembers = await DiscussionMember.getAllDiscussionMembers();
        res.json(discussionMembers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion members");
    }
};

const getDiscussionMembersByDiscussion = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const discussionMembers = await DiscussionMember.getDiscussionMembersByDiscussion(dscName);
        res.json(discussionMembers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion members")
    }
};

const createDiscussionMember = async (req, res) => {
    const newDiscussionMemberData = req.body;
    const dscName = req.params.dscName;

    try {
        const createdDiscussionMember = await DiscussionMember.createDiscussionMember(newDiscussionMemberData, dscName);
        res.status(201).send(createdDiscussionMember);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating discussion Member");
    }
};

const deleteDiscussionMember = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;

    try {
        const success = await DiscussionMember.deleteDiscussionMember(accName, dscName);
        if (!success) {
            return res.status(404).send("Discussion member not found")
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting discussion member");
    }
};

module.exports = {
    getAllDiscussionMembers,
    getDiscussionMembersByDiscussion,
    createDiscussionMember,
    deleteDiscussionMember,
}