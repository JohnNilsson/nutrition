import { useState } from "react";
import { debounce } from "lodash-es";
import { Search, SearchProps } from "semantic-ui-react";

import index from "../services/FoodIndex";
import { IAppState } from "../state";

// Some type gymnasitcs to get the search properties properly typed
interface Result {
  id: number;
  title: string;
  description?: string;
}

interface AddFoodSearchProps extends SearchProps {
  state: IAppState;
}

function AddFoodSearch({ state: { foods }, ...props }: AddFoodSearchProps) {
  const [state, setState] = useState(() => ({
    query: "",
    result: [] as Result[] | undefined
  }));
  return (
    <Search
      {...props}
      loading={state.result === undefined}
      value={state.query}
      results={state.result ?? []}
      onSearchChange={debounce((_, d: SearchProps) => {
        const query = d.value ?? "";
        setState({query, result: undefined});
        index
          .findAsync(query, 10)
          .then(results => results.map((r) => ({ id: r.id, title: r.name })))
          .catch(err => [{ id: 0, title: "Error", description: String(err) }])
          .then(result => setState(prev => prev.query === query ? {query, result} : prev));
      }, 500, {leading:true})}
      onResultSelect={(_, d) => {
        const { id, title } = d.result as Result;
        foods.add(id, title);
      }}
    />
  );
}

export default AddFoodSearch;
