import { slugify } from "../../../helpers/misc";
import Xrequest from "../../../interfaces/extensions.interface";
import {
  IPropertySpace,
  IPropertySpaceOptional,
  ISpaceAmenities,
} from "../../../interfaces/space.interface";
import ListingSpace from "../../../models/Listings/listing.spaces.models";
import Listing from "../../../models/Listings/listings.property.model";
import SpaceAmenities from "../../../models/Listings/space.amenities";
import spaceValidations from "../../../validators/listings/listingSpace.validator";

export class ListingSpaceService {
  static buildmedia(media: any) {
    return media;
  }

  static async createSpace(req: Xrequest) {
    try {
      const requestBody = req.body;
      const requestBodyData = JSON.parse(requestBody.data);
      const validatedResult: IPropertySpace =
        await spaceValidations.spaceSchema.validateAsync(requestBodyData);
      console.log(requestBodyData);
      const listing: any = await Listing.findOne({
        _id: requestBodyData.listing,
      });
      if (!listing) {
        return {
          status: false,
          message: "No property with such id was found",
          code: 400,
        };
      }
      let spaceMedia = req.attachments!;
      console.log("spaceMedia ", spaceMedia);
      if (spaceMedia.length == 0 || req.files.length != spaceMedia.length) {
        return {
          status: false,
          message: "Listing space failed, no valid images were sent",
          data: null,
          code: 400,
        };
      }
      const slugText = listing.slug + validatedResult.name;
      validatedResult.slug = slugify(slugText);
      validatedResult.spaceMedia = ListingSpaceService.buildmedia(spaceMedia);
      validatedResult.createdAt = new Date();
      validatedResult.listedBy = req.accountId!;
      const space = await ListingSpace.create(validatedResult);
      if (space) {
        return {
          status: true,
          message: "Space has been created and awaiting approval.",
          data: space,
          code: 201,
        };
      }
      return {
        status: false,
        message: "Space could not be added.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateSpaceMedia(req: Xrequest) {
    try {
      const requestBody = req.body;
      const requestBodyData = JSON.parse(requestBody.data);
      const validatedResult: { spaceId: string } =
        await spaceValidations.updateSpaceMediaSchema.validateAsync(
          requestBodyData
        );
      let space: any = await ListingSpace.findOne({
        _id: validatedResult.spaceId,
      })!;
      if (!space) {
        return {
          status: false,
          message: "No space with such id was found",
          code: 400,
        };
      }
      let spaceMedia = req.attachments!;
      console.log("spaceMedia ", spaceMedia);
      if (spaceMedia.length == 0 || req.files.length != spaceMedia.length) {
        return {
          status: false,
          message: "Space media update failed, no valid images were sent",
          data: null,
          code: 400,
        };
      }

      space.spaceMedia = ListingSpaceService.buildmedia(spaceMedia);
      space.updatedAt = new Date();
      space = await space.save();

      if (space) {
        return {
          status: true,
          message: "Space media has been updated and awaiting approval.",
          data: space,
          code: 200,
        };
      }
      return {
        status: false,
        message: "Space media could not be updated.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateSpace(req: Xrequest) {
    try {
      const requestBodyData = req.body;
      const validatedResult: IPropertySpaceOptional =
        await spaceValidations.updateSpaceSchema.validateAsync(
          requestBodyData
        )!;
      let space: any = await ListingSpace.findOne({
        _id: requestBodyData._id,
      })!.populate("listing");
      if (!space) {
        return {
          status: false,
          message: "No space with such id was found",
          code: 400,
        };
      }

      if (space.listing.slug && validatedResult.name) {
        const slugText = space.listing.slug + validatedResult.name;
        validatedResult.slug = slugify(slugText);
      }
      validatedResult.updatedAt = new Date();
      space = await ListingSpace.findOneAndUpdate(
        {
          _id: requestBodyData._id,
        },
        validatedResult,
        { new: true, upsert: true }
      )!;
      if (space) {
        return {
          status: true,
          message: "Space has been updated and awaiting approval.",
          data: space,
          code: 200,
        };
      }
      return {
        status: false,
        message: "Space could not be updated.",
        data: null,
        code: 422,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async addSpaceAmenities(req: Xrequest) {
    try {
      const requestBody = req.body;
      const validatedResult: ISpaceAmenities =
        await spaceValidations.spaceAmenitiesSchema.validateAsync(requestBody);
      const spaceAmenities = await SpaceAmenities.findOneAndUpdate(
        { space: requestBody.space },
        validatedResult,
        { new: true, upsert: true }
      );

      if (spaceAmenities) {
        return {
          status: true,
          message: "Amenities were created/modified",
          data: spaceAmenities,
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
}
