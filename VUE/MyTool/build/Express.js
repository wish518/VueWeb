//------------------------------------开始----------------------------
// 引用express
const express = require('express')
const app = express();
const request = require("request");
const cors = require('cors')
const ApiPort = "http://localhost:11123";
const GameAPI = "http://localhost:11123/GameAPI/Api";
const CoreAPI = "http://localhost:11123/CoreAPI/Api";
//在处理post的接口时需要特定的数据处理程序（若只是get接口则不需要。）
const bodyParser = require('body-parser')
var approuter = express.Router()
app.use('/', approuter)
app.use(cors())
exports.app = app;
console.log(process.env.NODE_ENV);
var NODE_ENV = false;
NODE_ENV = true;
if (process.env.NODE_ENV != "dev") {
    app.listen(3000, function () {
        console.log('Success app listening on port 3000');
    });
    PostOrGet(app);
    setInterval(() => console.log('一個小時防閒置關閉'),3600000);
}
// 使用express的路由router

//------------------------------------END----------------------------

function PostOrGet(App) {
    App.use(bodyParser.urlencoded({
        extended: true 
    }));
    App.use(bodyParser.json());
    App.use(async function (req, res, next) {
        console.log(req.body);
        var _url = req.url;
        var Api = _url.split("/")[1]
        if (Api == "GameAPI" || Api == "CoreAPI") {
            var result = await httprequest(ApiPort + _url, req.body);
            if (result != 'fail') {
                res.json(result);
            }
            else {
                res.status(500).send();
            }
        }
        next(); // 放人通行..
    })
    App.get('/test', (req, res, next) => {
        console.log('test');
        res.send('test');
    });
    /*App.post('/GameAPI/Api/WORK/GetRecord', async (req, res) => {
         console.log(req.body);
         console.log("post GetRecord");
         var result = await httprequest(GameAPI + '/WORK/GetRecord', req.body);
         res.json(result)
     });
     App.post('/CoreAPI/Api/ChkLogin', async (req, res) => {
         console.log(req.body);
         console.log("post ChkLogin");
         var result = await httprequest(CoreAPI + '/ChkLogin', req.body);
         res.json(result)
     });*/
}

function httprequest(url, data) {
    var Data = null;
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: data
        }, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body)
            }
            resolve('fail');
        })
    });
};


exports.use = function (App) { PostOrGet(App) };

