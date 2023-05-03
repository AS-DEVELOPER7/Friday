import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import Toast from "react-native-simple-toast";
import { Divider } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateContext } from "../context/StateContext";

const Drawer = ({ drawer, list, setSelected, selected, chat, setChat }) => {
  //   console.log(list);
  const { setSignIn } = useStateContext();
  const navigation = useNavigation();
  const handleChatChange = (id, data) => {
    setSelected(id);
    setChat(data);
    drawer.current.closeDrawer();
  };
  const handleDeleteChat = (id) => {
    Alert.alert("Hold on!", "Are you sure you want to Delete this chat?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () =>
          deleteDoc(doc(db, "data", auth.currentUser.uid, "saved", id)).then(
            () => {
              Toast.show(" chat is deleted", Toast.SHORT, Toast.TOP);
              setSelected("");
              setChat([]);
            }
          ),
      },
    ]);
  };
  const handleNewChat = () => {
    setSelected("");
    setChat([]);
    drawer.current.closeDrawer();
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        Toast.show(" SignOut Successfully", Toast.SHORT, Toast.TOP);
        AsyncStorage.removeItem("uid");
        setSignIn(false);
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: 10,
      }}
    >
      {/* 
        //----------------
        //Profile 
        //----------------
        */}
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <Image
          source={
            auth.currentUser.photoURL
              ? { uri: auth.currentUser.photoURL }
              : require("../assets/profile-placeholder.png")
          }
          resizeMode={"contain"}
          style={{ height: 80, width: 80, borderRadius: 80 / 2 }}
        />
        <Text
          style={{
            fontWeight: "800",
            fontSize: 18,
            marginLeft: 10,
            width: "60%",
            // backgroundColor: "black",
          }}
        >
          {auth.currentUser.displayName}
        </Text>
      </View>
      {/* 
      //-----------------------
      //chats
      //-----------------------
      */}
      <View style={{ height: "75%", width: "100%" }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "800",
            letterSpacing: 2,
            color: "gray",
            marginVertical: 10,
          }}
        >
          Chat List
        </Text>
        <ScrollView style={{ height: "100%", width: "100%" }}>
          {list?.map((data, key) => (
            <View key={key} style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    handleChatChange(
                      data.id,
                      data._document.data.value.mapValue.fields.chat.arrayValue
                        .values
                    )
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // backgroundColor: "black",
                    width: "85%",
                  }}
                >
                  {data.id === selected ? (
                    <Ionicons name="chatbox" size={24} color="#8d61ed" />
                  ) : (
                    <Ionicons
                      name="chatbox-outline"
                      size={24}
                      color="#8d61ed"
                    />
                  )}
                  <Text
                    style={{
                      fontWeight: "600",
                      letterSpacing: 1,
                      // backgroundColor: "black",
                      width: "85%",
                      textAlign: "center",
                      marginLeft: 10,
                    }}
                    numberOfLines={1}
                  >
                    {data.id}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteChat(data.id)}>
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <Divider width={2} style={{ marginVertical: 15 }} />
            </View>
          ))}
          <TouchableOpacity
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              borderWidth: 2,
              borderColor: "#8d61ed",
              // marginTop: 15,
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() => handleNewChat()}
          >
            <AntDesign name="plus" size={24} color="black" />
            <Text style={{ marginLeft: 10, fontWeight: "600", fontSize: 18 }}>
              New chat
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* 
      //-------------------
      //logout and setting
      //-------------------
      */}
      <View
        style={{
          height: "10%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: "#8d61ed",
            width: "45%",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 30,
          }}
          onPress={() => handleSignOut()}
        >
          <AntDesign name="logout" size={24} color="#8d61ed" />
          <Text
            style={{
              // height: 40,
              fontSize: 18,

              color: "black",
              paddingHorizontal: 10,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: "#8d61ed",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 30,
          }}
          onPress={() => navigation.navigate("AccountEdit")}
        >
          <AntDesign name="setting" size={24} color="#8d61ed" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({});
