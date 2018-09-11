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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var request = require("request-promise");
exports.EnvConstants = {
    web3: { url: 'http://localhost:8545' },
    DECENT_ENV_PORT: process.env.DECENT_ENV_PORT || 5555,
    DECENT_ENV_HOST: process.env.DECENT_ENV_HOST || 'http://localhost'
};
var defaultUrl = exports.EnvConstants.DECENT_ENV_HOST + ':' + exports.EnvConstants.DECENT_ENV_PORT;
var DecentEnvClient = (function () {
    function DecentEnvClient(url) {
        if (url === void 0) { url = defaultUrl; }
        this.url = url;
    }
    DecentEnvClient.prototype.register = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var waiting, ping, e_1, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        waiting = true;
                        _a.label = 1;
                    case 1:
                        if (!waiting) return [3, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        console.log('waiting for service registry to come up @ ', this.url);
                        return [4, request.get(this.url + '/ping')];
                    case 3:
                        ping = _a.sent();
                        waiting = false;
                        return [3, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log('still waiting for service registry to come up @ ', this.url);
                        return [3, 5];
                    case 5: return [3, 1];
                    case 6: return [4, request.post(this.url + "/service", {
                            body: __assign({}, service),
                            json: true
                        })];
                    case 7:
                        resp = _a.sent();
                        return [2, resp];
                }
            });
        });
    };
    DecentEnvClient.prototype.get = function (serviceName) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, request.get(this.url + ("/service/" + serviceName))];
                    case 1:
                        resp = _a.sent();
                        return [2, JSON.parse(resp)];
                }
            });
        });
    };
    return DecentEnvClient;
}());
exports.DecentEnvClient = DecentEnvClient;
//# sourceMappingURL=index.js.map