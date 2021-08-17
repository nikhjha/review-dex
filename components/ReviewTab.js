import React, { useCallback, useState, useEffect, useContext } from "react";
import {
  Card,
  Tabs,
  IndexTable,
  useIndexResourceState,
  Heading,
  Button,
  ButtonGroup,
  Icon,
} from "@shopify/polaris";
import { StarFilledMinor, StarOutlineMinor } from "@shopify/polaris-icons";
import { AxiosContext } from "./MyProvider";

export default function ReviewTab({ tabs }) {
  const {axiosFetch} = useContext(AxiosContext);
  const [selected, setSelected] = useState(0);
  const [allReviews, setAllReviews] = useState([[],[],[]]);
  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelected(selectedTabIndex);
    },
    []
  );

  useEffect(() => {
    async function getData(){
      const result = await axiosFetch(async (instance) => {
        const response = await instance.get("/api/reviews");
        return response;
    });
    const reviews = result.data.reviews;
    console.log(result);
    const newAllReviews = [reviews, reviews.filter((review)=>{return review.about !== "your shop"}), reviews.filter((review)=>{return review.about === "your shop"})];
    setAllReviews(newAllReviews);
    };
    getData();
  },[])

  const resourceName = {
    singular: "review",
    plural: "reviews",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(allReviews[selected]);

  const promotedBulkActions = [
    {
      content: "Publish",
      onAction: () => console.log("Todo: implement bulk edit"),
    },
    {
      content: "Hide",
      onAction: () => console.log("Todo: implement bulk edit"),
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
        <IndexTable.Cell>
          <div style={{display : 'flex'}}>
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
          )}{rating === 5 ? (
            <Icon source={StarFilledMinor} color="warning" />
          ) : (
            <Icon source={StarOutlineMinor} color="warning" />
          )}
          </div>
          
        </IndexTable.Cell>
        <IndexTable.Cell>{created} days ago</IndexTable.Cell>
        <IndexTable.Cell>
          {name} wrote a review about {about}
          <Heading>{title}</Heading>
          {body}
        </IndexTable.Cell>
        <IndexTable.Cell>{source}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button disabled={!hidden} primary={hidden}>
              Hidden
            </Button>
            <Button onClick={() => {}} disabled={hidden} primary={!hidden}>
              Published
            </Button>
          </ButtonGroup>
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

