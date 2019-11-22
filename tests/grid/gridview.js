/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import GridView from '../../src/grid/gridview';
import InputTextView from '../../src/inputtext/inputtextview';
import ViewCollection from '../../src/viewcollection';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import FocusCycler from '../../src/focuscycler';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils';

describe( 'GridView', () => {
	let locale, view;

	beforeEach( () => {
		locale = { t() {} };
		view = new GridView( locale );
	} );

	afterEach( () => {
		view.destroy();
	} );

	testUtils.createSinonSandbox();

	describe( 'constructor()', () => {
		beforeEach( () => {
			view.render();
		} );

		it( 'creates element from template', () => {
			expect( view.element.classList.contains( 'ck' ) ).to.be.true;
			expect( view.element.classList.contains( 'ck-grid' ) ).to.be.true;
		} );

		it( 'uses the options#columns to control the grid', () => {
			const view = new GridView( locale, { columns: 3 } );
			view.render();

			// Note: Different browsers use different value optimization.
			expect( view.element.style.gridTemplateColumns ).to.be.oneOf( [ '1fr 1fr 1fr', 'repeat(3, 1fr)' ] );

			view.destroy();
		} );

		it( 'creates the view without any items', () => {
			expect( view.items ).to.have.length( 0 );
		} );

		it( 'creates view collection', () => {
			expect( view.items ).to.be.instanceOf( ViewCollection );
		} );

		it( 'creates focus tracker', () => {
			expect( view.focusTracker ).to.be.instanceOf( FocusTracker );
		} );

		it( 'creates keystroke handler', () => {
			expect( view.keystrokes ).to.be.instanceOf( KeystrokeHandler );
		} );

		it( 'creates focus cycler', () => {
			expect( view._focusCycler ).to.be.instanceOf( FocusCycler );
		} );
	} );

	describe( 'item', () => {
		beforeEach( () => {
			for ( const inputValue of [ 'foo', 'bar' ] ) {
				const label = new InputTextView( locale );
				label.value = inputValue;

				view.items.add( label );
			}

			view.render();
		} );

		it( 'is rendered correctly', () => {
			const domChildren = view.element.children;
			expect( domChildren ).to.have.length( 2 );
			expect( domChildren[ 0 ].tagName ).to.equal( 'INPUT' );
			expect( domChildren[ 1 ].tagName ).to.equal( 'INPUT' );
		} );
	} );

	describe( 'focus', () => {
		beforeEach( () => {
			for ( const inputValue of [ 'foo', 'bar' ] ) {
				const child = new InputTextView( locale );
				child.value = inputValue;

				view.items.add( child );
			}

			view.render();
		} );

		it( 'focuses the first children in the DOM', () => {
			const spy = sinon.spy( view.items.first, 'focus' );

			view.focus();

			sinon.assert.calledOnce( spy );

			view.items.clear();
			view.focus();

			expect( view.items.length ).to.equal( 0 );
			sinon.assert.calledOnce( spy );
		} );

		it( 'focuses the last children in the DOM', () => {
			const spy = sinon.spy( view.items.last, 'focus' );

			view.focusLast();

			sinon.assert.calledOnce( spy );

			view.items.clear();
			view.focusLast();

			expect( view.items.length ).to.equal( 0 );
			sinon.assert.calledOnce( spy );
		} );

		describe( 'update elements in focus tracker', () => {
			it( 'adding new element', () => {
				const spy = sinon.spy( view.focusTracker, 'add' );
				const child = new InputTextView( locale );
				child.value = 'foo';

				view.items.add( child );

				expect( view.items.length ).to.equal( 3 );
				sinon.assert.calledOnce( spy );
			} );

			it( 'removes element', () => {
				const spy = sinon.spy( view.focusTracker, 'remove' );

				view.items.remove( view.items.length - 1 );

				expect( view.items.length ).to.equal( 1 );
				sinon.assert.calledOnce( spy );
			} );
		} );
	} );
} );
