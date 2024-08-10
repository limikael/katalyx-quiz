import {makeCssInline, cssAddSelector, cssGetVariables, cssRemoveVariables} from "../src/css-util.js";
import {HTML_INPUT,CSS_INPUT} from "./css-test-data.js";
import {parse as parseCss, stringify as stringifyCss} from "css";

// parser cands: mensch css
describe("apply css",()=>{
	/*it("can apply css",()=>{
		let output=makeCssInline(HTML_INPUT,CSS_INPUT);
		console.log(output);
	});*/

	/*it("can process css",()=>{
		let css=parseCss(CSS_INPUT);
		css=cssAddSelector(css,"html","htmlbody");
		css=cssAddSelector(css,"body","htmlbody");
		//console.log(css.stylesheet.rules);

		console.log(stringifyCss(css));
	});*/

	it("can remove vars",()=>{
		let css=parseCss(CSS_INPUT);
		//console.log(cssGetVariables(css));
		css=cssRemoveVariables(css);
		console.log(stringifyCss(css));
	});
});
