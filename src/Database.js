'use strict';

const ASSERT = require( 'assert' );

const SEQUELIZE = require( 'sequelize' );
const CLS_HOOKED = require( 'cls-hooked' );


module.exports = function ( DatabaseConfig )
{
	const CLS_NAMESPACE = CLS_HOOKED.createNamespace( 'exchange-bots-namespace' );
	SEQUELIZE.useCLS( CLS_NAMESPACE );

	//---------------------------------------------------------------------
	// Create the Database Object
	var database = {
		Control: {
			Sequelize: null,
			DataTypes: SEQUELIZE.DataTypes,
			Op: SEQUELIZE.Op,
			Startup: null, // function
			WithTransaction: null, // function
		},
		Models: null,
	};


	//=====================================================================
	//=====================================================================
	//
	//  ██    ██ ████████ ██ ██      ██ ████████ ██    ██ 
	//  ██    ██    ██    ██ ██      ██    ██     ██  ██  
	//  ██    ██    ██    ██ ██      ██    ██      ████   
	//  ██    ██    ██    ██ ██      ██    ██       ██    
	//   ██████     ██    ██ ███████ ██    ██       ██    
	//
	//=====================================================================
	//=====================================================================


	//---------------------------------------------------------------------
	database.Control.Startup =
		async function Startup()
		{
			if ( !DatabaseConfig.sequelize_options ) { throw new Error( `Missing required configuration setting [sequelize_options].` ); }
			if ( !DatabaseConfig.sequelize_sync_options ) { throw new Error( `Missing required configuration setting [sequelize_sync_options].` ); }

			database.Control.Sequelize = new SEQUELIZE.Sequelize( DatabaseConfig.sequelize_options );

			var entity_names = Object.keys( database.Control.Entities );
			for ( var index = 0; index < entity_names.length; index++ )
			{
				var entity_name = entity_names[ index ];
				var entity = database.Control.Entities[ entity_name ];
				var model = sequelize.define(
					entity.entity_name,
					entity.Fields,
					{
						sequelize: sequelize,
						table_name: entity.table_name,
						timestamps: true,
						paranoid: true,
						createdAt: 'created_at',
						updatedAt: 'updated_at',
						deletedAt: 'deleted_at',
					},
					entity.Indexes,
				);
				ASSERT( model );
			}

			// Account Table
			database.Control.Sequelize.define(
				'Account',
				{
					user_id: {
						type: SEQUELIZE.DataTypes.STRING,
						allowNull: false,
						primaryKey: true,
					},
					user_name: {
						type: SEQUELIZE.DataTypes.STRING,
						allowNull: false,
					},
					user_email: {
						type: SEQUELIZE.DataTypes.STRING,
						allowNull: false,
						unique: true,
					},
					account_id: {
						type: SEQUELIZE.DataTypes.STRING,
						allowNull: false,
						primaryKey: true,
					},
					account_name: {
						type: SEQUELIZE.DataTypes.STRING,
						allowNull: false,
					},
					balance: {
						type: SEQUELIZE.DataTypes.BIGINT,
						allowNull: false,
					},
				},
				{
					sequelize: database.Control.Sequelize,
					table_name: 'Accounts',
					timestamps: true,
					paranoid: true,
					createdAt: 'created_at',
					updatedAt: 'updated_at',
					deletedAt: 'deleted_at',
				},
			);


			database.Models = database.Control.Sequelize.models;

			// Sync the database structure.
			await database.Control.Sequelize.sync( DatabaseConfig.sequelize_sync_options );

			return;
		};


	//---------------------------------------------------------------------
	database.Control.Shutdown =
		async function Shutdown()
		{
			await sequelize.close();
			// console.log( `ExchangeCore is shut down.` );
			return;
		};


	//---------------------------------------------------------------------
	// Support Managed Rransactions
	database.Control.WithTransaction =
		async function WithTransaction( Callback )
		{
			if ( !Callback ) { throw new Error( `Missing required argument [Callback].` ); }
			return await sequelize.transaction(
				{},
				async function transaction( Transaction )
				{
					return await Callback( Transaction );
				} );
		};


	//---------------------------------------------------------------------
	// Return the database.
	return database;
};
