﻿//******************************************************************************************************
//  OpenSTE.js - Gbtc
//
//  Copyright © 2016, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may
//  not use this file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  10/28/2016 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************

//////////////////////////////////////////////////////////////////////////////////////////////
// Global

var globalcolors = ['#ff0000', '#FF9600', '#90ed7d', '#f7a35c', '#FF9600', '#ff0000'];

var postedchannelid = "";
var posteddate = "";
var postedmeterid = "";
var postedmeasurementtype = "";
var postedcharacteristic = "";
var postedphasename = "";
var postedmetername = "";
var postedlinename = "";

//////////////////////////////////////////////////////////////////////////////////////////////

function buildPage() {

    $.blockUI({ css: { border: '0px' } });

    $(document).ajaxStart(function () {
        $.blockUI({
            message: '<div class="wait_container"><img alt="" src="./images/ajax-loader.gif" /><br><div class="wait">Please Wait. Loading...</div></div>'
        });
    });

    $(document).ajaxStop(function () {
    });

    $(window).on('resize', function () {
        resizecontents();
    });

    //$("#MeasurementType").multiselect({ minWidth: 200, noneSelectedText: "Type", selectedList: 1, multiple: false });
    //$("#MeasurementCharacteristic").multiselect({ minWidth: 200, noneSelectedText: "Characteristic", selectedList: 1, multiple: false });
    //$("#Phase").multiselect({ minWidth: 200, noneSelectedText: "Phase", selectedList: 1, multiple: false });
    //$("#Period").multiselect({ minWidth: 70, noneSelectedText: "Period", selectedList: 1, multiple: false });

    //$("#MeasurementType")[0].change = function (event, ui) {
    //    selectMeasure(this);
    //};
    //$("#MeasurementCharacteristic")[0].change = function (event, ui) {
    //    selectMeasure(this);
    //};
    //$("#Phase")[0].change = function (event, ui) {
    //    selectMeasure(this);
    //};
    //$("#Period")[0].change = function (event, ui) {
    //    selectMeasure(this);
    //};
}

//////////////////////////////////////////////////////////////////////////////////////////////

function resizecontents() {
    var columnheight = $(window).height() - 110;
    resizeDocklet($("#DockWaveformTrending"), columnheight);
}

//////////////////////////////////////////////////////////////////////////////////////////////

function resizeDocklet(theparent, chartheight) {
    theparent.css("height", chartheight);
    var Child = $("#WaveformTrending");
    Child.css("height", chartheight);
}

//////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {

    postedchannelid = $("#postedchannelid")[0].innerHTML;
    posteddate = $("#posteddate")[0].innerHTML;
    postedmeterid = $("#postedmeterid")[0].innerHTML;
    postedmeasurementtype = $("#postedmeasurementtype")[0].innerHTML;
    postedcharacteristic = $("#postedcharacteristic")[0].innerHTML;
    postedphasename = $("#postedphasename")[0].innerHTML;
    postedmetername = $("#postedmetername")[0].innerHTML;
    postedlinename = $("#postedlinename")[0].innerHTML;

    buildPage();

    // Lets build a label for this chart
    var label = "";
    label += postedmetername + " - ";
    label += postedlinename + " - ";
    label += postedmeasurementtype + " - ";
    label += postedcharacteristic + " - ";
    label += postedphasename + " - ";
    label += posteddate;
    label += " for a Day";

    $("#chartTitle").text(label);
    $(window).one('hubConnected', function () {
        populateDivWithLineChartByChannelID("getTrendsforChannelIDDate", "WaveformTrending", postedchannelid, posteddate, label);
    });
    resizecontents();
});

//////////////////////////////////////////////////////////////////////////////////////////////

