const BreadthFirstSearch = require('./breadth-first-search.js');
const CameFromSearch = require('./came-from-search.js');
const NodesOnly = require('./nodes-only.js');

console.log(BreadthFirstSearch);
async function run()
{
	console.log('===== path-finding-practice START =====');
	// await BreadthFirstSearch.run();
	// await CameFromSearch.run();
	await NodesOnly.run();
	console.log('===== path-finding-practice DONE =====');
}

run();