/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import View from '../view.js';
import Template from '../template.js';

/**
 * The icon manager view class.
 *
 * See {@link ui.iconManager.IconManager}.
 *
 * @memberOf ui.iconManager
 * @extends ui.View
 */
export default class IconManagerView extends View {
	constructor( locale ) {
		super( locale );

		this.template = new Template( {
			tag: 'svg',
			ns: 'http://www.w3.org/2000/svg',
			attributes: {
				class: 'ck-icon-manager-sprite'
			}
		} );

		/**
		 * Model of this icon manager view.
		 *
		 * @member {ui.iconManager.IconManagerViewModel} ui.iconManager.IconManagerView#model
		 */
	}

	init() {
		this.element.innerHTML = this.model.sprite;

		return super.init();
	}
}

/**
 * The icon manager view {@link ui.Model} interface.
 *
 * @interface ui.iconManager.IconManagerViewModel
 */

/**
 * The actual SVG (HTML) of the icons to be injected in DOM.
 *
 * @member {String} ui.iconManager.IconManagerViewModel#sprite
 */