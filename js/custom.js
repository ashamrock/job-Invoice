var time_in_minutes = 0;
var current_time = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var onTheClock = 0;
var totalSeconds=0;
var tableUpdate = 0;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var date = mm + '_' + dd + '_' + yyyy;
var netDays = 60;
var futureDate;
var startTime=0;
var stopTime=0;

// var date = new Date(); // Now
// date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
// console.log(date);

var file = document.getElementById('inputfile');

var allData = [];

var clientNumber;
var clientData;
var invoiceNum;
var invoiceNumber;
var invoiceDate;
var invoiceDueDate;
var projects = []
// var jobNumbers = []
var taskData = [];
var timeTable = [];
var clientsNames=[];
var clientSheet=[]

var workingFileName = "";
var tophead;
var header = ["Date", "Employee", "Rate", "Task", "Job #", "Hours", "SubTotal"];
var headTitle = []

var billingHours = [];
var billingTotal = [];
var hourTotals;
var subTotals;

var invoiceNumber

document.getElementById("fileDate").innerHTML = date

getClients()

function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

function cleanSlate(){
	client = []
	projects = []
	jobNumbers = []
	taskData = [];
	allData = [];
	billingHours = [];
	billingTotal = [];
	clientNumber = [];

	var div1=document.getElementById("buffetTable");
	div1.parentNode.removeChild(div1);
	var div2=document.getElementById("Projects");
	div2.parentNode.removeChild(div2);

}

function getClients(){
	for (var c = 0; c < clientList.length; c++) {
		var select = document.getElementById("cnames");
		data = clientList[c][2]
		if (clientList[c][0]===clientNumber){
			clientData=(clientList[c])
		}
			clientsNames.push(data);
			var element = document.createElement("option");
			var option = clientsNames[c];
			    element.textContent = option;
    			element.value = option;
    			select.appendChild(element);
				element.setAttribute("id", clientList[c][0]);
		}	
}

document.getElementById('cnames').onchange = function() {
    var index = this.selectedIndex;
    var clientId = this.children[index].id;
	for (var c = 0; c < clientList.length; c++) {
		if (clientList[c][0]==clientId){
			clientSheet=clientList[c]
		}
	}

	// for (var i = 2; i < 9; i++) {
	// var getText = document.getElementById('editSheet'+i);
   	// getText.value=editSheet[i]
	// }
}

file.addEventListener('change', () => {

	var fr = new FileReader();
	fr.onload = function () {
		// By lines

		var lines = this.result.split('\n');

		for (var line = 0; line < lines.length; line++) {
			// client.push(lines[line].replace(",", "	"));
			allData.push(lines[line].split("\t"));
		}

		clientNumber=Number(allData[0][0])
		invoiceNum=Number(allData[1][0])	
		invoiceDate=Number(allData[2][0])
		invoiceDueDate=Number(allData[3][0])	

		for (var c = 0; c < clientList.length; c++) {
			if (clientList[c][0]===clientNumber){
				clientData=(clientList[c])
			}
		}

		var getProjects = document.getElementById("projectlist");
		var newDiv = document.createElement("select");
		getProjects.appendChild(newDiv);
		newDiv.setAttribute("id", "Projects");

		var allClients = document.getElementById("cnames");
		var newDiv = document.createElement("select");
		allClients.appendChild(newDiv);
		newDiv.setAttribute("id", "clientNames");

		for (var line = 17; line < allData.length; line++) {
			taskData.push(lines[line].split("\t"));
		}

		for (var i = 4; i < 16; i++) {	
			var select = document.getElementById("Projects");
			data = allData[i][0]
			if (data===""){
				break;
			}
			projects.push(data);
			var element = document.createElement("option");
			var option = projects[i-4];
			    element.textContent = option;
    			element.value = option;
    			select.appendChild(element);
				jobNumbers.push(allData[i][1]);	
				element.setAttribute("id", allData[i][1]);
		}

		clientPopulate()
		generate_table()
	}

	workingFileName = document.getElementById("inputfile").files[0].name;
	fr.readAsText(file.files[0]);
});

function clientPopulate() {
	invoiceNumber = (invoiceNum+100) + "_" + (clientNumber+1000)
	document.getElementById("clientName").innerHTML = clientData[2]
	document.getElementById("clientStreet").innerHTML = clientData[3]
	document.getElementById("clientCity").innerHTML = clientData[4]
	document.getElementById("clientPhone").innerHTML = clientData[5]
	document.getElementById("clientAttn").innerHTML = "Attn: "+clientData[6]
	document.getElementById("clientEmail").innerHTML = clientData[7]
	document.getElementById("clientInvoiceDate").innerHTML = "Invoice Date: " + invoiceDate + "FIX THIS!!!!!"
	document.getElementById("invoiceNum").innerHTML = "Invoice #: " + invoiceNumber
	document.getElementById("clientInvoiceDue").innerHTML = "Due: " + invoiceDueDate + "FIX THIS!!!!!"
	document.getElementById("clientTitle").innerHTML = clientData[2]
}

