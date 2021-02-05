import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites({ navigation }) {
  const [clubs, setClubs] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idClubsArray = [];
            response.forEach((doc) => {
              idClubsArray.push(doc.data().idClub);
            });
            getDataClub(idClubsArray).then((response) => {
              const clubs = [];
              response.forEach((doc) => {
                const club = doc.data();
                club.id = doc.id;
                clubs.push(club);
              });
              setClubs(clubs);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );

  const getDataClub = (idClubsArray) => {
    const arrayClubs = [];
    idClubsArray.forEach((idClub) => {
      const result = db.collection("clubs").doc(idClub).get();
      arrayClubs.push(result);
    });
    return Promise.all(arrayClubs);
  };

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (clubs?.length === 0) {
    return <NotFoundClubs />;
  }

  return (
    <View style={styles.viewBody}>
      {clubs ? (
        <FlatList
          data={clubs}
          renderItem={(club) => (
            <Club
              club={club}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderClubs}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Loading Clubs</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Removing club" isVisible={isLoading} />
    </View>
  );
}

function NotFoundClubs() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Your list of favorite clubs is empty
      </Text>
    </View>
  );
}

function UserNoLogged({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        You need to be logged in to see your favorites list
      </Text>
      <Button
        title="Log In"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Club(props) {
  const { club, setIsLoading, toastRef, setReloadData, navigation } = props;
  const { id, name, images } = club.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Remove club ",
      "¿Are you sure you want to remove this club from your favorites list?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idClub", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show("club removed succesfully");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show("Error removing club");
            });
        });
      });
  };

  return (
    <View style={styles.club}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("clubs", {
            screen: "club",
            params: { id },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderClubs: {
    marginTop: 10,
    marginBottom: 10,
  },
  club: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
    width: 250,
  },
  favorite: {
    position: "absolute",
    zIndex: 10,
    right: 10,
    top: -15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
