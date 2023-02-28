export default class JSSlider {
	constructor(imagesSelector) {
		this.imagesSelector = imagesSelector;
		this.imagesList = document.querySelectorAll(imagesSelector);
		this.sliderRootElement = document.querySelector(".js-slider");

		this.buttonsFunctions = [
			this.sliderRootElement.querySelector(".js-slider__nav--next"),
			this.sliderRootElement.querySelector(".js-slider__nav--prev"),
			this.sliderRootElement.querySelector(".js-slider__zoom"),
		];
	}

	run() {
		this.initEvents();
		this.initCustomEvents();
	}

	initEvents() {
		this.imagesList.forEach(function (item) {
			item.addEventListener("click", e => {
				this.fireCustomEvent(e.currentTarget, "js-slider-img-click");
			});
		});

		if (this.navNext) {
			this.navNext.addEventListener("click", e => {
				this.fireCustomEvent(this.sliderRootElement, "js-slider-img-next");
			});
		}

		if (this.navPrev) {
			this.navPrev.addEventListener("click", e => {
				this.fireCustomEvent(this.sliderRootElement, "js-slider-img-prev");
			});
		}

		if (this.zoom) {
			this.zoom.addEventListener("click", function (e) {
				if (e.target === e.currentTarget) {
					this.fireCustomEvent(this.sliderRootElement, "js-slider-close");
				}
			});
		}
	}

	initCustomEvents() {
		this.imagesList.forEach(function (img) {
			img.addEventListener("js-slider-img-click", function (event) {
				this.onImageClick(event);
			});
		});

		this.sliderRootElement.addEventListener(
			"js-slider-img-next",
			this.onImageNext()
		);
		this.sliderRootElement.addEventListener(
			"js-slider-img-prev",
			this.onImagePrev()
		);
		this.sliderRootElement.addEventListener(
			"js-slider-close",
			this.onClose(event)
		);
	}

	fireCustomEvent(element, name) {
		console.log(element.className, "=>", name);

		const event = new CustomEvent(name, {
			bubbles: true,
		});

		element.dispatchEvent(event);
	}

	onImageClick(event) {
		this.sliderRootElement.classList.add("js-slider--active");

		const src = event.currentTarget.querySelector("img").src;
		this.sliderRootElement.querySelector(".js-slider__image").src = src;

		const groupName = event.currentTarget.dataset.sliderGroupName;
		const thumbsList = document.querySelectorAll(
			this.imagesSelector + "[data-slider-group-name=" + groupName + "]"
		);
		const prototype = document.querySelector(
			".js-slider__thumbs-item--prototype"
		);
		thumbsList.forEach(item => {
			const thumbElement = prototype.cloneNode(true);
			thumbElement.classList.remove("js-slider__thumbs-item--prototype");
			const thumbImg = thumbElement.querySelector("img");
			thumbImg.src = item.querySelector("img").src;
			if (thumbImg.src === src) {
				thumbImg.classList.add("js-slider__thumbs-image--current");
			}

			document.querySelector(".js-slider__thumbs").appendChild(thumbElement);
		});
	}

	onImageNext(event) {
		const currentClassName = ".js-slider__thumbs-image--current";
		const current = this.sliderRootElement.querySelector(`${currentClassName}`);

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
		const currentClassName = "js-slider__thumbs-image--current";
		const current = this.sliderRootElement.querySelector(`${currentClassName}`);

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
		const thumbsList = this.querySelectorAll(
			".js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)"
		);
		thumbsList.forEach(item => item.parentElement.removeChild(item));
	}
}
