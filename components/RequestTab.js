import React, { useCallback, useState } from "react";
import {
  Card,
  Tabs,
  IndexTable,
  useIndexResourceState,
} from "@shopify/polaris";

export default function RequestTab({tabs}) {
    const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const resourceName = {
    singular: "order",
    plural: "orders",
  };
  const orders = [
    {
      id: "3417",
      name : "crimson sea",
      fullfilled: "13 Aug '21",
      buyer : 'Anonymus',
      status : 'alncn@ancan.com'
    }
  ];

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const promotedBulkActions = [
    {
      content: "Send Request",
      onAction: () => console.log("Todo: implement bulk edit"),
    }
  ];

  const rowMarkup = orders.map(
    (
      { id, name, fullfilled,buyer, status },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          {id}
        </IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>
          {fullfilled}
        </IndexTable.Cell>
        <IndexTable.Cell>{buyer}</IndexTable.Cell>
        <IndexTable.Cell>
          {status}
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
            itemCount={orders.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            headings={[
              { title: "Order" },
              { title: "Line Item" },
              { title: "FullField" },
              { title: "Buyer" },
              { title: "Status" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card.Section>
      </Tabs>
    </Card>
    )
}
