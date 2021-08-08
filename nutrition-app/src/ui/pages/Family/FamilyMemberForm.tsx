import { round } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { default as SliderOriginal, SliderProps } from "rc-slider/es/Slider";
import { ComponentClass, CSSProperties, ReactNode } from "react";
import { Form, Input, Label, Select, SemanticWIDTHS } from "semantic-ui-react";
import { GetPhysicalActivityLevel } from "../../../services/nnr";
import { FamilyMember } from "../../../state/FamilyMember";

// Workaround broken types
const Slider = SliderOriginal as unknown as ComponentClass<Partial<SliderProps> & {
  marks?: Record<number, ReactNode | {
    style?: CSSProperties;
    label?: string;
  }>;
}>;

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
        onChange={action((e, { value }) => member.sex = value as "Male" | "Female")}
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
    <Form.Field style={{ paddingBottom: "12px" }}>
      <label>Fysisk Aktivitetsnivå</label>
      <Slider
        min={min}
        max={max}
        step={0.01}
        marks={marks}
        value={member.physicalActivityLevel}
        onChange={action(v => member.physicalActivityLevel = v)}
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
            set={action(v => member.name = v)}
          />
          <SexField width={2} member={member} />
          <IntField
            width={3}
            label="Ålder"
            unit="År"
            get={() => member.age}
            set={action(v => member.age = v)}
          />
          <IntField
            width={3}
            label="Längd"
            unit="cm"
            get={() => member.height}
            set={action(v => member.height = v)}
          />
          <IntField
            width={3}
            label="Vikt"
            unit="kg"
            get={() => member.weight}
            set={action(v => member.weight = v)}
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
            set={action(bmi => {
              const height = member.height;
              if (bmi === undefined || height === undefined) {
                member.weight = undefined;
              } else {
                const m = height / 100;
                member.weight = round(m * m * bmi, 1);
              }
            })}
          />
        </Form.Group>
        <PalField member={member} />
        <Form.Field>
          <label>Daglig energi förbrukning</label>
          <Label size="big">
            REE
            <Label.Detail>{member.dailyRestingEnergyExpenditureMJ} MJ/d</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>×</span>
          <Label size="big">
            PAL
            <Label.Detail>{member.physicalActivityLevel}</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>=</span>
          <Label size="big">
            EE
            <Label.Detail>{member.dailyEnergyExpenditureMJ} MJ/d</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>=</span>
          <Label size="big">
            EE
            <Label.Detail>{member.dailyEnergyExpenditureKCal} kcal/d</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>=</span>
          <Label size="big">
            EE
            <Label.Detail>{member.dailyEnergyExpenditureGramFat} g<sub>fat</sub>/d</Label.Detail>
          </Label>
        </Form.Field>
        <Form.Field>
          <Label size="big">
            Idealvikt
            <Label.Detail>{member.idealWeightKg} kg</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>+</span>
          <Label size="big">
            Övervikt
            <Label.Detail>{member.overWeightKg} kg</Label.Detail>
          </Label>
          <span style={{ fontSize: "2rem" }}>=</span>
          <Label size="big">
            Fasta
            <Label.Detail>{member.overWeightFastingDays} dagar</Label.Detail>
          </Label>
        </Form.Field>
      </Form>
    );
  }
);
