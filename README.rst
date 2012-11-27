reveal-console.js
=================

.. image:: https://github.com/regebro/impress-console/raw/master/screenshot_thumb.png
   :align: right
   :target: https://github.com/regebro/impress-console/raw/master/screenshot.png

This module provides a speaker console plugin for reveal.js. It shows speaker notes,
a small view of the current slide, a preview of the next slide in order,
a clock and a resettable timer.

This is an adapation of Lennart Regebro's impressConsole.js to reveal.js. When reveal.js fragments are present in a slides, they will currently be updated in the slides view but not in the preview window.

Usage
=====

To use it put reveal-console.js in the js directory under your presentation, and
put reveal-console.css in the css directory under your presentation. The
console will look for css/reveal-console.css, so you need to locate it there.

And add this to the script where you call Reveal.initialize()::
    
    Reveal.initialize({
        ...
        dependencies: [
            ...
            { src: 'js/reveal-console.js', async: true, callback: function() { rvconsole().init(); } },
    	]
    });

You can then open the speaker window with the C key. You can also open it automatically with::

    rvconsole().open();

The timer at the bottom of the screen starts automatically, and will reset if you click on it.


Credits
=======
* Maximilian Nickel, nickel@dbs.ifi.lmu.de 

* Lennart Regebro, regebro@gmail.com, author of impressConsole.js

* David Souther, davidsouther@gmail.com, author of the original notes.js
