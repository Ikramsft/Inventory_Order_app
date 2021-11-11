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
  Alert,
  Linking,
  Platform,
  BackHandler,
  AppState,
} from "react-native";
import RNIap from "react-native-iap";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import { postIosReciept, verifyReciept } from "../Dashoard/actions";
import { english, spanish } from "../../constants/languages";
import InAppBrowser from "react-native-inappbrowser-reborn";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// Constants
import {
  FONT_GOOGLE_BARLOW_SEMIBOLD,
  FONT_GOOGLE_BARLOW_REGULAR,
} from "../../constants/fonts";
import { itemSkus } from "../../constants/subscriptions";
import { get_user_data } from "../Login/actions";
import { color } from "react-native-reanimated";

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
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

const SubscriptionExpiration = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fromLogin, setFromLogin] = useState(
    props.navigation.state.params?.fromLogin
  );
  const openUrl = (url) => {
    openInAppBrowser(url);
  };
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const [quarterlyLoading, setQuaterlyLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [currency, setCurrency] = useState("");

  const [monthlySub, setMonthlySub] = useState(false);
  const [yearlySub, setYearlySub] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState(null);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [yearlyPM, setYearlyPM] = useState(0);
  const [quaterly, setQuaterly] = useState(0);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (newState) => {
    if (newState === "active") {
      checkSubscriptionStatus();
    }
  };

  const checkSubscriptionStatus = async () => {
    get_user_data().then((user) => {
      if (user && user.UserName) {
        props.verifyReciept({ username: user.UserName });
        setTimeout(() => {
          if (
            props.verifyRecieptState.verifyRecieptCallback &&
            props.verifyRecieptState.isSubscriber
          ) {
            if (user?.CompanyName?.length > 1) {
              props.navigation.navigate("Dashboard");
            } else {
              // Checking if user have active subscriptions
              props.navigation.navigate("Profile");
            }
            // return true;
          } else {
            // props.navigation.navigate("SubsCriptionExpiration", {
            //   fromLogin: true,
            // });
            // return false;
          }
        }, 3000);
      }
    });
  };
  useEffect(() => {
    setIsLoading(true);
    initConnection();
    // Fires whenever new subscription is purchased
    var purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log("purchase", purchase);
        removeLoading();
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          console.log("receipt", receipt);
          try {
            get_user_data().then((user) => {
              var reciept_data;

              if (Platform.OS == "ios") {
                reciept_data = {
                  userid: user.UserId,
                  receipt: JSON.stringify(purchase),
                  productId: purchase.productId,
                  purchaseTime: purchase.productId, //user.UserId,
                  purchaseToken: purchase.transactionReceipt,
                  lang: "en",
                  username: user.UserName,
                  app_os: "ios",
                };
              } else {
                reciept_data = {
                  userid: user.UserId,
                  receipt: receipt,
                  productId: purchase.productId,
                  purchaseTime: purchase.productId, //user.UserId,
                  purchaseToken: purchase.purchaseToken,
                  lang: "en",
                  username: user.UserName,
                  app_os: Platform.OS == "ios" ? "ios" : "android",
                };
              }

              props.postIosReciept(reciept_data).then(() => {
                console.log("iosReciept", props.iosReciept);
              });
            });

            if (Platform.OS === "ios") {
              RNIap.finishTransactionIOS(purchase.transactionId);
            } else {
              RNIap.finishTransaction(purchase);
            }
            props.navigation.navigate("Profile");
          } catch (ackErr) {
            console.warn("ackErr", ackErr);
          }

          // this.setState({ receipt }, () => this.goNext());
        }
      }
    );

    // Fires when there is some error in purchase
    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      removeLoading();
      // tested in android
      if (error.code === "E_ALREADY_OWNED") {
        Alert.alert(
          "Alert Title",
          "You already owned this product please use linked account to login",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      }
      //Alert.alert("purchase error", JSON.stringify(error));
      // props.navigation.navigate("PaymentFailed");
    });

    // Cleanup for the purchases
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
    };
  }, []);
  const get_selected_language = async () => {
    const loagintype = await AsyncStorage.getItem("language");
    var response = JSON.parse(loagintype);
    return response;
  };
  const get_user_data = async () => {
    const user_data = await AsyncStorage.getItem("user_data");

    var response = JSON.parse(user_data);
    return response;
  };
  const initConnection = async () => {
    // Initialize the connection
    const connection = await RNIap.initConnection();

    Platform.OS === "ios" && (await RNIap.clearProductsIOS());

    // Get the subscription list
    const products = await RNIap.getSubscriptions(itemSkus);
    products.forEach((purchase) => {
      switch (purchase.productId) {
        case "com.kizbin.monthly.subscription":
          setCurrency(purchase.currency);
          setMonthlyPrice(purchase.localizedPrice);
          break;

        case "com.kizbin.yearly.subscription":
          setYearlyPrice(purchase.localizedPrice);
          const ypm = Math.round(purchase.price / 12);
          setYearlyPM(ypm);
          break;
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

  const restoreAlert = (restoredTitles) => {
    if (restoredTitles.length === 0) {
      Alert.alert("Restore", "There were no products available for restore");
    } else {
      Alert.alert(
        "Restore Successful",
        "You successfully restored the following purchases: " +
          restoredTitles.join(", ")
      );
    }
  };

  const removeLoading = () => {
    setMonthlyLoading(false);
    setYearlyLoading(false);
    setRestoreLoading(false);
  };

  const alreadyPurchasedAlert = () => {
    Alert.alert(
      "Subscription",
      "You have already subscribed !",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  };
  var labels = props.label;
  return (
    <ImageBackground
      source={require("../../assets/bg-Blue.jpg")}
      style={{ width: "100%", height: "100%", resizeMode: "cover" }}
    >
      <SafeAreaView>
        <ScrollView>
          {isLoading ? (
            <View
              style={[
                styles.center,
                { flex: 1, opacity: 0.5, marginTop: hp(1) },
              ]}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={styles.expirationMsgBox}>
              {!fromLogin && (
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
              )}
              {!fromLogin && (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("Signup");
                  }}
                >
                  <Text style={styles.expirationMsg}>{labels.NoAccount}</Text>
                </TouchableOpacity>
              )}

              <Text
                style={{
                  ...styles.expirationMsg,
                  color: "red",
                  // fontSize: hp(3.5),
                  fontSize: Platform.OS === "android" ? hp(3.5) : wp(7),
                }}
              >
                {labels.trail30}
              </Text>
              <Text
                style={{
                  ...styles.expirationMsg,
                  // fontSize: hp(2.5),
                  marginBottom: Platform.OS === "android" ? hp(0) : hp(1.5),
                  fontSize: Platform.OS === "android" ? hp(2) : wp(5),
                }}
              >
                {labels.cancelsubs}
              </Text>

              {restoreMsg && (
                <Text style={{ ...styles.expirationMsg, fontSize: hp(1) }}>
                  {restoreMsg}
                </Text>
              )}

              {/* Monthly Subscription */}
              <TouchableOpacity
                style={styles.subscriptionButton}
                onPress={async () => {
                  RNIap.requestSubscription("com.kizbin.monthly.subscription");
                }}
              >
                {monthlyLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={styles.subscriptionText}>
                    {monthlySub
                      ? `✓ Subscribed ${monthlyPrice} / ${labels.month}`
                      : `${labels.subscribeFor} ${monthlyPrice} / ${
                          labels.month
                        }`}
                  </Text>
                )}
              </TouchableOpacity>

              <Text
                style={{
                  color: "red",
                  alignSelf: "center",
                  marginVertical: Platform.OS === "android" ? hp(0) : hp(0.5),
                  // fontSize: hp(2.5),
                  fontSize: Platform.OS === "android" ? hp(2.5) : wp(5),
                  fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                }}
              >
                {labels.save}
              </Text>

              {/* Yearly Subscription */}
              <TouchableOpacity
                style={{
                  ...styles.subscriptionButton,
                  //height: 90,
                  //marginTop: 15,
                }}
                onPress={async () => {
                  RNIap.requestSubscription("com.kizbin.yearly.subscription");
                }}
              >
                {yearlyLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <>
                    {yearlySub ? (
                      <>
                        <Text style={styles.subscriptionText}>
                          {" "}
                          ✓ ${labels.subscribeFor} {yearlyPrice} / {labels.year}
                        </Text>
                        <Text style={styles.subscriptionSubText}>
                          (12 months at {currency} {yearlyPM}/mo)
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.subscriptionText}>
                          {labels.subscribeFor} {yearlyPrice} / Year
                        </Text>
                        <Text style={styles.subscriptionSubText}>
                          (12 months at {currency} {yearlyPM}/mo)
                        </Text>
                      </>
                    )}
                  </>
                )}
              </TouchableOpacity>

              <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  // fontSize: Platform.OS === "android" ? 15 : hp(3),
                  fontSize: Platform.OS === "android" ? hp(2) : wp(4.5),
                  textAlign: "justify",
                  marginTop: Platform.OS === "android" ? hp(0) : hp(2),
                  marginBottom: Platform.OS === "android" ? hp(1) : hp(2),
                }}
              >
                {labels.flowdesc1}
              </Text>
              <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: Platform.OS === "android" ? hp(2) : wp(4.5),
                  // fontSize: Platform.OS === "android" ? 15 : 20,
                  textAlign: "justify",
                  // marginBottom: hp(1),
                  marginBottom: Platform.OS === "android" ? hp(1) : wp(2),
                }}
              >
                {labels.flowdesc2}
              </Text>
              <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: Platform.OS === "android" ? hp(2) : wp(4.5),
                  // fontSize: Platform.OS === "android" ? 15 : 20,
                  textAlign: "justify",
                  marginBottom: Platform.OS === "android" ? hp(1) : wp(2),
                }}
              >
                {labels.flowdesc3}
              </Text>
              <Text
                style={{
                  ...styles.subscriptionText,
                  color: "#000",
                  fontSize: Platform.OS === "android" ? hp(2) : wp(4.5),
                  // fontSize: Platform.OS === "android" ? 15 : 20,
                  textAlign: "justify",
                  marginBottom: Platform.OS === "android" ? hp(1) : wp(2),
                  // marginBottom: Platform.OS === "android" ? 10 : 15,
                }}
              >
                {labels.flowdesc4}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginVertical: hp(2.5),
                  // marginTop: 20,
                  // marginBottom: 15,
                }}
              >
                <View style={{ flex: 1 }}>
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
                        // fontSize: hp(2),
                        fontSize: 16,
                        // textAlign: "justify",
                      }}
                    >
                      {labels.terms}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
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
                        // fontSize: hp(2),
                        fontSize: 16,
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
  expirationMsgBox: {
    width: Dimensions.get("window").width - 80,
    alignSelf: "center",
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
    marginTop: hp(3),

    fontSize: hp(2),
    borderRadius: hp(1),
  },
  subscriptionButton: {
    backgroundColor: "#2e75b6",
    marginVertical: hp(1.8),
    // marginTop: Platform.OS === "android" ? 15 : 18,
    // marginBottom: Platform.OS === "android" ? 15 : 18,
    paddingVertical: hp(1),
    // height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(1),
  },
  subscriptionText: {
    fontSize: Platform.OS === "android" ? hp(2.5) : wp(5),
    // fontSize: hp(2.5),
    color: "#ffffff",
    fontFamily: FONT_GOOGLE_BARLOW_REGULAR,
    textAlign: "center",
    marginBottom: hp(0.5),
  },
  subscriptionSubText: {
    color: "#ffffff",
    fontFamily: FONT_GOOGLE_BARLOW_REGULAR,
    marginTop: hp(1),
    marginBottom: hp(1),
    // marginTop: Platform.OS === "android" ? 5 : 10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    user_data: state.user_data,
    verifyRecieptState: state.verifyRecieptState,
    verifyReciept: state.verifyReciept,
    iosReciept: state.iosReciept,
  };
};

export default connect(
  mapStateToProps,
  {
    get_user_data,
    postIosReciept,
    verifyReciept,
  }
)(SubscriptionExpiration);
