const {GlobalFuncs} = require("./global-funcs.js");

async function run()
{
	console.log('--- nodes-only START ---');

	var world = [];
	var nodes = [];
	var edges = [];

	var mapWidth = 30;
	var mapHeight = 15;
	
	var worldTileId = 0;
	var nodeId = 0;
	var edgeId = 0;

	//create the world
	for(var j = 0; j < mapHeight; j++)
	{
		world.push([]);
		
		for(var i = 0; i < mapWidth; i++)
		{
			world[j].push({
				worldTileId: worldTileId++,
				x: i,
				y: j,
				type: "open"
			});
		}
	}

	//make a node for each coordinage
	for(var j = 0; j < mapHeight; j++)
	{
		nodes.push([]);
		
		for(var i = 0; i < mapWidth; i++)
		{
			nodes[j].push({
				id: nodeId++,
				x: i,
				y: j
			});
		}
	}

	//create edges fore each node
	for(var j = 0; j < nodes.length; j++)
	{
		for(var i = 0; i < nodes[j].length; i++)
		{
			var currentNode = nodes[j][i];
			var potentialNeighbors = [];
			var coordSum = j + i;
			var isEven = (coordSum % 2) == 0 ? true : false;

			//even nodes, do CCW, N, W, S E
			if(isEven)
			{
				
				
				
				potentialNeighbors.push({x: currentNode.x+1, y:currentNode.y, dir:'east'});
				potentialNeighbors.push({x: currentNode.x, y:currentNode.y-1, dir:'north'});
				potentialNeighbors.push({x: currentNode.x-1, y:currentNode.y, dir:'west'});
				potentialNeighbors.push({x: currentNode.x, y:currentNode.y+1, dir:'south'});
			}
			//odd nodes, do CW, E, S, W, N
			else
			{
				potentialNeighbors.push({x: currentNode.x, y:currentNode.y+1, dir:'south'});
				potentialNeighbors.push({x: currentNode.x-1, y:currentNode.y, dir:'west'});
				potentialNeighbors.push({x: currentNode.x, y:currentNode.y-1, dir:'north'});
				potentialNeighbors.push({x: currentNode.x+1, y:currentNode.y, dir:'east'});
				
				
				
			}

			for(var k = 0; k < potentialNeighbors.length; k++)
			{
				var neigh = potentialNeighbors[k];
				//check to see if the node exists
				if(neigh.y >= 0 
					&& neigh.y < nodes.length 
					&& neigh.x >= 0 
					&& neigh.x < nodes[neigh.y].length)
				{
					edges.push({
						id: edgeId++,
						nodeFrom: currentNode,
						nodeTo: nodes[neigh.y][neigh.x],
						dir: neigh.dir
					});
				}
			}
		}
	}

	//start in center, put in some walls for the world
	//var startNode = nodes[3][3];
	// world[2][1].type = "wall";
	// world[1][1].type = "wall";
	// world[2][3].type = "wall";
	// world[2][6].type = "wall";
	

	// //little maze
	//var startNode = nodes[6][0];
	// world[2][1].type = "wall";
	// world[1][1].type = "wall";
	// world[2][3].type = "wall";
	// world[2][6].type = "wall";

	// world[0][5].type = "wall";
	// world[1][5].type = "wall";

	// world[5][5].type = "wall";
	// world[6][5].type = "wall";

	// world[3][3].type = "wall";

	// world[5][3].type = "wall";
	// world[5][2].type = "wall";

	// world[6][1].type = "wall";


	//redblobgames example
	var startNode = nodes[7][8];
	makeWall(world, nodes[3][3], nodes[11][4]);
	makeWall(world, nodes[4][13], nodes[14][14]);
	makeWall(world, nodes[0][21], nodes[4][22]);
	makeWall(world, nodes[5][21], nodes[7][25]);


	console.log("WORLD:");
	drawWorld(world, nodes);

	//draw an edge map
	var edgeMap = breadthFirstEdgeMap(world, nodes, edges, startNode);
	console.log("BREADTH FIRST EDGE MAP:");
	drawWorld(world, nodes, edgeMap);


	//try a search
	var searchResults = breadthFirstSearch(world, nodes, edges, startNode, nodes[4][12]);
	console.log("BREADTH FIRST SEARCH:");
	drawWorld(world, nodes, searchResults.edges);

	var searchResults = breadthFirstSearch(world, nodes, edges, startNode, nodes[4][23]);
	console.log("BREADTH FIRST SEARCH:");
	drawWorld(world, nodes, searchResults.edges);


	//perform an edge map for every node (just to see what happens)
	// var edgeMaps = []
	// for(var j = 0; j < nodes.length; j++)
	// {
	// 	for(var i = 0; i < nodes[j].length; i++)
	// 	{
	// 		var temp = breadthFirstEdgeMap(world, nodes, edges, nodes[j][i]);
	// 		edgeMaps.push(temp);
	// 	}
	// }

	// for(var i = 0; i < edgeMaps.length; i++)
	// {
	// 	drawWorld(world, nodes, edgeMaps[i]);
	// }
	

	console.log('--- nodes-only DONE ---');
}

