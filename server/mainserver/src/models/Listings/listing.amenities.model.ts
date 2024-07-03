import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListingAmenitiesSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "listing",
    required: true,
  },
  amenities: {
    type: [],
    default: [],
    required: true,
  }
});

const ListingAmenities = mongoose.model("listingAmenities", ListingAmenitiesSchema);

export default ListingAmenities;
