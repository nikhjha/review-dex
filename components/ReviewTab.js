import React, {useCallback, useState} from 'react';
import { Card, Tabs } from '@shopify/polaris';


export default function ReviewTab({tabs}) {
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
    );
    return (
        <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].content}>
            <p>Tab {selected} selected</p>
          </Card.Section>
        </Tabs>
      </Card>
    )
}
