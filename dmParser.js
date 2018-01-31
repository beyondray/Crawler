const gbk = require('gbk')
const JSDOM = require('jsdom').JSDOM
const Segment = require('segment')
let seg = new Segment()
seg.useDefault()

function dmParser(dmXml, count){

	var xml = dmXml.replace(/<[^>]+>/g,',');
	var arr = seg.doSegment(xml);
	//console.log(arr);

	//去掉没用的
	var myarr = [];
	arr.forEach(data=>{
		if(data.p !=2048 && 
			data.p != 4194304 && 
			data.p != 16 &&
			data.w.length > 1){
			myarr.push(data.w)
		}
	});

	//计算个数
	var myJson = {};
	myarr.forEach(data=>{
		if(!myJson[data]){
			myJson[data] = 1;
		}
		else{
			myJson[data]++;
		}
	});

	//转化为数组
	var myarr2 = [];
	for(let w in myJson)
	{
		myarr2.push({
			name:w,
			value:myJson[w],
		})
	}
	myarr2.sort((json1, json2)=>json2.value-json1.value);

	//统计count个词
	let myarr3 = [];
	for(let i = 0; i < count && i < myarr2.length; i++){
		myarr3.push(myarr2[i]);
	}

	return myarr3;
};

module.exports = dmParser;