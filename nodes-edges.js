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
	makeWorldBlockType(world, nodes[3][3], nodes[11][4], 'wall');
	makeWorldBlockType(world, nodes[4][13], nodes[14][14], 'wall');
	makeWorldBlockType(world, nodes[0][21], nodes[4][22], 'wall');
	makeWorldBlockType(world, nodes[5][21], nodes[7][25], 'wall');

	makeWorldBlockType(world, nodes[4][7], nodes[5][9], 'water');
	//makeWorldBlockType(world, nodes[5][6], nodes[5][10], 'water');

	console.log("WORLD:");
	drawWorld(world, nodes);

	//draw an edge map
	var edgeMap = breadthFirstEdgeMap(world, nodes, edges, startNode);
	console.log("BREADTH FIRST EDGE MAP:");
	drawWorld(world, nodes, edgeMap);


	//try a search
	// var searchResults = breadthFirstSearch(world, nodes, edges, startNode, nodes[4][12]);
	// console.log("BREADTH FIRST SEARCH:");
	// drawWorld(world, nodes, searchResults.edges);

	// var searchResults = breadthFirstSearch(world, nodes, edges, startNode, nodes[4][23]);
	// console.log("BREADTH FIRST SEARCH:");
	// drawWorld(world, nodes, searchResults.edges);

	// var searchResults = dijkstraSearch(world, nodes, edges, startNode, nodes[3][8]);
	// console.log("DIJKSTRA SEARCH:");
	// drawWorld(world, nodes, searchResults.edges);

	// var searchResults = greedyBestFirstSearch(world, nodes, edges, startNode,  nodes[4][23]);
	// console.log("GREEDY BEST FIRST SEARCH:");
	// drawWorld(world, nodes, searchResults.edges);


	var searchResults = aStarSearch(world, nodes, edges, startNode,  nodes[4][23]);
	console.log("A STAR SEARCH:");
	drawWorld(world, nodes, searchResults.edgeMap);



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

function makeWorldBlockType(world, tlNode, brNode, type)
{
	for(var j = tlNode.y; j <= brNode.y; j++)
	{
		for(var i = tlNode.x; i <= brNode.x; i++)
		{
			world[j][i].type = type;
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
					else if(world[j][i].type == "water")
					{
						graphic = "w"
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
		path = getPathFromEdgeMap(edgeMap, edges, nodeStart, nodeEnd);
	}


	//debugging
	path.edgeMap = edgeMap;

	return path;
}


//returns the nodes and edges from start to the end using dijkstra's algorithm
function dijkstraSearch(world, nodes, edges, nodeStart, nodeEnd)
{
	var edgeMap = [];
	var path = {
		nodes: [],
		edges: []
	}

	var frontier = [];
	var visited = [];

	frontier.push({node: nodeStart, costSoFar: 0});
	visited.push({node: nodeStart, costSoFar: 0});
	var nodeFound = false;

	while(frontier.length > 0 && !nodeFound)
	{
		//sort it so the lowest cost is in front
		frontier.sort((a, b) => {return a.costSoFar - b.costSoFar;});
		var currentFrontierNode = frontier.shift();

		if(currentFrontierNode.node.id === nodeEnd.id)
		{
			nodeFound = true;
		}

		if(!nodeFound)
		{
			//get any edges it may have (and therefore its neighbors)
			var currentFrontierNodeEdges = edges.filter((x) => {return x.nodeFrom.id === currentFrontierNode.node.id;});
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
					//if the neghibor hasn't been visited, or the last known cost to get TO the neighbor is higher than the current cost, then add it to the frontier
					var currentCostSoFar = currentFrontierNode.costSoFar;
					var visitedNode = visited.find((x) => {return x.node.id === neighborNodeInQuestion.id;});

					//calculate movement cost
					var movementCost = 1;
					if(worldTile.type == "open")
					{
						movementCost = 1;
					}
					else if (worldTile.type == "water")
					{
						movementCost = 5;
					}

					var newCost = currentCostSoFar + movementCost;

					if(!visitedNode || visitedNode.costSoFar > newCost)
					{
						//add its neighbors to the frontier
						frontier.push({node: neighborNodeInQuestion, costSoFar: currentCostSoFar + movementCost});
						visited.push({node: neighborNodeInQuestion, costSoFar: currentCostSoFar + movementCost});
									
						//add the one edge to the edge map
						var edgeToAdd = edges.find((x) => {return x.nodeFrom.id === neighborNodeInQuestion.id && x.nodeTo.id === currentFrontierNode.node.id})
						if(edgeToAdd)
						{
							edgeMap.push(edgeToAdd)
						}

						//do another check to see if its the end node.
						if(currentFrontierNode.node.id === nodeEnd.id)
						{
							nodeFound = true;
							break;
						}
					}
				}
			}
		}
	}

	//if the node was found, find it in the visited nodes, and work backwards to the start
	if(nodeFound) {
		path = getPathFromEdgeMap(edgeMap, edges, nodeStart, nodeEnd);
	}

	//debugging
	path.edgeMap = edgeMap;

	return path;
}


function getPathFromEdgeMap(edgeMap, allEdges, nodeStart, nodeEnd) {
	var path = {
		nodes: [],
		edges: []
	};

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
		var oppositeEdge = allEdges.find((x) => {return x.nodeTo === tempPathEdges[i].nodeFrom && x.nodeFrom === tempPathEdges[i].nodeTo});
		if(oppositeEdge)
		{
			path.edges.push(oppositeEdge);
		}
	}

	return path;
}





