import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import nunjucks from "nunjucks";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import chalk from "chalk";

import allRouters from "./routes";
import envData from "./config";
import middlewares from "./middlewares";

import {
  USERS_API_PATH,
  EVENTS_API_PATH,
  EVENTGROUPS_API_PATH,
  LOGIN_API_PATH,
  HEALTHCHECK_API_PATH,
} from "./constants";

mongoose
  .connect(envData.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((_result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("error connecting to MongoDB:", error.message);
  });

const app = express();
app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Can serve as a basic logger. Probably should use some middleware for objects though.
app.use(
  morgan(
    chalk`:method :url {green :status} :response-time ms - :res[content-length]`
  )
);

// api/users requires a token in most cases, but isn't set explicitly on user creation (when registering a new user)
app.use(USERS_API_PATH, allRouters.userRouter);
app.use(LOGIN_API_PATH, allRouters.loginRouter);

// Routes below require a token at all times
//app.use(middlewares.tokenMiddleware.tokenExtractor);
app.use(HEALTHCHECK_API_PATH, allRouters.healthCheckRouter);
app.use(EVENTS_API_PATH, allRouters.eventRouter);
app.use(EVENTGROUPS_API_PATH, allRouters.eventGroupRouter);

// Error handling after all routes
app.use(middlewares.routeErrorMiddleware.errorHandler);
app.use(middlewares.routeErrorMiddleware.eventErrorHandler);
app.use(middlewares.routeErrorMiddleware.unknownEndpoint);

app.listen(envData.PORT, () => {
  console.log(`Server running on port ${envData.PORT}`);
});
