// The main Discord bot class, only one per shard.
module.exports = class DiscordBot {
	constructor() {
		this.initialize();
		this.servers = {};
	}

	initialize() {
		const Discord = require('discord.js');
		const createEmbed = require("embed-creator");
		var opus = require('node-opus');
		const ytdl = require('ytdl-core');
		const yt = require('ytdl-core');
		const YoutubeDL = require('youtube-dl');
		const Config = require('./Config.json')
		//const music = require('discord.js-music');
		const sql = require('sqlite');
		//const mysql = require('mysql')
		const os = require('os');
		const randomAnimeWallpapers = require('random-anime-wallpapers');
		const Request = require('request');
		const request = require('request-promise')
		const got = require('got');
		const urban = require('relevant-urban');
		const Jimp = require("jimp");

		// Commands Modules for Slightly Cleaner Code <3
		var UtilCmds = require('./cmd_modules/util_cmds');
		var AdminCmds = require('./cmd_modules/admin_cmds');
		var ActionCmds = require('./cmd_modules/action_cmds');
		//	var BlackJack = require('./cmd_modules/blackjack') // Saves like 500 lines of code xD
		var FrostyFlowers = require('./cmd_modules/frosty_flowers')
		var OnevOne = require('./cmd_modules/1v1')
		var Logs = require('./cmd_modules/log')
		var KillG = require('./cmd_modules/KillG')

		sql.open('./Economy.sqlite');

		const bot = new Discord.Client({
			shardId: parseInt(process.env.SHARD_ID, 16),
			shardCount: parseInt(process.env.SHARD_COUNT, 16),
			apiRequestMethod: 'sequential',
			fetchAllMembers: true,
			owner: Config.OwnerId
		});

		const LottoTicketPrice = 50 // Price for a Lottery Ticket, Made a constant and changable for in case I want to raise the Price in the future.

		this.servers = bot.guilds
		this.bot = bot

		let CurrentMemberRole = 'Shooting Stars'; // Christmas Member Role

		var Shanks = ActionCmds.ShanksUrls;
		var Cuddles = ActionCmds.CuddlesUrls;
		var Snuggles = ActionCmds.SnugglesUrls;
		var Hugs = ActionCmds.HugsUrls;
		var Fucks = ActionCmds.FucksUrls;
		var Pettings = ActionCmds.PettingsUrls;
		var Kisses = ActionCmds.KissesUrls;
		var Pokings = ActionCmds.PokingsUrls;
		var Smackings = ActionCmds.SmackingsUrls;
		var Spanks = ActionCmds.SpanksUrls;
		var ShanksU = ActionCmds.ShanksUrls;
		var CuddlesU = ActionCmds.CuddlesUrls;
		var SnugglesU = ActionCmds.SnugglesUrls;
		var HugsU = ActionCmds.HugsUrls;
		var FucksU = ActionCmds.FucksUrls;
		var PettingsU = ActionCmds.PettingsUrls;
		var KissesU = ActionCmds.KissesUrls;
		var PokingsU = ActionCmds.PokingsUrls;
		var SmackingsU = ActionCmds.SmackingsUrls;
		var SpanksU = ActionCmds.SpanksUrls;

		var EightBallAnswers = ActionCmds.EBA;

		var RandomPhrases = ActionCmds.RP;

		var VideoLinks = ActionCmds.VL;

		const Blacklist = []

		const LoliVersion = '2.0.3'

		var GlobalUpdateEmbed = new Discord.RichEmbed()

		GlobalUpdateEmbed.setTitle('Loli Bot Update ' + LoliVersion)
		GlobalUpdateEmbed.addField('Updates:', 'Loli Commander Role is no longer needed for Admin Commands\nConsent Command is Back\nUpdated to Loli V2.0.3')
		GlobalUpdateEmbed.addField('Upcoming Updates:', 'Randomized Welcome/Leaving Messages\nCommand Revamp (Make commands more efficient hopefully)\nInventories and Shops!\nBlackjack is almost done')
		GlobalUpdateEmbed.addField('Possible Updates:', 'Customizable Welcome/Leaving Message Channels\nAppearance Update (Everything will be updated to look more appealing?)\nLevel requirement commands?')

		const AddDonator = function(Msg, Id) {
			sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
				let Data = JSON.parse(row.Data)
				Data.Main.Achievements.push({
					Name: ':diamond_shape_with_a_dot_inside:',
					Rarity: 'Rare'
				})
				Data.Main.IsADonator = true
				Val = JSON.stringify(Data);
				sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
			})
			Msg.channel.send('Congratulations you just got the :diamond_shape_with_a_dot_inside: Achievement!', {
				reply: bot.users.get(Id)
			})
			return 'Added ' + Id + ' as a Donator.'
		}

		const MakeData = function(Id) {
			let Data = {};

			Data.Main = {}
			Data.Main.Achievements = [{
				Name: ':wave:',
				Rarity: 'Common'
			}]
			Data.Main.Level = 0
			Data.Main.Exp = 0
			Data.Main.LoliCoins = 0
			Data.Main.Title = 'User'
			Data.Main.IsADonator = false
			Data.Main.Daily = 0
			Data.Main.Gift = 0
			Data.Main.KillCount = 0

			Data.Marriage = {}
			Data.Marriage.MarriedTo = 'Nobody'
			Data.Marriage.MarriedId = 0
			Data.Marriage.Request = 'None'
			Data.Marriage.Requested = 'None'

			Data.Fun = {}
			Data.Fun.Dicksize = ''

			Data.Lottery = {}
			Data.Lottery.TicketsBought = 0
			Data.Lottery.GuildBoughtIn = ''

			Data.Reputations = {}
			Data.Reputations.UpVotes = 0
			Data.Reputations.DownVotes = 0
			Data.Reputations.ID = Id;
			Data.Reputations.Voted = [];

			Data.Roblox = {}
			Data.Roblox.Verified = false
			Data.Roblox.UserId = 1
			Data.Roblox.Username = 'ROBLOX'
			let Val = JSON.stringify(Data);
			sql.run('REPLACE INTO Data (userId, Data) VALUES (?, ?)', [Id, Val]);
		}

		const GenerateWelcome = function(Id) {
			let Fin = '<@' + Id + '>';
			let Welcomes = ['Lookout ' + Fin + '\'s Here!', 'Heyo ' + Fin + '. Welcome to the Server!', 'Oh no Trouble\'s Here! Oh wait nevermind it\'s just ' + Fin + '.', 'Welcome to our Humble Abode ' + Fin + '.', 'The Shadow of Death is Upon us, Oh wait It\'s ' + Fin + '.', Fin + '\'s Here, Time for a Loli Party!', 'Kon\'nichiwa ' + Fin + '!', 'Everyone welcome ' + Fin + '!', 'Oh look it\'s ' + Fin + ', I hope they brought some food.'];
			var rand = Welcomes[Math.floor(Math.random() * Welcomes.length)];
			return rand;
		}

		const GenerateGoodbye = function(Id) { // to be completed
			let Fin = '<@' + Id + '>';
			let Leaves = [];
			var rand = Leaves[Math.floor(Math.random() * Leaves.length)];
			return rand;
		}

		var PizzaOrders = [];

		bot.on('ready', () => {
			console.log('Loli Started!');
			bot.user.setGame('in Bubblegum. '+prefix+'help');
			console.log('Game Set!');
		});

		bot.on('UnhandledRejection', (reason) => {
			console.log('Reason: ' + reason);
		});

		bot.on('UnhandledPromiseRejection', (reason) => {
			console.log('Reason: ' + reason);
		});

		function DoImage(Link, message, BT, Ind) {
			request({
				url: `${Link}`,
				maxRedirects: 0,
			}, function(error, response, body) {
				if (error) {
					return message.channel.send('', {
						file: BT[Ind]
					})
				}
				if (response.statusCode != 200) {
					return message.channel.send('', {
						file: BT[Ind]
					})
				} else {
					return message.channel.send(Link)
				}
			})
		}

		var prefix = '%' // Loli Bot Prefix
		//var prefix = '!>' // Loli Dev Prefix

		bot.on('guildMemberAdd', member => {
			let guild = member.guild
			try {
				if (guild.id != '110373943822540800' && guild.id != '264445053596991498' && guild.id != '337781276402647040') { //2 Bot list Servers +1
					let AllowedChannel = guild.channels.find('name', 'welcome') //Temp until I make a saved channel
					if (AllowedChannel) {
						//AllowedChannel.send(GenerateWelcome(member.user.id)).catch(err => {});
					} else {
						if (guild.defaultChannel) {
							//guild.defaultChannel.send(GenerateWelcome(member.user.id)).catch(err => {});
						}
					}
				}
			} catch (err) {}
			if (guild.id == '303953298753454080') { //Loli Bot Guild Role auto add
				/*	let NewChannel = guild.channels.find('name', 'newcomers') // Newcomer channel
					let Gen = guild.channels.find('name', 'the_den') // #general
					let AllowedRole = guild.roles.find('name', 'Newcomer'); // Newcomer role
					let RulesChannel = guild.channels.find('name', 'rules')
					NewChannel.send(`Welcome <@` + member.id + `> to the Loli Bot Official Discord!\nPlease be sure to read ${RulesChannel}\nOnce you have read the rules please type ` + prefix + `uwu to answer some Questions.`)
					member.addRole(AllowedRole);*/
			}
		});

		bot.on('guildMemberRemove', member => {
			let guild = member.guild
			try {
				if (guild.id != '110373943822540800' && guild.id != '264445053596991498' && guild.id != '337781276402647040') { //2 Bot list Servers +1
					let AllowedChannel = guild.channels.find('name', 'leaving') //Temp until I make a saved channel
					if (AllowedChannel) {
						//	AllowedChannel.send(`${member.user} has left the party! :(`).catch(err => {});
					} else {
						if (guild.defaultChannel) {
							//guild.defaultChannel.send(`${member.user} has left the party! :(`).catch(err => {});
						}
					}
				}
			} catch (err) {}
		});

		bot.on('guildCreate', guild => {
			console.log(`New Guild Added: ${guild.name} By: ${guild.owner.user.tag} (${guild.owner.id})`) /*.catch(err => console.log(err))*/ ;
		});

		//music(bot);

		function wrap(text) {
			return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
		}


		let queue = {};

		let logging = {};

		let ivis = {};

		var SleepyUsers = new Map();

		const commands = {
			'play': (msg) => {
				if (queue[msg.guild.id] === undefined) return msg.channel.send(`Add some songs to the queue first with ${prefix}add`);
				if (queue[msg.guild.id].songs.length === 0) return msg.channel.send('Queue is empty')
				if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
				if (queue[msg.guild.id].playing) return msg.channel.send('Already Playing');
				let dispatcher;
				queue[msg.guild.id].playing = true;

				//console.log(queue);
				(function play(song) {
					//console.log(song);
					msg.channel.send(createEmbed(msg.guild.me.displayHexColor, {}, "Loli Bot", "Music Player", [{
						name: 'Now Playing: ',
						value: song.title
					}, {
						name: 'Duration',
						value: song.duration
					}, {
						name: 'Source: ',
						value: "https://www.youtube.com/watch?v=" + song.id
					}, {
						name: 'Requested by: ',
						value: song.requester
					}]))
					if (queue[msg.guild.id].local == true) {
						dispatcher = msg.guild.voiceConnection.playFile(song.dir, {
							audioonly: true
						});
					} else {
						dispatcher = msg.guild.voiceConnection.playStream(Request(song.url, {
							audioonly: true
						}));
					}
					let collector = msg.channel.awaitMessages(m => m);
					collector.on('collect', m => {
						if (m.content.startsWith(prefix + 'pause')) {
							if (m.author.id == song.requesterid) {
								msg.channel.send('paused').then(() => {
									dispatcher.pause();
								});
								return;
							}
							if (m.member.hasPermission('MUTE_MEMBERS')) {
								msg.channel.send('paused').then(() => {
									dispatcher.pause();
								});
							} else {
								m.channel.send('You do not have the Permission to use this Command!', {
									reply: m.member
								})
							}
						} else if (m.content.startsWith(prefix + 'resume')) {
							if (m.author.id == song.requesterid) {
								msg.channel.send('resumed').then(() => {
									dispatcher.resume();
								});
								return;
							}
							if (m.member.hasPermission('MUTE_MEMBERS')) {
								msg.channel.send('resumed').then(() => {
									dispatcher.resume();
								});
							} else {
								m.channel.send('You do not have the Permission to use this Command!', {
									reply: m.member
								})
							}
						} else if (m.content.startsWith(prefix + 'skip')) {
							if (m.author.id == song.requesterid) {
								msg.channel.send('skipped').then(() => {
									dispatcher.end();
								});
								return;
							}
							if (m.member.hasPermission('MUTE_MEMBERS')) {
								msg.channel.send('skipped').then(() => {
									dispatcher.end();
								});
							} else {
								m.channel.send('You do not have the Permission to use this Command!', {
									reply: m.member
								})
							}
						} else if (m.content.startsWith('volume+')) {
							if (Math.round(dispatcher.volume * 50) >= 100) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
							dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (2 * (m.content.split('+').length - 1))) / 50, 2));
							msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
						} else if (m.content.startsWith('volume-')) {
							if (Math.round(dispatcher.volume * 50) <= 0) return msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
							dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (2 * (m.content.split('-').length - 1))) / 50, 0));
							msg.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
						} else if (m.content.startsWith(prefix + 'time')) {
							msg.channel.send(`Time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000) / 1000) < 10 ? '0' + Math.floor((dispatcher.time % 60000) / 1000) : Math.floor((dispatcher.time % 60000) / 1000)} / ${song.duration}`);
						}
					});
					dispatcher.on('end', reason => {
						setTimeout(function() {
							//msg.channel.send('Dispatcher ended for reason: ' + (reason || 'No Reason'))
							collector.stop();
							if (queue[msg.guild.id].songs.length === 0) return msg.channel.send('Queue is empty').then(() => {
								if (queue[msg.guild.id].local == true) {
									queue[msg.guild.id].local = false
								}
								queue[msg.guild.id].playing = false;
								msg.member.voiceChannel.leave();
								return;
							});
							play(queue[msg.guild.id].songs.shift());
							return;
						}, 200);
					});
					dispatcher.on('error', (err) => {
						return msg.channel.send('error: ' + err).then(() => {
							collector.stop();
							if (queue[msg.guild.id].songs.length === 0) return msg.channel.send('Queue is empty').then(() => {
								if (queue[msg.guild.id].local == true) {
									queue[msg.guild.id].local = false
								}
								queue[msg.guild.id].playing = false;
								msg.member.voiceChannel.leave();
								return;
							});
							play(queue[msg.guild.id].songs.shift());
							return;
						});
					});
				})(queue[msg.guild.id].songs.shift());
				return;
			},
			'join': (msg) => {
				return new Promise((resolve, reject) => {
					const voiceChannel = msg.member.voiceChannel;
					if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
					voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
				});
			},
			'add': (msg) => {
				if (!queue.hasOwnProperty(msg.guild.id)) {
					queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].local = false, queue[msg.guild.id].songs = [];
				}
				if (queue[msg.guild.id].local == false) {
					let suffix = msg.content.split(" ").slice(1).join(" ");
					if (!suffix) return msg.channel.send(wrap('No video specified!'));

					// Get the video information.
					msg.channel.send(createEmbed(msg.guild.me.displayHexColor, {},
						"Loli Bot",
						"Music Player", [{
							name: 'Status:',
							value: 'Searching...'
						}]
					)).then(response => {
						// If the suffix doesn't start with 'http', assume it's a search.
						if (!suffix.toLowerCase().startsWith('http')) {
							suffix = 'gvsearch1:' + suffix;
						}
						YoutubeDL.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
							// Verify the info.
							if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
								return response.edit(createEmbed(msg.guild.me.displayHexColor, {},
									"Loli Bot",
									"Music Player", [{
										name: 'Status:',
										value: 'Invalid video!'
									}]
								));
							}

							// Queue the video.
							response.edit(createEmbed(msg.guild.me.displayHexColor, {},
								"Loli Bot",
								"Music Player", [{
									name: 'Status:',
									value: 'Queued: ' + info.title
								}]
							)).then(() => {
								queue[msg.guild.id].songs.push({
									url: info.url,
									title: info.title,
									duration: info.duration,
									id: info.id,
									requester: msg.author.username,
									requesterid: msg.author.id
								});

							}).catch(() => {});
						});
					}).catch(() => {});
				} else {
					msg.channel.send('Please use ' + prefix + 'clearlist to clear the auto Playlist')
				}
			},
			'queue': (msg) => {
				if (queue[msg.guild.id] === undefined) return msg.channel.send(`Add some songs to the queue first with ${prefix}add`);
				let tosend = [];
				queue[msg.guild.id].songs.forEach((song, i) => {
					tosend.push(`${i + 1}. ${song.title} *${song.duration}* - Requested by: ${song.requester}`);
				});
				msg.channel.send(createEmbed(msg.guild.me.displayHexColor, {},
					"Loli Bot",
					"Music Player", [{
						name: `__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}`,
						value: `${tosend.slice(0, 15).join('\n')}`
					}]
				))
				//msg.channel.send(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued \`\`\``);
			},
			'mhelp': (msg) => {
				let tosend = [prefix + 'join : "Join Voice channel of msg sender"', prefix + 'add : "Search or use a Link to add to the queue"', prefix + 'queue : "Shows the current queue, up to 15 songs shown."', prefix + 'play : "Play the music queue if already joined to a voice channel"'];
				let tosend2 = [prefix + 'pause : "pauses the music"', prefix + 'resume : "resumes the music"', prefix + 'skip : "skips the playing song"', prefix + 'time : "Shows the playtime of the song."', 'volume+(+++) : "increases volume by 2%/+"', 'volume-(---) : "decreases volume by 2%/-"']
				msg.channel.send(createEmbed(msg.guild.me.displayHexColor, {},
					"Loli Bot",
					"Music Player", [{
						name: `Music Commands:`,
						value: `${tosend.join('\n')}`
					}, {
						name: 'the following commands only function while the play command is running:'.toUpperCase(),
						value: `${tosend2.join('\n')}`
					}]
				))
			},
			'reboot': (msg) => {
				if (msg.author.id == Config.OwnerId) process.exit(); //Requires a node module like Forever to work.
			}
		};

		let CheckVoted = function(Rep, ID) {
			for (let index = 0; index < Rep.Voted.length; index++) {
				if (Rep.Voted[index].id == ID) return true;
			}
			return false;
		}

		let CheckVotedUp = function(Rep, ID) {
			for (let index = 0; index < Rep.Voted.length; index++) {
				if (Rep.Voted[index].id == ID && Rep.Voted[index].UpVoted == true) return true;
			}
			return false;
		}

		let CheckVotedDown = function(Rep, ID) {
			for (let index = 0; index < Rep.Voted.length; index++) {
				if (Rep.Voted[index].id == ID && Rep.Voted[index].DownVoted == true) return true;
			}
			return false;
		}

		let VoteUp = function(User, Rep, VoterID) {
			if (VoterID != Rep.ID && !CheckVoted(Rep, VoterID)) {
				Rep.UpVotes += 1;
				Rep.Voted.push({
					id: VoterID,
					UpVoted: true,
					DownVoted: false
				});
				return 'Added +1 Positive Rep to ' + User
			} else {
				if (VoterID != Rep.ID && CheckVotedUp(Rep, VoterID) == false) {
					if (CheckVotedDown(Rep, VoterID) == true) { // Change Rep from Down to Up
						Rep.UpVotes += 1;
						Rep.DownVotes -= 1;
						Rep.Voted.push({
							id: VoterID,
							UpVoted: true,
							DownVoted: false
						});
						return 'Rep changed from Negative to Positive for ' + User
					}
				} else {
					if (VoterID == Rep.ID) {
						return 'You cannot rep yourself silly!'
					}
					return 'You have already Positively repped this user!'
				}
			}
		}

		let VoteDown = function(User, Rep, VoterID) {
			if (VoterID != Rep.ID && !CheckVoted(Rep, VoterID)) {
				Rep.DownVotes += 1;
				Rep.Voted.push({
					id: VoterID,
					UpVoted: false,
					DownVoted: true
				});
				return 'Added +1 Negative Rep to ' + User
			} else {
				if (VoterID != Rep.ID && CheckVotedDown(Rep, VoterID) == false) {
					if (CheckVotedUp(Rep, VoterID) == true) { // Change Rep from Down to Up
						Rep.UpVotes -= 1;
						Rep.DownVotes += 1;
						Rep.Voted.push({
							id: VoterID,
							UpVoted: true,
							DownVoted: false
						});
						return 'Rep changed from Positive to Negative for ' + User
					}
				} else {
					if (VoterID == Rep.ID) {
						return 'You cannot rep yourself silly!'
					}
					return 'You have already Negatively repped this user!'
				}
			}
		}

		const ConsentMessage = 'To use Loli Bot you must Agree to the following terms and conditions\nYou agree that Loli Bot may record and use your data for noncommercial reasons.\nLoli Bot will record data such as but not limited to:\nMessages that start with %, UserIds, Usernames, Timestamps, and any custom input you put into Loli Bot.\n```To gain access to this bot/source/host you need to pay the owner $500\nOR\nTo gain acccess to this bot/source/host you are not allowed to work on Discord```\n\n\nPlease type `I consent` if you consent to these Terms';

		//let Top = new Object(); Top.Kek = true; let Val = JSON.stringify(Top); let laV = JSON.parse(Val); throw laV.Kek; //will error with true
		

		bot.on('message', message => {
			if (message.author.bot) return;

			//sql.run('CREATE TABLE IF NOT EXISTS reputations (userId TEXT, RepData TEXT)');
			//sql.run('CREATE TABLE IF NOT EXISTS robloxusers (userId TEXT, Verified TEXT, RobloxId INTEGER, UserName TEXT)');
			//sql.run('CREATE TABLE IF NOT EXISTS dicksizes (userId TEXT, DickSize TEXT)');
			//sql.run('CREATE TABLE IF NOT EXISTS marriage2 (userId TEXT, Married TEXT, MarriedTo TEXT, Request TEXT, Requester TEXT)');
			sql.run('CREATE TABLE IF NOT EXISTS consented (userId TEXT, Consent TEXT)');
			sql.run('CREATE TABLE IF NOT EXISTS lottotimes (guildId TEXT, TimeAmt INTEGER)');
			sql.run('CREATE TABLE IF NOT EXISTS permissions (`userId` TEXT, `Set` INTEGER, `Eval` INTEGER)');
			//sql.run('CREATE TABLE IF NOT EXISTS lottery (userId TEXT, numTickets INTEGER, guildId TEXT)');


			for (var [id, name] of SleepyUsers) {
				if (message.content.includes(id)) {
					try {
						message.channel.send(name + ' is currently sleeping (Or Away) right now, Please leave them alone, Thanks. :heart:');
					} catch (err) {}
				}
			}

			let args = message.content.split(" ").slice(1);

			if (message.channel.type == 'dm' && !message.content.startsWith(prefix)) {
				try {
					//		console.log('Loli Bot\'s DM\'s||' + message.author.tag + ': ' + message.content)
					let Cleverbot = require('cleverbot-node');
					let cleverbot = new Cleverbot;
					cleverbot.configure({
						botapi: Config.CleverBotToken //3rd acc api because 2nd ran out
					});
					cleverbot.write(args.join(" "), function(response) {
						message.channel.send(response.output);
					});
				} catch (err) {
					//	console.log(err)
				}
			} else {
				if (message.channel.type == 'dm' && message.content.startsWith('<@' + bot.user.id + '>')) {
					try {
						//	console.log('Loli Bot\'s DM\'s||' + message.author.tag + ': ' + message.content)
						let Cleverbot = require('cleverbot-node');
						let cleverbot = new Cleverbot;
						cleverbot.configure({
							botapi: "CC4okFWbpUspFbKGg_7b0y1gTcQ" //3rd acc api because 2nd ran out
						});
						cleverbot.write(args.join(" "), function(response) {
							message.channel.send(response.output);
						});
					} catch (err) {
						//	console.log(err)
					}
				} else {
					if (message.content.startsWith('<@' + bot.user.id + '>')) {
						try {
							//	console.log(message.guild.name + '||' + message.author.tag + ': ' + message.content)
							let Cleverbot = require('cleverbot-node');
							let cleverbot = new Cleverbot;
							cleverbot.configure({
								botapi: "CC4okFWbpUspFbKGg_7b0y1gTcQ" //3rd acc api because 2nd ran out
							});
							cleverbot.write(args.join(" "), function(response) {
								message.channel.send(response.output);
							});
						} catch (err) {
							console.log(err)
						}
					}
				}
			}

			let string = message.content
			string = string.split('');
			string.map(() => {
				string = string.join('').replace(/[.,!?'"]/, '').toLowerCase().split();
			});
			string = string.join('');
			let botnickname = undefined;
			if (message.guild) {
				if (message.guild.members.find('id', bot.user.id).nickname) {
					botnickname = message.guild.members.find('id', bot.user.id).nickname.toLowerCase()
				}
			}
			if (string === 'hey loli whats new' || string === 'hey loli what is new' || string === 'hey ' + bot.user.username.toLowerCase() + ' what is new' || string === 'hey ' + botnickname + ' what is new' || string === 'hey ' + bot.user.username.toLowerCase() + ' whats new' || string === 'hey ' + botnickname + ' whats new') {
				message.channel.send('', {
					reply: message.author,
					embed: GlobalUpdateEmbed
				})
			}
			true

			let msg = message;
			let command = message.content.split(" ")[0];
			command = command.slice(prefix.length);

			const lowerCaseCommand = command.toLowerCase()

			sql.get(`SELECT * FROM consented WHERE userId ='${message.author.id}'`).then(row => {
				if (!row) {
					if (!message.content.startsWith(prefix)) return;
					if (lowerCaseCommand == 'consent') {
						message.reply(ConsentMessage)
						const filter = m => m.author.id === message.author.id
						var Selection = null
						message.channel.awaitMessages(filter, {
								max: 1
							})
							.then(collected => {
								Selection = collected.first()
								if (Selection.toString().toLowerCase() == 'i consent') {
									sql.run('INSERT INTO consented (userId, Consent) VALUES (?, ?)', [message.author.id, '']);
									message.reply('You may now use Loli Bot as usual.')
								}
							})
					} else {
						message.channel.send('To use Loli Bot you must Consent with the ' + prefix + 'consent command.')
					}
				} else {

					sql.get(`SELECT * FROM Data WHERE userId ='${message.author.id}'`).then(row => {
						if (!row) {
							MakeData(message.author.id)
						} else {
							let Data = JSON.parse(row.Data)
							let curLevel = Math.floor(0.1 * Math.sqrt(Data.Main.Exp + 1));
							if (curLevel > Data.Main.Level) {
								Data.Main.Level = curLevel;
								let Val = JSON.stringify(Data);
								sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
								if (message.guild.id != '264445053596991498' && message.guild.id != '337781276402647040') {
									message.channel.send(`You've reached level **${curLevel}**!`, {
										reply: message.member
									}).catch(err => {});
								}
								var FinishedVal = Data.Main.LoliCoins + 50
								Val = JSON.stringify(Data);
								sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
							}
							if (message.guild && message.guild.id != '264445053596991498' && message.guild.id != '337781276402647040') {
								Data.Main.Exp += 1
								Val = JSON.stringify(Data);
								sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
								if (Data.Main.Exp == 100) {
									Data.Main.Achievements.push({
										Name: ':thumbsup:',
										Rarity: 'Common'
									})
									Val = JSON.stringify(Data);
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
									try {
										message.channel.send('Congratulations you just got the :thumbsup: Achievement!', {
											reply: message.member
										}).catch(err => {});
									} catch (err) {
										console.log(err)
									}
								}
								if (Data.Main.Exp == 500) {
									Data.Main.Achievements.push({
										Name: ':ok_hand:',
										Rarity: 'Common'
									})
									Val = JSON.stringify(Data);
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
									try {
										message.channel.send('Congratulations you just got the :ok_hand: Achievement!', {
											reply: message.member
										}).catch(err => {});
									} catch (err) {
										console.log(err)
									}
								}
								if (Data.Main.Exp == 1000) {
									Data.Main.Achievements.push({
										Name: ':smile:',
										Rarity: 'Uncommon'
									})
									Val = JSON.stringify(Data);
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
									try {
										message.channel.send('Congratulations you just got the :smile: Achievement!', {
											reply: message.member
										}).catch(err => {});
									} catch (err) {
										console.log(err)
									}
								}
								if (Data.Main.LoliCoins >= 5000) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':money_mouth:') { return HasThisAchievement = true }});
									if (HasThisAchievement == false) {
										Data.Main.Achievements.push({
										Name: ':money_mouth:',
										Rarity: 'Uncommon'
									})
									Val = JSON.stringify(Data);
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Congratulations you just got the :money_mouth: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
								if (Data.Main.LoliCoins >= 20000) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':moneybag:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':moneybag:',
												Rarity: 'Rare'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Congratulations you just got the :moneybag: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
								if (message.content.toLowerCase().includes('dat boi')) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':frog:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':frog:',
												Rarity: 'Uncommon'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Oh Shit Waddup!').catch(err => {});
											message.channel.send('Congratulations you just got the :frog: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
								if (message.content.toLowerCase().includes('sleeping')) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':zzz:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':zzz:',
												Rarity: 'Common'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Congratulations you just got the :zzz: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
								if (message.content.toLowerCase().includes('when life')) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':lemon:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':lemon:',
												Rarity: 'Uncommon'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Congratulations you just got the :lemon: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
								if (message.content.toLowerCase().includes('( ͡° ͜ʖ ͡°)')) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':eggplant:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':eggplant:',
												Rarity: 'Rare'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Congratulations you just got the :eggplant: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
								if (message.content.toLowerCase().includes('azumikun')) {
									let HasThisAchievement = false
									Data.Main.Achievements.map(e => { if (e.Name == ':imp:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':imp:',
												Rarity: 'Rare'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										try {
											message.channel.send('Congratulations you just got the :imp: Achievement!', {
												reply: message.member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								}
							}
						}
					}).catch((error) => {
						console.error(error);
						sql.run('CREATE TABLE IF NOT EXISTS Data (userId TEXT, Data TEXT)').then(() => {
							MakeData(message.author.id)
						});
					});

					if (!message.content.startsWith(prefix)) return;


					sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
						if (!row) {
							if (message.author.id == Config.OwnerId) {
								sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
							} else {
								sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
							}
						}
					})

					if (message.guild) {
						sql.get(`SELECT * FROM lottotimes WHERE guildId ='${message.guild.id}'`).then(row => {
							if (!row) {
								sql.run('INSERT INTO lottotimes (guildId, TimeAmt) VALUES (?, ?)', [message.guild.id, 0]);
							}
						})
					}

					try {
						if (Blacklist.includes(message.member.id) && message.member.id != Config.OwnerId) {
							return message.member.send('You are currently blacklisted on Loli Bot, If you wish to appeal please contact '+Config.DiscordTag)
						}
					} catch (err) {}

					if (lowerCaseCommand === 'cmds' || lowerCaseCommand == 'commands') {
						let RegArgument = args.join(" ")
						let Argument = ''
						let Sections = ['Regular', 'Extended-Regular', 'Cat', 'Music', 'Admin', 'Economy', 'Marriage', 'Roblox', 'Other', 'Creator']
						let LCSections = ['regular', 'extended-regular', 'cat', 'music', 'admin', 'economy', 'marriage', 'roblox', 'other', 'creator']
						if (!RegArgument) {
							//Assume they're getting command Help
							let EmbedToSend = new Discord.RichEmbed

							EmbedToSend.setColor('#00FFC2')
							EmbedToSend.setTitle('Loli Bot')
							EmbedToSend.setDescription('Command Help')

							for (var i = 0; i < Sections.length; ++i) {
								EmbedToSend.addField(':file_folder: ' + Sections[i], prefix + 'Cmds ' + Sections[i] + ' / ' + prefix + 'Commands ' + Sections[i]);
							}

							if (message.channel.type == 'dm') {
								return message.channel.send('', {
									embed: EmbedToSend
								})
							} else {
								message.member.send('', {
									embed: EmbedToSend
								})
								message.channel.send("Command help has been sent to your Direct Messages!").catch(err => {});
							}
						} else {
							Argument = RegArgument.toLowerCase()
							if (LCSections.includes(Argument) && message.channel.type != 'dm') {
								if (Argument == 'regular') {
									UtilCmds.RegularCmds(createEmbed, message, false)
									message.channel.send('Regular Section has been sent to your Direct Messages!')
								} else if (Argument == 'extended-regular') {
									UtilCmds.ExtRegularCmds(createEmbed, message, false)
									message.channel.send('Extended-Regular Section has been sent to your Direct Messages!')
								} else if (Argument == 'cat') {
									UtilCmds.CatCmds(createEmbed, message, false)
									message.channel.send('Cat Section has been sent to your Direct Messages!')
								} else if (Argument == 'music') {
									UtilCmds.MusicCmds(createEmbed, message, false)
									message.channel.send('Music Section has been sent to your Direct Messages!')
								} else if (Argument == 'admin') {
									UtilCmds.AdminCmds(createEmbed, message, false)
									message.channel.send('Admin Section has been sent to your Direct Messages!')
								} else if (Argument == 'economy') {
									UtilCmds.EcoCmds(createEmbed, message, false)
									message.channel.send('Economy Section has been sent to your Direct Messages!')
								} else if (Argument == 'marriage') {
									UtilCmds.MarriageCmds(createEmbed, message, false)
									message.channel.send('Marriage Section has been sent to your Direct Messages!')
								} else if (Argument == 'roblox') {
									UtilCmds.RobloxCmds(createEmbed, message, false)
									message.channel.send('Roblox Section has been sent to your Direct Messages!')
								} else if (Argument == 'other') {
									UtilCmds.OtherCmds(createEmbed, message, false)
									message.channel.send('Other Section has been sent to your Direct Messages!')
								} else if (Argument == 'creator') {
									if (message.author.id == Config.OwnerId) {
										UtilCmds.CreatorCmds(createEmbed, message, false)
										message.channel.send('Creator Section has been sent to your Direct Messages!')
									} else {
										message.channel.send('You do not have access to this command section!')
									}
								}
							} else {
								if (LCSections.includes(Argument) && message.channel.type == 'dm') {
									if (Argument == 'regular') {
										UtilCmds.RegularCmds(createEmbed, message, true)
									} else if (Argument == 'extended-regular') {
										UtilCmds.ExtRegularCmds(createEmbed, message, true)
									} else if (Argument == 'cat') {
										UtilCmds.CatCmds(createEmbed, message, true)
									} else if (Argument == 'music') {
										UtilCmds.MusicCmds(createEmbed, message, true)
									} else if (Argument == 'admin') {
										UtilCmds.AdminCmds(createEmbed, message, true)
									} else if (Argument == 'economy') {
										UtilCmds.EcoCmds(createEmbed, message, true)
									} else if (Argument == 'marriage') {
										UtilCmds.MarriageCmds(createEmbed, message, true)
									} else if (Argument == 'roblox') {
										UtilCmds.RobloxCmds(createEmbed, message, true)
									} else if (Argument == 'other') {
										UtilCmds.OtherCmds(createEmbed, message, true)
									} else if (Argument == 'creator') {
										if (message.author.id == Config.OwnerId) {
											UtilCmds.CreatorCmds(createEmbed, message, false)
											message.channel.send('Creator Section has been sent to your Direct Messages!')
										} else {
											message.channel.send('You do not have access to this command section!')
										}
									} else {
										let ToSend = ''
										Sections.map(Item => {
											ToSend = ToSend + '`' + Item + '` '
										})
										message.channel.send(RegArgument + ' is an invalid Command Section! Available Sections:\n' + ToSend)
									}
								}
							}
						}
					}

					if (message.channel.type == 'dm' && lowerCaseCommand != 'cmds' && lowerCaseCommand != 'commands') {
						return message.channel.send('You cannot do commands inside Loli Bot\'s DM\'s Please do it inside a server/guild!')
					}

					if (commands.hasOwnProperty(message.content.toLowerCase().slice(prefix.length).split(' ')[0])) commands[message.content.toLowerCase().slice(prefix.length).split(' ')[0]](message);


					try {
						if (message.guild)
							console.log(message.guild.name + '||' + message.author.tag + ': ' + message.content)
					} catch (err) {
						console.log(err)
					}

					if (lowerCaseCommand === 'clearrequests') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									let member = message.guild.member(message.mentions.users.first());
									if (!member) {
										message.channel.send('That user does not seem valid.', {
											reply: message.member
										})
									} else {
										sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
											if (!crow) {
												return message.channel.send('This user has not consented with ' + prefix + 'consent')
											}
										})
										sql.get(`SELECT * FROM marriage2 WHERE userId ='${member.user.id}'`).then(row2 => {
											if (!row) {
												sql.run('INSERT INTO marriage2 (userId, Married, MarriedTo, Request, Requester) VALUES (?, ?, ?, ?, ?)', [member.user.id, 'false', 'None', 'None', 'None']);
												sql.run('INSERT INTO marriage2 (userId, Married, MarriedTo, Request, Requester) VALUES (?, ?, ?, ?, ?)', [member.user.id, 'false', 'None', 'None', 'None']);
												return message.channel.send('Try Again!')
											}
											let User = bot.users.get(row2.Request).id
											sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = '${member.user.id}'`);
											sql.run(`UPDATE marriage2 SET Requester = 'None' WHERE userId = '${member.user.id}'`);
											sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = '${User}'`);
											sql.run(`UPDATE marriage2 SET Requester = 'None' WHERE userId = '${User}'`);
											return message.channel.send('Cleared <@' + member.user.id + ">'s Requests and <@" + User + ">'s Requests.")
										})
									}
								}
							}
						})
					}

					if (lowerCaseCommand === 'marry') {
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
								if (!crow) {
									return message.channel.send('This user has not consented with ' + prefix + 'consent')
								}
							})
							if (member.user.id == message.member.id) {
								return message.channel.send('You cant marry yourself silly!')
							}
							sql.get(`SELECT * FROM marriage2 WHERE userId ='${message.member.id}'`).then(row => {
								if (!row) {
									sql.run('INSERT INTO marriage2 (userId, Married, MarriedTo, Request, Requester) VALUES (?, ?, ?, ?, ?)', [message.author.id, 'false', 'None', 'None', 'None']);
									sql.run('INSERT INTO marriage2 (userId, Married, MarriedTo, Request, Requester) VALUES (?, ?, ?, ?, ?)', [message.author.id, 'false', 'None', 'None', 'None']);
									return message.channel.send('Try Again!')
								}
								sql.get(`SELECT * FROM marriage2 WHERE userId ='${member.user.id}'`).then(row2 => {
									if (!row2) {
										sql.run('INSERT INTO marriage2 (userId, Married, MarriedTo, Request, Requester) VALUES (?, ?, ?, ?, ?)', [member.user.id, 'false', 'None', 'None', 'None']);
										sql.run('INSERT INTO marriage2 (userId, Married, MarriedTo, Request, Requester) VALUES (?, ?, ?, ?, ?)', [message.author.id, 'false', 'None', 'None', 'None']);
										return message.channel.send('Try Again!')
									}
									if (row.Married == 'true') {
										return message.channel.send('You are already married!', {
											reply: message.member
										})
									}
									if (row2.Married == 'true') {
										return message.channel.send(member.user.username + ' is already married!', {
											reply: message.member
										})
									}
									if (row.Request != 'None') {
										return message.channel.send('You already have a pending request! Please do ' + prefix + 'Requests', {
											reply: message.member
										})
									}
									if (row2.Request != 'None') {
										return message.channel.send(member.user.username + ' already has a pending request!', {
											reply: message.member
										})
									}
									if (member.user.id == Config.OwnerId) {
										return message.channel.send('You cant marry Azumi.')
									} else {
										if (member.user.id == bot.user.id) {
											return message.channel.send('You cant marry ' + bot.user.username + '.')
										}
									}
									//If both users arent married and dont have pending requests
									sql.run(`UPDATE marriage2 SET Request = '${member.user.id}' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET Request = '${message.member.id}' WHERE userId = ${member.user.id}`);
									sql.run(`UPDATE marriage2 SET Requester = '${message.member.id}' WHERE userId = ${member.user.id}`);
									message.channel.send(':ring: <@' + member.user.id + '> Will you marry me?')
									message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
										"Loli Bot",
										"Marriage System", [{
											name: 'Get Married:',
											value: 'Say ' + prefix + 'AcceptMarriage'
										}, {
											name: 'Dont Get Married:',
											value: 'Say ' + prefix + 'DeclineMarriage'
										}]
									))
								})
							})
						}
					}

					if (lowerCaseCommand === 'requests') {
						sql.get(`SELECT * FROM marriage2 WHERE userId ='${message.member.id}'`).then(row => {
							if (row.Request == 'None') {
								message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
									"Loli Bot",
									"Marriage System", [{
										name: 'Requests:',
										value: 'None'
									}]
								))
							} else {
								let User = bot.users.get(row.Request)
								message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
									"Loli Bot",
									"Marriage System", [{
										name: 'Requests:',
										value: User.username
									}]
								))
							}
						})
					}

					if (lowerCaseCommand === 'acceptmarriage') {
						sql.get(`SELECT * FROM marriage2 WHERE userId ='${message.member.id}'`).then(row => {
							if (row.Request != 'None' && row.Requester != 'None') {
								let User = bot.users.get(row.Request)
								sql.get(`SELECT * FROM marriage2 WHERE userId ='${User.id}'`).then(row2 => {
									sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = '${message.member.id}'`);
									sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = '${User.id}'`);
									sql.run(`UPDATE marriage2 SET Requester = 'None' WHERE userId = '${User.id}'`);
									//userId, Married, MarriedTo, Request
									sql.run(`UPDATE marriage2 SET Married = 'true' WHERE userId = '${message.member.id}'`);
									sql.run(`UPDATE marriage2 SET Married = 'true' WHERE userId = '${User.id}'`);
									sql.run(`UPDATE marriage2 SET MarriedTo = '${User.id}' WHERE userId = '${message.member.id}'`);
									sql.run(`UPDATE marriage2 SET MarriedTo = '${message.member.id}' WHERE userId = '${User.id}'`);
									message.channel.send(':wedding: Congratulations! <@' + message.member.id + '> and <@' + User.id + '> Got Married!')
								})
							} else {
								if (row.Request != 'None' && row.Requester == 'None') {
									message.channel.send('You proposed Silly, the person you proposed to has to accept or decline.')
								}
								return message.channel.send('You dont have a pending request.')
							}
						})
					}

					if (lowerCaseCommand === 'declinemarriage') {
						sql.get(`SELECT * FROM marriage2 WHERE userId ='${message.member.id}'`).then(row => {
							if (row.Request != 'None' && row.Requester != 'None') {
								let User = bot.users.get(row.Request)
								sql.get(`SELECT * FROM marriage2 WHERE userId ='${User.id}'`).then(row2 => {
									sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET Requester = 'None' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = ${User.id}`);
									message.channel.send(message.member.user.username + ' Declined Proposal request.')
								})
							} else {
								return message.channel.send('You dont have a pending request.')
							}
						})
					}

					if (lowerCaseCommand === 'divorce') {
						sql.get(`SELECT * FROM marriage2 WHERE userId ='${message.member.id}'`).then(row => {
							if (row.MarriedTo != 'None') {
								let User = bot.users.get(row.MarriedTo)
								sql.get(`SELECT * FROM marriage2 WHERE userId ='${User.id}'`).then(row2 => {
									sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET Request = 'None' WHERE userId = ${User.id}`);
									sql.run(`UPDATE marriage2 SET Requester = 'None' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET Requester = 'None' WHERE userId = ${User.id}`);
									sql.run(`UPDATE marriage2 SET Married = 'false' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET Married = 'false' WHERE userId = ${User.id}`);
									sql.run(`UPDATE marriage2 SET MarriedTo = 'None' WHERE userId = ${message.member.id}`);
									sql.run(`UPDATE marriage2 SET MarriedTo = 'None' WHERE userId = ${User.id}`);
									message.channel.send(message.member.user.username + ' Divorced ' + User.username + ' :frowning:')
								})
							} else {
								return message.channel.send('You arent married!')
							}
						})
					}

					if (lowerCaseCommand === 'sleeping') {
						if (SleepyUsers.has(message.author.id) == false) {
							SleepyUsers.set(message.author.id, message.author.username);
							message.channel.send('You are now sleeping, Shhhhh. :sleeping: ')
						} else {
							message.channel.send('You are already sleeping.')
						}
					}

					if (lowerCaseCommand === 'verify') {
						sql.get(`SELECT * FROM robloxusers WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								sql.run('INSERT INTO robloxusers (userId, Verified, RobloxId, UserName) VALUES (?, ?, ?, ?)', [message.author.id, 'false', 0, 'ROBLOX']);
							}
							if (row.Verified == 'true') {
								return message.channel.send('You are already verified! ' + prefix + 'VerifyStatus')
							}
							var options = {
								headers: {
									'Content-Type': 'application/json'
								}
							}
							got('https://verify.eryn.io/api/user/' + message.author.id, options)
								.then(response => {
									var File = JSON.parse(response.body);
									if (File.status === 'ok') {
										sql.run(`UPDATE robloxusers SET Verified = 'true', RobloxId = ${File.robloxId}, UserName = '${File.robloxUsername}' WHERE userId = ${message.author.id}`);
										message.channel.send('Verified ' + message.author.username + ' as ' + File.robloxUsername + ` (${File.robloxId})`)
										message.member.send('You can check your status by doing ' + prefix + 'VerifyStatus')
										return;
									} else {
										if (File.status == 'error') {
											if (File.errorCode == '404') {
												message.member.send(File.error)
												message.member.send('You are mostlikely not Verified, Please verify by going to: https://verify.eryn.io/ and then use ' + prefix + 'Verify again.')
												return;
											}
										} else {
											return message.member.send('An unknown error occured.')
										}
									}
								})
								.catch(error => {
									//var File = JSON.parse(error.body);
									if (error.statusCode == 404) {
										return message.member.send('You are mostlikely not Verified, Please verify by going to: https://verify.eryn.io/ and then use ' + prefix + 'Verify again.')
									} else {
										return message.member.send('An unknown error occured.')
									}
								});
						})
					}

					if (lowerCaseCommand === 'randompick') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									var Users = []
									message.guild.members.map(member => Users.push(member.user))
									var rand = Users[Math.floor(Math.random() * Users.length)];
									message.channel.send(rand.tag + ' (' + rand.id + ')')
								}
							}
						})
					}

					if (lowerCaseCommand === 'updateverify') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									let member = message.guild.member(message.mentions.users.first());
									sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
										if (!crow) {
											return message.channel.send('This user has not consented with ' + prefix + 'consent')
										}
									})
									sql.get(`SELECT * FROM robloxusers WHERE userId ='${member.user.id}'`).then(row2 => {
										if (!row2) {
											sql.run('INSERT INTO robloxusers (userId, Verified, RobloxId, UserName) VALUES (?, ?, ?, ?)', [member.user.id, 'false', 0, 'ROBLOX']);
										}
										var options = {
											headers: {
												'Content-Type': 'application/json'
											}
										}
										got('https://verify.eryn.io/api/user/' + member.user.id, options)
											.then(response => {
												var File = JSON.parse(response.body);
												if (File.status === 'ok') {
													sql.run(`UPDATE robloxusers SET Verified = 'true', RobloxId = ${File.robloxId}, UserName = '${File.robloxUsername}' WHERE userId = ${member.user.id}`);
													message.channel.send('Verified ' + member.user.username + ' as ' + File.robloxUsername + ` (${File.robloxId})`)
													member.user.send('You can check your status by doing ' + prefix + 'VerifyStatus')
													return;
												} else {
													if (File.status == 'error') {
														if (File.errorCode == '404') {
															member.user.send(File.error)
															member.user.send('You are mostlikely not Verified, Please verify by going to: https://verify.eryn.io/ and then use ' + prefix + 'Verify again.')
															return;
														}
													} else {
														return member.user.send('An unknown error occured.')
													}
												}
											})
											.catch(error => {
												//var File = JSON.parse(error.body);
												if (error.statusCode == 404) {
													return member.user.send('You are mostlikely not Verified, Please verify by going to: https://verify.eryn.io/ and then use ' + prefix + 'Verify again.')
												} else {
													return member.user.send('An unknown error occured.')
												}
											});
									})
								}
							}
						})
					}

					if (lowerCaseCommand === 'setverify') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									let member = message.guild.member(message.mentions.users.first());
									sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
										if (!crow) {
											return message.channel.send('This user has not consented with ' + prefix + 'consent')
										}
									})
									let Verified = args[1]
									let Id = args[2]
									let Name = args[3]
									sql.run(`UPDATE robloxusers SET Verified = '${Verified}', RobloxId = ${Id}, UserName = '${Name}' WHERE userId = ${member.user.id}`);
									message.channel.send('Set ' + member.user.username + "'s Verification data to: " + Verified + ', ' + Id + ', ' + Name)
								}
							}
						})
					}

					if (lowerCaseCommand === 'verifystatus') {
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							sql.get(`SELECT * FROM robloxusers WHERE userId ='${message.author.id}'`).then(row => {
								if (!row) {
									sql.run('INSERT INTO robloxusers (userId, Verified, RobloxId, UserName) VALUES (?, ?, ?, ?)', [message.author.id, 'false', 0, 'ROBLOX']);
								} else {
									if (row.Verified == 'false') {
										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Verify Status", [{
												name: 'Verified:',
												value: 'You are not Verified.'
											}]
										))
									} else {
										sql.get(`SELECT * FROM consented WHERE userId ='${message.author.id}'`).then(crow => {
											if (!crow) {
												return message.channel.send('This user has not consented with ' + prefix + 'consent')
											}
										})
										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Verify Status", [{
												name: 'Verified:',
												value: 'You are Verified!'
											}, {
												name: 'Roblox Id:',
												value: row.RobloxId
											}, {
												name: 'Roblox Name:',
												value: row.UserName
											}]
										))
									}
								}
							})
						} else {
							sql.get(`SELECT * FROM robloxusers WHERE userId ='${member.user.id}'`).then(row => {
								if (!row) {
									sql.run('INSERT INTO robloxusers (userId, Verified, RobloxId, UserName) VALUES (?, ?, ?, ?)', [member.user.id, 'false', 0, 'ROBLOX']);
								} else {
									if (row.Verified == 'false') {
										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Verify Status", [{
												name: 'Verified:',
												value: member.user.username + ' is not Verified.'
											}]
										))
									} else {
										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Verify Status", [{
												name: 'Verified:',
												value: member.user.username + ' is Verified!'
											}, {
												name: 'Roblox Id:',
												value: row.RobloxId
											}, {
												name: 'Roblox Name:',
												value: row.UserName
											}]
										))
									}
								}
							})
						}
					}

					if (lowerCaseCommand === 'stoplog') {
						if (message.member.hasPermission('VIEW_AUDIT_LOG')) {
							if (!logging.hasOwnProperty(message.guild.id)) {
								message.channel.send('Please start logging first by using %startlog')
								return;
							}
							logging[message.guild.id].logs = false;
							message.channel.send('Stopped Audit Logs.')
						} else {
							message.channel.send('You do not have the Permission to use this Command!', {
								reply: message.member
							})
						}
					}

					if (lowerCaseCommand === 'startlog') {
						Logs.StartLog(createEmbed, message, logging, bot)
					}

					if (lowerCaseCommand === 'awake') {
						if (SleepyUsers.has(message.author.id) == false) {
							message.channel.send('You are already Awake(or back)!')
						} else {
							SleepyUsers.delete(message.author.id);
							message.channel.send('You are now Awake (or back), Yay! ^-^ :smile: ')
						}
					}

					if (lowerCaseCommand === 'code') {
						if (message.guild.id === '303953298753454080') {
							let Role = args.join(" ")
							let Roles = [{
								name: 'Lua',
								Role: message.guild.roles.find('name', 'Lua')
							}, {
								name: 'Python',
								Role: message.guild.roles.find('name', 'Python')
							}, {
								name: 'C++',
								Role: message.guild.roles.find('name', 'C++')
							}, {
								name: 'C+',
								Role: message.guild.roles.find('name', 'C+')
							}, {
								name: 'C#',
								Role: message.guild.roles.find('name', 'C#')
							}, {
								name: 'C',
								Role: message.guild.roles.find('name', 'C')
							}, {
								name: 'JavaScript',
								Role: message.guild.roles.find('name', 'JavaScript')
							}, {
								name: 'Java',
								Role: message.guild.roles.find('name', 'Java')
							}, {
								name: 'Php',
								Role: message.guild.roles.find('name', 'Php')
							}, {
								name: 'SQL',
								Role: message.guild.roles.find('name', 'SQL')
							}, {
								name: 'Ruby',
								Role: message.guild.roles.find('name', 'Ruby/Rails')
							}, {
								name: 'Rails',
								Role: message.guild.roles.find('name', 'Ruby/Rails')
							}, {
								name: 'IOS',
								Role: message.guild.roles.find('name', 'IOS/Swift')
							}, {
								name: 'Swift',
								Role: message.guild.roles.find('name', 'IOS/Swift')
							}]
							let Names = [];
							let ChosenRole = null;

							for (let i = 0; i < Roles.length; i++) {
								if (Role.toLowerCase() == (Roles[i].name.toLowerCase())) {
									ChosenRole = Roles[i].Role
								}
							}

							for (let i = 0; i < Roles.length; i++) {
								Names.push(Roles[i].name)
							}

							if (ChosenRole == null) {
								let Codes = Names.join(', ')
								message.channel.send('Failed to get Code Role, Available Code Roles: ' + Codes)
								return;
							} else {
								try {
									message.member.addRole(ChosenRole);
									message.channel.send('Gave you the Code Role: ' + ChosenRole.name, {
										reply: message.member
									})
								} catch (err) {
									console.log(err)
								}
							}
						} else {
							message.channel.send('You can only do this command in the Loli Bot Server', {
								reply: message.member
							})
							return;
						}
					}

					if (lowerCaseCommand === 'color') {
						if (message.guild.id === '303953298753454080') {
							let Role = args.join(" ")
							let Roles = [{
								name: 'Pink',
								Role: message.guild.roles.find('name', 'Pink')
							}, {
								name: 'Green',
								Role: message.guild.roles.find('name', 'Green')
							}, {
								name: 'Orange',
								Role: message.guild.roles.find('name', 'Orange')
							}, {
								name: 'Yellow',
								Role: message.guild.roles.find('name', 'Yellow')
							}, {
								name: 'Blue',
								Role: message.guild.roles.find('name', 'Blue')
							}, {
								name: 'Red',
								Role: message.guild.roles.find('name', 'Red')
							}]
							let Names = []
							let ChosenRole = null;

							for (let i = 0; i < Roles.length; i++) {
								Names.push(Roles[i].name)
							}

							for (let i = 0; i < Roles.length; i++) {
								if (message.member.roles.has(Roles[i].Role.id)) {
									message.member.removeRole(Roles[i].Role)
								}
							}

							for (let i = 0; i < Roles.length; i++) {
								if (Role.toLowerCase().includes(Roles[i].Role.name.toLowerCase())) {
									ChosenRole = Roles[i].Role
								}
							}

							if (ChosenRole == null) {
								let Colors = Names.join(', ')
								message.channel.send('Failed to get Color, Available Colors: ' + Colors)
								return;
							} else {
								try {
									message.member.addRole(ChosenRole);
									message.channel.send('Gave you the Color: ' + Role, {
										reply: message.member
									})
								} catch (err) {
									console.log(err)
								}
							}
						} else {
							message.channel.send('You can only do this command in the Loli Bot Server', {
								reply: message.member
							})
							return;
						}
					}

					if (lowerCaseCommand === 'setgame') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									try {
										message.channel.send('Set my game to: ' + args.join(" "))
									} catch (err) {}
									bot.user.setGame(args.join(" "));
									console.log('Game Set to: ' + args.join(" "));
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									})
									return;
								}
							}
						})
					}

					if (lowerCaseCommand === 'setprefix') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									try {
										message.channel.send('Set my Prefix to: `' + args.join(" ") + "`")
									} catch (err) {}
									prefix = args.join(" ");
									console.log('Prefix Set to: ' + args.join(" "));
									var roll = Math.floor(Math.random() * 16) + 1;
									bot.user.setGame(prefix + "help | " + roll + "/16");
								} else {
									message.channel.send('You aren\'t the Bot Creator!', {
										reply: message.member
									});
								}
							}
						})
					}

					if (lowerCaseCommand === 'setstatus') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									try {
										message.channel.send('Set my Status to: ' + args.join(" "))
									} catch (err) {}
									bot.user.setStatus(args.join(" "));
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									});
								}
							}
						})
					}

					if (lowerCaseCommand === 'setavatar') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									try {
										message.channel.send('Set my Avatar to: ' + args.join(" "))
									} catch (err) {}
									bot.user.setAvatar(args.join(" "));
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									})
									return;
								}
							}
						})
					}
					if (lowerCaseCommand === 'invite') {
						UtilCmds.getinvite(message);
					}
					if (lowerCaseCommand === 'ping') {
						UtilCmds.ping(message);
					}
					if (lowerCaseCommand === 'uwu') {
						let UnAllowedRole = message.guild.roles.find('name', CurrentMemberRole);
						if (message.member.roles.has(UnAllowedRole.id)) return message.channel.send('You have already answered the questions!')
						try {
							let filter = m => m.author.id === message.member.user.id
							let Selection;
							let Selection2;
							let Selection3;
							let msg1 = message.channel.send('Have you read the Rules?')
							message.channel.awaitMessages(filter, {
									max: 1
								})
								.then(collected => {
									Selection = collected.first()
									if (Selection.content.toLowerCase().includes('yes')) {
										let msg2 = message.channel.send('What channel would bot spam go in?')
										message.channel.awaitMessages(filter, {
												max: 1
											})
											.then(collected => {
												Selection2 = collected.first()
												if (Selection2.content.toLowerCase().includes('bot-spam') || Selection2.content.toLowerCase().includes('bot spam') || Selection2.content.toLowerCase().includes('botspam')) {
													let msg3 = message.channel.send('What channel would Adult content/Nude images/Nsfw go in?')
													message.channel.awaitMessages(filter, {
															max: 1
														})
														.then(collected => {
															Selection3 = collected.first()
															if (Selection3.content.toLowerCase().includes('nsfw')) {
																let Mem = message.guild.roles.find('name', CurrentMemberRole)
																message.member.addRole(Mem)
																let Chan = message.guild.channels.find('name', 'the_den')
																Chan.send('<@' + message.author.id + '> Thank you for reading the Rules! Congratulations you now have access to all Channels.')
																msg1.then(msg => msg.delete())
																Selection.delete()
																msg2.then(msg => msg.delete())
																Selection2.delete()
																msg3.then(msg => msg.delete())
																Selection3.delete()
																message.delete()
															} else {
																message.channel.send('Please read the Rules and try again.')
																msg1.then(msg => msg.delete())
																Selection.delete()
																msg2.then(msg => msg.delete())
																Selection2.delete()
																msg3.then(msg => msg.delete())
																Selection3.delete()
																message.delete()
															}
														})
												} else {
													message.channel.send('Please read the Rules and try again.')
													msg1.then(msg => msg.delete())
													Selection.delete()
													msg2.then(msg => msg.delete())
													Selection2.delete()
													message.delete()
												}
											})
									} else {
										message.channel.send('Please read the Rules!')
										msg1.then(msg => msg.delete())
										Selection.delete()
										message.delete()
									}
								})
						} catch (err) {}
					}
					if (lowerCaseCommand === 'order') {
						let randomToken = require('random-token');
						let Requesting = args.join(" ");
						var OrderToken = randomToken(20);
						let KitchenChannel = bot.guilds.find('id', '303953298753454080').channels.find('name', 'kitchen');
						//Time to formulate thier request
						PizzaOrders.push({
							Order: Requesting,
							OrderId: OrderToken,
							Orderer: message.author.id,
							AcceptedBy: ''
						}) // Adding data to Pizza Orders
						message.author.send('Your Pizza order for `' + Requesting + '` Will Be Delivered Shortly. Your Order id is: `' + OrderToken + '`.') // Send a Message Confirming
						let PizzaEmbed = new Discord.RichEmbed();
						PizzaEmbed.setTitle('Pizza order from ' + message.author.username)
						PizzaEmbed.setDescription('Their Request: `' + Requesting + '`')
						PizzaEmbed.addField('Order Token', '`' + OrderToken + '`')
						KitchenChannel.send('', {
							embed: PizzaEmbed
						})
					}
					if (lowerCaseCommand === 'declineorder') {
						if (message.guild.id == '303953298753454080') {
							let AllowedRole = message.guild.roles.find('name', 'Chef');
							if (message.member.roles.has(AllowedRole.id)) {
								let SearchId = args[0]
								let Reason = message.content.split(" ").slice(2).join(' ');
								let OrderFound = false;
								for (var i = 0; i < PizzaOrders.length; i++) {
									if (PizzaOrders[i].OrderId == SearchId) {
										if (PizzaOrders[i].AcceptedBy != '' && PizzaOrders[i].AcceptedBy != message.author.id) {
											OrderFound = true
											message.channel.send('Sorry this Order was Accepted by Another Chef Already. The Chef Preparing this order is `' + bot.users.get(PizzaOrders[i].AcceptedBy).username + '`')
										} else {
											OrderFound = true
											bot.users.get(PizzaOrders[i].Orderer).send('Your Order for: `' + PizzaOrders[i].Order + '` Was Declined by Chef `' + message.author.username + '` For the Reason: `' + Reason + '`')
											PizzaOrders.slice(i, 1) // Remove the Order
											message.channel.send('Order Declined and Deleted Successfully.')
										}
									}
								}
								if (OrderFound == false) {
									message.channel.send('The order with id `' + SearchId + '` was not found.')
								}
							} else {
								message.channel.send('You do not have the Chef Role!')
							}
						}
					}
					if (lowerCaseCommand === 'acceptorder') {
						if (message.guild.id == '303953298753454080') {
							let AllowedRole = message.guild.roles.find('name', 'Chef');
							if (message.member.roles.has(AllowedRole.id)) {
								let SearchId = args[0]
								//let Reason = message.content.split(" ").slice(2).join(' ');
								let OrderFound = false;
								for (var i = 0; i < PizzaOrders.length; i++) {
									if (PizzaOrders[i].OrderId == SearchId) {
										if (PizzaOrders[i].AcceptedBy != '' && PizzaOrders[i].AcceptedBy != message.author.id) {
											OrderFound = true
											message.channel.send('Sorry this Order was Accepted by Another Chef Already. The Chef Preparing this order is `' + bot.users.get(PizzaOrders[i].AcceptedBy).username + '`')
										} else {
											OrderFound = true
											PizzaOrders[i].AcceptedBy = message.author.id
											bot.users.get(PizzaOrders[i].Orderer).send('Your Order for: `' + PizzaOrders[i].Order + '` Was Accepted and will be Delivered soon by Chef `' + message.author.username + '`')
											//PizzaOrders.slice(i,1) // Remove the Order
											message.channel.send('Order Accepted Successfully.')
										}
									}
								}
								if (OrderFound == false) {
									message.channel.send('The order with id `' + SearchId + '` was not found.')
								}
							} else {
								message.channel.send('You do not have the Chef Role!')
							}
						}
					}
					if (lowerCaseCommand === 'revieworder') {
						if (message.guild.id == '303953298753454080') {
							let AllowedRole = message.guild.roles.find('name', 'Chef');
							if (message.member.roles.has(AllowedRole.id)) {
								let SearchId = args[0]
								//let Reason = message.content.split(" ").slice(2).join(' ');
								let OrderFound = false;
								for (var i = 0; i < PizzaOrders.length; i++) {
									if (PizzaOrders[i].OrderId == SearchId) {
										OrderFound = true
										let Orderer = bot.users.get(PizzaOrders[i].Orderer)
										let ChefTag = 'Nobody'
										let ChefId = '0'
										if (PizzaOrders[i].AcceptedBy != '') {
											let Chef = bot.users.get(PizzaOrders[i].AcceptedBy)
											ChefTag = Chef.tag
											ChefId = Chef.id
										}
										let PizzaEmbed = new Discord.RichEmbed()
										PizzaEmbed.setTitle('Reviewing Order `' + SearchId + '`')
										PizzaEmbed.addField('Order: `' + PizzaOrders[i].Order + '`', 'Ordered by: `' + Orderer.tag + '` (*' + Orderer.id + '*)')
										PizzaEmbed.addField('Chef Handling the Order', '`' + ChefTag + '` (*' + ChefId + '*)')
										message.channel.send('', {
											embed: PizzaEmbed
										})
									}
								}
								if (OrderFound == false) {
									message.channel.send('The order with id `' + SearchId + '` was not found.')
								}
							} else {
								message.channel.send('You do not have the Chef Role!')
							}
						}
					}
					if (lowerCaseCommand === 'deliver') {
						if (message.guild.id == '303953298753454080') {
							let AllowedRole = message.guild.roles.find('name', 'Chef');
							if (message.member.roles.has(AllowedRole.id)) {
								let SearchId = args[0]
								let Details = message.content.split(" ").slice(2).join(' ');
								let OrderFound = false;
								let Image = null;
								if (message.attachments.array()[0] != null && message.attachments.array()[0] != undefined) {
									Image = message.attachments.array()[0].url
								}
								for (var i = 0; i < PizzaOrders.length; i++) {
									if (PizzaOrders[i].OrderId == SearchId) {
										if (PizzaOrders[i].AcceptedBy != '' && PizzaOrders[i].AcceptedBy != message.author.id) {
											OrderFound = true
											message.channel.send('Sorry this Order was Accepted by Another Chef Already. The Chef Preparing this order is `' + bot.users.get(PizzaOrders[i].AcceptedBy).username + '`')
										} else {
											OrderFound = true
											bot.users.get(PizzaOrders[i].Orderer).send('Your Order for: `' + PizzaOrders[i].Order + '` Has been delivered by Chef `' + message.author.username + '`\nDetails: ' + Details, {
												file: Image
											})
											PizzaOrders.slice(i, 1) // Remove the Order
											message.channel.send('Order Delivered Successfully.')
										}
									}
								}
								if (OrderFound == false) {
									message.channel.send('The order with id `' + SearchId + '` was not found.')
								}
							} else {
								message.channel.send('You do not have the Chef Role!')
							}
						}
					}
					if (lowerCaseCommand === 'test') {
						let Plr = {};
						Plr.Inventory = [{
							Item: 'Wood Sword',
							Attack: 5,
							Accuracy: 50,
							Rarity: 'Common',
							Worth: 0,
							Sellable: false,
							Image: 'https://vignette.wikia.nocookie.net/kingdomhearts/images/c/cd/Wooden_Sword.png/revision/latest?cb=20110125222103'
						}]
						Plr.Stats = {}
						Plr.Stats.MaxHp = 100
						Plr.Stats.Hp = 100
						Plr.Stats.Mana = 100
						Plr.Stats.Limit = 100
						Plr.Stats.Attack = 1
						Plr.Stats.Defense = 1
						Plr.Stats.BattleCoins = 0
						Plr.Equipped = Plr.Inventory[0]
						let Embd = new Discord.RichEmbed()
						Embd.setTitle('Viewing the Profile of ' + message.author.username)
						Embd.addField('Health:', Plr.Stats.Hp, true)
						Embd.addField('Mana:', Plr.Stats.Mana, true)
						Embd.addField(':crossed_swords: Battle Coins:', Plr.Stats.BattleCoins, true)
						Embd.addBlankField()
						Embd.addField('Attack:', Plr.Stats.Attack, true)
						Embd.addField('Defense:', Plr.Stats.Defense, true)
						Embd.addField('Currently Equipped:', Plr.Equipped.Item, true)
						message.channel.send('', {
							embed: Embd
						})
					}
					if (lowerCaseCommand === 'dicksize') {
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try Again!')
								}
								let Data = JSON.parse(row.Data)
								if (Data.Fun.DickSize === '') {
									var Sizes = ['8D', '8=D', '8==D', '8===D', '8====D', '8=====D', '8======D', '8=======D', '8========D', '8=========D', '8==========D', '8===========D']
									var Size = Sizes[Math.floor(Math.random() * Sizes.length)];
									Data.Fun.DickSize = Size.toString()
									let Val = JSON.stringify(Data)
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`);
									return message.channel.send('Your dicksize: ' + Size)
								} else {
									return message.channel.send('Your dicksize: ' + Data.Fun.DickSize)
								}
							})
						} else {
							sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
								if (!crow) {
									return message.channel.send('This user has not consented with ' + prefix + 'consent')
								}
							})
							sql.get(`SELECT * FROM Data WHERE userId = ${member.user.id}`).then(row => {
								if (!row) {
									MakeData(member.user.id)
									return message.channel.send('Try Again!')
								}
								let Data = JSON.parse(row.Data)
								if (row.DickSize === 'None') {
									var Sizes = ['8D', '8=D', '8==D', '8===D', '8====D', '8=====D', '8======D', '8=======D', '8========D', '8=========D', '8==========D', '8===========D']
									var Size = Sizes[Math.floor(Math.random() * Sizes.length)];
									Data.Fun.DickSize = Size.toString()
									let Val = JSON.stringify(Data)
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.user.id}`);
									return message.channel.send(member.user.username + '\'s dicksize: ' + Size)
								} else {
									return message.channel.send(member.user.username + '\'s dicksize: ' + Data.Fun.DickSize)
								}
							})
						}
					}
					if (lowerCaseCommand === 'avatar') {
						UtilCmds.getavatar(message);
					}
					if (lowerCaseCommand === 'date') {
						UtilCmds.date(createEmbed, message);
					}
					if (lowerCaseCommand === 'users') {
						UtilCmds.getusers(createEmbed, message);
					}
					if (lowerCaseCommand === 'joke') {
						message.channel.send('My Life.', {
							reply: message.member
						});
					}

					if (lowerCaseCommand === 'sql') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Eval == 2) {
									function clean(text) {
										if (typeof(text) === "string")
											return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
										else
											return text;
									}

									var code = args.join(" ");
									message.channel.send('Executed SQL Code');
									try {
										var evaled = sql.run(code).then(Result => {
											if (Result) {
												message.channel.send(Result)
											}
										})
									} catch (err) {
										message.channel.send("```" + err + "```")
									}

									if (typeof evaled !== "string")
										evaled = require("util").inspect(evaled);

									var CleanCode = clean(evaled)
									message.channel.send(CleanCode)
								} else {
									message.channel.send('Command requires permission Eval 2', {
										reply: message.member
									})
									return;
								}
							}
						})
					}

					if (lowerCaseCommand === 'daily') {
						sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
							if (!row) {
								MakeData(message.author.id)
								return message.channel.send('Try again!');
							}
							let Data = JSON.parse(row.Data)
							if (Number(Data.Main.Daily) > Number(new Date()) == true) {
								message.channel.send('You\'ve Claimed your Daily already today!')
								var Hours = Math.floor((((Number(row.Daily) - Number(new Date())) / 1000) / 60) / 60);
								var Minutes = Math.floor(((Number(row.Daily) - Number(new Date())) / 1000) / 60);
								var Seconds = Math.floor((Number(row.Daily) - Number(new Date())) / 1000);
								Seconds = Seconds % 60
								Minutes = Minutes % 60
								Hours = Hours % 24
								message.channel.send('Please wait another: ' + Hours + 'Hours, ' + Minutes + 'Minutes, ' + Seconds + 'Seconds.')
							} else {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try again!');
								}
								if (Number(Data.Main.Daily) > Number(new Date()) == false) {
									var Base = 100
									var Random = 0
									var roll = Math.floor(Math.random() * 200) + 1;
									if (roll < 100) {
										Random = 100
									} else {
										Random = roll
									}
									if (row.Donator == 'false') {
										Data.Main.LoliCoins += Base
										Data.Main.Daily = Number(new Date(new Date().getTime() + 86400 * 1000))
										let Val = JSON.stringify(Data)
										sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
										message.channel.send('Claimed Daily! Recieved **' + Base + '** LoliCoins.')
									} else {
										if (row.Donator == 'true') {
											Base = Base + Random
											Data.Main.LoliCoins += Base
											Data.Main.Daily = Number(new Date(new Date().getTime() + 86400 * 1000))
											let Val = JSON.stringify(Data)
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
											message.channel.send('Claimed Daily! Recieved **' + Base + '** LoliCoins.')
										}
									}
								}
							}
						})
					}

					if (lowerCaseCommand === 'gift') {
						sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
							if (!row) {
								MakeData(message.author.id)
								return message.channel.send('Try again!');
							}
							let Data = JSON.parse(row.Data)
							if (Number(Data.Main.Gift) > Number(new Date()) == true) {
								message.channel.send('You\'ve Claimed your Gift :gift: already today!')
								var Hours = Math.floor((((Number(row.Gift) - Number(new Date())) / 1000) / 60) / 60);
								var Minutes = Math.floor(((Number(row.Gift) - Number(new Date())) / 1000) / 60);
								var Seconds = Math.floor((Number(row.Gift) - Number(new Date())) / 1000);
								Seconds = Seconds % 60
								Minutes = Minutes % 60
								Hours = Hours % 24
								message.channel.send('Please wait another: ' + Hours + 'Hours, ' + Minutes + 'Minutes, ' + Seconds + 'Seconds.')
							} else {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try again!');
								}
								let Data = JSON.parse(row.Data)
								if (Number(Data.Main.Gift) > Number(new Date()) == false) {
									var Random = 0
									var roll = Math.floor(Math.random() * 300) + 1;
									if (roll < 50) {
										Random = 50
									} else {
										Random = roll
									}
									Data.Main.LoliCoins += Random
									Data.Main.Gift = Number(new Date(new Date().getTime() + 86400 * 1000))
									let Val = JSON.stringify(Data)
									sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
									message.channel.send(':gift: Claimed Gift! Recieved **' + Random + '** LoliCoins.')
								}
							}
						})
					}

					if (lowerCaseCommand === 'balance') {
						sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
							if (!row) {
								MakeData(message.author.id)
								return message.channel.send('Try again!');
							}
							let Data = JSON.parse(row.Data)
							message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
								"Loli Bot",
								"Displaying Balance", [{
									name: 'Your balance is:',
									value: Data.Main.LoliCoins + ' LoliCoins :money_with_wings: '
								}]
							))
						})
					}

					if (lowerCaseCommand === 'achievements') {
						sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
							if (!row) {
								MakeData(message.author.id)
								return message.channel.send('Try again!');
							}
							/*message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
								"Loli Bot",
								"Displaying Achievements", [{
									name: 'Your Achievements:',
									value: row.Achievements
								}]
							))*/
						})
					}

					if (lowerCaseCommand === 'profile') {
						var member = null
						try {
							member = message.guild.member(message.mentions.users.first());
						} catch (err) {}
						if (!member) {
							sql.get(`SELECT * FROM Data WHERE userId ='${message.author.id}'`).then(row => {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try again!');
								}
										// New Embed
										let Data = JSON.parse(row.Data)
										let EmbedToSend = new Discord.RichEmbed
										if (message.author.id == Config.OwnerId) {
											EmbedToSend.setAuthor('Azumi-Senpai', bot.user.avatarURL)
										}
										EmbedToSend.setThumbnail(message.author.avatarURL)
										EmbedToSend.setTitle('Loli Bot')
										EmbedToSend.setDescription('Profiles Section')
										EmbedToSend.setColor(message.guild.me.displayHexColor)
										EmbedToSend.addField('User:', message.author.username, true)
										EmbedToSend.addField('User-Title:', Data.Main.Title, true)
										EmbedToSend.addField('Married to:', ':heart: ' + Data.Marriage.MarriedTo, true)
										EmbedToSend.addBlankField(false)
										EmbedToSend.addField('Balance:', Data.Main.LoliCoins + ' LoliCoins :money_with_wings: ', true)
										EmbedToSend.addField('Level:', Data.Main.Level, true)
										EmbedToSend.addField('Experience:', Data.Main.Exp, true)
										EmbedToSend.addBlankField(false)
										EmbedToSend.addField('Is a Donator:', Data.Main.IsADonator.toString(), true)
										EmbedToSend.addField('Kills:', Data.Main.KillCount, true)
										EmbedToSend.addField('Reputation:', ':thumbsup: ' + Data.Reputations.UpVotes + '  :thumbsdown: ' + Data.Reputations.DownVotes, true)
										EmbedToSend.addField('Achievements:', Data.Main.Achievements.map(e => { if (e.Name) { return e.Name }}).join(' '))
										message.channel.send('', {
											embed: EmbedToSend
										})
							})
						} else {
							sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
								if (!crow) {
									return message.channel.send('This user has not consented with ' + prefix + 'consent')
								}
							})
							sql.get(`SELECT * FROM Data WHERE userId = ${member.user.id}`).then(row => {
							// New Embed
							let Data = JSON.parse(row.Data)
							let EmbedToSend = new Discord.RichEmbed
							if (member.user.id == Config.OwnerId) {
								EmbedToSend.setAuthor('Azumi-Senpai', bot.user.avatarURL)
							}
							EmbedToSend.setThumbnail(member.user.avatarURL)
							EmbedToSend.setTitle('Loli Bot')
							EmbedToSend.setDescription('Profiles Section')
							EmbedToSend.setColor(message.guild.me.displayHexColor)
							EmbedToSend.addField('User:', member.user.username, true)
							EmbedToSend.addField('User-Title:', Data.Main.Title, true)
							EmbedToSend.addField('Married to:', ':heart: ' + Data.Marriage.MarriedTo, true)
							EmbedToSend.addBlankField(false)
							EmbedToSend.addField('Balance:', Data.Main.LoliCoins + ' LoliCoins :money_with_wings: ', true)
							EmbedToSend.addField('Level:', Data.Main.Level, true)
							EmbedToSend.addField('Experience:', Data.Main.Exp, true)
							EmbedToSend.addBlankField(false)
							EmbedToSend.addField('Is a Donator:', Data.Main.IsADonator.toString(), true)
							EmbedToSend.addField('Kills:', Data.Main.KillCount, true)
							EmbedToSend.addField('Reputation:', ':thumbsup: ' + Data.Reputations.UpVotes + '  :thumbsdown: ' + Data.Reputations.DownVotes, true)
							EmbedToSend.addField('Achievements:', Data.Main.Achievements.map(e => { if (e.Name) { return e.Name }}).join(' '))
							message.channel.send('', {
								embed: EmbedToSend
							})
						})
						}
					}

					if (lowerCaseCommand === 'otitle') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									let member = message.guild.member(message.mentions.users.first());
									let Reason = message.content.split(" ").slice(2).join(' ');
									if (!member) {
										message.channel.send('That user does not seem valid.', {
											reply: message.member
										})
									} else {
										sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
											if (!crow) {
												return message.channel.send('This user has not consented with ' + prefix + 'consent')
											}
										})
										if (Reason != null) {
											sql.get(`SELECT * FROM Data WHERE userId ='${member.id}'`).then(row => {
												if (!row) {
													MakeData(member.id)
													return message.channel.send('Try again!');
												}
												let Data = JSON.parse(row.Data)
												Data.Main.Title = Reason.toString()
												let Val = JSON.stringify(Data)
												sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.id}`);
											})
											message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
												"Loli Bot",
												"Owner Title Set", [{
													name: 'User:',
													value: member.user.username
												}, {
													name: 'Title set to:',
													value: Reason
												}, ]
											))
										} else {}
									}
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									})
									return;
								}
							}
						})
					}

					if (lowerCaseCommand === 'ogive') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									var Val = message.content.split(" ").slice(2);
									var CheckedVal = parseInt(Val)
									let member = message.guild.member(message.mentions.users.first());
									if (!member) {
										message.channel.send('That user does not seem valid.', {
											reply: message.member
										})
									} else {
										sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
											if (!crow) {
												return message.channel.send('This user has not consented with ' + prefix + 'consent')
											}
										})
										if (CheckedVal > 0) {
											sql.get(`SELECT * FROM Data WHERE userId = ${member.id}`).then(row => {
												if (!row) {
													MakeData(member.id)
													return message.channel.send('Try again!');
												}
												let Data = JSON.parse(row.Data)
												Data.Main.LoliCoins += CheckedVal
												let Val = JSON.stringify(Data)
												sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.id}`);
											})
											message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
												"Loli Bot",
												"Owner Money Give", [{
													name: 'Reciever:',
													value: member.user.username
												}, {
													name: 'Amount Transferred:',
													value: CheckedVal
												}, ]
											))
										} else {}
									}
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									})
									return;
								}
							}
						})
					}
					if (lowerCaseCommand === 'addac') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									var Achievement = args[1]
									let Rarity = args[2]
									let member = message.guild.member(message.mentions.users.first());
									if (!member) {
										message.channel.send('That user does not seem valid.', {
											reply: message.member
										})
									} else {
										sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
											if (!crow) {
												return message.channel.send('This user has not consented with ' + prefix + 'consent')
											}
										})
										try {
											sql.get(`SELECT * FROM Data WHERE userId = ${member.id}`).then(row => {
												if (!row) {
													MakeData(member.id)
													return message.channel.send('Try again!');
												}
												let Data = JSON.parse(row.Data)
												Data.Main.Achievements.push({
													Name: ':'+Achievement+':',
													Rarity: Rarity
												})
												let Val = JSON.stringify(Data)
												sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.id}`);
											})
											message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
												"Loli Bot",
												"Owner Achievement Give", [{
													name: 'Reciever:',
													value: member.user.username
												}, {
													name: 'Achievement Given:',
													value: ":" + Achievement + ":"
												}, {
													name: 'Rarity Level:',
													value: Rarity
												}]
											))
											message.channel.send('Congratulations you just got the :' + Achievement + ': Achievement!', {
												reply: member
											}).catch(err => {});
										} catch (err) {
											console.log(err)
										}
									}
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									})
									return;
								}
							}
						})
					}
					if (lowerCaseCommand === 'oremove') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							} else {
								if (row.Set == 1) {
									var Val = message.content.split(" ").slice(2);
									var CheckedVal = parseInt(Val)
									let member = message.guild.member(message.mentions.users.first());
									if (!member) {
										message.channel.send('That user does not seem valid.', {
											reply: message.member
										})
									} else {
										sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
											if (!crow) {
												return message.channel.send('This user has not consented with ' + prefix + 'consent')
											}
										})
										if (CheckedVal > 0) {
											sql.get(`SELECT * FROM Data WHERE userId = ${member.id}`).then(row => {
												if (!row) {
													MakeData(member.id)
													return message.channel.send('Try again!');
												}
												let Data = JSON.parse(row.Data)
												var Result = (Data.Main.LoliCoins - CheckedVal)
												Data.LoliCoins = Result
												let Val = JSON.stringify(Data)
												sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.id}`);
											})
											message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
												"Loli Bot",
												"Owner Money Remove", [{
													name: 'User:',
													value: member.user.username
												}, {
													name: 'Amount Removed:',
													value: CheckedVal
												}, ]
											))
										} else {}
									}
								} else {
									message.channel.send('Command requires permission Set 1', {
										reply: message.member
									})
									return;
								}
							}
						})
					}
					if (lowerCaseCommand === 'give' | lowerCaseCommand === 'donate') {
						var Val = message.content.split(" ").slice(2);
						var CheckedVal = parseInt(Val)
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
								if (!crow) {
									return message.channel.send('This user has not consented with ' + prefix + 'consent')
								}
							})
							if (CheckedVal > 0) {
								sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
									if (!row) {
										MakeData(message.author.id)
										return message.channel.send('Try again!');
									}
									let Data = JSON.parse(row.Data)
									if (Data.Main.LoliCoins >= CheckedVal) {
										var ReturnVal = (Data.Main.LoliCoins - CheckedVal)
										Data.Main.LoliCoins = ReturnVal
										Val = JSON.stringify(Data);
										sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)

										let HasThisAchievement = false
										Data.Main.Achievements.map(e => { if (e.Name == ':heart:') { return HasThisAchievement = true }});
										if (HasThisAchievement == false) {
											Data.Main.Achievements.push({
												Name: ':heart:',
												Rarity: 'Common'
											})
											Val = JSON.stringify(Data);
											sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${message.author.id}`)
											message.channel.send('Congratulations you just got the :heart: Achievement!', {
												reply: message.member
											})
										}
										sql.get(`SELECT * FROM Data WHERE userId = ${member.id}`).then(row2 => {
											if (!row2) {
												MakeData(member.id)
												return message.channel.send('Try again!');
											}
											let Data2 = JSON.parse(row2.Data)
											Data2.Main.LoliCoins += CheckedVal
											let Val2 = JSON.stringify(Data2)
											sql.run(`UPDATE Data SET Data = '${Val2}' WHERE userId = ${member.id}`);
										})
										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Money Transfer", [{
												name: 'Sender:',
												value: message.author.username
											}, {
												name: 'Reciever:',
												value: member.user.username
											}, {
												name: 'Amount Transferred:',
												value: CheckedVal
											}, ]
										))
									} else {
										if (Data.Main.LoliCoins < CheckedVal) {
											message.channel.send('You do not have enough LoliCoins for this Transaction', {
												reply: message.member
											})
										}
									}
								})
							}
						}
					}

					if (lowerCaseCommand === 'slots') {

						var Val = message.content.split(" ").slice(1);
						var CheckedVal = parseInt(Val)
						CheckedVal = Math.floor(CheckedVal)
						var moneyBet = CheckedVal;

						var moneyReturned = 0;

						if (moneyBet <= 0) {
							return;
						}

						var objects = [
							"🍒", "🍒", "🍒", "🍒",
							"🍊", "🍊",
							"🍓", "🍓",
							"🍍", "🍍",
							"🍇", "🍇",
							"⭐", "⭐",
							"🍍", "🍍",
							"🍓", "🍓",
							"🍊", "🍊", "🍊",
							"🍒", "🍒", "🍒", "🍒",
						];

						var objectsChosen = [objects[Math.floor(Math.random() * objects.length)], objects[Math.floor(Math.random() * objects.length)], objects[Math.floor(Math.random() * objects.length)]];

						var score = ""

						for (var i = 0; i < objectsChosen.length; i++) {
							var o = objectsChosen[i]
							score = score + o
						}

						if (score.includes("🍒")) {
							var matchesCount = score.split("🍒").length - 1;
							if (matchesCount == 2) {
								moneyReturned = Math.ceil(moneyBet * 0.5);
							} else {
								if (matchesCount == 3) {
									moneyReturned = Math.ceil(moneyBet * 1);
								}
							}
						}
						if (score.includes("🍊")) {
							var matchesCount = score.split("🍊").length - 1;
							if (matchesCount == 2) {
								moneyReturned = Math.ceil(moneyBet * 0.8);
							} else {
								if (matchesCount == 3) {
									moneyReturned = Math.ceil(moneyBet * 1.5);
								}
							}
						}
						if (score.includes("🍓")) {
							var matchesCount = score.split("🍓").length - 1;
							if (matchesCount == 2) {
								moneyReturned = Math.ceil(moneyBet * 1);
							} else {
								if (matchesCount == 3) {
									moneyReturned = Math.ceil(moneyBet * 2);
								}
							}
						}
						if (score.includes("🍍")) {
							var matchesCount = score.split("🍍").length - 1;
							if (matchesCount == 3) {
								moneyReturned = Math.ceil(moneyBet * 4);
							}
						}
						if (score.includes("🍇")) {
							var matchesCount = score.split("🍇").length - 1;
							if (matchesCount == 3) {
								moneyReturned = Math.ceil(moneyBet * 6);
							}
						}
						if (score.includes("⭐")) {
							var matchesCount = score.split("⭐").length - 1;
							if (matchesCount == 3) {
								moneyReturned = Math.ceil(moneyBet * 12);
							}
						}
						if (moneyReturned == 0) {
							moneyReturned = -moneyBet;
						} else {
							/* b.AddField(f =>
							 {
							     f.Name = locale.GetString(Locale.SlotsWinHeader);
							     f.Value = locale.GetString(Locale.SlotsWinMessage, moneyReturned);
							 });*/
						}
						sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
							if (!row) {
								MakeData(message.author.id)
								return message.channel.send('Try again!');
							}
							if (row.LoliCoins >= CheckedVal) {
								var ReturnVal = 0
								ReturnVal = row.LoliCoins += moneyReturned;
								message.channel.send(score)
								if (moneyReturned > 0) {
									message.channel.send('You won! +' + moneyReturned + ' LoliCoins')
								} else {
									message.channel.send('You lost. ' + moneyReturned + ' LoliCoins')
								}
								sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
							} else {
								if (row.LoliCoins < CheckedVal) {
									message.channel.send('You do not have enough LoliCoins for this Gamble', {
										reply: message.member
									})
								}
							}
						})
					};

					if (lowerCaseCommand === 'flowers') {
						FrostyFlowers.Game(createEmbed, sql, message)
					}

					if (lowerCaseCommand === '1v1') {
						OnevOne.Game(ivis, sql, message)
					}

					if (lowerCaseCommand === 'coinflip') {
						var Val = message.content.split(" ").slice(1);
						var CheckedVal = parseInt(Val)
						var Selection;
						CheckedVal = Math.floor(CheckedVal)
						var ReturnVal = 0
						if (CheckedVal > 0) {
							sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try again!');
								}
								if (row.LoliCoins >= CheckedVal) {
									var filter = m => m.author.id === message.author.id
									var roll = Math.floor(Math.random() * 2) + 1;
									message.channel.send('*Throws quarter in the air* Call it! Heads or Tails?')
									message.channel.awaitMessages(filter, {
											max: 1
										})
										.then(collected => {
											Selection = collected.first().toString().toLowerCase()
											if (Selection == 'heads') {
												if (roll == 1) {
													ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.5)))
													message.channel.send('Coin landed Heads and you won! :D *+' + Math.floor((CheckedVal * 0.5)) + '*', {
														reply: message.member
													});
													sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
												} else {
													ReturnVal = Math.floor((row.LoliCoins - CheckedVal))
													message.channel.send('Coin landed Tails and you lost. :( *-' + CheckedVal + '*', {
														reply: message.member
													});
													sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
												}
											} else {
												if (Selection == 'tails') {
													if (roll == 2) {
														ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.5)))
														message.channel.send('Coin landed Tails and you won! :D *+' + Math.floor((CheckedVal * 0.5)) + '*', {
															reply: message.member
														});
														sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
													} else {
														ReturnVal = Math.floor((row.LoliCoins - CheckedVal))
														message.channel.send('Coin landed Heads and you lost. :( *-' + CheckedVal + '*', {
															reply: message.member
														});
														sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
													}
												} else {
													message.channel.send('When doin the Coinflip, Please pick Heads or Tails')
												}
											}
										})
								} else {
									if (row.LoliCoins < CheckedVal) {
										message.channel.send('You do not have enough LoliCoins for this Gamble', {
											reply: message.member
										})
									}
								}
							})
						}
					}

					if (lowerCaseCommand === 'numberguess') {
						var Val = message.content.split(" ").slice(1);
						var CheckedVal = parseInt(Val)
						CheckedVal = Math.floor(CheckedVal)
						var Selection;
						if (CheckedVal > 0) {
							sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try again!');
								}
								if (row.LoliCoins >= CheckedVal) {
									var ReturnVal = 0
									var ezestroll = Math.floor(Math.random() * 3) + 1;
									var ezroll = Math.floor(Math.random() * 6) + 1;
									var roll = Math.floor(Math.random() * 10) + 1;
									var harderroll = Math.floor(Math.random() * 50) + 1;
									var hardestroll = Math.floor(Math.random() * 100) + 1;
									var filter = m => m.author.id === message.author.id
									var roll = Math.floor(Math.random() * 2) + 1;
									var rollwas = 0
									var mode = 'Normal'
									var numguess = '0-0'
									if (CheckedVal < 50) {
										mode = 'ezest'
										numguess = '1-3'
										rollwas = ezestroll
									} else {
										if (CheckedVal > 50 && CheckedVal < 100) {
											mode = 'ez'
											numguess = '1-6'
											rollwas = ezroll
										} else {
											if (CheckedVal > 100 && CheckedVal < 200) {
												mode = 'Normal'
												numguess = '1-10'
												rollwas = roll
											} else {
												if (CheckedVal > 200 && CheckedVal < 400) {
													mode = 'Harder'
													numguess = '1-50'
													rollwas = harderroll
												} else {
													if (CheckedVal > 400) {
														mode = 'Hardest'
														numguess = '1-100'
														rollwas = hardestroll
													}
												}
											}
										}
									}
									message.channel.send('Guess the Number! (' + numguess + ')')
									message.channel.awaitMessages(filter, {
											max: 1
										})
										.then(collected => {
											Selection = collected.first().toString()
											Selection = parseInt(Selection)
											if (Selection == null || Selection == 'undefined') {
												return message.channel.send('Please specify a number!')
											}
											if (mode == 'ezest' && Selection == ezestroll) {
												ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.5)))
												message.channel.send('You guessed the number and won! :D *+' + Math.floor((CheckedVal * 0.5)) + '*', {
													reply: message.member
												});
												sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
											} else {
												if (mode == 'ez' && Selection == ezroll) {
													ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.5)))
													message.channel.send('You guessed the number and won! :D *+' + Math.floor((CheckedVal * 0.5)) + '*', {
														reply: message.member
													});
													sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
												} else {
													if (mode == 'Normal' && Selection == roll) {
														ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.75)))
														message.channel.send('You guessed the number and won! :D *+' + Math.floor((CheckedVal * 0.75)) + '*', {
															reply: message.member
														});
														sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
													} else {
														if (mode == 'Harder' && Selection == harderroll) {
															ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.9)))
															message.channel.send('You guessed the number and won! :D *+' + Math.floor((CheckedVal * 0.9)) + '*', {
																reply: message.member
															});
															sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
														} else {
															if (mode == 'Hardest' && Selection == hardestroll) {
																ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 1)))
																message.channel.send('You guessed the number and won! :D *+' + Math.floor((CheckedVal * 1)) + '*', {
																	reply: message.member
																});
																sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
															} else {
																message.channel.send('You lost! The Number was ' + rollwas + ' :( *-' + CheckedVal + '*')
															}
														}
													}
												}
											}
										})
								} else {
									if (row.LoliCoins < CheckedVal) {
										message.channel.send('You do not have enough LoliCoins for this Gamble', {
											reply: message.member
										})
									}
								}
							})
						}
					}

					if (lowerCaseCommand === '5050') {
						var Val = message.content.split(" ").slice(1);
						var CheckedVal = parseInt(Val)
						CheckedVal = Math.floor(CheckedVal)
						if (CheckedVal > 0) {
							sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
								if (!row) {
									MakeData(message.author.id)
									return message.channel.send('Try again!');
								}
								if (row.LoliCoins >= CheckedVal) {
									var ReturnVal = 0
									var roll = Math.floor(Math.random() * 100) + 1;
									if (roll > 50) {
										ReturnVal = Math.floor((row.LoliCoins + (CheckedVal * 0.5)))
										message.channel.send(':game_die:  You rolled a ' + roll + ' and won! :D *+' + Math.floor((CheckedVal * 0.5)) + '*', {
											reply: message.member
										});
										sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
									} else {
										ReturnVal = Math.floor((row.LoliCoins - CheckedVal))
										message.channel.send(':game_die:  You rolled a ' + roll + ' and lost. :( *-' + CheckedVal + '*', {
											reply: message.member
										});
										sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
									}
								} else {
									if (row.LoliCoins < CheckedVal) {
										message.channel.send('You do not have enough LoliCoins for this Gamble', {
											reply: message.member
										})
									}
								}
							})
						}
					}

					if (lowerCaseCommand === 'buytitle') {
						var Val = args.join(" ")
						var Price = 5000
						Val = Val.toString()
						var Fin = "" + Val.toString() + ""
						sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
							if (row.LoliCoins >= Price) {
								sql.run(`UPDATE economies SET Title = ${"'" + Fin + "'"} WHERE userId = ${message.author.id}`);
								var ReturnVal = Math.floor((row.LoliCoins - Price))
								sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
								message.channel.send('Set your title to: ' + Val.toString(), {
									reply: message.member
								});
							} else {
								if (row.LoliCoins < Price) {
									message.channel.send('You do not have enough LoliCoins to Purchase a Title.', {
										reply: message.member
									})
								}
							}
						})
					}

					if (lowerCaseCommand === 'lottery') {
						let TotalTickets = 0 // TotalTickets
						let PotAmt = 0
						let TicketCost = LottoTicketPrice
						let Multiplier = 1.5
						sql.get(`SELECT * FROM lottery WHERE guildId ='${message.guild.id}'`).then(row => {
							sql.get(`SELECT * FROM lottotimes WHERE guildId ='${message.guild.id}'`).then(row2 => {
								if (Number(row2.TimeAmt) > Number(new Date()) == true) {
									//Lottery is currently Active
									var Hours = Math.floor((((Number(row2.TimeAmt) - Number(new Date())) / 1000) / 60) / 60);
									var Minutes = Math.floor(((Number(row2.TimeAmt) - Number(new Date())) / 1000) / 60);
									var Seconds = Math.floor((Number(row2.TimeAmt) - Number(new Date())) / 1000);
									Seconds = Seconds % 60
									Minutes = Minutes % 60
									Hours = Hours % 24
									var users = [];
									var ticketAmounts = [];
									sql.all(`SELECT * FROM lottery WHERE guildId ='${message.guild.id}'`).then(rows => {
										for (var i = 0; i < rows.length; ++i) {
											var nextUser = rows[i].userId
											users[i] = nextUser;
										}
										rows.map(r => {
											TotalTickets = TotalTickets + r.numTickets
										})
										if (users.length != 1) {
											message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
												"Loli Bot",
												'Lottery Info', [{
													name: 'Pot:',
													value: ((TotalTickets * TicketCost) * Multiplier) || 0
												}, {
													name: 'Total Tickets Bought:',
													value: TotalTickets || 0
												}, {
													name: 'Time until Lottery Finishes:',
													value: Hours + ' Hours, ' + Minutes + ' Minutes, ' + Seconds + ' Seconds.'
												}]
											))
										} else {
											message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
												"Loli Bot",
												'Lottery Info', [{
													name: 'Pot:',
													value: ((TotalTickets * TicketCost)) || 0
												}, {
													name: 'Total Tickets Bought:',
													value: TotalTickets || 0
												}, {
													name: 'Time until Lottery Finishes:',
													value: Hours + ' Hours, ' + Minutes + ' Minutes, ' + Seconds + ' Seconds.'
												}]
											))
										}
									})
								} else {
									if (Number(row2.TimeAmt) > Number(new Date()) == false) {
										if (Number(row2.TimeAmt) == 0) {
											//Hasnt had previous Lottery
											sql.run(`UPDATE lottotimes SET TimeAmt = ${Number(new Date(new Date().getTime() + (60 * 60 * 1000)))} WHERE guildId = ${message.guild.id}`);
											return message.channel.send('Try Again!')
										}
										sql.all(`SELECT * FROM lottery WHERE guildId ='${message.guild.id}'`).then(rows => {
											rows.map(r => {
												TotalTickets = TotalTickets + r.numTickets
											})
										})

										//Choose winner and restart Lottery
										function choseWinner(ticketArray) {
											var total = 0;
											for (var i = 0; i < ticketArray.length; ++i) {
												total += ticketArray[i];
											}
											var ticketNum = Math.floor(Math.random() * total);
											var currentNum = 0;
											for (var i = 0; i < ticketArray.length; ++i) {
												currentNum += ticketArray[i];
												if (ticketNum < currentNum) {
													return i;
												}
											}
										}

										sql.all(`SELECT * FROM lottery WHERE guildId=${message.guild.id}`).then(rows => {
											var users = [];
											var ticketAmounts = [];
											for (var i = 0; i < rows.length; ++i) {
												var nextUser = rows[i].userId
												var nextTicketAmount = rows[i].numTickets;
												users[i] = nextUser;
												ticketAmounts[i] = nextTicketAmount;
											}

											var winnerIndex = choseWinner(ticketAmounts);
											if (winnerIndex != null && winnerIndex != 'undefined') {
												if (users.length != 1) {
													var winner = bot.users.get(users[winnerIndex]);

													message.channel.send('Congratulations to <@' + winner.id + '> who won the Lottery! There were a Total of ' + TotalTickets + ' Ticket(s) Sold.')
													sql.get(`SELECT * FROM economies WHERE userId ='${winner.id}'`).then(row => {
														winner.send('Congratulations! You won the Lottery of the Server: ' + message.guild.name + '. The Pot was:' + ((TotalTickets * TicketCost) * Multiplier))
														let ReturnVal = 0
														ReturnVal = (row.LoliCoins + ((TotalTickets * TicketCost) * Multiplier))
														sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${winner.id}`);
													})
												} else {
													var winner = bot.users.get(users[winnerIndex]);

													message.channel.send('<@' + winner.id + '> was the only one to enter the Lottery. There were a Total of ' + TotalTickets + ' Ticket(s) Sold.')
													sql.get(`SELECT * FROM economies WHERE userId ='${winner.id}'`).then(row => {
														winner.send('Congratulations! You won the Lottery of the Server: ' + message.guild.name + '. The Pot was:' + ((TotalTickets * TicketCost)))
														let ReturnVal = 0
														ReturnVal = (row.LoliCoins + ((TotalTickets * TicketCost)))
														sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${winner.id}`);
													})
												}
											} else {
												message.channel.send('Nobody won the Lottery!')
											}


											// Display Winner and do Payout

											// Lottery available again
											sql.run(`UPDATE lottotimes SET TimeAmt = ${Number(new Date(new Date().getTime() + (60 * 60 * 1000)))} WHERE guildId = ${message.guild.id}`);
											sql.all(`SELECT * FROM lottery WHERE guildId ='${message.guild.id}'`).then(rows => {
												rows.map(r => {
													sql.run(`UPDATE lottery SET guildId = 'None' WHERE userId = ${r.userId}`);
													sql.run(`UPDATE lottery SET numTickets = 0 WHERE userId = ${r.userId}`);
												})
											})
										}).catch(err => {
											console.log('Lottery Error:')
											console.log(err)
											//an error occured, oh noes
										});
									}
								}
							})
						})
					}

					if (lowerCaseCommand === 'mytickets') {
						sql.get(`SELECT * FROM lottery WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								sql.run('INSERT INTO lottery (userId, numTickets, guildId) VALUES (?, ?, ?)', [message.author.id, 0, 'None']);
								return message.channel.send('Try Again!')
							} else {
								message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
									"Loli Bot",
									"Ticket info", [{
										name: 'Your Ticket(s):',
										value: row.numTickets || 0
									}, {
										name: 'Ticket Price:',
										value: LottoTicketPrice + ' LoliCoins'
									}]
								))
							}
						})
					}

					if (lowerCaseCommand === 'buytickets') {
						sql.get(`SELECT * FROM lottery WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								sql.run('INSERT INTO lottery (userId, numTickets, guildId) VALUES (?, ?, ?)', [message.author.id, 0, 'None']);
							}
						})
						var Val = message.content.split(" ").slice(1);
						var CheckedVal = parseInt(Val)
						CheckedVal = Math.floor(CheckedVal)

						var CostOfTicket = LottoTicketPrice
						var FinishedPrice = 0
						//If the Ticket Amount is more than 0
						if (CheckedVal > 0) {
							FinishedPrice = (CheckedVal * CostOfTicket)
							sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
								if (row.LoliCoins >= FinishedPrice) {
									sql.get(`SELECT * FROM lottery WHERE userId ='${message.author.id}'`).then(row2 => {
										if (row2.guildId != 'None') {
											if (row2.guildId == message.guild.id) {
												var ReturnTickets = Math.floor((row2.numTickets + CheckedVal))
												sql.run(`UPDATE lottery SET numTickets = ${ReturnTickets} WHERE userId = ${message.author.id}`);
												sql.run(`UPDATE lottery SET guildId = ${message.guild.id} WHERE userId = ${message.author.id}`);
												var ReturnVal = Math.floor((row.LoliCoins - FinishedPrice))
												sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
												return message.channel.send('Purchased ' + CheckedVal + ' Ticket(s) for ' + FinishedPrice + ' LoliCoins!')
											} else {
												return message.channel.send('You Have already Purchased Tickets in another Server!')
											}
										} else {
											var ReturnTickets = Math.floor((row2.numTickets + CheckedVal))
											sql.run(`UPDATE lottery SET numTickets = ${ReturnTickets} WHERE userId = ${message.author.id}`);
											sql.run(`UPDATE lottery SET guildId = ${message.guild.id} WHERE userId = ${message.author.id}`);
											var ReturnVal = Math.floor((row.LoliCoins - FinishedPrice))
											sql.run(`UPDATE economies SET LoliCoins = ${ReturnVal} WHERE userId = ${message.author.id}`);
											return message.channel.send('Purchased ' + CheckedVal + ' Ticket(s) for ' + FinishedPrice + ' LoliCoins!')
										}
									})
								} else {
									if (row.LoliCoins < FinishedPrice) {
										message.channel.send('You do not have enough LoliCoins to Purchase that many Ticket(s).', {
											reply: message.member
										})
									}
								}
							})
						} else {
							return message.channel.send('Please Specify an Amount of Ticket(s) Higher than 0')
						}
					}

					if (lowerCaseCommand === 'achievementinfo') {
						message.member.send(createEmbed(message.guild.me.displayHexColor, {},
							"Loli Bot",
							"Displaying Achievement Info", [{
								name: 'Regular Achievements:',
								value: ":wave: - Free Starter Achievement\n:thumbsup: - Get 100 Experience (Send 100 Messsages)\n:ok_hand: - Get 500 Experience (Send 500 Messsages)\n:smile: - Get 1000 Experience (Send 1000 Messsages)"
							}, {
								name: 'Unobtainable Achievements:',
								value: ":smiling_imp: - Loli Bot Creator Achievement\n:sparkles: - Help Develop Loli Bot"
							}, {
								name: 'Money Achievements:',
								value: ":heart: - Sharing is Caring\n:money_mouth: - Get 5000 LoliCoins\n:moneybag: - Get 20000 LoliCoins"
							}, {
								name: 'Special Achievements:',
								value: ":dove: - User Has been through a Data Reset\n:diamond_shape_with_a_dot_inside: - Get this Achievement by Donating on Patreon\n:poop: - Anyone with this has abused Loli Bot"
							}, {
								name: 'Fun Achievements:',
								value: ":frog: - Here come\n:imp: - This one's Fun\n:zzz: - Shh, Sleeping\n:lemon: - When Life gives you Lemons\n:eggplant: - Special ASCII Character\n:skull: - Kill your first person\n:skull_crossbones: - Holy geez you killed a lot of people"
							}, ]
						))
						message.channel.send("Achievement Info has been DM'ed to you!");
					}

					if (lowerCaseCommand === 'seteval') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							}

							if (row.Set == 1) {
								let member = message.guild.member(message.mentions.users.first());
								if (!member) {
									message.channel.send('That user does not seem valid.', {
										reply: message.member
									})
								} else {
									sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
										if (!crow) {
											return message.channel.send('This user has not consented with ' + prefix + 'consent')
										}
									})
									let Perm = parseInt(args[1])
									if (Perm == null || Perm == 'undefined') {
										return message.channel.send('Incorrect Input Type')
									}
									sql.run(`UPDATE permissions SET Eval = ${Perm} WHERE userId = ${member.user.id}`)
									message.channel.send('Updated ' + member.user.username + "'s Eval Perm to: " + Perm)
								}
							} else {
								return message.channel.send('Incorrect Permissions: Set ' + row.Set + ', Required: Set 1')
							}
						})
					}

					if (lowerCaseCommand === 'sudo') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							}

							if (row.Set == 1) {
								function clean(text) {
									if (typeof(text) === "string")
										return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
									else
										return text;
								}

								try {
									var code = args.join(" ");
									var evaled = eval('require("child_process").execSync("sudo ' + code + '")');

									if (typeof evaled == 'buffer')
										evaled = evaled.toString()

									if (typeof evaled !== "string")
										evaled = require("util").inspect(evaled);

									var CleanCode = clean(evaled)

									message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
										"Loli Bot",
										"Sudo", [{
											name: '**INPUT** :gear: ',
											value: `\ \`\`\`js\n${code}\n\`\`\``
										}, {
											name: '**OUTPUT** :white_check_mark: ',
											value: `\ \`\`\`js\n${CleanCode}\n\`\`\``
										}]
									))
								} catch (err) {
									message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
										"Loli Bot",
										"Sudo", [{
											name: '**INPUT** :gear: ',
											value: `\ \`\`\`js\n${code}\n\`\`\``
										}, {
											name: '**ERROR** :x: :anger: ',
											value: `\ \`\`\`js\n${clean(err)}\n\`\`\``
										}]
									))
								}
							} else {
								return message.channel.send('Incorrect Permissions: Set ' + row.Set + ', Required: Set 1')
							}
						})
					}


					if (lowerCaseCommand === 'checkeval') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							}

							if (row.Set == 1) {
								let member = message.guild.member(message.mentions.users.first());
								if (!member) {
									message.channel.send('That user does not seem valid.', {
										reply: message.member
									})
								} else {
									sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
										if (!crow) {
											return message.channel.send('This user has not consented with ' + prefix + 'consent')
										}
									})
									sql.get(`SELECT * FROM permissions WHERE userId ='${member.user.id}'`).then(row2 => {
										if (!row2) {
											if (message.author.id == Config.OwnerId) {
												sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [member.user.id, 1, 2]);
												return message.channel.send('Try Again!')
											} else {
												sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [member.user.id, 0, 0]);
												return message.channel.send('Try Again!')
											}
										}
										message.channel.send(member.user.username + "'s Eval Perm: " + row2.Eval)
									})
								}
							} else {
								return message.channel.send('Incorrect Permissions: Set ' + row.Set + ', Required: Set 1')
							}
						})
					}

					if (lowerCaseCommand === 'eval') {
						sql.get(`SELECT * FROM permissions WHERE userId ='${message.author.id}'`).then(row => {
							if (!row) {
								if (message.author.id == Config.OwnerId) {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 1, 2]);
									return message.channel.send('Try Again!')
								} else {
									sql.run('INSERT INTO permissions (`userId`, `Set`, `Eval`) VALUES (?, ?, ?)', [message.author.id, 0, 0]);
									return message.channel.send('Try Again!')
								}
							}
							if (row.Eval == 2) {
								function clean(text) {
									if (typeof(text) === "string")
										return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
									else
										return text;
								}

								try {
									var code = args.join(" ");
									var evaled = eval(code);

									if (typeof evaled !== "string")
										evaled = require("util").inspect(evaled);

									var CleanCode = clean(evaled)

									message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
										"Loli Bot",
										"Eval", [{
											name: '**INPUT** :gear: ',
											value: `\ \`\`\`js\n${code}\n\`\`\``
										}, {
											name: '**OUTPUT** :white_check_mark: ',
											value: `\ \`\`\`js\n${CleanCode}\n\`\`\``
										}]
									))
								} catch (err) {
									if (code.includes('throw') && !code.match(/Error|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|Warning/)) {
										message.channel.send(createEmbed('#FECA33', {},
											"Loli Bot",
											"Eval", [{
												name: '**INPUT** :gear: ',
												value: `\ \`\`\`js\n${code}\n\`\`\``
											}, {
												name: 'THROWBACK :leftwards_arrow_with_hook:',
												value: `\ \`\`\`js\n${clean(err)}\n\`\`\``
											}]
										))
									} else {
										message.channel.send(createEmbed('#FF0000', {},
											"Loli Bot",
											"Eval", [{
												name: '**INPUT** :gear: ',
												value: `\ \`\`\`js\n${code}\n\`\`\``
											}, {
												name: '**ERROR** :x: :anger: ',
												value: `\ \`\`\`js\n${clean(err)}\n\`\`\``
											}]
										))
									}
								}
							} else {
								if (row.Eval == 1) {
									function clean(text) {
										if (typeof(text) === "string")
											return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
										else
											return text;
									}

									try {
										var code = args.join(" ");
										if (code.indexOf('execSync') != -1) {
											throw 'ReferenceError: execSync is not defined'
										}
										if (code.indexOf('.leave') != -1) {
											throw 'ReferenceError: leave is not defined'
										}
										if (code.indexOf('.login') != -1) {
											throw 'ReferenceError: login is not defined'
										}
										let Blacklist = [];
										if (code.indexOf('GLOBAL') != -1) {
											throw 'ReferenceError: GLOBAL is not defined'
										}
										if (code.indexOf('global') != -1) {
											throw 'ReferenceError: global is not defined'
										}
										let require = null;
										let process = null
										let SandboxedEval = function(Txt) {
											return Txt
										}
										if (code.indexOf('eval') != -1) {
											SandboxedEval(code)
										}
										let Buffer = function() {
											return 'Null'
										}
										if (code.indexOf('constructor') != -1) {
											throw "PermissionError: To use constructor You require Eval 2, You have Eval " + row.Eval + "."
										}
										let sql = function() {
											return 'Null'
										}
										let Function = class Function {
											constructor(height, width) {
												this.height = height;
												this.width = width;
											}
										};

										let bot = {};
										bot.token = 'Null';

										var evaled = eval(code);

										if (typeof evaled !== "string")
											evaled = require("util").inspect(evaled);

										var CleanCode = clean(evaled)

										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Eval", [{
												name: '**INPUT** :gear: ',
												value: `\ \`\`\`js\n${code}\n\`\`\``
											}, {
												name: '**OUTPUT** :white_check_mark: ',
												value: `\ \`\`\`js\n${CleanCode}\n\`\`\``
											}]
										))
									} catch (err) {
										if (clean(err) == 'TypeError: require is not a function') return
										message.channel.send(createEmbed(message.guild.me.displayHexColor, {},
											"Loli Bot",
											"Eval", [{
												name: '**INPUT** :gear: ',
												value: `\ \`\`\`js\n${code}\n\`\`\``
											}, {
												name: '**ERROR** :x: :anger: ',
												value: `\ \`\`\`js\n${clean(err)}\n\`\`\``
											}]
										))
									}
								} else {
									if (row.Eval < 1) {
										message.channel.send('Incorrect permissions for Eval, Required Permissions: Eval 1, You have: Eval ' + row.Eval, {
											reply: message.member
										})
										return;
									}
								}
							}
						})
					}
					if (lowerCaseCommand === 'leave') {
						if (message.member.hasPermission('voiceMoveMembers')) {
							var voiceChannel = message.member.voiceChannel
							if (voiceChannel) {
								voiceChannel.leave()
							} else {
								message.channel.send('Not in your Voice Channel!', {
									reply: message.member
								})
							}
						} else {
							message.channel.send('You do not have the Permission to use this Command!', {
								reply: message.member
							})
						}
					}
					if (lowerCaseCommand === 'donator') {
						if (message.guild.id == '303953298753454080') {
							let AllowedRole = message.guild.roles.find('name', 'Donators');
							if (message.member.roles.has(AllowedRole.id)) {
								sql.get(`SELECT * FROM Data WHERE userId = ${message.author.id}`).then(row => {
									if (!row) {
										MakeData(message.author.id)
										return // message.channel.send('Try again!');
									}
									if (row.Donator == 'false') {
										AddDonator(message, message.author.id)
									} else {
										message.channel.send('You already recieved your Donator Perks!')
									}
								})
							} else {
								message.channel.send('You are not a Donator!', {
									reply: message.member
								})
							}
						}
					}
					if (lowerCaseCommand === 'roll') {
						let roll = Math.floor(Math.random() * 6) + 1;
						message.channel.send('You rolled a ' + roll, {
							reply: message.member
						});
					}
					if (lowerCaseCommand === 'stats') {
						UtilCmds.stats(createEmbed, message, os, bot, Discord)
					}
					if (lowerCaseCommand === 'shards') {
						msg.channel.send(createEmbed(message.guild.me.displayHexColor, {}, "Loli Bot", "Shards", [{
							name: 'Current Shard / Total Shard(s)',
							value: (bot.options.shardId + 1) + ' / ' + bot.options.shardCount
						}, {
							name: 'Shards to Create on Startup',
							value: 'Auto: ' + bot.options.shardCount
						}, {
							name: 'Shard Lifetime',
							value: '2 Hours'
						}]))
					}
					if (lowerCaseCommand === 'hello') {
						let user = message.author.username;
						message.channel.send(`Hi <@${ message.author.id }>!`)
					}
					if (lowerCaseCommand === 'poke') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> *Pokes* :point_right: ${ member }`);
							let Ind = Math.floor(Math.random() * Pokings.length)
							DoImage(PokingsU[Ind], message, Pokings, Ind)
						}
					}
					if (lowerCaseCommand === 'shank') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> *Shanks* :dagger: ${ member }`);
							let Ind = Math.floor(Math.random() * Shanks.length)
							DoImage(ShanksU[Ind], message, Shanks, Ind)
						}
					}
					if (lowerCaseCommand === 'meow') {
						message.channel.send("*Meows* :cat:", {
							reply: message.member
						})
					}
					/*	if (lowerCaseCommand === 'blackjack') {
								BlackJack.BlackJack(createEmbed, sql, message)
							}*/
					if (lowerCaseCommand === 'killg') {
						KillG.KillG(createEmbed, bot, message, sql)
					}
					if (lowerCaseCommand === 'purr') {
						message.channel.send("*Purrs* :smile_cat:", {
							reply: message.member
						})
					}
					if (lowerCaseCommand === 'sit') {
						message.channel.send("*Sits* :cat:", {
							reply: message.member
						})
					}
					if (lowerCaseCommand === 'urban') {
						let ToLookUp = args.join(' ');
						let filter = m => m.author.id === message.author.id;
						let Selection = null;
						message.channel.send('Pick one: Random or First');
						message.channel.awaitMessages(filter, {
								max: 1
							})
							.then(collected => {
								Selection = collected.first();
								if (Selection.toString().toLowerCase() == 'random') {
									urban.random(ToLookUp).then(Definition => {
										msg.channel.send(createEmbed(msg.guild.me.displayHexColor, {}, "Loli Bot", "Urban Dictionary", [{
											name: 'Id: ',
											value: Definition.id
										}, {
											name: 'Word:',
											value: Definition.word
										}, {
											name: 'Definition: ',
											value: Definition.definition
										}, {
											name: 'Example: ',
											value: Definition.example
										}, {
											name: 'Url: ',
											value: Definition.urbanURL
										}, {
											name: 'Author: ',
											value: Definition.author
										}, {
											name: ':thumbsup: ' + Definition.thumbsUp,
											value: ':thumbsdown: *' + Definition.thumbsDown + '*'
										}, {
											name: 'Tags: ',
											value: `${Definition.tags.join(', ')}`
										}]))
									})
								} else {
									if (Selection.toString().toLowerCase() == 'first') {
										urban(ToLookUp).then(Definition => {
											msg.channel.send(createEmbed(msg.guild.me.displayHexColor, {}, "Loli Bot", "Urban Dictionary", [{
												name: 'Id: ',
												value: Definition.id
											}, {
												name: 'Word:',
												value: Definition.word
											}, {
												name: 'Definition: ',
												value: Definition.definition
											}, {
												name: 'Example: ',
												value: Definition.example
											}, {
												name: 'Url: ',
												value: Definition.urbanURL
											}, {
												name: 'Author: ',
												value: Definition.author
											}, {
												name: ':thumbsup: ' + Definition.thumbsUp,
												value: ':thumbsdown: *' + Definition.thumbsDown + '*'
											}, {
												name: 'Tags: ',
												value: `${Definition.tags.join(', ')}`
											}]))
										})
									}
								}
							})
					}
					if (lowerCaseCommand === 'hug') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> *Hugs* :smiley_cat: ${ member }`);
							let Ind = Math.floor(Math.random() * Hugs.length)
							DoImage(HugsU[Ind], message, Hugs, Ind)
						}
					}
					if (lowerCaseCommand === 'fuck') {
						if (message.channel.name.indexOf('nsfw') != -1) {
							if (message.mentions.users.size === 0) {
								message.channel.send('Please mention a User!', {
									reply: message.member
								});
								return;
							}
							let member = message.guild.member(message.mentions.users.first());
							if (!member) {
								message.channel.send('That user does not seem valid.', {
									reply: message.member
								})
							} else {
								let user = message.author.username;
								message.channel.send(`<@${ message.author.id }> **Fucks** ${ member } :wink:`);
								let Ind = Math.floor(Math.random() * Fucks.length)
								DoImage(FucksU[Ind], message, Fucks, Ind)
							}
						} else {
							message.channel.send('Please do the Fuck command in a TextChannel that has "nsfw" in the name.')
						}
					}
					if (lowerCaseCommand === 'pat') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> *Pats* ${ member }`);
							let Ind = Math.floor(Math.random() * Pettings.length)
							DoImage(PettingsU[Ind], message, Pettings, Ind)
						}
					}
					if (lowerCaseCommand === 'lick') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> *Licks* :tongue: ${ member }`)
						}
					}
					if (lowerCaseCommand === 'kiss') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> :heart: *Kisses* :heart: :kissing_heart: ${ member }`);
							let Ind = Math.floor(Math.random() * Kisses.length)
							DoImage(KissesU[Ind], message, Kisses, Ind)
						}
					}
					if (lowerCaseCommand === 'cuddle') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> :heart: *Cuddles* with ${ member } :heart: :smile:`);
							let Ind = Math.floor(Math.random() * Cuddles.length)
							DoImage(CuddlesU[Ind], message, Cuddles, Ind)
						}
					}
					if (lowerCaseCommand === 'snuggle') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> :heart: *Snuggles* with ${ member } :heart: :smile:`);
							let Ind = Math.floor(Math.random() * Snuggles.length)
							DoImage(SnugglesU[Ind], message, Snuggles, Ind)
						}
					}
					if (lowerCaseCommand === 'smack') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> __Smacks__ :hand_splayed: ${ member }`);
							let Ind = Math.floor(Math.random() * Smackings.length)
							DoImage(SmackingsU[Ind], message, Smackings, Ind)
						}
					}
					if (lowerCaseCommand === 'spank') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> :heart: *Spanks* :raised_hands: ${ member }`);
							let Ind = Math.floor(Math.random() * Spanks.length)
							DoImage(SpanksU[Ind], message, Spanks, Ind)
						}
					}
					if (lowerCaseCommand === 'rep') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							sql.get(`SELECT * FROM consented WHERE userId ='${member.user.id}'`).then(crow => {
								if (!crow) {
									return message.channel.send('This user has not consented with ' + prefix + 'consent')
								}
							})
							try {
								sql.get(`SELECT * FROM Data WHERE userId = ${member.user.id}`).then(row => {
									let RepVal = JSON.parse(row.Data);
									let filter = m => m.author.id === message.author.id;
									let Selection = null;
									message.channel.send('Reputations to Pick: `Positive` or `Negative`');
									message.channel.awaitMessages(filter, {
											max: 1
										})
										.then(collected => {
											Selection = collected.first();
											if (Selection.toString().toLowerCase() == 'positive') {
												message.channel.send(VoteUp(member, RepVal.Reputations, message.author.id));
												setTimeout(function() {
													let Val = JSON.stringify(RepVal);
													sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.user.id}`)
												}, 2000)
											} else {
												if (Selection.toString().toLowerCase() == 'negative') {
													message.channel.send(VoteDown(member, RepVal.Reputations, message.author.id));
													setTimeout(function() {
														let Val = JSON.stringify(RepVal);
														sql.run(`UPDATE Data SET Data = '${Val}' WHERE userId = ${member.user.id}`)
													}, 2000)
												} else {
													message.channel.send('Did not pick one, Your choices are `Positive` or `Negative`.')
												}
											}
										})
								})
							} catch (err) {
								//console.log(err)
							}
						}
					}
				
					if (lowerCaseCommand === 'spankh') {
						if (message.mentions.users.size === 0) {
							message.channel.send('Please mention a User!', {
								reply: message.member
							});
							return;
						}
						let member = message.guild.member(message.mentions.users.first());
						if (!member) {
							message.channel.send('That user does not seem valid.', {
								reply: message.member
							})
						} else {
							let user = message.author.username;
							message.channel.send(`<@${ message.author.id }> :heart: *Spanks* :raised_hands: ${ member } Harder :hand_splayed: :raised_hands:`)
						}
					}
					if (lowerCaseCommand === 'credits') {
						UtilCmds.credits(createEmbed, message)
					}
					if (lowerCaseCommand === 'help') {
						let HelpEmbed = new Discord.RichEmbed()
						HelpEmbed.setTitle('Welcome to Loli Bot Help!')
						HelpEmbed.setColor(message.guild.me.displayHexColor)
						HelpEmbed.addField('Current Prefix:', prefix)
						HelpEmbed.addField('For Commands Please type:', prefix + "Commands or " + prefix + "Cmds")
						HelpEmbed.addField('Loli Bot Official Server:', 'https://discord.gg/jCXaY5n')
						HelpEmbed.addField('Still Require More Help?', 'Please contact '+Config.DiscordTag)
						message.channel.send('', {
							embed: HelpEmbed
						});
					}
					if (lowerCaseCommand === 'support') {
						message.channel.send("Thank you <3 https://www.patreon.com/AzumiKun");
					}

					if (lowerCaseCommand === 'wallpaper') {
						try {
							let Keyword = args.join(" ");
							let localimages;
							if (Keyword == null || Keyword == 'undefined') {
								Keyword = 'Anime'
							}
							randomAnimeWallpapers(Keyword)
								.then(images => {
									localimages = images;
									let rand = localimages[Math.floor(Math.random() * localimages.length)];
									message.channel.send(rand.full)
								})
						} catch (err) {
							console.log(err)
						}
					}
					if (lowerCaseCommand === 'say') {
						AdminCmds.say(sql, message, args.join(" "))
					}
					if (lowerCaseCommand === 'kick') {
						AdminCmds.kick(message)
					}
					if (lowerCaseCommand === 'mute') {
						AdminCmds.mute(message)
					}
					if (lowerCaseCommand === 'unmute') {
						AdminCmds.unmute(message)
					}
					if (lowerCaseCommand === 'ban') {
						AdminCmds.ban(message)
					}
					if (lowerCaseCommand === 'prune') {
						AdminCmds.prune(sql, args, message)
					}
					if (lowerCaseCommand === 'm00sik') {
						let rand = VideoLinks[Math.floor(Math.random() * VideoLinks.length)];
						message.channel.send(rand)
					}
					if (lowerCaseCommand === '8ball') {
						let rand = EightBallAnswers[Math.floor(Math.random() * EightBallAnswers.length)];
						message.channel.send(":8ball: " + message.author.username + ", your question has been answered `" + rand + "`")
					}
					if (lowerCaseCommand === 'talk!') {
						let rand = RandomPhrases[Math.floor(Math.random() * RandomPhrases.length)];
						message.channel.send(rand)
					}
				}
			})
		})
		// log our bot in
		bot.login(Config.Token); //Loli Token
	}
}

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
