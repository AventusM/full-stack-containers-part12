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
const router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const services_1 = __importDefault(require("../services"));
const utils_1 = __importDefault(require("../utils"));
const config_1 = __importDefault(require("../config"));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = utils_1.default.toUsernamePassword(req.body);
        const foundUser = yield services_1.default.userServices.findUserByUsername(username);
        if (!foundUser) {
            res.status(constants_1.NOT_FOUND_CODE).send({ error: "User not found" });
        }
        else {
            const passwordCorrect = yield bcrypt_1.default.compare(password, foundUser.passwordData);
            if (!passwordCorrect) {
                res.status(constants_1.UNAUTHORIZED_CODE).send({ error: "Invalid password" });
            }
            const userForToken = {
                username: foundUser.username,
                id: foundUser.id,
            };
            const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET);
            res.send({ token, username: foundUser.username, userId: foundUser.id });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
