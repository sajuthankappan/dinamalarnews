var dmFeeds=[];
dmFeeds[0] = [];
dmFeeds[0][0]="முதல் பக்க செய்திகள்";
dmFeeds[0][1]="http://feeds.feedburner.com/dinamalar/Front_page_news";
dmFeeds[1] = [];
dmFeeds[1][0]="அரசியல் செய்திகள்";
dmFeeds[1][1]="http://rss.dinamalar.com/?cat=ara1";
dmFeeds[2] = [];
dmFeeds[2][0]="பொது செய்தி";
dmFeeds[2][1]="http://rss.dinamalar.com/?cat=pot1";
dmFeeds[3] = [];
dmFeeds[3][0]="விளையாட்டு";
dmFeeds[3][1]="http://rss.dinamalar.com/sportsnews.asp";
dmFeeds[4] = [];
dmFeeds[4][0]="சினிமா";
dmFeeds[4][1]="http://cinema.dinamalar.com/rss.php";


function initialize() {
    var $maxitemsslider = $("#maxitemsslider").slider({ min:5, max: 20, value: 10});
    var lastUsedFeedId = 0;
    var maxItemsToShow = 10;
    
    loadSettings();
    createTabs();
    var $tabs = $( "#tabs" ).tabs();
    loadFeedsFromCache();
    
    $tabs.tabs('select',lastUsedFeedId);
    $("#maxitemstext").text("செய்தி எண்ணிக்கை: " + maxItemsToShow);
    $("#maxitemsslider").slider( "option", "value", maxItemsToShow );
	
    if (window.navigator.onLine) {
		if (needsRefresh()) {
			loadAllFeeds();
		}
	}
	
	$("#refresh").show();
    
    $tabs.bind('tabsselect', function(event, ui) {
        lastUsedFeedId = ui.index;
        saveSettings();
    });
    
    $maxitemsslider.bind( "slidechange", function(event, ui) {
        maxItemsToShow = $( "#maxitemsslider" ).slider( "option", "value" );
        $("#maxitemstext").text("செய்தி எண்ணிக்கை: " + maxItemsToShow);
        saveSettings();
        refreshAllFeeds();
    });
    
    $("#refresh").click(function() {
		if (window.navigator.onLine) {
			refreshAllFeeds();
		}
		else {
			$( "#offlinedialog" ).dialog({
				height: 160,
				modal: true,
				buttons: {
					Ok: function() {
						$( this ).dialog( "close" );
					}
				}
			});
		}
    });
    
    function refreshAllFeeds () {
        //discardCachedFeeds();
        //clearAllFeeds();
        loadAllFeeds();
    }
    
    function clearAllFeeds () {
        var feedDiv;
        $.each(dmFeeds,
            function( intIndex, objValue ){
                feedDiv = "#feed" + intIndex;
                $(feedDiv).html("");
            }
        );
    }
    
    function loadAllFeeds() {
        $.each(dmFeeds,
            function( intIndex, entry ){
                loadFeed(intIndex);
            }
        );
    }
    
    function loadFeed(feedId) {
        var feedDiv = "#feed" + feedId;
        /*if ($(feedDiv).html() !== "") {
        }
        else {*/
			$("#refresh").hide();
            $("#loading").show();
            var feed = new google.feeds.Feed(dmFeeds[feedId][1]);
            var feeditemclass = "feeditem";
            
            feed.setNumEntries(maxItemsToShow);
            feed.load(function(result) {
                if (!result.error) {
                    $("#loading").hide();
                    $("#refresh").show();
                    $(feedDiv).html("");
                    if (feedId == 4) {
                        feeditemclass = "feeditembig";
                    }
                    else {
                        feeditemclass = "feeditem";
                    }
                    $.each(result.feed.entries,
                        function( intIndex, entry ){
                            $(feedDiv).append($("<div class='" + feeditemclass + "'><p><div class='newsTitle'><a href=" + entry.link + ">" + entry.title + "</a></div><div>" + entry.content + "</div></p></div>"));
                        }
                    );
                    $("iframe").remove(); //to remove the extra iframes added by google feed api 
                    cacheFeeds();
                }
                else {
                    alert('error loading feed');
                }
            });
        //}
    }
    
    function createTabs() {
        var feedHtml = '<ul>';
        $.each(dmFeeds,
            function( intIndex, objValue ){
                feedHtml = feedHtml + '<li><a href="#feed' + intIndex + '">' + objValue[0] + '</a></li>';
            }
        );
        feedHtml = feedHtml + '</ul>';
        feedHtml = feedHtml + '';
        $.each(dmFeeds,
            function( intIndex, objValue ){
                feedHtml = feedHtml + '<div id="feed' + intIndex +'"class="feed"></div>';
            }
        );
        
        $("#tabs").append(feedHtml);
    }
    
    function loadSettings() {
        if (localStorage.lastUsedFeedId !== undefined && localStorage.lastUsedFeedId !== null) {
            lastUsedFeedId = parseInt(localStorage.lastUsedFeedId,10);
            maxItemsToShow = localStorage.maxItemsToShow;
        }
        else {
            lastUsedFeedId = 0;
            maxItemsToShow = 10;
        }
    }
    
    function saveSettings() {
        localStorage.maxItemsToShow = maxItemsToShow;
        localStorage.lastUsedFeedId = lastUsedFeedId;
    }
    
    function discardCachedFeeds() {
        localStorage.lastSavedTime = 0;
        localStorage.feedContent0 = "";
        localStorage.feedContent1 = "";
        localStorage.feedContent2 = "";
        localStorage.feedContent3 = "";
        localStorage.feedContent4 = "";
    }
    
    function needsRefresh() {
		var dt = new Date();
        var currTime = dt.getTime();
        var timeDiff = currTime - localStorage.lastSavedTime;
        if (localStorage.lastSavedTime > 0 & timeDiff > 28800000) {
            return true;
        }
        else {
            return false;
        }
	}
    
    function loadFeedsFromCache() {
        /*var dt = new Date();
        var currTime = dt.getTime();
        var timeDiff = currTime - localStorage.lastSavedTime;
        if (localStorage.lastSavedTime > 0 & timeDiff > 28800000) {
            discardCachedFeeds();
        }
        else {*/
            $("#feed0").html(localStorage.feedContent0);
            $("#feed1").html(localStorage.feedContent1);
            $("#feed2").html(localStorage.feedContent2);
            $("#feed3").html(localStorage.feedContent3);
            $("#feed4").html(localStorage.feedContent4);
        //}
    }
    
    function cacheFeeds() {
        if (localStorage.lastSavedTime !== 0) {
            var dt = new Date();
            localStorage.lastSavedTime = dt.getTime();
        }
        localStorage.feedContent0 = $("#feed0").html();
        localStorage.feedContent1 = $("#feed1").html();
        localStorage.feedContent2 = $("#feed2").html();
        localStorage.feedContent3 = $("#feed3").html();
        localStorage.feedContent4 = $("#feed4").html();
    }
}

google.load("feeds", "1");
google.load("jquery", "1.4.2");
google.load("jqueryui", "1.8.13");

google.setOnLoadCallback(initialize);

