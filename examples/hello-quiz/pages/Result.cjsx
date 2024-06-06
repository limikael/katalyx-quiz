<Page route="/result">
	<div class="w-full font-bold bg-azure text-center p-10">Quiz Result</div>
	<QuizResult>
		<div class="p-10">
			<div class="mb-5 font-bold text-center text-4xl">
				<Val expr="$title"/>
			</div>
			<div class="max-w-prose mx-auto">
				<ValRichText expr="$content"/>
			</div>
		</div>
	</QuizResult>
</Page>