import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Input, Button, Avatar, Image } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { filter, map, size } from "lodash";
import Modal from "../Modal";
import uuid from "random-uuid-v4";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddClubForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [clubName, setClubName] = useState("");
  const [clubAddress, setClubAddress] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationClub, setLocationClub] = useState(null);

  const addClub = () => {
    if (!clubName || !clubAddress ||  !clubPhone || !clubEmail ||!clubDescription) {
      toastRef.current.show("Please complete all the fields to create a club");
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show("The club must have at least one image");
    } else if (!locationClub) {
      toastRef.current.show("Please locate the club on the map");
    } else {
      setIsLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("clubs")
          .add({
            name: clubName,
            address: clubAddress,
            phone: clubPhone,
            email: clubEmail,
            description: clubDescription,
            location: locationClub,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("clubs");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error uploading club, please try again in a few minutes"
            );
          });
      });
    }
  };

  const uploadImageStorage = async () => {
    const imageBlob = [];

    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("clubs").child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`clubs/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              imageBlob.push(photoUrl);
            });
        });
      })
    );

    return imageBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageClub mainImageClub={imagesSelected[0]} />
      <FormAdd
        setClubName={setClubName}
        setClubAddress={setClubAddress}
        setClubPhone={setClubPhone}
        setClubEmail={setClubEmail}
        setClubDescription={setClubDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationClub={locationClub}
      />
      <UploadImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Create Club"
        onPress={addClub}
        buttonStyle={styles.btnAddClub}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationClub={setLocationClub}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function ImageClub(props) {
  const { mainImageClub } = props;

  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          mainImageClub
            ? { uri: mainImageClub }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

function FormAdd(props) {
  const {
    setClubName,
    setClubAddress,
    setClubPhone,
    setClubEmail,
    setClubDescription,
    setIsVisibleMap,
    locationClub,
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Enter Club Name"
        containerStyle={styles.input}
        onChange={(e) => setClubName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Enter Address"
        containerStyle={styles.input}
        onChange={(e) => setClubAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationClub ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />
      <Input
        placeholder="Enter Club Phone"
        containerStyle={styles.input}
        onChange={(e) => setClubPhone(e.nativeEvent.text)}
      />
      <Input
        placeholder="Enter Club Email"
        containerStyle={styles.input}
        onChange={(e) => setClubEmail(e.nativeEvent.text)}
      />
      <Input
        placeholder="Enter Club Description"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setClubDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const { isVisibleMap, setIsVisibleMap, setLocationClub, toastRef } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );

      const statusPermissions = resultPermissions.permissions.location.status;

      if (statusPermissions !== "granted") {
        toastRef.current.show(
          "You have to accept location permissions to create new clubs",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationClub(location);
    toastRef.current.show("Location saved succesfully");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}

        <View style={styles.viewMapBtn}>
          <Button
            title="Save Location"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancel Location"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {

    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions === "denied") {
      toastRef.current.show(
        "Please accept permissions to access to your photo galleries. You can change it on your settings wherever you want.",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show("Any picture has been added to the Club", 2000);
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Delete Image",
      "¿Are you sure you want to delete the selected image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageClub, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageClub }}
          onPress={() => removeImage(imageClub)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddClub: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
    borderRadius: 15,
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
    borderRadius: 15,
  },
});
