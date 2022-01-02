import React from "react";
import { Text, View } from "react-native";
import { ProgressBar, Colors } from "react-native-paper";

export default function Skills({ data }) {
  return (
    <View style={{ padding: 20 }}>
      {data.map((l, i) => (
        <View key={i}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>•{l.name}</Text>
            <Text style={{ textAlign: "right" }}>({l.level.toFixed(2)})</Text>
          </View>
          <ProgressBar
            progress={l.level / 20}
            color={
              Colors[
                Object.keys(Colors)[
                  Math.floor(Math.random() * Object.keys(Colors).length)
                ].replace("white", "black")
              ]
            }
          />
        </View>
      ))}
    </View>
  );
}
