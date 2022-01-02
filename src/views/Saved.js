import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Icon, ListItem } from 'react-native-elements';
import { getSavedList } from '../Api';

function Cell({ profile, index }) {
  return (
    <ListItem
      style={{ padding: 0 }}
      containerStyle={{ backgroundColor: index % 2 === 0 ? null : 'white' }}
    >
      <Avatar.Image size={40} source={{ uri: profile.image }} />
      <ListItem.Content>
        <ListItem.Title
          style={{ padding: 0, alignItems: 'center', fontWeight: 'bold' }}
        >
          {profile.fullName}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ padding: 0, marginBottom: -5, fontSize: 13 }}
        >
          {profile.login}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
}
export default function Saved({}) {
  const [loading, setLoading] = useState(true);
  const [projectsExpanded, setPexpand] = React.useState(true);
  const [result, setResult] = React.useState([]);
  React.useEffect(async () => {
    setLoading(true);

    try {
      const list = await getSavedList();
      setResult(
        Object.keys(list).map((key) => ({
          image: list[key].image,
          login: key,
          fullName: list[key].fullName
        }))
      );
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ExpiredError')
        setResult([]);
      else alert(error);
    }

    setLoading(false);
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {loading ? (
            <Text style={{ margin: 30, fontSize: 30 }}>Loading...</Text>
          ) : result.length > 0 ? (
            <ListItem.Accordion
              content={
                <>
                  <Icon name="work" size={20} style={{ marginRight: 10 }} />
                  <ListItem.Content>
                    <ListItem.Title>List of saved profiles</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              onPress={() => setPexpand(!projectsExpanded)}
              isExpanded={projectsExpanded}
            >
              {projectsExpanded
                ? result.map((l, i) => <Cell profile={l} key={i} index={i} />)
                : null}
            </ListItem.Accordion>
          ) : (
            <Text style={{ margin: 30, fontSize: 30 }}>
              Your list is empty :)
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
