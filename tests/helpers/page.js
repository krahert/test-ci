const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
	static async build() {
		//! Am modificat options ca Puppeteer sa porneasca instantele de Chromium
		//! , in mod 'headless', adica fara GUI si am dezactivat si sandboxing-ul al
		//! , instantelor de Chromium, ca sa simplific configurarea lui Travis si sa
		//! , scada timpul de testare. Adica instantele de Chromium nu vor avea
		//! , propria memorie in RAM, ci isi vor share-ui memoria intre ele si
		//! , posibil alte procese. Deci kernelul la OS nu o sa mai trebuiasca sa
		//! , faca atat de mult memory management pentru acestea si din acest motiv
		//! , se vor misca mai repede.
		const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
		const page = await browser.newPage();
		const customPage = new CustomPage(page);

		return new Proxy(customPage, {
			get: function(target, property) {
				return customPage[property] || browser[property] || page[property];
			}
		});
	}

	constructor(page) {
		this.page = page;
	}

	async login() {
		const user = await userFactory();
		const { session, sig } = sessionFactory(user);

		await this.page.setCookie({ name: 'session', value: session });
		await this.page.setCookie({ name: 'session.sig', value: sig });

		//! Am adaugat 'http://' ca sa nu incurce CI Serverul
		await this.page.goto('http://localhost:3000/blogs');

		await this.page.waitFor('a[href="/auth/logout"]');
  }
  
  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
	}
	
	get(path) {
		return this.page.evaluate((_path) => {
			return fetch(_path, {
				method: 'GET',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => res.json());
		}, path);
	}

	post(path, data) {
		return this.page.evaluate((_path, _data) => {
			return fetch(_path, {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(_data)
			}).then(res => res.json());
		}, path, data);
	}

	execRequests(actions) {
		return Promise.all(
			actions.map(({ method, path, data }) => {
				return this[method](path, data);
			})
		);
	}
}

module.exports = CustomPage;