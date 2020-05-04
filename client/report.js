import Vue from "vue/dist/vue";
import axios from "axios";
import "roboto-fontface";
import "normalize.css";
import "milligram";
import "./site.css";

new Vue( {
	el: "#app",
	data: {
		assignments: []
	},
	mounted () {
		axios.get( "/api/assignment-report" )
			.then( res => {
				const cards = res.data;
				this.assignments = cards.map( card => {
					return {
						name: card.name,
						count: card.count,
						required: 5,
						isBelowThreshold: card.count < 5
					};
				} );
			} );
	}
} );
