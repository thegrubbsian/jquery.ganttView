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
    start: date
    slideWidth: number
    dataUrl: string
    titleFormater: function // User able to pass it as an option to the gantt chart, then the gantt chart will call it whenever need to fill the block title. / default title = block size.
    viewType: "Y/M" or "Y/M/D" setup the view type of the gantt chart.
    additionalRows: number // add a set of additional - not used - rows to the gantt chart. [ Styling Issue ]
    behavior: {
        clickable: boolean,
        draggable: boolean,
        resizable: boolean,
        hover: boolean,
        onClick: function,
        onDrag: function,
        onResize: function,
        onHover: function,
        onLeave: function
    }
*/

(function (jQuery) {

    jQuery.fn.ganttView = function () {

        var args = Array.prototype.slice.call(arguments);

        if (args.length == 1 && typeof (args[0]) == "object") {
            build.call(this, args[0]);
        }

        if (args.length == 2 && typeof (args[0]) == "string") {
            handleMethod.call(this, args[0], args[1]);
        }
    };

    function build(options) {

        var els = this;
        var defaults = {
            showWeekends: true,
            cellHeight: 31,
            slideWidth: 400,
            vHeaderWidth: 100,
            behavior: {
                clickable: true,
                draggable: true,
                resizable: true,
                hover: true
            },
            additionalRows : 4
        };

        var opts = jQuery.extend(true, defaults, options);

        if (opts.data) {
            build();
        } else if (opts.dataUrl) {
            jQuery.getJSON(opts.dataUrl, function (data) { opts.data = data; build(); });
        }

        function build() {
            var minDays = Math.floor((opts.slideWidth / opts.cellWidth) + 5);
            var startEnd = DateUtils.getBoundaryDatesFromData(opts.data, minDays);
            if (!opts.start) { opts.start = startEnd[0]; }
            opts.recovery = opts.data;
            opts.end = startEnd[1];

            els.each(function () {

                var container = jQuery(this);
                var div = jQuery("<div>", { "class": "ganttview" });
                new Chart(div, opts).render();
                container.append(div);

                var w = jQuery("div.ganttview-vtheader", container).outerWidth() +
					jQuery("div.ganttview-slide-container", container).outerWidth();
                container.css("width", "100%");

                new Behavior(container, opts).apply();
            });
        }
    }

    function handleMethod(method, value) {

        if (method == "setSlideWidth") {
            var div = $("div.ganttview", this);
            div.each(function () {
                var vtWidth = $("div.ganttview-vtheader", div).outerWidth();
                $(div).width("100%");
                $("div.ganttview-slide-container", this).width(value);
            });
        }
    }


    var array = new Array();

    function solveOverlapping(ganttData) {
        for (var i = 0; i < ganttData.length; i++) {
            for (var j = 0; j < ganttData[i].series.length; j++) {
                solveSeriesOverLapping(ganttData[i], ganttData[i].series[j], j);
            }
        }
    }
	
    function solveSeriesOverLapping(ganttItem, series, seriesIndex) {

        for (var i = 0; i < series.activities.length ; i++) 
		{
            for (var j = i + 1; j < series.activities.length  ; j++) 
			{
                if ( i != j && isOverlapTest(series.activities[i].start, series.activities[i].end, series.activities[j].start, series.activities[j].end)) 
				{
					array.push(series.activities[j]);
					series.activities.splice(j,1);
					
                    j--;
                    
					if ( i != 0)
						i--;
                }
            }
        }
		
        //check if there are overlapped elements.
		if (array.length > 0 )
		{
            //add the series of the overlapped elements.
			ganttItem.series.splice(seriesIndex + 1,0, { name : "", activities : array } );
			array = new Array();
		}
      
    }
	
    function isOverlapTest(start1, end1,  start2, end2) {
        //checking overlaps 
        if ((Date.parse(start2) >= Date.parse(start1) && Date.parse(start2) <= Date.parse(end1)) || (Date.parse(end2) >= Date.parse(start1) && Date.parse(end2) <= Date.parse(end1)) ) 
            return true;
        else 
            return false;
    }



    var Chart = function(div, opts) {

        function render() {

            solveOverlapping(opts.data);

            addVtHeader(div, opts.data, opts.cellHeight);

            var slideDiv = jQuery("<div>", {
                "class": "ganttview-slide-container",
                //"css": { "width": opts.slideWidth + "px" }
            });

            //Setups for Y/M View
            if(opts.viewType == "Y/M" && opts.cellWidth == null)
            {
                opts.cellWidth = 2;
            }
            else if(opts.viewType == "Y/M/D" && opts.cellWidth == null)
            {
                opts.cellWidth = 21;
            }

            dates = getDates(opts.start, opts.end);
            addHzHeader(slideDiv, dates, opts.cellWidth);
            addGrid(slideDiv, opts.data, dates, opts.cellWidth, opts.showWeekends, opts.additionalRows);
            addBlockContainers(slideDiv, opts.data, opts.additionalRows);
            addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start, opts);
            div.append(slideDiv);
            applyLastClass(div.parent());
        }

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Creates a 3 dimensional array [year][month][day] of every day 
        // between the given start and end dates
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
                var itemDiv = jQuery("<div>", { "class": "ganttview-vtheader-item" });
                itemDiv.append(jQuery("<div>", {
                        "id": "ganttview-header-" + data[i].Id,
                        "class": "ganttview-vtheader-item-name",
                        "css": { "min-height": (data[i].series.length * cellHeight)  - 1 +  "px" }
                    }).append(data[i].name));
                var seriesDiv = jQuery("<div>", { "class": "ganttview-vtheader-series" });
                for (var j = 0; j < data[i].series.length; j++) {
                    
                    var seriesNameCss = "ganttview-vtheader-series-name";
                    
                    if(data[i].series[j].name == "" )
                    {
                        seriesNameCss = "ganttview-vtheader-series-overlapping"
                    }
                    				
                    seriesDiv.append(jQuery("<div>",
                        { "class": seriesNameCss,
                            "css": { "min-height": cellHeight + "px" }
                        }
						)
                            .append(data[i].series[j].name));
                }
                itemDiv.append(seriesDiv);
                headerDiv.append(itemDiv);
            }
            div.append(headerDiv);

            if(opts.viewType == "Y/M/D")
            {
                headerDiv.css("margin-top","41px");
            }
        }

        function addHzHeader(div, dates, cellWidth) {
            var headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
            var monthsDiv = jQuery("<div>", { "class": "ganttview-hzheader-months" });
            var daysDiv = jQuery("<div>", { "class": "ganttview-hzheader-days" });
            var totalW = 0;
            for (var y in dates) {
                if(opts.viewType == "Y/M")
                {       
                        var w = 0;

                        for(var m in dates[y])
                        {
                            w += dates[y][m].length;
                        }
                        
                        w *= cellWidth;
                        monthsDiv.append(jQuery("<div>", {
                                "class": "ganttview-hzheader-month",
                                "css": { "width": (w-1) + "px" }}).append(y));
                }

                for (var m in dates[y]) {
                    var w = dates[y][m].length * cellWidth;
                    //Check the view type, then build the gantt chart depend on it.
                    if(opts.viewType == "Y/M")
                    {
                        totalW = totalW + w + 1;
                        daysDiv.append(jQuery("<div>", {
                                "class": "ganttview-hzheader-month",
                                "css": { "width": (w-1) + "px" }}).append(monthNames[m]));
                    }
                    else if(opts.viewType == "Y/M/D")
                    {
                        totalW = totalW + w;
                        monthsDiv.append(jQuery("<div>", {
                                "class": "ganttview-hzheader-month",
                                "css": { "width": (w - 1) + "px" }
                            }).append( y + "/" + monthNames[m]));
                        for (var d in dates[y][m]) {
                            daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day" }).append(dates[y][m][d].getDate()));
                        }
                    }
                    
                }
            }

            monthsDiv.css("width", totalW + "px");
            daysDiv.css("width", totalW + "px");
            headerDiv.append(monthsDiv).append(daysDiv);
            div.append(headerDiv);
        }

        function addGrid(div, data, dates, cellWidth, showWeekends, additionalRows) {
            var gridDiv = jQuery("<div>", { "class": "ganttview-grid" });
            var rowDiv = jQuery("<div>", { "class": "ganttview-grid-row" });
            var sumDays = 0;
            for (var y in dates) {
                for (var m in dates[y]) {
                    //Check the view type, then build the gantt chart depend on it.
                    if(opts.viewType == "Y/M")
                    {
                            var w = dates[y][m].length * cellWidth;
                            sumDays += dates[y][m].length  ;
                            var cellDiv = jQuery("<div>", { "class": "ganttview-grid-row-cell" });
                            cellDiv.css("width", (w-1)  + "px");
                            rowDiv.append(cellDiv);
                            if(m % 2 == 0)
                            {
                                cellDiv.addClass("ganttview-weekend");
                            }
                    }
                    else if(opts.viewType == "Y/M/D")
                    {
                        for (var d in dates[y][m]) {
                                var cellDiv = jQuery("<div>", { "class": "ganttview-grid-row-cell" });
                                if (DateUtils.isWeekend(dates[y][m][d]) && showWeekends) {
                                    cellDiv.addClass("ganttview-weekend");
                                }
                                rowDiv.append(cellDiv);
                            }
                    } 
                }
            }
            //

            // w is the width of row and grid.
            var w = cellWidth * sumDays;
            
            if(opts.viewType == "Y/M/D")
            {
                w = jQuery("div.ganttview-grid-row-cell", rowDiv).length * cellWidth;  
            }

            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    gridDiv.append(rowDiv.clone());
                }
            }

            for (var i = 0; i < additionalRows; i++) { // add additional Rows to the buttom of the chart
                gridDiv.append(rowDiv.clone());
            }

            div.append(gridDiv);

            
        }

        function addBlockContainers(div, data, additionalRows) {
            var blocksDiv = jQuery("<div>", { "class": "ganttview-blocks" });
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    var seriesBlock = jQuery("<div>", { "class": "ganttview-series-container" }).appendTo(blocksDiv);
                    $(seriesBlock).append(jQuery("<div>", { "class": "ganttview-block-container" }));

                }
            }

            for (var i = 0; i < additionalRows; i++) { // add additional Rows to the buttom of the chart
                var seriesBlock = jQuery("<div>", { "class": "ganttview-Series-container" }).appendTo(blocksDiv);
                $(seriesBlock).append(jQuery("<div>", { "class": "ganttview-block-container" }));
            }

            div.append(blocksDiv);

