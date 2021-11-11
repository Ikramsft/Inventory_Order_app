import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/logo.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 135,
    marginVertical: "5%",
    //borderRadius:35,
    resizeMode:'contain'
  },
});

export default memo(Logo);
