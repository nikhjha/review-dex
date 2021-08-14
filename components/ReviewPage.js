import React, { useState } from "react";
import {
  Page,
  Modal,
  Form,
  FormLayout,
  TextField,
  Button,
} from "@shopify/polaris";
import ReviewTab from "./ReviewTab";

export default function ReviewPage() {
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
  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const handleSubmit = (e) => {
      e.preventDefault();
      console.log("submitted");
      setActive(false);
  }
  return (
    <Page
      title="Reviews"
      primaryAction={{
        content: "Write Review",
        onAction: () => {
          setActive(true);
        },
      }}
    >
      <ReviewTab tabs={tabs} />
      <Modal
        open={active}
        onClose={() => {
          setActive(false);
        }}
        title="Write a Review"
      >
        <Modal.Section>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                label="Name"
                type="text"
                value={name}
                onChange={(newName) => {
                  setName(newName);
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(newEmail) => {
                  setEmail(newEmail);
                }}
              />
              <TextField
                label="Rating"
                type="number"
                value={rating}
                min={1}
                max={5}
                onChange={(newRating) => {
                  setRating(newRating);
                }}
              />
              <TextField
                label="Review Title"
                type="text"
                value={title}
                onChange={(newTitle) => {
                  setTitle(newTitle);
                }}
              />
              <TextField
                label="Review Body"
                type="text"
                value={body}
                multiline={4}
                onChange={(newBody) => {
                  setBody(newBody);
                }}
              />
              <Button primary submit>
                Submit
              </Button>
              
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
