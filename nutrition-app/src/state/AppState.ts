import { observable, entries, makeAutoObservable } from "mobx";

import { FamilyMember } from "./FamilyMember";
import { View } from "./View";
import { Food } from "./Foods";

import * as json from "./json"

export class AppState {

    public readonly foods = observable.map<string, Food>(undefined, { name: "foods" })
    public readonly family = observable.map<string, FamilyMember>(undefined, { name: "family" })
    public readonly view = new View()

    constructor() { makeAutoObservable(this); }
  
    toJSON(): json.AppStateJson {

      const family = {} as json.FamilyJson;
      for(const [k,v] of entries(this.family))
      {
        const json: Required<json.FamilyMemberJson> = {
          name: v.name!,
          age: v.age!,
          sex: v.sex!,
          height: v.height!,
          weight: v.weight!,
          physicalActivityLevel: v.physicalActivityLevel!
        };
        family[k] = json;
      }

      const foods = {} as json.FoodsJson;
      for(const [k,v] of entries(this.foods))
      {
        const json: Required<json.FoodJson> = {
          name: v.name!
        };

        foods[k] = json;
      }
 
      return {
        version: 2,
        family,
        foods
      }
    }
  
    loadJSON(json: json.AppStateJson) {
      for(const [k, v] of Object.entries(json.family ?? {})){
        const e = getOrAdd(this.family, k, k => new FamilyMember(k));
        Object.assign(e, v);
      }
      for(const [k, v] of Object.entries(json.foods ?? {})){
        const e = getOrAdd(this.foods, k, k => ({id: k}));
        Object.assign(e, v);
      }
    }

    addFamilyMember(): FamilyMember {
      let seq = 0;
      let id = String(seq);
      while(this.family.has(id))
      {
        id = String(++seq);
      }
      const m = new FamilyMember(id);
      this.family.set(id, m);
      return m;
    }

    addFood(id: string, name: string) {
      let food = this.foods.get(id);
      if(food === undefined){
        food = {id, name};
        this.foods.set(id, food);
      }
    }
  }

  function getOrAdd<K, V>(map: Map<K,V>, key: K, f: (key: K) => V ): V {
    let value = map.get(key);
    if(value === undefined){
      value = f(key);
      map.set(key, value);
      value = map.get(key)!;
    }
    return value;
  }