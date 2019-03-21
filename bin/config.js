var readline = require('readline');
var path = require('path');
var utils = require('./../utils');
var inputConfig = [{
        key: 'url',
        desc: 'remote url (required)',
        value: '',
        regExp: /^https?\:\/\/([^\/]+\/)+/,
        required: 1,
        msg: 'url format error , should `http://***`'
    },
    {
        key: 'username',
        desc: 'connect user(required)',
        value: '',
        regExp: /.+/,
        required: 1,
        msg: 'username is empty'
    },
    {
        key: 'password',
        desc: 'connect password(required)',
        value: '',
        regExp: /.+/,
        required: 1,
        msg: 'password is empty'
    }
]

//输入
function input(params, callback) {
    params.index = params.index || 0;
    let config = params.config[params.index];
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(config.desc + '  ', function (value) {
        config.value = value || config.defaultValue || '';
        rl.close();
        if (params.index >= params.config.length - 1) {
            callback && callback(params.config);
        } else {
            if (config.regExp) {
                if (config.required) {
                    if (config.value.match(config.regExp)) {
                        params.index++;
                    } else {
                        console.log(config.msg);
                    }
                } else if(config.value && !config.value.match(config.regExp)){
                    console.log(config.msg);
                } else {
                    params.index++;
                }
            } else if (config.required){
                if (config.value) {
                    params.index++;
                } else {
                    console.log(config.msg);
                }
            }else {
                params.index++;
            }
            input(params, callback)
        }
    })
}

//获取配置
function get(){
    return utils.getJsonFile(path.join(utils.getCwd(), './ssh-express-config.json'), 1) || {};
}

//设置
function set() {
    var configsPath = path.join(utils.getCwd(), './ssh-express-config.json');
    var config = utils.getJsonFile(configsPath, 1) || {};
    input({
        config: inputConfig
    }, function (inputConfig) {
        inputConfig.forEach(function (item) {
            config[item.key] = item.value;
        });
        utils.makeFile(configsPath, utils.jsonFormat(config))
    })
}

module.exports = {
    set: set,
    get: get
};