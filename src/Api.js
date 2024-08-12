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

	/*async testFunc() {
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
	}*/

	async saveQuizResponse({name, email, answers, 
			emailTemplate, emailSubject, emailFromName, emailFromMail}) {
		let qql=this.ev.data.qql;

		let questions=await qql({manyFrom: "questions"});
		let alternatives=await qql({manyFrom: "alternatives"});
		let alternativesById=Object.fromEntries(alternatives.map(a=>[a.id,a]));
		let saveAnswers=questions.map(q=>({
			question: q.question,
			alternative: alternativesById[answers[q.id]]?.alternative,
		}));

		let saveScore=questions
			.map(q=>{
				let score=0;
				let alternative=alternativesById[answers[q.id]];
				if (alternative && alternative.score)
					score=alternative.score;

				return score;
			})
			.reduce((t,n)=>t+n);

		let results=await qql({manyFrom: "results"});
		for (let result of results)
			if (!result.score)
				result.score=0;

		results.sort((a,b)=>a.score-b.score);
		let saveResult=null;
		for (let result of results)
			if (saveScore>=result.score)
				saveResult=result;

		if (!saveResult)
			saveResult={};

		await qql({
			insertInto: "responses",
			set: {
				name: name,
				email: email,
				answers: saveAnswers,
				score: saveScore,
				tags: saveResult.tags
			}
		});

		if (emailTemplate) {
			console.log("mailing with template: "+emailTemplate);
			let mailBody=this._renderMail(emailTemplate,{
				name: name,
				title: saveResult.title,
				content: saveResult.content,
			});
			let rpc=createRpcProxy({
				url: this.ev.options.mailServiceUrl,
				headers: {
					"authorization": "Bearer "+this.ev.options.mailServiceKey
				}
			});
			await rpc.sendMail({
				fromMail: emailFromMail,
				fromName: emailFromName,
				toMail: email,
				toName: name,
				subject: emailSubject,
				htmlbody: mailBody,
				textbody: convertHtmlToText(mailBody)
			});

		}

		return saveResult;
	}
}
