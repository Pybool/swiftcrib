import mongoose from "mongoose";
import constants from "./constants";
const Schema = mongoose.Schema;

const listingEnquiriesSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: false,
  },
  name: {
    type: String,
    default: "",
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
    required: true,
  },
  url: {
    type: String,
    default: "",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const ListingEnquiries = mongoose.model("listingEnquiries", listingEnquiriesSchema);

export default ListingEnquiries;
