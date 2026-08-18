import { Chess } from 'chess.js';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-GB";

recognition.start();
console.log("Ready to receive a chess move.");

const bubbles = true;
var moveCanBeSent = true;

const speechCorrections = { 
    'night' : 'knight',
    'rugby' : 'rook b',
    'porn' : 'pawn',
    'ASICS' : 'a6', 
    'phone' : 'pawn',
    'YouTube' : 'e2',
    'before' : 'b4',
    'default' : 'd4',
    'Dion' : 'd1',
    'on' : 'pawn',
    'Bourne' : 'pawn',
    'Brooke' : 'rook',
    'rog' : 'rook', 
    'Rog' : 'rook',
    'Nike' : 'knight',
    'one' : '1',
    'pond' : 'pawn',
    'pondy' : 'pawn d',
    'Essex' : 'a6',
    'S' : 'f',
    'V' : 'b',
    'sea' : 'c',
    'rocker' : 'rook e',
    'rick' : 'rook',
    'Roxy' : 'rook c', 
    'ticks' : 'takes',
    'detects?' : 'd takes',
    'book' : 'rook',
    'sex' : 'six',
    'ethics' : 'f takes',
    'ftx' : 'f takes',
    'define' : 'd5',
    'look' : 'rook',
    'work' : 'rook',
    'rock' : 'rook',
    'access' : 'f6',
    'Roxy one' : 'rook c1',
    'rotex' : 'rook takes',
    'text' : 'takes',
    'tech' : 'take',
    'what do you want' : 'rook d1',
    'latex' : 'knight takes',
    'do you take' : 'd takes'



};

const chessLetterToNumber = {
  'a' : '1',
  'b' : '2',
  'c' : '3',
  'd' : '4',
  'e' : '5',
  'f' : '6',
  'g' : '7',  
  'h' : '8'
};

const chessPieces = { 
  'king' : 'K',
  'queen' : 'Q',
  'rook' : 'R',
  'bishop' : 'B',
  'knight' : 'N'
};

function correctSpeechAndLowerCase(speechToCorrect) {
    let correctedSpeech = speechToCorrect;

    let knightRegExp = new RegExp(`\\b9(?=\\d\\b)`, "g"); 
    correctedSpeech = correctedSpeech.replaceAll(knightRegExp, 'knight e');

    let bRegExp = new RegExp(`\\bv(?=\\d\\b)`, "ig"); 
    correctedSpeech = correctedSpeech.replaceAll(bRegExp, 'b');

    correctedSpeech = correctedSpeech.replaceAll('-', ' ');

    for (const speechCorrection in speechCorrections) {
        let regExp = new RegExp(`\\b(${speechCorrection})\\b`, "ig");
        if (regExp.test(correctedSpeech)){
        var correction = speechCorrections[speechCorrection];
        correctedSpeech = correctedSpeech.replaceAll(regExp, correction);
        };
    };
    correctedSpeech = correctedSpeech.toLowerCase(); 
    return correctedSpeech;
};

function returnChessMoveIfValid(speechToCheckIfValidChessMove) { 
    var chessPiecesArray = Object.keys(chessPieces);
    const chessPiecesRegex = chessPiecesArray.join(' |') + " ";
    let validChessMoveRegexp = new RegExp(`^(((${chessPiecesRegex}|pawn )(to )?)?(([A-Ha-h]|(?<=${chessPiecesRegex})\\d) ?)?((?<=(${chessPiecesRegex}|pawn |[A-Ha-h] ?|\\d ?))(x ?|X ?|\\btakes? ?))?[A-Ha-h] ?\\d|short castle|long castle( check| checkmate)?)$`, "g");
    var validChessMoveList = speechToCheckIfValidChessMove.match(validChessMoveRegexp);

    return validChessMoveList;
};

function convertChessMoveToChessNotation(chessMove) {
  for (const [chessPiece, chessPieceLetter] of Object.entries(chessPieces)) {
    chessMove = chessMove.replace(chessPiece, chessPieceLetter);
    };
  chessMove = chessMove.replace('short castle', 'O-O');
  chessMove = chessMove.replace('long castle', 'O-O-O');
  chessMove = chessMove.replace(/(\btakes?\b|x|X|\bcheck(mate)?\b|\bto\b|\bpawn\b)/, ''); 
  chessMove = chessMove.replace(/ /g,'')
  return chessMove;
};

