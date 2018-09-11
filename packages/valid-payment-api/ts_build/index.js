"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var decent_env_client_1 = require("decent-env-client");
var signer_1 = require("./lib/signer");
var monitor_1 = require("./lib/monitor");
var decent_smart_contracts_1 = require("decent-smart-contracts");
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.WebsocketProvider(decent_env_client_1.EnvConstants.web3.url));
var api = express();
var env = new decent_env_client_1.DecentEnvClient();
web3.eth.getAccounts(function (err, accounts) { return __awaiter(_this, void 0, void 0, function () {
    var signer, data, PaymentValidator, monitor;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                signer = new signer_1.SignerUtil(web3, accounts[1]);
                web3.eth.net.getId(console.log);
                return [4, decent_smart_contracts_1.SmartContracts.PaymentValidator.getFor(web3)];
            case 1:
                data = _a.sent();
                PaymentValidator = new web3.eth.Contract(data.abi, data.address);
                monitor = new monitor_1.Monitor(PaymentValidator);
                api.get('/quote/:wei/:data', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var payload;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('creating invoice quote');
                                return [4, signer.makeInvoice(req.params.wei, req.params.data)];
                            case 1:
                                payload = _a.sent();
                                res.send(payload);
                                return [2];
                        }
                    });
                }); });
                api.get('/quote/:wei', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                    var payload;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('creating invoice quote');
                                return [4, signer.makeInvoice(req.params.wei)];
                            case 1:
                                payload = _a.sent();
                                res.send(payload);
                                return [2];
                        }
                    });
                }); });
                env.register({ name: 'valid-payments-api' }).then(function (service) {
                    api.listen(service.port, function () {
                        console.info("Api listening on port " + service.port);
                        monitor.watchForPayment(console.log);
                    });
                });
                return [2];
        }
    });
}); });
//# sourceMappingURL=index.js.map