/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module ui/select/selectview
 */

import View from '../view';
import global from '@ckeditor/ckeditor5-utils/src/dom/global';

import '../../theme/components/select/select.css';

/**
 * The select view class.
 *
 * @extends module:ui/view~View
 */
export default class SelectView extends View {
	/**
	 * Creates an instance of the {@link module:ui/select/selectview~SelectView} class.
	 *
	 * Also see {@link #render}.
	 *
	 * @param {module:utils/locale~Locale} locale The localization services instance.
	 * @param {Array.<module:ui/select/selectview~SelectViewItem>} items Items to choose from.
	 */
	constructor( locale, items ) {
		super( locale );

		/**
		 * Fired when the user selects an item. Corresponds to the native
		 * DOM `input` event.
		 *
		 * @event input
		 */

		/**
		 * The value of the select.
		 *
		 * @observable
		 * @member {String} #value
		 */
		this.set( 'value' );

		/**
		 * The `id` attribute of the select (i.e. to pair with a `<label>` element).
		 *
		 * @observable
		 * @member {String} #id
		 */
		this.set( 'id' );

		/**
		 * Items to choose from.
		 *
		 * @type {Array.<module:ui/select/selectview~SelectViewItem>}
		 * @private
		 */
		this._items = items;

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'select',
			attributes: {
				class: [
					'ck',
					'ck-input',
					'ck-input-select',
				],
				id: bind.to( 'id' )
			},
			on: {
				input: bind.to( 'input' )
			}
		} );
	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		for ( const item of this._items ) {
			this.element.options.add( new global.window.Option( item.label, item.value ) );
		}

		this.on( 'change:value', ( evt, name, value ) => {
			if ( !this._isAvailableValue( value ) ) {
				return;
			}

			this.element.value = value;
		} );
	}

	/**
	 * Focuses the component.
	 */
	focus() {
		this.element.focus();
	}

	/**
	 * Checks whether a specified `value` is available in the select's options.
	 *
	 * @private
	 * @param {String} value A value to check.
	 * @returns {Boolean}
	 */
	_isAvailableValue( value ) {
		for ( const item of this._items ) {
			if ( item.value === value ) {
				return true;
			}
		}

		return false;
	}
}

/**
 * @typedef {Object} module:ui/select/selectview~SelectViewItem
 *
 * @property {String} value A value of the item.
 *
 * @property {String} label A human friendly label that represents the value.
 */
