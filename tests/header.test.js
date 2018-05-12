// Numele 'header.test.js' este important sa fie scris in acest fel. Deoarece
// , 'header' o sa fie numele componentei pe care o testez si '*.test.js' o sa
// , fie extensia care ii spune lui Jest ca este un fisier pe care vreau sa il
// , testez. Adica o sa il execute in mod automat ca test file. Aceasta extensie
// , o sa ii permita lui Jest sa descopere in mod automat fisiere pe care vreau
// , sa le testez.

//! Orice operatie pe care o voi face cu Puppeteer, o sa fie de natura
//! , asynchronous, deci va trebui sa folosesc async/await. Deoarece o sa
//! , dureze ceva timp pana cand OS-ul termina ce are de facut.
//! Deci orice operatie facuta cu Puppeteer, o sa aiba 'await'.

//! Aici o sa import Proxy-ul care imi va permite sa invoc metodele lui Page,
//! , Browser si metodele mele custom, folosind doar instantierea acelui Proxy.
// Faptul ca Proxy-ul 'Page' se ocupa de tot ce am nevoie de la Puppeteer, nu
// , mai este nevoie sa import modulul acestuia si in acest fisier.
const PageProxy = require('./helpers/page');

// Voi defini aici variabila 'page', pentru a o face valabila in scope-ul la
// , toata aceasta pagina.
//! 'page' nu mai este o instantiere a lui Page din Puppeteer, acum este a lui
//! , PageProxy. Am pastrat numele ca sa nu mai modific peste tot.
let page;

// Aceasta functie va fi executata inaintea fiecarui test din acest file.
beforeEach(async () => {

	//! Page este clasa neinstantiata al lui Proxy si am folosit metoda statica
	//! , build() a acesteia, care o sa ii faca instantierile necesare.
	page = await PageProxy.build();
	await page.goto('http://localhost:3000');
});

// La fel ca la beforeEach(), doar ca Jest va rula functia asta de fiecare data
// , cand termina un test.
afterEach(async () => {
	// Ii spune sa inchida browser-ul curent. Nukes the current browser instance.
	// O sa inchida si fereastra de GUI si process-ul pentru Chromium.
	//! In mod normal aveam browser.close(), dar folosesc Proxy numit 'page'.
	await page.close();
});

//! TESTS

test('the header has the correct text', async () => {
	// Deoarece Jest si Chromium browser sunt procese diferite, va trebui sa
	// , serializez codul intr-un string si apoi sa ii fac $eval() in interiorul
	// , lui Chromium.
	const text = await page.getContentsOf('a.brand-logo');
	expect(text).toEqual('Blogster');
});

test('clicking login starts OAuth flow', async () => {
	// Deoarece este o comanda pe care Jest o sa i-o dea la Browser, nu trebuie
	// , sa fac 'eval' pe code.
	await page.click('.right a');
	// metoda din Puppeteer care o sa ia url-ul curent dintr-o instanta a lui Page.
	const url = await page.url();

	// toMatch() este o submetoda a lui expect() din Jest, care o sa verifice daca
	// , un string matches un regular expression. Adica daca se gaseste in
	// , interiorul altui string. Am facut escape la ".".
	expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => {

	//! Aici o sa fac autentificarea in aplicatie, folosind o metoda custom pe care
	//! , am declarat-o in clasa care imi genereaza Proxy-ul care o sa-mi imbine
	//! , toate metodele din puppeteer.Browser, puppeteer.Page si custom methods.
	await page.login();	

	//! getContentsOf() este o metoda custom a mea care imi permite sa folosesc
	//! , puppeteer.Page.$eval intr-un mod mai simplu. Sintactic sugar.
	const text = await page.getContentsOf('a[href="/auth/logout"]');

	expect(text).toEqual('Logout');
	
});
