import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// import { auth } from "../../firebaseConfig";
import Toast from "react-native-simple-toast";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { useStateContext } from "../../context/StateContext";
const SignIn = ({ navigation }) => {
  const { setSignIn } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);
  // const provider = new GoogleAuthProvider();

  const handleEmailPassSignin = () => {
    setEmailError(false);
    setPasswordError(false);
    if (email === "") {
      setEmailError(true);
    } else {
    }
    if (password == "") {
      setPasswordError(true);
      // setEmailError(false);
    } else {
    }

    if (!emailError && !passwordError) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setSignIn(true);
          Toast.show("Login Successfull", Toast.SHORT);
          console.log(user);
          AsyncStorage.setItem("uid", user.uid);
          setDoc(doc(db, "login", user.uid), {
            email: email,
            password: password,
            loggedIn: true,
          });
          setEmailError(false);
          setPasswordError(false);
          setEmail("");
          setPassword("");
          // navigation.navigate("Home");
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
      <StatusBar backgroundColor="#1d1d1d" barStyle={"light-content"} />

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
                fontSize: 30,
                fontWeight: "900",
                color: "white",
                letterSpacing: 25,
                textAlign: "center",
              }}
            >
              LOGIN
            </Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 40,
                width: "100%",
              }}
            >
              {/*--------------------
            Email container
            -----------------------
             */}
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
              {/*--------------------
            password container
            -----------------------
             */}
              <View style={styles.container}>
                <View style={styles.iconText}>
                  <Ionicons
                    name="key"
                    size={20}
                    color="black"
                    style={styles.icon}
                  />
                  <View
                    style={[
                      { flexDirection: "row", alignItems: "center" },
                      styles.input_text,
                    ]}
                  >
                    <TextInput
                      value={password}
                      style={{ width: "90%", color: "white", fontSize: 18 }}
                      secureTextEntry={passwordHide}
                      onChangeText={(e) => setPassword(e)}
                      keyboardType="default"
                      placeholder="password"
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordHide(!passwordHide)}
                    >
                      {!passwordHide ? (
                        <Entypo name="eye" size={24} color="white" />
                      ) : (
                        <Entypo name="eye-with-line" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {passwordError ? (
                  <Text style={[{ marginBottom: 20 }, styles.error]}>
                    Please Enter Password
                  </Text>
                ) : (
                  <></>
                )}
                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={{ fontWeight: "800", color: "white" }}>
                    Forgot Password ?
                  </Text>
                </TouchableOpacity>
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
                    width: "100%",
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
                  LOGIN
                </Text>
              </TouchableOpacity>
              <Text style={{ marginTop: 40, fontSize: 16, color: "white" }}>
                Don't have any account?&nbsp;&nbsp;
                <Text
                  style={{ fontWeight: "700" }}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  SignUp
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  input_text: {
    // borderBottomWidth: 1,
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
    fontSize: 15,
    fontWeight: "900",
    color: "#8d61ed",
    marginBottom: 10,
  },
  container: {
    width: "100%",
    marginBottom: 30,
  },
  error: { color: "white", fontWeight: "600", marginTop: 10 },
});
