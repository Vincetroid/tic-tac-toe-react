import React, {Component} from 'react';
import './App.css';
var turn = 1;
var num = 0;
var box = null, ctx = null;

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
	        gameOver: false,
	        human: 'X',
	        ai: 'O',
	        result: {},
            filled: [],
            symbol: [],
            winner: [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
        }

    }

    componentDidMount() {
        
        const filledClone = this.state.filled.slice();
        const symbolClone = this.state.symbol.slice();
        
        for(var i = 0; i < 9; i++) {
            filledClone[i] = false;
            symbolClone[i] = "";
            this.setState({ 
                filled: filledClone,
                symbol: symbolClone,
            });
        }

    }

    handleBoxClick(e) {
        const id = e.target.id;
        this.boxClick(id);
    }
    
    blockBoxClick() {
        document.getElementById("tic").style.pointerEvents = "none";
    }

    newGame() {
		document.location.reload();
    }

    drawX() {
        let {symbol, human } = this.state;
        box.style.backgroundColor = "rgb(113, 69, 145)";
		ctx.beginPath();
		ctx.moveTo(15,15);
		ctx.lineTo(85,85);
		ctx.moveTo(85,15);
		ctx.lineTo(15,85);
		ctx.lineWidth = 21;
		ctx.lineCap = "round";
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.closePath();
		symbol[num-1] = human;
    }

    //Drawing O
	drawO(next) {
        const { symbol, ai } = this.state;

		box.style.backgroundColor = "#93f273";
		ctx.beginPath();
		ctx.arc(50,50,35,0,2*Math.PI);
		ctx.lineWidth = 20;
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.closePath();
		
		symbol[next] = ai; // 'O'
	}

    //3.Winner check function 
	winnerCheck(symbol, player) {
        const { winner } = this.state;

		for(var j = 0; j < winner.length; j++) {
			if((symbol[winner[j][0]] === player) && (symbol[winner[j][1]] === player) && (symbol[winner[j][2]] === player)) {
				return true;
			}
		}
		return false;
	}
    
    //4. Box click function - human playing
	boxClick(numId) {
        box = this.refs[numId];
        ctx = this.refs[numId].getContext("2d");
		switch(numId) {
			case "canvas1": num = 1;
                break;
			case "canvas2": num = 2;
                break;
			case "canvas3": num = 3;
                break;
			case "canvas4": num = 4;
                break;
			case "canvas5": num = 5;
                break;
			case "canvas6": num = 6;
                break;
			case "canvas7": num = 7;
                break;
			case "canvas8": num = 8;
                break;
			case "canvas9": num = 9;
                break;
            default: alert("Sorry, there was an error");
                break;
		}
        
        this.evaluateBoxClick()
    }

    evaluateBoxClick() {
        let { filled, gameOver, symbol } = this.state;
		if(filled[num - 1] === false) {
			if(gameOver === false) {
				if(turn % 2 !== 0) {
					this.drawX();
                    turn++
                    filled[num - 1] = true;

                    if (this.winnerCheck(symbol, symbol[num - 1]) === true) {
                        document.getElementById("result").innerText = "Player '" + symbol[num - 1] + "' won!";
                        gameOver = true;
                        this.blockBoxClick();
                    }
                    
                    if (turn > 9 && gameOver !== true) {
                        document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
                        this.blockBoxClick();
                        return;
                    }

                    if (turn % 2 === 0) {
                        this.playAI();
                    }

				}
			}
			else {
				alert("Game over. Please click the New Game button to start again");
			}
		}
		else {
			alert("This box was already filled. Please click on another one.")
		}
    }
    
    //5. Find the empty boxes
	emptyBoxes(newSymbol) {
		var j = 0;
		var empty = [];
		for(var i = 0; i < newSymbol.length; i++) {
			if(newSymbol[i] !== 'X' && newSymbol[i] !== 'O') {
				empty[j] = i;
				j++;
			}
		}
		return empty;
    }
    
    //6. Making the AI play - playAI() and minimax()
	playAI() {
        let { symbol, ai, gameOver, filled } = this.state;

		var nextMove = this.miniMax(symbol, ai); 
        var nextId = "canvas" + (nextMove.id + 1);
        
        box = this.refs[nextId];
        ctx = this.refs[nextId].getContext("2d");
        if(gameOver === false) {
			if(turn % 2 === 0) {
                this.drawO(nextMove.id);
                turn++;
				filled[nextMove.id] = true;
				
				//winner check - ai wins
				if(this.winnerCheck(symbol, symbol[nextMove.id]) === true) {
					document.getElementById("result").innerText = "Player '" + symbol[nextMove.id] + "' won!";
                    gameOver = true;
                    this.blockBoxClick();
				}
				
				if(turn > 9 && gameOver !== true) {
                    document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
                    this.blockBoxClick();
				}
			}
		}
		
		else {
			alert("Game is over. Please click the New Game button to start again");
		}
    }
    
    miniMax(newSymbol, player) {

        let { human, ai, result } = this.state;

		var empty = [];
		empty = this.emptyBoxes(newSymbol);
		
		if(this.winnerCheck(newSymbol, human)) {
			return { score: -10 }; //human wins
		}
		else if(this.winnerCheck(newSymbol, ai)) {
			return { score: 10 }; //AI wins
		}
		else if(empty.length === 0) {
			if(this.winnerCheck(newSymbol, human)) {
				return { score: -10 };
			}
			else if(this.winnerCheck(newSymbol, ai)) {
				return { score : 10 };
			}
			return { score: 0 }; //game is draw
		}
		
		//if it's not terminal state
		//possible moves- their indexes and score values
		var posMoves = []; 
		for(var i = 0; i < empty.length; i++) {
			//current move - index of current move, score
			var curMove = {};
			//generate the new board with the current move
			curMove.id = empty[i];
			newSymbol[empty[i]] = player;
            
			if(player === ai) {
				result = this.miniMax(newSymbol, human);
				curMove.score = result.score;
			}
			else {
				result = this.miniMax(newSymbol, ai);
				curMove.score = result.score;
			}
		
			newSymbol[empty[i]] = '';
			
			posMoves.push(curMove);
			
		}
		
		//Calculate score of intermediate states - best move + score with respect to that player + return statement 
		var bestMove;
		if(player === ai) {
			var highestScore = -1000;
			for(let j = 0; j < posMoves.length; j++) {
				if(posMoves[j].score > highestScore) {
					highestScore = posMoves[j].score;
					bestMove = j;
				}
			}
		}
		else {
			var lowestScore = 1000;
			for(let j = 0; j < posMoves.length; j++) {
				if(posMoves[j].score < lowestScore) {
					lowestScore = posMoves[j].score;
					bestMove = j;
				}
			}
        }
		return posMoves[bestMove]; 
	}

    render() {
        return (
            <div data-test="root-tag">
                <h1 id="result"> </h1>
        
                <section id="game" data-test="game-section">
                    <div id="tic" onClick={this.handleBoxClick.bind(this)} data-test="board-display">
                        <canvas id="canvas1" ref="canvas1" width="100" height="100"></canvas> 
                        <canvas id="canvas3" ref="canvas3" width="100" height="100"></canvas> 
                        <canvas id="canvas2" ref="canvas2" width="100" height="100"></canvas>
                        <br/>
                        
                        <canvas id="canvas4" ref="canvas4" width="100" height="100"></canvas>
                        <canvas id="canvas5" ref="canvas5" width="100" height="100"></canvas>
                        <canvas id="canvas6" ref="canvas6" width="100" height="100"></canvas>
                        <br/>

                        <canvas id="canvas7" ref="canvas7" width="100" height="100"></canvas>
                        <canvas id="canvas8" ref="canvas8" width="100" height="100"></canvas>
                        <canvas id="canvas9" ref="canvas9" width="100" height="100"></canvas>
                    </div>
                    <center>
                        <button onClick={(v) => this.newGame(v)}  id="new">NEW GAME</button>
                    </center>
                </section>
            </div>
        );
    }
}

export default App;
