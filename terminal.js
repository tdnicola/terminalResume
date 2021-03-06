/*! terminal.js v2.0 | (c) 2014 Erik Österberg | https://github.com/eosterberg/terminaljs */

var Terminal = (function () {
	// PROMPT_TYPE
	var PROMPT_INPUT = 1, PROMPT_PASSWORD = 2, PROMPT_CONFIRM = 3

	var fireCursorInterval = function (inputField, terminalObj) {
		var cursor = terminalObj._cursor
		setTimeout(function () {
			if (inputField.parentElement && terminalObj._shouldBlinkCursor) {
				cursor.style.visibility = cursor.style.visibility === 'visible' ? 'hidden' : 'visible'
				fireCursorInterval(inputField, terminalObj)
			} else {
				cursor.style.visibility = 'visible'
			}
		}, 500)
	}

	var firstPrompt = true;
	promptInput = function (terminalObj, message, PROMPT_TYPE, callback) {
		var shouldDisplayInput = (PROMPT_TYPE === PROMPT_INPUT)
		var inputField = document.createElement('input')

		inputField.style.zIndex = '-100'
		inputField.style.outline = 'none'
		inputField.style.border = 'none'
		inputField.style.opacity = '0'
		inputField.style.fontSize = '0.2em'

		const cmd = document.getElementById('cmdLine')

		if (cmd.classList.contains('after') === false) {
			terminalObj._inputLine.textContent = '~ '
		} else {
			terminalObj._inputLine.textContent = '~ projects '
		}

		terminalObj._input.style.display = 'block'
		terminalObj.html.appendChild(inputField)
		fireCursorInterval(inputField, terminalObj)

		if (message.length) terminalObj.print(PROMPT_TYPE === PROMPT_CONFIRM ? message + ' (y/n)' : message)

		inputField.onblur = function () {
			terminalObj._cursor.style.display = 'none'
		}

		inputField.onfocus = function () {
			inputField.value = terminalObj._inputLine.textContent
			terminalObj._cursor.style.display = 'inline'
		}

		terminalObj.html.onclick = function () {
			inputField.focus()
		}

		inputField.onkeydown = function (e) {
			if (e.which === 37 || e.which === 39 || e.which === 38 || e.which === 40 || e.which === 9) {
				e.preventDefault()
			} else if (shouldDisplayInput && e.which !== 13) {
				setTimeout(function () {
					terminalObj._inputLine.textContent = inputField.value
				}, 1)
			}
		}
		inputField.onkeyup = function (e) {
			if (PROMPT_TYPE === PROMPT_CONFIRM || e.which === 13) {
				terminalObj._input.style.display = 'none'
				var inputValue = inputField.value
				if (shouldDisplayInput) terminalObj.print(inputValue)
				terminalObj.html.removeChild(inputField)
				if (typeof(callback) === 'function') {
					if (PROMPT_TYPE === PROMPT_CONFIRM) {
						callback(inputValue.toUpperCase()[0] === 'Y' ? true : false)
					} else callback(inputValue)
				}
			}
		}
		if (firstPrompt) {
			firstPrompt = false
			setTimeout(function () { inputField.focus()	}, 50)
		} else {
			inputField.focus()
		}
	}

	var terminalBeep

	var TerminalConstructor = function (id) {
		if (!terminalBeep) {
			terminalBeep = document.createElement('audio')
			var source = '<source src="http://www.erikosterberg.com/terminaljs/beep.'
			terminalBeep.innerHTML = source + 'mp3" type="audio/mpeg">' + source + 'ogg" type="audio/ogg">'
			terminalBeep.volume = 0.05
		}

		this.html = document.createElement('div')
		this.html.className = 'Terminal'
		if (typeof(id) === 'string') { this.html.id = id }

		this._innerWindow = document.createElement('div')
		this._output = document.createElement('p')
		this._output.className= 'results'
		this._inputLine = document.createElement('span') //the span element where the users input is put
		this._inputLine.id= 'cmdLine' //added class of cmdline for changing directories below.
		this._cursor = document.createElement('span')
		this._input = document.createElement('p') //the full element administering the user input, including cursor

		this._shouldBlinkCursor = true

		this.beep = function () {
			terminalBeep.load()
			terminalBeep.play()
		}

		this.print = function (message) {
			var newLine = document.createElement('div')
			newLine.textContent = message
			newLine.className = message.replace(/[^a-zA-Z0-9]/g, " ") //remove all special characters from classname for styling
			this._output.appendChild(newLine)
		}

		this.input = function (message, callback) {
			promptInput(this, message, PROMPT_INPUT, callback)
		}

		this.password = function (message, callback) {
			promptInput(this, message, PROMPT_PASSWORD, callback)
		}

		this.confirm = function (message, callback) {
			promptInput(this, message, PROMPT_CONFIRM, callback)
		}

		this.clear = function () {
			this._output.innerHTML = ''
		}

		this.sleep = function (milliseconds, callback) {
			setTimeout(callback, milliseconds)
		}

		this.setTextSize = function (size) {
			this._output.style.fontSize = size
			this._input.style.fontSize = size
		}

		this.setTextColor = function (col) {
			this.html.style.color = col
			this._cursor.style.background = col
		}

		this.setBackgroundColor = function (col) {
			this.html.style.background = col
		}

		this.setWidth = function (width) {
			this.html.style.width = width
		}

		this.setHeight = function (height) {
			this.html.style.height = height
		}

		this.blinkingCursor = function (bool) {
			bool = bool.toString().toUpperCase()
			this._shouldBlinkCursor = (bool === 'TRUE' || bool === '1' || bool === 'YES')
		}

		this._input.appendChild(this._inputLine)
		this._input.appendChild(this._cursor)
		this._innerWindow.appendChild(this._output)
		this._innerWindow.appendChild(this._input)
		this.html.appendChild(this._innerWindow)

		this.setTextColor('white')
		this.setTextSize('.8em')

		this.setWidth('65%')
		this.setHeight('500px')

		this.html.style.fontFamily = 'Monaco, Courier'
		this.html.style.margin = '0 auto'
		this._innerWindow.style.padding = '10px'
		this._input.style.margin = '0'
		this._output.style.margin = '0'
		this._cursor.style.background = 'white'
		this._cursor.innerHTML = 'C' //put something in the cursor..
		this._cursor.style.display = 'none' //then hide it
		this._input.style.display = 'none'
	}

	return TerminalConstructor
}())



