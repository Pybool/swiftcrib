import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListingRulesSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "listing",
    required: true,
  },
  rules: {
    type: [],
    default: [],
    required: true,
  }
});

const ListingRules = mongoose.model("listingRules", ListingRulesSchema);

export default ListingRules;
