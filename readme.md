


Running a Bot
------------------------------------------

Runnable bots are housed in the `bots` folder.
You can run them with NodeJS from the command line.
Each bot takes a single parameter which is the path to the bot config file to use.
The bot config contains:
- The `SpiritEx Market` server to use and the bot's login information.
- The `SpiritEx Market` account to use. This account must already exist.
- The `SpiritEx Market` offering name to trade. This offering must already exist and be active.

### Example
```shell
node bots/Alice-sell-sine-wave.js configs/alice-config.js
```


Bot Runtime
------------------------------------------

Each Bot works in the context of a single user and account.
It can perform user functions like getting the account balance and creating new orders.


Statistical Functions
------------------------------------------

- Price Data
	- Price[ tick_index ]
	- Volume[ tick_index ]
	- Bars( Interval )[ bar_index ]

- Statistical Calculations
	- Average( Series, Count, StartIndex = 0 )
	- SMA( Series, Count, StartIndex = 0 )

- Triggers and Indicators
	- Crossover( Series1, Series2, Count = 0 )

- Reporting
	- Log( message )
	- Plot( Series )

- Development data sources are historical and generated data.
- Production data sources are all available Offerings.


