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
const eventGroup_1 = __importDefault(require("../models/eventGroup"));
const types_1 = require("../types");
const constants_1 = require("../constants");
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const allEventGroups = yield eventGroup_1.default.find({})
        .populate(constants_1.EVENTS_PARTICIPANTS_FIELD, { username: constants_1.PICK_FIELD })
        .populate(constants_1.EVENTS_FIELD, { name: constants_1.PICK_FIELD, point: constants_1.PICK_FIELD })
        .populate(constants_1.EVENT_HOST_FIELD, { username: constants_1.PICK_FIELD });
    return allEventGroups;
});
const findEventGroup = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const foundEventGroup = yield eventGroup_1.default.findById(id)
        .populate(constants_1.EVENTS_PARTICIPANTS_FIELD, { username: constants_1.PICK_FIELD })
        .populate(constants_1.EVENTS_FIELD, { name: constants_1.PICK_FIELD, point: constants_1.PICK_FIELD })
        .populate(constants_1.EVENT_HOST_FIELD, { username: constants_1.PICK_FIELD });
    return foundEventGroup;
});
const createEventGroup = (basicEventData, host, events) => __awaiter(void 0, void 0, void 0, function* () {
    const isDuplicateName = yield eventGroup_1.default.find({ name: basicEventData.name });
    if (isDuplicateName.length > 0) {
        throw new Error("Duplicate event name found! TODO: Check if unique names are needed");
    }
    const newEventGroup = yield eventGroup_1.default.create({
        name: basicEventData.name,
        startDate: basicEventData.startDate,
        endDate: basicEventData.endDate,
        host,
        events,
        participants: constants_1.EMPTY_ARRAY,
    });
    return newEventGroup;
});
const addUserToEventGroup = (eventGroup, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userIsAlreadyRegistered = eventGroup.participants.find((participantData) => {
        var _a, _b;
        const stringParticipantId = (_a = participantData.id) === null || _a === void 0 ? void 0 : _a.toString();
        const stringUserId = (_b = user.id) === null || _b === void 0 ? void 0 : _b.toString();
        const match = stringParticipantId === stringUserId;
        return match;
    });
    if (userIsAlreadyRegistered) {
        return {
            kind: types_1.ParticipationErrorType.add_error,
            message: "User already registered to the event group",
        };
    }
    eventGroup.participants = eventGroup.participants.concat(user._id);
    user.approParticipations = user.approParticipations.concat(eventGroup._id);
    const updatedEventGroup = yield eventGroup.save();
    yield user.save();
    return updatedEventGroup;
});
// TODO: Edge & Error cases
const removeUserFromEventGroup = (eventGroup, user) => __awaiter(void 0, void 0, void 0, function* () {
    eventGroup.participants = eventGroup.participants.filter((participant) => { var _a, _b; return ((_a = participant.id) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = user.id) === null || _b === void 0 ? void 0 : _b.toString()); });
    user.approParticipations = user.approParticipations.filter((singleAppro) => { var _a, _b; return ((_a = singleAppro.id) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = eventGroup.id) === null || _b === void 0 ? void 0 : _b.toString()); });
    const updatedEventGroup = yield eventGroup.save();
    yield user.save();
    return updatedEventGroup;
});
exports.default = {
    getAll,
    createEventGroup,
    findEventGroup,
    addUserToEventGroup,
    removeUserFromEventGroup,
};
