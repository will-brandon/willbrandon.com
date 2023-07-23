/**
 * Author: Will Brandon
 * 
 * This simple JS window library allows for HTML documents to
 * be inserted as iframes into another document as a viewport-fixed
 * draggable window.
 */

function createElement(container, type, className) {
	let element = document.createElement(type);
	element.className = className;
	container.appendChild(element);
	return element;
}

class Window {

	constructor(element) {
		this.element = element;
		this.isAlive = false;
		this.src = this.element.getAttribute("src");
		this.dragEnabled = false;
		this.dragAction = null;
		this.fullscreenMode = null;
	}

	create() {
		this.barContainerElement = createElement(this.element, "div", "bar-container");
		this.barElement = createElement(this.barContainerElement, "div", "window-bar");
		this.btnsElement = createElement(this.barElement, "div", "btns");
		this.extBtnElement = createElement(this.btnsElement, "button", "ext-btn");
		this.minBtnElement = createElement(this.btnsElement, "button", "min-btn");
		this.expBtnElement = createElement(this.btnsElement, "button", "exp-btn");
		this.contentContainerElement = createElement(this.element, "div", "content-container");
		this.contentElement = createElement(this.contentContainerElement, "iframe", "content-pane");

		this.handle = this.element.getAttribute("handle");

		this.titleElement = createElement(this.barElement, "span", "title");
		this.titleElement.innerHTML = this.element.getAttribute("title");

		this.element.style.width = this.element.getAttribute("width") + "px";
		this.element.style.height = this.element.getAttribute("height") + "px";

		this.contentElement.src = this.src;

		this.setupCallbacks();

		this.enableDrag();
		this.hide();
	}

	setupCallbacks() {
		let thisLocal = this;

		this.barElement.onmousedown = function(downEvent) {
			thisLocal.mouseDownOnBar(downEvent);
		}

		this.extBtnElement.onclick = function() {
			thisLocal.extBtnClicked();
		}
		this.minBtnElement.onclick = function() {
			thisLocal.minBtnClicked();
		}
		this.expBtnElement.onclick = function() {
			thisLocal.expBtnClicked();
		}
	}

	setInit(initCallback) {
		this.initCallback = initCallback;

		if (this.isAlive && this.initCallback != null) {
			this.initCallback();
		}
	}

	setDeinit(deinitCallback) {
		this.deinitCallback = deinitCallback;

		if (!this.isAlive && this.deinitCallback != null) {
			this.deinitCallback();
		}
	}

	show() {
		this.element.style.display = "inline-block";

		if (!this.isAlive) {
			this.applyPositionAttribute();
		}

		this.focus();
		
		if (!this.isAlive && this.initCallback != null) {
			this.initCallback();
		}

		this.isAlive = true;
	}

	hide() {
		this.element.style.display = "none";
	}

	close() {
		this.hide();

		if (this.deinitCallback != null) {
			this.deinitCallback();
		}

		this.isAlive = false;
	}

	focus() {
		this.element.style.zIndex = (WindowManager.maxZIndex() + 1).toString();
	}

	setX(x) {
		this.element.style.left = x + "px";
	}

	setY(y) {
		this.element.style.top = y + "px";
	}

	enableDrag() {
		this.dragEnabled = true;
		this.barElement.style.cursor = "move";
	}

	disableDrag() {
		this.dragEnabled = false;
		this.barElement.style.cursor = "default";
	}

	centerXOnPage() {
		this.setX((window.innerWidth - this.element.offsetWidth) / 2.0);
	}

	centerYOnPage() {
		this.setY((window.innerHeight - this.element.offsetHeight) / 2.0);
	}

	bottomYOnPage() {
		this.setY(window.innerHeight - this.element.offsetHeight - 10);
	}

	applyShownAttribute() {
		let attribute = this.element.getAttribute("shown");

		if (attribute != null && attribute === "true") {
			this.show();
		}
	}

	applyPositionAttribute() {
		let attribute = this.element.getAttribute("position");

		if (attribute != null) {
			switch(attribute) {
				case "centered":
					this.centerXOnPage();
					this.centerYOnPage();
					break;
				case "centered-bottom":
					this.centerXOnPage();
					this.bottomYOnPage();
					break;
			}
		}
	}

	extBtnClicked() {
		this.close();

		if (this.fullscreenMode != null) {
			this.fullscreenMode.exit();
			this.fullscreenMode = null;
		}
	}

	minBtnClicked() {
		this.hide();

		if (this.fullscreenMode != null) {
			this.fullscreenMode.exit();
			this.fullscreenMode = null;
		}
	}

	expBtnClicked() {
		if (this.fullscreenMode == null) {
			this.fullscreenMode = WindowManager.requestFullscreen(this);
		} else {
			this.fullscreenMode.exit();
			this.fullscreenMode = null;
		}
	}

	mouseDownOnBar(downEvent) {
		if (this.fullscreenMode == null) {
			this.focus();
		}

		if (this.dragEnabled) {
			this.dragAction = new WindowDragAction(this);
			this.dragAction.begin(downEvent);
		}
	}

	killDragging() {
		if (this.dragAction != null) {
			this.dragAction.killDragging();
			this.dragAction = null;
		}
	}
	
}

class WindowDragAction {

