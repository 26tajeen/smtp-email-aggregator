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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var smtp_server_1 = require("smtp-server");
var config_1 = require("./lib/config");
var aggregator_1 = require("./lib/aggregator");
var send_queue_1 = require("./lib/send_queue");
var checker_1 = require("./lib/checker");
var logger_1 = require("./lib/logger");
var live_test_server_1 = require("./lib/live_test_server");
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var errorMessage, incomingServer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, config_1.configSanityCheck)()];
            case 1:
                if (!(_a.sent())) {
                    errorMessage = "config.aggregate.subject and/or config.aggregate.bodyFile do not contain the {name} tag, refusing to start server";
                    logger_1.logger.error(errorMessage);
                    console.log("error: ".concat(errorMessage));
                    return [2 /*return*/];
                }
                incomingServer = new smtp_server_1.SMTPServer({
                    onData: function (stream, session, callback) {
                        return __awaiter(this, void 0, void 0, function () {
                            var from, to;
                            return __generator(this, function (_a) {
                                from = (session.envelope.mailFrom) ? session.envelope.mailFrom.address : "";
                                to = session.envelope.rcptTo.map(function (_a) {
                                    var address = _a.address;
                                    return address;
                                }).join(",");
                                logger_1.logger.debug("SERVER received and adding message with header: ".concat(JSON.stringify({ from: from, to: to })));
                                aggregator_1.aggregator.addMessage({ from: from, to: to }, stream);
                                callback();
                                return [2 /*return*/];
                            });
                        });
                    },
                    authOptional: true,
                    hideSTARTTLS: true
                });
                logger_1.logger.debug("SERVER starting incoming server");
                incomingServer.listen(config_1.config.incoming.port, config_1.config.incoming.host, function () {
                    console.log("incoming smtp server listening on ".concat(config_1.config.incoming.host, ":").concat(config_1.config.incoming.port));
                });
                logger_1.logger.debug("SERVER starting send queue");
                send_queue_1.sendQueue.start();
                logger_1.logger.debug("SERVER starting expiry checker");
                checker_1.checker.start();
                (0, live_test_server_1.startLiveTestServer)();
                return [2 /*return*/];
        }
    });
}); };
exports.run = run;
// run();
