<?php include 'header.php'; ?>

<section id="detail">
	<div id="view">
		<h1></h1>

		<div id="today">
			<div id="goals" name="">I&rsquo;m on page <input type="text" id="currentEntry" value="" maxlength="5" /></div>
			<div id="action" class="action">Read to <span class="pagenum">page <span id="topage"></span></span> today <span class="pagecount">(<span id="pagestoday"></span> pages)</span></div>
			<div id="over" class="action">You&rsquo;re <span class="pagenum"><span id="pagesover"></span> pages</span> over your goal for today.</div>
			<div id="reached" class="action">You&rsquo;ve hit your goal for today.</div>
			<div id="notreadingday" class="action">You&rsquo;re off the hook today.</div>
		</div>

		<ul id="stats">
			<li><h3>Pages per day</h3><span id="pagesperday"></span></li>
			<li><h3>Pages left</h3><span id="pagesleft">201</span></li>
			<li><h3>Total pages</h3><span id="totalpages">855</span></li>
			<li><h3>Days left</h3><span id="daysleft">5</span></li>
			<li><h3>Goal date</h3><span id="goaldate">23 Aug</span></li>
		</ul>

		<h3>Chart</h3>
		<canvas id="reading_chart"></canvas>

		<h3>Entries</h3>
		<ul id="entries"></ul>

		<footer>
			<a id="editbooklink" name="" href="#">Edit Book</a>
		</footer>
	</div>
	<div id="edit">
		<h1>Add Book</h1>
		<form action="javascript:saveGoal();" method="get" accept-charset="utf-8">
			<input type="hidden" name="editgoalid" value="" id="editgoalid">
			<label for="editgoalname">Title</label><input type="text" name="editgoalname" value="" id="editgoalname">
			<label for="editgoaltotalpages">Total Pages</label><input type="text" name="editgoaltotalpages" value="" id="editgoaltotalpages" maxlength="5">
			<label for="editgoalstartdate">Start Date</label><input type="text" name="editgoalstartdate" value="" id="editgoalstartdate" class="date_input">
			<label for="editgoalenddate">End Date</label><input type="text" name="editgoalenddate" value="" id="editgoalenddate" class="date_input">

			<h3>Reading Days</h3>
			<ul id="readingdays">
				<li><label for="readingdaysun">S</label><input type="checkbox" name="sunday" id="readingdaysun" value="0" checked=false></li>
				<li><label for="readingdaymon">M</label><input type="checkbox" name="monday" id="readingdaymon" value="1"></li>
				<li><label for="readingdaytue">T</label><input type="checkbox" name="tuesday" id="readingdaytue" value="2"></li>
				<li><label for="readingdaywed">W</label><input type="checkbox" name="wednesday" id="readingdaywed" value="3"></li>
				<li><label for="readingdaythu">T</label><input type="checkbox" name="thursday" id="readingdaythu" value="4"></li>
				<li><label for="readingdayfri">F</label><input type="checkbox" name="friday" id="readingdayfri" value="5"></li>
				<li><label for="readingdaysat">S</label><input type="checkbox" name="saturday" id="readingdaysat" value="6"></li>
			</ul>

			<p><input type="submit" value="Save Book" class="button"></p>

			<ul id="dangerous">
				<li><a id="hidebooklink" href="#">Hide this book</a></li>
				<li><a id="deletebooklink" href="#">Delete this book</a></li>
			</ul>
		</form>
	</div>
</section>

<?php include 'footer.php'; ?>
