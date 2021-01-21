import React from 'react';
import {NavigationContainer} from'@react-navigation/native';
import {createBottomTabNavigator} from'@react-navigation/bottom-tabs';

import ClubsStack from './ClubsStack';
import FavoritesStack from './FavoritesStack';
import TopClubsStack from './TopClubsStack';
import SearchStack from './SearchStack';
import AccountStack from './AccountStack';


const Tab = createBottomTabNavigator();

export default function Navigation(){
    return(
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="clubs" component={ClubsStack} options={{title: "Clubs"}}/>
                <Tab.Screen name="favorites" component={FavoritesStack} options={{title: "Favorites"}}/>
                <Tab.Screen name="topClubs" component={TopClubsStack} options={{title: "Top Clubs"}}/>
                <Tab.Screen name="search" component={SearchStack} options={{title: "Search"}}/>
                <Tab.Screen name="account" component={AccountStack} options={{title: "Account"}}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}