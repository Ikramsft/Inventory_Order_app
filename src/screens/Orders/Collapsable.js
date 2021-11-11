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
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Alert,
    Share,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import EviIcon from 'react-native-vector-icons/EvilIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FoundIcon from 'react-native-vector-icons/Foundation'
import FearIcon from 'react-native-vector-icons/Feather';
import { ListItem } from 'react-native-elements'
import CollapsibleList from 'react-native-collapsible-list'
import { Grid, Row, Col } from 'react-native-easy-grid'
import { CheckBox, Button, Overlay } from 'react-native-elements'
import { connect } from "react-redux";
import { FONT_GOOGLE_BARLOW_SEMIBOLD, FONT_GOOGLE_BARLOW_REGULAR } from "../../constants/fonts";
import { TouchableHighlight } from "react-native-gesture-handler";
class Collapsable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isCollapse: false,
            countOverlay: false,
            count: 0.0,
            imageoverlay: false,
            textcount: '0',
            istext: false
        }
    }
    componentDidMount = () => {
        this.setState({ count: this.props.data.qty, textcount: this.props.data.qty })

    }

    togglecouneoverlay = () => {

        this.setState({ countOverlay: false, count: 0 })
    }
    toggleimageoverlay = () => {

        this.setState({ imageoverlay: false, })
    }
    updateSummary = (qtycount, oper) => {
        var count = 0
        if (this.state.istext == false) {
            if (oper == 1) {
                count = parseInt(this.props.data.qty) + 2;
            } else {
                count = parseInt(this.props.data.qty) - 2;
            }
        }
        else {
            if (oper == 1) {
                count = parseInt(this.props.data.qty) + parseInt(this.state.textcount)

            } else {
                count = parseInt(this.props.data.qty) - parseInt(this.state.textcount)

            }
        }
        this.setState({ count: count })

        var data = {
            do: "SetQty",
            userid: this.props.data.userid,
            listingid: this.props.data.listingid.toLowerCase(),
            qty: count
        }
        this.props.qtyinventory(data).then(() => {
            this.props.refeshMethod()
            this.setState({ countOverlay: false, textcount: this.props.quantity.qty })
        })

    }
    showimage = () => {
        this.setState({ imageoverlay: true })
    }

    shobtnasstatus = (status) => {
        if (status == "1") {
            return (
                <TouchableOpacity
                    style={{ width: 120, height: 25, borderRadius: 5, backgroundColor: '#4682B4', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {

                    }}>
                    <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.labels.order_waiting}</Text>
                </TouchableOpacity>
            )
        } else if (status == "2") {
            return (
                <TouchableOpacity
                    style={{ width: 120, height: 25, borderRadius: 5, backgroundColor: '#d8b21a', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {

                    }}>
                    <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.labels.order_progress}</Text>
                </TouchableOpacity>
            )
        } else if (status == "3") {
            return (
                <TouchableOpacity
                    style={{ width: 120, height: 25, borderRadius: 5, backgroundColor: '#f94456', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {

                    }}>
                    <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.labels.order_closed}</Text>
                </TouchableOpacity>
            )
        } else if (status == "5") {
            return (
                <TouchableOpacity
                    style={{ width: 120, height: 25, borderRadius: 5, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {

                    }}>
                    <Text style={{ fontSize: 13, color: '#fff', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.props.labels.order_ready}</Text>
                </TouchableOpacity>
            )
        }
    }


    showbtntype = (status) => {
        switch (status) {
            case "1":
                return (
                    <Text style={style.ordertypetext}>{this.props.labels.order_pickup}</Text>
                )
                break;

            case "2":
                return (
                    <Text style={style.ordertypetext}>{this.props.labels.order_delivery}</Text>
                )
                break;

            case "3":
                return (

                    <Text style={style.ordertypetext}>{this.props.labels.order_div}</Text>
                )
                break;
            case "4":
                return (
                    <Text style={style.ordertypetext}>{this.props.labels.order_reciept}</Text>
                )
                break;
        }

    }

    render() {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var item = this.props.data
        var labels = this.props.labels
        var finaldat = "";
        if (item.invoice_date != "") {
            var datetime = item.invoice_date.split("-");
            var date = datetime[0].split("/");
            finaldat = months[date[0] - 1] + " " + date[1] + " " + datetime[1]
        }
        return (
            <View style={[style.element]}>
                <TouchableOpacity style={{
                    marginLeft: 15, marginRight: 15,
                    borderColor: '#ECECEC',
                    marginBottom: 10,
                    shadowColor: "#ccc",
                    shadowOffset: {
                        width: 0,
                        height: 7,
                    },
                    shadowOpacity: 1.2,
                    shadowRadius: 7.11,
                    elevation: 10,
                }}
                    onPress={() => {
                        var data = {
                            orderid: item.order_number,
                            onload: this.props.onload
                        }
                        this.props.navigation.navigate("OrderDetail", data)
                    }}
                >
                    <ImageBackground
                        source={require("../../assets/stripes.jpg")}
                        style={{
                            width: '100%', resizeMode: "cover",
                        }}

                    >

                        <Grid style={{ height: 110, paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>
                            <Row size={25}>
                                <Col style={{ paddingLeft: 0 }}><Text style={{ fontSize: 16 }}>{item.invoice_date != "" ? datetime[0] + " " + datetime[1] : ""}</Text></Col>
                            </Row>
                            <Row size={75}>

                                <Col size={85}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <View style={{ height: 25, width: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#000' }}>
                                            <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{"# " + item.order_number}</Text>

                                        </View>
                                        {
                                            this.showbtntype(item.order_type)
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                                        <View style={{ marginRight: 10 }}>
                                            {
                                                this.shobtnasstatus(item.order_status)
                                            }
                                        </View>
                                        <View style={{
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontSize: 16, marginLeft: 5 }}>{item.order_type == "3" ? item.address : item.dlvrytime}</Text>
                                        </View>
                                    </View>
                                </Col>
                                <Col size={15} style={{}}

                                    onPress={() => {
                                        var data = {
                                            orderid: item.order_number,
                                            onload: this.props.onload
                                        }
                                        this.props.navigation.navigate("OrderDetail", data)
                                    }}>
                                    <View style={[{ backgroundColor: '#00b8e4', height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }]}>
                                        <AntIcon name="plus" size={18} color="#fff" />
                                    </View>

                                </Col>
                            </Row>
                        </Grid>
                    </ImageBackground>
                </TouchableOpacity>
            </View >
        )
    }

}
const style = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        height: "80%",
        backgroundColor: '#f6f6f6'
    },
    extrainput: {
        marginLeft: 0,
        height: 50,
        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
        fontSize: 16,
        color: '#0f3e53',
    },
    drop: {
        height: 70,
        borderBottomWidth: 1.5,
        borderBottomColor: '#b4b4b4',
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'flex-start'
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
        marginTop: 10,
    },

    colapseView: {
        backgroundColor: '#fff',
        // height: 380,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7.11,
        //padding: 10,
        paddingTop: 15,
        elevation: 10,
        //margin: 5
    },

    rowborder: {
        borderColor: '#000',
        borderWidth: 0.5,
        height: 45,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5

    },
    ordertypetext: { marginLeft: 15, fontSize: 16, color: '#000', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD },
    roundimage: { height: 70, width: '23%', marginRight: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 10 }
})

export default (Collapsable);