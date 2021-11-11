import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
  Platform,
} from "react-native";
import RNIap from "react-native-iap";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import { postIosReciept } from "../Dashoard/actions";
import {
  FONT_GOOGLE_BARLOW_SEMIBOLD,
  FONT_GOOGLE_BARLOW_REGULAR,
} from "../../constants/fonts";
import { itemSkus } from "../../constants/subscriptions";
import InAppBrowser from "react-native-inappbrowser-reborn";
const openInAppBrowser = async (url) => {
  try {
    await InAppBrowser.isAvailable();
    InAppBrowser.open(url, {
      // iOS Properties
      dismissButtonStyle: "cancel",
      preferredBarTintColor: "white",
      preferredControlTintColor: "black",
      // Android Properties
      showTitle: true,
      toolbarColor: "#000000",
      secondaryToolbarColor: "black",
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: true,
    }).then((result) => {
      //   Alert.alert(JSON.stringify(result))
    });
  } catch (error) {
    // Alert.alert(error.message)
  }
};

const Plans = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const [quarterlyLoading, setQuaterlyLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [monthlySub, setMonthlySub] = useState(false);
  const [yearlySub, setYearlySub] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState(null);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [yearlyPM, setYearlyPM] = useState(0);
  const [quaterly, setQuaterly] = useState(0);
  useEffect(() => {
    // alert("rana");
    // setIsLoading(true);
    // initConnection();
  }, []);
  const openUrl = (url) => {
    openInAppBrowser(url);
  };
  const initConnection = async () => {
    // Initialize the connection
    const connection = await RNIap.initConnection();

    Platform.OS === "ios" && (await RNIap.clearProductsIOS());

    // Get the subscription list
    const products = await RNIap.getSubscriptions(itemSkus);
    console.log("products", products);
    products.forEach((purchase) => {
      if (Platform.OS == "ios") {
        switch (purchase.productId) {
          case "com.kizbin.monthly.subscription":
            setMonthlyPrice(purchase.localizedPrice);
            break;

          case "com.kizbin.yearly.subscription":
            setYearlyPrice(purchase.localizedPrice);
            const ypm = Math.round(purchase.price / 12);
            setYearlyPM(ypm);
            break;
        }
      } else {
        switch (purchase.productId) {
          case "com.kizbin.monthly.subscription":
            setMonthlyPrice(purchase.localizedPrice);
            break;

          case "com.kizbin.yearly.subscription":
            setYearlyPrice(purchase.localizedPrice);
            const ypm = Math.round(purchase.price / 12);
            setYearlyPM(ypm);
            break;
        }
      }
    });

    userAvailablePurchases();

    setIsLoading(false);
  };

  // Get Available Purchases of the user
  const userAvailablePurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      let restoredTitles = [];

      purchases.forEach((purchase) => {
        console.log("purchase", purchase);
        switch (purchase.productId) {
          case "kizbin.monthly.subscription":
            setMonthlySub(true);
            restoredTitles.push("Kizbin Monthly Subscription");
            break;

          case "kizbin.yearly.subscription":
            setYearlySub(true);
            restoredTitles.push("Kizbin Yearly Subscription");
            break;
        }
      });

      return restoredTitles;
    } catch (error) {
      console.warn(error); // standardized err.code and err.message available
      if (error && error.message) {
        Alert.alert(error.message);
      }
    }
  };
  var labels = props.label;
  return (
    <ImageBackground
      source={require("../../assets/bg-Blue.jpg")}
      style={{ width: "100%", height: "100%", resizeMode: "cover" }}
    >
      <SafeAreaView>
        {/* <Image
            source={require("../../assets/logo.png")}
            style={{ height: 250, width: 250 }}
          /> */}
        <ScrollView
          keyboardShouldPersistTaps={"always"}
          contentContainerStyle={styles.container}
        >
          {isLoading ? (
            <View
              style={[styles.center, { flex: 1, opacity: 0.5, marginTop: 100 }]}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={styles.expirationMsgBox}>
              <Image
                source={require("../../assets/logo.png")}
                style={{ height: 250, width: 250 }}
              />
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("Login");
                }}
                style={styles.expirationMsgBtn}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  {labels.have_not}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("Signup", { plan: 1 });
                }}
              >
                <Text style={styles.expirationMsg}>{labels.NoAccount}</Text>
              </TouchableOpacity>
              {/* <Text
                style={{ ...styles.expirationMsg, color: "red", fontSize: 25 }}
              >
                {labels.trail30}
              </Text>
              <Text style={{ ...styles.expirationMsg, fontSize: 16 }}>
                {labels.cancelsubs}
              </Text> */}

              {/* Monthly Subscription */}
              {/* <TouchableOpacity
                style={styles.subscriptionButton}
                onPress={() => {
                  props.navigation.navigate("Signup", { plan: 1 });
                }}
              >
                <Text style={styles.subscriptionText}>
                  {monthlyPrice} / {labels.month}
                </Text>
              </TouchableOpacity> */}

              {/* <Text
                style={{
                  color: "red",
                  alignSelf: "center",
                  //  marginTop: 35,
                  fontSize: 18,
                  fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                }}
              >
                {labels.save}
              </Text> */}

              {/* Yearly Subscription */}
              {/* <TouchableOpacity
                style={{
                  ...styles.subscriptionButton,
                  //height: 90,
                  //marginTop: 15,
                }}
                onPress={() => {
                  props.navigation.navigate("Signup", { plan: 2 });
                }}
              >
                <Text style={styles.subscriptionText}>
                  {yearlyPrice} / {labels.year}
                </Text>

                <Text style={styles.subscriptionSubText}>
                  (12 months at {yearlyPM}/mo)
                </Text>
              </TouchableOpacity> */}

              {/* <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: 15,
                  textAlign: "justify",
                  marginBottom: 10,
                }}
              >
                {labels.flowdesc1}
              </Text> */}
              {/* <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: 15,
                  textAlign: "justify",
                  marginBottom: 10,
                }}
              >
                {labels.flowdesc2}
              </Text> */}
              {/* <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: 15,
                  textAlign: "justify",
                  marginBottom: 10,
                }}
              >
                {labels.flowdesc3}
              </Text> */}
              {/* <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: 15,
                  textAlign: "justify",
                }}
              >
                {labels.flowdesc4}
              </Text> */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                {/* <View style={{ width: "50%", alignItems: "center" }}> */}
                <View style={{ width: "50%", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() =>
                      openUrl("https://kizbin.com/terms_and_conditions.php")
                    }
                  >
                    <Text
                      style={{
                        ...styles.subscriptionText,
                        textAlign: "center",
                        color: "blue",
                        fontSize: 14,
                        // textAlign: "justify",
                      }}
                    >
                      {labels.terms}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() =>
                      openUrl("https://kizbin.com/privacy_policy.php")
                    }
                  >
                    <Text
                      style={{
                        ...styles.subscriptionText,
                        textAlign: "center",
                        color: "blue",
                        fontSize: 14,
                        // textAlign: "justify",
                      }}
                    >
                      {labels.privacy}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container1: {
    paddingLeft: 15,
    paddingRight: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  expirationMsgBox: {
    width: Dimensions.get("window").width - 80,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  expirationMsgBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    textAlign: "center",
    marginTop: 30,
    backgroundColor: "green",
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
    color: "#fff",
    borderRadius: 10,
  },
  expirationMsg: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    textAlign: "center",
    marginTop: 30,

    fontSize: 20,
    borderRadius: 10,
  },
  subscriptionButton: {
    backgroundColor: "#2e75b6",
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  subscriptionText: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: FONT_GOOGLE_BARLOW_REGULAR,
  },
  subscriptionSubText: {
    color: "#ffffff",
    fontFamily: FONT_GOOGLE_BARLOW_REGULAR,
    marginTop: 5,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
  };
};

export default connect(
  mapStateToProps,
  {}
)(Plans);
