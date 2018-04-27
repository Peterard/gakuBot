let genetic = new Genetic();
genetic.generateRandomPopulation();

const savedGeneticRaw = localStorage.getItem('genetic');
const savedGeneticNeatRaw = localStorage.getItem('geneticNeat');
const savedGeneticGenerationRaw = localStorage.getItem('geneticGeneration');
const savedGeneticOpponentNeatRaw = localStorage.getItem('geneticOpponentNeat');
const savedGeneticOpponentGenerationRaw = localStorage.getItem('geneticOpponentGeneration');
const savedEvolutionIteration = localStorage.getItem('geneticEvolutionIteration');

const isSavedDataAvailable = notUndefinedOrNull(savedGeneticRaw) && notUndefinedOrNull(savedGeneticNeatRaw)
&& notUndefinedOrNull(savedGeneticGenerationRaw) && notUndefinedOrNull(savedGeneticOpponentNeatRaw)
&& notUndefinedOrNull(savedGeneticOpponentGenerationRaw) && notUndefinedOrNull(savedEvolutionIteration);

function notUndefinedOrNull(input){
  return typeof input !== "undefined" && input !== null;
}

function loadSavedGeneticData(){
  const savedGenetic = JSON.parse(savedGeneticRaw);
  const savedGeneticNeat = JSON.parse(savedGeneticNeatRaw);
  const savedGeneticOpponentNeat = JSON.parse(savedGeneticOpponentNeatRaw);

  genetic["noOfWins"] = parseInt(savedGenetic["noOfWins"]);
  genetic["noOfLosses"] = parseInt(savedGenetic["noOfLosses"]);
  genetic["noOfGames"] = parseInt(savedGenetic["noOfGames"]);
  genetic["neat"].import(savedGeneticNeat);
  genetic["neat"].generation = parseInt(savedGeneticGenerationRaw);
  genetic["opponentNeat"].import(savedGeneticOpponentNeat);
  genetic["opponentNeat"].generation = parseInt(savedGeneticOpponentGenerationRaw);
  genetic["evolutionIteration"] = parseInt(savedEvolutionIteration);
}

let iteration = 0;
let finalOutcome = {};
let finalPlayer;
let finalOpponent;
let evolutionIterationProcess;
let playProcess;
let movementProcess;

const headerText = ["Gakubot Formulate", "Rules", "How to play", "Strategy", "Other versions"];
const titleText = ["This is a machine learning game", "There are three main rules to this game", "Movement", "How will you play?", "Com vs Com"];
const contentText = ["You play against the computer, and the computer (theoretically) gets better as you play",
"<ol>\
  <li>You are a yellow circle. Your aim is to get home to the brown circle in the middle.</li>\
  <li>Get home before the pink circle and before time runs out, otherwise you lose.</li>\
  <li>If you touch or 'tag' your opponent, then the one of you who is closest to home when you touch is unable to move for a few seconds.</li>\
</ol> <br> That's it, good luck!",
"You move via clicking in the direction that you want to move in. A red reticule should appear wherever you click on the screen. Your yellow circle will move (quite slowly) in that direction",
"Will you make a beeline for the target? Will you be agressive and first seek to subdue your opponent by tagging them before going towards the objective? And what will the computer do?",
"If you would like to relax and watch two computers duel it out instead, then please feel free to try the <a href='../train_com_test_com/index.html'>Com vs Com Version</a><br><br>\
 Alternatively, if you want to teach the bots how you play by playing against them, go ahead at <a href='../train_player_test_player/index.html'>Bot vs Player (Learning) Version</a>. Be warned, the bots are not fast learners."];
const buttonText = ["Rules ▶", "Guide ▶", "Strategy ▶", "Versions ▶", "Train"];

const nextPage = function(){

}

let pageNumber = 0;
let pageNumberLimit = 4;

if(isSavedDataAvailable){
  pageNumberLimit = 5;
  headerText.splice(0, 0, "Save Data");
  titleText.splice(0, 0, "Local saved data has been detected");
  contentText.splice(0, 0, "Would you like to load previously saved data?");
  buttonText.splice(0, 0, "No");
  document.getElementById("progress-button-load").classList.remove("d-none");
  $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
  $("#canvas-overlay .card-title").html(titleText[pageNumber]);
  $("#canvas-overlay .card-text").html(contentText[pageNumber]);
  $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);

  document.getElementById("progress-button-load").addEventListener("click", function(e){
    e.preventDefault();
    document.getElementById("progress-button-load").classList.add("d-none");
    loadSavedGeneticData();
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  });
}

// run this in 500ms (1 second)
document.getElementById("progress-button").addEventListener("click", function(e){
  e.preventDefault();
  if(pageNumber < pageNumberLimit){
    document.getElementById("progress-button-load").classList.add("d-none");
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  }else{
    $("#canvas-overlay").hide();
    trainComPlayHuman();
  }
});

// run this in 500ms (1 second)
document.getElementById("play-again-button").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("continue-canvas-overlay").classList.add("d-none");
  trainComPlayHuman();
});

var gameFinish = function(){
  const gameResult = genetic.gameResultWin;
  const noOfWins = genetic.noOfWins;
  const noOfLosses = genetic.noOfLosses;
  const noOfGames = genetic.noOfGames;

  const isFinalGameOfRound = genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 5) < genetic.numberOfEvolutionsEachRound;

  localStorage.setItem('genetic', JSON.stringify(genetic));
  localStorage.setItem('geneticNeat', JSON.stringify(genetic.neat.export()));
  localStorage.setItem('geneticGeneration', genetic.neat.generation);
  localStorage.setItem('geneticOpponentNeat', JSON.stringify(genetic.opponentNeat.export()));
  localStorage.setItem('geneticOpponentGeneration', genetic.opponentNeat.generation);
  localStorage.setItem('geneticEvolutionIteration', genetic.evolutionIteration);

  document.getElementById("continue-canvas-overlay").classList.remove("d-none");
  document.getElementById("post-game-message-title").innerHTML = gameResult ? "Congratulations!" : "Unlucky!";
  document.getElementById("post-game-message").innerHTML = gameResult ? "You won! Continue?" : "You lost! Play again?";
  document.getElementById("post-game-results-played").innerHTML =  "Played: " + noOfGames;
  document.getElementById("post-game-results-won").innerHTML =  "Won: " + Math.round((100 * (noOfWins / (noOfGames)))) + "% (" + noOfWins + "/" + (noOfGames) + ")";
  document.getElementById("post-game-results-lost").innerHTML = "Lost: " + Math.round((100 * (noOfLosses / (noOfGames)))) + "% (" + noOfLosses + "/" + (noOfGames) + ")";
  document.getElementById("post-game-results-won-bar").style.width = Math.round(100 * (noOfWins / (noOfGames))) + "%";
  document.getElementById("post-game-results-lost-bar").style.width = Math.round(100 * (noOfLosses / (noOfGames))) + "%";

  if(noOfWins <= 0){
    document.getElementById("post-game-results-won-bar").classList.add("d-none");
  }else{
    document.getElementById("post-game-results-won-bar").classList.remove("d-none");
  }

  if(noOfLosses <= 0){
    document.getElementById("post-game-results-lost-bar").classList.add("d-none")
  }else{
    document.getElementById("post-game-results-lost-bar").classList.remove("d-none");
  }

  if(!isFinalGameOfRound){
    document.getElementById("continue-canvas-overlay").classList.add("d-none");
    trainComPlayHuman();
  }
}

//genetic.play();