function makeWall(world, tlNode, brNode)
{
	for(var j = tlNode.y; j <= brNode.y; j++)
	{
		for(var i = tlNode.x; i <= brNode.x; i++)
		{
			world[j][i].type = "wall";
		}
	}
}


//draws the world with the nodes hihglighted and edges shown
//example
/*
	console.log('  ^  \t  ^  \t ');
	console.log('< 0 >\t< 1 >\t ');
	console.log('  v  \t  v  \t ');
	console.log('  ^  \t  ^  \t ');
	console.log('< 0 >\t< 1 >\t ');
	console.log('  v  \t  v  \t ');
*/
function drawWorld(world, nodes, edges)
{
	if(!edges)
		edges = []

	var drawCells = [];
	
	//make drawing cell for each world coordinate (+1 for the axis)
	for(var j = 0; j < world.length + 1 ; j++)
	{
		drawCells.push([]);
		for(var i = 0; i < world[0].length + 1; i++)
		{
			drawCells[j].push({
				topPart: "",
				midPart: "",
				botPart: ""
			});
		}
	}

	
	//go through each world/node and see what do draw, and store those in each drawing cell
	for(var j = 0; j < drawCells.length ; j++)
	{
		//x axis
		if(j == drawCells.length-1)
		{
			for(var i = 0; i < drawCells[j].length; i++)
			{
				drawCells[j][i].topPart = "     ";
				drawCells[j][i].midPart = "  " + i + "  ";
				drawCells[j][i].botPart = "     ";
			}
		}
		else
		{
			for(var i = 0; i < drawCells[j].length; i++)
			{
				//y axis
				if(i == drawCells[j].length-1)
				{
					drawCells[j][i].topPart = "     ";
					drawCells[j][i].midPart = "  " + j + "  ";
					drawCells[j][i].botPart = "     ";
				}

				//draw the cell
				else
				{
					var graphic = "-"
					var upDir = " ";
					var leftDir = " ";
					var downDir = " ";
					var rightDir = " ";

					var worldTile = world[j][i];
					var node = nodes[j][i];

					if(!world[j][i])
					{
						var stopHere = true;
					}
					if(world[j][i].type == "wall")
					{
						graphic = "X"
					}

					//don't care.....
					var drawEdges = edges.filter((e) => {return e.nodeFrom.id === node.id;});
					for(var e = 0; e < drawEdges.length; e++)
					{
						if(drawEdges[e].dir == "north")
							upDir = "^";
						else if(drawEdges[e].dir == "east")
							rightDir = ">";
						else if(drawEdges[e].dir == "south")
							downDir = "v";
						else if(drawEdges[e].dir == "west")
							leftDir = "<";
					}
					

					drawCells[j][i].topPart = "  " + upDir + "  ";
					drawCells[j][i].midPart = leftDir + " " + graphic + " " + rightDir;
					drawCells[j][i].botPart = "  " + downDir + "  ";
				}
			}
		}
	}

	//join the strings, and draw them to the screen
	for(var j = 0; j < drawCells.length ; j++)
	{
		var arrTopParts = [];
		var arrMidParts = [];
		var arrBotParts = [];
		for(var i = 0; i < drawCells[j].length; i++)
		{
			arrTopParts.push(drawCells[j][i].topPart);
			arrMidParts.push(drawCells[j][i].midPart);
			arrBotParts.push(drawCells[j][i].botPart);
		}

		console.log(arrTopParts.join("\t"));
		console.log(arrMidParts.join("\t"));
		console.log(arrBotParts.join("\t"));
	}
}



