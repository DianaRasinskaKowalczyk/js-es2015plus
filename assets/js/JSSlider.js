export default class JSSlider {
	constructor(imagesSelector) {
		this.imagesSelector = imagesSelector;
		this.sliderRootElement = document.querySelector(".js-slider");
		this.imagesList = document.querySelectorAll(this.imagesSelector);
		this.buttonsFunctions = [
			this.sliderRootElement.querySelector(".js-slider__nav--next"),
			this.sliderRootElement.querySelector(".js-slider__nav--prev"),
			this.sliderRootElement.querySelector(".js-slider__zoom"),
		];

		this.time = null;
	}

	run() {
		this.initEvents();
		this.initCustomEvents();
	}

	initEvents() {
		this.imagesList.forEach(item => {
			item.addEventListener("click", e => {
				this.fireCustomEvent(e.currentTarget, "js-slider-img-click");
			});

			item.addEventListener("click", () => {
				this.fireCustomEvent(this.sliderRootElement, "js-slider-start");
			});
		});

		const [navNext, navPrev, zoom] = this.buttonsFunctions;
		if (navNext) {
			navNext.addEventListener("click", e => {
				this.fireCustomEvent(this.sliderRootElement, "js-slider-img-next");
			});

			navNext.addEventListener("mouseleave", () => {
				this.fireCustomEvent(e.currentTarget, "js-slider-start");
			});
			navNext.addEventListener("mouseenter", () => {
				this.fireCustomEvent(e.currentTarget, "js-slider-stop");
			});
		}

		if (navPrev) {
			navPrev.addEventListener("click", e => {
				this.fireCustomEvent(this.sliderRootElement, "js-slider-img-prev");
			});

			navPrev.addEventListener("mouseleave", () => {
				this.fireCustomEvent(e.currentTarget, "js-slider-start");
			});
			navPrev.addEventListener("mouseenter", () => {
				this.fireCustomEvent(e.currentTarget, "js-slider-stop");
			});
		}

		if (zoom) {
			zoom.addEventListener("click", e => {
				if (e.target === e.currentTarget) {
					this.fireCustomEvent(this.sliderRootElement, "js-slider-close");
				}
			});
		}
	}

	fireCustomEvent(element, name) {
		console.log(element.className, "=>", name);

		const event = new CustomEvent(name, {
			bubbles: true,
		});

		element.dispatchEvent(event);
	}

	initCustomEvents() {
		const [navNext, navPrev] = this.buttonsFunctions;
		this.imagesList.forEach(img => {
			img.addEventListener("js-slider-img-click", event => {
				this.onImageClick(event);
			});
		});

		this.sliderRootElement.addEventListener("js-slider-img-next", () => {
			this.onImageNext();
		});
		this.sliderRootElement.addEventListener("js-slider-img-prev", () => {
			this.onImagePrev();
		});
		this.sliderRootElement.addEventListener("js-slider-close", event => {
			this.onClose(event);
		});

		this.sliderRootElement.addEventListener("js-slider-start", () => {
			this.startAutoSlider();
		});

		navNext.addEventListener("js-slider-start", () => {
			this.startAutoSlider();
		});

		navNext.addEventListener("js-slider-stop", () => {
			this.stopAutoSlider();
		});

		navPrev.addEventListener("js-slider-start", () => {
			this.startAutoSlider();
		});
		navPrev.addEventListener("js-slider-stop", () => {
			this.stopAutoSlider();
		});
	}

	startAutoSlider() {
		this.time = setInterval(() => this.onImageNext(), 3000);
	}

	stopAutoSlider() {
		clearTimeout(this.time);
	}

	onImageClick(event) {
		const currentPath = this.getCurrentImagePath(event);

		const groupName = event.currentTarget.dataset.sliderGroupName;
		const thumbsList = document.querySelectorAll(
			`[data-slider-group-name=${groupName}]`
		);

		thumbsList.forEach(item => {
			this.createThumbs(item, currentPath);
		});
	}

	getCurrentImagePath(event) {
		this.sliderRootElement.classList.add("js-slider--active");

		const src = event.currentTarget.querySelector("img").src;
		return (this.sliderRootElement.querySelector(".js-slider__image").src =
			src);
	}

	createThumbs(item, currentPath) {
		const prototype = document.querySelector(
			".js-slider__thumbs-item--prototype"
		);
		const thumbElement = prototype.cloneNode(true);
		thumbElement.classList.remove("js-slider__thumbs-item--prototype");
		const thumbImg = thumbElement.querySelector("img");
		thumbImg.src = item.querySelector("img").src;
		if (thumbImg.src === currentPath) {
			thumbImg.classList.add("js-slider__thumbs-image--current");
		}

		document.querySelector(".js-slider__thumbs").appendChild(thumbElement);
	}

	onImageNext(event) {
		console.log(this, "onImageNext");

		const currentClassName = "js-slider__thumbs-image--current";
		const current = this.sliderRootElement.querySelector(
			`.${currentClassName}`
		);

		const parentCurrent = current.parentElement;
		const nextElement = parentCurrent.nextElementSibling;
		if (
			nextElement &&
			!nextElement.className.includes("js-slider__thumbs-item--prototype")
		) {
			const img = nextElement.querySelector("img");
			img.classList.add(currentClassName);

			this.sliderRootElement.querySelector(".js-slider__image").src = img.src;
			current.classList.remove(currentClassName);
		}
	}

	onImagePrev(event) {
		// console.log(this, "onImagePrev");

		const currentClassName = "js-slider__thumbs-image--current";
		const current = this.sliderRootElement.querySelector(
			`.${currentClassName}`
		);

		const parentCurrent = current.parentElement;
		const prevElement = parentCurrent.previousElementSibling;
		if (
			prevElement &&
			!prevElement.className.includes("js-slider__thumbs-item--prototype")
		) {
			const img = prevElement.querySelector("img");
			img.classList.add(currentClassName);

			this.sliderRootElement.querySelector(".js-slider__image").src = img.src;
			current.classList.remove(currentClassName);
		}
	}

	onClose(event) {
		event.currentTarget.classList.remove("js-slider--active");
		const thumbsList = this.sliderRootElement.querySelectorAll(
			".js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)"
		);
		thumbsList.forEach(item => item.parentElement.removeChild(item));
	}
}
