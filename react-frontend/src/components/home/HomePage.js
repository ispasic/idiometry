import React, { useEffect, useState } from "react";
import SearchSection from "./SearchSection";
import ResultsList from "./ResultsList";
import MySpinner from "./MySpinner";
import ExampleIdioms from "./ExampleIdioms";

const axios = require("axios");

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const HomePage = () => {
  const [queryState, setQueryState] = useState({ value: "" });
  const [searchResultsList, setSearchResultsList] = useState({ value: [] });
  const [searchTotal, setSearchTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newSearch, setNewSearch] = useState(true);
  const [sentQuery, setSentQuery] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(25);
  const [resultsPageNumber, setResultsPageNumber] = useState(1);
  const [segmentOptions, setSegmentOptions] = useState({
    options: [{ label: "1", value: 1 }],
  });

  useEffect(() => {
    if (newSearch === false) {
      const updatePage = async () => {
        await handlePageChange();
      };
      updatePage();
    }
  }, [resultsPageNumber]);

  const generatePageOptions = (searchTotal, size = resultsPerPage) => {
    let numberOfPages = Math.ceil(searchTotal / size);
    let options = [];
    let startPoint = resultsPageNumber - 5;
    startPoint = startPoint < 1 ? 1 : startPoint;
    let endpoint = resultsPageNumber + 4;
    if (numberOfPages <= 10) {
      endpoint = numberOfPages;
      startPoint = 1;
    } else {
      if (numberOfPages > 10 && resultsPageNumber < 7) {
        endpoint = 10;
      } else if (numberOfPages <= endpoint) {
        endpoint = numberOfPages;
      }
    }
    if (numberOfPages > 1) {
      for (let i = startPoint; i <= endpoint; i++) {
        options.push({
          label: `${i}`,
          value: i,
        });
      }
    } else {
      options = [{ label: "1", value: 1 }];
    }
    return options;
  };

  const getNewResults = async (queryInput, size = resultsPerPage) => {
    setIsLoading(true);
    
    // normalize string to be compatible with Unicode
    queryInput = queryInput.normalize('NFKC');

    axios
      .get("/api/search_sentences/", {
        params: {
          q: queryInput,
          s: size,
        },
        config,
      })
      .then((r) => {
        // strip html tags from string
        queryInput = queryInput.replaceAll(/<.*?>/gi, '');
        setSentQuery(queryInput);
        setIsLoading(false);
        setResultsPageNumber(1);
        setSearchResultsList({ value: r.data.results_list });
        setSearchTotal(r.data.search_total);
        setSegmentOptions({
          options: generatePageOptions(r.data.search_total, size),
        });
        setNewSearch(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        return error;
      });
  };

  const handlePageChange = async () => {
    setIsLoading(true);
    axios
      .get("/api/search_sentences/", {
        params: {
          q: sentQuery,
          s: resultsPerPage,
          f: (resultsPageNumber - 1) * resultsPerPage,
        },
        config,
      })
      .then((r) => {
        setIsLoading(false);
        setSearchResultsList({ value: r.data.results_list });
        setSegmentOptions({
          options: generatePageOptions(r.data.search_total),
        });
        setNewSearch(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        return error;
      });
  };

  const handleSearchBarInput = async (event) => {
    event.preventDefault();
    event.target.blur();
    await getNewResults(queryState.value);
  };
  const handleResultsPerPageChange = async (event) => {
    event.preventDefault();
    setResultsPerPage(event.target.value);
    await getNewResults(queryState.value, event.target.value);
  };

  return (
    <>
      <SearchSection {...{ handleSearchBarInput, queryState, setQueryState }} />
      <ExampleIdioms {...{ setQueryState }} />
      {isLoading ? (
        <MySpinner />
      ) : (
        <ResultsList
          {...{
            searchResultsList,
            sentQuery,
            resultsPerPage,
            resultsPageNumber,
            setResultsPageNumber,
            segmentOptions,
            searchTotal,
            handleResultsPerPageChange,
          }}
        />
      )}
    </>
  );
};

export default HomePage;
