/**
 * The hangman game is contained within an Immediately Invoked Function Expression (IIFE).
 * It executes immediately after it is created, and allows namespacing of game code under the "Hangman" namespace.
 * This is a pre-es6 method of avoiding polution in the global namespace.
 *
 * @class Hangman
 * @namespace Hangman
 */
let Hangman = new(function() {

    this.words   = ['Empire', 'Jedi', 'DeathStar', 'Luke', 'Yoda', 'Sith'];
    this.word    = '';
    this.letters = [];
    this.guesses = [];
    this.misses  = 0;

    /**
     * Inititalizes the default game state.
     *
     * @function init
     * @namespace Hangman.init
     * @return {Void}
     */
    this.init = function() {
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.word    = this.words[Math.floor(Math.random() * this.words.length)];
        this.misses  = 0;
        this.guesses = [];

        this.populateContainer();
    };

    /**
     * Removes the introduction screen from the DOM and replaces it with the hangman game.
     *
     * @function populateContainer
     * @namespace Hangman.populateContainer
     * @return {Void}
     */
    this.populateContainer = function() {

        // Clear all nodes within the container div, and fade in new background UI elements
        $('#container').empty().append(function() {
            let newHTML = `<div class="row">
                               <div class="col" id="letters">
                                   <h2>Letter Bank</h2>
                               </div>
                               <div class="col" id="man"></div>
                          </div>
                          <div class="row">
                              <div class="col" id="stats"></div>
                          </div>`;
            $(newHTML).hide().appendTo("#container").fadeIn(1000);
        });

        // Create a button for each letter in the letters array
        let letters = '';
        for (let i = 0; i < this.letters.length; i++) {
            letters += `<button class="button" id="${this.letters[i]}" onclick="Hangman.pick('${this.letters[i]}')">${this.letters[i]}</button>`;
        }

        // Append a button for each letter inside of the letters DOM node
        $("#letters").append(function() {
            $("#letters").append(letters).fadeIn(1000);
        });

        // Populate UI with game stats and reset button
        let newHTML = `<button class="button" onclick="location.reload();">Restart</button>`;
        let stats   = `<b id="misses"> Misses: ${this.misses}</b>`;
        $("#stats").append(function() {
            $("#stats").append(newHTML + stats).fadeIn(1000);
        });

        // Draw the current word on the screen, censoring letters not yet found
        this.drawWord();
    };

    /**
     * Draws the current word on the screen, replacing letters that have not yet been found with underscores.
     *
     * @function drawWord
     * @namespace Hangman.drawWord
     * @return {Void}
     */
    this.drawWord = function() {
        let word = '';
        for (let i = 0; i < this.word.length; i++) {
            if ($.inArray(this.word.charAt(i).toLowerCase(), this.guesses) != -1) {
                word += this.word.charAt(i);
            } else {
                word += '_';
            }
        }
        $("#man").append(function () {
            $("#man").html("<h2 id='word'>" + word + "</h2>").fadeIn(1000);
        });
    };

    /**
     * This function is called when the user picks a letter as a guess.
     *
     * @function pick
     * @namespace Hangman.pick
     * @param letter {Char}
     * @return {Void}
     */
    this.pick = function(letter) {

        // Add the letter to a list of letters already used
        this.guesses.push(letter);

        // Determine if the user's chosen letter appears within the current word
        let valid = false;
        for (let i = 0; i < this.word.length; i++) {
            if (this.word.charAt(i).toLowerCase() === letter) {
                valid = true;
            }
        }

        // If the letter does not exit, increment the number of misses
        if (!valid) {
            this.misses++;
            let misses = this.misses;
            $("#misses").append(function() {
                $("#misses").html('<b id="misses"> Misses: ' + misses + '</b>').fadeIn(1000);
            });
        }

        // don't let the user pick the same letter twice
        $("#" + letter).prop("disabled", true);

        // draw the word again
        this.drawWord();

        // finally, the game is over after 9 attempts or a win
        this.isGameOver();
    };

    /**
     * Checks game state to determine if the game has ended.
     * The game can end if the max number of characters get picked, or if the user
     * successfully guesses the word.
     *
     * @function isGameOver
     * @namespace Hangman.isGameOver
     * @return {Void}
     */
    this.isGameOver = function() {
        let result = false;
        let win    = false;

        // Determine if the user is out of guesses
        if (this.misses >= 9) {
            result = true;
        }

        let correct = 0;
        for (let i = 0; i < this.word.length; i++) {
            if ($.inArray(this.word.charAt(i).toLowerCase(), this.guesses) != -1) { correct++; }
        }

        if (correct >= this.word.length) {
            result = true;
            win = true;
        }

        if (result) {
            if (win) {
                alert("You Won! Click to Start a new Game!");
                this.init();
            } else {
                alert("You Lost! Click to Try Again!");
                this.init();
            }
        }
    };

})();
