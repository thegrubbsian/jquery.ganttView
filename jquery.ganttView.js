/*
Options
-----------------
data: object
start: date
end: date
cellWidth: number
*/

(function (jQuery) {
    jQuery.fn.ganttView = function (options) {
		
		var els = this;
		var defaults = { cellWidth: 21, vHeaderWidth: 100 };
		var opts = $.extend(defaults, options);
		var months = Gantt.getMonths(opts.start, opts.end);
		
		els.each(function () {
			
			var container = $(this);
			var div = $("<div>", { "class": "ganttview" });
			
			Gantt.addHzHeader(div, months, opts.cellWidth);
			Gantt.addVtHeader(div, opts.data);
			Gantt.addGrid(div, opts.data, months, opts.cellWidth);
			Gantt.addBlocks(div, opts.data, opts.cellWidth, opts.start);
			
			container.append(div);
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
		
		addHzHeader: function (div, months, cellWidth) {
			var headerDiv = $("<div>", { "class": "ganttview-hzheader" });
			var monthsDiv = $("<div>", { "class": "ganttview-hzheader-months" });
			var daysDiv = $("<div>", { "class": "ganttview-hzheader-days" });
			for (var i = 0; i < 12; i++) {
				if (months[i]) {
					monthsDiv.append($("<div>", {
						"class": "ganttview-hzheader-month",
						"css": { "width": ((months[i].length * cellWidth) - 1) + "px" }
					}).append(Gantt.monthNames[i]));
					for (var j = 0; j < months[i].length; j++) {
						daysDiv.append($("<div>", { "class": "ganttview-hzheader-day" }).append(months[i][j].getDate()));
					}
				}
			}
			headerDiv.append(monthsDiv).append(daysDiv);
			div.append(headerDiv);
		},
		
		addVtHeader: function (div, data) {
			var headerDiv = $("<div>", { "class": "ganttview-vtheader" });
			for (var i = 0; i < data.length; i++) {
				var itemDiv = $("<div>", { "class": "ganttview-vtheader-item" });
				itemDiv.append($("<div>", { "class": "ganttview-vtheader-item-name" }).append(data[i].name));
				var seriesDiv = $("<div>", { "class": "ganttview-vtheader-series" });
				for (var j = 0; j < data[i].series.length; j++) {
					seriesDiv.append($("<div>", { "class": "ganttview-vtheader-series-name" }).append(data[i].series[j].name));
				}
				itemDiv.append(seriesDiv);
				headerDiv.append(itemDiv)
			}
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
			rowDiv.css("width", ($("div.ganttview-grid-row-cell", rowDiv).length * cellWidth) + "px");
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					gridDiv.append(rowDiv.clone());
				}
			}
			div.append(gridDiv);
		},
		
		addBlocks: function (div, data, cellWidth, start) {
			var rows = $("div.ganttview-grid div.ganttview-grid-row", div);
			var rowIdx = 0;
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					var size = DateUtils.daysBetween(data[i].series[j].start, data[i].series[j].end);
					var offset = DateUtils.daysBetween(start, data[i].series[j].start);
					var blockDiv = $("<div>", { 
						"class": "ganttview-block", 
						"css": { 
							"width": (size * cellWidth) + "px",
							"margin-left": (offset * cellWidth) + "px"
						}
					});
					$(rows[rowIdx]).append(blockDiv);
					rowIdx = rowIdx + 1;
				}
			}
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
		var count = 0;
		while (start.compareTo(end) == -1) { count = count + 1; start.addDays(1); }
		return count;
	}
};



