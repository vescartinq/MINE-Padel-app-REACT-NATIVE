import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import ClubsStack from "./stacks/ClubsStack";
import FavoritesStack from "./stacks/FavoritesStack";
import TopClubsStack from "./stacks/TopClubsStack";
import SearchStack from "./stacks/SearchStack";
import AccountStack from "./stacks/AccountStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="account"
        tabBarOptions={{
          inactiveTintColor: "#646464",
          activeTintColor: "#00a680",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        <Tab.Screen
          name="account"
          component={AccountStack}
          options={{ title: "My Account" }}
        />
        <Tab.Screen
          name="clubs"
          component={ClubsStack}
          options={{ title: "Clubs" }}
        />
        <Tab.Screen
          name="my-clubs"
          component={FavoritesStack}
          options={{ title: "My Clubs" }}
        />
        <Tab.Screen
          name="top-clubs"
          component={TopClubsStack}
          options={{ title: "Top 5 Clubs" }}
        />   
        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Search" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "clubs":
      iconName = "home-outline";
      break;
    case "my-clubs":
      iconName = "heart-outline";
      break;
    case "top-clubs":
      iconName = "star-outline";
      break;
    case "search":
      iconName = "magnify";
      break;
    case "account":
      iconName = "account-outline";
      break;
    default:
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
