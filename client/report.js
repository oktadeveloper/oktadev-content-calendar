import Vue from "vue/dist/vue";
import axios from "axios";
import "roboto-fontface";
import "normalize.css";
import "milligram";
import "./site.css";

const contentTypes = {
	DevOps: 5,
	Java: 5,
	PHP: 5,
	".NET": 5,
	JavaScript: 5
};

new Vue( {
	el: "#app",
	data: {
		assignments: []
	},
	mounted () {
		axios.get( "/api/assignment-report" )
			.then( res => {
				const cards = res.data;
				this.assignments = cards
					.filter( card => {
						return contentTypes[card.name];
					} )
					.map( card => {
						return {
							name: card.name,
							count: card.count,
							required: contentTypes[card.name],
							isBelowThreshold: card.count < contentTypes[card.name]
						};
					} );
			} );
	}
} );
