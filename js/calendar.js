/* COPYRIGHT TO https://github.com/TylerPottsDev/custom-date-picker
    finn ut om vi skal ha den her eller et annet sted, 
*/
const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

mth_element.textContent = months[month] + ' ' + year;

selected_date_element.textContent = formatDate(date);
selected_date_element.dataset.value = selectedDate;

populateDates();

// EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);

// FUNCTIONS  når du trykker på en dato så skjer dette
function toggleDatePicker (e) {
	if (!checkEventPathForClass(e.path, 'dates')) {
		dates_element.classList.toggle('active');
	}

	calendarOutput.innerHTML = "<h3>Gjeldene projekter på denne datoen:</h3> <br>"; // for å resette det som står der fra før
	handleCalendarDates(year,month,selectedDay);

}

function appendLeadingZeroes(n){
    if(n <= 9 && n >= 0){
        return "0" + n;
    }
    return n;
}

function handleCalendarDates(year,month,selectedDay){
	let currentCardDates = getActiveProject().cardGroups;
	month += 1; // index month starter på 0
	let m = appendLeadingZeroes(month);
	let d = appendLeadingZeroes(selectedDay);

	let matchDate = year+"-"+m+"-"+d;

    for(let i = 0; i < currentCardDates.length; i++){
		if(currentCardDates[i].listOfCards[i].startDate.includes("T00:00:00.000Z")){ 
			var startDate = currentCardDates[i].listOfCards[i].startDate.split("T00:00:00.000Z");
			var endDate = currentCardDates[i].listOfCards[i].endDate.split("T00:00:00.000Z");
		}
		let daysBetween = calculateDaysBetween(matchDate,endDate); 

		if(matchDate >= startDate[0] && matchDate <= endDate[0]){					// [0] fordi man vil hente første index av det vi splittet i forrige if-setning
			if(daysBetween == 0){
				calendarOutput.innerHTML += currentCardDates[i].listOfCards[i].title + " har tidsfrist idag.<br>";
			}else{
				calendarOutput.innerHTML += currentCardDates[i].listOfCards[i].title + " har tidsfrist om " + daysBetween + " dager.<br>";		// printer tittelen på de prosjektene som er på datoen
			}
		}else if (calendarOutput.innerHTML == ""){
			calendarOutput.innerHTML += "Ingen aktive oppgaver på denne datoen";
		}
	}
}

// finner antall dager fra starDate -> endDate i hvert Card
function calculateDaysBetween(matchDate, endDate) {
    let msToDays = 1000 * 60 * 60 * 24;
	let sDate = new Date(matchDate);
	let eDate = new Date(endDate);

	return Math.ceil((eDate-sDate)/msToDays);
}

// For se om vi bruker den eller ikke
function compareDates(startDate, endDate){
	let sDate = new Date(startDate);
	let eDate = new Date(endDate);

	let result = 0;

	if(sDate.getTime() < eDate.getTime()){
		result = -1;
	}
	if(sDate.getTime() > eDate.getTime()){
		result = 1;
	}
	return result;
}

function goToNextMonth (e) {
	month++;
	if (month > 11) {
		month = 0;
		year++;
	}
	mth_element.textContent = months[month] + ' ' + year;
	populateDates();
}

function goToPrevMonth (e) {
	month--;
	if (month < 0) {
		month = 11;
		year--;
	}
	mth_element.textContent = months[month] + ' ' + year;
	populateDates();
}

function populateDates (e) {
	days_element.innerHTML = '';
	let amount_days = 31;

	if (month == 1) {
		amount_days = 28;
	}
	
	else if (month == 3 || month == 5 || month == 8 || month == 10){
        amount_days = 30;
    }

	for (let i = 0; i < amount_days; i++) {
		const day_element = document.createElement('div');
		day_element.classList.add('day');
		day_element.textContent = i + 1;

		if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
			day_element.classList.add('selected');
		}

		day_element.addEventListener('click', function () {
			selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
			selectedDay = (i + 1);
			selectedMonth = month;
			selectedYear = year;

			selected_date_element.textContent = formatDate(selectedDate);
			selected_date_element.dataset.value = selectedDate;

			populateDates();
		});

		days_element.appendChild(day_element);
	}
}

// HELPER FUNCTIONS
function checkEventPathForClass (path, selector) {
	for (let i = 0; i < path.length; i++) {
		if (path[i].classList && path[i].classList.contains(selector)) {
			return true;
		}
	}
	
	return false;
}
function formatDate (d) {
	let day = d.getDate();
	if (day < 10) {
		day = '0' + day;
	}

	let month = d.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}

	let year = d.getFullYear();

	//return day + ' / ' + month + ' / ' + year;
}
