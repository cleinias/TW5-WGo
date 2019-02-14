/*\
title: $:/plugins/cleinias/sgfeditor/sgfeditor.js
type: application/javascript
module-type: widget

sgfeditor.js provides a <$sgfeditor [sgfFileName]> widget that loads the go game record contained in sgfFile or the sgfRecord in its text field into a Gui editor. 

\*/
(function(){

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";


    //Real path to the external library is specified in files/tiddlywiki.files
    var	Widget = require("$:/core/modules/widgets/widget.js").widget;
    var     besogoPlayer = require("$:/plugins/cleinias/sgfeditor/besogo").besogo;
    var GoGameWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
GoGameWidget.prototype = new Widget();


// Options can be set in the config panel    
var SGFEDITOR_OPTIONS = "$:/config/sgfeditor";
/*
Render this widget into the DOM
*/
GoGameWidget.prototype.render = function(parent,nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();
    var div = this.document.createElement("div");
    var parentWidth = this.parentDomNode.getBoundingClientRect().width;
    try {
        div.setAttribute("class", "besogo-editor"); //General besogo editor 
        div.setAttribute("class", "besogo-container"); //General besogo editor 
        // Initialise options from the config tiddler or from the tiddler attributes
        var config = $tw.wiki.getTiddlerData(SGFEDITOR_OPTIONS,{});
        var options = {
            size: this.getAttribute("size", config.size || 19),
            panels: this.getAttribute("panels", config.panels || ['control', 'names', 'comment', 'tool', 'tree', 'file']),
            realstones: this.getAttribute("realstones", config.realstones || true),
            shadows: this.getAttribute("shadows", config.shadows || true),
            coord:   this.getAttribute("coord", config.coord || true),                   parentWidth: parentWidth,
            maxwidth   : this.getAttribute("maxwidth", config.maxwidth || 900)};
        // get the sgf game record or the url of one , if any
        var sgfContentOrLink = this.getAttribute("text") || "";
        //The player expects the sgf record or the link as content of the div is being passed
        div.textContent = sgfContentOrLink;
        // Create the editor into the div
        this.sgfEditor = besogoPlayer;
        this.sgfEditor.create(div,options);
    } catch(ex) {
        div.className = "tc-error";
        div.textContent = ex;
    }
    parent.insertBefore(div,nextSibling);
    this.domNodes.push(div);
};
  
/*
A widget with optimized performance will selectively refresh, but here we refresh always
*/
GoGameWidget.prototype.refresh = function(changedTiddlers) {
  // Regenerate and rerender the widget and
  // replace the existing DOM node
  this.refreshSelf();
  return true;
};


    exports.sgfeditor = GoGameWidget;

})();