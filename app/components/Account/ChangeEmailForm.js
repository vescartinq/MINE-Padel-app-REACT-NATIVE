import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { validateEmail } from "../../utils/validation";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props) {
  const { email, setShowModal, toastRef, setReloadUserInfo } = props;
  const [formData, setFormData] = useState(defaultValue());
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => { //TODO
    setErrors({});
    if (!formData.email || email === formData.email) {
      setErrors({
        email: "Email has not changed",
      });
    } else if (!validateEmail(formData.email)) {
      setErrors({
        email: "Incorrect email",
      });
    } else if (!formData.password) {
      setErrors({
        password: "The password can't be empty.",
      });
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setIsLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show("Email updated");
              setShowModal(false);
            })
            .catch(() => {
              setErrors({ email: "Error updating email." });
              setIsLoading(false);
            });
        })
        .catch(() => {
          setIsLoading(false);
          setErrors({ password: "Incorrect email" });
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Enter email"
        containerStyle={styles.input}
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errors.email}
      />
      <Input
        placeholder="Enter password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      />
      <Button
        title="Change email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
}

function defaultValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});