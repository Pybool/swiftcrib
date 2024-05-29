import express from "express";
import http from "http";
import "./setup/init.redis";
import "./setup/init.mongo";
// import "./setup/kafkaProducer";
import cors from "./setup/cors";
import { config as dotenvConfig } from "dotenv";
import logger from "./setup/logger";
import session from "express-session";
import passport from "passport";
import app from "./setup/_app";
import { existsSync, mkdirSync } from 'fs';
dotenvConfig();
dotenvConfig({path:`.env.${process.env.NODE_ENV}`});

function createfolder(folderUrl: string) {
  console.log('Checking if public directory exists:', folderUrl);
  if (!existsSync(folderUrl)) {
      console.log('Directory does not exist, creating:', folderUrl);
      try {
          mkdirSync(folderUrl, { recursive: true });
          console.log('Directory created successfully');
      } catch (err) {
          console.error('Error creating directory:', err);
      }
  } else {
      console.log('Directory already exists:', folderUrl);
  }
}
createfolder(process.env.PUBLIC_FOLDER!)


const SERVER_URL = "0.0.0.0";
// Store WebSocket connections in a map
app.use(cors);
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(express.json({ limit: "100mb" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(process.env.PUBLIC_FOLDER!));

// app.use("/api/v1/authentication", AuthRoute);

app.use((err:any, req:any, res:any, next:any) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  res.status(500).json({ error: 'Something went wrong 5xx' });
});

app.use(function (err:any, req:any, res:any, next:any) {
  
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'dev' ? err : {};
  res.status(err.status || 500);
  res.json({"message": 'Something went wrong 5xx ' + err});
});


if (!process.env.NODE_ENV){
  process.exit(1)
}

app.use((req, res, next) => {
  const error: any = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 404) {
    res.status(404).json({ status: false, message: err.message });
  } else {
    next(err);
  }
});

app.set("view engine", "ejs");
app.set("views", "src/views/templates");


const server = http.createServer(app);
const PORT = 8000 || process.env.MAIN_SERVER_PORT || 8000;

let environment = "Development"
if(process.env.NODE_ENV=== 'prod'){
  environment = "Production"
}

function generateAsciiArt(text: string) {
  const length = text.length;
  const line = Array(length + 8)
    .fill("-")
    .join("");
  const emptyLine = "|" + " ".repeat(length + 6) + "|";

  return `
 ${line}
|  ${text}  |
|  😊 ${environment} Server started successfully.  |
|  🎧 Listening on port ${PORT}...  |
 ${line}
`;
}

server.listen(PORT, () => {
  const serverMessage = generateAsciiArt(
    `Swiftcrib ${environment} Server is running on ${SERVER_URL}:${PORT}`.toUpperCase()
  );
  logger.info(serverMessage);
});
