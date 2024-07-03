import express from "express";
import { getMulterConfig } from "../../middlewares/portal.middleware";
import portalController from "../../controllers/v1/Portal/portal.controller";


const portalRouter = express.Router();

portalRouter.post("/create-agent", getMulterConfig(), portalController.createAgent);

export default portalRouter;