import React from "react";
import Head from "next/head";
import ReviewPage from "../components/ReviewPage";

export default function reviews() {
  
  return (
    <div>
      <Head>
        <title>Review Dex - Reviews</title>
      </Head>
      <ReviewPage />
    </div>
  );
}
