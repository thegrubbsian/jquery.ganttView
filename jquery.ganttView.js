/*
jQuery.ganttView v.0.8.8
Copyright (c) 2010 JC Grubbs - jc.grubbs@devmynd.com
MIT License Applies
*/

/*
Options
-----------------
showWeekends: boolean
data: object
cellWidth: number
cellHeight: number
slideWidth: number
dataUrl: string
behavior: {
	clickable: boolean,
	draggable: boolean,
	resizable: boolean,
	expandable: boolean, // Store if can be expandable or not
	onClick: function,
	onDrag: function,
	onResize: function
}
*/

(function (jQuery) {
	
    jQuery.fn.ganttView = function () {
    	
    	var args = Array.prototype.slice.call(arguments);
    	
    	if (args.length == 1 && typeof(args[0]) == "object") {
        	build.call(this, args[0]);
    	}
    	
    	if (args.length == 2 && typeof(args[0]) == "string") {
    		handleMethod.call(this, args[0], args[1]);
    	}
    };
    
    function build(options) {
    	
    	var els = this;
        var defaults = {
            showWeekends: true,
            cellWidth: 21,
            cellHeight: 31,
            slideWidth: 400,
            vHeaderWidth: 100,
            behavior: {
            	clickable: true,
            	draggable: true,
            	resizable: true,
				expandable: true,
				defaultGroupOpened: false
            }
        };
        
        var opts = jQuery.extend(true, defaults, options);

		if (opts.data) {
			build();
		} else if (opts.dataUrl) {
			jQuery.getJSON(opts.dataUrl, function (data) { opts.data = data; build(); });
		}

		function build() {
			
			var minDays = Math.floor((opts.slideWidth / opts.cellWidth)  + 5);
			var startEnd = DateUtils.getBoundaryDatesFromData(opts.data, minDays);
			opts.start = startEnd[0];
			opts.end = startEnd[1];
			
	        els.each(function () {

	            var container = jQuery(this);
	            var div = jQuery("<div>", { "class": "ganttview" });
	            new Chart(div, opts).render();
				container.append(div);
				
				var w = jQuery("div.ganttview-vtheader", container).outerWidth() +
					jQuery("div.ganttview-slide-container", container).outerWidth();
	            container.css("width", (w + 2) + "px");
	            
	            new Behavior(container, opts).apply();
	        });
		}
    }

	function handleMethod(method, value) {
		
		if (method == "setSlideWidth") {
			var div = $("div.ganttview", this);
			div.each(function () {
				var vtWidth = $("div.ganttview-vtheader", div).outerWidth();
				$(div).width(vtWidth + value + 1);
				$("div.ganttview-slide-container", this).width(value);
			});
		}
	}

	/**
	 * Main gantt Chart function
	 * @param div Target div
	 * @param opts Options
	 * @returns {{render: *}}
	 * @constructor
	 */
	var Chart = function(div, opts) {

		/**
		 * Render gantt chart
		 * @return void
		 */
		function render() {
			addVtHeader(div, opts.data, opts.cellHeight);

            var slideDiv = jQuery("<div>", {
                "class": "ganttview-slide-container",
                "css": { "width": opts.slideWidth + "px" }
            });
			
            dates = getDates(opts.start, opts.end);
            addHzHeader(slideDiv, dates, opts.cellWidth);
            addGrid(slideDiv, opts.data, dates, opts.cellWidth, opts.showWeekends);
            addBlockContainers(slideDiv, opts.data); // Add group/series lines
            addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start); // Add block dates lines
            div.append(slideDiv);
            applyLastClass(div.parent());
		}
		
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		/**
		 * Creates a 3 dimensional array [year][month][day] of every day
		 * between the given start and end dates
		 * @param start
		 * @param end
		 * @returns {[]}
		 */
        function getDates(start, end) {
            var dates = [];
			dates[start.getFullYear()] = [];
			dates[start.getFullYear()][start.getMonth()] = [start]
			var last = start;
			while (last.compareTo(end) == -1) {
				var next = last.clone().addDays(1);
				if (!dates[next.getFullYear()]) { dates[next.getFullYear()] = []; }
				if (!dates[next.getFullYear()][next.getMonth()]) { 
					dates[next.getFullYear()][next.getMonth()] = []; 
				}
				dates[next.getFullYear()][next.getMonth()].push(next);
				last = next;
			}
			return dates;
        }

        function addVtHeader(div, data, cellHeight) {
            var headerDiv = jQuery("<div>", { "class": "ganttview-vtheader" });
            for (var i = 0; i < data.length; i++) {

            	// Add header group
                var itemDiv = jQuery("<div>", { "class": "ganttview-vtheader-item" });
                itemDiv.append(jQuery("<div>", {
                    "class": "ganttview-vtheader-item-name title-group-name",
                    "css": { "height": '31px' }//(data[i].series.length * cellHeight) + "px" }
                }).append( getExpandCheckbox(data[i]))); // Insert Item

                var seriesDiv = jQuery("<div>", { "class": "ganttview-vtheader-series" });

                // Append header label
				seriesDiv.append(jQuery("<div>", { "class": "ganttview-vtheader-series-name title-group-name" })
					.data('empty-data-group',data[i].id)
					.append(data[i].name));

                for (var j = 0; j < data[i].series.length; j++) { // Insert items group
                    seriesDiv.append(jQuery("<div>", { "class": "ganttview-vtheader-series-name" })
						.append(data[i].series[j].name).data('items-group-data',data[i]));
                }
                itemDiv.append(seriesDiv); // Append items groups to item
                headerDiv.append(itemDiv); // Append items
            }
            div.append(headerDiv);
        }

		function getExpandCheckbox(data){
        	if(typeof  data === 'undefined') data = {id: -1, name: ""};
			return jQuery('<label>',{
				'class': 'check-box-list-chart'
			}).append(jQuery('<input>',{
				'type': 'checkbox'
			})).append(jQuery('<span>',{
				'class': 'checkmark'
			})).data('check-box-data',data);
		}

        function addHzHeader(div, dates, cellWidth) {
            var headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
            var monthsDiv = jQuery("<div>", { "class": "ganttview-hzheader-months" });
            var daysDiv = jQuery("<div>", { "class": "ganttview-hzheader-days" });
            var totalW = 0;
			for (var y in dates) {
				for (var m in dates[y]) {
					var w = dates[y][m].length * cellWidth;
					totalW = totalW + w;
					monthsDiv.append(jQuery("<div>", {
						"class": "ganttview-hzheader-month",
						"css": { "width": (w - 1) + "px" }
					}).append(monthNames[m] + "/" + y));
					for (var d in dates[y][m]) {
						daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day" })
							.append(dates[y][m][d].getDate()));
					}
				}
			}
            monthsDiv.css("width", totalW + "px");
            daysDiv.css("width", totalW + "px");
            headerDiv.append(monthsDiv).append(daysDiv);
            div.append(headerDiv);
        }

		/**
		 * Mount the grid view days
		 * @param div
		 * @param data
		 * @param dates
		 * @param cellWidth
		 * @param showWeekends
		 */
        function addGrid(div, data, dates, cellWidth, showWeekends) {
            var gridDiv = jQuery("<div>", { "class": "ganttview-grid" });
            var rowDiv = jQuery("<div>", { "class": "ganttview-grid-row" });
			for (var y in dates) {
				for (var m in dates[y]) {
					for (var d in dates[y][m]) {
						var cellDiv = jQuery("<div>", { "class": "ganttview-grid-row-cell" });
						if (DateUtils.isWeekend(dates[y][m][d]) && showWeekends) { 
							cellDiv.addClass("ganttview-weekend"); 
						}
						rowDiv.append(cellDiv);
					}
				}
			}
            var w = jQuery("div.ganttview-grid-row-cell", rowDiv).length * cellWidth;

            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");

            for (var i = 0; i < data.length; i++) {
				gridDiv.append(rowDiv.clone());
                for (var j = 0; j < data[i].series.length; j++) {
                    gridDiv.append(rowDiv.clone().data('serie-line',data[i].id).data('grid-row-data',data[i]));
                }
            }
            div.append(gridDiv);
        }

		/**
		 * Render div block containers
		 * @param div
		 * @param data
		 */
		function addBlockContainers(div, data) {
            var blocksDiv = jQuery("<div>", { "class": "ganttview-blocks" }); // Days block container
            for (var i = 0; i < data.length; i++) {

            	// Add entire serie block for expand/retract
				blocksDiv.append(jQuery("<div>", { "class": "ganttview-block-container"}).data('group-master-id',data[i]));

                for (var j = 0; j < data[i].series.length; j++) {
                	// Add group block
                    blocksDiv.append(jQuery("<div>", { "class": "ganttview-block-container"}).data('group-id',data[i]));
                }
            }
            div.append(blocksDiv);
        }

		/**
		 * Render blocks for dates start--end
		 * @param div Element to set blocks
		 * @param data Groups data
		 * @param cellWidth Define width for each cell in options
		 * @param start Start date
		 */
        function addBlocks(div, data, cellWidth, start) {
            var rows = jQuery("div.ganttview-blocks div.ganttview-block-container", div);
            var rowIdx = 0;
			for (var i = 0; i < data.length; i++) {
				//var sizeGroup =

				var groupSerieBlocks = [];
				var groupMarginLeft = -1;
				var groupEndDate = null;
				var groupStartDate = null;

				for (var j = 0; j < data[i].series.length; j++) {
					var series = data[i].series[j];
					var size = DateUtils.daysBetween(series.start, series.end) + 1;
					var offset = DateUtils.daysBetween(start, series.start);
					var block = jQuery("<div>", {
						"class": "ganttview-block",
						"title": series.name + ", " + size + " days",
						"css": {
							"width": ((size * cellWidth) - 9) + "px",
							"margin-left": ((offset * cellWidth) + 3) + "px"
						}
					});

					if (groupMarginLeft === -1) {
						groupMarginLeft = (offset * cellWidth) + 3;
					} else if (groupMarginLeft > ((offset * cellWidth) + 3)) {
						groupMarginLeft = (offset * cellWidth) + 3;
					}

					if(!groupEndDate){
						groupEndDate = series.end;
					}else{
						if(series.end > groupEndDate){
							groupEndDate = series.end;
						}
					}

					if(!groupStartDate){
						groupStartDate = series.start
					}else{
						if(series.start < groupStartDate){
							groupStartDate = series.start
						}
					}

					groupSerieBlocks.push({
						block: block,
						data: data[i],
						size: DateUtils.daysBetween(series.start, series.end) + 1,
						offset: DateUtils.daysBetween(start, series.start),
						series: data[i].series[j],
						opt: {
							"class": "ganttview-block",
							"title": series.name + ", " + size + " days",
							"css": {
								"width": ((size * cellWidth) - 9) + "px",
								"margin-left": ((offset * cellWidth) + 3) + "px"
							}
						}
					});
				}

				var groupOffset = DateUtils.daysBetween(start, groupStartDate);
				var groupSize = DateUtils.daysBetween(groupStartDate, groupEndDate)+1;

				var groupBlock = getDateBlock(data[i], groupSize,groupOffset,cellWidth);
				groupBlock.append(jQuery("<div>", {"class": "ganttview-block-text"}).text(data[i].name));
				jQuery(rows[rowIdx]).append(groupBlock);
				rowIdx++;
				addBlockDataGroup(groupBlock,data[i], groupStartDate, groupEndDate);


				groupSerieBlocks.forEach(function (elem, j) {
					addBlockData(elem.block, elem.data, data.series);
					if (elem.data.series[j].color) {
						elem.block.css("background-color", elem.data.series[j].color);
					}
					elem.block.append(jQuery("<div>", {"class": "ganttview-block-text"}).text(elem.size));
					jQuery(rows[rowIdx]).append(elem.block);
					rowIdx = rowIdx + 1;
				});
			}
        }
        
        function addBlockData(block, data, series) {
        	// This allows custom attributes to be added to the series data objects
        	// and makes them available to the 'data' argument of click, resize, and drag handlers
        	var blockData = { id: data.id, name: data.name };
        	jQuery.extend(blockData, series);
        	block.data("block-data", blockData);
        }

		function addBlockDataGroup(block, data, start, end) {
			var blockData = { id: data.id, name: data.name };
			jQuery.extend(blockData, {start: start, end: end});
			block.data("block-data", blockData);
		}

        function applyLastClass(div) {
            jQuery("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
        }

		/**
		 *
		 * @param series
		 * @param size Days
		 * @param offset
		 * @param cellWidth width of one day in div
		 * @returns {*|jQuery|HTMLElement}
		 */
        function getDateBlock(series, size, offset, cellWidth){
        	return jQuery("<div>", {
				"class": "ganttview-block",
				"title": series.name + ", " + size + " days",
				"css": {
					"width": ((size * cellWidth) - 9) + "px",
					"margin-left": ((offset * cellWidth) + 3) + "px"
				}
			});
		}
		
		return {
			render: render
		};
	}

	var Behavior = function (div, opts) {
		
		function apply() {
			
			if (opts.behavior.clickable) { 
            	bindBlockClick(div, opts.behavior.onClick); 
        	}
        	
            if (opts.behavior.resizable) { 
            	bindBlockResize(div, opts.cellWidth, opts.start, opts.behavior.onResize); 
        	}
            
            if (opts.behavior.draggable) { 
            	bindBlockDrag(div, opts.cellWidth, opts.start, opts.behavior.onDrag); 
        	}

			if (opts.behavior.expandable) {
				bindCheckBox(div);
			}

			openAllGroups(opts.behavior.defaultGroupOpened);

		}

        function bindBlockClick(div, callback) {
            jQuery("div.ganttview-block", div).on("click", function () {
                if (callback) { callback(jQuery(this).data("block-data")); }
            });
        }
        
        function bindBlockResize(div, cellWidth, startDate, callback) {
        	jQuery("div.ganttview-block", div).resizable({
        		grid: cellWidth, 
        		handles: "e,w",
        		stop: function () {
        			var block = jQuery(this);
        			updateDataAndPosition(div, block, cellWidth, startDate);
        			if (callback) { callback(block.data("block-data")); }
        		}
        	});
        }
        
        function bindBlockDrag(div, cellWidth, startDate, callback) {
        	jQuery("div.ganttview-block", div).draggable({
        		axis: "x", 
        		grid: [cellWidth, cellWidth],
        		stop: function () {
        			var block = jQuery(this);
        			updateDataAndPosition(div, block, cellWidth, startDate);
        			if (callback) { callback(block.data("block-data")); }
        		}
        	});
        }

		/**
		 * Add click event to every checkbox on header group
		 */
		function bindCheckBox(div){
			jQuery('.check-box-list-chart',div).off('click').on('click',function(){
				var data = jQuery(this).data('check-box-data');
				var checked = jQuery(this).find('input[type=checkbox]').is(':checked');
				/*
					class: ganttview-vtheader-series-name
						data: items-group-data
						- value: data group (id, name)
				*/

				// var items_group = $('.ganttview .ganttview-vtheader-series-name');
				// var days_div_group = $('.ganttview .ganttview-grid-row');
				// var box_schedules = $('.ganttview .ganttview-block-container');

				jQuery('.ganttview .ganttview-vtheader-series-name').each(function (i) {
					var checkbox_data = jQuery(this).data('items-group-data');
					if(typeof checkbox_data  !== 'undefined'){
						if(data.id === checkbox_data.id){
							if(!checked){
								jQuery(this).hide();
							}else{
								jQuery(this).show();
							}
						}
					}
				});

				jQuery('.ganttview .ganttview-grid-row').each(function(i){
					var grid_view_data = jQuery(this).data('grid-row-data');
					if(typeof grid_view_data !== "undefined" && grid_view_data !== null){
						if(data.id === grid_view_data.id) {
							if (!checked) {
								jQuery(this).hide();
							} else {
								jQuery(this).show();
							}
						}
					}
				});

				jQuery('.ganttview .ganttview-block-container').each(function(i){
					var grid_box_data = jQuery(this).data('group-id');
					if(typeof grid_box_data !== "undefined" && grid_box_data !== null){
						if(data.id === grid_box_data.id) {
							if (!checked) {
								jQuery(this).hide();
							} else {
								jQuery(this).show();
							}
						}
					}
				});

			});
		}

		/**
		 * Open or close all groups
		 * @param checked
		 */
		function openAllGroups(checked){
			//check-box-list-chart
			jQuery('.check-box-list-chart',div).each(function(i){
				var checkbox = jQuery(this).find('input[type=checkbox]');
				$(checkbox).prop('checked',checked);

				// var items_group = $('.ganttview .ganttview-vtheader-series-name');
				// var days_div_group = $('.ganttview .ganttview-grid-row');
				// var box_schedules = $('.ganttview .ganttview-block-container');

				jQuery('.ganttview .ganttview-vtheader-series-name').each(function (i) {
					var checkbox_data = jQuery(this).data('items-group-data');
					if(typeof checkbox_data  !== 'undefined'){
						if(!checked){
							jQuery(this).hide();
						}else{
							jQuery(this).show();
						}
					}
				});

				jQuery('.ganttview .ganttview-grid-row').each(function(i){
					var grid_view_data = jQuery(this).data('grid-row-data');
					if(typeof grid_view_data !== "undefined" && grid_view_data !== null) {
						if (!checked) {
							jQuery(this).hide();
						} else {
							jQuery(this).show();
						}
					}
				});
				jQuery('.ganttview .ganttview-block-container').each(function(i){
					var grid_box_data = jQuery(this).data('group-id');
					if(typeof grid_box_data !== "undefined" && grid_box_data !== null) {
						if (!checked) {
							jQuery(this).hide();
						} else {
							jQuery(this).show();
						}
					}
				});
			})
		}
		function updateDataAndPosition(div, block, cellWidth, startDate) {
        	var container = jQuery("div.ganttview-slide-container", div);
        	var scroll = container.scrollLeft();
			var offset = block.offset().left - container.offset().left - 1 + scroll;
			
			// Set new start date
			var daysFromStart = Math.round(offset / cellWidth);
			var newStart = startDate.clone().addDays(daysFromStart);
			block.data("block-data").start = newStart;

			// Set new end date
        	var width = block.outerWidth();
			var numberOfDays = Math.round(width / cellWidth) - 1;
			block.data("block-data").end = newStart.clone().addDays(numberOfDays);
			jQuery("div.ganttview-block-text", block).text(numberOfDays + 1);
			
			// Remove top and left properties to avoid incorrect block positioning,
        	// set position to relative to keep blocks relative to scrollbar when scrolling
			block.css("top", "").css("left", "")
				.css("position", "relative").css("margin-left", offset + "px");
        }
        
        return {
        	apply: apply	
        };
	}

    var ArrayUtils = {
	
        contains: function (arr, obj) {
            var has = false;
            for (var i = 0; i < arr.length; i++) { if (arr[i] == obj) { has = true; } }
            return has;
        }
    };

    var DateUtils = {
    	
        daysBetween: function (start, end) {
            if (!start || !end) { return 0; }
            start = Date.parse(start); end = Date.parse(end);
            if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
            var count = 0, date = start.clone();
            while (date.compareTo(end) == -1) { count = count + 1; date.addDays(1); }
            return count;
        },
        
        isWeekend: function (date) {
            return date.getDay() % 6 == 0;
        },

		getBoundaryDatesFromData: function (data, minDays) {
			var minStart = new Date(); maxEnd = new Date();
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					var start = Date.parse(data[i].series[j].start);
					var end = Date.parse(data[i].series[j].end)
					if (i == 0 && j == 0) { minStart = start; maxEnd = end; }
					if (minStart.compareTo(start) == 1) { minStart = start; }
					if (maxEnd.compareTo(end) == -1) { maxEnd = end; }
				}
			}
			
			// Insure that the width of the chart is at least the slide width to avoid empty
			// whitespace to the right of the grid
			if (DateUtils.daysBetween(minStart, maxEnd) < minDays) {
				maxEnd = minStart.clone().addDays(minDays);
			}
			
			return [minStart, maxEnd];
		}
    };

})(jQuery);
