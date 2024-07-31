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
      <RichText id="content" fileUpload="false" fullWidth/>
      <Text id="ctaText" helperText="Text for the Call To Action button"/>
      <Text id="ctaHref" helperText="Link for the Call To Action button"/>

  responses:
    access: [admin,public]
    actions:
    - name: Export
      type: module
      url: /client.js
      method: exportSelectedResults
      scope: multiple
    - name: Export All
      type: module
      url: /client.js
      method: exportAllResults
      scope: global
    fields:
      <Text id="name" listable fullWidth/>
      <Text id="email" listable fullWidth/>
      <Integer id="score" listable/>
      <Text id="tags" listable fullWidth filter="substr" helperText="List of tags to be used by external systems, separated by space."/>
      <Json id="answers" fullWidth/>
`;

export async function quickminConf(conf, ev) {
	console.log("Register quiz db...");
	Object.assign(conf,quickminMergeConf(quizQuickminConf,conf));	
}