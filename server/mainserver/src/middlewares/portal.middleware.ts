import multer from "multer";
import path from "path";
import fs from "fs";
import { existsSync, mkdirSync } from "fs";
import Xrequest from "../interfaces/extensions.interface";

function arraifySeperateUploads(attachmentsFolder: string) {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        return cb(null, attachmentsFolder);
      },
      filename: function (req:Xrequest, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        const filePath = path.join(attachmentsFolder, filename);
        req.attachments = req.attachments || {};
        req.attachments[file.fieldname] = filePath.replaceAll("..","").replaceAll("\\","/").replaceAll("mainserver","");
        return cb(null, filename);
      },
    });

    const config = multer({
      storage: storage,
      limits: {
        /* Set a 9MB limit on each file */
        fieldSize: 20 * 1024 * 1024,
      },
    });
    return config;
  } catch (error) {
    console.log("Media Error ", error);
    throw error;
  }
}

function createfolder(folderUrl: string) {
  console.log("Checking if public directory exists:", folderUrl);
  if (!existsSync(folderUrl)) {
    console.log("Directory does not exist, creating:", folderUrl);
    try {
      mkdirSync(folderUrl, { recursive: true });
      console.log("Directory created successfully");
    } catch (err) {
      console.error("Error creating directory:", err);
    }
  } else {
    console.log("Directory already exists:", folderUrl);
  }
}

export function getMulterConfig() {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate2 = `${day}-${month}-${year}`;

  let attachmentsFolder = `../mainserver/public/agent-attachments/${formattedDate2}`;
  createfolder(attachmentsFolder);
  const multerConfig = arraifySeperateUploads(attachmentsFolder);
  return multerConfig.fields([
    { name: "certificate" },
    { name: "resume", maxCount: 1 },
    { name: "nationalId", maxCount: 1 },
    { name: "g1nationalId", maxCount: 1},
    { name: "g2nationalId", maxCount: 1}
  ]);
}
