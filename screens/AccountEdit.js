import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
// import ImageViewer from "./components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
// import ImageViewer from "../components/ImageViewer";
import { Image } from "react-native";
import { TextInput } from "react-native";
import {
  getAuth,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { ScrollView } from "react-native";
import Toast from "react-native-simple-toast";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
const AccountEdit = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const storageref = ref(storage, `${user.uid}/profile/${user.uid}`);
  const [selectedImage, setSelectedImage] = useState(null);
  const [username, setUserName] = useState("");
  const [url, setUrl] = useState("");
  let blob;
  let response;
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHide, setPasswordHide] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  // this function is used to get images from our phone
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      await blobresponse(result.assets[0].uri);
      getDownloadURL(storageref).then((data) => {
        setSelectedImage(data);
        // console.log(data);
      });
    } else {
      alert("You did not select any image.");
    }
  };
  // this function runs at the opening of screen and it gets username and profile pic and email info of user from firebase
  useEffect(() => {
    getDownloadURL(storageref).then((data) => {
      setSelectedImage(data);
      // console.log(data);
    });

    setEmail(user.email);
    setUserName(user.displayName);
    // setPhone(user.phoneNumber);
  }, []);

  // this function is used to convert photos into blob so we can upload it to firebase storage
  const blobresponse = async (data) => {
    blob = await fetch(data);
    response = await blob.blob();
    await uploadBytes(storageref, response).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    // getMetadata(storageref).then((data) => {
    //   console.log(data);
    // });
  };
  // useEffect(() => {
  //   getDownloadURL(storageref).then((data) => {
  //     setSelectedImage(data);
  //     // console.log(data);
  //   });
  // }, [selectedImage]);
  const imageSource =
    selectedImage !== null
      ? { uri: selectedImage }
      : require("../assets/profile-placeholder.png");

  // this function is used to upload data to firebase when we press save button
  const handleSubmit = () => {
    setPasswordLengthError(false);

    updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: selectedImage,
    })
      .then((data) => {
        // Profile updated!
        // ...
        // console.log(data);

        // blobresponse();
        updateEmail(auth.currentUser, email)
          .then(() => {
            // Email updated!
            // ...

            // Toast.show("email", Toast.SHORT);
            if (password.length > 0) {
              // Toast.show("password length", Toast.SHORT);
              if (password.length < 8) {
                setPasswordLengthError(true);
              } else {
                // Toast.show("passwords", Toast.SHORT);
                updatePassword(user, password)
                  .then(() => {
                    // Update successful.
                    console.log("password");

                    Toast.show("Profile updated successfully!", Toast.SHORT);
                    navigation.navigate("Home");
                  })
                  .catch((error) => {
                    Toast.show(
                      "something went wrong. Try after login ",
                      Toast.SHORT
                    );
                    console.log("password error");
                    navigation.navigate("Home");
                    // console.log(error);                    // signOut(auth);
                    // An error ocurred
                    // ...
                  });
              }
            } else {
              navigation.navigate("Home");
              Toast.show("Profile updated successfully!", Toast.SHORT);
            }
          })
          .catch((error) => {
            // An error occurred
            // ...
            console.log("email error");
            Toast.show(
              "Something went wrong. Please try again later!",
              Toast.SHORT
            );
          });
      })
      .catch((error) => {
        // An error occurred
        // ...
        console.log("username error");
      });
  };

  return (
    <View style={{ padding: 15, height: "100%", backgroundColor: "white" }}>
      <View style={{ height: "90%" }}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Text style={{ fontWeight: "900", fontSize: 18, letterSpacing: 2 }}>
              Edit Profile
            </Text>

            <TouchableOpacity
              style={{
                // backgroundColor: "black",
                position: "absolute",
                left: 0,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <Image
              source={imageSource}
              style={{ width: 90, height: 90, borderRadius: 90 / 2 }}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={{ marginLeft: 20 }}
              onPress={() => pickImageAsync()}
            >
              <Text
                style={{
                  borderWidth: 2,
                  borderRadius: 20,
                  padding: 10,
                  textAlign: "center",
                  textAlignVertical: "center",
                  borderColor: "black",
                }}
              >
                Change profile picture
              </Text>
            </TouchableOpacity>
          </View>
          {/*--------------------
            username container
            -----------------------
             */}
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: "700",
                color: "black",
              }}
            >
              UserName
            </Text>
            <TextInput
              value={username}
              onChangeText={(e) => setUserName(e)}
              style={{
                borderWidth: 2,
                borderColor: "#71797E",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            />
          </View>
          {/*--------------------
            Email container
            -----------------------
             */}
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: "700",
                color: "black",
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(e) => setEmail(e)}
              style={{
                borderWidth: 2,
                borderColor: "#71797E",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            />
          </View>
          {/* <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: "700",
                color: "black",
              }}
            >
              Phone number
            </Text>
            <TextInput
              value={phone}
              keyboardType="phone-pad"
              onChangeText={(e) => setPhone(e)}
              style={{
                borderWidth: 2,
                borderColor: "#71797E",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            />
          </View> */}
          {/*--------------------
            password container
            -----------------------
             */}
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: "700",
                color: "black",
              }}
            >
              update password Password
            </Text>
            <View
              style={{
                borderWidth: 2,
                borderColor: "#71797E",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                value={password}
                secureTextEntry={passwordHide}
                onChangeText={(e) => setPassword(e)}
                style={{ width: "90%" }}
              />
              <TouchableOpacity onPress={() => setPasswordHide(!passwordHide)}>
                {!passwordHide ? (
                  <Entypo name="eye" size={24} color="black" />
                ) : (
                  <Entypo name="eye-with-line" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={{ color: "red", fontWeight: "600" }}>
                Please Enter password
              </Text>
            ) : passwordLengthError ? (
              <Text style={{ color: "red", fontWeight: "600" }}>
                Password is too short
              </Text>
            ) : (
              <></>
            )}
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
              borderRadius: 25,
              marginVertical: 20,
            }}
            onPress={() => handleSubmit()}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default AccountEdit;

const styles = StyleSheet.create({});
