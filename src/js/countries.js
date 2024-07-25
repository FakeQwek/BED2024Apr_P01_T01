// get html elements
const discussionName = document.getElementById("discussionName");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const searchResultsContainer = document.getElementById("searchResultsContainer");
const homePosts = document.getElementById("homePosts");

const searchInput = document.getElementById('searchInput');
const countriesList = document.getElementById('countriesList');
const countryInfo = document.getElementById('countryInfo');
const countryName = document.getElementById('countryName');
const countryCapital = document.getElementById('countryCapital');
const countryRegion = document.getElementById('countryRegion');
const countrySubregion = document.getElementById('countrySubregion');
const countryPopulation = document.getElementById('countryPopulation');
const countryLanguages = document.getElementById('countryLanguages');
const countryCode = document.getElementById('countryCode');
const countryCurrencies = document.getElementById('countryCurrencies');

// set variables
let accountName;
apikey = "ad61a3b55ab20ed21479950c798b39d9";
url = 'https://gnews.io/api/v4/top-headlines?category=health&lang=en&country=sg&max=10&apikey=' + apikey;
let news = [];

// function that checks if the username in the get request matches with the username in the jwt token
async function checkAccountName() {
    const res = await fetch("http://localhost:3000/accounts/" + localStorage.getItem("username"), {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const account = await res.json();

    // set html for account if the user is logged in
    if (account.accName != null) {
        const loginSignUp = document.getElementById("loginSignUp");
        loginSignUp.innerHTML = `<button class="btn btn-sm mr-4 max-[820px]:hidden" onclick="goToProfile('` + account.accName +`')"><img src="../images/account-circle-outline.svg" width="20px" />` + account.accName + `</button>`;
    }

    accountName = account.accName;
}

checkAccountName();

// function to create discussion
async function createDiscussion() {
    const public = document.getElementById("public");
    const restricted = document.getElementById("restricted");
    const private = document.getElementById("private");
    var type;

    // check which discussion type was selected
    if (public.checked == true) {
        type = "Public";
    } else if (restricted.checked) {
        type = "Restricted";
    } else if (private.checked) {
        type = "Private";
    }

    await fetch("http://localhost:3000/discussion", {
        method: "POST",
        body: JSON.stringify({
            dscName: discussionName.value,
            dscDesc: "",
            dscType: type,
            accName: accountName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    await fetch("http://localhost:3000/discussionMember/" + discussionName.value, {
        method: "POST",
        body: JSON.stringify({
            accName: accountName,
            dscMemRole: "Owner"
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    
    // direct page to discussion page of newly created discussion
    var script = document.getElementsByTagName("script");
    var url = script[script.length-1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("discussion.html?discussionName=" + discussionName.value);
    window.location.href = url;
};

// function to search all discussions
async function searchDiscussions(searchTerm) {
    const res = await fetch("http://localhost:3000/discussions/search?searchTerm=" + searchTerm);
    const discussions = await res.json();

    searchResults.innerHTML = ``;
    
    for (let i = 0; i < discussions.length; i++) {
        const resultHTML = `<button class="btn mx-4 my-2" onclick="goToDiscussion('` + discussions[i].DscName + `')">` + discussions[i].DscName + `</button>`
        searchResults.insertAdjacentHTML("beforeend", resultHTML);
    }
}

// event listener for search bar input
searchBar.addEventListener("input", () => {
    searchResultsContainer.classList.remove("invisible");
    searchDiscussions(searchBar.value);
})

// event listener for search bar focus
searchBar.addEventListener("focus", () => {
    searchResultsContainer.classList.remove("invisible");
})

// event listener for search bar focusout
searchBar.addEventListener("focusout", () => {
    searchResultsContainer.classList.add("invisible");
})

// function to get user details to be displayed on the sidebar
async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + accountName);
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

// direct page to the post page with the post id of the selected post
function goToPost(postId) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length-1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("post.html?postId=" + postId);
    window.location.href = url;
}

// direct page to discussion page
function goToDiscussion(dscName) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length-1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("discussion.html?discussionName=" + dscName);
    window.location.href = url;
}

// direct page to profile page
function goToProfile(accName) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length-1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("profile.html");
    window.location.href = url;
}

async function getNews() {
    fetch(url)
    .then(res => {
        if(!res.ok){
            throw new Error('Error retrieving news');
        }
        return res.json();
    })
    .then(newsData => {
        for (i = 0; i < 10; i++) {
            news.push(newsData.articles[i])
        }
        Posts();
    })
    .catch(error => {
        console.error(error);
    });
}

sidebar();

// Country API functionality
document.addEventListener('DOMContentLoaded', () => {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        fetchCountries(query);
    });

    async function fetchCountries(query = '') {
        const url = query ? `https://restcountries.com/v3.1/name/${query}` : 'https://restcountries.com/v3.1/all';
        const response = await fetch(url);
        const countries = await response.json();
        displayCountries(countries);
    }

    function displayCountries(countries) {
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        countriesList.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('p-2', 'border', 'rounded', 'cursor-pointer', 'text-sm', 'bg-white');
            countryCard.innerHTML = `
                <h3 class="font-bold">${country.name.common}</h3>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p><strong>Region:</strong> ${country.region}</p>
            `;
            countryCard.addEventListener('click', () => displayCountryInfo(country));
            countriesList.appendChild(countryCard);
        });
    }

    function displayCountryInfo(country) {
        countryName.textContent = country.name.common;
        countryCapital.textContent = country.capital ? country.capital[0] : 'N/A';
        countryRegion.textContent = country.region;
        countrySubregion.textContent = country.subregion;
        countryPopulation.textContent = country.population.toLocaleString();
        countryLanguages.textContent = Object.values(country.languages).join(', ');
        countryCode.textContent = country.cca3;
        countryCurrencies.textContent = Object.values(country.currencies).map(currency => currency.name).join(', ');

        countryInfo.classList.add('bg-white', 'p-4', 'border', 'rounded');
        countryInfo.classList.remove('hidden');
    }

    fetchCountries();
});
