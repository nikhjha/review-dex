import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import Merchant from "./model/merchant";
import Review from "./model/review";

const router =  Router();

router.get("/getMerchantDetail/:id",(ctx)=>{
    const shop = ctx.params.id;
    Merchant.findOne({shop : shop}, (err,doc) => {
        if(err){
            ctx.response.status = 400;
            ctx.response.body = err;
        }
        else if(doc.totalReviews === 0){
            ctx.response.status = 200;
            ctx.response.body = {merchant : doc , reviews : []};
            return ;
        }
        else{
            Review.find({merchantID : doc.id, hidden : false},null,{limit : 6}, (err,reviews) => {
                if(err){
                    ctx.response.status = 400;
                    ctx.response.body = err;
                    
                }
                else{
                    ctx.response.status = 200;
                    ctx.response.body = {merchant : doc , reviews};
                }
            });
        }
    });
});

router.get("/reviews", async(ctx) => {
    const {shop} = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    Merchant.findOne({shop : shop}, (err,doc) => {
        if(err){
            ctx.response.status = 400;
            ctx.response.body = err;
        }
        else if(doc.totalReviews === 0){
            ctx.response.status = 200;
            ctx.response.body = { reviews : []};
            return ;
        }
        else{
            Review.find({merchantID : doc.id},null,null, (err,reviews) => {
                if(err){
                    ctx.response.status = 400;
                    ctx.response.body = err;
                }else{
                    ctx.response.status = 200;
                    ctx.response.body = {reviews};
                }
            });
        }
    });
});

router.get("/merchant", async(ctx) => {
    const {shop} = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    Merchant.findOne({shop : shop}, (err,doc) => {
        if(err){
            ctx.response.status = 400;
            ctx.response.body = err;
        }else{
            ctx.response.status = 200;
            ctx.response.body = {merchant : docs};
        }
    });
});

export default router;

