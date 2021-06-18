declare const TRANSITION_TYPE: {
    readonly CROSS_FADE: 0;
    readonly CLIP: 1;
};
declare type TRANSITION_TYPE = typeof TRANSITION_TYPE[keyof typeof TRANSITION_TYPE];
export interface DOMSlideshowOptions {
    duration?: number;
    noLoop?: boolean;
    transitionType?: TRANSITION_TYPE;
}
interface DispatcherEvent {
    type: string;
    [key: string]: any;
}
declare type Listener = (event?: DispatcherEvent) => void;
export default class DOMSlideshow {
    private _currentIndex;
    private _lastCurrentIndex;
    private _width?;
    private _height?;
    private _transitionType?;
    private _running;
    private _isTransitioning;
    private _initialTransition;
    private _timeoutId;
    private _listeners;
    private _$el;
    private _$items;
    private _$effects;
    duration: number;
    noLoop: boolean;
    constructor($el: HTMLElement, options?: DOMSlideshowOptions);
    get currentIndex(): number;
    get itemLength(): number;
    get prevIndex(): number;
    get nextIndex(): number;
    get isLast(): boolean;
    get isTransitioning(): boolean;
    to(index: number): void;
    toNext(): void;
    play(): void;
    pause(): void;
    private _transition;
    addEventListener(type: string, listener: Listener): void;
    removeEventListener(type: string, listener: Listener): void;
    dispatchEvent(event: DispatcherEvent): void;
}
export {};
