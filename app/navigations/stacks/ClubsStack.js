import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Clubs from "../../screens/Clubs/Clubs";
import AddClub from "../../screens/Clubs/AddClub";
// import Club from "../../screens/Clubs/Club";
// import AddReviewClub from "../../screens/Clubs/AddReviewClub";

const Stack = createStackNavigator();

export default function ResaturantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="clubs"
        component={Clubs}
        options={{ title: "Clubs" }}
      />
      <Stack.Screen
        name="add-club"
        component={AddClub}
        options={{ title: "Add new club" }}
      />
      {/* <Stack.Screen name="club" component={Club} /> */}
      {/* <Stack.Screen
        name="add-review-club"
        component={AddReviewClub}
        options={{ title: "New review" }}
      /> */}
    </Stack.Navigator>
  );
}