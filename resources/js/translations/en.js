export default {
	common: {
		add: 'Add',
		create: 'Create',
		save: 'Save',
		edit: 'Edit',
		delete: 'Delete',
		cancel: 'Cancel',
		close: 'Close',
		replenish: 'Replenish',
		withdraw: 'Withdraw',
		send: 'Send',
		continue: 'Continue',
		back: 'Back',
		finish: 'Finish',

		title: 'Title',
		description: 'Description',
		confirmation: 'Confirmation',
		amount: 'Amount',

		faq: 'FAQ',
		contact: 'Contact Us',

		replenishment_funds: 'Replenishment of funds',
		withdrawal_funds: 'Withdraw of funds',
		replenishment: 'Replenishment',
		withdrawal: 'Withdrawal',
	},

	table_header: {},

	dashboard: {
		activity: 'Activity',
		weeklySales: 'Weekly Sales',
		sales: 'Sales',
		recentOrders: 'Recent Orders',
		sources: 'Traffic Sources',
		lastweek: 'vs last week',
		orders: 'Orders',
		customers: 'Customers',
		tickets: 'Support Tickets',
		viewReport: 'View Report',
	},
	usermenu: {
		profile: 'Profile',
		signin: 'Sign In',
		dashboard: 'Dashboard',
		signout: 'Sign Out',
	},
	error: {
		notfound: 'Page Not Found',
		other: 'An Error Ocurred',
	},
	utility: {
		maintenance: 'In Maintenance',
	},
	faq: {
		call: 'Have other questions? Please reach out ',
	},
	ecommerce: {
		products: 'Products',
		filters: 'Filters',
		collections: 'Collections',
		priceRange: 'Price Range',
		customerReviews: 'Customer Reviews',
		up: 'and up',
		brand: 'Brand',
		search: 'Search for product',
		results: 'Results ( {0} of {1} )',
		orders: 'Orders',
		shipping: 'Shipping',
		freeShipping: 'Free Shipping',
		inStock: 'In Stock',
		quantity: 'Quantity',
		addToCart: 'Add To Cart',
		buyNow: 'Buy Now',
		price: 'Price',
		about: 'About this item',
		description: 'Description',
		reviews: 'Reviews',
		details: 'Product Details',
		cart: 'Cart',
		summary: 'Order Summary',
		total: 'Total',
		discount: 'Discount',
		subtotal: 'Subtotal',
		continue: 'Continue Shopping',
		checkout: 'Checkout',
	},
	menu: {
		trading: 'Trading',
		overview: 'Market overview',
		transactions: 'Transactions',
		orders: 'Orders',
		deals: 'Deals',
		transfers: 'Transfers',
		fiat_transactions: 'Transactions (fiat)',
		balance: 'Balance',
		refs: 'Referral payments',
		support: 'Support',
		fees: 'Fees',
		contacts: 'Contacts',
		api: 'API',
		offers: 'Margin offers',
		settings: 'Settings',
		notifications: 'Notifications',
		about: 'About exchange',
		terms: 'Terms of service',
		policy: 'Privacy policy',
		login: 'Sign In',
		register: 'Register',
		search: 'Search (press "ctrl + /" to focus)',
		dashboard: 'Dashboard',
		logout: 'Logout',
		profile: 'Profile',
		blank: 'Blank Page',
		pages: 'Pages',
		others: 'Others',
		email: 'Email',
		chat: 'Chat',
		todo: 'To Do',
		board: 'Task Board',
		users: 'Users',
		usersList: 'List',
		usersEdit: 'Edit',
		ecommerce: 'Ecommerce',
		ecommerceList: 'Products',
		ecommerceProductDetails: 'Product Details',
		ecommerceOrders: 'Orders',
		ecommerceCart: 'Cart',
		errorPages: 'Error Pages',
		errorNotFound: 'Not Found / 404',
		errorUnexpected: 'Unexpected / 500',
		utilityPages: 'Utility Pages',
		utilityMaintenance: 'Maintenance',
		utilitySoon: 'Coming Soon',
		utilityHelp: 'FAQs / Help',
		levels: 'Menu Levels',
		disabled: 'Menu Disabled',
		docs: 'Documentation',
		feedback: 'Feedback',
		landingPage: 'Landing Page',
		pricingPage: 'Pricing Page',
	},
	trading: {
		last_price: 'Last price',
		daily_change: 'Daily change',
		daily_high: 'Daily high',
		daily_low: 'Daily low',
		daily_volume: 'Daily volume',
		search: 'Search',
		sort: {
			change: 'Change',
			volume: 'Volume',
		},
		headers: {
			history_deal_list: 'Deals history',
			market_activity: 'Market activity',
			own_active_order_list: 'Active orders',
			own_active_position_list: 'Your opened positions',
			own_history_deal_list: 'Yours deals',
			ask: 'Ask',
			bid: 'Bid',
			ask_bid: 'Ask and Bid',
			ask_orders: 'Ask Orders',
			bid_orders: 'Bid Orders',
			chat: 'Chat',
		},
		order: {
			direction: {
				buy: 'Buy',
				sell: 'Sell',
			},
			type: {
				limit: 'Limit',
				market: 'Market',
			},
			status: {
				accepted: 'Accepted',
				partiallyFilled: 'Partially filled',
				cancelled: 'Cancelled',
				filled: 'Filled',
			},
			pay_limit_buy: 'You get (inc. {0} % fee)',
			pay_market_buy: 'You get (inc. {0} % fee)',
			pay_limit_sell: 'You get (inc. {0} % fee)',
			pay_market_sell: 'You get approximately (inc. {0} % fee)',
			offer: 'Credit offer',
			offer_option:
				'Percent (per day): {0} %; Max. period: {1} days; Avail.: {2} {3}',
			sl_rate: 'Stop Loss',
			tp_rate: 'Take Profit',
			ts_offset: 'Trailing Stop',
			use_margin: 'Use Leverage',
			use_additional_params: 'Apply additional settings',
			available: 'Available:',
			cancel_all: 'Cancel all orders',
			cancel_tp: 'Cancel all TP orders',
			cancel_sl: 'Cancel all SL orders',
			cancel_ts: 'Cancel all TS orders',
		},
		position: {
			close_all: 'Close all positions',
			close_long: 'Close all long positions',
			close_short: 'Close all short positions',
			status: {
				accepted: 'Accepted',
				partiallyFilled: 'Partially filled',
				filled: 'Filled',
			},
		},
		dialogs: {
			descriptions: {
				close_position: 'This action will close your position',
			},
		},
		notifications: {
			order: {
				text_sell: 'Sell order ',
				text_buy: 'Buy order ',
				accepted: ' is successfully placed',
				partiallyFilled: ' is partially executed',
				filled: ' has been fully executed',
				cancel: ' has been successfully cancelled',
				price: ' at the price ',
			},
			position: {
				text_sell: 'Long position ',
				text_buy: 'Short position ',
				accepted: ' is successfully opened',
				partiallyFilled: ' is partially executed',
				filled: ' has been fully executed',
				closed: ' has been successfully closed',
				mc_liquidation: ' liquidated due to insufficient initial margin',
				timeout_liquidation: ' liquidated due to expiration of the position',
				by_size: ' on size',
			},
		},
		no_deals: 'No deals',
		no_activity: 'No activity',
		date: 'Date',
		market: 'Market',
		type: 'Type',
		amount: 'Amount',
		rate: 'Price',
		rate_per: 'Price per 1',
		volume: 'Volume',
		filled: 'Filled, %',
		status: 'Status',
		close: 'Close',
		actions: 'Actions',
		cancel: 'Cancel',
		realized: 'Realized',
		credited: 'Credit',
		creditFee: 'Credit %',
		creditUsed: 'Used',
		blockedFunds: 'Margin',
		marginPosition: 'Position',
		marginLevel: 'Margin level',
		validUntil: 'Valid until',
		close_position: 'Close position',
		deposit_margin: 'Deposit margin',
		show_other_pairs: 'Show all pairs',
		not_found: 'Not found',
		total: 'Total',
		orders_tooltip: {
			avg_price: 'Average Price',
			total_size: 'Total Size',
			total_volume: 'Total Volume',
		},
		forms: {
			best_bid: 'Best Bid',
			best_ask: 'Best Ask',
			stop_loss_info: 'Stop Loss Info',
			take_profit_info: 'Take Profit Info',
			trailing_stop_info: 'Trailing Stop Info',
			dialog: {
				title: 'Confirm order',
				order: 'order',
			},
		},
		pair: 'Pair',
	},
	auth: {
		check: {
			title: 'Set New Password',
			backtosign: 'Back to Sign In',
			newpassword: 'New Password',
			button: 'Set new password and Sign in',
			error: 'The action link is invalid',
			verifylink: 'Verifying link...',
			verifyemail: 'Verifying email address...',
			emailverified: 'Email verified! Redirecting...',
		},
		forgot: {
			title: 'Forgot Password?',
			subtitle:
				'Enter your account email address and we will send you a link to reset your password.',
			email: 'Email',
			button: 'Request Password Reset',
			backtosign: 'Back to Sign In',
		},
		login: {
			title: 'Sign In',
			email: 'Email',
			password: 'Password',
			button: 'Sign In',
			orsign: 'Or sign in with',
			forgot: 'Forgot password?',
			noaccount: "Don't have an account?",
			create: 'Create one here',
			error: 'The email / password combination is invalid',
		},
		register: {
			title: 'Create Account',
			name: 'Full name',
			email: 'Email',
			password: 'Password',
			button: 'Create Account',
			orsign: 'Or sign up with',
			agree: 'By signing up, you agree to the',
			account: 'Already have an account?',
			signin: 'Sign In',
		},
	},
	balance: {
		title: 'Balance',
		headers: {
			own_fiat_balance_list: 'Own Fiat Balance List',
			own_crypto_balance_list: 'Own Crypto Balance List',
			own_active_withdraw_list: 'Own Active Withdraw List',
		},
		currency: 'Currency',
		name: 'Name',
		safe: 'Safe',
		trade: 'Trade',
		withdraw: 'Withdraw',
		blocked: 'Blocked',
		state: 'State',
		actions: 'Actions',
		date: 'Date',
		amount: 'Amount',
		show_only_not_null_balances: 'Show only not null balances',

		min_replenish_amount: 'Min. replenish amount',
		replenish_fee: 'Replenish fee',

		state_type: {
			deposit_and_withdrawal: 'Deposit and withdrawal works',
			only_withdrawal: 'Only withdrawal of funds works',
			only_deposit: 'Only funds deposit works',
			no_deposit_and_withdrawal: 'Deposit and withdrawal not works',
			sync: 'Node in sync',
			maintenance: 'Node is under maintenance',
		},

		stepper: {
			address: 'Address',
			sum: 'Sum',

			address_validation: {
				title: 'Checking address',
				description:
					'описание описание описание описание описание описание описание описание описание описание описание описание описание описание описание описание',
				address_hint: 'Enter your withdrawal address',
			},
			withdrawal_params: {
				title: 'Withdrawal options',
				description:
					'описание описание описание описание описание описание описание описание описание описание описание описание описание описание описание описание',
				min_withdraw: 'Min. withdrawal amount',
				day_limit: 'Daily limit',
				fee_withdraw: 'Withdrawal fee',
				available_amount: 'Available for withdrawal',
				less_min: 'Less than the minimum possible amount',
				more_max: 'More than the maximum possible amount',
			},
			confirmation: {
				title: 'Confirmation',
				description:
					'описание описание описание описание описание описание описание описание описание описание описание описание описание описание описание описание',
				code: 'Code',
				code_hint: 'Enter code from the email',
				two_fa_code: '2FA code',
				two_fa_code_hint: 'Enter 2FA code',
			},
		},
	},

	docs: {
		navigation: 'Contents',
		terms: {
			title: 'Terms',
			general: {
				title: 'Thanks for your interest',
				content:
					'<p>' +
					'  This Agreement sets out the terms (“terms”) of the access offered to you to internal sections of the website {{product.url}}} (“Website”) and to its trading platform (“Platform”). Please read these terms carefully and do not use the Website or the Platform, if you do not accept them. The Platform managed by BuyOwnEx.com (“Service”), enables the buyers (“Buyer”) and sellers (“Seller”) to buy and sell goods online, known as “Cryptocurrency”.</p>' +
					'<p>' +
					'  By opening the account (“Account”), the User acknowledges and warrants that:' +
					'  1. They accept these Terms' +
					'  2. They are at least 18 years old and they are fully able to accept these Terms and enter into transactions on the platform.' +
					'</p>' +
					'<p>' +
					'  The Service reserves the right at its sole discretion, to change, add or remove portions of these terms at any time. You will be notified of such changes through your contact E-Mail. Your continued use of the Website after the changes made will mean that you accept and agree to the changes. You agree that all subsequent transactions will follow these Terms. As long as you agree with the Terms and any such changes, the Service grants to you a personal and non-transferable limited right to enter and use the Website and the Platform.' +
					'</p>' +
					'<p>' +
					'  Your acceptance of these Terms, as may be amended, entitles the Service to act as an intermediary between buyers and sellers for trading on the platform in accordance with the subclauses laid down below and to perform the functions described below.' +
					'</p>',
			},
			definition: {
				title: 'Definitions',
				content:
					'<p>' +
					'  The Platform is a technical, functional and organizational structure, managed by the Service to enable the buyers and sellers to enter into transactions for Cryptocurrency sale and purchase.' +
					'</p>' +
					'<p>' +
					'  Cryptocurrency is a type of digital currency, emission and audit of which are based on asymmetrical encryption and appliance of different cryptographic methods of protection, such as Proof-of-work (scheme of evidence of work, where the work is difficult to make, but easy to check) or Proof-of-stake (scheme of evidence of balance on the account, which can be checked easily, but is expensive to save). Functioning of these cryptocurrency systems is decentralized in distributed computer networks. Main cryptocurrencies used by the Service: Bitcoin, BTC, Litecoin, LTC, Altcoin, ALC, Peercoin, PPC, Namecoin, NMC, QuarkCoin, QRK, Feathercoin, FTC, Protoshares, PTS, Worldcoin, WDC, Megacoin, MEC, Freicoin, FRC, Primecoin, FRC etc.' +
					'</p>' +
					'<p>' +
					'  “Bitcoin” is a P2P decentralized digital cash system, described in detail on the following website: <a href="http://bitcoin.org" target="_blank">http://Bitcoin.org</a>.' +
					'</p>' +
					'<p>' +
					'  “Litecoin” is a P2P decentralized digital cash system, described in detail on the following website: <a href="https://litecoin.org" target="_blank">https://Litecoin.org</a>.' +
					'</p>' +
					'<p>' +
					'  “Seller” is a person who placed an offer to sell Cryptocurrency on the platform.' +
					'</p>' +
					'<p>' +
					'  “Buyer” is a person who placed an offer to buy Cryptocurrency on the platform.' +
					'</p>' +
					'<p>' +
					'  “User” means buyers and sellers, as well as any account holder.' +
					'</p>' +
					'<p>' +
					'  “Transaction” means an agreement between the Buyer and the Seller to exchange a Cryptocurrency or for using the Platform at a jointly agreed rate.' +
					'</p>' +
					'<p>' +
					'  “Price” is a price in conventional units, for which Users are willing to buy or sell a Cryptocurrency whilst using the Platform for transactions.' +
					'</p>' +
					'<p>' +
					'  “Commission” is the amount payable to the Service for transactions, including payment of a fee to the commission agent.' +
					'</p>' +
					'<p>' +
					'  “Arbitrage“ is an array of buy/sale operations carried out in a short time within the BuyOwnEx.com Exchange.' +
					'</p>',
			},
			account: {
				title: 'Your account',
				content:
					'<p>' +
					"  The Users are liable for maintaining confidentiality of their account information, including their password, and for all activities, including transactions effected via their account. Users agree to immediately notify the Service of any unauthorized use of their login or password or any other breach of security. Users will be liable for losses incurred by the Service or by any other user of the Website owing to acts of a third party using the user's password or login. Users should not use any account other than their own account. Users must not attempt to gain unauthorized access to the Website, and any attempt to do so or to assist other users or third parties in doing this (including distribution of instructions, software and tools for this purpose) will result in termination of service for the user and the Service in such case reserves the right to take any other action against the user." +
					'</p>' +
					'<p>' +
					'  Participants agree to provide the Service with accurate, current and complete information about themselves as may be requested upon registration of the account, and to keep such information updated. Apart from that, users may update any information in their account, or may choose an alternative payment method.' +
					'</p>' +
					'<p>' +
					'  Users may have only one account at a time and may not use or create any account other then their own account. Multiple accounts of the same user shall be blocked by the Service without notice. In case of violation of this rule the Service reserves the right to unilaterally refuse to provide the services to the User without refunding the balance of the account.' +
					'</p>' +
					'<p>' +
					'  A user can be relieved from any one of these rules by making the appropriate request and subject to a prior permit from the Service.' +
					'</p>' +
					'<p>' +
					'  No claims will be accepted after 30 days of the occurrence of your issue. Please contact us within 30 days.' +
					'</p>' +
					'<p>' +
					'  Users acknowledge and agree that in order to ensure the safety of the Users’ accounts, to counteract money laundering and to enforce its internal security policy, the Service by default shall use internal controls and programs for such control to be maintained. The Service, through these programs and controls, shall collect and store information about the Users and their transactions, including personal information about the User, provided to them upon registration of the account or requested by the Service upon transactions effected, as well as indirect information, including IP-addresses, information about the operating system used, software configuration, and other information collected with the use of “cookies” technology to create statistical reports.' +
					'</p>' +
					'<p>' +
					"  The Service may require identification information depending on the amounts placed into the accounts or in case of any suspicious activity that may be indicative of illegal activity. Identification of bank accounts may also be required. The Users accept and agree that in cases where the Service has valid reasons to believe that the User's account is used for money laundering or for any other illegal activity, or that the account holder conceals or reports false identification information and other details, and also if there is a valid reason to believe that the trasactions effected via the User account were effected in breach of these Regulations, the Service shall be entitled to require the Member to provide any additional information and documents to clarify the circumstances. Transactions may be frozen until the documents are reviewed by the Service and accepted as satisfying the requirements of the legislation for counteracting laundering of incomes from criminal activities and financing of terrorism." +
					'</p>' +
					'<p>' +
					'  The Service can request from the User any additional identifying information and supporting documents at any time at the request of any competent authority or in case of application of any applicable law or regulation, including laws related to anti-laundering (legalization) of incomes obtained by criminal means, or for counteracting financing of terrorism. In this case, if the user does not provide or provides incomplete or false information and documents, the Service shall be free to unilaterally refuse to provide its services to the User.' +
					'</p>' +
					'<p>' +
					'  Accounts can be used exclusively for the purposes specified in these Terms.' +
					'</p>',
			},
			platform: {
				title: 'Platform for sale-purchase transactions',
				content:
					'<p>' +
					'  The platform enables the Buyer to post offers for purchase of Cryptocurrency, and enables the Seller to post offers for sale of Cryptocurrency. The price at which said offer is made to buy or sell Cryptocurrency shall be quoted by the user at his/her own discretion. The Participants acknowledge that their offers should be submitted only after careful consideration, and offers, once submitted by the user, shall be recognized as available for sale or purchase transactions of Cryptocurrency executed by other users. The Seller and the Buyer agree that as soon as their offers match, a transaction is binding and can not be recalled. A transaction for a purchase of Cryptocurrency shall be completed instantly and without notice to the Seller and the Buyer, and will be treated as effected as of the moment it was actually executed.' +
					'</p>' +
					'<p>' +
					'  Acting as the Buyer or the Seller in a transaction for sale and purchase of Cryptocurrency, the participants recognize that they lose the right to cancel the application after the match of prices and automatic transaction execution.' +
					'</p>' +
					'<p>' +
					'  When the buyer’s and the seller’s offers match, the Service shall gain the exclusive right to execute the transaction in the amount equal to the price specified in the transaction, net of commission fee.' +
					'</p>' +
					'<p>' +
					'  Payments made by client in the game are non-refundable. Payments made by client in the voting for coins are final and non-refundable in any case.' +
					'</p>',
			},
			service_duty: {
				title: 'Responsibilities of the service',
				content:
					'<p>' +
					'  The Users acknowledge and agree that in effecting transactions they trade with other users, and acknowledge that the Service shall only act as an intermediary in such transactions, rather than a contractor. Thus, users bear the responsibility to comply with all laws and regulations related to the transactions.' +
					'</p>' +
					'<p>' +
					'  The Service represents and warrants that:' +
					'<ul>' +
					'  <li>It will use all reasonable efforts to facilitate and ensure the transactions be effected between users.</li>' +
					'  <li>All sales-purchase transactions effected on the Platform will be posted anonymously, i.e. so that the Buyers and Sellers remain unknown to each other.</li>' +
					'  <li>A transaction price will be calculated based on the actual relevant offers made by the users and shall include the applicable commission fees.</li>' +
					'  <li>As soon as specific offers for sale and purchase of Cryptocurrency match, such offers may not be recalled.</li>' +
					'  <li>All amounts and all Cryptocurrency deposited by the User into the User’s account shall be stored by the Service on its behalf, in accordance with the data specified in the profile.</li>' +
					'  <li>All laws and regulations related to the offered Platform shall be complied with.</li>' +
					'</ul>' +
					'</p>' +
					'<p>' +
					'  If a user is in breach of these Terms the Service the Platform reserves the right to suspend the User’s account and block all funds therein, including Cryptocurrency.' +
					'</p>' +
					'<p>' +
					'  The Platform is not intended to provide any legal, tax, insurance or investment advice. The history of applications (bids) and tenders is solely for the purpose of providing users with general information related to transactions previously executed on the Platform, and should not be considered as investment advice or advice from the Service. Users are solely responsible for determining the fact that a contemplated transaction is appropriate for them based on their personal objectives, financial position and affordable risks.' +
					'</p>' +
					'<p>' +
					"  The service doesn't take responsibility for sustained casualties due to vulnerability of software, blockchains or any other technical features of cryptocurrency trading at the Exchange. Likewise it's not responsible for the casualties due to late report by cryptocurrency developers or representatives (or no report at all) of any issues with cryptocurrency including all sorts of forks, technical node issues or any other issues having fund losses as a result. In this case there are two ways to refund the losses. The priority option the service is struggling to actualize is having particular cryptocurrency developers or represenatives to refund losses fully. The other option is to charge clients' accounts in accordance with their deposit amounts of this specific cryptocurrency at the Exchange." +
					'</p>',
			},
			user_duty: {
				title: 'Responsibilities of users',
				content:
					'<p>' +
					'  Users guarantee that they will use the platform solely to effect transactions in accordance with the terms set out in these Terms and that they have the right and are able to enter into transactions on the platform.' +
					'</p>' +
					'<p>' +
					'  The Seller warrants that Cryptocurrency (s) offered for sale or transfer, corresponds to the actual Bitcoin(s), Litecoin(s), or unit(s) of other relevant Cryptocurrency.' +
					'</p>' +
					'<p>' +
					'  The Buyer warrants that the currency used to buy Cryptocurrency corresponds to the Buyer’s actual assets and arrives from legal sources.' +
					'</p>' +
					'<p>' +
					'  The Customer agrees not to utilize the Trading platform for any type of illegal activities, including, but not limited to laundering of money, financing of terrorism, or any kind of operations producing a negative effect on the Trading Platform functioning efficiency.' +
					'</p>' +
					'<p>' +
					'  The Customer acknowledges that he (her) should independently monitor the BuyOwnEx.com news in order to get the latest update on the assets listing/disabling/de-listing, as well as on any other relevant information; in case the user fails to get a timely update, the user is not liable to lodge compensation claims against the {{product.url}}} for the losses incurred.' +
					'</p>' +
					'<p>' +
					'  The Customer agrees, that in case he (she) needs to keep a few thousand open orders at a time, he (she) is obligated to inform the Support service, specifying the reason for doing so.' +
					'</p>' +
					'<p>' +
					'  The Customer agrees, that if his (hers) open orders are completely out of market (i.e. deviation from current market price is over 100 times), in case the number of these orders is excessively large, the Support service has the right to cancel them, because the said-above orders are considered as dust orders and might be misleading for other users of the Trading platform.' +
					'</p>' +
					'<p>' +
					"  The users agree that, whenever the transaction is effected, the Platform sends and receives amounts of money, Cryptocurrency (s) on behalf of the Purchaser and on behalf of the Seller, through the IT systems used by the Platform at the time of the transaction's execution." +
					'</p>' +
					'<p>' +
					'  The Exchange is intended for trade and / or exchange transactions. The Exchange does not impose a ban on a direct transfer of funds from one payment system to another without a tender, however, users abusing this feature will be warned and / or restricted in their activities.' +
					'</p>' +
					'<p>' +
					'  Clients guarantee not to disclose any information obtained during communication with the support officer. If you not agree with this, please do not use our service.' +
					'</p>' +
					'<p>' +
					'  U.S. Citizens are not allowed to use our service.' +
					'</p>',
			},
			ip: {
				title: 'Intellectual property',
				content:
					'<p>' +
					'	All intellectual property rights, texts, images or any other material posted on / pertaining to the platform are owned by the Service or by the Platform partners. Accordingly, users may not copy, distribute, reproduce, republish, upload, transmit, modify, publish or otherwise use any such content without a prior express authorization granted by the Service.' +
					'</p>',
			},
			responsibility: {
				title: 'Liability',
				content:
					'<p>' +
					'  Users warrant that they are the rightful owners and are entitled to use all moneys and Cryptocurrency, deposited in their accounts, and that the transactions effected do not violate the rights of any third party or the applicable law. The User agrees to indemnify the Service for all losses incurred by the Service for abuse of the rights of third parties or for violation of law due to a fault of the user.' +
					'</p>' +
					'<p>' +
					'  To the extent permitted by law, the Service will not be liable for any damage, loss of profits, loss of revenue, loss of business, loss of data, direct or indirect damage caused to the user if the damage is not caused by a violation of the Terms by the Service.' +
					'</p>' +
					'<p>' +
					'  The Service can not be held liable for a malfunction, damage, delay or interruption of access to the Internet, or if for any reason the site is unavailable at any time or for any period. The website contains links to other websites and resources provided by third parties, but these links are provided solely as a source of information. We have no control over the content of these websites or resources, and accept no responsibility for them or for any loss or damage which may result from their use. We are not responsible for the websites located on any other domains.' +
					'</p>' +
					'<p>' +
					'  In case of fraud, the Service shall communicate all necessary information, including names, addresses and other information requested, to the relevant authorities in charge of suppression of fraud and violations of law. Participants acknowledge that their account may be frozen at any time upon a request of any competent authority to investigate fraud or any other illegal activity.' +
					'</p>' +
					'<p>' +
					"  The service doesn't take responsibility for sustained casualties due to vulnerability or any kind of failure, abnormal behaviour of software (node, wallet, contract), blockchains or any other technical features of cryptocurrency trading at the Exchange provided by third-parties. Likewise it's not responsible for the casualties due to late report by cryptocurrency developers or representatives (or no report at all) of any issues with cryptocurrency including all sorts of forks, technical node issues or any other issues having fund losses as a result. In this case there are two ways to refund the losses. The priority option the service is struggling to actualize is having particular cryptocurrency developers or represenatives to refund losses fully. The other option is to charge clients' accounts in accordance with their deposit amounts of this specific cryptocurrency at the Exchange." +
					'</p>' +
					'<p>' +
					'  Nothing in these Terms affects the legal rights of users.' +
					'</p>' +
					'<p>' +
					'  Nothing in these Terms shall exclude or limit a liability of either party for a fraud, death or personal injury caused by negligence, violation of laws, or any other activity that can not be limited or excluded by legitimate means.' +
					'</p>' +
					'<p>' +
					'  In view of the above, the total liability of the Service that may result from or in connection with use of the Website and/or Platform by the User, be that in tort (including negligence) or otherwise, under any circumstances, will not exceed the greater of: the total balance of the account of the user (less any commission fees); or 100% of the transaction (s) that are the subject of the claim minus any commission fees.' +
					'</p>',
			},
			stop: {
				title: 'Termination',
				content:
					'<p>' +
					'	These Rules may be terminated without cause by any party by a prior written notice to the other party, and receipt thereof shall be acknowledged by the other party. Such termination shall take effect upon receipt by the terminating party of the written confirmation of the warning notice read by the other party. Such termination shall not affect the rights or obligations of either party in accordance with these Regulations before the termination takes effect.' +
					'</p>' +
					'<p>' +
					'	The Service may by a notice to users suspend or modify the Platform and / or revise or terminate these Terms at any time. The users shall be recognized to have accepted these changes or termination if they continue to use the Platform. After such notice the users may request any balances of their accounts be refunded to them by contacting the Service within 60 days of receipt of the notice from the Service about the Platform being suspended or modified. Apart from that, in the event of termination of the Platform the Service shall transfer to all users their account balances by transferring the amounts to the account, which has been most recently used for transactions effected by the user or within 14 days via the interface designated for withdrawal of funds.' +
					'</p>' +
					'<p>' +
					'If a user does not agree to these Terms the user may close the user account at any time.' +
					"Users also agree that the Service may, acting at its sole discretion and by a prior notice, suspend the User's access to the Website, including, but not limited to: restriction, suspension or termination of servicing the accounts, a prohibition of access to the Website and to its contents, and termination of the provision of accompanying services. The Service may take technical and legal measures to prevent the User’s access to the Website if we believe that this creates problems and threats of legal liability, abuses intellectual property rights of third parties or does not act in accordance with the text and spirit of these Terms. In addition, we may in appropriate circumstances and at our discretion, suspend or terminate the User's account for any reason, including, but not limited to:" +
					'(1) an attempt to gain unauthorized access to the Website or the account of another participant or to assist others in doing so,' +
					'(2) overcoming software security features limiting use of or protecting any content,' +
					'(3) use of the Platform to perform any illegal activities, including laundering of illegal incomes, or financing of terrorism or other criminal activities,' +
					'(4) violation of these Terms and Conditions,' +
					'(5) a failure to pay or fraudulent payment transactions' +
					'(6) unexpected difficulties in operation' +
					'(7) inquiries from law enforcement or other governmental agencies.' +
					'(8) Active arbitrage (over 100 transactions) in a short period of time (during 24 hours), with an intention to affect the market, to artificially raise the trading volume in particular trading pair(s) or to achieve another malicious goal.' +
					'(9) Offensive language usage in conversation with staff or in public towards Exchange and staff.' +
					'(10) Threats to support officers' +
					'</p>' +
					'<p>' +
					'	The Service as a private owner also reserves the right to unilaterally modify or suspend the Website or our Platform, to stop providing services to the User (s) without explaining specific reasons. The Users agree that the Service will not be liable to them or any third party for termination of servicing of their accounts or for the Website being inaccessible.' +
					'</p>' +
					'<p>' +
					'	The Users acknowledge and agree that their accounts can be blocked until their ID documents and/or any other information are delivered to the Service, if the Service deems it necessary for servicing the accounts, for effecting transactions and/or for operation of the Platform.' +
					'</p>    ',
			},
			additional: {
				title: 'Additional terms',
				content:
					'<p>' +
					'	In the case of force majeure, as defined by applicable laws, performance of obligations before the suffered party under these Terms will be suspended pending resolution of the problem.' +
					'</p>' +
					'<p>' +
					'	If a competent judiciary authority recognizes any provision of the Terms to be unenforceable, such provision shall be enforced to a maximum extent permissible, and all other provisions shall remain in full force and effect.' +
					'</p>',
			},
			contacts: {
				title: 'Contacts',
				content:
					'<p>' +
					'	If you have any questions related to these Terms, your rights and obligations arising from these Terms and / or use of the Website Site and the Platform, your account or on any other matter, please contact the Service Support team.' +
					'</p>',
			},
		},
		policy: {
			title: 'Policy',
			general: {
				title: 'Thanks for your interest',
				content:
					'<p>' +
					'	BuyOwnEx.com ("us", "we", or "our") operates {{config(\'app.text_url\')}} (the "Site"). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Site. We are not responsible for the websites located on any other domains.' +
					'</p>' +
					'<p>' +
					'	We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at {{product.url}}}.' +
					'</p>',
			},
			collecting_data: {
				title: 'Information Collection And Use',
				content:
					'<p>' +
					'	While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name, email address, postal address and phone number ("Personal Information").' +
					'</p>',
			},
			event_data: {
				title: 'Log Data',
				content:
					'<p>' +
					'	Like many site operators, we collect information that your browser sends whenever you visit our Site ("Log Data"). This Log Data may include information such as your computer\'s Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages and other statistics.' +
					'</p>',
			},
			cookie: {
				title: 'Cookies',
				content:
					'<p>' +
					"	Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive." +
					'</p>' +
					'<p>' +
					'	Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.' +
					'</p>',
			},
			security: {
				title: 'Security',
				content:
					'<p>' +
					'	The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.' +
					'</p>',
			},
			links: {
				title: 'Links To Other Sites',
				content:
					'<p>' +
					"	Our Site may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit." +
					'</p>' +
					'<p>' +
					'	BuyOwnEx.com has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party sites or services.' +
					'</p>',
			},
			changes: {
				title: 'Changes To This Privacy Policy',
				content:
					'<p>' +
					'	BuyOwnEx.com may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Site. You are advised to review this Privacy Policy periodically for any changes.' +
					'</p>',
			},
			contact: {
				title: 'Contact Us',
				content:
					'<p>' +
					'	If you have any questions about this Privacy Policy, please contact us.' +
					'</p>',
			},
		},
		api: {
			general: {
				title: 'General information',
				content:
					'<p>\n' +
					'                            Method parameters are expected in GET or POST format (depending on the method type). All responses from the server come in JSON format.\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            <u><i>Successful response:</i></u>\n' +
					'                        </p>\n' +
					'                        <code class="code text-success">\n' +
					'                            {\n' +
					'                                "success": true,\n' +
					'                                "code": 200,\n' +
					'                                &lt;...&gt;\n' +
					'                            }\n' +
					'                        </code>\n' +
					'                        <p>\n' +
					'                            <u><i>Error response:</i></u>\n' +
					'                        </p>\n' +
					'                        <code class="code">\n' +
					'                            {"success": false, "code": &lt;error code&gt;, "errors": [&lt;error message array&gt;]}\n' +
					'                        </code>\n' +
					'                        or\n' +
					'                        <code class="code">\n' +
					'                            {"success": false, "code": &lt;error code&gt;, "message": &lt;error description&gt;}\n' +
					'                        </code>\n' +
					'                        <ul>\n' +
					'                            <li><strong>errors</strong> – description of errors when a request with non-valid input parameters is received</li>\n' +
					'                            <li><strong>code</strong> – integer error code. All possible error codes and their description are presented below</li>\n' +
					'                            <li><strong>message</strong> – error description</li>\n' +
					'                        </ul>',
			},
			auth: {
				title: 'Authorization',
				content:
					'<p>\n' +
					'                            Part of the API is generally accessible without authorization, but most require you to specify the API key. The API key is passed in the http header <strong>X-Api-Key</strong> in the format <i>X-Api-Key: Bearer &lt;API Key&gt;</i>\n' +
					'                            <br>\n' +
					'                            To get the API key, you need to POST the following request:\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            <u><i>Address and request type:</i></u>\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            <strong>POST</strong> request to <strong>{{product.url}}/api/v1/login</strong>\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            <u><i>Headers:</i></u>\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            <strong>Content-Type</strong>: application/x-www-form-urlencoded\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            <u><i>Required parameters:</i></u>\n' +
					'                        </p>\n' +
					'                        <ul>\n' +
					'                            <li><strong>email</strong> – email specified by you during registration</li>\n' +
					'                            <li><strong>password</strong> – your current password</li>\n' +
					'                        </ul>\n' +
					'                        <p>\n' +
					'                            <u><i>Example:</i></u>\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            email=user@example.com&password=qwerty\n' +
					'                        </p>\n' +
					'                        <p>\n' +
					'                            If the answer is successful the string in JSON format will be returned\n' +
					'                        </p>\n' +
					'                        <code class="code text-success">\n' +
					'                            {"success": true,"token": "&lt;token&gt;"}\n' +
					'                        </code>\n' +
					'                        <p>\n' +
					'                            where\n' +
					'                            <br>\n' +
					'                            <strong>token</strong> – API key to be passed in x-Api-Key header in personal API requests\n' +
					'                        </p>',
			},
			limits: {
				title: 'Limitations',
				content:
					'<p>\n' +
					'                            The following restrictions apply when working with the API:\n' +
					'                            <br>\n' +
					'                            No more than 60 requests per minute are allowed. Each response to your request returns two headers <strong>X-RateLimit-Limit</strong> and <strong>X-RateLimit-Remaining</strong>\n' +
					'                        </p>\n' +
					'                        <ul>\n' +
					'                            <li><strong>X-RateLimit-Limit</strong> – allowed number of requests per minute</li>\n' +
					'                            <li><strong>X-RateLimit-Remaining</strong> – remaining number of requests at the moment</li>\n' +
					'                        </ul>',
			},
			codes: {
				title: 'HTTP response codes and API error codes',
				content:
					'<p>\n' +
					'                            <u>Possible HTTP response codes:</u>\n' +
					'                        </p>\n' +
					'                        <div class="common_table">\n' +
					'                            <table>\n' +
					'                                <thead>\n' +
					'                                    <tr>\n' +
					'                                        <th>Response code</th>\n' +
					'                                        <th>Description</th>\n' +
					'                                    </tr>\n' +
					'                                </thead>\n' +
					'                                <tbody>\n' +
					'                                    <tr>\n' +
					'                                        <td>200</td>\n' +
					'                                        <td>Successful return code</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>400</td>\n' +
					'                                        <td>API request failed. In this case, an error code explaining the cause of the error is also returned. See below for all possible error codes</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>401</td>\n' +
					'                                        <td>Authentication data is not specified or invalid</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>403</td>\n' +
					'                                        <td>There is no access to the resource</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>422</td>\n' +
					'                                        <td>Validation of incoming parameters failed</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>429</td>\n' +
					'                                        <td>Request limit exceeded</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>500</td>\n' +
					'                                        <td>Unknown system error</td>\n' +
					'                                    </tr>\n' +
					'                                </tbody>\n' +
					'                            </table>\n' +
					'                        </div>\n' +
					'                        <p>\n' +
					'                            <u>Possible error codes:</u>\n' +
					'                        </p>\n' +
					'                        <div class="common_table">\n' +
					'                            <table>\n' +
					'                                <thead>\n' +
					'                                    <tr>\n' +
					'                                        <th>Error code</th>\n' +
					'                                        <th>Description</th>\n' +
					'                                    </tr>\n' +
					'                                </thead>\n' +
					'                                <tbody>\n' +
					'                                    <tr>\n' +
					'                                        <td>9</td>\n' +
					'                                        <td>Insufficient funds</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>10</td>\n' +
					'                                        <td>Error in validation of input parameters</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>12</td>\n' +
					'                                        <td>Error while getting ticker information</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>13</td>\n' +
					'                                        <td>A negative or zero amount is specified</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>14</td>\n' +
					'                                        <td>Error while getting orderbook information</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>15</td>\n' +
					'                                        <td>No currency pair found</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>16</td>\n' +
					'                                        <td>The amount specified is too large</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>17</td>\n' +
					'                                        <td>The amount of currency to be bought/sold when placing an order is less than the allowed one</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>18</td>\n' +
					'                                        <td>A negative or zero price is specified when placing an order</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>19</td>\n' +
					'                                        <td>The price is too high when placing an order</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>22</td>\n' +
					'                                        <td>Invalid request API format</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>23</td>\n' +
					'                                        <td>Error while getting a list of deals</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>24</td>\n' +
					'                                        <td>Error while getting a list of orders</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>25</td>\n' +
					'                                        <td>Order not found</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>26</td>\n' +
					'                                        <td>Error in obtaining information on the order</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>27</td>\n' +
					'                                        <td>Error in obtaining information on the balance</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>28</td>\n' +
					'                                        <td>Error getting the list of transactions</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>29</td>\n' +
					'                                        <td>Error getting the list of transfers</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>30</td>\n' +
					'                                        <td>There is no information on the fee for this currency</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>31</td>\n' +
					'                                        <td>Error while retrieving information for a fee</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>32</td>\n' +
					'                                        <td>Incorrect parameters passed when placing an order</td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>33</td>\n' +
					'                                        <td>Error when placing an order/td>\n' +
					'                                    </tr>\n' +
					'                                    <tr>\n' +
					'                                        <td>34</td>\n' +
					'                                        <td>Error when canceling an order</td>\n' +
					'                                    </tr>\n' +
					'                                </tbody>\n' +
					'                            </table>\n' +
					'                        </div>',
			},
			public: {
				title: 'Public API',
				market: {
					title: 'Summary market data',
					content:
						'<p>\n' +
						'                            All APIs in this section do not require an X-Api-Key, but there is a limit of 60 requests per minute\n' +
						'                        </p>' +
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/summary\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/summary</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success": true,\n' +
						'    "code": 200,\n' +
						'    "ticker":\n' +
						'    {\n' +
						'        "BTC_USDT":\n' +
						'        {\n' +
						'            "id": 1,\n' +
						'            "last_price": "7234.45",\n' +
						'            "quote_volume": "891096.87103846",\n' +
						'            "base_volume": "121.840826",\n' +
						'            "isFrozen": 0,\n' +
						'            "highestBid": "7227.33",\n' +
						'            "lowestAsk": "7241.77",\n' +
						'            "high24hr": "7396",\n' +
						'            "low24hr": "7163.96",\n' +
						'            "percentChange": "-1.23",\n' +
						'            "margin": 0\n' +
						'        },\n' +
						'        "LTC_USDT":\n' +
						'        {\n' +
						'            "id": 2,\n' +
						'            "last_price": "43.98",\n' +
						'            "quote_volume": "770823.5363825",\n' +
						'            "base_volume": "17412.2085",\n' +
						'            "isFrozen": 0,\n' +
						'            "highestBid": "43.92",\n' +
						'            "lowestAsk": "44.03",\n' +
						'            "high24hr": "44.62",\n' +
						'            "low24hr": \t"43.6",\n' +
						'            "percentChange": "-0.91",\n' +
						'            "margin": 0\n' +
						'        }\n' +
						'    },\n' +
						'    "coins":\n' +
						'    {\n' +
						'        "BTC":\n' +
						'        {\n' +
						'            "id": 2,\n' +
						'            "type": "coin",\n' +
						'            "name": "Bitcoin",\n' +
						'            "withdraw": "On",\n' +
						'            "deposit": "On",\n' +
						'            "platform": null,\n' +
						'            "min_replenish": "0.0005",\n' +
						'            "min_withdraw": "0.0005",\n' +
						'            "fee_replenish": "0",\n' +
						'            "fee_withdraw": "0.0003",\n' +
						'            "max_day_withdraw": "1",\n' +
						'            "max_kyc_day_withdraw": "10"\n' +
						'        },\n' +
						'        "USDT":\n' +
						'        {\n' +
						'            "id": 1,\n' +
						'            "type": "token",\n' +
						'            "name": "Tether",\n' +
						'            "withdraw": "On",\n' +
						'            "deposit": "On",\n' +
						'            "platform": 3,\n' +
						'            "min_replenish": "1",\n' +
						'            "min_withdraw": "1",\n' +
						'            "fee_replenish": "0",\n' +
						'            "fee_withdraw": "1.2",\n' +
						'            "max_day_withdraw": "10000",\n' +
						'            "max_kyc_day_withdraw": "100000"\n' +
						'        }\n' +
						'    },\n' +
						'    "fiats":\n' +
						'    {\n' +
						'        "USD":\n' +
						'        {\n' +
						'            "id": 2,\n' +
						'            "name": "U.S. Dollar",\n' +
						'            "platforms":\n' +
						'            {\n' +
						'                "Payeer":\n' +
						'                {\n' +
						'                    "withdraw": "On",\n' +
						'                    "deposit": "On",\n' +
						'                    "min_replenish": "10",\n' +
						'                    "min_withdraw": "30",\n' +
						'                    "fee_replenish": "0.5",\n' +
						'                    "fee_withdraw": "1",\n' +
						'                    "max_day_withdraw": "500",\n' +
						'                    "max_kyc_day_withdraw": "3000"\n' +
						'                }\n' +
						'            }\n' +
						'        },\n' +
						'        "EUR":\n' +
						'        {\n' +
						'            "id": 3,\n' +
						'            "name": "European Euro",\n' +
						'            "platforms":\n' +
						'            {\n' +
						'                "Payeer":\n' +
						'                {\n' +
						'                    "withdraw": "On",\n' +
						'                    "deposit": "On",\n' +
						'                    "min_replenish": "10",\n' +
						'                    "min_withdraw": "20",\n' +
						'                    "fee_replenish": "0.5",\n' +
						'                    "fee_withdraw": "1",\n' +
						'                    "max_day_withdraw": "500",\n' +
						'                    "max_kyc_day_withdraw": "3000"\n' +
						'                }\n' +
						'            }\n' +
						'        }\n' +
						'    }\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>id</strong> – identifier of the currency pair/currency/fiat currency</li>\n' +
						'                            <li><strong>last_price</strong> – the latest price of the currency pair</li>\n' +
						'                            <li><strong>quote_volume</strong> – trading volume for the last 24 hours in quoted currency</li>\n' +
						'                            <li><strong>base_volume</strong> – trading volume for the last 24 hours in the base currency</li>\n' +
						'                            <li><strong>isFrozen</strong> – the availability of trades. Possible values: 0 - trades are available, 1 - trades are suspended</li>\n' +
						'                            <li><strong>highestBid</strong> – best buy price in a order book</li>\n' +
						'                            <li><strong>lowestAsk</strong> – best sell price in a order book</li>\n' +
						'                            <li><strong>high24hr</strong> – max deal price in the last 24 hours</li>\n' +
						'                            <li><strong>low24hr</strong> – min deal price in the last 24 hours</li>\n' +
						'                            <li><strong>percentChange</strong> – percentage change in price</li>\n' +
						'                            <li><strong>margin</strong> – the availability of margin trading. Possible values: 0 - margin trading is not available, 1 - margin trading is available</li>\n' +
						'                            <li><strong>type</strong> – type of cryptocurrency. Possible values: <strong>coin</strong>, <strong>token</strong></li>\n' +
						'                            <li><strong>name</strong> – name of currency/fiat currency</li>\n' +
						'                            <li><strong>withdraw</strong> – the availability of the withdrawal of the currency/fiat currency. Possible values: <strong>On</strong>, <strong>Off</strong></li>\n' +
						'                            <li><strong>deposit</strong> – the availability of the deposit of the currency/fiat currency. Possible values: <strong>On</strong>, <strong>Off</strong></li>\n' +
						'                            <li><strong>platform</strong> – filled only if the cryptocurrency type is <strong>token</strong>. Indicates the id of the cryptocurrency on the basis of which the token is issued</li>\n' +
						'                            <li><strong>platforms</strong> – list of available payment systems in fiat currency</li>\n' +
						'                            <li><strong>min_replenish</strong> – minimum deposit amount</li>\n' +
						'                            <li><strong>min_withdraw</strong> – minimum withdrawal amount</li>\n' +
						'                            <li><strong>fee_replenish</strong> – amount of fee when depositing funds</li>\n' +
						'                            <li><strong>fee_withdraw</strong> – the fee for withdrawal</li>\n' +
						'                            <li><strong>max_day_withdraw</strong> – maximum allowed withdrawal amount per day for non-verified users</li>\n' +
						'                            <li><strong>max_kyc_day_withdraw</strong> – maximum allowed withdrawal amount per day for KYC verified users</li>\n' +
						'                        </ul>',
				},
				currency: {
					title: 'Assets info',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/assets\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/assets</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success": true,\n' +
						'    "code": 200,\n' +
						'    "assets":\n' +
						'    {\n' +
						'        "BTC":\n' +
						'        {\n' +
						'            "name": "Bitcoin",\n' +
						'            "unified_cryptoasset_id": 1,\n' +
						'            "type": "coin",\n' +
						'            "platform": null,\n' +
						'            "can_withdraw": true,\n' +
						'            "can_deposit": true,\n' +
						'            "min_replenish": "0.0005",\n' +
						'            "min_withdraw": "0.0005",\n' +
						'            "max_withdraw": "1",\n' +
						'            "max_kyc_withdraw": "10",\n' +
						'            "fee_replenish": "0",\n' +
						'            "fee_withdraw": "0.0003",\n' +
						'            "maker_fee": "0.2",\n' +
						'            "taker_fee": "0.2"\n' +
						'        },\n' +
						'        "ETH":\n' +
						'        {\n' +
						'            "name": "Ethereum",\n' +
						'            "unified_cryptoasset_id": 1027,\n' +
						'            "type": "coin",\n' +
						'            "platform": null,\n' +
						'            "can_withdraw": true,\n' +
						'            "can_deposit": true,\n' +
						'            "min_replenish": "0.008",\n' +
						'            "min_withdraw": "0.01",\n' +
						'            "max_withdraw": "100",\n' +
						'            "max_kyc_withdraw": "1000",\n' +
						'            "fee_replenish": "0",\n' +
						'            "fee_withdraw": "0.007",\n' +
						'            "maker_fee": "0.2",\n' +
						'            "taker_fee": "0.2"\n' +
						'        },\n' +
						'        "USDT":\n' +
						'        {\n' +
						'            "name": "Tether",\n' +
						'            "unified_cryptoasset_id": 825,\n' +
						'            "type": "token",\n' +
						'            "platform": 3,\n' +
						'            "can_withdraw": true,\n' +
						'            "can_deposit": true,\n' +
						'            "min_replenish": "1",\n' +
						'            "min_withdraw": "1",\n' +
						'            "max_withdraw": "10000",\n' +
						'            "max_kyc_withdraw": "100000",\n' +
						'            "fee_replenish": "0",\n' +
						'            "fee_withdraw": "1.2",\n' +
						'            "maker_fee": "0.2",\n' +
						'            "taker_fee": "0.2"\n' +
						'        },\n' +
						'        "USD":\n' +
						'        {\n' +
						'            "name": "U.S. Dollar",\n' +
						'            "unified_cryptoasset_id": null,\n' +
						'            "type": "fiat",\n' +
						'            "maker_fee": "0.2",\n' +
						'            "taker_fee": "0.2",\n' +
						'            "platforms":\n' +
						'            {\n' +
						'                "Payeer":\n' +
						'                {\n' +
						'                    "can_withdraw": true,\n' +
						'                    "can_deposit": true,\n' +
						'                    "min_replenish": "10",\n' +
						'                    "min_withdraw": "30",\n' +
						'                    "max_withdraw": "500",\n' +
						'                    "max_kyc_withdraw": "3000"\n' +
						'                    "fee_replenish": "0.5",\n' +
						'                    "fee_withdraw": "1"\n' +
						'                }\n' +
						'            }\n' +
						'        },\n' +
						'        "EUR":\n' +
						'        {\n' +
						'            "name": "European Euro",\n' +
						'            "unified_cryptoasset_id": null,\n' +
						'            "type": "fiat",\n' +
						'            "maker_fee": "0.2",\n' +
						'            "taker_fee": "0.2",\n' +
						'            "platforms":\n' +
						'            {\n' +
						'                "Payeer":\n' +
						'                {\n' +
						'                    "can_withdraw": true,\n' +
						'                    "can_deposit": true,\n' +
						'                    "min_replenish": "10",\n' +
						'                    "min_withdraw": "20",\n' +
						'                    "max_withdraw": "500",\n' +
						'                    "max_kyc_withdraw": "3000"\n' +
						'                    "fee_replenish": "0.5",\n' +
						'                    "fee_withdraw": "1"\n' +
						'                }\n' +
						'            }\n' +
						'        }\n' +
						'    }\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>unified_cryptoasset_id</strong> – unique currency identifier assigned by the CoinMarketCap aggregator</li>\n' +
						'                            <li><strong>name</strong> – name of currency/fiat currency</li>\n' +
						'                            <li><strong>type</strong> – type of cryptocurrency. Possible values: <strong>coin</strong>, <strong>token</strong>, <strong>fiat</strong></li>\n' +
						'                            <li><strong>maker_fee</strong> – maker fee (%)</li>\n' +
						'                            <li><strong>taker_fee</strong> – taker fee (%)</li>\n' +
						'                            <li><strong>platform</strong> – filled only if the cryptocurrency type is <strong>token</strong>. Indicates the id of the cryptocurrency on the basis of which the token is issued</li>\n' +
						'                            <li><strong>platforms</strong> – list of available payment systems in fiat currency</li>\n' +
						'                            <li><strong>can_withdraw</strong> – the availability of the withdrawal of the currency/fiat currency. Possible values: <strong>true</strong>, <strong>false</strong></li>\n' +
						'                            <li><strong>can_deposit</strong> – availability of funds replenishment by currency/fiat currency. Possible values: <strong>true</strong>, <strong>false</strong></li>\n' +
						'                            <li><strong>min_replenish</strong> – minimum deposit amount</li>\n' +
						'                            <li><strong>min_withdraw</strong> – minimum withdrawal amount</li>\n' +
						'                            <li><strong>fee_replenish</strong> – amount of fee when depositing funds</li>\n' +
						'                            <li><strong>fee_withdraw</strong> – the fee for withdrawal</li>\n' +
						'                            <li><strong>max_withdraw</strong> – maximum allowed withdrawal amount per day for non-verified users</li>\n' +
						'                            <li><strong>max_kyc_withdraw</strong> – maximum allowed withdrawal amount per day for KYC verified users</li>\n' +
						'                        </ul>',
				},
				get_ticker: {
					title: 'Ticker',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/ticker\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/ticker</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success": true,\n' +
						'    "code": 200,\n' +
						'    "ticker":\n' +
						'    {\n' +
						'        "BTC_USDT":\n' +
						'        {\n' +
						'            "base_id": 1,\n' +
						'            "quote_id": 825,\n' +
						'            "last_price": "7234.45",\n' +
						'            "quote_volume": "891096.87103846",\n' +
						'            "base_volume": "121.840826",\n' +
						'            "isFrozen": 0,\n' +
						'            "highestBid": "7227.33",\n' +
						'            "lowestAsk": "7241.77",\n' +
						'            "high24hr": "7396",\n' +
						'            "low24hr": "7163.96",\n' +
						'            "percentChange": "-1.23",\n' +
						'            "margin": 0\n' +
						'        },\n' +
						'        "LTC_USDT":\n' +
						'        {\n' +
						'            "base_id": 2,\n' +
						'            "quote_id": 825,\n' +
						'            "last_price": "43.98",\n' +
						'            "quote_volume": "770823.5363825",\n' +
						'            "base_volume": "17412.2085",\n' +
						'            "isFrozen": 0,\n' +
						'            "highestBid": "43.92",\n' +
						'            "lowestAsk": "44.03",\n' +
						'            "high24hr": "44.62",\n' +
						'            "low24hr": \t"43.6",\n' +
						'            "percentChange": "-0.91",\n' +
						'            "margin": 0\n' +
						'        }\n' +
						'    }\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>base_id</strong> – unique identifier of the base currency assigned by the CoinMarketCap aggregator. <strong>null</strong> if not exist</li>\n' +
						'                            <li><strong>quote_id</strong> – unique identifier of the quoted currency assigned by the CoinMarketCap aggregator. <strong>null</strong> if not exist</li>\n' +
						'                            <li><strong>last_price</strong> – the latest price of the currency pair</li>\n' +
						'                            <li><strong>quote_volume</strong> – trading volume for the last 24 hours in quoted currency</li>\n' +
						'                            <li><strong>base_volume</strong> – trading volume for the last 24 hours in the base currency</li>\n' +
						'                            <li><strong>isFrozen</strong> – the availability of trades. Possible values: 0 - trades are available, 1 - trades are suspended</li>\n' +
						'                            <li><strong>highestBid</strong> – best buy price in a order book</li>\n' +
						'                            <li><strong>lowestAsk</strong> – best sell price in a order book</li>\n' +
						'                            <li><strong>high24hr</strong> – max deal price in the last 24 hours</li>\n' +
						'                            <li><strong>low24hr</strong> – min deal price in the last 24 hours</li>\n' +
						'                            <li><strong>percentChange</strong> – percentage change in price</li>\n' +
						'                            <li><strong>margin</strong> – the availability of margin trading. Possible values: 0 - margin trading is not available, 1 - margin trading is available</li>\n' +
						'                        </ul>',
				},
				get_depth: {
					title: 'Order book',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/orderbook/{pair}?depth=&lt;depth&gt;\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                            <ul>\n' +
						'                                <li><strong>pair</strong> – currency pair in the format &lt;code of the base currency&gt;_&lt;code of the quote currency&gt;</li>\n' +
						'                            </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <ul>\n' +
						'                            <li><strong>depth</strong> – the depth of order book. Possible values: <strong>5</strong>,<strong>10</strong>,<strong>20</strong>,<strong>50</strong>,<strong>100</strong>,<strong>500</strong>. If not specified, 50 levels are returned</li>\n' +
						'                            </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/orderbook/BTC_USDT?depth=5</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success": true,\n' +
						'    "code": 200,\n' +
						'    "timestamp": 1576080362,\n' +
						'    "bids": [\n' +
						'                [7151.1,0.06188],\n' +
						'                [7148.04,0.000202],\n' +
						'                [7146.57,0.23855],\n' +
						'                [7143.5,0.3281],\n' +
						'                [7140.44,0.3688]\n' +
						'            ],\n' +
						'    "asks": [\n' +
						'                [7167.28,0.001589],\n' +
						'                [7169.32,0.03134],\n' +
						'                [7171.96,0.30115],\n' +
						'                [7175.03,0.3191],\n' +
						'                [7178.11,0.3258]\n' +
						'            ],\n' +
						'    "bids_vol": 10337.81995758,\n' +
						'    "asks_vol":9672.98765772,\n' +
						'    "bids_amount":1.447986,\n' +
						'    "asks_amount":1.346869,\n' +
						'    "bids_num":7,\n' +
						'    "asks_num":6\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>timestamp</strong> – time of formation of the order book for a given currency pair in UNIX timestamp format</li>\n' +
						'                            <li><strong>bids</strong> – an array containing two values: buy price and quantity. The data is aggregated and sorted by price.</li>\n' +
						'                            <li><strong>asks</strong> – an array containing two values: sell price and quantity. The data is aggregated and sorted by price.</li>\n' +
						'                            <li><strong>bids_vol</strong> – the total volume in the glass to buy in the quoted currency regardless of the depth value</li>\n' +
						'                            <li><strong>asks_vol</strong> – the total volume in the glass for sale in the quoted currency regardless of the depth value</li>\n' +
						'                            <li><strong>bids_amount</strong> – the total volume in the glass to buy in the base currency regardless of the depth value</li>\n' +
						'                            <li><strong>asks_amount</strong> – the total volume in the glass for sale in the base currency regardless of the depth value</li>\n' +
						'                            <li><strong>bids_num</strong> – total number of orders placed in the buy direction</li>\n' +
						'                            <li><strong>asks_num</strong> – total number of orders placed in the sell direction</li>\n' +
						'                        </ul>',
				},
				get_deal: {
					title: 'Trades list',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/trades/{pair}?&limit=&lt;limit&gt;&type=&lt;type&gt;\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>pair</strong> – currency pair in the format &lt;code of the base currency&gt;_&lt;code of the quote currency&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>limit</strong> – limit of returned data. Possible values: <strong>5</strong>,<strong>10</strong>,<strong>20</strong>,<strong>50</strong>,<strong>100</strong>,<strong>500</strong>. If not specified, 20 records are returned</li>\n' +
						'                            <li><strong>type</strong> – trade direction. Possible values: <strong>buy</strong>/<strong>sell</strong>. If not specified, multidirectional trades are returned</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/trades/BTC_USDT?limit=5&type=sell</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "trades": [\n' +
						'        {\n' +
						'            "trade_id": 5627122,\n' +
						'            "price":"7206.25",\n' +
						'            "base_volume":"0.017624",\n' +
						'            "quote_volume":"127.00295",\n' +
						'            "trade_timestamp":1576083062,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627108,\n' +
						'            "price":"7207.14",\n' +
						'            "base_volume":"0.019604",\n' +
						'            "quote_volume":"141.28877256",\n' +
						'            "trade_timestamp":1576083058,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627079,\n' +
						'            "price":"7207.42",\n' +
						'            "base_volume":"0.01802",\n' +
						'            "quote_volume":"129.8777084",\n' +
						'            "trade_timestamp":1576083037,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627062,\n' +
						'            "price":"7207.74",\n' +
						'            "base_volume":"0.014654",\n' +
						'            "quote_volume":"105.62222196",\n' +
						'            "trade_timestamp":1576083002,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627051,\n' +
						'            "price":"7208",\n' +
						'            "base_volume":"0.00614",\n' +
						'            "quote_volume":"44.25712",\n' +
						'            "trade_timestamp":1576082998,\n' +
						'            "type":"sell"\n' +
						'        }\n' +
						'    ]\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>trades</strong> – an array of trades</li>\n' +
						'                            <li><strong>trade_id</strong> – unique identifier of the trade</li>\n' +
						'                            <li><strong>price</strong> – trade price</li>\n' +
						'                            <li><strong>base_volume</strong> – trade volume in base currency</li>\n' +
						'                            <li><strong>quote_volume</strong> – trade volume in quoted currency</li>\n' +
						'                            <li><strong>trade_timestamp</strong> – trade execution time in UNIX timestamp format</li>\n' +
						'                            <li><strong>type</strong> – trade direction</li>\n' +
						'                        </ul>',
				},
			},
			private: {
				title: 'Personal API',
				deal_list: {
					title: 'Deals list',
					content:
						'<p>\n' +
						'                            All of the following API requests in this section require personal token in the header "X-Api-Key"\n' +
						'                        </p>' +
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/deals/{pair}?&limit=&lt;limit&gt;&type=&lt;type&gt;\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                        <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>pair</strong> – currency pair in the format &lt;code of the base currency&gt;_&lt;code of the quote currency&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>limit</strong> – limit of returned data. Possible values: <strong>5</strong>,<strong>10</strong>,<strong>20</strong>,<strong>50</strong>,<strong>100</strong>,<strong>500</strong>. If not specified, 20 records are returned</li>\n' +
						'                            <li><strong>type</strong> – trade direction. Possible values: <strong>buy</strong>/<strong>sell</strong>. If not specified, multidirectional trades are returned</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/deals/BTC_USDT?limit=5&type=sell</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "trades": [\n' +
						'        {\n' +
						'            "trade_id": 5627122,\n' +
						'            "price":"7206.25",\n' +
						'            "base_volume":"0.017624",\n' +
						'            "quote_volume":"127.00295",\n' +
						'            "trade_timestamp":1576083062,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627108,\n' +
						'            "price":"7207.14",\n' +
						'            "base_volume":"0.019604",\n' +
						'            "quote_volume":"141.28877256",\n' +
						'            "trade_timestamp":1576083058,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627079,\n' +
						'            "price":"7207.42",\n' +
						'            "base_volume":"0.01802",\n' +
						'            "quote_volume":"129.8777084",\n' +
						'            "trade_timestamp":1576083037,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627062,\n' +
						'            "price":"7207.74",\n' +
						'            "base_volume":"0.014654",\n' +
						'            "quote_volume":"105.62222196",\n' +
						'            "trade_timestamp":1576083002,\n' +
						'            "type":"sell"\n' +
						'        },\n' +
						'        {\n' +
						'            "trade_id":5627051,\n' +
						'            "price":"7208",\n' +
						'            "base_volume":"0.00614",\n' +
						'            "quote_volume":"44.25712",\n' +
						'            "trade_timestamp":1576082998,\n' +
						'            "type":"sell"\n' +
						'        }\n' +
						'    ]\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>trades</strong> – an array of trades</li>\n' +
						'                            <li><strong>trade_id</strong> – unique identifier of the trade</li>\n' +
						'                            <li><strong>price</strong> – trade price</li>\n' +
						'                            <li><strong>base_volume</strong> – trade volume in base currency</li>\n' +
						'                            <li><strong>quote_volume</strong> – trade volume in quoted currency</li>\n' +
						'                            <li><strong>trade_timestamp</strong> – trade execution time in UNIX timestamp format</li>\n' +
						'                            <li><strong>type</strong> – trade direction</li>\n' +
						'                        </ul>',
				},
				orders_list: {
					title: 'Orders list',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/orders/{pair}\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>pair</strong> – currency pair in the format &lt;code of the base currency&gt;_&lt;code of the quote currency&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/orders/BTC_USDT</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "buy_limit": [\n' +
						'        {\n' +
						'            "id": 344322,\n' +
						'            "originalAmount": "0.5",\n' +
						'            "actualAmount": "0.2",\n' +
						'            "price": "7207.14",\n' +
						'            "time": 1576083062,\n' +
						'        },\n' +
						'        {\n' +
						'            "id": 344323,\n' +
						'            "originalAmount": "0.2",\n' +
						'            "actualAmount": "0.11",\n' +
						'            "price": "7205.22",\n' +
						'            "time": 1576084077,\n' +
						'        }\n' +
						'    ],\n' +
						'    "sell_limit": [\n' +
						'        {\n' +
						'            "id": 344324,\n' +
						'            "originalAmount": "0.5",\n' +
						'            "actualAmount": "0.2",\n' +
						'            "price": "7217.14",\n' +
						'            "time": 1576085062,\n' +
						'        },\n' +
						'        {\n' +
						'            "id": 344325,\n' +
						'            "originalAmount": "0.2",\n' +
						'            "actualAmount": "0.11",\n' +
						'            "price": "7215.22",\n' +
						'            "time": 1576085077,\n' +
						'        }\n' +
						'    ],\n' +
						'    "buy_sl": [],\n' +
						'    "sell_sl": [],\n' +
						'    "buy_tp": [],\n' +
						'    "sell_tp": [],\n' +
						'    "buy_ts": [],\n' +
						'    "sell_ts": []\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>buy_limit</strong> – an array of buy limit orders</li>\n' +
						'                            <li><strong>sell_limit</strong> – an array of sell limit orders</li>\n' +
						'                            <li><strong>buy_sl</strong> – an array of buy stop loss orders</li>\n' +
						'                            <li><strong>sell_sl</strong> – an array of sell stop loss orders</li>\n' +
						'                            <li><strong>buy_tp</strong> – an array of buy take profit orders</li>\n' +
						'                            <li><strong>sell_tp</strong> – an array of sell take profit orders</li>\n' +
						'                            <li><strong>buy_ts</strong> – an array of buy trailing stop orders</li>\n' +
						'                            <li><strong>sell_ts</strong> – an array of sell trailing stop orders</li>\n' +
						'                            <li><strong>id</strong> – unique identifier of the order</li>\n' +
						'                            <li><strong>originalAmount</strong> – the initial amount of currency in the order</li>\n' +
						'                            <li><strong>actualAmount</strong> – the current amount of currency in the order</li>\n' +
						'                            <li><strong>price</strong> – buy/sell order price</li>\n' +
						'                            <li><strong>time</strong> – order placing time in UNIX timestamp format</li>\n' +
						'                        </ul>',
				},
				orders_info: {
					title: 'Order info',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/order_info?order={order}\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>order</strong> – unique identifier of the order</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/order_info?order=344325</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "id": 344325,\n' +
						'    "status": "partiallyFilled",\n' +
						'    "pair": "BTC_USDT",\n' +
						'    "type": "LIMIT",\n' +
						'    "side": "sell",\n' +
						'    "price": "7215.22",\n' +
						'    "size": "0.2",\n' +
						'    "actualSize": "0.11",\n' +
						'    "trades": [\n' +
						'        {\n' +
						'            "id": 5627162,\n' +
						'            "size": "0.02",\n' +
						'            "price": "7215.22",\n' +
						'            "time": 1576084062\n' +
						'        },\n' +
						'        {\n' +
						'            "id": 5627173,\n' +
						'            "size": "0.07",\n' +
						'            "price": "7215.22",\n' +
						'            "time": 1576089055\n' +
						'        }\n' +
						'    ]\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>id</strong> – unique identifier of the order</li>\n' +
						'                            <li><strong>status</strong> – current order status. Possible values: <strong>accepted</strong>, <strong>partiallyFilled</strong>, <strong>filled</strong></li>\n' +
						'                            <li><strong>pair</strong> – currency pair</li>\n' +
						'                            <li><strong>type</strong> – order type. Possible values: <strong>LIMIT</strong>, <strong>MARKET</strong>, <strong>STOPLOSS</strong>, <strong>TAKEPROFIT</strong>, <strong>TRAILINGSTOP</strong></li>\n' +
						'                            <li><strong>side</strong> – order direction. Possible values: <strong>sell</strong>, <strong>buy</strong></li>\n' +
						'                            <li><strong>price</strong> – order buy/sell price</li>\n' +
						'                            <li><strong>size</strong> – the initial amount of currency in the order</li>\n' +
						'                            <li><strong>actualSize</strong> – the current amount of currency in the order</li>\n' +
						'                            <li><strong>trades</strong> – array of trades on this order</li>\n' +
						'                        </ul>',
				},
				balance: {
					title: 'Balance',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/balance?currency={currency}\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/balance?currency=BTC</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "currency": "BTC",\n' +
						'    "safe": "1.723",\n' +
						'    "withdraw": "1.2",\n' +
						'    "trade": "3.7455",\n' +
						'    "blocked": "2.7",\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                            <li><strong>safe</strong> – available funds to an external account</li>\n' +
						'                            <li><strong>withdraw</strong> – blocked funds for withdrawal</li>\n' +
						'                            <li><strong>trade</strong> – available funds on the trading account</li>\n' +
						'                            <li><strong>blocked</strong> – funds blocked under orders</li>\n' +
						'                        </ul>',
				},
				transaction_list: {
					title: 'Transactions list',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/transactions?currency={currency}\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/transactions?currency=BTC</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "currency": "BTC",\n' +
						'    "count": 2,\n' +
						'    "transactions": [\n' +
						'        {\n' +
						'            "id": 16625,\n' +
						'            "amount": "0.2",\n' +
						'            "currency": "BTC",\n' +
						'            "type": true,\n' +
						'            "status": "done",\n' +
						'            "time": 1576091055\n' +
						'        },\n' +
						'        {\n' +
						'            "id": 16634,\n' +
						'            "amount": "0.11",\n' +
						'            "currency": "BTC",\n' +
						'            "type": false,\n' +
						'            "status": "wait",\n' +
						'            "time": 1576091055\n' +
						'        }\n' +
						'    ]\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                            <li><strong>count</strong> – total number of currency transactions</li>\n' +
						'                            <li><strong>transactions</strong> – an array of transactions</li>\n' +
						'                            <li><strong>id</strong> – unique transaction ID</li>\n' +
						'                            <li><strong>amount</strong> – transaction amount</li>\n' +
						'                            <li><strong>type</strong> – transaction type (<strong>true</strong> - deposit, <strong>false</strong> - withdrawal)</li>\n' +
						'                            <li><strong>status</strong> – transaction status. Possible values: <strong>accepted</strong>, <strong>wait</strong> - in the process of execution, <strong>done</strong> - executed</li>\n' +
						'                            <li><strong>time</strong> – the time that a transaction was created in UNIX timestamp format</li>\n' +
						'                        </ul>',
				},
				transfer_list: {
					title: 'Transfers list',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/transfers?currency={currency}\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/transfers?currency=BTC</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "currency": "BTC",\n' +
						'    "count": 2,\n' +
						'    "transfers": [\n' +
						'        {\n' +
						'            "id": 36123,\n' +
						'            "amount": "0.2",\n' +
						'            "currency": "BTC",\n' +
						'            "side": true,\n' +
						'            "time": 1576091055\n' +
						'        },\n' +
						'        {\n' +
						'            "id": 36222,\n' +
						'            "amount": "0.11",\n' +
						'            "currency": "BTC",\n' +
						'            "side": false,\n' +
						'            "time": 1576091055\n' +
						'        }\n' +
						'    ]\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                            <li><strong>count</strong> – total number of internal currency transfers</li>\n' +
						'                            <li><strong>transfers</strong> – an array of transfers</li>\n' +
						'                            <li><strong>id</strong> – unique transfer ID</li>\n' +
						'                            <li><strong>amount</strong> – transfer amount</li>\n' +
						'                            <li><strong>side</strong> – transfer type (<strong>true</strong> - from external account to trading account, <strong>false</strong> - from trading account to an external)</li>\n' +
						'                            <li><strong>time</strong> – the time that a transfer was created in UNIX timestamp format</li>\n' +
						'                        </ul>',
				},
				commission: {
					title: 'Current fee info',
					content:
						'<p>\n' +
						'                            GET request at {{product.url}}/api/v1/fee?currency={currency}\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>{{product.url}}/api/v1/fee?currency=BTC</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "currency": "BTC",\n' +
						'    "fee": "0.2"\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>currency</strong> – currency code</li>\n' +
						'                            <li><strong>fee</strong> – current trade fee for specified currency</li>\n' +
						'                        </ul>',
				},
				place_order: {
					title: 'Place order',
					content:
						'<p>\n' +
						'                            POST request at {{product.url}}/api/v1/makeOrder\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                            <li><strong>Content-Type</strong> – application/x-www-form-urlencoded</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>type</strong> – order type. Can take only two values: LIMIT or MARKET</li>\n' +
						'                            <li><strong>currency</strong> – code of the base currency</li>\n' +
						'                            <li><strong>market</strong> – code of the quote currency</li>\n' +
						'                            <li><strong>side</strong> – direction of the order: <strong>0</strong> - buy order, <strong>1</strong> - sell order</li>\n' +
						'                            <li><strong>amount</strong> – quantity of currency bought/sold</li>\n' +
						'                            <li><strong>rate</strong> – buy/sell price</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>sl_rate</strong> – the stop loss price level at which a back-directed market order will be created for the executed volume</li>\n' +
						'                            <li><strong>tp_rate</strong> – the take profit price level at which a back-directed market order will be created for the executed volume</li>\n' +
						'                            <li><strong>ts_offset</strong> – trailing stop price offset, at which a back-directed market order will be created for the executed volume</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>type=LIMIT&currency=BTC&market=USDT&side=0&amount=0.5&rate=7112.1&tp_rate=7200</i>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "orders": {\n' +
						'        "order_id": 344711,\n' +
						'        "tp_order_id": 344712\n' +
						'    }\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>orders</strong> – list of created orders</li>\n' +
						'                            <li><strong>order_id</strong> – unique identifier of the order (LIMIT or MARKET)</li>\n' +
						'                            <li><strong>tp_order_id</strong> – unique identifier of take profit order (if tp_rate parameter was set)</li>\n' +
						'                            <li><strong>sl_order_id</strong> – unique identifier of stop loss order (if sl_rate parameter was set)</li>\n' +
						'                            <li><strong>ts_order_id</strong> – unique identifier of trailing stop order (if ts_offset parameter was set)</li>\n' +
						'                        </ul>',
				},
				cancel_order: {
					title: 'Cancel order',
					content:
						'<p>\n' +
						'                            POST request at {{product.url}}/api/v1/cancelOrder\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Headers:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>X-Api-Key</strong> – Bearer &lt;token&gt;</li>\n' +
						'                            <li><strong>Content-Type</strong> – application/x-www-form-urlencoded</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Required parameters:</u>\n' +
						'                        <ul>\n' +
						'                            <li><strong>order_id</strong> – unique identifier of the order (limit or conditional order)</li>\n' +
						'                            <li><strong>currency</strong> – code of the base currency</li>\n' +
						'                            <li><strong>market</strong> – code of the quote currency</li>\n' +
						'                        </ul>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <u>Optional parameters:</u>\n' +
						'                            <br>\n' +
						'                            <strong>-</strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            If a LIMIT order that was placed with additional parameters sl_rate, tp_rate or ts_offset is canceled and this order has not yet started to be executed, then all conditional orders are canceled as well. If there are already deals on the cancelled limit order, only the limit order is cancelled. Conditional orders tied to the limit should be canceled by a separate request.\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <strong><i>Example:</i></strong>\n' +
						'                        </p>\n' +
						'                        <p>\n' +
						'                            <i>order_id=344711&currency=BTC&market=USDT</i>\n' +
						'                        </p>\n' +
						'\n' +
						'                        <p>\n' +
						'                            If the answer is successful the string in JSON format will be returned\n' +
						'                        </p>\n' +
						'                        <pre>\n' +
						'{\n' +
						'    "success":true,\n' +
						'    "code":200,\n' +
						'    "orders": {\n' +
						'        "order_id": 344711,\n' +
						'        "tp_order_id": 344712\n' +
						'    }\n' +
						'}\n' +
						'                </pre>\n' +
						'                        <p>\n' +
						'                            where\n' +
						'                        </p>\n' +
						'                        <ul>\n' +
						'                            <li><strong>orders</strong> – list of cancelled orders</li>\n' +
						'                            <li><strong>order_id</strong> – unique identifier of the cancelled order with LIMIT type</li>\n' +
						'                            <li><strong>tp_order_id</strong> – unique identifier of the cancelled take profit order</li>\n' +
						'                            <li><strong>sl_order_id</strong> – unique identifier of the cancelled stop loss order</li>\n' +
						'                            <li><strong>ts_order_id</strong> – unique identifier of the cancelled trailing stop order</li>\n' +
						'                        </ul>',
				},
			},
		},
	},

	user: {
		title: {
			profile: 'Profile',
			account: 'Account',
			basic_info: 'Bacic Information',
			actions: 'Actions',
			metadata: 'Metadata',
			verification: 'Verification',
			api: 'API',
			security: 'Security',
			settings: 'Settings',
		},

		disabled_alert: {
			title: 'User blocked',
			content:
				'You have been blocked by system administrator. Please, contact support team for reason',
		},

		info: {
			display_name: 'Display name',
			email: 'Email',
			rate: 'Rate API limit',
			ref_link: 'Referral Link',
			email_verified: 'Email Verified',
			protected: '2FA protected',
			kyc_status: 'KYC Status',
		},

		api: {
			title: 'API keys',
			api_empty: 'API list is empty',
			dialog: {
				create: {
					title: 'Create API',
					api_name: 'API name',
					copy_tokens_description:
						'Copy the API key data, since when the dialog box is closed, the API Key will be displayed as SHA 256 hash, and the Secret Key will be hidden',
					api_key: 'API key',
					secret_key: 'Secret key',
				},
				edit: {
					title: 'Edit abilities',
				},
				delete_all: {
					title: 'Delete all API',
					description: 'Are you sure you want to delete all API?',
				},
				delete_one: {
					title: 'Delete API',
					description: 'Are you sure you want to delete the API named',
				},
			},
			headers: {
				hash: 'API Key Hash (SHA 256)',
				secret_key: 'Secret Key (Hidden)',
				abilities: 'API abilities',
				created: 'Created',
				updated: 'Updated',
				last_usage: 'Last usage',
			},
		},

		security: {
			title: 'buyownex recommends using two-factor authentication',
			description: {
				line_one:
					'Two-factor authentication (2fa) greatly enhances safety, requesting not only the login and password, but a special authorization code.',
				line_two:
					'BuyOwnEx uses 2fa from Google Authenticator. To enable this feature, download Google Authenticator to your mobile phone and scan the QR code. ',
				line_three:
					'After installing the application, use the codes specified therein to work with BuyOwnEx.',
			},
			for_disable:
				'To disable two-factor authentication, enter the current code in the Google Authenticator App',
			status: {
				enabled: 'Enabled',
				disabled: 'Disabled',
			},
			two_factor_auth: 'Two-factor authentication',
			secret_key: 'Secret key',
			enable: 'Enable',
			disable: 'Disable',
			auth_code: 'Auth code (2fa)',
		},

		settings: {
			headers: {
				managing_email_notifications: 'Managing email notifications',
				ref_settings: 'Referral program settings',
				system_settings: 'System settings',
				security_settings: 'Security settings',
			},
			dialog: {
				ref_description:
					'Are you sure you want to change the referral program?',
			},
			days: 'days',
		},
	},

	notifications: {
		title: 'Notifications',
		notifications_types: 'Notifications types',
		no_notifications: 'No notifications',
	},

	support: {
		title: 'Support',
		menu: {
			status: 'Status',
			priority: 'Priority',
		},
		no_tickets: 'No tickets',
		close_ticket: 'Close ticket',
		attachments: 'Attachements',
		attach_file: 'Attach file',
		file_hint:
			'Image formats are allowed: .png, .jpg, .bmp and .zip archive. Maximum upload file size: 5 Mb',
		create_ticket: 'Create ticket',
	},

	forms_validation: {
		required: 'Required field',
		min_5char: 'Min. 5 characters',
		min_8char: 'Min. 8 characters',
		max_64char: 'Max. 64 characters',
		passwords_not_match: "Passwords don't match",
		email_invalid: 'Invalid E-mail',
		unsupported_char_latinAndNumbers:
			'Unsupported characters. Only [a-zA-Z0-9-_]',
		max_filesize_5MB: 'Max. file size 5 MB',
		fill_all_fields: 'Fill all fields',
		incorrect_data: 'Incorrect data',
	},

	$vuetify: {
		badge: 'Badge',
		close: 'Close',
		dataIterator: {
			noResultsText: 'No matching records found',
			loadingText: 'Loading items...',
		},
		dataTable: {
			itemsPerPageText: 'Rows per page:',
			ariaLabel: {
				sortDescending: 'Sorted descending.',
				sortAscending: 'Sorted ascending.',
				sortNone: 'Not sorted.',
				activateNone: 'Activate to remove sorting.',
				activateDescending: 'Activate to sort descending.',
				activateAscending: 'Activate to sort ascending.',
			},
			sortBy: 'Sort by',
		},
		dataFooter: {
			itemsPerPageText: 'Items per page:',
			itemsPerPageAll: 'All',
			nextPage: 'Next page',
			prevPage: 'Previous page',
			firstPage: 'First page',
			lastPage: 'Last page',
			pageText: '{0}-{1} of {2}',
		},
		datePicker: {
			itemsSelected: '{0} selected',
			nextMonthAriaLabel: 'Next month',
			nextYearAriaLabel: 'Next year',
			prevMonthAriaLabel: 'Previous month',
			prevYearAriaLabel: 'Previous year',
		},
		noDataText: 'No data available',
		carousel: {
			prev: 'Previous visual',
			next: 'Next visual',
			ariaLabel: {
				delimiter: 'Carousel slide {0} of {1}',
			},
		},
		calendar: {
			moreEvents: '{0} more',
		},
		fileInput: {
			counter: '{0} files',
			counterSize: '{0} files ({1} in total)',
		},
		timePicker: {
			am: 'AM',
			pm: 'PM',
		},
		pagination: {
			ariaLabel: {
				wrapper: 'Pagination Navigation',
				next: 'Next page',
				previous: 'Previous page',
				page: 'Goto Page {0}',
				currentPage: 'Current Page, Page {0}',
			},
		},
	},
};
