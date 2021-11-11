import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/colors';

const Header = ({ children }) => <Text style={styles.header}>{children}</Text>;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color: "black",
    fontWeight: 'bold',
    paddingVertical: 0,
  },
});

export default memo(Header);
