import {useFeather} from "use-feather";
import {useState, useRef, createContext, useContext} from "react";
import {parseStyle, ResolvablePromise} from "./js-util.js";
import {useEventUpdate, useConstructor} from "./react-util.jsx";

export function Spinner() {
	return (
		<svg fill="currentColor" style="width: 1em; height: 1em; display: inline-block; vertical-align: -15%; line-height: 1; margin-left: 0.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>{`.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}`}</style><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_ajPY"/></svg>
	)
}

export function SpinnerButton({children, element, onClick, style, ...props}) {
	let [busy,setBusy]=useState();
	let modalCatch=useModalCatch();

	let Element=element;
	if (!Element)
		Element="button";

	async function handleClick(ev) {
		if (busy)
			return;

		setBusy(true);
		await modalCatch(async ()=>{
			await onClick(ev);
		});
		setBusy(false);
	}

	style=parseStyle(style);
	if (busy) {
		style["opacity"]="60%";
	}

	return (
		<Element {...props} style={style} onClick={handleClick}>
			{children}
			{busy && <Spinner/>}
		</Element>
	);
}

export function Modal({children, onDismiss, class: className, style}) {
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
				<div class={className} style={style}>
					{children}
				</div>
			</div>
		</div>
	);
}

export function ErrorModal({onDismiss, message}) {
	let modalStyle={
		backgroundColor: "#fff", 
		padding: "2rem", 
		borderTop: "thick solid #f80",
		boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
	};

	let buttonStyle={
		backgroundColor: "#f80",
		color: "#fff",
		fontWeight: "bold",
		marginTop: "1rem",
		padding: "0.5rem 1.5rem 0.5rem 1.5rem"
	};

	return (
		<Modal style={modalStyle} onDismiss={onDismiss}>
			{message}
			<div>
				<button style={buttonStyle} onClick={onDismiss}>
					Ok
				</button>
			</div>
		</Modal>
	);
}

let ModalContext=createContext();

class ModalState extends EventTarget {
	constructor() {
		super();
		this.modals=[];
	}

	show(modal) {
		let promise=new ResolvablePromise();
		this.modals.push({modal: modal, promise: promise});
		this.dispatchEvent(new Event("change"));

		return promise;
	}

	dismiss(value) {
		let active=this.modals.pop();
		if (!active)
			return;

		active.promise.resolve(value);
		this.dispatchEvent(new Event("change"));
	}
}

export function ModalProvider({children}) {
	let modalState=useConstructor(()=>new ModalState());
	useEventUpdate(modalState,"change");

	return (
		<ModalContext.Provider value={modalState}>
			{children}
			{modalState.modals.map(m=>m.modal)}
		</ModalContext.Provider>
	);
}

export function useShowModal() {
	let modalState=useContext(ModalContext);
	return (modal)=>modalState.show(modal);
}

export function useDismissModal() {
	let modalState=useContext(ModalContext);
	return (value)=>modalState.dismiss(value);
}

export function useModalCatch() {
	let show=useShowModal();
	let dismiss=useDismissModal();

	return (async (fn)=>{
		try {
			await fn();
		}

		catch (e) {
			await show(
				<ErrorModal onDismiss={dismiss} message={e.message}/>
			);
		}
	});
}