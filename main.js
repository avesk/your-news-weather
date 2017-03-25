//Code snippits taken from lab8

/* 
  The "https://cors-anywhere.herokuapp.com/" app allows to circumvent the same-origin policy. It's ok to do this in a lab, but in a real application you shouldn't send requests to 3rd parties from the client-side, or have your access token here, as it makes your access token public
*/

var HEADLINES_ENDPOINT1 = "https://newsapi.org/v1/articles?source=";
var HEADLINES_SOURCE = 'techcrunch';
var HEADLINES_ENDPOINT2 = "&apiKey=ace36f4519ae4e1d82a06fc18132814f";
var WEATHER_ENDPOINT= "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/4d8cd54cb82bf32a54f3ba902745f92e/";


$(document).ready(function() {

  var coords = undefined
  // disable the search button and add a message until we get some GPS coordinates
  $("#error-message").append('Waiting for GPS coordinates...')

  // check if the browser supports geolocation
  if(navigator.geolocation !== undefined) {

    // if it does, watch for the changes in the GPS information
    navigator.geolocation.watchPosition(function(position) {
      // put the coordinates in the coords variable (defined line 10)
      console.log(coords + "in conditional");
      source = 'abc-news-au';
      coords = position.coords
      $("#error-message").empty();
      
      $('.news-list').empty();
      request(coords);

      setInterval(
        function(){
        $('.news-list').empty();
        request(coords);

        },
       60000
      );
      
      
      //setInterval()
    })
  }
  
})

/*
  This function retreives the search term that is entered in the input,
  and send an AJAX request to the YELP API
*/
function request(coordinates) {

  HEADLINES_SOURCE = 'espn';
  
  console.log(coordinates + "in requestHeadlines"); 
  var coordsRequest = coordinates.latitude + ',' + coordinates.longitude;
  
  var newsRequestSettings = {
    
    data : {
      source : 'abc-news-au'
    },

    success : newsRequestSuccess,
    error : requestError
    
  }
  
  var weatherRequestSettings = {

    success : WeatherRequestSuccess,
    error : requestError,

    data : {
      latitude : coordinates.latitude,
      longitude : coordinates.longitude  
    }

  }
  
//  console.log(requestSettings);
  
  $.ajax(HEADLINES_ENDPOINT1 + HEADLINES_SOURCE + HEADLINES_ENDPOINT2, newsRequestSettings);
  $.ajax(WEATHER_ENDPOINT + coordsRequest, weatherRequestSettings);
  
}

function newsRequestSuccess(data, textStatus, jqXHR){
  console.log("IN SUCCESS");
  console.log(data);
  
  var headline_div = $('div').addClass("headline");
  var headline_link = $('a');
  
  data.articles.forEach(function(article){

    var headline = $("<h4 />");
    var anchor = $("<a />", { html: article.title }).attr({'href': article.url, 'target': '_blank'}); 
    var li = $("<li />").addClass('headline');
       
    headline.append(anchor);
    li.append(headline)
    $('.news-list').append(li)
  
  })

}

function requestError(jqXHR, error, errorThrown){
  console.log("IN ERROR");
  $("#error-message").append('<p>' + error + '</p>');

}

function WeatherRequestSuccess(data, textStatus, jqXHR){
  console.log("IN SUCCESS");
  console.log(data);

  $('.hourly-list').empty();
  $('.daily-forecast').empty();
  
  setCurrently(data);
  setHourly(data);
  setDaily(data);
  
}

function setCurrently(data){
  console.log("In setCurrently function");
  console.log(data);
  
  var coordsRequest = data.latitude + ',' + data.longitude;
  
  setCity( //Sets the City and Province

    coordsRequest, 

    function(address){

      console.log("this is city inside of setCurrently: ");
      console.log(address);
      $('#currently > h3').text(address);
    }

  );
      
  //  establish currently object
  var currently = data.currently;

  //Set Current time
  var time = new Date(currently.time*1000);
  $('#date').text(time);

  //Set current summary
  var summary = currently.summary;
  $('#summary').text(summary);
  //sets the mood of the background 
  setMood(summary);
  if(summary === 'rain'){
    $('header').append($('<p />', {html: 'Rain Alert'}));
  }

  //Set current precipitation probability
  var precipProb = currently.precipProbability;
  console.log(precipProb)
  precipProb = precipProb*100;
  $('#currently-precipitation').text('Precipitation: ' + precipProb + '%');

  //Set current humidity probability
  var humidProb = currently.humidity;
  humidProb = humidProb*100;
  $('#currently-humidity').text('Humidity: ' + humidProb + '%');

  //Set current wind speed:
  var windSpeed = currently.windSpeed;
  $('#currently-wind').text('Wind: ' + windSpeed + ' Km/h');

  //set Icon
  var iconText = currently.icon;
  $('#currently-icon').text(iconText);

  //Set temperature:
  var f = currently.temperature;
  console.log(f);
  var c = (5/9) * (f-32);
  console.log(c);
  var tempurature = Math.round(c)
  $('#currently-temp').text(tempurature + '\u2103')
}

