import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Clubs({navigation}) {
    const [user, setUser] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [totalClubs, setTotalClubs] = useState(0);
    const [startClubs, setStartClubs] = useState(null);
    const limitClubs = 10;

    console.log(clubs)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
          setUser(userInfo);
        });
      }, []);

      useEffect(() => {
        db.collection("clubs")
        .get()
        .then((snap) => {
          setTotalClubs(snap.size);
      });

      const resultClubs = [];
      db.collection("clubs")
        .orderBy("createAt", "desc")
        .limit(limitClubs)
        .get()
        .then((response) => {
          setStartClubs(response.docs[response.docs.length - 1]);

          response.forEach((doc) => {
            const club = doc.data();
            club.id = doc.id;
            resultClubs.push(club);
          });
          setClubs(resultClubs);
        })
    }, [])


  return (
    <View style={styles.viewBody}>
      <Text>Clubs...</Text>
      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00a680"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-club")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
