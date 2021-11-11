import React from "react";
import {

    StyleSheet,
    View,
    StatusBar,
    Linking,
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
    TextInput, TouchableHighlight
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
import { deleteinventory, summaryinventory, qtyinventory } from './actions'
import { getlocation } from '../Inventory/actions'
//import TextInput from '../../components/TextInput';
import { SliderBox } from "react-native-image-slider-box";
import FastImage from 'react-native-fast-image'
import { FONT_GOOGLE_BARLOW_SEMIBOLD, FONT_GOOGLE_BARLOW_REGULAR } from "../../constants/fonts";
import { TouchableHighlight as TouchableHighlightIOS, ScrollView } from "react-native-gesture-handler";
import { objectLength } from '../../utility'
import {
    delcat,
    addcat,
} from '../Inventory/actions'
const heightScreen = Dimensions.get("screen").height;
const widthScreen = Dimensions.get("screen").width;
class Collapsable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deleteLoading: false,
            isCollapse: false,
            countOverlay: false,
            isprice: false,
            count: 0.0,
            cost: 0,
            price: 0,
            location: '',
            locationarray: [],
            imageoverlay: false,
            textcount: '0',
            istext: false,
            iscostedit: false,
            ispriceedit: false,
            islocationedit: false,
            islocaitonloading: true,
            locationOverlay: false,
            addlocation: false,
            image_1: "",
            location_str: ""
        }
    }
    componentDidMount = () => {

        this.setState({
            count: this.props.data.qty,
            textcount: this.props.data.qty,
            cost: this.props.data.cost,
            price: this.props.data.price,
            location: this.props.data.location
        })

    }
    togglecouneoverlay = () => {

        this.setState({ countOverlay: false, count: 0 })
    }
    toggleimageoverlay = () => {

        this.setState({ imageoverlay: false, })
    }

    updateCPL = (type) => {
        this.props.onchangerefresh()
        if (type == 1) {
            var data = {
                do: "SetPCQL",
                userid: this.props.data.userid,
                listingid: this.props.data.listingid.toLowerCase(),
                qty: this.props.data.qty,
                price: this.props.data.price,
                cost: this.state.cost,
                location: this.props.data.location
            }

        } else if (type == 2) {

            if (this.state.price != "") {
                var data = {
                    do: "SetPCQL",
                    userid: this.props.data.userid,
                    listingid: this.props.data.listingid.toLowerCase(),
                    qty: this.props.data.qty,
                    price: this.state.price,
                    cost: this.props.data.cost,
                    location: this.props.data.location
                }
                this.props.qtyinventory(data).then(() => {

                    this.props.refeshMethod()
                    this.setState({
                        countOverlay: false,
                        iscostedit: false,
                        islocationedit: false,
                        isprice: false,
                        textcount: this.props.issearch == true ? this.props.quantity.qty : "0",
                    })

                })
            }
        } else {

            if (this.state.location != "") {
                var data = {
                    do: "SetPCQL",
                    userid: this.props.data.userid,
                    listingid: this.props.data.listingid.toLowerCase(),
                    qty: this.props.data.qty,
                    price: this.props.data.price,
                    cost: this.props.data.cost,
                    location: this.state.location
                }
                this.props.qtyinventory(data).then(() => {

                    this.props.refeshMethod()
                    this.setState({
                        countOverlay: false,
                        iscostedit: false,
                        islocationedit: false,
                        ispriceedit: false,
                        textcount: this.props.issearch == true ? this.props.quantity.qty : "0",
                    })

                })
            }
        }

    }

    updateSummary = (qtycount, oper) => {
        this.props.onchangerefresh()
        this.setState({ countOverlay: false, })
        var count = 0
        if (this.state.istext == false) {
            if (oper == 1) {
                count = parseFloat(this.props.data.qty) + 1;
            } else {
                count = parseFloat(this.props.data.qty) - 1;
            }
        }
        else {
            if (oper == 0) {
                count = parseFloat(this.state.textcount)

            } else if (oper == 1) {
                count = parseFloat(this.props.data.qty) + 1

            } else if (oper == 2) {
                if (parseFloat(this.props.data.qty) >= 0) {
                    // Alert.alert('Subtraction is permissible')
                    count = parseFloat(this.props.data.qty) - 1
                } else {
                    var label = this.props.labels
                    Alert.alert(label.subtraction_stock)
                    count = parseFloat(this.props.data.qty)
                }
            } else {
                Alert.alert('Error occured')
            }
            this.setState({ istext: false })
        }
        this.setState({ count: count })
        var data = {
            do: "SetPCQL",
            userid: this.props.data.userid,
            listingid: this.props.data.listingid.toLowerCase(),
            qty: count,
            price: this.props.data.price,
            cost: this.props.data.cost,
            location: this.props.data.location
        }
        this.props.qtyinventory(data).then(() => {
            this.props.refeshMethod()
            this.setState({ iscpl: false, countOverlay: false, textcount: this.props.issearch == true ? this.props.quantity.qty : "0", })
        })


    }
    showimage = () => {
        var item = this.props.data

        images = []
        if (item.image_1 != "") {
            images.push(item.image_1)
        }
        if (item.image_2 != "") {
            images.push(item.image_2)
        }
        if (item.image_3 != "") {
            images.push(item.image_3)
        }
        if (item.image_4 != "") {
            images.push(item.image_4)
        }
        if (objectLength(images) > 0) {
            this.setState({ imageoverlay: true })
        }
    }

    showLocationOverLay = () => {

        this.setState({ locationOverlay: true }, () => {

            var data = {
                do: "GetLocation",
                userid: this.props.data.userid,
                suball: 1,
                osname: Platform.OS === "android" ? "and" : "ios"
            }

            this.props.getlocation(data).then(() => {
                if (this.props.location.data.ResponseMsg == "Records Successfully Fetch") {
                    this.setState({ locationarray: this.props.location.data.LocData.split(",") }, () => {

                        this.setState({ islocaitonloading: false })

                    })
                } else {
                    this.setState({ addlocation: true })
                }

            })

        })

    }
    togglelocation = () => {
        this.setState({ locationOverlay: false, addlocation: false });

    };



    addcatagory = (type) => {
        //  this.props.onchangerefresh()
        if (this.state.location_str != "") {
            var data = {
                do: "SetLocation",
                userid: this.props.user_data.UserId,
                osname: Platform.OS === "android" ? "and" : "ios",
                location: this.state.location_str
            };
            var isvalid = true;

            if (isvalid == true) {
                this.props.addcat(data).then(() => {

                    if (this.props.addcatdata.data.ResponseCode == "1") {
                        this.setState({ locationOverlay: false, addlocation: false, location: this.state.location_str })
                        this.updateCPL(3)

                    }
                })
            }
        }
    }


    deleteCatagory(cat, type) {


        var data = {
            do: "DelLocation",
            userid: this.props.user_data.UserId,
            osname: Platform.OS === "android" ? "and" : "ios",
            location: cat
        }
        this.props.delcat(data).then(() => {

            var data = {
                do: "GetLocation",
                userid: this.props.user_data.UserId,
                suball: 1,
                osname: Platform.OS === "android" ? "and" : "ios"
            }

            this.props.getlocation(data).then(() => {
                if (this.props.location.data.ResponseMsg == "Records Successfully Fetch") {
                    this.setState({ locationarray: this.props.location.data.LocData.split(",") }, () => {

                        this.setState({ islocaitonloading: false })

                    })
                } else {
                    this.setState({ addlocation: true })
                }

            })
            // this.setState({ locationOverlay: false })


        })

    }

    render() {
        var item = this.props.data
        var labels = this.props.labels
        images = []
        if (item.image_1 != "") {
            images.push(item.image_1)
        }
        if (item.image_2 != "") {
            images.push(item.image_2)
        }
        if (item.image_3 != "") {
            images.push(item.image_3)
        }
        if (item.image_4 != "") {
            images.push(item.image_4)
        }
        return (

            <View style={[style.element]} >
                {
                    this.state.isCollapse == false ?
                        <TouchableOpacity style={{
                            marginLeft: 10, marginRight: 10,

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
                                this.setState({ isCollapse: !this.state.isCollapse })
                            }}
                        >
                            <ImageBackground
                                source={require("../../assets/stripes.jpg")}
                                style={{
                                    width: '100%', resizeMode: "cover",
                                }}

                            >
                                <View style={{ width: '100%', padding: 10 }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                                        <View style={{ height: 80, width: "20%" }}>

                                            {
                                                item.image_1 == "" ?
                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                    : (
                                                        <Image source={{ uri: item.image_1 + '?' + new Date() }} style={{ height: '100%', width: '100%' }} />
                                                    )

                                            }
                                        </View>
                                        <View style={{ width: "80%", justifyContent: 'center', paddingLeft: 17 }}>
                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{item.prodtitle}</Text>
                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.cat_master}</Text>
                                            {
                                                this.props.issearch == true ?

                                                    <TouchableOpacity
                                                        style={{ width: '50%' }}
                                                        onPress={() => {
                                                            this.props.logintype.UserType == 3 ?
                                                                this.setState({ countOverlay: true })
                                                                : null
                                                        }}>
                                                        <Text style={{ color: '#00b8e4', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{parseFloat(item.qty)} {labels.cout_in_stock}</Text>
                                                    </TouchableOpacity>
                                                    : null}
                                        </View>
                                    </View>



                                    <TouchableOpacity
                                        onPress={() => { this.setState({ isCollapse: !this.state.isCollapse }) }}
                                        style={[{
                                            backgroundColor: '#00b8e4',
                                            height: 40,
                                            width: 40,
                                            borderRadius: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            right: 15,
                                            top: 30
                                        }]}>
                                        <AntIcon name="plus" size={18} color="#fff" />
                                    </TouchableOpacity>

                                </View>

                                {/* 
                                <Grid style={{ height: 100 }}>
                                    <Row>
                                        <Col size={20} style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                            {
                                                item.image_1 == "" ?
                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                    : <Image source={{ uri: item.image_1 }} style={{ height: '100%', width: '100%', alignSelf: 'center' }} />

                                            }

                                        </Col>
                                        <Col size={65} style={{ justifyContent: 'center', paddingLeft: 7 }}>


                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{item.prodtitle}</Text>
                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.cat_master}</Text>
                                            {
                                                this.props.issearch == true ?

                                                    <TouchableOpacity
                                                        style={{ width: '50%' }}
                                                        onPress={() => {
                                                            this.setState({ countOverlay: true })
                                                        }}>
                                                        <Text style={{ color: '#00b8e4', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{parseFloat(item.qty)} {labels.cout_in_stock}</Text>
                                                    </TouchableOpacity>
                                                    : null}
                                        </Col>
                                        <Col size={15} style={{ justifyContent: 'center', paddingRight: 8 }}

                                            onPress={() => {
                                                this.setState({ isCollapse: !this.state.isCollapse })
                                            }}>
                                            <View style={[{ backgroundColor: '#00b8e4', height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }]}>
                                                <AntIcon name="plus" size={18} color="#fff" />
                                            </View>

                                        </Col>
                                    </Row>
                                </Grid> */}


                            </ImageBackground>
                        </TouchableOpacity>

                        :
                        <ScrollView style={{
                            marginLeft: 15,
                            marginRight: 15,
                            //minHeight: 500,
                            borderColor: '#ECECEC',
                            //marginBottom: 10,
                            shadowColor: "#ccc",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,

                            elevation: 3,

                        }}>
                            <ImageBackground
                                source={require("../../assets/stripes.jpg")}
                                style={{
                                    width: '100%', resizeMode: "contain",
                                }}
                                resizeMode="stretch"
                            >

                                <View style={{ width: '100%', paddingRight: 10, paddingLeft: 10, paddingTop: 10 }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                                        <View style={{ height: 80, width: "20%" }}>

                                            {
                                                item.image_1 == "" ?
                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                    : <Image source={{ uri: item.image_1 + '?' + new Date() }} style={{ height: '100%', width: '100%' }} />

                                            }
                                        </View>
                                        <View style={{ width: "80%", justifyContent: 'center', paddingLeft: 17 }}>
                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{item.prodtitle}</Text>
                                            <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR }}>{item.cat_master}</Text>
                                            {
                                                this.props.issearch == true ?

                                                    <TouchableOpacity
                                                        style={{ width: '50%' }}
                                                        onPress={() => {
                                                            this.props.logintype.UserType == 3 ?
                                                                this.setState({ countOverlay: true })
                                                                : null
                                                        }}>
                                                        <Text style={{ color: '#00b8e4', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{parseFloat(item.qty)} {labels.cout_in_stock}</Text>
                                                    </TouchableOpacity>
                                                    : null}
                                        </View>
                                    </View>

                                    <Text style={{ fontFamily: FONT_GOOGLE_BARLOW_REGULAR, textAlign: 'justify', marginBottom: 5, marginTop: 5 }}>{

                                        item.description
                                    }</Text>

                                    <TouchableOpacity
                                        onPress={() => { this.setState({ isCollapse: !this.state.isCollapse }) }}
                                        style={[{
                                            backgroundColor: '#00b8e4',
                                            height: 40,
                                            width: 40,
                                            borderRadius: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            right: 15,
                                            top: 30
                                        }]}>
                                        <AntIcon name="minus" size={18} color="#fff" />
                                    </TouchableOpacity>

                                </View>
                                <Grid style={{}}>

                                    <Row size={60} style={{ marginTop: 10 }}>

                                        <View>
                                            <Grid style={{ paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
                                                {
                                                    this.props.isassociate == 1 ?

                                                        <Row style={style.rowborder}>
                                                            <Col size={30} style={{ justifyContent: 'center' }}>
                                                                <Text>{labels.search_company}</Text>
                                                            </Col>
                                                            <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}>
                                                                <View>
                                                                    <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{item.CompanyName}</Text>

                                                                </View>
                                                            </Col>
                                                        </Row>
                                                        :
                                                        null}
                                                {
                                                    this.props.isassociate == 1 ?

                                                        <Row style={style.rowborder}>
                                                            <Col size={30} style={{ justifyContent: 'center' }}>
                                                                <Text>{labels.order_address}</Text>
                                                            </Col>
                                                            <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}>
                                                                <View>
                                                                    <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{item.Address}</Text>

                                                                </View>
                                                            </Col>
                                                        </Row>
                                                        :
                                                        null}
                                                {
                                                    this.props.isassociate == 1 ?

                                                        <Row style={style.rowborder}>
                                                            <Col size={30} style={{ justifyContent: 'center' }}>
                                                                <Text>{labels.search_city}</Text>
                                                            </Col>
                                                            <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}>
                                                                <View>
                                                                    <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{item.City}</Text>

                                                                </View>
                                                            </Col>
                                                        </Row>
                                                        :
                                                        null}
                                                {
                                                    this.props.isassociate == 1 ?

                                                        <Row style={style.rowborder}>
                                                            <Col size={30} style={{ justifyContent: 'center' }}>
                                                                <Text>{labels.search_phone}</Text>
                                                            </Col>
                                                            <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}>
                                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{item.StorePhone}</Text>
                                                                    <TouchableOpacity
                                                                        style={{ width: 30, position: 'absolute', right: 20, height: 30, borderRadius: 15, backgroundColor: '#00b8e4', justifyContent: 'center', alignItems: 'center' }}
                                                                        onPress={() => {

                                                                            var phone = item.StorePhone != "" ? item.StorePhone : "9093900003"

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
                                                        :
                                                        null}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        {
                                                            this.props.logintype.UserType == 3 ?
                                                                item.userid == this.props.user_data.UserId ?

                                                                    this.setState({ isprice: true, price: this.props.data.price })
                                                                    : null
                                                                : null
                                                        }
                                                    }}
                                                >
                                                    <Row style={style.rowborder}>

                                                        <Col size={30} style={{ justifyContent: 'center' }}>
                                                            <Text>{labels.price}</Text>
                                                        </Col>
                                                        <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}>

                                                            <View>
                                                                <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{item.price}</Text>
                                                                {
                                                                    this.props.logintype.UserType == 3 ?
                                                                        item.userid == this.props.user_data.UserId ?

                                                                            <TouchableOpacity
                                                                                style={{ position: 'absolute', right: 20 }}
                                                                                onPress={() => {

                                                                                    item.userid == this.props.user_data.UserId ?

                                                                                        this.setState({ isprice: true, price: this.props.data.price })
                                                                                        : null


                                                                                }}>
                                                                                <Icon name="pencil" size={17} color='#00b8e4' />
                                                                            </TouchableOpacity>
                                                                            : null
                                                                        : null}
                                                            </View>


                                                        </Col>
                                                    </Row>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        {
                                                            this.props.logintype.UserType == 3 ?
                                                                item.userid == this.props.user_data.UserId ?

                                                                    this.setState({ countOverlay: !this.state.countOverlay, textcount: this.props.data.qty })
                                                                    : null
                                                                : null
                                                        }
                                                    }}
                                                >
                                                    <Row style={style.rowborder}>
                                                        <Col size={30} style={{ justifyContent: 'center' }}>
                                                            <Text>{labels.placeholder_quantity}</Text>

                                                        </Col>
                                                        <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}
                                                        >
                                                            <View>
                                                                <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{item.qty}</Text>
                                                                {this.props.logintype.UserType == 3 ?
                                                                    item.userid == this.props.user_data.UserId ?

                                                                        <TouchableOpacity
                                                                            style={{ position: 'absolute', right: 20 }}
                                                                            onPress={() => {
                                                                                {
                                                                                    item.userid == this.props.user_data.UserId ?

                                                                                        this.setState({ countOverlay: !this.state.countOverlay, textcount: this.props.data.qty })
                                                                                        : null

                                                                                }
                                                                            }}>
                                                                            <Icon name="pencil" size={17} color='#00b8e4' />
                                                                        </TouchableOpacity>
                                                                        : null
                                                                    : null}
                                                            </View>

                                                        </Col>
                                                    </Row>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    {
                                                        this.props.logintype.UserType == 3 ?
                                                            item.userid == this.props.user_data.UserId ?

                                                                this.showLocationOverLay() : null
                                                            : null
                                                    }
                                                }}>
                                                    <Row style={style.rowborder}>
                                                        <Col size={30} style={{ justifyContent: 'center' }}
                                                        >
                                                            <Text>{labels.location}</Text>
                                                        </Col>
                                                        <Col size={70} style={{ paddingLeft: 10, justifyContent: 'center' }}
                                                        >

                                                            <View>
                                                                <Text style={{ color: '#00b8e4', textAlign: 'center' }}>{this.state.location}</Text>
                                                                {
                                                                    this.props.logintype.UserType == 3 ?
                                                                        item.userid == this.props.user_data.UserId ?

                                                                            <TouchableOpacity
                                                                                style={{ position: 'absolute', right: 20 }}
                                                                                onPress={() => {

                                                                                    item.userid == this.props.user_data.UserId ?

                                                                                        this.showLocationOverLay() : null

                                                                                }}>
                                                                                <Icon name="pencil" size={17} color='#00b8e4' />
                                                                            </TouchableOpacity>
                                                                            : null
                                                                        : null}
                                                            </View>

                                                        </Col>


                                                    </Row>
                                                </TouchableOpacity>

                                                <Row style={{ height: 70 }}>
                                                    <Col style={style.roundimage}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({ imageshow: item.image_1 }, () => {
                                                                    this.showimage()
                                                                })

                                                            }}>
                                                            {
                                                                item.image_1 == "" ?
                                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                                    : <Image source={{ uri: item.image_1 + '?' + new Date() }} style={{ height: '100%', width: '100%', borderRadius: 10 }} resizeMode="stretch" />

                                                            }
                                                        </TouchableOpacity>
                                                    </Col>
                                                    <Col style={style.roundimage}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({ imageshow: item.image_2 }, () => {
                                                                    this.showimage()
                                                                })

                                                            }}>
                                                            {
                                                                item.image_2 == "" ?
                                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                                    : <Image source={{ uri: item.image_2 + '?' + new Date() }} style={{ height: '100%', width: '100%', borderRadius: 10 }} resizeMode="cover" />

                                                            }
                                                        </TouchableOpacity>
                                                    </Col>
                                                    <Col style={style.roundimage}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({ imageshow: item.image_3 }, () => {
                                                                    this.showimage()
                                                                })

                                                            }}>


                                                            {
                                                                item.image_3 == "" ?
                                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                                    : <Image source={{ uri: item.image_3 + '?' + new Date() }} style={{ height: '100%', width: '100%', borderRadius: 10 }} resizeMode="stretch" />

                                                            }
                                                        </TouchableOpacity>
                                                    </Col>
                                                    <Col style={[style.roundimage, { marginRight: -10 }]}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({ imageshow: item.image_4 }, () => {
                                                                    this.showimage()
                                                                })

                                                            }}>
                                                            {
                                                                item.image_4 == "" ?
                                                                    <Image source={require("../../assets/logo.png")} style={{ height: '100%', width: '100%' }} />
                                                                    : <Image source={{ uri: item.image_4 + '?' + new Date() }} style={{ height: '100%', width: '100%', borderRadius: 10 }} resizeMode="stretch" />

                                                            }
                                                        </TouchableOpacity>
                                                    </Col>
                                                </Row>

                                                <Row style={{ height: 50, marginTop: 15 }}>

                                                    {
                                                        item.username &&

                                                        <Col>
                                                            <Button
                                                                title={labels.sharebtn}
                                                                // disabled={item.userid == this.props.user_data.UserId ? false : true}
                                                                disabled={false}
                                                                containerStyle={{ margin: 6 }}
                                                                buttonStyle={{ backgroundColor: '#009a49' }}
                                                                titleStyle={{ fontSize: 14, fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                                onPress={async () => {
                                                                    try {
                                                                        var subjectline = this.props.user_data.CompanyName.toUpperCase() + labels.subjectline_for_share
                                                                        var url = this.props.user_data.CompanyName.toUpperCase() + ' ' + labels.sharemsg + ' ' + '  https://' + item.username.toLowerCase() + '.kizbin.com/buyers/product-details.php?index.php&listingid=' + item.listingid + '&tab=1'// The stock number is ' + item.listingid + '. Please view it here: www.' + this.props.user_data.UserName + '.kizbin.com'

                                                                        await Share.share({
                                                                            message: url,
                                                                            title: subjectline
                                                                        },
                                                                            {
                                                                                subject: subjectline,
                                                                            });

                                                                    } catch (error) {
                                                                        if (error && error.message) {
                                                                            Alert.alert(error.message);
                                                                        }
                                                                    }


                                                                }}
                                                            />
                                                        </Col>

                                                    }
                                                    {
                                                        this.props.logintype.UserType == 3 && item.Associate === 0 ?
                                                            <Col>
                                                                <Button
                                                                    title={labels.editbtn}
                                                                    titleStyle={{ fontSize: 14, fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                                    onPress={() => {
                                                                        var data = {
                                                                            listingid: item.listingid.toLowerCase(),
                                                                            refreshmethod: this.props.refeshMethod,
                                                                        }
                                                                        this.props.navigation.navigate("EditInventory", { data });
                                                                    }}
                                                                    containerStyle={{ margin: 6 }}
                                                                    buttonStyle={{ backgroundColor: '#00b8e4' }}
                                                                    // disabled={item.userid == this.props.user_data.UserId ? false : true}
                                                                    disabled={false}

                                                                />
                                                            </Col>

                                                            :
                                                            null
                                                    }
                                                    {
                                                        this.props.logintype.UserType == 3 && item.Associate === 0 ?

                                                            <Col>
                                                                <Button
                                                                    title={labels.deletebtn}
                                                                    titleStyle={{ fontSize: 14, fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                                    onPress={() => {

                                                                        Alert.alert(
                                                                            '',
                                                                            `${this.props.labels.confirm_delete_msg} ${item.listingid}`,
                                                                            [

                                                                                {
                                                                                    text: 'No',
                                                                                    onPress: () => {

                                                                                    },
                                                                                    style: 'cancel'
                                                                                },
                                                                                {
                                                                                    text: 'Yes',
                                                                                    onPress: () => {
                                                                                        var data = {
                                                                                            do: 'DeleteInventory',
                                                                                            osname: Platform.OS === "android" ? 'and' : 'ios',
                                                                                            userid: item.userid,
                                                                                            listingid: item.listingid
                                                                                        }
                                                                                        this.setState({ deleteLoading: true }, () => {
                                                                                            this.props.deleteinventory(data).then(() => {
                                                                                                if (this.props.deleteStock.data.ResponseCode == 1) {
                                                                                                    this.props.refeshMethod()
                                                                                                    this.setState({ isCollapse: false, deleteLoading: false })

                                                                                                }
                                                                                            })
                                                                                        });
                                                                                    }
                                                                                }
                                                                            ],
                                                                            { cancelable: false }
                                                                        );
                                                                    }}
                                                                    containerStyle={{ margin: 6 }}
                                                                    buttonStyle={{ backgroundColor: '#fb4357' }}
                                                                    // disabled={item.userid == this.props.user_data.UserId ? false : true}
                                                                    disabled={false}
                                                                />
                                                            </Col>

                                                            : null
                                                    }
                                                </Row>

                                            </Grid>
                                        </View>
                                    </Row>
                                </Grid>
                            </ImageBackground>
                        </ScrollView>


                }
                <Overlay
                    overlayStyle={{ width: '80%', padding: 10, height: 70, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', }}
                    isVisible={this.state.countOverlay} onBackdropPress={this.togglecouneoverlay} >


                    {/* <Row> */}
                    {Platform.OS == "android" ?
                        <TouchableHighlight
                            onPress={() => {


                                // var count = parseFloat(this.state.count)
                                //alert(count.toString())
                                //if (count > 0) {
                                //  this.setState({ count: count.toString() })
                                this.updateSummary(1, 2);
                                //  }
                            }}
                            style={{ borderColor: '#000', borderWidth: 1, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>


                            <AntIcon name="minus" size={25} color="#000" />

                        </TouchableHighlight>
                        :
                        <TouchableHighlightIOS
                            onPress={() => {


                                // var count = parseFloat(this.state.count)
                                //alert(count.toString())
                                //if (count > 0) {
                                //  this.setState({ count: count.toString() })
                                this.updateSummary(1, 2);
                                //  }
                            }}
                            style={{ borderColor: '#000', borderWidth: 1, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>


                            <AntIcon name="minus" size={25} color="#000" />

                        </TouchableHighlightIOS>

                    }

                    <View style={{ paddingLeft: 15, paddingRight: 15, width: '60%' }}>
                        <TextInput


                            style={[style.drop, style.extrainput, { marginRight: 0, height: 40, textAlign: 'center' }]}
                            placeholder={labels.placeholder_count}
                            keyboardType={Platform.OS === "android" ? "phone-pad" : "numbers-and-punctuation"}
                            onSubmitEditing={() => this.updateSummary(1, 0)}
                            value={this.state.textcount}
                            // label={"Count"}
                            onChangeText={text => {

                                this.setState({ textcount: text, count: text, istext: true })

                            }}
                            onFocus={() => {
                                this.setState({ textcount: '' })
                            }}
                            onBlur={() => {
                                // this.setState({ textcount: this.props.data.qty })
                            }}

                            underlineColorAndroid='transparent'


                        />
                    </View>

                    {
                        Platform.OS == "android" ?

                            <TouchableHighlight

                                onPress={() => {
                                    this.updateSummary(1, 1);
                                }}
                                style={{ borderColor: '#000', borderWidth: 1, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>



                                <AntIcon name="plus" size={25} color="#000" />

                            </TouchableHighlight>
                            :
                            <TouchableHighlightIOS
                                onPress={() => {
                                    this.updateSummary(1, 1);
                                }}
                                style={{ borderColor: '#000', borderWidth: 1, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignItems: 'center' }}>



                                <AntIcon name="plus" size={25} color="#000" />

                            </TouchableHighlightIOS>

                    }

                </Overlay>


                <Overlay
                    overlayStyle={{ height: 350, width: '90%', justifyContent: 'center', alignItems: 'center' }}
                    containerStyle={{ margin: 15 }}
                    overlayBackgroundColor="transparent"
                    fullScreen={true}
                    isVisible={this.state.imageoverlay} onBackdropPress={this.toggleimageoverlay}>
                    {/* {
                        this.state.imageshow != "" ?
                            <ImageBackground
                                source={{ uri: this.state.imageshow }}
                                style={{ width: '100%', height: "100%" }}>

                            </ImageBackground> :
                            <ImageBackground
                                source={require("../../assets/logo.png")}
                                style={{ width: '100%', height: "100%" }}>

                            </ImageBackground>
                    } */}
                    <SliderBox
                        ImageComponent={FastImage}
                        images={images}
                        sliderBoxHeight={200}

                        dotColor="#FFEE58"
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        onPress={(data) => {

                        }}
                        autoplay
                        circleLoop
                        resizeMethod={'resize'}
                        resizeMode={'cover'}
                        paginationBoxStyle={{
                            position: "absolute",
                            bottom: 0,
                            padding: 0,
                            alignItems: "center",
                            alignSelf: "center",
                            justifyContent: "center",
                            paddingVertical: 10
                        }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            //borderRadius: 5,
                            marginHorizontal: 0,
                            padding: 0,
                            margin: 0,
                            backgroundColor: "rgba(128, 128, 128, 0.92)"
                        }}
                        ImageComponentStyle={{
                            height: '100%',
                            width: "85%",
                        }}
                        imageLoadingColor="#2196F3"
                    />
                </Overlay>


                {/* price overlay */}
                <Overlay
                    overlayStyle={{ width: '70%', padding: 10, maxHeight: 450 }}
                    isVisible={this.state.isprice} onBackdropPress={() => { this.setState({ isprice: false }) }}>
                    <ScrollView
                        showsVerticalScrollIndicator={true}
                        automaticallyAdjustContentInsets={false}
                        //contentContainerStyle={styles.content}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={true}>
                        <>

                            <View style={{ marginBottom: 10, width: '100%' }}>
                                <TextInput
                                    value={this.state.price}
                                    keyboardType={Platform.OS === "android" ? "phone-pad" : "numbers-and-punctuation"}
                                    style={[style.drop, style.extrainput, { marginRight: 0 }]}
                                    placeholder={labels.price}
                                    onChangeText={text => this.setState({ price: text })}
                                    onFocus={() => {
                                        this.setState({ price: '' })
                                    }}

                                />
                                <View style={style.addbtn}>
                                    <Button
                                        onPress={() => {
                                            this.updateCPL(2)
                                        }}
                                        title={labels.label_add}
                                        containerStyle={{ width: '45%', margin: 5 }}
                                        titleStyle={{ fontSize: 9 }}
                                    />
                                    <Button
                                        onPress={() => {
                                            this.setState({ isprice: false })
                                        }}
                                        titleStyle={{ fontSize: 9 }}
                                        containerStyle={{ width: '45%', margin: 5 }}
                                        title={labels.label_cancel} />
                                </View>

                            </View>

                        </>

                    </ScrollView>


                </Overlay>


                {/* price overlay */}
                <Overlay
                    overlayStyle={{ width: '70%', padding: 10, maxHeight: 450 }}
                    isVisible={this.state.islocationedit} onBackdropPress={() => { this.setState({ islocationedit: false }) }}>
                    {/* <ScrollView
                        showsVerticalScrollIndicator={true}
                        automaticallyAdjustContentInsets={false}
                        //contentContainerStyle={styles.content}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={true}
                    > */}

                    <View style={{ marginBottom: 10, width: '100%' }}>
                        <TextInput
                            value={this.state.location}
                            style={[style.drop, style.extrainput, { marginRight: 0 }]}
                            placeholder={labels.location}
                            onChangeText={text => this.setState({ location: text })}
                            onFocus={() => {
                                this.setState({ location: '' })
                            }}

                        />
                        <View style={style.addbtn}>
                            <Button
                                onPress={() => {
                                    this.updateCPL(3)
                                }}
                                title={labels.label_add}
                                containerStyle={{ width: '45%', margin: 5 }}

                            />
                            <Button
                                onPress={() => {
                                    this.setState({ islocationedit: false })
                                }}
                                containerStyle={{ width: '45%', margin: 5 }}
                                title={labels.label_cancel} />
                        </View>

                    </View>


                    {/* </ScrollView> */}



                </Overlay>



                {/* location overlay */}
                <Overlay
                    overlayStyle={{ width: '70%', padding: 10, maxHeight: 450 }}
                    isVisible={this.state.locationOverlay} onBackdropPress={this.togglelocation}>
                    <ScrollView
                        keyboardShouldPersistTaps={"always"}
                    >
                        {
                            this.state.addlocation == true ?
                                <>
                                    {/* <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ addsub2: false })
                                                    }}>
                                                    <Icon name="arrow-left" size={20} />
                                                </TouchableOpacity> */}
                                    <View style={{ marginBottom: 10 }}>
                                        <TextInput

                                            value={this.state.text}
                                            style={[style.drop, style.extrainput, { marginRight: 0 }]}
                                            placeholder={labels.placeholder_location}
                                            onChangeText={text => this.setState({ location_str: text })}
                                            errorText={this.state.error_password}


                                        />
                                        <View style={style.addbtn}>
                                            <Button
                                                onPress={() => {
                                                    this.addcatagory()
                                                }}
                                                title={labels.label_add}
                                                containerStyle={{ width: '45%', margin: 5 }}

                                            />
                                            <Button
                                                onPress={() => {
                                                    this.setState({ location_str: "", locationOverlay: false, addlocation: false })
                                                }}
                                                containerStyle={{ width: '45%', margin: 5 }}
                                                title={labels.label_cancel} />
                                        </View>
                                    </View>

                                </>
                                :

                                this.state.islocaitonloading == true ?
                                    <View style={{ margin: 15 }}>
                                        <ActivityIndicator size="small" />
                                    </View>
                                    :
                                    <Grid>
                                        {
                                            objectLength(this.state.location) != 0 ?
                                                this.state.locationarray.map((v, i) => {
                                                    if (v != "")
                                                        return (
                                                            <Row style={{ margin: 5 }}>
                                                                <Col size={8}>
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            this.setState({ location: v, locationOverlay: false }, () => {
                                                                                this.updateCPL(3)
                                                                            })
                                                                        }}
                                                                        style={{ width: '100%', }}>
                                                                        <Text>{v}</Text>

                                                                    </TouchableOpacity>
                                                                </Col>
                                                                <Col size={2} onPress={() => {
                                                                    this.deleteCatagory(v)
                                                                }}>

                                                                    <Text style={{ textAlign: 'right' }}>
                                                                        <EviIcon name="trash" size={20} color="red" />

                                                                    </Text>


                                                                </Col>
                                                            </Row>

                                                        )
                                                }) : null
                                        }
                                    </Grid>
                        }
                    </ScrollView>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {
                            this.state.addlocation == true ? null :

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ addlocation: true })
                                    }}
                                    style={style.btnadd}>
                                    <Icon name="plus" color="#fff" />
                                </TouchableOpacity>
                        }
                    </View>



                </Overlay>


                {/* location overlay */}
                {/* <Overlay
                    overlayStyle={{ width: '70%', padding: 10, maxHeight: 450 }}
                    isVisible={this.state.locationOverlay} onBackdropPress={this.togglelocation}>
                    <ScrollView
                        keyboardShouldPersistTaps={"always"}
                    >

                        {
                            this.state.islocaitonloading == true ?
                                <View style={{ margin: 15 }}>
                                    <ActivityIndicator size="small" />
                                </View>
                                :
                                <Grid>
                                    {
                                        objectLength(this.state.locationarray) != 0 ?
                                            this.state.locationarray.map((v, i) => {
                                                if (v != "")
                                                    return (
                                                        <Row style={{ margin: 5 }}>
                                                            <Col size={8}>
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState({ location: v, locationOverlay: false }, () => {
                                                                            this.updateCPL(3)
                                                                        })
                                                                    }}
                                                                    style={{ width: '100%', }}>
                                                                    <Text>{v}</Text>

                                                                </TouchableOpacity>
                                                            </Col>
                                                            <Col size={2} onPress={() => {
                                                                this.deleteCatagory(v, 5)
                                                            }}>

                                                                <Text style={{ textAlign: 'right' }}>
                                                                    {/* <EviIcon name="trash" size={20} color="red" /> 

                                                                </Text>


                                                            </Col>
                                                        </Row>

                                                    )
                                            }) : null
                                    }
                                </Grid>
                        }
                    </ScrollView>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {
                            this.state.addlocation == true ? null :

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ addlocation: true })
                                    }}
                                    style={style.btnadd}>
                                    <Icon name="plus" color="#fff" />
                                </TouchableOpacity>
                        }
                    </View>



                </Overlay> */}
                <Overlay visible={this.state.deleteLoading}>
                    <ActivityIndicator />
                </Overlay>
            </View>
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
        // width: '100%'
    },
    listItemContainer: {
        // height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,

        //borderColor: '#ECECEC',
    },
    wrapperCollapsibleList: {
        // flex: 1,
        //  marginTop: 20,
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
        // padding: 10,
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
        alignItems: 'center', //marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7.11,

        elevation: 10,
    },
    addbtn: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: -10,
        justifyContent: 'center',
        alignContent: 'center'
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
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 7.11,
        paddingTop: 15,
        elevation: 10,
    },

    rowborder: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 0.5,
        // height: 45,
        padding: 5,
        marginBottom: 10,
        borderRadius: 5

    },
    btnadd: {
        backgroundColor: '#5fafdd',
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roundimage: { height: 70, width: '23%', marginRight: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 10 }
})
const mapStateToProps = state => {
    return {
        labels: state.language.data,
        deleteStock: state.deleteStock,
        quantity: state.qty.data,
        location: state.location,
        deletedcat: state.delcat,
        addcatdata: state.addcat,
    };
};

export default connect(
    mapStateToProps,
    {
        delcat,
        addcat,
        deleteinventory,
        summaryinventory,
        qtyinventory,
        getlocation
    }
)(Collapsable);