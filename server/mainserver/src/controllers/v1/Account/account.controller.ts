import { NextFunction, Response } from "express";
import Xrequest from "../../../interfaces/extensions.interface";
import { AccountService } from "../../../services/v1/Accounts/account.service";

const accountController:any = {
  getUserProfile: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await AccountService.getUserProfile(req);
      if (result) status = 200;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },

  saveUserProfile: async (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      let status = 400;
      const result = await AccountService.saveUserProfile(req);
      if (result) status = 200;
      return res.status(status).json(result);
    } catch (error: any) {
      error.status = 500;
      next(error);
    }
  },
};


export default accountController;