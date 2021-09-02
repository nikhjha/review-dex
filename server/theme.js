import Router from "koa-router";
import fs from "fs";
import Shopify, {  DataType } from "@shopify/shopify-api";
import  { verifyRequest } from "@shopify/koa-shopify-auth";
import * as path from "path";

const router = Router();



router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
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
          "reviewdex_panel.liquid"
        )}`,
        "utf8"
      );
      let reviewPanelData = {
        asset: {
          key: "sections/reviewdex_panel.liquid",
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
          "review_dex.js"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "assets/review_dex.js",
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
          "review_dex.css"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "assets/review_dex.css",
          value: reviewPanelCSS,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      const reviewDexCore = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "reviewdex_core.liquid"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "snippets/reviewdex_core.liquid",
          value: reviewDexCore,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      const reviewDexWidget = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "reviewdex_widgets.liquid"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "snippets/reviewdex_widgets.liquid",
          value: reviewDexWidget,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      const reviewDexBadge = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "reviewdex_badge.liquid"
        )}`,
        "utf8"
      );
      reviewPanelData = {
        asset: {
          key: "snippets/reviewdex_badge.liquid",
          value: reviewDexBadge,
        },
      };
      await client.put({
        path: `themes/${mainTheme}/assets`,
        data: reviewPanelData,
        type: DataType.JSON,
      });
      const reviewDexTheme = fs.readFileSync(
        `${path.resolve(
          "server",
          "..",
          "template_shopify",
          "theme.liquid"
        )}`,
        "utf8"
      );
      let tempTheme = await client.get({path : `themes/${mainTheme}/assets`,query : {"asset[key]" : "layout/theme.liquid"}});
      tempTheme = tempTheme.body.asset.value;
        const foundTheme = tempTheme.indexOf(reviewDexTheme);
        console.log(foundTheme);
        if(foundTheme !== -1){
            ctx.response.status = 200;
            return;
        }
        const newTheme = tempTheme.replace("</head>", "\n" + reviewDexTheme + "\n"+" </head>");
        reviewPanelData = {
            asset: {
              key: "layout/theme.liquid",
              value: newTheme,
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

export default router;