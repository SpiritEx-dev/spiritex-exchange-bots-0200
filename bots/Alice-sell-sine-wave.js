'use strict';

const ASSERT = require( 'assert' );

const SERIES = require( '../src/Stats' );
const BOT = require( '../src/Bot' );
const Config = require( './~Alice-Test.config' );


//---------------------------------------------------------------------
var sin_value = 0;
async function bot_move( Bot, Config )
{
	if ( !Config.offering_name ) { throw new Error( `Configuration error, missing field [offering_name].` ); }
	if ( !Config.order_expiration_ms ) { throw new Error( `Configuration error, missing field [order_expiration_ms].` ); }
	if ( !Config.strategy_velocity ) { throw new Error( `Configuration error, missing field [strategy_velocity].` ); }
	if ( !Config.base_asset_price_cents ) { throw new Error( `Configuration error, missing field [base_asset_price_cents].` ); }

	var account = await Bot.ExchangeClient.Accounts.Get( Bot.AccountID );
	var asset_summary = await Bot.ExchangeClient.Accounts.GetAssetSummary( Bot.AccountID );
	var asset_entry = asset_summary.find( item => ( `${account.account_name}: ${item.offering_name}` === Config.offering_name ) );
	if ( !asset_entry ) 
	{
		console.error( `Supply is exhausted.` );
		return;
	}
	var market = await Bot.ExchangeClient.PublicOfferings.GetMarket( asset_entry.offering_id, 'ticks' );
	var orders = await Bot.ExchangeClient.Orders.List( Bot.AccountID, false );
	console.log( `Account has ${orders.length} open orders.` );

	// Calculate price.
	var prices = market.Prices.map( item => item.price );
	var price = Config.base_asset_price_cents;
	if ( prices.length > 5 )
	{
		price = SERIES.Average( prices, 3 );
		var std_dev = SERIES.StandardDeviation( prices );
		price = price + ( 100 * Math.sin( sin_value ) );
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
		Bot.AccountID,
		asset_entry.offering_id,
		{
			order_type: 'sell',
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

