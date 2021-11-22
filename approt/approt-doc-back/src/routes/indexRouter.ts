import express from "express";
import {
  USERS_API_PATH,
  EVENTS_API_PATH,
  EVENTGROUPS_API_PATH,
} from "../constants";

const router = express.Router();

const pathArray = [
  { link: USERS_API_PATH },
  { link: EVENTS_API_PATH },
  { link: EVENTGROUPS_API_PATH },
];

router.get("/", (_req, res) => {
  res.render("index.njk", { pathArray });
});

export default router;
