const PageProxy = require('./helpers/page');

let page;

beforeEach(async () => {
	page = await PageProxy.build();
	await page.goto('http://localhost:3000');
});

afterEach(async () => {
	await page.close();
});

//------------------------------------------------------------------------------

// Describe statements, ma ajuta sa grupez testele si imi da un control mai mare
// , asupra functiilor de tipul beforeEach().
describe('when logged in', async () => {
	beforeEach(async () => {
		await page.login();

		// fac click pe butonul de add new blog post
		await page.click('a.btn-floating');
	});

	test('can see blog create form', async () => {
		const label = await page.getContentsOf('form label');
		expect(label).toEqual('Blog Title');
	});

	describe('and using valid inputs', async () => {
		beforeEach(async () => {
			// metoda din puppeteer.Page care imi scrie un text intr-un selector.
			await page.type('.title input', 'My Title');
			await page.type('.content input', 'My Content');

			await page.click('form button');

			const text = await page.getContentsOf('h5');
			expect(text).toEqual('Please confirm your entries');
		});

		test('submitting takes user to the reviewing screen', async () => {
			await page.click('button.green');

			// asteptam sa se faca postarea si sa se updateze ecranul.
			await page.waitFor('.card');

			const title = await page.getContentsOf('.card-title');
			const content = await page.getContentsOf('p');

			expect(title).toEqual('My Title');
			expect(content).toEqual('My Content');
		});
	});

	describe('and using invalid inputs', async () => {
		beforeEach(async () => {
			// Invalid inputs in cazul meu inseamna no user input si click pe 'next'.
			await page.click('form button');
		});

		test('the form shows an error message', async () => {
			const titleError = await page.getContentsOf('.title .red-text');
			const contentError = await page.getContentsOf('.content .red-text');

			expect(titleError).toEqual('You must provide a value');
			expect(contentError).toEqual('You must provide a value');
		});
	});
});

//------------------------------------------------------------------------------

describe('user is not logged in', async () => {
	
	const actions = [
		{
			method: 'get',
			path: '/api/blogs'	
		},
		{
			method: 'post',
			path: '/api/blogs',
			data: {
				title: 'My Title',
				content: 'My Content'
			}
		}
	];
	
	test('blog related actions are prohibited', async () => {
		// 'results' o sa fie un Array care o sa contina toate rezultatele de la
		// , request-urile care au fost facute.
		const results = await page.execRequests(actions);

		for (let result of results) {
			expect(result).toEqual({ error: 'You must log in!' });
		}
	});

	/*
	test('user cannot create blog posts', async () => {
		const result = await page.post('/api/blogs', { title: 'My Title', content: 'My Content' });
		expect(result).toEqual({ error: 'You must log in!' });
	});

	test('user cannot get a list of posts', async () => {
		const result = await page.get('/api/blogs');
		expect(result).toEqual({ error: 'You must log in!' });
	});
	*/
});
