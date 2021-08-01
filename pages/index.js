import { useContext} from "react";
import { Heading, Page, Button } from "@shopify/polaris";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { TokenContext } from "./_app";
const Index = () => {
  const {app} = useContext(TokenContext);
  
  
  return (
  <Page>
    <Heading>Shopify app with Node and React by nikhil🎉</Heading>
    <Button onClick={async()=>{
      try {
        const result = await authenticatedFetch(app)("/inject-assests",{method : 'POST',credentials : 'same-origin'});
        const res = await result.json()
        console.log(res);
      }
      catch(e){
        console.log(e);
      }
    }}>Inject asset's in theme</Button>
  </Page>
  );
};

export default Index;
