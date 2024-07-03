import { NextFunction, Response } from "express";
import Xrequest from "../../../interfaces/extensions.interface";
import { ListingSpaceService } from "../../../services/v1/Listings/listings.space.service";

const spaceController:any = {
  createSpace: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingSpaceService.createSpace(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  updateSpaceMedia: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingSpaceService.updateSpaceMedia(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  updateSpace :async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingSpaceService.updateSpace(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  addSpaceAmenities :async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingSpaceService.addSpaceAmenities(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

};
export default spaceController;