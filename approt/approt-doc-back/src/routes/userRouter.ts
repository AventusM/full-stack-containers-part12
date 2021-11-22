import express from "express";
import { NOT_FOUND_CODE } from "../constants";
//import middlewares from "../middlewares";
import services from "../services/";
import utils from "../utils";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = utils.toStringIdFromParamRequest(req.params);
    const foundUser = await services.userServices.findUser(id);

    if (!foundUser) {
      res.status(NOT_FOUND_CODE).send({ error: "User not found" });
    } else {
      res.send(foundUser.toJSON());
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const data = await services.userServices.getAll();
    res.send(data.map((user) => user.toJSON()));
  } catch (error) {
    next(error);
  }
});

// Registering a new user, no middleware required here
router.post("/", async (req, res, next) => {
  try {
    const parsedUserData = utils.toUserBase(req.body);
    const newUserData = await services.userServices.createUser(parsedUserData);
    res.send(newUserData.toJSON());
  } catch (error) {
    next(error);
  }
});

export default router;
