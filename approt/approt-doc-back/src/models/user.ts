import mongoose from "mongoose";
import { EVENT_GROUP_DOCUMENT_REF, USER_DOCUMENT_REF } from "../constants";
import { MongooseUserObject, UserType } from "../types";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String }, // TODO: Create input in frontend
    passwordData: { type: String, required: true },
    type: { type: String, enum: Object.values(UserType) }, // TODO: Handle this
    approParticipations: [
      { type: mongoose.Schema.Types.ObjectId, ref: EVENT_GROUP_DOCUMENT_REF },
    ],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (
    _doc: unknown,
    converted: { passwordData: unknown; _id: unknown; __v: unknown }
  ) => {
    delete converted.__v;
    delete converted._id;
    delete converted.passwordData; // Do not reveal passwordData/passwordHash in response
  },
});

export default mongoose.model<MongooseUserObject>(
  USER_DOCUMENT_REF,
  userSchema
);
