QUnit.module('Loading and Setup');

/**
 * Make sure the JS and HTML we need loads in on page load.
 */
QUnit.test('The application loads', function (assert) {
    ok(!!$.isReady, 'The index.html has loaded into the DOM.');
    ok(!!Hangman, 'The main.js has been initialized.');
});

QUnit.module('Functionality');

/**
 * Make sure the game configures itself correctly once the user clicks play.
 */
QUnit.test('Hangman initializes correctly', function (assert) {
    let mock = {
        words: ['Empire', 'Jedi', 'DeathStar', 'Luke', 'Yoda', 'Sith'],
        word: '',
        letters: [],
        guesses: [],
        misses: 0,
        populateContainerCalled: false,
        drawWordCalled: true
    };
    mock.init = Hangman.init;
    mock.populateContainer = function () {
        this.populateContainerCalled = true;
    };
    mock.drawWord = function () {
        this.drawWordCalled = true;
    };

    Hangman.init.call(mock);

    let successfulInit = !!mock.words.length && !!mock.word.length && mock.letters.length;
    ok(successfulInit, 'Init correctly populates game state.');
    ok(mock.populateContainerCalled, 'Hangman.init calls populateContainer().');

    mock.populateContainer = Hangman.populateContainer;
    Hangman.populateContainer.call(mock);
    ok(mock.drawWordCalled, 'Hangman.populateContainer called drawWord()');
});

/**
 * Walk through a game, ensuring game state is always valid.
 */
QUnit.test('Gameplay operates as intended.', function (assert) {
    let mock = {
        words: ['Empire'],
        word: 'Empire',
        letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        guesses: [],
        misses: 0
    };
    mock.drawWord = function () {};
    mock.isGameOver = function () {
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
                return "win";
            } else {
                return "lose";
            }
        }
    };

    // attempt to pick a letter
    Hangman.pick.call(mock, 'e');
    ok(!!mock.guesses.length, 'Picking a letter functions correctly.');

    // attempt to win the game
    Hangman.pick.call(mock, 'm');
    Hangman.pick.call(mock, 'p');
    Hangman.pick.call(mock, 'i');
    Hangman.pick.call(mock, 'r');

    ok(!!mock.isGameOver(), 'Game win state operates correctly');

    // TODO(Andrew): other useful things to test: lose state, DOM elements render correctly,
    // load speed, etc.
});
