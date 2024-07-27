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

const getDiscussionByName = async (req, res) => {
    const dscName = req.params.dscName;
    try {   
        const discussion = await Discussion.getDiscussionByName(dscName);
        if (!discussion) {
            return res.status(404).send("Discussion not found");
        }
        res.json(discussion);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving discussion");
    }
};

const createDiscussion = async (req, res) => {
    const newDiscussion = req.body;
    try {
        const createdDiscussion = await Discussion.createDiscussion(newDiscussion);
        res.status(201).json(createdDiscussion);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating discussion");
    }
};

const updateDiscussionDescription = async (req, res) => {
    const dscName = req.params.dscName;
    const newDiscussionData = req.body;

    try {
        const updatedDiscussion = await Discussion.updateDiscussionDescription(dscName, newDiscussionData);
        res.status(201).json(updatedDiscussion);
    } catch(error) {
        console.log(error);
        res.status(500).send("Error updating discussion");
    }
};

const searchDiscussions = async (req, res) => {
    const searchTerm = req.query.searchTerm;

    try {
        const discussions = await Discussion.searchDiscussions(searchTerm);
        res.json(discussions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message : "Error searching discussions" });
    }
}

const updateDiscussion = async (req, res) => {
    const dscName = req.params.dscName;
    const { dscDesc } = req.body;

    // Check if dscDesc is provided
    if (!dscDesc) {
        return res.status(400).send('dscDesc is required');
    }

    try {
        // Log the received data
        console.log('Received data for updating discussion:', {
            dscName,
            dscDesc
        });

        await Discussion.updateDiscussion(dscName, { dscDesc }); // Pass dscDesc as an object
        res.status(200).send('Discussion updated successfully');
    } catch (error) {
        console.error('Error updating discussion:', error);
        res.status(500).send('Error updating discussion');
    }
};

module.exports = {
    getAllDiscussions,
    getDiscussionByName,
    createDiscussion,
    searchDiscussions,
    updateDiscussionDescription,
    updateDiscussion,
};