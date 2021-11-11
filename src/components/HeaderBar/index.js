import React, { memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { CheckBox, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import EviIcon from "react-native-vector-icons/EvilIcons";
import IoIcon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import FoundIcon from "react-native-vector-icons/Foundation";
import FearIcon from "react-native-vector-icons/Feather";
import { Grid, Row, Col } from "react-native-easy-grid";
import { getalerts } from "../../screens/Dashoard/actions";
import { connect } from "react-redux";
import { FONT_GOOGLE_BARLOW_SEMIBOLD } from "../../constants/fonts";
class HeaderBar extends React.Component {
  onEndReachedCalledDuringMomentumNoti = true;
  constructor(props) {
    super(props);
    this.state = {
      ismodelvisible: false,
      Current_PageF_Noti: 1,
    };
  }
  showalerts = () => {
    this.setState({ ismodelvisible: true, isalertload: true }, () => {
      var data = {
        do: "GetAlerts",
        userid: this.props.user_data.UserId,
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
  handleLoadMoreNotification = async () => {
    if (!this.onEndReachedCalledDuringMomentumNoti) {
      try {
        this.setState(
          { Current_PageF_Noti: this.state.Current_PageF_Noti + 1 },
          () => {
            var data = {
              do: "GetAlerts",
              userid: this.props.user_data.UserId,
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
  render() {
    return (
      <View
        style={{
          paddingBottom: 5,
          width: "100%",
          paddingLeft: 15,
          paddingRight: 15,
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        <View style={{ width: "50%" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 360,

              marginTop: Platform.OS === "ios" ? 40 : 10,
            }}
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          >
            <FearIcon name="menu" size={22} color="black" />
          </TouchableOpacity>
        </View>
        {// this.props.user_data.CompanyName != "" ?
          true ? (
            <View
              style={{
                width: "50%",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              {/* <TouchableOpacity
                                style={{
                                    //    backgroundColor: '#fff',
                                    height: 30,
                                    width: 30,
                                    //borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',


                                }}
                                onPress={() => {
                                    this.showalerts()
                                    //this.setState({ ismodelvisible: !this.state.ismodelvisible })
                                }}
                            >
                                <IoIcon name="ios-notifications" size={35} color={"#fff"} />
                                <View style={{
                                    backgroundColor: 'red',
                                    height: 17,
                                    width: 17,
                                    borderRadius: 360,
                                    position: 'absolute',
                                    top: 1, left: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{ color: '#fff', fontSize: 10, }}>10+</Text>
                                </View>
                            </TouchableOpacity> */}

              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  paddingTop: 3,
                  marginTop: Platform.OS === "ios" ? 40 : 10,
                }}
                onPress={() => {
                  if (this.props.isback == true) {
                    this.props.onBackPress();
                  } else {
                    this.props.navigation.goBack(null);
                  }
                }}
              >
                <Image source={require("../../assets/back.png")} />
              </TouchableOpacity>
            </View>
          ) : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.ismodelvisible}
          onRequestClose={() => { }}
        >
          <TouchableOpacity
            style={{ height: "10%", width: "100%" }}
            onPress={() => {
              this.setState({ ismodelvisible: false });
            }}
          >
            <Text>{""}</Text>
          </TouchableOpacity>
          <View
            style={{
              height: "90%",
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
                    // style={{flex:1}}
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

                            {/* <Text>notification title</Text> */}
                          </Col>
                        </Row>
                      );
                    }}
                    refreshControl={
                      <></>
                      // <RefreshControl
                      //   refreshing={this.state.refreshing}
                      //   onRefresh={this._refreshData}
                      // />
                    }
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
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    // backgroundColor: '#ccc'
    // padding: 10,
    // width: '100%',
    // height: '100%',
    // paddingBottom: 150,
    //justifyContent: 'center',
    // alignItems: 'center'
  },
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
    //fontFamily: FONT_GOOGLE_SANS_REGULAR
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
    // shadowColor: "#000",
    // shadowOffset: {
    //     width: 0,
    //     height: 7,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 7.11,

    // elevation: 10,
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

    alerts: state.alerts,
  };
};

export default connect(
  mapStateToProps,
  {
    getalerts,
  }
)(HeaderBar);
