import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Toast from "react-native-simple-toast";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { TouchableHighlight } from "react-native";
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  // const provider = new GoogleAuthProvider();

  const handleEmailPassSignin = () => {
    setEmailError(false);

    if (email === "") {
      setEmailError(true);
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Toast.show("Check your email", Toast.SHORT, Toast.TOP);

          setEmailError(false);

          setEmail("");

          navigation.navigate("SignIn");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.group("error code", errorCode);
          console.group("error message", errorMessage);
          Toast.show("Please check Your email and password", Toast.SHORT);
        });
    }
  };

  return (
    <LinearGradient
      colors={["#8d61ed", "#1d1d1d"]}
      end={[0.5, 0.3]}
      start={[0.2, 1]}
      style={{
        // backgroundColor: "#1d1d1d",
        height: "100%",
        width: "100%",
        padding: 10,
        justifyContent: "center",
      }}
    >
      {/* <StatusBar backgroundColor="white" /> */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        style={{
          // borderColor: "white",
          // borderWidth: 2,
          padding: 10,
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50 / 2,

          // backgroundColor: "white",
        }}
      >
        <Ionicons name="chevron-back" size={30} color="white" />
      </TouchableOpacity>

      <ScrollView style={{ height: "100%", width: "100%" }}>
        <View
          style={{
            alignItems: "center",
            width: "100%",
            height: "100%",
            marginTop: 30,
            // justifyContent: "center",
            // backgroundColor: "black",
          }}
        >
          <Image
            resizeMode="contain"
            source={require("../../assets/logo.png")}
            style={{ height: 150, width: 150 }}
          />
          <View
            style={{
              backgroundColor: "#f3f3f33b",
              width: "95%",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 20,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "900",
                color: "white",
                letterSpacing: 5,
                textAlign: "center",
              }}
            >
              Forgot password
            </Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <View style={styles.container}>
                <View style={styles.iconText}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="black"
                    style={styles.icon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email"
                    keyboardType="email-address"
                    style={styles.input_text}
                  />
                </View>
                {emailError ? (
                  <Text style={styles.error}>Please Enter email Id</Text>
                ) : (
                  <></>
                )}
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{ width: "70%" }}
                onPress={() => handleEmailPassSignin()}
                // disabled={isDisabled}
              >
                <Text
                  style={{
                    backgroundColor: "white",
                    width: 200,
                    paddingVertical: 15,
                    textAlign: "center",
                    // color: "#8d61ed",
                    color: "black",
                    fontWeight: "900",
                    // borderBottomRightRadius: 20,
                    // borderTopLeftRadius: 20,
                    borderRadius: 20,
                    fontSize: 17,
                  }}
                >
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  input_text: {
    height: 40,
    fontSize: 18,
    width: "85%",

    color: "white",
    paddingHorizontal: 10,
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f39c",
    borderRadius: 25,
    padding: 5,
    width: "100%",
  },
  icon: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },
  input_heading: {
    fontSize: 18,
    fontWeight: "900",
    color: "white",
    marginBottom: 10,
  },
  container: {
    width: "100%",
    marginBottom: 30,
  },
  error: { color: "white", fontWeight: "600", marginTop: 10 },
});
