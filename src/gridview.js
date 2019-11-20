/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module ui/grid
 */

import View from './view';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from './focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

/**
 * A grid of nested views.
 *
 * @extends module:ui/view~View
 */
export default class GridView extends View {
	/**
	 * Creates an instance of a color grid containing {@link module:ui/colorgrid/colortile~ColorTileView tiles}.
	 *
	 * @param {module:utils/locale~Locale} [locale] The localization services instance.
	 * @param {Object} options Component configuration
	 * @param {Number} options.columns A number of columns to display the tiles.
	 */
	constructor( locale, options ) {
		super( locale );

		const viewStyleAttribute = {};

		if ( options && options.columns ) {
			viewStyleAttribute.gridTemplateColumns = `repeat( ${ options.columns }, 1fr)`;
		}

		/**
		 * Collection of the child tile views.
		 *
		 * @readonly
		 * @member {module:ui/viewcollection~ViewCollection}
		 */
		this.items = this.createCollection();

		/**
		 * Tracks information about DOM focus in the grid.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * Instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {module:utils/keystrokehandler~KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();

		/**
		 * Helps cycling over focusable {@link #items} in the grid.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/focuscycler~FocusCycler}
		 */
		this._focusCycler = new FocusCycler( {
			focusables: this.items,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate grid items backwards using the arrowup key.
				focusPrevious: 'arrowleft',

				// Navigate grid items forwards using the arrowdown key.
				focusNext: 'arrowright',
			}
		} );

		this.setTemplate( {
			tag: 'div',
			children: this.items,
			attributes: {
				class: [
					'ck',
					'ck-grid'
				],
				style: viewStyleAttribute
			}
		} );
	}

	/**
	 * Focuses the first focusable in {@link #items}.
	 */
	focus() {
		if ( this.items.length ) {
			this.items.first.focus();
		}
	}

	/**
	 * Focuses the last focusable in {@link #items}.
	 */
	focusLast() {
		if ( this.items.length ) {
			this.items.last.focus();
		}
	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		// Items added before rendering should be known to the #focusTracker.
		for ( const item of this.items ) {
			this.focusTracker.add( item.element );
		}

		this.items.on( 'add', ( evt, item ) => {
			this.focusTracker.add( item.element );
		} );

		this.items.on( 'remove', ( evt, item ) => {
			this.focusTracker.remove( item.element );
		} );

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element );
	}
}
