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
		var dates = Gantt.getDates(opts.start, opts.end);
		var months = Gantt.getMonths(dates);
		
		els.each(function () {
			
			var div = $(this);
			var tbl = $("<table>", { "class": "ganttview" });
			
			Gantt.addHeader(tbl, months, dates);
			
			div.append(tbl);
		});
	};
	
	var Gantt = {
		monthNames: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		addHeader: function (tbl, months, dates) {
			var thead = $("<thead></thead>");
			var monthTr = $("<tr></tr>");
			var emptyHdr = "<th rowspan='2'>&nbsp;</th>";
			monthTr.append(emptyHdr).append(emptyHdr);
			for (var i = 0; i < months.length; i++) {
				monthTr.append("<th colspan='3' class='ganttview-header-month'>" + Gantt.monthNames[months[i]] + "</th>");
			}
			thead.append(monthTr);
			var dateTr = $("<tr></tr>");
			for (var i = 0; i < dates.length; i++) {
				dateTr.append("<th class='ganttview-header-day'>" + dates[i].getDate() + "</th>");
			}
			thead.append(dateTr);
			tbl.append(thead);
		},
		getDates: function (start, end) {
			var dates = [start];
			while (dates[dates.length-1].compareTo(end) == -1) {
				dates.push(dates[dates.length-1].clone().addDays(1));
			}
			return dates;
		},
		getMonths: function (dates) {
			var months = [dates[0].getMonth()];
			for (var i = 0; i < dates.length; i++) {
				if (!ArrayUtils.contains(months, dates[i].getMonth())) {
					months.push(dates[i].getMonth());
				}
			}
			return months;
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