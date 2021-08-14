import React from "react";
import { useContext, useState} from "react";
import { AxiosContext } from "./MyProvider";
import { Card, Toast } from "@shopify/polaris";

export default function Widget() {
    const [loading , setLoading] = useState(false);
  const { axiosFetch } = useContext(AxiosContext);
  const [active, setActive] = useState({state : false, error : null, status : null});

  const setToast = (state, error, status) => {
      setActive({state,error,status});
  }

  const toastMarkup = active.state ? (
    <Toast content={active.status} error={active.error} onDismiss={()=>{setToast(false,null,null)}} />
  ) : null;
  return (
    <Card
      title="Add widget to your theme"
      primaryFooterAction={{
        content: "Add widget",
        loading: loading,
        onAction: async () => {
            setLoading(true);
          try {
            const result = await axiosFetch(async (instance) => {
              const response = await instance.post("/inject-assets");
              return response;
            });
            // const res = await result.json()
            if (result.status === 200) {
                console.log("Done");
                setToast(true,false,"Widget is added to your theme.");
            }
          } catch (e) {
            console.log(e);
            setToast(true,true,"Something went wrong");
          }
          setLoading(false);
        },
      }}
      sectioned
    >
        {toastMarkup}
      <p>
        Add customizable widget to your main theme section . Review panel can be
        accessed in your theme
      </p>
    </Card>
  );
}
