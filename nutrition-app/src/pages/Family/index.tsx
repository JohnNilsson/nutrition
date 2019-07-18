import React from "react";
import { AppState } from "../../state";
import { Button, Header, Icon, Segment, Grid } from "semantic-ui-react";

export interface FamilyPageProps {
  state: AppState;
}
export default function FamilyPage(props: FamilyPageProps) {
  return (
    <Grid>
      <Grid.Column width={4}>
        <Segment placeholder>
          <Header icon>
            <Icon name="address card outline" />
            Inga familjemedelemmar tillaggda
          </Header>
          <Button primary>Lägg till familjemedlem</Button>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
