"use strict";
const client = require( "oktadev-leankit-client" );

exports.handler = async () => {
	try {
		const cards = await client.getCardsWithDates();
		return {
			statusCode: 200,
			body: JSON.stringify( cards )
		};
	} catch ( err ) {
		console.log( err );
		throw err;
	}
};
