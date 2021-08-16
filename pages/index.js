import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import { Page, Card, Layout, } from "@shopify/polaris";
import Statistics from "../components/Statistics";

import Widget from "../components/Widget";

const Index = () => {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Review Dex</title>
      </Head>
      <Page
        title="Welcome to Review Dex"
        subtitle="How would you like to get started today?"
      >
        <Layout>
          <Layout.Section oneHalf>
            <Widget />
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card
              title="Request reviews from your customers"
              primaryFooterAction={{
                content: "Request Reviews",
                onAction: () => {
                  router.push("/requests");
                },
              }}
              sectioned
            >
              <p>
                Send your review requests via emails, push notifications or SMS
                messages.
              </p>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      <Statistics />
    </div>
  );
};

export default Index;
