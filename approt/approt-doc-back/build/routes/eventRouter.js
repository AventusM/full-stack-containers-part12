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
const types_1 = require("../types");
const constants_1 = require("../constants");
const router = express_1.default.Router();
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = utils_1.default.toStringIdFromParamRequest(req.params);
        const foundEvent = yield services_1.default.eventServices.findEvent(id);
        if (!foundEvent) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "Event not found" });
        }
        else {
            res.send(foundEvent.toJSON());
        }
    }
    catch (error) {
        next(error);
    }
}));
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.default.eventServices.getAll();
        res.send(data.map((event) => event.toJSON()));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedEventData = utils_1.default.toEventBase(req.body);
        const newEventData = yield services_1.default.eventServices.createEvent(parsedEventData);
        res.send(newEventData.toJSON());
    }
    catch (error) {
        next(error);
    }
}));
router.post("/:id/participation", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = utils_1.default.toStringIdFromParamRequest(req.params);
        const { userId, requestType } = utils_1.default.toParticipationExtraData(req.body);
        const foundEvent = yield services_1.default.eventServices.findEvent(id);
        const foundUser = yield services_1.default.userServices.findUser(userId);
        if (!foundUser) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "User not found" });
        }
        else if (!foundEvent) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "Event not found" });
        }
        if (foundUser && foundEvent) {
            if (requestType === types_1.ParticipationRequestType.ADD_PARTICIPATION) {
                const result = yield services_1.default.eventServices.addUserToEvent(foundEvent, foundUser);
                if ("kind" in result) {
                    next(result);
                }
                else {
                    res.json(result.toJSON());
                }
            }
            else if (requestType === types_1.ParticipationRequestType.COMPLETE_EVENT) {
                const result = yield services_1.default.eventServices.completeEvent(foundEvent, foundUser);
                if ("kind" in result) {
                    next(result);
                }
                else {
                    res.json(result.toJSON());
                }
            }
            else {
                const result = yield services_1.default.eventServices.removeUserFromEvent(foundEvent, foundUser);
                if ("kind" in result) {
                    next(result);
                }
                else {
                    res.json(result.toJSON());
                }
            }
        }
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = utils_1.default.toStringIdFromParamRequest(req.params);
        yield services_1.default.eventServices.deleteEvent(id);
        res.status(constants_1.NO_CONTENT_CODE).end();
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
