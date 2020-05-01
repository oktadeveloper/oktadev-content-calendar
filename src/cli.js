"use strict";

require( "dotenv" ).config();
const { program } = require( "commander" );
const client = require( "oktadev-leankit-client" );
const feedGenerator = require( "./functions/calendar-ics/feed" );

const assignments = async () => {
	try {
		// const assignmentsLaneId = "1016470545";
		const cards = await client.cards();
		console.log( cards );
	} catch ( err ) {
		console.log( err );
	}
};

const feed = async () => {
	try {
		const cards = await client.getCardsWithDates();
		const feed = await feedGenerator.generateCalendarFeed( cards );
		console.log( feed );
	} catch ( err ) {
		console.log( err );
	}
};

program.command( "feed" ).action( feed );
program.command( "assignments" ).action( assignments );

( async () => {
	await program.parseAsync( process.argv );
} )();
