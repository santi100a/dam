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
function dict(socket, request, collection) {
    return __awaiter(this, void 0, void 0, function () {
        var commandArgs, command, _a, word, index, wordObject, _i, _b, definition, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    commandArgs = request.split(' ');
                    command = commandArgs[0].toUpperCase();
                    _a = command;
                    switch (_a) {
                        case 'CLIENT': return [3 /*break*/, 1];
                        case 'HELLO': return [3 /*break*/, 1];
                        case 'DEFINE': return [3 /*break*/, 2];
                        case 'QUIT': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 8];
                case 1:
                    socket.write("220 - SDML \"The Santinian Dictionary of Modern Language\" v1.0\r\nSend word suggestions to [hyper.industries+sdml@protonmail.com]\r\n");
                    return [3 /*break*/, 9];
                case 2:
                    word = commandArgs[2];
                    index = 1;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, collection.findOne({ word: word })];
                case 4:
                    wordObject = _c.sent();
                    if (wordObject) {
                        socket.write('250 - OK\r\n');
                        socket.write("150 - Found ".concat(wordObject.definitions.length, " definition(s) for \"").concat(word, "\":\r\n"));
                        for (_i = 0, _b = wordObject.definitions; _i < _b.length; _i++) {
                            definition = _b[_i];
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
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    console.error('Error querying MongoDB:', error_1);
                    socket.write("500 - Internal Server Error\r\n");
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 9];
                case 7:
                    socket.write("221 - Bye\r\n");
                    socket.end();
                    return [3 /*break*/, 9];
                case 8:
                    socket.write("500 - Unknown command\r\n");
                    _c.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
