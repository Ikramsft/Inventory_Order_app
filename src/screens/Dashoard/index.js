import React from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  ImageBackground,
  Dimensions,
  Button,
  Platform,
  Share,
  Linking,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
  AppState,
} from "react-native";
import {
  FONT_GOOGLE_BARLOW_REGULAR,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
} from "../../constants/fonts";

//import Modal from 'react-native-modal';
import { AppStyles } from "../../utility/AppStyles";
// import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { connect } from "react-redux";
import { isFieldEmpty, objectLength, capitalize } from "../../utility";

import {
  getDahboarddata,
  getoustckdata,
  getalerts,
  postIosReciept,
} from "./actions";
import { select_lang } from "../Language/actions";
import AsyncStorage from "@react-native-community/async-storage";
const { width, height } = Dimensions.get("window");
import EviIcon from "react-native-vector-icons/EvilIcons";
import FontIcon from "react-native-vector-icons/FontAwesome";
import FontisoIcon from "react-native-vector-icons/Fontisto";
import AntIcon from "react-native-vector-icons/AntDesign";
import FoundIcon from "react-native-vector-icons/Foundation";
import FearIcon from "react-native-vector-icons/Feather";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Divider, ListItem, Overlay } from "react-native-elements";
import { english, spanish } from "../../constants/languages";
import Collapsable from "../SearchInventory/Collapsable";
import NotificationPopup from "react-native-push-notification-popup";
import DeviceInfo from "react-native-device-info";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import DropdownAlert from "react-native-dropdownalert";
import messaging from "@react-native-firebase/messaging";
import { WebView } from "react-native-webview";
import InAppBrowser from "react-native-inappbrowser-reborn";
import RNIap from "react-native-iap";
import { verifyReciept } from "../Dashoard/actions";
// Actions
import { logout } from "../Language/actions";

class LoginScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.createNotificationListener();
    this.refeshMethod = this.loaddata.bind(this);
    this.state = {
      isloading: true,
      setLoading: true,
      ismodelvisible: false,
      isoutstock: true,
      user_data: null,
      dash_data: null,
      isenglish: true,
      outstockdata: null,
      isModalVisible: false,
      iscreateorder: false,
      Current_Page: 0,
      logintype: null,
      subscriptionoverlay: false,
      isalertload: false,
      notifications: [],
      Current_PageF_Noti: 1,
      websiteurl: "",
      url: "https://www.kizbin.com",
      statusBarStyle: "dark-content",
      timer: 0,
      appState: AppState.currentState,
    };
  }
  onEndReachedCalledDuringMomentum = true;
  onEndReachedCalledDuringMomentumNoti = true;
  purchaseUpdateSubscription = null;
  componentDidMount = async () => {
    if (!this.props.navigation) throw "I need props.navigation";
    const thisRoute = this.props.navigation.state.routeName;
    this.props.navigation.addListener("willFocus", (payload) => {
      if (payload.state.routeName == "Dashboard") {
        this.setState({ setLoading: true });
        this.get_selected_language().then((lang) => {
          if (lang != null) {
            if (lang.select_lang == 1) {
              this.setState({ isenglish: true });
            } else {
              this.setState({ isenglish: false });
            }
          }
        });
        this.get_user_data().then((data) => {
          this.setState({ user_data: data }, () => {
            this.get_logintype().then((response) => {
              this.loaddata();
              // if (response != null)

              this.setState({ logintype: response }, () => {
                this.setState({ setLoading: false });
              });
            });
          });
        });

        Linking.addEventListener("url", this.handleOpenURL);
        this.clockCall = setInterval(() => {
          this.decrementClock();
        }, 1000);

        // Checking if user have active subscriptions
        // const connection = await RNIap.initConnection();
        // Platform.OS === "ios" && (await RNIap.clearProductsIOS());
        // const purchases = await RNIap.getAvailablePurchases();

        // this.userAvailablePurchases()
        // Fires whenever new subscription is purchased
        // this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        //   async (purchase) => {
        //     const receipt = purchase.transactionReceipt;
        //     if (receipt) {
        //       try {
        //         // if (Platform.OS === "ios") {
        //         //   RNIap.finishTransactionIOS(purchase.transactionId);
        //         // } else if (Platform.OS === "android") {
        //         //   // If consumable (can be purchased again)
        //         //   RNIap.consumePurchaseAndroid(purchase.purchaseToken);
        //         //   // If not consumable
        //         //   RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
        //         // }
        //         const ackResult = await RNIap.finishTransactionIOS(
        //           purchase.transactionId
        //         );
        //         //props.navigation.navigate("Login");
        //       } catch (ackErr) {
        //         console.warn("ackErr", ackErr);
        //       }

        //       // this.setState({ receipt }, () => this.goNext());
        //     }
        //   }
        // );

        //console.log("getReceiptIOS", test)
        //console.log("purchases", purchases)
        // if (purchases.length == 0) {
        //   var data = {
        //     do: "Logout",
        //     userid: this.state.user_data.UserId,
        //     token: "device_token",
        //   };
        //   this.props.logout(data).then(() => {
        //    // this.store_logintype(null);
        //     //this.store_user_data(null);
        //    // AsyncStorage.clear();
        //     this.props.navigation.navigate("SubsCriptionExpiration");
        //   });
        // } else {
        //   this.setState({ setLoading: false });
        // }
      }
    });
    AppState.addEventListener("change", this._handleAppStateChange);
  };

  userAvailablePurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      let restoredTitles = [];

      purchases.forEach((purchase) => {
        // console.log("purchase", purchase)
        switch (purchase.productId) {
          // case "com.sss.kizbin.Kizbin":
          //   restoredTitles.push("Kizbin Monthly Subscription");
          //   break;

          // case "com.sss.kizbin.yearly":
          //   restoredTitles.push("Kizbin Yearly Subscription");
          //   break;

          case "kizbin.monthly.subscription":
            //setMonthlySub(true);
            restoredTitles.push("Kizbin Monthly Subscription");
            break;

          case "kizbin.yearly.subscription":
            // setYearlySub(true);
            restoredTitles.push("Kizbin Yearly Subscription");
            break;
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

  checkSubscriptionStatus = async () => {
    let token = await messaging().getToken();
    this.get_user_data().then((user) => {
      if (user && user.UserName) {
        this.props.verifyReciept({
          username: user.UserName,
          osname: Platform.OS,
          token: token,
          device_id: DeviceInfo.getUniqueId(),
        });
        setTimeout(() => {
          if (
            this.props.verifyRecieptState.verifyRecieptCallback &&
            this.props.verifyRecieptState.isSubscriber
          ) {
            return true;
          } else {
            this.props.navigation.navigate("SubsCriptionExpiration", {
              fromLogin: true,
            });
            return false;
          }
        }, 2000);
      }
    });
  };

  _handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "active") {
      await this.checkSubscriptionStatus();
    }
    this.setState({ appState: nextAppState });
  };
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    Linking.removeEventListener("url", this.handleOpenURL);
    clearInterval(this.clockCall);
  }
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
                   // this.props.navigation.navigate("Dashboard")
                  },
                },

                {
                  text: lables.int_option2,
                  onPress: () => {
                    this.get_user_data().then((data) => {
                      this.setState({ user_data: data }, () => {
                        this.get_logintype().then((response) => {
                          this.loaddata();
                          // if (response != null)
                          this.setState({ logintype: response });
                        });
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
  handleOpenURL = (event) => {
    this.props.navigation.navigate("Orders");
  };
  createNotificationListener = async () => {
    this.notificationListener = messaging().onMessage((notification) => {
     

      if (this.dropDownAlertRef != null && this.dropDownAlertRef != undefined) {
        this.dropDownAlertRef.alertWithType(
          "success",
          notification.notification.title,
          notification.notification.body
        );
      }
    });

    this.notificationOpen = messaging().onNotificationOpenedApp(
      (notificationOpen) => {
        var data = null;
        if (Platform.OS == "android") {
          data = notificationOpen.notification;
        } else {
          data = notificationOpen.notification;
        }
        this.props.navigation.navigate("Orders");
      }
    );

    this.backgroundNotification = messaging().setBackgroundMessageHandler(
      async (notificationOpen) => {
        var data = null;
        if (Platform.OS == "android") {
          data = notificationOpen.notification;
        } else {
          data = notificationOpen.notification;
        }

        this.props.navigation.navigate("Orders");
      }
    );
    this.initialNotification = messaging()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          var data = null;

          if (Platform.OS == "android") {
            data = notificationOpen.notification;
          } else {
            data = notificationOpen.notification;
          }

          this.props.navigation.navigate("Orders");
        }
      });
  };

  get_selected_language = async () => {
    const loagintype = await AsyncStorage.getItem("language");
    var response = JSON.parse(loagintype);

    return response;
  };
  navi_redirect = async () => {
    this.props.navigation.navigate("Orders");
  };
  onload = () => { };

  loaddata = () => {
    this.setState({ isoutstock: true }, () => {
      var dashdata = {
        do: "GetDash",
        userid: this.state.user_data.UserId,
        UserName: this.state.user_data.UserName,
        password: this.state.user_data.password,
      };
      var getstockdata = {
        do: "GetOutStk",
        userid: this.state.user_data.UserId,
        Current_Page: 0,
      };
      this.props.getDahboarddata(dashdata).then(() => {
        if (this.props.dashboard.data.ResponseCode == 1) {
          this.setState({ dash_data: this.props.dashboard.data }, () => {
            // this.setState({ isloading: false })
            if (this.props.dashboard.data.trial_expires > 0) {
              this.props.navigation.navigate("TrialPage", {
                days: this.props.dashboard.data.trial_expires,
              });
            }

            if (this.props.dashboard.data.alert == 1) {
              this.props.navigation.navigate("PaymentFailed");
            }

            if (this.props.dashboard.data.alert == 2) {
              this.props.navigation.navigate("SubsCriptionExpiration");
            }

            this.props.getoustckdata(getstockdata).then(() => {
              if (this.props.outstock.data != undefined) {
                if (this.props.outstock.data.ResponseCode == 1) {
                  this.setState(
                    { outstockdata: this.props.outstock.data.InventoryData },
                    () => {
                      this.setState({ isloading: false, isoutstock: false });
                    }
                  );
                } else {
                  this.setState({
                    outstockdata: [],
                    isloading: false,
                    isoutstock: false,
                  });
                }
              } else {
                this.setState({
                  outstockdata: [],
                  isloading: false,
                  isoutstock: false,
                });
              }
            });
          });
        } else {
          AsyncStorage.clear();
          this.props.navigation.navigate("Login");

          this.setState({
            outstockdata: [],
            isloading: false,
            isoutstock: false,
          });
        }
      });
    });
  };
  async shouldComponentUpdate(nextProps, prevState) {
    if (nextProps != this.props) {
      this.setState({
        dash_data: nextProps.dashboard.data,
        //outstockdata: nextProps.outstock.data != undefined ? nextProps.outstock.data.InventoryData : [],
      });
    } else {
      this.setState("Somhting goes wrong");
      return false;
    }
  }
  get_user_data = async () => {
    const user_data = await AsyncStorage.getItem("user_data");

    var response = JSON.parse(user_data);
    return response;
  };
  get_logintype = async () => {
    const loagintype = await AsyncStorage.getItem("logintype");

    var response = JSON.parse(loagintype);
    return response;
  };

  store_selected_lang = async (data) => {
    try {
      await AsyncStorage.setItem("language", JSON.stringify(data));
    } catch (e) {
      // saving error
    }
  };
  select_language = () => {
    this.setState({ isenglish: !this.state.isenglish }, () => {
      if (this.state.isenglish === true) {
        var selected_lang = {
          select_lang: 1,
        };
        this.store_selected_lang(selected_lang);
        this.props.select_lang(english);
      } else {
        var selected_lang = {
          select_lang: 2,
        };
        this.store_selected_lang(selected_lang);
        this.props.select_lang(spanish);
      }
    });
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  onShare = async () => {
    const labels = this.props.label;
    try {
      var url =
        this.state.user_data.CompanyName.toUpperCase() +
        " " +
        labels.share_msg_shop +
        "  www." +
        this.state.user_data.UserName.toLowerCase() +
        ".kizbin.com. ";
      var subjectline =
        this.state.user_data.CompanyName.toUpperCase() +
        labels.subjectline_for_share;
      await Share.share(
        {
          message: url,
          title: subjectline,
        },
        {
          subject: subjectline,
        }
      );
    } catch (error) {
      if (error && error.message) {
        Alert.alert(error.message);
      }
    }
  };
  handleLoadMore = async () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      try {
        this.setState({ Current_Page: this.state.Current_Page + 1 }, () => {
          var getstockdata = {
            do: "GetOutStk",
            userid: this.state.user_data.UserId,
            Current_Page: this.state.Current_Page,
          };
          this.props.getoustckdata(getstockdata).then(() => {
            if (this.props.outstock.data != undefined) {
              if (this.props.outstock.data.ResponseCode == 1) {
                if (objectLength(this.props.outstock.data.InventoryData) > 0) {
                  var result = [
                    ...this.state.outstockdata,
                    ...this.props.outstock.data.InventoryData,
                  ];

                  this.setState({ outstockdata: result }, () => {
                    this.setState({ isloading: false });
                  });
                }
              } else {
                this.setState({ isoutstock: false });
              }
            } else {
              this.setState({ isoutstock: false });
            }
          });
        });
      } catch (e) {
        console.log(e);
      }
      this.onEndReachedCalledDuringMomentum = true;
    }
  };
  _renderItem = (u) => {
    const labels = this.props.label;

    return (
      <View>
        <ListItem
          title={u.prodtitle}
          subtitle={
            <View>
              <Text
                style={{
                  color: "#00b8e4",
                  fontFamily:
                    Platform.OS === "android" ? "Barlow-Bold" : "Baskerville",
                }}
              >
                0 {labels.cout_in_stock}
              </Text>
            </View>
          }
          titleStyle={{ fontWeight: "300" }}
          containerStyle={style.listItemContainer}
          rightElement={
            <View
              style={[
                {
                  backgroundColor: "#00b8e4",
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <AntIcon name="plus" size={15} color="#fff" />
            </View>
          }
          leftIcon={
            <View style={[style.naviicon, style.center, { marginTop: 10 }]}>
              {u.image == "" ? (
                <Image
                  source={require("../../assets/logo.png")}
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                  <Image
                    source={{ uri: u.image }}
                    style={{ height: "100%", width: "100%", alignSelf: "center" }}
                  />
                )}
            </View>
          }
        />
        <Divider />
      </View>
    );
  };

  showalerts = () => {
    this.setState({ ismodelvisible: true, isalertload: true }, () => {
      var data = {
        do: "GetAlerts",
        userid: this.state.user_data.UserId,
        Current_Page: this.state.Current_PageF_Noti,
      };
      this.props.getalerts(data).then(() => {
        if (this.props.alerts.data.ResponseCode == 1) {
          this.setState({
            notifications: this.props.alerts.data.Notifications,
          });
        } else {
          this.setState({ notifications: [] });
        }
        this.setState({ isalertload: false });
      });
    });
  };
  _onTap = (data) => {
    this.navi_redirect();
  };
  handleLoadMoreNotification = async () => {
    if (!this.onEndReachedCalledDuringMomentumNoti) {
      try {
        this.setState(
          { Current_PageF_Noti: this.state.Current_PageF_Noti + 1 },
          () => {
            var data = {
              do: "GetAlerts",
              userid: this.state.user_data.UserId,
              Current_Page: this.state.Current_PageF_Noti,
            };
            this.props.getalerts(data).then(() => {
              if (this.props.alerts.data.ResponseCode == 1) {
                var result = [
                  ...this.state.notifications,
                  ...this.props.alerts.data.Notifications,
                ];

                this.setState({ notifications: result });
              }
              this.setState({ isalertload: false });
            });
          }
        );
      } catch (e) {
        console.log(e);
      }
      this.onEndReachedCalledDuringMomentumNoti = true;
    }
  };

  renderCustomPopup = ({ appIconSource, appTitle, timeText, title, body }) => (
    <View>
      <Text>{title}</Text>
      <Text>{body}</Text>
    </View>
  );
  sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
  async openLink() {
    const { url, statusBarStyle } = this.state;
    var password =
      this.state.logintype.UserType == 3 || this.state.logintype.usertype == 3
        ? this.state.logintype.PasswordUser
        : this.state.logintype.PasswordLimit; //this.state.user_data.limit_password
    var username = this.state.user_data.UserName;
    var website =
      "https://" +
      this.state.user_data.UserName.toLowerCase() +
      ".kizbin.com/buyers/index.php?username=" +
      username +
      "&password=" +
      password +
      "&app=1";

    try {
      if (await InAppBrowser.isAvailable()) {
        const animated = true;
        const delay = animated && Platform.OS === "ios" ? 400 : 0;
        const result = await InAppBrowser.open(website, {
          animated,
          animations: {
            startEnter: "slide_in_right",
            startExit: "slide_out_left",
            endEnter: "slide_in_left",
            endExit: "slide_out_right",
          },
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      if (error && error.message) {
        Alert.alert(error.message);
      }
    } finally {
      StatusBar.setBarStyle(statusBarStyle);
    }
  }

  onchangerefresh = () => {
    this.setState({ isoutstock: true });
  };

  store_user_data = async (data) => {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(data));
    } catch (e) {
      // saving error
    }
  };
  store_logintype = async (logintype) => {
    try {
      await AsyncStorage.setItem("logintype", JSON.stringify(logintype));
    } catch (e) {
      // saving error
    }
  };

  render() {
    if (this.state.setLoading) {
      return (
        <ImageBackground
          source={require("../../assets/bg-Blue.jpg")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View style={[style.center, { flex: 1, opacity: 0.5 }]}>
            <ActivityIndicator size="large" />
          </View>
        </ImageBackground>
      );
    } else {
      const labels = this.props.label;
      return (
        <View style={style.container}>
          <NotificationPopup
            ref={(ref) => (this.popup = ref)}
            renderPopupContent={this.renderCustomPopup}
          />
          <ImageBackground
            source={require("../../assets/bg-Blue.jpg")}
            style={{ width: "100%", height: "100%" }}
          >
            <FlatList
              contentContainerStyle={{ paddingBottom: 20 }}
              data={this.state.outstockdata}
              keyExtractor={(_, index) => index.toString()}
              ListHeaderComponent={() => {
                return (
                  <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <View
                      style={{
                        paddingRight: 10,
                        paddingLeft: 10,
                        paddingBottom: 5,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#fff",
                          height: 40,
                          width: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 20,

                          marginTop: Platform.OS === "ios" ? 30 : 10,
                          marginBottom: 10,
                        }}
                        onPress={() => {
                          this.props.navigation.openDrawer();
                        }}
                      >
                        <FearIcon name="menu" size={22} color="black" />
                      </TouchableOpacity>

                      <Text
                        opacity={0.8}
                        style={{
                          color: "#fff",
                          fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                        }}
                      >
                        {labels.welcome}
                      </Text>

                      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                        <View style={{ width: "80%" }}>
                          <Text
                            style={{
                              fontSize: 30,
                              fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                              color: "#fff",
                            }}
                          >
                            {capitalize(this.state.user_data.CompanyName)}
                          </Text>
                          <View>
                            <Text
                              opacity={0.8}
                              style={{
                                color: "#fff",
                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                              }}
                            >
                              {this.state.user_data.UserName.toLocaleLowerCase()}.kizbin.com
                            </Text>

                          </View>
                        </View>
                        <View
                          style={{
                            width: "9%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                        <View style={{ width: "9%" }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#fff",
                              height: 35,
                              width: 35,
                              borderRadius: 360,
                            }}
                            onPress={() => {
                              this.select_language();
                            }}
                          >
                            {labels.login != "Login" ? (
                              <Image
                                source={require("../../assets/us.png")}
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  borderRadius: 20,
                                }}
                              />
                            ) : (
                                <Image
                                  source={require("../../assets/spain.jpeg")}
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: 20,
                                  }}
                                />
                              )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View style={style.panel}>
                      <Grid style={{ margin: 20 }}>
                        <Row>
                          <Col
                            style={[
                              style.center,
                              {
                                borderRightColor: "#989c9c",
                                borderRightWidth: 0.5,
                              },
                            ]}
                          >
                            <Text style={style.figure}>
                              {this.state.dash_data && this.state.dash_data.activeOrders}{" "}
                            </Text>
                            <Text style={style.figuremsg}>
                              {labels.active_order}
                            </Text>
                          </Col>
                          <Col
                            style={[
                              style.center,
                              {
                                borderRightColor: "#989c9c",
                                borderRightWidth: 0.5,
                              },
                            ]}
                          >
                            <Text style={style.figure}>
                              {this.state.dash_data != null
                                ?this.state.dash_data.inStock!==null? parseInt(this.state.dash_data.inStock):0
                                : 0}{" "}
                            </Text>
                            <Text style={style.figuremsg}>
                              {labels.in_stock}
                            </Text>
                          </Col>
                          <Col style={style.center}>
                            <Text style={style.figure}>
                              {this.state.dash_data && this.state.dash_data.outstock}
                            </Text>
                            <Text style={style.figuremsg}>
                              {labels.out_stock}
                            </Text>
                          </Col>
                        </Row>
                      </Grid>
                    </View>

                    <View style={style.data}>
                      <View style={style.asideLeft}>
                        <Text
                          style={{
                            color: "#0f3e53",
                            fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          }}
                        >
                          {labels.kizbin_viewing}
                        </Text>
                        <View
                          style={[
                            style.wrapper,
                            { margin: 10, alignItems: "center" },
                          ]}
                        >
                          <Text style={style.asidedata}>
                            {this.state.dash_data && this.state.dash_data.hit_week}
                          </Text>
                          <Text
                            style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                          >
                            {labels.this_week}
                          </Text>
                        </View>
                        <Divider />
                        <View
                          style={[
                            style.wrapper,
                            { margin: 10, alignItems: "center" },
                          ]}
                        >
                          <Text style={style.asidedata}>
                            {this.state.dash_data && this.state.dash_data.hit_total}
                          </Text>
                          <Text
                            style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                          >
                            {labels.to_date}
                          </Text>
                        </View>
                      </View>

                      <View style={style.asideRight}>
                        <Text
                          style={{
                            color: "#0f3e53",
                            fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          }}
                        >
                          {labels.kizbin_orders}
                        </Text>
                        <View
                          style={[
                            style.wrapper,
                            { margin: 10, alignItems: "center" },
                          ]}
                        >
                          <Text style={style.asidedata}>
                            {this.state.dash_data && this.state.dash_data.ord_week}
                          </Text>
                          <Text
                            style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                          >
                            {labels.this_week}
                          </Text>
                        </View>
                        <Divider />
                        <View
                          style={[
                            style.wrapper,
                            { margin: 10, alignItems: "center" },
                          ]}
                        >
                          <Text style={style.asidedata}>
                            {this.state.dash_data && this.state.dash_data.ord_total}
                          </Text>
                          <Text
                            style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                          >
                            {labels.to_date}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={style.navigation}>
                      <Grid>
                        <Row>
                          {this.state.logintype.UserType == 3 ||
                            this.state.logintype.usertype == 3 ? (
                              <Col style={style.center}>

                                <TouchableOpacity
                                  style={style.center}
                                  onPress={() => {
                                    this.props.navigation.navigate("Inventory");
                                  }}
                                >
                                  <View
                                    style={[
                                      style.naviicon,
                                      { backgroundColor: "#019a4a" },
                                    ]}
                                  >
                                    <FontIcon
                                      name="dropbox"
                                      size={40}
                                      color="#fff"
                                    />
                                  </View>
                                  <Text
                                    style={{
                                      fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                      marginTop: 10,
                                    }}
                                  >
                                    {labels.inventory}
                                  </Text>
                                </TouchableOpacity>

                              </Col>
                            ) : null
                          }
                          <Col style={style.center}>
                            <TouchableOpacity
                              style={style.center}
                              onPress={() => {
                                var data = {
                                  refeshMethod: this.refeshMethod,
                                };
                                this.props.navigation.navigate("Search", {
                                  data,
                                });
                              }}
                            >
                              <View
                                style={[
                                  style.naviicon,
                                  { backgroundColor: "#6cd4e1" },
                                ]}
                              >
                                <EviIcon name="search" size={40} color="#fff" />
                              </View>
                              <Text
                                style={{
                                  fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                  marginTop: 10,
                                }}
                              >
                                {labels.search_inventory}
                              </Text>
                            </TouchableOpacity>
                          </Col>
                          <Col style={style.center}>
                            <TouchableOpacity
                              style={style.center}
                              onPress={() => {
                                this.props.navigation.navigate("Orders");
                              }}
                            >
                              <View
                                style={[
                                  style.naviicon,
                                  { backgroundColor: "#f5aa01" },
                                ]}
                              >
                                <EviIcon name="cart" size={40} color="#fff" />
                              </View>
                              <Text
                                style={{
                                  fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                  marginTop: 10,
                                }}
                              >
                                {labels.orders}
                              </Text>
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row>
                          <Row>
                            {this.state.logintype.UserType == 3 ||
                              this.state.logintype.usertype == 3 ? (
                                <Col style={style.center}>

                                  <TouchableOpacity
                                    style={style.center}
                                    onPress={() => {
                                      this.props.navigation.navigate("Profile");
                                    }}
                                  >
                                    <View
                                      style={[
                                        style.naviicon,
                                        { backgroundColor: "#ff7000" },
                                      ]}
                                    >
                                      <FontIcon
                                        name="user"
                                        size={35}
                                        color="#fff"
                                      />
                                    </View>
                                    <Text
                                      style={{
                                        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                        marginTop: 10,
                                      }}
                                    >
                                      {labels.your_profile}
                                    </Text>
                                  </TouchableOpacity>

                                </Col>
                              ) :
                              null
                            }
                            <Col style={style.center}>
                              <TouchableOpacity
                                style={style.center}
                                onPress={() => {
                                  this.onShare();
                                }}
                              >
                                <View
                                  style={[
                                    style.naviicon,
                                    { backgroundColor: "#3f4545" },
                                  ]}
                                >
                                  <FoundIcon
                                    name="share"
                                    size={25}
                                    color="#fff"
                                  />
                                </View>
                                <Text
                                  style={{
                                    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                    marginTop: 10,
                                  }}
                                >
                                  {labels.share_your_site}
                                </Text>
                              </TouchableOpacity>
                            </Col>
                            <Col style={style.center}>
                              <TouchableOpacity
                                style={style.center}
                                onPress={() => {
                                  this.openLink();
                                }}
                              >
                                <View
                                  style={[
                                    style.naviicon,
                                    { backgroundColor: "#6d217c" },
                                  ]}
                                >
                                  <EviIcon name="cart" size={40} color="#fff" />
                                </View>
                                <Text
                                  style={{
                                    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                    marginTop: 10,
                                  }}
                                >
                                  {labels.create_order}
                                </Text>
                              </TouchableOpacity>
                            </Col>
                          </Row>
                        </Row>
                      </Grid>
                    </View>
                    {/* <Text
                      style={{
                        marginTop: 15,
                        marginBottom: 15,
                        fontSize: 14,
                        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                      }}
                    >
                      {labels.out_of_stock}
                    </Text> */}
                    {/* {this.state.isoutstock == true ? (
                      <ActivityIndicator size="small" />
                    ) : null} */}
                  </View>
                );
              }}
              renderItem={({ item, index }) => {
                return (
                  // <Collapsable
                  //   data={item}
                  //   navigation={this.props.navigation}
                  //   labels={labels}
                  //   refeshMethod={this.refeshMethod}
                  //   user_data={this.state.user_data}
                  //   logintype={this.state.logintype}
                  //   onchangerefresh={this.onchangerefresh}
                  // />
                  <></>
                );
              }}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
            />

            <Overlay
              overlayStyle={{
                width: "80%",
                padding: 10,
                height: 150,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
              isVisible={this.state.isModalVisible}
              onBackdropPress={this.toggleModal}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ subscriptionoverlay: false });
                }}
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  paddingRight: 7,
                  width: "50%",
                  height: 30,
                }}
              >
                <Text>{labels.dash_try}</Text>
              </TouchableOpacity>
            </Overlay>
            <Overlay
              overlayStyle={{
                width: "80%",
                padding: 10,
                height: 150,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
              isVisible={this.state.subscriptionoverlay}
            >
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    this.setState({ subscriptionoverlay: false });
                    this.props.navigation.navigate("SubsCription");
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    {labels.dash_subscription}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ subscriptionoverlay: false });
                  }}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    {labels.dash_try}
                  </Text>
                </TouchableOpacity>
              </View>
            </Overlay>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.ismodelvisible}
              onRequestClose={() => { }}
            >
              <TouchableOpacity
                style={{ height: "17%", width: "100%" }}
                onPress={() => {
                  this.setState({ ismodelvisible: false });
                }}
              >
                <Text>{""}</Text>
              </TouchableOpacity>
              <View
                style={{
                  height: "83%",
                  backgroundColor: "white",
                  width: "100%",
                  padding: 10,
                }}
              >
                {this.state.isalertload == true ? (
                  <ActivityIndicator size="small" />
                ) : (
                    <Grid>
                      <FlatList
                        contentContainerStyle={{ paddingBottom: 20 }}
                        data={this.state.notifications}
                        keyExtractor={(_, index) => index.toString()}
                        ListHeaderComponent={() => {
                          return <></>;
                        }}
                        ListFooterComponent={() => {
                          return <ActivityIndicator size="small" />;
                        }}
                        renderItem={({ item, index }) => {
                          return (
                            <Row
                              style={{
                                height: 70,
                                backgroundColor: "#bedbe5",
                                padding: 10,
                                marginBottom: 10,
                              }}
                            >
                              <Col size={17} style={style.center}>
                                <View
                                  style={[
                                    style.naviicon,
                                    {
                                      backgroundColor: "green",
                                      height: 50,
                                      width: 50,
                                      borderRadius: 360,
                                    },
                                  ]}
                                >
                                  <EviIcon name="cart" size={25} color="#fff" />
                                </View>
                              </Col>
                              <Col size={83} style={{ paddingLeft: 10 }}>
                                <Text
                                  style={{
                                    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                    fontWeight: "700",
                                  }}
                                >
                                  {item.order_title}
                                </Text>
                                <Text>{item.invoice_date}</Text>
                              </Col>
                            </Row>
                          );
                        }}
                        onEndReached={this.handleLoadMoreNotification}
                        onEndReachedThreshold={0.1}
                        onMomentumScrollBegin={() => {
                          this.onEndReachedCalledDuringMomentumNoti = false;
                        }}
                      />
                    </Grid>
                  )}
              </View>
            </Modal>
          </ImageBackground>
          <FlashMessage
            onPress={() => {
              alert(1);
            }}
            ref="fmLocalInstance"
            position="top"
            animated={true}
            autoHide={false}
          />

          <DropdownAlert
            ref={(ref) => (this.dropDownAlertRef = ref)}
            containerStyle={style.content}
            showCancel={true}
            onCancel={this._onCancel}
            onTap={this._onTap}
            titleNumOfLines={2}
            messageNumOfLines={0}
            onClose={this._onClose}
            successImageSrc={require("../../assets/dropbox.png")}
            imageStyle={{
              height: 40,
              width: 40,
              borderRadius: 360,
            }}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.iscreateorder}
            onRequestClose={() => { }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  height: 50,
                  borderBottomColor: "#ccc",
                  borderBottomWidth: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.setState({ iscreateorder: false });
                  }}
                >
                  <FontisoIcon name="close-a" size={14} />
                </TouchableOpacity>
              </View>
              <WebView
                source={{ uri: this.state.websiteurl }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={this.ActivityIndicatorLoadingView}
                startInLoadingState={true}
              />
            </View>
          </Modal>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  urlInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
  },
  openButton: {
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingBottom: Platform.OS === "ios" ? 0 : 20,
  },
});
const style = StyleSheet.create({
  content: {
    backgroundColor: "green",
  },
  size: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 8,
  },
  container: {},
  panel: {
    backgroundColor: "snow",
    marginTop: 15,
    width: "100%",
    height: 85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.11,

    elevation: 10,
  },
  data: {
    marginTop: 10,

    flexDirection: "row",
    flexWrap: "wrap",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.11,

    elevation: 10,
  },
  asideLeft: {
    width: "48%",
    marginRight: (Dimensions.get("window").width / 100) * 1.5,

    backgroundColor: "snow",
    padding: 5,
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.11,

    elevation: 10,
  },
  asideRight: {
    width: "48%",
    marginLeft: (Dimensions.get("window").width / 100) * 1.5,

    backgroundColor: "snow",
    padding: 5,
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.11,

    elevation: 10,
  },
  asidedata: {
    color: "#138eaf",
    fontSize: 18,
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    marginRight: 10,
  },
  figure: {
    fontSize: 25,

    textAlign: "center",
    color: "#0f3e53",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
  },
  figuremsg: {
    fontSize: 14,
    textAlign: "center",
    alignSelf: "center",
    color: "#369eba",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
  },
  naviicon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemContainer: {
    backgroundColor: "transparent",
    height: 90,
    justifyContent: "center",
    width: "100%",
    borderColor: "#ECECEC",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.11,

    elevation: 10,
  },
  navigation: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    height: 250,
    marginTop: 10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    dashboard: state.dashboarddata,
    outstock: state.outstock,
    alerts: state.alerts,
    iosReciept: state.iosReciept,
    verifyRecieptState: state.verifyRecieptState,
  };
};

export default connect(
  mapStateToProps,
  {
    getDahboarddata,
    getoustckdata,
    select_lang,
    getalerts,
    logout,
    postIosReciept,
    verifyReciept,
  }
)(LoginScreen);
