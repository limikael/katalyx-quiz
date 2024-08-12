<Block>
	<div class="bg-azure p-5 font-bold text-center mb-5">
		Quiz Result
	</div>
	<p class="mb-5">
		Hello&#160;<Val expr="$name"/>, 
	</p>
	<p>
		Thank you for taking the quiz, these are your results:
	</p>
	<div class="bg-azure p-10">
		<div class="mb-5 font-bold text-center text-4xl">
			<Val expr="$title"/>
		</div>
		<div class="max-w-prose mx-auto">
			<ValRichText expr="$content"/>
		</div>
	</div>
	<div class="bg-black text-white text-center p-10">
		Footer...
	</div>
</Block>