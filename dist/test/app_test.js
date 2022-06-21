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
const appTest = require('../index');
var assert = require('assert');
const request = require('supertest');
describe('#test import prodct', () => {
    describe('#test server', () => {
        let server = appTest.listen(8888);
        it('#test GET /importPoroduct', () => __awaiter(void 0, void 0, void 0, function* () {
            let res = yield request(server)
                .get('/importPoroduct?name=jewelery')
                .expect('Content-Type', /json/)
                .expect(200, /200/);
        }));
    });
});
//# sourceMappingURL=app_test.js.map