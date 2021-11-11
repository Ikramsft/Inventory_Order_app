import React from "react";
import {
    PermissionsAndroid,
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
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    Alert,
    BackHandler,
    FlatList,
    TextInput,
    RefreshControl,
    Linking
} from "react-native";
import {
    getMaterCat,
    getsub1,
    getsub2,

} from '../Inventory/actions';
import { getOrders } from './actions';
import { getDahboarddata, getoustckdata } from '../Dashoard/actions'
import Icon from 'react-native-vector-icons/FontAwesome'
import EviIcon from 'react-native-vector-icons/EvilIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FoundIcon from 'react-native-vector-icons/Foundation'
import FontisoIcon from 'react-native-vector-icons/Fontisto'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FearIcon from 'react-native-vector-icons/Feather';
import { AppStyles } from "../../utility/AppStyles";
import Logo from '../../components/Logo';
import { Col, Row, Grid } from "react-native-easy-grid";
import { connect } from "react-redux";
import {
    isFieldEmpty, objectLength, capitalize
} from '../../utility';
import { CheckBox, Button, Overlay, ListItem, Badge } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../components/Header';
import HeaderBar from '../../components/HeaderBar'
import Collapsable from "./Collapsable";
import { FONT_GOOGLE_BARLOW_SEMIBOLD } from "../../constants/fonts";
import messaging from '@react-native-firebase/messaging';
import DropdownAlert from 'react-native-dropdownalert';
const heightScreen = Dimensions.get('screen').height;
const widthScreen = Dimensions.get("screen").width;
class Orders extends React.Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.refeshMethod = this._refreshData.bind(this);
        this.createNotificationListener()
        this.state = {
            user_data: null,
            isloading: true,
            notfound: true,
            sortoverlay: false,
            orders: [],
            refreshing: false,
            current_page: 0,
            last_id: 0,
            orderdata: null,
            totalitems: 0,
            mastercat: '',
            sub1_str: '',
            sub2_str: '',
            searchtag: '',
            sku: '',
            countOverlay: false,
            ischanges: false,
            logintype: null,
            sorttype: '',
            sortby: '1',
            ischildloading: false,
            inwaiting: 0,
            inprogress: 0,
            inready: 0,
            closed: 0,
            timer: 0,
        }
    }
    onEndReachedCalledDuringMomentum = true
    componentDidMount = () => {
        this.props.navigation.setParams({
            labels: this.props.label
        });
        this.onload()
        Linking.addEventListener('url', this.handleOpenURL);
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        clearInterval(this.clockCall);
    }
    handleOpenURL = (event) => {
        this.refeshMethod()
    }
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
                                    this.props.navigation.navigate("Dashboard")// BackHandler.exitApp()
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

    createNotificationListener = async () => {
        this.notificationListener = messaging().onMessage((notification) => {
            if (this.dropDownAlertReforderlist != null && this.dropDownAlertReforderlist != undefined) {
                this.dropDownAlertReforderlist.alertWithType('success', notification.notification.title, notification.notification.body);
                this._refreshData()

            }


        });

        this.notificationOpen = messaging().onNotificationOpenedApp((notificationOpen) => {

            var data = null;

            if (Platform.OS == "android") {
                data = notificationOpen.notification;
            } else {

                data = notificationOpen.notification;

            }

            this._refreshData()

        });

        this.backgroundNotification = messaging().setBackgroundMessageHandler(async notificationOpen => {
            var data = null;
            if (Platform.OS == "android") {
                data = notificationOpen.notification;
            } else {

                data = notificationOpen.notification;

            }
            this._refreshData()
        });
        this.initialNotification = messaging().getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    var data = null;

                    if (Platform.OS == "android") {
                        data = notificationOpen.notification;
                    } else {

                        data = notificationOpen.notification;

                    }
                    this._refreshData()
                }

            });
    }

    navi_redirect = async () => {
        var data = {
            orderid: order_id,
            onload: this.onload()
        }
    }
    _onTap = data => {
        this.navi_redirect()
    };
    onload = () => {
        this.get_logintype().then((response) => {
            this.setState({ logintype: response })
            this.get_user_data().then(data => {
                this.setState({ user_data: data, }, () => {
                    var data1 = {
                        do: "GetOrders",
                        userid: data.UserId,
                        Current_Page: 0,
                        showstat: this.state.sortby,
                        search: this.state.searchtag
                    }
                    this.props.getOrders(data1).then(() => {
                        if (this.props.orders.ResponseCode == "1") {
                            this.setState({
                                isloading: false,
                                ischildloading: false,
                                orderdata: this.props.orders,
                                orders: this.props.orders.InventoryData,



                                sortby: this.state.sortby
                            })

                            this.setState({ inwaiting: this.props.orders.stat_wait, })

                            this.setState({ inready: this.props.orders.stat_ready, })

                            this.setState({ inprogress: this.props.orders.stat_process, })

                            this.setState({ closed: this.props.orders.stat_closed, })

                        } else {
                            this.setState({
                                isloading: false,
                                orders: [],
                                ischildloading: false,
                                inwaiting: this.state.sortby == 1 ? 0 : this.state.inwaiting,
                                inprogress: this.state.sortby == 2 ? 0 : this.state.inprogress,
                                closed: this.state.sortby == 3 ? 0 : this.state.closed,
                                inready: this.state.sortby == 5 ? 0 : this.state.inready,

                                sortby: this.state.sortby
                            })
                            this.onsort("3")
                        }
                    })
                })
            })
            //   BackHandler.addEventListener("hardwareBackPress", this.onBackPress);



        })
    }
    searchmethod = () => {
        if (this.state.searchtag != "") {
            this.setState({ ischildloading: true }, () => {
                this.get_logintype().then((response) => {
                    this.setState({ logintype: response })
                    this.get_user_data().then(data => {
                        this.setState({ user_data: data, }, () => {
                            var data1 = {
                                do: "GetOrders",
                                userid: data.UserId,
                                Current_Page: this.state.searchtag == "" ? this.state.current_page : 0,
                                showstat: this.state.sortby,
                                search: this.state.searchtag
                            }
                           
                            this.props.getOrders(data1).then(() => {
                                console.log("GetOrders response",this.props.orders)
                                if (this.props.orders.ResponseCode == "1") {
                                    this.setState({
                                        isloading: false,
                                        ischildloading: false,
                                        orderdata: this.props.orders,
                                        orders: this.props.orders.InventoryData,



                                        sortby: this.state.sortby
                                    })
                                    if (this.state.sortby == 1) {
                                        this.setState({ inwaiting: this.props.orders.stat_wait, })
                                    } else if (this.state.sortby == 2) {
                                        this.setState({ inprogress: this.props.orders.stat_process, })
                                    } else if (this.state.sortby == 5) {
                                        this.setState({ inready: this.props.orders.stat_ready, })
                                    } else {
                                        this.setState({ closed: this.props.orders.stat_closed, })
                                    }
                                } else {
                                    this.setState({
                                        isloading: false,
                                        orders: [],
                                        ischildloading: false,

                                        sortby: this.state.sortby
                                    })
                                    if (this.state.sortby == 1) {
                                        this.setState({ inwaiting: 0, })
                                    } else if (this.state.sortby == 2) {
                                        this.setState({ inprogress: 0, })
                                    } else if (this.state.sortby == 5) {
                                        this.setState({ inready: 0, })
                                    } else {
                                        this.setState({ closed: 0, })
                                    }
                                }
                            })
                        })
                    })
                    //   BackHandler.addEventListener("hardwareBackPress", this.onBackPress);



                })
            })
        }

    }
    get_logintype = async () => {

        const loagintype = await AsyncStorage.getItem('logintype')


        var response = JSON.parse(loagintype);
        return response
    }

    onBackPress = () => {
    };


    get_user_data = async () => {

        const user_data = await AsyncStorage.getItem('user_data')


        var response = JSON.parse(user_data);
        return response
    }

    handleLoadMore = async () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            this.setState({ current_page: this.state.current_page + 1 }, () => {

                this.get_logintype().then((response) => {
                    this.setState({ logintype: response })
                    this.get_user_data().then(data => {
                        var data1 = {
                            do: "GetOrders",
                            userid: data.UserId,
                            Current_Page: this.state.current_page,
                            search: this.state.searchtag,
                            showstat: this.state.sortby
                        }
                        this.props.getOrders(data1).then(() => {
                            if (this.props.orders.ResponseCode == "1") {
                                var result = [...this.state.orders, ...this.props.orders.InventoryData]
                                this.setState({ orders: result }, () => {
                                    this.setState({ isloading: false })
                                })
                            }
                        })

                    })


                })
                this.onEndReachedCalledDuringMomentum = true;

            })
        }

    }

    _renderItem = ({ item }) => {
        const labels = this.props.label
        return (
            <Collapsable
                data={item}
                navigation={this.props.navigation}
                labels={labels}
                refeshMethod={this.refeshMethod}
                user_data={this.state.user_data}
                onload={this.refeshMethod}
            />

        );
    }
    _refreshData = async () => {
        this.setState({ ischildloading: true, searchtag: '' }, () => {
            this.onload();
        })

    }
    togglecouneoverlay = () => {
        this.setState({ sortoverlay: false, })
    }

    onsort = (sort) => {
        //this.refeshMethod()
        this.setState({ ischildloading: true, sortby: sort, searchtag: '', current_page: 0 }, () => {
            this.get_logintype().then((response) => {
                this.setState({ logintype: response })
                this.get_user_data().then(data => {
                    var data1 = {
                        do: "GetOrders",
                        userid: data.UserId,
                        Current_Page: this.state.current_page,
                        search: this.state.searchtag,
                        showstat: sort == "0" ? "" : sort
                    }
                    this.props.getOrders(data1).then(() => {
                        if (this.props.orders.ResponseCode == "1") {
                            this.setState({
                                user_data: data,
                                isloading: false,
                                ischildloading: false,
                                orders: this.props.orders.InventoryData,
                                inwaiting: this.props.orders.stat_wait,
                                inready: this.props.orders.stat_ready,
                                inprogress: this.props.orders.stat_process,
                                closed: this.props.orders.stat_closed,

                            })
                        } else {
                            this.setState({ isloading: false, ischildloading: false, orders: [] })
                        }
                    })

                })
            })
        })
    }

    render() {
        const { orders } = this.state;
        if (this.state.isloading) {
            return (
                <ImageBackground
                    source={require("../../assets/bg-YELLOW.jpg")}
                    style={{ width: '100%', height: '100%', resizeMode: "cover", }}
                >
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', flex: 1
                    }}>
                        <ActivityIndicator
                            size="large"
                        />
                    </View>
                </ImageBackground>
            )
        } else if (objectLength(orders) == 0) {
            const labels = this.props.label
            return (


                <ImageBackground
                    source={require("../../assets/bg-YELLOW.jpg")}
                    style={{
                        width: "100%",
                        height: "100%",


                        overflow: 'hidden'
                    }}
                    imageStyle={{
                        resizeMode: "cover",
                        height: Platform.OS === "android" ? 480 : 550,

                    }}
                >
                    <HeaderBar navigation={this.props.navigation} user_data={this.state.user_data} />

                    <Grid style={{ backgroundColor: '#fff' }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : null}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}
                                contentContainerStyle={style.container}
                            >
                                <Row style={{
                                    justifyContent: 'center', alignItems: 'center',
                                }}
                                    size={heightScreen > 670 ? 13 : 15}>
                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "1" ? '#E8E8E8' : "#fff",
                                        // paddingTop: 5

                                    }}
                                        onPress={() => {
                                            this.onsort("1")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.inwaiting}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: '#4682B4'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}
                                            containerStyle={{
                                                // marginBottom: 10
                                            }}
                                            title={this.state.inwaiting ? this.state.inwaiting : "0"}
                                            onPress={() => {
                                                this.onsort("1")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_waiting}</Text>
                                    </Col>
                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "2" ? '#E8E8E8' : "#fff",

                                    }}
                                        onPress={() => {
                                            this.onsort("2")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.inprogress}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: '#d8b21a'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}

                                            title={this.state.inprogress ? this.state.inprogress : "0"}
                                            onPress={() => {
                                                this.onsort("2")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_progress}</Text>
                                    </Col>
                                </Row>
                                <Row style={{
                                    justifyContent: 'center', alignItems: 'center',
                                }}
                                    size={heightScreen > 670 ? 13 : 15}>
                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "5" ? '#E8E8E8' : "#fff",


                                    }}
                                        onPress={() => {
                                            this.onsort("5")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.closed}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: 'green'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}

                                            title={this.state.inready ? this.state.inready : "0"}
                                            onPress={() => {
                                                this.onsort("5")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_ready}</Text>
                                    </Col>

                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "3" ? '#E8E8E8' : "#fff",


                                    }}
                                        onPress={() => {
                                            this.onsort("3")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.closed}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: '#f94456'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}

                                            title={this.state.closed ? this.state.closed : "0"}
                                            onPress={() => {
                                                this.onsort("3")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_closed}</Text>
                                    </Col>
                                </Row>
                            </ScrollView>
                        </KeyboardAvoidingView>

                        <Row size={90}>

                            <View style={style.container}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10, marginLeft: 15, marginRight: 15 }}>

                                    <View style={{
                                        paddingLeft: 5,
                                        paddingRight: 5,
                                        height: 50,
                                        width: '100%',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        backgroundColor: '#fff'
                                    }}>

                                        <TextInput
                                            ref={(input) => { this.search_textinput = input; }}
                                            style={{
                                                width: '90%', paddingLeft: 15, height: 50, position: 'absolute', flex: 1
                                            }}
                                            value={(this.state.searchtag)}
                                            onChangeText={text => {
                                                this.setState({ searchtag: text })
                                                // () => {
                                                if (text == "") {
                                                    this.refeshMethod()
                                                }

                                            }}
                                            overflow="hidden"
                                            returnKeyType="search"
                                            autoCapitalize="words"
                                            placeholder={labels.order_search_label}
                                            onSubmitEditing={() => this.searchmethod()}
                                            placeholderTextColor="black"
                                            onFocus={() => {
                                                if (this.state.searchtag != "")
                                                    this.setState({ searchtag: '' }, () => {
                                                        this._refreshData()
                                                    })
                                            }}
                                        />

                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                // Platform.OS == "android" ? this.search_textinput.blur() : null
                                                Platform.OS == "android" ? console.log('The app crashing was fixed') : null
                                                this.searchmethod()

                                            }}
                                        >
                                            {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}> */}

                                            <FearIcon name="search" size={25} style={{ position: "absolute", right: 10, marginVertical: 10 }} color="black" />

                                            {/* </View> */}
                                        </TouchableWithoutFeedback>

                                    </View>
                                </View>
                                {
                                    this.state.ischildloading == true ?
                                        <ActivityIndicator size="small" />
                                        : null
                                }

                                {
                                    this.state.ischanges == true ?
                                        <ActivityIndicator size="small" />
                                        : null
                                }
                                {
                                    <FlatList
                                        data={[{ "key": 1 }]}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={() => {
                                            return (
                                                <View style={{}}>
                                                    <Text style={{ textAlign: 'center', marginTop: 15, fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>NO RESULTS - Try a different search</Text>
                                                </View>
                                            )
                                        }
                                        }
                                        refreshControl={

                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={this._refreshData}
                                            />
                                        }
                                        onEndReached={this.handleLoadMore}
                                        onEndReachedThreshold={0.1}
                                        onMomentumScrollBegin={() => {
                                            this.onEndReachedCalledDuringMomentum = false;
                                        }}
                                    />
                                }
                            </View>

                        </Row>
                    </Grid>
                    <Overlay
                        overlayStyle={{ width: '80%', maxHeight: 240, justifyContent: 'center', alignItems: 'center' }}
                        isVisible={this.state.sortoverlay} onBackdropPress={this.togglecouneoverlay}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("1")
                                    this.setState({ sorttype: labels.order_waiting, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_waiting}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("2")
                                    this.setState({ sorttype: labels.order_progress, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_progress}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("4")
                                    this.setState({ sorttype: labels.order_deleted, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_deleted}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("5")
                                    this.setState({ sorttype: labels.order_ready, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_ready}</Text>
                            </TouchableOpacity>

                        </View>
                    </Overlay>

                    <DropdownAlert
                        ref={ref => (this.dropDownAlertReforderlist = ref)}
                        containerStyle={style.content}
                        showCancel={true}
                        onCancel={this._onCancel}
                        onTap={this._onTap}
                        titleNumOfLines={2}
                        messageNumOfLines={0}
                        onClose={this._onClose}
                        successImageSrc={require('../../assets/dropbox.png')}
                        imageStyle={{
                            height: 40,
                            width: 40,
                            borderRadius: 360
                        }}
                    />

                </ImageBackground >

            );
        } else {
            const labels = this.props.label

            return (

                <ImageBackground
                    source={require("../../assets/bg-YELLOW.jpg")}
                    style={{
                        width: "100%",
                        height: "100%",


                        overflow: 'hidden'
                    }}
                    imageStyle={{
                        resizeMode: "cover",
                        height: Platform.OS === "android" ? 480 : 550,

                    }}
                >
                    <HeaderBar navigation={this.props.navigation} user_data={this.state.user_data} />


                    <Grid style={{ backgroundColor: '#fff' }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : null}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}
                                contentContainerStyle={style.container}
                            >
                                <Row style={{
                                    justifyContent: 'center', alignItems: 'center',
                                }}
                                    size={heightScreen > 670 ? 13 : 15}>
                                    <Col style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "1" ? '#E8E8E8' : "#fff",
                                        // paddingTop: 5

                                    }}
                                        onPress={() => {
                                            this.onsort("1")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.inwaiting}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: '#4682B4'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}
                                            containerStyle={{
                                                // marginBottom: 10
                                            }}
                                            title={this.state.inwaiting ? this.state.inwaiting : "0"}
                                            onPress={() => {
                                                this.onsort("1")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_waiting}</Text>
                                    </Col>

                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "2" ? '#E8E8E8' : "#fff",

                                    }}
                                        onPress={() => {
                                            this.onsort("2")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.inprogress}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: '#d8b21a'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}

                                            title={this.state.inprogress ? this.state.inprogress : "0"}
                                            onPress={() => {
                                                this.onsort("2")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_progress}</Text>
                                    </Col>
                                </Row>
                                <Row style={{
                                    justifyContent: 'center', alignItems: 'center',
                                }}
                                    size={heightScreen > 670 ? 13 : 15}>
                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "5" ? '#E8E8E8' : "#fff",

                                    }}
                                        onPress={() => {
                                            this.onsort("5")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.inprogress}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: 'green'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}

                                            title={this.state.inready ? this.state.inready : "0"}
                                            onPress={() => {
                                                this.onsort("5")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_ready}</Text>
                                    </Col>
                                    <Col style={{

                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: this.state.sortby == "3" ? '#E8E8E8' : "#fff",


                                    }}
                                        onPress={() => {
                                            this.onsort("3")

                                        }}
                                    >
                                        {/* <Text style={{ fontSize: 15 }}>{objectLength(this.state.orderdata) == 0 ? '0' : this.state.closed}</Text> */}
                                        <Button
                                            buttonStyle={{
                                                borderRadius: 50,
                                                height: 45,
                                                width: 45,
                                                margin: 5,
                                                backgroundColor: '#f94456'
                                            }}
                                            titleStyle={{
                                                fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
                                                fontSize: 10
                                            }}

                                            title={this.state.closed ? this.state.closed : "0"}
                                            onPress={() => {
                                                this.onsort("3")

                                            }}
                                        />
                                        <Text style={{ fontSize: 15 }}>{labels.order_closed}</Text>
                                    </Col>
                                </Row>

                            </ScrollView>
                        </KeyboardAvoidingView>

                        <Row size={90}>

                            <View style={style.container}>

                                <View style={{
                                    marginTop: 10,
                                    marginRight: 15,
                                    marginLeft: 15,
                                    height: 50,
                                    marginBottom: 10,

                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    backgroundColor: '#fff'
                                }}>

                                    <TextInput
                                        ref={(input) => { this.search_textinput = input; }}
                                        style={{
                                            width: '90%', paddingLeft: 15, height: 50, position: 'absolute', flex: 1
                                        }}
                                        value={(this.state.searchtag)}
                                        onChangeText={text => {
                                            this.setState({ searchtag: text })
                                            // () => {
                                            if (text == "") {
                                                this.refeshMethod()
                                            }

                                        }}
                                        overflow="hidden"
                                        returnKeyType="search"
                                        autoCapitalize="words"
                                        placeholder={labels.order_search_label}
                                        onSubmitEditing={() => this.searchmethod()}
                                        placeholderTextColor="black"
                                        onFocus={() => {
                                            if (this.state.searchtag != "")
                                                this.setState({ searchtag: '' }, () => {
                                                    this._refreshData()
                                                })
                                        }}
                                    />
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            Platform.OS == "android" ? this.search_textinput.blur() : null
                                            this.searchmethod()

                                        }}
                                    >
                                        {/* <View style={{ justifyContent: 'center', alignItems: 'center', margin: 5 }}> */}

                                        <FearIcon name="search" size={25} style={{ position: "absolute", right: 10, marginVertical: 10 }} color="black" />

                                        {/* </View> */}
                                    </TouchableWithoutFeedback>
                                    {/* <TouchableOpacity
                                        onPress={() => {
                                            this.searchmethod()

                                        }}
                                        style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <FearIcon name="search" size={25} />
                                    </TouchableOpacity> */}


                                </View>
                                {
                                    this.state.ischildloading == true ?
                                        <ActivityIndicator size="small" />
                                        : null
                                }

                                {
                                    this.state.ischanges == true ?
                                        <ActivityIndicator size="small" />
                                        : null
                                }
                                {


                                    <FlatList

                                        data={orders}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={
                                            this._renderItem
                                        }
                                        refreshControl={

                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={this._refreshData}
                                            />
                                        }
                                        onEndReached={this.handleLoadMore}
                                        onEndReachedThreshold={0.1}
                                        onMomentumScrollBegin={() => {
                                            this.onEndReachedCalledDuringMomentum = false;
                                        }}
                                    />
                                }
                            </View>

                        </Row>
                    </Grid>
                    <Overlay
                        overlayStyle={{ width: '80%', maxHeight: 240, justifyContent: 'center', alignItems: 'center' }}
                        isVisible={this.state.sortoverlay} onBackdropPress={this.togglecouneoverlay}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("1")
                                    this.setState({ sorttype: labels.order_waiting, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_waiting}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("2")
                                    this.setState({ sorttype: labels.order_progress, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_progress}</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("4")
                                    this.setState({ sorttype: labels.order_deleted, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_deleted}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort("5")
                                    this.setState({ sorttype: labels.order_ready, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 13 }}>{labels.order_ready}</Text>
                            </TouchableOpacity>
                        </View>
                    </Overlay>


                    <DropdownAlert
                        ref={ref => (this.dropDownAlertReforderlist = ref)}
                        containerStyle={style.content}
                        showCancel={true}
                        onCancel={this._onCancel}
                        onTap={this._onTap}
                        titleNumOfLines={2}
                        messageNumOfLines={0}
                        onClose={this._onClose}
                        successImageSrc={require('../../assets/dropbox.png')}
                        imageStyle={{
                            height: 40,
                            width: 40,
                            borderRadius: 360
                        }}
                    />


                </ImageBackground >

            );
        }
    }
}

const style = StyleSheet.create({
    content: {
        backgroundColor: "green",
    },
    size: {
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    container: {
        width: '100%',
        backgroundColor: '#f6f6f6'
    },
    droptitle: {
        fontSize: 14,
        color: '#000',
        marginBottom: 5,
        marginLeft: 10,
    },
    listItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    wrapperCollapsibleList: {
        overflow: "hidden",
        backgroundColor: "#FFF",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7.11,

        elevation: 10,
    },
    collapsibleItem: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#CCC",
        height: 150,
        paddingLeft: 30
    },
    listItemContainer: {
        height: 100,
        justifyContent: 'center',

        width: '100%',
        borderColor: '#ECECEC',
        marginBottom: 5,

    },
    naviicon:
    {
        height: "100%",
        width: 80,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7.11,

        elevation: 10,
    },
    element: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7.11,

        elevation: 10,
        margin: 5
    },
    drop: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#b4b4b4',
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // width: '100%'
    },
    sortbtn: {
        marginBottom: 15
    }
})

const mapStateToProps = state => {
    return {
        label: state.language.data,
        orders: state.order_list.data
    };
};

export default connect(
    mapStateToProps,
    {
        getOrders
    }
)(Orders);

