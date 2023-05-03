// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
// import { onAuthStateChanged } from "firebase/auth";
import StateContext from "./context/StateContext";
import SignIn from "./screens/auth/SignIn";
import ForgotPassword from "./screens/auth/ForgotPassword";
import SignUp from "./screens/auth/SignUp";
import { SafeAreaView } from "react-native-safe-area-context";
// import { auth } from "./firebaseConfig";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
// import { auth } from "./firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import AccountEdit from "./screens/AccountEdit";
import HomeStack from "./screens/router/HomeStack";
export default function App() {
  return (
    <>
      <StateContext>
        <SafeAreaView style={{ flex: 1 }}>
          <HomeStack />
        </SafeAreaView>
      </StateContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