function populateDivWithLineChartByChannelID(thedatasource, thediv, thechannelid, thedate, label) {    
    dataHub.getTrendsForChannelIDDate(thechannelid, thedate).done(function (data) {
        function drawCap(ctx, x, y, radius) {
            ctx.beginPath();
            ctx.lineTo(x + radius, y);
            ctx.lineTo(x - radius, y);
            ctx.stroke();
        }

        if (data == null)
            return;

        var dataPoints = {
            show: true,
            radius: 2
        }

        var errorBars = {
            show: false,
            errorbars: "y",
            lineWidth: 0.5,
            radius: 0.5,
            yerr: { show: true, asymmetric: true, upperCap: drawCap, lowerCap: drawCap, shadowSize: 0, radius: 3 }
        }

        var graphData = [
            { color: "red", lines: dataPoints, data: [], label: 'Alarm Limit High', visible: true, type: 'lines' },
            { color: "orange", lines: dataPoints, data: [], label: 'Off Normal High', visible: true, type: 'lines' },
            { color: "", points: { show: true, radius: 0.5 }, data: [], visible: false, label: 'Max' },
            { color: "#90ed7d", points: dataPoints, data: [], label: 'Average', visible: true, type: 'points' },
            { color: "", points: { show: true, radius: 0.5 }, data: [], visible: false, label: 'Min' },
            { color: "orange", lines: dataPoints, data: [], label: 'Off Normal Low', visible: true, type: 'lines' },
            { color: "red", lines: dataPoints, data: [], label: 'Alarm Limit Low', visible: true, type: 'lines' },
            { color: "black", points: errorBars, data: [], label: "Range", visible: true, type: 'errorbar' }
        ];

        $.each(data.ChannelData, function (_, point) {
            var mid = (point.Maximum + point.Minimum) / 2;
            graphData[2].data.push([point.Time, point.Maximum]);
            graphData[3].data.push([point.Time, point.Average]);
            graphData[4].data.push([point.Time, point.Minimum]);
            graphData[7].data.push([point.Time, mid, mid - point.Minimum, point.Maximum - mid]);
        });

        $.each(data.AlarmLimits, function (_, limit) {
            if (limit.High !== null) {
                graphData[0].data.push([limit.TimeStart, limit.High]);
                graphData[0].data.push([limit.TimeEnd, limit.High]);
            }

            if (limit.Low !== null) {
                graphData[6].data.push([limit.TimeStart, limit.Low]);
                graphData[6].data.push([limit.TimeEnd, limit.Low]);
            }
        });

        $.each(data.OffNormalLimits, function (key, limit) {
            var nextKey = key + 1;
            var hasNextKey = nextKey < data.OffNormalLimits.length;

            if (limit.High !== null) {
                graphData[1].data.push([limit.TimeStart, limit.High]);
                graphData[1].data.push([limit.TimeEnd, limit.High]);
            } else if (hasNextKey && data.OffNormalLimits[nextKey].High !== null) {
                if (graphData[1].data.length > 0)
                    graphData[1].data.push(null);
            }

            if (limit.Low !== null) {
                graphData[5].data.push([limit.TimeStart, limit.Low]);
                graphData[5].data.push([limit.TimeEnd, limit.Low]);
            } else if (hasNextKey && data.OffNormalLimits[nextKey].Low !== null) {
                if (graphData[5].data.length > 0)
                    graphData[5].data.push(null);
            }
        });

        //Set mins and maxes
        var xMin = new Date(thedate + ' UTC').getTime();
        var xMax = xMin + (24 * 60 * 60 * 1000);

        //initiate plot
        var plot = $.plot($("#WaveformTrending"), graphData, {
            legend: {
                show: false
            },
            series: {
                lines: {
                    show: false
                }
            },
            xaxis: {
                mode: "time",
                zoomRange: [60000 * 15, xMax],
                panRange: [xMin, xMax],
            },
            yaxis: {
                zoomRange: false /*[0.5, yMax+1]*/,
                //panRange: [yMin-1,yMax+1],
            },
            zoom: {
                interactive: true
            },
            pan: {
                interactive: false
            },
            grid: {
                hoverable: true
            },
            selection: { mode: "x" }
        });

        $("<div id='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
        }).appendTo("body");

        $("#WaveformTrending").bind("plothover", function (event, pos, item) {
            if (!item) {
                $.each([graphData[0], graphData[6]], function (_, alarmSeries) {
                    if (alarmSeries.visible && alarmSeries.data.length > 0) {
                        var alarmLimit = alarmSeries.data[0];
                        var alarmLimitOffset = plot.p2c({ x: pos.x, y: alarmLimit[1] });
                        var plotOffset = plot.offset();
                        var alarmPageX = alarmLimitOffset.left + plotOffset.left;
                        var alarmPageY = alarmLimitOffset.top + plotOffset.top;

                        if (Math.abs(alarmPageY - pos.pageY) < 10) {
                            item = {
                                series: alarmSeries,
                                datapoint: [pos.x, alarmLimit[1]],
                                pageX: alarmPageX,
                                pageY: alarmPageY
                            };
                        }
                    }
                });
            }

            if (item) {
                var time = $.plot.formatDate($.plot.dateGenerator(item.datapoint[0], { timezone: "utc" }), "%l:%M:%S %P");
                var html = '<div>' + time + '</div>';
                html += '<div>' + item.series.label + ': <span style="font-weight:bold">' + (item.series.label !== 'Range' ? item.datapoint[1] : item.datapoint[1] - item.datapoint[2] + ' - ' + (item.datapoint[1] + item.datapoint[3])) + '</span></div>';
                $("#tooltip").html(html)
                    .css({ top: item.pageY + -50, left: item.pageX - 100, border: '1px solid ' + item.series.color })
                    .fadeIn(200);
            } else {
                $("#tooltip").hide();
            }

        });

        $("#WaveformTrending").bind("plotselected", function (event, ranges) {
            var xAxis = plot.getXAxes();

            $.each(xAxis, function (_, axis) {
                var opts = axis.options;
                opts.min = ranges.xaxis.from;
                opts.max = ranges.xaxis.to;
            });

            scaleYAxis(plot, ranges.xaxis.from, ranges.xaxis.to);
            plot.clearSelection();
        });

        $('#WaveformTrending').bind("plotzoom", function (event, stuff) {
            scaleYAxis(plot);
            plot.clearSelection();
        });

        initLegend(plot);
        scaleYAxis(plot);

        $.unblockUI();

    }).fail(function (msg) {
        alert(msg);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////

function initLegend(plot) {
    var graphData = plot.getData();
    var table = $('<table>');

    $("#legend").append(table);

    table.css({
        "width": "100%",
        "font-size": "smaller",
        "font-weight": "bold"
    });

    $.each(graphData, function (_, series) {
        if (series.visible !== false) {
            var row = $('<tr>');
            var checkbox = $('<input type="checkbox">');
            var borderDiv = $('<div>');
            var colorDiv = $('<div>');
            var labelSpan = $('<span>');
            var color;

            if (series.visible)
                color = series.color;
            else
                color = "#CCC";

            table.append(
                row.append(
                    $('<td class="legendCheckbox" title="Show/hide in tooltip">').append(
                        checkbox),
                    $('<td class="legendColorBox" title="Show/hide in chart">').append(
                        borderDiv.append(colorDiv)),
                    $('<td class="legendLabel">').append(
                        labelSpan.append(series.label))));

            checkbox.prop("checked", series.checked);

            borderDiv.css({
                "border": "1px solid #CCC",
                "padding": "1px"
            });

            colorDiv.css({
                "width": "4px",
                "height": "0",
                "border": "5px solid " + color,
                "overflow": "hidden"
            });

            labelSpan.prop("title", series.label);
            labelSpan.css("color", series.color);

            checkbox.click(function () {
                series.checked = !series.checked;

            });

            row.children().slice(1).click(function () {
                series.visible = !series.visible;

                //updatePlotData(graphData);
                //alignAxes();

                if (series.visible)
                    colorDiv.css("border", "5px solid " + series.color);
                else
                    colorDiv.css("border", "5px solid #CCC");

                if (series.type === 'lines')
                    series.lines.show = series.visible;
                else if (series.type === 'points')
                    series.points.show = series.visible;
                else if (series.type === 'errorbar') {
                    series.points.yerr.show = series.visible;
                    graphData[2].points.show = series.visible;
                    graphData[4].points.show = series.visible;
                }

                plot.setData(graphData);
                scaleYAxis(plot);
            });
        }
    });

    $(".legendCheckbox").hide();
}

function scaleYAxis(plot, xMin, xMax) {
    var data = plot.getData();
    var yMin = null, yMax = null;

    $.each(plot.getXAxes(), function (_, xAxis) {
        if (!xMin)
            xMin = xAxis.min;

        if (!xMax)
            xMax = xAxis.max;
    });

    $.each(data, function (i, d) {
        if (d.visible === true) {
            var isAlarmData = (i == 0) || (i == 6);

            $.each(d.data, function (j, e) {
                if (isAlarmData || (e[0] >= xMin && e[0] <= xMax)) {
                    var eMin = (d.label !== "Range") ? e[1] : e[1] - e[2];
                    var eMax = (d.label !== "Range") ? e[1] : e[1] + e[3];

                    if (yMin == null || yMin > eMin)
                        yMin = eMin;
                    if (yMax == null || yMax < eMax)
                        yMax = eMax;
                }
            });
        }
    });

    $.each(plot.getYAxes(), function (_, axis) {
        var opts = axis.options;
        var pad = (yMax - yMin) * 0.1;
        opts.min = yMin - pad;
        opts.max = yMax + pad;
    });

    plot.setupGrid();
    plot.draw();
}

//////////////////////////////////////////////////////////////////////////////////////////////


/// EOF