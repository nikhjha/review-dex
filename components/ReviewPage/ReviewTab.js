import React, { useCallback, useState, useEffect, useContext } from "react";
import {
  Card,
  Tabs,
  IndexTable,
  useIndexResourceState,
  Heading,
  Icon,
  TextStyle,
} from "@shopify/polaris";
import { StarFilledMinor, StarOutlineMinor } from "@shopify/polaris-icons";
import { AxiosContext } from "../MyProvider";

export default function ReviewTab({ tabs , setPageLoading }) {
  const { axiosFetch } = useContext(AxiosContext);
  const [selected, setSelected] = useState(0);
  const [allReviews, setAllReviews] = useState([[], [], []]);
  const [loading, setLoading] = useState(false);
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
  }, []);

  useEffect(() => {
    async function getData() {
      const result = await axiosFetch(async (instance) => {
        const response = await instance.get("/store/review");
        return response;
      });
      const reviews = result.data.reviews;
      const newAllReviews = [
        reviews.map((review) => {
          const {_id} = review;
            return { ...review, id : _id };
        }),
        reviews
          .filter((review) => {
            return review.about !== "your shop";
          })
          .map((review) => {
            const {_id} = review;
            return { ...review, id : _id };
          }),
        reviews
          .filter((review) => {
            return review.about === "your shop";
          })
          .map((review) => {
            const {_id} = review;
            return { ...review, id : _id };
          }),
      ];
      setAllReviews(newAllReviews);
      setPageLoading(false);
    }
    getData();
  }, []);

  const resourceName = {
    singular: "review",
    plural: "reviews",
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(allReviews[selected]);

  const promotedBulkActions = [
    {
      content: "Publish",
      loading: loading,
      onAction: () => {
        setLoading(true);
        console.log(selectedResources);
        selectedResources.forEach(async (id) => {
          await axiosFetch(async (instance) => {
            const response = await instance.post("/store/publish/" + id);
            return response;
          });
        });
        handleSelectionChange("page",false,undefined);
        setLoading(false);
      },
    },
    {
      content: "Hide",
      loading: loading,
      onAction: () => {
        setLoading(true);
        console.log(selectedResources);
        selectedResources.forEach(async (id) => {
          await axiosFetch(async (instance) => {
            const response = await instance.post("/store/hide/" + id);
            return response;
          });
        });
        handleSelectionChange("page",false,undefined);
        setLoading(false);
      },
    },
  ];

  const rowMarkup = allReviews[selected].map(
    (
      { id, name, rating, created, about, title, body, source, hidden },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell >
          <div style={{ display: "flex" }}>
            {rating >= 1 ? (
              <Icon source={StarFilledMinor} color="warning" />
            ) : (
              <Icon source={StarOutlineMinor} color="warning" />
            )}
            {rating >= 2 ? (
              <Icon source={StarFilledMinor} color="warning" />
            ) : (
              <Icon source={StarOutlineMinor} color="warning" />
            )}
            {rating >= 3 ? (
              <Icon source={StarFilledMinor} color="warning" />
            ) : (
              <Icon source={StarOutlineMinor} color="warning" />
            )}
            {rating >= 4 ? (
              <Icon source={StarFilledMinor} color="warning" />
            ) : (
              <Icon source={StarOutlineMinor} color="warning" />
            )}
            {rating === 5 ? (
              <Icon source={StarFilledMinor} color="warning" />
            ) : (
              <Icon source={StarOutlineMinor} color="warning" />
            )}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>{created.substring(0, 10)}</IndexTable.Cell>
        <IndexTable.Cell>
          <div  style={{whiteSpace : "normal", width : '400px'}}>
          <p>{name} wrote a review about {about}</p>
          <Heading>{title}</Heading>
          <p>{body}</p>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>{source}</IndexTable.Cell>
        <IndexTable.Cell>
          <TextStyle variation={hidden ? "negative" : "positive"}>
            {hidden ? "HIDDEN" : "PUBLISHED"}
          </TextStyle>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  return (
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section>
          <IndexTable
            resourceName={resourceName}
            itemCount={allReviews[selected].length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            headings={[
              { title: "Rating" },
              { title: "Created" },
              { title: "Reviews" },
              { title: "Source" },
              { title: "Status" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card.Section>
      </Tabs>
    </Card>
  );
}