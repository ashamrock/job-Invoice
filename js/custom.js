var time_in_minutes = 0;
var current_time = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var onTheClock = 0;
var tableUpdate = 0;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var date = mm + '_' + dd + '_' + yyyy;

var clientNumber = []
var client = []
var newClient = []
var projects = []
var jobNumbers = []

var file = document.getElementById('inputfile');

var taskData = [];
var allData = [];

var workingFileName = "";
var tophead;
var header = ["Date", "Employee", "Rate", "Task", "Job #", "Hours", "SubTotal"]
var headTitle = []

var billingHours = [];
var billingTotal = [];
var hourTotals;
var subTotals;

var invoiceNum

document.getElementById("fileDate").innerHTML = date

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

file.addEventListener('change', () => {

	var fr = new FileReader();
	fr.onload = function () {
		// By lines

		var lines = this.result.split('\n');

		for (var line = 0; line < lines.length; line++) {
			// client.push(lines[line].replace(",", "	"));
			allData.push(lines[line].split("\t"));
		}

		for (var line = 0; line < 15; line++) {
			client.push(lines[line].split("\t"));
		}

		for (var line = 15; line < 16; line++) {
			headTitle.push(lines[line].split("\t"));
		}

		for (var line = 16; line < lines.length; line++) {
			taskData.push(lines[line].split("\t"));
		}

		var getProjects = document.getElementById("projectlist");
		var newDiv = document.createElement("select");
		getProjects.appendChild(newDiv);
		newDiv.setAttribute("id", "Projects");

		for (var i = 0; i < 15; i++) {	
			var select = document.getElementById("Projects");
			data = allData[i][2]
			if (data===""){
				break;
			}
			projects.push(data);
			var element = document.createElement("option");
			var option = projects[i];
			    element.textContent = option;
    			element.value = option;
    			select.appendChild(element);
			jobNumbers.push(allData[i][3]);	
				element.setAttribute("id", allData[i][3]);
		}


		// console.log(allData)
		clientPopulate()
		generate_table()
	}

	workingFileName = document.getElementById("inputfile").files[0].name;
	fr.readAsText(file.files[0]);
});

function clientPopulate() {
	clientName = client[0][0]
	clientStreet = client[1][0]
	clientCity = client[2][0]
	clientPhone = client[3][0]
	clientAttn = client[4][0]
	clientEmail = client[5][0]

	clientInvoiceDate = client[6][0]
	clientInvoiceDue = client[7][0]
	clientInvoiceNum = client[8][0]
	clientNumber = client[9][0]
	clientPOC = client[10][0]
	other1 = client[11][0]
	other2 = client[12][0]
	other3 = client[13][0]
	invoiceNum = clientInvoiceNum + "_" + clientNumber + " FIX INVOICE NUMBER!!!!!"
	document.getElementById("clientName").innerHTML = clientName
	document.getElementById("clientStreet").innerHTML = clientStreet
	document.getElementById("clientCity").innerHTML = clientCity
	document.getElementById("clientPhone").innerHTML = clientPhone
	document.getElementById("clientAttn").innerHTML = clientAttn
	document.getElementById("clientEmail").innerHTML = clientEmail
	document.getElementById("clientInvoiceDate").innerHTML = "Invoice Date: " + clientInvoiceDate + "FIX THIS!!!!!"
	document.getElementById("invoiceNum").innerHTML = "Invoice #: " + invoiceNum
	document.getElementById("clientInvoiceDue").innerHTML = "Due: " + clientInvoiceDue + "FIX THIS!!!!!"
	document.getElementById("clientTitle").innerHTML = clientName
	// document.getElementById("totalDue").innerHTML = subTotals

}

function runclock() {
	if (onTheClock === 0) {
		onTheClock = 1

		var element = document.getElementById("roundLogo");
		element.classList.add("rotate");

		timeValue = setInterval(function () {
			var t = seconds++;
			if (seconds > 59) {
				minutes++;
				seconds = 0;
				if (minutes > 59) {
					hours++;
					minutes = 0;
				}
			}

			document.getElementById("hourDiv").innerHTML = hours;
			document.getElementById("minuteDiv").innerHTML = minutes;
			document.getElementById("secondDiv").innerHTML = seconds;
		}, 1000);
	} else if (onTheClock === 1) {
		clearInterval(timeValue);
		onTheClock = 0;
		var element = document.getElementById("roundLogo");
		element.classList.remove("rotate");
	}
}

function reset() {
	clearInterval(timeValue);
	onTheClock = 0;
	seconds = 0;
	minutes = 0;
	hours = 0;
	document.getElementById("hourDiv").innerHTML = hours;
	document.getElementById("minuteDiv").innerHTML = minutes;
	document.getElementById("secondDiv").innerHTML = seconds;

	var element = document.getElementById("roundLogo");
	element.classList.remove("rotate");

}

