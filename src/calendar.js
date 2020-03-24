"use strict";
// https://etw4xyhz0m.execute-api.us-east-1.amazonaws.com/default/content-calendar

const moment = require( "moment-timezone" );
const stamp = moment();

const formatDate = ( d, dateOnly = false, floating = false ) => {
	let m = moment( d ).utc();
	if ( !dateOnly && !floating ) {
		m = moment( d ).utc();
	}

	let s = m.format( "YYYYMMDD" );
	if ( !dateOnly ) {
		s += "T";
		s += m.format( "HHmmss" );

		if ( !floating ) {
			s += "Z";
		}
	}

	return s;
};

const escape = str => {
	return str.replace( /[\\;,"]/g, function ( match ) {
		return "\\" + match;
	} ).replace( /(?:\r\n|\r|\n)/g, "\\n" );
};

const wrapLongLines = ( str ) => {
	return str.split( "\r\n" ).map( function ( line ) {
		return line.match( /(.{1,74})/g ).join( "\r\n " );
	} ).join( "\r\n" );
};

const generateCalendarFeed = cards => {
	const feed = [];
	const generateCardEvent = ( card, dt, pub ) => {
		feed.push( "BEGIN:VEVENT" );
		feed.push( `UID:${ card.id }${ pub ? "" : "-ed" }@oktadev.leankit.com` );
		feed.push( "SEQUENCE:0" );
		feed.push( `DTSTAMP:${ formatDate( stamp ) }` ); //20200324T153517Z
		feed.push( `DTSTART;TZID=UTC;VALUE=DATE:${ formatDate( dt, true ) }` );
		feed.push( "X-MICROSOFT-CDO-ALLDAYEVENT:TRUE" );
		feed.push( "X-MICROSOFT-CDO-BUSYSTATUS:FREE" );
		feed.push( "TRANSP:TRANSPARENT" );
		feed.push( escape( `SUMMARY:${ pub ? "Publish" : "Editorial" }: ${ card.title }` ) );
		feed.push( escape( `DESCRIPTION:Type: ${ card.type }\nLane: ${ card.lane }\nAssigned users: ${ card.assignedUsers }\n${ card.url }` ) );
		feed.push( `URL;VALUE=URI:${ card.url }` );
		feed.push( `X-MS-OLK-MWSURL:${ card.url }` );
		feed.push( `LAST-MODIFIED:${ formatDate( card.updatedOn ) }` );
		feed.push( "END:VEVENT" );
	};
	feed.push( "BEGIN:VCALENDAR" );
	feed.push( "VERSION:2.0" );
	feed.push( "PRODID:-//okta//oktadev-leankit-cal//EN" );
	feed.push( "NAME:Content Calendar" );
	feed.push( "X-WR-CALNAME:Content Calendar" );
	feed.push( "METHOD:PUBLISH" );
	feed.push( "BEGIN:VTIMEZONE" );
	feed.push( "TZID:UTC" );
	feed.push( "BEGIN:STANDARD" );
	feed.push( "DTSTART;VALUE=DATE:20190101" );
	feed.push( "TZNAME:UTC" );
	feed.push( "TZOFFSETFROM:+0000" );
	feed.push( "TZOFFSETTO:+0000" );
	feed.push( "END:STANDARD" );
	feed.push( "END:VTIMEZONE" );

	for( const card of cards ) {
		if ( card.start ) {
			generateCardEvent( card, card.start, false );
		}
		if ( card.finish ) {
			generateCardEvent( card, card.finish, true );
		}
	}
	feed.push( "END:VCALENDAR" );
	return wrapLongLines( feed.join( "\r\n" ) );
};

module.exports = {
	generateCalendarFeed
};
