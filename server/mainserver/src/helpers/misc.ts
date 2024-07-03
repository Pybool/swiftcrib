import { getCountryNameByCode } from "./countries";
import geoip from "geoip-lite";
import { getCountryCurrencyByCountryCode } from "./currenciesCountryCodes";

export const generateOtp = () => {
  const otp: number = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const slugify = (text: string) => {
  return text
    .toString() 
    .toLowerCase() 
    .trim()
    .replace(/[\s\W-]+/g, "-") 
    .replace(/^-+|-+$/g, "");
};

export const getUserCountry = (req: any) => {
  try {
    let geoData = geoip.lookup(req.ip) as any;
    const countryCode = geoData.country;
    geoData.country = getCountryNameByCode(countryCode);
    geoData.currency = getCountryCurrencyByCountryCode(countryCode);
    geoData.countryCode = countryCode;

    if (geoData) {
      return {
        geoData,
        connectionRemoteAddress: req.connection.remoteAddress,
        reqIp: req.ip,
        socketRemoteAddress: req.socket.remoteAddress,
        forwardedIp: req.headers["x-forwarded-for"],
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    return null;
  }
};
