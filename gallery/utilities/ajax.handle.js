
$( document ).ajaxComplete(function( event, xhr, settings ) {
  // settings.url,
  var res_data = JSON.parse(xhr.responseText)
  console.log(res_data)
  if (res_data.status === 'unlogin') {
    window.location.replace('./login.html')
  }
})

$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
  console.error([event, jqxhr, settings, thrownError])
})
