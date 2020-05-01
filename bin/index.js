#!/usr/bin/env node
"use strict";

require( "dotenv" ).config();
const { program } = require( "commander" );
const client = require( "oktadev-leankit-client" );
const feedGenerator = require( "../src/functions/calendar-ics/feed" );

const assignments = async () => {
	try {
		const board = await client.board();
		const assignmentsLane = board.lanes.find( lane => lane.name === "Assignments" );
		if ( !assignmentsLane ) {
			throw new Error( "Assignments lane not found. Was it renamed?" );
		}
		const cardTypes = board.cardTypes
			.filter( ct => ct.name !== "Subtask" && ct.name !== "Issue" && ct.name !== "Other Work" )
			.map( ct => {
				return {
					name: ct.name,
					count: 0
				};
			} );
		const cards = await client.cards();
		const unassigned = cards
			.filter( card => {
				return card.laneId === assignmentsLane.id && card.assignedUsers.length === 0;
			} );
		for( const card of unassigned ) {
			cardTypes.find( ct => ct.name === card.cardType.name ).count++;
		}
		console.log( cardTypes );
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