function getCurrentGamePositionMoves() {
  var currentChessMoves = []; 
  var chessMovesOnSiderbarPath = "//div[@id='board-layout-sidebar']//wc-simple-move-list//div[contains(@class,'main-line-row')]/div[@data-node]";
  var chessMoveElements = document.evaluate(chessMovesOnSiderbarPath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

  var chessMoveElement = chessMoveElements.iterateNext();
  while (chessMoveElement != null) {
      var chessMove = chessMoveElement.textContent.trim();
      currentChessMoves.push(chessMove);
    chessMoveElement = chessMoveElements.iterateNext();
  };
  return currentChessMoves;
};

function getPlayerColor() { 
  var chessBoardTopRightNumber = document.evaluate("//wc-chess-board//*[name() = 'svg']//*[name() = 'text'][1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
  var playerColor = '';

  if (chessBoardTopRightNumber == '8') {
    playerColor = 'white';
  } else if (chessBoardTopRightNumber == '1') {
    playerColor = 'black';
  } else {
    playerColor = null;
  }
  return playerColor;
};

function getCurrentGameFromChessMoveList(currentChessMoves) {
  const currentChessGame = new Chess()
  for (let currentChessMove of currentChessMoves) {
    currentChessGame.move(currentChessMove);
  };

  return currentChessGame

}

function setBoardClickPosition(isBoardFlipped, fromSquareLetter, fromSquareNumber, toSquareLetter, toSquareNumber, squareWidth, offsetX, offsetY) {
  if (isBoardFlipped == true) {
    var fromSquareMultiplierX = 8.5 - chessLetterToNumber[fromSquareLetter];
    var toSquareMultiplierX = 8.5 - chessLetterToNumber[toSquareLetter];
    var fromSquareMultiplierY = fromSquareNumber - 0.5;
    var toSquareMultiplierY = toSquareNumber - 0.5;
  } else {
    var fromSquareMultiplierX = chessLetterToNumber[fromSquareLetter] - 0.5;
    var toSquareMultiplierX = chessLetterToNumber[toSquareLetter] - 0.5;
    var fromSquareMultiplierY = 8.5 - fromSquareNumber;
    var toSquareMultiplierY = 8.5 - toSquareNumber;
  };

  var fromX = squareWidth * fromSquareMultiplierX + offsetX;
  var fromY = squareWidth * fromSquareMultiplierY + offsetY;
  
  var toX = squareWidth * toSquareMultiplierX + offsetX;
  var toY = squareWidth * toSquareMultiplierY + offsetY;
  
  return [fromX, fromY, toX, toY]
};

function getChessPieceElement(fromSquareLetter, fromSquareNumber, playerColourLetter, piece){
  var fromClassSquareIdentification = `square-${chessLetterToNumber[fromSquareLetter]}${fromSquareNumber}`;
  var fromClassColourIdentification = `${playerColourLetter}${piece}`;        
  var fromChessPiecePath = `//wc-chess-board//div[contains(@class, '${fromClassColourIdentification}') and contains(@class, '${fromClassSquareIdentification}')]`;
  var chessPieceElement = document.evaluate(fromChessPiecePath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  return chessPieceElement;
};

function returnBoardData() {
  var chessBoardPath = "//wc-chess-board";
  var chessBoardElement = document.evaluate(chessBoardPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var offsetX = chessBoardElement.getBoundingClientRect().x;
  var offsetY = chessBoardElement.getBoundingClientRect().y;

  var boardFlipped = false;
  var boardState = chessBoardElement.getAttribute("class");
  if (boardState == "board flipped"){
    boardFlipped = true;
  };

  return [chessBoardElement, boardFlipped, offsetX, offsetY]
}

function sendMove(chessBoardElement, chessPieceElement, fromX, fromY, toX, toY, bubbles) {
  let event = new PointerEvent('pointerdown', { clientX: fromX , clientY: fromY, bubbles });
  chessPieceElement.dispatchEvent(event);
  
  event = new PointerEvent('pointerup', { clientX: toX , clientY: toY, bubbles });
  chessBoardElement.dispatchEvent(event);
};

recognition.onresult = (event) => {
    var speech = event.results[0][0].transcript;
    console.log(`Speech received: ${speech}.`);

    var correctedSpeech = correctSpeechAndLowerCase(speech);
    var chessMoveList = returnChessMoveIfValid(correctedSpeech);

    var playerColour = getPlayerColor()

    if ((chessMoveList != null) && (playerColour != null)) {
      var chessMove = chessMoveList[0];
      var playerColourLetter = playerColour[0];

      var chessMoveNotation = convertChessMoveToChessNotation(chessMove)
      console.log('The chess move is: ' + chessMoveNotation);
      
      var currentChessMovesList = getCurrentGamePositionMoves();
      var currentChessGame = getCurrentGameFromChessMoveList(currentChessMovesList);
      console.log(currentChessGame.ascii())

      var playerTurn = currentChessGame.turn();
      var legalMoves = currentChessGame.moves();
      var simplifiedLegalMoves = currentChessGame.moves();

      for (var simplifiedLegalMove of simplifiedLegalMoves) {
        var simplifiedLegalMoveIndex = simplifiedLegalMoves.indexOf(simplifiedLegalMove);
        var simplifiedLegalMove = simplifiedLegalMove.replace(/\+|x/g, ''); 
        simplifiedLegalMoves.splice(simplifiedLegalMoveIndex, 1, simplifiedLegalMove);
      };

      if ((simplifiedLegalMoves.includes(chessMoveNotation)) && (playerTurn == playerColourLetter) && (moveCanBeSent == true)) {
        chessMoveNotation = legalMoves[(simplifiedLegalMoves.indexOf(chessMoveNotation))];
        moveCanBeSent = false;

        var { from, to, piece } = currentChessGame.move(chessMoveNotation);
        var fromSquareLetter = from[0];
        var fromSquareNumber = from[1];
        var toSquareLetter = to[0];
        var toSquareNumber = to[1];
//
        var chessPieceElement = getChessPieceElement(fromSquareLetter, fromSquareNumber, playerColourLetter, piece);
        var squareWidth = chessPieceElement.getBoundingClientRect().width;

        var [chessBoardElement, boardFlipped, offsetX, offsetY] = returnBoardData();
        var [fromX, fromY, toX, toY] = setBoardClickPosition(boardFlipped, fromSquareLetter, fromSquareNumber, toSquareLetter, toSquareNumber, squareWidth, offsetX, offsetY);

        sendMove(chessBoardElement, chessPieceElement, fromX, fromY, toX, toY, bubbles);
        moveCanBeSent = true;

      }
    };
  };


recognition.onerror = (event) => {
    console.log(`Error occurred in recognition: ${event.error}`);
};

recognition.onend = function() {
  recognition.start();
}