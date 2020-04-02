"use strict";
const client = require( "../../leankit" );

exports.handler = async () => {
	try {
		const cards = await client.getCardsWithDates();
		return {
			statusCode: 200,
			body: cards
		};
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};
