import mongoose from "mongoose";
import constants from "./constants";
const Schema = mongoose.Schema;

const ListingsSchema = new Schema({
  propertyOwner: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: false,
  },
  propertyOwnerNoAuth: {
    type: String,
    default: "",
    required: false,
  },
  dwellingType: {
    type: String,
    default: constants.listingsConstants.DWELLING_TYPES[0],
    required: true,
    enum: constants.listingsConstants.DWELLING_TYPES,
  },
  occupancyStatus: {
    type: String,
    default: constants.listingsConstants.OCCUPANCY_STATUS[0],
    required: true,
    enum: constants.listingsConstants.OCCUPANCY_STATUS,
  },
  listingCategory: {
    type: String,
    default: "MIDDLE CLASS",
    required: true,
    enum: constants.listingsConstants.LISTING_CATEGORIES,
  },
  listingMedia: {
    type: [],
    default: [],
    required: true,
  },
  propertyCondition: {
    type: String,
    default: constants.listingsConstants.PROPERTY_CONDITION[0],
    required: true,
    enum: constants.listingsConstants.PROPERTY_CONDITION,
  },
  listingTags: {
    type: [],
    default: "",
    required: false,
  },
  description: {
    type: String,
    default: "",
    required: true,
  },
  propertySize: {
    type: String,
    default: "",
    required: true,
  },
  propertyOverview: {
    type: String,
    default: "",
    required: true,
  },
  address: {
    type: String,
    default: "",
    required: true,
  },
  slug: {
    type: String,
    default: "",
    required: true,
  },
  approvalStatus: {
    type: String,
    default: constants.listingsConstants.APPROVAL_STATUS[0],
    enum: constants.listingsConstants.APPROVAL_STATUS,
  },
  listedBy: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: false,
  },
  createdAt: {
    type: Date,
    default: "",
    required: false,
  },
  updatedAt: {
    type: Date,
    default: "",
    required: false,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: false,
  },
  approvalTime: {
    type: Date,
    default: "",
    required: false,
  },

  state: {
    type: String,
    default: "Oyo",
    required: false,
  },
  lga: {
    type: String,
    default: "",
    required: false,
  },
  street: {
    type: String,
    default: "",
    required: false,
  },

  beds: {
    type: Number,
    default: 1,
    required: false,
  },
  baths: {
    type: Number,
    default: 1,
    required: false,
  },
  fullPrice: {
    type: Number,
    default: 0.00,
    required: false,
  },

  spaces: [],
  amenities: [],
  rules: [],
  agents: []
});

const Listing = mongoose.model("listing", ListingsSchema);

export default Listing;

const payload = {
  propertyOwnerNoAuth: "John Doe",
  dwellingType: "Multiple Dwelling",
  occupancyStatus: "Vacant",
  listingCategory: "MIDDLE CLASS",
  listingMedia: [
    {
      type: "image",
      url: "https://example.com/images/property1.jpg",
    },
    {
      type: "image",
      url: "https://example.com/images/property2.jpg",
    },
    {
      type: "image",
      url: "https://example.com/images/property3.jpg",
    },
    {
      type: "video",
      url: "https://example.com/videos/property1.mp4",
    },
  ],
  propertyCondition: "New",
  listingTags: ["pool", "garage", "garden"],
  description:
    "A newly built multiple dwelling property located in a serene neighborhood. It features modern amenities and spacious rooms, perfect for a family looking for comfort and convenience.",
  propertySize: "3500 sq ft",
  propertyOverview:
    "This property includes 4 bedrooms, 3 bathrooms, a modern kitchen, a large living room, and a backyard with a swimming pool. It's located near schools, shopping centers, and public transportation.",
  approvalStatus: "PENDING",
  listedBy: "60c72b2f9b1e8a6b9f1e4b9b", // Example ObjectId for the account
  createdAt: new Date("2023-06-15T10:00:00Z"),
  approvedBy: "60c72b2f9b1e8a6b9f1e4b9c", // Example ObjectId for the approving account
  approvalTime: new Date("2023-06-20T15:00:00Z"),
};
