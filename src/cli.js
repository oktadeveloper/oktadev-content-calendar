"use strict";

require( "dotenv" ).config();
const client = require( "./functions/calendar/leankit" );
const feedGenerator = require( "./functions/calendar/feed" );

const main = async () => {
	try {
		const cards = await client.getCardsWithDates();
		const feed = await feedGenerator.generateCalendarFeed( cards );
		console.log( feed );
	} catch ( err ) {
		console.log( err );
	}
};

main();
