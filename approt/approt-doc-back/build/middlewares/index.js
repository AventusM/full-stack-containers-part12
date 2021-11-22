"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const errorHandling_1 = __importDefault(require("./errorHandling"));
exports.default = { tokenMiddleware: token_1.default, routeErrorMiddleware: errorHandling_1.default };
