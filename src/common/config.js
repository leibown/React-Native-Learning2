/**
 * Created by Administrator on 2016/12/13.
 */
'use strict';

module.exports = {
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },
    api: {
        base: 'http://rap.taobao.org/mockjs/11392/',
        list: 'api/creations',
        up: 'api/up',
        comment: 'api/comment',
    }
};