import React from "react";
import { Button, Pane, SearchInput } from "evergreen-ui";

const SearchSection = (props) => {
  const { handleSearchBarInput, queryState, setQueryState } = props;

  return (
    <Pane
      marginTop="5%"
      display="inline-flex"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <form onSubmit={handleSearchBarInput} style={{ display: "contents" }}>
        <SearchInput
          id="idiom-search-bar"
          placeholder="Search BNC corpus..."
          required
          width="100%"
          height={50}
          value={queryState.value}
          onChange={(e) => setQueryState({ value: e.target.value })}
        />
        <Button marginLeft={5} height={50} appearance="primary" intent="none">
          Search
        </Button>
      </form>
    </Pane>
  );
};

export default SearchSection;
