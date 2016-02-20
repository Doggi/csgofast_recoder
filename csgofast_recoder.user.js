// ==UserScript==
// @name        csgofast_recoder
// @namespace   de.grzanna-online.ogame
// @include     https://csgofast.com/
// @version     8
// @updateURL   https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recoder.user.js
// @downloadURL https://github.com/Doggi/csgofast_recoder/raw/master/csgofast_recoder.user.js
//
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @require     https://raw.githubusercontent.com/nnnick/Chart.js/master/Chart.min.js
//
// @resource    layout https://raw.githubusercontent.com/Doggi/csgofast_recoder/master/csgofast_recorder_overlay.html
// @resource    css https://raw.githubusercontent.com/Doggi/csgofast_recoder/master/csgofast_recorder.css
// @resource    jqueryUICss https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @resource    ui-bg_flat_75_ffffff_40x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_flat_75_ffffff_40x100.png
// @resource    ui-bg_highlight-soft_75_cccccc_1x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_highlight-soft_75_cccccc_1x100.png
// @resource    ui-bg_glass_75_e6e6e6_1x400.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_glass_75_e6e6e6_1x400.png
// @resource    ui-bg_glass_75_dadada_1x400.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_glass_75_dadada_1x400.png
// @resource    ui-bg_glass_65_ffffff_1x400.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_glass_65_ffffff_1x400.png
// @resource    ui-bg_glass_55_fbf9ee_1x400.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_glass_55_fbf9ee_1x400.png
// @resource    ui-bg_glass_95_fef1ec_1x400.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png
// @resource    ui-icons_222222_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-icons_222222_256x240.png
// @resource    ui-icons_888888_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-icons_888888_256x240.png
// @resource    ui-icons_454545_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-icons_454545_256x240.png
// @resource    ui-icons_2e83ff_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-icons_2e83ff_256x240.png
// @resource    ui-icons_cd0a0a_256x240.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-icons_cd0a0a_256x240.png
// @resource    ui-bg_flat_0_aaaaaa_40x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_flat_0_aaaaaa_40x100.png
// @resource    ui-bg_flat_0_aaaaaa_40x100.png https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/images/ui-bg_flat_0_aaaaaa_40x100.png
//
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// ==/UserScript==
var countShowGames = 20;
var storage = localStorage.getItem("csgofast_games");
var overview_show = Boolean(localStorage.getItem("csgofast_overview_show")) || true;
var games = JSON.parse(storage);
if( games == null ){
    games = {};
}
$(document).ready(function(){

    var resources = {
        'ui-bg_diagonals-thick_18_b81900_40x40.png': GM_getResourceURL('ui-bg_diagonals-thick_18_b81900_40x40.png'),
        'ui-bg_glass_100_f6f6f6_1x400.png': GM_getResourceURL('ui-bg_glass_100_f6f6f6_1x400.png'),
        'ui-bg_diagonals-thick_20_666666_40x40.png': GM_getResourceURL('ui-bg_diagonals-thick_20_666666_40x40.png'),
        'ui-bg_glass_65_ffffff_1x400.png': GM_getResourceURL('ui-bg_glass_65_ffffff_1x400.png'),
        'ui-bg_gloss-wave_35_f6a828_500x100.png': GM_getResourceURL('ui-bg_gloss-wave_35_f6a828_500x100.png'),
        'ui-icons_222222_256x240.png': GM_getResourceURL('ui-icons_222222_256x240.png'),
        'ui-bg_flat_10_000000_40x100.png': GM_getResourceURL('ui-bg_flat_10_000000_40x100.png'),
        'ui-icons_ef8c08_256x240.png': GM_getResourceURL('ui-icons_ef8c08_256x240.png'),
        'ui-icons_ffd27a_256x240.png': GM_getResourceURL('ui-icons_ffd27a_256x240.png'),
        'ui-bg_glass_100_fdf5ce_1x400.png': GM_getResourceURL('ui-bg_glass_100_fdf5ce_1x400.png'),
        'ui-icons_228ef1_256x240.png': GM_getResourceURL('ui-icons_228ef1_256x240.png'),
        'ui-icons_ffffff_256x240.png': GM_getResourceURL('ui-icons_ffffff_256x240.png'),
        'ui-bg_highlight-soft_75_ffe45c_1x100.png': GM_getResourceURL('ui-bg_highlight-soft_75_ffe45c_1x100.png'),
        'ui-bg_highlight-soft_100_eeeeee_1x100.png': GM_getResourceURL('ui-bg_highlight-soft_100_eeeeee_1x100.png')
    };

    console.log(resources);

    var jqueryUICss = GM_getResourceText("jqueryUICss");

    $.each(resources, function(resourceName, resourceUrl) {
        jqueryUICss = jqueryUICss.replace( 'images/' + resourceName, resourceUrl);
    });

    GM_addStyle( GM_getResourceText("css") );
    GM_addStyle( jqueryUICss );
    $("div.wrapper").append( GM_getResourceText("layout") );

    console.log(Boolean(localStorage.getItem("csgofast_overview_show")));
    if( !overview_show ){
        toggleOverview();
    }

});


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

    getLastGamesKeys(countShowGames).reverse().forEach(function(element){
        game = games[element];
        $("div#csgofast_recorder_overview div table tbody").append(
            "<tr>" +
            "<td class='dark'>" + game.gameNum + "</td>" +
            "<td class='light'>" + game.randNum + "</td>" +
            "<td class='dark'>" + game.winningPlayer + "</td>" +
            "<td class='light'>" + getFormatedDate(new Date(game.date)) + "</td>" +
            "</tr>"
        );
    });
}

function drawDiagram(games){
    var label = [];
    var data = [];

    getLastGamesKeys(countShowGames).reverse().forEach(function(element){
        data.push( games[element].randNum );
        label.push( games[element].gameNum );
    });

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
        responsive: false,/*
        scaleOverride: true,
        scaleSteps : 0.1,
        scaleStepWidth: 1.0,
        scaleStepValue: 0,*/
        scaleBeginAtZero: true
    });
}

function getLastGamesKeys(count){
    var keys = Object.keys(games);
    if( keys.length > count ){
        keys = keys.slice(keys.length - count);
    }
    return keys;
}

$(document).ready(function () {
    $("#randNum").waitUntilExists(function () {
        console.log("starting...");
        observer.observe(document.getElementById("randNum"), observerConfig);
    });

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

    $("a#csgofast_recorder_overview_up, a#csgofast_recorder_overview_down").click(function(){
        toggleOverview();
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

function toggleOverview(){
    $("div#csgofast_recorder_overview div#close, a#csgofast_recorder_overview_up, a#csgofast_recorder_overview_down").toggle();
    overview_show = $("div#csgofast_recorder_overview div#close").is(":visible");
    localStorage.setItem("csgofast_overview_show", overview_show);
}

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