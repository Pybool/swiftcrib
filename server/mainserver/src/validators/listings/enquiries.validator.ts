import Joi from "@hapi/joi";

const listingEnquiriesSchema = Joi.object({
  account: Joi.string(),
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  message: Joi.string().required(),
  url: Joi.string().required(),
});

const contactUsValidations = {
    listingEnquiriesSchema
};

export default contactUsValidations;
