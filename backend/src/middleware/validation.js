const Joi = require("joi");

exports.registerValidation = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.taskCreateValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        dueDate: Joi.date().optional(), // Можно проверить формат даты
        status: Joi.string().valid("pending", "in-progress", "completed").optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.taskUpdateValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(1).optional(),
        dueDate: Joi.date().optional(),
        status: Joi.string().valid("pending", "in-progress", "completed").optional()
    })
    .min(1);

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
