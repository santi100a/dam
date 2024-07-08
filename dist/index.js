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
var net = require("node:net");
var mongodb_1 = require("mongodb");
var favicon_1 = require("./favicon");
var uriString = process.env.PROD_DB_URI; // Replace with your MongoDB connection URI
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 2628;
var client = new mongodb_1.MongoClient(uriString);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var database, collection_1, server;
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
                    server = net.createServer(function (socket) {
                        socket.on('data', function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var requests, _i, requests_1, request, _a, hostlessUrl, parsedUrl, queryParameters, word, wordObject, _b, _c, definition, commandArgs, command, _d, word, index, wordObject, _e, _f, definition, error_1;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        requests = data.toString().trim().split('\r\n');
                                        console.log('A client has connected.');
                                        _i = 0, requests_1 = requests;
                                        _g.label = 1;
                                    case 1:
                                        if (!(_i < requests_1.length)) return [3 /*break*/, 17];
                                        request = requests_1[_i];
                                        if (!requests[0].includes('HTTP/')) return [3 /*break*/, 7];
                                        _a = requests[0].split(' '), hostlessUrl = _a[1];
                                        if (!(hostlessUrl.trim() == '/')) return [3 /*break*/, 2];
                                        socket.write('HTTP/1.1 200 OK');
                                        socket.write('\r\n');
                                        socket.write('Content-Type: text/html');
                                        socket.write('\r\n');
                                        socket.write('\r\n'); // Blank line
                                        socket.write('<html>');
                                        socket.write('<head>');
                                        socket.write('<meta charset="utf-8" />');
                                        socket.write("<title>The Santinian Dictionary of Modern Language</title>");
                                        socket.write('<style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>');
                                        socket.write("<link rel=\"icon\" type=\"image/x-icon\" href=\"".concat(favicon_1.FAVICON_DATASOURCE, "\" />"));
                                        socket.write('</head>');
                                        socket.write('<body>');
                                        socket.write('<h1>The Santinian Dictionary of Modern Language</h1>');
                                        socket.write('<form action="/" method="get">');
                                        socket.write('<input type="text" name="word" placeholder="Write a slang word..." style="padding:1.6pc 3.2pc;border-radius:50px"/><br />');
                                        socket.write('<br />');
                                        socket.write('<input type="submit" value="Submit" style="padding:1.6pc 3.2pc;border-radius:100px;color:white;background-color:#0056ff;" />');
                                        socket.write('</form>');
                                        socket.write('</body>');
                                        socket.write('</html>');
                                        socket.end();
                                        return [3 /*break*/, 6];
                                    case 2:
                                        parsedUrl = new URL("http://localhost".concat(hostlessUrl));
                                        queryParameters = parsedUrl.searchParams;
                                        word = queryParameters.get('word');
                                        if (!word) return [3 /*break*/, 4];
                                        console.log("Word query parameter found: ".concat(word));
                                        return [4 /*yield*/, collection_1.findOne({ word: word })];
                                    case 3:
                                        wordObject = _g.sent();
                                        if (wordObject) {
                                            socket.write('HTTP/1.1 200 OK');
                                            socket.write('\r\n');
                                            socket.write('Content-Type: text/html');
                                            socket.write('\r\n');
                                            socket.write('\r\n');
                                            socket.write('<html>');
                                            socket.write('<head>');
                                            socket.write('<meta charset="utf-8" />');
                                            socket.write("<link rel=\"icon\" type=\"image/x-icon\" href=\"".concat(favicon_1.FAVICON_DATASOURCE, "\" />"));
                                            socket.write("<title>SDML - Results for \"".concat(word, "\"</title>"));
                                            socket.write('<style>body{font-family:system-ui;}div.wrapper{background-color:#f0f0f0}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}div.wrapper{background-color: #2d2d2d;}}</style>');
                                            socket.write('</head>');
                                            socket.write('<body>');
                                            socket.write('<h1>The Santinian Dictionary of Modern Language</h1>');
                                            socket.write("<ol>");
                                            for (_b = 0, _c = wordObject.definitions; _b < _c.length; _b++) {
                                                definition = _c[_b];
                                                socket.write('<li>');
                                                socket.write("<strong>".concat(word, " (").concat(definition.shortenedWordType, ")</strong> /").concat(definition.ipa, "/ <br />"));
                                                if (wordObject.from) {
                                                    socket.write("<div class=\"wrapper\" style=\"width:40pc;\">");
                                                    socket.write("<p style=\"color:green;\">".concat(wordObject.from, "</p>"));
                                                    socket.write("</div>");
                                                }
                                                socket.write("<p>".concat(definition.text, "</p>"));
                                                if (definition.example)
                                                    socket.write("<p><strong>Example:</strong> ".concat(definition.example, "</p>"));
                                                socket.write('</li>');
                                            }
                                            socket.write("</ol>");
                                            socket.write('</body>');
                                            socket.write('</html>');
                                        }
                                        else {
                                            socket.write('HTTP/1.1 404 Not Found');
                                            socket.write('\r\n');
                                            socket.write('Content-Type: text/html');
                                            socket.write('\r\n');
                                            socket.write('\r\n');
                                            socket.write('<html>');
                                            socket.write('<head>');
                                            socket.write('<meta charset="utf-8" />');
                                            socket.write("<link rel=\"icon\" type=\"image/x-icon\" href=\"".concat(favicon_1.FAVICON_DATASOURCE, "\" />"));
                                            socket.write("<title>The Santinian Dictionary of Modern Language</title>");
                                            socket.write('<style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>');
                                            socket.write('</head>');
                                            socket.write('<body>');
                                            socket.write('<h1>The Santinian Dictionary of Modern Language</h1>');
                                            socket.write("<p style=\"color: orange;\">No definitions found for \"".concat(word, "\"</p>"));
                                            socket.write('</body>');
                                            socket.write('</html>');
                                        }
                                        return [3 /*break*/, 5];
                                    case 4:
                                        // Handle cases where specific query parameters are missing or invalid
                                        console.log('No valid query parameters found');
                                        _g.label = 5;
                                    case 5:
                                        socket.end();
                                        _g.label = 6;
                                    case 6: return [2 /*return*/];
                                    case 7:
                                        console.log("DICT client request: ".concat(request));
                                        commandArgs = request.split(' ');
                                        command = commandArgs[0].toUpperCase();
                                        _d = command;
                                        switch (_d) {
                                            case 'CLIENT': return [3 /*break*/, 8];
                                            case 'HELLO': return [3 /*break*/, 8];
                                            case 'DEFINE': return [3 /*break*/, 9];
                                            case 'QUIT': return [3 /*break*/, 14];
                                        }
                                        return [3 /*break*/, 15];
                                    case 8:
                                        socket.write("220 - SDML \"The Santinian Dictionary of Modern Language\" v1.0\r\nSend word suggestions to [hyper.industries+sdml@protonmail.com]\r\n");
                                        return [3 /*break*/, 16];
                                    case 9:
                                        word = commandArgs[2];
                                        index = 1;
                                        _g.label = 10;
                                    case 10:
                                        _g.trys.push([10, 12, , 13]);
                                        return [4 /*yield*/, collection_1.findOne({ word: word })];
                                    case 11:
                                        wordObject = _g.sent();
                                        if (wordObject) {
                                            socket.write('250 - OK\r\n');
                                            socket.write("150 - Found ".concat(wordObject.definitions.length, " definition(s) for \"").concat(word, "\":\r\n"));
                                            for (_e = 0, _f = wordObject.definitions; _e < _f.length; _e++) {
                                                definition = _f[_e];
                                                socket.write("".concat(index, ". ").concat(word, " (").concat(definition.shortenedWordType, ") /").concat(definition.ipa, "/\r\n"));
                                                if (wordObject.from) {
                                                    socket.write("   ".concat(wordObject.from, "\r\n"));
                                                }
                                                socket.write("   ".concat(definition.text.replace('\r\n', '\r\n   '), "\r\n"));
                                                if (definition.example) {
                                                    socket.write("   EXAMPLE: ".concat(definition.example, "\r\n"));
                                                }
                                                socket.write('\r\n'); // End of definition
                                                index++;
                                            }
                                        }
                                        else {
                                            socket.write("552 - No definitions found for \"".concat(word, "\"\r\n"));
                                        }
                                        return [3 /*break*/, 13];
                                    case 12:
                                        error_1 = _g.sent();
                                        console.error('Error querying MongoDB:', error_1);
                                        socket.write("500 - Internal Server Error\r\n");
                                        return [3 /*break*/, 13];
                                    case 13: return [3 /*break*/, 16];
                                    case 14:
                                        socket.write("221 - Bye\r\n");
                                        socket.end();
                                        return [3 /*break*/, 16];
                                    case 15:
                                        socket.write("500 - Unknown command\r\n");
                                        _g.label = 16;
                                    case 16:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 17: return [2 /*return*/];
                                }
                            });
                        }); });
                        socket.on('end', function () {
                            console.log('A client has disconnected.');
                        });
                    });
                    server.listen(port, function () {
                        console.log('SDML listening on:');
                        console.log('* HTTP: http://127.0.0.1:%d', port);
                        console.log('* DICT: dict://127.0.0.1:%d', port);
                    });
                    return [3 /*break*/, 3];
                case 2: return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](console.error);
