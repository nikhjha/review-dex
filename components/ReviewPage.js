import React, {useState} from "react";
import {
  Page,
} from "@shopify/polaris";
import ReviewTab from "./ReviewTab";
import WriteReview from "./WriteReview";
import ImportReview from "./ImportReview";

export default function ReviewPage() {

  const [activeWriteReview, setActiveWriteReview] = useState(false);
  const [activeImportReview, setActiveImportReview] = useState(false);

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
    }
  ];
  
  return (
    <Page
      title="Reviews"
      primaryAction={{
        content: "Write Review",
        onAction: () => {
          setActiveWriteReview(true);
        },
      }}
      secondaryActions={[
        {
          content: 'Import Reviews',
          onAction : () =>{
            setImportReview(true);
          }
        },
      ]}
    >
      <ReviewTab tabs={tabs} />
      <WriteReview active={activeWriteReview} setActive={setActiveWriteReview}/>    
      <ImportReview active={activeImportReview} setActive={setActiveImportReview}/> 
    </Page>
  );
}
