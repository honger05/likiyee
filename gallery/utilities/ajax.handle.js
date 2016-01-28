
$( document ).ajaxComplete(function( event, xhr, settings ) {
  // settings.url,
  console.log(JSON.parse(xhr.responseText))
})

$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
  console.error([event, jqxhr, settings, thrownError])
})
