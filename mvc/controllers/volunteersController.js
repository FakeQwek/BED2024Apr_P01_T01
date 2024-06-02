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

module.exports = {
    getAllVolunteers,
    getVolunteerById,
    createVolunteer,
};