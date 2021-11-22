import { Document } from "mongoose";

export enum ParticipationErrorType {
  add_error = "add_error",
  complete_error = "complete_error",
  remove_error = "remove_error",
}

export interface GeometryObject {
  lat: number;
  lng: number;
}

export interface ServiceError {
  kind: ParticipationErrorType;
  message: string;
}

export interface MongooseIDParam {
  id: string;
}

export interface CustomExpressError {
  name: string;
  status: number;
  message: string;
  kind: string;
}
export interface ParticipationExtraData {
  userId: string;
  requestType: ParticipationRequestType;
}

export enum ParticipationRequestType {
  ADD_PARTICIPATION = "add_participation",
  COMPLETE_EVENT = "complete_event",
  REMOVE_PARTICIPATION = "remove_participation",
}

export interface HealthCheckObject {
  herokuConnectionWorking: boolean;
  usersAmount: number;
  message: string;
}

export enum UserType {
  BASIC = "basic",
  HOST = "host",
  ADMIN = "admin",
}

export interface MongooseUserObject extends Document {
  username: string;
  email: string;
  passwordData: string; // 1. Parse request body password. 2. turn it into hash data and then save
  type: UserType;
  approParticipations: MongooseEventGroupObject[];
}

// If we attempt to create MongooseUserObject, then it will complain about a ton of missing types we want mongoose itself to implement on user creation
export type BaseUserObject = Pick<
  MongooseUserObject,
  "username" | "email" | "type" | "passwordData"
>;

export interface MongooseEventObject extends Document {
  name: string;
  location: string;
  point: GeometryObject;
  participants: MongooseUserObject[];
  completedParticipants: MongooseUserObject[];
}

export type BaseEventObject = Pick<
  MongooseEventObject,
  "name" | "location" | "point"
>;

// Could probably move name, startDate and endDate to 1, extentable interface
export interface MongooseEventGroupObject extends Document {
  name: string;
  startDate: string;
  endDate: string;
  host: MongooseUserObject;
  events: MongooseEventObject[];
  participants: MongooseUserObject[];
}

// Pick doesn't really work like with user and event (required events type is different)
export interface BaseEventGroupObject {
  name: string;
  startDate: string;
  endDate: string;
  userId: string;
  events: BaseEventObject[];
}
