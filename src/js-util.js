export function parseStyle(styleObj) {
	if (!styleObj)
		return {};

	if (typeof styleObj=="string") {
		let styleStr=styleObj;

		let styles={};
		for (let styleStrPart of styleStr.split(";")) {
			let parts=styleStrPart.split(":");
			if (parts.length==2)
				styles[parts[0].trim()]=parts[1].trim();
		}

		return styles;
	}

	return styleObj;
}

export class ResolvablePromise extends Promise {
	constructor(cb = () => {}) {
        let resolveClosure = null;
        let rejectClosure = null;

		super((resolve,reject)=>{
            resolveClosure = resolve;
            rejectClosure = reject;

			return cb(resolve, reject);
		});

        this.resolveClosure = resolveClosure;
        this.rejectClosure = rejectClosure;
 	}

	resolve=(result)=>{
		this.resolveClosure(result);
	}

	reject=(reason)=>{
		this.rejectClosure(reason);
	}
}
