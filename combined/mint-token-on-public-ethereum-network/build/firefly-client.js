"use strict";
// Copyright © 2023 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
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
var firefly_sdk_1 = __importDefault(require("@hyperledger/firefly-sdk"));
var totalMinted = 0;
var MAX_TOTAL_MINTED = 5;
if (!process.env.ACCOUNT_ADDRESS ||
    !process.env.ACCOUNT_ADDRESS.startsWith("0x")) {
    console.log("ACCOUNT_ADDRESS must be set to a valid eth address, you should use the account of your local Firefly stack.");
    process.exit(1);
}
/**
 * Main firefly SDK example code START
 * This sample code demonstrate how to listen to firefly events using filters
 * and mint tokens whenever the selected event satisfy our check
 */
var firefly = new firefly_sdk_1.default({ host: "http://localhost:5000" });
var sub = {
    filter: {
        events: "token_transfer_confirmed", // filter on confirmed transfers only
    },
};
// example code for listening to an event using Firefly SDK
firefly.listen(sub, function (socket, event) { return __awaiter(void 0, void 0, void 0, function () {
    var operations;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, firefly.getOperations({
                    tx: event.tx,
                    type: "token_transfer",
                })];
            case 1:
                operations = _g.sent();
                if (!(operations.length > 0)) return [3 /*break*/, 3];
                console.log("Retrieved operation: ".concat(JSON.stringify(operations[0].input)));
                if (!(((_b = (_a = operations[0].input) === null || _a === void 0 ? void 0 : _a.to) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === process.env.ACCOUNT_ADDRESS &&
                    ((_c = operations[0].input) === null || _c === void 0 ? void 0 : _c.type) === "mint")) return [3 /*break*/, 3];
                console.log("Mint the same token again to get us into a loop");
                return [4 /*yield*/, firefly.mintTokens({
                        amount: (_d = operations[0].input) === null || _d === void 0 ? void 0 : _d.amount,
                        idempotencyKey: (_e = operations[0].input) === null || _e === void 0 ? void 0 : _e.localId,
                        pool: (_f = operations[0].input) === null || _f === void 0 ? void 0 : _f.pool,
                    })];
            case 2:
                _g.sent();
                totalMinted++;
                _g.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Main firefly SDK example code END
 */
function wait() {
    if (totalMinted <= MAX_TOTAL_MINTED) {
        setTimeout(wait, 5000);
        console.log("Waiting for more events..., total token minted by this application: ".concat(totalMinted));
    }
    else {
        console.log("Exiting the application ".concat(totalMinted, "/").concat(MAX_TOTAL_MINTED, " tokens were minted."));
        process.exit(0);
    }
}
wait();
