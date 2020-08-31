import React from "react";
import {
  Pane,
  Heading,
  Button,
  Select,
  Text,
  SegmentedControl,
} from "evergreen-ui";
import ResultSentence from "./ResultSentence";
import { Link } from "react-router-dom";

const ResultsList = (props) => {
  const {
    searchResultsList,
    sentQuery,
    resultsPerPage,
    resultsPageNumber,
    setResultsPageNumber,
    segmentOptions,
    searchTotal,
    handleResultsPerPageChange,
  } = props;

  return (
    <>
      <Pane marginTop="2%">
        {sentQuery !== "" && (
          <Pane display="flex" justifyContent="space-between" marginBottom={20}>
            <Heading size={700}>
              Showing {searchTotal} results for '{sentQuery}'
            </Heading>
            {searchResultsList.value.length > 0 && (
              <Link
                to={`results.txt/${sentQuery}`}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Button
                  whiteSpace="nowrap"
                  appearance="minimal"
                  iconAfter="download"
                >
                  Download Results
                </Button>
              </Link>
            )}
          </Pane>
        )}
        {searchResultsList.value.length > 0 && (
          <Pane marginBottom={20}>
            <Text marginRight={5}>No. per page</Text>
            <Select
              width={60}
              value={resultsPerPage}
              onChange={(event) => handleResultsPerPageChange(event)}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </Select>
          </Pane>
        )}
        {searchResultsList.value?.map((result) => (
          <ResultSentence
            key={result._id}
            file_id={result._id}
            searchScore={result._score}
            searchResult={result.sentence}
            {...{ sentQuery }}
          />
        ))}
        {segmentOptions.options.length > 1 && (
          <Pane justifyContent="center" display="flex">
            <SegmentedControl
              name="button-size"
              width={280}
              options={segmentOptions.options}
              value={resultsPageNumber}
              onChange={(value) => setResultsPageNumber(value)}
            />
          </Pane>
        )}
      </Pane>
    </>
  );
};

export default ResultsList;
