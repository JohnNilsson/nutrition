import { types, flow } from "mobx-state-tree";

// A bit simplistic perhaps. But works for now.
// TODO: Load data into localStorage or indexDb instead to cache locally
//       (note: json-string parsed from localStorage could actually be rather quick, make sure to benchmark)
// TODO: Serve database, or it's parts of IPFS perhaps?
// TODO: At least make sure that app and data works from cache in offline-mode

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
