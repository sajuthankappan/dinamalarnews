google.load("feeds", "1");
google.load("jquery", "1.4.2");

function initialize() {
    var feed = new google.feeds.Feed("http://feeds.feedburner.com/dinamalar/Front_page_news");
    feed.setNumEntries(10);
    feed.load(function(result) {
        if (!result.error) {
            for (var i = 0; i < result.feed.entries.length; i++) {
                var entry = result.feed.entries[i];
                var div = document.createElement("div");
                div.appendChild(document.createTextNode(entry.title));
                $("#feed").append($("<div><a href=" + entry.link + ">" + entry.title + "</a>" + entry.content + "</div>"));
            }
            $("iframe").remove();
        }
    });
}

google.setOnLoadCallback(initialize);