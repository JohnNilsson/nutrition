import { types, flow } from "mobx-state-tree";

const fetchData = async () => {
  const module = await import(
    "swedish-food-composition-database/data/Naringsvarde.6NF.json"
  );
  return module.default;
};

type Unpack<T> = T extends Promise<infer U> ? U : T;
type Db = Unpack<ReturnType<typeof fetchData>>;

export enum State {
  Waiting,
  Pending,
  Success,
  Failure
}

export const Foods = types
  .model("Foods", {
    state: State.Waiting,
    data: types.frozen<Db>()
  })
  .actions(self => ({
    fetchFoods: flow(function* fetchFoods() {
      try {
        self.state = State.Pending;
        self.data = yield fetchData();
        self.state = State.Success;
      } catch (error) {
        self.state = State.Failure;
        console.error(error);
      }
    })
  }));
