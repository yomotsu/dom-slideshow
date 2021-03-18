export interface DOMSlideshowOptions {
	duration?: number,
	noLoop?: boolean,
}

interface DispatcherEvent {
	type: string;
	[ key: string ]: any;
}

type Listener = ( event?: DispatcherEvent ) => void;

const $style = document.createElement( 'style' );
$style.innerHTML = /* css */`
.DOMSlideshow {
	overflow: hidden;
	position: relative;
	width: auto;
	height: 100%;
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
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	padding: 0;
}
.DOMSlideshow__Item:first-child {
	opacity: 1;
	z-index: 2;
}
.DOMSlideshow__ItemContent {
	position: relative;
	z-index: 1;
}
.DOMSlideshow__ItemEffect {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-position: 50% 50%;
	background-size: cover;
	backface-visibility: hidden;
}
.-ltor .DOMSlideshow__ItemEffect {
	transform: translateX( 70px );
	width: calc( 100% + 70px );
	margin-left: -70px;
}
.-rtol .DOMSlideshow__ItemEffect {
	transform: translateX( -70px );
	width: calc( 100% + 70px );
}
.-zoomin .DOMSlideshow__ItemEffect {
	transform: scale( 1.1, 1.1 );
}
.-zoomout .DOMSlideshow__ItemEffect {
	transform: scale( 1.1, 1.1 );
}
`;
document.head.appendChild( $style );

export default class DOMSlideshow {

	private _currentIndex: number = 0; 
	private _running: boolean = true;
	private _timeoutId: number = 0;
	private _listeners: { [ type: string ]: Listener[] } = {};

	private _$el!: HTMLElement;
	private _$items!: NodeListOf<HTMLElement>;
	private _$effects!: NodeListOf<HTMLElement>;

	public duration: number = 5000;
	public noLoop: boolean = false;

	constructor( $el: HTMLElement, options: DOMSlideshowOptions = {} ) {

		if ( $el.getAttribute( 'data-dom-slideshow-active' ) === 'true' ) return;

		$el.setAttribute( 'data-dom-slideshow-active', 'true' );

		this._$el = $el;
		this._$items = this._$el.querySelectorAll( '.DOMSlideshow__Item' );
		this._$effects = this._$el.querySelectorAll( '.DOMSlideshow__ItemEffect' );
		this.duration = options.duration || this.duration;
		this.noLoop = options.noLoop || this.noLoop;

		this._transition();

	}

	get currentIndex(): number {

		return this._currentIndex;

	}

	get itemLength(): number {

		return this._$items.length;

	}

	get prevIndex(): number {

		return this._currentIndex !== 0 ? this._currentIndex - 1 : this.itemLength - 1;

	}

	get nextIndex(): number {

		return this.itemLength - 1 > this._currentIndex ? this._currentIndex + 1 : 0;

	}

	get isLast(): boolean {

		return this._currentIndex === this.itemLength - 1;

	}

	public toNext(): void {

		const $current = this._$items[ this._currentIndex ];
		const $prev = this._$items[ this.prevIndex ];
		const $prevEffects = this._$effects[ this.prevIndex ];

		$current.style.zIndex = '0';

		$prev.style.transition = 'none';
		$prev.style.opacity = '0';

		$prevEffects.style.transition = 'none';
		$prevEffects.style.transform = 'none';

		this._currentIndex = this.nextIndex;
		this._transition();

	}

	public play(): void {

		if ( ! this._running ) this._transition();
		this._running = true;

	}

	public pause(): void {

		this._running = false;
		clearTimeout( this._timeoutId );

	}

	private _transition(): void {

		clearTimeout( this._timeoutId );

		const $current = this._$items[ this._currentIndex ];
		const $currentEffects = this._$effects[ this._currentIndex ];

		this.dispatchEvent( { type: 'transitionStart' } );

		$current.style.transition = 'none';
		$current.style.opacity = '0';
		$current.style.zIndex = '1';

		$currentEffects.style.transition = `none`;
		$currentEffects.style.transform = $current.classList.contains( '-zoomout' ) ? '' : 'none';

		requestAnimationFrame( (): void => {

			$current.style.transition = `opacity ${ this.duration * 0.2 }ms`;
			$current.style.opacity = '1';

			$currentEffects.style.transition = `transform ${ this.duration }ms linear`;
			$currentEffects.style.transform = $current.classList.contains( '-zoomout' ) ? 'none' : '';

			this._timeoutId = window.setTimeout( () => {

				if ( ! this._running ) return;

				this.dispatchEvent( { type: 'transitionEnd' } );

				if ( this.noLoop && this.isLast ) {

					this.dispatchEvent( { type: 'ended' } );
					return;

				}

				this.toNext();

			}, this.duration );

		} );

	}

	public addEventListener( type: string, listener: Listener ): void {

		const listeners = this._listeners;

		if ( listeners[ type ] === undefined ) listeners[ type ] = [];

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}
	}

	public removeEventListener( type: string, listener: Listener ): void {

		const listeners = this._listeners;
		const listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			const index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) listenerArray.splice( index, 1 );

		}
	}

	public dispatchEvent(event: DispatcherEvent): void {

		const listeners = this._listeners;
		const listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;
			const array = listenerArray.slice( 0 );

			for ( let i = 0, l = array.length; i < l; i ++ ) {

				array[ i ].call( this, event );

			}
		}
	}

}

Array.prototype.forEach.call(
	document.querySelectorAll( '.DOMSlideshow[data-dom-slideshow-autostart]' ),
	( $el: HTMLElement ): void => {

		new DOMSlideshow( $el );

	}
);
