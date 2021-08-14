import React from "react";
import Head from "next/head";
import RequestPage from "../components/RequestPage";

export default function reviews() {
  
  return (
    <div>
      <Head>
        <title>Review Dex - Requests</title>
      </Head>
      <RequestPage />
    </div>
  );
}
