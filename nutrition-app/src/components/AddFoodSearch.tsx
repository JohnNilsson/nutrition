import { useState } from "react";
import { debounce } from "lodash-es";
import { Search, SearchProps } from "semantic-ui-react";

import index from "../services/FoodIndex";
import { AppState } from "../state";

// Some type gymnasitcs to get the search properties properly typed
interface Result {
  id: number;
  title: string;
  description?: string;
}

interface AddFoodSearchProps extends SearchProps {
  state: AppState;
}

function AddFoodSearch({ state, ...props }: AddFoodSearchProps) {
  const [queryState, setQueryState] = useState(() => ({
    query: "",
    result: [] as Result[] | undefined
  }));
  return (
    <Search
      {...props}
      loading={queryState.result === undefined}
      value={queryState.query}
      results={queryState.result ?? []}
      onSearchChange={debounce((_, d: SearchProps) => {
        const query = d.value ?? "";
        setQueryState({query, result: undefined});
        index
          .findAsync(query, 10)
          .then(results => results.map((r) => ({ id: r.id, title: r.name })))
          .catch(err => [{ id: 0, title: "Error", description: String(err) }])
          .then(result => setQueryState(prev => prev.query === query ? {query, result} : prev));
      }, 500, {leading:true})}
      onResultSelect={(_, d) => {
        const { id, title } = d.result as Result;
        state.addFood(String(id), title);
      }}
    />
  );
}

export default AddFoodSearch;
