"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.diskStorage({
    //Specify the destination directory where the file needs to be saved
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    //Specify the name of the file. date is prefixed to avoid overwrite of files.
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
var upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    dest: "./uploads",
    fileFilter: function (req, file, cb) {
        console.log(file, file.size);
        if (file.mimetype == "application/pdf") {
            if (file.size > 1024 * 1024 * 10) {
                cb(null, false);
                return cb(new Error("INVALID_SIZE"));
            }
            else {
                cb(null, true);
            }
        }
        else {
            cb(null, false);
            return cb(new Error("INVALID_TYPE"));
        }
    },
});
exports.default = upload;
// STOP USING MULTER, use https://github.com/node-formidable/formidable, or https://sebhastian.com/express-fileupload/
