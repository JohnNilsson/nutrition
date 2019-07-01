import React, { useState } from "react";
import { debounce, escapeRegExp } from "lodash-es";
import { List, Search, StrictSearchProps } from "semantic-ui-react";
import { useStore } from "../store";

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

const searchDb = (names: string[], query: string) => {
  const results = [] as Result[];

  const match = new RegExp(escapeRegExp(query), "i");
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (match.test(name)) {
      results.push({ title: name });
      if (results.length === 10) {
        break;
      }
    }
  }
  return results;
};

const useSearchState = () => {
  const store = useStore();
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

    store.foods.dataPromise
      .then(db => {
        setLoading(false);
        const results = searchDb(db.Livsmedel.Namn, query);
        setResults(results);
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

const SelectedFood = () => (
  <>
    <AddFoodSearch />
    <List>
      <List.Item>
        <List.Header>Broccoli</List.Header>
        11 g
      </List.Item>
    </List>
  </>
);

export default SelectedFood;
