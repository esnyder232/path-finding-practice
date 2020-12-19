const {GlobalFuncs} = require('./global-funcs.js');

async function run()
{
	console.log('--- breadth-first-search START ---');
	var globalfuncs = new GlobalFuncs();
	var graph = [];
	var width = 9;
	var height = 4;
	var xStart = 3;
	var yStart = 1;
	
	
	//make a shitty graph
	for(var i = 0; i < height; i++)
	{
		graph.push([]);
		for(var j = 0; j < width; j++)
		{
			graph[i][j] = "-";
		}
	}

	//start
	graph[yStart][xStart] = "X";

	//walls
	graph[1][5] = "W"
	graph[2][5] = "W"
	graph[2][6] = "W"

	graph[2][1] = "W"
	graph[3][2] = "W"
	
	drawGraph(graph, xStart, yStart);

	var frontier = [];
	var reached = [];
	
	//start the frontier
	frontier.push({nodeNum: 0, x: xStart, y: yStart});
	reached.push({nodeNum: 0, x: xStart, y: yStart});

	var frameNum = 1;
	var nodeNum = 1;


	while(frontier.length > 0)
	{
		console.log('--- FRAME ' + frameNum + " ---");
		var curr = frontier.shift();
		console.log("curr: i: " + curr.nodeNum + ", x: " + curr.x + ", y: " + curr.y);

		var neighbors = getGraphNeighbors(graph, curr.x, curr.y, curr.nodeNum == 0);
		//logNeighbors(neighbors);

		for(var i = 0; i < neighbors.length; i++)
		{
			console.log('now processing neighbor ' + i + ": " + neighbors[i].x + " " + neighbors[i].y);
			var foundNode = reached.find((n) => {return n.x === neighbors[i].x && n.y === neighbors[i].y});
			if(!foundNode)
			{
				frontier.push(neighbors[i]);
				reached.push(neighbors[i]);
				graph[neighbors[i].y][neighbors[i].x] = nodeNum;
				nodeNum++;
			}
		}
		
		drawGraph(graph, curr.x, curr.y);

		frameNum++;

		//await globalfuncs.sleep(1000);
	}

	var stopHere = true;


	console.log('--- breadth-first-search DONE ---');
}

function getGraphNeighbors(graph, x, y, firstTime)
{
	var result = [];

	//north neighbor
	if(((y-1) >= 0) && ((y-1) < graph.length) && (x >= 0) && (x < graph[(y-1)].length) && graph[y-1][x] !== "W")
	{
		result.push({x: x, y: y-1});
	}
	//east neighbor
	if((y >= 0) && (y < graph.length) && ((x+1) >= 0) && ((x+1) < graph[y].length) && graph[y][x+1] !== "W")
	{
		result.push({x: x+1, y: y});
	}

	//south neighbor
	if(((y+1) >= 0) && ((y+1) < graph.length) && (x >= 0) && (x < graph[(y+1)].length) && graph[y+1][x] !== "W")
	{
		result.push({x: x, y: y+1});
	}

	//west neighbor
	if((y >= 0) && (y < graph.length) && ((x-1) >= 0) && ((x-1) < graph[y].length) && graph[y][x-1] !== "W")
	{
		result.push({x: x-1, y: y});
	}

	return result;
}


//probably going to do it again so...whatevr
function logNeighbors(neighbors) {
	console.log('Neighbors: ')
	for(var i = 0; i < neighbors.length; i++)
	{
		console.log(neighbors[i].x + " " + neighbors[i].y);
	}
}

//draw a shitty map
function drawGraph(graph, nodeXHighlight, nodeYHighlight) {
	var str = "";

	for(var i = 0; i < graph.length; i++)
	{
		//x axis
		if(i == 0)
		{
			str += "\t\t";
			for(var k = 0; k < graph[i].length; k++)
			{
				str += k + "\t";
			}
			str += "\n\n";
		}

		//y axis
		str += i + "\t\t";

		for(var j = 0; j < graph[i].length; j++)
		{
			//hahahaha
			var token = "";
			if(i === nodeYHighlight && j === nodeXHighlight)
			{
				token = "(" + graph[i][j].toString() + ")";
			}
			else
			{
				token = graph[i][j].toString();
			}
			str += token + "\t";
		}
		str += "\n";
	}

	console.log(str);
}

exports.run = run;