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

		inputField.style.position = 'absolute'
		inputField.style.zIndex = '-100'
		inputField.style.outline = 'none'
		inputField.style.border = 'none'
		inputField.style.opacity = '0'
		inputField.style.fontSize = '0.2em'

		terminalObj._inputLine.textContent = '~ '
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
			newLine.className = message
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
		this.setTextSize('1em')

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
	
			const terminal =() => {
				t1.input('', function(input) {
					if (input == '~ ls') {
						t1.print('aboutMe');
						t1.print('projects');
						t1.print('contact');
						terminal()
					} else if (input == '~ cat aboutMe') {
						t1.print('  I am a front-end web developer with a skill for building relationships. I enjoy coding in JavaScript, am experienced in using React, and have recently been learning Python and Gatsby.');
						t1.print('  Having worked closely with companies and business owners for the majority of my career, I bring a uniquely user-centered perspective to every project. I am experienced in collaborating remotely in a team environment as well as working independently.');
						t1.print('  In addition to programming, I enjoy practing Brazillian Jiu Jitsu, weight lifting, pc gaming, and experimenting with home automation using smart home tech.');
						terminal()
					}  else if (input == '~ cat contact'){
						var results = document.getElementsByClassName('results')
						// var mydiv = document.getElementById("myDiv");
						var pTag = document.createElement('br');
						var aTag = document.createElement('a');
						var bTag = document.createElement('a');
						var cTag = document.createElement('a');
						aTag.setAttribute('href',"https://www.tonynicola.com");
						aTag.setAttribute('target', 'blank');
						aTag.innerText = "tonynicola.com";						
						bTag.setAttribute('href',"https://www.github.com/tdnicola");
						bTag.setAttribute('target', 'blank');
						bTag.innerText = "github/tdnicola";
						cTag.setAttribute('href',"https://www.linkedin.com/in/tony-nicola");
						cTag.setAttribute('target', 'blank');
						cTag.innerText = "linkedin/tdnicola";


						results[0].appendChild(aTag);
						results[0].appendChild(document.createElement("br"));

						results[0].appendChild(bTag);
						results[0].appendChild(document.createElement("br"));


						results[0].appendChild(cTag);

















						// // Create anchor element. 
						// var divElement = document.createElement('div')
						// var a = document.createElement('a');  
						
						// var anchorElement = divElement.appendChild(a)
						// var github = divElement.appendChild(a)
						// var linkedin = divElement.appendChild(a)
						// // Create the text node for anchor element. 
						// var websiteText = document.createTextNode("tonynicola.com"); 
						// var githubText = document.createTextNode("github.com/tdnicola"); 
						// var linkedInText = document.createTextNode("https://www.linkedin.com/in/tony-nicola"); 
						// // Append the text node to anchor element. 
						// anchorElement.appendChild(websiteText);  
						// var websiteLink = anchorElement.href = "https://tonynicola.com";  

						// var results = document.getElementsByClassName('results')
						// results[0].appendChild(githubText);  
						// results[0].appendChild(linkedInText);  
						// results[0].appendChild(websiteLink);  
						terminal()
					}
					else if (input == '~ clear') {
						t1.clear()
						terminal()
					}
					else {
						terminal()
					}
				})
			}
terminal()
