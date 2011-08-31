var goalData = undefined;
var canvas;
var context;

var Bookkeeper = function () {
	this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Juy', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	this.makeTwoDigits = function (number) {
		number = String(number);
		newNumber = number;
		if (number.length == 1) {
			newNumber = '0' + number;
		}
		return newNumber;
	};

	this.chartEntries = function (goal, entries) {
		chartpoints = [];
		previousPage = 0;
		currentEntry = 0;
		tempday = new Date();
		today = new Date(tempday.getFullYear() + '-' + (tempday.getMonth() + 1) + '-' + tempday.getDate());
		for (loopTime = new Date(goal.startDate); loopTime <= today; loopTime.setTime(loopTime.valueOf() + 86400000)) {
			if (goal.readingDays[loopTime.getDay()] == 1) {
				date = loopTime.getFullYear() + '-' + (loopTime.getMonth() + 1) + '-' + loopTime.getDate();
				for (currentEntry; currentEntry < entries.length; currentEntry++) {
					compared = this.compareDates(new Date(entries[currentEntry].date), new Date(date));
					if (compared == 0) {
						previousPage = entries[currentEntry].page;
						break;
					} else if (compared == 1) {
						break;
					} else {
						previousPage = entries[currentEntry].page;
					}
				}
				chartpoints.push(previousPage);
			}
		}
		return chartpoints;
	};

	this.calcDaysBetween = function (start, end, readingDays) {
		date1 = new Date(start);
		date2 = new Date(end);
		daysLeft = 0;
		for (loopTime = date1; loopTime < date2; loopTime.setTime(loopTime.valueOf() + 86400000)) {
			if (readingDays[loopTime.getDay()] == 1) {
				daysLeft++;
			}
		}
		return daysLeft + 1;
	};

	this.calcDaysLeft = function (goal) {
		today = new Date();
		return this.calcDaysBetween(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(), goal.endDate, goal.readingDays);
	};

	this.calcPagesPerDay = function (entries, daysLeft, goal, fromToday) {
		var entry = 0;
		var today = new Date();
		if (entries.length == 1 && !this.compareDateToToday(entries[0].date)) {
			entry = entries[0].page;
		} else if (entries.length > 1) {
			if (fromToday && this.compareDateToToday(entries[entries.length - 1])) {
				entry = entries[entries.length - 1].page;
			} else if (this.compareDateToToday(entries[entries.length - 1].date)) {
				entry = entries[entries.length - 2].page;
			} else {
				entry = entries[entries.length - 1].page;
			}
		}
		var pages = goal.totalPages - entry;
		return Math.ceil(pages / (daysLeft));
	};

	this.compareDateToToday = function (date) {
		var today = new Date();
		today = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
		var theDate = new Date(date);
		var rtnBool = false;
		if (this.compareDates(theDate, today) == 0) {
			rtnBool = true;
		}
		return rtnBool;
	};

	this.compareDates = function (date1, date2) {
		var rtnInt = 0;
		if (date1.valueOf() < date2.valueOf()) {
			rtnInt = -1;
		} else if (date1.valueOf() > date2.valueOf()) {
			rtnInt = 1;
		}
		return rtnInt;
	};

	this.calcPagesToday = function (entries, pagesperday) {
		var today = new Date();
		previousentry = 0;
		currententry = 0;
		if (entries.length == 1 && this.compareDateToToday(entries[0].date)) {
			currententry = entries[0].page;
		} else if (entries.length > 1) {
			if (this.compareDateToToday(entries[entries.length - 1].date)) {
				previousentry = entries[entries.length - 2].page;
				currententry = entries[entries.length - 1].page;
			} else {
				previousentry = entries[entries.length - 1].page;
				currententry = previousentry;
			}
		}
		pages = pagesperday - (currententry - previousentry);
		return Math.ceil(pages);
	};

	this.calcToPage = function (pagestoday, currentpage) {
		return currentpage + pagestoday;
	};

	this.todayReadingDay = function (readingDays) {
		today = new Date();
		rtnBool = true;
		if (readingDays[today.getDay()] == 0) {
			rtnBool = false;
		}
		return rtnBool;
	};

	this.switchTodayDisplay = function (idToShow) {
		$("#today div").hide();
		$("#goals").show();
		$("#" + idToShow).show();
	};

	this.updatePage = function (goal) {
		entries = bi.getEntries(goal.id);
		daysLeft = this.calcDaysLeft(goal);
		currentEntryPage = 0;
		if (entries.length > 0) {
			currentEntryPage = entries[entries.length - 1].page;
		}
		pagesLeft = goal.totalPages - currentEntryPage;
		pagesperday = this.calcPagesPerDay(entries, daysLeft, goal, false);
		pagestoday = this.calcPagesToday(entries, pagesperday);

		$("#entries").html('');
		for (var i in entries) {
			date = new Date(entries[i].date);
			dateStr = date.getDate() + ' ' + this.months[date.getMonth()] + ' ' + date.getFullYear();
			$("#entries").append("<li>Page " + entries[i].page + " <span class='date'>(" + dateStr + ")</span></li>");
		}
		$("#view h1").text(goal.name);
		$("#goals").attr('name', goal.id);
		$("#currentEntry").val(currentEntryPage);
		$("#daysleft").text(daysLeft);
		$("#pagesleft").text(pagesLeft);
		$("#pagesperday").text(pagesperday);
		$("#totalpages").text(goal.totalPages);

		$("#editbooklink").unbind('click');
		$("#editbooklink").click(function () {
			$("#edit h1").text(goal.name);
			$("#editgoalid").val(goal.id);
			$("#editgoalname").val(goal.name);
			$("#editgoaltotalpages").val(goal.totalPages);
			$("#editgoalstartdate").val(goal.startDate);
			$("#editgoalenddate").val(goal.endDate);

			$("input:checkbox").prop('checked', false);
			for (i in goal.readingDays) {
				if (goal.readingDays[i] == 1) {
					$("input:checkbox[value=" + i + "]").prop('checked', true);
				}
			}

			$("#dangerous").show();
			$("#view").hide();
			$("#edit").show();
			return false;
		});

		$("#deletebooklink").unbind('click');
		$("#deletebooklink").click(function () {
			if (confirm("Are you sure you want to delete this book? This can not be undone (all entries for this book will be deleted as well).")) {
				bi.deleteGoal(goal.id);
				loadPage();
				$("#edit").hide();
				$("#view").show();
			}
			return false;
		});

		$("#hidebooklink").unbind('click');
		$("#hidebooklink").click(function () {
		});

		if (pagestoday < 0) {
			pagestoday = -1 * pagestoday;
			$("#pagesover").text(pagestoday);
			this.switchTodayDisplay("over");
		} else if (pagestoday == 0) {
			this.switchTodayDisplay("reached");
		} else if (!this.todayReadingDay(goal.readingDays)) {
			this.switchTodayDisplay("notreadingday");
		} else {
			$("#pagestoday").text(pagestoday);
			$("#topage").text(this.calcToPage(pagestoday, currentEntryPage));
			this.switchTodayDisplay("action");
		}

		goalDate = new Date(goal.endDate);
		goalDateStr = goalDate.getDate() + ' ' + this.months[goalDate.getMonth()];
		$("#goaldate").text(goalDateStr);

		var chart = new Chart(goal.totalPages, this.calcDaysBetween(goal.startDate, goal.endDate, goal.readingDays), this.chartEntries(goal, entries), canvas, context);
	};
};

