import express from "express";
import { decode, ensureAdmin } from "../../middlewares/jwt";
import { getMulterConfig } from "../../middlewares/listing.middleware";
import spaceController from "../../controllers/v1/Listing/space.controller";

const spaceRouter = express.Router();
const attachmentPaths = {
  createSpace: "../mainserver/public/space-attachments/",
};
spaceRouter.post(
  "/create-space",
  decode,
  getMulterConfig(attachmentPaths.createSpace),
  spaceController.createSpace
);

spaceRouter.put(
  "/update-space-media",
  decode,
  getMulterConfig(attachmentPaths.createSpace),
  spaceController.updateSpaceMedia
);

spaceRouter.put("/update-space", decode, spaceController.updateSpace);
spaceRouter.post("/space-amenities", decode, spaceController.addSpaceAmenities);

export default spaceRouter;
