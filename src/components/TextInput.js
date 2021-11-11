import React, { memo } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { theme } from '../constants/colors';
const TextInput1 = ({ errorText, ...props }) => {

  return (
    
        <TextInput {...props} />
      
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    flexDirection: 'row',
    width: '100%'

  },
  input: {
    backgroundColor: theme.colors.surface,
    height: 45,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput1);
