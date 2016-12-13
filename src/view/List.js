/**
 * Created by Administrator on 2016/12/12.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    Image,
    ActivityIndicator
} from 'react-native';

import request from '../common/request';
import config from '../common/config';

const width = Dimensions.get('window').width;


var cachedResult = {
    nextPage: 1,
    items: [],
    total: 0
};
export default class List extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            isLoadingTail: false,
        }
    }

    // http://rap.taobao.org/mockjs/11392/api/creations?accessToken=12323

    componentDidMount() {
        this._fetchData(1);
    }

    _renderRow = (row) => {
        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>{row.title}</Text>
                <Image source={{uri: row.thumb}} style={styles.itemImage}>
                    <Image source={require('../img/play.png')} style={styles.play}/>
                </Image>
                <View style={styles.itemFooter}>
                    <View style={styles.handleText}>
                        <Image source={require('../img/like.png')} style={styles.moreImg}/>
                        <Text style={styles.moreText}>点赞</Text>
                    </View>
                    <View style={styles.handleText}>
                        <Image source={require('../img/comment.png')} style={styles.moreImg}/>
                        <Text style={styles.moreText}>评论</Text>
                    </View>
                </View>
            </View>);
    };

    _fetchData = (page) => {
        let that = this;
        this.setState({
            isLoadingTail: true
        });
        request.get(config.api.base + config.api.list, {
            accessToken: '123123',
            page: page
        }).then((data) => {
            if (data.success) {
                let items = cachedResult.items.slice();
                items = items.concat(data.data);
                cachedResult.items = items;
                cachedResult.total = data.total;

                setTimeout(() => {
                    that.setState({
                        dataSource: that.state.dataSource.cloneWithRows(cachedResult.items),
                        isLoadingTail: false
                    });
                }, 2000);
            }
        })
            .catch((error) => {
                console.error(error);
                this.setState({
                    isLoadingTail: false
                });
            });
    };

    _hasMore = () => {
        return cachedResult.items.length !== cachedResult.total;
    };

    _fetchMoreData = () => {
        if (!this._hasMore() || this.state.isLoadingTail) {
            return;
        }
        let page = cachedResult.nextPage;
        this._fetchData(page);
    };

    _renderFooter = () => {
        if (!this._hasMore() && cachedResult.total !== 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了</Text>
                </View>
            )
        }

        if (!this.state.isLoadingTail) {
            return (
                <View style={styles.loadingMore}/>);
        }

        return (
            <ActivityIndicator
                style={styles.loadingMore}
                animating={true}
                size={30}/>
        );
    };


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>视频列表</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    onEndReachedThreshold={20}
                    onEndReached={this._fetchMoreData}
                    renderFooter={this._renderFooter}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F5FCFF',
        },
        header: {
            width: width,
            height: 50,
            backgroundColor: 'skyblue',
            justifyContent: 'center',
            alignItems: 'center',
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
        loadingMore: {
            marginVertical: 20,
        },
        loadingText: {
            color: '#777',
            textAlign: 'center'
        }
    }
);