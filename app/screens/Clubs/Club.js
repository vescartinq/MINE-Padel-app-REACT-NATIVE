import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Club(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;

    navigation.setOptions({ title: name });

    return (
        <View>
            <Text>CLUBS SCREEN</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
