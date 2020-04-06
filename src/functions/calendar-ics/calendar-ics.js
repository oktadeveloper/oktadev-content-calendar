"use strict";
const client = require( "oktadev-leankit-client" );
const calendar = require( "./feed" );

exports.handler = async () => {
	try {
		const cards = await client.getCardsWithDates();
		const feed = await calendar.generateCalendarFeed( cards );
		return {
			statusCode: 200,
			body: feed,
			headers: {
				"Content-Type": "text/calendar; charset=utf-8"
			}
		};
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};
