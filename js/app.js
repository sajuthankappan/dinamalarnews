google.load("feeds", "1");
google.load("jquery", "1.4.2");
google.load("jqueryui", "1.8.13");

var dmFeeds=[]; // regular array (add an optional integer
dmFeeds[0] = [];
dmFeeds[0][0]="முதல் பக்க செய்திகள்";
dmFeeds[0][1]="http://feeds.feedburner.com/dinamalar/Front_page_news";
dmFeeds[1] = [];
dmFeeds[1][0]="அரசியல் செய்திகள";
dmFeeds[1][1]="http://rss.dinamalar.com/?cat=ara1";
dmFeeds[2] = [];
dmFeeds[2][0]="பொது செய்தி";
dmFeeds[2][1]="http://rss.dinamalar.com/?cat=pot1";
dmFeeds[3] = [];
dmFeeds[3][0]="விளையாட்டு";
dmFeeds[3][1]="http://rss.dinamalar.com/sportsnews.asp";

function initialize() {
    var $maxitems = $("#maxitems").slider({ min:5, max: 20, value: 5});
    var lastUsedFeedId = 0;
    var maxItemsToShow = 5;
    
    loadSettings();
    loadTabs();
    var $tabs = $( "#tabs" ).tabs();
    
    $tabs.tabs('select',lastUsedFeedId);
    $("#maxitemstext").text("செய்தி எண்ணிக்கை: " + maxItemsToShow);
    $("#maxitems").slider( "option", "value", maxItemsToShow );
    refreshFeed();
    /*if (lastUsedFeedId > 0) {
        $tabs.tabs('select',lastUsedFeedId);        
    }
    else {
        loadFeed(0);
    }*/
    
    $tabs.bind('tabsselect', function(event, ui) {
        lastUsedFeedId = ui.index;
        saveSettings();
        refreshFeed();
    });
    
    $maxitems.bind( "slidechange", function(event, ui) {
        maxItemsToShow = $( "#maxitems" ).slider( "option", "value" );
        $("#maxitemstext").text("செய்தி எண்ணிக்கை: " + maxItemsToShow);
        saveSettings();
        refreshFeed();
    });
    
    function refreshFeed() {
        loadFeed(lastUsedFeedId);
    }
    
    function loadFeed(feedId) {
        $("#feed").html("பதிவிறக்கம்...");
        
        var feed = new google.feeds.Feed(dmFeeds[feedId][1]);
        
        feed.setNumEntries(maxItemsToShow);
        feed.load(function(result) {
            if (!result.error) {
                $("#feed").html("");
                $.each(result.feed.entries,
                    function( intIndex, entry ){
                        $("#feed").append($("<p><div class='newsTitle'><a href=" + entry.link + ">" + entry.title + "</a></div><div>" + entry.content + "</div></p>"));
                    }
                );
                $("iframe").remove();
            }
        });
    }
    
    function loadTabs() {
        var feedHtml = '<ul>';
        $.each(dmFeeds,
            function( intIndex, objValue ){
                feedHtml = feedHtml + '<li><a href="#feed">' + objValue[0] + '</a></li>';
            }
        );
        feedHtml = feedHtml + '</ul><div id="feed"></div>';
        $("#tabs").append(feedHtml);
    }
    
    function loadSettings() {
        if (localStorage.lastUsedFeedId !== undefined) {
            lastUsedFeedId = parseInt(localStorage.lastUsedFeedId,10);
            maxItemsToShow = localStorage.maxItemsToShow;
        }
        else {
            lastUsedFeedId = 0;
            maxItemsToShow = 5;
        }
    }
    
    function saveSettings() {
        localStorage.maxItemsToShow = maxItemsToShow;
        localStorage.lastUsedFeedId = lastUsedFeedId;
    }
}

google.setOnLoadCallback(initialize);