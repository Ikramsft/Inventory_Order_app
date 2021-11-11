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
  BackHandler,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  Linking,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EviIcon from "react-native-vector-icons/EvilIcons";
import IoIcon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import FoundIcon from "react-native-vector-icons/Foundation";
import FearIcon from "react-native-vector-icons/Feather";
import { get_user_data } from "../Login/actions";
import { Picker } from "react-native-picker-dropdown";
import { AppStyles } from "../../utility/AppStyles";
import Logo from "../../components/Logo";
import { connect } from "react-redux";
import { isFieldEmpty, capitalize, objectLength } from "../../utility";
import { CheckBox, Overlay } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Header from "../../components/Header";
//import TextInput from '../../components/TextInput';
import Button from "../../components/Button";
const { width, height } = Dimensions.get("window");
import { saveuser } from "./actions";
import HeaderBar from "../../components/ProfileHeader";

import {
  FONT_GOOGLE_BARLOW_REGULAR as FONT_GOOGLE_BARLOW,
  FONT_GOOGLE_BARLOW_REGULAR,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
} from "../../constants/fonts";
//import { Views, View } from 'react-native-progress-steps';
import { Grid, Row, Col } from "react-native-easy-grid";
import DropdownAlert from "react-native-dropdownalert";
import messaging from "@react-native-firebase/messaging";
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

