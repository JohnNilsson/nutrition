export type AppStateJson = {
  version: 2
  foods?: FoodsJson
  family?: FamilyJson
};

export type FoodsJson = {
  [id: string]: FoodJson
}

export type FoodJson = {
  name?: string
}

export type FamilyJson = {
  [id: string]: FamilyMemberJson
}

export type FamilyMemberJson = {
  name?: string
  sex?: "Male" | "Female"
  age?: number
  height?: number
  weight?: number
  physicalActivityLevel?: number
}
