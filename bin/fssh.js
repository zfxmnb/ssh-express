var request = require('request');
var colors = require('colors');
var utils = require("../utils");
var configObject = require('./config');
var config = configObject.get();
var cwd = utils.getCwd();

//发送
function post(url, data, callback) {
    request({
        url: url,
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data)
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = body;
            try{
                data = JSON.parse(body);
            }catch(err){}
            callback && callback(data);
        } else {
            console.log('reqeuest error'.red)
        }
    });
};

//执行远程命令
function Client(cmd, callback){
    if(config.username && config.password && config.url && cmd){
        var postdata = {
            username: config.username,
            password: config.password,
            cmd: cmd,
        }
        post(config.url, postdata, function(data) {
            if(!(callback && callback(data))){
                if (data.stdout) {
                    console.log(data.stdout.green);
                }
                if (data.stderr) {
                    console.log(data.stderr.yellow);
                }
                if (data.error) {
                    console.log(data.error.red);
                }
                if (typeof data == "string") {
                    console.log(data);
                }
            }
        });
    }else{
        console.log('配置错误'.red);
    }
}

// express服务接入
function Server(app){
    var childProcess = require('child_process');
    var path = config.url.replace(/^https?\:\/\/[^\/]+/,'');
    app.use(path, function(req, res) {
        if(req.body.cmd){
            if (req.body.username === config.username && req.body.password === config.password) {
                childProcess.exec(req.body.cmd, { cwd: cwd }, function(error, stdout, stderr) {
                    res.send({ error: error, stdout: stdout, stderr: stderr });
                });
            } else {
                res.send("验证失败");
            }
        }
    });
}

module.exports = {
    Client: Client,
    Server: Server
};