/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module ui/selectview/selectview
 */

import View from '../view';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';
import global from '@ckeditor/ckeditor5-utils/src/dom/global';

import '../../theme/components/selectview/selectview.css';

/**
 * The select view class.
 *
 * @extends module:ui/view~View
 */
export default class SelectView extends View {
	/**
	 * Creates an instance of the {@link module:ui/view~View} class.
	 *
	 * Also see {@link #render}.
	 *
	 * @param {module:utils/locale~Locale} locale The localization services instance.
	 * @param {Array.<~SelectViewOption>} options Options to choose.
	 */
	constructor( locale, options ) {
		super( locale );

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
		 * Controls whether the select view is in read-only mode.
		 *
		 * @observable
		 * @member {Boolean} #isReadOnly
		 */
		this.set( 'isReadOnly', false );

		/**
		 * Options to choose.
		 *
		 * @type {Array.<~SelectViewOption>}
		 * @private
		 */
		this._options = options;

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'select',
			attributes: {
				class: [
					'ck',
					'ck-input',
					'ck-input-select',
				],
				id: bind.to( 'id' ),
				disabled: bind.to( 'isReadOnly' )
			},
			on: {
				input: bind.to( 'input' )
			}
		} );

		/**
		 * Fired when the user selects an option. Corresponds to the native
		 * DOM `input` event.
		 *
		 * @event input
		 */
	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		for ( const option of this._options ) {
			this.element.options.add( new global.window.Option( option.label, option.value ) );
		}

		this.on( 'change:value', ( evt, name, value ) => {
			if ( !this._isAvailableValue( value ) ) {
				/**
				 * Specified value for the select is not available in its options.
				 *
				 * @error selectview-invalid-new-value
				 * @param value Specified value
				 */
				throw new CKEditorError( 'selectview-invalid-new-value: Specified value is not available in the select.', this, { value } );
			}

			this.element.value = value;
		} );
	}

	/**
	 * Focuses the input.
	 */
	focus() {
		this.element.focus();
	}

	/**
	 * Checks whether specified `value` is available in the select's options.
	 *
	 * @private
	 * @param {String} value A value to check.
	 * @returns {Boolean}
	 */
	_isAvailableValue( value ) {
		for ( const option of this._options ) {
			if ( option.value === value ) {
				return true;
			}
		}

		return false;
	}
}

/**
 * @typedef {Object} module:ui/selectview/selectview~SelectViewOption
 *
 * @property {String} value A value of the option.
 *
 * @property {String} label A text that represents the value.
 */
