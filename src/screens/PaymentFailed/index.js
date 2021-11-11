import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";

// Constants
import {
  FONT_GOOGLE_BARLOW_SEMIBOLD,
  FONT_GOOGLE_BARLOW_REGULAR,
} from "../../constants/fonts";
import { connect } from "react-redux";
const PaymentFailed = (props) => {
  var labels = props.label;
  const [isLoading, setIsLoading] = useState(false);
  return (
    <ImageBackground
      source={require("../../assets/bg-Blue.jpg")}
      style={{ width: "100%", height: "100%", resizeMode: "cover" }}
    >
      <SafeAreaView>
        <ScrollView>
          {isLoading ? (
            <View style={[styles.center, { flex: 1, opacity: 0.5 }]}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={styles.failedMsgBox}>
              <Text style={styles.failedMsg}>{labels.problem}</Text>

              {/* Restore Your Purchase */}
              <TouchableOpacity
                style={{
                  ...styles.failedButton,
                  backgroundColor: "#f9c032",
                }}
                onPress={() =>
                  props.navigation.navigate("SubsCriptionExpiration")
                }
              >
                <Text style={styles.failedText}>{labels.restoremsg}</Text>
              </TouchableOpacity>

              {/* Go to Login */}
              {/* <TouchableOpacity
                  style={{
                    ...styles.failedButton,
                    backgroundColor: "#70ad47",
                  }}
                  onPress={() => props.navigation.navigate("Login")}
                >
                  <Text style={styles.failedText}>{labels.gotologin}</Text>
                </TouchableOpacity> */}
              <View style={styles.failedDescriptionBox}>
                <Text style={styles.paymentBullets}>{labels.iTunes}</Text>
                <Text style={styles.paymentBullets}>{labels.subscription}</Text>
                <Text style={styles.paymentBullets}>{labels.account24}</Text>
                <Text style={styles.paymentBullets}>{labels.subsmanage}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text
                    style={{
                      ...styles.subscriptionText,
                      textAlign: "center",
                      color: "blue",
                      fontSize: 15,
                      textAlign: "justify",
                    }}
                  >
                    {labels.terms}
                  </Text>
                </View>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text
                    style={{
                      ...styles.subscriptionText,
                      textAlign: "center",
                      color: "blue",
                      fontSize: 15,
                      textAlign: "justify",
                    }}
                  >
                    {labels.privacy}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  failedMsgBox: {
    width: Dimensions.get("window").width - 100,
    alignSelf: "center",
  },
  failedMsg: {
    fontSize: 22,
    fontFamily: FONT_GOOGLE_BARLOW_SEMIBOLD,
    textAlign: "center",
    marginTop: 30,
    color: "red",
  },
  failedButton: {
    backgroundColor: "#2e75b6",
    marginTop: 35,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  failedText: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: FONT_GOOGLE_BARLOW_REGULAR,
  },
  failedDescriptionBox: {
    marginTop: 40,
  },
  paymentBullets: {
    fontSize: 17,
    fontFamily: FONT_GOOGLE_BARLOW_REGULAR,
    marginTop: 15,
    color: "#333333",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    label: state.language.data,
  };
};

export default connect(
  mapStateToProps,
  {}
)(PaymentFailed);
//export default PaymentFailed;
