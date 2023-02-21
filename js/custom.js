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

var client = []
var projects = []

var file = document.getElementById('inputfile');

var taskData = [];
var allData = [];

var workingFileName = "";
var tophead;
var header = ["Date", "Employee", "Rate", "Task", "Job #", "Hours", "SubTotal"]

var billingHours= [];
var billingTotal= [];
var hourTotals;
var subTotals;

var clientName
var clientStreet
var clientCity
var clientPhone
var clientAttn
var clientEmail
var clientInvoiceDate

var clientInvoiceDue
var clientInvoiceNum
var clientNumber
var clientPOC
var Other1
var Other2
var Other3

var invoiceNum
// updateSubTotal();
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

  file.addEventListener('change', () => {

	var fr = new FileReader();
	fr.onload = function() {
	  // By lines
	  var lines = this.result.split('\n');

	  for (var line = 0; line < lines.length; line++) {
		// client.push(lines[line].replace(",", "	"));
		allData.push(lines[line].split("\t"));
	}

	  for (var line = 0; line < 14; line++) {
		client.push(lines[line].split("\t"));
	}

	for (var line = 4; line < 7; line++) {
		projects.push(lines[line].split("\t"));
	}

	  for (var line = 16; line < lines.length; line++) {
		  taskData.push(lines[line].split("\t"));
	  }
	  console.log(allData)
	  clientPopulate()
	  generate_table()
	 }
  
	 workingFileName = document.getElementById("inputfile").files[0].name;
	 fr.readAsText(file.files[0]);
	//    clientPopulate()
  });

function clientPopulate(){
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
invoiceNum = clientInvoiceNum + "_" + clientNumber
document.getElementById("clientName").innerHTML = clientName
document.getElementById("clientStreet").innerHTML = clientStreet
document.getElementById("clientCity").innerHTML = clientCity
document.getElementById("clientPhone").innerHTML = clientPhone
document.getElementById("clientAttn").innerHTML = clientAttn
document.getElementById("clientEmail").innerHTML = clientEmail
document.getElementById("clientInvoiceDate").innerHTML = "Invoice Date: "+clientInvoiceDate
document.getElementById("invoiceNum").innerHTML = "Invoice #: "+invoiceNum
document.getElementById("clientInvoiceDue").innerHTML = "Due: "+clientInvoiceDue
document.getElementById("clientTitle").innerHTML = clientName
// document.getElementById("totalDue").innerHTML = subTotals
}


function runclock() {
if (onTheClock === 0){
	onTheClock = 1

	var element = document.getElementById("roundLogo");
	element.classList.add("rotate");

	timeValue = setInterval(function() {
		var t = seconds++ ;
		if(seconds>59){
			minutes++;
			seconds=0;
			if(minutes>59){
				hours++;
				minutes=0;
			}
		}

		document.getElementById("hourDiv").innerHTML = hours;
		document.getElementById("minuteDiv").innerHTML = minutes;
		document.getElementById("secondDiv").innerHTML = seconds;
	 }, 1000);
	}else if(onTheClock === 1){
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


function addTable() {
	addingup()

	if(onTheClock === 0){
		return;
	}
	// var datevalue = document.getElementById("dateInput").value;
	var empvalue = document.getElementById("nameInput").value;
	var ratevalue = document.getElementById("rateInput").value;
	var taskvalue = document.getElementById("Projects").value;
	var hoursvalue = hours+(minutes/60)+(seconds/3600);
	var totalvalue = hoursvalue * ratevalue;

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
	cell5.innerHTML = "GET TABLE LOOKUP FOR TASK"
	cell6.innerHTML = hoursvalue.toFixed(1);
	cell7.innerHTML = totalvalue.toFixed(2);

	taskData.unshift([date,empvalue,ratevalue,taskvalue,hoursvalue.toFixed(1),totalvalue.toFixed(2)])
	addingup()
	reset();
	clearInterval(timeValue);
	// updateSubTotal();
}

//--------------------------------------------------------------------------------------------------------------------------

function addingup() {

billingHours= [];
billingTotal= [];
hourTotals = "";
subTotals = "";

for (let i = 0; i < taskData.length; i++) {

	billingHours.push(parseFloat(taskData[i][5]))
	billingTotal.push(parseFloat(taskData[i][6]))

hourTotals = billingHours.reduce(function(a, b){
  return a + b;
});

subTotals = billingTotal.reduce(function(a, b){
	return a + b;
});

tophead.rows[0].cells[5].innerHTML= "Hours = " + hourTotals.toFixed(2);
tophead.rows[0].cells[6].innerHTML= "SubTotal = $" + subTotals.toFixed(0);
const demo1 =  (subTotals).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
});
document.getElementById("totalDue").innerHTML = demo1

}}

function poping(){
var noDiv=document.getElementById("invoiceTable");
console.log(noDiv)
if(noDiv===null){
var elem = document.querySelector('#jobs');
var base = document.querySelector('#plop');
var clone = elem.cloneNode(true);
clone.id = 'invoiceTable';
base.after(clone);
}else{
console.log(noDiv)
noDiv.parentNode.removeChild(noDiv);
cloneTable()
}}

function cloneTable(){
	var elem = document.querySelector('#jobs');
var base = document.querySelector('#plop');
var clone = elem.cloneNode(true);
clone.id = 'invoiceTable';
base.after(clone);
console.log(clone)
}




  function generate_table() {

	tasktable = document.getElementsByTagName("table");

	 var body = document.getElementById("jobs");
	 var tbl = document.createElement("table");
	 tophead = document.createElement("thead");
	 var tblBody = document.createElement("tbody");
	 var topRow = document.createElement("tr");

		tbl.appendChild(tophead);
	  tophead.appendChild(topRow);
	  tophead.setAttribute("id", "headtable");


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
	   tbl.appendChild(tblBody);
	   body.appendChild(tbl);
	   tblBody.setAttribute("id", "taskTable");
	  }
  }


  $('#save-link').click(function save()
{

  var retContent = [];
  var retString = '';

  
  for (var i = 0; i < client.length; i++) {
	retContent.push(client[i].join("\t"));

};

  $('thead tr').each(function (idx, elem)
  {
    var elemText = [];
    $(elem).children('th').each(function (childIdx, childElem)
    {
      elemText.push($(childElem).text());
    });
    retContent.push(`${elemText.join('\t')}`);
  });


  $('tbody tr').each(function (idx, elem)
  {
    var elemText = [];
    $(elem).children('td').each(function (childIdx, childElem)
    {
      elemText.push($(childElem).text());
    });
    retContent.push(`${elemText.join('\t')}`);
  });
  retString = retContent.join('\n');

	var file = new Blob([retString], {type: 'text/plain'});
  var btn = $('#save-link');
	var substring = workingFileName.slice(11);
  btn.attr("href", URL.createObjectURL(file));
  btn.prop("download", date+"_"+substring);
}
)


function hide(){
var element = document.getElementById("workPage");
element.style.display = "none";
}

function show(){
var element = document.getElementById("workPage");
element.style.display = "block";
}

// function invoice() {
// 	var inv = document.getElementById("invoice");
// 	var tms = document.getElementById("timesheet");

// 	if (inv.style.display === "none") {
// 	  inv.style.display = "block";
// 	  tms.style.display = "none";
// 	} else {
// 		inv.style.display = "none";
// 		tms.style.display = "block";
// 	}
// 	}
