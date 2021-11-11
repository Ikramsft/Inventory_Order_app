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
    RefreshControl,
    Linking
} from "react-native";
import {
    getMaterCat,
    getsub1,
    getsub2,

} from '../Inventory/actions';
import { searchinventory } from './actions';
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
import TextInput from '../../components/TextInput';
import Collapsable from "./Collapsable";
import { FONT_GOOGLE_BARLOW_SEMIBOLD } from "../../constants/fonts";
import HeaderBar from '../../components/HeaderBar'
import DropdownAlert from 'react-native-dropdownalert';
import messaging from '@react-native-firebase/messaging';
class SearchResult extends React.Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.refeshMethod = this._refreshData.bind(this);
        this.createNotificationListener()
        this.state = {
            loadmore: false,
            user_data: null,
            isloading: true,
            notfound: true,
            sortoverlay: false,
            //infinite loading list
            data: [],
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
            associate: '',
            timer: 0,
        }
    }
    onEndReachedCalledDuringMomentum = true
    componentDidMount = () => {
        var height = Dimensions.get('screen').width;
        this.props.navigation.setParams({
            labels: this.props.label
        });
        if (!this.props.navigation) throw 'I need props.navigation'
        const thisRoute = this.props.navigation.state.routeName;
        this.props.navigation.addListener(
            'willFocus',
            payload => {

                if (payload.state.routeName == "SearchResult") {
                    this.onload()
                }
                BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
            })

        Linking.addEventListener('url', this.handleOpenURL);
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
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
                                    // BackHandler.exitApp()
                                    this.props.navigation.navigate("Dashboard")
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
    handleOpenURL = (event) => {
        this.props.navigation.navigate("Orders")
    }

    onload = () => {
        this.get_logintype().then((response) => {
            this.setState({ logintype: response })
       
            this.get_user_data().then(data => {

                this.setState({ user_data: data, quantity: "0" })
            })
            BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
            var resultdata = this.props.navigation.state.params.data;
            console.log("resultdata Request",resultdata)
            this.setState({ isloading: true, searchtag: resultdata.tags }, () => {
                this.props.searchinventory(resultdata).then(() => {
                    if (this.props.searchdata.data.ResponseMsg == "NO RESULTS - Try a different search") {
                        this.setState({
                            data: [],
                            totalitems: 0,
                            maincat: resultdata.mastercat,
                            subcat_1: resultdata.sub1_str,
                            subcat_2: resultdata.sub2_str,
                            tags: resultdata.searchtag,
                            stock_no: resultdata.sku,
                            sortby: resultdata.sortby,

                        }, () => {
                            this.setState({ isloading: false })
                        })
                    } else {
                        console.log("resultdata Response",this.props.searchdata.data)
                        this.setState({
                            data: this.props.searchdata.data.InventoryData,
                            totalitems: this.props.searchdata.data.sqty,
                            isassociate: this.props.searchdata.data.associate,
                            maincat: resultdata.mastercat,
                            subcat_1: resultdata.sub1_str,
                            subcat_2: resultdata.sub2_str,
                            tags: resultdata.searchtag,
                            stock_no: resultdata.sku,
                            notfound: false,
                            sortby: resultdata.sortby,
                            associate: resultdata.associate
                        }, () => {
                            this.setState({ isloading: false })
                        })
                    }
                })
            })
        })
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


    get_logintype = async () => {

        const loagintype = await AsyncStorage.getItem('logintype')


        var response = JSON.parse(loagintype);
        return response
    }
   
    onBackPress = () => {


        this.props.navigation.goBack(null)



    };


    get_user_data = async () => {

        const user_data = await AsyncStorage.getItem('user_data')


        var response = JSON.parse(user_data);
        return response
    }

    handleLoadMore = async () => {
        var resultdata = this.props.navigation.state.params.data;
        if (!this.onEndReachedCalledDuringMomentum) {
            try {
                console.log(" this.state.current_page", this.state.current_page)
                this.setState({ issubmit: true,loadmore:true, current_page: this.state.current_page + 1 }, () => {
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
                        associate: this.state.associate,
                        sortby: this.state.sortby,
                        Current_Page: this.state.current_page,
                        barcode: resultdata.barcode

                    }
                    this.props.searchinventory(data).then(() => {
                        var result = [...this.state.data, ...this.props.searchdata.data.InventoryData];


                        this.setState({ data: result }, () => {
                            this.setState({ isloading: false ,loadmore:false})
                        })

                    })


                })
            } catch (e) {
                console.log(e);
            }
            this.onEndReachedCalledDuringMomentum = true;
          
        }
    }

    onchangerefresh = () => {
        this.setState({ ischanges: true })
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
                logintype={this.state.logintype}
                issearch={true}
                isassociate={this.state.isassociate}
                
                onchangerefresh={this.onchangerefresh}
            />

        );
    }
    _refreshData = () => {
        this.setState({

            last_id: 0,
            current_page: 0,
            totalitems: 0,
            mastercat: '',
            sub1_str: '',
            sub2_str: '',
            searchtag: '',
            sku: '',
            countOverlay: false,
        }, () => {
            var resultdata = this.props.navigation.state.params.data;
            resultdata.sortby = this.state.sortby
            var dashdata = {
                do: "GetDash",
                userid: this.state.user_data.UserId
            }
            var getstockdata = {
                do: 'GetOutStk',
                userid: this.state.user_data.UserId
            }

            this.props.navigation.state.params.data.refeshMethod()
            this.props.searchinventory(resultdata).then(() => {
                if (this.props.searchdata.data.ResponseMsg == "NO RESULTS - Try a different search") {

                    this.setState({
                        data: [],
                        totalitems: 0,
                        maincat: resultdata.mastercat,
                        subcat_1: resultdata.sub1_str,
                        subcat_2: resultdata.sub2_str,
                        tags: resultdata.searchtag,
                        stock_no: resultdata.sku,
                        sortby: resultdata.sortby,
                        notfound: true,
                    }, () => {
                        this.setState({ ischanges: false, sortoverlay: false })
                    })
                } else {
                    this.setState({
                        data: this.props.searchdata.data.InventoryData,
                        totalitems: this.props.searchdata.data.sqty,
                        maincat: resultdata.mastercat,
                        subcat_1: resultdata.sub1_str,
                        subcat_2: resultdata.sub2_str,
                        tags: resultdata.searchtag,
                        stock_no: resultdata.sku,
                        notfound: false,
                        sortby: resultdata.sortby
                    }, () => {
                        this.setState({ ischanges: false, sortoverlay: false })
                    })
                }
            });


        })

    }
    togglecouneoverlay = () => {
        this.setState({ sortoverlay: false, })
    }

    onsort = (sort) => {
        this.setState({ sortby: sort == "" ? "" : sort }, () => {
            this.refeshMethod();
        })
    }
    _onTap = data => {
        this.navi_redirect()
    };
    navi_redirect = async () => {

        this.props.navigation.navigate("Orders")

    }
    render() {
        const { data } = this.state;
        if (this.state.isloading) {
            return (
                <ImageBackground
                    source={require("../../assets/bg-Blue.jpg")}
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
        } if (this.state.notfound == true) {
            const labels = this.props.label
            return (
                <FlatList
                    data={[{ "key": 1 }]}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={() => {
                        return (
                            <ImageBackground
                                source={require("../../assets/bg-SKY.jpg")}
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



                                <View style={{
                                    width: '100%',
                                    height: 50,
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    paddingTop: 10,
                                    //marginBottom: 25
                                }}>

                                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{labels.placeholder_inventory}</Text>

                                </View>

                                <View style={style.container}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10 }}>
                                        <View style={{ width: '50%' }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ sortoverlay: true })
                                                }} style={{
                                                    borderWidth: 1,
                                                    borderColor: '#ccc',
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 6,
                                                    flexDirection: 'row',
                                                    marginBottom: 5,
                                                    borderRadius: 6
                                                }}>
                                                <Text style={{ textAlign: 'left', fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}></Text>
                                                <Text style={{}}>{this.state.sorttype == "" ? labels.sortcategory : this.state.sorttype}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '50%', justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'right', fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.state.totalitems != "" ? parseInt(this.state.totalitems) : 0} {labels.itemfound}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ textAlign: 'center', marginTop: 15, fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>NO RESULTS - Try a different search</Text>
                                </View>
                            </ImageBackground>
                        )
                    }
                    }
                    refreshControl={

                        <RefreshControl
                        //refreshing={this.state.refreshing}
                        // onRefresh={this._refreshData}
                        />
                    }
                    //onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                    }}
                />
            )
        } else {
            const labels = this.props.label

            return (


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
                    <HeaderBar navigation={this.props.navigation} user_data={this.state.user_data} />



                    <View style={{
                        width: '100%',
                        height: 50,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingTop: 10,
                        //marginBottom: 25
                    }}>

                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{labels.placeholder_inventory}</Text>

                    </View>

                    <View style={style.container}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10 }}>
                            <View style={{ width: '50%' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ sortoverlay: true })
                                    }} style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 6,
                                        flexDirection: 'row',
                                        marginBottom: 5,
                                        borderRadius: 6
                                    }}>
                                    <Text style={{ textAlign: 'left', fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}> </Text>
                                    <Text style={{}}>{this.state.sorttype == "" ? labels.sortcategory : this.state.sorttype}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}>{this.state.totalitems != "" ? parseInt(this.state.totalitems) : 0} {labels.itemfound}</Text>
                            </View>
                        </View>

                        <View style={{ height: '100%' }}>
                            {
                                this.state.ischanges == true ?
                                    <ActivityIndicator size="small" />
                                    : null
                            }

                            <FlatList

                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode='on-drag'
                                contentContainerStyle={{ paddingBottom: 60 }}
                                data={data}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={
                                    this._renderItem
                                }
                             
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.1}
                                ListFooterComponent={() => {
                                    return (
                                        <View>
                                         
                                        </View>
                                    )
                                }}
                                onMomentumScrollBegin={() => {
                                    this.onEndReachedCalledDuringMomentum = false;
                                }}
                            />
                        </View>
                    </View>



                    <Overlay
                        overlayStyle={{ width: '80%', padding: 10, }}
                        isVisible={this.state.sortoverlay} onBackdropPress={this.togglecouneoverlay}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort(0)
                                    this.setState({ sorttype: labels.sortcategory, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 15 }}>{labels.sortcategory}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort(2)
                                    this.setState({ sorttype: labels.size, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 15 }}>{labels.size}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort(3)
                                    this.setState({ sorttype: labels.color, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 15 }}>{labels.color}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort(4)
                                    this.setState({ sorttype: labels.pricehtl, sortoverlay: false })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 15 }}>{labels.pricehtl}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.onsort(5)
                                    this.setState({ sorttype: labels.pricelth })
                                }}
                                style={style.sortbtn}
                            >
                                <Text style={{ fontSize: 15 }}>{labels.pricelth}</Text>
                            </TouchableOpacity>

                        </View>
                    </Overlay>


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
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        height: "80%",
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
    },
    sortbtn: {
        marginBottom: 15
    }
})

const mapStateToProps = state => {
    return {
        label: state.language.data,
        user_data: state.login,
        masterCat: state.masterCat,
        sub1: state.sub1,
        sub2: state.sub2,
        searchdata: state.search_inventory
    };
};

export default connect(
    mapStateToProps,
    {
        getMaterCat,
        getsub1,
        getsub2,
        searchinventory,
        getDahboarddata,
        getoustckdata
    }
)(SearchResult);

