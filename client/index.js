import axios from "axios";
import Calendar from "tui-calendar";
import "mustard-ui";
import "tui-calendar/dist/tui-calendar.css";

let publishView = true;
let cards = [];
let calendar = null;

const getCards = async () => {
	const res = await axios.get( "/api/calendar-cards" );
	return res.data;
};

const createCalendar = () => {
	const c = new Calendar( "#calendar", {
		defaultView: "month",
		taskView: true,
		useDetailPopup: true,
		scheduleView: "allday"
	} );
	c.setOptions( { 
		month: {
			visibleWeeksCount: 8,
			workweek: true
		} 
	} );
	return c;
};

const cardTypeColor = ( cardType ) => {
	const normalized = cardType.replace( ".", "" ).replace( " ", "-" ).toLowerCase();
	switch( normalized ) {
	case "awareness":
		return  "#F8E3E2";
	case "devops":
		return "#D0CCE0";
	case "java":
		return "#BFDFC2";
	case "javascript":
		return "#FFF1BF";
	case "net":
		return  "#CFE1E3";
	case "php":
		return "#B8CFDF";
	case "scotch":
		return "#E4DACC";
	case "security":
		return "#FAD7B2";
	default:
		return "#FFFFFFd";
	}
};

const createSchedule = ( card, date ) => {
	return {
		id: card.id,
		title: card.title,
		start: date,
		end: date,
		category: "allday",
		isAllDay: true,
		attendees: card.assignedUsers.split( "," ),
		bgColor: cardTypeColor( card.type ),
		body: `<a href="${ card.url }" target="_blank">${ card.url }</a>`,
		isReadOnly: true
	};
};

const showPublishCalendar = () => {
	calendar.clear();
	const filteredCards = cards.filter( card => card.finish );
	const schedules = filteredCards.map( card => createSchedule( card, card.finish ) );
	calendar.createSchedules( schedules );
	const btn = document.getElementById( "toggleBtn" );
	btn.innerHTML = "Show Editorial Calendar";
	const h1 = document.getElementById( "title" );
	h1.innerHTML = "Publish Calendar";
};

const showEditorialCalendar = () => {
	calendar.clear();
	const filteredCards = cards.filter( card => card.start );
	const schedules = filteredCards.map( card => createSchedule( card, card.start ) );
	calendar.createSchedules( schedules );
	const btn = document.getElementById( "toggleBtn" );
	btn.innerHTML = "Show Publish Calendar";
	const h1 = document.getElementById( "title" );
	h1.innerHTML = "Editorial Calendar";
};

const showCurrentCalendar = () => {
	if ( publishView ) {
		showPublishCalendar();
	} else {
		showEditorialCalendar();
	}
};

const toggleCurrentCalendar = () => {
	publishView = !publishView;
	showCurrentCalendar();
};

const refreshCards = async () => {
	const c = await getCards();
	if ( JSON.stringify( cards ) !== JSON.stringify( c ) ) {
		cards = c;
		showCurrentCalendar();
	}
};

document.addEventListener( "DOMContentLoaded", async () => {
	document.getElementById( "toggleBtn" ).addEventListener( "click", function(){
		toggleCurrentCalendar();
	} );

	document.getElementById( "refreshBtn" ).addEventListener( "click", function() {
		refreshCards();
	} );

	calendar = createCalendar();
	cards = await getCards();
	showCurrentCalendar();
}, false );
