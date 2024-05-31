import { NextFunction, Response } from "express";
import { Authentication } from "../../../../services/v1/Accounts/authentication.local.service";
import { IAuth } from "../../../../interfaces/auth.interface";
import Xrequest from "../../../../interfaces/extensions.interface";
import message from "../../../../helpers/messages";

const authController: IAuth = {
    createAccount: async (req: Xrequest, res: Response, next: NextFunction) => {
      let status = 200;
      try {
        const authentication = new Authentication(req);
        const result = await authentication.createAccount();
        if (result.status) {
          status = 201;
          res.status(status).json(result);
        } else {
          console.log("result ", result);
          return res.status(200).json(result);
        }
      } catch (error: any) {
        console.log("Auth error ", error.message);
        if (error.isJoi === true) {
          error.status = 422;
        }
        res.status(status).json({ status: false, message: error?.message });
      }
    },
  
    sendPasswordResetLink: async (
      req: Xrequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        let status = 400;
        const authentication = new Authentication(req);
        const result = await authentication.sendPasswordResetLink();
        if (result.status) status = 200;
        res.status(status).json(result);
      } catch (error: any) {
        if (error.isJoi === true) error.status = 422;
        next(error);
      }
    },
  
    sendEmailConfirmationOtp: async (
      req: Xrequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        let status = 200;
        const authentication = new Authentication(req);
        const result: any = await authentication.sendEmailConfirmationOtp();
        if (!result.status) status = 400;
        res.status(status).json(result);
      } catch (error: any) {
        if (error.isJoi === true) error.status = 422;
        next(error);
      }
    },
  
    resetPassword: async (req: Xrequest, res: Response, next: NextFunction) => {
      console.log("reset password token ", req.query.token);
      try {
        let status = 400;
        const authentication = new Authentication(req);
        const result = await authentication.resetPassword();
        if (result.status) status = 200;
        res.status(status).json(result);
      } catch (error: any) {
        if (error.isJoi === true) error.status = 422;
        next(error);
      }
    },
  
    verifyAccountEmail: async (req: Xrequest, res: Response, next: NextFunction) => {
      try {
        let status = 400;
        const authentication = new Authentication(req);
        const result = await authentication.verifyAccountEmail();
        if (result.status) status = 200;
        res.status(status).json(result);
      } catch (error: any) {
        error.status = 422;
        next(error);
      }
    },
  
    loginAccount: async (req: Xrequest, res: Response, next: NextFunction) => {
      try {
        let status = 400;
        const authentication = new Authentication(req);
        const result = await authentication.loginAccount();
        status = 200;
        return res.status(status).json(result);
      } catch (error: any) {
        if (error.isJoi === true) {
          res
            .status(400)
            .json({ status: false, message: message.auth.invalidCredentials });
        } else {
          res
            .status(400)
            .json({ status: false, message: "Could not process login request!" });
        }
      }
    },
  
    getRefreshToken: async (req: Xrequest, res: Response, next: NextFunction) => {
      try {
        let status = 400;
        const authentication = new Authentication(req);
        if (req.body.refreshToken == "") {
          res.status(200).json({ status: false });
        }
        const result = await authentication.getRefreshToken(next);
        if (result) status = 200;
        res.status(status).json(result);
      } catch (error: any) {
        error.status = 422;
        next(error);
      }
    },
  };

export default authController;
