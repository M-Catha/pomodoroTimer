var clock;
var currentInterval;

// Handles clock setup
function initClock(timeInSec, autoStart, intervalName) {

	var timeInSeconds = timeInSec || 1500;
	var isAutoStart = autoStart || false;
	var interval = intervalName || "session";

	currentInterval = interval;

	clock = $('#clock').FlipClock(timeInSeconds, {
		clockFace: 'HourlyCounter',
		countdown: true,
		autoStart: isAutoStart,
		callbacks: {
			start: function() {
				playSound("sounds/Accept.mp3");
				activeStatus();
			},
			stop: function() {
				var timeEnd = clock.getTime().time;
				beginNextInterval(timeEnd, interval);
			}
		}
	})
};

// Handle break/session time changes
function timeHandler() {

	var isBreakButton = $(this).parent().hasClass("break");
	playSound("sounds/Pop.mp3");
	var breakCurrentNum = Number($(".breakLength").text());
	var sessionCurrentNum = Number($(".sessionLength").text());
	
	if (isBreakButton) {

		// Determine if up or down was hit and increment/decrement the number
		var clickedBreakDown = $(this).hasClass("breakLengthDown");
		clickedBreakDown && breakCurrentNum > 1 ? breakCurrentNum-- : !clickedBreakDown ? breakCurrentNum++ : "";

		$(".breakLength").text(breakCurrentNum);

	} else {

		// Determine if up or down was hit and increment/decrement the number
		var clickedSessionDown = $(this).hasClass("sessionLengthDown");
		clickedSessionDown && sessionCurrentNum > 1 ? sessionCurrentNum-- : !clickedSessionDown ? sessionCurrentNum++ : "";

		$(".sessionLength").text(sessionCurrentNum);
	}

	currentInterval === "session" ? changeTime(sessionCurrentNum) : changeTime(breakCurrentNum);

}

// Start clock function
function startClock() {
	$(".breakLengthDown, .breakLengthUp, .sessionLengthUp, .sessionLengthDown").attr('disabled', 'disabled');
	clock.start();
}

// Stop clock function
function stopClock() {
	playSound("sounds/Alert.mp3");
	if (currentInterval === "session") {
		$(".sessionLengthUp, .sessionLengthDown").removeAttr('disabled');
	} else if (currentInterval === "break") {
		$(".breakLengthDown, .breakLengthUp").removeAttr('disabled');
	}
	clock.stop();
}

// Reset clock function
function resetClock() {
	$(".breakLengthDown, .breakLengthUp, .sessionLengthUp, .sessionLengthDown").removeAttr('disabled');
	$(".breakLength").text("5");
	$(".sessionLength").text("25");
	$(".breakTitle, .sessionTitle").removeClass("highlight");
	$(".breakTitle, .sessionTitle, .breakTime, .sessionTime").removeClass("greyOut");
	playSound("sounds/Percussion.mp3")
	initClock();
}

// Update clock time based on currentInterval (break or session)
function changeTime(currentTime) {

	var time = currentTime * 60;
	initClock(time, false, currentInterval);
}

// Handles the next interval after current interval is complete
function beginNextInterval(time, interval) {

	if (time === 0) {

		var newTime = 0;
		var nextInterval = "";

		if (interval === "session") {
			newTime = Number($(".breakLength").text()) * 60;
			nextInterval = "break";
		} else {
			newTime = Number($(".sessionLength").text()) * 60;
			nextInterval = "session";
		}

		initClock(newTime, true, nextInterval);	
	}
}

// Play sound effects
function playSound(url) {
	var audio = document.getElementById("sound");
	audio.src = url;
	audio.play();
}

// Change classes on active/deactive time periods
function activeStatus() {
	if (currentInterval === "session") {
		$(".sessionTitle").addClass("highlight");
		$(".breakTimer").addClass("greyOut");

		$(".breakTitle").removeClass("highlight");
		$(".sessionTimer").removeClass("greyOut");
	} else {
		$(".breakTitle").addClass("highlight");
		$(".sessionTimer").addClass("greyOut");

		$(".sessionTitle").removeClass("highlight");
		$(".breakTimer").removeClass("greyOut");
	}
}

// Event Handlers
$(document).ready(initClock());
$(".breakLengthDown, .breakLengthUp, .sessionLengthUp, .sessionLengthDown").click(timeHandler);
$(".start").click(startClock);
$(".stop").click(stopClock);
$(".reset").click(resetClock);
