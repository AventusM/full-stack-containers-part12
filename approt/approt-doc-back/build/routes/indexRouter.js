"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const router = express_1.default.Router();
const pathArray = [
    { link: constants_1.USERS_API_PATH },
    { link: constants_1.EVENTS_API_PATH },
    { link: constants_1.EVENTGROUPS_API_PATH },
];
router.get("/", (_req, res) => {
    res.render("index.njk", { pathArray });
});
exports.default = router;
