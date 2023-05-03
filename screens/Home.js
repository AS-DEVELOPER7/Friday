import {
  DrawerLayoutAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { TextInput } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { Image } from "react-native";
import { Flow } from "react-native-animated-spinkit";
import { Alert } from "react-native";
import { BackHandler } from "react-native";
import { StatusBar } from "react-native";

import * as Clipboard from "expo-clipboard";
import Toast from "react-native-simple-toast";
import Drawer from "../components/Drawer";
import { Button } from "react-native";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NewChat from "../components/NewChat";
import SavedChat from "../components/SavedChat";

const Home = () => {
  const [input, setInput] = useState("");
  const [chatName, setChatName] = useState("");
  const [chatNameError, setChatNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const drawer = useRef();
  const [chat, setChat] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [selected, setSelected] = useState("");
  const [openModel, setOpenModel] = useState(false);
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const handleSubmit = async () => {
    // setChat([
    //   ...chat,
    //   {
    //     text: input,
    //     from: "user",
    //   },
    // ]);
    if (input === "") {
    } else {
      setLoading(true);
      await generateText(input);
      // setInput("");
      // setLoading(false);
    }
  };
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  const handleresponse = (data) => {
    if (savedList.some((d) => d.id === selected)) {
      updateDoc(doc(db, "data", auth.currentUser.uid, "saved", selected), {
        chat: arrayUnion(
          {
            text: input,
            from: "user",
          },
          {
            text: data,
            from: "gpt",
          }
        ),
      }).then((data) => {
        // console.log(data);
        onSnapshot(
          doc(db, "data", auth.currentUser.uid, "saved", selected),
          (data) => {
            console.log(
              "data",
              // data
              // ? ""
              data?._document?.data?.value?.mapValue?.fields?.chat?.arrayValue
                ?.values
            );
            setChat(
              data?._document?.data?.value?.mapValue?.fields?.chat?.arrayValue
                ?.values
            );
            setInput("");
            setLoading(false);
          }
        );
      });
    } else {
      setChat([
        ...chat,
        {
          text: input,
          from: "user",
        },
        {
          text: data,
          from: "gpt",
        },
      ]);
      // console.log(data);
      setInput("");
      setLoading(false);
    }
    // Speech.speak(data);
  };
  const generateText = async (prompt) => {
    const apiKey = "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";
    const apiUrl =
      "https://api.openai.com/v1/engines/text-davinci-003/completions";

    const response = await axios
      .post(
        apiUrl,
        {
          prompt: prompt,
          max_tokens: 1024,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )
      .catch(() => {
        setLoading(false);
      });

    return handleresponse(response.data.choices[0].text);
  };

  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    Toast.show(" Text is copied!", Toast.SHORT, Toast.TOP);
  };
  useEffect(() => {
    onSnapshot(
      collection(db, "data", auth.currentUser.uid, "saved"),
      (data) => {
        // console.log(data.docs);
        setSavedList(data.docs);
      }
    );
  }, []);
  // useEffect(() => {
  //   savedList.some((d) => d.id === selected)
  //     ?
  //     : "";
  // }, [loading === false]);
  const handleSave = () => {
    savedList.some((d) => d.id === selected)
      ? Alert.alert("Hold on!", "Are you sure you want to Delete this chat?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () =>
              deleteDoc(
                doc(db, "data", auth.currentUser.uid, "saved", selected)
              ).then(() => {
                Toast.show(" chat is deleted", Toast.SHORT, Toast.TOP);
                setSelected("");
              }),
          },
        ])
      : setOpenModel(true);
  };
  const handleSaveChat = () => {
    chatName === ""
      ? setChatNameError(true)
      : setDoc(doc(db, "data", auth.currentUser.uid, "saved", chatName), {
          chat,
        }).then(() => {
          setOpenModel(false);
          setSelected(chatName);
          setChatName("");
          setChatNameError(false);
        });
  };
  return (
    <>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={"left"}
        renderNavigationView={() => (
          <Drawer
            drawer={drawer}
            list={savedList}
            setSelected={setSelected}
            selected={selected}
            chat={chat}
            setChat={setChat}
          />
        )}
      >
        <View
          style={{
            backgroundColor: "#1d1d1d",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: 10,
          }}
        >
          <StatusBar backgroundColor="#1d1d1d" />
          {/* 
    //-----------------------
    //Tab bar top
    //-----------------------
    */}
          <View
            style={{
              width: "100%",
              // position: "absolute",
              // top: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              // backgroundColor: "white",
            }}
          >
            <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
              <MaterialCommunityIcons
                name="sort-variant"
                size={26}
                color="white"
              />
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                fontWeight: "800",
                fontSize: 18,
                letterSpacing: 5,
                width: "80%",
                // backgroundColor: "white",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {selected === "" ? "New Chat" : selected}
            </Text>
            <TouchableOpacity onPress={() => handleSave()}>
              <MaterialCommunityIcons
                name={
                  savedList.some((d) => d.id === selected)
                    ? "bookmark"
                    : "bookmark-outline"
                }
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {/* 
      //-------------------
      //Chats
      //-------------------
      */}
          <View
            style={{
              height: "85%",
              width: "100%",
              justifyContent: "flex-end",
              // backgroundColor: "white",
            }}
          >
            <ScrollView style={{ height: "100%" }}>
              <View style={{ height: "100%", justifyContent: "flex-end" }}>
                {chat?.map((data, key) => (
                  <View key={key}>
                    {data.from ? (
                      <NewChat data={data} />
                    ) : (
                      <SavedChat data={data} />
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          {/*
      //--------------------
      // textbar bottom
      //-------------------- 
       */}
          <View
            style={{
              borderWidth: 2,
              borderColor: "#8d61ed",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderRadius: 25,
              // marginTop: 1,
              // position: "absolute",
              // bottom: 10,
            }}
          >
            {loading ? (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  height: 20,
                  justifyContent: "center",
                }}
              >
                <Flow size={35} color="#8d61ed" style={{ width: 50 }} />
              </View>
            ) : (
              <>
                <TextInput
                  value={input}
                  onChangeText={(e) => setInput(e)}
                  onSubmitEditing={() => handleSubmit()}
                  style={{ width: "90%", fontSize: 18, color: "white" }}
                  placeholder="ask anything you want"
                  placeholderTextColor={"gray"}
                />
                <TouchableOpacity onPress={() => handleSubmit()}>
                  <Ionicons
                    name="md-paper-plane-outline"
                    size={24}
                    color="#8d61ed"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </DrawerLayoutAndroid>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModel}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setOpenModel(false);
        }}
      >
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 10,
          }}
        >
          <LinearGradient
            colors={["#8d61edd9", "#2a2a2a"]}
            end={[0.5, 0.3]}
            start={[0.2, 1]}
            style={{
              height: 250,
              // backgroundColor: "white",
              width: "90%",
              flexDirection: "column",
              alignItems: "center",
              // justifyContent: "space-evenly",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                position: "relative",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
              >
                New Chat
              </Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 5,
                  right: 10,

                  // width: "100%",
                }}
                onPress={() => setOpenModel(false)}
              >
                <Text style={{ color: "red", fontWeight: "700" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: "#f3f3f39c",
                borderRadius: 25,
                padding: 5,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 50,
                // marginBottom: 30,
              }}
            >
              <MaterialIcons
                name="drive-file-rename-outline"
                size={24}
                color="black"
                style={{
                  backgroundColor: "white",
                  padding: 8,
                  borderRadius: 30,
                }}
              />
              <TextInput
                value={chatName}
                onChangeText={(e) => setChatName(e)}
                placeholder="Enter Chat name"
                placeholderTextColor={"white"}
                style={{
                  // height: 40,
                  fontSize: 18,
                  width: "85%",

                  color: "white",
                  paddingHorizontal: 10,
                }}
              />
            </View>
            {chatNameError ? (
              <Text
                style={{
                  color: "white",
                  width: "100%",
                  textAlign: "left",
                  marginTop: 10,
                }}
              >
                Please give chat name
              </Text>
            ) : (
              <></>
            )}
            <TouchableOpacity
              style={{ width: "100%", alignItems: "center", marginTop: 20 }}
              onPress={() => handleSaveChat()}
            >
              <Text
                style={{
                  backgroundColor: "white",
                  color: "black",
                  paddingVertical: 15,
                  width: "50%",
                  textAlign: "center",
                  borderRadius: 20,
                  fontWeight: "700",
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
