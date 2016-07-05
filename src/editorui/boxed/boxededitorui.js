/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import EditorUI from '../../../ui/editorui/editorui.js';
import ControllerCollection from '../../../ui/controllercollection.js';

/**
 * The boxed editor UI controller class. This class controls an editor interface
 * consisting of a toolbar and an editable area, enclosed within a box.
 *
 *		// An instance of BoxedEditorUI.
 *		new BoxedEditorUI( editor );
 *
 * See {@link ui.editorUI.boxed.BoxedEditorUIView}.
 *
 * @member ui.editorUI.boxed
 * @extends ui.editorUI.EditorUI
 */
export default class BoxedEditorUI extends EditorUI {
	/**
	 * Creates a boxed editor UI instance.
	 *
	 * @param {ckeditor5.Editor} editor
	 */
	constructor( editor ) {
		super( editor );

		this.collections.add( new ControllerCollection( 'top' ) );
		this.collections.add( new ControllerCollection( 'main' ) );

		const config = editor.config;

		/**
		 * The editor's width. Defaults to {@link ckeditor5.editor.config.ui.width}.
		 *
		 * Note: a specific creator that was used must support this setting.
		 *
		 * @observable
		 * @property {Number} width
		 */
		this.set( 'width', config.get( 'ui.width' ) );

		/**
		 * The editor's height. Defaults to {@link ckeditor5.editor.config.ui.height}.
		 *
		 * Note: a specific creator that was used must support this setting.
		 *
		 * @observable
		 * @property {Number} height
		 */
		this.set( 'height', config.get( 'ui.height' ) );
	}
}