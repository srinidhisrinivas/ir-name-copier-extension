var url = document.URL;
var isDash = url.includes("directory") && url.includes("StarRezWeb") && url.includes("entry");
var isForm = url.includes("maxient") && url.includes("reportingform");

function fetchQuickInfo(element){

	var status = "";
	var lname = "";
	var fname = "";
	var dotnum = "";
	var dob = "";
	var gender = "";
	var emplid = "";
	var quickInfoIndices = element.length;
	for(var i=0; i < quickInfoIndices; i++){

		var listElements = element[i];

		for(var j = 0; j < listElements.childElementCount; j++){

			var currentElement = listElements.children[j];
			var title = currentElement.children[0].innerText;
			var val = currentElement.children[1].innerText;
			switch(title){
				case "Entry Status:":
					status = val;
					break;
				case "Last Name:":
					lname = val;
					break;
				case "First Name:":
					fname = val;
					break;
				case "Name.N:":
					dotnum = val;
					break;
				case "EMPLID:":
					emplid = val;
					break;
				case "Date of Birth:":
					dob = val;
					break;
				case "Gender:":
					gender = val;
					break;
				
				default:
					break;
			}
		}
	}
	var quickInfo = status + ";" + lname + ";" + fname + ";" + dob + ";" + emplid + ";" + dotnum + ";" + gender+";";
	return quickInfo;
}
function fetchBookingInfo(element){
	var space = "";

	for(var j = 0; j < element.childElementCount; j++){
		var currentElement = element.children[j];
		var title = currentElement.children[0].innerText;
		var val = currentElement.children[1].innerText;
		
		switch(title){
			case "Room Space:":
				space = val.substring(0, val.indexOf("/")-1);
				break;
			
			default:
				break;
		}
	}
	var bookingInfo = space+";";

	return bookingInfo;
}
function fetchAddressInfo(element){
	var phone = "";
	var stphone = "";
	for(var j = 0; j < element.childElementCount; j++){
		var currentElement = element.children[j];
		var title = currentElement.children[0].innerText;
		var val = currentElement.children[1].innerText;
		
		switch(title){
			
			case "Phone:":
				phone = val;
				break;
			case "Student Phone:":
				stphone = val;
				break;
			default:
				break;
		}
	}
	if(stphone){
		var addressInfo = stphone+";";	
	} else {
		var addressInfo = phone+";";
	}
	

	return addressInfo;
}

function parseInfo(source){
	var quickInfoClass = "view-fields left";
	var bookingClass = "details ui-details";
	var parser = new DOMParser();
	var doc = parser.parseFromString(source, "text/html");
	
	var quickInfoTags = doc.getElementsByClassName(quickInfoClass);
	var quickInfo = fetchQuickInfo(quickInfoTags);
	
	var bookingTags = doc.getElementsByClassName(bookingClass);

	var bookingInfo = fetchBookingInfo(bookingTags[1].children[0]);
	var addressInfo = fetchAddressInfo(bookingTags[2].children[0]);

	return quickInfo+bookingInfo+addressInfo;
}

if(isDash){
	info = parseInfo(document.documentElement.innerHTML);
	//alert(info)
	chrome.runtime.sendMessage({
    	action: "getInfo",
    	data: info
	});
	
}
if(isForm){
	chrome.runtime.sendMessage({
    	action: "fillForm"
	});
}
