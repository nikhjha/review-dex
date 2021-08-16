import React, {useEffect, useContext, useState} from 'react';
import styles from "../styles/Statistic.module.css";
import icon1 from "../public/icon-1.png";
import icon2 from "../public/icon-2.png";
import icon3 from "../public/icon-3.png";
import Image from "next/image";
import { Page, Stack } from "@shopify/polaris";
import { AxiosContext } from "./MyProvider";

export default function Statistics() {
    const { axiosFetch } = useContext(AxiosContext);
    const [totalReviews, setTotalReviews] = useState("");
    const [emailSent, setEmailSent] = useState("");
    const [averageRating, setAverageRating] = useState("");
    useEffect(() => {
        async function getData() {
            const result = await axiosFetch(async (instance) => {
                const response = await instance.get("/api/merchant");
                return response;
            });
            console.log(result);
            const merchant = result.json();
            setTotalReviews(merchant.totalReviews);
            setEmailSent(merchant.emailRequest);
            setAverageRating(merchant.avarageRating);
        }        
        getData();
    }, [])
    const 
    return (
        <Page title="Statistics">
        <Stack>
          <div className={styles.card}>
            <div className={styles.img}>
              <Image width="70px" height="50px" alt="" src={icon1} />
            </div>
            <p className={styles.cardMain}>{totalReviews}</p>
            <p>Review received</p>
          </div>
          <div className={styles.card}>
            <div className={styles.img}>
              <Image width="70px" height="50px" alt="" src={icon2} />
            </div>
            <p className={styles.cardMain}>{emailSent}</p>
            <p>Emails sent</p>
          </div>
          <div className={styles.card}>
            <div className={styles.img}>
              <Image width="70px" height="50px" alt=""  src={icon3} />
            </div>
            <p className={styles.cardMain}>{averageRating}</p>
            <p>Avarage rating</p>
          </div>
        </Stack>
      </Page>
    )
}
