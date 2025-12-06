$(() => {
  const allColorsToSelect = $('.color_ball');
  const allPlaceToPutIn = $('.put_in');
  const mainIntro = $('.main_intro');
  const mainModal = $('.main_modal');
  const btnNext = $('.main_intro--btnNext');
  const btnSkip = $('.main_intro--btnSkip');
  const btnInstruction = $('.display_left--btnInstruction');
  const btnCheck = $('.display_midddle--btnCheck');
  const btnReset = $('.display_left--btnReset');

  let secretPattern = [];
  let attemptCount = 0;
  let selectedColorBall = null;
  let originalPlaceOfBall = null;
  const colorCode = [];
  let isMessageOpen = false;
  let isGameWon = false;
  let isGameLost = false;
  const MAX_ATTEMTS = 5;

  mainModal.hide();
  allColorsToSelect.hide();
  allPlaceToPutIn.hide();
  $('.display').css('padding-top', '0');
  $('.display_left, .display_right').hide();
  btnCheck.hide();
  $('.display_middle--notification').hide();

  const instructions = [
    `You're walking through the ancient forest with your loyal dog 🐕, searching for wild mushrooms among the twisted trees.
  
  Suddenly, a massive eagle 🦅 swoops down through the canopy, its wings blocking out the sun!
  
  Something falls from its talons and crashes into the bushes nearyou! 💥`,

    `Your dog barks excitedly and rushes toward the sound. Moments later, he trots back, dragging something heavy in his jaws...

  It's a magnificent box! ✨ ✨ 📦 ✨ ✨✨ `,
    `"FINALLY... AFTER 1000 YEARS... I AM FREE!"

  "HA HaA Haaa... you have released me. 
  
  If you wish to claim the treasure within, you must prove your destany!
`,
  ];
  const changeGameIntroText = (i) => {
    $('.main_intro--description')
      .text(instructions[i])
      .css('white-space', 'pre-line');
  };

  const changeGameInstrction = (text) => {
    $('.main_intro--instruction').text(text);
  };
  const showMessage = (message) => {
    $('.display_middle--notification').fadeIn(100);
    $('.notification--message').text(message);
    $('.colors_to_select').css('opacity', 0);
    $('.place_to_put').css('opacity', 0);
    btnCheck.hide();
    isMessageOpen = !isMessageOpen;
  };

  const hideMessage = () => {
    $('.display_middle--notification').fadeOut(100);
    $('.colors_to_select').css('opacity', '1');
    $('.place_to_put').css('opacity', '1');
    btnCheck.show();

    isMessageOpen = !isMessageOpen;
  };

  const generateSecretColorCode = () => {
    secretPattern = [];
    const tempColorToChoose = [0, 1, 2, 3, 4];
    for (let i = 0; i < 3; i++) {
      let randomColorIndex = Math.floor(
        Math.random() * tempColorToChoose.length
      );
      secretPattern.push(tempColorToChoose[randomColorIndex]);
      tempColorToChoose.splice(randomColorIndex, 1);
    }
    console.log('screcet pattern', secretPattern);
  };

  const resetGame = () => {
    allPlaceToPutIn.empty().css({ 'border-color': '#fff', height: '40px' });
    $('.colors_to_select').empty();
    $('.previous_guesses').empty();
    $('.display_middle--notification')
      .removeClass('bg_animation')
      .css('background-image', `url("")`);
    allColorsToSelect.appendTo('.colors_to_select');
    attemptCount = 0;
    selectedColorBall = null;
    originalPlaceOfBall = null;
    dragHandler();
    generateSecretColorCode();
    hideMessage();
    setAttemptCount(0);
    btnCheck.prop('disabled', false);

    isGameWon = false;
  };

  const dragHandler = () => {
    allColorsToSelect.each((index, element) => {
      $(element).attr('draggable', true);
      $(element).on({
        dragstart: (e) => {
          selectedColorBall = $(e.target);
          originalPlaceOfBall = selectedColorBall.parent();
          $(e.target).css('opacity', '0.3');
        },
        dragend: (e) => {
          $(e.target).css('opacity', '1');
        },
      });
    });
  };

  const setAttemptCount = (num) => {
    $('.display_left--attempts').text(`${num}/5`);
  };

  const setMessageHeader = (text) => {
    $('.notification--header').text(`${text}`);
  };

  const chnageBackground = (element = 'body', imageURL, duration = 1000) => {
    $(element)
      .css({ opacity: '0.1', 'background-image': `url("${imageURL}")` })
      .animate({ opacity: 1 }, duration, () => {
        $(element).addClass('bg_animation');
      });
  };

  const showPreviousGuesses = (num, arr) => {
    const correctColorAndPosition = [];
    let correctColorAndPositionEmojie = [];
    const colorToChooseInEmojie = ['🔴', '🟣', '🟢', '🟡', '🔵'];
    const displayRight = $('.display_right');

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === secretPattern[i]) {
        correctColorAndPosition.push(arr[i]);
      }
    }

    if (attemptCount !== MAX_ATTEMTS) {
      const lastGuess = arr.map((el) => colorToChooseInEmojie[el]).join(' ');

      if (correctColorAndPosition.length > 0) {
        correctColorAndPositionEmojie = correctColorAndPosition
          .map((el) => colorToChooseInEmojie[el])
          .join(' ');
      } else {
        correctColorAndPositionEmojie.push('🚫🤞');
      }
      $(
        `<p class="previous_guesses">Attepmt-0${num}<br>${lastGuess} <span class="correct_color_position">Your previous guess </span><br>${correctColorAndPositionEmojie} <span class="correct_color_position">Correct color(s) in right position </span></p>`
      ).appendTo(displayRight);
    }
  };

  btnNext.on({
    click: (e) => {
      if (btnNext.text().toLowerCase() === 'open the chest') {
        chnageBackground('body', 'images/bg_ghost.jpg');
        changeGameIntroText(2);
        btnNext.fadeOut(100);
        changeGameInstrction('Do you dare to accept the challenge...?');
        $('.main_intro--btnSkip').text('Start game');
      } else {
        changeGameIntroText(1);
        btnNext.text('Open the chest');
      }
    },
  });

  btnSkip.on({
    click: (e) => {
      if (btnSkip.text().toLowerCase() === 'skip') {
        chnageBackground('body', 'images/bg_ghost.jpg');
        btnNext.hide();
        changeGameIntroText(2);
        changeGameInstrction('Do you dare to accept the challenge...?');
        $('.main_intro--btnSkip').text('Start game');
      } else if (btnSkip.text().toLowerCase() === 'start game') {
        mainIntro.hide();
        mainModal.show();
      }
    },
  });

  btnInstruction.on({
    click: () => {
      mainModal.fadeIn(400);
    },
  });

  btnCheck.on('click', () => {
    colorCode.length = 0;
    $('.put_in .color_ball').each((index, element) => {
      colorCode.push(parseInt($(element).text()));
    });
    if (colorCode.length !== 3) {
      setMessageHeader('One or more slots are empty');
      showMessage(
        'Pattern is not succeses. Fill all the slots with magic orbs'
      );
    } else if (colorCode.length === 3) {
      attemptCount += 1;
      setAttemptCount(attemptCount);
      if (JSON.stringify(colorCode) === JSON.stringify(secretPattern)) {
        // change background image with treasure box
        chnageBackground(
          '.display_middle--notification',
          'images/bg_won.png',
          500
        );

        setMessageHeader('You have unlocked the chest..');
        showMessage('Pattern is corrected');
        btnCheck.prop('disabled', true);
        isGameWon = true;
      } else if (attemptCount === 4) {
        setMessageHeader('Wrong color pattern');
        showMessage(
          'Color pattern is incorrect, you have one more chance to check ..!'
        );
      } else if (attemptCount === MAX_ATTEMTS) {
        chnageBackground(
          '.display_middle--notification',
          'images/bg_lost.png',
          500
        );
        setMessageHeader('Wrong color pattern. Game over !');
        showMessage('Number of attems is over.');
        btnCheck.prop('disabled', true);
        isGameLost = true;
      } else {
        setMessageHeader('Wrong color pattern');
        showMessage('Pattern is not correct, try again');
      }
      if (!isGameWon) {
        showPreviousGuesses(attemptCount, colorCode);
      }
    }
  });

  btnReset.on('click', () => {
    resetGame();
  });

  $('.main_model--btnClose').on({
    click: () => {
      mainModal.fadeOut(100);
      if (!isMessageOpen) {
        allColorsToSelect.fadeIn(500);
        allPlaceToPutIn.fadeIn(500);
        $('.display').css('padding-top', '50px');
        $('.display_left, .display_right').fadeIn(500);
        btnCheck.fadeIn(500);
      }
    },
  });

  allPlaceToPutIn.each((index, element) => {
    $(element).on({
      dragover: (e) => {
        e.preventDefault();
        $(e.currentTarget).css({ 'border-color': '#00fe40', height: '50px' });
      },
      dragleave: (e) => {
        $(e.currentTarget).css({ 'border-color': '#fff', height: '40px' });
      },
      drop: (e) => {
        e.preventDefault();
        const dropPutInTarget = $(e.currentTarget);
        dropPutInTarget.css('height', '40px');

        const existingBall = dropPutInTarget.find('.color_ball');

        if (existingBall.length > 0) {
          originalPlaceOfBall.append(existingBall);
        }
        dropPutInTarget.append(selectedColorBall);
      },
    });
  });

  $('.notification--btnClose').on('click', () => {
    hideMessage();
    if (isGameWon) {
      setTimeout(resetGame, 800);
      isGameWon = !isGameWon;
    }
    if (isGameLost) {
      setTimeout(resetGame, 800);
      isGameLost = !isGameLost;
    }
  });

  changeGameIntroText(0);
  generateSecretColorCode();
  dragHandler();
});
