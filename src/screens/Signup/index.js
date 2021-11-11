import React from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform,
  Text,
  Image,
  BackHandler,
  TextInput as NativeTextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import {
  FONT_GOOGLE_BARLOW_REGULAR as FONT_GOOGLE_BARLOW,
  FONT_GOOGLE_BARLOW_REGULAR,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
  FONT_GOOGLE_SANS_BOLD,
} from "../../constants/fonts";
import Icon from "react-native-vector-icons/Feather";
import IoIcon from "react-native-vector-icons/Ionicons";
import { Picker } from "react-native-picker-dropdown";
import { AppStyles } from "../../utility/AppStyles";
import EntIcon from "react-native-vector-icons/Entypo";
import Logo from "../../components/Logo";
import DeviceInfo from "react-native-device-info";
import { connect } from "react-redux";
import { isFieldEmpty, objectLength } from "../../utility";
import {
  CheckBox,
  Button,
  Input as TextInput,
  Overlay,
} from "react-native-elements";
import { Grid, Row, Col } from "react-native-easy-grid";
import AsyncStorage from "@react-native-community/async-storage";
import Header from "../../components/Header";
//import TextInput from '../../components/TextInput';
//import Button from '../../components/Button'
const { width, height } = Dimensions.get("window");
import { TouchableOpacity } from "react-native-gesture-handler";
import { get_country, do_signup } from "./actions";
import { doLogin, get_user_data } from "../Login/actions";
import { itemSkus } from "../../constants/subscriptions";
import RNIap, { purchaseUpdatedListener } from "react-native-iap";
import { postIosReciept } from "../Dashoard/actions";
import messaging, {
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
class Signup extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      isloading: true,
      issubmit: false,
      first_name: "",
      countrycode: "",
      countrycodeid: "",
      cellphone: "",
      password: "",
      country_codes: null,
      label: null,
      counstrycodeOverlay: false,
      ismonthpurchase: false,
      isyearpurchase: false,
      userid: 0,
      token: "",
      //error property
      error_first_name: "",
      error_countrycode: "",
      error_countrycodeid: "",
      error_cellphone: "",
      error_password: "",
      isexist: false,
      timer: 0,
    };
    this.purchaseUpdateSubscription;
    this.purchaseErrorSubscription;
  }
  componentDidMount = async () => {
    let token;
    token = await messaging().getToken();

    // Platform.OS === "ios"
    //   ? (token = await messaging().getToken())
    //   : (token = await messaging().getToken());
    // token = await messaging().getToken();
    console.log("the ios token is", token);
    this.setState({ token: token });
    console.log("Signup", this.props.navigation.state.params.plan);
    this.initConnection();
    // Fires whenever new subscription is purchased
    // this.get_selected_language().then((language) => {
    //   //get_user_data().then(user => {

    //   if (language != null) {

    //     RNIap.getReceiptIOS().then(data => {
    //       console.log("getReceiptIOS", data)
    //       var reciept_data = {
    //         ios_receipt: data,
    //         //  timestamp: purchase.transactionDate,//user.UserId,
    //         userid: "002088",
    //         lang: language.select_lang == 1 ? "en" : "es",
    //         app_os: Platform.OS == "ios" ? "ios" : 'and',
    //       }
    //       console.log("reciept_data", reciept_data)
    //       this.props.postIosReciept(reciept_data).then(() => {
    //         if (this.props.iosReciept.data.ResponseCode == 0) {
    //           console.log("iosReciept", this.props.iosReciept)
    //           Alert.alert(
    //             "",
    //             "Your Subscription Activated Successfully",
    //             [
    //               {
    //                 text: "OK",
    //                 onPress: () => {
    //                  // this.props.navigation.navigate("Profile");
    //                 },
    //               },
    //             ],
    //             { cancelable: false }
    //           );

    //         } else {

    //           Alert.alert(
    //             "",
    //             this.props.iosReciept.data.ResponseMsg,
    //             [
    //               {
    //                 text: "OK",
    //                 onPress: () => {

    //                 },
    //               },
    //             ],
    //             { cancelable: false }
    //           );

    //         }

    //       })
    //       // var recieptbody = {
    //       //   body: data,
    //       //   devMode: true
    //       // }
    //       // RNIap.validateReceiptIos( data,true,55).then(data1 => {
    //       //   console.log("validateReceiptIos", data1)
    //       // })
    //     })
    //   }

    //   //})
    // })

    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        console.log("purchase", purchase);
        //   removeLoading();
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          console.log("receipt", receipt);
          try {
            this.get_selected_language().then((language) => {
              //get_user_data().then(user => {

              if (language != null) {
                RNIap.getReceiptIOS().then((data) => {
                  console.log("getReceiptIOS", data);
                  var reciept_data = {
                    ios_receipt: receipt,
                    //  timestamp: purchase.transactionDate,//user.UserId,
                    userid: this.state.userid,
                    lang: language.select_lang == 1 ? "en" : "es",
                    app_os: Platform.OS == "ios" ? "ios" : "and",
                  };
                  this.props.postIosReciept(reciept_data).then(() => {
                    if (this.props.iosReciept.data.ResponseCode == 0) {
                      Alert.alert(
                        "",
                        "Your Subscription Activated Successfully",
                        [
                          {
                            text: "OK",
                            onPress: () => {
                              this.props.navigation.navigate("Profile");
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      // Alert.alert(
                      //   "",
                      //   this.props.iosReciept.data.ResponseMsg,
                      //   [
                      //     {
                      //       text: "OK",
                      //       onPress: () => {},
                      //     },
                      //   ],
                      //   { cancelable: false }
                      // );
                      console.log("");
                    }
                  });
                  // var recieptbody = {
                  //   body: data,
                  //   devMode: true
                  // }
                  // RNIap.validateReceiptIos( data,true,55).then(data1 => {
                  //   console.log("validateReceiptIos", data1)
                  // })
                });
              }

              //})
            });
            // if (Platform.OS === "ios") {
            //   RNIap.finishTransactionIOS(purchase.transactionId);
            // } else if (Platform.OS === "android") {
            //   // If consumable (can be purchased again)
            //   RNIap.consumePurchaseAndroid(purchase.purchaseToken);
            //   // If not consumable
            //   RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
            // }
            const ackResult = await RNIap.finishTransactionIOS(
              purchase.transactionId
            );
            console.log("ackResult", ackResult);
          } catch (ackErr) {
            console.warn("ackErr", ackErr);
          }

          // this.setState({ receipt }, () => this.goNext());
        }
      }
    );

    // Fires when there is some error in purchase
    this.purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      this.setState({ issubmit: false });
      console.log("purchaseErrorListener", error);
      //Alert.alert("purchase error", JSON.stringify(error));
      //  this.props.navigation.navigate("PaymentFailed");
    });

    var data = {
      do: "GetCountry",
    };
    this.props.get_country(data).then(() => {
      // this.props.navigation.setParams({
      //     labels: this.props.label
      // });

      if (
        this.props.countrycode.data != null &&
        this.props.countrycode.data != undefined
      ) {
        this.setState(
          {
            country_codes: this.props.countrycode.data.data,
            label: this.props.label,
          },
          () => {
            this.setState({
              isloading: false,
              countrycode: this.state.label.placeholder_country,
            });
          }
        );
      }
    });
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  };
  componentWillUnmount() {
    clearInterval(this.clockCall);
  }
  get_selected_language = async () => {
    const loagintype = await AsyncStorage.getItem("language");
    var response = JSON.parse(loagintype);

    return response;
  };

  alreadyPurchasedAlert = () => {
    Alert.alert(
      "Subscription",
      "You have already subscribed !",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  };

  initConnection = async () => {
    // Initialize the connection
    const connection = await RNIap.initConnection();

    Platform.OS === "ios" && (await RNIap.clearProductsIOS());

    // Get the subscription list
    const products = await RNIap.getSubscriptions(itemSkus);

    products.forEach((purchase) => {
      switch (purchase.productId) {
        case "kizbin.monthly.subscription":
          //setMonthlyPrice(purchase.localizedPrice);
          break;

        case "kizbin.yearly.subscription":
          //setYearlyPrice(purchase.localizedPrice);
          const ypm = Math.round(purchase.price / 12);
          //setYearlyPM(ypm);
          break;
      }
    });

    this.userAvailablePurchases();

    // Fetch available purchases
    // const availableProducts = await RNIap.getAvailablePurchases();
    // // console.log("purchase jistory callback", purchaseHistory);
    // console.log("get available products", availableProducts);
    // availableProducts.forEach((purchase) => {
    //   switch (purchase.productId) {
    //     // case "com.sss.kizbin.Kizbin":
    //     //   // restoredTitles.push("Kizbin Monthly Subscription");
    //     //   break;
    //     // case "com.sss.kizbin.yearly":
    //     //   // restoredTitles.push("Kizbin Yearly Subscription");
    //     //   break;
    //     case "com.sss.kizbin.Kizbin":
    //       setMonthlySub(true);
    //       break;
    //     case "com.sss.kizbin.yearly":
    //       setYearlySub(true);
    //       break;
    //   }
    // });
    //setIsLoading(false);
  };
  userAvailablePurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      let restoredTitles = [];

      purchases.forEach((purchase) => {
        console.log("purchase", purchase);
        if (Platform.OS) {
          switch (purchase.productId) {
            // case "com.sss.kizbin.Kizbin":
            //   restoredTitles.push("Kizbin Monthly Subscription");
            //   break;

            // case "com.sss.kizbin.yearly":
            //   restoredTitles.push("Kizbin Yearly Subscription");
            //   break;

            case "kizbin.monthly.subscription":
              //setMonthlySub(true);
              this.setState({ ismonthpurchase: true });
              restoredTitles.push("Kizbin Monthly Subscription");
              break;

            case "kizbin.yearly.subscription":
              //setYearlySub(true);
              this.setState({ isyearpurchase: true });
              restoredTitles.push("Kizbin Yearly Subscription");
              break;
          }
        } else {
          switch (purchase.productId) {
            // case "com.sss.kizbin.Kizbin":
            //   restoredTitles.push("Kizbin Monthly Subscription");
            //   break;

            // case "com.sss.kizbin.yearly":
            //   restoredTitles.push("Kizbin Yearly Subscription");
            //   break;

            case "com.kizbin.monthly.subscription":
              //setMonthlySub(true);
              this.setState({ ismonthpurchase: true });
              restoredTitles.push("Kizbin Monthly Subscription");
              break;

            case "android.test.purchased":
              //setYearlySub(true);
              this.setState({ isyearpurchase: true });
              restoredTitles.push("Kizbin Yearly Subscription");
              break;
          }
        }
      });

      return restoredTitles;

      // if (restoredTitles.length === 0) {
      //   Alert.alert("Restore", "There were no products available for restore");
      // } else {
      //   Alert.alert(
      //     "Restore Successful",
      //     "You successfully restored the following purchases: " +
      //       restoredTitles.join(", ")
      //   );
      // }
      // return restoredTitles;
    } catch (error) {
      console.warn(error); // standardized err.code and err.message available
      if (error && error.message) {
        Alert.alert(error.message);
      }
    }
  };
  purchaseMonthly = async () => {
    RNIap.requestSubscription("com.kizbin.monthly.subscription");

    this.setState({ issubmit: false });
  };
  purchaseYearly = async () => {
    this.state.ismonthpurchase
      ? this.alreadyPurchasedAlert()
      : Platform.OS === "ios"
        ? await RNIap.requestPurchase("kizbin.yearly.subscription").then(
          (data) => {
            console.log("requestPurchase", data);
          }
        )
        : RNIap.requestSubscription("com.kizbin.monthly.subscription").then(
          (data) => {
            console.log("requestPurchase", data);
          }
        );
    this.setState({ issubmit: false });
  };

  decrementClock = () => {
    if (this.state.isloading == true) {
      this.setState(
        (prevstate) => ({ timer: prevstate.timer + 1 }),
        () => {
          if (
            this.state.timer == 15 ||
            this.state.timer == 30 ||
            this.state.timer == 45
          ) {
            const lables = this.props.label;
            Alert.alert(
              "",
              lables.error_msg,
              [
                {
                  text: lables.int_option1,
                  onPress: () => {
                    BackHandler.exitApp();
                  },
                },

                {
                  text: lables.int_option2,
                  onPress: () => {
                    var labels = this.props.label;

                    this.get_user_data().then((data) => {
                      this.setState({ user_data: data, quantity: "0" }, () => {
                        this.setState({ isloading: false });
                      });
                    });
                  },
                },
              ],
              { cancelable: false }
            );
          }
        }
      );
    }
  };
  signup = () => {
    const labels = this.state.label;
    if (
      isFieldEmpty(this.state.first_name) == true ||
      isFieldEmpty(this.state.cellphone) == true ||
      isFieldEmpty(this.state.password) == true ||
      isFieldEmpty(this.state.countrycodeid) == true
    ) {
      this.setState({ issubmit: false });
      if (isFieldEmpty(this.state.first_name) == true) {
        this.setState({ error_first_name: labels.error_first_name_msg });
      } else {
        this.setState({ error_first_name: "" });
      }
      if (isFieldEmpty(this.state.cellphone) == true) {
        this.setState({ error_cellphone: labels.error_cellphone_msg });
      } else {
        this.setState({ error_cellphone: "" });
      }
      if (isFieldEmpty(this.state.password) == true) {
        this.setState({ error_password: labels.error_password_msg });
      } else {
        this.setState({ error_password: "" });
      }
      if (isFieldEmpty(this.state.countrycodeid) == true) {
        this.setState({ error_countrycodeid: labels.error_country_code_msg });
      } else {
        this.setState({ error_countrycodeid: "" });
      }
    } else {
      this.setState({ issubmit: true }, () => {
        var isvalid = [];
        if (isFieldEmpty(this.state.first_name) == true) {
          this.setState({ error_first_name: labels.error_first_name_msg });
          isvalid.push(false);
        } else {
          this.setState({ error_first_name: "" });
          isvalid.push(true);
        }
        if (isFieldEmpty(this.state.cellphone) == true) {
          this.setState({ error_cellphone: labels.error_cellphone_msg });
          isvalid.push(false);
        } else {
          this.setState({ error_cellphone: "" });
          isvalid.push(true);
        }
        if (isFieldEmpty(this.state.password) == true) {
          this.setState({ error_password: labels.error_password_msg });
          isvalid.push(false);
        } else {
          this.setState({ error_password: "" });
          isvalid.push(true);
        }
        if (isFieldEmpty(this.state.countrycodeid) == true) {
          this.setState({ error_countrycodeid: labels.error_country_code_msg });
          isvalid.push(false);
        } else {
          this.setState({ error_countrycodeid: "" });
          isvalid.push(true);
        }
        if (isvalid.includes(false) != true) {
          var data = {
            do: "createuser",
            firstname: this.state.first_name,
            password: this.state.password,
            country: this.state.countrycodeid,
            cellphone: this.state.cellphone,
            token: this.state.token,
            osname: Platform.OS === "android" ? "and" : "ios",
            device_id: DeviceInfo.getUniqueId(),
          };
          console.log("data before signup", this.props);
          this.props.do_signup(data).then(() => {
            if (this.props.signup.data.ResponseCode == 1) {
              var getUserData = {
                do: "getuser",
                userid: this.props.signup.data.userid,
              };
              this.props.get_user_data(getUserData).then(() => {
                this.store_user_data(this.props.user_data.data);
                this.store_logintype(this.props.user_data.data);
                var data = {
                  plan: this.props.navigation.state.params.plan,
                  userid: this.props.signup.data.userid,
                };
                var data = {
                  do: "Login",
                  username: this.props.signup.data.username,
                  password: this.state.password,
                  token: this.state.token,
                  osname: Platform.OS,
                  device_id: DeviceInfo.getUniqueId(),
                };
                this.props.doLogin(data).then(() => {
                  this.props.navigation.navigate("SubsCriptionExpiration", {
                    fromLogin: true,
                  });
                });
                // rana comment
                // this.setState({ userid: this.props.signup.data.userid }, () => {
                //   if (this.props.navigation.state.params.plan == 1) {
                //     this.purchaseMonthly();
                //   } else {
                //     this.purchaseYearly();
                //   }
                // });
                // this.props.navigation.navigate("Profile");
                // this.props.navigation.navigate("SubsCriptionExpiration", { data });
              });
            } else if (this.props.signup.data.ResponseCode == 2) {
              this.setState({ isexist: true, issubmit: false });
            } else {
              alert("Something went wrong");
            }
          });
        }
      });
    }
  };
  store_logintype = async (logintype) => {
    try {
      await AsyncStorage.setItem("logintype", JSON.stringify(logintype));
    } catch (e) {
      // saving error
    }
  };
  store_user_data = async (data) => {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(data));
    } catch (e) {
      // saving error
    }
  };
  showshowcountrycode = () => {
    this.setState({ counstrycodeOverlay: true });
  };
  toggleOverlay = () => {
    this.setState({ counstrycodeOverlay: false });
  };
  render() {
    if (this.state.isloading) {
      return (
        <ImageBackground
          source={require("../../assets/bg-Blue.jpg")}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </ImageBackground>
      );
    } else {
      const labels = this.state.label;
      var textcolor = "";
      if (
        this.state.countrycode == "Cellular country code" ||
        this.state.countrycode == "código de país"
      ) {
        textcolor = "#0f3e53";
      } else {
        textcolor = "black";
      }
      return (
        <ImageBackground
          source={require("../../assets/bg-Blue.jpg")}
          resizeMode={"stretch"}
          style={{ width: "100%", height: "100%" }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <ScrollView
              keyboardShouldPersistTaps={"always"}
              contentContainerStyle={style.container}
            >
              <Logo />
              <View
                style={{
                  width: (Dimensions.get("screen").width / 100) * 80,
                  marginTop: (Dimensions.get("screen").height / 100) * 3,
                }}
              >
                <View
                  style={[
                    style.drop1,
                    {
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 20,
                      borderBottomColor:
                        this.state.error_first_name != "" ? "red" : "#b4b4b4",
                    },
                  ]}
                >
                  <NativeTextInput
                    value={this.state.first_name}
                    style={[style.extrainput, { width: "90%" }]}
                    placeholder={labels.placeholder_firstname}
                    onChangeText={(text) => this.setState({ first_name: text })}
                    placeholderTextColor="black"
                    autoCapitalize="words"
                  />
                  <Icon name="user" size={20} color="#00b8e4" />
                </View>

                <View
                  style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor:
                      this.state.error_countrycodeid != "" ? "red" : "#b4b4b4",
                    marginBottom: 15,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      marginBottom: 10,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                    onPress={() => {
                      this.showshowcountrycode();
                    }}
                  >
                    <Grid style={{ height: 40 }}>
                      <Row>
                        <Col size={90}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: "#000",
                              marginTop: 10,
                              fontFamily:
                                Platform.OS === "android"
                                  ? FONT_GOOGLE_SANS_BOLD
                                  : FONT_GOOGLE_BARLOW_REGULAR,
                            }}
                          >
                            {this.state.countrycode}
                          </Text>
                        </Col>
                        <Col size={10} style={{ justifyContent: "center" }}>
                          <IoIcon
                            name="ios-arrow-down"
                            size={20}
                            color="#00b8e4"
                          />
                        </Col>
                      </Row>
                    </Grid>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    style.drop1,
                    {
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 15,
                      borderBottomColor:
                        this.state.error_cellphone != "" ? "red" : "#b4b4b4",
                    },
                  ]}
                >
                  {this.state.isexist == true ? (
                    <Text style={{ color: "red", fontSize: 13 }}>
                      {labels.isexist}
                    </Text>
                  ) : null}
                  <NativeTextInput
                    value={this.state.cellphone}
                    style={[style.extrainput, { width: "90%" }]}
                    placeholder={labels.placeholder_cellphone}
                    onChangeText={(text) => this.setState({ cellphone: text })}
                    errorText={this.state.erroe_cellphone}
                    placeholderTextColor="black"
                    keyboardType="phone-pad"
                  />
                  <Icon name="phone" size={20} color="#00b8e4" />
                </View>

                <View
                  style={[
                    style.drop1,
                    {
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 20,
                      borderBottomColor:
                        this.state.error_password != "" ? "red" : "#b4b4b4",
                    },
                  ]}
                >
                  <NativeTextInput
                    secureTextEntry={true}
                    value={this.state.password}
                    style={[style.extrainput, { width: "90%" }]}
                    placeholder={labels.placeholder_password}
                    onChangeText={(text) => this.setState({ password: text })}
                    placeholderTextColor="black"
                  />
                  <Icon name="lock" size={20} color="#00b8e4" />
                </View>

                <Button
                  title={labels.submit}
                  loading={this.state.issubmit}
                  titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                  buttonStyle={{ backgroundColor: "#00b8e4" }}
                  containerStyle={{ width: "100%" }}
                  onPress={() => this.signup()}
                />
                {/* Trial Page Button */}
                {/* <Button
                  title="Trial Page"
                  titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                  buttonStyle={{ backgroundColor: "#00b8e4" }}
                  containerStyle={{ width: "100%", marginTop: 10 }}
                  onPress={() => this.props.navigation.navigate("TrialPage")}
                /> */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: (Dimensions.get("screen").height / 100) * 10,
                    marginBottom: (Dimensions.get("screen").height / 100) * 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                    }}
                  >
                    {labels.already}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("Login");
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: "#00b8e4",
                        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                      }}
                    >
                      {labels.loginhere}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Overlay
                overlayStyle={{ width: "70%", padding: 10, height: 450 }}
                isVisible={this.state.counstrycodeOverlay}
                onBackdropPress={this.toggleOverlay}
              >
                <ScrollView keyboardShouldPersistTaps={"always"}>
                  {this.state.iscatloading == true ? (
                    <View style={{ margin: 10 }}>
                      <ActivityIndicator size="small" />
                    </View>
                  ) : (
                      <Grid>
                        {objectLength(this.state.country_codes) != 0
                          ? this.state.country_codes.map((v, i) => {
                            return (
                              <Row style={{ margin: 5 }}>
                                <Col
                                  size={8}
                                  onPress={() => {
                                    this.setState({
                                      countrycodeid: v.id,
                                      countrycode: v.country,
                                      counstrycodeOverlay: false,
                                    });
                                  }}
                                >
                                  <Text>
                                    {v.country}
                                    {" (" + v.dial_code + ")"}
                                  </Text>
                                </Col>
                              </Row>
                            );
                          })
                          : null}
                      </Grid>
                    )}
                </ScrollView>
              </Overlay>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      );
    }
  }
}

const style = StyleSheet.create({
  container: {
    padding: 15,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  drop: {
    width: "100%",
  },
  extrainput: {
    fontFamily:
      Platform.OS === "android"
        ? FONT_GOOGLE_SANS_BOLD
        : FONT_GOOGLE_BARLOW_REGULAR,
    marginBottom: 0,
    height: 50,
    fontSize: 16,
    color: "#0f3e53",
  },
  drop1: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#b4b4b4",
    marginBottom: 25,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    countrycode: state.countrycode,
    signup: state.do_signup,
    user_data: state.user_data,
    iosReciept: state.iosReciept,
  };
};

export default connect(
  mapStateToProps,
  {
    get_country,
    do_signup,
    get_user_data,
    doLogin,
    postIosReciept,
  }
)(Signup);
