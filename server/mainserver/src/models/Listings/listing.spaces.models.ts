import mongoose from "mongoose";
import constants from "./constants";
const Schema = mongoose.Schema;

const ListingSpaceSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "listing",
    required: true,
  },
  name: {
    type: String,
    default: "",
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  spaceMedia: {
    type: [],
    default: [],
    required: true,
  },
  condition: {
    type: String,
    default: "",
    required: true,
  },
  spaceSize: {
    type: String,
    default: "",
    required: false,
  },
  listedBy: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  amenities: [],
});

const ListingSpace = mongoose.model("listingSpace", ListingSpaceSchema);

export default ListingSpace;
