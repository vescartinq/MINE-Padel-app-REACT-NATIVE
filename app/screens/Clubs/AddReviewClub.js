import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

const db = firebase.firestore(firebaseApp);

export default function AddReviewClub(props) {
  const { navigation, route } = props;
  const { idClub } = route.params;
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();

  const addReview = () => {
    if (!rating) {
      toastRef.current.show("Please enter a score");
    } else if (!title) {
      toastRef.current.show("Please enter a title");
    } else if (!review) {
      toastRef.current.show("Please enter your review");
    } else {
      setIsLoading(true);
      const user = firebaseApp.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idClub: idClub,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date(),
      };

      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateClub();
        })
        .catch(() => {
          toastRef.current.show("Error sending review");
          setIsLoading(false);
        });
    }
  };

  const updateClub = () => {
    const clubRef = db.collection("clubs").doc(idClub);

    clubRef.get().then((response) => {
      const clubData = response.data();
      const ratingTotal = clubData.ratingTotal + rating;
      const quantityVoting = clubData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      clubRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["¡Dreadful!", "Deficient", "Normal", "Cool", "¡¡Amazing!!"]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => {
            setRating(value);
          }}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Enter here a title"
          containerStyle={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Enter here your comments"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setReview(e.nativeEvent.text)}
        />
        <Button
          title="Send Review"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Sending review" />
    </View>
  );
}

const styles = StyleSheet.create({
    viewBody: {
      flex: 1,
    },
    viewRating: {
      height: 110,
      backgroundColor: "#f2f2f2",
    },
    formReview: {
      flex: 1,
      alignItems: "center",
      margin: 10,
      marginTop: 40,
    },
    input: {
      marginBottom: 10,
    },
    textArea: {
      height: 150,
      width: "100%",
      padding: 0,
      margin: 0,
    },
    btnContainer: {
      flex: 1,
      justifyContent: "flex-end",
      marginTop: 20,
      marginBottom: 10,
      width: "95%",
    },
    btn: {
      backgroundColor: "#00a680",
    },
  });