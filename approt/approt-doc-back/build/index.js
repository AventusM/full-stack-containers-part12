"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = __importDefault(require("./config"));
const middlewares_1 = __importDefault(require("./middlewares"));
const constants_1 = require("./constants");
mongoose_1.default
    .connect(config_1.default.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then((_result) => {
    console.log("connected to MongoDB");
})
    .catch((error) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("error connecting to MongoDB:", error.message);
});
const app = express_1.default();
app.set("view engine", "njk");
nunjucks_1.default.configure("views", {
    autoescape: true,
    express: app,
});
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// Can serve as a basic logger. Probably should use some middleware for objects though.
app.use(morgan_1.default(chalk_1.default `:method :url {green :status} :response-time ms - :res[content-length]`));
// api/users requires a token in most cases, but isn't set explicitly on user creation (when registering a new user)
app.use(constants_1.ROOT_PATH, routes_1.default.indexRouter);
app.use(constants_1.USERS_API_PATH, routes_1.default.userRouter);
app.use(constants_1.LOGIN_API_PATH, routes_1.default.loginRouter);
// Routes below require a token at all times
//app.use(middlewares.tokenMiddleware.tokenExtractor);
app.use(constants_1.HEALTHCHECK_API_PATH, routes_1.default.healthCheckRouter);
app.use(constants_1.EVENTS_API_PATH, routes_1.default.eventRouter);
app.use(constants_1.EVENTGROUPS_API_PATH, routes_1.default.eventGroupRouter);
// Error handling after all routes
app.use(middlewares_1.default.routeErrorMiddleware.errorHandler);
app.use(middlewares_1.default.routeErrorMiddleware.eventErrorHandler);
app.use(middlewares_1.default.routeErrorMiddleware.unknownEndpoint);
app.listen(config_1.default.PORT, () => {
    console.log(`Server running on port ${config_1.default.PORT}`);
});
