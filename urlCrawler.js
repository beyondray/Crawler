const url = require('url');
const zlib = require('zlib');

function urlCrawler(_url){
	this.url = _url;
	this.curUrl = _url;

	this._onDecode = function(encoding, buffer, sucCall){
		//decode callback
		let callback = (err, decoded)=>{
        	if(err){
        		throw err;
        	}
        	else{
       			let data = decoded.toString();
       			//console.log(data);
       			sucCall && sucCall(data);
        	}
        };		

        //begin decode
		switch(encoding)
		{
			case 'deflate':
				zlib.inflateRaw(buffer, callback);
            	break;

        	case 'gzip':
        		zlib.gunzip(buffer, callback);
        		break;
		}
	};

	this._onSucDeal = function(res, sucCall){
		var arr = [];
		res.on('data', chunk=>{
			arr.push(chunk);
		});

		res.on('end', ()=>{
			let buffer = Buffer.concat(arr);

			let encoding = res.headers['content-encoding'];
			if(!encoding || encoding == 'utf-8'){
				let data = buffer.toString();
				//console.log(data);
    			sucCall && sucCall(data);
			}
			else{
				this._onDecode(encoding, buffer, sucCall);
			}

		});
	};

	this.getUrl = function(sucCall) {
		var count = 0;

		//url analyze
		var urlObj = url.parse(this.curUrl);
		var http = '';
		if(urlObj.protocol == 'http:')
		{
			http = require('http');
		}
		else
		{
			http = require('https');
		}

		//req and crawl
		let req = http.request({
			'hostname':urlObj.hostname,
			'path':urlObj.path,

		},res=>{
			//console.log(res)

			switch(res.statusCode)
			{
				case 200: //OK
					this._onSucDeal(res, sucCall);
					break;

				case 301:
				case 302: //重定向
					count++;
					console.log(`开始第${count}次重定向`,res.headers.location);
					this.curUrl = res.headers.location;
					this.getUrl(sucCall);
					break;

				default:
					console.log("http: 解析url时发生未知的情况！！")
			}
		});

		req.end();
		req.on('error', ()=>{
			console.log('http: 404 not found');
		});
	};
}

module.exports=urlCrawler;