# Introduction

Solution is implemented as a single web page with dynamic content.
News (tweets) are fetched in background using AJAX calls every 2 minutes.
Fetched news are stored in cookies during 1 day to prevent exceeding Twitter API calls' rate limit in case of re-loadings page too often.

# Requirements

To get sources and run the project you will need Java SDK to be installed on your computer, as well as Git client and Maven build tool. You can try with those installed on your computer. Otherwise, I recommend to install versions listed below.

The following software were used during development: Java SDK 7u5, Maven 3.0, STS 3.0 (based on Eclipse 4.2 Juno), Gimp 2.8. Also were used the following libraries: jQuery 1.7.1, jQuery Mobile 1.1.1, jQuery Cookie Plugin v1.1.

Tested in browsers: IE 9, Google Chrome 21.0.xxx, Opera 12.02, FireFox 15.0.1 with FireBug 1.10.3 (used for debugging), Opera Mobile 12.00.xxx

# Run Howto

To get and run the server, execute the following commands from the command line (assuming you have all executables in your path). Its better to create a separate directory for that.

	git clone https://github.com/apetuhhov/testtask_icefire.git
	cd testtask_icefire
	mvn jetty:run
	
Now you can see the page using your favorite browser at [http://127.0.0.1:8080/test/](http://127.0.0.1:8080/test/)

You can also try the page from your mobile device if it has an access to your local network (you should change the IP from localhost to your computer's IP). 

You can use test Twitter account created specifically for that purpose. Name: TesttaskIcefire. Password: **************** ;)

# Known Issues

Twitter API v1 was used due to unknown problems with v1.1 API (Bad request 400 for all unauthorized requests)

Style is not applied correctly to dynamically created elements. Workaround made.
More info on the similar issue here [http://stackoverflow.com/questions/5249250/jqm-jquerymobile-dynamically-added-elements-not-displaying-correctly-and-css-is](http://stackoverflow.com/questions/5249250/jqm-jquerymobile-dynamically-added-elements-not-displaying-correctly-and-css-is) 