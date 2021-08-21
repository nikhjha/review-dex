import Router from "koa-router";
import Review from "../model/review";
import Merchant from "../model/merchant";

const router = Router();

router.get("/",async(ctx)=>{
    const withReviews = ctx.request.query.with_reviews;
    const productID = ctx.request.query.product_id;
    const shop = ctx.request.query.shop;
    try {
        const doc = await Merchant.findOne({shop : shop});
        const reviews = await Review.find({merchantID : doc.id, productInfo : productID});
        let totalReviews = 0;
        let oneStar = 0;
        let twoStar = 0;
        let threeStar = 0;
        let fourStar = 0;
        let fiveStar = 0;
        function calculateAverage(){
            const ans = oneStar + 2 * twoStar + 3 * threeStar + 4 * fourStar + 5 * fiveStar;
            const answer =  ans / (totalReviews);
            return answer.toFixed(2);
        }
        reviews.forEach(({rating}) => {
            totalReviews+=1;
            switch (rating) {
                case 5:
                    fiveStar += 1;
                    break;
                case 4:
                    fourStar += 1;
                    break;
                case 3:
                    threeStar += 1;
                    break;
                case 2:
                    twoStar += 1;
                    break;
                case 1:
                    oneStar += 1;
                    break;
                default :
                    break;
            }
        });

        const product = {
            totalReviews,
            averageRating: calculateAverage(),
            oneStar,
            twoStar,
            threeStar,
            fourStar,
            fiveStar,
        }
        if(withReviews){
            ctx.response.status = 200;
            ctx.response.body = { product, reviews}; 
        }else{
            ctx.response.status = 200;
            ctx.response.body = { product }; 
        }
    }
    catch(e){
        ctx.response.status = 400;
        ctx.response.body = e; 
    }
});

export default router;