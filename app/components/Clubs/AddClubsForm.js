import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions
} from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
// import { map, size, filter } from "lodash";
// import * as Permissions from "expo-permissions";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import MapView from "react-native-maps";
// import uuid from "random-uuid-v4";
// import Modal from "../Modal";

// import { firebaseApp } from "../../utils/firebase";
// import firebase from "firebase/app";
// import "firebase/storage";
// import "firebase/firestore";
// const db = firebase.firestore(firebaseApp);
//
// const widthScreen = Dimensions.get("window").width;

export default function AddClubForm(props) {
  //   const { toastRef, setIsLoading, navigation } = props;
  //   const [ClubName, setClubName] = useState("");
  //   const [ClubAddress, setClubAddress] = useState("");
  //   const [ClubDescription, setClubDescription] = useState("");
  //   const [imagesSelected, setImagesSelected] = useState([]);
  //   const [isVisibleMap, setIsVisibleMap] = useState(false);
  //   const [locationClub, setLocationClub] = useState(null);

  //   const addClub = () => {
  //     if (!ClubName || !ClubAddress || !ClubDescription) {
  //       toastRef.current.show("Todos los campos del formulario son obligatorios");
  //     } else if (size(imagesSelected) === 0) {
  //       toastRef.current.show("El Clube tiene que tener almenos una foto");
  //     } else if (!locationClub) {
  //       toastRef.current.show("Tienes que localizar el restaurnate en el mapa");
  //     } else {
  //       setIsLoading(true);
  //       uploadImageStorage().then((response) => {
  //         db.collection("Clubs")
  //           .add({
  //             name: ClubName,
  //             address: ClubAddress,
  //             description: ClubDescription,
  //             location: locationClub,
  //             images: response,
  //             rating: 0,
  //             ratingTotal: 0,
  //             quantityVoting: 0,
  //             createAt: new Date(),
  //             createBy: firebase.auth().currentUser.uid,
  //           })
  //           .then(() => {
  //             setIsLoading(false);
  //             navigation.navigate("Clubs");
  //           })
  //           .catch(() => {
  //             setIsLoading(false);
  //             toastRef.current.show(
  //               "Error al subir el Clube, intentelo más tarde"
  //             );
  //           });
  //       });
  //     }
  //   };

  //   const uploadImageStorage = async () => {
  //     const imageBlob = [];

  //     await Promise.all(
  //       map(imagesSelected, async (image) => {
  //         const response = await fetch(image);
  //         const blob = await response.blob();
  //         const ref = firebase.storage().ref("Clubs").child(uuid());
  //         await ref.put(blob).then(async (result) => {
  //           await firebase
  //             .storage()
  //             .ref(`Clubs/${result.metadata.name}`)
  //             .getDownloadURL()
  //             .then((photoUrl) => {
  //               imageBlob.push(photoUrl);
  //             });
  //         });
  //       })
  //     );

  //     return imageBlob;
  //   };

  return (
    <ScrollView style={styles.scrollView}>
       {/* <ImageClub imagenClub={imagesSelected[0]} /> */}
       <FormAdd
        //  setClubName={setClubName}
        //  setClubAddress={setClubAddress}
        //  setClubDescription={setClubDescription}
        //  setIsVisibleMap={setIsVisibleMap}
        //  locationClub={locationClub}
       />
       {/* <UploadImage
         toastRef={toastRef}
         imagesSelected={imagesSelected}
         setImagesSelected={setImagesSelected}
       />
       <Button
         title="Crear Clube"
         onPress={addClub}
         buttonStyle={styles.btnAddClub}
       />
       <Map
         isVisibleMap={isVisibleMap}
         setIsVisibleMap={setIsVisibleMap}
         setLocationClub={setLocationClub}
         toastRef={toastRef}
       /> */}
    </ScrollView>
  );
}

// function ImageClub(props) {
//   const { imagenClub } = props;

