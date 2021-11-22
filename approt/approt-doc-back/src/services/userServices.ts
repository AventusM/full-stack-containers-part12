import bcrypt from "bcrypt";
import User from "../models/user";
import {
  BCRYPT_SALT_ROUNDS_DEFAULT,
  PICK_FIELD,
  APPRO_PARTICIPATIONS_FIELD,
  EMPTY_ARRAY,
} from "../constants";
import { BaseUserObject, MongooseUserObject } from "../types";

const getAll = async (): Promise<MongooseUserObject[]> => {
  const allUsers = await User.find({}).populate(APPRO_PARTICIPATIONS_FIELD, {
    name: PICK_FIELD,
  });
  return allUsers;
};

const createUser = async (
  user: BaseUserObject
): Promise<MongooseUserObject> => {
  const passwordHash = await bcrypt.hash(
    user.passwordData,
    BCRYPT_SALT_ROUNDS_DEFAULT
  );

  const newUser = await User.create({
    username: user.username,
    email: user.email,
    type: user.type,
    passwordData: passwordHash,
    approParticipations: EMPTY_ARRAY,
  });

  return newUser;
};

const findUser = async (userId: string): Promise<MongooseUserObject | null> => {
  const foundUser = await User.findById(userId).populate(
    APPRO_PARTICIPATIONS_FIELD,
    {
      name: PICK_FIELD,
    }
  );
  return foundUser;
};

const findUserByUsername = async (
  username: string
): Promise<MongooseUserObject | null> => {
  const foundUser = await User.findOne({
    username,
  }).populate(APPRO_PARTICIPATIONS_FIELD, { name: PICK_FIELD });
  return foundUser;
};

export default { getAll, createUser, findUser, findUserByUsername };
