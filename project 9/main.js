// snipets from lab 7
//https://api.jquery.com/change/
$(document).ready(function() {
  
  $('#search').click(function() {
    saveLocation()
    console.log("button")
  })
  $( "#checkbox" ).change(function() {
    saveToggle()
  })
  $( "#weather-days" ).change(function() {
    saveDays()
  })
  $( "#news-source" ).change(function() {
    saveNews()
  })
 
})


function saveLocation() {
  console.log("save")
  var textArea= $('input[name=location]')
  console.log(textArea)
  localStorage.location = JSON.stringify(textArea.val())
}

function saveToggle(){

  console.log("toggle")
  var rainAlerts= $('select[name=rain-selector]')
  console.log(rainAlerts)
  localStorage.rain = JSON.stringify(rainAlerts.val())
}

function saveDays(){
  console.log("save days")
  var displayDays= $('select[name=weather-display]')
  console.log(displayDays)
  localStorage.days = JSON.stringify(displayDays.val())
}


function saveNews(){
  console.log("save news")
  var newsSource= $('select[name=news-selector]')
  console.log(newsSource)
  localStorage.news = JSON.stringify(newsSource.val())
}



//change event mozilla