	constructor(w) {
		this.w = w;
		this.windowInitBounds = {};
		this.mouseInitPos = {};
	}

	killDragging() {
		this.w.onmousemove = null;
		this.w.onmouseup = null;
	}

	begin(downEvent) {
		let initWindowBounds = this.w.element.getBoundingClientRect();
		
		this.windowInitBounds = {
			x: initWindowBounds.left,
			y: initWindowBounds.top,
			width: initWindowBounds.width,
			height: initWindowBounds.height
		}

		this.mouseInitPos = {
			x: downEvent.clientX,
			y: downEvent.clientY
		}
	}



	/**

		var initWindowBounds = w.element.getBoundingClientRect();
		var windowInitX = initWindowBounds.left;
		var windowInitY = initWindowBounds.top;

		let windowWidth = initWindowBounds.width;
		let windowHeight = initWindowBounds.height;

		var mouseInitX = downEvent.clientX;
		var mouseInitY = downEvent.clientY;

		document.onmousemove = mouseMoved;
		document.onmouseup = mouseUp;

		function mouseMoved(moveEvent) {
			let xDist = moveEvent.clientX - mouseInitX;
			let yDist = moveEvent.clientY - mouseInitY;

			var x = windowInitX + xDist;
			var y = windowInitY + yDist;

			if (window.innerWidth <= windowWidth) {

				x = 0;

			} else {

				if (x < 0) {
					x = 0;
					mouseInitX = moveEvent.clientX;
					windowInitX = 0;
				}

				if (x + windowWidth > window.innerWidth) {
					x = window.innerWidth - windowWidth;
					mouseInitX = moveEvent.clientX;
					windowInitX = x;
				}
			}

			
			
			if (window.innerHeight <= windowHeight) {

				y = 0;

			} else {

				if (y < 0) {
					y = 0;
					mouseInitY = moveEvent.clientY;
					windowInitY = 0;
				}

				if (y + windowHeight > window.innerHeight) {
					y = window.innerHeight - windowHeight;
					mouseInitY = moveEvent.clientY;
					windowInitY = y;
				}
			}

			w.setPosn(x, y);
		}

		function mouseUp(upEvent) {
			this.killDragging();
		}
		*/

}

class FullscreenMode {

	constructor() {
		this.w = null;
		this.barElement = null;
		this.contentElement = null;
	}

	create() {
		this.element = createElement(document.body, "div", "fullscreen-panel");
		this.barContainerElement = createElement(this.element, "div", "bar-container");
		this.contentContainerElement = createElement(this.element, "div", "content-container");

		this.hide();
	}

	show() {
		this.element.style.display = "block";
	}

	hide() {
		this.element.style.display = "none";
	}

	tryEnter(w) {
		if (w === this.w) {
			return this;
		} else if (this.w != null) {
			return null;
		}
		this.w = w;		

		this.element.style.zIndex = String.valueOf(WindowManager.maxZIndex() + 1);

		this.w.disableDrag();

		this.barElement = w.barElement;
		this.barContainerElement.appendChild(this.barElement);

		this.contentElement = w.contentElement;
		this.contentContainerElement.appendChild(this.contentElement);
		
		this.show();

		return this;
	}

	exit() {
		if (this.w == null) {
			return;
		}

		this.hide();

		this.w.barContainerElement.appendChild(this.barElement);
		this.w.contentContainerElement.appendChild(this.contentElement);
		this.w.enableDrag();

		this.w = null;
	}

}

class WindowManager {

	static htmlElement = document.body.parentElement;
	static windows = [];
	static fullscreenMode = new FullscreenMode();

	static init() {
		WindowManager.includeStylesheet();
		WindowManager.createWindows();
		WindowManager.initWindowStates();
		WindowManager.createFullscreenMode();
		WindowManager.setupCallbacks();
	}

	static includeStylesheet() {
		let linkElement = document.createElement("link");

		linkElement.type = "text/css";
		linkElement.rel = "stylesheet";
		linkElement.href = "windows/windows.css";

		document.head.appendChild(linkElement);
	}

	static createWindows() {

		// If this array is not copied, it will be dynamically updated causing problems
		let windowElements = [...document.getElementsByClassName("window")];

		for (let windowElement of windowElements) {
			let w = new Window(windowElement);
			w.create();
			WindowManager.windows.push(w);
		}
	}

	static initWindowStates() {
		for (let w of WindowManager.windows) {
			w.applyShownAttribute();
			w.applyPositionAttribute();
		}
	}

	static createFullscreenMode() {
		this.fullscreenMode.create();
	}

	static setupCallbacks() {
		WindowManager.htmlElement.onmouseup = function() {
			for (let w of WindowManager.windows) {
				w.killDragging();
			}
		}
	}

	static getWindow(handle) {
		for (let w of WindowManager.windows) {
			// Intentionally using non-strict equals because the handle is likely an integer
			if (w.handle == handle) {
				return w;
			}
		}

		return null;
	}

	static maxZIndex() {
		let max = 0;

		for (let w of WindowManager.windows) {
			max = Math.max(max, parseInt(w.element.style.zIndex));
		}

		return max;
	}

	static requestFullscreen(w) {
		return this.fullscreenMode.tryEnter(w);
	}

}

WindowManager.init();