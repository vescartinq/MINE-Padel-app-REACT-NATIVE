import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Clubs from "../../screens/Clubs/Clubs";
import AddClub from "../../screens/Clubs/AddClub";

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
    </Stack.Navigator>
  );
}