import React, { useState, useContext } from "react";
import {
  Page,
  Modal,
  Form,
  FormLayout,
  TextField,
  Button,
} from "@shopify/polaris";
import ReviewTab from "./ReviewTab";
import { AxiosContext } from "./MyProvider";

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
    }
  ];
  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(5);
  const {axiosFetch} = useContext(AxiosContext);
  const handleSubmit = async(e) => {
      e.preventDefault();
      try{
        const result = await axiosFetch(async (instance) => {
          const formData = new FormData(e.target);
          const response = await instance.post("/api/review",formData);
          return response;
        });
        console.log(result);
        console.log("submitted");
      }catch(e){
        console.log(e);
      }
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
                name="name"
                value={name}
                onChange={(newName) => {
                  setName(newName);
                }}
              />
              <TextField
                label="Product"
                type="text"
                name="about"
                value={product}
                onChange={(newName) => {
                  setProduct(newName);
                }}
                placeholder="leave it empty if it's shop review"
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(newEmail) => {
                  setEmail(newEmail);
                }}
              />
              <p>Your Images</p>
              <input type="file" name="myImage"/>
              <TextField
                label="Rating"
                type="number"
                name="rating"
                value={rating}
                onChange={(newRating) => {
                  if(newRating > 5){
                    setRating(5);
                    return;
                  }
                  if(newRating < 1){
                    setRating(1);
                    return;
                  }
                  setRating(newRating);
                }}
              />
              <TextField
                label="Review Title"
                type="text"
                name="title"
                value={title}
                onChange={(newTitle) => {
                  setTitle(newTitle);
                }}
              />
              <TextField
                label="Review Body"
                type="text"
                name="body"
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
