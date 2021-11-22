/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// The jsonwebtoken library has an ongoing situation with incomplete types, causing to ignore multiple complaints by eslint

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envData from "../config";
import { UNAUTHORIZED_CODE } from "../constants";

const getTokenFrom = (req: Request) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return "";
};

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFrom(req);
  const decodedToken = <any>jwt.verify(token, envData.SECRET);
  if (!token || !decodedToken.id) {
    res.status(UNAUTHORIZED_CODE).send({ error: "Token missing or invalid" });
  }
  next();
};

export default { tokenExtractor };
