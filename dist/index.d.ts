export interface DOMSlideshowOptions {
    duration?: number;
    noLoop?: boolean;
}
interface DispatcherEvent {
    type: string;
    [key: string]: any;
}
declare type Listener = (event?: DispatcherEvent) => void;
export default class DOMSlideshow {
    private _currentIndex;
    private _running;
    private _timeoutId;
    private _listeners;
    private _$el;
    private _$items;
    private _$effects;
    duration: number;
    noLoop: boolean;
    constructor($el: HTMLElement, options?: DOMSlideshowOptions);
    readonly currentIndex: number;
    readonly itemLength: number;
    readonly prevIndex: number;
    readonly nextIndex: number;
    readonly isLast: boolean;
    toNext(): void;
    play(): void;
    pause(): void;
    private _transition;
    addEventListener(type: string, listener: Listener): void;
    removeEventListener(type: string, listener: Listener): void;
    dispatchEvent(event: DispatcherEvent): void;
}
export {};
