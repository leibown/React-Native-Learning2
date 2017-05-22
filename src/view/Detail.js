/**
 * Created by Administrator on 2016/12/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ListView,
    TextInput,
    Modal,
} from 'react-native';

import Button from 'react-native-button';
import Video from 'react-native-video';

const width = Dimensions.get('window').width;

import request from '../common/request';
import config from '../common/config';

var cachedResult = {
    nextPage: 1,
    items: [],
    total: 0
};
export default class Detail extends Component {

    constructor(props) {
        super(props);
        cachedResult.items = [];

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            //video
            rate: 1,
            muted: false,
            resizeMode: 'contain',
            repeat: false,
            isEnd: false,
            isPaused: false,
            isError: false,

            //loading
            videoLoaded: false,
            progress: 0.01,
            total: 0,
            currentTime: 0,

            dataSource: ds.cloneWithRows([]),

            //modal
            modalVisible: false,
            commentContent: '',
        }
    }

    _pop = () => {
        this.props.navigator.pop();
    };

    _loadStart = () => {
        console.log('_loadStart');
    };

    _onLoad = () => {
        console.log('_onLoad');
    };
    // Object {seekableDuration: 417, playableDuration: 300.24, currentTime: 252.389}
    _onProgress = (data) => {
        if (!this.state.videoLoaded) {
            this.setState({
                videoLoaded: true,
            });
        }

        if (this.state.isEnd) {
            this.setState({
                isEnd: false,
            });
        }

        let total = data.seekableDuration;
        let currentTime = data.currentTime;
        let progress = Number(currentTime / total);

        this.setState({
            progress: progress,
            total: total,
            currentTime: Number(currentTime),
        });
        console.log('_onProgress:' + data);
    };

    _onEnd = () => {
        this.setState({
            progress: 1,
            isEnd: true,
        });
    };

    _onError = (e) => {
        console.log('_onError：' + e);
        this.setState({
            isError: true,
        });
    };

    _rePlay = () => {
        this.refs.videoPlayer.seek(0);
    };

    _pauseOrStart = () => {
        this.setState({
            isPaused: !this.state.isPaused,
        });
        console.log('点了暂停');
    };

    componentDidMount() {
        this._fetchData(1);
    };

    _fetchData = (page) => {

        this.setState({
            isLoadingTail: true
        });

        request.get(config.api.base + config.api.comment, {
            accessToken: '123123',
            _id: this.props.data._id,
            page: page,
        }).then((data) => {
            if (data.success) {
                let items = cachedResult.items.slice();
                items = items.concat(data.data);
                cachedResult.items = items;
                cachedResult.total = data.total;

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(cachedResult.items),
                    isLoadingTail: false
                });
            }
        });
    };

    _renderRow = (row) => {
        let data = row;
        return (
            <View style={styles.infoBox}>
                <Image source={{uri: data.author.avatar}} style={styles.commentAvatar}/>
                <View style={styles.commentDescBox}>
                    <Text style={styles.commentNickName}>{data.author.nickname}</Text>
                    <Text style={styles.commentContent}>{data.content}</Text>
                </View>
            </View>
        );
    };

    _setModalVisible = (visible) => {
        console.log('visible:' + visible);
        this.setState({
            modalVisible: visible,
        });
    };
    _openModal = () => {
        this._setModalVisible(true);
    };

    _closeModal = () => {
        this._setModalVisible(false);
    };

    //提交评论
    _commitComment = () => {
        console.log('提交评论:' + this.state.commentContent);
        if (this.state.commentContent) {
            request
                .get(config.api.base + config.api.comment, {
                    accessToken: '123123',
                    _id: this.props.data._id,
                })
                .then((data) => {
                    console.log('正确');
                    console.log(data);
                    if (data.success) {
                        this._closeModal();
                        let userComment = {
                            _id: 'asda12313',
                            author: {
                                avatar: 'http://dummyimage.com/640x640/ca5e6a)","nickname":"Steven Taylor',
                                nickname: 'Leibown',
                            },
                            content: this.state.commentContent,
                        };
                        let items = cachedResult.items.slice();
                        items = [userComment].concat(items);
                        cachedResult.items = items;
                        cachedResult.total = data.total + 1;
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(cachedResult.items),
                        });
                    }
                })
                .catch((e) => {
                    console.log('错误：');
                    console.log(e);
                });
        }
    };


    render() {
        let data = this.props.data;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBox} onPress={this._pop}>
                        <Image source={require('../img/back.png')} style={styles.backImg} resizeMode="contain"/>
                        <Text style={{alignSelf: 'center'}}>返回</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16}}>视频详情</Text>
                </View>
                <View style={styles.videoBox}>
                    <Video
                        source={{
                            uri: data.video,
                        }}   // Can be a URL or a local file.
                        ref="videoPlayer"
                        paused={this.state.isPaused}
                        rate={this.state.rate}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={this.state.repeat}

                        playInBackground={false}       // Audio continues to play when app entering background.
                        onLoadStart={this._loadStart}   // Callback when video starts to load
                        onLoad={this._onLoad}      // Callback when video loads
                        onProgress={this._onProgress}      // Callback every ~250ms with currentTime
                        onEnd={this._onEnd}             // Callback when playback finishes
                        onError={this._onError}      // Callback when video cannot be loaded
                        style={styles.backgroundVideo}
                    />
                    {
                        this.state.isError ?
                            <Text style={{
                                position: 'absolute',
                                width: width,
                                top: videoHeight / 2,
                                textAlign: 'center',
                                color: 'white',
                            }}>视频加载失败，sorry~</Text> : null
                    }
                    {
                        !this.state.isEnd && this.state.videoLoaded ?
                            <TouchableOpacity onPress={this._pauseOrStart} style={styles.pauseBox}>
                                {
                                    this.state.isPaused ?
                                        <Image source={require('../img/play_detail.png')} style={styles.play}
                                        /> : null
                                }
                            </TouchableOpacity> : null
                    }
                    {
                        !this.state.videoLoaded && !this.state.isError ?
                            <ActivityIndicator color="#ee735c"
                                               style={styles.loading} size={40}/> : null
                    }
                    {
                        this.state.isEnd ?
                            <TouchableOpacity onPress={this._rePlay} style={styles.playBox}>
                                <Image source={require('../img/play_detail.png')} style={styles.play}
                                />
                                <Text style={{
                                    color: 'white',
                                }}>点击重播</Text>
                            </TouchableOpacity> : null
                    }
                    <View style={styles.progress}>
                        <View style={[styles.progressBar, {width: width * this.state.progress}]}/>
                    </View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    onEndReachedThreshold={30}

                    onEndReached={this._fetchMoreData}
                    renderFooter={this._renderFooter}
                    renderHeader={() => {
                        return (
                            <View>
                                <View style={styles.infoBox}>
                                    <Image source={{uri: data.author.avatar}} style={styles.avatar}/>
                                    <View style={styles.descBox}>
                                        <Text style={styles.nickName}>{data.author.nickname}</Text>
                                        <Text style={styles.title}>{data.title}</Text>
                                    </View>
                                </View>
                                <View style={styles.comment}>
                                    <TouchableOpacity onPress={this._openModal}>
                                        <Text style={styles.content}>敢不敢评论一个...</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.commentArea}>
                                    <Text>精彩评论</Text>
                                </View>
                            </View>
                        );
                    }}
                />
                <Modal
                    animationType='slide'
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        {
                            this._setModalVisible(false)
                        }
                    }}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={this._closeModal}>
                            <Image source={require('../img/close.png')} style={styles.modalClose}/>
                        </TouchableOpacity>
                        <TextInput
                            placeholder='敢不敢评论一个'
                            style={styles.content}
                            multiline={true}
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => {
                                this.setState({
                                    commentContent: text,
                                });
                            }}
                        />
                        <Button style={styles.commitBtn} onPress={this._commitComment}>提交</Button>
                    </View>
                </Modal>
            </View>
        );
    }

    _hasMore = () => {
        return cachedResult.items.length !== cachedResult.total;
    };

    _fetchMoreData = () => {
        if (!this._hasMore() || this.state.isLoadingTail) {
            return;
        }
        cachedResult.nextPage = cachedResult.nextPage += 1;
        let page = cachedResult.nextPage;
        console.log("page" + page);
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


}

const videoHeight = width * 0.56;

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F5FCFF',
        },
        modalContainer: {
            flex: 1,
        },
        modalClose: {
            alignSelf: 'center',
            width: 50,
            height: 50,
        },
        commitBtn: {
            width: width - 20,
            margin: 10,
            padding: 15,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            justifyContent: 'center',
            alignSelf: 'center',
            textAlign: 'center',
        },
        header: {
            flexDirection: 'row',
            width: width,
            height: 50,
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
        }
        ,
        backBox: {
            position: 'absolute',
            flexDirection: 'row',
            width: 100,
            left: 0,
            alignItems: 'center',
            marginTop: 13,
        }
        ,
        backImg: {
            height: 24,
            width: 30,
        }
        ,
        videoBox: {
            width: width,
            backgroundColor: '#000',
        }
        ,
        backgroundVideo: {
            width: width,
            height: videoHeight,
        }
        ,
        progress: {
            backgroundColor: 'gray',
            width: width,
            height: 2,
        }
        ,
        progressBar: {
            backgroundColor: 'orange',
            width: 1,
            height: 2,
        }
        ,
        loading: {
            position: 'absolute',
            left: 0,
            top: videoHeight / 2 - 20,
            width: width,
            alignSelf: 'center',
            backgroundColor: 'transparent',
        }
        ,
        play: {
            alignSelf: 'center',
            width: 60,
            height: 60,
        }
        ,
        playBox: {
            position: 'absolute',
            left: width / 2 - 30,
            top: videoHeight / 2 - 30,
            justifyContent: 'center',
            alignItems: 'center',
        }
        ,
        pauseBox: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: videoHeight,
            justifyContent: 'center',
            alignItems: 'center',
        }
        ,

        infoBox: {
            width: width,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
        }
        ,
        avatar: {
            width: 60,
            height: 60,
            marginRight: 10,
            marginLeft: 10,
            borderRadius: 30,
        }
        ,
        descBox: {
            flex: 1,
        }
        ,
        nickName: {
            fontSize: 16,
        }
        ,
        title: {
            marginTop: 8,
            fontSize: 16,
            color: '#666',
        }
        ,
        commentAvatar: {
            width: 40,
            height: 40,
            marginRight: 10,
            marginLeft: 10,
            borderRadius: 20,
        }
        ,
        commentDescBox: {
            flex: 1,
        }
        ,
        commentNickName: {
            fontSize: 14,
        }
        ,
        commentContent: {
            marginTop: 8,
            fontSize: 14,
            color: '#999',
        }
        ,
        loadingMore: {
            height: 60,
            alignItems: 'center',
            justifyContent: 'center'
        }
        ,
        comment: {
            marginTop: 10,
            marginBottom: 10,
            padding: 8,
        }
        ,
        content: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 4,
            fontSize: 14,
            height: 80,
            padding: 10,
            justifyContent: 'flex-start'
        }
        ,
        commentArea: {
            padding: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        }
        ,
    })
    ;