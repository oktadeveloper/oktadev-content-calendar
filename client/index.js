import axios from "axios";
import Calendar from "tui-calendar";
import "mustard-ui";
import "tui-calendar/dist/tui-calendar.css";

let publishView = true;
let cards = [];
let calendar = null;
let currentFilter = "";

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

const normalizeType = cardType => {
	return cardType.replace( ".", "" ).replace( " ", "-" ).toLowerCase();
};

const cardTypeColor = ( cardType ) => {
	const normalized = normalizeType( cardType );
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

const clearFilter = () => {
	console.log( "clearing filter" );
	currentFilter = "";
	showCurrentCalendar();
};

const filterCards = cardType => {
	console.log( "filtering: " + cardType );
	currentFilter = cardType;
	showCurrentCalendar();
};

const showFilters = () => {
	const types = [];
	for( const card of cards ) {
		const exists = types.find( t => t.name === card.type );
		if ( !exists ){
			const id = normalizeType( card.type );
			types.push( { id, name: card.type } );
		}
	}
	types.sort( function( a, b ) {
		if( a.id < b.id ) {
			return -1;
		}
		if ( a.id > b.id ) {
			return 1;
		}
		return 0;
	} );
	console.log( types );

	const tags = document.getElementById( "filter" );

	let child = tags.lastElementChild; 
	while ( child ) { 
		tags.removeChild( child ); 
		child = tags.lastElementChild; 
	}

	if ( types.length > 1 ) {
		const li = document.createElement( "li" );
		const a = document.createElement( "a" );
		a.href = "#";
		if ( currentFilter === "" ) {
			a.classList = "active";
		}
		a.addEventListener( "click", function( e ) {
			clearFilter();
			e.preventDefault();
		} );
		a.appendChild( document.createTextNode( "All" ) );
		li.appendChild( a );
		tags.appendChild( li );
		
		for( const t of types ) {
			const li = document.createElement( "li" );
			const a = document.createElement( "a" );
			a.href = "#";
			if ( currentFilter === t.id ) {
				a.classList = "active";
			}	
			a.addEventListener( "click", function( e ) {
				filterCards( t.id );
				e.preventDefault();
			} );
			a.appendChild( document.createTextNode( t.name ) );
			li.appendChild( a );
			tags.appendChild( li );
		}	
	}
};

const showPublishCalendar = () => {
	calendar.clear();
	const filteredCards = cards.filter( card => {
		return card.finish && ( currentFilter === "" || normalizeType( card.type ) === currentFilter );
	} );
	const schedules = filteredCards.map( card => createSchedule( card, card.finish ) );
	calendar.createSchedules( schedules );
	const btn = document.getElementById( "toggleBtn" );
	btn.innerHTML = "Editorial Calendar";
	const h1 = document.getElementById( "title" );
	h1.innerHTML = "Publish Calendar";
	showFilters( filteredCards );
};

const showEditorialCalendar = () => {
	calendar.clear();
	const filteredCards = cards.filter( card => {
		return card.start && ( currentFilter === "" || normalizeType( card.type ) === currentFilter );
	} );
	const schedules = filteredCards.map( card => createSchedule( card, card.start ) );
	calendar.createSchedules( schedules );
	const btn = document.getElementById( "toggleBtn" );
	btn.innerHTML = "Publish Calendar";
	const h1 = document.getElementById( "title" );
	h1.innerHTML = "Editorial Calendar";
	showFilters( filteredCards );
};

const showCurrentCalendar = () => {
	showFilters();
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