//returns the nodes and edges from start to the end using greedy best first searching
function greedyBestFirstSearch(world, nodes, edges, nodeStart, nodeEnd)
{
	var edgeMap = [];
	var path = {
		nodes: [],
		edges: []
	}

	var frontier = [];
	var visited = [];

	frontier.push({node: nodeStart, heuristic: 0});
	visited.push({node: nodeStart, heuristic: 0});
	var nodeFound = false;

	while(frontier.length > 0 && !nodeFound)
	{
		//sort it so the lowest heuristic is in front
		frontier.sort((a, b) => {return a.heuristic - b.heuristic;});
		var currentFrontierNode = frontier.shift();

		if(currentFrontierNode.node.id === nodeEnd.id)
		{
			nodeFound = true;
		}

		if(!nodeFound)
		{
			//get any edges it may have (and therefore its neighbors)
			var currentFrontierNodeEdges = edges.filter((x) => {return x.nodeFrom.id === currentFrontierNode.node.id;});
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
					//if the neghibor hasn't been visited, or the last known heuristic to get TO the neighbor is higher than the current heuristic, then add it to the frontier
					var visitedNode = visited.find((x) => {return x.node.id === neighborNodeInQuestion.id;});

					//calculate heuristic
					var heuristic = bestGreedyHeuristicFunction(neighborNodeInQuestion, nodeEnd);

					if(!visitedNode || visitedNode.heuristic > heuristic)
					{
						//add its neighbors to the frontier
						frontier.push({node: neighborNodeInQuestion, heuristic: heuristic});
						visited.push({node: neighborNodeInQuestion, heuristic: heuristic});
									
						//add the one edge to the edge map
						var edgeToAdd = edges.find((x) => {return x.nodeFrom.id === neighborNodeInQuestion.id && x.nodeTo.id === currentFrontierNode.node.id})
						if(edgeToAdd)
						{
							edgeMap.push(edgeToAdd)
						}

						//do another check to see if its the end node.
						if(currentFrontierNode.node.id === nodeEnd.id)
						{
							nodeFound = true;
							break;
						}
					}
				}
			}
		}
	}

	//if the node was found, find it in the visited nodes, and work backwards to the start
	if(nodeFound) {
		path = getPathFromEdgeMap(edgeMap, edges, nodeStart, nodeEnd);
	}

	//debugging
	path.edgeMap = edgeMap;

	return path;
}

function bestGreedyHeuristicFunction(nodeStart, nodeTarget)
{
	return Math.abs(nodeTarget.x - nodeStart.x) + Math.abs(nodeTarget.y - nodeStart.y);
}





//returns the nodes and edges from start to the end using A* algorithm
function aStarSearch(world, nodes, edges, nodeStart, nodeEnd)
{
	var edgeMap = [];
	var path = {
		nodes: [],
		edges: []
	}

	var frontier = [];
	var visited = [];

	frontier.push({node: nodeStart, costSoFar: 0, priority: 0});
	visited.push({node: nodeStart, costSoFar: 0, priority: 0});
	var nodeFound = false;

	while(frontier.length > 0 && !nodeFound)
	{
		//sort it so the lowest cost is in front
		frontier.sort((a, b) => {return a.priority - b.priority;});
		var currentFrontierNode = frontier.shift();

		if(currentFrontierNode.node.id === nodeEnd.id)
		{
			nodeFound = true;
		}

		if(!nodeFound)
		{
			//get any edges it may have (and therefore its neighbors)
			var currentFrontierNodeEdges = edges.filter((x) => {return x.nodeFrom.id === currentFrontierNode.node.id;});
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
					//if the neghibor hasn't been visited, or the last known cost to get TO the neighbor is higher than the current cost, then add it to the frontier
					var currentCostSoFar = currentFrontierNode.costSoFar;
					var visitedNode = visited.find((x) => {return x.node.id === neighborNodeInQuestion.id;});

					//calculate movement cost
					var movementCost = 1;
					if(worldTile.type == "open")
					{
						movementCost = 1;
					}
					else if (worldTile.type == "water")
					{
						movementCost = 5;
					}

					var newCost = currentCostSoFar + movementCost;

					if(!visitedNode || visitedNode.costSoFar > newCost)
					{
						//calculate heuristic
						var heuristic = bestGreedyHeuristicFunction(neighborNodeInQuestion, nodeEnd);

						//add its neighbors to the frontier
						frontier.push({node: neighborNodeInQuestion, costSoFar: newCost, priority: newCost + heuristic});
						visited.push({node: neighborNodeInQuestion, costSoFar: newCost, priority: newCost + heuristic});
									
						//add the one edge to the edge map
						var edgeToAdd = edges.find((x) => {return x.nodeFrom.id === neighborNodeInQuestion.id && x.nodeTo.id === currentFrontierNode.node.id})
						if(edgeToAdd)
						{
							edgeMap.push(edgeToAdd)
						}

						//do another check to see if its the end node.
						if(currentFrontierNode.node.id === nodeEnd.id)
						{
							nodeFound = true;
							break;
						}
					}
				}
			}
		}
	}

	//if the node was found, find it in the visited nodes, and work backwards to the start
	if(nodeFound) {
		path = getPathFromEdgeMap(edgeMap, edges, nodeStart, nodeEnd);
	}

	//debugging
	path.edgeMap = edgeMap;

	return path;
}





exports.run = run;