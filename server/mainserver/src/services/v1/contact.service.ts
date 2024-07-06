import Xrequest from "../../interfaces/extensions.interface";
import { IListingEnquiry } from "../../interfaces/listing.interfaces";
import ListingEnquiries from "../../models/Listings/listing.enquiries.model";
import contactUsValidations from "../../validators/listings/enquiries.validator";
import mailActions from "./Mail/mail.service";

export class ContactService {
  static async makePropertyEnquiry(req: Xrequest) {
    const payload = req.body;
    const listingEnquiry: IListingEnquiry =
      await contactUsValidations.listingEnquiriesSchema.validateAsync(payload);
    if (!listingEnquiry) {
      return {
        status: false,
        message: "Invalid payload in request",
        code: 400,
      };
    }

    if (req.accountId) {
      listingEnquiry.account = req.accountId;
    }

    listingEnquiry.createdAt = new Date();

    const enquiry = await ListingEnquiries.create(listingEnquiry);
    await mailActions.listing.contactUs(payload.email, enquiry);

    return {
      status: true,
      message: "Property Enquiry submitted successfully.",
      data: enquiry,
      code: 200,
    };
  }
}
