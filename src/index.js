import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputRef = document.getElementById(`search-box`);
const countryList = document.querySelector(`.country-list`);
const countryInfo = document.querySelector(`.country-info`);

inputRef.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(event) {
event.preventDefault();
    
const countryToFind = event.target.value.trim();
  
if (countryToFind.length !== 0) {
    fetchCountries(countryToFind).then(renderCountryCard).catch(fetchError);
    }
else {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
    }
}


function renderCountryCard(country) {
    if (country.length > 10) {
    Notify.info(`Too many matches found. Please enter a more specific name.`);
    }
    else if ((country.length > 1) && (country.length <= 10)) { 
    countryList.innerHTML = country.map(({ name,flags}) => {
        return `<li class="country-item" style = "list-style:none; display:flex;align-items:center; gap:10px";>
                <img src="${flags.svg}" alt="flag" width = 30px>
                <p class="country">${name.official}</p>
                </li>`;}).join('');
    
    countryInfo.innerHTML = "";

    }
    else {
        countryInfo.innerHTML = country.map(({ name, capital, population, flags, languages }) => {
            return `
                <h3><img src="${flags.svg}" alt="flag" width=40px> ${name.official}</h3>
                <p><b>Capital:</b> ${capital}</p>
                <p><b>Population:</b> ${population}</p>
                <p><b>Languages:</b> ${Object.values(languages)}</p>
            `;
        }).join('');
        
    countryList.innerHTML = "";
    }
}

function fetchError(error) {
    Notify.failure(`Oops, there is no country with that name`);
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
}