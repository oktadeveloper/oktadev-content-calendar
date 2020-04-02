"use strict";

const { zipFunctions } = require( "@netlify/zip-it-and-ship-it" );

zipFunctions( "src/functions", "functions-dist" );
