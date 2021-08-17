import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion, DataType } from "@shopify/shopify-api";
import { connect as mongoose } from "mongoose";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import serve from "koa-static";
import fs from "fs";
import path from "path";
import apiRouter from "./api";
import Merchant from "./model/merchant";
import cors from "koa2-cors";
import bodyParser from "koa-bodyparser";

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  mongoose("mongodb://localhost:27017/reviewDexDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;
        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }
        const isMerchant = await Merchant.exists({ shop: shop });
        if (!isMerchant) {
          const newMerchant = new Merchant({
            shop: shop,
            averageRating: 0,
            totalReviews: 0,
            oneStar: 0,
            twoStar: 0,
            threeStar: 0,
            fourStar: 0,
            fiveStar: 0,
            emailRequest: 0,
          });
          await newMerchant.save();
        }
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.post("/inject-assets", async (ctx) => {
    try {
      // Load the current session to get the `accessToken`.
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      // Create a new client for the specified shop.
      const client = new Shopify.Clients.Rest(
        session.shop,
        session.accessToken
      );
      // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
      const themes = await client.get({
        path: "themes",
      });
      let mainTheme;
      themes.body.themes.forEach((theme) => {
        if (theme.role === "main") {
          mainTheme = theme.id;
        }
      });
      const reviewPanelLiquid = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "review-panel.liquid"
        )}`,
        "utf8"
      );
      let reviewPanelData = {
        asset: {
          key: "sections/review-panel.liquid",
          value: reviewPanelLiquid,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      const reviewPanelJs = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "review-panel.js"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "assets/review-panel.js",
          value: reviewPanelJs,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      const reviewPanelCSS = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "review-panel.css"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "assets/review-panel.css",
          value: reviewPanelCSS,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      ctx.response.status = 200;
    } catch (e) {
      ctx.response.status = 503;
      ctx.response.body = e;
      console.log(e);
    }
  });
  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("/_next/image", handleRequest); // image content is clear
  router.use("/api", apiRouter.routes());
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });
  server.use(serve(path.resolve(
    "server",
    "..",
    "public"
  )));
  server.use(cors({origin : function(ctx) {
    // if (ctx.url === '/api/getMerchantDetail') {
    //   return '*';
    // }
    return "*";
  }}));
  server.use(bodyParser());
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
