import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  Button,
  Linking,
  Share,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { Avatar, ListItem, Divider, Overlay } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import EviIcon from "react-native-vector-icons/EvilIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import FoundIcon from "react-native-vector-icons/Foundation";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Grid, Row, Col } from "react-native-easy-grid";
import AsyncStorage from "@react-native-community/async-storage";
import { select_lang, logout } from "../screens/Language/actions";
import { english, spanish } from "../constants/languages";
import DeviceInfo from "react-native-device-info";
import { capitalize } from "../utility";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import messaging, {
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import {
  FONT_GOOGLE_BARLOW_REGULAR,
  FONT_GOOGLE_BARLOW_SEMIBOLD,
} from "../constants/fonts";
import InAppBrowser from "react-native-inappbrowser-reborn";
class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.refeshMethod = this.refeshMethod.bind(this);
    this.state = {
      fullname: "",
      profilepic: "",
      fullname: "",
      profileImg: "",
      userid: 0,
      user_data: null,
      isloading: true,
      isModalVisible: false,
      isenglish: false,
      token: "",
      islogout: false,
      logintype: null,
      select_lang: 0,
    };
  }
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidMount = async () => {
    let token;
    token = await messaging().getToken();

    this.setState({ logintype: { userType: 0 }, token: token });
    
    var userdata = await this.get_user_data();
    this.get_user_data().then((data) => {
      this.get_logintype().then((response) => {
        // if (response != null)

        this.setState({ user_data: data }, () => {
          this.get_selected_language().then((lang) => {
            if (lang != null) {
              this.setState({ select_lang: lang.select_lang });
            } else {
              this.setState({ isloading: false });
            }
            this.setState({ logintype: response });
            this.setState({ isloading: false, token: token });
          });
        });
      });
    });
  };
  get_selected_language = async () => {
    const loagintype = await AsyncStorage.getItem("language");
    var response = JSON.parse(loagintype);
    return response;
  };
  get_logintype = async () => {
    const loagintype = await AsyncStorage.getItem("logintype");

    var response = JSON.parse(loagintype);
    return response;
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
  get_user_data = async () => {
    const user_data = await AsyncStorage.getItem("user_data");

    var response = JSON.parse(user_data);
    return response;
  };
  store_selected_lang = async (data) => {
    try {
      await AsyncStorage.setItem("language", JSON.stringify(data));
    } catch (e) {
      // saving error
    }
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onShare = async () => {
    try {
      const labels = this.props.label;
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
      
      // var url = this.state.user_data.CompanyName.toUpperCase() + " invited you. please visit given address  " + this.state.user_data.UserName.toLowerCase() + ".kizbin.com"
      const result = await Share.share(
        {
          message: url,
          title: subjectline,
        },
        {
          subject: subjectline,
        }
      );
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      if (error && error.message) {
        Alert.alert(error.message);
      }
    }
  };

  select_language = () => {
    this.setState({ isenglish: !this.state.isenglish }, () => {
      if (this.state.isenglish === false) {
        var selected_lang = {
          select_lang: 1,
        };
        this.store_selected_lang(selected_lang);
        this.setState({ select_lang: 1 });
        this.props.select_lang(english);
      } else {
        var selected_lang = {
          select_lang: 2,
        };
        this.store_selected_lang(selected_lang);
        this.setState({ select_lang: 2 });
        this.props.select_lang(spanish);
      }
    });
  };
  refeshMethod = () => { };
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

  store_selected_lang = async (data) => {
    try {
      await AsyncStorage.setItem("language", JSON.stringify(data));
    } catch (e) { }
  };
  render() {
    const l = this.props.label;
    if (this.state.isloading == true) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <>
          <Grid style={{ backgroundColor: "#snow" }}>
            <Row size={87}>
              <Col>
                <ScrollView style={styles.container}>
                  <View
                    style={{
                      // height: "32%",
                      width: "100%",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      borderBottomWidth: 0.5,
                      marginTop: 30,
                    }}
                  >
                    {/* <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("Dashboard");
                      }}
                    >
                      <Image source={require("../assets/kizbin-homer.png")} />
                    </TouchableOpacity> */}
                    {/* <Image  source={{
                uri: this.state.profileImg,
              }}
               style={styles.image} /> */}
                    <Text
                      style={{
                        color: "#00b8e4",
                        marginTop: 5,
                        marginBottom: 15,
                        letterSpacing: 2,
                        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                        fontSize: 20,
                      }}
                    >
                      {capitalize(
                        this.state.user_data.CompanyName ||
                        this.state.user_data?.companyname
                      )}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: 15,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.select_language();
                        }}
                      >
                        <Text
                          style={{ fontWeight:l.home==='Home'?'bold':'100',fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        >
                          ENGLISH |
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.select_language();
                        }}
                      >
                        <Text
                          style={{fontWeight:l.home!=='Home'?'bold':'100', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        >
                          {" "}
                          ESPAÑOL{" "}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ width: "100%", marginBottom: 40 }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("Dashboard");
                        this.props.navigation.closeDrawer();
                      }}
                    >
                      <ListItem
                        title={l.home}
                        titleStyle={{
                          fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                        }}
                        containerStyle={styles.listItemContainer}
                        rightElement={<></>}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#00b8e4", },
                            ]}
                          >
                            <Icon name="home" size={25} color="#fff" />
                          </View>
                        }
                      />
                    </TouchableOpacity>
                    <Divider />



                    {this.state.logintype.UserType == 3 ||
                      this.state.logintype.usertype == 3 ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate("Inventory");
                          this.props.navigation.closeDrawer();
                        }}
                      >
                        <ListItem
                          title={l.add_inventory}
                          titleStyle={{
                            fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          }}
                          containerStyle={styles.listItemContainer}
                          rightElement={<></>}
                          leftIcon={
                            <View
                              style={[
                                styles.lefticon,
                                { backgroundColor: "#019a4a" },
                              ]}
                            >
                              <Icon name="dropbox" size={25} color="#fff" />
                            </View>
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <View opacity={0.5}>
                        <TouchableOpacity
                          onPress={() => {
                            //    this.props.navigation.navigate("Inventory")
                            //this.props.navigation.closeDrawer()
                          }}
                        >
                          <ListItem
                            title={l.add_inventory}
                            titleStyle={{
                              fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                            }}
                            containerStyle={styles.listItemContainer}
                            rightElement={<></>}
                            leftIcon={
                              <View
                                style={[
                                  styles.lefticon,
                                  { backgroundColor: "#019a4a" },
                                ]}
                              >
                                <Icon name="dropbox" size={25} color="#fff" />
                              </View>
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    <Divider />
                    <TouchableOpacity
                      onPress={() => {
                        var data = {
                          refeshMethod: this.refeshMethod,
                        };
                        this.props.navigation.navigate("Search", { data });
                        this.props.navigation.closeDrawer();
                      }}
                    >
                      <ListItem
                        title={l.search_inventory}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        containerStyle={styles.listItemContainer}
                        rightElement={<></>}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#6cd4e1" },
                            ]}
                          >
                            <EviIcon name="search" size={30} color="#fff" />
                          </View>
                        }
                      />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("Orders");
                        this.props.navigation.closeDrawer();
                      }}
                    >
                      <ListItem
                        title={l.orders}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#f5aa01" },
                            ]}
                          >
                            <EviIcon name="cart" size={30} color="#fff" />
                          </View>
                        }
                      />
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity
                      onPress={() => {
                        this.openLink(); // this.setState({ isModalVisible: true })
                        this.props.navigation.closeDrawer();
                      }}
                    >
                      <ListItem
                        title={l.create_order}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#6d217c" },
                            ]}
                          >
                            <FoundIcon
                              name="shopping-cart"
                              size={25}
                              color="#fff"
                            />
                          </View>
                        }
                      />
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity
                      onPress={() => {
                        this.onShare();

                        this.props.navigation.closeDrawer();
                      }}
                    >
                      <ListItem
                        title={l.share_your_site}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#3f4545" },
                            ]}
                          >
                            <FoundIcon name="share" size={25} color="#fff" />
                          </View>
                        }
                      />
                    </TouchableOpacity>

                    <Divider />
                    {/* <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("SubsCription");
                      }}
                    >
                      <ListItem
                        title={"Subscription"}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#3f4545" },
                            ]}
                          >
                            <MaterialIcon
                              name="subscriptions"
                              size={25}
                              color="#fff"
                            />
                          </View>
                        }
                      />
                    </TouchableOpacity>
                    <Divider /> */}
                    {/* <ListItem

                      title={""}
                      containerStyle={styles.listItemContainer}


                    /> */}
                  </View>
                </ScrollView>
              </Col>
            </Row>
            <Row size={17} style={{ backgroundColor: "#fff" }}>
              <Col>
                <View
                  style={[
                    styles.container,
                    {
                      backgroundColor: "#fff",
                      position: "absolute",
                      bottom: 0,
                    },
                  ]}
                >
                  {this.state.logintype.UserType == 3 ||
                    this.state.logintype.usertype == 3 ? (
                    <TouchableOpacity
                      style={{ backgroundColor: "#fff" }}
                      onPress={() => {
                        this.props.navigation.navigate("Profile");
                        this.props.navigation.closeDrawer();
                      }}
                    >
                      <ListItem
                        title={l.your_profile}
                        titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                        containerStyle={[
                          styles.listItemContainer,
                          { backgroundColor: "#fff" },
                        ]}
                        leftIcon={
                          <View
                            style={[
                              styles.lefticon,
                              { backgroundColor: "#f5aa01" },
                            ]}
                          >
                            <Icon name="user" size={25} color="#fff" />
                          </View>
                        }
                      />
                    </TouchableOpacity>
                  ) : (
                    <View opacity={0.5}>
                      <TouchableOpacity
                        style={{ backgroundColor: "#fff" }}
                        onPress={() => {
                          // this.props.navigation.navigate("Profile");
                          // this.props.navigation.closeDrawer();
                        }}
                      >
                        <ListItem
                          title={l.your_profile}
                          titleStyle={{
                            fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          }}
                          containerStyle={[
                            styles.listItemContainer,
                            { backgroundColor: "#fff" },
                          ]}
                          leftIcon={
                            <View
                              style={[
                                styles.lefticon,
                                { backgroundColor: "#f5aa01" },
                              ]}
                            >
                              <Icon name="user" size={25} color="#fff" />
                            </View>
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  <Divider />

                  <TouchableOpacity
                    style={{
                      paddingBottom: 15,
                      paddingTop: 15,
                      backgroundColor: "#00b8e4",
                      height: 65,
                      width: "100%",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      var data = {
                        do: "Logout",
                        userid: this.state.user_data.UserId,
                        token: this.state.token,
                        osname: Platform.OS,
                        device_id: DeviceInfo.getUniqueId(),
                      };
                      this.setState({ islogout: true }, () => {
                        this.props.logout(data).then(() => {
                          if (this.props.logout_data.data.ResponseCode == "1") {
                            //  AsyncStorage.clear();
                            this.store_logintype(null);
                            this.store_user_data(null);
                            // var selected_lang = {
                            //   select_lang: this.state.select_lang
                            // }
                            
                            // this.store_selected_lang(selected_lang)
                            this.props.navigation.navigate("Language");
                          } else {
                            alert("Something went wrong");
                          }
                          
                        });
                      });

                      //
                    }}
                  >
                    {this.state.islogout == true ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                          fontSize: 20,
                          textAlign: "center",
                        }}
                      >
                        {l.logout}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Col>
            </Row>
          </Grid>

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
            <Button
              title="Create Order"
              onPress={() => {
                this.openLink();
                //  Linking.openURL("https://" + this.state.user_data.UserName.toLowerCase() + ".kizbin.com/buyers/index.php");
              }}
            />
            {/* <Text>{"https://" + this.state.user_data.UserName.toLowerCase() + ".kizbin.com/buyers/index.php"}</Text> */}
          </Overlay>
        </>
      );
    }
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "row",
  },
  lefticon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 130,
    //marginBottom: 12,
    borderRadius: 100,
    resizeMode: "stretch",
  },
  container: {
    //flex: 1,
    // alignItems: "flex-start",
    //paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#f3f3f3",
  },
  listItemContainer: {
    height: Platform.OS == "ios" ? 50 : 40,
    justifyContent: "center",
    // marginTop: 7,
    marginBottom: 5,
    marginTop: 5,
    //marginBottom: 10,
    borderColor: "#000",
    //borderWidth:1,
    backgroundColor: "transparent",
    width: "100%",
    //borderColor: '#ECECEC',
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    logout_data: state.log_out,
  };
};

export default connect(
  mapStateToProps,
  {
    logout,

    select_lang,
  }
)(DrawerContainer);
