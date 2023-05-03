import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Toast from "react-native-simple-toast";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Entypo, Ionicons, Feather } from "@expo/vector-icons";
import { async } from "@firebase/util";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { useStateContext } from "../../context/StateContext";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const SignUp = ({ navigation }) => {
  const { setSignIn } = useStateContext();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordHide1, setPasswordHide1] = useState(true);
  const [passwordHide2, setPasswordHide2] = useState(true);
  // this functions run everytym username or password or email is changed and it checks if email or password or username have any errors
  useEffect(() => {
    if (email === "") {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (username === "") {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
    if (password == "") {
      setPasswordError(true);
      // setEmailError(false);
    } else {
      setPasswordError(false);
    }
    if (password.length < 8) {
      setPasswordLengthError(true);
    } else {
      setPasswordLengthError(false);
    }
    if (password === confirmPassword) {
      // setEmailError(false);
      // setPasswordError(false);
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  }, [email, password, confirmPassword, username]);
  const handleSignIn = () => {
    // setEmailError(false);
    // setUsernameError(false);
    // setPasswordError(false);
    // setPasswordLengthError(false);
    // setConfirmPasswordError(false);

    if (
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !passwordLengthError &&
      !usernameError
    ) {
      // console.log("login");
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          updateProfile(auth.currentUser, {
            displayName: username,
            // photoURL: selectedImage,
          }).then(() => {
            const user = userCredential.user;
            console.log(user);
            setSignIn(true);
            Toast.show("signup successful", Toast.SHORT);
            setEmailError(false);
            setPasswordError(false);
            setEmail("");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setPasswordLengthError(false);
            setConfirmPasswordError(false);
            // navigation.navigate("Home");
          });
        })

        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          if (errorCode === "auth/email-already-in-use") {
            Toast.show(
              "user with this email is already exist, Please try Login!",
              Toast.SHORT
            );
          } else {
            Toast.show(
              "something went wrong. Please try again later",
              Toast.SHORT
            );
          }
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
        // justifyContent: "center",
      }}
    >
      {/* <StatusBar backgroundColor="#1d1d1d" barStyle={"light-content"} /> */}

      <ScrollView style={{ height: "100%", width: "100%" }}>
        <View
          style={{
            alignItems: "center",
            width: "100%",
            height: "100%",
            marginTop: -20,
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
                letterSpacing: 15,
                textAlign: "center",
              }}
            >
              SIGNUP
            </Text>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {/*--------------------
            username container
            -----------------------
             */}
              <View style={styles.container}>
                <View style={styles.iconText}>
                  <Feather
                    name="user"
                    size={20}
                    color="black"
                    style={styles.icon}
                  />
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="username"
                    // keyboardType="email-address"
                    style={styles.input_text}
                  />
                </View>
                {usernameError ? (
                  <Text style={styles.error}>Please Enter Username</Text>
                ) : (
                  <></>
                )}
              </View>
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
                  <Text style={styles.error}>Please Enter email-Id</Text>
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
                      styles.input_text,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                  >
                    <TextInput
                      value={password}
                      style={{ width: "90%", color: "white", fontSize: 18 }}
                      secureTextEntry={passwordHide1}
                      onChangeText={(e) => setPassword(e)}
                      keyboardType="default"
                      placeholder="password"
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordHide1(!passwordHide1)}
                    >
                      {!passwordHide1 ? (
                        <Entypo name="eye" size={24} color="white" />
                      ) : (
                        <Entypo name="eye-with-line" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {passwordError ? (
                  <Text style={styles.error}>Please Enter password</Text>
                ) : passwordLengthError ? (
                  <Text style={styles.error}>Password is too short</Text>
                ) : (
                  <></>
                )}
              </View>
              {/*--------------------
            confirm container
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
                      styles.input_text,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                  >
                    <TextInput
                      value={confirmPassword}
                      style={{ width: "90%", color: "white", fontSize: 18 }}
                      secureTextEntry={passwordHide2}
                      onChangeText={(e) => setConfirmPassword(e)}
                      keyboardType="default"
                      placeholder="confirm password"
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordHide2(!passwordHide2)}
                    >
                      {!passwordHide2 ? (
                        <Entypo name="eye" size={24} color="white" />
                      ) : (
                        <Entypo name="eye-with-line" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.error}>Password does not match</Text>
                ) : (
                  <></>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ width: "70%" }}
                onPress={() => handleSignIn()}
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
                  SIGN UP
                </Text>
              </TouchableOpacity>
              <Text style={{ marginTop: 40, fontSize: 16, color: "white" }}>
                Already have account?&nbsp;&nbsp;
                <Text
                  style={{ fontWeight: "900" }}
                  onPress={() => navigation.navigate("SignIn")}
                >
                  LOGIN
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUp;

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
