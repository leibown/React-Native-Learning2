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
    ScrollView,
} from 'react-native';

import Video from 'react-native-video';
const width = Dimensions.get('window').width;

export default class Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rate: 1,
            muted: false,
            resizeMode: 'contain',
            repeat: false,


            videoLoaded: false,

            progress: 0.01,
            total: 0,
            currentTime: 0,

            isEnd: false,
            isPaused: false,
            isError: false,
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
                                top: 180,
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
                <ScrollView style={styles.scrollview}>
                    <View style={styles.infoBox}>
                        <Image source={{uri: data.author.avatar}} style={styles.avatar}/>
                        <View style={styles.descBox}>
                            <Text style={styles.nickName}>{data.author.nickname}</Text>
                            <Text style={styles.title}>{data.title}</Text>
                        </View>
                    </View>

                </ScrollView>
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
        flexDirection: 'row',
        width: width,
        height: 50,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBox: {
        position: 'absolute',
        flexDirection: 'row',
        width: 100,
        left: 0,
        alignItems: 'center',
        marginTop: 13,
    },
    backImg: {
        height: 24,
        width: 30,
    },
    videoBox: {
        width: width,
        backgroundColor: '#000',
    },
    backgroundVideo: {
        width: width,
        height: 360,
    },
    progress: {
        backgroundColor: 'gray',
        width: width,
        height: 2,
    },
    progressBar: {
        backgroundColor: 'orange',
        width: 1,
        height: 2,
    },
    loading: {
        position: 'absolute',
        left: 0,
        top: 160,
        width: width,
        alignSelf: 'center',
        backgroundColor: 'transparent',
    },
    play: {
        alignSelf: 'center',
        width: 60,
        height: 60,
    },
    playBox: {
        position: 'absolute',
        left: width / 2 - 30,
        top: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseBox: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: 360,
        justifyContent: 'center',
        alignItems: 'center',
    },

    infoBox: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 30,
    },
    descBox: {
        flex: 1,
    },
    nickName: {
        fontSize: 16,
    },
    title: {
        marginTop: 8,
        fontSize: 16,
        color: '#666',
    },
});