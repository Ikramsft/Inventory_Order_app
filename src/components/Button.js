import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../constants/colors';

const Button = ({ mode, style, children, ...props }) => (
  <PaperButton
    // style={[
    //   styles.button,
    //   mode === 'outlined' && { backgroundColor: '#f40e02' },
    //   style,
    // ]}
  
    style={styles.button}
    labelStyle={styles.text}
  //  mode='text'
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 5,
    backgroundColor: "#f40e02"
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
    color:'white',
  },
});

export default memo(Button);
