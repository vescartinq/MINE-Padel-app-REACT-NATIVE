import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function AddReviewClub(props) {
    const { navigation, route } = props;
    const { idClub } = route.params;

    return (
        <View>
            <Text>REVIEW CLUB</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
