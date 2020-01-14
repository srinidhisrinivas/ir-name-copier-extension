/**

	Function that parses package information from a string and stores them in a map
	of emails -> object containing all package information

	Receives a list of strings of the form "LastName, FirstName;Email;ReceiptDateAndTime"

	Returns a map of the emails -> object containing all package information

**/ 
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

function compressData(infoMap){
	var data = infoMap.status+";";
	data += infoMap.lname +";";
	data += infoMap.fname +";";
	data += infoMap.dob.getMonth()+1 + "/" + infoMap.dob.getDate() + "/" + infoMap.dob.getFullYear()+";";
	data += infoMap.emplid +";";
	data += infoMap.dotnum +";";
	data += infoMap.gender +";";
	data += infoMap.room +";";
	data += infoMap.phone +";";

	return data;
}

/**

	Function that operates the main functionality of the extension.

	It works by calling a content script, 'contentscript.js' to run on the current web page.
	The content script checks if the current web page is the StarRez dashboard, and if it is,
	collect the package details from the webpage and send it as a Chrome runtime message to this function.

	This function, when a message is received, performs the necessary operations to copy the
	emails from the received package data to the clipboard in the required format.

**/ 
var currentName = null;
function clearNames(){
	alert("All names cleared!");
	chrome.storage.local.clear();
	updateSavedNames();
}
function removeName(key){
	chrome.storage.local.remove([key]);
	chrome.storage.local.get(["keys"], function(result){
		var keys = JSON.parse(result.keys);
		keys = keys.filter(e => e !== key);
		chrome.storage.local.set({"keys" : JSON.stringify(keys)});
		updateSavedNames();
	});
}

function updateSavedNames(){

	table = document.getElementById("savednamerows");
	while (table.firstChild) {
	table.removeChild(table.firstChild);
	}
	var keys = [];
	
	chrome.storage.local.get(["keys"], function(result){
		if("keys" in result){
			keys = JSON.parse(result.keys);
		}
		
		
		for(var i = 0; i < keys.length; i++){
			
			var info = null;
			chrome.storage.local.get([keys[i]], function(result){
				currentKey = Object.keys(result)[0];
				//alert("attempt to get");
				
				if(currentKey in result){				
					info = parseData(result[currentKey]);
				}
				
				var row = document.createElement("tr");
				row.setAttribute("id", currentKey);
				var n = document.createElement("td");
				n.innerText = info.fname + " " + info.lname;
				row.appendChild(n);
				var d = document.createElement("td");
				d.innerText = info.dob.getMonth()+1 + "/" + info.dob.getDate() + "/" + info.dob.getFullYear();
				row.appendChild(d);
				var r = document.createElement("td");
				r.innerText = info.room;
				row.appendChild(r);
				var b = document.createElement("td");
				var xbutton = document.createElement("button");
				xbutton.innerText = "X";
				xbutton.setAttribute("id", currentKey+"Del");
				xbutton.addEventListener('click', delInfo, false);
				xbutton.key = currentKey;
				function delInfo(event){
					currentKey = event.currentTarget.key;
					removeName(currentKey);
				}

				
				b.appendChild(xbutton);
				row.appendChild(b);
				
				var table = document.getElementById("savednamerows");
				table.appendChild(row);
			});
			
			
			//table.appendChild()
		}
	});
	//alert("Keys "+keys);
	
}

function onWindowLoad() {
	var clearButton = document.getElementById("clear");
	clearButton.onclick = clearNames;
	updateSavedNames();
  var isDash = false;


  var butt = document.getElementById("savename");
  var pasteButt = document.getElementById("paste");
  var nameCell = document.getElementById("name");
  var dobCell = document.getElementById("dob");
  var roomCell = document.getElementById("room");

  chrome.runtime.onMessage.addListener(function(request, sender){
  	
  	if(request.action == "fillForm"){
  		pasteButt.disabled = false;
  		pasteButt.addEventListener('click', function(){
  			chrome.tabs.executeScript(null, {
	    	file: "fillform.js"
	  		}, null);
  		});
  	}
  });

  // Set up listener for a message from content script
  chrome.runtime.onMessage.addListener(function(request, sender) {
		isDash = true;
	  	if (request.action == "getInfo") {
	  		data = request.data;
	  		
	  	}
	  	

	  	// Pass all the package data and get back only emails and their dates.
	  	infoMap = parseData(data);
	  	currentName = infoMap;
	  
	  	
	  	nameCell.innerText = infoMap.fname + " " + infoMap.lname;
	  	//alert(nameCell.innerText);
	  	dobCell.innerText = infoMap.dob.getMonth()+1 + "/" + infoMap.dob.getDate() + "/" + infoMap.dob.getFullYear();
	  	roomCell.innerText = infoMap.room;

	  	

	  	// Set up listener for the button being clicked
	  	butt.addEventListener('click', function(){
	  		
	  		chrome.storage.local.get(["keys"], function(result){
	  			var keys=[];
	  			if("keys" in result){
	  				keys = JSON.parse(result.keys);
	  			}
	  			new_key = data.split(";")[2] + data.split(";")[1];	
		  		new_key = new_key.toString();
		  		
		  		if(keys.indexOf(new_key) == -1){
		  			
		  			keys.push(new_key);

		  			chrome.storage.local.set({[new_key]: data});
		  			chrome.storage.local.set({"keys" : JSON.stringify(keys)});
		  			updateSavedNames();
		  		}
		  		
	  		});


	  		});
		  	
		  	

	  	// Enable button when on correct page
	  	butt.disabled=false;


		});

  // Execute content script on webpage
  chrome.tabs.executeScript(null, {
    file: "contentscript.js"
  }, null);

}

// Set the function that is executed when the extension is opened (window is loaded)
// Execution starts at this point.

window.onload = onWindowLoad;