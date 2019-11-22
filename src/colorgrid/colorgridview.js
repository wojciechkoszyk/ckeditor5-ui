/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module ui/colorgrid/colorgrid
 */

import ColorTileView from './colortileview';
import GridView from '../grid/gridview';
import '../../theme/components/colorgrid/colorgrid.css';

/**
 * A grid of {@link module:ui/colorgrid/colortile~ColorTileView color tiles}.
 *
 * @extends module:ui/grid~GridView
 */
export default class ColorGridView extends GridView {
	/**
	 * Creates an instance of a color grid containing {@link module:ui/colorgrid/colortile~ColorTileView tiles}.
	 *
	 * @param {module:utils/locale~Locale} [locale] The localization services instance.
	 * @param {Object} options Component configuration
	 * @param {Array.<module:ui/colorgrid/colorgrid~ColorDefinition>} [options.colorDefinitions] Array with definitions
	 * required to create the {@link module:ui/colorgrid/colortile~ColorTileView tiles}.
	 * @param {Number} options.columns A number of columns to display the tiles.
	 */
	constructor( locale, options ) {
		super( locale, options );

		const colorDefinitions = options && options.colorDefinitions || [];

		/**
		 * The color of the currently selected color tile in {@link #items}.
		 *
		 * @observable
		 * @type {String}
		 */
		this.set( 'selectedColor' );

		this.items.on( 'add', ( evt, colorTile ) => {
			colorTile.isOn = colorTile.color === this.selectedColor;
		} );

		colorDefinitions.forEach( item => {
			const colorTile = new ColorTileView();

			colorTile.set( {
				color: item.color,
				label: item.label,
				tooltip: true,
				hasBorder: item.options.hasBorder
			} );

			colorTile.on( 'execute', () => {
				this.fire( 'execute', {
					value: item.color,
					hasBorder: item.options.hasBorder,
					label: item.label
				} );
			} );

			this.items.add( colorTile );
		} );

		this.extendTemplate( {
			attributes: {
				class: [ 'ck-color-grid' ]
			}
		} );

		this.on( 'change:selectedColor', ( evt, name, selectedColor ) => {
			for ( const item of this.items ) {
				item.isOn = item.color === selectedColor;
			}
		} );
	}
}

/**
 * A color definition used to create a {@link module:ui/colorgrid/colortile~ColorTileView}.
 *
 *		{
 *			color: hsl(0, 0%, 75%),
 *			label: 'Light Grey',
 *			options: {
 *				hasBorder: true
 *			}
 *		}
 *
 * @typedef {Object} module:ui/colorgrid/colorgrid~ColorDefinition
 * @type Object
 *
 * @property {String} color String representing a color.
 * It is used as value of background-color style in {@link module:ui/colorgrid/colortile~ColorTileView}.
 * @property {String} label String used as label for {@link module:ui/colorgrid/colortile~ColorTileView}.
 * @property {Object} options Additional options passed to create a {@link module:ui/colorgrid/colortile~ColorTileView}.
 * @property {Boolean} options.hasBorder A flag that indicates if special a CSS class should be added
 * to {@link module:ui/colorgrid/colortile~ColorTileView}, which renders a border around it.
 */