function runclock() {
	if (workingFileName === "") {
	alert("no time to be added")
	return
	}
	if (onTheClock === 0) {
		onTheClock = 1
		var element = document.getElementById("roundLogo");
		element.classList.add("rotate");
		startTime = Date.now()/1000
	} else if (onTheClock === 1) {
		onTheClock = 0;
		stopTime = Date.now()/1000
		timeTable.push(stopTime - startTime)
		var element = document.getElementById("roundLogo");
		element.classList.remove("rotate");
	}
}

function reset() {
	onTheClock = 0;
	timeTable = [];
	document.getElementById("timeField").innerHTML = "";
	var element = document.getElementById("roundLogo");
	element.classList.remove("rotate");
}

function addRow() {

	if (workingFileName === "") {
	alert("No work to add")
	return
	}

	timeValue = timeTable.reduce(function (a, b) {
		return a + b;
	});

	if (timeValue === 0) {
		alert("No time to add")
		return;
	}

	addingup()

	var empvalue = document.getElementById("nameInput").value;
	var ratevalue = document.getElementById("rateInput").value;
	var taskvalue = document.getElementById("Projects").value;
	var taskNumber = document.getElementById("Projects");
	var jobvalue = taskNumber.options[taskNumber.selectedIndex].id;
	var hoursTime = (timeValue/3600).toFixed(1)
// hoursTime=1.5;
// console.log("hello again")
	var totalvalue = hoursTime * ratevalue;

	if (empvalue.length === 0) {
		alert("Enter your name")
		return;
	} else if (ratevalue.length === 0) {
		alert("Enter your rate")
		return;
	} else if (taskvalue.length == 0) {
		alert("Enter your task")
		return;
	}

	var table = document.getElementById("taskTable");
	var row = table.insertRow(0);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	var cell7 = row.insertCell(6);
	cell1.innerHTML = date;
	cell2.innerHTML = empvalue;
	cell3.innerHTML = ratevalue;
	cell4.innerHTML = taskvalue;
	cell5.innerHTML = jobvalue;
	cell6.innerHTML = hoursTime;
	cell7.innerHTML = totalvalue;
	// newRow=[date, empvalue, ratevalue, taskvalue, jobvalue, String(hoursTime), String(totalvalue + "\r")]
	newRow=[date, empvalue, ratevalue, taskvalue, jobvalue, hoursTime, totalvalue]
	taskData.unshift(newRow)
	allData.splice(17,0,newRow);
	addingup()

	reset();
}

function addingup() {

	billingHours = [];
	billingTotal = [];
	hourTotals = "";
	subTotals = "";

	for (let i = 0; i < taskData.length; i++) {
		billingHours.push(parseFloat(taskData[i][5]))
		billingTotal.push(parseFloat(taskData[i][6]))
		hourTotals = billingHours.reduce(function (a, b) {
			return a + b;
		});

		addBills = billingTotal.reduce(function (a, b) {
			return a + b;
		});

		hourTotals = "Hours= " + hourTotals.toFixed(1);
		subTotals = "SubTotal= $" + addBills.toFixed(0);
		finalTotal="$"+addBills.toFixed(2);

		document.getElementById("totalDue").innerHTML = finalTotal

		tophead.rows[0].cells[5].innerHTML = String(hourTotals);
		tophead.rows[0].cells[6].innerHTML =  String(subTotals);
		allData[16][5] = String(hourTotals);;
		allData[16][6] = String(subTotals);
	}

	// const demo1 = (addBills).toLocaleString('en-US', {
	// 	style: 'currency',
	// 	currency: 'USD'
	// });
}

function invoiceDue() {
	console.log(today)
var plusSixty = today.setDate(today.getDate() + netDays);
console.log(plusSixty)
var futuredd = String(plusSixty.getDate()).padStart(2, '0');
var futuremm = String(plusSixty.getMonth() + 1).padStart(2, '0'); //January is 0!
var futureyyyy = plusSixty.getFullYear();
var futureDate = futuremm + '_' + futuredd + '_' + futureyyyy;
console.log(futureDate)
}

function poping(){
var noDiv=document.getElementById("invoiceTable");
if(noDiv===null){
var elem = document.querySelector('#jobs');
var base = document.querySelector('#plop');
var clone = elem.cloneNode(true);
clone.id = 'invoiceTable';
base.after(clone);
}else{
noDiv.parentNode.removeChild(noDiv);
cloneTable()
}
}

function cloneTable(){
	var elem = document.querySelector('#jobs');
var base = document.querySelector('#plop');
var clone = elem.cloneNode(true);
clone.id = 'invoiceTable';
base.after(clone);
}

function erase_table(){
var noInvoiceTable=document.getElementById("invoiceTable");
noInvoiceTable.parentNode.removeChild(noInvoiceTable);
}

