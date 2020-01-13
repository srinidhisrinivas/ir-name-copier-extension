//alert("we out here");
function parseData(data){
	
	//var infoMap = new Map();
	var info = data.split(";");
	
	var infoMap = {
		status: info[0],
		lname: info[1],
		fname: info[2],
		dob: new Date(info[3].split("/")[2], info[3].split("/")[0]-1, info[3].split("/")[1]),
		emplid: info[4],
		dotnum: info[5],
		gender: info[6],
		room: info[7],
		phone: info[8]
	};
	
	
	//infoMap.set(packageInfo.emplid, packageInfo);	
	
	return infoMap;
}

chrome.storage.local.get(["keys"], function(result){
		if("keys" in result){
			keys = JSON.parse(result.keys);
		}
		var j;
		
		for(j = 0; j < keys.length; j++){
			
			function enterInfo(info){
				alert(info.fname);
				alert(j);
				var person = document.getElementById("person_"+j);
				person.value = info.fname + " " + info.lname;
			}

			var info = null;
			chrome.storage.local.get([keys[i]], function(result){
				currentKey = Object.keys(result)[0];
				
				if(currentKey in result){				
					info = parseData(result[currentKey]);
				}
				alert("here");
				enterInfo(info);

			});
			
			
			//table.appendChild()
		}
	});