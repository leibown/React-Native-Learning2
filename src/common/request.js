/**
 * Created by Administrator on 2016/12/12.
 */


import Mock from 'mockjs';
import queryString from 'query-string';
import _ from 'lodash';
import config from './config';

export default class Request {

    static get = (url, params) => {
        if (params) {
            url += '?' + queryString.stringify(params);
        }

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => Mock.mock(responseJson))
    };

    static post = (url, body) => {
        let options = _.extend(config.header, {
            body: JSON.stringify(body)
        });

        return fetch(url, options)
            .then((response) => response.json())
            .then((responseJson) => Mock.mock(responseJson))
    };

}