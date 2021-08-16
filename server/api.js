import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import Merchant from "./model/merchant";
import Review from "./model/review";

const router =  Router();

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

