import mongoose from "mongoose";
import { EVENT_DOCUMENT_REF, USER_DOCUMENT_REF } from "../constants";
import { MongooseEventObject } from "../types";

const geometryPointSchema = new mongoose.Schema({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
});

// TODO: Max size of users for single event at once?
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    point: { type: geometryPointSchema },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_REF },
    ], // TODO: Check if this field is even necessary
    completedParticipants: [
      { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_REF },
    ],
  },
  { timestamps: true }
);

eventSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc: unknown, converted: { _id: unknown; __v: unknown }) => {
    delete converted.__v;
    delete converted._id;
  },
});

export default mongoose.model<MongooseEventObject>(
  EVENT_DOCUMENT_REF,
  eventSchema
);
