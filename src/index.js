import Promise from 'bluebird';
import Scraper from 'webscrape';
import url from 'url';

const weit = async (duration, fn) => new Promise( resolve => setTimeout(() => fn() & resolve() , duration))

const weitEcho = async (seconds, words) => weit(seconds * 1000, () => console.log(`weited ${words || seconds}`));

async function main() {
	const tasks = [ 'task1', 'task2', 'task3' ];
	const ops = tasks.map((task, idx) => weitEcho(idx, task));

	// weit for all. cannot be a functional expression
	for (let op of ops) await op;
	console.log('all tasks mapped');

	function *getNext({baseUrl, selector, attr}) {
		const scraper = Scraper();
		let nextLink = baseUrl;

		do {
			const result = await scraper.get(nextLink);
			nextLink = url.resolve(nextLink, $(selector).attr(attr));
			yield nextLink;
		} while (nextLink);
	}

	function *printNext(producer) {
		let next = producer.next();
		while (next) {
			console.log(next);
			next = producer.next();
		}
	}

	printNext(getNext({
		baseUrl: 'http://www.cad-comic.com/cad/20021023',
		selector: '#content > div:nth-child(2) > a.nav-next',
		attr: 'href'
	}));
}

console.log('Program commences.');
main();

