const Volunteer = require("../models/voluteer");

const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.getAllVolunteers();
        res.json(volunteers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving volunteer");
    }
};

const getVolunteerById = async (req, res) => {
    const volId = parseInt(req.params.volId);
    try {
        const volunteer = await Volunteer.getVolunteerById(volId);
        if (!volunteer) {
            return res.status(404).send("Volunteer not found");
        }
        res.json(volunteer);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving volunteer")
    }
};

const createVolunteer = async (req, res) => {
    const newVolunteer = req.body;
    try {
        const createdVolunteer = await Volunteer.createVolunteer(newVolunteer);
        res.status(201).json(createdVolunteer);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving volunteer");
    }
};

const getVolunteersByPost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const volunteers = await Volunteer.getVolunteersByPost(postId);
        res.json(volunteers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving volunteers");
    }
};

const deleteVolunteer = async (req, res) => {
    const volId = parseInt(req.params.volId);
    try {
        const success = await Volunteer.deleteVolunteer(volId);
        if (!success) {
            return res.status(404).send("Volunteer not found")
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting volunteer");
    }
}

const approveVolunteer = async (req, res) => {
    const volId = parseInt(req.params.volId);
    try {
        const approvedVolunteer = await Volunteer.approveVolunteer(volId);
        if (!approvedVolunteer) {
            return res.status(404).send("Volunteer not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error approving volunteer");
    }
}

module.exports = {
    getAllVolunteers,
    getVolunteerById,
    createVolunteer,
    getVolunteersByPost,
    deleteVolunteer,
    approveVolunteer,
};