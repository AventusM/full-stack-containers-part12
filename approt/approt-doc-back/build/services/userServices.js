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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const constants_1 = require("../constants");
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield user_1.default.find({}).populate(constants_1.APPRO_PARTICIPATIONS_FIELD, {
        name: constants_1.PICK_FIELD,
    });
    return allUsers;
});
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield bcrypt_1.default.hash(user.passwordData, constants_1.BCRYPT_SALT_ROUNDS_DEFAULT);
    const newUser = yield user_1.default.create({
        username: user.username,
        email: user.email,
        type: user.type,
        passwordData: passwordHash,
        approParticipations: constants_1.EMPTY_ARRAY,
    });
    return newUser;
});
const findUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_1.default.findById(userId).populate(constants_1.APPRO_PARTICIPATIONS_FIELD, {
        name: constants_1.PICK_FIELD,
    });
    return foundUser;
});
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_1.default.findOne({
        username,
    }).populate(constants_1.APPRO_PARTICIPATIONS_FIELD, { name: constants_1.PICK_FIELD });
    return foundUser;
});
exports.default = { getAll, createUser, findUser, findUserByUsername };
