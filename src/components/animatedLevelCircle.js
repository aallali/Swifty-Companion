import React from 'react';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
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
const AnimatedLevelCircle = ({ level }) => {
  // const percent = (lvl) => (lvl / 100)
  const rayon = 71;
  const perimeter = 2 * Math.PI * rayon;
  const levelProgress = useSharedValue(0);

  const levelAnimation = useAnimatedProps(() => ({
    strokeDashoffset: perimeter + perimeter * ((level * 100) / 20 / 100)
  }));

  React.useEffect(() => {
    levelProgress.value = withTiming(level, {
      duration: 3000,
      easing: Easing.linear
    });
    // console.log(perimeter + perimeter * levelProgress.value)
  }, [level]);
  return (
    <Svg
      style={styles.level_circle}
      width="110"
      height="110"
      viewBox="0 0 154 154"
    >
      <Circle
        cx="76"
        cy="76"
        r={rayon}
        stroke={colors.darkText}
        strokeWidth="13"
      />
      <AnimatedCircle
        cx="76"
        cy="76"
        r={rayon}
        stroke={colors.white}
        strokeDasharray={perimeter}
        strokeLinecap="round"
        strokeWidth="8"
        fill="none"
        animatedProps={levelAnimation}
      />
    </Svg>
  );
};

export default AnimatedLevelCircle;

const styles = StyleSheet.create({
  level_circle: {
    position: 'absolute',
    zIndex: 2,
    left: windowWidth / 2,
    top: 0,
    transform: [
      { translateX: -(100 + 10) / 2 },
      { translateY: -(100 + 15) / 2 },
      { rotateZ: '90deg' }
    ]
  }
});
