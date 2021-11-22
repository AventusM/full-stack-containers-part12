"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const geometryPointSchema = new mongoose_1.default.Schema({
    lat: { type: String, required: true },
    lng: { type: String, required: true },
});
// TODO: Max size of users for single event at once?
const eventSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    point: { type: geometryPointSchema },
    participants: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: constants_1.USER_DOCUMENT_REF },
    ],
    completedParticipants: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: constants_1.USER_DOCUMENT_REF },
    ],
}, { timestamps: true });
eventSchema.set("toJSON", {
    virtuals: true,
    transform: (_doc, converted) => {
        delete converted.__v;
        delete converted._id;
    },
});
exports.default = mongoose_1.default.model(constants_1.EVENT_DOCUMENT_REF, eventSchema);
