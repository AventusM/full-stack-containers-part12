import express from "express";

import services from "../services/";
import utils from "../utils";

import { ParticipationRequestType } from "../types";
import { NOT_FOUND_CODE, NO_CONTENT_CODE } from "../constants";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = utils.toStringIdFromParamRequest(req.params);
    const foundEvent = await services.eventServices.findEvent(id);

    if (!foundEvent) {
      res.status(NOT_FOUND_CODE).send({ error: "Event not found" });
    } else {
      res.send(foundEvent.toJSON());
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const data = await services.eventServices.getAll();
    res.send(data.map((event) => event.toJSON()));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsedEventData = utils.toEventBase(req.body);
    const newEventData = await services.eventServices.createEvent(
      parsedEventData
    );
    res.send(newEventData.toJSON());
  } catch (error) {
    next(error);
  }
});

router.post("/:id/participation", async (req, res, next) => {
  try {
    const { id } = utils.toStringIdFromParamRequest(req.params);
    const { userId, requestType } = utils.toParticipationExtraData(req.body);

    const foundEvent = await services.eventServices.findEvent(id);
    const foundUser = await services.userServices.findUser(userId);

    if (!foundUser) {
      res.status(NOT_FOUND_CODE).send({ error: "User not found" });
    } else if (!foundEvent) {
      res.status(NOT_FOUND_CODE).send({ error: "Event not found" });
    }

    if (foundUser && foundEvent) {
      if (requestType === ParticipationRequestType.ADD_PARTICIPATION) {
        const result = await services.eventServices.addUserToEvent(
          foundEvent,
          foundUser
        );

        if ("kind" in result) {
          next(result);
        } else {
          res.json(result.toJSON());
        }
      } else if (requestType === ParticipationRequestType.COMPLETE_EVENT) {
        const result = await services.eventServices.completeEvent(
          foundEvent,
          foundUser
        );

        if ("kind" in result) {
          next(result);
        } else {
          res.json(result.toJSON());
        }
      } else {
        const result = await services.eventServices.removeUserFromEvent(
          foundEvent,
          foundUser
        );

        if ("kind" in result) {
          next(result);
        } else {
          res.json(result.toJSON());
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = utils.toStringIdFromParamRequest(req.params);
    await services.eventServices.deleteEvent(id);
    res.status(NO_CONTENT_CODE).end();
  } catch (error) {
    next(error);
  }
});

export default router;
