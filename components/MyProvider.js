import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { Frame } from "@shopify/polaris";
import NavigationComponent from "./Navigation";
import axios from "axios";

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

export const AxiosContext = React.createContext();

export default function MyProvider(props) {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  const instance = axios.create();
  // Intercept all requests on this Axios instance
  instance.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });
  const axiosFetch = async (fetchCallback) => {
    const response = await fetchCallback(instance);
    console.log(response);
    console.log(response.headers["X-Idont-know"]);
    console.log(response.headers["X-Shopify-API-Request-Failure-Reauthorize"]);
    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }
    return response;
  };
  const value = {
    axiosFetch,
  };
  return (
    <AxiosContext.Provider value={value}>
      <ApolloProvider client={client}>
        <Frame navigation={<NavigationComponent />}>
          <Component {...props} />
        </Frame>
      </ApolloProvider>
    </AxiosContext.Provider>
  );
}
