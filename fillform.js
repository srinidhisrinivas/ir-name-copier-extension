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
	
	
	return infoMap;
}

function dateToString(date){
	var result="";
	result += date.getFullYear()+"-";
	if(date.getMonth() < 9){
		result += "0";
	}
	result += (date.getMonth() + 1)+"-";
	if(date.getDate() < 10){
		result += "0";
	}
	result += date.getDate();
	return result;
}

chrome.storage.local.get(["keys"], function(result){
		if("keys" in result){
			keys = JSON.parse(result.keys);
		}

		function enterInfo(key, person){
			const EMAIL_SUFFIX = "@osu.edu";
			const DEFAULT_ROLE = "Alleged";
			chrome.storage.local.get([key], function(result){
				var info = null;
				currentKey = Object.keys(result)[0];
				if(currentKey in result){				
					info = parseData(result[currentKey]);
				}
				var p = document.getElementById("person_"+person);
				p.value = info.fname + " " + info.lname;
				var gender = document.getElementById("gender_"+person);
				gender.value = info.gender;
				var role = document.getElementById("role_"+person);
				role.value = DEFAULT_ROLE;
				var emplid = document.getElementById("sid_"+person);
				emplid.value = info.emplid;
				var dob = document.getElementById("dob_"+person);
				dob.value = dateToString(info.dob);
				var phone = document.getElementById("phone_"+person);
				phone.value = info.phone;
				var email = document.getElementById("email_"+person);
				email.value = info.dotnum + EMAIL_SUFFIX;
				var addr = document.getElementById("halladdress_"+person);
				addr.value = info.room;
			});
			
		}
		for(var j = 0; j < keys.length; j++){
			
			enterInfo(keys[j], j);
		}
	});