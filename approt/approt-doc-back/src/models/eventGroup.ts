// Also known as 'Appro'
import mongoose from "mongoose";
import {
  EVENT_DOCUMENT_REF,
  EVENT_GROUP_DOCUMENT_REF,
  USER_DOCUMENT_REF,
} from "../constants";
import { MongooseEventGroupObject } from "../types";

const eventGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_REF },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: EVENT_DOCUMENT_REF }],
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_REF },
    ],
  },
  { timestamps: true }
);

eventGroupSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc: unknown, converted: { _id: unknown; __v: unknown }) => {
    delete converted.__v;
    delete converted._id;
  },
});

export default mongoose.model<MongooseEventGroupObject>(
  EVENT_GROUP_DOCUMENT_REF,
  eventGroupSchema
);
