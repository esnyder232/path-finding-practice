const {GlobalFuncs} = require("./global-funcs.js");

var nodeId = 0;
var edgeId = 0;

async function run()
{
	console.log('--- nodes-only START ---');

	var nodes = [];
	var edges = [];

	var mapWidth = 7;
	var mapHeight = 7;

	


	console.log('--- nodes-only DONE ---');
}

function createNode(nodeArr, x, y, type)
{
	nodeArr.push({
		id: nodeId++,
		x: x,
		y: y,
		type: type
	});
}


// async function run()
// {
// 	console.log('--- nodes-only START ---');
// 	var globalfuncs = new GlobalFuncs();
// 	var graph = [];
// 	var width = 7;
// 	var height = 7;
// 	var xStart = 3;
// 	var yStart = 3;
	
// 	//make a shitty graph
// 	var graphId = 0;
// 	for(var i = 0; i < height; i++)
// 	{
// 		graph.push([]);
// 		for(var j = 0; j < width; j++)
// 		{
// 			graph[i][j] = {
// 				id: graphId,
// 				type: "-",
// 				x: j,
// 				y: i
// 			};
// 			graphId++;
// 		}
// 	}

// 	//start
// 	graph[yStart][xStart].type = "X";

// 	//walls
// 	// graph[1][5].type = "W"
// 	// graph[2][5].type = "W"
// 	// graph[2][6].type = "W"

// 	// graph[2][1].type = "W"
// 	// graph[3][2].type = "W"

// 	graph[3][4].type = "W"
// 	graph[2][4].type = "W"
	
// 	drawGraph(graph, xStart, yStart);


// 	//////////////////////////////////
// 	//basic breadth first exploring //
// 	//////////////////////////////////

// 	// var frontier = [];
// 	// var reached = [];
	
// 	// //start the frontier
// 	// frontier.push({nodeNum: 0, x: xStart, y: yStart});
// 	// reached.push({nodeNum: 0, x: xStart, y: yStart});

// 	// var frameNum = 1;
// 	// var nodeNum = 1;


// 	// while(frontier.length > 0)
// 	// {
// 	// 	console.log('--- FRAME ' + frameNum + " ---");
// 	// 	var curr = frontier.shift();
// 	// 	console.log("curr: i: " + curr.nodeNum + ", x: " + curr.x + ", y: " + curr.y);

// 	// 	var neighbors = getGraphNeighbors(graph, curr.x, curr.y, curr.nodeNum == 0);
// 	// 	//logNeighbors(neighbors);

// 	// 	for(var i = 0; i < neighbors.length; i++)
// 	// 	{
// 	// 		//console.log('now processing neighbor ' + i + ": " + neighbors[i].x + " " + neighbors[i].y);
// 	// 		var foundNode = reached.find((n) => {return n.x === neighbors[i].x && n.y === neighbors[i].y});
// 	// 		if(!foundNode)
// 	// 		{
// 	// 			frontier.push(neighbors[i]);
// 	// 			reached.push(neighbors[i]);
// 	// 			// graph[neighbors[i].y][neighbors[i].x].type = nodeNum;
// 	// 			// nodeNum++;
// 	// 		}
// 	// 	}
		
// 	// 	drawGraph(graph, curr.x, curr.y);

// 	// 	frameNum++;

// 	// 	//await sleep(500);
// 	// }



// 	//////////////////////////////////
// 	//came from                     //
// 	//////////////////////////////////
// 	var frontier = [];
// 	var came_from = {};
// 	var frameNum = 1;

// 	var startNode = graph[yStart][xStart];
// 	frontier.push(startNode);
// 	came_from[startNode.id] = null;
	
// 	while(frontier.length > 0)
// 	{
// 		console.log('--- FRAME ' + frameNum + " ---");
// 		var curr = frontier.shift();
// 		console.log("curr: id: " + curr.id + ", x: " + curr.x + ", y: " + curr.y);

// 		var neighbors = getGraphNeighbors(graph, curr.x, curr.y);
// 		//logNeighbors(neighbors);

// 		for(var i = 0; i < neighbors.length; i++)
// 		{
// 			//console.log('now processing neighbor ' + i + ": " + neighbors[i].x + " " + neighbors[i].y);
// 			// var foundNode = reached.find((n) => {return n.x === neighbors[i].x && n.y === neighbors[i].y});

// 			var asdf = came_from[neighbors[i].node.id];
// 			if(came_from[neighbors[i].node.id] === undefined)
// 			{
// 				frontier.push(neighbors[i].node);

// 				came_from[neighbors[i].node.id] = {fromDir: neighbors[i].fromDir, node: curr};
// 			}
// 		}
		
