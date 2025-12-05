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
    $('.display_middle--notification').fadeIn(800);
    $('.notification--message').text(message);
    $('.colors_to_select').css('opacity', '0.1');
    $('.place_to_put').css('opacity', '0.1');
    btnCheck.hide();
  };

  const hideMessage = () => {
    $('.display_middle--notification').fadeOut(800);
    $('.colors_to_select').css('opacity', '1');
    $('.place_to_put').css('opacity', '1');
    btnCheck.show();
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
    allPlaceToPutIn.empty();
    $('.colors_to_select').empty();
    allColorsToSelect.appendTo('.colors_to_select');
    attemptCount = 0;
    selectedColorBall = null;
    originalPlaceOfBall = null;
    dragHandler();
    generateSecretColorCode();
    hideMessage();
    setAttemptCount(0);
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

  btnNext.on({
    click: (e) => {
      if (btnNext.text().toLowerCase() === 'open the chest') {
        $('body').css('background-image', 'url("images/bg_ghost.jpg")');
        changeGameIntroText(2);
        btnNext.hide();

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
        $('body').css('background-image', 'url("images/bg_ghost.jpg")');
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
      showMessage(
        'Pattern is not succeses..!, fill all the slots with magic orbs'
      );
    } else if (colorCode.length === 3) {
      attemptCount += 1;
      setAttemptCount(attemptCount);
      if (JSON.stringify(colorCode) === JSON.stringify(secretPattern)) {
        setMessageHeader('You have unlocked the chest..');
        showMessage('Pattern is corrected');
        setTimeout(resetGame, 5000);
      } else if (attemptCount === 4) {
        setMessageHeader('Wrong color pattern');
        showMessage(
          'Color pattern is incorrect, you have one more chance to check ..!'
        );
      } else {
        setMessageHeader('Wrong color pattern');
        showMessage('Pattern is not correct, try again');
      }
    }
  });

  btnReset.on('click', () => {
    resetGame();
  });

  $('.main_model--btnClose').on({
    click: () => {
      mainModal.fadeOut(100);
      allColorsToSelect.fadeIn(500);
      allPlaceToPutIn.fadeIn(500);
      $('.display').css('padding-top', '50px');
      $('.display_left, .display_right').fadeIn(500);
      btnCheck.fadeIn(500);
    },
  });

  allPlaceToPutIn.each((index, element) => {
    $(element).on({
      dragover: (e) => {
        e.preventDefault();
        $(e.currentTarget).css('height', '70px');
      },
      dragleave: (e) => {
        $(e.currentTarget).css('height', '40px');
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
  });

  changeGameIntroText(0);
  generateSecretColorCode();
  dragHandler();
});
