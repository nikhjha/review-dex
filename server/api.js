import Router from "koa-router";
import multer from "@koa/multer"
import Shopify from "@shopify/shopify-api";
import Merchant from "./model/merchant";
import Review from "./model/review";
import path from "path";
import csvRouter from "./api/csv";
import productRouter from "./api/product";


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


router.get("/getMerchantDetail",async(ctx)=>{
    const shop = ctx.request.query.shop;
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

router.post("/publish/:id", async(ctx) => {
    const id = ctx.params.id;
    try{
        await Review.updateOne({_id : id},{ $set : {hidden : false}});
        ctx.response.status = 200;
    }catch(e){
        ctx.response.status = 400;
        ctx.response.body = e;
    }
    
});

router.post("/hide/:id", async(ctx) => {
    const id = ctx.params.id;
    try{
        await Review.updateOne({_id : id},{ $set : {hidden : true}});
        ctx.response.status = 200;
    }catch(e){
        ctx.response.status = 400;
        ctx.response.body = e;
    }
});

router.post("/review", upload.single("myImage") ,async(ctx) => {
    const {shop} = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const {name,about,email,title,body,product_id,product_img} = ctx.request.body;
    let rating;
    if (typeof(ctx.request.body.rating) === "string"){
        rating = ctx.request.body.rating - "0";
    }else{
        rating = ctx.request.body.rating;
    }

    const customerImg = ctx.file ? {customerImg : [process.env.HOST + "/images/" + ctx.file.filename]}  : {};
    

    const doc = await Merchant.findOne({shop : shop});
    const newReview = new Review({
        merchantID : doc.id,
        name,
        email,
        rating,
        title,
        body,
        about : about === "" ? "your shop" : about,
        hidden : false,
        source : "ADMIN",
        productInfo : product_id,
        productImg : about !== "" ? product_img : "",
        ...customerImg,
        created : new Date().toISOString(),
    });
    await newReview.save();
    function calculateAverage(){
        const ans = doc.oneStar + 2 * doc.twoStar + 3 * doc.threeStar + 4 * doc.fourStar + 5 * doc.fiveStar + rating;
        const answer =  ans / (doc.totalReviews + 1);
        return answer.toFixed(2);
    }
    const newMerchantData = {
        totalReviews : doc.totalReviews + 1,
        averageRating : calculateAverage(),
        oneStar : rating === 1 ? doc.oneStar + 1 : doc.oneStar,
        twoStar : rating === 2 ? doc.twoStar + 1 : doc.twoStar,
        threeStar : rating === 3 ? doc.threeStar + 1 : doc.threeStar,
        fourStar : rating === 4 ? doc.fourStar + 1 : doc.fourStar,
        fiveStar : rating === 5 ? doc.fiveStar + 1 : doc.fiveStar,
    }
    await Merchant.updateOne({shop : shop},{ $set : {...newMerchantData}});
    ctx.response.status = 200;
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

router.use("/import-reviews", 
    csvRouter.routes()
);

router.use("/products", productRouter.routes());

export default router;

