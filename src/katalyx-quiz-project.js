import {quickminMergeConf} from "katnip-quickmin/server";

let quizQuickminConf=`
collections:
  questions:
    fields:
      <Text id="question" listable fullWidth/>
      <ReferenceMany id="alternatives" reference="alternatives" target="question_id"/>

  alternatives:
    category: hidden
    fields:
      <Reference id="question_id" reference="questions" disabled/>
      <Text id="alternative" listable fullWidth/>
      <Integer id="score" listable/>

  results:
    fields:
      <Text id="title" listable fullWidth/>
      <Integer id="score" listable/>
      <RichText id="content" fullWidth/>

  responses:
    access: [admin,public]
    fields:
      <Text id="email" listable fullWidth/>
      <Integer id="score" listable/>
      <Json id="answers" fullWidth/>
`;

export async function quickminConf(conf, ev) {
	console.log("Register quiz db...");
	Object.assign(conf,quickminMergeConf(quizQuickminConf,conf));	
}