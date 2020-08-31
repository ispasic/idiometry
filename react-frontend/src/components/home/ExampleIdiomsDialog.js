import React, { useState } from "react";
import { Pane, Tab, Tablist, Link, Text } from "evergreen-ui";

const exampleIdioms = require("./example-idioms");

const ExampleIdiomsDialog = (props) => {
  const { setQueryState, setIsShown } = props;
  const [tabs] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "XYZ",
  ]);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleIdiomSelected = (e) => {
    setQueryState({ value: e.target.text });
    setIsShown(false);
    document.getElementById("idiom-search-bar").focus();
  };
  return (
    <Pane height={300}>
      <Tablist flexBasis={240} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab}
            id={tab}
            onSelect={() => setSelectedTab(index)}
            isSelected={index === selectedTab}
            aria-controls={`panel-${tab}`}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      <Text size={300} padding={10}>
        copyright © www.learn-english-today.com
      </Text>
      <Pane padding={16} background="tint1" flex="1">
        {tabs.map((tab, index) => (
          <Pane
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={tab}
            aria-hidden={index !== selectedTab}
            display={index === selectedTab ? "block" : "none"}
          >
            {exampleIdioms[tab].map((idiom, index) => (
              <Pane key={`idiom-pane-${index}`}>
                <Link
                  key={`idiom-${index}`}
                  cursor="pointer"
                  onClick={(e) => handleIdiomSelected(e)}
                >
                  {idiom}
                </Link>
              </Pane>
            ))}
          </Pane>
        ))}
      </Pane>
    </Pane>
  );
};

export default ExampleIdiomsDialog;
