reveal-console.js
=================

[thumb]: https://github.com/mnick/reveal-console.js/raw/master/screenshot_thumb.png "Screenshot Thumbnail"
[screenshot]: https://github.com/mnick/reveal-console.js/raw/master/screenshot.png "Screenshot"

[![Screenshot Thumbnail][thumb]][screenshot]

This module provides a speaker console plugin for [reveal.js](https://github.com/hakimel/reveal.js/). It shows speaker notes,
a small view of the current slide, a preview of the next slide in order,
a clock and a resettable timer.

This project is an adapation of Lennart Regebro's [impressConsole.js](https://github.com/regebro/impress-console) to reveal.js. When reveal.js fragments are present in a slides, they will currently be updated in the slides view but not in the preview window. Its big advantage over current speaker notes support in reveal.js is that it runs *standalone* in the browser without requiring a separate node.js server.

Usage
-----

To use it put reveal-console.js in the js directory under your presentation, and
put reveal-console.css in the css directory under your presentation. The
console will look for css/reveal-console.css, so you need to locate it there.

And add this to the script where you call Reveal.initialize()::

	```javascript
    Reveal.initialize({
        ...
        dependencies: [
            ...
            // add speaker notes support
            { src: 'js/reveal-console.js', async: true, callback: function() { rvconsole().init(); } },
    	]
    });
	```

You can then open the speaker window with the `C` key. You can also open it automatically with::

    rvconsole().open();

The timer at the bottom of the screen starts automatically, and will reset if you click on it.


Credits
-------
* Maximilian Nickel, <nickel@dbs.ifi.lmu.de>

* Lennart Regebro, regebro@gmail.com, author of impressConsole.js

* David Souther, davidsouther@gmail.com, author of the original notes.js
