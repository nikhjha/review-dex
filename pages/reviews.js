import React from "react";
import Head from "next/head";
import { Page } from "@shopify/polaris";
import ReviewTab from "../components/ReviewTab";

export default function reviews() {
  const tabs = [
    {
      id: "all-reviews-1",
      content: "All Reviews",
      accessibilityLabel: "All Reviews",
      panelID: "all-reviews-content-1",
    },
    {
      id: "product-reviews-1",
      content: "Product Reviews",
      panelID: "product-reviews-content-1",
    },
    {
      id: "shop-reviews-1",
      content: "Shop Reviews",
      panelID: "shop-reviews-content-1",
    },
    {
      id: "archived-reviews-1",
      content: "Archived Reviews",
      panelID: "archived-reviews-content-1",
    },
  ];
  return (
    <div>
      <Head>
        <title>Review Dex - Reviews</title>
      </Head>
      <Page title="Reviews" primaryAction={{ content: "Write Review" }}>
        <ReviewTab tabs={tabs} />
      </Page>
    </div>
  );
}
