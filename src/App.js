import React, {Component} from 'react';
import './App.css';
// import fns from './utils/helpers';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            num: 0,
	        box: null,
	        ctx: null,
	        turn: 1,
	        filled: null,
	        symbol: null,
	        winner: null,
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
        
        const filledClone = this.state.filled.slice(); //creates the clone of the state
        const symbolClone = this.state.symbol.slice(); //creates the clone of the state
        
        for(var i = 0; i < 9; i++) {
            filledClone[i] = false;
            symbolClone[i] = "";
            this.setState({ 
                filled: filledClone,
                symbol: symbolClone,
            });
        }

        document.getElementById("tic").addEventListener("click", this.handleBoxClick.bind(this));
        // document.getElementById("tic").addEventListener("click", () => console.log(this) );
        
    }

    handleBoxClick(e) {
        // console.log(this)
        this.boxClick(e.target.id);
    }

    newGame() {
		document.location.reload();
    }

    drawX() {
        let { box, ctx, symbol, num, human } = this.state;

        box.style.backgroundColor = "#fb5181";
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
		debugger;
		symbol[num-1] = human;
    }

    //Drawing O
	drawO(next) {
        const { box, ctx, symbol, ai } = this.state;

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

        // console.log(symbol, player);
        debugger;
 
        const { winner } = this.state;

		for(var j = 0; j < winner.length; j++) {
			if((symbol[winner[j][0]] == player) && (symbol[winner[j][1]] == player) && (symbol[winner[j][2]] == player)) {
				return true;
			}
		}
		return false;
	}
    
    //4. Box click function - human playing
	boxClick(numId) {
        console.log('boxClick', numId)
        

        this.setState({
            box: document.getElementById(numId),
        });
        this.setState({
            ctx: this.state.box.getContext("2d"),
        });
		switch(numId) {
			case "canvas1": this.setState({ num: 1 });
                break;
			case "canvas2": this.setState({ num: 2 });
                break;
			case "canvas3": this.setState({ num: 3 });
                break;
			case "canvas4": this.setState({ num: 4 });
                break;
			case "canvas5": this.setState({ num: 5 });
                break;
			case "canvas6": this.setState({ num: 6 });
                break;
			case "canvas7": this.setState({ num: 7 });
                break;
			case "canvas8": this.setState({ num: 8 });
                break;
			case "canvas9": this.setState({ num: 9 });
                break;
		}
        
        this.evaluateBoxClick()
    }

    evaluateBoxClick() {

        let { box, ctx, num, filled, gameOver, turn, symbol } = this.state;
        
        debugger;
		if(filled[num - 1] === false) {
			if(gameOver === false) {
				if(turn % 2 !== 0) {
					this.drawX();
					turn++;
                    filled[num - 1] = true;
                    
                    console.log('valor de symbol', symbol)
					
					if(this.winnerCheck(symbol, symbol[num - 1]) === true) {
                        console.log('won! linea 143')
						document.getElementById("result").innerText = "Player '" + symbol[num - 1] + "' won!";
						gameOver = true;
					}
					
					if(turn > 9 && gameOver !== true) {
						document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
						return;
					}
					
					if(turn % 2 == 0) {
						// this.playAI.bind(this);
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

        let { symbol, ai, gameOver, turn, filled } = this.state;

		var nextMove = this.miniMax(symbol, ai); 
        var nextId = "canvas" + (nextMove.id + 1);
        
        this.setState({
            box: document.getElementById(nextId),
        });
        this.setState({
            ctx: this.state.box.getContext("2d"),
        });
		if(gameOver === false) {
			if(turn % 2 === 0) { //if turn is even
				this.drawO(nextMove.id);
				turn++;
				filled[nextMove.id] = true;
				
				//winner check - ai wins
				if(this.winnerCheck(symbol, symbol[nextMove.id]) === true) {
                    console.log('won! linea 203')
					document.getElementById("result").innerText = "Player '" + symbol[nextMove.id] + "' won!";
					gameOver = true;
				}
				
				//draw condition
				if(turn > 9 && gameOver !== true) {
					document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
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
		empty = this.emptyBoxes(newSymbol); //[]
		
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
		
		//if its not a terminal state
		//possible moves- their indices and score values
		var posMoves = []; 
		//[4] - Example
		for(var i = 0; i < empty.length; i++) {
			//current move - index of current move,score
			var curMove = {};
			//generate the new board with the current move
			curMove.id = empty[i]; //4
			newSymbol[empty[i]] = player; //AI
			
			if(player === ai) {
				//result = [{id:4,score:-10}], 
				//curMove = {id:1,score:-10}
				result = this.miniMax(newSymbol, human); //index and score
				curMove.score = result.score; //10
			}
			else {
				//result = [{id:6, score:10}]
				//curMove = {id:6, score:10}
				result = this.miniMax(newSymbol, ai);
				curMove.score = result.score; //-10
				//level 2 move 1 curMove = {id: 6, score: 10}
				//level 3 move 1 -> posMoves = [{id:4,score:10}]
				//level 2 move 1 -> posMoves = [{id:6, score:10}]
			}
			
			//level 1 move 1 -> posMoves = [{id:4,score:-10},{id:6, score:10}]
			//level 0 -> posMoves = [{id:4,score:10},{id:6,score:10},{id:1,score:-10}]
			//empty:[1,4,6]
			newSymbol[empty[i]] = '';
			
			posMoves.push(curMove); //[{id: 1, score: -10}]
			
		}
		
		//Calculate score of intermediate states - best move + score with respect to that player + return statement 
		var bestMove;
		//AI - max player (always) -> choose maximum value, human - min player -> choose minimum value
		
		if(player === ai) {
			//posMoves = [{id:4,score:10},{id:6,score:10},{id:1,score:-10}]
			var highestScore = -1000;
			for(var j=0; j<posMoves.length;j++) {
				if(posMoves[j].score > highestScore) {
					highestScore = posMoves[j].score;
					bestMove = j; //0
				}
			}
		}
		//posMoves = [{id:4,score:-10},{id:6, score:10}]
		else {
			var lowestScore = 1000;
			for(var j = 0; j < posMoves.length; j++) {
				if(posMoves[j].score < lowestScore) {
					lowestScore = posMoves[j].score;
					bestMove = j;
				}
			}
		}
		return posMoves[bestMove]; 
		//posMoves[0] = {id:4,score:10}
	}

    render() {

        console.log(this.state)
        
        return (
            <div>
                <h1 id="result"></h1>
        
                <section id="game">
                    <div id="tic">
                        <canvas id="canvas1" width="100" height="100"></canvas> 
                        <canvas id="canvas2" width="100" height="100"></canvas>
                        <canvas id="canvas3" width="100" height="100"></canvas> 
                        <br/>
                        
                        <canvas id="canvas4" width="100" height="100"></canvas>
                        <canvas id="canvas5" width="100" height="100"></canvas>
                        <canvas id="canvas6" width="100" height="100"></canvas>
                        <br/>
                        
                        <canvas id="canvas7" width="100" height="100"></canvas>
                        <canvas id="canvas8" width="100" height="100"></canvas>
                        <canvas id="canvas9" width="100" height="100"></canvas>
                        <center>
                            <button onClick={(v) => this.newGame(v)}  id="new">NEW GAME</button>
                        </center>
                    </div>
                    
                </section>
            </div>
        );
    }
}

export default App;
