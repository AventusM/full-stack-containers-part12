/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from "express";
import {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  UNAUTHORIZED_CODE,
} from "../constants";
import {
  CustomExpressError,
  ParticipationErrorType,
  ServiceError,
} from "../types";

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(NOT_FOUND_CODE).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: CustomExpressError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "CastError" && error.kind === "ObjectId") {
    res.status(BAD_REQUEST_CODE).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(BAD_REQUEST_CODE).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    res
      .status(UNAUTHORIZED_CODE)
      .send({ error: "invalid or missing jwt token" });
  }

  next(error);
};

const eventErrorHandler = (
  error: ServiceError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.values(ParticipationErrorType).includes(error.kind)) {
    res.status(BAD_REQUEST_CODE).send({ message: error.message });
  }

  next(error);
};

export default { unknownEndpoint, errorHandler, eventErrorHandler };
