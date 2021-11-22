/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// For parsing input data e.g.

import {
  BaseEventGroupObject,
  BaseEventObject,
  BaseUserObject,
  GeometryObject,
  MongooseIDParam,
  ParticipationExtraData,
  ParticipationRequestType,
  UserType,
} from "./types";

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isNumber = (param: any): param is number => {
  return typeof param === "number" || param instanceof Number;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isParticipationRequestType = (
  type: any
): type is ParticipationRequestType => {
  return Object.values(ParticipationRequestType).includes(type);
};

// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
const isPoint = (pointObject: any): pointObject is GeometryObject => {
  return (
    "lat" in pointObject &&
    "lng" in pointObject &&
    isNumber(pointObject.lat) &&
    isNumber(pointObject.lng)
  );
};
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Invalid date provided");
  }
  return date;
};

const parseParamToRequestType = (param: any): ParticipationRequestType => {
  if (!param || !isParticipationRequestType(param)) {
    throw new Error("Invalid participation type given");
  }
  return param;
};

const parseString = (param: any, identifier: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${identifier}`);
  }

  return param;
};

// Receives an array of base event data
const parseEvents = (object: any[]): BaseEventObject[] => {
  if (!object || object.length === 0) {
    throw new Error("Events parameter empty or missing");
  }

  const parsedEventBaseObjects = object.map((event) => toEventBase(event));
  return parsedEventBaseObjects;
};

const parsePointData = (param: any): GeometryObject => {
  if (!param || !isPoint(param)) {
    throw new Error("Invalid point data provided");
  }

  return param;
};

const toUsernamePassword = (object: any) => {
  return {
    username: parseString(object.username, "username"),
    password: parseString(object.password, "password"),
  };
};

const toUserBase = (object: any): BaseUserObject => {
  return {
    username: parseString(object.username, "username"),
    email: "TODO THIS", //parseEmail(object.email),
    type: UserType.BASIC, //TODO VALIDATION!!!! parseUserType(object.type),
    passwordData: parseString(object.password, "password"),
  };
};

const toEventBase = (object: any): BaseEventObject => {
  return {
    name: parseString(object.name, "event name"),
    location: parseString(object.location, "event location"),
    point: parsePointData(object.point),
  };
};

const toParticipationExtraData = (object: any): ParticipationExtraData => {
  return {
    userId: parseString(object.userId, "userId"),
    requestType: parseParamToRequestType(object.requestType),
  };
};

const toStringIdFromParamRequest = (object: any): MongooseIDParam => {
  return {
    id: parseString(object.id, "id"),
  };
};

const toEventGroupBase = (object: any): BaseEventGroupObject => {
  return {
    userId: parseString(object.userId, "userId"),
    name: parseString(object.name, "name"),
    startDate: parseDate(object.startDate),
    endDate: parseDate(object.endDate),
    events: parseEvents(object.events),
  };
};

export default {
  toUserBase,
  toEventBase,
  toParticipationExtraData,
  toUsernamePassword,
  toStringIdFromParamRequest,
  toEventGroupBase,
};
