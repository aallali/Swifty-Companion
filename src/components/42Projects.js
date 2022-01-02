import React from "react";
import { Text, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";

function Cell({ projs }) {
  return (
    <>
      {projs.map((l, i) => (
        <ListItem
          key={i}
          style={{ padding: 0 }}
          containerStyle={{ backgroundColor: i % 2 === 0 ? null : "white" }}
        >
          {/* <Avatar title={l.name} source={l.avatar_url} style={{width:20, height:20}} /> */}
          <ListItem.Title
            style={{
              padding: 0,
              color: l.grade < 50 ? "red" : "green",
              fontWeight: "bold",
              fontSize: 20,
              width: 60,
              textAlign: "right",
            }}
          >
            {l.progres ? (
              <Icon
                style={{ margin: "auto" }}
                name="clock"
                type="evilicon"
                color="gray"

                // size="20"
              />
            ) : (
              <Text> {l.grade}</Text>
            )}
          </ListItem.Title>
          <ListItem.Content>
            <ListItem.Title
              style={{ padding: 0, alignItems: "center", fontWeight: "bold" }}
            >
              {l.name}
            </ListItem.Title>
            <ListItem.Subtitle
              style={{ padding: 0, marginBottom: -5, fontSize: 10 }}
            >
              {l.slug}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </>
  );
}
export default function Projects42({ cursus, projects }) {
  // log("====>" + cursus)
  const [projectsExpanded, setPexpand] = React.useState(false);
  const [projs, setProjects] = React.useState();
  React.useEffect(async () => {
    try {
      setProjects(
        projects
          .map((l) => ({
            name: l.project.name,
            progres: !l.marked,
            grade: l.final_mark,
            slug: l.project.slug,
            updated: l.updated_at,
          }))
          .sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
      );
    } catch (error) {
      console.log(error);
      alert(error.name || error);
    }
  }, []);

  return (
    <View>
      <ListItem.Accordion
        content={
          <>
            <Icon name="work" size={20} style={{ marginRight: 10 }} />
            <ListItem.Content>
              <ListItem.Title>{cursus.title} - Projects</ListItem.Title>
            </ListItem.Content>
          </>
        }
        onPress={() => setPexpand(!projectsExpanded)}
        isExpanded={projectsExpanded}
      >
        {projectsExpanded ? <Cell projs={projs} /> : null}
      </ListItem.Accordion>
    </View>
  );
}
