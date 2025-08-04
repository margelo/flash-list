import React from "react";
import { Button, Text, View, ScrollView } from "react-native";
import { create } from "zustand";

import { FlashList } from "../../../src";

// This is just some external state so we are able to update the height of the ancestor items
const useStore = create((set) => ({
  map: {},
  updateAncestor: (index) =>
    set((state) => {
      const prevIndex = index - 1;
      const prevHeight = state.map[prevIndex] ?? 300;

      const newHeight = prevHeight + 100;
      console.log("set", prevIndex, "to", newHeight);
      const res = {
        map: {
          ...state.map,
          [prevIndex]: newHeight,
        },
      };

      console.log(res);
      return res;
    }),
}));

function Item({ index }) {
  const height = useStore((state) => state.map[index] ?? 300);
  const updateAncestorHeight = useStore((state) => state.updateAncestor);

  const randomBgColor = [
    "red",
    "green",
    "yellow",
    "purple",
    "blue",
    "orange",
    "lightgrey",
  ][index % 7];
  return (
    <View
      style={{
        height,
        width: "100%",
        backgroundColor: randomBgColor,
      }}
    >
      <Text>item #{index}</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Change" onPress={() => updateAncestorHeight(index)} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <>
      <Text style={{ padding: 20 }}>
        <Text style={{ fontWeight: "bold" }}>Explanation:</Text> Align item #3
        to the top edge of the list and click &quot;Change&quot;. This will
        expand the item above item #3. We expect that we maintain the position
        of item #3 but it doesn&apos;t.
      </Text>

      <FlashList
        data={new Array(15).fill(1)}
        initialScrollIndex={3}
        maintainVisibleContentPosition={{
          disabled: false,
        }}
        renderItem={({ item, index }) => <Item index={index} />}
      />

      {/* Doesn't reproduce with ScrollView: */}
      {/* <ScrollView
        style={{ flex: 1 }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      >
        {new Array(15).fill(1).map((_, index) => (
          <Item key={index} index={index} />
        ))}
      </ScrollView> */}
    </>
  );
}
