import { NextFunction, Response } from "express";
import Xrequest from "../../../../interfaces/extensions.interface";
import { SocialAuthentication } from "../../../../services/v1/Accounts/authentication.social.service";
import { ISocialAuth } from "../../../../interfaces/auth.interface";

export const socialAuthController: ISocialAuth = {
  googleAuthenticate: async (req: Xrequest, res: Response, next: NextFunction) => {
    let status = 200;
    try {
      const result = await SocialAuthentication.googleAuthenticate(req);
      if (result.status) {
        res.status(status).json(result);
      } else {
        return res.status(422).json(result);
      }
    } catch (error: any) {
      console.log("Google Authentication error ", error.message);
      status = 500
      res.status(status).json({ status: false, message: error?.message });
    }
  },

  twitterAuthenticate: async (req: Xrequest, res: Response, next: NextFunction) => {
    let status = 200;
    try {
      const result = await SocialAuthentication.twitterAuthenticate(req);
      if (result.status) {
        res.status(status).json(result);
      } else {
        return res.status(422).json(result);
      }
    } catch (error: any) {
      console.log("Twitter Authentication error ", error.message);
      status = 500
      res.status(status).json({ status: false, message: error?.message });
    }
  },

  appleAuthenticate: async (req: Xrequest, res: Response, next: NextFunction) => {
    let status = 200;
    try {
      const result:any = await SocialAuthentication.appleAuthenticate(req)!;
      if (result?.status) {
        res.status(status).json(result);
      } else {
        return res.status(422).json(result);
      }
    } catch (error: any) {
      console.log("Apple Authentication error ", error.message);
      status = 500
      res.status(status).json({ status: false, message: error?.message });
    }
  },
};
