import {Env, ForCarousel, For, useVar, useVal, VarState, useEnv, ValInput} from "katnip-components";
import {useConstructor} from "./react-util.jsx";
import {useIsoMemo, useIsoContext} from "isoq";
import {useQql} from "katnip-quickmin/react";
import {Modal} from "./components.jsx";
import {useRedirect} from "isoq-router";
import {useComponentLibrary} from "katnip-components";

export function QuizEnv({completeModal, children}) {
	let components=useComponentLibrary();
	let qql=useQql();
	let quizQuestions=useIsoMemo(()=>qql({manyFrom: "questions"}));

	if (!quizQuestions)
		return;

	let declarations={
		quizQuestionIndex: 0, 
		quizAnswers: {},
		quizQuestions: quizQuestions,
		quizLastQuestionNum: quizQuestions.length-1,
		quizShowPopup: false,
		quizEmail: "",
		quizCompleteModal: components[completeModal]
	};

	let CompleteModal=components[completeModal];

	return (
		<Env declarations={declarations}>
			{children}
			<Modal showVar="quizShowPopup">
				<CompleteModal/>
			</Modal>
		</Env>
	);
}

QuizEnv.editorPreview=props=><>{props.children}</>;
QuizEnv.category="Quiz";
QuizEnv.controls={
	completeModal: {type: "block"}
}
QuizEnv.icon = {
	type: "material",
	symbol: "inbox_customize"
}

export function QuizCarouselQuestions({children}) {
	return (
		<ForCarousel in="questions" indexVar="quizQuestionIndex">
			{children}
		</ForCarousel>
	);
}

QuizCarouselQuestions.editorPreview=props=><>{props.children}</>;
QuizCarouselQuestions.category="Quiz";
QuizCarouselQuestions.displayName="QuestionsCarousel"
QuizCarouselQuestions.icon = {
	type: "material",
	symbol: "view_carousel"
}


export function QuizForQuestions({children}) {
	return (
		<For in="questions">
			{children}
		</For>
	);
}

QuizForQuestions.editorPreview=props=><>{props.children}</>;
QuizForQuestions.category="Quiz";
QuizForQuestions.displayName = "ProgressLoop";
QuizForQuestions.icon = {
	type: "material",
	symbol: "steppers"
}



export function QuizAlternativeButton({class: className, children}) {
	let questionId=useVal("questions:id");
	let alternativeId=useVal("alternatives:id");
	let answersVar=useVar("quizAnswers");
	let quizQuestions=useVal("quizQuestions");

	function handleClick() {
		let answers=answersVar.get();
		answers[questionId]=alternativeId;
		answersVar.set({...answers});
	}

	return (
		<button class={className}
				onClick={handleClick}>
			{children}
		</button>
	);
}

QuizAlternativeButton.editorPreview=props=><button class={props.class}>{props.children}</button>;
QuizAlternativeButton.styling=true;
QuizAlternativeButton.category="Quiz";
QuizAlternativeButton.displayName = "AnswerButton"
QuizAlternativeButton.icon = {
	type: "material",
	symbol: "fact_check"
}

function AlternativeEnv({children}) {
	let questionId=useVal("questions:id");
	let alternativeId=useVal("alternatives:id");
	let answers=useVal("quizAnswers");
	let selectedVar=useConstructor(()=>new VarState());
	selectedVar.set(answers[questionId]==alternativeId);

	return (
		<Env varStates={{selected: selectedVar}}>
			{children}
		</Env>
	);
}

export function QuizForAlternatives({children}) {
	return (
		<For in="alternatives" where={{question_id: "$id"}}>
			<AlternativeEnv>
				{children}
			</AlternativeEnv>
		</For>
	);	
}

QuizForAlternatives.editorPreview=props=><>{props.children}</>;
QuizForAlternatives.category="Quiz";
QuizForAlternatives.displayName = "AnswersLoop";
QuizForAlternatives.icon = {
	type: "material",
	symbol: "laps"
}


export function QuizPrevButton({children, ...props}) {
	let quizQuestionIndexVar=useVar("quizQuestionIndex");

	function handleClick() {
		if (quizQuestionIndexVar.get()>0)
			quizQuestionIndexVar.set(quizQuestionIndexVar.get()-1);
	}

	return (
		<button {...props} onClick={handleClick}>
			{children}
		</button>
	);
}

QuizPrevButton.editorPreview=props=><button class={props.class}>{props.children}</button>;
QuizPrevButton.styling=true;
QuizPrevButton.category="Quiz";
QuizPrevButton.displayName = "Back";
QuizPrevButton.icon = {
	type: "material",
	symbol: "switch_right"
}

export function QuizNextButton({children, ...props}) {
	let env=useEnv();
	let quizQuestions=useVal("quizQuestions");
	let quizQuestionIndexVar=useVar("quizQuestionIndex");

	function handleClick() {
		if (quizQuestionIndexVar.get()==quizQuestions.length-1)
			env.getVar("quizShowPopup").set(true);

		quizQuestionIndexVar.set(Math.min(
			quizQuestions.length-1,
			quizQuestionIndexVar.get()+1
		));
	}

	//console.log("cnt: "+questionCount);

	return (
		<button {...props}
				onClick={handleClick}>
			{children}
		</button>
	);
}

QuizNextButton.editorPreview=props=><button class={props.class}>{props.children}</button>;
QuizNextButton.styling=true;
QuizNextButton.category="Quiz";
QuizNextButton.displayName = "Next";
QuizNextButton.icon = {
	type: "material",
	symbol: "switch_left"
}

export function QuizEmailInput({...props}) {
	return (
		<ValInput var="quizEmail" {...props}/>
	);
}

QuizEmailInput.editorPreview=props=><input {...props} value={"$email"}/>;
QuizEmailInput.styling=true;
QuizEmailInput.category="Quiz";
QuizEmailInput.displayName = "EmailInput";
QuizEmailInput.icon = {
	type: "material",
	symbol: "alternate_email"
}


export function QuizSubmitButton({children, href, ...props}) {
	let email=useVal("quizEmail");
	let answers=useVal("quizAnswers");
	let qql=useQql();
	let redirect=useRedirect();
	let iso=useIsoContext();

	async function handleClick() {
		let questions=await qql({manyFrom: "questions"});
		let alternatives=await qql({manyFrom: "alternatives"});
		let alternativesById=Object.fromEntries(alternatives.map(a=>[a.id,a]));
		let saveAnswers=questions.map(q=>({
			question: q.question,
			alternative: alternativesById[answers[q.id]]?.alternative,
		}));

		console.log(saveAnswers);

		await qql({
			insertInto: "responses",
			set: {
				email: email,
				answers: saveAnswers
			}
		});
		redirect(iso.getAppUrl(href));
	}

	return (
		<button {...props} onClick={handleClick}>
			{children}
		</button>
	);
}

QuizSubmitButton.editorPreview=props=><button class={props.class}>{props.children}</button>;
QuizSubmitButton.styling=true;
QuizSubmitButton.category="Quiz";
QuizSubmitButton.controls={
	href: {}
}
QuizSubmitButton.displayName = "Submit";
QuizSubmitButton.icon = {
	type: "material",
	symbol: "send"
}