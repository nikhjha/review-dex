import React, { useState, useContext } from "react";
import { Modal, Form, FormLayout, TextField, Button } from "@shopify/polaris";
import { AxiosContext } from "./MyProvider";
import { ResourcePicker } from "@shopify/app-bridge-react";

export default function WriteReview({ active, setActive }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [product, setProduct] = useState("");
  const [productPicker, setProductPicker] = useState(false);
  const [rating, setRating] = useState("5");
  const { axiosFetch } = useContext(AxiosContext);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axiosFetch(async (instance) => {
        const formData = new FormData(e.target);
        const response = await instance.post("/api/review", formData);
        return response;
      });
      console.log(result);
      console.log("submitted");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    setActive(false);
  };
  return (
    <>
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
            <input
              name="about"
              type="text"
              value={product}
              style={{ display: "none" }}
            />
            {/* <Button onClick={setProductPicker(true)}>Pick Product</Button> */}
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
            <input type="file" name="myImage" />
            <TextField
              label="Rating"
              type="number"
              name="rating"
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
            <Button primary submit loading={loading}>
              Submit
            </Button>
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
    {/* <ResourcePicker
    resourceType="Product"
    open={productPicker}
    onCancel={() => {
      setProductPicker(false);
    }}
    onSelection={(selectPayload) => {
      console.log(selectPayload);
    }}
  /> */}
  </>
  );
}
