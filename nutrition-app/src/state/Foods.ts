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
  Pending,
  Success,
  Failure
}

export const Foods = types
  .model("Foods", {
    state: State.Pending,
    data: types.frozen<Db | null>(null)
  })
  .volatile(self => ({
    dataPromise: fetchData()
  }))
  .actions(self => ({
    afterCreate: flow(function* afterCreate() {
      try {
        self.data = yield self.dataPromise;
        self.state = State.Success;
      } catch (error) {
        self.state = State.Failure;
        console.error(error);
      }
    })
  }));
