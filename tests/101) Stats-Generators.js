'use strict';

const ASSERT = require( 'assert' );
const STATS = require( '../src/Stats' );

//---------------------------------------------------------------------
describe( `101) Stats-Generators Tests`, function ()
{

	const TEST_SIZE = 1000;


	//---------------------------------------------------------------------
	it( `FixedValue_Generator`,
		function ()
		{
			var stat = STATS.Generators.FixedValue( 42 );
			var data = [];
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				data.push( stat( data, index ) );
			}
			ASSERT.equal( data.length, TEST_SIZE );
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				ASSERT.equal( data[ index ], 42 );
			}
			return;
		} );


	//---------------------------------------------------------------------
	it( `Random_Generator`,
		function ()
		{
			var stat = STATS.Generators.Random( 1, 42 );
			var data = [];
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				data.push( stat( data, index ) );
			}
			ASSERT.equal( data.length, TEST_SIZE );
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				ASSERT.ok( ( data[ index ] >= 1 ) && ( data[ index ] <= 42 ) );
			}
			return;
		} );


	//---------------------------------------------------------------------
	it( `Fibonacci_Generator`,
		function ()
		{
			var stat = STATS.Generators.Fibonacci();
			var data = [];
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				data.push( stat( data, index ) );
			}
			ASSERT.equal( data.length, TEST_SIZE );
			ASSERT.equal( data[ 0 ], 0 );
			ASSERT.equal( data[ 1 ], 1 );
			ASSERT.equal( data[ 2 ], 3 );
			ASSERT.equal( data[ 3 ], 6 );
			ASSERT.equal( data[ 4 ], 10 );
			ASSERT.equal( data[ 5 ], 15 );
			return;
		} );


	//---------------------------------------------------------------------
	it( `Sine_Generator`,
		function ()
		{
			var stat = STATS.Generators.Sine( 0, Math.PI / 2 );
			var data = [];
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				data.push( stat( data, index ) );
			}
			ASSERT.equal( data.length, TEST_SIZE );
			ASSERT.equal( data[ 0 ], 0 );
			ASSERT.equal( data[ 1 ], 1 );
			ASSERT.equal( data[ 3 ], -1 );
			ASSERT.equal( data[ 5 ], 1 );
			ASSERT.equal( data[ 7 ], -1 );
			return;
		} );


	//---------------------------------------------------------------------
	return;
} );
