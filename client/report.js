import Vue from "vue/dist/vue";
import axios from "axios";
import "roboto-fontface";
import "normalize.css";
import "milligram";
import "./site.css";

const DEFAULT_THRESHOLD = 5;

const contentTypes = {
	DevOps: DEFAULT_THRESHOLD,
	Java: DEFAULT_THRESHOLD,
	PHP: DEFAULT_THRESHOLD,
	".NET": DEFAULT_THRESHOLD,
	JavaScript: DEFAULT_THRESHOLD
};

new Vue( {
	el: "#app",
	data: {
		assignments: []
	},
	async mounted () {
		const res = await axios.get( "/api/assignment-report" );
		const cards = res.data;
		console.log( cards );
		const assignments = cards.filter( card => {
			return contentTypes[card.name];
		} ).map( card => {
			return {
				name: card.name,
				count: card.count,
				required: contentTypes[card.name],
				isBelowThreshold: card.count < contentTypes[card.name]
			};
		} );

		// Combine Python and Go into one
		const pythonGo = {
			name: "Python/Go",
			count: 0,
			required: DEFAULT_THRESHOLD,
			isBelowThreshold: true
		};
		for( const card of cards ) {
			if ( card.name === "Go" || card.name === "Python" ) {
				console.log( card );
				pythonGo.count += card.count;
			}
		}
		pythonGo.isBelowThreshold = pythonGo.count < DEFAULT_THRESHOLD;
		assignments.push( pythonGo );

		this.assignments = assignments;
	}
} );
