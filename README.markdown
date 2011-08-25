jQuery.ganttView
================

The jQuery.ganttView plugin is a very lightweight plugin for creating a Gantt chart in plain HTML...no vector graphics or images required.  The plugin supports dragging and resizing the Gantt blocks and callbacks to trap the updated data.

A title formatter and an hover event has been added in this fork. It will handle overlaps (static, not yet when blocks are moved).


![Sample Gantt](http://github.com/mivano/jquery.ganttView/raw/master/example/jquery-ganttview.png)

The chart can also show Month/Year overviews besides the Day/Month views. 

![Sample Gantt](http://github.com/mivano/jquery.ganttView/raw/master/example/jquery-ganttview2.png)

Browser Compatibility
---------------------
Currently the plugin has been tested, and is working in: FF 3.5+, Chrome 5+, Safari 4+, IE8+.  There are minor issues in IE7 and I haven't even attempted to use it in IE6.  If you encounter any issues with any version of Internet Explorer and would like to contribute CSS fixes please do so, several people have asked for IE6 support.


Dependencies
------------
The plugin depends on the following libraries:

- jQuery 1.4 or higher (obviously)
- jQuery-UI 1.8 or higher
- date.js


Documentation
-------------
Documentation will be coming soon!  I promise...


Contribution
------------
Oday Hazeem and Mohammed Zurba did most of the work for the added features.


License
-------
The jQuery.ganttView plugin may be used free of charge under the conditions 
of the following license:

The MIT License

Copyright (c) 2010 Frank (JC) Grubbs - jc.grubbs@devmynd.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.