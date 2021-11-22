"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const event_1 = __importDefault(require("../models/event"));
const types_1 = require("../types");
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const allEvents = yield event_1.default.find({})
        .populate(constants_1.EVENTS_PARTICIPANTS_FIELD, {
        username: constants_1.PICK_FIELD,
    })
        .populate(constants_1.EVENTS_COMPLETED_PARTICIPANTS_FIELD, { username: constants_1.PICK_FIELD });
    return allEvents;
});
const createEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const newEvent = yield event_1.default.create({
        name: event.name,
        location: event.location,
        point: event.point,
        participants: constants_1.EMPTY_ARRAY,
        completedParticipants: constants_1.EMPTY_ARRAY, // Initially empty
    });
    return newEvent;
});
const findEventByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const foundEvent = yield event_1.default.findOne({ name }).exec();
    return Promise.resolve(foundEvent);
});
const findEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const foundEvent = yield event_1.default.findById(eventId)
        .populate(constants_1.EVENTS_PARTICIPANTS_FIELD, { username: constants_1.PICK_FIELD })
        .populate(constants_1.EVENTS_COMPLETED_PARTICIPANTS_FIELD, { username: constants_1.PICK_FIELD });
    return foundEvent;
});
const addUserToEvent = (event, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Do not allow multiple registrations to a single event by a user
    // non-populated participants data --> participants consist of participant id's by default
    const userIsAlreadyRegistered = event.participants.find((participantData) => {
        var _a, _b;
        const stringParticipantId = (_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString();
        const stringUserId = (_b = user.id) === null || _b === void 0 ? void 0 : _b.toString();
        const match = stringParticipantId === stringUserId;
        return match;
    });
    if (userIsAlreadyRegistered) {
        return {
            kind: types_1.ParticipationErrorType.add_error,
            message: "User already registered to the event",
        };
    }
    event.participants = event.participants.concat(user._id); // User to the specific event
    const updatedEvent = yield event.save();
    return updatedEvent;
});
const completeEvent = (event, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userParticipating = event.participants.find((participantData) => {
        var _a, _b;
        const stringParticipantId = (_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString();
        const stringUserId = (_b = user.id) === null || _b === void 0 ? void 0 : _b.toString();
        const match = stringParticipantId === stringUserId;
        return match;
    });
    // Allow user to have 1 completion per event
    // non-populated participants data --> participants consist of participant id's by default
    const userHasAlreadyCompletedEvent = event.completedParticipants.find((participantData) => {
        var _a, _b;
        const stringParticipantId = (_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString();
        const stringUserId = (_b = user.id) === null || _b === void 0 ? void 0 : _b.toString();
        const match = stringParticipantId === stringUserId;
        return match;
    });
    if (!userParticipating) {
        return {
            kind: types_1.ParticipationErrorType.complete_error,
            message: "User not in participants list!",
        };
    }
    if (userHasAlreadyCompletedEvent) {
        return {
            kind: types_1.ParticipationErrorType.complete_error,
            message: "User has already finished the event!",
        };
    }
    event.completedParticipants = event.completedParticipants.concat(user._id); // User to the list of finished participants
    const updatedEvent = yield event.save();
    return updatedEvent;
});
const removeUserFromEvent = (event, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userIsAlreadyRegistered = event.participants.find((participantData) => {
        var _a, _b;
        const stringParticipantId = (_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString();
        const stringUserId = (_b = user.id) === null || _b === void 0 ? void 0 : _b.toString();
        const match = stringParticipantId === stringUserId;
        return match;
    });
    const userHasAlreadyCompletedEvent = event.completedParticipants.find((participantData) => {
        var _a, _b;
        const stringParticipantId = (_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString();
        const stringUserId = (_b = user.id) === null || _b === void 0 ? void 0 : _b.toString();
        const match = stringParticipantId === stringUserId;
        return match;
    });
    // Remove only if participating AND hasn't yet completed the event
    if (!userIsAlreadyRegistered) {
        return {
            kind: types_1.ParticipationErrorType.remove_error,
            message: "User isnt registered to the event!",
        };
    }
    if (userHasAlreadyCompletedEvent) {
        return {
            kind: types_1.ParticipationErrorType.remove_error,
            message: "User has already finished the event!",
        };
    }
    event.participants = event.participants.filter((participantData) => { var _a, _b; return ((_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = user.id) === null || _b === void 0 ? void 0 : _b.toString()); });
    const updatedEventData = yield event.save();
    return updatedEventData;
});
const deleteEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const removedEvent = yield event_1.default.findByIdAndRemove(eventId);
    return removedEvent;
});
exports.default = {
    getAll,
    createEvent,
    findEvent,
    addUserToEvent,
    completeEvent,
    removeUserFromEvent,
    deleteEvent,
    findEventByName,
};
