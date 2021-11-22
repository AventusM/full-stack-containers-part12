import express from "express";
import services from "../services/";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await services.healthCheckServices.getVitals();
    res.status(200).send({message: data.message})
  } catch (error) {
    next(error);
  }
});

export default router;
