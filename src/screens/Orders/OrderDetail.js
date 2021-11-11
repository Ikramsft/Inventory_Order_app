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
    Keyboard,
    TouchableOpacity,
    Alert,
    BackHandler,
    FlatList,
    TextInput,
    Linking,
    Share
} from "react-native";
import {
    getMaterCat,
    getsub1,
    getsub2,

} from '../Inventory/actions';
import { getorderbyid, setorderstatus } from './actions';
import { getDahboarddata, getoustckdata } from '../Dashoard/actions'
import Icon from 'react-native-vector-icons/FontAwesome'
import EviIcon from 'react-native-vector-icons/EvilIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FoundIcon from 'react-native-vector-icons/Foundation'
import FearIcon from 'react-native-vector-icons/Feather';
import { AppStyles } from "../../utility/AppStyles";
import Logo from '../../components/Logo';
import { Col, Row, Grid } from "react-native-easy-grid";
import { connect } from "react-redux";
import {
    isFieldEmpty, objectLength, capitalize
} from '../../utility';
import { CheckBox, Button, Overlay, ListItem } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../components/Header';
import Collapsable from "./Collapsable";
import { FONT_GOOGLE_BARLOW_SEMIBOLD, FONT_GOOGLE_BARLOW_REGULAR, FONT_GOOGLE_SANS_BOLD } from "../../constants/fonts";
import { user_data } from "../Login/reducer";
import { set } from "react-native-reanimated";
import HeaderBar from '../../components/HeaderBar';
import DropdownAlert from 'react-native-dropdownalert';
import messaging from '@react-native-firebase/messaging';
class OrderDetails extends React.Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.refeshMethod = this._refreshData.bind(this);

        this.state = {
            isbarcode: false,
            user_data: null,
            isloading: true,
            notfound: true,
            sortoverlay: false,
            //infinite loading list
            orderinfo: null,
            orderdetail: null,
            refreshing: true,
            last_id: 0,
            current_page: 0,
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
            order_status: '',
            issubmiting: false,
            onreloadorder: false,
            timer: 0,
        }
    }
    onEndReachedCalledDuringMomentum = true
    componentDidMount = () => {
        this.createNotificationListener();
        this.props.navigation.setParams({
            labels: this.props.label
        });
        this.onload();
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        Linking.addEventListener('url', this.handleOpenURL);
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        clearInterval(this.clockCall);
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
                                    this.props.navigation.navigate("Dashboard")
                                }
                            },

                            {
                                text: lables.int_option2,
                                onPress: () => {
                                    var labels = this.props.label
                                    this.onload();

                                }
                            },


                        ],
                        { cancelable: false }
                    );
                }
            });
        }
    };
    handleOpenURL = (event) => {
        this.props.navigation.navigate("Orders")
    }

    createNotificationListener = async () => {
        this.notificationListener = messaging().onMessage((notification) => {
            if (this.dropDownAlertRef2 != null && this.dropDownAlertRef2 != undefined) {
                this.dropDownAlertRef2.alertWithType('success', notification.notification.title, notification.notification.body);
            }


        });

        this.notificationOpen = messaging().onNotificationOpenedApp((notificationOpen) => {
            var data = null;
            if (notificationOpen != undefined) {
                if (Platform.OS == "android") {
                    data = notificationOpen.notification;
                } else {

                    data = notificationOpen.notification;

                }

                if (data.title != undefined) {
                    this.props.navigation.navigate("Orders")
                }
            }
        });

        this.backgroundNotification = messaging().setBackgroundMessageHandler(async notificationOpen => {
            var data = null;
            if (Platform.OS == "android") {
                data = notificationOpen.notification;
            } else {

                data = notificationOpen.notification;

            }


            if (data.title != undefined) {
                this.props.navigation.navigate("Orders")
            }

        });
    }


    onload = () => {
        this.get_user_data().then((response) => {
            this.setState({ user_data: response, }, () => {
                var orderdata = {
                    do: "GetOrderInfo",
                    userid: this.state.user_data.UserId,
                    order_number: this.props.navigation.state.params.orderid
                }
                this.props.getorderbyid(orderdata).then(() => {
                    console.log("this.props.orderdetail",this.props.orderdetail)
                    this.setState({ orderinfo: this.props.orderdetail, order_status: this.props.orderdetail.order_status }, () => {
                        this.setState({ isloading: false })
                    })

                })
            })

        })
    }

    _onTap = data => {
        this.props.navigation.navigate("Orders")
    };
    onloadonnoti = (orderid) => {
        this.setState({ onreloadorder: true }, () => {
            this.get_user_data().then((response) => {
                this.setState({ user_data: response, }, () => {
                    var orderdata = {
                        do: "GetOrderInfo",
                        userid: this.state.user_data.UserId,
                        order_number: orderid
                    }
                    this.props.getorderbyid(orderdata).then(() => {
                        this.setState({ orderinfo: this.props.orderdetail, order_status: this.props.orderdetail.order_status }, () => {

                        })
                        this.setState({ onreloadorder: false })
                    })
                })

            })
        })
    }

    get_logintype = async () => {

        const loagintype = await AsyncStorage.getItem('logintype')


        var response = JSON.parse(loagintype);
        return response
    }
    componentWillUnmount() {
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

            this.onEndReachedCalledDuringMomentum = true;
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

            />

        );
    }
    _refreshData = async () => {


    }
    togglecouneoverlay = () => {
        this.setState({ sortoverlay: false, })
    }

    onsort = (sort) => {
        this.setState({ sortby: sort == "" ? "" : sort }, () => {
            this.refeshMethod();
        })
    }

    setstatus = () => {
        this.setState({ issubmiting: true }, () => {
            var data = {
                do: "SetOrder",
                userid: this.state.user_data.UserId,
                order_number: this.props.navigation.state.params.orderid,
                order_status: this.state.order_status
            }
            console.log("reqeust", data)
            this.props.setorderstatus(data).then(() => {

                this.props.navigation.state.params.onload()
                console.log("setstatus1", this.props.setstatus)
               
                if (this.state.order_status == 4) {
                 
                    this.setState({ issubmiting: false }, () => {
                        setTimeout(() => {
                            this.setState({ isbarcode: true })
                        }, 200);
                       
                    })
                    //
                } else {
                    this.setState({ issubmiting: false })
                }

            })
        })
    }

    shobtnasstatus = (status) => {
        switch (status) {
            case "1":
                return (
                    <TouchableOpacity
                        onPress={() => {
                            //   alert(1);
                            this.setState({ sortoverlay: true })
                        }}
                        style={{ width: 120, height: 30, borderRadius: 15, backgroundColor: '#4682B4', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Text style={{ fontSize: 13, textAlign: 'center', textAlignVertical: 'center', color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.label.order_waiting}</Text>
                    </TouchableOpacity>
                )
                break;

            case "2":
                return (
                    <TouchableOpacity
                        style={{ width: 120, height: 30, borderRadius: 15, backgroundColor: '#d8b21a', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            //   alert(1);
                            this.setState({ sortoverlay: true })
                        }}>
                        <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.label.order_progress}</Text>
                    </TouchableOpacity>
                )
                break;

            case "3":
                return (
                    <TouchableOpacity
                        style={{ width: 120, height: 30, borderRadius: 15, backgroundColor: '#f94456', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.setState({ sortoverlay: true })
                        }}>
                        <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.label.order_closed}</Text>
                    </TouchableOpacity>
                )
                break;
            case "4":
                return (
                    <TouchableOpacity
                        style={{ width: 120, height: 30, borderRadius: 15, backgroundColor: '#49b8cc', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.setState({ sortoverlay: true })
                        }}>
                        <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.label.order_deleted}</Text>
                    </TouchableOpacity>
                )
                break;
            case "5":
                return (
                    <TouchableOpacity
                        style={{ width: 120, height: 30, borderRadius: 15, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.setState({ sortoverlay: true })
                        }}>
                        <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.label.order_ready}</Text>
                    </TouchableOpacity>
                )
                break;
        }

    }
    onShare = async (order_id) => {
        try {
            const labeled = this.props.label
            var subjectline = labeled.share_instrcution0
            var url = `${labeled.share_instrcution1} ${this.state.orderinfo.order_number} ${labeled.share_instrcution2}`
            await Share.share({
                message: url,
                title: subjectline
            }, {
                subject: subjectline,
            });

        } catch (error) {
            if (error && error.message) {
                Alert.alert(error.message);
            }
        }
    };
    showbtntype = (status) => {
        switch (status) {
            case "1":
                return (
                    <Text style={style.ordertypetext}>{this.props.label.order_pickup}</Text>


                )
                break;

            case "2":
                return (
                    <Text style={style.ordertypetext}>{this.props.label.order_delivery}</Text>
                )
                break;

            case "3":
                return (
                    <Text style={style.ordertypetext}>{this.props.label.order_div}</Text>
                )
                break;
            case "4":
                return (
                    <Text style={style.ordertypetext}>{this.props.label.order_reciept}</Text>
                )
                break;
        }

    }

    showtabletime = (order_type, table, time) => {
        // alert(order_type)
        if (order_type == "1" || order_type == "2") {
            return time;
        } else if (order_type == "3") {
            return table //+ " / " + time;
        } else {
            return ""
        }
        // if (table != "" && time != "") {
        //     return table + " / " + time
        // } else if (table != "") {
        //     return table
        // } else {
        //     return time
        // }
    }
    showtabletitle = (order_type) => {
        // alert(order_type)
        var labels = this.props.label
        if (order_type == "1" || order_type == "2") {
            return labels.order_time
        } else if (order_type == "3") {
            return labels.order_time_table;
        } else {
            return ""
        }
        // if (table != "" && time != "") {
        //     return table + " / " + time
        // } else if (table != "") {
        //     return table
        // } else {
        //     return time
        // }
    }

    render() {
        const { orders } = this.state;
        if (this.state.isloading == true) {
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
        } else {
            const labels = this.props.label
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var item = this.state.orderinfo

            var finaldat = "";
            if (item.invoice_date != "") {
                var datetime = item.invoice_date.split("-");
                var date = datetime[0].split("/");

                finaldat = months[date[0] - 1] + " " + date[1] + " " + datetime[1]
                console.log(finaldat + date[0])
            }
            return (
                <View style={style.container}>

                    <ImageBackground
                        source={require("../../assets/bg-YELLOW.jpg")}
                        style={{
                            width: "100%",
                            height: "100%",

                        }}
                        imageStyle={{
                            resizeMode: "cover",
                            height: '100%',

                        }}
                    >
                        <HeaderBar navigation={this.props.navigation} user_data={this.state.user_data} />

                        <View style={{ backgroundColor: '#fff', flex: 1 }}>
                            {
                                this.state.onreloadorder == true ?
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <ActivityIndicator size="large" />
                                    </View>
                                    :
                                    <FlatList
                                        data={item.OrdersInfo}
                                        keyExtractor={(_, index) => index.toString()}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                        containerStyle={{ height: '100%', flex: 1, }}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View
                                                    style={{
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
                                                        margin: 15,
                                                        marginLeft: 20,
                                                        marginRight: 20
                                                    }}>
                                                    <ImageBackground
                                                        source={require("../../assets/stripes.jpg")}
                                                        style={{
                                                            width: '100%', resizeMode: "contain",
                                                        }}
                                                        resizeMode="stretch"
                                                    >
                                                        <View style={{ width: '100%', }}>
                                                            <Grid style={{ padding: 10, width: '100%', }}>
                                                                <Row style={style.rowstyle}>
                                                                    {/* <Col size={}></Col> */}
                                                                    <Col size={50} style={{ justifyContent: 'center' }}>
                                                                        {/* <Text>{finaldat}</Text> */}
                                                                        <View>
                                                                            {
                                                                                this.showbtntype(item.order_type)
                                                                            }
                                                                        </View>
                                                                    </Col>
                                                                    <Col size={50} style={{ justifyContent: 'center' }}>

                                                                        {
                                                                            this.shobtnasstatus(this.state.order_status)
                                                                        }


                                                                    </Col>
                                                                </Row>

                                                                <Row style={style.rowstyle}>

                                                                    <Col style={{ justifyContent: 'center', }}>

                                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                                                                            <View style={{}}>
                                                                                <Text>{labels.order_cust_name}</Text>
                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD, fontSize: 22, color: '#00b8e4' }}>{item.contactname}</Text>
                                                                            </View>

                                                                        </View>

                                                                    </Col>
                                                                </Row>
                                                                <Row style={style.rowstyle}>

                                                                    <Col size={40} style={{ justifyContent: 'center' }}>
                                                                        <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{labels.order_value}</Text>
                                                                        <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD, fontSize: 25, color: '#00b8e4' }}>{"$" + parseFloat(item.order_value).toFixed(2)}</Text>


                                                                    </Col>
                                                                    <Col size={60} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                        {/* <Text>{labels.order_time_table}</Text> */}
                                                                        <Text>{this.showtabletitle(item.order_type)}</Text>
                                                                        <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD, fontSize: 20, color: '#00b8e4' }}>{this.showtabletime(item.order_type, item.address, item.dlvrytime)}</Text>

                                                                    </Col>

                                                                </Row>
                                                                {
                                                                    item.cellphone !== "" ?

                                                                        <Row style={style.rowstyle}>
                                                                            <Col size={60} style={{ justifyContent: 'center' }}>
                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{labels.order_phone}</Text>
                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD, fontSize: 25, color: '#00b8e4' }}>{item.cellphone != "" ? item.cellphone : "0987654321"}</Text>


                                                                            </Col>
                                                                            <Col size={40} style={{ justifyContent: 'center' }}>
                                                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>

                                                                                    <TouchableOpacity
                                                                                        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#00b8e4', justifyContent: 'center', alignItems: 'center' }}
                                                                                        onPress={() => {
                                                                                            var phone = item.cellphone != "" ? item.cellphone : "9093900003"
                                                                                            let phoneNumber = phone;
                                                                                            if (Platform.OS !== 'android') {
                                                                                                phoneNumber = `telprompt:${phone}`;
                                                                                            }
                                                                                            else {
                                                                                                phoneNumber = `tel:${phone}`;
                                                                                            }
                                                                                            Linking.canOpenURL(phoneNumber)
                                                                                                .then(supported => {
                                                                                                    if (!supported) {
                                                                                                        Alert.alert('Phone number is not available');
                                                                                                    } else {
                                                                                                        return Linking.openURL(phoneNumber);
                                                                                                    }
                                                                                                })
                                                                                                .catch(err => console.log(err));
                                                                                        }}>
                                                                                        <Icon name="phone" color="#fff" size={20} />
                                                                                    </TouchableOpacity>

                                                                                </View>


                                                                            </Col>
                                                                        </Row>
                                                                        : null
                                                                }
                                                                {
                                                                    item.order_type != '3' && item.order_type != '1' ?
                                                                        <>
                                                                            <Row style={style.rowstyle}>

                                                                                <Col style={{ justifyContent: 'center' }}>
                                                                                    <Grid>


                                                                                        <Row style={{ marginBottom: 10 }}>
                                                                                            <Col>
                                                                                                <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_address}</Text>
                                                                                            </Col>
                                                                                            <Col>
                                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.address != "" ? item.address : ""}</Text>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        <Row style={{ marginBottom: 10 }}>
                                                                                            <Col>
                                                                                                <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_city}</Text>
                                                                                            </Col>
                                                                                            <Col>
                                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.city != "" ? item.city : ""}</Text>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        <Row style={{ marginBottom: 10 }}>
                                                                                            <Col>
                                                                                                <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_state}</Text>
                                                                                            </Col>
                                                                                            <Col>
                                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.state != "" ? item.state : ""}</Text>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        <Row style={{ marginBottom: 10 }}>
                                                                                            <Col>
                                                                                                <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_zip}
                                                                                                </Text>
                                                                                            </Col>
                                                                                            <Col>
                                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.zip_postal != "" ? item.zip_postal : ""}</Text>
                                                                                            </Col>
                                                                                        </Row>
                                                                                        {/* <Row style={{ marginBottom: 10 }}>
                                                                            <Col>
                                                                                <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_country}</Text>
                                                                            </Col>
                                                                            <Col>
                                                                                <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.country != "" ? item.country : ""}</Text>
                                                                            </Col>
                                                                        </Row> */}
                                                                                        {
                                                                                            item.factura !== "" ?
                                                                                                <>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_factura}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ color: 'red', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{item.factura != "" ? labels.order_factura_msg : ''}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_company_name}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura1}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_number_street}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura2}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_cologne}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura3}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_municiplity}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura4}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_postalcode}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura5}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_rfc}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura6}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                    <Row style={{ marginBottom: 10 }}>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{labels.order_email}</Text>
                                                                                                        </Col>
                                                                                                        <Col>
                                                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.factura7}</Text>
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                </>
                                                                                                : null
                                                                                        }
                                                                                        {
                                                                                            item.notes != "" && (
                                                                                                <Row style={{ backgroundColor: 'red', padding: 10, marginTop: 10 }}>
                                                                                                    <Col>
                                                                                                        <Text style={{ fontWeight: 'bold', color: "#fff" }}>{labels.order_note}</Text>
                                                                                                        <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR, color: "#fff" }}>{item.notes}</Text>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            )
                                                                                        }


                                                                                    </Grid>
                                                                                </Col>

                                                                            </Row>
                                                                            <Row style={{ marginTop: 10 }}>
                                                                                <Col>
                                                                                    <Button
                                                                                        onPress={() => {
                                                                                            const latitude = "40.7127753";
                                                                                            const longitude = "-74.0059728";
                                                                                            const label = item.address + " " + item.city + " " + item.state + " " + item.country + " " + item.zip_postal;

                                                                                            const url = Platform.select({
                                                                                                ios: "maps:" + latitude + "," + longitude + "?q=" + label,
                                                                                                android: "geo:" + latitude + "," + longitude + "?q=" + label
                                                                                            });
                                                                                            Linking.openURL(url);
                                                                                        }}
                                                                                        title={labels.order_viewinmap}
                                                                                        titleStyle={{ fontSize: 15 }}
                                                                                        buttonStyle={{ backgroundColor: '#727171' }} />
                                                                                </Col>
                                                                            </Row>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <Row></Row>
                                                                            <Row></Row>
                                                                        </>

                                                                }
                                                            </Grid>
                                                        </View>

                                                        <Overlay visible={this.state.issubmiting}>
                                                            <ActivityIndicator />
                                                        </Overlay>
                                                    </ImageBackground>

                                                </View>

                                            )
                                        }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={{
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

                                                    marginLeft: 20,
                                                    marginRight: 20,
                                                    marginBottom: 15,

                                                }}>
                                                    <ImageBackground
                                                        source={require("../../assets/stripes.jpg")}
                                                        style={{
                                                            width: '100%', resizeMode: "contain", marginTop: 15
                                                        }}
                                                        resizeMode="stretch"
                                                    >
                                                        <Grid style={{ padding: 10 }}>
                                                            <Row style={{ height: 100 }}>
                                                                <Col size={20} style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                                                    {
                                                                        item.image_1 == "" ?
                                                                            <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                                            :
                                                                            <Image source={{ uri: "https://kizbin.com/images_kiz/" + this.state.user_data.UserName + "/" + item.image_1 }} style={{ height: '100%', width: '100%', alignSelf: 'center' }} />

                                                                    }

                                                                </Col>
                                                                <Col size={80} style={{ justifyContent: 'center', paddingLeft: 7 }}>


                                                                    <Text style={{ fontSize: 16, fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.prodtitle}</Text>
                                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                                        <Text style={{ fontSize: 16, fontFamily: FONT_GOOGLE_BARLOW_REGULAR, color: '#00b8e4' }}>{item.qty + " "} {labels.OrderDetailsInStock}  |  {item.location}</Text>
                                                                    </View>
                                                                </Col>

                                                            </Row>

                                                            <Row style={{ height: 30, marginBottom: 20, marginLeft: 10 }}>
                                                                <Col style={{ borderRightWidth: 1, borderRightColor: '#ccc' }}>
                                                                    <Text style={{ fontSize: 13 }}>{labels.OrderDetailsOrders}</Text>
                                                                    <Text style={{ fontSize: 13 }}>{item.qty}</Text>
                                                                </Col>
                                                                <Col style={{ paddingLeft: 10, borderRightWidth: 1, borderRightColor: '#ccc' }}>
                                                                    <Text style={{ fontSize: 13 }}>{labels.OrderDetailsStock}</Text>
                                                                    <Text style={{ fontSize: 13 }}>{item.barcode}</Text>
                                                                </Col>
                                                                <Col style={{ paddingLeft: 10, borderRightWidth: 1, borderRightColor: '#ccc' }}>
                                                                    <Text style={{ fontSize: 13 }}>{labels.OrderDetailsColor}</Text>
                                                                    <Text style={{ fontSize: 13 }}>{item.color}</Text>
                                                                </Col>
                                                                <Col style={{ paddingLeft: 10, borderRightWidth: 1, borderRightColor: '#ccc' }}>
                                                                    <Text style={{ fontSize: 13 }}>{labels.OrderDetailsSize}</Text>
                                                                    <Text style={{ fontSize: 13 }}>{item.size}</Text>
                                                                </Col>
                                                            </Row>
                                                            {
                                                                item.itemnote != "" && (
                                                                    <Row style={{ height: 30, marginBottom: 20, }}>
                                                                        <Col size={20} style={{ paddingLeft: 10 }}>
                                                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD, fontWeight: "bold", color: "red" }}>{item.itemnote}</Text>

                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            }
                                                        </Grid>
                                                    </ImageBackground>
                                                </View>
                                            )
                                        }
                                        }

                                        onEndReachedThreshold={0.1}
                                        onMomentumScrollBegin={() => {
                                            this.onEndReachedCalledDuringMomentum = false;
                                        }}
                                    />
                            }
                        </View>


                        <TouchableOpacity style={{
                            backgroundColor: "black",
                            width: '100%', height: 60,
                            position: 'absolute',
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                            onPress={() => {
                                Linking.openURL("https://" + this.state.user_data.UserName + ".kizbin.com/seller/print_receipt.php?cmd=print&order_number=" + item.order_number);

                            }}>
                            <Text style={{ fontSize: 18, color: "#fff" }}>{labels.printlabel}</Text>
                        </TouchableOpacity>



                        <Overlay
                            overlayStyle={{ width: '80%', padding: 10, }}
                            isVisible={this.state.sortoverlay} onBackdropPress={this.togglecouneoverlay}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                                <TouchableOpacity
                                    onPress={() => {

                                        this.setState({ order_status: "1", sortoverlay: false, }, () => {
                                            this.setstatus()
                                        })
                                    }}
                                    style={style.sortbtn}
                                >
                                    <Text style={{ fontSize: 15 }}>{labels.order_waiting}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        //this.onsort(1)
                                        this.setState({ order_status: "2", sortoverlay: false }, () => {
                                            this.setstatus()
                                        })
                                    }}
                                    style={style.sortbtn}
                                >
                                    <Text style={{ fontSize: 15 }}>{labels.order_progress}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {

                                        this.setState({ order_status: "5", sortoverlay: false }, () => {
                                            this.setstatus()
                                        })
                                    }}
                                    style={style.sortbtn}
                                >
                                    <Text style={{ fontSize: 15 }}>{labels.order_ready}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {

                                        this.setState({ order_status: "3", sortoverlay: false }, () => {
                                            this.setstatus()
                                        })
                                    }}
                                    style={style.sortbtn}
                                >
                                    <Text style={{ fontSize: 15 }}>{labels.order_closed}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {

                                        this.setState({ order_status: "4", sortoverlay: false }, () => {
                                            this.setstatus()
                                        })
                                    }}
                                    style={style.sortbtn}
                                >
                                    <Text style={{ fontSize: 15 }}>{labels.order_deleted}</Text>
                                </TouchableOpacity>


                            </View>
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
                            isVisible={this.state.isbarcode}
                            onBackdropPress={() => { this.props.navigation.goBack(null) }}>
                            <View style={{
                                justifyContent: 'center',
                                marginVertical: 5,
                                alignItems: 'center',
                                height: 30,
                            }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{labels.success}</Text>
                            </View>
                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />

                            <View style={{
                                justifyContent: 'center',
                                marginVertical: 5,
                                alignItems: 'center',
                                height: 30,
                            }}>
                                <Text style={{ fontSize: 16 }}>{labels.isexistbarcode}</Text>
                            </View>
                            <View style={{ borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.4)' }} />


                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ isbarcode: false })
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
                            ref={ref => (this.dropDownAlertRef2 = ref)}
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
                    </ImageBackground>


                </View>

            );
        }
    }
}

const style = StyleSheet.create({
    ordertypetext: {
        marginLeft: 0,
        fontSize: 18,
        color: '#000',
        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD
    },

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
        flex: 1
    },
    rowstyle: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    sortbtn: {
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    console.log("orderdetailssstate", state)
    return {
        label: state.language.data,
        setstatus: state.setstatus.data,
        orderdetail: state.orderdetails.data
    };
};

export default connect(
    mapStateToProps,
    {
        setorderstatus,
        getorderbyid
    }
)(OrderDetails);

