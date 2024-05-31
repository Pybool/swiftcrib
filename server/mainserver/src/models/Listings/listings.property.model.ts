import mongoose from "mongoose";
import constants from "./constants";
const Schema = mongoose.Schema;

const ListingsSchema = new Schema({
  propertyOwner: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  listingDetail: {
    type: Schema.Types.ObjectId,
    ref: "listingdetails",
    required: true,
  },
  listingSpaces: {
    type: [Schema.Types.ObjectId],
    ref: "listingspaces",
    required: false,
  },
  dwellingType: {
    type: String,
    default: constants.listingsConstants.DWELLING_TYPES[0],
    required: false,
    enum: constants.listingsConstants.DWELLING_TYPES,
  },
  occupancyStatus: {
    type: String,
    default: constants.listingsConstants.OCCUPANCY_STATUS[0],
    required: false,
    enum: constants.listingsConstants.OCCUPANCY_STATUS,
  },
  listingCategory: {
    type: String,
    default: "MIDDLE CLASS",
    required: false,
    enum: constants.listingsConstants.LISTING_CATEGORIES,
  },
  listingMedia: {
    type: [],
    default: [],
    required: false,
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
    required: false,
  },
  propertyOverview: {
    type: String,
    default: "",
    required: false,
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
  listedTime: {
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
});

const Listing = mongoose.model("listings", ListingsSchema);

export default Listing;
