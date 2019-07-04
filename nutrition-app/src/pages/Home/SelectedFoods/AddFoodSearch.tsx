import React, { useState, FunctionComponent } from "react";
import { debounce } from "lodash-es";
import { Search, SearchProps } from "semantic-ui-react";

import index from "../../../services/FoodIndex";
import { AppState } from "../../../state";

// Some type gymnasitcs to get the search properties properly typed
interface Result {
  id: number;
  title: string;
  description?: string;
}

interface AddFoodSearchProps extends SearchProps {
  state: AppState;
}

const AddFoodSearch: FunctionComponent<AddFoodSearchProps> = ({
  state,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([] as Result[]);

  const searchProps: SearchProps = {
    loading,
    value,
    results,
    onSearchChange: debounce((e, d) => {
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
          setResults(results.map(r => ({ id: r.id, title: r.name })));
        })
        .catch(err => {
          setLoading(false);
          setResults([
            {
              id: 0,
              title: "Error",
              description: String(err)
            }
          ]);
        });
    }),
    onResultSelect: (e, d) => {
      const { id, title } = d.result as Result;
      state.addFood(id, title);
    }
  };
  return <Search {...props} {...searchProps} />;
};

export default AddFoodSearch;
