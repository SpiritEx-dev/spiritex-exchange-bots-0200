'use strict';

const ASSERT = require( 'assert' );

const EXCHANGE_CLIENT = require( '@spiritex/exchange-client' );
// const EXCHANGE_CLIENT = require( '../../spiritex-exchange-client.git/src/ExchangeClient' );


module.exports = function ( Config, BotMove )
{
	var Bot = {
		ExchangeClient: null,
		AccountID: null,
	};


	//---------------------------------------------------------------------
	Bot.Run =
		async function Run()
		{
			Bot.ExchangeClient = EXCHANGE_CLIENT( Config.server_url );

			// Authenticate User.
			console.log( `Authenticating as ${Config.user_name}.` );
			var authenticate_result = await Bot.ExchangeClient.Authenticate( Config.email_address, Config.password, );
			ASSERT.ok( authenticate_result );

			// Get the User's Accounts.
			var accounts = await Bot.ExchangeClient.Accounts.List();
			console.log( `Loaded ${accounts.length} accounts.` );

			// Find the Account to work with.
			var account = accounts.find( item => ( item.account_name === Config.account_name ) );
			//  - Create the account, if it doesn't exist.
			if ( !account )
			{
				console.log( `Creating account ${Config.account_name}.` );
				account = await Bot.ExchangeClient.Accounts.Create();
				account = await Bot.ExchangeClient.Accounts.Rename( account.account_id, Config.account_name );
			}
			Bot.AccountID = account.account_id;
			console.log( `Using account ${account.account_name}.` );

			setImmediate( next_update );
			return;
		};


	//---------------------------------------------------------------------
	async function next_update()
	{
		if ( _shutdown_signaled ) { return; }
		// console.log( `\n========== Updating at [${( new Date() ).toISOString()}] ========== ` );
		console.log( `\n--->>> Updating at [${( new Date() ).toISOString()}]` );
		// var authenticate_result = await Bot.ExchangeClient.Authenticate( Config.email_address, Config.password, );
		// ASSERT.ok( authenticate_result );
		try
		{
			await BotMove( Bot, Config );
		}
		catch ( error )
		{
			console.error( error.message, error );
		}
		if ( _shutdown_signaled ) { return; }
		setTimeout( next_update, Config.update_interval_ms );
		return;
	}


	//---------------------------------------------------------------------
	var _shutdown_signaled = false;
	async function graceful_shutdown()
	{
		console.log( `Shutdown signaled.` );
		setTimeout( () =>
		{
			console.log( 'Shutdown timeout exceeded (5s). Forcing process exit in 1.5s.' );
			setTimeout( () => 
			{
				console.log( `Process force exit ...` );
				process.exit( 1 );
			}, 1500 );
		}, 5000 );

		// Shutdown the Bot.
		_shutdown_signaled = true;

		console.log( `Exiting process in ${Config.update_interval_ms} ms.` );
		setTimeout( () => 
		{
			console.log( `Process exiting normally ...` );
			process.exit( 0 );
		}, Config.update_interval_ms );
		return;
	}
	process.on( 'SIGINT', async function () { await graceful_shutdown(); } );
	process.on( 'SIGTERM', graceful_shutdown );


	//---------------------------------------------------------------------
	return Bot;
};

