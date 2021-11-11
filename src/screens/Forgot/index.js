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
    BackHandler,
    KeyboardAvoidingView,
    TextInput as NativeTextInput,
    Alert
} from "react-native";
import { FONT_GOOGLE_BARLOW_REGULAR as FONT_GOOGLE_BARLOW, FONT_GOOGLE_BARLOW_SEMIBOLD } from '../../constants/fonts';

import Icon from 'react-native-vector-icons/Feather';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { Picker } from 'react-native-picker-dropdown'
import { AppStyles } from "../../utility/AppStyles";
import Logo from '../../components/Logo';
import { connect } from "react-redux";
import {
    isFieldEmpty, objectLength
} from '../../utility';
import { CheckBox, Button, Input as TextInput, Overlay } from 'react-native-elements';
import { Grid, Row, Col } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../components/Header';
//import TextInput from '../../components/TextInput';
//import Button from '../../components/Button'
const { width, height } = Dimensions.get("window");
import { TouchableOpacity } from "react-native-gesture-handler";
import { get_country, foregotpassword } from './actions';
class Signup extends React.Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.state = {
            issubmit: false,
            isloading: true,
            first_name: "",
            countrycode: "",
            countrycodeid: "",
            cellphone: "",
            password: "",
            country_codes: null,
            label: null,
            counstrycodeOverlay: false,
            //error property
            error_first_name: "",
            error_countrycode: "",
            error_cellphone: "",
            error_password: "",
            error_countrycodeid: "",
            language: '',
            timer: 0,

        }
    }
    componentDidMount = () => {

        var data = {
            do: "GetCountry"
        }
        this.props.get_country(data).then(() => {
            this.props.navigation.setParams({
                labels: this.props.label
            });
            this.get_selected_language().then((response) => {

                this.setState({
                    country_codes: this.props.countrycode.data,
                    label: this.props.label,
                    language: response.select_lang == 1 ? "EN" : "ES"

                }, () => {
                    this.setState({ isloading: false, countrycode: this.state.label.placeholder_country })
                })
            })
        })
        this.clockCall = setInterval(() => {
            this.decrementClock();
        }, 1000);
    }
    componentWillUnmount() {
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
                                    BackHandler.exitApp()
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
    get_selected_language = async () => {
        const loagintype = await AsyncStorage.getItem('language')
        var response = JSON.parse(loagintype);
        return response
    }
    foregot = () => {
        this.setState({ issubmit: true }, () => {
            var isvalid = [];
            const labels = this.state.label
            if (isFieldEmpty(this.state.first_name) == true) {
                this.setState({ error_first_name: labels.error_first_name_msg }, () => {
                    // alert(this.state.error_first_name)
                })
                isvalid.push(false)
            } else {
                this.setState({ error_first_name: "" })
                isvalid.push(true)
            }
            if (isFieldEmpty(this.state.cellphone) == true) {
                this.setState({ error_cellphone: labels.error_cellphone_msg })
                isvalid.push(false)
            } else {
                this.setState({ error_cellphone: "" })
                isvalid.push(true)
            }

            if (isFieldEmpty(this.state.countrycodeid) == true) {
                this.setState({ error_countrycodeid: labels.error_country_code_msg })
                isvalid.push(false)
            } else {
                this.setState({ error_countrycodeid: "" })
                isvalid.push(true)
            }
            if (isvalid.includes(false) != true) {
                var data = {
                    do: "forgotpassword",
                    firstname: this.state.first_name,
                    prephone: this.state.countrycodeid,
                    cellphone: this.state.cellphone,
                    osname: Platform.OS === "android" ? "and" : "ios",
                    lang: this.state.language
                }
                this.props.foregotpassword(data).then(() => {
                    this.setState({ issubmit: false }, () => {
                        if (this.props.foregotdata.data.ResponseMsg == "Password recovery") {

                            Alert.alert(
                                labels.forgotsuccess,
                                labels.forgotsuccessmsg,
                                [
                                    {
                                        text: "OK", onPress: () => {
                                            this.props.navigation.navigate("Login");
                                        }
                                    },



                                ],
                                { cancelable: false }
                            );

                        } else {

                            Alert.alert(
                                labels.forgotLabel,
                                labels.forgotmsg,
                                [
                                    {
                                        text: "OK", onPress: () => {

                                        }
                                    },



                                ],
                                { cancelable: false }
                            );
                        }
                    })
                })
            } else {
                this.setState({ issubmit: false })
            }
        })
    }
    showshowcountrycode = () => {
        this.setState({ counstrycodeOverlay: true })
    }
    toggleOverlay = () => {
        this.setState({ counstrycodeOverlay: false });

    };
    render() {
        if (this.state.isloading) {
            return (
                <ImageBackground source={require('../../assets/bg-Blue.jpg')} style={{ width: '100%', height: '100%', resizeMode: "cover", justifyContent: 'center', alignItems: 'center' }}>


                    <ActivityIndicator
                        size="large"
                    />

                </ImageBackground>
            )
        } else {
            const labels = this.state.label
            var textcolor = "";
            if (this.state.countrycode == "Cellular country code" || this.state.countrycode == "código de país") {
                textcolor = "#000";
            } else {
                textcolor = "black";
            }
            return (
                <ImageBackground source={require('../../assets/bg-Blue.jpg')} style={{ width: '100%', height: '100%', resizeMode: "cover", }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : null}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
                        <ScrollView
                            keyboardShouldPersistTaps={"always"}
                            contentContainerStyle={style.container}
                        >
                            <Logo />
                            <View style={{ width: (Dimensions.get('screen').width / 100) * 80, marginTop: (Dimensions.get('screen').height / 100) * 10 }}>
                                {/* <Text style={{ fontSize: (Dimensions.get('screen').width / 100) * 3.9, textAlign: 'center', marginBottom: 15 }}>Enter Information recover your password!</Text> */}
                                <View style={[style.drop1, {
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    marginBottom: 20,
                                    borderBottomColor: this.state.error_first_name != "" ? "red" : "#b4b4b4"
                                }]}>
                                    {/* <Text style={style.droptitle}>{labels.placeholder_username}</Text> */}

                                    <NativeTextInput

                                        value={this.state.first_name}
                                        style={[style.extrainput, { width: '90%', }]}
                                        placeholder={labels.placeholder_firstname}
                                        onChangeText={text => this.setState({ first_name: text })}
                                        errorText={this.state.erroe_cellphone}
                                        placeholderTextColor="black"
                                        autoCapitalize="words"
                                    />
                                    <Icon
                                        name='user'
                                        size={20}
                                        color='#00b8e4'
                                    />

                                </View>



                                <View style={{
                                    borderBottomWidth: 1.5,
                                    borderBottomColor: this.state.error_countrycodeid != "" ? "red" : "#b4b4b4",
                                    marginBottom: 15,
                                    marginLeft: 10,
                                    marginRight: 10,

                                }}>


                                    <TouchableOpacity
                                        style={{
                                            marginBottom: 10,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            width: '100%'
                                        }}
                                        onPress={() => {
                                            // Keyboard.dismiss
                                            this.showshowcountrycode()

                                            //  this.setState({ masterOverlay: true })
                                        }}
                                    >
                                        <Grid style={{ height: 40 }}>
                                            <Row>
                                                <Col size={90}>
                                                    <Text style={{
                                                        fontSize: 16,
                                                        color: '#000',
                                                        marginTop: 10,

                                                        //fontWeight: '500',
                                                        fontFamily: FONT_GOOGLE_BARLOW
                                                    }}>{this.state.countrycode}</Text>
                                                </Col>
                                                <Col size={10} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <IoIcon name="ios-arrow-down" size={20}
                                                        color='#00b8e4' />
                                                </Col>
                                            </Row>
                                        </Grid>


                                    </TouchableOpacity>


                                </View>



                                <View style={[style.drop1, {
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    marginBottom: 15,
                                    borderBottomColor: this.state.error_cellphone != "" ? "red" : "#b4b4b4",
                                }]}>
                                    {/* <Text style={style.droptitle}>{labels.placeholder_username}</Text> */}

                                    <NativeTextInput

                                        value={this.state.cellphone}
                                        style={[style.extrainput, { width: '90%', }]}
                                        placeholder={labels.placeholder_cellphone}
                                        onChangeText={text => this.setState({ cellphone: text })}
                                        errorText={this.state.erroe_cellphone}
                                        placeholderTextColor="black"
                                        keyboardType="phone-pad"

                                    />
                                    <Icon
                                        name='phone'
                                        size={20}
                                        color='#00b8e4'
                                    />
                                </View>

                                {this.state.issubmit == true ?

                                    <ActivityIndicator size="large" />
                                    : null}
                                <Button
                                    title={labels.submit}
                                    titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                    buttonStyle={{ backgroundColor: '#00b8e4' }}
                                    containerStyle={{ width: '100%' }}
                                    onPress={() => this.foregot()}
                                />
                                <Button
                                    title={labels.label_cancel}
                                    titleStyle={{ fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD }}
                                    buttonStyle={{ backgroundColor: '#00b8e4', marginTop: 10 }}
                                    containerStyle={{ width: '100%' }}
                                    onPress={() => {
                                        this.props.navigation.goBack(null)
                                    }}
                                />
                            </View>
                            <Overlay
                                overlayStyle={{ width: '70%', padding: 10, height: 450 }}
                                isVisible={this.state.counstrycodeOverlay} onBackdropPress={this.toggleOverlay}>
                                <ScrollView
                                    keyboardShouldPersistTaps={"always"}>
                                    {


                                        this.state.iscatloading == true ?
                                            <View style={{ margin: 10 }}>
                                                <ActivityIndicator size="small" />
                                            </View>
                                            :
                                            <Grid>
                                                {
                                                    objectLength(this.state.country_codes) != 0 ?
                                                        this.state.country_codes.map((v, i) => {
                                                            return (
                                                                <Row style={{ margin: 5 }}>
                                                                    <Col size={8} onPress={() => {

                                                                        this.setState({ countrycodeid: v.dial_code, countrycode: v.country, counstrycodeOverlay: false })
                                                                    }}>
                                                                        <Text>{v.country}{" (" + v.dial_code + ")"}</Text>


                                                                    </Col>

                                                                </Row>

                                                            )
                                                        }) : null
                                                }
                                            </Grid>
                                    }
                                </ScrollView>


                            </Overlay>

                        </ScrollView >
                    </KeyboardAvoidingView>
                </ImageBackground>

            );
        }
    }
}

const style = StyleSheet.create({
    container: {
        padding: 15,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    drop: {
        width: '100%'
    },
    drop1: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#b4b4b4',
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    extrainput: {
        marginBottom: 0,
        height: 50,
        fontSize: 16,
        color: '#0f3e53',
    },
})

const mapStateToProps = state => {

    return {
        label: state.language.data,
        user_data: state.login,
        countrycode: state.countrycode.data,
        signup: state.do_signup,
        foregotdata: state.foregotpassword
    };
};

export default connect(
    mapStateToProps,
    {
        get_country,
        foregotpassword
    }
)(Signup);

