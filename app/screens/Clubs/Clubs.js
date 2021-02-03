import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListClubs from "../../components/Clubs/ListClubs";

const db = firebase.firestore(firebaseApp);

export default function Clubs({ navigation }) {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [totalClubs, setTotalClubs] = useState(0);
  const [startClubs, setStartClubs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const limitClubs = 10;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("clubs")
        .get()
        .then((snap) => {
          setTotalClubs(snap.size);
        });

      const resultClubs = [];
      db.collection("clubs")
        .orderBy("createAt", "asc")
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
        });
    }, [])
  );

  const handleLoadMore = () => {
    const resultClubs = [];
    clubs.length < totalClubs && setIsLoading(true);

    db.collection("clubs")
      .startAfter(startClubs.data().createAt)
      .limit(limitClubs)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartClubs(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const club = doc.data();
          club.id = doc.id;
          resultClubs.push(club);
        });

        setClubs([...clubs, ...resultClubs]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListClubs
        clubs={clubs}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />
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
