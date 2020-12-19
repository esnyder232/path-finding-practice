class GlobalFuncs {
	constructor(){}

	//a quick function to add some structure to the messages going across websockets
	// sendJsonEvent(socket, event, msg) {
	// 	if(!event)
	// 	{
	// 		event = "unknown"
	// 	}
	// 	if(!msg)
	// 	{
	// 		msg = ""
	// 	}
		
	// 	var data = {
	// 		event: event,
	// 		msg: msg
	// 	}
	// 	socket.send(JSON.stringify(data));
	// }

	
//sleep shittily
sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

}


exports.GlobalFuncs = GlobalFuncs;