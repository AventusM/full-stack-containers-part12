"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const healthcheckRouter_1 = __importDefault(require("./healthcheckRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const eventRouter_1 = __importDefault(require("./eventRouter"));
const loginRouter_1 = __importDefault(require("./loginRouter"));
const eventGroupRouter_1 = __importDefault(require("./eventGroupRouter"));
const indexRouter_1 = __importDefault(require("./indexRouter"));
exports.default = {
    healthCheckRouter: healthcheckRouter_1.default,
    userRouter: userRouter_1.default,
    eventRouter: eventRouter_1.default,
    loginRouter: loginRouter_1.default,
    eventGroupRouter: eventGroupRouter_1.default,
    indexRouter: indexRouter_1.default,
};
