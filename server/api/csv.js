import Router from "koa-router";
import multer from "@koa/multer"
import Shopify from "@shopify/shopify-api";
import Merchant from "../model/merchant";
import Review from "../model/review";
import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';

const router =  Router();

const storage = multer.diskStorage({
    destination: path.resolve(
        "server",
        "..",
        "public",
        "csv"
      ),
    filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /csv/;
    // Check ext
    console.log(path.extname(file.originalname).toLowerCase());
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
    return cb(null,true);
    } else {
    cb('Error: csv Only!');
    }
}

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
    checkFileType(file, cb);
    }
});

router.post("/", upload.single("myCSV") ,async(ctx) => {
    const {shop} = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    if(!ctx.file){
        ctx.response.status = 200;
        return;
    }else{
        const filePath = path.resolve( "server",
        "..",
        "public",
        "csv",ctx.file.filename);
        fs.createReadStream(filePath)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', () => {fs.unlink(filePath, (err) => {console.log(err)})});
    ctx.response.status = 200;
    }
});

export default router;