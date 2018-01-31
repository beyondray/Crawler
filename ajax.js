function ajax(option){

	if(window.XMLHttpRequest){
		var ajax = new XMLHttpRequest();
	}
	else{
		var ajax = new ActiveXObject("Microsoft.XMLHTTP");
	};
	if(option.type == 'get'){
		ajax.open(option.type,option.url+'?'+JsonToString(option.data),true);
		ajax.send();
	}
	else if(option.type='post'){
		ajax.open(option.type,option.url,true);
		ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		ajax.send(JsonToString(option.data));
	}
	
	
	ajax.onreadystatechange=function(){
		if(ajax.readyState == 4){
			if(ajax.status>=200&&ajax.status<300||ajax.status==304){
				option.success(ajax.responseText)
			}
			else{
				option.error && option.error();		
			}
		}
	}


	function JsonToString(json){
		var arr = [];
		for(var i in json){
			arr.push(i+'='+json[i])
		};
		return arr.join('&');
	}
}