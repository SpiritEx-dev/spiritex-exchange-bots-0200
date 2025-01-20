'use strict';

const ASSERT = require( 'assert' );
const STATS = require( '../src/Stats' );

//---------------------------------------------------------------------
describe( `102) Stats-Evaluators Tests`, function ()
{

	const TEST_SIZE = 1000;


	//---------------------------------------------------------------------
	it( `Not_Evaluator`,
		function ()
		{
			var data = [ false, true, null, 0, 1 ];
			var not = STATS.Evaluators.Not();
			for ( var index = 0; index < data.length; index++ )
			{
				data[ index ] = not( data, index );
			}
			ASSERT.deepEqual( data, [ true, false, null, true, false ] );
			return;
		} );


	//---------------------------------------------------------------------
	it( `Between_Evaluator`,
		function ()
		{
			var random = STATS.Generators.Random( 1, 42 );
			var between = STATS.Evaluators.Between( 1, 42, true );
			for ( var index = 0; index < TEST_SIZE; index++ )
			{
				var value = random( [] );
				ASSERT.ok( between( [ value ] ), true );
			}
			return;
		} );


	//---------------------------------------------------------------------
	return;
} );
