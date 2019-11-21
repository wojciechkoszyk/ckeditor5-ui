/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global Event */

import SelectView from '../../src/selectview/selectview';
import { expectToThrowCKEditorError } from '@ckeditor/ckeditor5-utils/tests/_utils/utils';

describe( 'SelectView', () => {
	describe( 'constructor()', () => {
		it( 'should creates element from template', () => {
			const view = new SelectView( null, [
				{ label: 'Foo', value: 'foo' },
				{ label: 'Bar', value: 'bar' },
			] );

			view.render();

			expect( view.element.tagName ).to.equal( 'SELECT' );
			expect( view.element.classList.contains( 'ck' ) ).to.be.true;
			expect( view.element.classList.contains( 'ck-input' ) ).to.be.true;
			expect( view.element.classList.contains( 'ck-input-select' ) ).to.be.true;

			expect( view.element.childElementCount ).to.equal( 2 );

			expect( view.element.children[ 0 ].tagName ).to.equal( 'OPTION' );
			expect( view.element.children[ 0 ].value ).to.equal( 'foo' );
			expect( view.element.children[ 0 ].innerText ).to.equal( 'Foo' );

			expect( view.element.children[ 1 ].tagName ).to.equal( 'OPTION' );
			expect( view.element.children[ 1 ].value ).to.equal( 'bar' );
			expect( view.element.children[ 1 ].innerText ).to.equal( 'Bar' );

			view.destroy();
		} );
	} );

	describe( 'DOM bindings', () => {
		let view;

		beforeEach( () => {
			view = new SelectView( null, [
				{ label: 'Foo', value: 'foo' },
				{ label: 'Bar', value: 'bar' },
				{ label: 'Baz', value: 'baz' },
			] );

			view.render();

			view.value = 'foo';
			view.id = 'bar';
		} );

		describe( 'value', () => {
			it( 'should react on view#value', () => {
				expect( view.element.value ).to.equal( 'foo' );

				view.value = 'baz';

				expect( view.element.value ).to.equal( 'baz' );

				// To be sure that value can be changed multiple times using inline value attribute.
				view.value = 'bar';

				expect( view.element.value ).to.equal( 'bar' );
			} );

			it( 'throws an error when trying to set a value to non-existing option', () => {
				expectToThrowCKEditorError( () => {
					view.value = 'foobar';
				}, /^selectview-invalid-new-value/, view );
			} );
		} );

		describe( 'id', () => {
			it( 'should react on view#id', () => {
				expect( view.element.id ).to.equal( 'bar' );

				view.id = 'baz';

				expect( view.element.id ).to.equal( 'baz' );
			} );
		} );

		describe( 'isReadOnly', () => {
			it( 'should react on view#isReadOnly', () => {
				expect( view.element.disabled ).to.false;

				view.isReadOnly = true;

				expect( view.element.disabled ).to.true;
			} );
		} );

		describe( 'input event', () => {
			it( 'triggers view#input', () => {
				const spy = sinon.spy();

				view.on( 'input', spy );

				view.element.dispatchEvent( new Event( 'input' ) );
				sinon.assert.calledOnce( spy );
			} );
		} );
	} );

	describe( 'focus()', () => {
		it( 'focuses the select in DOM', () => {
			const view = new SelectView( null, [] );
			view.render();

			const spy = sinon.spy( view.element, 'focus' );

			view.focus();

			sinon.assert.calledOnce( spy );

			view.destroy();
		} );
	} );
} );
