$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	//for submit button number2
	$('.inspiration-getter').submit( function(event){
		//alert('hit submit');
		// zero out results if previous search has run
		$('.results1').html('');
		// get the value of the tags the user submitted
		var tags1 = $(this).find("input[name='answerers']").val();
		getInspired(tags1);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};
// showAnswerers for the second submit button for inspiration
var showAnswerers = function(answer) {


	
	// clone our result1 template code
	var result1 = $('.templates .answer').clone();
	
	//set answer details link in result1
	var answerElem = result1.find('.answer-text a');
	answerElem.attr('href', answer.user.link);
	answerElem.text(answer.user.display_name);

	// Set the answer properties in result1
	var postCountElem = result1.find('.postCount');
	postCountElem.text(answer.post_count);

	// set the score property in result1
	var score = result1.find('.score');
	score.text(answer.score);

	// set some properties related to asker
	var user = result1.find('.user');
	user.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + answer.user.user_id + ' >' +
													answer.user.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + answer.user.reputation + '</p>'
	);

	return result1;
};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};
var showSearchResults1 = function(query1,resultNum1) {
	var results1 = resultNum1 + ' results for <strong>' + query1;
	return results1;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// for the inspiration-getter form 
var getInspired = function(tags1) {

	//alert('getInspired Function');
	
	var result1 = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+tags1+"/top-answerers/month?site=stackoverflow",
		//data: request1,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result1){
		//alert('request Sent');

		var searchResults1 = showSearchResults1(tags1, result1.items.length);

		$('.search-results1').html(searchResults1);

		$.each(result1.items, function(i, item) {
			var inspiration = showAnswerers(item);
			$('.results1').append(inspiration);

		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results1').append(errorElem);
	});
};



