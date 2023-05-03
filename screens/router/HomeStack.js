import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Home from "../Home";
import AccountEdit from "../AccountEdit";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import ForgotPassword from "../auth/ForgotPassword";
import { NavigationContainer } from "@react-navigation/native";
import { Image } from "react-native";
import { useStateContext } from "../../context/StateContext";

const HomeStack = () => {
  const Stack = createNativeStackNavigator();
  const { signIn, setSignIn } = useStateContext();
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  useEffect(() => {
    AsyncStorage.getItem("uid").then((data) => {
      //   console.log(data);
      if (data) {
        getDoc(doc(db, "login", data)).then((data) => {
          //   console.log(data);
          signInWithEmailAndPassword(
            auth,
            data._document.data.value.mapValue.fields.email.stringValue,
            data._document.data.value.mapValue.fields.password.stringValue
          ).then((data) => {
            console.log(data);
            setSignIn(true);
          });
        });
      } else {
        setSignIn(false);
      }
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [AsyncStorage]);

  return (
    <NavigationContainer>
      {loading ? (
        <View
          style={{
            backgroundColor: "white",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 50 }}>
            <Image
              resizeMode="contain"
              source={require("../../assets/logo2.png")}
              style={{ height: 150, width: 150 }}
            />
            <Text
              style={{
                fontWeight: "800",
                fontSize: 25,
                letterSpacing: 10,
                marginTop: 10,
              }}
            >
              Friday
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800", fontSize: 15 }}>Powered by</Text>
            <Image
              resizeMode="contain"
              source={require("../../assets/AS-logo.png")}
              style={{ height: 30, width: 30 }}
            />
            <Text style={{ fontWeight: "800", fontSize: 15 }}>
              AS Developer
            </Text>
          </View>
        </View>
      ) : (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          {signIn ? (
            <Stack.Group
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AccountEdit" component={AccountEdit} />
            </Stack.Group>
          ) : (
            <>
              {/* <Stack.Screen name="Loader" component={Loader} /> */}
              <Stack.Group
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
                <Stack.Screen name="SignUp" component={SignUp} />
              </Stack.Group>
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
