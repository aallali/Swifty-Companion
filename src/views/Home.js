import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import { requestProfile } from '../Api';
export default function Home({ navigation }) {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSearchButton() {
    if (login && /[a-zA-Z-]+/.test(login)) {
      setLoading(true);
      try {
        const data = await requestProfile(login);
        navigation.navigate('Profile', {
          login,
          data
        });
      } catch (error) {
        alert(error);
      }
      setLoading(false);
    }

    return;
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../assets/1337-black.png')}
          />
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="login..."
              placeholderTextColor="gray"
              value={login}
              // placeholder="login name here..."
              onChangeText={(e) => setLogin(e.trim())}
            />
          </View>
          <View style={styles.savedProfilesView}>
            <TouchableOpacity>
              <Text
                style={styles.savedProfilesButton}
                onPress={() => navigation.navigate('Saved')}
              >
                check saved profiles ?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={!loading ? handleSearchButton : null}
          >
            <Text style={styles.loginText}>
              {loading ? 'loading...' : 'SEARCH'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: { height: 100, width: '100%' },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100
  },
  inputView: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center'
  },
  savedProfilesView: {
    // backgroundColor:"red",
    // height: 45,
    width: '70%'
  },
  savedProfilesButton: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 20
  },
  loginBtn: {
    width: '70%',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: 'black'
  },
  loginText: {
    color: 'white'
  }
});