function generate_table() {

	var body = document.getElementById("jobs");
	var tbl = document.createElement("table1");
	tophead = document.createElement("thead");
	var tblBody = document.createElement("tbody");
	var topRow = document.createElement("tr");

	body.appendChild(tbl);
	tbl.appendChild(tophead);
	tbl.appendChild(tblBody);

	tbl.setAttribute("id", "buffetTable");
	tblBody.setAttribute("id", "taskTable");

	for (var j = 0; j < header.length; j++) {
		var cell = document.createElement("th");
		var cellText = document.createTextNode(header[j]);
		cell.appendChild(cellText);
		topRow.appendChild(cell);
		tophead.appendChild(topRow);
	}

	addingup()

	// creating all cells

	for (var i = 0; i < taskData.length; i++) {
		var row = document.createElement("tr");
		for (var j = 0; j < header.length; j++) {
			var cell = document.createElement("td");
			var cellText = document.createTextNode(taskData[i][j]);
			cell.appendChild(cellText);
			row.appendChild(cell);
			tblBody.appendChild(row);
		}
	}
}

$('#save-link').click(function save() {
	if (clientNumber === "") {
	alert("No file loaded")
	return
	}

	saveTable=[]
	tableText=""

		for (var i = 0; i < allData.length; i++) {
			saveTable.push(allData[i].join("\t"));
		}

	tableText = saveTable.join('\n');

		var file = new Blob([tableText], { type: 'text/plain' });
		var btn = $('#save-link');
		var substring = workingFileName.slice(16);
		btn.attr("href", URL.createObjectURL(file));
		btn.prop("download", date+ "_" + clientNumber + "_" + substring);
	}
)

$('#newClientSave').click(function save() {
	// if (clientNumber === "") {
	// alert("No file loaded")
	// return
	// }
	var newClient = [];
	var newClientText; 

		// var lines = this.result.split('\n');

		// for (var line = 0; line < lines.length; line++) {
		// 	// client.push(lines[line].replace(",", "	"));
		// 	allData.push(lines[line].split("\t"));
		// }
	// var newJob= document.getElementById('clientSheet0').value+"	"+document.getElementById('clientSheet1').value

	newClient.push(
		clientSheet[0],
		clientSheet[1],
		date,
		today,
		document.getElementById('clientSheet0').value+"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"	",
		"Date	Employee	Rate	Task	Job #	Hours	SubTotal"
		)

	newClientText = newClient.join('\n');

	console.log(newClientText)
	saveNumber=Number(clientSheet[0])+1000;
	var file = new Blob([newClientText], { type: 'text/plain' });
	var btn = $('#newClientSave');
	btn.attr("href", URL.createObjectURL(file));
	btn.prop("download", date+ "_" + (Number(clientSheet[0])+1000) + "_" + clientSheet[2]);
}
)

function saveNewSheet(){
	console.log("heidi ho")

    // var index = this.selectedIndex;
    // var clientId = this.children[index].id;
	// for (var c = 0; c < clientList.length; c++) {
	// 	if (clientList[c][0]==clientId){
	// 		clientSheet=clientList[c]
	// 	}
	// }

	// for (var i = 2; i < 10; i++) {
	// var getText = document.getElementById('clientSheet'+i);
   	// getText.value=clientSheet[i-1]
	// }


// var table = document.getElementById("mytab1");
// for (var i = 0, row; row = table.rows[i]; i++) {
//    for (var j = 0, col; col = row.cells[j]; j++) {
// console.log(col.children[0].value)
//    }  
//    console.log("BREAK")
// }

		// for (var line = 0; line < 15; line++) {
		// 	client.push(lines[line].split("\t"));
		// }

        // spread.fromJSON(name);





// var fileToLoad = document.getElementById("fileToLoad").files[0];
// var fileReader = new FileReader();
//     fileReader.onload = function(fileLoadedEvent){ 
//         document.getElementById("inputTextToSave").value = fileLoadedEvent.target.result;
//     };
// fileReader.readAsText(fileToLoad, "UTF-8");

}

function hide() {
	var element = document.getElementById("workPage");
	element.style.display = "none";
}

function show() {
	var element = document.getElementById("workPage");
	element.style.display = "block";
}

function showNewClientWorkSheet() {
	var showMe = document.getElementById("newClientWorkSheet");
	var hideIt = document.getElementById("editClient");
	// var nope = document.getElementById("clientInfo");
	showMe.style.display = "block";
	hideIt.style.display = "none";
	// nope.style.display = "none";
}

function showEditClient() {
	var showMe = document.getElementById("editClient");
	var hideIt = document.getElementById("newClientWorkSheet");
	// var nope = document.getElementById("clientInfo");
	showMe.style.display = "block";
	hideIt.style.display = "none";
	// nope.style.display = "none";
}

// function showClientInfo() {
// 	var showMe = document.getElementById("clientInfo");
// 	var hideIt = document.getElementById("newClientWorkSheet");
// 	var nope = document.getElementById("editClient");
// 	showMe.style.display = "block";
// 	hideIt.style.display = "none";
// 	nope.style.display = "none";
// }
