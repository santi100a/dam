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
var _a;
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var favicon_1 = require("./favicon");
var express = require("express");
var uriString = process.env.PROD_DB_URI; // Replace with your MongoDB connection URI
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 2628;
var client = new mongodb_1.MongoClient(uriString);
var server = express();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var database, collection_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    database = client.db('sdml');
                    collection_1 = database.collection('en');
                    server.get('/', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
                        var word, query, wordObject_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    word = request.query.word;
                                    if (!(typeof word !== 'string')) return [3 /*break*/, 1];
                                    response.status(200).contentType('text/html').send("<html>\n        <head>\n          <meta charset=\"utf-8\" />\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n            <title>The Santinian Dictionary of Modern Language</title>\n            <style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>\n  \n            <link rel=\"icon\" type=\"image/x-icon\" href=\"".concat(favicon_1.FAVICON_DATASOURCE, "\" />\n        </head>\n        <body>\n          <h1>The Santinian Dictionary of Modern Language</h1>\n            <p>Get accurate definitions of common Generation Alpha slang in seconds!</p>\n            <form action=\"/\" method=\"get\">\n                <input type=\"text\"\n                name=\"word\" \n                placeholder=\"Type a slang word...\" \n                style=\"padding:1.6pc 3.2pc;border-radius:50px\"\n                />\n                <br />\n                <br />\n                <input type=\"submit\" value=\"Submit\" style=\"padding:1.6pc 3.2pc;border-radius:100px;color:white;background-color:#0056ff;\" />\n            </form>\n        </body>\n      </html>"));
                                    return [3 /*break*/, 3];
                                case 1:
                                    query = String(word).trim().toLowerCase();
                                    return [4 /*yield*/, collection_1.findOne({ word: query })];
                                case 2:
                                    wordObject_1 = _a.sent();
                                    response.status(wordObject_1 ? 200 : 404).contentType('text/html')
                                        .send("<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n      <title>The Santinian Dictionary of Modern Language</title>\n      <style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>\n\n      <link rel=\"icon\" type=\"image/x-icon\" href=\"".concat(favicon_1.FAVICON_DATASOURCE, "\" />\n  </head>\n  <body>\n    <h1>The Santinian Dictionary of Modern Language</h1>\n\n    ").concat(wordObject_1
                                        ? "<ol>\n      ".concat(wordObject_1.definitions
                                            .map(function (definition) {
                                            return "<li><strong>".concat(word, " (").concat(definition.shortenedWordType, ")</strong> /").concat(definition.ipa, "/ <br /> ").concat(wordObject_1.from
                                                ? "<div class=\"wrapper\" style=\"width:40pc;\"><p style=\"color:green;\">".concat(wordObject_1.from, "</p></div>")
                                                : '', "<p>").concat(definition.text, "</p> ").concat(definition.example
                                                ? "<p><strong>Example:</strong> ".concat(definition.example, "</p>")
                                                : '', "</li>");
                                        })
                                            .join('\n'), "\n  \n    </ol>")
                                        : "<p style=\"color: orange;\">No definitions found for \"".concat(word, "\"</p>"), "\n  </body>\n</html>"));
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    server.listen(port, function () {
                        console.log('SDML listening on: http://127.0.0.1:%d', port);
                        // console.log('* DICT: dict://127.0.0.1:%d', port);
                    });
                    return [3 /*break*/, 3];
                case 2: return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](console.error);
