import Router from "koa-router";
import fs from "fs";
import Shopify, {  DataType } from "@shopify/shopify-api";
import * as path from "path";

const router = Router();



router.post("/", async (ctx) => {
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
      ctx.response.status = 200;
    } catch (e) {
      ctx.response.status = 503;
      ctx.response.body = e;
      console.log(e);
    }
});

export default router;