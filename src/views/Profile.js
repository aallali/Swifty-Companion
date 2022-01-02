import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import AboutList from '../components/About';
import Project42 from '../components/42Projects';

import Skills from '../components/Skills';

import AnimatedLevelCircle from '../components/animatedLevelCircle';
import { Dimensions } from 'react-native';
import { getSavedList, updateSavedList } from '../Api';

Feather.loadFont();
const colors = {
  background: '#2F2F2F',
  darkText: '#222222',
  veryDarkText: '#1d1d1d',
  lightText: '#C4C4C4',
  disabledLight: '#494949',
  white: '#fff',
  black: '#000',
  success: '#16A085',
  failure: '#E74C3C',
  warning: '#e67e22'
};
const windowWidth = Dimensions.get('window').width;

export default function Profile({ navigation, route }) {
  const [selected, setSelected] = React.useState('about');
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  let coalitionPNG;
  const data = route.params.data;

  if (data.coalition?.title.toLowerCase() === 'bios')
    coalitionPNG = require(`../assets/bios.png`);
  else if (data.coalition?.title?.toLowerCase() === 'freax')
    coalitionPNG = require(`../assets/philantropists.png`);
  else if (data.coalition?.title?.toLowerCase() === 'commodore')
    coalitionPNG = require(`../assets/commodore.png`);
  else if (data.coalition?.title?.toLowerCase() === 'pandora')
    coalitionPNG = require(`../assets/pandora.png`);

  async function saveToList() {
    setLoading(true);
    let list = {};
    try {
      list = await getSavedList();
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'ExpiredError')
        setLoading(true);
      else alert(error);
    }
    try {
      list[data.login] = {
        fullName: `${data.first_name} ${data.last_name}`,
        image: data.image
      };
      await updateSavedList(list);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  }

  async function removeFromSavedList() {
    setLoading(true);
    try {
      const list = await getSavedList();
      delete list[data.login];
      await updateSavedList(list);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  }
  useEffect(async () => {
    try {
      const list = await getSavedList();
      if (data?.login) if (list[data.login]) setSaved(true);
    } catch (error) {}
  }, []);

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View style={{ flexGrow: 1 }}>
        <View style={{ width: '100%', height: 150, backgroundColor: '#000' }}>
          <ImageBackground
            source={{ uri: data?.coalition?.cover }}
            resizeMode="cover"
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          ></ImageBackground>
          <TouchableOpacity>
            {coalitionPNG ? (
              <Image
                style={{
                  width: 50,
                  height: 90,
                  padding: 30,
                  backgroundColor: data.coalition.color,
                  margin: 0,
                  borderBottomRightRadius: 30,
                  borderBottomLeftRadius: 30
                }}
                source={coalitionPNG}
              ></Image>
            ) : null}
            <View></View>
            <View></View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <AnimatedLevelCircle level={data.level} />
          <View style={styles.level_number}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>
                {data.level.toString().split('.')[0]}
              </Text>
              <Text style={{ fontSize: 10, color: 'white' }}>
                .{data.level.toString().split('.')[1]}
              </Text>
            </View>
          </View>
          <Image
            source={
              data.login === 'aallali'
                ? require('../assets/aallaliPDP.jpeg')
                : { uri: data.image }
            }
            style={{
              width: 95,
              height: 95,
              borderRadius: 50,
              marginTop: -50,
              backgroundColor: 'gray'
            }}
          />
        </View>
        <View
          style={{ alignItems: 'center', marginTop: 15, marginBottom: -30 }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
              {data.first_name} {data.last_name}{' '}
            </Text>
            <TouchableOpacity style={{ marginTop: 5 }}>
              <Feather
                onPress={() =>
                  setSaved((prev) => {
                    if (!prev) saveToList();
                    else removeFromSavedList();
                    alert(
                      !prev
                        ? `${data.login} profile has been saved in your bookmarks.`
                        : `${data.login} profile has been removed from your bookmark.`
                    );
                    return !prev;
                  })
                }
                name={!saved ? 'bookmark' : 'check'}
                color="black"
                fill="#fff"
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{data.login}</Text>
          <Text
            style={{
              fontSize: data.location ? 20 : 60,
              fontWeight: 'bold',
              marginTop: data.location ? 0 : -40,
              marginBottom: data.location ? 0 : -10
            }}
          >
            {data.location || '......'}
          </Text>
        </View>
        <View>
          <View>
            <View style={styles.buttons_group}>
              <TouchableOpacity
                style={[
                  styles.buttons_group__item,
                  {
                    borderColor:
                      selected === 'about' ? colors.black : '#00000000'
                  }
                ]}
                onPress={() => setSelected('about')}
              >
                <Feather name="user" color={colors.black} size={30} />
                <Text>About</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttons_group__item,
                  {
                    borderColor:
                      selected === 'projects' ? colors.black : '#00000000'
                  }
                ]}
                onPress={() => setSelected('projects')}
              >
                <Feather name="pie-chart" color={colors.black} size={30} />
                <Text>Projects</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttons_group__item,
                  {
                    borderColor:
                      selected === 'skills' ? colors.black : '#00000000'
                  }
                ]}
                onPress={() => setSelected('skills')}
              >
                <Feather name="award" color={colors.black} size={30} />
                <Text>Skills</Text>
              </TouchableOpacity>
            </View>
          </View>
          {selected === 'projects' ? (
            <>
              {data.cursus.map((l, i) => {
                const projs = data.projects.filter(
                  (el) => el.cursus_ids[0] === l.id
                );
                if (projs.length > 0)
                  return <Project42 key={i} cursus={l} projects={projs} />;
                else return null;
              })}
            </>
          ) : null}
          {selected === 'about' ? <AboutList data={data} /> : null}
          {selected === 'skills' ? (
            data.skills && data.skills.length > 0 ? (
              <Skills data={data.skills} />
            ) : (
              <Text> No Skills for this profile</Text>
            )
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  level_container: {
    position: 'relative',
    width: 130,
    height: 130,
    alignItems: 'center'
  },
  level_number: {
    position: 'absolute',
    left: windowWidth / 2,
    bottom: -20,
    zIndex: 2,
    backgroundColor: '#000',

    height: 30,
    width: 35,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  level_number_high: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  buttons_group: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttons_group__item: {
    flexDirection: 'row',
    width: '33%',
    borderBottomWidth: 3,
    borderColor: colors.white,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
