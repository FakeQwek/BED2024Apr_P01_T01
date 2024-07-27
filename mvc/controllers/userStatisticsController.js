//Statistics controller returns statistic json responses and logs internal server error if unsuccessful
const Statistics = require("../models/user-statistics");

const getCountOfUsersBanned = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfUsersBanned();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfUsers = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfUsers();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfUsersMuted = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfUsersMuted();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfAdminUsers = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfAdminUsers();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfComments = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfComments();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfDiscussions = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfDiscussions();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfPosts= async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfPosts();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfPostReports = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfPostReports();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfDiscussionReports = async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfDiscussionReports();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getCountOfDiscussionAdmins= async (req, res) => {
    try {
        const statistics = await Statistics.getCountOfDiscussionAdmins();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};

const getTypeOfDiscussions = async (req, res) => {
    try {
        const statistics = await Statistics.getTypeOfDiscussions();
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving user statistics");
    }
};


module.exports = {
    getCountOfUsersBanned,
    getCountOfUsers,
    getCountOfUsersMuted,
    getCountOfAdminUsers,
    getCountOfComments,
    getCountOfDiscussions,
    getCountOfPosts,
    getCountOfPostReports,
    getCountOfDiscussionReports,
    getCountOfDiscussionAdmins,
    getTypeOfDiscussions
}