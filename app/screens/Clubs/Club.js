import React, { useState, useEffect, useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Loading from "../../components/Loading";
import Carousel from "../../components/CarouselImages";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Club(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const [club, setClub] = useState(null);
  // const [rating, setRating] = useState(0);
  // const [isFavorite, setIsFavorite] = useState(false);
  // const [userLogged, setUserLogged] = useState(false);
  // const toastRef = useRef();

  navigation.setOptions({ title: name });

  useEffect(() => {
    db.collection("clubs")
      .doc(id)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setClub(data);
        //   setRating(data.rating);
      });
  }, []);

  if (!club) return <Loading isVisible={true} text="Loading..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View>
        <Text>CLUBS SCREEN</Text>
        <Carousel arrayImages={club.images} height={250} width={screenWidth} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
      },
      viewRestaurantTitle: {
        padding: 15,
      },
      nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold",
      },
      descriptionRestaurant: {
        marginTop: 5,
        color: "grey",
      },
      rating: {
        position: "absolute",
        right: 0,
      },
      viewRestaurantInfo: {
        margin: 15,
        marginTop: 25,
      },
      restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
      },
      containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1,
      },
      viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,
      },
});
