class CalcController {
       
      constructor() {
        
        this._audio = new Audio('click.mp3');
        this._AudioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';   
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;     
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
        
        
        
      }


        pastFromClipboard() {

        document.addEventListener('paste', e=> {

          let text = e.clipboardData.getData('Text');

          this.displayCalc = parseFloat(text);

          console.log(text);

        });
      }


        copyToClipboard() {

          let input = document.createElement('input');

          input.value = this.displayCalc;

          document.body.appendChild(input); 

          input.select();

          document.execCommand("Copy");

          input.remove();
      }

        initialize() {
          

           setInterval(()=>{            //atualiza hora e data em tempo real,atraves do 2 parametros
              this.setDisplayDateTime(); 

          
           },1000) ;

           this.setLastNumberToDisplay();
           this.pastFromClipboard();

           document.querySelectorAll('.btn-ac').forEach(btn=>{
 
              btn.addEventListener('dblclick', e=> {
                
                this.toggleAudio();
              });
           });
          }


        toggleAudio() {
            
            this._AudioOnOff = !this._AudioOnOff; 
          }


        playAudio() {

            if (this._AudioOnOff) {

                this._audio.currentTime = 0; //reseta o audio a cada clique 
                this._audio.play();

            }
          }

        initKeyBoard() {

            document.addEventListener('keyup', e=>{

                this.playAudio();

                switch (e.key) {

                   case 'Escape':
                    this.clearAll();
                     break;


                   case 'Backspace':
                    this.clearEntry();
                     break;

                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case '%':
                     this.addOperation(e.key);
                      break;   

                    case 'Enter':
                    case '=':
                     this.calc();                  
                      break;

                    case '.':
                    case ',':
                     this.addDot();                     
                      break;
                                  
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6': 
                    case '7': 
                    case '8': 
                    case '9': 
                       this.addOperation(parseInt(e.key));
                       break;  

                    case 'c':
                        if(e.ctrlKey) this.copyToClipboard();
                        break;               
           }
       });
  }

          
            //Transformando string->array,e assim usando evento multiplos em cada elemento da array
        addEventListenerAll(element, events ,fn) { 

              events.split(' ').forEach(event => {
                 element.addEventListener(event, fn ,false);
              });
          }


              //limpa todo o array
        clearAll() { 

              this._operation = [];
              this._lastNumber = '';
              this._lastOperator = '';

              this.setLastNumberToDisplay();
              
             }


              //limpar o valor que esta sendo inserido no momento no display
        clearEntry() { 

                  this._operation.pop();

                  this.setLastNumberToDisplay();
             }


        getLastOperation() {
              return this._operation[this._operation.length-1]; 
               
            }


        setLastOperation(value) {
                this._operation[this._operation.length-1] = value;
            }


        isOperator(value) {

                return (['+','-','*','/',"%"].indexOf(value) > -1);
                 
              }


        pushOperation(value) {
                this._operation.push(value);

                if(this._operation.length > 3 ) {
            
                    this.calc();
                  
                }

              }

              
        getResult ()  {              

                try {
                  return eval(this._operation.join(""));
                }catch(e) {
                  setTimeout(()=>{
                    this.setError();
                  }, 1);
                  
                }
              }


        calc() {

                let last = '';

                this._lastOperator = this.getLastItem();

                if (this._operation.length < 3 ) {

                   let firstItem = this._operation[0];
                   this._operation = [firstItem, this._lastOperator, this._lastNumber];   
                
                }

                if (this._operation.length > 3 ) {

                    last = this._operation.pop();                                 
                    this._lastNumber = this.getResult();

                } else if (this._operation.length == 3 ) {
                  
                    this._lastNumber = this.getLastItem(false);
                
                }               
              
               let result =  this.getResult();
               
               if(last == '%') {

                    result /= 100;
                    
                    this._operation = [result];

              }else {


                this._operation = [result];

                if(last) this._operation.push(last);

               }
                          

               this.setLastNumberToDisplay();
              }


