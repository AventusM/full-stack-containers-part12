"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const types_1 = require("../types");
const unknownEndpoint = (_req, res) => {
    res.status(constants_1.NOT_FOUND_CODE).send({ error: "unknown endpoint" });
};
const errorHandler = (error, _req, res, next) => {
    if (error.name === "CastError" && error.kind === "ObjectId") {
        res.status(constants_1.BAD_REQUEST_CODE).send({ error: "malformatted id" });
    }
    else if (error.name === "ValidationError") {
        res.status(constants_1.BAD_REQUEST_CODE).send({ error: error.message });
    }
    else if (error.name === "JsonWebTokenError") {
        res
            .status(constants_1.UNAUTHORIZED_CODE)
            .send({ error: "invalid or missing jwt token" });
    }
    next(error);
};
const eventErrorHandler = (error, _req, res, next) => {
    if (Object.values(types_1.ParticipationErrorType).includes(error.kind)) {
        res.status(constants_1.BAD_REQUEST_CODE).send({ message: error.message });
    }
    next(error);
};
exports.default = { unknownEndpoint, errorHandler, eventErrorHandler };
