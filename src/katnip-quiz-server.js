import {RpcServer} from "fullstack-rpc/server";
import Api from "./Api.js";
import urlJoin from "url-join";

export function start(ev) {
	let path="quiz-functions";
	if (ev.appPathname)
		path=urlJoin(ev.appPathname,path);

	//console.log("start event: pathname="+ev.appPathname);

	ev.data.quizRpcServer=new RpcServer(path);

	if (!ev.importModules.isoqRequestHandler.CJSX_COMPONENTS)
		throw new Error("cjsx components not exposed");
}

export function fetch(req, ev) {
	return ev.data.quizRpcServer.handleRequest(req,{
		handlerFactory: ()=>new Api(ev)
	});
}
