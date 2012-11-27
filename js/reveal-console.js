/**
 * reveal-console.js
 *
 * Adds a presenter console to reveal.js
 *
 * MIT Licensed, see license.txt.
 * 
 * Copyright 2012 Maximilian Nickel
 * Copyright 2012 impress-console contributors (see README.txt)
 *
 */

(function ( document, window ) {
    'use strict';

    // This is the default template for the speaker console window
    var consoleTemplate = '<!DOCTYPE html>' + 
        '<html><head>' + 
          '<link rel="stylesheet" type="text/css" media="screen" href="css/reveal-console.css">' +
        '</head><body>' + 
        '<div id="console">' +
          '<div id="views">' +
            '<iframe id="slideView" scrolling="no"></iframe>' +
            '<iframe id="preView" scrolling="no"></iframe>' +
            '<div id="blocker"></div>' + 
          '</div>' +
          '<div id="notes"></div>' +
        '<div id="controls"> ' +
          '<div id="prev"><a  href="#" onclick="Reveal.naviagtePrev(); return false;" />Prev</a></div>' +
          '<div id="next"><a  href="#" onclick="Reveal.navigateNext(); return false;" />Next</a></div>' +
          '<div id="clock">00:00:00 AM</div>' +
          '<div id="timer" onclick="timerReset()">00m 00s</div>' +
        '</div>' +
        '</div>' +
        '</body></html>';

    // All console windows, so that you can call console() repeatedly.
    var allConsoles = {};
    
    var useAMPM = false;
    
    // Zero padding helper function:
    function zeroPad(i) {
        return (i < 10 ? '0' : '') + i
    }
    

    // The console object
    var rvconsole = window.rvconsole = function (rootId) {

        rootId = rootId || 'reveal-slides';
        
        if (allConsoles[rootId]) {
            return allConsoles[rootId];
        }
        
        // root presentation elements
        var root = document.getElementById( rootId );
        
        var consoleWindow = null;

        var nextStep = function() {
            var nextElement = document.querySelector('.present').nextElementSibling;
            var classes = "";
            while (nextElement) {
                if (nextElement.nodeName.toLowerCase() == "section") {
                   return nextElement;
                }
                nextElement = nextElement.nextElementSibling;
            }
            // No next element. Pick the first
            return document.querySelector('section')
        } 
        
        // Sync the notes to the step
        var onSlidechanged = function(){
            if(consoleWindow) {
				var cs = Reveal.getCurrentSlide();
				var idx = Reveal.getIndices();
                // Set notes to next steps notes.
                var newNotes = cs.querySelector('.notes');
                if (newNotes) {
                    newNotes = newNotes.innerHTML;
                } else {
                    newNotes = 'No notes for this step';
                }
                consoleWindow.document.getElementById('notes').innerHTML = newNotes;

                // Set the views                
                var baseURL = document.URL.substring(0, document.URL.search('#/'));
                consoleWindow.document.getElementById('slideView').src =  baseURL + '#/' + idx.h;
                consoleWindow.document.getElementById('preView').src = baseURL + '#/' + (idx.h + 1);
            }
        }; 

        var timerReset = function () {
            consoleWindow.timerStart = new Date();
        }
        
        // Show a clock
        var clockTick = function () {
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();
            var ampm = '';
        
            if (useAMPM) {
                ampm = ( hours < 12 ) ? 'AM' : 'PM';
                hours = ( hours > 12 ) ? hours - 12 : hours;
                hours = ( hours == 0 ) ? 12 : hours;
            }
          
            // Clock
            var clockStr = zeroPad(hours) + ':' + zeroPad(minutes) + ':' + zeroPad(seconds) + ' ' + ampm;
            consoleWindow.document.getElementById('clock').firstChild.nodeValue = clockStr;
            
            // Timer
            seconds = Math.floor((now - consoleWindow.timerStart) / 1000);
            minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            consoleWindow.document.getElementById('timer').firstChild.nodeValue = zeroPad(minutes) + 'm ' + zeroPad(seconds) + 's';
        }

        var open = function() {
            if(top.isconsoleWindow){ 
                return;
            }
            
            if (consoleWindow && !consoleWindow.closed) {
                consoleWindow.focus();
            } else {
                consoleWindow = window.open();
                // This sets the window location to the main window location, so css can be loaded:
                consoleWindow.document.open();
                // Write the template:
                consoleWindow.document.write(consoleTemplate);
                consoleWindow.document.title = 'Speaker Console (' + document.title + ')';
                consoleWindow.impress = window.impress;
                // We set this flag so we can detect it later, to prevent infinite popups.
                consoleWindow.isconsoleWindow = true;
                // Add clock tick
                consoleWindow.timerStart = new Date();
                consoleWindow.timerReset = timerReset;
                consoleWindow.clockInterval = setInterval('rvconsole("' + rootId + '").clockTick()', 1000 );
                // keyboard navigation handlers
                // prevent default keydown action when one of supported key is pressed
                consoleWindow.document.addEventListener("keydown", function ( event ) {
                    if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
                        event.preventDefault();
                    }
                }, false);
                
                // trigger impress action on keyup
                consoleWindow.document.addEventListener("keyup", function ( event ) {
                    if ( ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
                        switch( event.keyCode ) {
                            case 33: // pg up
                            case 37: // left
                            case 38: // up
                                     Reveal.navigatePrev();
                                     break;
                            case 32: // space
                            case 34: // pg down
                            case 39: // right
                            case 40: // down
                                     Reveal.navigateNext();
                                     break;
                        }
                        
                        event.preventDefault();
                    }
                }, false);
                
                // Cleanup
                consoleWindow.onbeforeunload = function() {
                    // I don't know why onunload doesn't work here.
                    clearInterval(consoleWindow.clockInterval);
                };
                // Show the current slide
                onSlidechanged();
            }
        };
       
		var onFragmentChanged = function() {
			console.log('oink');
			consoleWindow.document.getElementById('slideView').contentDocument.querySelector('.reveal .controls .right').click();
		}


        var init = function() {
            // Register the event
            Reveal.addEventListener('slidechanged', onSlidechanged);
			Reveal.addEventListener('fragmentshown', onFragmentChanged);
            
            //When the window closes, clean up after ourselves.
            window.onunload = function(){
                consoleWindow && !consoleWindow.closed && consoleWindow.close();
            };
            
            //Open speaker console when they press 'C'
            document.addEventListener('keyup', function ( event ) {
                if ( event.keyCode === 67 ) {
                    open();
                }
            }, false);
            
        }
                
        // Return the object        
        return allConsoles[rootId] = {init: init, open: open, clockTick: clockTick}
        
    }
    
})(document, window);

