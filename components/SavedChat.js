import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-simple-toast";
import { auth } from "../firebaseConfig";
import * as Speech from "expo-speech";
const SavedChat = (data) => {
  const [mute, setMute] = useState(false);
  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    Toast.show(" Text is copied!", Toast.SHORT, Toast.TOP);
  };
  const handleSpeaker = (text) => {
    if (mute) {
      Speech.stop();
      setMute(false);
    } else {
      setMute(true);
      Speech.speak(text);
    }
  };
  return (
    <View
      style={[
        {
          width: "100%",
          marginTop: 15,
        },
        data.data.mapValue.fields.from.stringValue === "user"
          ? {
              justifyContent: "flex-start",
              flexDirection: "row-reverse",
            }
          : {
              justifyContent: "flex-start",
              flexDirection: "row",
            },
      ]}
    >
      <Image
        source={
          data.data.mapValue.fields.from.stringValue === "user"
            ? auth.currentUser.photoURL
              ? { uri: auth.currentUser.photoURL }
              : require("../assets/profile-placeholder.png")
            : require("../assets/logo2.png")
        }
        style={[
          { height: 30, width: 30, borderRadius: 30 / 2 },
          data.data.mapValue.fields.from.stringValue === "user"
            ? { marginLeft: 5 }
            : { marginRight: 5 },
        ]}
        resizeMode={"contain"}
      />
      <View
        style={[
          {
            maxWidth: "80%",
            padding: 10,
            borderRadius: 20,
          },
          data.data.mapValue.fields.from.stringValue === "user"
            ? {
                borderTopRightRadius: 0,
                backgroundColor: "#414141",
              }
            : {
                borderTopLeftRadius: 0,
                backgroundColor: "white",
              },
        ]}
      >
        <Text
          style={[
            data.data.mapValue.fields.from.stringValue === "user"
              ? { color: "white" }
              : { color: "black" },
          ]}
        >
          {data.data.mapValue.fields.text.stringValue}
        </Text>
        {data.data.mapValue.fields.from.stringValue === "user" ? (
          <></>
        ) : (
          <View
            style={{
              maxWidth: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 7 }}
              onPress={() =>
                handleSpeaker(data.data.mapValue.fields.text.stringValue)
              }
            >
              <Ionicons
                name={mute ? "volume-mute-outline" : "volume-high-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() =>
                copyToClipboard(data.data.mapValue.fields.text.stringValue)
              }
            >
              <Text style={{ marginRight: 5, color: "gray" }}>Copy</Text>
              <MaterialCommunityIcons
                name="content-copy"
                size={15}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default SavedChat;

const styles = StyleSheet.create({});
