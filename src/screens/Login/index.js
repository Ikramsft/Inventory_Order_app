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
  TextInput as NativeTextInput,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import {
  FONT_GOOGLE_BARLOW_REGULAR as FONT_GOOGLE_BARLOW,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
} from "../../constants/fonts";
import { AppStyles } from "../../utility/AppStyles";
// import RNIap from "react-native-iap";
import Logo from "../../components/Logo";
import { connect } from "react-redux";
import { isFieldEmpty } from "../../utility";
import { CheckBox, Button, Input as TextInput } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Header from "../../components/Header";
//import TextInput from '../../components/TextInput';
//import Button from '../../components/Button'
const { width, height } = Dimensions.get("window");
import { doLogin, get_user_data } from "./actions";
import { verifyReciept } from "../Dashoard/actions";
import DeviceInfo from "react-native-device-info";

import { TextInputMask } from "react-native-paper";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
import EntIcon from "react-native-vector-icons/Entypo";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import messaging, {
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
class LoginScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isShow: true,
      isloading: false,
      username: "",
      password: "",
      token: "",
      //error properties
      erroe_username: "",
      error_password: "",
      issubmit: false,
    };
  }
  componentDidMount = async () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    let token;
    // Platform.OS === "ios"
    //   ? (token = await messaging().getToken())
    //   : (token = await messaging().getToken());
    token = await messaging().getToken();
    console.log("the ios token is", token);
    this.setState({ token: token });
    this.props.navigation.setParams({
      labels: this.props.label,
    });

    // await RNIap.initConnection();
    // var purchases = await RNIap.getAvailablePurchases();
    // console.log("purchases", purchases);

    this.props.navigation.addListener("willFocus", (payload) => {
      console.log("payload.state.routeName ", payload.state.routeName);

      this.clockCall = setInterval(() => {
        this.decrementClock();
      }, 1000);

    });
  };
  decrementClock = () => {
    if (this.state.isloading == true) {
      this.setState((prevstate) => ({ timer: prevstate.timer + 1 }), () => {
        if (this.state.timer == 15 || this.state.timer == 30 || this.state.timer == 45) {
          const lables = this.props.label;
          Alert.alert(
            '',
            lables.error_msg,
            [
              {
                text: lables.int_option1, onPress: () => {
                  BackHandler.exitApp()
                }
              },

              {
                text: lables.int_option2,
                onPress: () => {
                  var labels = this.props.label
                  this.onload()

                }
              },


            ],
            { cancelable: false }
          );
        }
      });
    }
  };
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    // console.log("I took this to back screen")
    return true;
  }
  login = () => {
    this.setState({ issubmit: true });
    const lables = this.props.label;
    var IsValid = [];
    if (isFieldEmpty(this.state.username) == true) {
      this.setState({ erroe_username: lables.error_username_msg });
      IsValid.push(false);
    } else {
      this.setState({ erroe_username: "" });
      IsValid.push(true);
    }

    if (isFieldEmpty(this.state.password) == true) {
      this.setState({ error_password: lables.error_password_msg });
      IsValid.push(false);
    } else {
      this.setState({ error_password: "" });
      IsValid.push(true);
    }

    if (IsValid.includes(false) != true) {
      var data = {
        do: "Login",
        username: this.state.username,
        password: this.state.password,
        osname: Platform.OS,
        device_id: DeviceInfo.getUniqueId(),
        token: this.state.token,
      };
      this.props.doLogin(data).then(() => {
        if (this.props.logindata.data !== undefined) {
          if (this.props.logindata.data.ResponseMsg == "Sucessfull") {
            var getUserData = {
              do: "getuser",
              userid: this.props.logindata.data.UserId,
            };
            this.props.get_user_data(getUserData).then(() => {
              if (this.props.logindata.data.UserType == 3) {
                //removed the dialog box
                console.log(
                  "this.props.user_data.data",
                  this.props.user_data.data
                );

                this.store_logintype(this.props.logindata.data);
                this.store_user_data(this.props.user_data.data);

                this.props.verifyReciept({
                  username: this.state.username,
                  osname: Platform.OS,
                  device_id: DeviceInfo.getUniqueId(),
                  token: this.state.token,
                });

                setTimeout(() => {
                  this.setState({ issubmit: false });
                  if (
                    this.props.verifyRecieptState.verifyRecieptCallback &&
                    this.props.verifyRecieptState.isSubscriber
                  ) {
                    if (this.props.user_data?.data?.CompanyName?.length > 1) {
                      this.props.navigation.navigate("Dashboard");
                    } else {
                      // Checking if user have active subscriptions
                      this.props.navigation.navigate("Profile");
                    }
                    return true;
                  } else {
                    this.props.navigation.navigate("SubsCriptionExpiration", {
                      fromLogin: true,
                    });
                    return false;
                  }
                }, 3000);

                // if (this.props.user_data.data.CompanyName == "") {
                //   this.props.navigation.navigate("Profile");
                // } else {
                //   // Checking if user have active subscriptions
                //   this.props.navigation.navigate("Dashboard");
                // }
              } else {
                Alert.alert(
                  "",
                  lables.login_usertype_employee_alert,
                  [
                    {
                      text: lables.label_cancel,
                      onPress: () => { },
                    },

                    {
                      text: lables.continue_login,
                      onPress: () => {
                        this.store_logintype(this.props.logindata.data);
                        this.store_user_data(this.props.user_data.data);
                        this.props.navigation.navigate("Dashboard");
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }
            });
          } else {
            this.setState({ issubmit: false });
            alert(lables.error_invalid_login_msg);
          }
        }else{
          this.setState({issubmit:false})
        }
      });
    } else {
      this.setState({ issubmit: false });
    }
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
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    if (this.state.isloading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      const labels = this.props.label;

      return (
        <ImageBackground
          source={require("../../assets/bg-Blue.jpg")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <ScrollView
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={style.container}
          >
            <Logo />
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <View
                style={[
                  style.drop1,
                  {
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 15,
                    borderBottomColor:
                      this.state.erroe_username != "" ? "red" : "#b4b4b4",
                  },
                ]}
              >
                <NativeTextInput
                  value={this.state.text}
                  style={[style.extrainput, { width: "90%" }]}
                  placeholder={labels.placeholder_username}
                  value={this.state.username}
                  onChangeText={(text) => this.setState({ username: text })}
                  errorText={this.state.erroe_username}
                  placeholderTextColor="black"
                  autoCapitalize="characters"
                />
                <Icon name="user" size={20} color="#00b8e4" />
              </View>
              <View
                style={[
                  style.drop1,
                  {
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 25,
                    borderBottomColor:
                      this.state.error_password != "" ? "red" : "#b4b4b4",
                  },
                ]}
              >
                <NativeTextInput
                  value={this.state.password}
                  style={[style.extrainput, { width: "90%" }]}
                  placeholder={labels.placeholder_password}
                  onChangeText={(text) => this.setState({ password: text })}
                  errorText={this.state.erroe_username}
                  placeholderTextColor="black"
                  secureTextEntry={this.state.isShow}
                />
                <TouchableOpacity
                  onPress={() => this.setState({ isShow: !this.state.isShow })}
                >
                  <EntIcon name="eye-with-line" size={20} color="#00b8e4" />
                </TouchableOpacity>
              </View>

              {this.state.issubmit == true ? (
                <ActivityIndicator size="large" />
              ) : null}

              <Button
                title={labels.login}
                titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                buttonStyle={{ backgroundColor: "#00b8e4" }}
                containerStyle={{ width: "100%" }}
                onPress={() => this.login()}
              />

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    this.props.navigation.navigate("Foregot");
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      color: "#726868",
                      textAlign: "left",
                      fontFamily: FONT_GOOGLE_BARLOW,
                    }}
                  >
                    {labels.forgot_password}
                  </Text>
                </TouchableOpacity>
              </View>
              {Platform.OS === "ios" ? (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Signup", { plan: 1 });
                  }}
                >
                  <Text style={style.expirationMsg}>{labels.NoAccount}</Text>
                </TouchableOpacity>
              ) : null}

              <Image
                source={require("../../assets/Kizbin-2.png")}
                style={{
                  width: 25,
                  height: 26,
                  marginTop: 30,
                  marginBottom: 30,
                }}
              />
              {/* 
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Text style={{ textAlign: "center" }}>
                  {labels.no_acount_labels}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Signup");
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                      color: "#00b8e4",
                      fontSize: 25,
                    }}
                  >
                    {labels.signup}
                  </Text>
                </TouchableOpacity>
              </View>
             */}
            </View>
          </ScrollView>
        </ImageBackground>
      );
    }
  }
}

const style = StyleSheet.create({
  container: {
    padding: (Dimensions.get("screen").width / 100) * 10,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  expirationMsg: {
    fontWeight: "500",
    color: "#726868",
    textAlign: "left",
    fontFamily: FONT_GOOGLE_BARLOW,
  },
  selected: {
    fontSize: 16,

    marginTop: 15,
    color: "#0f3e53",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
  },
  droptitle: {
    fontSize: 16,
    color: "#0f3e53",
    marginBottom: 5,
    // marginLeft: 10,
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    //fontWeight: 'bold'
  },
  extrainput: {
    marginBottom: 0,
    height: 50,
    fontSize: 16,
    color: "#0f3e53",
  },
  drop1: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#b4b4b4",
    marginLeft: 15,
    marginRight: 15,

    width: "80%",
  },
  drop: {
    width: "100%",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    logindata: state.login,
    user_data: state.user_data,
    verifyRecieptState: state.verifyRecieptState,
    verifyReciept: state.verifyReciept,
  };
};

export default connect(
  mapStateToProps,
  {
    doLogin,
    get_user_data,
    verifyReciept,
  }
)(LoginScreen);
