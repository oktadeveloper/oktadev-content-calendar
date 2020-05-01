"use strict";
const client = require( "oktadev-leankit-client" );

const unassignedCardsByType = async () => {
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
	return cardTypes;
};

exports.handler = async () => {
	try {
		const report = await unassignedCardsByType();
		return {
			statusCode: 200,
			body: JSON.stringify( report ),
			headers: {
				"Content-Type": "application/json"
			}
		};
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};
