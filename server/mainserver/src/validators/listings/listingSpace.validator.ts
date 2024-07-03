import Joi from "@hapi/joi";

const spaceSchema = Joi.object({
  listing: Joi.string(),
  name: Joi.string().required(),
  description: Joi.string(),
  condition: Joi.string(),
  spaceSize: Joi.string(),
  slug: Joi.string(),
  status: Joi.string(),
});

const updateSpaceSchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  condition: Joi.string(),
  spaceSize: Joi.string(),
  slug: Joi.string(),
  status: Joi.string(),
});

const updateSpaceMediaSchema = Joi.object({
  spaceId: Joi.string().required(),
});

const spaceAmenitiesSchema = Joi.object({
  space: Joi.string(),
  amenities: Joi.array().required(),
});

const spaceValidations = {
  spaceSchema,
  updateSpaceSchema,
  updateSpaceMediaSchema,
  spaceAmenitiesSchema,
};

export default spaceValidations;
