


Bot Runtime
------------------------------------------

Each Bot works in the context of a single user and account.
It can perform functions like getting the account balance and creating new orders.


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


