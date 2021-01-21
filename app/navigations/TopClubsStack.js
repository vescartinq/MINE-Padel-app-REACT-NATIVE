import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TopClubs from './../screens/TopClubs'

const Stack = createStackNavigator();

export default function TopClubsStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="topClubs" component={TopClubs} options={{title: "Top Clubs"}}/>
        </Stack.Navigator>
    )
}