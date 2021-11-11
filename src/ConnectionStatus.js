import React, { useState, useEffect } from "react";
import { Platform, View, Text } from "react-native";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";
export default function ConnectionStatus({ isVisible }) {
  return (
    <>
      {isVisible && (
        <View
          style={{
            backgroundColor: "red",
            flex: 1,
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
            paddingVertical: 12,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            {"No Internet"}
          </Text>
        </View>
      )}
    </>
  );
}

ConnectionStatus.propTypes = {
  isVisible: PropTypes.bool,
};
