const Joi = require('joi')

const registerValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).required(),
        lastname: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        description: Joi.string().min(6),
        password: Joi.string().min(6).required(),
        imgURL: Joi.string(),
        role: Joi.string(),
    })

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation