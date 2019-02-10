const DURATION = 5000;

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
	loop: false,
}

export default class DOMSlideshow {
	
	constructor( $el, { loop } = defaultOption ) {

		this._current = 0;
		this.loop = loop;
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

			const fx = $current.getAttribute( 'data-slideshow-transition' );

			$current.style.transform = 'none';
			$current.style.opacity = 0;
			$current.style.zIndex = 3;

			requestAnimationFrame( () => {

				$current.style.transition = `transform ${ DURATION }ms linear, opacity ${ DURATION * 0.2 }ms`;
				$current.style.transform =
					fx === 'zoomin'  ? 'scale( ' + scaleMin + ', ' + scaleMin + ' )' :
					fx === 'zoomout' ? 'scale( ' + scaleMax + ', ' + scaleMax + ' )' :
					fx === 'ltor' ? 'translateX( 70px )' :
					fx === 'rtol' ? 'translateX( -70px )' :
					'none';
				$current.style.opacity = 1;
				$current.style.zIndex = 1;

			} );

			setTimeout( () => {

				if ( ! this.loop && this.isLast ) return;

				$current.style.transition = 'none';
				$current.style.opacity = 1;
				$current.style.zIndex = 0;

				$prev.style.transition = 'none';
				$prev.style.transform = 'none';
				$prev.style.opacity = 0;
				$prev.style.zIndex = 0;

				this.toNext();
				transition();

			}, DURATION );

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

		new DOMSlideshow( $el, { loop: true } );

	}
);
