const BreadthFirstSearch = require('./breadth-first-search.js');
const CameFromSearch = require('./came-from-search.js');
const NodesEdges = require('./nodes-edges.js');

console.log(BreadthFirstSearch);
async function run()
{
	console.log('===== path-finding-practice START =====');
	// await BreadthFirstSearch.run();
	// await CameFromSearch.run();
	await NodesEdges.run();
	console.log('===== path-finding-practice DONE =====');
}

run();