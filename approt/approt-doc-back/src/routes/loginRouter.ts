import express from "express";
const router = express.Router();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { NOT_FOUND_CODE, UNAUTHORIZED_CODE } from "../constants";
import services from "../services";
import utils from "../utils";
import envData from "../config";

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = utils.toUsernamePassword(req.body);
    const foundUser = await services.userServices.findUserByUsername(username);

    if (!foundUser) {
      res.status(NOT_FOUND_CODE).send({ error: "User not found" });
    } else {
      const passwordCorrect = await bcrypt.compare(
        password,
        foundUser.passwordData
      );

      if (!passwordCorrect) {
        res.status(UNAUTHORIZED_CODE).send({ error: "Invalid password" });
      }

      const userForToken = {
        username: foundUser.username,
        id: foundUser.id,
      };

      const token = jwt.sign(userForToken, envData.SECRET);
      res.send({ token, username: foundUser.username, userId: foundUser.id });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
