<Page route="/">
	<div class="w-full font-bold bg-azure text-center p-10">Quiz Test</div>
	<QuizEnv completeModal="QuizComplete"
			emailTemplate="EmailTemplate"
			emailSubject="Hello and thank you for taking the quiz"
			emailFromName="Micke Quiz Maker"
			emailFromMail="li.mikael.spam@gmail.com">
		<div class="p-10">
			<div class="mb-5">
				<QuizCarouselQuestions>
					<div class="text-center mb-5">
						<Val class="text-4xl" expr="$question"/>
					</div>

					<div class="text-center">
						<QuizForAlternatives>
							<If expr="$selected">
								<QuizAlternativeButton class="rounded border border-azure p-3 m-3 inline-block bg-azure">
									<Val expr="$alternative"/>
								</QuizAlternativeButton>
							</If>

							<If test="notTrue" expr="$selected">
								<QuizAlternativeButton class="rounded border border-azure p-3 m-3 inline-block">
									<Val expr="$alternative"/>
								</QuizAlternativeButton>
							</If>
						</QuizForAlternatives>
					</div>
				</QuizCarouselQuestions>
			</div>

			<div class="text-center mb-5">
				<QuizForQuestions>
					<If test="eq" var="index" expr="$quizQuestionIndex">
						<div class="inline-block rounded-full w-3 h-3 mx-3 bg-azure"/>
					</If>
					<If test="notEq" var="index" expr="$quizQuestionIndex">
						<div class="inline-block rounded-full w-3 h-3 mx-3 bg-black opacity-25"/>
					</If>
				</QuizForQuestions>
			</div>

			<div class="text-center mb-5">
				<QuizPrevButton class="p-3 bg-azure rounded mx-5 w-32">Prev</QuizPrevButton>
				<QuizNextButton class="p-3 bg-azure rounded mx-5 w-32">
					<If test="eq" var="quizQuestionIndex" expr="$quizLastQuestionNum">
						Get Results
					</If>

					<If test="notEq" var="quizQuestionIndex" expr="$quizLastQuestionNum">
						Next
					</If>
				</QuizNextButton>
			</div>
		</div>
	</QuizEnv>
</Page>