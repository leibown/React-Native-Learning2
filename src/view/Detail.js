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
    Alert,
    TouchableOpacity
} from 'react-native';

import Video from 'react-native-video';
const width = Dimensions.get('window').width;

export default class Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoLoaded: false,

            progress: 0.01,
            total: 0,
            currentTime: 0,

            isEnd: false,
        }
    }

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
    };

    _onEnd = () => {
        this.setState({
            progress: 1,
            isEnd: true,
        });
    };

    _onError = () => {
        console.log('_onError');
    };

    _rePlay = () => {
        this.player.seek(0);
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>详情界面{this.props.data._id}</Text >
                <View style={styles.videoBox}>
                    <Video
                        source={{uri: this.props.data.video, mainVer: 1, patchVer: 0}}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}
                        rate={1.0}                     // 0 is paused, 1 is normal.
                        volume={1.0}                   // 0 is muted, 1 is normal.
                        muted={false}                  // Mutes the audio entirely.
                        paused={false}                 // Pauses playback entirely.
                        resizeMode="contain"             // Fill the whole screen at aspect ratio.
                        repeat={false}                  // Repeat forever.
                        playInBackground={false}       // Audio continues to play when app entering background.
                        onLoadStart={this._loadStart}   // Callback when video starts to load
                        onLoad={this._onLoad}      // Callback when video loads
                        onProgress={this._onProgress}      // Callback every ~250ms with currentTime
                        onEnd={this._onEnd}             // Callback when playback finishes
                        onError={this._onError}      // Callback when video cannot be loaded
                        style={styles.backgroundVideo}
                    />
                    {
                        !this.state.videoLoaded &&
                        <ActivityIndicator color="#ee735c"
                                           style={styles.loading} size={40}/>
                    }
                    {
                        this.state.isEnd ?
                            <TouchableOpacity onPress={this._rePlay} style={styles.playBox}>
                                <Image source={require('../img/play_detail.png')} style={styles.play}
                                />
                            </TouchableOpacity> : null
                    }
                    <View style={styles.progress}>
                        <View style={[styles.progressBar, {width: width * this.state.progress}]}/>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
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
    }
});