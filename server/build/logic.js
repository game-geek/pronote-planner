"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.calculate = void 0;
var firebase_1 = require("./firebase");
var fs_1 = __importDefault(require("fs"));
//@ts-ignore
var pdf_parse_fork_1 = __importDefault(require("pdf-parse-fork"));
var pdf2img = require('pdf-img-convert');
var canvas_1 = require("canvas");
// Helper functions
function FormatTimeTable(data) {
    var formatedData = data.map(function (d, index) {
        var times = d.time.split(":");
        var hour = Number(times[1]) + 8; // CHANGE FOR IT TO SHOW Q1 ANDDD Q 2SEPERATEVELY
        var c = ["lundi Q1", "lundi Q2", "mardi Q1", "mardi Q2", "mercredi Q1", "mercredi Q2", "jeudi Q1", "jeudi Q2", "vendredi Q1", "vendredi Q2"];
        var day = c[Number(times[0])];
        console.log(day + " à " + String(hour) + "h", times);
        var time = day + " à " + String(hour) + "h";
        return __assign(__assign({}, d), { time: time, users: d.users });
    });
    return formatedData;
}
function snapshotError(error) {
    console.log("ERROR IN LISTENER", error);
}
function calculate_free_times(response, orgToken) {
    return __awaiter(this, void 0, void 0, function () {
        var persons_1, availableTimetable_1, documentRef, res, availableTimesPrev, availableTimes, availableTimes_1, err_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    persons_1 = response.docs.map(function (doc) { return doc.data(); });
                    availableTimetable_1 = {};
                    // algo !!!
                    console.log("starting");
                    persons_1.forEach(function (person, index) {
                        console.log(index);
                        for (var i = 0; i < person.timetable.free.length; i++) {
                            if (person.timetable.free[i] in availableTimetable_1) {
                                continue;
                            }
                            else {
                                availableTimetable_1[person.timetable.free[i]] = [];
                            }
                            for (var x = 0; x < persons_1.length; x++) {
                                if (persons_1[x].timetable.free.includes(person.timetable.free[i])) {
                                    availableTimetable_1[person.timetable.free[i]].push(persons_1[x].username);
                                }
                            }
                        }
                    });
                    documentRef = firebase_1.db.doc("organisations/" + orgToken);
                    return [4 /*yield*/, documentRef.get()
                        // @ts-ignore
                    ];
                case 1:
                    res = _a.sent();
                    availableTimesPrev = res.data().free;
                    availableTimes = [];
                    if (availableTimesPrev) {
                        // make it a more structered type and sorted
                        availableTimes = Object.keys(availableTimetable_1).map(function (key) { return { time: key, starred: false, users: availableTimetable_1[key] }; }).sort(function (a, b) {
                            if (a.starred && b.starred) {
                                return 0;
                            }
                            else if (a.starred) {
                                return 1;
                            }
                            else if (b.starred) {
                                return -1;
                            }
                            else {
                                return a.users.length > b.users.length ? -1 : 1;
                            }
                        });
                    }
                    else {
                        availableTimes_1 = Object.keys(availableTimetable_1).map(function (key) { return { time: key, starred: false, users: availableTimetable_1[key] }; }).sort(function (a, b) { return a.users.length > b.users.length ? -1 : 1; });
                    }
                    return [4 /*yield*/, documentRef.update({
                            free: FormatTimeTable(availableTimes)
                        })];
                case 2:
                    _a.sent();
                    console.log(availableTimes);
                    console.log("Current data: ", persons_1);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    // eror while updating docs
                    // catch error, notabily the one no document to update -> delete listener
                    if (err_1.code === 5) {
                        // org is deleted
                        // delete listener
                        for (i = 0; i < ORGANAISATIONS_LISTENER.length; i++) {
                            if (ORGANAISATIONS_LISTENER[i].orgToken == orgToken) {
                                ORGANAISATIONS_LISTENER[i].unsubscribe();
                                ORGANAISATIONS_LISTENER.splice(i, 1);
                                ORGANAISATIONS.splice(i, 1);
                                break;
                            }
                        }
                    }
                    else {
                        console.log("ERROR WHILE UPDATING FREE TIMETABLE", err_1);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
;
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, firebase_1.db
                        .collection('organisations')
                        .listDocuments()];
                case 1:
                    ORGANAISATIONS = _a.sent();
                    ORGANAISATIONS_LISTENER = ORGANAISATIONS.map(function (org) {
                        var unsubscribe = firebase_1.db.collection("organisations/" + org.id + "/persons").onSnapshot(function (snapshot) { return calculate_free_times(snapshot, org.id); }, snapshotError);
                        return { orgToken: org.id, unsubscribe: unsubscribe };
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Realtime Listeners for existing docs
var ORGANAISATIONS = [];
var ORGANAISATIONS_LISTENER = [];
// init real time listening
init();
// function called from endpoint
var calculate = function (path, username, orgToken) { return __awaiter(void 0, void 0, void 0, function () {
    var documentRef, doc_1, dataBuffer, pdfInfo, pdfArray, img, canvas, ctx, x_spaces, y_spaces, targets, y, temp, x, results, y, temp, x, data, userOrgDocRef, unsubscribe, buffer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                documentRef = firebase_1.db.doc("organisations/" + orgToken);
                return [4 /*yield*/, documentRef.get()];
            case 1:
                doc_1 = _a.sent();
                if (!doc_1.exists) {
                    // problem
                    return [2 /*return*/, "this schedule does not exist"];
                }
                dataBuffer = fs_1.default.readFileSync(path);
                return [4 /*yield*/, (0, pdf_parse_fork_1.default)(dataBuffer)];
            case 2:
                pdfInfo = _a.sent();
                if (pdfInfo.info.Author != "Index-Education") {
                    console.log(pdfInfo.info.Author);
                    return [2 /*return*/, "invalid pronote timetable"];
                }
                return [4 /*yield*/, pdf2img.convert(path, {
                        //width: 100, //Number in px
                        //height: 100, // Number in px
                        page_numbers: [1],
                        base64: true,
                        scale: 2.0
                    })];
            case 3:
                pdfArray = _a.sent();
                return [4 /*yield*/, (0, canvas_1.loadImage)("data:image/png;base64," + String(pdfArray[0]))];
            case 4:
                img = _a.sent();
                canvas = (0, canvas_1.createCanvas)(img.width, img.height);
                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                x_spaces = 13;
                y_spaces = 12;
                targets = [];
                for (y = 2; y < x_spaces - 1; y++) {
                    temp = [];
                    for (x = 2; x < y_spaces - 1; x++) {
                        temp.push([((img.width / x_spaces) - 10) * y, (img.height / y_spaces) * x]);
                    }
                    targets.push(JSON.parse(JSON.stringify(temp)));
                    temp = [];
                }
                results = { raw: [], free: [] };
                for (y = 0; y < targets.length; y++) {
                    temp = [];
                    for (x = 0; x < targets[y].length; x++) {
                        data = ctx.getImageData(targets[y][x][0], targets[y][x][1], 1, 1).data;
                        // temp.push([ data[0], data[1], data[2] ])			
                        temp.push({ "r": data[0], "g": data[1], "b": data[2] });
                        if (data[0] == 255 && data[1] == 255 && data[2] == 255) {
                            // free time
                            results.free.push("".concat(y, ":").concat(x));
                        }
                    }
                    results.raw.push({ column: JSON.parse(JSON.stringify(temp)) });
                    temp = [];
                }
                userOrgDocRef = firebase_1.db.doc("organisations/" + orgToken + "/persons/" + username);
                return [4 /*yield*/, userOrgDocRef.set({
                        timetable: results,
                        username: username
                    })
                    // add to listener
                ];
            case 5:
                _a.sent();
                unsubscribe = firebase_1.db.collection("organisations/" + orgToken + "/persons").onSnapshot((function (snapshot) { return calculate_free_times(snapshot, orgToken); }), snapshotError);
                ORGANAISATIONS_LISTENER.push({ orgToken: orgToken, unsubscribe: unsubscribe });
                buffer = canvas.toBuffer("image/png");
                fs_1.default.writeFileSync("./image.png", buffer);
                return [2 /*return*/, true];
            case 6:
                error_1 = _a.sent();
                // error while parsing and saving data
                console.log("ERROR PARSING PDF, SAVING DATA", error_1);
                return [2 /*return*/, false];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.calculate = calculate;
// TypeScript: Reload Project
