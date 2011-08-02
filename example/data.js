var ganttData = [
	{
		id: 1, name: "Workshop 1", 
		series: [
			{ name: "Engines", 
			    activities: [ 
					 { title: 'shopvisit',   start: new Date(2010,10,02), end: new Date(2010,10,05) },
					 { title: 'shopvisit 2', start: new Date(2010,11,02), end: new Date(2010,11,09), color: "#ACC0D5", additionaldata: { item1: 'item1'} }
				]},
			{ name: "Aircraft", 
			    activities: [ 
					{ title: '<span>from:</span>', start: new Date(2010,10,02), end: new Date(2010,12,05), color: "#f0f0f0" }
			  ]
			}
		]
	}, 
	{
		id: 2, name: "Delta",
		series: [
			{ name: "Engines",  activities: [ 
				 { start: new Date(2010,10,06), end: new Date(2010,10,17), color: "#f0f0f0" },
				 { start: new Date(2010,10,08), end: new Date(2010,10,23), color: "#fcfcfc" },
				 { start: new Date(2010,10,15), end: new Date(2010,10,18), color: "#f0f0f0" }
			  ]},
			{ name: "Aircraft",  activities: [ 
				 { start: new Date(2010,10,06), end: new Date(2010,10,17), color: "#c0c0c0" }
			  ]}
		]
	}
	];
