const Joi = require("joi");
const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(9).max(20).optional(),
  isVaccinated: Joi.boolean().optional(),
});
const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(9).max(20).optional(),
  isVaccinated: Joi.boolean().optional(),
});
const schemaStatusVaccinatedContact = Joi.object({
  isVaccinated: Joi.boolean().required(),
});
const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: "Missing required name field" });
  }
};
module.exports.validateCreateContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};
module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
module.exports.validateStatusVaccinatedContact = (req, _res, next) => {
  return validate(schemaStatusVaccinatedContact, req.body, next);
};