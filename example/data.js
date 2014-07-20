var ganttData = [
	{
		id: 1, name: "Feature 1", series: [
			{ name: "Planned", start: new Date(2010,0,1), end: new Date(2010,0,3) },
			{ name: "Actual", start: new Date(2010,0,2), end: new Date(2010,0,5), color: "#f0f0f0" }
		]
	}, 
	{
		id: 2, name: "Feature 2", series: [
			{ name: "Planned", start: new Date(2010,0,5), end: new Date(2010,0,20) },
			{ name: "Actual", start: new Date(2010,0,6), end: new Date(2010,0,17), color: "#f0f0f0" },
			{ name: "Projected", start: new Date(2010,0,6), end: new Date(2010,0,17), color: "#e0e0e0" }
		]
	}, 
	{
		id: 3, name: "Feature 3", series: [
			{ name: "Requirement", start: new Date(2010,0,11), end: new Date(2010,0,16), phase: "requirement" },
			{ name: "Design", start: new Date(2010,0,16), end: new Date(2010,0,24), phase: "design" },
			{ name: "Implementation", start: new Date(2010,0,24), end: new Date(2010,1,3), phase: "implementation" },
			{ name: "Testing", start: new Date(2010,1,3), end: new Date(2010,1,13), phase: "testing" }
		]
	}, 
	{
		id: 4, name: "Feature 4", series: [
			{ name: "Planned", start: new Date(2010,1,1), end: new Date(2010,1,3) },
			{ name: "Actual", start: new Date(2010,1,1), end: new Date(2010,1,5), color: "#f0f0f0" }
		]
	},
	{
		id: 5, name: "Feature 5", series: [
			{ name: "Planned", start: new Date(2010,2,1), end: new Date(2010,3,20) },
			{ name: "Actual", start: new Date(2010,2,1), end: new Date(2010,3,26), color: "#f0f0f0" }
		]
	}, 
	{
		id: 6, name: "Feature 6", series: [
			{ name: "Planned", start: new Date(2010,0,5), end: new Date(2010,0,20) },
			{ name: "Actual", start: new Date(2010,0,6), end: new Date(2010,0,17), color: "#f0f0f0" },
			{ name: "Projected", start: new Date(2010,0,6), end: new Date(2010,0,20), color: "#e0e0e0" }
		]
	}, 
	{
		id: 7, name: "Feature 7", series: [
			{ name: "Planned", start: new Date(2010,0,11), end: new Date(2010,1,3) }
		]
	}, 
	{
		id: 8, name: "Feature 8", series: [
			{ name: "Planned", start: new Date(2010,1,1), end: new Date(2010,1,3) },
			{ name: "Actual", start: new Date(2010,1,1), end: new Date(2010,1,5), color: "#f0f0f0" }
		]
	}
];