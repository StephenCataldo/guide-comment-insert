
/*** Config ***/
var keywordsURL = 'https://cognitivepolitics.com/hkpgsm/keywords.json';
var sourceHost = 'cognitivepolitics.com';
var sourcePreURL = 'https://' + sourceHost + '/issues/';
var letsCallIt = 'Social Media Guide';

// @ToDo, figure out: Anything that successfully keeps the window and tries
// to change it hits cross domain problems.

function loadSMG(topic, url) {
 
  // @Note: we could open this in a separate window instead.
  // See the code in ArchiveNoChump. 

  /*** v.13: What to load in this window?
   * load inside div#start-guide if it exists
   * else load the whole url
   ***/   
 
  source = sourcePreURL + url + '#guide'; 
  // letsCallIt  || the topic? Not sure my preference
  $("body").append("<div id='exampleSMG'>"+ letsCallIt + ': ' + topic + "<div id='innerGuide'></div></div>");
  // works: $("#innerGuide").load(source);
  // blank: $("#innerGuide").load(source + " #start-guide");
$.get(source+'',function( data, status ) {
  // $($.parseHTML(response)).filter("#success"); 
  var stdGuide = $($.parseHTML(data)).find("#start-guide");
  if ( stdGuide && false ) {
    //insecure: $( "#innerGuide" ).append('<link rel="stylesheet" href="http://cognitivepolitics.org/hkpgsm/examples/examples-pop2.css" type="text/css" />');
    //insecure: $( "#innerGuide" ).append('<script src="http://cognitivepolitics.org/hkpgsm/examples/pop.js"></script>');
    $( "#innerGuide" ).append( stdGuide );  
  } else {
    $( "#innerGuide" ).html( data );
  }

//$( "#innerGuide" ).html($($.parseHTML(data)).find("#start-guide"));
  //$( "#innerGuide" ).html( data );
});


}

// Quit if looking at the host of the guide, to prevent loops and insanity
// Or maybe, if(window.location.pathname.indexOf(sourcePreURL) == 0) {
if (window.location.host !== sourceHost) {
  console.log("The website is " + window.location.host + " -- And the source is " + sourceHost);
 

  // Get the json (validate here: https://jsonformatter.curiousconcept.com/), 
  // then 
  
  $.getJSON( 
      'https://cognitivepolitics.com/hkpgsm/keywords.json', 
      function( data ) {
 
    //format: "json"
    console.log("data loaded, hopefully.");
    console.log("url for keywords is " + keywordsURL);
    console.log(data.keytopics[0]);
    $.each( data.keytopics, function( i, l ){
      var item = l;
      console.log("one of the keytopics as item, " + item.topic);
      $.each(item.keys, function(i,pattern) {
        console.log("Key is " + pattern);

        // "length" is jquery way to get boolean....
        if ($("body:contains('" + pattern + "')").length) {
          loadSMG(item.topic, item.url);
          //@ToDo: eventually, this should open tabbed content,
          // for each keyword that is a match. Ideally, store these on client.
          return;
        }
      });
    });

  })
  .done(function(data) {
    console.log( "finished loading keywords" );
  })
  //.fail(function() {
  .fail(function(jqXHR, textStatus, errorThrown) {
      console.log("error " + textStatus + '--  ' + errorThrown);
      console.log("incoming Text " + jqXHR.responseText);
  })
} else {
  console.log("We seem to be at the source of the guide.");
}




