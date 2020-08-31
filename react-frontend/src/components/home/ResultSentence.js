import React from "react";
import { Pane, Paragraph, Code } from "evergreen-ui";
import SourceDescriptionButton from "./SourceDescriptionButton";
import ExplanationButton from "./ExplanationButton";

const ResultSentence = (props) => {
  const { searchResult, file_id, searchScore, sentQuery } = props;

  let formattedResult = "";
  if (searchResult !== []) {
    const re = new RegExp("^(.*)(<idiom>{1}.*</idiom>{1})(.*)$");
    const regex = searchResult.match(re);
    if (regex) {
      formattedResult = {
        group1: regex[1],
        group2: regex[2].replace("<idiom>", "").replace("</idiom>", ""),
        group3: regex[3],
      };
    }
  }

  return (
    <>
      {formattedResult !== "" && (
        <Pane
          background="tint1"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding={24}
          marginBottom={16}
          paddingLeft="0.5%"
          paddingRight="2%"
        >
          <SourceDescriptionButton {...{ file_id }} />

          <Paragraph width="79%" size={400}>
            {formattedResult.group1 !== "" && <>{formattedResult.group1}</>}
            {formattedResult.group2 !== "" && (
              <Code size={300}>{formattedResult.group2}</Code>
            )}
            {formattedResult.group3 !== "" && <>{formattedResult.group3}</>}
          </Paragraph>

          <ExplanationButton {...{ file_id, searchScore, sentQuery }} />
        </Pane>
      )}
    </>
  );
};

export default ResultSentence;
