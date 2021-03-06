/**
 * @file
 * @since   2018-05-25
 * @author  https://github.com/andre-st
 *
 * Note:
 *   - doc-comments conventions: http://usejsdoc.org/
 *   - members prefixed with an underscore are private members (_function, _attribute)
 * 
 */

"use strict";

/**
 * @namespace
 * @description Lightweight Chrome Extension UI utils library
 */
const nsUI =
{
	/**
	 * @callback stateCallback
	 * @param    {string} theState - CSS classname, @see setState()
	 * @return   {void}
	 * @public
	 */
	
	/**
	 * @callback actionCallback
	 * @return   {void}
	 * @public
	 */	
	
	stateListeners: [],  /** Notified by setState(): @see stateCallback */
	
	/**
	 * @param  {actionCallback}  theCallback
	 * @return {void}
	 * @public
	 */	
	init: function( theCallback )
	{
		document.addEventListener( "DOMContentLoaded", theCallback );
	},
	
	
	/**
	 * @param  {DOMString}  theSelector
	 * @return {Element}
	 * @public
	 */	
	elem: function( theSelector )
	{
		return document.querySelector( theSelector );
	},
	
	
	/**
	 * @param  {DOMString}     theSelector     - CSS selector
	 * @param  {string}        theEventName    - DOM event type: "click", "keydown" etc
	 * @param  {EventListener} theEventHandler - function which handles EventTarget
	 * @return {void}
	 * @public
	 */
	bind: function( theSelector, theEventName, theEventHandler )
	{
		const a = document.querySelectorAll( theSelector );
		for( var i = 0; i < a.length; i++ )
			a[i].addEventListener( theEventName, theEventHandler );
	},
	
	
	/**
	 * @param  {string}    theState - Any string included in the possible states parameter
	 * @param  {string[]}  thePossibleStates
	 * @param  {DOMString} [theSelector] - CSS selector
	 * @return {void}
	 * @public
	 *
	 * <pre> 
	 * .textChangedState #btnSave { background-color: yellow; }
	 * .textSavedState   #btnSave { background-color: green;  }
	 * </pre>
	 */
	setState: function( theState, thePossibleStates, theSelector )
	{
		console.assert( thePossibleStates.includes( theState ), 
				"Expect possible states to include '" + theState + "'" );
		
		const a = document.querySelectorAll( theSelector || "body" );
		for( var i = 0; i < a.length; i++ )
		{
			var cn = a[i].className;
			thePossibleStates.forEach( s => cn = cn.replace( s, '' ) );  // Removes prev state
			a[i].className = cn + ' ' + theState;
		}
		
		nsUI.stateListeners.forEach( l => l( theState ) );
	},
	
	
	/**
	 * @param  {string}    theState    - @see setState()
	 * @param  {DOMString} theSelector - CSS selector
	 * @return {boolean}
	 * @public
	 */	
	hasState: function( theState, theSelector )
	{
		const  e = nsUI.elem( theSelector || "body" );
		return e ? e.className.includes( theState ) : false;
	},
	
	
	/**
	 * @param  {actionCallback} theCallback
	 * @return {void}
	 * @public
	 */	
	onCtrlS: function( theCallback )
	{
		nsUI.bind( "body", "keydown", event =>
		{
			// CTRL+S habit to save current document
			if( event.ctrlKey && event.which === 83 )
			{
				event.preventDefault();
				theCallback();
				return false;
			}
		});
	},
	
	
	/**
	 * @param  {DOMString} theSelector - CSS selector
	 * @param  {Object}    theOptions  - { onInput: Function, canTabs: Boolean }
	 * @return {void}
	 * @public	 
	 */
	tweakTextArea: function( theSelector, theOptions )
	{
		if( theOptions.onInput )
			nsUI.bind( theSelector, "input", theOptions.onInput );
		
		nsUI.bind( theSelector, "keydown", event =>
		{
			const ta = event.target;
			
			// Enable tabs for indentation (no native support)
			if( theOptions.canTabs && event.keyCode === 9 )
			{
				const p1 = ta.selectionStart;
				const p2 = ta.selectionEnd;
				ta.value = ta.value.substring( 0, p1 ) + "\t" 
				         + ta.value.substring( p2    );
				
				ta.selectionStart = ta.selectionEnd = p1 + 1;
				event.preventDefault();
				return false;
			}
		});
	},
	
	
	/**
	 * @return {void}
	 * @public
	 */
	openOptions: function()
	{
		window.open( chrome.runtime.getURL( "options.html" ) );
	}
}

