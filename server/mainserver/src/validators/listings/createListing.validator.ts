import Joi from "@hapi/joi";

const listingSchema = Joi.object({
  propertyOwnerNoAuth: Joi.string().required(),
  dwellingType: Joi.string().required(),
  occupancyStatus: Joi.string().required(),
  listingCategory: Joi.string().required(),
  listingMedia: Joi.array(),
  propertyCondition: Joi.string().required(),
  address: Joi.string().required(),
  listingTags: Joi.array(),
  description: Joi.string().required(),
  propertySize: Joi.string().required(),
  propertyOverview: Joi.string().required(),
  approvalStatus: Joi.string().required(),
  state: Joi.string().required(),
  lga: Joi.string().required(),
  street: Joi.string().required(),
});

const updatelistingSchema = Joi.object({
  _id: Joi.string(),
  propertyOwnerNoAuth: Joi.string(),
  dwellingType: Joi.string(),
  occupancyStatus: Joi.string(),
  listingCategory: Joi.string(),
  listingMedia: Joi.array(),
  propertyCondition: Joi.string(),
  address: Joi.string(),
  listingTags: Joi.array(),
  description: Joi.string(),
  propertySize: Joi.string(),
  propertyOverview: Joi.string(),
  approvalStatus: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  street: Joi.string()
});

const updateListingMediaSchema = Joi.object(
  {
    listingId: Joi.string().required()
  }
)

const listingRulesSchema = Joi.object(
  {
    listing: Joi.string(),
    rules: Joi.array().required()
  }
)

const listingAmenitiesSchema = Joi.object(
  {
    listing: Joi.string(),
    amenities: Joi.array().required()
  }
)

const listingValidations = {
  listingSchema,
  updateListingMediaSchema,
  updatelistingSchema,
  listingRulesSchema,
  listingAmenitiesSchema
};

export default listingValidations;