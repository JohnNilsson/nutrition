import dbPromise from "./FoodData";
import { escapeRegExp } from "lodash-es";

interface Result {
  name: string;
}

interface Index {
  findAsync(query: string, maxResult?: number): Promise<Result[]>;
}

const searchDb = (names: string[], query: string, maxResults: number) => {
  const results = [] as Result[];

  const match = new RegExp(escapeRegExp(query), "i");
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (match.test(name)) {
      results.push({ name });
      if (results.length === maxResults) {
        break;
      }
    }
  }
  return results;
};

const index: Index = {
  async findAsync(query: string, maxResult?: number) {
    const db = await dbPromise;
    return searchDb(db.Livsmedel.Namn, query, maxResult || 10);
  }
};

export default index;
