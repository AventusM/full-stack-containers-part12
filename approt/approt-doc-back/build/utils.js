"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// For parsing input data e.g.
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const isNumber = (param) => {
    return typeof param === "number" || param instanceof Number;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isParticipationRequestType = (type) => {
    return Object.values(types_1.ParticipationRequestType).includes(type);
};
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
const isPoint = (pointObject) => {
    return ("lat" in pointObject &&
        "lng" in pointObject &&
        isNumber(pointObject.lat) &&
        isNumber(pointObject.lng));
};
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
// TODO: DO CHECK THE -90 // 90 and -180 // 180 LIMITS
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error("Invalid date provided");
    }
    return date;
};
const parseParamToRequestType = (param) => {
    if (!param || !isParticipationRequestType(param)) {
        throw new Error("Invalid participation type given");
    }
    return param;
};
const parseString = (param, identifier) => {
    if (!param || !isString(param)) {
        throw new Error(`Incorrect or missing ${identifier}`);
    }
    return param;
};
// Receives an array of base event data
const parseEvents = (object) => {
    if (!object || object.length === 0) {
        throw new Error("Events parameter empty or missing");
    }
    const parsedEventBaseObjects = object.map((event) => toEventBase(event));
    return parsedEventBaseObjects;
};
const parsePointData = (param) => {
    if (!param || !isPoint(param)) {
        throw new Error("Invalid point data provided");
    }
    return param;
};
const toUsernamePassword = (object) => {
    return {
        username: parseString(object.username, "username"),
        password: parseString(object.password, "password"),
    };
};
const toUserBase = (object) => {
    return {
        username: parseString(object.username, "username"),
        email: "TODO THIS",
        type: types_1.UserType.BASIC,
        passwordData: parseString(object.password, "password"),
    };
};
const toEventBase = (object) => {
    return {
        name: parseString(object.name, "event name"),
        location: parseString(object.location, "event location"),
        point: parsePointData(object.point),
    };
};
const toParticipationExtraData = (object) => {
    return {
        userId: parseString(object.userId, "userId"),
        requestType: parseParamToRequestType(object.requestType),
    };
};
const toStringIdFromParamRequest = (object) => {
    return {
        id: parseString(object.id, "id"),
    };
};
const toEventGroupBase = (object) => {
    return {
        userId: parseString(object.userId, "userId"),
        name: parseString(object.name, "name"),
        startDate: parseDate(object.startDate),
        endDate: parseDate(object.endDate),
        events: parseEvents(object.events),
    };
};
exports.default = {
    toUserBase,
    toEventBase,
    toParticipationExtraData,
    toUsernamePassword,
    toStringIdFromParamRequest,
    toEventGroupBase,
};
