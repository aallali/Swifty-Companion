import * as React from 'react';
import { Text } from 'react-native';
import { List } from 'react-native-paper';
import { Icon, ListItem } from 'react-native-elements';

import Feather from 'react-native-vector-icons/Feather';
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

const AboutList = ({ data }) => {
  const [projectsExpanded, setPexpand] = React.useState(true);
  const [result, setResult] = React.useState();
  React.useEffect(async () => {
    setResult([
      {
        key: 'Email :',
        icon: 'at-sign',
        value: data?.email
      },
      {
        key: 'Campus :',
        icon: 'map-pin',
        value: data?.campus
      },
      {
        key: 'Evaluation points :',
        icon: 'rotate-ccw',
        value: data?.evaluation_points
      },
      {
        key: 'Coalition (#1) :',
        icon: 'bookmark',
        value: data?.coalition?.title
      },
      {
        key: 'Phone Number :',
        icon: 'phone-call',
        value: data?.phone
      },
      {
        key: 'Grade :',
        icon: 'chevrons-down',
        value: data?.grade
      },
      {
        key: 'Cursus :',
        icon: 'git-branch',
        value: data?.cursus[0]?.title
      },
      {
        key: 'Wallet :',
        icon: 'dollar-sign',
        value: data?.wallet
      },
      {
        key: 'Pool :',
        icon: 'calendar',
        value: data?.pool
      }
    ]);
  }, []);

  return (
    <>
      {result ? (
        <>
          <ListItem.Accordion
            content={
              <>
                <Icon name="info" size={20} style={{ marginRight: 10 }} />
                <ListItem.Content>
                  <ListItem.Title>expand</ListItem.Title>
                </ListItem.Content>
              </>
            }
            onPress={() => setPexpand(!projectsExpanded)}
            isExpanded={projectsExpanded}
          >
            {projectsExpanded ? (
              result.map((item, i) => {
                if (item.value)
                  return (
                    <List.Item
                      key={i}
                      title={
                        <>
                          <Feather
                            name={item.icon}
                            color={colors.black}
                            size={18}
                          />
                          <Text style={{ marginLeft: 10 }}>
                            {' ' + item.key}
                          </Text>
                        </>
                      }
                      description={
                        <Text
                          style={{
                            fontSize: 15,
                            color: 'black',
                            margin: 'auto',
                            marginLeft: 10,
                            fontWeight: 'bold'
                          }}
                        >
                          ••• {item.value}
                        </Text>
                      }
                      style={{
                        borderBottomWidth: 0.1,
                        marginBottom: -15,
                        borderColor: '#292D39'
                      }}
                      titleStyle={{ color: 'black' }}
                      descriptionStyle={{ fontSize: 10, color: 'gray' }}
                    />
                  );
              })
            ) : (
              <></>
            )}
          </ListItem.Accordion>
        </>
      ) : null}
    </>
  );
};

export default AboutList;
