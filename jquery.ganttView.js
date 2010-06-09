/*
Options
-----------------
data: object
start: date
end: date
rollup: string (day, week, month)
*/

(function (jQuery) {
    jQuery.fn.ganttView = function (options) {
		
		var els = this;
		var defaults = {};
		var opts = $.extend(defaults, options);
		var months = Gantt.getMonths(opts.start, opts.end);
		
		els.each(function () {
			
			var div = $(this);
			var tbl = $("<table>", { "class": "ganttview" });
			
			Gantt.addHeaderToTable(tbl, months);
			Gantt.addGridToTable(tbl, opts.data, months);
			
			div.append(tbl);
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
	};
	
})(jQuery);

var ArrayUtils = {
	contains: function (arr, obj) {
		var has = false;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == obj) { has = true; }
		}
		return has;
	}
};



/*

<table class="ganttview">
	<thead>
		<tr>
			<th rowspan="2">&nbsp;</th>
			<th rowspan="2">&nbsp;</th>
			<th colspan="3" class="ganttview-header-month">Jan</th>
			<th colspan="3" class="ganttview-header-month">Feb</th>
			<th colspan="3" class="ganttview-header-month">Mar</th>
		</tr>
		<tr>
			<th class="ganttview-header-day">1</th>
			<th class="ganttview-header-day">2</th>
			<th class="ganttview-header-day">3</th>
			<th class="ganttview-header-day">1</th>
			<th class="ganttview-header-day">2</th>
			<th class="ganttview-header-day">3</th>
			<th class="ganttview-header-day">1</th>
			<th class="ganttview-header-day">2</th>
			<th class="ganttview-header-day">3</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="ganttview-item-name" rowspan="2">Feature 1</td>
			<td class="ganttview-series-name">Planned</td>
			<td class="ganttview-series-cell">
				<div class="ganttview-item-block"></div>
			</td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
		</tr>
		<tr>
			<td class="ganttview-series-name">Actual</td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
			<td class="ganttview-series-cell"></td>
		</tr>
	</tbody>
</table>

*/