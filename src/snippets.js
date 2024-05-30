export const QuizSnippetOne={
	displayName: "QuizSnippet",
	imageUrl: "https://awefaefw",
	blocks: {
		QuizModal: {
			content: `<div></div>`
		}
	},
	content: `
<div>
  <QuizEnv popup="QuizModal">
  </QuizEnv>
</div>
`
}

export const QuizSnippetOne={
	displayName: "QuizSnippet",
	imageUrl: "https://awefaefw",
	blocks: {},
}

QuizSnippetOne.content=`
<div>
  <QuizEnv popup="QuizModal">
  </QuizEnv>
</div>
`

QuizSnippetOne.blocks["QuizModal.cjsx"]={content:`
<Block>
	<div/>
</Block>
`}

