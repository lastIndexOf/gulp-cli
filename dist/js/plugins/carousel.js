;(function ($) {
	class Carousel {
		constructor(poster) {
			console.log(1)
		}
		static init(posters) {
			const self = this
			posters.each((index, poster) => new self(poster))
		}
	}


	window.Carousel = Carousel
})(jQuery)