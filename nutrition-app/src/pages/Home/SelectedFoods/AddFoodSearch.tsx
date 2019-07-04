import React, { useState } from "react";
import { debounce } from "lodash-es";
import { Search, StrictSearchProps } from "semantic-ui-react";

import index from "../../../services/FoodIndex";

// Some type gymnasitcs to get the search properties properly typed
interface Result {
  title: string;
  description?: string;
}
type Require<T, TRequired extends keyof T> = T & Required<Pick<T, TRequired>>;
interface SearchState
  extends Require<StrictSearchProps, "loading" | "value" | "results"> {
  results: Result[];
}
interface SearchProps extends Require<SearchState, "onSearchChange"> {
  results: Result[];
}

const useSearchState = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([] as Result[]);

  const handleSearchChange: SearchProps["onSearchChange"] = (e, d) => {
    const query = d.value || "";
    setValue(query);
    if (!query) {
      return;
    }
    setLoading(true);

    index
      .findAsync(query, 10)
      .then(results => {
        setLoading(false);
        setResults(results.map(r => ({ title: r.name })));
      })
      .catch(err => {
        setLoading(false);
        setResults([
          {
            title: "Error",
            description: String(err)
          }
        ]);
      });
  };

  const onSearchChange = debounce(handleSearchChange);

  const props: SearchProps = { loading, value, results, onSearchChange };
  return props;
};

const AddFoodSearch = () => {
  const searchProps = useSearchState();

  return <Search {...searchProps} />;
};

export default AddFoodSearch;
