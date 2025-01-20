'use strict';

/*
	Series Library
------------------------------------------
	Feeds
	Generators
	Signals
	Calculators
	Aggregators

*/


// var Feed = {
// 	Update: function ( PriceNumber, VolumeNumber ) { },
// 	Prices: [], // array of price numbers
// 	Volume: [], // array of volume numbers
// };

// var Generator = {
// 	Generate: function () { },
// 	generated: 0,
// };

// var Signal = {
// 	Compute: function ( Feed ) { }, // Computes signal direction and strength.
// 	signal_direction: '', // 'buy', 'sell', or ''.
// 	signal_strength: 0, // A number indicating the strength of the signal.
// 	CalculationTree: {},
// };

// var Calculator = {
// 	Calculate: function ( Data ) { }, // Calculates a single statistic from an array of numbers.
// 	calculation: 0, // The result of Calculate().
// };

// var Aggregator = {
// 	Aggregate: function ( DataArrays ) { }, // Aggregates a single statistic from an array of an array of numbers.
// 	aggregation: 0, // The result of Aggregate().
// };


//---------------------------------------------------------------------
//	Generators: Always generate values and ignore input values.
//---------------------------------------------------------------------

function FixedValue_Generator( Value )
{
	return function Calculate( Data, Index = 0 )
	{
		return Value;
	};
}


function Random_Generator( Min = 0, Max = 1 )
{
	return function Calculate( Data, Index = 0 )
	{
		return ( Min + ( ( Max - 1 ) * Math.random() ) );
	};
}


function Fibonacci_Generator()
{
	return function Calculate( Data, Index = 0 )
	{
		if ( Data.length === 0 ) { return 0; }
		if ( Data.length === 1 ) { return 1; }
		var value = 1;
		for ( var ndx = 2; ndx <= Data.length; ndx++ ) { value += ndx; }
		return value;
	};
}


function Sine_Generator( Start = 0, Factor = 1 )
{
	if ( Start < 0 ) { throw new Error( `Start must be a greater than or equal to zero. Default is 0.` ); }
	if ( Factor <= 0 ) { throw new Error( `Factor must be a positive number. Default is 1.` ); }
	return function Calculate( Data, Index = 0 )
	{
		return Math.sin( ( Start + ( Factor * Index ) ) );
	};
}


//---------------------------------------------------------------------
//	Evaluators: Always return, true, false, or null.
//---------------------------------------------------------------------


function Not_Evaluator()
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index ];
		if ( value === null ) { return null; }
		return ( !value );
	};
}


function Equals_Evaluator( DataValue )
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index ];
		if ( value === null ) { return null; }
		return ( value === DataValue );
	};
}


function GreaterThan_Evaluator( DataValue, Inclusive = false )
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index ];
		if ( value === null ) { return null; }
		if ( value < DataValue ) { return false; }
		if ( !Inclusive && ( value === DataValue ) ) { return false; }
		return true;
	};
}


function LessThan_Evaluator( DataValue, Inclusive = false )
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index ];
		if ( value === null ) { return null; }
		if ( value > DataValue ) { return false; }
		if ( !Inclusive && ( value === DataValue ) ) { return false; }
		return true;
	};
}


function Between_Evaluator( Min, Max, Inclusive = false )
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index ];
		if ( value === null ) { return null; }
		if ( LessThan_Evaluator( Min, !Inclusive )( Data, Index ) ) { return false; }
		if ( GreaterThan_Evaluator( Max, !Inclusive )( Data, Index ) ) { return false; }
		return true;
	};
}


//---------------------------------------------------------------------
//	Calculators: Always return a number or null.
//---------------------------------------------------------------------

function Identity_Calculator()
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index + ndx ];
		if ( value === null ) { return null; }
		return value;
	};
}


function Inverse_Calculator()
{
	return function Calculate( Data, Index = 0 )
	{
		var value = Data[ Index + ndx ];
		if ( value === null ) { return null; }
		value = ( 1 / value );
		return value;
	};
}


function Sum_Calculator( Length )
{
	if ( Length <= 0 ) { throw new Error( `Length must be a positive number.` ); }
	return function Calculate( Data, Index = 0 )
	{
		if ( ( Length + Index ) > Data.length ) { return null; }
		var sum = 0;
		for ( var ndx = 0; ndx < Length; ndx++ )
		{
			var value = Data[ Index + ndx ];
			if ( value === null ) { return null; }
			sum += value;
		}
		return sum;
	};
}


function Average_Calculator( Length )
{
	if ( Length <= 0 ) { throw new Error( `Length must be a positive number.` ); }
	return function Calculate( Data, Index = 0 )
	{
		if ( ( Length + Index ) > Data.length ) { return null; }
		var sum = Sum_Calculator( Length )( Data, Index );
		if ( sum === null ) { return null; }
		var average = ( sum / Length );
		return average;
	};
}


