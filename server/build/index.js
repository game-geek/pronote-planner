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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var logic_1 = require("./logic");
var firebase_1 = require("./firebase");
var uuid_1 = require("uuid");
var formidable_1 = __importDefault(require("formidable"));
var compression_1 = __importDefault(require("compression"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var fs_1 = __importDefault(require("fs"));
require('dotenv').config();
var UPLOAD_DIR = __dirname + "/../uploads";
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR);
}
var app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, compression_1.default)()); // Compress all routes
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        "script-src": ["'self'"],
    },
}));
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);
//Add the client URL to the CORS policy
var whitelist = ["http://localhost:3000", "https://lovely-toys-listen.loca.lt/"];
var corsOptions = {
    origin: function (origin, callback) {
        // if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
        // } else {
        // callback(null, true);
        //callback(new Error("Not allowed by CORS"));
        // }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get('/ip', function (request, response) { return response.send(request.ip); });
// create schedule (creates user and schedule)
app.post("/create_user", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var orgToken;
        var _this = this;
        return __generator(this, function (_a) {
            // check if valid data
            // @ts-ignore
            if (!req.body || !req.body.username || req.body.username.length < 3) {
                res.statusCode = 400;
                res.send({ code: "invalid username" });
                return [2 /*return*/];
            }
            orgToken = (0, uuid_1.v4)();
            firebase_1.auth
                .createCustomToken(orgToken)
                .then(function (authToken) { return __awaiter(_this, void 0, void 0, function () {
                var docRef;
                return __generator(this, function (_a) {
                    docRef = firebase_1.db.doc("organisations/" + orgToken);
                    docRef.set({
                        free: [],
                        username: req.body.username
                    }).then(function () {
                        res.statusCode = 200;
                        res.send({ orgToken: orgToken, authToken: authToken });
                    }).catch(function (err) {
                        console.log("ERROR WHILE CREATING ORG DOCUMENT", err);
                        res.statusCode = 500;
                        res.send({ code: "Error while creating user" });
                    });
                    return [2 /*return*/];
                });
            }); })
                .catch(function (error) {
                console.log('ERROR WHILE CREATING FIREBASE AUTH TOKEN', error);
                res.statusCode = 500;
                res.send({ code: "Error while creating user" });
            });
            return [2 /*return*/];
        });
    });
});
var MAX_BYTES = 10 * 1024 * 1024;
// upload file to org
app.post("/upload_file", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var form, _a, fields, files, file, path, success, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    form = (0, formidable_1.default)({ maxFileSize: MAX_BYTES, keepExtensions: true, maxFiles: 1, uploadDir: UPLOAD_DIR, filter: function (_a) {
                            var name = _a.name, originalFilename = _a.originalFilename, mimetype = _a.mimetype;
                            // keep only pdfs
                            return true;
                        } });
                    form.on('error', function (err) {
                        console.log("error", err);
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, form.parse(req)];
                case 2:
                    _a = _b.sent(), fields = _a[0], files = _a[1];
                    console.log("uploaded file", fields, files);
                    if (!(!fields || !files.file || !fields.username || !fields.orgToken || fields.username[0].length < 3 || fields.orgToken[0].length < 10)) return [3 /*break*/, 3];
                    //If the file is not uploaded, then throw custom error with message: FILE_MISSING
                    res.statusCode = 400;
                    res.end("Invalid Data");
                    return [3 /*break*/, 5];
                case 3:
                    file = files.file[0];
                    path = file.filepath;
                    return [4 /*yield*/, (0, logic_1.calculate)(path, req.body.username, req.body.orgToken)];
                case 4:
                    success = _b.sent();
                    if (typeof success === typeof String()) {
                        // @ts-ignore
                        throw Error(success);
                    }
                    else if (!success) {
                        throw Error("GENERIC_ERROR");
                    }
                    else {
                        res.send({ status: "success" });
                    }
                    _b.label = 5;
                case 5:
                    res.json({ fields: fields, files: files });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    console.log("erroring", err_1);
                    res.statusCode = 413;
                    res.json({ code: "File is too large" });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
//Start the server in port 8081
var server = app.listen(process.env.PORT || 8080, function () {
    // @ts-ignore
    var port = server.address().port;
    console.log("App started at http://localhost:%s", port);
});
// CANNOT US FILESYSTEM ...
