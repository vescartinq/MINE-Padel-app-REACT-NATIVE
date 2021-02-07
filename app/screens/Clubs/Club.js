/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View, ScrollView } from "react-native";
import { Icon, ListItem, Rating } from "react-native-elements";

import Loading from "../../components/Loading";
import Carousel from "../../components/CarouselImages";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { map } from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import Map from "../../components/Map";
import ListReviews from "../../components/Clubs/ListReview";
import Toast from "react-native-easy-toast";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Club(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const [club, setClub] = useState(null);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  navigation.setOptions({ title: name });

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      db.collection("clubs")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setClub(data);
          setRating(data.rating);
        });
    }, [])
  );

  useEffect(() => {
    if (userLogged && club) {
      db.collection("favorites")
        .where("idClub", "==", club.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogged, club]);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Please, sign in to add favorite clubs"
      );
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idClub: club.id,
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Added to favorites" );
        })
        .catch(() => {
          toastRef.current.show("Error adding favorite club, please try again");
        });
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idClub", "==", club.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show("Removed from favorites");
            })
            .catch(() => {
              toastRef.current.show(
                "Error removing from favorites, please try again"
              );
            });
        });
      });
  };

  if (!club) return <Loading isVisible={true} text="Loading..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel arrayImages={club.images} height={250} width={screenWidth} />
      <TitleClub
        name={club.name}
        description={club.description}
        rating={rating}
      />
      <ClubInfo
        location={club.location}
        name={club.name}
        address={club.address}
        phone={club.phone}
        email={club.email}
      />
      <ListReviews navigation={navigation} idClub={club.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function TitleClub(props) {
  const { name, description, rating } = props;

  return (
    <View style={styles.viewClubTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameClub}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionClub}>{description}</Text>
    </View>
  );
}

function ClubInfo(props) {
  const { location, name, address, phone, email } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: phone,
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: email,
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewclubInfo}>
      <Text style={styles.clubInfoTitle}>Contact Details</Text>
      <Map location={location} name={name} height={100} />
      {map(listInfo, (item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewClubTitle: {
    padding: 15,
  },
  nameClub: {
    width: 230,
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionClub: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewClubInfo: {
    margin: 15,
    marginTop: 25,
  },
  clubInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 15,
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
