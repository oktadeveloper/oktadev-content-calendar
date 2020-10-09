import axios from "axios";
import Calendar from "tui-calendar";
import "roboto-fontface";
import "normalize.css";
import "milligram";
import "tui-calendar/dist/tui-calendar.css";
import "./site.css";

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
	case "twitch":
		return "#DA78FB";
	case "python":
		return "#68C9FF";
	case "go":
		return "#85E6F1";
	default:
		return "#FFFFFF";
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
	currentFilter = "";
	showCurrentCalendar();
};

const filterCards = cardType => {
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

	const tags = document.getElementById( "filters" );

	let child = tags.lastElementChild;
	while ( child ) {
		tags.removeChild( child );
		child = tags.lastElementChild;
	}

	const createFilter = ( id, title, click, active ) => {
		const button = document.createElement( "button" );
		button.classList = active ? `button button-outline filter filter-${ id }` : `button button-clear filter filter-${ id }`;
		button.addEventListener( "click", function( e ) {
			click();
			e.preventDefault();
		} );
		button.appendChild( document.createTextNode( title ) );
		return button;
	};

	if ( types.length > 1 ) {
		const all = createFilter( "", "All", clearFilter, currentFilter === "" );
		tags.appendChild( all );

		for( const t of types ) {
			const li = createFilter( t.id, t.name, () => filterCards( t.id ), currentFilter === t.id );
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
