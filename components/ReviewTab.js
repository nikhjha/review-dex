import React, { useCallback, useState } from "react";
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

export default function ReviewTab({ tabs }) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const resourceName = {
    singular: "review",
    plural: "reviews",
  };
  const reviews = [
    {
      id: "3417",
      rating: 5,
      created: 14,
      name: "Nikhil",
      about: "your shop",
      title: "bdlnsdkdnks",
      body: "bcdcndnds",
      source: "ADMIN",
      hidden: false,
    },
    {
      id: "2567",
      rating: 3,
      created: 14,
      name: "Nikhil",
      about: "your shop",
      title: "bdlnsdkdnks",
      body: "bcdcndnds",
      source: "ADMIN",
      hidden: false,
    },
  ];

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(reviews);

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

  const rowMarkup = reviews.map(
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
            itemCount={reviews.length}
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