//returns the nodes and edges from start using breadthFirst. Basically returns an edge map to every node from the start point.
function breadthFirstEdgeMap(world, nodes, edges, nodeStart)
{
	var edgeMap = [];

	var frontier = [];
	var visited = [];

	frontier.push(nodeStart);

	while(frontier.length > 0)
	{
		var currentFrontierNode = frontier.shift();

		//add it to visitor
		visited.push(currentFrontierNode);

		//get any edges it may have (and therefore its neighbors)
		var currentFrontierNodeEdges = edges.filter((x) => {return x.nodeFrom.id === currentFrontierNode.id;});
		for(var j = 0; j < currentFrontierNodeEdges.length; j++)
		{
			//check first to see if its impassibla (wall)
			var neighborNodeInQuestion = currentFrontierNodeEdges[j].nodeTo;
			var worldTile = world[neighborNodeInQuestion.y][neighborNodeInQuestion.x]
			if(worldTile.type === "wall")
			{
				//do nothing
			}
			else
			{
				//if the neighbor hasn't been visited yet and is not already in the frontier, add it to the frontier
				var visitedNode = visited.find((x) => {return x.id === neighborNodeInQuestion.id;});
				if(!visitedNode)
				{
					//add its neighbors to the frontier
					frontier.push(neighborNodeInQuestion);
					visited.push(neighborNodeInQuestion);
								
					//add the one edge to the edge map
					var edgeToAdd = edges.find((x) => {return x.nodeFrom.id === neighborNodeInQuestion.id && x.nodeTo.id === currentFrontierNode.id})
					if(edgeToAdd)
					{
						edgeMap.push(edgeToAdd)
					}
				}
			}
		}
	}

	return edgeMap;
}



//returns the nodes and edges from start to the end using breadthFirst
function breadthFirstSearch(world, nodes, edges, nodeStart, nodeEnd)
{
	var edgeMap = [];
	var path = {
		nodes: [],
		edges: []
	}

	var frontier = [];
	var visited = [];

	frontier.push(nodeStart);
	var nodeFound = false;

	while(frontier.length > 0 && !nodeFound)
	{
		var currentFrontierNode = frontier.shift();

		//add it to visitor
		visited.push(currentFrontierNode);

		if(currentFrontierNode.id === nodeEnd.id)
		{
			nodeFound = true;
		}

		if(!nodeFound)
		{
			//get any edges it may have (and therefore its neighbors)
			var currentFrontierNodeEdges = edges.filter((x) => {return x.nodeFrom.id === currentFrontierNode.id;});
			for(var j = 0; j < currentFrontierNodeEdges.length; j++)
			{
				//check first to see if its impassibla (wall)
				var neighborNodeInQuestion = currentFrontierNodeEdges[j].nodeTo;
				var worldTile = world[neighborNodeInQuestion.y][neighborNodeInQuestion.x]
				if(worldTile.type === "wall")
				{
					//do nothing
				}
				else
				{
					//if the neighbor hasn't been visited yet and is not already in the frontier, add it to the frontier
					var visitedNode = visited.find((x) => {return x.id === neighborNodeInQuestion.id;});
					if(!visitedNode)
					{
						//add its neighbors to the frontier
						frontier.push(neighborNodeInQuestion);
						visited.push(neighborNodeInQuestion);
									
						//add the one edge to the edge map
						var edgeToAdd = edges.find((x) => {return x.nodeFrom.id === neighborNodeInQuestion.id && x.nodeTo.id === currentFrontierNode.id})
						if(edgeToAdd)
						{
							edgeMap.push(edgeToAdd)
						}
					}
				}
			}
		}
	}

	//if the node was found, find it in the visited nodes, and work backwards to the start
	if(nodeFound) {

		var startNodeFound = false;
		var currentNode = nodeEnd;
		var tempPathNodes = [];
		var tempPathEdges = [];

		//first get the actual path from the edges visited from end to start
		while(!startNodeFound)
		{
			//brute force searching method. meh, whatever
			if(currentNode.id === nodeStart.id)
			{
				startNodeFound = true;
			}
			else
			{
				//there should be exactly 1 edge per node
				var nextEdge = edgeMap.find((x) => {return x.nodeFrom.id === currentNode.id;});
				if(nextEdge)
				{
					tempPathNodes.push(currentNode);
					tempPathEdges.push(nextEdge);
	
					currentNode = nextEdge.nodeTo;
				}
			}
		}


		//now that we have the path, reverse the nodes/edges so that we can rebuild it from start to end
		for(var i = tempPathEdges.length-1; i >= 0; i--)
		{
			path.nodes.push(tempPathEdges[i].nodeTo);

			//find the edge that is the opposite way
			var oppositeEdge = edges.find((x) => {return x.nodeTo === tempPathEdges[i].nodeFrom && x.nodeFrom === tempPathEdges[i].nodeTo});
			if(oppositeEdge)
			{
				path.edges.push(oppositeEdge);
			}
		}
	}

	//debugging
	path.edgeMap = edgeMap;

	return path;
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