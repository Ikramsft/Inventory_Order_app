import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
  Platform,
} from "react-native";
import { Header, Colors } from "react-native/Libraries/NewAppScreen";
import Logo from "../../components/Logo";
import { connect } from "react-redux";
import HeaderBar from "../../components/HeaderBar";
import AsyncStorage from "@react-native-community/async-storage";
import { GooglePay } from "react-native-google-pay";
import { logout } from "../Language/actions";
// const PaymentRequest = require("react-native-payments").PaymentRequest;

class Subscription extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      user_data: null,
      isloading: true,
    };
  }
  componentDidMount = () => {
    this.get_user_data().then((data) => {
      this.setState({ user_data: data }, () => {
        this.setState({ isloading: false });
      });
    });
  };

  get_user_data = async () => {
    const user_data = await AsyncStorage.getItem("user_data");

    var response = JSON.parse(user_data);
    return response;
  };
  pay = (subs) => {
    const METHOD_DATA = [
      {
        supportedMethods: ["apple-pay"],
        data: {
          merchantIdentifier: "merchant.com.sss.kizbin",
          supportedNetworks: ["visa", "mastercard", "amex"],
          countryCode: "US",
          currencyCode: "USD",
        },
      },
    ];

    const DETAILS = {
      id: "basic-example",
      displayItems: [
        {
          label: "kizbin Subscription",
          amount: { currency: "USD", value: subs },
        },
      ],
      shippingOptions: [
        {
          id: "economy",
          label: "",
          amount: { currency: "USD", value: "0.00" },
          detail: "", // `detail` is specific to React Native Payments
        },
      ],
      total: {
        label: "Enappd Store",
        amount: { currency: "USD", value: subs },
      },
    };
    const OPTIONS = {
      requestPayerName: true,
      requestPayerPhone: true,
      requestPayerEmail: true,
      requestShipping: true,
    };

    // this.paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

    // this.paymentRequest.addEventListener("shippingaddresschange", (e) => {
    //   const updatedDetails = getUpdatedDetailsForShippingAddress(
    //     this.paymentRequest.shippingAddress
    //   );

    //   e.updateWith(updatedDetails);
    // });

    // this.paymentRequest.addEventListener("shippingoptionchange", (e) => {
    //   const updatedDetails = getUpdatedDetailsForShippingOption(
    //     this.paymentRequest.shippingOption
    //   );

    //   e.updateWith(updatedDetails);
    // });

    // this.paymentRequest.canMakePayments().then((canMakePayment) => {
    //   if (canMakePayment) {
    //     this.paymentRequest.show().then((paymentResponse) => {
    //       paymentResponse.complete("success");
    //     });
    //   } else {
    //   }
    // });
  };

  gpay = (subscriptiontype) => {
    const allowedCardNetworks = ["VISA", "MASTERCARD"];
    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
    const requestData = {
      cardPaymentMethod: {
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          // stripe (see Example):
          gateway: "stripe",
          gatewayMerchantId: "00742455372223323483",
          stripe: {
            publishableKey: "pk_test_TYooMQauvdEDq54NiTphI7jx",
            version: "2018-11-08",
          },
          // other:
          //  gateway: 'Kizbin',
          //gatewayMerchantId: '00742455372223323483',
        },
        allowedCardNetworks,
        allowedCardAuthMethods,
      },
      transaction: {
        totalPrice: "0.1",
        totalPriceStatus: "FINAL",
        currencyCode: "USD",
      },
      merchantName: "Example Merchant",
    };
    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods).then(
      (ready) => {
        if (ready) {
          GooglePay.requestPayment(requestData)
            .then((token: string) => {})
            .catch((error) => console.log(error.code, error.message));
        }
      }
    );
  };
  render() {
    const labels = this.props.label;
    if (this.state.isloading == true) {
      return (
        <ImageBackground
          source={require("../../assets/bg-YELLOW.jpg")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          source={require("../../assets/bg-YELLOW.jpg")}
          style={{
            width: "100%",
            height: "100%",

            overflow: "hidden",
          }}
          imageStyle={{
            resizeMode: "cover",
            height: "100%",
          }}
        >
          <HeaderBar
            navigation={this.props.navigation}
            user_data={this.state.user_data}
          />

          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Logo />
              </View>

              {global.HermesInternal == null ? null : (
                <View style={styles.engine}>
                  <Text style={styles.footer}>Engine: Hermes</Text>
                </View>
              )}
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Welcome to Kizbin</Text>
                  <Text style={styles.sectionDescription}>
                    Thank you for Subscription
                  </Text>
                </View>
              </View>
              <View style={styles.body}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    if (Platform.OS == "ios") {
                      this.pay("449");
                    } else {
                      this.gpay();
                    }
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    {labels.subs_anual}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    if (Platform.OS == "ios") {
                      this.pay("49");
                    } else {
                      this.gpay();
                    }
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    {labels.subs_monthly}
                  </Text>
                </TouchableOpacity>

                {/* Subscription Expiration Page */}
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("SubsCriptionExpiration");
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Subscription Expiration Page
                  </Text>
                </TouchableOpacity>

                {/* Payment Failed Page */}
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("PaymentFailed");
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Payment Failed Page
                  </Text>
                </TouchableOpacity>
                {/* Subscription expire */}
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 180,

                    backgroundColor: "#138eaf",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    zIndex: 9999,
                  }}
                  onPress={() => {
                    AsyncStorage.clear();
                    this.props.navigation.navigate("SubsCriptionExpiration");
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Subscription expire
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  scrollView: { backgroundColor: Colors.lighter, height: "100%" },
  engine: { position: "absolute", right: 0 },
  body: {
    backgroundColor: Colors.white,
    padding: 15,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  sectionContainer: { marginTop: 32, paddingHorizontal: 24 },
  itemContainer: {
    marginTop: 12,
    paddingHorizontal: 24,
    display: "flex",
    flexDirection: "row",
  },
  totalContainer: {
    marginTop: 12,
    paddingHorizontal: 24,
    display: "flex",
    flexDirection: "row",
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 20,
  },
  itemDetail: { flex: 2 },
  itemTitle: { fontWeight: "500", fontSize: 18 },
  itemDescription: { fontSize: 12 },
  itemPrice: { flex: 1 },
  sectionTitle: { fontSize: 24, fontWeight: "600", color: Colors.black },
  sectionDescription: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: { fontWeight: "700" },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
    logindata: state.login,
    user_data: state.user_data,
  };
};

export default connect(
  mapStateToProps,
  {}
)(Subscription);
