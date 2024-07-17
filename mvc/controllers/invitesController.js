const Invite = require("../models/invite");

const getAllInvites = async (req, res) => {
    try {
        const invites = await Invite.getAllInvites();
        res.json(invites);
    } catch(error) {
        console.log(error);
        res.status(500).send("Error retrieving invites")
    }
};

const getInvitesByDiscussion = async (req, res) => {
    const dscName = req.params.dscName;
    try {
        const invites = Invite.getInvitesByDiscussion(dscName);
        res.json(invites);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving invites");
    }
};

const createInvite = async (req, res) => {
    const newInvite = req.body;

    try {
        const createdInvite = await Invite.createInvite(newInvite);
        res.status(201).json(createdInvite);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating invite");
    }
};

const deleteInvite = async (req, res) => {
    const invId = parseInt(req.params.invId);

    try {
        const success = await Invite.deleteInvite(invId);
        if (!success) {
            return res.status(404).send("Invite not found");
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting invite");
    }
}

module.exports = {
    getAllInvites,
    getInvitesByDiscussion,
    createInvite,
    deleteInvite,
}