class Orders extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.createNotificationListener();
    this.state = {
      onSuccess: false,
      isstateoverlay: false,
      istypeoverlay: false,
      isenableoverly: false,
      isDinInOverlay: false,
      isloading: true,
      isSubmit: false,
      iseditable: true,
      iseditemppwd: false,
      iseditassociate: false,
      iseditdelivery: false,
      isedittax: false,
      iseditgrativity: false,
      iseditterm: false,
      user_data: null,
      company_name: "",
      first_name: "",
      last_name: "",
      cell_number: "",
      store_number: "",
      address: "",
      bussinesstype_str: "",
      delivery_enable_type_str: "",
      din_enable_type_str: "",
      operation_hours: "",
      offer_delivery: 1,
      city: "",
      userstate: "",
      zip: "",
      email: "",
      password: "",
      pwd_emp: "",
      associated_id: "",
      delivery_charge: "0.0",
      tax_rate: "",
      locationId: "",
      statename: "",
      user_id: "",
      prephone: "",
      bussinesstype: 0,
      autograduity: "",
      terms: "",
      flags: "",
      visibleBackOverlay: false,
      //error proprties
      error_company_name: "",
      error_first_name: "",
      error_last_name: "",
      error_cell_number: "",
      error_store_number: "",
      error_address: "",
      error_city: "",
      error_userstate: "",
      error_zip: "",
      error_email: "",
      error_password: "",
      error_pwd_emp: "",
      error_associated_id: "",
      error_delivery_charge: "",
      error_tax_rate: "",
      error_businesstype: "",
      error_delivery_enable: "",
      error_dinin_enable: "",
      error_hours_of_operation: "",
      language: "",
      timer: 0,
      e_enable: 0,

    };
  }
  openUrl = (url) => {
    openInAppBrowser(url);
  };
  componentDidMount = () => {
    this.props.navigation.setParams({
      labels: this.props.label,
    });
    var labels = this.props.label;
    this.get_user_data_async().then((response) => {
      var getUserData = {
        do: "getuser",
        userid: response.UserId,
      };
      this.props.get_user_data(getUserData).then(() => {

        console.log("this.props.gotUserdata", this.props.gotUserdata)

        if (this.props.gotUserdata.data.ResponseCode == 1) {
          this.setState({ isloading: true });
          var data = this.props.gotUserdata.data;
          this.store_user_data(this.props.gotUserdata.data);
          var date = new Date();
          this.get_selected_language().then((response) => {
            console.log("lang", data);

            this.setState(
              {
                iseditable: data?.CompanyName == "" ? true : false,
                user_data: data,
                country: data?.country,
                company_name: data?.CompanyName,
                first_name: data?.contact_fname,
                last_name: data?.contact_lname,
                cell_number: data?.cellphone,
                store_number: data?.storephone,
                address: data?.address != null ? data?.address : "",
                city: data?.city,
                userstate: data?.userstate,
                state_id: data?.state_id,
                state: data?.state,
                statename: data?.state,
                zip: data?.zip_postal,
                email: data?.email != null ? data?.email : "",
                pwd_emp: data?.limit_password,
                password: data?.password,
                associated_id: data?.associate,
                delivery_charge: data?.d_charge,
                operation_hours: data?.op_hours,
                offer_delivery: data?.d_enable,
                tax_rate: data?.tax_rate,
                locationId: data?.UserName,
                user_id: data?.UserId,
                prephone: data?.prephone,
                autograduity: data?.d_gratuity,
                bussinesstype: data?.sellertype,
                // bussinesstype_str:
                //   data?.sellertype == "0"
                //     ? data?.sellertype == "1"
                //       ? labels.bussinesstype_option1
                //       : labels.bussinesstype_option2
                //     : "",
                bussinesstype_str:
                  data?.sellertype == "0"
                    ? ""
                    : data?.sellertype == "1"
                      ? labels.bussinesstype_option1
                      : labels.bussinesstype_option2,
                // delivery_enable_type_str:
                //   data?.d_enable == "0"
                //     ? data?.d_enable == "1"
                //       ? labels.confirmoption2
                //       : labels.confirmoption1
                //     : "",
                delivery_enable_type_str:
                  data?.d_enable == "0" ? labels.confirmoption2 : labels.confirmoption1,
                din_enable_type_str: data?.e_enable == "0" ? labels.confirmoption2 : labels.confirmoption1,
                terms: data?.disclaimer,
                e_enable: data?.e_enable,
                d_enable: data?.d_enable,
                flags: data?.flags,
                language: response?.select_lang == 1 ? "EN" : "ES",
              },
              () => {
                console.log("this.state", this.state)
                this.setState({ isloading: false });
              }
            );
          });
        } else {
          // this.props.navigation.navigate("Dashboard");
          // this.props.navigation.navigate("SubsCriptionExpiration");
        }
      });
    });

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    Linking.addEventListener("url", this.handleOpenURL);
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  };

  componentWillUnmount() {
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
                  },
                },

                {
                  text: lables.int_option2,
                  onPress: () => {
                    var labels = this.props.label;
                    this.get_user_data_async().then((response) => {
                      var getUserData = {
                        do: "getuser",
                        userid: response.UserId,
                      };
                      this.props.get_user_data(getUserData).then(() => {
                        if (this.props.gotUserdata.data.ResponseCode == 1) {
                          this.setState({ isloading: true });
                          var data = this.props.gotUserdata.data;

                          var date = new Date();
                          this.get_selected_language().then((response) => {
                            console.log("lang", data);
                            this.setState(
                              {
                                iseditable:
                                  data.CompanyName == "" ? true : false,
                                user_data: data,
                                country: data.country,
                                company_name: data.CompanyName,
                                first_name: data.contact_fname,
                                last_name: data.contact_lname,
                                cell_number: data.cellphone,
                                store_number: data.storephone,
                                address:
                                  data.address != null ? data.address : "",
                                city: data.city,
                                userstate: data.userstate,
                                state_id: data.state_id,
                                state: data.state,
                                statename: data.state,
                                zip: data.zip_postal,
                                email: data.email != null ? data.email : "",
                                pwd_emp: data.limit_password,
                                password: data.password,
                                associated_id: data.associate,
                                delivery_charge: data.d_charge,
                                offer_delivery: data.d_enable,
                                operation_hours: data.op_hours,
                                tax_rate: data.tax_rate,
                                locationId: data.UserName,
                                user_id: data.UserId,
                                prephone: data.prephone,
                                autograduity: data.d_gratuity,
                                bussinesstype: data.sellertype,
                                bussinesstype_str:
                                  data.sellertype == "0"
                                    ? data.sellertype == "1"
                                      ? labels.bussinesstype_option1
                                      : labels.bussinesstype_option2
                                    : "",
                                // delivery_enable_type_str:
                                //   data.d_enable == "0"
                                //     ? data.d_enable == "1"
                                //       ? labels.confirmoption2
                                //       : labels.confirmoption1
                                //     : "",
                                delivery_enable_type_str:
                                  data?.d_enable == "0" ? labels.confirmoption2 : labels.confirmoption1,
                                din_enable_type_str: data?.e_enable == "0" ? labels.confirmoption2 : labels.confirmoption1,

                                terms: data.disclaimer,
                                flags: data.flags,
                                language:
                                  response.select_lang == 1 ? "EN" : "ES",
                              },
                              () => {
                                alert(1)
                                console.log("fincal status", this.state)
                                this.setState({ isloading: false });
                              }
                            );
                          });
                        } else {
                          //   this.props.navigation.navigate("Dashboard");
                          // this.props.navigation.navigate(
                          //   "SubsCriptionExpiration"
                          // );
                        }
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

  onload = () => { };
  createNotificationListener = async () => {
    this.notificationListener = messaging().onMessage((notification) => {
      if (
        this.dropDownAlertprofile != null &&
        this.dropDownAlertprofile != undefined
      ) {
        this.dropDownAlertprofile.alertWithType(
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
  store_user_data = async (data) => {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(data));
    } catch (e) {
      // saving error
    }
  };

  _onTap = (data) => {
    this.navi_redirect();
  };
  navi_redirect = async () => {
    this.props.navigation.navigate("Orders");
  };
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  notSaveinDraft = () => {
    this.props.navigation.navigate("Dashboard");
  }
  onBackPress = () => {
    const labels = this.props.label;

    this.setState({ visibleBackOverlay: true })

    // Alert.alert(
    //   "",
    //   labels.confirmmsg1,
    //   [
    //     {
    //       text: labels.confirmoption1,
    //       onPress: () => {
    //         this.update_profile();
    //         // this.props.navigation.navigate("Dashboard")
    //       },
    //     },

    //     {
    //       text: labels.confirmoption2,
    //       onPress: () => {
    //         this.props.navigation.navigate("Dashboard");
    //         // if (this.state.company_name != "") {
    //         //   //   this.props.navigation.navigate("Dashboard");
    //         //   this.props.navigation.navigate("SubsCriptionExpiration");
    //         // } else {
    //         //   this.props.navigation.navigate("Login");
    //         // }
    //       },
    //     },

    //     {
    //       text: labels.confirmoption3,
    //       onPress: () => { },
    //       style: "cancel",
    //     },
    //   ],
    //   { cancelable: false }
    // );
    return true;
  };
  getHash = () => {
    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];
    // and then just do:
    return [...Array(10)].map((i) => chars[(Math.random() * chars.length) | 0])
      .join``;
  };
  get_user_data_async = async () => {
    const user_data = await AsyncStorage.getItem("user_data");
    var response = JSON.parse(user_data);
    return response;
  };
  update_profile = () => {
    var isValid = [];
    const labels = this.props.label;
    this.setState({ isSubmit: true });
    if (isFieldEmpty(this.state.company_name) == true) {
      this.setState({ error_company_name: labels.error_company_name_msg });
      isValid.push(false);
    } else {
      this.setState({ error_company_name: "" });
      isValid.push(true);
    }

    if (isFieldEmpty(this.state.pwd_emp) == true) {
      this.setState({ error_pwd_emp: labels.error_pwd_emp_msg });
      isValid.push(false);
    } else {
      this.setState({ error_pwd_emp: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.first_name) == true) {
      this.setState({ error_first_name: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_first_name: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.last_name) == true) {
      this.setState({ error_last_name: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_last_name: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.cell_number) == true) {
      this.setState({ error_cell_number: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_cell_number: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.store_number) == true) {
      this.setState({ error_store_number: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_store_number: "" });
      isValid.push(true);
    }

    if (isFieldEmpty(this.state.address) == true) {
      this.setState({ error_address: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_address: "" });
      isValid.push(true);
    }

    if (isFieldEmpty(this.state.city) == true) {
      this.setState({ error_city: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_city: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.zip) == true) {
      this.setState({ error_zip: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_zip: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.email) == true) {
      this.setState({ error_email: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_email: "" });
      isValid.push(true);
    }
    if (isFieldEmpty(this.state.password) == true) {
      this.setState({ error_password: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_password: "" });
      isValid.push(true);
    }


    if (isFieldEmpty(this.state.bussinesstype_str) == true) {
      this.setState({ error_businesstype: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_businesstype: "" });
      isValid.push(true);
    }

    if (isFieldEmpty(this.state.d_enable) == true) {
      this.setState({ error_delivery_enable: "xyz" });
      isValid.push(false);
    } else {
      this.setState({ error_delivery_enable: "" });
      isValid.push(true);
    }

    if (isValid.includes(false) != true) {
      var data = {
        do: "saveuser",
        CompanyName: this.state.company_name,
        contact_fname: this.state.first_name,
        contact_lname: this.state.last_name,
        cellphone: this.state.cell_number,
        storephone: this.state.store_number,
        address: this.state.address,
        city: this.state.city,
        prephone: this.state.prephone,
        state_prov: this.state.userstate,
        userstate: this.state.userstate,
        password: this.state.password,
        zip_postal: this.state.zip,
        email: this.state.email,
        limit_password: this.state.pwd_emp,
        associate: this.state.associated_id,
        d_charge: this.state.delivery_charge,
        d_enable: this.state.offer_delivery,
        op_hours: this.state.operation_hours,
        tax_rate: this.state.tax_rate,
        UserName: this.state.locationId,
        userid: this.state.user_id,
        d_gratuity: this.state.autograduity,
        sellertype: parseInt(this.state.bussinesstype),
        disclaimer: this.state.terms,
        flags: this.state.flags,
        lang: this.state.language,
        e_enable: this.state.e_enable
      };

      console.log("data", data)

      this.props.saveuser(data).then(() => {
        // if (this.props.update_user.data.ResponseCode == 1) {
        // this.store_user_data(data);
        var getUserData = {
          do: "getuser",
          userid: this.state.user_id,
        };
        this.props.get_user_data(getUserData).then(() => {
          if (this?.props?.gotUserdata?.data) {
            this.store_user_data(this.props.gotUserdata.data);
            this.get_logintype().then((response) => {
              if (response != null) {
                this.setState({ isSubmit: false }, () => {
                  setTimeout(() => {
                    //  this.props.navigation.navigate("Dashboard");
                    this.setState({ onSuccess: true })
                    // this.props.navigation.navigate("SubsCriptionExpiration");
                  }, 100);
                }
                );

              } else {
                this.setState({ isSubmit: false });
                // this.props.navigation.navigate("Login");
                // this.props.navigation.navigate("SubsCriptionExpiration");
              }
            });
          }
        });

        this.onPressTouch();

      });
    } else {
      this.onPressTouch();
      this.setState({ isSubmit: false });
    }
  };

  get_selected_language = async () => {
    const loagintype = await AsyncStorage.getItem("language");
    var response = JSON.parse(loagintype);
    console.log("lang", response);
    return response;
  };

  get_logintype = async () => {
    const loagintype = await AsyncStorage.getItem("logintype");

    var response = JSON.parse(loagintype);
    return response;
  };

  showshowstate = () => {
    this.setState({ isstateoverlay: true });
  };
  toggleOverlay = () => {
    if (this.state.statename) {
      this.setState({ error_userstate: "please select state" });
    }
    this.setState({ isstateoverlay: false });
  };
  toggleType = () => {
    if (this.state.bussinesstype_str != "") {
      this.setState({ error_businesstype: "please select bussiness type" });
    }
    this.setState({ istypeoverlay: false });
  };
  toggleEnable = () => {
    if (this.state.delivery_enable_type_str != "") {
      this.setState({ error_dinin_enable: "please tell whether you offer delivery" });
    }
    this.setState({ isenableoverly: false });
  };
  toggleEnable = () => {
    if (this.state.din_enable_type_str != "") {
      this.setState({ error_dinin_enable: "please tell whether you offer delivery" });
    }
    this.setState({ isDinInOverlay: false });
  };
  onPressTouch = () => {
    this.ListView_Ref.scrollToOffset({ offset: 0, animated: true });
  };
  render() {
    if (this.state.isloading) {
      return (
        <ImageBackground
          source={require("../../assets/bg-Orange.jpg")}
          style={{
            width: "100%",
            height: "100%",

            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <ActivityIndicator size="large" />
        </ImageBackground>
      );
    } else {
      const labels = this.props.label;

      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ImageBackground
            source={require("../../assets/bg-Orange.jpg")}
            style={{
              width: "100%",
              height: "100%",

              overflow: "hidden",
            }}
          >
            <FlatList
              ref={(ref) => {
                this.ListView_Ref = ref;
              }}
              data={[{ key: 1 }]}
              keyExtractor={(_, index) => index.toString()}
              stickyHeaderIndices={[0]}
              ListHeaderComponent={() => {
                return (
                  <ImageBackground
                    source={require("../../assets/bg-Orange.jpg")}
                    style={{
                      overflow: "hidden",
                    }}
                    imageStyle={{
                      resizeMode: "cover",
                      height: Platform.OS === "android" ? 720 : 900,
                      width: "100%",
                    }}
                  >
                    {this?.state?.user_data?.CompanyName.length >= 1 ? (
                      <HeaderBar
                        navigation={this.props.navigation}
                        user_data={this.state.user_data}
                        isback={true}
                        onBackPress={this.onBackPress}
                      />
                    ) : null}

                    <View
                      style={{
                        width: "100%",
                        height: 60,
                        backgroundColor: "transparent",
                        paddingBottom: 5,
                        marginTop: Platform.OS === "android" ? 10 : 30,
                      }}
                    >
                      <Grid>
                        <Row>
                          <Col
                            size={40}
                            style={{
                              justifyContent: "center",
                              paddingLeft: 20,
                            }}
                          >
                            <Text style={{ color: "#fff" }}>
                              {labels.your_locationid}
                            </Text>
                          </Col>
                          <Col
                            size={60}
                            style={{
                              justifyContent: "center",
                              paddingLeft: 20,
                            }}
                          >
                            <Text style={{ color: "#fff" }}>
                              {this.state.locationId}
                            </Text>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            size={40}
                            style={{
                              justifyContent: "center",
                              paddingLeft: 20,
                            }}
                          >
                            <Text style={{ color: "#fff" }}>
                              {labels.your_web_site}
                            </Text>
                          </Col>
                          <Col
                            size={60}
                            style={{
                              justifyContent: "center",
                              paddingLeft: 20,
                            }}
                          >
                            <Text style={{ color: "#fff" }}>
                              {this.state.locationId.toLocaleLowerCase()}
                              .kizbin.com
                            </Text>
                          </Col>
                        </Row>
                      </Grid>
                    </View>
                  </ImageBackground>
                );
              }}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <View
                      style={{
                        backgroundColor: "#f3f3f3",
                        paddingTop: 15,
                        paddingLeft: 15,
                        paddingRight: 15,
                      }}
                    >
                      {this.state.user_data.CompanyName == "" ? (
                        <View style={{ paddingLeft: 10 }}>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.company_textinput.focus();
                            }}
                          >
                            <Text style={style.droptitle}>
                              {labels.placeholder_company_name}
                            </Text>
                          </TouchableWithoutFeedback>
                          <TextInput
                            ref={(input) => {
                              this.company_textinput = input;
                            }}
                            style={[
                              style.drop,
                              style.extrainput,
                              {
                                borderBottomColor:
                                  this.state.error_company_name != ""
                                    ? "red"
                                    : "#b4b4b4",
                              },
                            ]}
                            value={this.state.company_name}
                            onChangeText={(text) =>
                              this.setState({ company_name: text })
                            }
                            autoCapitalize={"words"}
                          />
                        </View>
                      ) : (
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_company_name}
                          </Text>
                          <View style={style.drop}>
                            <Text style={style.selected}>
                              {this.state.company_name}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.first_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_first_name}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.first_textinput = input;
                          }}
                          value={this.state.first_name}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_first_name != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          onChangeText={(text) => {
                            this.setState({ first_name: text });
                          }}
                          errorText={this.state.error_first_name}
                          autoCapitalize="words"
                          onBlur={() => {
                            if (this.state.first_name == "") {
                              this.setState({
                                error_first_name: "please enter first name",
                              });
                            }
                          }}
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.last_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_last_name}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.last_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_last_name != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          value={this.state.last_name}
                          onChangeText={(text) => {
                            this.setState({ last_name: text });
                          }}
                          onBlur={() => {
                            if (this.state.last_name == "") {
                              this.setState({
                                error_last_name: "please enter last name",
                              });
                            }
                          }}
                          autoCapitalize="words"
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.cell_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_cell_phone}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.cell_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_cell_number != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          value={this.state.cell_number}
                          // placeholder={labels.placeholder_cellphone}
                          onChangeText={(text) =>
                            this.setState({ cell_number: text })
                          }
                          keyboardType="phone-pad"
                          onBlur={() => {
                            if (this.state.cell_number == "") {
                              this.setState({
                                error_cell_number: "please enter cell no",
                              });
                            }
                          }}
                        />
                      </View>

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.store_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_store_phone}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.store_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_store_number != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          value={this.state.store_number}
                          //placeholder={labels.placeholder_store_phone}
                          onChangeText={(text) =>
                            this.setState({ store_number: text })
                          }
                          keyboardType="phone-pad"
                          onBlur={() => {
                            if (this.state.store_number == "") {
                              this.setState({
                                error_store_number: "please enter store no",
                              });
                            }
                          }}
                        />
                      </View>

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.address_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_address}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.address_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_address != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          value={this.state.address}
                          onChangeText={(text) =>
                            this.setState({ address: text })
                          }
                          autoCapitalize="sentences"
                          onBlur={() => {
                            if (this.state.address == "") {
                              this.setState({
                                error_address: "please enter address",
                              });
                            }
                          }}
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.city_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_city}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.city_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_city != "" ? "red" : "#b4b4b4",
                            },
                          ]}
                          value={this.state.city}
                          // placeholder={labels.placeholder_city}
                          onChangeText={(text) => this.setState({ city: text })}
                          autoCapitalize="words"
                          onBlur={() => {
                            if (this.state.city == "") {
                              this.setState({
                                error_city: "please enter city",
                              });
                            }
                          }}
                        />
                      </View>

                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.showshowstate();
                        }}
                      >
                        <View>
                          <Text
                            style={[
                              style.droptitle,
                              {
                                marginLeft: 10,
                                borderBottomColor:
                                  this.state.error_userstate != ""
                                    ? "red"
                                    : "#b4b4b4",
                              },
                            ]}
                          >
                            {labels.stateprovince}
                          </Text>

                          <View
                            style={[
                              style.drop,
                              {
                                borderBottomColor:
                                  this.state.error_userstate != ""
                                    ? "red"
                                    : "#b4b4b4",
                              },
                            ]}
                          >
                            <Grid style={{ height: 40 }}>
                              <Row>
                                <Col size={90}>
                                  <Text style={style.selected}>
                                    {this.state.statename}
                                  </Text>
                                </Col>
                                <Col
                                  size={10}
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <IoIcon name="ios-arrow-down" size={20} />
                                </Col>
                              </Row>
                            </Grid>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>

                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.zip_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_zip}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.zip_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_zip != "" ? "red" : "#b4b4b4",
                            },
                          ]}
                          value={this.state.zip}
                          // placeholder={labels.placeholder_zip}
                          onChangeText={(text) => this.setState({ zip: text })}
                          errorText={this.state.error_zip}
                          keyboardType="numeric"
                          onBlur={() => {
                            if (this.state.zip == "") {
                              this.setState({ error_zip: "please enter zip" });
                            }
                          }}
                        />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.email_textinput.focus();
                          }}
                        >
                          <Text style={style.droptitle}>
                            {labels.placeholder_email}
                          </Text>
                        </TouchableWithoutFeedback>
                        <TextInput
                          ref={(input) => {
                            this.email_textinput = input;
                          }}
                          style={[
                            style.drop,
                            style.extrainput,
                            {
                              borderBottomColor:
                                this.state.error_email != ""
                                  ? "red"
                                  : "#b4b4b4",
                            },
                          ]}
                          value={this.state.email}
                          // placeholder={labels.placeholder_email}
                          onChangeText={(text) =>
                            this.setState({ email: text })
                          }
                          onBlur={() => {
                            if (this.state.email == "") {
                              this.setState({
                                error_email: "please enter email",
                              });
                            }
                          }}
                        />
                      </View>







                      <View>
                        <View style={{ paddingLeft: 10 }}>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.pass_textinput.focus();
                            }}
                          >
                            <Text style={style.droptitle}>
                              {labels.placeholder_passwordp}
                            </Text>
                          </TouchableWithoutFeedback>
                          <TextInput
                            ref={(input) => {
                              this.pass_textinput = input;
                            }}
                            style={[
                              style.drop,
                              style.extrainput,
                              {
                                borderBottomColor:
                                  this.state.error_password != ""
                                    ? "red"
                                    : "#b4b4b4",
                              },
                            ]}
                            value={this.state.password}
                            //placeholder={labels.placeholder_password}
                            onChangeText={(text) =>
                              this.setState({ password: text })
                            }
                            errorText={this.state.error_password}
                            onBlur={() => {
                              if (this.state.password == "") {
                                this.setState({
                                  error_password: "please enter password",
                                });
                              }
                            }}
                          />
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.placeholder_password_for_emp}
                          </Text>
                          {this.state.iseditemppwd == true ? (
                            <TextInput
                              ref={(input) => {
                                this.emp_textinput = input;
                              }}
                              style={[
                                style.drop,
                                style.extrainput,
                                {
                                  borderBottomColor:
                                    this.state.error_pwd_emp != ""
                                      ? "red"
                                      : "#b4b4b4",
                                },
                              ]}
                              value={this.state.pwd_emp}
                              onChangeText={(text) =>
                                this.setState({ pwd_emp: text })
                              }
                              onBlur={() => {
                                if (this.state.pwd_emp == "") {
                                  this.setState({
                                    error_pwd_emp:
                                      "please enter employee password",
                                  });
                                }
                              }}
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "",
                                  labels.alert_emp_password,
                                  [
                                    {
                                      text: labels.label_continue,
                                      onPress: () => {
                                        this.setState({ iseditemppwd: true });
                                        this.emp_textinput.focus();
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={[
                                style.drop1,
                                { justifyContent: "center", marginLeft: 0 },
                              ]}
                            >
                              <Text style={style.touchtext}>
                                {this.state.pwd_emp}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.placeholder_Assosiated_id}
                          </Text>
                          {this.state.iseditassociate == true ? (
                            <TextInput
                              ref={(input) => {
                                this.asso_textinput = input;
                              }}
                              style={[style.drop, style.extrainput]}
                              value={this.state.associated_id}
                              //placeholder={labels.placeholder_Assosiated_id}
                              onChangeText={(text) =>
                                this.setState({ associated_id: text })
                              }
                              autoCapitalize="characters"
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "",
                                  labels.alert_assoc,
                                  [
                                    {
                                      text: labels.label_continue,
                                      onPress: () => {
                                        this.setState({
                                          iseditassociate: true,
                                        });
                                        this.asso_textinput.focus();
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={[
                                style.drop1,
                                { justifyContent: "center", marginLeft: 0 },
                              ]}
                            >
                              <Text style={style.touchtext}>
                                {this.state.associated_id}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_offer_delivery}
                          </Text>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.setState({ isenableoverly: true });
                            }}
                          >
                            <View
                              style={[
                                style.drop,
                                {
                                  borderBottomColor:
                                    this.state.error_delivery_enable != ""
                                      ? "red"
                                      : "#b4b4b4",
                                },
                              ]}
                            >
                              <Grid style={{ height: 40 }}>
                                <Row style={{ marginBottom: 10 }}>
                                  <Col size={90}>
                                    <Text style={style.selected}>
                                      {this.state.offer_delivery == 0
                                        ? labels.confirmoption2
                                        : this.state.delivery_enable_type_str}
                                    </Text>
                                  </Col>
                                  <Col
                                    size={10}
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <IoIcon name="ios-arrow-down" size={20} />
                                  </Col>
                                </Row>
                              </Grid>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                        <View>
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_offer_dinin}
                          </Text>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.setState({ isDinInOverlay: true });
                            }}
                          >
                            <View
                              style={[
                                style.drop,
                                {
                                  borderBottomColor:
                                    this.state.error_delivery_enable != ""
                                      ? "red"
                                      : "#b4b4b4",
                                },
                              ]}
                            >
                              <Grid style={{ height: 40 }}>
                                <Row style={{ marginBottom: 10 }}>
                                  <Col size={90}>
                                    <Text style={style.selected}>
                                      {this.state.e_enable == '0'
                                        ? labels.confirmoption2
                                        : this.state.din_enable_type_str}
                                    </Text>
                                  </Col>
                                  <Col
                                    size={10}
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <IoIcon name="ios-arrow-down" size={20} />
                                  </Col>
                                </Row>
                              </Grid>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>


                        <View style={{ paddingLeft: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.placeholder_deliver}
                          </Text>
                          {this.state.iseditdelivery == true ? (
                            <TextInput
                              ref={(input) => {
                                this.delivery_textinput = input;
                              }}
                              style={[style.drop, style.extrainput]}
                              value={this.state.delivery_charge}
                              //  placeholder={labels.placeholder_deliver}
                              onChangeText={(text) =>
                                this.setState({ delivery_charge: text })
                              }
                              errorText={this.state.error_delivery_charge}
                              keyboardType="numeric"
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "",
                                  labels.alert_delivery,
                                  [
                                    {
                                      text: labels.label_continue,
                                      onPress: () => {
                                        this.setState({ iseditdelivery: true });
                                        this.delivery_textinput.focus();
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={[
                                style.drop1,
                                { justifyContent: "center", marginLeft: 0 },
                              ]}
                            >
                              <Text style={style.touchtext}>
                                {this.state.delivery_charge}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.placeholder_rate}
                          </Text>
                          {this.state.isedittax == true ? (
                            <TextInput
                              ref={(input) => {
                                this.tax_textinput = input;
                              }}
                              style={[style.drop, style.extrainput]}
                              value={this.state.tax_rate}
                              //  placeholder={labels.placeholder_rate}
                              onChangeText={(text) =>
                                this.setState({ tax_rate: text })
                              }
                              errorText={this.state.error_tax_rate}
                              keyboardType="numeric"
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "",
                                  labels.alert_tax,
                                  [
                                    {
                                      text: labels.label_continue,
                                      onPress: () => {
                                        this.setState({ isedittax: true });
                                        this.tax_textinput.focus();
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={[
                                style.drop1,
                                { justifyContent: "center", marginLeft: 0 },
                              ]}
                            >
                              <Text style={style.touchtext}>
                                {this.state.tax_rate}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>





                      <View>
                        <View style={{ paddingLeft: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.placeholder_autogratuity}
                          </Text>

                          {this.state.iseditgrativity == true ? (
                            <TextInput
                              ref={(input) => {
                                this.grativity_textinput = input;
                              }}
                              style={[style.drop, style.extrainput]}
                              value={this.state.autograduity}
                              onChangeText={(text) =>
                                this.setState({ autograduity: text })
                              }
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "",
                                  labels.alert_grativity,
                                  [
                                    {
                                      text: labels.label_continue,
                                      onPress: () => {
                                        this.setState({
                                          iseditgrativity: true,
                                        });
                                        this.grativity_textinput.focus();
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={[
                                style.drop1,
                                { justifyContent: "center", marginLeft: 0 },
                              ]}
                            >
                              <Text style={style.touchtext}>
                                {this.state.autograduity}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View >
                          <Text style={[style.droptitle, { marginLeft: 10 }]}>
                            {labels.placeholder_bussinesstype}
                          </Text>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.setState({ istypeoverlay: true });
                            }}
                          >
                            <View
                              style={[
                                style.drop,
                                {
                                  borderBottomColor:
                                    this.state.error_businesstype != ""
                                      ? "red"
                                      : "#b4b4b4",
                                },
                              ]}
                            >
                              <Grid style={{ height: 40 }}>
                                <Row style={{ marginBottom: 10 }}>
                                  <Col size={90}>
                                    <Text style={style.selected}>
                                      {this.state.bussinesstype == 0
                                        ? labels.bussinesstype_option0
                                        : this.state.bussinesstype_str}
                                    </Text>
                                  </Col>
                                  <Col
                                    size={10}
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <IoIcon name="ios-arrow-down" size={20} />
                                  </Col>
                                </Row>
                              </Grid>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>

                        <View style={{ paddingLeft: 10 }}>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              this.hoursofoperation_textinput.focus();
                            }}
                          >
                            <Text style={style.droptitle}>
                              {labels.placeholder_hours_of_operation}
                            </Text>
                          </TouchableWithoutFeedback>
                          <TextInput
                            ref={(input) => {
                              this.hoursofoperation_textinput = input;
                            }}
                            style={[
                              style.drop,
                              style.extrainput,
                              { maxHeight: 100 },
                              {
                                borderBottomColor:
                                  this.state.error_hours_of_operation != ""
                                    ? "red"
                                    : "#b4b4b4",
                              },
                            ]}
                            value={this.state.operation_hours}
                            onChangeText={(text) => {
                              this.setState({ operation_hours: text });
                            }}
                            onBlur={() => {
                              if (this.state.operation_hours == "") {
                                this.setState({
                                  error_hours_of_operation: "please enter hours of operation",
                                });
                              }
                            }}
                            autoCapitalize="words"
                            multiline={true}
                          />
                        </View>
                        <View style={{ paddingLeft: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.placeholder_term}
                          </Text>
                          {this.state.iseditterm == true ? (
                            <TextInput
                              ref={(input) => {
                                this.term_textinput = input;
                              }}
                              value={this.state.terms}
                              onChangeText={(text) =>
                                this.setState({ terms: text })
                              }
                              style={[
                                style.drop,
                                style.extrainput,
                                { height: 100 },
                              ]}
                              multiline={true}
                              autoCapitalize="sentences"
                              underlineColorAndroid="transparent"
                            />
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "",
                                  labels.alert_term,
                                  [
                                    {
                                      text: labels.label_continue,
                                      onPress: () => {
                                        this.setState({ iseditterm: true });
                                        this.term_textinput.focus();
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }}
                              style={[
                                style.drop1,
                                {
                                  justifyContent: "center",
                                  marginLeft: 0,
                                  height: 100,
                                },
                              ]}
                            >
                              <Text style={style.touchtext}>
                                {this.state.terms}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>




                        <View style={{ paddingHorizontal: 10 }}>
                          <Text style={{
                            fontSize: 16,
                            color: "#808080",
                            paddingBottom: 10,
                            fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          }}>
                            {labels.profileDescription1}
                          </Text>
                          <TouchableOpacity
                            onPress={() => this.openUrl("https://www.kizbin.com/")}
                          >
                            <Text style={{ marginBottom: -2, fontSize: 16, color: 'blue', textDecorationLine: 'underline' }}>
                              www.kizbin.com
                                </Text>
                          </TouchableOpacity>
                          <Text>
                            {labels.profileDescription2}
                          </Text>
                        </View>


                        <View style={{ paddingHorizontal: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.profileDescription3}
                          </Text>
                        </View>


                        <View style={{ paddingHorizontal: 10 }}>
                          <Text style={{
                            fontSize: 16,
                            color: "#808080",
                            paddingBottom: 10,
                            fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          }}>
                            {labels.profileDescription4}

                          </Text>
                          <TouchableOpacity
                            onPress={() => this.openUrl("https://www.kizbin.com/")}
                          >
                            <Text style={{ marginBottom: -2, fontSize: 16, color: 'blue', textDecorationLine: 'underline' }}>
                              www.kizbin.com
                                </Text>
                          </TouchableOpacity>
                        </View>


                        <View style={{ paddingHorizontal: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.profileDescription5}
                          </Text>
                        </View>

                        <View style={{ paddingHorizontal: 10 }}>
                          <Text style={style.droptitle}>
                            {labels.profileDescription6}
                          </Text>
                        </View>





                        <Button onPress={() => this.update_profile()}>
                          {labels.submit}
                        </Button>



                      </View>


                    </View>
                  </View>
                );
              }}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
            />
            <Overlay
              overlayStyle={{ width: "70%", padding: 10, height: 450 }}
              isVisible={this.state.isstateoverlay}
              onBackdropPress={this.toggleOverlay}
            >
              <ScrollView keyboardShouldPersistTaps={"always"}>
                {this.state.iscatloading == true ? (
                  <View style={{ margin: 10 }}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : (
                  <Grid>
                    {objectLength(this.state.user_data.states) != 0
                      ? this.state.user_data.states.map((v, i) => {
                        return (
                          <Row style={{ margin: 5 }}>
                            <Col
                              size={8}
                              onPress={() => {
                                this.setState({
                                  userstate: v.id,
                                  statename: v.title,
                                  isstateoverlay: false,
                                });
                              }}
                            >
                              <Text>
                                {v.title}
                                {" (" + v.id + ")"}
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

            <Overlay
              overlayStyle={{ width: "70%", padding: 10, maxHeight: 450 }}
              isVisible={this.state.istypeoverlay}
              onBackdropPress={this.toggleType}
            >
              <ScrollView keyboardShouldPersistTaps={"always"}>
                <Grid>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          { bussinesstype: "0", bussinesstype_str: "" },
                          () => {
                            this.setState({ istypeoverlay: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.bussinesstype_option0}</Text>
                    </Col>
                  </Row>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          {
                            bussinesstype: "2",
                            bussinesstype_str: labels.bussinesstype_option2,
                          },
                          () => {
                            this.setState({ istypeoverlay: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.bussinesstype_option2}</Text>
                    </Col>
                  </Row>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          {
                            bussinesstype: "1",
                            bussinesstype_str: labels.bussinesstype_option1,
                          },
                          () => {
                            this.setState({ istypeoverlay: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.bussinesstype_option1}</Text>
                    </Col>
                  </Row>
                </Grid>
              </ScrollView>
            </Overlay>
            <Overlay
              overlayStyle={{ width: "70%", padding: 10, maxHeight: 450 }}
              isVisible={this.state.isenableoverly}
              onBackdropPress={this.toggleEnable}
            >
              <ScrollView keyboardShouldPersistTaps={"always"}>
                <Grid>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          {
                            offer_delivery: "1",
                            delivery_enable_type_str: labels.confirmoption1,
                          },
                          () => {
                            this.setState({ isenableoverly: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.confirmoption1}</Text>
                    </Col>
                  </Row>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          {
                            offer_delivery: "0",
                            delivery_enable_type_str: labels.confirmoption2,
                          },
                          () => {
                            this.setState({ isenableoverly: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.confirmoption2}</Text>
                    </Col>
                  </Row>
                </Grid>
              </ScrollView>
            </Overlay>
            <Overlay
              overlayStyle={{ width: "70%", padding: 10, maxHeight: 450 }}
              isVisible={this.state.isDinInOverlay}
              onBackdropPress={this.toggleEnable}
            >
              <ScrollView keyboardShouldPersistTaps={"always"}>
                <Grid>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          {
                            e_enable: "1",
                            din_enable_type_str: labels.confirmoption1,
                          },
                          () => {
                            this.setState({ isDinInOverlay: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.confirmoption1}</Text>
                    </Col>
                  </Row>
                  <Row style={{ margin: 5 }}>
                    <Col
                      size={8}
                      onPress={() => {
                        this.setState(
                          {
                            e_enable: "0",
                            din_enable_type_str: labels.confirmoption2,
                          },
                          () => {
                            this.setState({ isDinInOverlay: false });
                          }
                        );
                      }}
                    >
                      <Text>{labels.confirmoption2}</Text>
                    </Col>
                  </Row>
                </Grid>
              </ScrollView>
            </Overlay>

            <Overlay
              containerStyle={{ height: 'auto' }}
              overlayStyle={{
                width: "70%",
                borderRadius: 15,
                paddingVertical: 10,
                height: 'auto',
                borderWidth: 0
              }}
              isVisible={this.state.visibleBackOverlay}
              onBackdropPress={() => {
                this.setState({ visibleBackOverlay: false })
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: 'auto', }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>{labels.confirmmsg1}</Text>
                <View style={{ marginTop: 15, width: '100%', height: 'auto', }}>

                  <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                  <TouchableOpacity onPress={() => {
                    this.setState({ visibleBackOverlay: false })
                    // this.saveinDraft()
                    this.update_profile();
                  }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                    <Text>{labels.confirmoption1}</Text>
                  </TouchableOpacity>

                  <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                  <TouchableOpacity onPress={() => {
                    this.setState({ visibleBackOverlay: false })
                    this.notSaveinDraft()
                  }} style={{ justifyContent: 'center', marginVertical: 5, alignItems: 'center', height: 30, }}>
                    <Text>{labels.confirmoption2}</Text>
                  </TouchableOpacity>

                  <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />


                  <TouchableOpacity onPress={() => {
                    this.setState({ visibleBackOverlay: false })

                  }} style={{
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginTop: 15,
                    backgroundColor: '#43b0f0',
                    marginVertical: 5,
                    alignItems: 'center',
                    height: 30,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>{labels.confirmoption3}</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </Overlay>
            <Overlay visible={this.state.isSubmit}>
              <ActivityIndicator />
            </Overlay>

            <Overlay
              containerStyle={{ height: 'auto' }}
              overlayStyle={{
                width: "70%",
                borderRadius: 15,
                paddingVertical: 10,
                height: 'auto',
                borderWidth: 0
              }}
              isVisible={this.state.onSuccess}
              onBackdropPress={() => { this.setState({ onSuccess: false }) }}>
              <View style={{
                justifyContent: 'center',
                marginVertical: 5,
                alignItems: 'center',
                height: 30,
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{labels.success}</Text>
              </View>
              <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />


              <Text style={{
                fontSize: 16, width: '100%',
                textAlign: 'center',
                marginVertical: 6
              }}>{labels.edit_success_label}</Text>

              <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

              <TouchableOpacity
                onPress={() => {
                  this.setState({ onSuccess: false })
                  this.props.navigation.goBack(null)
                }}
                style={{
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: '#43b0f0',
                  // marginVertical: 5,
                  alignItems: 'center',
                  height: 30,
                }}>
                <Text style={{ color: '#fff' }}>OK</Text>
              </TouchableOpacity>

            </Overlay>

            <DropdownAlert
              ref={(ref) => (this.dropDownAlertprofile = ref)}
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
        </KeyboardAvoidingView>
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
    padding: 15,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    fontSize: 16,

    marginTop: 15,
    color: "#0f3e53",
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
  },
  droptitle: {
    fontSize: 16,
    color: "#808080",
    marginBottom: 5,
    // marginLeft: 10,
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    //fontWeight: 'bold'
  },
  extrainput: {
    marginLeft: 0,
    height: 50,
    paddingLeft: 0,
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    fontWeight: "500",
    fontSize: 16,
    color: "#0f3e53",
  },
  touchtext: {
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    fontSize: 16,
    color: "#0f3e53",
  },
  drop: {
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: "#b4b4b4",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "flex-start",
    // width: '100%'
  },
  drop1: {
    height: 70,
    borderBottomWidth: 1.5,
    borderBottomColor: "#b4b4b4",
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "flex-start",
    // width: '100%',
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    user_data: state.login,
    update_user: state.save_user,
    gotUserdata: state.user_data,
  };
};

export default connect(
  mapStateToProps,
  {
    saveuser,
    get_user_data,
    //getstates
  }
)(Orders);
