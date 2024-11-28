import React, { useState } from "react";
import { Tabs, TabLink, TabContent } from "react-tabs-redux";

const TabContainer = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Styles
  const activeLinkStyle = {
    padding: "0.5% 10%",
    backgroundColor: "#f4c109",
  };

  const linkStyle = {
    padding: "0.5% 10%",
    backgroundColor: "white",
    border: "1px solid",
  };

  return (
    <Tabs activeLinkStyle={activeLinkStyle}>
      {/* Tab Links */}
      {tabs.map((tab) => (
        <TabLink
          key={tab.id}
          to={tab.id}
          style={linkStyle}
          onClick={() => setActiveTab(tab.id)} // Update active tab state
        >
          {tab.label}
        </TabLink>
      ))}

      {/* Tab Contents */}
      {tabs.map((tab) => (
        <TabContent key={tab.id} for={tab.id}>
          {/* Render content based on active tab */}
          {typeof tab.content === "function"
            ? tab.content(activeTab)
            : tab.content}
        </TabContent>
      ))}
    </Tabs>
  );
};

export default TabContainer;
