google.load("feeds", "1");
google.load("jquery", "1.4.2");
google.load("jqueryui", "1.8.13");

var dmFeeds=[]; // regular array (add an optional integer
dmFeeds[0]="http://feeds.feedburner.com/dinamalar/Front_page_news";       // argument to control array's size)
dmFeeds[1]="http://rss.dinamalar.com/?cat=ara1";
dmFeeds[2]="http://rss.dinamalar.com/sportsnews.asp";

function initialize() {
    var $tabs = $( "#tabs" ).tabs();
    var lastUsedFeedId = 0;
    
    $tabs.bind('tabsselect', function(event, ui) {
        // Objects available in the function context:
        //ui.tab     // anchor element of the selected (clicked) tab
        //ui.panel   // element, that contains the selected/clicked tab contents
        //ui.index   // zero-based index of the selected (clicked) tab
        //$(ui.panel).html("test");
        loadFeed(ui.index);
    });
    
    if (localStorage.lastUsedFeedId != 'undefined') {
        lastUsedFeedId = parseInt(localStorage.lastUsedFeedId,10);
    }
    
    if (lastUsedFeedId > 0) {
        $tabs.tabs('select',lastUsedFeedId);        
    }
    else {
        loadFeed(0);
    }
}

function loadFeed(feedId) {
    $("#feed").html("பதிவிறக்கம்...");
    localStorage.lastUsedFeedId = feedId;
    var feed = new google.feeds.Feed(dmFeeds[feedId]);
    feed.setNumEntries(10);
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

google.setOnLoadCallback(initialize);