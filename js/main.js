const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e', 'a', 's', 'd'];

let gameOver = localStorage.getItem('gameOver') === null || localStorage.getItem('gameOver') == 'false' ? false : true;
function divKeyDownHandler(event) {
	function ctrlSecond(event){
		if(event.key == 's'){
			event.preventDefault();
			save();
		}
		document.removeEventListener('keydown', ctrlSecond);
	}

	if(event.key == 'Control'){
		event.preventDefault();
		document.addEventListener('keydown', ctrlSecond);
	}
	if (VALID_KEYS.includes(event.key)) {
		event.preventDefault();
		keyHandler(event.key);
	}
}

function enableDungeonEventListener() {
	var myDiv = document.getElementById('dungeon');
	
	function enable(event){
		document.addEventListener('keydown', divKeyDownHandler);
		document.addEventListener('click', clickOutsideHandler);
	}

	function clickOutsideHandler(event) {
		var myDiv = document.getElementById('dungeon');
		if (event === null || !myDiv.contains(event.target)) {
			document.removeEventListener('keydown', divKeyDownHandler);
			document.removeEventListener('click', clickOutsideHandler);
		}
	}	

    myDiv.addEventListener('click', enable);
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const FADE = 'FADE';
const LOCK = 'LOCK';
let interval;
function fade(msgDiv) {
	let opacity = 1;
	msgDisplay = true;
	interval = setInterval(() => {
		msgDiv.style.opacity = (opacity -= 0.075) > 0 ? opacity : (clearInterval(interval), msgDiv.innerHTML = '', 0);
	}, 75);
}
let backlog = [];
async function logMsg(message, option){
	const msgDiv = document.getElementById('msg');
	

	if(msgDiv == null){
		return;
	}
	clearInterval(interval);
	msgDiv.style.opacity = 1;
	msgDiv.innerHTML = message;

	if(option == FADE){ fade(msgDiv); }
	else if(option == LOCK){ msgDiv.setAttribute('id', 'msg_lock'); }
}

function reset(){
	logMsg('Reset Game', FADE);

	const d = document.getElementById('entity-layer');
	d.innerHTML = '';
	d.style.top = '0px';
	d.style.left = '0px';

	localStorage.clear();
	gameOver = false;

	USER = null;

	dungeonRefresh();
	updateStats();
	
	document.getElementById('dungeon').click();
}

function save(){
	saveData();
	savePlayer();
	localStorage.setItem('gameOver', gameOver);
	logMsg('Saved Game', FADE);
}

function getCharacterDimensions(fontType, character, fontSize) { // LLM Generated
	const hiddenElement = document.createElement('div');
	hiddenElement.style.cssText = `font-size: ${fontSize}; font-family: ${fontType}; position: absolute; left: -9999px;`;
	hiddenElement.textContent = character;

	document.body.appendChild(hiddenElement);
	const rect = hiddenElement.getBoundingClientRect();
	document.body.removeChild(hiddenElement);

	return { height: rect.height, width: rect.width };
}

const setCookie = (name, value, days) => { document.cookie = `${name}=${value}; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}; path=/`; };
const getCookie = (name) => { const decodedCookie = decodeURIComponent(document.cookie); const cookies = decodedCookie.split(';'); return cookies.find(cookie => cookie.trim().startsWith(name + '='))?.split('=')[1] || null; };
const deleteCookie = (name) => { document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; };
