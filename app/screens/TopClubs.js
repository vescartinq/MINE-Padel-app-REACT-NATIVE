import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopclubs from "../components/Ranking/ListTopClubs";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopClubs({ navigation }) {
  const [clubs, setClubs] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("clubs")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response) => {
        const clubArray = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          clubArray.push(data);
        });
        setClubs(clubArray);
      });
  }, []);

  return (
    <View>
      <ListTopclubs clubs={clubs} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
}