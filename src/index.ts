import express from 'express';
const app = express();
const fs = require('fs');
require('dotenv').config();

import importProduct from './importProduct';

app.get("/", async (req: express.Request, res: express.Response) => {
    res.redirect("/importPoroduct?name=jewelery")
});
app.get("/importPoroduct", async (req: express.Request, res: express.Response) => {
    var excelfile = "public/"+req.query.name+'.xlsx';
    await judgeFileExist(res,excelfile)
    const result = await importProduct.importData(req, res, excelfile);
    res.json(result);
});
function judgeFileExist(res: express.Response,fileUrl: string){
    fs.access(fileUrl, fs.constants.F_OK, (err: any) => {
        console.log(fileUrl)
        if (err) { 
            res.json({code: 400,msg: '文件不存在'});
        }
    });
}
module.exports = app;
