import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import Merchant from "../model/merchant";
import Review from "../model/review";
import imageUpload from "../storage/imageUpload";
import productRouter from "./product";

const router = Router();


router.get("/review", async (ctx) => {
  const shop = ctx.request.query.shop;
  const items = ctx.request.query.items - "0";
  try {
    const doc = await Merchant.findOne({ shop: shop });
    if (doc.totalReviews === 0) {
      ctx.response.status = 200;
      ctx.response.body = { merchant: doc, reviews: [] };
      return;
    }
    const reviews = await Review.find(
      { merchantID: doc.id, hidden: false },
      null,
      { limit: items }
    ).sort("-created");

    ctx.response.status = 200;
    ctx.response.body = { merchant: doc, reviews };
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});





router.post("/review", imageUpload.array("myImage"), async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
    const source = "WEB";

    const { name, about, email, title, body, product_id } = ctx.request.body;
    let rating;
    if (typeof ctx.request.body.rating === "string") {
      rating = ctx.request.body.rating - "0";
    } else {
      rating = ctx.request.body.rating;
    }

    const customerImg = ctx.files
      ? { customerImg: ctx.files.map( ({filename}) => { return process.env.HOST + "/images/" + filename}) }
      : [""];

    const doc = await Merchant.findOne({ shop: shop });
    const newReview = new Review({
      merchantID: doc.id,
      name,
      email,
      rating,
      title,
      body,
      about: about === "" ? "your shop" : about,
      hidden: false,
      source,
      productInfo: product_id,
      ...customerImg,
      created: new Date().toISOString(),
      verified: false,
    });
    await newReview.save();
    function calculateAverage() {
      const ans =
        doc.oneStar +
        2 * doc.twoStar +
        3 * doc.threeStar +
        4 * doc.fourStar +
        5 * doc.fiveStar +
        rating;
      const answer = ans / (doc.totalReviews + 1);
      return answer.toFixed(2);
    }
    const newMerchantData = {
      totalReviews: doc.totalReviews + 1,
      averageRating: calculateAverage(),
      oneStar: rating === 1 ? doc.oneStar + 1 : doc.oneStar,
      twoStar: rating === 2 ? doc.twoStar + 1 : doc.twoStar,
      threeStar: rating === 3 ? doc.threeStar + 1 : doc.threeStar,
      fourStar: rating === 4 ? doc.fourStar + 1 : doc.fourStar,
      fiveStar: rating === 5 ? doc.fiveStar + 1 : doc.fiveStar,
    };
    await Merchant.updateOne({ shop: shop }, { $set: { ...newMerchantData } });
    ctx.response.status = 200;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});



router.use("/product", productRouter.routes());

export default router;
