// ==UserScript==
// @name        csgofast_recoder
// @namespace   de.grzanna-online.ogame
// @include     https://csgofast.com/
// @version     1.0.1
// @updateURL   https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recoder.user.js
// @downloadURL https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recoder.user.js
//
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @require     https://raw.githubusercontent.com/nnnick/Chart.js/master/Chart.min.js
//
// @resource    csgofast_recorder_layout layout https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recorder_overview.html
// @resource    csgofast_recorder_css https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recorder.css
//
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==

// loading stored games
var storage = localStorage.getItem("csgofast_games");
var games = JSON.parse(storage);
if( games == null ){
    games = {};
}

//GM_addStyle(GM_getResourceText("csgofast_recorder_css"));

// loading

function getDiagrammData(date){
    var today=new Date(date);
    today.setHours(0); today.setMinutes(0); today.setSeconds(0); today.setMilliseconds(0);
    var tomorrow = new Date(today);
    tomorrow.setHours(24);

    var keys = Object.keys(games);
    var label = [];
    var data = [];

    for ( var i = keys.length - 1 ; i >= 0 ; i--){
        var d = new Date(games[keys[i]].date);
        if(d >= today && d < tomorrow ) {
            label.push( getFormatedDate(d) );
            data.push( games[keys[i]].randNum );
        }
    }
    return {label : label, data: data};
}

function loadGames(){
    GM_xmlhttpRequest({
        method: "GET",
        headers: {"Accept": "application/json"},
        url: "http://csgofast.grzanna-online.de/games",
        onload: function(response){
            console.log(response.responseText)
            //games = JSON.parse(response.responseText);
        },
        onerror: function(response){
            console.log(response);
        }
    });
}

function sendGame(game){
    var g = {
        gameNum: game.gameNum,
        roundHash: game.roundHash,
        randNum: game.randNum,
        winningTicket: game.winningTicket,
        winningPlayer: game.winningPlayer,
        date: getFormatedDateRest(new Date(game.date)),
        user: game.user
    };

    GM_xmlhttpRequest({
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        data: JSON.stringify(g),
        url: "http://csgofast.grzanna-online.de/games",
        onload: function(response){
            console.log(response);
        },
        onerror: function(response){
            response = JSON.parse(response);
            console.log(response.name);
        }
    });
}

/**
 * @function
 * @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
 * @param {function} handler A function to execute at the time when the element is inserted
 * @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
 * @example $(selector).waitUntilExists(function);
 */
