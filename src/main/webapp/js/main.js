var DEFAULT_WELCOME_MESSAGE = 'Welcom to the MyCompany\'s page!';
var NO_NEWS_MESSAGE = 'There currently no news yet.';
var CACHE_COOKIE = 'if_news_cache';
var CACHE_EXPIRES_AFTER_DAYS = 1;
var NEWS_RELOAD_TIMEOUT = 2 * 60 * 1000; // 2 minutes
var NEWS_LIMIT = 10;
var EMPTY_CACHE = {
	News : [],
	Dates : []
};

function loadNews() {
	console.info('loading news...');
	$
			.getJSON(
					'https://api.twitter.com/1/statuses/user_timeline.json?'
							+ 'screen_name=TesttaskIcefire&'
							+ 'contributor_details=false&exclude_replies=true&include_entities=true&include_rts=false&trim_user=true&callback=?',
					function(data) {
						// get existing cached data
						var data_from_cache = getCachedData() || EMPTY_CACHE;
						// prepare new data for cache
						// also check if we need to renew news feed
						var data_to_display = {};
						var news_to_display = [];
						var news_dates = [];
						var newMsgDetected = false;
						var wMsgFound = false;
						var msgCount = 0;
						for ( var i = 0; i < data.length; i++) {
							// find first welcome message
							if (!wMsgFound
									&& data[i].entities.hashtags.length > 0) {
								for ( var j = 0; j < data[i].entities.hashtags.length; j++) {
									if (data[i].entities.hashtags[j].text == 'WelcomeMessage') {
										data_to_display.WelcomeMessage = data[i].text
												.replace(/#WelcomeMessage/gm,
														'');
										wMsgFound = true;
										break;
									}
								}
								if (wMsgFound) {
									continue;
								}
							}
							// if limit exceeded, exit
							if (msgCount >= NEWS_LIMIT) {
								if (wMsgFound) {
									break;
								}
								continue;
							}
							var text = data[i].text;
							news_to_display.push(text);
							news_dates.push(data[i].created_at);
							if (!newMsgDetected
									&& -1 == data_from_cache.News.indexOf(text)) {
								newMsgDetected = true;
							}
							++msgCount;
						}
						data_to_display.News = news_to_display;
						data_to_display.Dates = news_dates;
						console.info('data_to_display='
								+ JSON.stringify(data_to_display));
						// expires 10 days after now
						$.cookie(CACHE_COOKIE, JSON.stringify(data_to_display),
								{
									path : '/',
									expires : CACHE_EXPIRES_AFTER_DAYS
								});
						// display data
						if (newMsgDetected
								|| data_from_cache.News.lenght != data_to_display.News.lengt
								|| data_from_cache.WelcomeMessage != data_to_display.WelcomeMessage) {
							displayNews(data_to_display);
						}
					}).error(function(jqXHR, textStatus, errorThrown) {
				console.error(errorThrown);
			}).complete(function() {
				console.info('rescheduling');
				setTimeout(loadNews, NEWS_RELOAD_TIMEOUT);
			});
}

function getCachedData() {
	var data_from_cache = $.cookie(CACHE_COOKIE);
	console.info('data_from_cache=' + data_from_cache);
	return JSON.parse(data_from_cache);
}

function displayNews(data_to_display) {
	console.info('display news');
	var welcome = $('#welcome p');
	welcome.html('');
	welcome
			.append(data_to_display.WelcomeMessage ? data_to_display.WelcomeMessage
					: DEFAULT_WELCOME_MESSAGE);
	var news = $('#news ul');
	// clear prev items except the first (list title)
	news.find('li:not(:first)').remove();
	if (data_to_display.News.length == 0) {
		news
				.append('<li class="ui-li ui-li-static ui-body-c ui-corner-bottom">'
						+ '<p class="ui-li-desc ui-li-text">'
						+ NO_NEWS_MESSAGE
						+ '</p></li>');
		return;
	}
	// add items
	for ( var i = 0; i < data_to_display.News.length; i++) {
		// replace any possible urls to links
		// TODO take media_url from entities and display pic
		// in overlay
		var text = data_to_display.News[i].replace(/(http[s]?:\/\/.*)\b/gm,
				'<a href="$1" target="_blank">' + '$1' + '</a>');
		// add news to list
		var d = new Date(data_to_display.Dates[i]);
		news.append('<li class="ui-li ui-li-static ui-body-c'
				+ (i == data_to_display.News.length - 1 ? ' ui-corner-bottom'
						: ' ')
				+ '"><p class="ui-li-aside ui-li-desc ui-li-date"><small>'
				+ d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
				+ '</small></p><p class="ui-li-desc ui-li-text">' + text
				+ '</p></li>');
	}
}

$(document).ready(function() {
	var data_from_cache = getCachedData();
	if (data_from_cache) {
		displayNews(data_from_cache);
		setTimeout(loadNews, NEWS_RELOAD_TIMEOUT);
	} else {
		loadNews();
	}
});
