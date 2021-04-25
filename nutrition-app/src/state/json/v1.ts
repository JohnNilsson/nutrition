export type AppStateJson = {
  view?: ViewStateJson
  foods?: FoodsStateJson
  family?: FamilyStateJson
};

export type ViewStateJson = {
  selectedFamilyMember?: number;
};

export type FoodsStateJson = {
  selectedFoods?: {
    [id: string] : {
      id?: number,
      name?: string,
      nutrients?: {},
      ammount?: number
    }
  }
};

export type FamilyStateJson = {
  members?: {
    [id: string] : {
      id?: number,
      name?: string,
      sex?: "Male" | "Female",
      age?: number,
      height?: number,
      weight?: number,
      physicalActivityLevel?: number
    }
  }
};
