import Router from "koa-router";
import multer from "@koa/multer"
import Shopify from "@shopify/shopify-api";
import Merchant from "./model/merchant";
import Review from "./model/review";
import path from "path";

const router =  Router();

const storage = multer.diskStorage({
    destination: path.resolve(
        "server",
        "..",
        "public",
        "images"
      ),
    filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
    return cb(null,true);
    } else {
    cb('Error: Images Only!');
    }
}

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
    checkFileType(file, cb);
    }
});


router.get("/getMerchantDetail/:id",async(ctx)=>{
    const shop = ctx.params.id;
    try {
        const doc = await Merchant.findOne({shop : shop});
    if(doc.totalReviews === 0){
        ctx.response.status = 200;
        ctx.response.body = {merchant : doc , reviews : []};
        return;
    }
    const reviews = await Review.find({merchantID : doc.id, hidden : false},null,{limit : 6}); 
    ctx.response.status = 200;
    ctx.response.body = {merchant : doc , reviews}; 
    }
    catch(e){
        ctx.response.status = 400;
    ctx.response.body = e; 
    }
});

router.get("/reviews", async(ctx) => {
    const {shop} = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    try {
        const doc = await Merchant.findOne({shop : shop});
    if(doc.totalReviews === 0){
        ctx.response.status = 200;
        ctx.response.body = { reviews : []};
        return;
    }
    const reviews = await Review.find({merchantID : doc.id}); 
    ctx.response.status = 200;
    ctx.response.body = { reviews}; 
    }
    catch(e){
        ctx.response.status = 400;
    ctx.response.body = e; 
    }
});

router.post("/review", upload.single("myImage") ,async(ctx) => {
    console.log(ctx.req.file,ctx.req.body);
});


router.get("/merchant", async(ctx) => {
    const {shop} = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    try {
        const doc = await Merchant.findOne({shop : shop});
        ctx.response.status = 200;
    ctx.response.body = { merchant : doc}; 
    }
    catch(e){
        ctx.response.status = 400;
    ctx.response.body = e; 
    }
});

export default router;