// 		//drawGraph(graph, curr.x, curr.y);

// 		frameNum++;

// 		//await sleep(500);
// 	}

// 	drawGraph(graph);
// 	drawGraphWithArrows(graph, came_from);


// 	var nodeTarget = null;
// 	nodeTarget = graph[1][6];
// 	var pathNodes = findPath(graph, came_from, startNode, nodeTarget);

// 	var stopHere = true;


// 	console.log('--- came-from-search2 DONE ---');
// }


// function drawWorld(worldTerrain, graphs)
// {

// }




// function findPath(graph, comeFromMapping, nodeStart, nodeTarget) {
// 	var nodePath = [];	
// 	var currentNode = nodeTarget;
// 	nodePath.push(nodeTarget);

// 	//work backwards from target to start
// 	while(currentNode !== null)
// 	{
// 		if(currentNode == nodeStart)
// 		{
// 			break;
// 		}

// 		var next = comeFromMapping[currentNode.id].node;
		
// 		nodePath.push(next);
// 		currentNode = next;
// 	}

// 	return nodePath;
// }


// function getGraphNeighbors(graph, x, y)
// {
// 	var result = [];

// 	//north neighbor
// 	if(((y-1) >= 0) && ((y-1) < graph.length) && (x >= 0) && (x < graph[(y-1)].length) && graph[y-1][x] !== "W")
// 	{
// 		result.push({fromDir: 'S', node: graph[y-1][x]});
// 	}
// 	//east neighbor
// 	if((y >= 0) && (y < graph.length) && ((x+1) >= 0) && ((x+1) < graph[y].length) && graph[y][x+1] !== "W")
// 	{
// 		result.push({fromDir: 'W', node: graph[y][x+1]});
// 	}

// 	//south neighbor
// 	if(((y+1) >= 0) && ((y+1) < graph.length) && (x >= 0) && (x < graph[(y+1)].length) && graph[y+1][x] !== "W")
// 	{
// 		result.push({fromDir: 'N', node: graph[y+1][x]});
// 	}

// 	//west neighbor
// 	if((y >= 0) && (y < graph.length) && ((x-1) >= 0) && ((x-1) < graph[y].length) && graph[y][x-1] !== "W")
// 	{
// 		result.push({fromDir: 'E', node: graph[y][x-1]});
// 	}

// 	return result;
// }


// //probably going to do it again so...whatevr
// function logNeighbors(neighbors) {
// 	console.log('Neighbors: ')
// 	for(var i = 0; i < neighbors.length; i++)
// 	{
// 		console.log(neighbors[i].x + " " + neighbors[i].y);
// 	}
// }




// //draw a shitty map
// function drawGraph(graph, nodeXHighlight, nodeYHighlight) {
// 	var str = "";

// 	for(var i = 0; i < graph.length; i++)
// 	{
// 		//x axis
// 		if(i == 0)
// 		{
// 			str += "\t\t";
// 			for(var k = 0; k < graph[i].length; k++)
// 			{
// 				str += k + "\t";
// 			}
// 			str += "\n\n";
// 		}

// 		//y axis
// 		str += i + "\t\t";

// 		for(var j = 0; j < graph[i].length; j++)
// 		{
// 			//hahahaha
// 			var token = "";
// 			if(i === nodeYHighlight && j === nodeXHighlight)
// 			{
// 				token = "(" + graph[i][j].type.toString() + ")";
// 			}
// 			else
// 			{
// 				token = graph[i][j].type.toString();
// 			}
// 			str += token + "\t";
// 		}
// 		str += "\n";
// 	}

// 	console.log(str);
// }



// //draw a shitty map
// function drawGraphWithArrows(graph, cameFromMapping, nodeXHighlight, nodeYHighlight) {
// 	var str = "";

	
// 	for(var i = 0; i < graph.length; i++)
// 	{
// 		//x axis
// 		if(i == 0)
// 		{
// 			str += "\t\t";
// 			for(var k = 0; k < graph[i].length; k++)
// 			{
// 				str += k + "\t";
// 			}
// 			str += "\n\n";
// 		}

// 		//y axis
// 		str += i + "\t\t";

// 		for(var j = 0; j < graph[i].length; j++)
// 		{
// 			//hahahaha
// 			var token = "";
// 			var temp = cameFromMapping[graph[i][j].id];
// 			if(temp)
// 			{
// 				token = temp.fromDir;
// 			}
// 			else
// 			{
// 				token = graph[i][j].type.toString();
// 			}

// 			str += token + "\t";
// 		}
// 		str += "\n";
// 	}

// 	console.log(str);
// }





exports.run = run;