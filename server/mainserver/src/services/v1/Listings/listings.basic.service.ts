import { Types } from "mongoose";
import { delay, getUserCountry, slugify } from "../../../helpers/misc";
import Xrequest from "../../../interfaces/extensions.interface";
import {
  IHabitationRules,
  IListingAmenities,
  IPropertyListing,
  IPropertyListingOptional,
} from "../../../interfaces/listing.interfaces";
import ListingAmenities from "../../../models/Listings/listing.amenities.model";
import ListingRules from "../../../models/Listings/listing.habitation.rules.model";
import Listing from "../../../models/Listings/listings.property.model";
import listingValidations from "../../../validators/listings/createListing.validator";
import ListingSpace from "../../../models/Listings/listing.spaces.models";
import SpaceAmenities from "../../../models/Listings/space.amenities";
import ListingBookmarks from "../../../models/Listings/listing.bookmarks.model";
import Accounts from "../../../models/Accounts/accounts.model";

export class ListingService {
  static buildmedia(media: any) {
    return media;
  }

  static buildFilter(req: Xrequest) {
    try {
      if (req.query.filter) {
        if (req.query.field == "status") {
          return { status: req.query.filter };
        } else if (req.query.field == "category") {
          return { category: new Types.ObjectId(req.query.filter as string) };
        }
      }
      return {};
    } catch {
      return {};
    }
  }

