import React from "react";
import {
  StyleSheet,
  Text,
  Linking,
  View,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
  AppState,
  Platform,
} from "react-native";
import {
  FONT_GOOGLE_BARLOW_REGULAR as FONT_GOOGLE_BARLOW,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
} from "../../constants/fonts";
import messaging from "@react-native-firebase/messaging";

import DeviceInfo from "react-native-device-info";

import { connect } from "react-redux";

import AsyncStorage from "@react-native-community/async-storage";
import { select_lang } from "./actions";
import { get_user_data } from "../Login/actions";
import { verifyReciept } from "../Dashoard/actions";

import { TouchableOpacity } from "react-native-gesture-handler";
import { english, spanish } from "../../constants/languages";

import DropdownAlert from "react-native-dropdownalert";

class Language extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.createNotificationListener();
    this.state = {
      isloading: true,
      isnotiloading: false,
      timer: 0,
      appState: AppState.currentState,
    };
  }
  componentDidMount = () => {
    Linking.getInitialURL().then((url) => {
      this.get_selected_language().then((lang) => {
        this.setState({ isloading: false }, () => {
          if (lang != null) {
            this.select_language(0, url);
          } else {
            this.setState({ isloading: false });
          }
        });
      });
    });
    Linking.addEventListener("url", this.handleOpenURL);
  };

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = (event) => {
    this.get_selected_language().then((lang) => {
      this.setState({ isloading: false }, () => {
        if (lang != null) {
          this.select_language(lang.select_lang, event.url);
        } else {
          this.setState({ isloading: false });
        }
      });
    });
  };

  navigate = (url) => {
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, "");
    const routeName = route.split("/");
    alert("id" + routeName[0]);

    alert("route" + routeName[1]);
    if (routeName[0] == "orders") {
      this.props.navigation.navigate("Orders");
    }
  };
  createNotificationListener = async () => {
    this.notificationListener = messaging().onMessage((notification) => {
    
      if (
        this.dropDownAlertReflang != null &&
        this.dropDownAlertReflang != undefined
      ) {
        this.dropDownAlertReflang.alertWithType(
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
        this.setState({ isloading: true }, async () => {
          const user_data1 = await AsyncStorage.getItem("user_data");
          var response = JSON.parse(user_data1);
          if (user_data1 != null && user_data1 != "null") {
            var getUserData = {
              do: "getuser",
              userid: response.UserId,
            };
            this.props.get_user_data(getUserData).then(() => {
              if (this.props.user_data.data != undefined) {
                if (this.props.user_data != null) {
                  if (this.props.user_data.data.ResponseCode == 1) {
                    this.setState({ isloading: true });
                    var response = this.props.user_data.data;

                    this.store_user_data(response);
                    this.props.select_lang(english);
                    this.get_logintype().then((response) => {
                      if (response != null) {
                        this.props.navigation.navigate("stackOrders");
                      } else {
                      
                        this.props.navigation.navigate("Plans");
                      }
                    });
                  } else {
                    this.setState({ isloading: true });
                    this.props.select_lang(english).then(() => {
                      // alert("user not found")
                    
                      this.props.navigation.navigate("Plans");
                    });
                  }
                }
              }
            });
          } else {
            this.props.select_lang(english);
          
            this.props.navigation.navigate("Plans");
          }
        });
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
        this.setState({ isloading: true }, async () => {
          const user_data1 = await AsyncStorage.getItem("user_data");
          var response = JSON.parse(user_data1);
          if (user_data1 != null) {
            var getUserData = {
              do: "getuser",
              userid: response.UserId,
            };
            this.props.get_user_data(getUserData).then(() => {
              if (this.props.user_data.data != undefined) {
                if (this.props.user_data.data.ResponseCode == 1) {
                  this.setState({ isloading: true });
                  var response = this.props.user_data.data;
                  this.store_user_data(response);

                  this.props.select_lang(english);
                  this.get_logintype().then((response) => {
                    if (response != null) {
                      // if (response.trial_expires == 1) {
                      //     this.props.navigation.navigate("SubsCriptionExpiration")
                      // } else {
                      this.props.navigation.navigate("stackOrders");
                      //  }
                    } else {
               
                      this.props.navigation.navigate("Plans");
                    }
                  });
                } else {
                  this.setState({ isloading: true });
                  this.props.select_lang(english).then(() => {
                    
                    this.props.navigation.navigate("Plans");
                  });
                }
              }
            });
          } else {
            this.props.select_lang(english);

            this.props.navigation.navigate("Plans");
          }
        });
      }
    );

    this.initialNotification = messaging()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          var data = null;
          this.setState({ isnotiloading: true }, async () => {
            if (Platform.OS == "android") {
              data = notificationOpen.notification;
            } else {
              data = notificationOpen.notification;
            }
            const user_data1 = await AsyncStorage.getItem("user_data");
            var response = JSON.parse(user_data1);
            if (user_data1 != null) {
              var getUserData = {
                do: "getuser",
                userid: response.UserId,
              };
              this.props.get_user_data(getUserData).then(() => {
                console.log("this.props.user_data", this.props.user_data);
                if (this.props.user_data.data != undefined) {
                  if (this.props.user_data.data.ResponseCode == 1) {
                    this.setState({ isloading: true });
                    var response = this.props.user_data.data;
                    this.store_user_data(response);
                    this.props.select_lang(english);
                    this.get_logintype().then((response) => {
                      if (response != null) {
                        if (response.trial_expires == 1) {
                          this.props.navigation.navigate(
                            "SubsCriptionExpiration"
                          );
                        } else {
                          this.props.navigation.navigate("Orders");
                        }
                      } else {
                        this.props.navigation.navigate("Plans");
                      }
                    });
                  } else {
                    this.setState({ isloading: true });
                    this.props.select_lang(english).then(() => {
                    
                      this.props.navigation.navigate("Plans");
                    });
                  }
                }
              });
            } else {
              this.props.select_lang(english);
              // this.props.navigation.navigate("Login");
            
              this.props.navigation.navigate("Plans");
            }
          });
        }
      });
  };
  onload = () => {};
  navi_redirect = async (order_id) => {
    this.setState({ isloading: true }, async () => {
      const user_data1 = await AsyncStorage.getItem("user_data");
      var response = JSON.parse(user_data1);
      if (user_data1 != null) {
        var getUserData = {
          do: "getuser",
          userid: response.UserId,
        };
        this.props.get_user_data(getUserData).then(() => {
          console.log(
            "this.props.user_data",
            this.props.user_data.data.trial_expires
          );
          if (this.props.user_data.data != undefined) {
            if (this.props.user_data.data.ResponseCode == 1) {
              this.setState({ isloading: true });
              var response = this.props.user_data.data;
              this.store_user_data(response);
              this.props.select_lang(english);
              this.get_logintype().then((response) => {
                if (response != null) {
                  if (response.trial_expires == 1) {
                    this.props.navigation.navigate("SubsCriptionExpiration");
                  } else {
                    this.props.navigation.navigate("stackOrders");
                  }
                } else {
                  this.props.navigation.navigate("Plans");
                }
              });
            } else {
              this.setState({ isloading: true });
              this.props.select_lang(english).then(() => {
             
                this.props.navigation.navigate("Plans");
              });
            }
          }
        });
      } else {
        if (selected == 1) {
          this.props.select_lang(english);
     
          // this.props.navigation.navigate("Plans");
        } else {
          this.props.select_lang(spanish);
          
          // this.props.navigation.navigate("Plans");
        }
      }
    });
  };

  get_user_data = async () => {
    const user_data = await AsyncStorage.getItem("user_data");
    var response = JSON.parse(user_data);
    return response;
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
            if (user?.CompanyName == "") {
              this.props.navigation.navigate("Profile");
            } else {
              // Checking if user have active subscriptions
              this.props.navigation.navigate("Dashboard");
            }
            return true;
          } else {
            //SubsCriptionExpiration
            this.props.navigation.navigate("SubsCriptionExpiration", {
              fromLogin: true,
            });
            return false;
          }
        }, 2000);
      }
    });
    // alert(JSON.stringify(this.props.verifyRecieptState.isSubscriber));

    // this.props.verifyReciept({ userid: 123 });
    // const availablePurchases = await RNIap.getAvailablePurchases();

    // for (let i = 0; i < availablePurchases.length; i++) {
    //   if (SUBSCRIPTIONS.ALL.includes(availablePurchases[i].productId)) {
    //     return true;
    //   }
    // }
  };
  select_language = async (selected, url) => {
    if (this.state.isnotiloading == false) {
      var selected_lang = {
        select_lang: selected,
      };
      var temp_selected = selected;
      if (selected == 0) {
        this.get_selected_language().then((lang) => {
          temp_selected = lang.select_lang;
          this.store_selected_lang(lang.select_lang);
        });
      }

      this.setState({ isloading: true }, async () => {
        const user_data1 = await AsyncStorage.getItem("user_data");
        console.log("user_data1", user_data1);
       

        var response = JSON.parse(user_data1);
        var loginUser = response;
        if (user_data1 != "null" && user_data1 != null) {
          var getUserData = {
            do: "getuser",
            userid: response.UserId,
          };

          this.props.get_user_data(getUserData).then(() => {
            console.log("this.props.user_data", this.props.user_data);

            if (this.props.user_data.data != undefined) {
              if (this.props.user_data.data.ResponseCode == 1) {
                this.setState({ isloading: true });
                var response = this.props.user_data.data;
                this.store_user_data(response);

                if (temp_selected == 1) {
                  this.props.select_lang(english);
                  this.get_logintype().then(async (response) => {
                    if (response != null) {
                      if (url != null) {
                        const route = url.replace(/.*?:\/\//g, "");
                        const routeName = route.split("/");
                        if (routeName[0] == "kizbin.com") {
                          this.props.navigation.navigate("Orders");
                        }
                      } else {
                        // When an active subscription expires, it does not show up in
                        // available purchases anymore, therefore we can use the length
                        // of the availablePurchases array to determine whether or not
                        // they have an active subscription.
                        // var rana11 = isSubscriptionActive();

                        await this.checkSubscriptionStatus();
                      }
                    } else {
                      this.props.navigation.navigate("Plans");
                    }
                  });
                } else {
                  this.props.select_lang(spanish);
                  this.get_logintype().then(async (response) => {
                    if (response != null) {
                      if (url != null) {
                        const route = url.replace(/.*?:\/\//g, "");
                        const routeName = route.split("/");
                        if (routeName[0] == "kizbin.com") {
                          this.props.navigation.navigate("OrderDetail", {
                            orderid: routeName[1],
                            onload: this.onload(),
                          });
                        }
                      } else {
                        // alert("rana");
                        this.get_selected_language().then((lang) => {
                          if (lang == 1) {
                            this.props.select_lang(english);
                          } else {
                            this.props.select_lang(spanish);
                          }
                        });
                        await this.checkSubscriptionStatus();
                        // await this.checkSubscriptionStatus();
                        // if (loginUser?.CompanyName == "") {
                        //   this.props.navigation.navigate("Profile");
                        // } else {
                        //   // Checking if user have active subscriptions
                        //   this.props.navigation.navigate("Dashboard");
                        // }
                      }
                    } else {
                      this.props.navigation.navigate("Plans");
                    }
                  });
                }
              } else {
                this.setState({ isloading: true });
                this.props.select_lang(english).then(() => {
             
                  this.props.navigation.navigate("Plans");
                });
              }
            }
          });
        } else {
          this.setState({ isloading: false });
          if (selected == 1) {
            this.props.select_lang(english);
            //  this.props.navigation.navigate("Login");
          
            this.props.navigation.navigate("Plans");
          } else if (selected == 2) {
            this.props.select_lang(spanish);
         
            this.props.navigation.navigate("Plans");
          }
        }
      });
    }
  };

  get_logintype = async () => {
    const loagintype = await AsyncStorage.getItem("logintype");
    var response = JSON.parse(loagintype);
    return response;
  };
  get_selected_language = async () => {
    const loagintype = await AsyncStorage.getItem("language");
    var response = JSON.parse(loagintype);
    return response;
  };

  store_user_data = async (data) => {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(data));
    } catch (e) {}
  };

  store_selected_lang = async (data) => {
    try {
      await AsyncStorage.setItem("language", JSON.stringify(data));
    } catch (e) {}
  };

  render() {
    if (this.state.isnotiloading == true) {
      return (
        <ImageBackground
          source={require("../../assets/bg-Blue.jpg")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          source={require("../../assets/bg-Blue.jpg")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <ScrollView
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={style.container}
          >
            <Image
              source={require("../../assets/logo.png")}
              style={{ height: 250, width: 250 }}
            />

            {this.state.isloading == true ? (
              <>
                <ActivityIndicator size="small" />
              </>
            ) : (
              <View
                style={{
                  marginTop: 80,
                  paddingLeft: 30,
                  paddingRight: 30,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "50%" }}>
                  <TouchableOpacity
                    style={{
                      borderBottomColor: "#187aa6",
                      borderBottomWidth: 4,
                      padding: 10,
                    }}
                    onPress={() => {
                      this.select_language(1, null);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                        fontSize: 17,
                      }}
                    >
                      ENGLISH
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: "50%" }}>
                  <TouchableOpacity
                    style={{
                      borderBottomColor: "#ccc",
                      borderBottomWidth: 4,
                      padding: 10,
                    }}
                    onPress={() => {
                      this.select_language(2, null);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#187aa6",
                        fontSize: 17,
                        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                      }}
                    >
                      ESPAÑOL
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
          <DropdownAlert
            ref={(ref) => (this.dropDownAlertReflang = ref)}
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
        </ImageBackground>
      );
    }
  }
}

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
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
const mapStateToProps = (state) => {
  return {
    user_data: state.user_data,
    verifyRecieptState: state.verifyRecieptState,
  };
};
export default connect(
  mapStateToProps,
  {
    select_lang,
    get_user_data,
    verifyReciept,
  }
)(Language);
