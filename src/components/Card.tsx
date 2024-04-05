import { StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  Easing,
  clamp,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
const Card = ({ index, card, scrollY, activeCardIndex }) => {
  const [cardHeight, setCardHeight] = useState(0);
  const translateY = useSharedValue(0);
  const { height: screenHeight } = useWindowDimensions();
  useAnimatedReaction(
    () => {
      return scrollY.value;
    },
    (current) => {
      translateY.value = clamp(-current, -index * cardHeight, 0);
    }
  );

  useAnimatedReaction(
    () => activeCardIndex.value,
    (current, previous) => {
      if (current === previous) {
        return;
      }
      // No card selected, move to list view
      if (activeCardIndex.value === null) {
        translateY.value = withTiming(
          clamp(-scrollY.value, -index * cardHeight, 0)
        );
      } else if (activeCardIndex.value === index) {
        translateY.value = withTiming(-index * cardHeight, {
          duration: 1000,
          easing: Easing.bounce,
        });
      } else {
        translateY.value = withTiming(
          -index * cardHeight * 0.9 + screenHeight * 0.6,
          {
            duration: 500,
            easing: Easing.out(Easing.quad),
          }
        );
      }
      // This card becomes active
    }
  );

  const tap = Gesture.Tap().onEnd(() => {
    if (activeCardIndex.value === null) {
      activeCardIndex.value = index;
    } else {
      activeCardIndex.value = null;
    }
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={tap}>
        <Animated.Image
          onLayout={(event) =>
            setCardHeight(event.nativeEvent.layout.height + 10)
          }
          source={card}
          style={[
            styles.animatedImage,
            { transform: [{ translateY: translateY }] },
          ]}
        />
      </GestureDetector>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  animatedImage: {
    width: "100%",
    aspectRatio: 7 / 4,
    height: undefined,
    marginVertical: 5,
    top: 30,
  },
});
