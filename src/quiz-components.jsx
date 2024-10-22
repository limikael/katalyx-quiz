import {useVarExpr, useNewVal, useNewAction, Env} from "katnip-components";

export function QuizEnv({children}) {
	let answers=useNewVal({});
	let submitQuiz=useNewAction(()=>{
		console.log("hello world");
	});

	return (
		<Env varStates={{answers, submitQuiz}}>
			{children}
		</Env>
	);
}

QuizEnv.editorPreview=({children})=><div>{children}</div>;
QuizEnv.containerType="children";
QuizEnv.envSpec={
	answers: {},
	submitQuiz: {type: "action"}
};
QuizEnv.controls={
};
