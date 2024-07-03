
import { NextFunction, Response } from "express";
import Xrequest from "../../../interfaces/extensions.interface";
import { ListingSearchService } from "../../../services/v1/Listings/listings.search.service";

const listingSearchController:any = {
    searchListings: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await ListingSearchService.searchListings(req);
      if (result) status = result.code;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

};
export default listingSearchController;