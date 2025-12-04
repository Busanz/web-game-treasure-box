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

  changeGameIntroText(0);

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
      showMessage('Pattern is not succeses..!');
    } else if (colorCode.length === 3) {
      if (JSON.stringify(colorCode) === JSON.stringify(secretPattern)) {
        $('.notification--header').text('You have unlocked the chest..');
        showMessage('Pattern is corrected');
        resetGame();
      } else {
        showMessage('Pattern not correct');
      }
    }
  });

  const resetGame = () => {
    allPlaceToPutIn.empty();
    $('.colors_to_select').empty();
    allColorsToSelect.appendTo('.colors_to_select');
    selectedColorBall = null;
    originalPlaceOfBall = null;
    dragHandler();
    generateSecretColorCode();
  };

  btnReset.on('click', () => {
    resetGame();
  });

  $('.main_model--btnClose').on({
    click: () => {
      mainModal.fadeOut(300);
      allColorsToSelect.fadeIn(300);
      allPlaceToPutIn.fadeIn(300);
      $('.display').css('padding-top', '50px');
      $('.display_left, .display_right').show();
      btnCheck.fadeIn(300);
    },
  });
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

  const showMessage = (message) => {
    $('.display_middle--notification').fadeIn(800);
    $('.notification--message').text(message);
    $('.colors_to_select').css('opacity', '0.1');
    $('.place_to_put').css('opacity', '0.1');
    btnCheck.hide();
  };

  $('.notification--btnClose').on('click', () => {
    $('.display_middle--notification').fadeOut(800);
    $('.colors_to_select').css('opacity', '1');
    $('.place_to_put').css('opacity', '1');
    btnCheck.show();
  });

  generateSecretColorCode();
  dragHandler();
});