  static async createListing(req: Xrequest) {
    try {
      const requestBody = req.body;
      const requestBodyData = JSON.parse(requestBody.data);
      const validatedResult: IPropertyListing =
        await listingValidations.listingSchema.validateAsync(requestBodyData);

      let listingMedia = req.attachments!;
      console.log("listingMedia ", listingMedia);
      if (listingMedia.length == 0 || req.files.length != listingMedia.length) {
        return {
          status: false,
          message: "Listing property failed, no valid images were sent",
          data: null,
          code: 400,
        };
      }
      const slugText =
        validatedResult.propertyOverview + validatedResult.address;
      validatedResult.slug = slugify(slugText);
      validatedResult.listingMedia = ListingService.buildmedia(listingMedia);
      validatedResult.createdAt = new Date();
      validatedResult.approvedBy = req.accountId!;
      const listing = await Listing.create(validatedResult);
      if (listing) {
        return {
          status: true,
          message: "Property has been created and awaiting approval.",
          data: listing,
          code: 201,
        };
      }
      return {
        status: false,
        message: "Property could not be listed.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateListingMedia(req: Xrequest) {
    try {
      const requestBody = req.body;
      const requestBodyData = JSON.parse(requestBody.data);
      const validatedResult: { listingId: string } =
        await listingValidations.updateListingMediaSchema.validateAsync(
          requestBodyData
        );
      let listing: any = await Listing.findOne({
        _id: validatedResult.listingId,
      })!;
      if (!listing) {
        return {
          status: false,
          message: "No property with such id was found",
          code: 400,
        };
      }
      let listingMedia = req.attachments!;
      console.log("listingMedia ", listingMedia);
      if (listingMedia.length == 0 || req.files.length != listingMedia.length) {
        return {
          status: false,
          message: "Listing property failed, no valid images were sent",
          data: null,
          code: 400,
        };
      }

      listing.listingMedia = ListingService.buildmedia(listingMedia);
      listing.updatedAt = new Date();
      listing = await listing.save();

      if (listing) {
        return {
          status: true,
          message: "Property media has been updated and awaiting approval.",
          data: listing,
          code: 200,
        };
      }
      return {
        status: false,
        message: "Property media could not be updated.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateListing(req: Xrequest) {
    try {
      const requestBodyData = req.body;
      const validatedResult: IPropertyListingOptional =
        await listingValidations.updatelistingSchema.validateAsync(
          requestBodyData
        )!;
      let listing: any = await Listing.findOne({
        _id: requestBodyData._id,
      })!;
      if (!listing) {
        return {
          status: false,
          message: "No property with such id was found",
          code: 400,
        };
      }
      if (validatedResult.propertyOverview && validatedResult.address) {
        const slugText =
          validatedResult.propertyOverview! + validatedResult.address!;
        validatedResult.slug = slugify(slugText);
      }

      validatedResult.updatedAt = new Date();
      listing = await Listing.findOneAndUpdate(
        {
          _id: requestBodyData._id,
        },
        validatedResult,
        { new: true, upsert: true }
      )!;
      if (listing) {
        return {
          status: true,
          message: "Property has been updated and awaiting approval.",
          data: listing,
          code: 200,
        };
      }
      return {
        status: false,
        message: "Property could not be updated.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateListingRules(req: Xrequest) {
    try {
      const requestBody = req.body;
      const validatedResult: IHabitationRules =
        await listingValidations.listingRulesSchema.validateAsync(requestBody);
      const listingRules = await ListingRules.findOneAndUpdate(
        { listing: requestBody.listing },
        validatedResult,
        { new: true, upsert: true }
      );

      if (listingRules) {
        return {
          status: true,
          message: "Rules were created/modified",
          data: listingRules,
          code: 201,
        };
      }
      return {
        status: false,
        message: "Rule could not be created/modified.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async addListingAmenities(req: Xrequest) {
    try {
      const requestBody = req.body;
      const validatedResult: IListingAmenities =
        await listingValidations.listingAmenitiesSchema.validateAsync(
          requestBody
        );
      const listingAmenities = await ListingAmenities.findOneAndUpdate(
        { listing: requestBody.listing },
        validatedResult,
        { new: true, upsert: true }
      );

      if (listingAmenities) {
        return {
          status: true,
          message: "Amenities were created/modified",
          data: listingAmenities,
          code: 201,
        };
      }
      return {
        status: false,
        message: "Amenities could not be created/modified.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async fetchListings(req: Xrequest) {
    try {
      let filter: any = {};
      const page = Number((req.query.page! as string) || 1);
      const limit = Number((req.query.limit! as string) || 10);

      // if(page==4){
      await delay(3000);
      // }

      filter = ListingService.buildFilter(req);
      const skip = (page - 1) * limit; // Calculate the number of documents to skip

      const options = {
        skip: skip, // Skip the appropriate number of documents for pagination
        limit: limit, // Limit the number of documents returned
        sort: { createdAt: -1 }, // Sort by createdAt in descending order
      };

      console.log(options);

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
        message: "Listings fetched successfully",
        code: 200,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static buildCloseByCribsFilter(searchString: string) {
    try {
      const searchTerms = searchString
        .split(" ")
        .filter((term) => term.trim() !== "");
      const regex = searchTerms.map((term) => new RegExp(term, "i"));
      return {
        $or: [
          { lga: { $in: regex } },
          { state: { $in: regex } },
          { street: { $in: regex } },
          { address: { $in: regex } },
          { slug: { $in: regex } },
        ],
      };
    } catch {
      return {};
    }
  }

  static async fetchProximityListings(req: Xrequest) {
    try {
      let filter: any = {};
      const page = Number((req.query.page! as string) || 1);
      const limit = Number((req.query.limit! as string) || 20);
      const userLocation: any = { lga: "bodija" }; // await getUserCountry(req)
      filter = await ListingService.buildCloseByCribsFilter(userLocation.lga);
      const skip = (page - 1) * limit;
      const options = {
        skip: skip,
        limit: limit,
        sort: { createdAt: -1 },
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
        message: "Closest proximity fetched successfully",
        code: 200,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async fetchListingDetails(req: Xrequest) {
    const slug = req.query.slug as string;
    const getListing: any = async () => {
      return await Listing.findOne({ slug: slug });
    };
    const listing = await getListing();
    if (!listing) {
      return {
        status: false,
        message: "Listing does not exist",
        code: 400,
      };
    }
    const getListingAmenities = async () => {
      return await ListingAmenities.findOne({ listing: listing._id })!;
    };

    const listingAmenities: any = await getListingAmenities()!;
    listing.amenities = listingAmenities;

    const getListingSpaces = async () => {
      return await ListingSpace.find({ listing: listing._id });
    };

    const getListingRules = async () => {
      return await ListingRules.findOne({ listing: listing._id });
    };

    const getAgents = async (locality: string, lga: string) => {
      const filter: any = {
        $and: [
          {
            $or: [
              { lga: { $regex: new RegExp(lga, "i") } }, // Case-insensitive search for lga
              { street: { $regex: new RegExp(locality, "i") } }, // Case-insensitive search for street
            ],
          },
          { isAgent: true },
        ],
      };

      const agents = await Accounts.find(filter).limit(3); // Limit results to 3
      if (agents.length > 0) {
        return agents;
      } else {
        const agents = await Accounts.find({
          isAgent: true,
          isDefaultAgent: true,
        });
        console.log("returning derfault", agents);
        return agents;
      }
    };

    const spaces: any[] = await getListingSpaces()!;
    const rules: any = await getListingRules()!;
    const agents: any[] = await getAgents(listing.street, listing.lga);
    for (let space of spaces) {
      const spaceAmenities = await SpaceAmenities.findOne({
        space: space._id,
      })!;
      space.amenities = spaceAmenities;
    }

    listing.spaces = spaces;
    listing.rules = rules.rules;
    listing.agents = agents;

    return {
      status: true,
      message: "Listing details fetched sucessfully.",
      data: listing,
      code: 200,
    };
  }

  static async bookMarkListing(req: Xrequest) {
    try {
      const listingId = req.body.listing;
      const existingBookmark = await ListingBookmarks.findOneAndDelete({
        account: req.accountId,
        listing: listingId,
      });
      if (existingBookmark) {
        return {
          status: true,
          message: "You have unbookmarked this property",
          code: 200,
        };
      } else {
        const listing = await ListingBookmarks.create({
          account: req.accountId,
          listing: listingId,
        });
        return {
          status: true,
          message: "You have unbookmarked this property",
          data: await listing.populate("listing"),
          code: 200,
        };
      }
    } catch (error: any) {
      throw error;
    }
  }

  static async fetchBookMarks(req: Xrequest) {
    try {
      let filter: any = {};
      const page = Number((req.query.page! as string) || 1);
      const limit = Number((req.query.limit! as string) || 10);

      await delay(3000);

      filter = { account: req.accountId };
      const skip = (page - 1) * limit; // Calculate the number of documents to skip

      const options = {
        skip: skip, // Skip the appropriate number of documents for pagination
        limit: limit, // Limit the number of documents returned
        sort: { createdAt: -1 }, // Sort by createdAt in descending order
      };

      const [bookmarks, total] = await Promise.all([
        ListingBookmarks.find(filter, null, options).populate("listing"),
        ListingBookmarks.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);
      const flatbookmarks = [];
      for (let bookmark of bookmarks) {
        flatbookmarks.push(bookmark.listing);
      }
      return {
        status: true,
        data: flatbookmarks,
        total: total,
        totalPages: totalPages,
        currentPage: page,
        limit: limit,
        message: "Bookmarks fetched successfully",
        code: 200,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
