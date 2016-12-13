/**
 * Created by Administrator on 2016/12/12.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    Dimensions
} from 'react-native';

export default class Edit extends Component {

    _renderView = () => {
        return (
            <View style={styles.container}>
                <Text>编辑界面</Text >
            </View>
        );
    };

    render() {
        return (
            this._renderView()
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});