"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// The jsonwebtoken library has an ongoing situation with incomplete types, causing to ignore multiple complaints by eslint
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const constants_1 = require("../constants");
const getTokenFrom = (req) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        return authorization.substring(7);
    }
    return "";
};
const tokenExtractor = (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
    if (!token || !decodedToken.id) {
        res.status(constants_1.UNAUTHORIZED_CODE).send({ error: "Token missing or invalid" });
    }
    next();
};
exports.default = { tokenExtractor };
