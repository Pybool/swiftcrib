import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListingBookmarksSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "listing",
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  }
});

const ListingBookmarks = mongoose.model("bookmarks", ListingBookmarksSchema);

export default ListingBookmarks;
