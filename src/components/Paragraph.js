import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/colors';

const Paragraph = ({ children }) => <Text style={styles.text}>{children}</Text>;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: "black",
    textAlign: 'justify',
    marginBottom: 14,
  },
});

export default memo(Paragraph);