function setHourly(data){
  console.log('In setHourly');
  console.log(data);

  var icon;
  var tempurature;
  var hour;

  //establish hourly array:
  var hourly = data.hourly;

  var hourlyList = $('<ul />').addClass('hourly-list');

  //loop through and get data
  for(var i = 0; i<6; i++){

    var li = $('<li />');

    var f = hourly.data[i].temperature;
    var t = fahrenheitToCelcius(f) + '\u2103';

    //convert unix to hour:
    var hr = unixToHour(hourly.data[i].time)

    icon = $("<i />", { html: hourly.data[i].icon }).addClass('hourly-icon');
    tempurature = $("<p />", { html: t}).addClass('temp');
    var time = $("<p />", { html: hr }).addClass('hourly-time');

    li.append(icon);
    li.append(tempurature);
    li.append(time);

    hourlyList.append(li);

  }

  $('#hourly-wrapper').append(hourlyList);

}

function setDaily(data){

  console.log('In setDaily')
  console.log(data);

  var daily = data.daily;

  for(var i = 0; i<4; i++){

    //Convert fahrenheitToCelcius for high
    var f1 = daily.data[i].temperatureMax;
    var h = fahrenheitToCelcius(f1) + '\u2103';
    //Convert fahrenheitToCelcius for low
    var f2 = daily.data[i].temperatureMin;
    var l = fahrenheitToCelcius(f2) + '\u2103';

    //Convert precip into percentage:
    var p = daily.data[i].precipProbability*100;
    p = p + '%';
    //Convert humidity into percentage:
    var hum = daily.data[i].humidity*100;
    hum = hum + '%';

    //convert unix time to day of the week
    var d = unixToDayOfWeek(daily.data[i].time);

    var day = $('<div />').addClass('day');

    var dayOfWeek = $('<h4 />', {html: d});

    var precip = $('<p />', {html:'Precipitation: ' + p}).addClass('daily-precipitation');
    var high = $('<p />', {html: 'High: ' + h}).addClass('daily-high');
    var low = $('<p />', {html: 'Low: ' + l}).addClass('daily-low');
    var humidity = $('<p />', {html:'Humidity: ' + hum}).addClass('daily-humidity');
    var wind = $('<p />', {html:'Wind: ' + daily.data[i].windSpeed + ' Km/h'}).addClass('daily-wind');

    day.append(dayOfWeek);
    day.append(precip);
    day.append(high);
    day.append(low);
    day.append(humidity);
    day.append(wind);

    $('.daily-forecast').append(day);

  }

}

function setCity(coords, handle){
  requestSettings = {
    success: function(data){
      console.log(data.results[0].formatted_address);
      // var firstAdressComp = data.results[0].address_components[0].long_name;
      // var secondAdressComp = data.results[0].address_components[1].long_name;
      // var thirdAdressComp = data.results[0].address_components[2].long_name;
      handle(data.results[0].formatted_address);

    },
    
    error: function(){
      console.log('error getting google maps info');
  }
  
  }
  
  
  $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coords +'&sensor=true', requestSettings
    );

}

function fahrenheitToCelcius(f){

  var c = (5/9) * (f-32);
  var c = Math.round(c);

  return c;

}

function unixToDayOfWeek(t){

  var days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
  var date = new Date();
  date.setTime(t*1000); 

  var dayOfWeek = days[date.getDay()];
  return dayOfWeek;

}

function unixToHour(t){

  var date = new Date();
  date.setTime(t*1000);
  var hour = date.getHours();

  if(hour >= 12){
    if(hour !== 12)
      hour -=12;

    hour = hour + ' pm';
  } 

  else{
    if(hour === 0){
      hour = 12 + ' am';
      return hour;
    }
    hour = hour + ' am';
  }
    

  return hour;

}

function setMood(summary){

  $('body').css("background-image","url('images/sunny.jpg')");

}












