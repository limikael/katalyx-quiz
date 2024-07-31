/*
todo:
2. add questions and header to csv
*/

import FileSaver from "file-saver";
import Papa from 'papaparse';
import dayjs from 'dayjs';

async function exportResponses({qql, responses}) {
	let questions=[];
	for (let response of responses) {
		for (let answer of response.answers)
			if (!questions.includes(answer.question))
				questions.push(answer.question);
	}

	let responsesArray=[];

	responsesArray.push(["Name","Email","Score","Tags",...questions]);
	for (let response of responses) {
		let row=[response.name,response.email,response.score,response.tags];
		let answerByQuestion=Object.fromEntries(response.answers.map(a=>[a.question,a.alternative]));

		for (let q of questions)
			row.push(answerByQuestion[q]);

		responsesArray.push(row);
	}

	let csvFile=Papa.unparse(responsesArray);
	let blob=new Blob([csvFile], {type: "text/csv;charset=utf-8"});
	FileSaver.saveAs(blob, "responses-"+dayjs().format("YYYY-MM-DD")+".csv");
}

export async function exportSelectedResults({qql, ids}) {
	console.log("exporting selected...");
	let responses=await qql({
		manyFrom: "responses",
		where: {
			id: ids
		}
	});

	await exportResponses({qql, responses});
}

export async function exportAllResults({qql}) {
	console.log("exporting all...");
	let responses=await qql({
		manyFrom: "responses"
	});

	await exportResponses({qql, responses});
}