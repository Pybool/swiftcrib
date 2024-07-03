import bcrypt from "bcryptjs";
import createError from "http-errors";
import message from "../../../helpers/messages";
import Xrequest from "../../../interfaces/extensions.interface";
import Accounts from "../../../models/Accounts/accounts.model";
import { utils } from "../../../validators/authentication/custom.validators";
import validations from "../../../validators/authentication/joi.validators";
import mongoose, { ObjectId } from "mongoose";
import AccountBankDetails from "../../../models/Accounts/accounts.banking.model";
import Agentguarantors from "../../../models/Accounts/account.guarantors.model";
import AgentDocuments from "../../../models/Accounts/accounts.attachments.model";

interface IguarantorInformation {
  accountId?: ObjectId | string;
  firstName: string;
  lastName: string;
  phone: string;
  altPhone?: string;
  address?: string;
  workPlace?: string;
  jobDescription?: string;
  bvn: string; // BVN should be a string, but validation can be added later
}

export class PortalService {
  static async createAgent(req: Xrequest) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      const requestData = req.body!;
      const accountInformation = requestData.accountInformation;
      const personalInformation = requestData.personalInformation;
      const qualificationInformation = requestData.qualificationInformation;

      const combinedInformation = {
        ...accountInformation,
        ...personalInformation,
        createdAt: new Date(),
      };

      const account: any = await Accounts.findOne({
        email: combinedInformation.email,
      })
      console.log("Existing account ", combinedInformation.email)
      if (account) {
        throw Error(
          "An agent with this email address already exists"
        );
      }
      const pendingAccount = new Accounts(combinedInformation);
      const savedUser: any = await pendingAccount.save();

      /* Save agent bank details */
      const bankDetails = requestData.bankDetails;
      bankDetails.accountId = savedUser._id;
      const agentBankDetail = await AccountBankDetails.create(bankDetails);

      /* Create agent guarantors */
      const guarantors: IguarantorInformation[] = requestData.guarantors;
      for (const guarantor of guarantors) {
        guarantor.accountId = savedUser._id;
        await Agentguarantors.create(guarantor );
      }

      /* Save agent documents */
      let agentDocuments = req.attachments!;
      agentDocuments.accountId = savedUser._id;
      agentDocuments.highestQualification = qualificationInformation.highestQualification;
      const agentDocumentsData = await AgentDocuments.create(agentDocuments);
    //   await session.commitTransaction();

      return {
        status: true,
        message: "New agent created successfully!",
        data: {
          agent: savedUser,
          bankDetail: agentBankDetail,
          agentDocuments: agentDocumentsData,
        },
      };
    } catch (error: any) {
    //   await session.abortTransaction();
      console.log(error);
      throw error.message;
    } finally {
    //   session.endSession();
    }
  }
}
