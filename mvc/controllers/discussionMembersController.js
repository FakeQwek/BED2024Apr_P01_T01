const DiscussionMember = require("../models/discussionMember");
const DiscussionAdmin = require ("../models/discussionadmin")

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

const getDiscussionMemberTop3Discussions = async (req, res) => {
    const accName = req.params.accName;

    try {
        const discussionMembers = await DiscussionMember.getDiscussionMemberTop3Discussions(accName);
        res.json(discussionMembers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion members");
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

const getAccountIsBanned = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const bannedUsers = await DiscussionMember.getAccountsIsBanned(dscName);
        if (bannedUsers.length === 0) {
            return res.status(404).send("No banned users found");
        }
        res.json(bannedUsers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving banned users");
    }
};

const banUser = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    const { banReason, bannedBy } = req.body;
    try {
        await DiscussionMember.banUser(accName, dscName);
        res.status(200).send(`${accName} has been banned in ${dscName}.`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error banning user");
    }
};

const unbanAccount = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName
    try {
        await DiscussionMember.unbanAccount(accName, dscName);
        res.status(200).send(`${accName} has been unbanned in ${dscName}.`);
    } catch (error) {
        console.error('Error unbanned user:', error);
        res.status(500).send("Error unbanned user");
    }
};

const getAccountsIsMuted = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const mutedAccounts = await DiscussionMember.getAccountsIsMuted(dscName);
        if (mutedAccounts.length === 0) {
            return res.status(404).send("No muted users found");
        }
        res.json(mutedAccounts);
    } catch (error) {
        console.error('Error retrieving muted users:', error);
        res.status(500).send("Error retrieving muted users");
    }
};

const muteUser = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        await DiscussionMember.muteUser(accName, dscName);
        res.status(200).send(`${accName} has been muted in ${dscName}.`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error muting user");
    }
};

const unmuteUser = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName
    try {
        await DiscussionMember.unmuteAccount(accName, dscName);
        res.status(200).send(`${accName} has been unmuted in ${dscName}.`);
    } catch (error) {
        console.error('Error unmuting user:', error);
        res.status(500).send("Error unmuting user");
    }
};

const promoteUser = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        await DiscussionMember.promoteUser(accName, dscName);
        res.status(200).send(`${accName} demoted successfully`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error promoting user");
    }
};

const appendAdmin = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        await DiscussionAdmin.appendAdmin(accName, dscName);
        res.status(200).send(`${accName} demoted successfully`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error promoting user");
    }
};

const demoteUser = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        await DiscussionMember.demoteUser(accName, dscName);
        res.status(200).send(`${accName} demoted successfully`);
    } catch (error) {
        console.error('Error demoting user:', error);
        res.status(500).send("Error demoting user");
    }
};

const removeAdmin = async (req, res) => {
    const accName = req.params.accName;
    const dscName = req.params.dscName;
    try {
        await DiscussionAdmin.removeAdmin(accName, dscName);
        res.status(200).send(`${accName} demoted successfully`);
    } catch (error) {
        console.error('Error demoting user:', error);
        res.status(500).send("Error demoting user");
    }
};

const getPostReportsByDiscussion = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const postReports = await DiscussionAdmin.getPostReportsByDiscussion(dscName);
        res.json(postReports);
    } catch (err) {
        console.error('Error getting post reports:', err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllDiscussionMembers,
    getDiscussionMembersByDiscussion,
    getDiscussionMemberTop3Discussions,
    createDiscussionMember,
    deleteDiscussionMember,
    getAccountIsBanned,
    banUser,
    unbanAccount,
    getAccountsIsMuted,
    muteUser,
    unmuteUser,
    promoteUser,
    demoteUser,
    appendAdmin,
    removeAdmin,
    getPostReportsByDiscussion
}