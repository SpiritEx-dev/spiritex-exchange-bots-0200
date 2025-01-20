'use strict';

const ASSERT = require( 'assert' );
const STATS = require( '../src/Stats' );

//---------------------------------------------------------------------
describe( `104) Stats-Run Tests`, function ()
{

	const TEST_SIZE = 1000;


	//---------------------------------------------------------------------
	it( `should Run an Average`,
		function ()
		{
			var data = STATS.Generate( TEST_SIZE, STATS.Generators.FixedValue( 42 ) );
			ASSERT.equal( data.length, TEST_SIZE );
			data = STATS.Run(
				data, 0, data.length,
				STATS.Calculators.Average( 3 )
			);
			ASSERT.equal( data.length, TEST_SIZE );
			ASSERT.equal( data[ 0 ], 42 );
			ASSERT.equal( data[ 1 ], 42 );
			ASSERT.equal( data[ 2 ], 42 );
			ASSERT.equal( data[ 3 ], 42 );
			ASSERT.equal( data[ 4 ], 42 );
			ASSERT.equal( data[ 5 ], 42 );
			ASSERT.equal( data[ TEST_SIZE-1 ], null );
			ASSERT.equal( data[ TEST_SIZE-2 ], null );
			return;
		} );


	//---------------------------------------------------------------------
	return;
} );
