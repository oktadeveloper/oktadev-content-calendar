"use strict";
const client = require( "./utils/leankit" );
const calendar = require( "./utils/calendar" );

exports.handler = async () => {
	try {
		const cards = await client.getCardsWithDates();
		const feed = await calendar.generateCalendarFeed( cards );
		return {
			statusCode: 200,
			body: feed,
			headers: {
				"Content-Type": "text/calendar; charset=utf-8",
				// "Content-Disposition": "Content-Disposition: attachment; filename=\"cal.ics\""
			} 
		};
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};
