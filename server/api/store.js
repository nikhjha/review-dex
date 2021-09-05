import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import Merchant from "../model/merchant";
import Review from "../model/review";
import imageUpload from "../storage/imageUpload";
import csvRouter from "./csv";
import { verifyRequest } from "@shopify/koa-shopify-auth";

const router = Router();


router.get("/review", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({ shop: shop });
    if (doc.totalReviews === 0) {
      ctx.response.status = 200;
      ctx.response.body = { reviews: [] };
      return;
    }
    const reviews = await Review.find({ merchantID: doc.id }).sort("-created");
    ctx.response.status = 200;
    ctx.response.body = { reviews };
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.get("/merchant", verifyRequest({ returnHeader: true }), async (ctx) => {
  // try {
  //   const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  //   const doc = await Merchant.findOne({ shop: shop });
  //   ctx.response.status = 200;
  //   ctx.response.body = { merchant: doc };
  // } catch (e) {
  //   ctx.response.status = 400;
  //   ctx.response.body = e;
  // }
  ctx.response.status = 400;
});

router.post(
  "/publish/:id",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    const id = ctx.params.id;
    try {
      await Review.updateOne({ _id: id }, { $set: { hidden: false } });
      ctx.response.status = 200;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/hide/:id", verifyRequest({ returnHeader: true }), async (ctx) => {
  const id = ctx.params.id;
  try {
    await Review.updateOne({ _id: id }, { $set: { hidden: true } });
    ctx.response.status = 200;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post(
  "/review",
  verifyRequest({ returnHeader: true }),
  imageUpload.array("myImage"),
  async (ctx) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const shop = session.shop;
      const source = "ADMIN";

      const { name, about, email, title, body, product_id } = ctx.request.body;
      let rating;
      if (typeof ctx.request.body.rating === "string") {
        rating = ctx.request.body.rating - "0";
      } else {
        rating = ctx.request.body.rating;
      }

      const customerImg = ctx.files
        ? {
            customerImg: ctx.files.map(({ filename }) => {
              return process.env.HOST + "/images/" + filename;
            }),
          }
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
      await Merchant.updateOne(
        { shop: shop },
        { $set: { ...newMerchantData } }
      );
      ctx.response.status = 200;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.use("/import-reviews", csvRouter.routes());

export default router;
