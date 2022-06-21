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
const exceljs_1 = __importDefault(require("exceljs"));
var shopifyAPI = require('shopify-node-api');
const ImportProduct = {
    importData(req, res, excelfile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var listData = yield this.parseData(req, res, excelfile);
                yield this.postShopify(req, res, listData);
                return { code: 200, msg: '导入成功' };
            }
            catch (e) {
                console.log(e);
                return { code: 400, msg: '导入失败', };
            }
        });
    },
    //解析数据
    parseData(req, res, filename) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const title = {
                handle: 1,
                title: 2,
                body_html: 3,
                vendor: 6,
                product_type: 5,
                tags: 6,
                price: 20,
                imgSrc: 25,
                imgPosition: 26,
                option1Name: 8,
                option1Value: 9
            };
            const workbook = new exceljs_1.default.Workbook();
            var listData = {};
            const worksheets = yield workbook.xlsx.readFile(filename);
            var worksheet = worksheets.getWorksheet(1);
            for (let i = 2; i < worksheet.rowCount + 1; i++) {
                const row = worksheet.getRow(i);
                const handle = (row.getCell(title.handle).value);
                if (handle && !listData[handle]) {
                    listData[handle] = {
                        title: row.getCell(title.title).value,
                        body_html: row.getCell(title.body_html).value,
                        tags: row.getCell(title.tags).value,
                        product_type: row.getCell(title.product_type).value,
                        vendor: row.getCell(title.vendor).value,
                        images: [],
                        variants: [],
                        options: []
                    };
                }
                const option1Name = (_a = row.getCell(title.option1Name)) === null || _a === void 0 ? void 0 : _a.value;
                const option1Value = (_b = row.getCell(title.option1Value)) === null || _b === void 0 ? void 0 : _b.value;
                const price = (_c = row.getCell(title.price)) === null || _c === void 0 ? void 0 : _c.value;
                const variants = {};
                if (option1Value) {
                    variants.option1 = option1Value;
                    variants.price = price;
                    listData[handle].variants.push(variants);
                }
                const options = {};
                if (option1Value) {
                    if (listData[handle].options.length) {
                        listData[handle].options[listData[handle].options.length - 1].values.push(option1Value);
                    }
                    else {
                        options.name = option1Name;
                        options.values = [option1Value];
                        listData[handle].options.push(options);
                    }
                }
                listData[handle].images.push({
                    src: row.getCell(title.imgSrc).value,
                    position: row.getCell(title.imgPosition).value
                });
            }
            return listData;
        });
    },
    //提交，数据
    postShopify(req, res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { SHOP, API_KEY, TOKEN } = process.env;
            var Shopify = new shopifyAPI({
                shop: SHOP,
                shopify_api_key: API_KEY,
                access_token: TOKEN,
                verbose: false
            });
            Object.keys(data).forEach((key) => {
                Shopify.post('/admin/products.json', { product: data[key] }, function (err, data, headers) {
                    // console.log(err)
                });
            });
        });
    }
};
exports.default = ImportProduct;
//# sourceMappingURL=importProduct.js.map