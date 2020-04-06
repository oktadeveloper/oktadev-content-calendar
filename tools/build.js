"use strict";
const path = require( "path" );
const fs = require( "fs-extra" );

const cleanFolder = async ( folderPath ) => {
	await fs.emptyDir( folderPath );
	console.log( "cleaned folder", folderPath );	
};

( async () => {
	const dist = path.join( __dirname, "..", "dist" );
	await fs.ensureDir( dist );
	await cleanFolder( dist );
} )();
