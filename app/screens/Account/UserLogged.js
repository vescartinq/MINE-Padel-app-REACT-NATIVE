import React from 'react';
import { View,Text } from 'react-native';
import { Button } from "react-native-elements";
import * as firebase from "firebase";

export default function UserLogged(){
    return (
        <View>
            <Text>UserLogged...</Text>
            <Button
        title="Sign Out"
        // buttonStyle={styles.btnCloseSession}
        // titleStyle={styles.btnCloseSessionText}
        onPress={() => firebase.auth().signOut()}
      />
        </View>
    )
}