const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');

var users = {};			//{"zhangsan": "123456", "lisi": "123456"}

var server = http.createServer(function(req, res) {
	// 解析数据
	var str = '';
	req.on('data', function(){
		str += data;
	})
	req.on('end', function(){
		var obj = urlLib.parse(req.url, true);

		const url = obj.pathname; // url
		const GET = obj.query; // data
		const POST = querystring.parse(str);
		console.log(url, GET, POST);

		// 区分接口、文件
		if (url == '/user') {		//接口
			switch(GET.act){
				case 'reg':
					// 1.检查用户是否已经有欧了
					if(users[GET.user]){
						res.write('{"ok": false, "msg": "此用户已存在"}');
					}else{
					// 2.插入users
						users[GET.user] = GET.pass;
						res.write('{"ok": true, "msg": "注册成功"}');
					}
					break;
				case 'login':
					// 1.检查用户名已存在
					if(users[GET.user] == null){
						res.write('{"ok": false, "msg": "此用户不存在"}');
					}else if(users[GET.user] != GET.pass){
						res.write('{"ok": false, "msg": "用户名或密码错误"}');
					}else{
						res.write('{"ok": true, "msg": "登陆成功"}');
					}
					// 2.检查用户密码
					break;
				default:
					res.write('{"ok": false, "msg": "未知的act"}');
			}
			res.end();
		} else {					//文件
			// 读取文件
			var file_name = './www' + url;
			fs.readFile(file_name, function(err, data){
				if(err){
					res.write('404');
				}else{
					res.write(data);
				}

				res.end();
			})
		}
	})
});

server.listen(8080);