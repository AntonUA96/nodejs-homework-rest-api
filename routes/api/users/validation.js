const Joi = require('joi');
const {HttpCode} = require('../../../helpers/constants')


const subsctription = ["starter", "pro", "business"];

const schemaRegister = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
    }).required(),
    password: Joi.string().alphanum().min(5).required(),
})

const schemaLogin = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
    }).required(),
    password: Joi.string().alphanum().min(5).required(),
})

const schemaSubscription = Joi.object({
    subscription: Joi.any().valid(...subsctription).required(),
})
  
const validate = async (schema, body, next) => {
    try {
        await schema.validateAsync(body);
        next()
    }
    catch (err) {
        next({
            status: HttpCode.BAD_REQUEST,
            // message: "Missing required name field",
            message: err.message.replace(/"/g, "'"),
        })
    }
}

module.exports.validateSchemaRegister = (req, _res, next) => {
    return validate(schemaRegister, req.body, next)
}

module.exports.validateSchemaLogin = (req, _res, next) => {
    return validate(schemaLogin, req.body, next)
}

module.exports.validateSchemaSubscription = (req, _res, next) => {
    return validate(schemaSubscription, req.body, next)
}
