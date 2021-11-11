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
    KeyboardAvoidingView,
    TextInput,
    Linking
} from "react-native";
import {
    getMaterCat,
    getsub1,
    getsub2,
    getsize,
    getcolor,
} from '../Inventory/actions';
import { getoustckdata, getDahboarddata } from '../SearchInventory/actions';
import { FONT_GOOGLE_BARLOW_REGULAR, FONT_GOOGLE_BARLOW_SEMIBOLD } from '../../constants/fonts';
import Collapsable from '../SearchInventory/Collapsable';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { searchinventory, checkbarcode } from './actions';
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
import { CheckBox, Button, Overlay } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../components/Header';
import HeaderBar from '../../components/HeaderBar'
//import TextInput from '../../components/TextInput';
import DropdownAlert from 'react-native-dropdownalert';
import messaging from '@react-native-firebase/messaging';
class Search extends React.PureComponent {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.refeshMethod = this.onload.bind(this);
        this.refeshMethod1 = this.loaddata.bind(this);

        this.createNotificationListener()
        this.state = {
            isloading: true,
            user_data: null,
            issubmit: false,
            isscane: false,
            barcodeoverlay: false,
            sizeOverlay: false,
            colorOverlay: false,
            masterOverlay: false,
            sub1Overlay: false,
            sub2Overlay: false,
            issizeloading: false,
            iscolorloading: false,
            iscatloading: true,
            issub1loading: true,
            issub2loading: true,
            size_str: '',
            color_str: '',
            addcat: false,
            addsub1: false,
            addsub2: false,
            outOfStock: false,
            isoutstock: true,
            outstockdata: null,
            masterCat: [],
            sub1: [],
            sub2: [],
            size: [],
            color: [],
            mastercat: '',
            sub1_str: '',
            sub2_str: '',
            sku: '',
            searchtag: '',
            barcode: '',
            timer: 0,
            Current_Page: 0,
            isoutstockloading: false
        }
    }
    onEndReachedCalledDuringMomentum = true;
    componentDidMount = () => {
        this.props.navigation.setParams({
            labels: this.props.label
        });

        this.get_user_data().then(data => {

            this.setState({ user_data: data, quantity: "0" }, () => {
                this.setState({ isloading: false })
            })
        })
        Linking.addEventListener('url', this.handleOpenURL);
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
        this.get_user_data().then((data) => {
            this.setState({ user_data: data }, () => {
                this.get_logintype().then((response) => {
                    this.loaddata();
                    console.log("response", this.state.user_data);
                    // if (response != null)

                    this.setState({ logintype: response }, () => {
                        this.setState({ setLoading: false });
                    });
                });
            });
        });
    }
    get_logintype = async () => {
        const loagintype = await AsyncStorage.getItem("logintype");

        var response = JSON.parse(loagintype);
        return response;
    };

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        clearInterval(this.clockCall);
    }
    loaddata = () => {
        this.setState({ isoutstock: true }, () => {
            var dashdata = {
                do: "GetDash",
                userid: this.state.user_data.UserId,
                UserName: this.state.user_data.UserName,
            };
            var getstockdata = {
                do: "GetOutStk",
                userid: this.state.user_data.UserId,
                Current_Page: 0,
            };
            this.setState({ isoutstockloading: true }, () => {
                this.props.getDahboarddata(dashdata).then(() => {
                    if (this.props.dashboard.data.ResponseCode == 1) {
                        this.setState({ dash_data: this.props.dashboard.data }, () => {
                            this.props.getoustckdata(getstockdata).then(() => {
                                if (this.props.outstock.data != undefined) {
                                    if (this.props.outstock.data.ResponseCode == 1) {
                                        this.setState(
                                            { outstockdata: this.props.outstock.data.InventoryData },
                                            () => {
                                                this.setState({ isloading: false, isoutstock: false, isoutstockloading: false });
                                            }
                                        );
                                    } else {
                                        this.setState({
                                            outstockdata: [],
                                            isloading: false,
                                            isoutstock: false,
                                            isoutstockloading: false
                                        });
                                    }
                                } else {
                                    this.setState({
                                        outstockdata: [],
                                        isloading: false,
                                        isoutstock: false,
                                        isoutstockloading: false
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
            })
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
                                    // BackHandler.exitApp()//

                                    this.props.navigation.navigate("Dashboard")
                                }
                            },

                            {
                                text: lables.int_option2,
                                onPress: () => {
                                    var labels = this.props.label

                                    this.get_user_data().then(data => {

                                        this.setState({ user_data: data, quantity: "0" }, () => {
                                            this.setState({ isloading: false })
                                        })
                                    })
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
    onchangerefresh = () => {
        this.setState({ isoutstock: true });
    };

    onBackPress = () => {

    };
    onload = () => {

    }
    createNotificationListener = async () => {
        this.notificationListener = messaging().onMessage((notification) => {
            if (this.dropDownAlertsearch != null && this.dropDownAlertsearch != undefined) {
                this.dropDownAlertsearch.alertWithType('success', notification.notification.title, notification.notification.body);
            }


        });

        this.notificationOpen = messaging().onNotificationOpenedApp((notificationOpen) => {
            var data = null;
            if (Platform.OS == "android") {
                data = notificationOpen.notification;
            } else {

                data = notificationOpen.notification;

            }
            this.props.navigation.navigate("Orders")
        });

        this.backgroundNotification = messaging().setBackgroundMessageHandler(async notificationOpen => {
            var data = null;
            if (Platform.OS == "android") {
                data = notificationOpen.notification;
            } else {
                data = notificationOpen.notification;
            }
            this.props.navigation.navigate("Orders")
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
                    this.props.navigation.navigate("Orders")
                }

            });
    }

    get_user_data = async () => {
        const user_data = await AsyncStorage.getItem('user_data')
        var response = JSON.parse(user_data);
        return response
    }
    showMasterOverLay = () => {
        this.setState({ masterOverlay: true }, () => {

            var data = {
                do: "GetCategories",
                userid: this.state.user_data.UserId,
                suball: 1
            }

            this.props.getMaterCat(data).then(() => {
                if (this.props.masterCat.data.ResponseMsg == "Records Successfully Fetch") {
                    this.setState({ masterCat: this.props.masterCat.data.CatData.split(",") }, () => {

                        this.setState({ iscatloading: false })
                    })
                } else {
                    this.setState({ addmaster: true })
                }
                // if (array != null) {
                //     array.map((i, v) => {

                //     })
                // }
            })

        })
    }
    showSub1OverLay = () => {
        if (this.state.mastercat != "") {
            this.setState({ sub1Overlay: true }, () => {

                var data = {
                    do: "GetSubCat",
                    userid: this.state.user_data.UserId,
                    suball: 1,
                    mastercat: this.state.mastercat
                }

                this.props.getsub1(data).then(() => {

                    this.setState({ sub1: this.props.sub1.data.CatData.split(",") }, () => {

                        this.setState({ issub1loading: false })
                        if (this.state.sub1 != null) {
                            this.state.sub1.map((i, v) => {

                            })
                        }
                    })

                })

            })
        }
    }
    showSub2OverLay = () => {
        if (this.state.sub1_str != "" && this.state.mastercat != "") {
            this.setState({ sub2Overlay: true }, () => {

                var data = {
                    do: "GetSubCat",
                    userid: this.state.user_data.UserId,
                    suball: 1,
                    mastercat: this.state.mastercat,
                    subcat_1: this.state.sub1_str,
                    //subcat_2:this.state.sub2_str,

                }

                this.props.getsub2(data).then(() => {

                    this.setState({ sub2: this.props.sub2.data.CatData.split(",") }, () => {

                        this.setState({ issub2loading: false })
                        if (this.state.sub2 != null) {
                            this.state.sub2.map((i, v) => {

                            })
                        }
                    })

                })

            })
        }
    }
    showSizeOverLay = () => {

        this.setState({ sizeOverlay: true, issizeloading: true }, () => {

            var data = {
                do: "GetSize",
                userid: this.state.user_data.UserId,
                suball: 1,
                osname: Platform.OS === "android" ? "and" : "ios"
            }

            this.props.getsize(data).then(() => {
                if (this.props.size.data.ResponseMsg == "Records Successfully Fetch") {
                    this.setState({ size: this.props.size.data.SizData.split(",") }, () => {

                        this.setState({ issizeloading: false })

                    })
                } else {
                    this.setState({ addsize: true })
                }

            })

        })

    }
    showColorOverLay = () => {

        this.setState({ colorOverlay: true, iscolorloading: true }, () => {

            var data = {
                do: "GetColor",
                userid: this.state.user_data.UserId,
                suball: 1,
                osname: Platform.OS === "android" ? "and" : "ios"
            }

            this.props.getcolor(data).then(() => {
                if (this.props.color.data.ResponseMsg == "Records Successfully Fetch") {
                    this.setState({ color: this.props.color.data.ColData.split(",") }, () => {

                        this.setState({ iscolorloading: false })

                    })
                } else {
                    this.setState({ addcolor: true })
                }

            })

        })

    }
    toggleOverlay = () => {
        this.setState({ masterOverlay: false, addmaster: false });

    };
    togglesub1 = () => {
        this.setState({ sub1Overlay: false, addsub1: false });

    };
    togglesub2 = () => {
        this.setState({ sub2Overlay: false, addsub2: false });

    };
    togglesize = () => {
        this.setState({ sizeOverlay: false, addsize: false });

    };
    togglecolor = () => {
        this.setState({ colorOverlay: false, addcolor: false });

    };

    togglebarcode = () => {
        this.setState({ barcodeoverlay: false, });

    };

    thislocation = () => {
        this.setState({ issubmit: true }, () => {
            var data = {
                do: 'GetShortDescription',
                osname: Platform.OS === "android" ? 'and' : 'ios',
                userid: this.state.user_data.UserId,
                maincat: this.state.mastercat,
                subcat_1: this.state.sub1_str,
                subcat_2: this.state.sub2_str,
                tags: this.state.searchtag,
                stock_no: this.state.barcode == "" ? this.state.sku : "",
                listype: 1,
                associate: 0,
                sortby: 1,
                barcode: this.state.barcode,
                Current_Page: 0,
                size: this.state.size_str,
                color: this.state.color_str,
                refeshMethod: this.props.navigation.state.params.data.refeshMethod
            }
            var result = this.props.searchdata.data

            this.props.navigation.navigate("SearchResult", { data })

        })
    }

    alllocation = () => {
        this.setState({ issubmit: true }, () => {
            var data = {
                do: 'GetShortDescription',
                osname: Platform.OS === "android" ? 'and' : 'ios',
                userid: this.state.user_data.UserId,
                maincat: this.state.mastercat,
                subcat_1: this.state.sub1_str,
                subcat_2: this.state.sub2_str,
                tags: this.state.searchtag,
                stock_no: this.state.sku,
                listype: 1,
                associate: 1,
                sortby: 1,
                Current_Page: 0,
                barcode: this.state.barcode,
                size: this.state.size_str,
                color: this.state.color_str,
                refeshMethod: this.props.navigation.state.params.data.refeshMethod
            }
            var result = this.props.searchdata.data
            this.setState({ barcode: '' })

            this.props.navigation.navigate("SearchResult", { data })

        })

    }

    getOutOfStockItems = () => {
        this.setState({
            outOfStock: true
        })
    }

    clearsearch = () => {
        this.setState({
            mastercat: '',
            sub1_str: '',
            sub2_str: '',
            searchtag: '',
            size_str: '',
            color_str: '',
            sku: '',
        })
    }
    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);

        }
    };
    _onTap = data => {
        this.navi_redirect()
    };
    navi_redirect = async () => {

        // alert(order_id)
        // var data = {
        //     orderid: order_id,
        //     onload: this.onload()
        // }
        //this.props.navigation.navigate("OrderDetail", data)
        this.props.navigation.navigate("Orders")

    }
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
                                    console.log("GetOutStk", result.length)
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

    render() {
        const labels = this.props.label

        if (this.state.isloading) {
            return (
                <ImageBackground
                    source={require("../../assets/bg-SKY.jpg")}
                    style={{
                        width: "100%",
                        height: "100%",

                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden' // prevent image overflow the container
                    }}
                >
                    <ActivityIndicator
                        size="large"
                    />
                </ImageBackground>
            )
        } else if (this.state.outOfStock) {
            return (
                <ImageBackground
                    source={require("../../assets/bg-SKY.jpg")}
                    style={{
                        width: "100%",
                        height: "100%",

                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden' // prevent image overflow the container
                    }}
                >
                    {this.state.isoutstockloading ?

                        <ActivityIndicator size={"large"} /> :
                        this.state.outstockdata ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                data={this.state.outstockdata}
                                keyExtractor={(_, index) => index.toString()}
                                stickyHeaderIndices={[0]}
                                ListHeaderComponent={() => {
                                    return (
                                        <ImageBackground
                                            source={require("../../assets/bg-SKY.jpg")}
                                            style={{
                                                overflow: 'hidden' // prevent image overflow the container
                                            }}
                                            imageStyle={{
                                                resizeMode: "cover",
                                                height: Platform.OS === "android" ? 480 : 550, // the image height

                                            }}
                                        >
                                            <HeaderBar navigation={this.props.navigation} />
                                            <View style={{
                                                width: '100%',
                                                backgroundColor: '#fff',
                                                paddingTop: 15,
                                                paddingBottom: 15
                                            }}>
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center' }}>{labels.out_stock.toUpperCase()}</Text>
                                            </View>
                                        </ImageBackground>

                                    )
                                }}
                                renderItem={({ item, index }) => {
                                    item.Associate = 0;
                                    return (
                                        <Collapsable
                                            data={item}
                                            navigation={this.props.navigation}
                                            labels={labels}
                                            refeshMethod={this.refeshMethod1}
                                            user_data={this.state.user_data}
                                            logintype={this.state.logintype}
                                            onchangerefresh={this.onchangerefresh}
                                        />
                                    );
                                }}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.1}
                                onMomentumScrollBegin={() => {
                                    this.onEndReachedCalledDuringMomentum = false;
                                }}
                            />
                            :
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                data={[{ key: 1 }]}
                                keyExtractor={(_, index) => index.toString()}
                                stickyHeaderIndices={[0]}
                                ListHeaderComponent={() => {
                                    return (
                                        <ImageBackground
                                            source={require("../../assets/bg-SKY.jpg")}
                                            style={{
                                                overflow: 'hidden' // prevent image overflow the container
                                            }}
                                            imageStyle={{
                                                resizeMode: "cover",
                                                height: Platform.OS === "android" ? 480 : 550, // the image height

                                            }}
                                        >
                                            <HeaderBar navigation={this.props.navigation} />
                                            <View style={{
                                                width: '100%',
                                                backgroundColor: '#fff',
                                                paddingTop: 15,
                                                paddingBottom: 15
                                            }}>
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center' }}>{labels.out_stock.toUpperCase()}</Text>
                                            </View>
                                        </ImageBackground>

                                    )
                                }}
                                renderItem={({ item, index }) => {

                                    return (
                                        <View style={{ padding: 15, width: '100%', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                                            <Text style={{width:'100%',textAlign:'center'}}>NO RESULTS </Text>
                                        </View>
                                    );
                                }}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.1}
                                onMomentumScrollBegin={() => {
                                    this.onEndReachedCalledDuringMomentum = false;
                                }}
                            />

                    }

                </ImageBackground>
            )
        } else {
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>

                    <ImageBackground
                        source={require("../../assets/bg-SKY.jpg")}
                        style={{
                            width: "100%",
                            height: "100%",


                            overflow: 'hidden' // prevent image overflow the container
                        }}
                        imageStyle={{
                            resizeMode: "cover",
                            height: Platform.OS === "android" ? 480 : 550, // the image height

                        }}
                    >


                        <View style={{ backgroundColor: '#fff', height: '100%', }}>

                            <FlatList
                                //   contentContainerStyle={{ marginBottom: 150, }}
                                // style={{flex:1}}
                                data={[{ "key": 1 }]}
                                keyExtractor={(_, index) => index.toString()}
                                stickyHeaderIndices={[0]}
                                ListHeaderComponent={() => {
                                    return (
                                        <ImageBackground
                                            source={require("../../assets/bg-SKY.jpg")}
                                            style={{



                                                overflow: 'hidden' // prevent image overflow the container
                                            }}
                                            imageStyle={{
                                                resizeMode: "cover",
                                                height: Platform.OS === "android" ? 480 : 550, // the image height

                                            }}
                                        >
                                            <HeaderBar navigation={this.props.navigation} user_data={this.state.user_data} />

                                            <View style={{
                                                width: '100%',
                                                //height: 50,
                                                backgroundColor: '#fff',
                                                paddingTop: 15,
                                                paddingBottom: 15
                                                //marginBottom: 25
                                            }}>
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center' }}>{labels.placeholder_search}</Text>
                                            </View>
                                        </ImageBackground>

                                    )
                                }}
                                renderItem={({ item, index }) => {

                                    return (
                                        <View style={style.container}>

                                            <Button
                                                buttonStyle={{ backgroundColor: '#00b8e4' }}
                                                titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                titleStyle={{
                                                    color: "#fff"
                                                }}
                                                loading={this.state.barcode != "" ? true : false}
                                                title={labels.placeholder_scanebarcode}
                                                icon={
                                                    <View style={{ marginRight: 10 }}>
                                                        <AntIcon
                                                            name="scan1"
                                                            size={25}
                                                            color="white"
                                                        />
                                                    </View>
                                                }
                                                containerStyle={{ width: '100%', marginBottom: 15 }}
                                                onPress={() => {
                                                    this.setState({ barcodeoverlay: true })
                                                }}
                                            />
                                            <TouchableWithoutFeedback

                                                onPress={() => {
                                                    // Keyboard.dismiss
                                                    this.showMasterOverLay()

                                                    //  this.setState({ masterOverlay: true })
                                                }}
                                            >
                                                <View>
                                                    <Text style={[style.droptitle, { marginLeft: 10 }]}>{labels.placeholder_master}</Text>


                                                    <View style={style.drop}>
                                                        <Text style={style.selected}>{this.state.mastercat}</Text>
                                                    </View>



                                                </View>
                                            </TouchableWithoutFeedback>

                                            <TouchableWithoutFeedback

                                                onPress={() => {
                                                    this.showSub1OverLay()
                                                }}
                                            >
                                                <View>
                                                    <Text style={[style.droptitle, { marginLeft: 10 }]}>{labels.placeholder_subcat1}</Text>


                                                    <View style={style.drop}>
                                                        <Text style={style.selected}>{this.state.sub1_str}</Text>

                                                    </View>


                                                </View>
                                            </TouchableWithoutFeedback>


                                            <TouchableWithoutFeedback

                                                onPress={() => {
                                                    this.showSub2OverLay()
                                                }}
                                            >
                                                <View>
                                                    <Text style={[style.droptitle, { marginLeft: 10 }]}>{labels.placeholder_subcat2}</Text>


                                                    <View style={style.drop}>
                                                        <Text style={style.selected}>{this.state.sub2_str}</Text>
                                                    </View>



                                                </View>
                                            </TouchableWithoutFeedback>


                                            <TouchableWithoutFeedback

                                                onPress={() => {
                                                    this.showSizeOverLay()
                                                }}
                                            >
                                                <View>
                                                    <Text style={[style.droptitle, { marginLeft: 10 }]}>{labels.placeholder_size}</Text>


                                                    <View style={style.drop}>
                                                        <Text style={style.selected}>{this.state.size_str}</Text>
                                                    </View>



                                                </View>
                                            </TouchableWithoutFeedback>

                                            <TouchableWithoutFeedback

                                                onPress={() => {
                                                    this.showColorOverLay()
                                                }}
                                            >
                                                <View>
                                                    <Text style={[style.droptitle, { marginLeft: 10 }]}>{labels.placeholder_color}</Text>


                                                    <View style={style.drop}>
                                                        <Text style={style.selected}>{this.state.color_str}</Text>
                                                    </View>



                                                </View>
                                            </TouchableWithoutFeedback>

                                            <View style={{ paddingLeft: 10 }}>

                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        this.search_textinput.focus()
                                                    }}>
                                                    <Text style={style.droptitle}>{labels.placeholder_keywords}</Text>

                                                </TouchableWithoutFeedback>
                                                <TextInput
                                                    ref={(input) => { this.search_textinput = input; }}

                                                    style={[style.drop, style.extrainput]}
                                                    value={capitalize(this.state.searchtag)}
                                                    onChangeText={text => this.setState({ searchtag: text })}
                                                    errorText={this.state.error_password}
                                                    autoCapitalize="words"

                                                />
                                            </View>
                                            <View style={{ paddingLeft: 10 }}>

                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        this.sku_textinput.focus()
                                                    }}>
                                                    <Text style={style.droptitle}>{labels.placeholder_stocknumber}</Text>

                                                </TouchableWithoutFeedback>
                                                <TextInput
                                                    ref={(input) => { this.sku_textinput = input; }}

                                                    style={[style.drop, style.extrainput]}

                                                    inputContainerStyle={{ height: 40, marginBottom: -10 }}
                                                    value={this.state.sku}
                                                    onChangeText={text => this.setState({ sku: text })}
                                                    errorText={this.state.error_password}
                                                    autoCapitalize="sentences"

                                                />
                                            </View>
                                            <Button
                                                title={labels.placeholder_searchthis}
                                                buttonStyle={{ backgroundColor: '#00b8e4' }}
                                                titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                onPress={() => {
                                                    this.thislocation();
                                                }}
                                                containerStyle={{ width: '100%', marginBottom: 15 }}

                                            />
                                            <Button
                                                title={labels.placeholder_searchlocation}
                                                titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                onPress={() => {
                                                    this.alllocation();
                                                }}
                                                containerStyle={{ width: '100%', marginBottom: 15, backgroundColor: '#000' }}
                                                buttonStyle={{ backgroundColor: '#000' }}
                                            />

                                            <Button
                                                title={labels.placeholder_searchclear}
                                                titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                onPress={() => {
                                                    this.clearsearch();
                                                }}
                                                containerStyle={{ width: '100%', marginBottom: 15, backgroundColor: '#000' }}
                                                buttonStyle={{

                                                    backgroundColor: '#ffda01'
                                                }}
                                            />

                                            <Button
                                                title={labels.out_stock.toUpperCase()}
                                                titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                                onPress={() => {
                                                    this.getOutOfStockItems();
                                                }}
                                                containerStyle={{ width: '100%', marginBottom: 15, backgroundColor: '#000' }}
                                                buttonStyle={{

                                                    backgroundColor: 'red'
                                                }}
                                            />

                                        </View>

                                    )
                                }
                                }
                                onEndReachedThreshold={0.1}
                                onMomentumScrollBegin={() => {
                                    this.onEndReachedCalledDuringMomentum = false;
                                }}
                            />
                        </View>


                        {/* Master catagory overlay */}
                        <Overlay
                            overlayStyle={{ width: '70%', padding: 10 }}
                            isVisible={this.state.masterOverlay} onBackdropPress={this.toggleOverlay}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}>
                                {
                                    this.state.addmaster == true ?
                                        <>
                                            <View style={{ marginBottom: 10 }}>
                                                <TextInput
                                                    value={this.state.mastercat}
                                                    placeholder={labels.placeholder_master_cat}
                                                    onChangeText={text => this.setState({ mastercat: text })}
                                                />
                                                <Button
                                                    onPress={() => {
                                                        this.addcatagory(1)
                                                    }}
                                                    title={"Add"} />
                                            </View>

                                        </>
                                        :

                                        this.state.iscatloading == true ?
                                            <View style={{ margin: 10 }}>
                                                <ActivityIndicator size="small" />
                                            </View>
                                            :
                                            <Grid>
                                                <Row style={{ margin: 5 }}>
                                                    <Col size={8} onPress={() => {
                                                        this.setState({ mastercat: "All", masterOverlay: false })
                                                    }}>
                                                        <Text>{"All"}</Text>
                                                    </Col>

                                                </Row>
                                                {
                                                    objectLength(this.state.masterCat) != 0 ?

                                                        this.state.masterCat.map((v, i) => {
                                                            return (
                                                                <Row style={{ margin: 5 }}>
                                                                    <Col size={8} onPress={() => {

                                                                        this.setState({ mastercat: v, masterOverlay: false })
                                                                    }}>
                                                                        <Text>{v}</Text>


                                                                    </Col>

                                                                </Row>

                                                            )
                                                        }) : null
                                                }
                                            </Grid>
                                }
                            </ScrollView>


                        </Overlay>

                        {/* sub1 catagory overlay */}
                        <Overlay
                            overlayStyle={{ width: '50%', padding: 10 }}
                            isVisible={this.state.sub1Overlay} onBackdropPress={this.togglesub1}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}>
                                {
                                    this.state.addsub1 == true ?
                                        <>
                                            <View style={{ marginBottom: 10 }}>
                                                <TextInput

                                                    value={this.state.text}
                                                    placeholder={labels.placeholder_subcat1}
                                                    onChangeText={text => this.setState({ sub1_str: text })}
                                                    errorText={this.state.error_password}


                                                />
                                                <Button
                                                    onPress={() => {
                                                        this.addcatagory(2)
                                                    }}
                                                    title={"Add"} />
                                            </View>

                                        </>
                                        :

                                        this.state.issub1loading == true ?
                                            <View style={{ margin: 10 }}>
                                                <ActivityIndicator size="small" />
                                            </View>
                                            :
                                            <Grid>
                                                <Row style={{ margin: 5 }}>
                                                    <Col size={8} onPress={() => {

                                                        this.setState({ sub1_str: "All", sub1Overlay: false })
                                                    }}>
                                                        <Text>{"All"}</Text>


                                                    </Col>

                                                </Row>
                                                {
                                                    objectLength(this.state.sub1) != 0 ?
                                                        this.state.sub1.map((v, i) => {
                                                            return (
                                                                <Row style={{ margin: 5 }}>
                                                                    <Col size={8} onPress={() => {

                                                                        this.setState({ sub1_str: v, sub1Overlay: false })
                                                                    }}>
                                                                        <Text>{v}</Text>


                                                                    </Col>

                                                                </Row>

                                                            )
                                                        }) : null
                                                }
                                            </Grid>
                                }
                            </ScrollView>


                        </Overlay>

                        {/* sub2 catagory overlay */}
                        <Overlay
                            overlayStyle={{ width: '50%', padding: 10 }}
                            isVisible={this.state.sub2Overlay} onBackdropPress={this.togglesub2}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}>
                                {
                                    this.state.addsub2 == true ?
                                        <>
                                            <View style={{ marginBottom: 10 }}>
                                                <TextInput

                                                    value={this.state.text}
                                                    placeholder={labels.placeholder_subcat2}
                                                    onChangeText={text => this.setState({ sub2_str: text })}
                                                    errorText={this.state.error_password}


                                                />
                                                <Button
                                                    onPress={() => {
                                                        this.addcatagory(3)
                                                    }} title={"Add"} />
                                            </View>

                                        </>
                                        :

                                        this.state.issub2loading == true ?
                                            <View style={{ margin: 10 }}>
                                                <ActivityIndicator size="small" />
                                            </View>
                                            :
                                            <Grid>
                                                <Row style={{ margin: 5 }}>
                                                    <Col size={8} onPress={() => {

                                                        this.setState({ sub2_str: "All", sub2Overlay: false })
                                                    }}>
                                                        <Text>{"All"}</Text>


                                                    </Col>

                                                </Row>
                                                {
                                                    objectLength(this.state.sub2) != 0 ?
                                                        this.state.sub2.map((v, i) => {
                                                            return (
                                                                <Row style={{ margin: 5 }}>
                                                                    <Col size={8} onPress={() => {

                                                                        this.setState({ sub2_str: v, sub2Overlay: false })
                                                                    }}>
                                                                        <Text>{v}</Text>


                                                                    </Col>

                                                                </Row>

                                                            )
                                                        }) : null
                                                }
                                            </Grid>
                                }
                            </ScrollView>


                        </Overlay>


                        <Overlay
                            overlayStyle={{ width: '100%', padding: 10, height: 450, backgroundColor: 'transparent' }}
                            isVisible={this.state.barcodeoverlay} onBackdropPress={this.togglebarcode}>

                            <RNCamera
                                ref={ref => {
                                    this.camera = ref;
                                }}
                                style={style.preview}
                                type={RNCamera.Constants.Type.back}
                                flashMode={RNCamera.Constants.FlashMode.torch}
                                androidCameraPermissionOptions={{
                                    title: 'Permission to use camera',
                                    message: 'We need your permission to use your camera',
                                    buttonPositive: 'Ok',
                                    buttonNegative: 'Cancel',
                                }}
                                captureAudio={false}
                                onBarCodeRead={(barcodes) => {

                                    this.setState({ barcode: barcodes.data, barcodeoverlay: false, }, () => {
                                        var data = {
                                            do: "searchByBarcode",
                                            userid: this.state.user_data.UserId,
                                            associates: 1,
                                            barcode: barcodes.data
                                        }
                                        this.props.checkbarcode(data).then(() => {
                                            if (this.props.isbarcode.data.ResponseCode == 1) {
                                                this.alllocation()
                                                this.setState({ isscane: false })
                                            } else {
                                                this.setState({ isscane: false, barcode: '' }, () => {
                                                    Alert.alert(
                                                        labels.alert,
                                                        labels.search_barecodenotfound,
                                                        [


                                                            {
                                                                text: 'OK',
                                                                style: 'cancel',
                                                                onPress: () => {

                                                                }
                                                            },


                                                        ],
                                                        { cancelable: false }
                                                    );
                                                })

                                            }
                                        })
                                    })

                                }}

                            >
                                <BarcodeMask />
                            </RNCamera>



                        </Overlay>
                        {/* size overlay */}
                        <Overlay
                            overlayStyle={{ width: '70%', padding: 10, maxHeight: 450 }}
                            isVisible={this.state.sizeOverlay} onBackdropPress={this.togglesize}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}
                            >
                                {
                                    this.state.issizeloading == true ?
                                        <View style={{ margin: 15 }}>
                                            <ActivityIndicator size="small" />
                                        </View>
                                        :
                                        <Grid>
                                            {
                                                objectLength(this.state.size) != 0 ?
                                                    this.state.size.map((v, i) => {
                                                        if (v != "")
                                                            return (
                                                                <Row style={{ margin: 5 }}>
                                                                    <Col size={8}>
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.setState({ size_str: v, sizeOverlay: false })
                                                                            }}
                                                                            style={{ width: '100%', }}>
                                                                            <Text>{v}</Text>

                                                                        </TouchableOpacity>
                                                                    </Col>
                                                                    <Col size={2} onPress={() => {
                                                                        this.deleteCatagory(v, 6)
                                                                    }}>

                                                                        {/* <Text style={{ textAlign: 'right' }}>
                                                                            <EviIcon name="trash" size={20} color="red" />
                                                                        </Text> */}


                                                                    </Col>
                                                                </Row>

                                                            )
                                                    }) : null
                                            }
                                        </Grid>
                                }
                            </ScrollView>

                        </Overlay>

                        {/* color overlay */}
                        <Overlay
                            overlayStyle={{ width: '70%', padding: 10, maxHeight: 450 }}
                            isVisible={this.state.colorOverlay} onBackdropPress={this.togglecolor}>
                            <ScrollView
                                keyboardShouldPersistTaps={"always"}
                            >
                                {

                                    this.state.iscolorloading == true ?
                                        <View style={{ margin: 15 }}>
                                            <ActivityIndicator size="small" />
                                        </View>
                                        :
                                        <Grid>
                                            {
                                                objectLength(this.state.color) != 0 ?
                                                    this.state.color.map((v, i) => {
                                                        if (v != "")
                                                            return (
                                                                <Row style={{ margin: 5 }}>
                                                                    <Col size={8}>
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.setState({ color_str: v, colorOverlay: false })
                                                                            }}
                                                                            style={{ width: '100%', }}>
                                                                            <Text>{v}</Text>

                                                                        </TouchableOpacity>
                                                                    </Col>
                                                                    <Col size={2} onPress={() => {
                                                                        this.deleteCatagory(v, 7)
                                                                    }}>
                                                                        {/* <Text style={{ textAlign: 'right' }}>
                                                                            <EviIcon name="trash" size={20} color="red" />
                                                                        </Text> */}

                                                                    </Col>
                                                                </Row>

                                                            )
                                                    }) : null
                                            }
                                        </Grid>
                                }
                            </ScrollView>

                        </Overlay>

                    </ImageBackground>

                    <DropdownAlert
                        ref={ref => (this.dropDownAlertsearch = ref)}
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
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    container: {
        paddingTop: 15,

        paddingLeft: 10, paddingRight: 10,
        width: '100%',
        height: '100%',
        backgroundColor: '#f6f6f6'
    },
    selected: {
        fontSize: 16,

        marginTop: 15,
        color: '#0f3e53',
        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    },
    droptitle: {
        fontSize: 14,
        color: '#808080',
        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD
    },
    extrainput: {
        marginLeft: 0,
        height: 50,
        paddingLeft: 0,
        fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
        fontWeight: '500',
        fontSize: 16,
        color: '#0f3e53',
    },
    drop: {
        height: 50,
        borderBottomWidth: 1.5,
        borderBottomColor: '#b4b4b4',
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'flex-start'
    },
    preview: {

        height: "100%",
        width: '100%'

    },
    capture: {

        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,


        margin: 20,
    },
})

const mapStateToProps = state => {

    return {
        label: state.language.data,
        user_data: state.login,
        masterCat: state.masterCat,
        sub1: state.sub1,
        sub2: state.sub2,
        searchdata: state.search_inventory,
        isbarcode: state.barcode,
        size: state.size,
        color: state.color,
        outstock: state.outstock,
        dashboard: state.dashboarddata,
    };
};

export default connect(
    mapStateToProps,
    {
        getMaterCat,
        getsub1,
        getsub2,
        getsize,
        getcolor,
        searchinventory,
        getoustckdata,
        checkbarcode,
        getDahboarddata,
    }
)(Search);

