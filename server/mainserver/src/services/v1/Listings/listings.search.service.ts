import { delay } from "../../../helpers/misc";
import Xrequest from "../../../interfaces/extensions.interface";
import { IListingFilters } from "../../../interfaces/listing.interfaces";
import Listing from "../../../models/Listings/listings.property.model";

function buildSortCriteria(
  sortField: string,
  sortOrder: "asc" | "desc" = "desc"
): any {
  return {
    [sortField]: sortOrder === "desc" ? -1 : 1,
  };
}

const rehydrateFilter = (rawFilter: IListingFilters) => {
  const hydratedFilter: IListingFilters | any = {};

  const assignIfValidNumber = (key: keyof typeof rawFilter) => {
    if (
      rawFilter[key] &&
      !isNaN(rawFilter[key] as any) &&
      rawFilter[key] !== "undefined"
    ) {
      try {
        if (typeof rawFilter[key] == "string") {
          hydratedFilter[key] = parseInt(rawFilter[key] as string);
        }
      } catch {}
    } else {
      delete rawFilter[key];
    }
  };

  const assignIfNonEmptyString = (key: keyof typeof rawFilter) => {
    if (typeof rawFilter[key] == "string") {
      try {
        if (rawFilter[key] !== "" && rawFilter[key] !== "undefined") {
          hydratedFilter[key] = rawFilter[key] as string;
        } else {
          delete rawFilter[key];
        }
      } catch {}
    }
  };

  assignIfValidNumber("page");
  assignIfValidNumber("limit");
  assignIfValidNumber("beds");
  assignIfValidNumber("baths");
  assignIfValidNumber("minPrice");
  assignIfValidNumber("maxPrice");
  assignIfNonEmptyString("loc");
  assignIfNonEmptyString("serviceType");
  assignIfNonEmptyString("searchText");

  return hydratedFilter;
};

export class ListingSearchService {
  static buildSearchFilter(hydratedFilter: IListingFilters) {
    try {
      const searchTerms =
        hydratedFilter.searchText
          ?.split(" ")
          .filter((term: string) => term.trim() !== "") || [];
      const regex = searchTerms.map(
        (term: string | RegExp) => new RegExp(term, "i")
      );

      const filter: any = {
        $and: [],
      };

      if (hydratedFilter.searchText) {
        const searchtextQuery = {
          $or: [
            { lga: { $in: regex } },
            { state: { $in: regex } },
            { street: { $in: regex } },
            { address: { $in: regex } },
            { slug: { $in: regex } },
            { propertyOverview: { $in: regex } },
            { description: { $in: regex } },
            { listingTags: { $in: regex } },
            { dwellingType: { $in: regex } },
          ],
        };
        filter.$and.push(searchtextQuery);
      }

      if (hydratedFilter.beds !== undefined) {
        filter.$and.push({ beds: hydratedFilter.beds });
      }

      if (hydratedFilter.baths !== undefined) {
        filter.$and.push({ baths: hydratedFilter.baths });
      }

      if (
        hydratedFilter.minPrice !== undefined ||
        hydratedFilter.maxPrice !== undefined
      ) {
        const priceCondition: any = {};
        if (hydratedFilter.minPrice !== undefined) {
          priceCondition.$gte = hydratedFilter.minPrice;
        }
        if (hydratedFilter.maxPrice !== undefined) {
          priceCondition.$lte = hydratedFilter.maxPrice;
        }
        filter.$and.push({ fullPrice: priceCondition });
      }
      
      //Handle case where no filter array is empty default searches to
      if (filter.$and.length == 0) {
        const searchLoc =
          hydratedFilter.loc
            ?.split(" ")
            .filter((term: string) => term.trim() !== "") || [];
        const regex = searchLoc.map(
          (term: string | RegExp) => new RegExp(term, "i")
        );
        const searchtextQuery = {
          $or: [
            { lga: { $in: regex } },
            { state: { $in: regex } },
            { street: { $in: regex } },
            { address: { $in: regex } },
            { slug: { $in: regex } },
            { propertyOverview: { $in: regex } },
            { description: { $in: regex } },
            { listingTags: { $in: regex } },
            { dwellingType: { $in: regex } },
          ],
        };
        filter.$and.push(searchtextQuery);
      }
      return filter;
    } catch {
      return {};
    }
  }

  static async searchListings(req: Xrequest) {
    try {
      await delay(3000);
      const rawFilter: IListingFilters = req.query; // await getUserCountry(req)
      console.log("Raw filter ", rawFilter);
      const hydratedFilter = rehydrateFilter(rawFilter);
      const filter = await ListingSearchService.buildSearchFilter(
        hydratedFilter
      );
      const page = hydratedFilter?.page || 1;
      const limit = hydratedFilter?.limit! || 10;
      const skip = (page - 1) * limit;
      const options = {
        skip: skip,
        limit: limit,
        sort: buildSortCriteria("fullPrice", "asc"),
      };

      const [listings, total] = await Promise.all([
        Listing.find(filter, null, options).populate("approvedBy"),
        Listing.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);
      return {
        status: true,
        data: listings,
        total: total,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
        message: "Success",
        code: 200,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
