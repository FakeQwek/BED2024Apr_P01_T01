const Joi = require("joi");

const validateDiscussionName = (req, res, next) => {
    const schema = Joi.object({
        dscDesc: Joi.string().allow(null, ""),
        dscName: Joi.string().min(1).max(16).required(),
        accName: Joi.string().required(),
        dscType: Joi.string().required()
    });

    const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        console.log(errors);
        res.status(400).json({ message: "Validation error", errors });
        return; // Terminate middleware execution on validation error
    }

    next(); // If validation passes, proceed to the next route handler
};

module.exports = validateDiscussionName;