var t1 = new Terminal()
	
			t1.setBackgroundColor('#1E1E1E')
			document.body.appendChild(t1.html)
	
			const descriptions = [
					{
						name: 'aboutMe',
						info: [
							'I am a front-end web developer with a skill for building relationships. I enjoy coding in JavaScript, am experienced in using React, and have recently been learning Python and Gatsby.',
							'Having worked closely with companies and business owners for the majority of my career, I bring a uniquely user-centered perspective to every project. I am experienced in collaborating remotely in a team environment as well as working independently.',
							'In addition to programming, I enjoy practing Brazillian Jiu Jitsu, weight lifting, pc gaming, and experimenting with home automation using smart home tech.',
						],
						file: 'aboutMe: ASCII text',

						cmdDetails: '-r--r--r--  1  user   user  Jan 1	2020 aboutMe',
					},
					{
						name: 'projects',
						cmdDetails: '-r--r--r--  1  user   user  Jan 1	2020 projects',
						info: [
							{
								projectName: 'healthyPotatoesApp',
								
								github: 'https://github.com/tdnicola/healthyPotatoes_movieApp',
								site: 'https://healthypotatoes.herokuapp.com/',
								
								description: 'MERN stack (MongoDB, Express, React, and Node.js) using password hashing for CRUD methods. Pulls movie/director information from MongoDB API. Allows you to change user information as well as favorite/remove movies once logged in. Hosted on Heroku.',
								file: 'healthyPotatoesApp: ASCII text',
								cmdDetails: '-r--r--r--  1  user   user  Jan 1	2020 healthyPotatoesApp',
							},
							{
								projectName: 'discordBot',
								github: 'https://github.com/tdnicola/discord_insult-bot',
								description: 'Discord bot that when given commands will: insult friends, praise friends, random gif, or search for a gif through various APIs. Uses OOP to query/update postgreSQL database for stats. Built with Node.js.',								
								file: 'discordBot: ASCII text',
								cmdDetails: '-r--r--r--  1  user   user  Jan 1	2020 discordBot',
							},
							{
								projectName: 'meetupApp',
							
								github: 'https://github.com/tdnicola/meetup',
								site: 'https://tdnicola.github.io/meetup/',
								
								description: 'Serverless PWA built with React using TDD/BDD/End-to-End testing.	Application uses the meetup API and AWS. Data visualization where applicable. Have to log into meetup to test. test email/pw email: kja76448@bcaoo.com	pw: testing',
								file: 'meetupApp: ASCII text',
								cmdDetails: '-r--r--r--  1  user   user  Jan 1	2020 meetupApp',
							},
							
						],
						file: 'projects: directory',
						
					},
					{
						name: 'contact',
						info: [
							{
								website: 'https://www.tonynicola.com',
								github: 'https://www.github.com/tdnicola',
								linkedin: 'https://www.linkedin.com/in/tony-nicola'
							},
						],
						cmdDetails: '-r--r--r--  1  user   user  Jan 1	2020 contact',
						file: 'contact: ASCII text',
						
					},
					{
						name: '.hidden',
						info: [],
						cmdDetails: '-r--r--r--  1  admin   admin  Jan 1		2001 hidden',
						file: '.hidden: ASCII text',

					}
					
				]

				var projectFinder = (search) => { 
					return descriptions[1].info.filter(o =>
						Object.keys(o).some(k => 
							o[k].includes(search)
						)
					)[0]
				}

				var objectFinder = (search) => {
					return descriptions.filter(o => 
						Object.keys(o).some(k =>
							o[k].includes(search)
							)
						)[0]
				}
				
				

			const terminal = () => {
				t1.input('', function(input) {
					if (input == '~ ls') {
						descriptions.map((description) => {
							if (description.name == '.hidden') {
								return
							} else {
								t1.print(description.name)
							}
						})
						terminal()
					} else if (input == '~ ls -a'){
						descriptions.map((description) => {
							t1.print(description.name)
						})

						terminal()	
					} else if (input =='~ ls -l') {
						descriptions.map((description) => {
							if (description.name == '.hidden') {
								return
							} else {
								t1.print(description.cmdDetails)
							}
						})
						terminal()
					} else if (input =='~ ls -la') {
						descriptions.map((description) => {
							t1.print(description.cmdDetails)
						})
						terminal()

					} else if (input.startsWith('~ cat ') == true) {
						const inputArray = input.split(' ')
						const searchTerm = inputArray.splice(2, 1) + ''
						conditions = descriptions.map(project => {return project.name});

						if (conditions.some(el => searchTerm.includes(el)) == true) {
							if(searchTerm == 'contact') {
							
								var results = document.getElementsByClassName('results')
								var aTag = document.createElement('a');
								var bTag = document.createElement('a');
								var cTag = document.createElement('a');

								aTag.setAttribute('href',objectFinder(searchTerm).info[0].website);
								aTag.setAttribute('target', 'blank');
								aTag.innerText = "tonynicola.com";						
								bTag.setAttribute('href',objectFinder(searchTerm).info[0].github);
								bTag.setAttribute('target', 'blank');
								bTag.innerText = "github/tdnicola";
								cTag.setAttribute('href',objectFinder(searchTerm).info[0].linkedin);
								cTag.setAttribute('target', 'blank');
								cTag.innerText = "linkedin/tdnicola";

								results[0].appendChild(aTag);
								results[0].appendChild(document.createElement("br"));

								results[0].appendChild(bTag);
								results[0].appendChild(document.createElement("br"));

								results[0].appendChild(cTag);

								terminal()
							} else if (searchTerm == 'aboutMe'){
								try {
									objectFinder(searchTerm).info.map(x => t1.print(x))
									terminal()
								}
								catch (err){
									console.log(err);
									terminal()
								}
							} else if (searchTerm == 'projects'){
								t1.print('cat: projects: Is a directory')
							} else {
								var results = document.getElementsByClassName('results')

								var img = document.createElement('img')
								img.src = 'https://i.kym-cdn.com/entries/icons/original/000/021/807/ig9OoyenpxqdCQyABmOQBZDI0duHk2QZZmWg2Hxd4ro.jpg'
								results[0].appendChild(img)
								t1.print('you sly dog you...')

								terminal()
							}
						}
						terminal()
					
					} else if (input.startsWith('~ file ') == true ) {
						const inputArray = input.split(' ')
						const searchTerm = inputArray.splice(2, 1) + ''
						try {
							t1.print(objectFinder(searchTerm).file)
						
						} catch(err) {
							terminal()
							console.log(err);
						}
						terminal()

					} else if (input == '~ cd projects') {
						var cmd = document.getElementById('cmdLine')
						cmd.className = 'after'
						
						terminal()

					} else if (input == '~ projects cd') {
						var cmd = document.getElementById('cmdLine')
						cmd.classList.remove('after')
						terminal()

					} else if (input == '~ projects ls') {
						descriptions[1].info.map(project => {
							t1.print(project.projectName);
						})

						terminal()
					} else if (input == '~ projects ls -l' || input == '~ projects ls -la') {
						descriptions[1].info.map(project => {
							t1.print(project.cmdDetails);
						})

						terminal()
					} else if (input.startsWith('~ projects ') == true ) {
						const inputArray = input.split(' ')
						const searchTerm = inputArray.splice(3, 1) + ''
						const fileTerm = inputArray.splice(2,1) + ''
						conditions = descriptions[1].info.map(project => {return project.projectName}); //returning all projectNames
						
						if (conditions.some(el => searchTerm.includes(el)) == true) {
							if (fileTerm == 'cat') {
								try {
									t1.print(projectFinder(searchTerm).description)

									var results = document.getElementsByClassName('results')
									var aTag = document.createElement('a');
									var bTag = document.createElement('a');
			
									aTag.setAttribute('href',projectFinder(searchTerm).github);
									aTag.setAttribute('target', 'blank');
									aTag.innerText = "github link";						
									bTag.setAttribute('href',projectFinder(searchTerm).site);
									bTag.setAttribute('target', 'blank');
									bTag.innerText = "live code";
			
									results[0].appendChild(aTag);
									results[0].appendChild(document.createElement("br"));

									projectFinder(searchTerm).site ? results[0].appendChild(bTag) : console.log('no site');
									
								} catch(err) {
									terminal()
									console.log(err);
								}
								terminal()
							} else if (fileTerm == 'file') {
								try {
									t1.print(projectFinder(searchTerm).file)
								} catch(err) {
									terminal()
									console.log(err);
								}
								terminal()
							}
						} else {
							terminal()
						}
					} else if (input == '~ clear') {
						t1.clear()
						terminal()

					} else if (input.startsWith('~ touch ') == true) {
						const inputArray = input.split(' ')
						const searchTerm = inputArray.splice(2, 1) + ''

						descriptions.push({
							name: searchTerm,
							info: [],
							cmdDetails: '-rw-r--r--  1  user   user  Jan 1		2020 ' + searchTerm,
							file: searchTerm + ': ASCII text',
						})
						console.log(descriptions);
						terminal()
					}
					else { //nothing matches, returns the terminal
						terminal()
					}
				})
			}
terminal()
