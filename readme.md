# dom-slideshow

## Examples

- [Basic](http://yomotsu.github.io/dom-slideshow/examples/basic.html)
- [Events](http://yomotsu.github.io/dom-slideshow/examples/events.html)

## as a module

```js
import DOMSlideshow from 'dom-slideshow';
```

## in browser

Pick dist/dom-slideshow.min.js and place in your HTML:

```html
<script src="path/to/dom-slideshow.min.js"></script>
```

## markup

Make a wrapper `<div>` with `height`. Then place DOMSlideShow divs.

```html
<div style="height: 500px">
	<div class="DOMSlideshow">
		<ul class="DOMSlideshow__Inner">

			<li class="DOMSlideshow__Item -zoomin">
				<div class="DOMSlideshow__ItemContent">content 1</div>
				<div class="DOMSlideshow__ItemEffect" style="background-image: url( img/1.jpg );"></div>
			</li>

			<li class="DOMSlideshow__Item -rtol">
				<div class="DOMSlideshow__ItemContent">CONTENT 2</div>
				<div class="DOMSlideshow__ItemEffect" style="background-image: url( img/2.jpg );"></div>
			</li>

			<li class="DOMSlideshow__Item -zoomout">
				<div class="DOMSlideshow__ItemContent">content 3</div>
				<div class="DOMSlideshow__ItemEffect" style="background-image: url( img/3.jpg );"></div>
			</li>

			<li class="DOMSlideshow__Item -ltor">
				<div class="DOMSlideshow__ItemContent">CONTENT 4</div>
				<div class="DOMSlideshow__ItemEffect" style="background-image: url( img/4.jpg );"></div>
			</li>

		</ul>
	</div>
</div>
```

There are 5 effect types. Set a modifier class to apply.

| ClassName  | Effect        |
| ---        | ---           |
| `-zoomin`  | zoom in       |
| `-zoomout` | zoom out      |
| `-rtol`    | right to left |
| `-ltor`    | left to right |
| no class   | just fade out |

then run it

```js
new DOMSlideshow( document.querySelector( '.DOMSlideshow' ) );
```

if you dont want to write JS, just set `data-dom-slideshow-autostart` attribute.
See the [Basic demo](http://yomotsu.github.io/dom-slideshow/examples/events.html).

## events

See the [Events demo](http://yomotsu.github.io/dom-slideshow/examples/events.html).
