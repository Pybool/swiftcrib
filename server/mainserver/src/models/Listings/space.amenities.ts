import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListingSpaceAmenitiesSchema = new Schema({
  space: {
    type: Schema.Types.ObjectId,
    ref: "listingSpace",
    required: true,
  },
  amenities: {
    type: [],
    default: [],
    required: true,
  }
});

const SpaceAmenities = mongoose.model("listingSpaceAmenities", ListingSpaceAmenitiesSchema);

export default SpaceAmenities;
