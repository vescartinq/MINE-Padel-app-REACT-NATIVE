import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  return (
    <ScrollView>
      <Image
        source={require("../../../assets/img/mine-logo1.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.viewContainer}>
        <Text>Login Form</Text>
        <CreateAccount />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewContainer}>
        <Text>LoginFacebook</Text>
      </View>
    </ScrollView>
  );
}

function CreateAccount() {
  const {navigate} = useNavigation();

  return (
    <Text style={styles.textRegister}>
      ¿New User?{" "}
      <Text
        style={styles.btnRegister}
        onPress={() => navigate("register")}
      >
        Create your Account
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40,
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 40,
  },
});
