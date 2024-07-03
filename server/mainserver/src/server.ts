import express from "express";
import http from "http";
import "./setup/init.redis";
import "./setup/init.mongo";
import cors, { CorsOptions } from "cors";
import { config as dotenvConfig } from "dotenv";
import logger from "./setup/logger";
import session from "express-session";
import passport from "passport";
import app from "./setup/_app";
import authRouter from "./routes/v1/authentication.route";
import portalRouter from "./routes/v1/portal.route";
import listingRouter from "./routes/v1/listing.route";
import spaceRouter from "./routes/v1/space.routes";
import { getUserCountry } from "./helpers/misc";
import devCreateListings from "./development";
import development from "./development";
dotenvConfig();
dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });

const SERVER_URL = "0.0.0.0";
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.env.SWIFTCRIB_PUBLIC_FOLDER!));
app.get('/test', (req:any, res:any) => {
  res.status(200).send('Hello from Swiftcrib Backend Server\n');
});

app.get("/ip", async (req, res) => {
  const result = await getUserCountry(req);
  res.send({
    status: true,
    data: result,
  });
});

app.get("/dev-create-listings", async (req, res) => {
  const result = await development.devCreateListings();
  res.send({
    status: true,
    data: result,
  });
});

app.get("/add-beds-baths", async (req, res) => {
  const result = await development.addPriceBedAndBaths();
  res.send({
    status: true,
    data: result,
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/portal", portalRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/api/v1/space", spaceRouter);



app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  res.status(500).json({ error: "Something went wrong 5xx" });
});

app.use(function (err: any, req: any, res: any, next: any) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "dev" ? err : {};
  res.status(err.status || 500);
  res.json({ message: "Something went wrong 5xx " + err });
});

if (!process.env.NODE_ENV) {
  process.exit(1);
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
const PORT = process.env.SWIFTCRIB_MAIN_SERVER_PORT || 8000;

let environment = "Development";
if (process.env.NODE_ENV === "prod") {
  environment = "Production";
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
