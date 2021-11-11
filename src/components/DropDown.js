import React, { memo } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../constants/colors';
import { Picker } from 'react-native-picker-dropdown'
const CustemPicker = ({ selected, cheight, type, data, errorText, ...props }) => (
    <View style={{ padding: 1 }}>
        <View style={styles.container}>
            {
                selected== "" ?
                    Platform.OS === 'ios' ? 
            <Text style={{color: "#000", position: 'absolute',paddingLeft:10,fontSize:16 }}>{type}</Text>
                        : null
                    : null
            }
            <Picker
                
                style={{ height: cheight != undefined ? cheight : 50, width: "100%", }}
                textStyle={{fontSize:16}}
              
                {...props}

            >
                <Picker.Item label={type} value="" />

                {
                    data.map((u, i) => {
                        return (
                            <Picker.Item key={i} label={u.Text} value={u.Value} />
                        )
                    })
                }


            </Picker>

        </View>
        {/* {
            errorText != "" ? <Text style={styles.error}>{errorText}</Text> : null
        } */}

    </View>
);

const styles = StyleSheet.create({
    
    container: {
        width: '100%',
       // marginVertical: 8,
        //borderWidth: 1, borderColor: '#506d96',
        //borderRadius: 5,
        //marginTop: 4,
        justifyContent: 'center', //alignItems: 'center'


    }, error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
    input: {
        backgroundColor: theme.colors.surface,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
});

export default memo(CustemPicker);