function ExponentialAverage_Calculator( Length, Smoothing )
{
	if ( Length <= 0 ) { throw new Error( `Length must be a positive number.` ); }
	return function Calculate( Data, Index = 0 )
	{
		if ( ( Length + Index ) > Data.length ) { return null; }
		var k = ( 2 / ( Smoothing + 1 ) );
		var average = Data[ 0 ];
		for ( ndx = 1; ndx < Length; ndx++ )
		{
			var value = Data[ Index + ndx ];
			if ( value === null ) { return null; }
			average = ( value * k ) + ( average * ( 1 - k ) );
		}
		return average;
	};
}


function StdDev_Calculator( Length )
{
	if ( Length <= 0 ) { throw new Error( `Length must be a positive number.` ); }
	return function Calculate( Data, Index = 0 )
	{
		if ( ( Length + Index ) > Data.length ) { return null; }
		var sum = Sum_Calculator( Length )( Data, Index );
		if ( sum === null ) { return null; }
		var mean = ( sum / Length );
		var squared_differences = [];
		for ( var ndx = 0; ndx < Length; ndx++ )
		{
			var value = Data[ Index + ndx ];
			if ( value === null ) { return null; }
			value = Math.pow( value - mean, 2 );
			squared_differences.push( value );
		}
		var variance = squared_differences.reduce( ( sum, value ) => sum + value, 0 ) / ( Length - 1 );
		return Math.sqrt( variance );
	};
}


function MACD_Calculator( Length1, Length2 )
{
	if ( Length1 <= 0 ) { throw new Error( `Length1 must be a positive number.` ); }
	if ( Length2 <= 0 ) { throw new Error( `Length2 must be a positive number.` ); }
	return function Calculate( Data, Index = 0 )
	{
		var ma1 = Average_Calculator( Length1 )( Data, Index );
		var ma2 = Average_Calculator( Length2 )( Data, Index );
		return ( ma1 - ma2 );
	};
}


//---------------------------------------------------------------------
//	Signals: Always return a number or null.
//---------------------------------------------------------------------


var Crossover_Signal = {
	Parameters: [
		'Length',
	],

};


function Crossover_Signal( Length )
{
	if ( Length <= 0 ) { throw new Error( `Length must be a positive number.` ); }
	return function Calculate( Data, Index = 0 )
	{
		if ( ( Length + Index ) > Data.length ) { return null; }
		var value = Data[ Index ];
		if ( value === null ) { return null; }
		return ( value === Value );
	};
}


function Generate( Length, Generator )
{
	if ( Length <= 0 ) { throw new Error( `Length must be a positive number.` ); }
	if ( typeof Generator !== 'function' ) { throw new Error( `Generator must be a generator function.` ); }
	var data = [];
	for ( var ndx = 0; ndx < Length; ndx++ )
	{
		data.unshift( Generator() );
	}
	return data;
}


function Run( Data, Index, Length, ...Calculators )
{
	var output_data = [];
	for ( var ndx = ( Length - 1 ); ndx >= 0; ndx-- )
	{
		var value = null;
		var data_index = ( Index + ndx );
		if ( ( data_index >= 0 ) && ( data_index < Data.length ) )
		{
			output_data.unshift( Data[ data_index ] );
			for ( var calc_ndx = 0; calc_ndx < Calculators.length; calc_ndx++ )
			{
				var calculator = Calculators[ calc_ndx ];
				if ( typeof calculator === 'function' )
				{
					output_data[ 0 ] = calculator( Data, data_index );
				}
			}
		}
	}
	return output_data;
}


module.exports = {

	//---------------------------------------------------------------------
	// NewSeries: NewSeries,

	//---------------------------------------------------------------------
	Generate: Generate,
	Run: Run,

	//---------------------------------------------------------------------
	Generators: { // Always generate values and ignore input values.
		FixedValue: FixedValue_Generator,
		Random: Random_Generator,
		Fibonacci: Fibonacci_Generator,
		Sine: Sine_Generator,
	},

	//---------------------------------------------------------------------
	Evaluators: { // Always return, true, false, or null.
		Not: Not_Evaluator,
		Equals: Equals_Evaluator,
		GreaterThan: GreaterThan_Evaluator,
		LessThan: LessThan_Evaluator,
		Between: Between_Evaluator,
	},

	//---------------------------------------------------------------------
	Calculators: { // Always return a number or null.
		Identity: Identity_Calculator,
		Inverse: Inverse_Calculator,
		Sum: Sum_Calculator,
		Average: Average_Calculator,
		ExponentialAverage: ExponentialAverage_Calculator,
		StdDev: StdDev_Calculator,
		MACD: MACD_Calculator,
	},

	//---------------------------------------------------------------------
	// Signals: { // Always return 'buy', 'sell', or ''.
	// },

};

