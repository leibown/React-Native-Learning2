/**
 * Created by Administrator on 2016/12/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
} from 'react-native';

import request from '../common/request';
import config from '../common/config';

const width = Dimensions.get('window').width;
export default class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            up: false,
        };
    }

    _up = () => {
        let up = !this.state.up;
        let row = this.props.row;
        let url = config.api.base + config.api.up;

        let body = {
            id: row._id,
            up: up ? 'yes' : 'no',
            accessToken: 'asd'
        };


        request
            .post(url, body)
            .then((data) => {
                if (data && data.success) {
                    this.setState({
                        up: up,
                    });
                } else {
                    Alert.alert('点赞失败，稍后重试')
                }
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('点赞失败，稍后重试');
            });
    };

    _renderView = () => {
        let row = this.props.row;
        return (
            <TouchableOpacity onPress={this.props.onSelect}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>{row.title}</Text>
                    <Image source={{uri: row.thumb}} style={styles.itemImage}>
                        <Image source={require('../img/play.png')} style={styles.play}/>
                    </Image>
                    <View style={styles.itemFooter}>
                        <TouchableOpacity onPress={this._up}>
                            <View style={styles.handleText}>
                                <Image source={this.state.up ? require('../img/liked.png') : require('../img/like.png')}
                                       style={styles.moreImg}/>
                                <Text style={styles.moreText}>点赞</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.handleText}>
                            <Image source={require('../img/comment.png')} style={styles.moreImg}/>
                            <Text style={styles.moreText}>评论</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
    item: {},
    itemImage: {
        width: width,
        height: width * 0.65
    },
    itemText: {
        padding: 10,
        fontSize: 15,
    },
    play: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 40,
        height: 40,
    },
    itemFooter: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'space-between',
    },
    handleText: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: width / 2 - 0.5,
        backgroundColor: 'white'
    },
    moreImg: {
        width: 25,
        height: 25,
        margin: 10
    },
    moreText: {
        alignSelf: 'center',
        fontSize: 18,
    },
});