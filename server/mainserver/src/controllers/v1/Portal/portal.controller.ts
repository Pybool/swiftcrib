import { Response } from "express";
import Xrequest from "../../../interfaces/extensions.interface";
import { PortalService } from "../../../services/v1/Accounts/portal.service";

const portalController: any = {
  createAgent: async (req: Xrequest, res: Response) => {
    try {
      const { data } = req.body;
      console.log("Received JSON data:", JSON.parse(data)); // Parse the JSON string
      req.body = JSON.parse(data);
      const result = await PortalService.createAgent(req);
      if (result.status) {
        return res
          .status(200)
          .json(result);
      }
      return res
        .status(422)
        .json({
          status: false,
          message: "Could not create agent at this time",
        });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error?.message,
      });
    }
  },
};

export default portalController;
