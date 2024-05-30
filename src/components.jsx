import {useFeather} from "use-feather";
import {useRef} from "react";
import {useVar} from "katnip-components";

function ModalInner({children, onDismiss, class: className}) {
	let coverRef=useRef();
	let coverFeather=useFeather(v=>{
		coverRef.current.style.backgroundColor=`rgba(0,0,0,${v/200})`;
		coverRef.current.style.opacity=`${v}%`;
	});

	let contentRef=useRef();
	let contentFeather=useFeather(v=>{
		contentRef.current.style.transform=`translateY(${Math.round(100-v)}px)`;
	},{
		stiffness: 250,
		damping: 25
	});

	coverFeather.setTarget(100);
	contentFeather.setTarget(100);

	// class="fixed top-0 left-0 bg-black w-full h-[100dvh] z-50 flex items-center justify-center"
	let coverStyle={
		"display":"flex",
		"position":"fixed",
		"top":"0",
		"left":"0",
		"zIndex":50,
		"justifyContent":"center",
		"alignItems":"center",
		"width":"100%",
		"backgroundColor":"#000000",
		"height":"100dvh"		
	};

	// class="w-full sm:w-[640px] max-h-[100dvh] inline-flex flex-col overflow-hidden p-10 relative"
	let popupStyle={
		"display":"inline-flex",
		"overflow":"hidden",
		"position":"relative",
		"padding":"2.5rem",
		"flexDirection":"column",
		"maxHeight":"100dvh",
		"width":"100%",
		"max-width": "640px"
	}

	return (
		<div style={coverStyle}
				ref={coverRef}
				onClick={onDismiss}>
			<div style={popupStyle}
					onClick={e=>e.stopPropagation()}
					ref={contentRef}>
				<div class={className}>
					{children}
				</div>
			</div>
		</div>
	);
}

export function Modal({showVar: showVarName, children, ...props}) {
	let showVar=useVar(showVarName);

	if (showVar.get())
		return (
			<ModalInner {...props}
					onDismiss={()=>showVar.set(false)}>
				{children}
			</ModalInner>
		);
}

Modal.editorPreview=props=><div class={props.class}>{props.children}</div>;
Modal.styling=true;
Modal.controls={
	showVar: {}
};
