const $style = document.createElement( 'style' );
$style.innerHTML = `
.DOMSlideshow {
	width: auto;
	height: 100%;
	overflow: hidden;
	position: relative;
}
.DOMSlideshow__Inner {
	list-style: none;
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
.DOMSlideshow__Item {
	opacity: 0;
	padding: 0;
	margin: -100px;
	position: absolute;
	z-index: 1;
	width: calc( 100% + 200px );
	height: calc( 100% + 200px );
	background-position: 50% 50%;
	background-size: cover;
	backface-visibility: hidden;
}
.DOMSlideshow__Item:first-child {
	opacity: 1;
	z-index: 2;
}
`;
document.head.appendChild( $style );

const defaultOption = {
	duration: 5000,
	noLoop: false,
}

export default class DOMSlideshow {
	
	constructor( $el, { duration, noLoop } = defaultOption ) {

		if ( $el.getAttribute( 'data-dom-slideshow-active' ) === 'true' ) return;

		$el.setAttribute( 'data-dom-slideshow-active', 'true' );
		this._current = 0;
		this.duration = duration;
		this.noLoop = !! noLoop;
		this.$items = $el.querySelectorAll( '.DOMSlideshow__Item' );

		const transition = () => {

			const elRect = $el.getBoundingClientRect();
			const viewWidth  = elRect.width;
			const viewHeight = elRect.height;
			const scaleMin = Math.max(
				1 + ( ( viewHeight + 50 ) / viewHeight - 1 ),
				1 + ( ( viewWidth  + 50 ) / viewWidth  - 1 )
			);
			const scaleMax = Math.max(
				1 + ( viewHeight / ( viewHeight + 200 ) - 1 ),
				1 + ( viewWidth  / ( viewWidth  + 200 ) - 1 )
			);

			const $current = this.$items[ this.current ];
			const $prev    = this.$items[ this.prevIndex ];
			// const $next    = this.$items[ this.nextIndex ];

			$current.style.transform = 'none';
			$current.style.opacity = 0;
			$current.style.zIndex = 1;

			requestAnimationFrame( () => {

				$current.style.transition = `transform ${ this.duration }ms linear, opacity ${ this.duration * 0.2 }ms`;
				$current.style.transform =
					$current.classList.contains( '-zoomin'  ) ? `scale( ${ scaleMin }, ${ scaleMin } )` :
					$current.classList.contains( '-zoomout' ) ? `scale( ${ scaleMax }, ${ scaleMax } )` :
					$current.classList.contains( '-ltor'    ) ? `translateX( 70px )` :
					$current.classList.contains( '-rtol'    ) ? `translateX( -70px )` :
					'none';
				$current.style.opacity = 1;

			} );

			setTimeout( () => {

				if ( this.noLoop && this.isLast ) return;

				$current.style.transition = 'none';
				$current.style.zIndex = 0;

				$prev.style.transition = 'none';
				$prev.style.transform = 'none';
				$prev.style.opacity = 0;

				this.toNext();
				transition();

			}, this.duration );

		}

		transition();

	}

	get current() {

		return this._current;

	}

	get itemLength() {

		return this.$items.length;

	}

	get prevIndex() {

		return this.current !== 0 ? this.current - 1 : this.itemLength - 1;

	}

	get nextIndex() {

		return this.itemLength - 1 > this.current ? this.current + 1 : 0;

	}

	get isLast() {
		
		return this.current === this.itemLength - 1;

	}

	toNext () {

		this._current = this.nextIndex;

	}

}

Array.prototype.forEach.call(
	document.querySelectorAll( '.DOMSlideshow' ),
	( $el ) => {

		new DOMSlideshow( $el );

	}
);
