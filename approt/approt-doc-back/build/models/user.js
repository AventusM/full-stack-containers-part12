"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const types_1 = require("../types");
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    passwordData: { type: String, required: true },
    type: { type: String, enum: Object.values(types_1.UserType) },
    approParticipations: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: constants_1.EVENT_GROUP_DOCUMENT_REF },
    ],
}, { timestamps: true });
userSchema.set("toJSON", {
    virtuals: true,
    transform: (_doc, converted) => {
        delete converted.__v;
        delete converted._id;
        delete converted.passwordData; // Do not reveal passwordData/passwordHash in response
    },
});
exports.default = mongoose_1.default.model(constants_1.USER_DOCUMENT_REF, userSchema);
