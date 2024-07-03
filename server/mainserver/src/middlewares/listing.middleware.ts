import multer from "multer";
import path from "path";
import fs from "fs";
import { existsSync, mkdirSync } from "fs";
import Xrequest from "../interfaces/extensions.interface";
import sharp from "sharp";
const { v4: uuidv4 } = require("uuid");

function cleanPath(path: string) {
  return path
    .replaceAll("..", "")
    .replaceAll("\\", "/")
    .replaceAll("mainserver", "")
    .replaceAll("//public", "");
}

function arraifyUploads(attachmentsFolder: string) {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, attachmentsFolder);
      },
      filename: function (req: Xrequest, file, cb) {
        const uniqueFilename = `${uuidv4()}-${file.originalname}`;
        const filePath = path.join(attachmentsFolder, uniqueFilename);
        req.attachments = req.attachments || [];
        let mediaType = "image";
        if (file.mimetype.includes("video")) {
          mediaType = "video";
        }
        req.attachments.push({ type: mediaType, url: cleanPath(filePath) });
        cb(null, uniqueFilename);
      },
    });

    const config = multer({
      storage: storage,
      limits: {
        fieldSize: 20 * 1024 * 1024, // 9MB limit
      },
      // fileFilter: this.attachmentsFilter,
    });

    return async (req: Xrequest, res: any, next: any) => {
      const upload = config.array(
        "attachments",
        parseInt(process.env.SWIFTCRIB_MAX_IMAGES || "3")
      );

      upload(req, res, async (err) => {
        if (err) {
          console.error("Error during upload:", err);
          return res.status(500).send("Error during upload.");
        }
        // Resize images using Sharp
        if (req.files && req.files.length > 0) {
          await Promise.all(
            req.files.map(async (file: any) => {
              const filePath = path.join(attachmentsFolder, file.filename);
              const tempFilePath = `${filePath}-temp`;
              try {
                if (file.mimetype.includes("image")) {
                  await sharp(filePath).resize(450, 300).toFile(tempFilePath);
                  fs.renameSync(tempFilePath, filePath + "-450x300.png");
                }
              } catch (error: any) {
                console.log(error);
              }
            })
          );
        }

        next();
      });
    };
  } catch (error) {
    console.error("Error during upload:", error);
    throw error; 
  }
}

function createfolder(folderUrl: string) {
  if (!existsSync(folderUrl)) {
    try {
      mkdirSync(folderUrl, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
    }
  }
}

export function getMulterConfig(folderUrl: string) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate2 = `${day}-${month}-${year}`;
  let attachmentsFolder = folderUrl + `${formattedDate2}`;
  createfolder(attachmentsFolder);
  const multerConfig = arraifyUploads(attachmentsFolder);
  return multerConfig;
}
