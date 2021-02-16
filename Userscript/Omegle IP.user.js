// ==UserScript==
// @name         Omegle IP
// @name:de      Omegle IP
// @namespace    https://omegleip.kaaaxcreators.de
// @version      1.1
// @description  You see the IP in the chat window
// @description:de  Du siehst die IP im Chat
// @author       Bernd Storath
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @grant        none
// @license      GPL-3.0-only; https://raw.githubusercontent.com/kaaaxcreators/omegleip/master/LICENSE
// @run-at       document-end
// ==/UserScript==

	// Ackee Analytics
function setAttributes(elements, attributes) {
	Object.keys(attributes).forEach(function(name) {
		elements.setAttribute(name, attributes[name]);
	})
}

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ackee.server.kaaaxcreators.de/tracker.js';
	setAttributes(ga, {
		"data-ackee-server": "https://ackee.server.kaaaxcreators.de",
		"data-ackee-domain-id": "ffb2160c-f29d-4e49-bfc7-dc5dd1120426"
	})
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
tracker = "https://whatismyipaddress.com/ip/"; // sets whats the link you get redirected to when pressing "More Information"
api_list = ["78aa4e8e374d134f0a29b3fb2c057e7d0a179517bd52cf868a5ceb51","8b1d695c1a9a68a426b1c6afb0925e41f5244ed93b2cdfc8bf448f26","9395e94ad6dceab9bd0a7e4ffc48340305cede433dead3e66d8f015e"]
api_key = api_list[Math.floor(Math.random() * api_list.length)];
ackeeAnalytics();
window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection // connects to the rtc client
window.RTCPeerConnection = function(...args) {
	const pc = new window.oRTCPeerConnection(...args)
	pc.oaddIceCandidate = pc.addIceCandidate
	pc.addIceCandidate = function(iceCandidate, ...rest) {
		const fields = iceCandidate.candidate.split(' ')
		if (fields[7] === 'srflx') {
			try {
				var list = document.getElementsByClassName("logitem")[0]; // finds the first log text
				var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
				var api = 'https://ipapi.co/' + fields[4] + "/json/";
				trackerip = tracker + fields[4];

				xmlhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) { // if succeeds
						var myArr = JSON.parse(this.responseText); // gets the reponse as json objects
						ip = myArr.ip; city = myArr.city; region = myArr.region; country =  myArr.country_name; isp = myArr.org;
						if (trollChecked) { // checks if the troll button checkbox is checked in the options
							list.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
						}
						else {
							list.innerHTML = "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
						}
					}
					if (this.status > 299 && this.status < 600) { // error handling on html error 300 - 599 -> use fallback api
						try {
							var xmlhttp = new XMLHttpRequest(); // creates xmlhttprequest to the api to get geolocation
							var fallbackapi = 'https://api.ipdata.co/' + fields[4] + '?api-key=' + api_key; // sets fallback api

							xmlhttp.onreadystatechange = function() {
								if (this.readyState == 4 && this.status == 200) { // if succeeds
									var fallback = JSON.parse(this.responseText); // gets the reponse as json objects
									ip = fallback.ip; city = fallback.city; region = fallback.region; country =  fallback.country_name; isp = fallback.asn.name;
									if (trollChecked) { // checks if the troll button checkbox is checked in the options
										list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>" + "<br/>" + "<button style=\"background-color:white; text cursor:pointer\" onclick=\"sendStranger(ip, city, region, country, isp)\">Send Infos to Stranger</button>";
									}
									else {
										list.innerHTML = "Using Fallback API:" + "<br/>" + "IP: " + ip + "<br/>" + "City: " + city + "<br/>" + "Region: " + region + "<br/>" + "Country: " + country + "<br/>" + "ISP: " + isp + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "More Information" + "</a>";
									}
								}
								if (this.status > 399 && this.status < 600) { // error handling on html error 400 - 599
									list.innerHTML = "An error occured. (HTTP Statuscode: " + this.status + ")" + "<br/>" + "Reloading the Page may work" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

								}
								if (this.status === 429) { // // error handling on html error 429
									list.innerHTML = "You exceeded your daily quota. (429 Too Many Requests)" + "<br/>" + "<a style=\"color:black;\" target =\"_blank\" href=\"" + trackerip + "\">" + "External Information about " + fields[4] + "</a>";

								}
							};
							xmlhttp.open("GET", fallbackapi, true);
							xmlhttp.onerror = function () {
							  list.innerHTML = "Try disabling the adblocker";
							};
							xmlhttp.send(); // send the request
						}
						catch (err){
							list.innerHTML = "A Error occurred: " + err.message;
						}
					}
				};
				xmlhttp.open("GET", api, true);
				xmlhttp.onerror = function () {
				  list.innerHTML = "Try disabling the adblocker";
				};
				xmlhttp.send(); // send the request
			}
			catch (err){
				list.innerHTML = "A Error occurred: " + err.message;
			}
		}
		return pc.oaddIceCandidate(iceCandidate, ...rest)
	}
	return pc
}
async function ackeeAnalytics() {
	await sleep(2000);
	console.log('Ackee Analytics by kaaaxcreators');
	const instance = ackeeTracker.create('https://ackee.server.kaaaxcreators.de', {
		detailed: true
	})
	instance.record('ffb2160c-f29d-4e49-bfc7-dc5dd1120426')
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}