/* SAMPLE GENERATED MARKUP

<div class="ganttview">

	<div class="ganttview-vtheader">
		<div class="ganttview-vtheader-item">
			<div class="ganttview-vtheader-item-name">Feature 1</div>
			<div class="ganttview-vtheader-series">
				<div class="ganttview-vtheader-series-name">Planned</div>
				<div class="ganttview-vtheader-series-name">Actual</div>
			</div>
		</div>
		<div class="ganttview-vtheader-item">
			<div class="ganttview-vtheader-item-name">Feature 2</div>
			<div class="ganttview-vtheader-series">
				<div class="ganttview-vtheader-series-name">Planned</div>
				<div class="ganttview-vtheader-series-name">Actual</div>
			</div>
		</div>
	</div>
	
	<div class="ganttview-slider">
	
		<div class="ganttview-hzheader">
			<div class="ganttview-hzheader-months">
				<div class="ganttview-hzheader-month">Jan</div>
				<div class="ganttview-hzheader-month">Feb</div>
				<div class="ganttview-hzheader-month">Mar</div>
			</div>
			<div class="ganttview-hzheader-days">
				<div class="ganttview-hzheader-day">1</div>
				<div class="ganttview-hzheader-day">2</div>
				<div class="ganttview-hzheader-day">3</div>
				<div class="ganttview-hzheader-day">1</div>
				<div class="ganttview-hzheader-day">2</div>
				<div class="ganttview-hzheader-day">3</div>
				<div class="ganttview-hzheader-day">1</div>
				<div class="ganttview-hzheader-day">2</div>
				<div class="ganttview-hzheader-day">3</div>
			</div>
		</div>
	
		<div class="ganttview-grid">
			<div class="ganttview-grid-row">
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
			</div>
			<div class="ganttview-grid-row">
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
			</div>
			<div class="ganttview-grid-row">
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
			</div>
			<div class="ganttview-grid-row">
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
				<div class="ganttview-grid-row-cell"></div>
			</div>
		</div>
	
	</div>
	
</div>

*/




/*

createTable: function (months) {
	var tbl = $("<table>", { "class": "ganttview" });
	var w = 200;
	for (var i = 0; i < months.length; i++) {
		if (months[i]) { w = w + months[i].length * 28; }
	}
	tbl.css("width", w + "px");
	return tbl;
},
addHeaderToTable: function (tbl, months) {
	var thead = $("<thead></thead>");
	var monthTr = $("<tr></tr>");
	var emptyHdr = "<th rowspan='2'>&nbsp;</th>";
	monthTr.append(emptyHdr).append(emptyHdr);
	var dateTr = $("<tr></tr>");
	for (var i = 0; i < 12; i++) {
		if (months[i]) {
			monthTr.append("<th colspan='" + months[i].length + "' class='ganttview-header-month'>" + Gantt.monthNames[i] + "</th>");
			for (var j = 0; j < months[i].length; j++) {
				dateTr.append("<th class='ganttview-header-day'>" + months[i][j].getDate() + "</th>");
			}
		}
	}
	thead.append(monthTr).append(dateTr);
	tbl.append(thead);
},
addGridToTable: function (tbl, data, months) {
	
	var tbody = $("<tbody></tbody>");
	
	for (var i = 0; i < data.length; i++) {
		
		var tr = $("<tr></tr>");
		var itemTd = $("<td class='ganttview-item-name' rowspan='" + data[i].series.length + "'>" + data[i].name + "</td>");
		tr.append(itemTd);
		
		var seriesTd = $("<td class='ganttview-series-name'>" + data[i].series[0].name + "</td>");
		tr.append(seriesTd);
		Gantt.addCellsToSeriesRow(tr, months);
		tbody.append(tr);
		
		for (var j = 1; j < data[i].series.length; j++) {
			tr = $("<tr></tr>");
			var seriesTd = $("<td class='ganttview-series-name'>" + data[i].series[j].name + "</td>");
			tr.append(seriesTd);
			Gantt.addCellsToSeriesRow(tr, months);
			tbody.append(tr);
		}
	}
	
	tbl.append(tbody);
},
addCellsToSeriesRow: function (tr, months) {
	for (var i = 0; i < 12; i++) {
		if (months[i]) {
			for (var j = 0; j < months[i].length; j++) {
				tr.append("<td class='ganttview-series-cell'></td>");
			}
		}
	}
}
*/