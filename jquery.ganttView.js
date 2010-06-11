/*
Options
-----------------
data: object
start: date
end: date
cellWidth: number
cellHeight: number
slideWidth: number
*/

(function (jQuery) {
    jQuery.fn.ganttView = function (options) {
		
		var els = this;
		var defaults = { cellWidth: 21, cellHeight: 21, slideWidth: 400, vHeaderWidth: 100 };
		var opts = $.extend(defaults, options);
		var months = Gantt.getMonths(opts.start, opts.end);
		
		els.each(function () {
			
			var container = $(this);
			var div = $("<div>", { "class": "ganttview" });
			
			Gantt.addVtHeader(div, opts.data, opts.cellHeight);
			
			var slideDiv = $("<div>", {
				"class": "ganttview-slide-container",
 				"css": { "width": opts.slideWidth + "px" }
			});
			
			Gantt.addHzHeader(slideDiv, months, opts.cellWidth);
			Gantt.addGrid(slideDiv, opts.data, months, opts.cellWidth);
			Gantt.addBlockContainers(slideDiv, opts.data);
			Gantt.addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start);
			
			div.append(slideDiv);
			container.append(div);
			
			var w = $("div.ganttview-vtheader", container).outerWidth() + 
				$("div.ganttview-slide-container", container).outerWidth();
			container.css("width", (w + 2) + "px");
			
			Gantt.applyLastClass(container);
		});
	};
	
	var Gantt = {
		
		monthNames: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		
		getMonths: function (start, end) {
			var months = []; months[start.getMonth()] = [start];
			var last = start;
			while (last.compareTo(end) == -1) {
				var next = last.clone().addDays(1);
				if (!months[next.getMonth()]) { months[next.getMonth()] = []; }
				months[next.getMonth()].push(next);
				last = next;
			}
			return months;
		},
		
		addVtHeader: function (div, data, cellHeight) {
			var headerDiv = $("<div>", { "class": "ganttview-vtheader" });
			for (var i = 0; i < data.length; i++) {
				var itemDiv = $("<div>", { "class": "ganttview-vtheader-item" });
				itemDiv.append($("<div>", { 
					"class": "ganttview-vtheader-item-name",
					"css": { "height": ((data[i].series.length * cellHeight) - 6) + "px" } 
				}).append(data[i].name));
				var seriesDiv = $("<div>", { "class": "ganttview-vtheader-series" });
				for (var j = 0; j < data[i].series.length; j++) {
					seriesDiv.append($("<div>", { "class": "ganttview-vtheader-series-name" }).append(data[i].series[j].name));
				}
				itemDiv.append(seriesDiv);
				headerDiv.append(itemDiv);
			}
			div.append(headerDiv);
		},
		
		addHzHeader: function (div, months, cellWidth) {
			var headerDiv = $("<div>", { "class": "ganttview-hzheader" });
			var monthsDiv = $("<div>", { "class": "ganttview-hzheader-months" });
			var daysDiv = $("<div>", { "class": "ganttview-hzheader-days" });
			var totalW = 0;
			for (var i = 0; i < 12; i++) {
				if (months[i]) {
					var w = months[i].length * cellWidth;
					totalW = totalW + w;
					monthsDiv.append($("<div>", {
						"class": "ganttview-hzheader-month",
						"css": { "width": (w - 1) + "px" }
					}).append(Gantt.monthNames[i]));
					for (var j = 0; j < months[i].length; j++) {
						daysDiv.append($("<div>", { "class": "ganttview-hzheader-day" }).append(months[i][j].getDate()));
					}
				}
			}
			monthsDiv.css("width", totalW + "px");
			daysDiv.css("width", totalW + "px");
			headerDiv.append(monthsDiv).append(daysDiv);
			div.append(headerDiv);
		},
		
		addGrid: function (div, data, months, cellWidth) {
			var gridDiv = $("<div>", { "class": "ganttview-grid" });
			var rowDiv = $("<div>", { "class": "ganttview-grid-row" });
			for (var i = 0; i < 12; i++) {
				if (months[i]) { 
					for (var j = 0; j < months[i].length; j++) {
						rowDiv.append($("<div>", { "class": "ganttview-grid-row-cell " }));
					}
				}
			}
			var w = $("div.ganttview-grid-row-cell", rowDiv).length * cellWidth;
			rowDiv.css("width", w + "px");
			gridDiv.css("width", w + "px");
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					gridDiv.append(rowDiv.clone());
				}
			}
			div.append(gridDiv);
		},
		
		addBlockContainers: function (div, data) {
			var blocksDiv = $("<div>", { "class": "ganttview-blocks" });
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					blocksDiv.append($("<div>", { "class": "ganttview-block-container" }));
				}
			}
			div.append(blocksDiv);
		},
		
		addBlocks: function (div, data, cellWidth, start) {
			var rows = $("div.ganttview-blocks div.ganttview-block-container", div);
			var rowIdx = 0;
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					var size = DateUtils.daysBetween(data[i].series[j].start, data[i].series[j].end);
					var offset = DateUtils.daysBetween(start, data[i].series[j].start);
					var blockDiv = $("<div>", { 
						"class": "ganttview-block", 
						"title": data[i].series[j].name + ", " + size + "days",
						"css": { 
							"width": ((size * cellWidth) - 9) + "px",
							"margin-left": ((offset * cellWidth) + 3) + "px"
						}
					});
					if (data[i].series[j].color) {
						blockDiv.css("background-color", data[i].series[j].color);
					}
					$(rows[rowIdx]).append(blockDiv);
					rowIdx = rowIdx + 1;
				}
			}
		},
		
		applyLastClass: function (div) {
			$("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
			$("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
			$("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
		}
		
	};
	
})(jQuery);

var ArrayUtils = {
	contains: function (arr, obj) {
		var has = false;
		for (var i = 0; i < arr.length; i++) { if (arr[i] == obj) { has = true; } }
		return has;
	}
};

var DateUtils = {
	daysBetween: function (start, end) {
		var count = 0, date = start.clone();
		while (date.compareTo(end) == -1) { count = count + 1; date.addDays(1); }
		return count;
	},
	isWeekend: function (date) {
		var ord = date.getOrdinalNumber();
		
	}
};