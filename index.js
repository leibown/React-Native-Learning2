/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import {TabBar} from 'antd-mobile';

import List from './src/view/List';
import Edit from './src/view/Edit';
import User from './src/view/User';

export default class Leibown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'List'
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TabBar>
                    <TabBar.Item
                        title="列表"
                        icon={require('./src/img/home_nav_btn_music_unselected.png')}
                        selectedIcon={require('./src/img/home_nav_btn_music_selected.png')}
                        selected={this.state.selectedTab === 'List'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'List',
                            });
                        }}
                    >
                        <Navigator
                            initialRoute={{
                                name: 'list',
                                component: List
                            }}
                            configureScene={(route) => {
                                return Navigator.SceneConfigs.FloatFromRight;
                            }}
                            renderScene={(route, navigator) => {
                                let Component = route.component;
                                return <Component {...route.params} navigator={navigator}/>
                            }}
                        />
                    </TabBar.Item>
                    <TabBar.Item
                        title="编辑"
                        icon={require('./src/img/home_nav_btn_search_unselected.png')}
                        selectedIcon={require('./src/img/home_nav_btn_search_selected.png')}
                        selected={this.state.selectedTab === 'Edit'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'Edit',
                            });
                        }}
                    >
                        <Edit/>
                    </TabBar.Item>

                    <TabBar.Item
                        title="用户"
                        icon={require('./src/img/home_nav_btn_me_unselected.png')}
                        selectedIcon={require('./src/img/home_nav_btn_me_selected.png')}
                        selected={this.state.selectedTab === 'User'}
                        badge={99}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'User',
                            });
                        }}
                    >
                        <User/>
                    </TabBar.Item>
                </TabBar>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

AppRegistry.registerComponent('Leibown', () => Leibown);


