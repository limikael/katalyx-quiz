import {transformHtmlEmail} from "html-email-transform";
import {createRpcProxy} from "fullstack-rpc/client";
import {convert as convertHtmlToText} from "html-to-text";
//import fs from "fs";

export default class Api {
	constructor(ev) {
		this.ev=ev
	}

	_renderMail(templateName, declarations) {
		let isoqRequestHandler=this.ev.importModules.isoqRequestHandler;
		let componentLibrary=isoqRequestHandler.CJSX_COMPONENTS;
		let {createElement}=isoqRequestHandler.react;
		let renderToString=isoqRequestHandler.renderToString;
		let {Env}=componentLibrary;
		let template=componentLibrary[templateName];

		let doc=createElement(Env,{declarations: declarations},[
			createElement(template)
		]);

		let docContent=renderToString(doc);
		let html=transformHtmlEmail(docContent,{
			css: this.ev.data.indexCss
		});

		return html;
	}

	async testFunc() {
		let mailBody=this._renderMail("EmailTemplate",{name: "Micke"});
		//fs.writeFileSync("/home/micke/Desktop/test.html",mailBody);
		//console.log(mailBody);
		//await this._sendMail(mailBody);

		let rpc=createRpcProxy({
			url: this.ev.options.mailServiceUrl,
			headers: {
				"authorization": "Bearer "+this.ev.options.mailServiceKey
			}
		});
		await rpc.sendMail({
			fromMail: "li.mikael.spam@gmail.com",
			fromName: "Micke Spammer",
			toMail: "li.mikael@gmail.com",
			toName: "Mikael",
			subject: "Testing Mail",
			htmlbody: mailBody,
			textbody: convertHtmlToText(mailBody)
		});

		return 123;
	}
}
