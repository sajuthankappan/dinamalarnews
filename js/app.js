google.load("feeds", "1");
google.load("jquery", "1.4.2");
google.load("jqueryui", "1.8.13");

var dmFeeds=[]; // regular array (add an optional integer
dmFeeds[0]="http://feeds.feedburner.com/dinamalar/Front_page_news";       // argument to control array's size)
dmFeeds[1]="http://rss.dinamalar.com/?cat=ara1";
dmFeeds[2]="http://rss.dinamalar.com/sportsnews.asp";

function initialize() {
    var $tabs = $( "#tabs" ).tabs();
    var $maxitems = $("#maxitems").slider({ min:5, max: 20, value: 5});
    var lastUsedFeedId = 0;
    var maxItemsToShow = 5;
    
    loadSettings();
    
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
        // Objects available in the function context:
        //ui.tab     // anchor element of the selected (clicked) tab
        //ui.panel   // element, that contains the selected/clicked tab contents
        //ui.index   // zero-based index of the selected (clicked) tab
        //$(ui.panel).html("test");
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
        
        var feed = new google.feeds.Feed(dmFeeds[feedId]);
        
        feed.setNumEntries(maxItemsToShow);
        feed.load(function(result) {
            if (!result.error) {
                $("#feed").html("");
                for (var i = 0; i < result.feed.entries.length; i++) {
                    var entry = result.feed.entries[i];
                    //var div = document.createElement("div");
                    //div.appendChild(document.createTextNode(entry.title));
                    //alert(entry.content);
                    $("#feed").append($("<p><div class='newsTitle'><a href=" + entry.link + ">" + entry.title + "</a></div><div>" + entry.content + "</div></p>"));
                }
                $("iframe").remove();
            }
        });
    }
    
    function loadSettings() {
        if (localStorage.lastUsedFeedId != 'undefined') {
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