$.extend(DateInput.DEFAULT_OPTS, {
	stringToDate: function(string) {
		var matches;
		if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) {
			return new Date(matches[1], matches[2] - 1, matches[3]);
		} else {
			return null;
		};
	}, 
	dateToString: function(date) {
		var month = (date.getMonth() + 1).toString();
		var dom = date.getDate().toString();
		if (month.length == 1) month = "0" + month;
		if (dom.length == 1) dom = "0" + dom;
		return date.getFullYear() + "-" + month + "-" + dom;
	}
});

$(document).ready(function () {
	canvas = document.getElementById("reading_chart");
	if (canvas != null) {
		canvas.width = $("#reading_chart").width();
		canvas.height = $("#reading_chart").height();

		if (canvas.getContext) {
			context = canvas.getContext('2d');
		}
	}

	$(".date_input").date_input();
	$("#currententry").focus();
	$("#loading").hide();

	$("#currententry").change(function () {
		bookid = Number($("#currentbookid").val());
		page = Number($(this).val());
		$("#loading").show();
		$.getJSON(app_url + '/' + currentuser + '/action/saveentry?bookid=' + bookid + '&page=' + page, function (data) {
			percent = Math.round(data.percentage);
			$("#booklist li a#book" + data.bookId + " .percent").css('width', percent + 'px');
			$("#booklist li a#book" + data.bookId + " .percentage span").html('<b>' + percent + '%</b> (' + data.pagesLeft + ' pages left)');
			$("#pagesleft").text(data.pagesLeft);
			$("#actionhtml").html(data.actionHtml);
			$("#loading").hide();
		});
	});

		//entry = new Entry();
		//entry.goalId = Number($(this).parent().attr('name'));
		//entry.page = Number($(this).val());
		//today = new Date();
		//entry.date = today.getFullYear() + '-' + bookkeeper.makeTwoDigits(today.getMonth() + 1) + '-' + bookkeeper.makeTwoDigits(today.getDate());
		//oldEntry = bi.getEntryByDate(entry.goalId, entry.date);
		//if (oldEntry.id != 0) {
			//entry.id = Number(oldEntry.id);
		//}
		//bi.saveEntry(entry);
		//goal = bi.getGoal(entry.goalId);
		//bookkeeper.updatePage(goal);

		//goal.pagesleft = goal.totalPages - entry.page;
		//goal.percent = Math.round((entry.page / goal.totalPages) * 100);

		//$("#booklist li a[name=goal" + goal.id + "] .percent").css('width', goal.percent + 'px');
		//$("#booklist li a[name=goal" + goal.id + "] .percentage span").html('<b>' + goal.percent + '%</b> (' + goal.pagesleft + ' pages left)');
});