//   return (
//     <View style={styles.viewPhoto}>
//       <Image
//         source={
//           imagenClub
//             ? { uri: imagenClub }
//             : require("../../../assets/img/no-image.png")
//         }
//         style={{ width: widthScreen, height: 200 }}
//       />
//     </View>
//   );
// }

function FormAdd(props) {
  const {
    setClubName,
    setClubAddress,
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
        placeholder="Enter Club Description"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setClubDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

// function Map(props) {
//   const {
//     isVisibleMap,
//     setIsVisibleMap,
//     setLocationClub,
//     toastRef,
//   } = props;
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const resultPermissions = await Permissions.askAsync(
//         Permissions.LOCATION
//       );
//       const statusPermissions = resultPermissions.permissions.location.status;

//       if (statusPermissions !== "granted") {
//         toastRef.current.show(
//           "Tienes que aceptar los permisos de localizacion para crear un Clube",
//           3000
//         );
//       } else {
//         const loc = await Location.getCurrentPositionAsync({});
//         setLocation({
//           latitude: loc.coords.latitude,
//           longitude: loc.coords.longitude,
//           latitudeDelta: 0.001,
//           longitudeDelta: 0.001,
//         });
//       }
//     })();
//   }, []);

//   const confirmLocation = () => {
//     setLocationClub(location);
//     toastRef.current.show("Localizacion guardada correctamente");
//     setIsVisibleMap(false);
//   };

//   return (
//     <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
//       <View>
//         {location && (
//           <MapView
//             style={styles.mapStyle}
//             initialRegion={location}
//             showsUserLocation={true}
//             onRegionChange={(region) => setLocation(region)}
//           >
//             <MapView.Marker
//               coordinate={{
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//               }}
//               draggable
//             />
//           </MapView>
//         )}
//         <View style={styles.viewMapBtn}>
//           <Button
//             title="Guardar Ubicacion"
//             containerStyle={styles.viewMapBtnContainerSave}
//             buttonStyle={styles.viewMapBtnSave}
//             onPress={confirmLocation}
//           />
//           <Button
//             title="Cancelar Ubicacion"
//             containerStyle={styles.viewMapBtnContainerCancel}
//             buttonStyle={styles.viewMapBtnCancel}
//             onPress={() => setIsVisibleMap(false)}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// }

// function UploadImage(props) {
//   const { toastRef, imagesSelected, setImagesSelected } = props;

//   const imageSelect = async () => {
//     const resultPermissions = await Permissions.askAsync(
//       Permissions.CAMERA_ROLL
//     );

//     if (resultPermissions === "denied") {
//       toastRef.current.show(
//         "Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente.",
//         3000
//       );
//     } else {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//       });

//       if (result.cancelled) {
//         toastRef.current.show(
//           "Has cerrado la galeria sin seleccionar ninguna imagen",
//           2000
//         );
//       } else {
//         setImagesSelected([...imagesSelected, result.uri]);
//       }
//     }
//   };

//   const removeImage = (image) => {
//     Alert.alert(
//       "Eliminar Imagen",
//       "¿Estas seguro de que quieres eliminar la imagen?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Eliminar",
//           onPress: () => {
//             setImagesSelected(
//               filter(imagesSelected, (imageUrl) => imageUrl !== image)
//             );
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   return (
//     <View style={styles.viewImages}>
//       {size(imagesSelected) < 4 && (
//         <Icon
//           type="material-community"
//           name="camera"
//           color="#7a7a7a"
//           containerStyle={styles.containerIcon}
//           onPress={imageSelect}
//         />
//       )}
//       {map(imagesSelected, (imageClub, index) => (
//         <Avatar
//           key={index}
//           style={styles.miniatureStyle}
//           source={{ uri: imageClub }}
//           onPress={() => removeImage(imageClub)}
//         />
//       ))}
//     </View>
//   );
// }

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
