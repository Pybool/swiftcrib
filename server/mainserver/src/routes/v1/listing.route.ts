import express from "express";
import { decode, ensureAdmin } from "../../middlewares/jwt";
import listingController from "../../controllers/v1/Listing/listing.controller";
import { getMulterConfig } from "../../middlewares/listing.middleware";
import listingSearchController from "../../controllers/v1/Listing/listing.search.controller";

const listingRouter = express.Router();
const attachmentPaths = {
  createListing: "../mainserver/public/listing-attachments/",
};
listingRouter.post(
  "/create-listing",
  decode,
  getMulterConfig(attachmentPaths.createListing),
  listingController.createListing
);

listingRouter.put(
  "/update-listing-media",
  decode,
  getMulterConfig(attachmentPaths.createListing),
  listingController.updateListingMedia
);

listingRouter.put(
  "/update-listing",
  decode,
  listingController.updateListing
);

listingRouter.post(
  "/listing-rules",
  decode,
  listingController.updateListingRules
);

listingRouter.post(
  "/listing-amenities",
  decode,
  listingController.addListingAmenities
);

listingRouter.get(
  "/fetch-listings",
  listingController.fetchListings
);

listingRouter.get(
  "/fetch-listing-detail",
  listingController.fetchListingDetails
);

listingRouter.get(
  "/fetch-proximity-listings",
  listingController.fetchProximityListings
);

listingRouter.post(
  "/bookmark-listing",
  decode,
  listingController.bookMarkListing
);

listingRouter.get(
  "/fetch-bookmarks",
  decode,
  listingController.fetchBookMarks
);

listingRouter.get(
  "/search-listings",
  listingSearchController.searchListings
);




export default listingRouter;
