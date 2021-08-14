import { Navigation } from "@shopify/polaris";
import { useRouter } from "next/dist/client/router";
import React from "react";
import {HomeMajor, TextBlockMajor, FollowUpEmailMajor, SettingsMajor} from '@shopify/polaris-icons';

export default function NavigationComponent() {
    const router = useRouter();
    console.log(router.route);
  return (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: "Home",
            icon: HomeMajor,
            onClick: () => {router.push("/")}
          },
          {
            label: "Reviews",
            icon: TextBlockMajor,
            onClick: () => {router.push("/reviews")}
          },
          {
            label: "Requests",
            icon: FollowUpEmailMajor,
            onClick: () => {router.push("/requests")}
          },
          {
              label : 'Settings',
              icon: SettingsMajor,
              onClick: () => {router.push("/settings")}
          }
        ]}
      />
    </Navigation>
  );
}
