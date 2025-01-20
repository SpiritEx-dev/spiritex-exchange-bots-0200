'use strict';

const ASSERT = require( 'assert' );

const BOT = require( '../src/Bot' );
const STATS = require( '../src/Stats' );
const Config = require( './~Bob-Test.config' );


//---------------------------------------------------------------------
var sin_value = Math.PI;
async function bot_move( Bot, Config )
{
	if ( !Config.offering_name ) { throw new Error( `Configuration error, missing field [offering_name].` ); }
	if ( !Config.order_expiration_ms ) { throw new Error( `Configuration error, missing field [order_expiration_ms].` ); }
	if ( !Config.strategy_velocity ) { throw new Error( `Configuration error, missing field [strategy_velocity].` ); }
	if ( !Config.base_asset_price_cents ) { throw new Error( `Configuration error, missing field [base_asset_price_cents].` ); }

	var account = await Bot.ExchangeClient.Accounts.Get( Bot.AccountID );
	if ( account.balance < ( 1000 * 100 ) )
	{
		account = await Bot.ExchangeClient.Accounts.Funding(
			account.account_id,
			'deposit.direct',
			{
				amount_cents: ( 100000 * 100 )
			} );
	}

	var offerings = await Bot.ExchangeClient.PublicOfferings.List();
	var offering = offerings.find( item => ( item.full_name === Config.offering_name ) );
	var market = await Bot.ExchangeClient.PublicOfferings.GetMarket( offering.offering_id, 'ticks' );

	// Calculate price.
	var prices = market.Prices.map( item => item.price );
	var price = Config.base_asset_price_cents;
	if ( prices.length > 5 )
	{
		price = STATS.Calculators.Average( 3 )( prices );
		var std_dev = STATS.Calculators.StdDev( 5 )( prices );
		var dev = STATS.Generators.Random( -std_dev, std_dev )();
		price = price + ( 100 * Math.sin( sin_value ) ) + dev;
	}
	else
	{
		price = price + ( 100 * Math.sin( sin_value ) );
	}
	price = Math.floor( price );

	// Calculate order expiration.
	var expiration = '';
	if ( Config.order_expiration_ms < 0 ) 
	{
		expiration = '*';
	}
	else if ( Config.order_expiration_ms > 0 ) 
	{
		expiration = ( new Date( Date.now() + Config.order_expiration_ms ) ).toISOString();
	}

	// Create the order.
	var order = await Bot.ExchangeClient.Orders.Create(
		account.account_id,
		offering.offering_id,
		{
			order_type: 'buy',
			unit_count: 1,
			unit_price: price,
			expiration: expiration,
		} );
	console.log( `${order.order_type} ${order.unit_count} "${Config.offering_name}" @ $${order.unit_price / 100}` );

	sin_value += Config.strategy_velocity;
	return;
}


//---------------------------------------------------------------------
BOT( Config, bot_move ).Run();

