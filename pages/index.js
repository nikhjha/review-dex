import { useContext,useEffect,useRef} from "react";
import { Heading, Page, Button } from "@shopify/polaris";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { TokenContext } from "./_app";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
const Index = () => {
  const {app} = useContext(TokenContext);
  const accessToken = useRef();
  const loadingToken = useRef(true);
  const query = gql`
  query {
    shop {
      primaryDomain {
        host
      }
    }
  }
  `;
  const { data,loading } = useQuery(query);
  useEffect(() => {
    async function fetchToken(){
      accessToken.current = await getSessionToken(app);
      loadingToken.current = false;
    }
    fetchToken();
  }, [])
  return (
  <Page>
    <Heading>Shopify app with Node and React by nikhil🎉</Heading>
    <Button onClick={async()=>{
      if(loadingToken.current || loading){
        return;
      }
      const token = accessToken.current;
      const shop = data.shop.primaryDomain.host;
      let config = {
        method : "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
        },
        body : JSON.stringify({shop,token})
      }
      const res = await fetch("/inject-assets",config);
      const result = await res.json();
      console.log(result);
    }}>Inject asset's in theme</Button>
  </Page>
  );
};

export default Index;
