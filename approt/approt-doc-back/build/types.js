"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = exports.ParticipationRequestType = exports.ParticipationErrorType = void 0;
var ParticipationErrorType;
(function (ParticipationErrorType) {
    ParticipationErrorType["add_error"] = "add_error";
    ParticipationErrorType["complete_error"] = "complete_error";
    ParticipationErrorType["remove_error"] = "remove_error";
})(ParticipationErrorType = exports.ParticipationErrorType || (exports.ParticipationErrorType = {}));
var ParticipationRequestType;
(function (ParticipationRequestType) {
    ParticipationRequestType["ADD_PARTICIPATION"] = "add_participation";
    ParticipationRequestType["COMPLETE_EVENT"] = "complete_event";
    ParticipationRequestType["REMOVE_PARTICIPATION"] = "remove_participation";
})(ParticipationRequestType = exports.ParticipationRequestType || (exports.ParticipationRequestType = {}));
var UserType;
(function (UserType) {
    UserType["BASIC"] = "basic";
    UserType["HOST"] = "host";
    UserType["ADMIN"] = "admin";
})(UserType = exports.UserType || (exports.UserType = {}));
