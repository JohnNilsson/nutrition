import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  SemanticWIDTHS,
  Label,
  Select,
  Button,
  Confirm
} from "semantic-ui-react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import { observer } from "mobx-react-lite";
import { AppState } from "../state";
import { FamilyMember } from "../state/Family";
import { GetPhysicalActivityLevel } from "nordic-nutrition-recommendations";
import { round } from "lodash-es";

interface FieldCreatorProps<T> {
  parse(value: string | undefined): T | undefined;
  format(value: T | undefined): string | undefined;
}
interface FieldProps<T> {
  label: string;
  width?: SemanticWIDTHS;
  unit?: string;
  get: () => T | undefined;
  set: (s: T | undefined) => void;
}

function Field<T>({ format, parse }: FieldCreatorProps<T>) {
  return observer(function Field({
    label,
    width,
    unit,
    get,
    set
  }: FieldProps<T>) {
    return (
      <Form.Field width={width}>
        <label>{label}</label>
        <Input
          autoComplete="off"
          placeholder={label}
          label={unit ? { basic: true, content: unit } : undefined}
          labelPosition={unit ? "right" : undefined}
          value={format(get())}
          onChange={e => {
            const newValue = parse(e.target.value);
            if (newValue !== undefined) {
              set(newValue);
            }
          }}
        />
      </Form.Field>
    );
  });
}

const TextField = Field<string>({
  format: v => v,
  parse: v => v
});

const IntField = Field<number>({
  format: v => (v === undefined ? undefined : String(v)),
  parse: v => {
    if (v === undefined) {
      return undefined;
    }
    const n = parseInt(v, 10);
    if (Number.isSafeInteger(n)) {
      return n;
    } else {
      return undefined;
    }
  }
});

interface SexFieldProps {
  width?: SemanticWIDTHS;
  member: FamilyMember;
}
const SexField = observer<SexFieldProps>(function SexField({ width, member }) {
  return (
    <Form.Field width={width}>
      <label>Kön</label>
      <Select
        fluid
        options={[
          { key: "M", value: "Male", text: "M" },
          { key: "F", value: "Female", text: "F" }
        ]}
        value={member.sex}
        onChange={(e, { value }) => member.setSex(value as any)}
      />
    </Form.Field>
  );
});

interface PalFieldProps {
  member: FamilyMember;
}
const PalField = observer<PalFieldProps>(function PalField({ member }) {
  const age = member.age || 36; //Just pick something at random
  const low = round(GetPhysicalActivityLevel(age, "Low"), 2);
  const avg = round(GetPhysicalActivityLevel(age, "Average"), 2);
  const high = round(GetPhysicalActivityLevel(age, "High"), 2);
  const min = round(avg - 2 * (avg - low), 2);
  const max = round(avg + 2 * (high - avg), 2);
  const marks = {
    [low]: "Låg",
    [avg]: "Medel",
    [high]: "Hög"
  };

  return (
    <Form.Field style={{ "padding-bottom": "12px" }}>
      <label>Fysisk Aktivitetsnivå</label>
      <Slider
        min={min}
        max={max}
        step={0.01}
        marks={marks}
        value={member.physicalActivityLevel}
        onChange={member.setPhysicalActivityLevel}
      />
    </Form.Field>
  );
});

export interface FamilyMemberFormProps {
  member: FamilyMember;
}
export const FamilyMemberForm = observer<FamilyMemberFormProps>(
  function FamilyMemberForm({ member }) {
    return (
      <Form>
        <Form.Group>
          <TextField
            width={3}
            label="Namn"
            get={() => member.name}
            set={member.setName}
          />
          <SexField width={2} member={member} />
          <IntField
            width={3}
            label="Ålder"
            unit="År"
            get={() => member.age}
            set={member.setAge}
          />
          <IntField
            width={3}
            label="Längd"
            unit="cm"
            get={() => member.height}
            set={member.setHeight}
          />
          <IntField
            width={3}
            label="Vikt"
            unit="kg"
            get={() => member.weight}
            set={member.setWeight}
          />
          <IntField
            width={3}
            label="BMI"
            unit="kg/m²"
            get={() => {
              const { weight, height } = member;
              if (weight === undefined || height === undefined) {
                return undefined;
              }
              const m = height / 100;
              return round(weight / (m * m), 1);
            }}
            set={bmi => {
              const height = member.height;
              if (bmi === undefined || height === undefined) {
                member.setWeight(undefined);
              } else {
                const m = height / 100;
                member.setWeight(round(m * m * bmi, 1));
              }
            }}
          />
        </Form.Group>
        <PalField member={member} />
        <Form.Field>
          <label>Daglig energi förbrukning</label>
          <Label size="big">
            REE
            <Label.Detail>{member.restingEnergyExpenditure}</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>×</span>
          <Label size="big">
            PAL
            <Label.Detail>{member.physicalActivityLevel}</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>=</span>
          <Label size="big">
            EE
            <Label.Detail>{member.dailyEnergyExpendityre} MJ/d</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>=</span>
          <Label size="big">
            EE
            <Label.Detail>
              {member.dailyEnergyExpendityre * 240} kcal/d
            </Label.Detail>
          </Label>
        </Form.Field>
      </Form>
    );
  }
);

export interface FamilyMemberPopupProps {
  state: AppState;
}
export const FamilyMemberPopup = observer<FamilyMemberPopupProps>(
  function FamilyMemberPopup({ state: { family, view } }) {
    const m = view.editFamilyMember;
    const [confirm, setConfirm] = useState(false);

    return (
      <Modal
        open={m !== undefined}
        onClose={() => view.edit(undefined)}
        closeIcon
      >
        {m === undefined ? null : (
          <>
            <Modal.Content>
              {m === undefined ? null : <FamilyMemberForm member={m} />}
            </Modal.Content>
            <Modal.Actions>
              <Button
                negative
                icon="trash alternate outline"
                onClick={() => setConfirm(true)}
              />
            </Modal.Actions>
            <Confirm
              open={confirm}
              onCancel={() => setConfirm(false)}
              onConfirm={() => family.remove(m.id)}
            />
          </>
        )}
      </Modal>
    );
  }
);
export default FamilyMemberPopup;
