"use strict";

require( "dotenv" ).config();
const client = require( "./functions/utils/leankit" );
const calendar = require( "./functions/utils/calendar" );

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
