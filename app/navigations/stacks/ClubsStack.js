import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Clubs from '../../screens/Clubs';

const Stack = createStackNavigator();

export default function ClubsStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="clubs" component={Clubs} options={{title: "Clubs"}}/>
        </Stack.Navigator>
    )
}