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

const headerText = ["GakuBot Exhibit", "Rules", "Strategy", "Other versions"];
const titleText = ["This is a machine learning game", "There are three main rules to this game", "How will they play?", "Bot vs Player"];
const contentText = ["One bot plays against another, and they should (theoretically) both get better as they play",
"<ol>\
  <li>The bots are yellow and pink circles. Their aim is to get home to the brown circle in the middle.</li>\
  <li>They need to get home before their opponent, else they lose.</li>\
  <li>If they touch or 'tag' their opponent, then the bot which is closest to home when they touch is unable to move for a few seconds.</li>\
</ol>",
"Will they make a beeline for the target? Will they be agressive and first seek to subdue your opponent by tagging them before going towards the objective? How will their strategy develop?",
"If you want to go head to head against the bots, go ahead and try at <a href='../train_com_test_player/index.html'>Bot vs Player Version</a> <br><br>\
 Alternatively, if you want to teach the bots how you play by playing against them, go ahead at <a href='../train_player_test_player/index.html'>Bot vs Player (Learning) Version</a>. Be warned, the bots are not fast learners."];
const buttonText = ["Rules ▶", "Strategy ▶", "Versions ▶", "Train"];

const nextPage = function(){

}

let pageNumber = 0;
let pageNumberLimit = 3;

if(isSavedDataAvailable){
  pageNumberLimit = 4;
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
    trainComPlayCom();
  }
});

// run this in 500ms (1 second)


var gameFinish = function(){
  localStorage.setItem('genetic', JSON.stringify(genetic));
  localStorage.setItem('geneticNeat', JSON.stringify(genetic.neat.export()));
  localStorage.setItem('geneticGeneration', genetic.neat.generation);
  localStorage.setItem('geneticOpponentNeat', JSON.stringify(genetic.opponentNeat.export()));
  localStorage.setItem('geneticOpponentGeneration', genetic.opponentNeat.generation);
  localStorage.setItem('geneticEvolutionIteration', genetic.evolutionIteration);

  trainComPlayCom();
}

//genetic.play();
