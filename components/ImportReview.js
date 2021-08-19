import React, { useContext } from "react";
import { Modal, Form, FormLayout, Button } from "@shopify/polaris";
import { AxiosContext } from "./MyProvider";
import { Header } from "@shopify/polaris";

export default function ImportReview({ active, setActive }) {
  const [loading, setLoading] = useState(false);
  const { axiosFetch } = useContext(AxiosContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axiosFetch(async (instance) => {
        const formData = new FormData(e.target);
        const response = await instance.post("/api/import-reviews", formData);
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
    <Modal
      open={active}
      onClose={() => {
        setActive(false);
      }}
      title="Import Reviews"
    >
      <Modal.Section>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <Header>You can upload reviews as CSV format.</Header>

            <input type="file" name="myCSV" />

            <Button primary submit loading={loading}>
              Import Reviews
            </Button>
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}
