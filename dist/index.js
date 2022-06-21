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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const fs = require('fs');
require('dotenv').config();
const importProduct_1 = __importDefault(require("./importProduct"));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/importPoroduct?name=jewelery");
}));
app.get("/importPoroduct", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var excelfile = "public/" + req.query.name + '.xlsx';
    yield judgeFileExist(res, excelfile);
    const result = yield importProduct_1.default.importData(req, res, excelfile);
    res.json(result);
}));
function judgeFileExist(res, fileUrl) {
    fs.access(fileUrl, fs.constants.F_OK, (err) => {
        console.log(fileUrl);
        if (err) {
            res.json({ code: 400, msg: '文件不存在' });
        }
    });
}
module.exports = app;
//# sourceMappingURL=index.js.map