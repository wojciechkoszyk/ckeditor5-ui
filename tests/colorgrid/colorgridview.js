/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals Event */

import ColorGridView from './../../src/colorgrid/colorgridview';
import ColorTileView from '../../src/colorgrid/colortileview';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils';

describe( 'ColorGridView', () => {
	let locale, view;

	const colorDefinitions = [
		{
			color: '#000',
			label: 'Black',
			options: {
				hasBorder: false
			}
		},
		{
			color: 'rgb(255, 255, 255)',
			label: 'White',
			options: {
				hasBorder: true
			}
		},
		{
			color: 'red',
			label: 'Red',
			options: {
				hasBorder: false
			}
		}
	];

	beforeEach( () => {
		locale = { t() {} };
		view = new ColorGridView( locale, { colorDefinitions } );
		view.render();
	} );

	afterEach( () => {
		view.destroy();
	} );

	testUtils.createSinonSandbox();

	describe( 'constructor()', () => {
		it( 'creates element from template', () => {
			expect( view.element.classList.contains( 'ck' ) ).to.be.true;
			expect( view.element.classList.contains( 'ck-color-grid' ) ).to.be.true;
		} );

		it( 'creates the view without provided color definitions', () => {
			const view = new ColorGridView( locale );
			view.render();

			expect( view.items ).to.have.length( 0 );

			view.destroy();
		} );

		it( 'reacts to changes in #selectedColor by setting the item#isOn', () => {
			expect( view.items.map( item => item ).some( item => item.isOn ) ).to.be.false;

			view.selectedColor = 'red';

			expect( view.items.get( 2 ).isOn ).to.be.true;

			view.selectedColor = 'rgb(255, 255, 255)';

			expect( view.items.get( 1 ).isOn ).to.be.true;
			expect( view.items.get( 2 ).isOn ).to.be.false;
		} );

		it( 'should determine #isOn value when a ColorTileView is added', () => {
			view.selectedColor = 'gold';

			const tile = new ColorTileView();
			tile.set( {
				color: 'gold',
				label: 'Gold',
				options: {
					hasBorder: false
				}
			} );

			view.items.add( tile );

			expect( view.items.get( 3 ).isOn ).to.be.true;
		} );

		describe( 'add colors from definition as child items', () => {
			it( 'has proper number of elements', () => {
				expect( view.items.length ).to.equal( 3 );
			} );

			colorDefinitions.forEach( ( color, index ) => {
				describe( 'child items has proper attributes', () => {
					it( `for (index: ${ index }, color: ${ color.color }) child`, () => {
						const colorTile = view.items.get( index );

						expect( colorTile ).to.be.instanceOf( ColorTileView );
						expect( colorTile.color ).to.equal( color.color );
					} );
				} );
			} );
		} );
	} );

	describe( 'execute()', () => {
		it( 'fires event for rendered tiles', () => {
			const spy = sinon.spy();
			const firstTile = view.items.first;

			view.on( 'execute', spy );

			firstTile.isEnabled = true;

			firstTile.element.dispatchEvent( new Event( 'click' ) );
			sinon.assert.callCount( spy, 1 );

			firstTile.isEnabled = false;

			firstTile.element.dispatchEvent( new Event( 'click' ) );
			sinon.assert.callCount( spy, 1 );
		} );
	} );
} );
