import express from 'express';
import Exceljs from 'exceljs';
var shopifyAPI = require('shopify-node-api');


//提交Shopify的数据结构
interface ShopifyProductItem {
  title: string,
  body_html: string,
  price: string,
  product_type: string
  images: [
    src: string
  ],
  variants: [
    option1?: string,
    option2?: string,
    option3?: string,
  ],
  options: [
    name:string,
    values: string[]
  ], 
}

const ImportProduct = {

  async importData(req: express.Request, res: express.Response,excelfile: string) {
    try {
      var listData = await this.parseData(req,res,excelfile);
      await this.postShopify(req,res,listData);
      return {code: 200,msg: '导入成功'};
    } catch (e) {
      console.log(e)
      return {code: 400,msg: '导入失败',};
    }
  },
  //解析数据
  async parseData(req: express.Request, res: express.Response,filename: string): Promise<{[propName: string]:ShopifyProductItem}> {
    const title = {
        handle: 1,
        title: 2,
        body_html: 3,
        vendor:6,
        product_type: 5,
        tags:6,
        price: 20,
        imgSrc: 25,
        imgPosition: 26,
        option1Name: 8,
        option1Value: 9
    };
    const workbook = new Exceljs.Workbook();
    
    var listData: any = {};
    const worksheets = await workbook.xlsx.readFile(filename);
    var worksheet = worksheets.getWorksheet(1);
    for (let i = 2; i <  worksheet.rowCount+1; i++) {
      const row = worksheet.getRow(i);
      const handle = (row.getCell(title.handle).value) as string;
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
        }
      }
      

      const option1Name = row.getCell(title.option1Name)?.value;
      const option1Value = row.getCell(title.option1Value)?.value;
      const price = row.getCell(title.price)?.value;

      const variants: any = {};
      if (option1Value) {
        variants.option1 = option1Value;
        variants.price = price;
        listData[handle].variants.push(variants);
      }
      

      const options: any = {};
      if (option1Value) {
        if(listData[handle].options.length){
          listData[handle].options[listData[handle].options.length-1].values.push(option1Value)
        }else{
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
  },
  //提交，数据
  async postShopify(req: express.Request, res: express.Response,data:{[propName: string]:ShopifyProductItem}) {
    const { SHOP, API_KEY, TOKEN } = process.env;
    var Shopify = new shopifyAPI({
      shop: SHOP, // MYSHOP.myshopify.com
      shopify_api_key: API_KEY, // API key
      access_token: TOKEN, // API password
      verbose:false
    })
    Object.keys(data).forEach((key) => {
      
      Shopify.post('/admin/products.json', { product: data[key] }, function(err:[], data:[], headers:[]){
        // console.log(err)
      });

    });
  }
}

export default ImportProduct;

