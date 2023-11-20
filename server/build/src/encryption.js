'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = exports.decrypt = void 0;
var crypto_1 = __importDefault(require("crypto"));
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
// console.log("key", crypto.createHash('sha256').update(String("%$be6$@d9z^o!y4%v7+swk0to*qjk(9*dnwb&1iedhvr*9g55")).digest('base64').substr(0, 32))
var IV_LENGTH = 16; // For AES, this is always 16
function encrypt(text) {
    var iv = crypto_1.default.randomBytes(IV_LENGTH);
    var cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
    var encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
exports.encrypt = encrypt;
function decrypt(text) {
    var textParts = text.split(':');
    var iv = Buffer.from(textParts.shift(), 'hex');
    var encryptedText = Buffer.from(textParts.join(':'), 'hex');
    var decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), iv);
    var decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.decrypt = decrypt;
