import { action } from "mobx";
import { observer } from "mobx-react-lite";
import "rc-slider/assets/index.css";
import { useState } from "react";
import { Button, Confirm, Card } from "semantic-ui-react";
import type { FamilyMember } from "../../../state/FamilyMember";
import { useAppState } from "../../store";
import { FamilyMemberForm } from "./FamilyMemberForm";

export interface FamilyMemberCardProps {
  member: FamilyMember;
}
export const FamilyMemberCard = observer<FamilyMemberCardProps>(
  function FamilyMemberCard({ member }) {
    const { family } = useAppState();
    const [confirm, setConfirm] = useState(false);

    return (
      <Card fluid>
        <Card.Content>
          <FamilyMemberForm member={member} />
        </Card.Content>
        <Card.Content extra>
          <Button
            negative
            icon="trash alternate outline"
            onClick={() => setConfirm(true)}
          />
          <Confirm
            open={confirm}
            onCancel={() => setConfirm(false)}
            onConfirm={action(() => {
              family.delete(member.id);
              setConfirm(false);
            })}
          />
        </Card.Content>
      </Card>
    );
  }
);
export default FamilyMemberCard;
