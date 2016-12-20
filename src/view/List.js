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
    RefreshControl
} from 'react-native';

import {ActivityIndicator} from 'antd-mobile';

import request from '../common/request';
import config from '../common/config';
import Item from './Item';
import Detail from './Detail';


const width = Dimensions.get('window').width;


var cachedResult = {
    nextPage: 1,
    items: [],
    total: 0
};
export default class List extends Component {

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            isLoadingTail: false,
            isRefreshing: false
        }
    }

    // http://rap.taobao.org/mockjs/11392/api/creations?accessToken=12323

    componentDidMount() {
        this._fetchData(1);
    }

    _renderRow = (row) => {
        return (<Item row={row} onSelect={() => this._loadPage(row)}/>);
    };

    _loadPage = (row) => {
        this.props.navigator.push({
            name: 'detail',
            component: Detail,
            params: {
                data: row
            }
        });
    };

    _fetchData = (page) => {
        let that = this;
        if (page > 1) {
            this.setState({
                isLoadingTail: true
            });
        } else {
            this.setState({
                isRefreshing: true
            });
        }
        request.get(config.api.base + config.api.list, {
            accessToken: '123123',
            page: page
        }).then((data) => {
            if (data.success) {
                if (page == 1) {
                    cachedResult.items = [];
                }

                let items = cachedResult.items.slice();
                items = items.concat(data.data);
                cachedResult.items = items;
                cachedResult.total = data.total;

                if (page > 1) {
                    that.setState({
                        dataSource: that.state.dataSource.cloneWithRows(cachedResult.items),
                        isLoadingTail: false
                    });
                } else {
                    this.setState({
                        dataSource: that.state.dataSource.cloneWithRows(cachedResult.items),
                        isRefreshing: false
                    });
                }
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
        cachedResult.nextPage = cachedResult.nextPage += 1;
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
            <View style={styles.loadingMore}>
                <ActivityIndicator
                    animating={true}
                    size={30}
                    text="正在加载中"/>
            </View>
        );
    };

    _onRefresh = () => {
        this._fetchData(1);
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
                    onEndReachedThreshold={30}
                    onEndReached={this._fetchMoreData}
                    renderFooter={this._renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['black']}
                            progressBackgroundColor="white"
                        />
                    }
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
        loadingMore: {
            height: 60,
            alignItems: 'center',
            justifyContent: 'center'
        },
        loadingText: {
            color: '#777',
            textAlign: 'center'
        }
    }
);