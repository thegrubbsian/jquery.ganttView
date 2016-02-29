var ganttData = [
	// {
	// 	id: 1, name: "Feature 1", series: [
	// 		{ name: "Planned", activities: [{ start: "2010-01-01", end: "2010-01-03" }] },
	// 		{ name: "Actual", activities: [{ start: "2010-01-02", end: "2010-01-05", color: "#f0f0f0" }] }
	// 	]
	// },
	// {
	// 	id: 2, name: "Feature 2", series: [
	// 		{ name: "Planned", activities: [{ start: "2010-01-05", end: "2010-01-20" }] },
	// 		{ name: "Actual", activities: [{ start: "2010-01-06", end: "2010-01-17", color: "#f0f0f0" }] },
	// 		{ name: "Projected", activities: [{ start: "2010-01-06", end: "2010-01-17", color: "#e0e0e0" }] }
	// 	]
	// },
	// {
	// 	id: 3, name: "Feature 3", series: [
	// 		{ name: "Planned", activities: [{ start: "2010-01-11", end: "2010,01-03" }] },
	// 		{ name: "Actual", activities: [{ start: "2010-01-15", end: "2010,01-03", color: "#f0f0f0" }] }
	// 	]
	// },
	// {
	// 	id: 4, name: "Feature 4", series: [
	// 		{ name: "Planned", activities: [{ start: "2010,01-01", end: "2010,01-03" }] },
	// 		{ name: "Actual", activities: [{ start: "2010,01-01", end: "2010,01-05", color: "#f0f0f0" }] }
	// 	]
	// },
	// {
	// 	id: 5, name: "Feature 5", series: [
	// 		{ name: "Planned", activities: [{ start: "2010,02,01", end: "2010,03,20" }] },
	// 		{ name: "Actual", activities: [{ start: "2010,02,01", end: "2010,03,26", color: "#f0f0f0" }] }
	// 	]
	// },
	{
		id: 6, name: "Feature 6", series: [
			{ name: "Planned", activities: [
					{ start: "2010-01-03", end: "2010-01-09" },
					{ start: "2010-01-10", end: "2010-01-16" },
					{ start: "2010-01-24", end: "2010-01-30" }
				]
			},
			{ name: "Actual", activities: [{ start: "2010-01-06", end: "2010-01-17", color: "#f0f0f0"}] },
			{ name: "Projected", activities: [
					{ start: "2010-01-03", end: "2010-01-09" },
					{ start: "2010-01-01", end: "2010-01-05" },
					{ start: "2010-01-11", end: "2010-01-18" },
					{ start: "2010-01-07", end: "2010-01-14" },
					{ start: "2010-01-04", end: "2010-01-08" }
				]
		  }
		]
	},
	{
		id: 7, name: "Feature 7", series: [
			{ name: "Planned", activities: [{start: "2010-01-11", end: "2010-02-03"}] }
		]
	},
	{
		id: 8, name: "Feature 8", series: [
			{ name: "Planned", activities: [{start: "2010-02-01", end: "2010-02-03"}] },
			{ name: "Actual", activities: [{start: "2010-02-01", end: "2010-02-05", color: "#f0f0f0"}] }
		]
	}
];

var unhierarchicalGanttData = [
	{
		series: {
			activities: [
				{ name: "Feature 1", start: "2011-08-01", end: "2011-08-03" },
				{ name: "Feature 2", start: "2011-08-02", end: "2011-08-05", color: "#f0f0f0" },
				{ name: "Feature 3", start: "2011-08-01", end: "2011-08-10" }
			]
		}
	}

];
