import { NextFunction, Response } from "express";
import Xrequest from "../../../interfaces/extensions.interface";
import { ListingService } from "../../../services/v1/Listings/listings.basic.service";
import { ContactService } from "../../../services/v1/contact.service";

const listingController:any = {
  createListing: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.createListing(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  updateListingMedia: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.updateListingMedia(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  updateListing: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.updateListing(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  updateListingRules: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.updateListingRules(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  addListingAmenities: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.addListingAmenities(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  fetchListings: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.fetchListings(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  fetchListingDetails: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.fetchListingDetails(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  fetchProximityListings: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.fetchProximityListings(req);
      if (result) status = result?.code || 200;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  bookMarkListing: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.bookMarkListing(req);
      if (result) status = result?.code || 200;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  fetchBookMarks: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingService.fetchBookMarks(req);
      if (result) status = result?.code || 200;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  makePropertyEnquiry: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ContactService.makePropertyEnquiry(req);
      if (result) status = result?.code || 200;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  

};
export default listingController;