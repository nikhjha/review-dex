import React from "react";
import {
  Page
} from "@shopify/polaris";
import RequestTab from "./RequestTab";

export default function RequestPage() {
  const tabs = [
    {
      id: "all-requests-1",
      content: "Requests",
      accessibilityLabel: "Requests",
      panelID: "all-requests-content-1",
    },
    {
      id: "email-templates-1",
      content: "Email Templates",
      panelID: "email-templates-content-1",
    }
  ];
  return (
    <Page
      title="Request Section"
      primaryAction={{
        content: "Write Request",
      }}
    >
      <RequestTab tabs={tabs} />
    </Page>
  );
}
