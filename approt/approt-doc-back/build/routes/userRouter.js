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
const constants_1 = require("../constants");
//import middlewares from "../middlewares";
const services_1 = __importDefault(require("../services/"));
const utils_1 = __importDefault(require("../utils"));
const router = express_1.default.Router();
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = utils_1.default.toStringIdFromParamRequest(req.params);
        const foundUser = yield services_1.default.userServices.findUser(id);
        if (!foundUser) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "User not found" });
        }
        else {
            res.send(foundUser.toJSON());
        }
    }
    catch (error) {
        next(error);
    }
}));
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.default.userServices.getAll();
        res.send(data.map((user) => user.toJSON()));
    }
    catch (error) {
        next(error);
    }
}));
// Registering a new user, no middleware required here
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedUserData = utils_1.default.toUserBase(req.body);
        const newUserData = yield services_1.default.userServices.createUser(parsedUserData);
        res.send(newUserData.toJSON());
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
