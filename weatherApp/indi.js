const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need????

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            //getfromSessionStorage();
            
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
           getfromSessionStorage();
        }
    }
}

function getfromSessionStorage()
{
    let cordinate=sessionStorage.getItem("curr-cordinates");
    if(!cordinate)
    {
        grantAccessContainer.classList.add("active");
    }
    else if(cordinate)
    {
        //convert json string to json object
        let loclCordinate=JSON.parse(cordinate);
        
        fetchUserWeatherInfo(loclCordinate);
    }
}

async function fetchUserWeatherInfo(loclCordinate)
{
    let lat=loclCordinate.latitude;
    let lon=loclCordinate.longitude;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call

    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(error)
    {
        loadingScreen.classList.remove("active");
        alert("problem in fetching API "+error);
    }
}

function renderWeatherInfo(weatherInfo)
{
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

   //fetch values from weatherINfo object and put it UI elements
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp} °c`;

   windspeed.innerText =` ${weatherInfo?.wind?.speed}m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity}%`;
   cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


// acccess button funtionality
let locationAccessButton=document.querySelector("[data-grantAccess]");

locationAccessButton.addEventListener('click',getLocation);

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(positionFinder);
    }
    else{
        //hw
    }
}

function positionFinder(position)
{
    let lat=position.coords.latitude;
    let long=position.coords.longitude;
    let pos={
        latitude: lat,
        longitude: long
    };
    sessionStorage.setItem('curr-cordinates',JSON.stringify(pos));
    fetchUserWeatherInfo(pos);

}
userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});


// searchInput
let searchBox=document.querySelector("[data-searchInput]");

let searchButton=document.querySelector("[data-searchButton]");
searchButton.addEventListener("click",(event)=>
{
    event.preventDefault();
    let cityText=searchBox.value;
    if(cityText=='')
    {
        alert("enter the city name");
        return;
    }
    else{
        getSearchApi(cityText);
    }
});

async function getSearchApi(cityText)
{
    //make loader visible
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        let response=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityText}&appid=${API_KEY}&units=metric`);
        if(!response.ok)
        {
            throw new Error("enter valid city name");
        }
        let data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        //hw
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
         alert(error);
    }
}

