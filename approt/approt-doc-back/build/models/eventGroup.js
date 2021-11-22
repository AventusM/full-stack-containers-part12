"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Also known as 'Appro'
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const eventGroupSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    host: { type: mongoose_1.default.Schema.Types.ObjectId, ref: constants_1.USER_DOCUMENT_REF },
    events: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: constants_1.EVENT_DOCUMENT_REF }],
    participants: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: constants_1.USER_DOCUMENT_REF },
    ],
}, { timestamps: true });
eventGroupSchema.set("toJSON", {
    virtuals: true,
    transform: (_doc, converted) => {
        delete converted.__v;
        delete converted._id;
    },
});
exports.default = mongoose_1.default.model(constants_1.EVENT_GROUP_DOCUMENT_REF, eventGroupSchema);
