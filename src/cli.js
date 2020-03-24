"use strict";

require( "dotenv" ).config();
const client = require( "./functions/content-calendar/leankit" );
const calendar = require( "./functions/content-calendar/calendar" );

const main = async () => {
	try {
		const cards = await client.getCardsWithDates();
		const feed = await calendar.generateCalendarFeed( cards );
		console.log( feed );
	} catch ( err ) {
		console.log( err );
	}
};

main();
