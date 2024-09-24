import React from 'react';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';

const TabContainer = ({ tabs }) => {

    // Perhaps move these into a stylesheet
    const activeLinkStyle = {
        padding: "0.5% 10%",
        backgroundColor:"#f4c109"
    }

    const linkStyle = {
        padding: "0.5% 10%",
        backgroundColor:"white",
        border: "1px solid"
    }

    return (
        <Tabs activeLinkStyle={activeLinkStyle}>
            {tabs.map(tab => (
            <TabLink key={tab.id} to={tab.id} style={linkStyle}>
                {tab.label}
            </TabLink>
            ))}

            {tabs.map(tab => (
            <TabContent key={tab.id} for={tab.id}>
                {tab.content}
            </TabContent>
            ))}
        </Tabs>
    );
}

export default TabContainer;