        getLastItem(isOperator = true) { 

                let lastItem;              

                for (let i = this._operation.length-1; i >= 0; i--){

                  if (this.isOperator(this._operation[i]) == isOperator) {
                      lastItem = this._operation[i];
                      break;               
                  }
                }

                if(!lastItem) {

                  lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

                }

                    return lastItem;
              } 


        setLastNumberToDisplay() {

                let lastNumber = this.getLastItem(false);
                                                                           
                if (!lastNumber) lastNumber = 0;

                this.displayCalc = lastNumber;

              }


              //Adiciona um novo valor a base da fila 
        addOperation(value){ 

                if (isNaN(this.getLastOperation())) {  //string

                    if(this.isOperator(value)) {
                         
                         this.setLastOperation(value);
                                                 
                    }  else {

                      this.pushOperation(value);

                      this.setLastNumberToDisplay();
                                                                                                         
                    }
                  

                  } else {

                      if(this.isOperator(value)) {

                       this.pushOperation(value);

                      } else {

                      let newValue = this.getLastOperation().toString() + value.toString();
                      this.setLastOperation(newValue);

                      this.setLastNumberToDisplay();
                        
                      }
      
                   }
        
             }


              //mensagem de erro
        setError(){
                 this.displayCalc = "ERROR";
             }

        addDot() {

             let lastOperation = this.getLastOperation();

                if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

                  if(this.isOperator(lastOperation) || !lastOperation) {
                    this.pushOperation('0.');
                    } else {
                    this.setLastOperation(lastOperation.toString() + '.');
                  }

                  this.setLastNumberToDisplay();

             }


        execBtn(value) {

              this.playAudio();

                switch (value) {

                    case 'ac':
                      this.clearAll();
                      break;

                    case 'ce':
                      this.clearEntry();
                      break;

                    case 'soma':
                          this.addOperation('+');          
                     break;

                    case 'subtracao':
                          this.addOperation('-');                      
                      break;

                    case 'divisao':
                      this.addOperation('/');                   
                      break;

                    case 'multiplicacao':
                      this.addOperation('*');
                      break;

                    case 'porcento':
                      this.addOperation('%');
                      break;
                  
                    case 'igual':
                      this.calc('=');                     
                      break;

                    case 'ponto':
                        this.addDot();                         
                      break;
                    

                      //reconhece o numero a partir da acao
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6': 
                    case '7': 
                    case '8': 
                    case '9': 
                        this.addOperation(parseInt(value));
                        break;  

                    default:
                       this.setError();
                        break;

              }
            }

             //cria uma variavel que recebe todos os dependentes de classes, e adicionando um evento para cada um deles
        initButtonsEvents() {
              let buttons = document.querySelectorAll("#buttons > g, #parts > g");   // > = tags g filha de buttons
        

              buttons.forEach((btn,index) => {  //2 argumentos precisa de () 
                 this.addEventListenerAll(btn,"click drag", e => {
                   let textBtn = btn.className.baseVal.replace("btn-","");
                  
                     this.execBtn(textBtn);
                });
                  

                  this.addEventListenerAll(btn,"mouseover moseup mousedown", e => {
                       btn.style.cursor = "pointer";
                  });
              });
            }


              //personaliza data/hora e acertando diretamente local do usuario
        setDisplayDateTime() {  
                this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
              
                day: "2-digit",

                month:"long", 

                year:"numeric"

              });


              this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
           }


      get displayTime() {
          return this._timeEl.innerHTML;
      }

      set displayTime(value) {
        return this._timeEl.innerHTML = value ;
      }
      
      get displayDate() {
        return this._dateEl.innerHTML;
      }

      set displayDate(value) {
        return this._dateEl.innerHTML = value ;
      }

      get displayCalc() {
        return this._displayCalcEl.innerHTML;
      }

      set displayCalc(value) { 

        if(value.toString().length > 10) {
          this.setError();
          return false;
       }
        this._displayCalcEl.innerHTML = value;   
      }

      get currentDate() {
       return new Date();
      }
     
      set currentDate(value) { 
        this._currentDate = value;
      }
}