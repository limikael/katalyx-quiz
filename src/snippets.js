import {snippet1, snippet2} from "./icons.js";

export const QuizSnippetTwo = {
	displayName: "Snippet 1",
	category: "Quiz Snippets",
	icon: snippet1,
	blocks: {
		"QuizDone": `
			<Block>
				<div class="bg-white p-10 text-center">
					<div class="text-2xl mb-5">
						Get Results
					</div>
					<div class="mb-5">
						Please input your email address and we will contact you!
					</div>
					<div class="mb-5">
						<QuizEmailInput class="border p-3 w-full"/>
					</div>
					<QuizSubmitButton class="p-3 bg-primary text-primaryContent rounded mx-5 w-32" href="/thankyou">
						Get Results
					</QuizSubmitButton>
				</div>
			</Block>
		`
	},
	content: `
		<QuizEnv completeModal="QuizDone">
			<div class="p-10 h-full pt-16 bg-gradient-to-b from-primary/30 to-secondary/30">
				<div class="py-5 mx-auto">
					<QuizCarouselQuestions>
						<div class="text-center mb-10 max-w-6xl m-auto">
							<Val class="text-4xl font-bold" expr="$question"/>
						</div>
						<div class="flex flex-wrap justify-center gap-4 max-w-6xl m-auto">
							<QuizForAlternatives>
								<If expr="$selected">
									<QuizAlternativeButton class="w-5/12 bg-secondary text-secondaryContent hover:bg-secondary hover:text-secondaryContent text-black text-left rounded p-3 inline-block cursor-pointer">
										<Val expr="$alternative"/>
									</QuizAlternativeButton>
								</If>
								<If test="notTrue" expr="$selected">
									<QuizAlternativeButton class="w-5/12 bg-black hover:bg-secondary hover:text-secondaryContent text-white text-left rounded p-3 inline-block cursor-pointer">
										<Val expr="$alternative"/>
									</QuizAlternativeButton>
								</If>
							</QuizForAlternatives>
						</div>
					</QuizCarouselQuestions>
				</div>
				<div class="text-center mb-10 w-fit border border-primary rounded-full m-auto flex">
					<QuizForQuestions>
						<If test="eq" var="index" expr="$quizQuestionIndex">
							<div class="inline-block w-16 h-3  bg-primary rounded-full"/>
						</If>
						<If test="notEq" var="index" expr="$quizQuestionIndex">
							<div class="inline-block w-16 h-3 bg-white opacity-25"/>
						</If>
					</QuizForQuestions>
				</div>
				<div class="text-center mb-5">
					<QuizPrevButton class="p-3 bg-primary text-primaryContent rounded mx-5 w-32 hover:bg-secondary hover:text-secondaryContent">
						Prev
					</QuizPrevButton>
					<QuizNextButton class="p-3 bg-primary text-primaryContent rounded mx-5 w-32 hover:bg-secondary hover:text-secondaryContent">
						Next
					</QuizNextButton>
				</div>
			</div>
		</QuizEnv>
				`
}


export const QuizSnippetThree = {
	displayName: "Snippet 2",
	category: "Quiz Snippets",
	icon: snippet2,
	blocks: {
		"QuizDone": `
			<Block>
				<div class="bg-white p-10 text-center">
					<div class="text-2xl mb-5">
						Get Results
					</div>
					<div class="mb-5">
						Please input your email address and we will contact you!
					</div>
					<div class="mb-5">
						<QuizEmailInput class="border p-3 w-full"/>
					</div>
					<QuizSubmitButton class="p-3 bg-primary text-primaryContent rounded mx-5 w-32" href="/thankyou">
						Get Results
					</QuizSubmitButton>
				</div>
			</Block>
		`
	},
	content: `
		<QuizEnv completeModal="QuizDone">
			<div class="p-10 h-full pt-16 bg-gradient-to-b from-primary/30 to-secondary/30">
				<div class="text-center w-fit border border-primary rounded-full m-auto flex -">
					<QuizForQuestions>
						<If test="eq" var="index" expr="$quizQuestionIndex">
							<div class="inline-block w-16 h-3  bg-primary rounded-full"/>
						</If>
						<If test="notEq" var="index" expr="$quizQuestionIndex">
							<div class="inline-block w-16 h-3 bg-white opacity-25"/>
						</If>
					</QuizForQuestions>
				</div>
				<div class="py-5 mx-auto">
					<QuizCarouselQuestions>
						<div class="text-center mb-10 m-auto max-w-4xl">
							<Val class="text-4xl font-bold" expr="$question"/>
						</div>
						<div class="flex flex-wrap gap-4 max-w-2xl m-auto flex-col justify-center items-center">
							<QuizForAlternatives>
								<If expr="$selected">
									<QuizAlternativeButton class="w-full text-secondaryContent hover:bg-secondary hover:text-secondaryContent text-black text-left p-3 inline-block cursor-pointer border border-secondary rounded bg-secondary">
										<Val expr="$alternative"/>
									</QuizAlternativeButton>
								</If>
								<If test="notTrue" expr="$selected">
									<QuizAlternativeButton class="w-full hover:bg-secondary hover:text-secondaryContent text-left rounded p-3 inline-block cursor-pointer border bg-black text-white border-black">
										<Val expr="$alternative"/>
									</QuizAlternativeButton>
								</If>
							</QuizForAlternatives>
						</div>
					</QuizCarouselQuestions>
				</div>
				<div class="text-center mb-5">
					<QuizPrevButton class="p-3 bg-primary text-primaryContent rounded mx-5 w-32 hover:bg-secondary hover:text-secondaryContent">
						Prev
					</QuizPrevButton>
					<QuizNextButton class="p-3 bg-primary text-primaryContent rounded mx-5 w-32 hover:bg-secondary hover:text-secondaryContent">
						Next
					</QuizNextButton>
				</div>
			</div>
		</QuizEnv>
		`
}




