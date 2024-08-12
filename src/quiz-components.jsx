import {Env, ForCarousel, For, useVar, useVal, VarState, useEnv, ValInput, If} from "katnip-components";
import {useConstructor} from "./react-util.jsx";
import {useIsoMemo, useIsoContext} from "isoq";
import {useQql} from "katnip-quickmin/react";
import {useRedirect} from "isoq-router";
import {useComponentLibrary} from "katnip-components";
import {createRpcProxy} from "fullstack-rpc/client";
import {SpinnerButton, Modal, ModalProvider, useShowModal, useDismissModal, ErrorModal, useModalCatch} from "./site-utils.jsx";

export function MailTestButton() {
	let iso=useIsoContext();
	let proxy=createRpcProxy({
		fetch: iso.fetch,
		url: iso.getAppUrl("quiz-functions")
	});

	async function handleClick() {
		console.log("sending mail...");
		let res=await proxy.testFunc();
		console.log("func return: "+res);
	}

	return (
		<button class="bg-azure p-10 rounded-full" onClick={handleClick}>Send a mail</button>
	);
}

MailTestButton.editorPreview=props=><button class="bg-azure p-10 rounded-full">Send a mail</button>;

export function QuizEnv({completeModal, completeHref,
		emailTemplate, emailSubject, emailFromName, emailFromMail,
		children}) {
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
		quizName: "",
		quizEmail: "",
		quizCompleteModal: components[completeModal],
		quizCompleteHref: completeHref,
		quizEmailTemplate: emailTemplate,
		quizEmailSubject: emailSubject,
		quizEmailFromName: emailFromName,
		quizEmailFromMail: emailFromMail
	};

	function createVarStates() {
		return {
			quizResult: new VarState({sessionStorageKey: "quizResult"})
		}
	}

	let CompleteModal=components[completeModal];

	function QuizModal() {
		let quizShowPopupVar=useVar("quizShowPopup");

		if (quizShowPopupVar.get())
			return (
				<Modal onDismiss={()=>quizShowPopupVar.set(false)}>
					<CompleteModal/>
				</Modal>
			);
	}

	return (
		<ModalProvider>
			<Env declarations={declarations} createVarStates={createVarStates}>
				{children}
				<QuizModal/>
			</Env>
		</ModalProvider>
	);
}

QuizEnv.editorPreview=props=><>{props.children}</>;
QuizEnv.category="Quiz";
QuizEnv.controls={
	completeModal: {type: "block"},
	completeHref: {},
	emailTemplate: {type: "block"},
	emailSubject: {},
	emailFromName: {},
	emailFromMail: {},
}
QuizEnv.icon = {
	type: "material",
	symbol: "inbox_customize"
}

export function QuizResult({children}) {
	function createVarStates() {
		return {
			quizResult: new VarState({sessionStorageKey: "quizResult"})
		}
	}

	function QuizResultInner({children}) {
		let result=useVal("quizResult");
		if (!result)
			result={
				title: "No Result",
				content: "No result yet"
			};

		return (
			<Env declarations={result}>
				{children}
			</Env>
		);
	}

	if (!globalThis.window)
		return;

	return (
		<Env createVarStates={createVarStates}>
			<QuizResultInner>
				{children}
			</QuizResultInner>
		</Env>
	);
}

QuizResult.editorPreview=props=><>{props.children}</>;
QuizResult.category="Quiz";
QuizResult.icon = {
	type: "material",
	symbol: "inbox_customize"
}

export function QuizResultCtaButton({class: cls}) {
	let result=useVal("quizResult");

	if (!result || !result.ctaHref)
		return;

	return (
		<a class={cls} href={result.ctaHref}>
			{result.ctaText}
		</a>
	);
}

QuizResultCtaButton.editorPreview=props=><button class={props.class}>CALL TO ACTION</button>;
QuizResultCtaButton.category="Quiz";
QuizResultCtaButton.styling=true;
QuizResultCtaButton.icon = {
	type: "material",
	symbol: "call_to_action"
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

export function QuizNameInput({...props}) {
	return (
		<ValInput var="quizName" {...props}/>
	);
}

QuizNameInput.editorPreview=props=><input {...props} value={"$name"}/>;
QuizNameInput.styling=true;
QuizNameInput.category="Quiz";
QuizNameInput.displayName = "NameInput";
QuizNameInput.icon = {
	type: "material",
	symbol: "badge"
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
	let emailTemplate=useVal("quizEmailTemplate");
	let emailSubject=useVal("quizEmailSubject");
	let emailFromName=useVal("quizEmailFromName");
	let emailFromMail=useVal("quizEmailFromMail");
	let name=useVal("quizName");
	let answers=useVal("quizAnswers");
	let resultsVar=useVar("quizResult");
	let completeHref=useVal("quizCompleteHref");
	let qql=useQql();
	let redirect=useRedirect();
	let iso=useIsoContext();
	let modalCatch=useModalCatch();
	let dismissModal=useDismissModal();
	let rpc=createRpcProxy({
		fetch: iso.fetch,
		url: iso.getAppUrl("quiz-functions")
	});

	async function handleClick() {
		if (!email.trim())
			throw new Error("Please enter a valid email address");

		console.log("handle click");
		let saveResult=await rpc.saveQuizResponse({
			name, email, answers, 
			emailTemplate, emailSubject, emailFromName, emailFromMail
		});
		resultsVar.set(saveResult);
		console.log(saveResult);

		if (href)
			redirect(iso.getAppUrl(href));

		else if (completeHref)
			redirect(iso.getAppUrl(completeHref));
	}

	return (
		<SpinnerButton {...props} onClick={handleClick}>
			{children}
		</SpinnerButton>
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