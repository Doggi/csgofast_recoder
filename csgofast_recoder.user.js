// ==UserScript==
// @name        csgofast_recoder
// @namespace   de.grzanna-online.ogame
// @include     https://csgofast.com/
// @version     2
// @updateURL   https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recoder.user.js
// @downloadURL https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recoder.user.js
// @grant       none
// ==/UserScript==
var storage = localStorage.getItem("csgofast_games");
var games = JSON.parse(storage);
if( games == null ){
    games = {};
}

console.log(games);

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
        drawTable(games);
        localStorage.setItem("csgofast_games", JSON.stringify(games));
    });
});

// Notify me of everything!
var observerConfig = {
    attributes: true,
    childList: true,
    characterData: true
};

function drawTable(games){
    $("div#csgofast_recorder_overview div table tbody tr").remove();

    var keys = Object.keys(games);

    for ( var i = keys.length - 1 ; i >= Math.max(0, keys.length-20) ; i--){
        game = games[keys[i]];
        $("div#csgofast_recorder_overview div table tbody").append(
            "<tr>" +
            "<td style='background-color: #182328;'>" + game.gameNum + "</td>" +
            "<td>" + game.randNum + "</td>" +
            "<td style='background-color: #182328;'>" + game.winningPlayer + "</td>" +
            "<td>" + getFormatedDate(new Date(game.date)) + "</td>" +
            "</tr>"
        );
    }
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

$(document).ready(function () {
    $("#randNum").waitUntilExists(function () {
        console.log("starting...");
        observer.observe(document.getElementById("randNum"), observerConfig);
    });
    //console.log(new Date().getTime());
    $("div.wrapper").append(
        "<div id='csgofast_recorder_overview' class='container' style='position: absolute; top: 0px; left: 399px; z-index: 1000; padding: 29px 29px 22px; background-color: #223138; font-size: 9px;' >" +
            "<div>" +
            "<table style='color: white'>" +
                "<thead><tr>" +
                    "<th style='background-color: #182328;'>gameNum</th>" +
                    "<th>randNum</th>" +
                    "<th style='background-color: #182328;'>winningPlayer</th><th>Date</th>" +
                "</tr></thead><tbody></tbody>" +
            "</table>" +
                "<div id='csgofast_recoder_overview_toggler' style='text-align: right;'>" +
                    "<span id='csgofast_recorder_overview_up'><a data-direction='up' href='' style='text-decoration: none;'>&uarr;</a></span>" +
                    "<span id='csgofast_recorder_overview_down'><a style='display: none;' data-direction='up' href='' style='text-decoration: none;'>&uarr;</a></span>" +
                "</div>" +
            "</div>" +
        "</div>"
    );

    $("csgofast_recoder_overview_toggler span a").click(function(){
        if( $(this).data("direction") == "up" ){
            $("div#csgofast_recorder_overview div table").show(false);
        } else {
            $("div#csgofast_recorder_overview div table").show();
        }
        return false;
    });
    drawTable(games);
});


function read() {
    var result = {
        gameNum: Number($(".game-top .game-header .game-title .game-num").html()),
        roundHash: $("#roundHash").html(),
        randNum: Number($("#randNum").html()),
        winningTicket: $("span.winning-ticket").html().replace("#", ""),
        winningPlayer: $("span.winning-player").html(),
        date: new Date().getTime(),
    };
    return result;
}

function send(result, callback) {
    $.ajax({
        url: "http://recorder.csgofast.com/rest/",
        data: result,
        crossDomain: true,
        dataType: 'json',
        method: "POST",
        success: function (data, status, jqxhr) {
            console.log(data, status, jqxhr);
            callback();
        },
        error: function(jqxhr, textStatus, error){
            console.error(data, status, jqxhr);
        }
    });
}