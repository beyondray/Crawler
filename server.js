const fileIO = require('./fileIO')
const urlCrawler = require('./urlCrawler')
const dmParser = require('./dmParser')

const express = require('express')
const app = express()

app.listen(80)

app.use('/getEchart', (req, res)=>{
	console.log(req.query);
	_urlCrawler = new urlCrawler(req.query.url);
	console.log('[web]: query url: ' + req.query.url);

	_urlCrawler.getUrl((str)=>{
		//console.log(str)
		//解析cid获得xml地址
		var regex = new RegExp("\"cid\"?[:=]([0-9]+)");
		var rs =regex.exec(str)

		if(!rs){
			console.log("[web]: not found cid in html!");
			return;
		}

		var cid = rs[1];
		var danmuXml = 'http://comment.bilibili.com/' + cid + '.xml';
		console.log('[web]: parse danmu address: ' + danmuXml);		

		//解码xml并格式化
		_xmlCrawler = new urlCrawler(danmuXml);
		_xmlCrawler.getUrl((xml)=>{
			try{
				let arr = dmParser(xml, 20);
				//console.log(arr);	
				res.send({'core':arr});
			}
			catch(err)
			{
				console.log(err);
			}

			console.log("[web]: try to get Echart...")

		})
	});
})

app.use(express.static('./'))