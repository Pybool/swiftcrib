import JWT from "jsonwebtoken";
import createError from "http-errors";
import { NextFunction, Response } from "express";
import Xrequest from "../interfaces/extensions.interface";

const jwthelper = {
  signAccessToken: (accountId: string, type = "") => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.SWIFTCRIB_ACCESS_TOKEN_SECRET as string;
      const options = {
        expiresIn: "6000000s",
        issuer: process.env.SWIFTCRIB_ISSUER,
        audience: accountId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    }).catch((error: any) => {
      console.log(error);
      throw error;
    });
  },
  verifyAccessToken: (req: Xrequest, res: Response, next: NextFunction) => {
    try {
      if (!req.headers["authorization"])
        return next(createError.Unauthorized());
      const authHeader = req.headers["authorization"];
      const bearerToken = authHeader.split(" ");
      const token = bearerToken[1];
      JWT.verify(
        token,
        process.env.SWIFTCRIB_ACCESS_TOKEN_SECRET as string,
        (err: any, payload: any) => {
          if (err) {
            const message =
              err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return next(createError.Unauthorized(message));
          }
          req.payload = payload;
          next();
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  signRefreshToken: (accountId: string) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.SWIFTCRIB_REFRESH_TOKEN_SECRET as string;
      const options = {
        expiresIn: "72h",
        issuer: process.env.SWIFTCRIB_ISSUER,
        audience: accountId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    }).catch((error: any) => {
      console.log(error);
      throw error;
    });
  },

  verifyRefreshToken: (refreshToken: string, next: any) => {
    return new Promise((resolve: any, reject: any) => {
      JWT.verify(
        refreshToken,
        process.env.SWIFTCRIB_REFRESH_TOKEN_SECRET as string,
        (err: any, payload: any) => {
          if (err) {
            const message =
              err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            resolve({ aud: false });
          }
          resolve(payload);
        }
      );
    }).catch((error: any) => {
      console.log(error);
      throw error;
    });
  },
};

export default jwthelper;
