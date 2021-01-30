import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { Icon, Input, Button, Avatar } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { filter, map, size } from "lodash";

export default function AddClubForm(props) {
    const { toastRef } = props;
    const [clubName, setClubName] = useState("");
    const [clubAddress, setClubAddress] = useState("");
    const [clubDescription, setClubDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
  

    const addClub = () => {
        console.log("OK")
        console.log("clubName:"+clubName)
        console.log("clubAddress:"+clubAddress)
        console.log("clubDescription:"+clubDescription)
    };

  return (
    <ScrollView style={styles.scrollView}>
      
       <FormAdd
         setClubName={setClubName}
         setClubAddress={setClubAddress}
         setClubDescription={setClubDescription}
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
    </ScrollView>
  );
}

function FormAdd(props) {
  const {
    setClubName,
    setClubAddress,
    setClubDescription,
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

function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {
      console.log("Image...");
      
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
        toastRef.current.show(
          "Any picture has been added to the Club",
          2000
        );
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
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});
