import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { Page, Card, Layout, Stack } from "@shopify/polaris";
import styles from "../styles/Statistic.module.css";
import icon1 from "../public/icon-1.png";
import icon2 from "../public/icon-2.png";
import icon3 from "../public/icon-3.png";
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
      <Page title="Statistics">
        <Stack>
          <div className={styles.card}>
            <div className={styles.img}>
              <Image width="70px" height="50px" alt="" src={icon1} />
            </div>
            <p className={styles.cardMain}>2</p>
            <p>Review received</p>
          </div>
          <div className={styles.card}>
            <div className={styles.img}>
              <Image width="70px" height="50px" alt="" src={icon2} />
            </div>
            <p className={styles.cardMain}>0</p>
            <p>Emails sent</p>
          </div>
          <div className={styles.card}>
            <div className={styles.img}>
              <Image width="70px" height="50px" alt=""  src={icon3} />
            </div>
            <p className={styles.cardMain}>5</p>
            <p>Avarage rating</p>
          </div>
        </Stack>
      </Page>
    </div>
  );
};

export default Index;