$.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) {
    var found = 'found';
    var $this = $(this.selector);
    var $elements = $this.not(function () {
        return $(this).data(found);
    }).each(handler).data(found, true);

    if (!isChild) {
        (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
            window.setInterval(function () {
                $this.waitUntilExists(handler, shouldRunHandlerOnce, true);
            }, 500);
    }
    else if (shouldRunHandlerOnce && $elements.length) {
        window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
    }

    return $this;
}

var observer = new MutationObserver(function (mutations) {
    // For the sake of...observation...let's output the mutation to console to see how this all works
    mutations.forEach(function (mutation) {
        console.log(mutation.type);
        var result = read();
        console.log(result);
        games[String(result.gameNum)] = result;
        sendGame(result);
        drawTable(games);
        drawDiagram(games);
        localStorage.setItem("csgofast_games", JSON.stringify(games));
    });
});

// Notify me of everything!
var observerConfig = {
    attributes: true,
    childList: true,
    characterData: true
};

function getFormatedDateRest(d){
    var string = "";
    string += d.getFullYear(); string+= "-";
    string += ( d.getMonth() < 10 ) ? "0"+ d.getMonth() : d.getMonth(); string+= "-";
    string += ( d.getDate() < 10 ) ? "0"+ d.getDate() : d.getDate(); string+= " ";
    string += ( d.getHours() < 10 ) ? "0"+ d.getHours() : d.getHours(); string+= ":";
    string += ( d.getMinutes() < 10 ) ? "0"+ d.getMinutes() : d.getMinutes(); string+= ":";
    string += ( d.getSeconds() < 10 ) ? "0"+ d.getSeconds() : d.getSeconds();
    return string;
}

function getFormatedDate(d){
    var string = "";
    string += ( d.getDate() < 10 ) ? "0"+ d.getDate() : d.getDate(); string+= ".";
    string += ( d.getMonth() < 10 ) ? "0"+ d.getMonth() : d.getMonth(); string+= ".";
    string += d.getFullYear(); string+= " ";
    string += ( d.getHours() < 10 ) ? "0"+ d.getHours() : d.getHours(); string+= ":";
    string += ( d.getMinutes() < 10 ) ? "0"+ d.getMinutes() : d.getMinutes(); string+= ":";
    string += ( d.getSeconds() < 10 ) ? "0"+ d.getSeconds() : d.getSeconds();
    return string;
}

function drawTable(games){
    $("div#csgofast_recorder_overview div table tbody tr").remove();

    var keys = Object.keys(games);

    for ( var i = keys.length - 1 ; i >= Math.max(0, keys.length-20) ; i--){
        game = games[keys[i]];
        $("div#csgofast_recorder_overview div table tbody").append(
            "<tr>" +
            "<td style='background-color: #182328;'>" + game.gameNum + "</td>" +
            "<td style='background-color: #223138; '>" + game.randNum + "</td>" +
            "<td style='background-color: #182328;'>" + game.winningPlayer + "</td>" +
            "<td style='background-color: #223138; '>" + getFormatedDate(new Date(game.date)) + "</td>" +
            "</tr>"
        );
    }
}

function drawDiagram(games){
    var keys = Object.keys(games);
    var label = [];
    var data = [];

    for ( var i = keys.length - 1 ; i >= Math.max(0, keys.length-20) ; i--){
        data.push( games[keys[i]].randNum );
        label.push( games[keys[i]].gameNum );
    }

    var ctx = document.getElementById("csgofast_recorder_overview_diagram").getContext("2d");
    window.myLine = new Chart(ctx).Line({
        labels : label.reverse(),
        datasets : [
            {
                label: "My Second dataset",
                fillColor : "rgba(0,0,0,0.2)",
                strokeColor : "rgba(0,0,0,1)",
                pointColor : "rgba(0,0,0,0.2)",
                pointStrokeColor : "#000",
                pointHighlightFill : "#000",
                pointHighlightStroke : "rgba(0,0,0,1)",
                data : data.reverse()
            }
        ]
    }, {
        responsive: false
    });
}

$(document).ready(function () {
    $("#randNum").waitUntilExists(function () {
        console.log("starting...");
        observer.observe(document.getElementById("randNum"), observerConfig);
    });
    //console.log(new Date().getTime());
    $("div.wrapper").append(
        "<div id='csgofast_recorder_overview' class='container ui-corner-bottom' style='position: absolute; top: 0px; left: 399px; z-index: 1000; padding: 5px; background-color: #2CB8D6; font-size: 11px;' >" +
        "<div style='text-align: center'>CSGO FAST RECORDER</div>" +
        "<div>" +
        "<div id='close'>" +
        "<table class='table table-bordered' style='color: white; width: 600px; float: left;'>" +
        "<thead><tr>" +
        "<th style='background-color: #182328; width: 60px;'>gameNum</th>" +
        "<th style='background-color: #223138; width: 120px;'>randNum</th>" +
        "<th style='background-color: #182328; width: 300px;'>winningPlayer</th>" +
        "<th style='background-color: #223138; width: 150px;'>Date</th>" +
        "</tr></thead><tbody></tbody>" +
        "</table>" +
        "<canvas id='csgofast_recorder_overview_diagram' height='325' width='556' style='float: left;'></canvas>" +
        "<div id='csgofast_recorder_overview_import_export' style='display: none;'>" +
        "<textarea id='csgofast_recorder_imexport' style='font-size: 8px; width: 1156px; padding: 0;'></textarea>" +
        "<input id='csgofast_recorder_overview_import' type='button' value='import' /> <input id='csgofast_recorder_overview_export' type='button' value='export'/>" +
        "</div>" +
        "<div style='clear: both;'></div>" +
        "</div>" +
        "<div id='csgofast_recoder_overview_toggler' data-direction='up' style='text-align: right; color: black;'>" +
        "<a id='csgofast_recorder_overview_up' class='ui-state-default ui-corner-all ui-state-hover' href='#' style='text-decoration: none; color: white; background-color: #182328;'>&uarr;</a>" +
        "<a id='csgofast_recorder_overview_down' class='ui-state-default ui-corner-all ui-state-hover' href='#' style='display: none;text-decoration: none;color: white; background-color: #182328;'>&darr;</a>" +
        "</div>" +
        "</div>" +
        "</div>"
    );

    $("input#csgofast_recorder_overview_import").click(function(){
        var json = $("textarea#csgofast_recorder_imexport").val();
        var data = JSON.parse(json);

        for(d in data){
            console.log(d);
        }
    });

    $("a#csgofast_recorder_import_export").click(function(){
        $("div#csgofast_recorder_overview_import_export").toggle();
    });

    $("div#csgofast_recoder_overview_toggler a#csgofast_recorder_overview_up, div#csgofast_recoder_overview_toggler a#csgofast_recorder_overview_down").click(function(){
        if( $("#csgofast_recoder_overview_toggler").data("direction") == "up" ){
            $("#csgofast_recoder_overview_toggler").data("direction", "down");
            $("div#csgofast_recorder_overview div#close, #csgofast_recorder_overview_up").hide();
            $("#csgofast_recorder_overview_down").show();
        } else {
            $("#csgofast_recoder_overview_toggler").data("direction", "up");
            $("div#csgofast_recorder_overview div#close, #csgofast_recorder_overview_up").show();
            $("#csgofast_recorder_overview_down").hide();
        }
        return false;
    });

    $("input#csgofast_recorder_overview_export").click(function(){
        $("textarea#csgofast_recorder_imexport").val( JSON.stringify(games) );
    });

    $("a#csgofast_recorder_import_export").click(function(){
        $("div#csgofast_recorder_overview_import_export").toggle();
    });

    drawTable(games);
    drawDiagram(games);
});

function read() {
    var result = {
        gameNum: Number($(".game-top .game-header .game-title .game-num").html()),
        roundHash: $("#roundHash").html(),
        randNum: Number($("#randNum").html()),
        winningTicket: $("span.winning-ticket").html().replace("#", ""),
        winningPlayer: $("span.winning-player").html(),
        date: new Date().getTime(),
        user: $(".user-menu-name").html() || "no login"
    };
    return result;
}