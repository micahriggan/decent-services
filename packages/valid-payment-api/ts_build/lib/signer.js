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
Object.defineProperty(exports, "__esModule", { value: true });
var SignerUtil = (function () {
    function SignerUtil(web3, signingAddress) {
        this.web3 = web3;
        this.signingAddress = signingAddress;
    }
    SignerUtil.prototype.createMessage = function (_a) {
        var amount = _a.amount, expiration = _a.expiration, payloadHash = _a.payloadHash;
        return [
            {
                t: 'uint',
                v: amount
            },
            {
                t: 'uint',
                v: expiration
            },
            {
                t: 'bytes32',
                v: payloadHash
            }
        ];
    };
    SignerUtil.prototype.createPayloadMessage = function (_a) {
        var nonce = _a.nonce, dataStr = _a.dataStr;
        return [
            {
                t: 'uint',
                v: nonce
            },
            {
                t: 'string',
                v: dataStr
            }
        ];
    };
    SignerUtil.prototype.hashMessage = function (messageArr) {
        var _a;
        return (_a = this.web3.utils).soliditySha3.apply(_a, messageArr);
    };
    SignerUtil.prototype.signHash = function (hash) {
        return this.web3.eth.sign(hash, this.signingAddress);
    };
    SignerUtil.prototype.makeInvoice = function (wei, data) {
        if (data === void 0) { data = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var nonce, dataStr, payload, payloadMsg, payloadHash, minutes, seconds, expiration, amount, message, hash, signedHash, sig, r, s, v;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonce = Math.ceil(100000000000 * Math.random());
                        dataStr = parseInt(data, 10).toString();
                        payload = { nonce: nonce, dataStr: dataStr };
                        payloadMsg = this.createPayloadMessage(payload);
                        payloadHash = this.hashMessage(payloadMsg);
                        minutes = 60;
                        seconds = 60;
                        expiration = new Date().getTime() + 20 * minutes * seconds * 1000;
                        amount = wei;
                        message = this.createMessage({ amount: amount, expiration: expiration, payloadHash: payloadHash });
                        hash = this.hashMessage(message);
                        return [4, this.signHash(hash)];
                    case 1:
                        signedHash = _a.sent();
                        sig = signedHash.slice(2);
                        r = "0x" + sig.slice(0, 64);
                        s = "0x" + sig.slice(64, 128);
                        v = this.web3.utils.toDecimal(sig.slice(128, 130)) + 27;
                        return [2, { hash: hash, signedHash: signedHash, amount: amount, expiration: expiration, payload: payload, payloadHash: payloadHash, v: v, r: r, s: s }];
                }
            });
        });
    };
    return SignerUtil;
}());
exports.SignerUtil = SignerUtil;
//# sourceMappingURL=signer.js.map