function addRow() {
	addingup()

	if (onTheClock === 0) {
		return;
	}

	var empvalue = document.getElementById("nameInput").value;
	var ratevalue = document.getElementById("rateInput").value;
	var taskvalue = document.getElementById("Projects").value;
	var taskNumber = document.getElementById("Projects");
	var jobvalue = taskNumber.options[taskNumber.selectedIndex].id;
	var hoursvalue = hours + (minutes / 60) + (seconds / 3600);
	var totalvalue = hoursvalue * ratevalue;

console.log(hoursvalue)
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
	cell6.innerHTML = hoursvalue.toFixed(1);
	cell7.innerHTML = totalvalue.toFixed(0);
	taskData.unshift([date, empvalue, ratevalue, taskvalue, jobvalue, hoursvalue.toFixed(1), totalvalue.toFixed(0)])
	addingup()
	reset();
	clearInterval(timeValue);
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

		tophead.rows[0].cells[5].innerHTML = hourTotals;
		tophead.rows[0].cells[6].innerHTML = subTotals;

	}

	const demo1 = (addBills).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD'
	});
	document.getElementById("totalDue").innerHTML = demo1

	headTitle[0][5]=hourTotals	
	headTitle[0][6]=subTotals	

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
var noDiv=document.getElementById("invoiceTable");
noDiv.parentNode.removeChild(noDiv);
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

	// var retContent = [];
	// var retString = '';

	// for (var i = 0; i < client.length; i++) {
	// 	retContent.push(client[i].join("\t"));
	// };

	// $('thead tr').each(function (idx, elem) {
	// 	var elemText = [];
	// 	$(elem).children('th').each(function (childIdx, childElem) {
	// 		elemText.push($(childElem).text());
	// 	});
	// 	retContent.push(`${elemText.join('\t')}`);
	// });
	// $('tbody tr').each(function (idx, elem) {
	// 	var elemText = [];
	// 	$(elem).children('td').each(function (childIdx, childElem) {
	// 		elemText.push($(childElem).text());
	// 	});
	// 	retContent.push(`${elemText.join('\t')}`);
	// });
	// retString = retContent.join('\n');

// console.log(retString)

	saveTable=[]
	tableText=""

		for (var i = 0; i < client.length; i++) {
			saveTable.push(client[i].join("\t"));
		}	
		for (var i = 0; i < headTitle.length; i++) {
			saveTable.push(headTitle[i].join("\t"));
		}			
		for (var i = 0; i < taskData.length; i++) {
			saveTable.push(taskData[i].join("\t"));
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

	// var retContent = [];
	// var retString = '';

	// for (var i = 0; i < client.length; i++) {
	// 	retContent.push(client[i].join("\t"));
	// };

	// $('thead tr').each(function (idx, elem) {
	// 	var elemText = [];
	// 	$(elem).children('th').each(function (childIdx, childElem) {
	// 		elemText.push($(childElem).text());
	// 	});
	// 	retContent.push(`${elemText.join('\t')}`);
	// });
	// $('tbody tr').each(function (idx, elem) {
	// 	var elemText = [];
	// 	$(elem).children('td').each(function (childIdx, childElem) {
	// 		elemText.push($(childElem).text());
	// 	});
	// 	retContent.push(`${elemText.join('\t')}`);
	// });
	// retString = retContent.join('\n');

// console.log(retString)

	saveTable=[]
	tableText=""

		for (var i = 0; i < client.length; i++) {
			saveTable.push(client[i].join("\t"));
		}	
		for (var i = 0; i < headTitle.length; i++) {
			saveTable.push(headTitle[i].join("\t"));
		}			
		for (var i = 0; i < taskData.length; i++) {
			saveTable.push(taskData[i].join("\t"));
		}
	tableText = saveTable.join('\n');

		var file = new Blob([tableText], { type: 'text/plain' });
		var btn = $('#newClientSave');
		var substring = workingFileName.slice(16);
		btn.attr("href", URL.createObjectURL(file));
		btn.prop("download", date+ "_" + clientNumber + "_" + substring);
	}
)



function newClientData(){
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
}

function hide() {
	var element = document.getElementById("workPage");
	element.style.display = "none";
}

function show() {
	var element = document.getElementById("workPage");
	element.style.display = "block";
}

function showAddClient() {
	var showMe = document.getElementById("addClient");
	var hideIt = document.getElementById("editClient");
	var nope = document.getElementById("clientInfo");
	showMe.style.display = "block";
	hideIt.style.display = "none";
	nope.style.display = "none";
}

function showEditClient() {
	var showMe = document.getElementById("editClient");
	var hideIt = document.getElementById("addClient");
	var nope = document.getElementById("clientInfo");
	showMe.style.display = "block";
	hideIt.style.display = "none";
	nope.style.display = "none";
}

function showClientInfo() {
	var showMe = document.getElementById("clientInfo");
	var hideIt = document.getElementById("addClient");
	var nope = document.getElementById("editClient");
	showMe.style.display = "block";
	hideIt.style.display = "none";
	nope.style.display = "none";
}