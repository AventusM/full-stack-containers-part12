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
const express_1 = __importDefault(require("express"));
const services_1 = __importDefault(require("../services/"));
const utils_1 = __importDefault(require("../utils"));
const constants_1 = require("../constants");
const types_1 = require("../types");
const router = express_1.default.Router();
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.default.eventGroupServices.getAll();
        res.send(data.map((event) => event.toJSON()));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = utils_1.default.toStringIdFromParamRequest(req.params);
        const foundEventGroup = yield services_1.default.eventGroupServices.findEventGroup(id);
        if (!foundEventGroup) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "Event group not found" });
        }
        else {
            res.send(foundEventGroup.toJSON());
        }
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, endDate, startDate, name, events } = utils_1.default.toEventGroupBase(req.body);
        // Has to be a host type at all times or not?
        const foundHostUserResponse = yield services_1.default.userServices.findUser(userId);
        if (!foundHostUserResponse) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "Host user not found" });
            // TODO: GO NEXT HERE WITH A MISSING HOST MESSAGE
        }
        else {
            const promises = events.map((eventBase) => __awaiter(void 0, void 0, void 0, function* () { return yield services_1.default.eventServices.createEvent(eventBase); }));
            // We want to have an array of resolved objects instead of a promise
            // TODO: 2nd error as well if event creation fails
            const responses = yield Promise.all(promises);
            const createdEventGroup = yield services_1.default.eventGroupServices.createEventGroup({ name, endDate, startDate }, foundHostUserResponse, responses);
            res.send(createdEventGroup.toJSON());
        }
    }
    catch (error) {
        next(error);
    }
}));
router.post("/:id/participation", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = utils_1.default.toStringIdFromParamRequest(req.params);
        const { userId, requestType } = utils_1.default.toParticipationExtraData(req.body);
        const foundEventGroup = yield services_1.default.eventGroupServices.findEventGroup(id);
        const foundUser = yield services_1.default.userServices.findUser(userId);
        if (!foundUser) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "User not found" });
        }
        else if (!foundEventGroup) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "Event group not found" });
        }
        if (foundUser && foundEventGroup) {
            if (requestType === types_1.ParticipationRequestType.ADD_PARTICIPATION) {
                const result = yield services_1.default.eventGroupServices.addUserToEventGroup(foundEventGroup, foundUser);
                if ("kind" in result) {
                    next(result);
                }
                else {
                    res.json(result.toJSON());
                }
            }
            else if (requestType === types_1.ParticipationRequestType.REMOVE_PARTICIPATION) {
                // TODO: ServiceError possibility
                const result = yield services_1.default.eventGroupServices.removeUserFromEventGroup(foundEventGroup, foundUser);
                res.json(result.toJSON());
            }
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
