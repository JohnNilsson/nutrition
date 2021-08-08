import { observer } from "mobx-react-lite";
import { Button, Card } from "semantic-ui-react";
import { useAppState } from "../../store";
import FamilyMemberCard from "./FamilyMemberCard";

export default observer(function FamilyPage() {

  const state = useAppState();

  const cards = [];
  for(const member of state.family.values()){
    cards.push(<FamilyMemberCard member={member} />)
  }

  return <Card.Group>
    {cards}
    <Button size='massive' icon='plus' onClick={() => state.addFamilyMember()} />
  </Card.Group>;
});