//            if(opts.viewType == "Y/M/D")
//            {
//                blocksDiv.css("margin-top", "40px");
//            }
  
        }

        function addBlocks(div, data, cellWidth, start, opts) {
            var rows = jQuery("div.ganttview-blocks div.ganttview-block-container", div);
            var rowIdx = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    var series = data[i].series[j];
                    for (var k = 0; k < series.activities.length; k++) {
                        var activity = data[i].series[j].activities[k];
                        if (activity.start != "" && activity.end != "" && Date.parse(activity.end) >= start) {
                            var size = DateUtils.daysBetween(activity.start, activity.end) + 1;
                            var series_start = Date.parse(activity.start);
                            if (series_start >= start) {
                                var offset = DateUtils.daysBetween(start, series_start);
                            } else {
                                var offset = -(DateUtils.daysBetween(series_start, start));
                            }

                            
                            var decreseSizeBy = 2; 
                            var increaseOffsetBy = 0;

                            if(opts.viewType == "Y/M/D" )
                            {
                                decreseSizeBy = 9;
                                increaseOffsetBy = 3;
                            }
                            
                            var block = jQuery("<div>", {
                                "class": "tooltip ganttview-block",
                                "css": {
                                    "width": ((size * cellWidth) - decreseSizeBy) + "px",
                                    "margin-left": ((offset * cellWidth) + increaseOffsetBy) + "px"
                                }
                            });

                            if (activity.color)
                                block.css("background-color", activity.color);

                            addBlockData(block, data[i], series, activity);
                            
                            // User title formating is place in titleFormater function - look at comments in first of this file.
                            if (opts.titleFormater != null) {
                                activity.title = opts.titleFormater(activity, size);
                                block.append(jQuery("<div>", { "class": "ganttview-block-text" }).html(activity.title));
                            } 
                            else
                            {
                                block.append(jQuery("<div>", { "class": "ganttview-block-text" }).text(size));
                            }


                            jQuery(rows[rowIdx]).append(block);
                        }


                    } rowIdx = rowIdx + 1;
                }
            }
        }

        function addBlockData(block, data, series, activity) {
            // This allows custom attributes to be added to the series data objects
            // and makes them available to the 'data' argument of click, resize, and drag handlers
            var blockData = { Id: data.Id, name: data.name };
            jQuery.extend(blockData, series);
            jQuery.extend(blockData, activity);
            block.data("block-data", blockData);
        }

        function applyLastClass(div) {
            jQuery("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
        }

        return {
            render: render
        };
    };

    var Behavior = function(div, opts) {

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

            if (opts.behavior.hover) {
                bindHover(div, opts.behavior.onHover, opts.behavior.onLeave);
            }
        }

        function bindBlockClick(div, callback) {
            jQuery("div.ganttview-block", div).live("click", function() {
                if (callback) { callback(jQuery(this).data("block-data")); }
            });
        }

        function bindHover(div, callbackHover, callbackLeave) {
            jQuery("div.ganttview-block", div).live("mouseover mouseout", function(event) {
                if (event.type == "mouseover") {
                    if (callbackHover) { callbackHover(jQuery(this), jQuery(this).data("block-data")); }
                } else {
                    if (callbackLeave) { callbackLeave(jQuery(this), jQuery(this).data("block-data")); }
                }
            });
        }

        function bindBlockResize(div, cellWidth, startDate, callback) {
            jQuery("div.ganttview-block", div).resizable({
                    grid: cellWidth,
                    handles: "e,w",
                    stop: function() {
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
                    stop: function() {
                        var block = jQuery(this);
                        updateDataAndPosition(div, block, cellWidth, startDate);
                        if (callback) { callback(block.data("block-data")); }
                    }
                });
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
                //.css("position", "relative")
                .css("margin-left", offset + "px");
        }

        return {
            apply: apply
        };
    };

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
            var minStart = new Date(); 
            var maxEnd = new Date();
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    for (var k = 0; k < data[i].series[j].activities.length; k++) {
                        if (data[i].series[j].activities[k].start != "" && data[i].series[j].activities[k].end != "") {
                            var start = Date.parse(data[i].series[j].activities[k].start);
                            var end = Date.parse(data[i].series[j].activities[k].end);
                            if (i == 0 && j == 0 && k == 0) { minStart = start; maxEnd = end;}
                            if (minStart > start) { minStart = start; }
                            if (maxEnd < end) { maxEnd = end; }
                        }
                    }
                }
            }

            // Insure that the width of the chart is at least the slide width to avoid empty
            // whitespace to the right of the grid
            if (DateUtils.daysBetween(minStart, maxEnd) < minDays) {
                maxEnd = minStart.clone().addDays(minDays);
            }

            minStart = new Date(minStart.getFullYear() ,minStart.getMonth(), 1);
            
            return [minStart, maxEnd];
        }
    };

})(jQuery);