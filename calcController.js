// classes são formadas por atributos e metodos;
// regras  de encapsulamente public - protected - private;
// "_" indica um atributos privados
//getter e setters - definem como os dados podem ser acessados
// for each - serve como um laço que repete uma variavel especifica
//toString, transforma um numero em string
//eval, faz operações matematicas com numeros em formato de string, pore, ela é perigosa para a segurança.
//parsefloat, usando para programar o ponto, autoriza numero com casas decimais
class CalcColntroller{
    constructor(){
        this.audioOn = new Audio('click.mp3');
        this._playAudio = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displaycalcEL = document.querySelector("#display");
        this._dateEL = document.querySelector("#data");
        this._timeEL = document.querySelector("#hora");
        this._dataAtual;
        this._locale = ("pt-BR");
        
        this.initialized();
        this.InitBttnEvents();
        this.initKeyBoard();
    }
    copyToClipBoard(){ //add cntrl+c e cntrl+v;
        let input = document.createElement("input");

        input.value = this.displaycalc;

        document.body.appendChild(input);

            input.select();

            document.execCommand("Copy");

            input.remove();
    }
    pasteToClipBoard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('text');
            this.displaycalc = parseFloat(text);
        })
    }
    initialized(){
        setInterval(() => {
            this.displayDate = this.dataAtual.toLocaleDateString(this._locale);
            this.displayTime = this.dataAtual.toLocaleTimeString(this._locale);

        }, 1000);
        this.pasteToClipBoard();
        this.AttDisplay();
        
        document.querySelectorAll('.btn-ac').forEach(btn =>{
        
            btn.addEventListener('dblclick', e=>{
                   
                    this.toggleBtn();
                
            });
        });

    }

        toggleBtn(){
            this._playAudio = (this._playAudio) ? false : true; //if ternario
        }

        playAudio(){    

            if (this._playAudio){
                this.audioOn.currentTime = 0;
                this.audioOn.play();

            }
        }

    initKeyBoard(){ // capiturando eventos com o teclado 
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
                    this.addOperator(e.key)
                    break;

                case '=':
                case 'Enter':
                    this.Calc();
                    break;
                case 'ponto':
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
                    this.addOperator(parseInt(e.key));
                    break;
                case 'c':
                        if (e.ctrlKey)
                            this.copyToClipBoard();
                        break;
                case 'v':
                    if(e.ctrlKey)
                    this.pasteToClipBoard();
                break;
                }
        })
    }

    addEventListenerAll(elements/*elementos*/, events/*eventos*/, fn/*funçoes*/){
        events.split(' ')/* determina a forma de separar os eventos da linha37*/
        .forEach(event =>{
            elements.addEventListener(event,fn, false);
        });
        this.AttDisplay();


    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.AttDisplay();

    }
    clearEntry(){
        this._operation.pop();
        this.AttDisplay();
    }

    isOperator(value){ // declarando tipos de operadores
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1) ;
    }
    getLastOperation(){ // salvando o operador passado
        return this._operation[this._operation.length -1];
    }
    setLastOperation(value){ // salvando operação passado
        this._operation[this._operation.length -1] = value;
    }
    
    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){

            console.log(this._operation);

            this.Calc();
        }

     }

    getresult(){
        try{
            return  eval(this._operation.join(""));
        
        }catch(e){
            setTimeout(()=>{
            this.setError();
            }, 1); 
        } 
    }

     Calc(){
        let last = '';
        
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firtsItem = this._operation[0];

            this._operation=[ firtsItem, this._lastOperator, this._lastNumber];
        }
        
        if (this._operation.length > 3){
        
            last = this._operation.pop();

            this._lastNumber = this.getresult();

        }else  if (this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);
        }
      
        let func = this.getresult();

        if ( last == '%'){

            func = func / 100;        // ou             func /= 100;

            this._operation = [func];

        }else{

            
            this._operation = [func];

            if (last) this._operation.push(last);
        }
        
            
            this.AttDisplay();

     }

     getLastItem(isOperator = true){
        let lastNumber;
        
        for (let i = this._operation.length -1; i >= 0; i--){ //'-1' pois o indice do array sempre começa em 0, logo para printar na tela precisara ser o i -1

                if (this.isOperator(this._operation[i]) == isOperator){

                    lastNumber = this._operation[i];

                    break; 
                }  
            }
            
            if (!lastNumber){
               lastNumber = (isOperator) ? this._lastOperator : this._lastNumber; // if ternario, : = senao; ? = entao; 
            
            }

            return lastNumber;  
        }
      

     AttDisplay(){
            let lastNumber;
            for (let i = this._operation.length -1; i >= 0; i--){ //'-1' pois o indice do array sempre começa em 0, logo para printar na tela precisara ser o i -1
                
            if (!this.isOperator(this._operation[i])){

                    lastNumber = this._operation[i];

                    break;
                }
            }
            if (!lastNumber) lastNumber = 0;
            this.displaycalc = lastNumber
        }

    addOperator(value){
        if (isNaN(this.getLastOperation())){
            
            if (this.isOperator(value)){

                this.setLastOperation(value); // realizando a troca da operação caso foi repetida

            }else{
                this.pushOperation(value);

                this.AttDisplay();
            }

        }else{

            if (this.isOperator(value)){

                this.pushOperation(value);

            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                
                this.setLastOperation(newValue);
                
                this.AttDisplay();
            }
        }
    }

    addDot(){
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; 
        
        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.'); //add quando n houver  uma operação antiga
        } else {
            this.setLastOperation(lastOperation.toString() + '.'); // concatenando  a string com o ponto
      
        }
            this.AttDisplay(); // atualizando display
    }

    setError(){
        this.displaycalc = 'Error'
    }
    
    execBttn(value){

        this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperator('+');
                break;
            case 'subtracao':
                this.addOperator('-');
                break; 

                case 'multiplicacao':
                    this.addOperator('*')
                break;

            case 'divisao':
                this.addOperator('/');
                break;  

            case 'porcento':
                this.addOperator('%');
                break;

                case 'igual':

                this.Calc();

                break;
                case 'ponto':
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
                this.addOperator(parseInt(value));
                break;
        }

    }


    InitBttnEvents(){
      let buttons = document.querySelectorAll("#buttons > g, #parts, g");     
        // TRAZ TODOS OS ELEMENTOS QUE CASAM COM AS TAGS INDICADAS NAS ()
        buttons.forEach((btn, index) =>{
           
            this.addEventListenerAll(btn, "click drag", e=> {// add eventos porem, apenas um por vez
                                                            //addeventlistenner recebe dois paramentros, o tipo de evento no caso o click e dps suas condiçoes
            let TextBtn = btn.className.baseVal.replace("btn-","");
                this.execBttn(TextBtn);
        });

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
            btn.style.cursor = "pointer"
            }); // add efeitos no cursor do mouse, sempre assim para add eventos novos
        });

    }

    get displayTime(){
        return this._timeEL.innerHTML;
    }

    set displayTime(value){
        return this._timeEL.innerHTML = value;

    }

    get displayDate(){
        return this._dateEL.innerHTML;

    }

    set displayDate (value){
        this._dateEL.innerHTML = value;

    }

    get displaycalc(){
        return this._displaycalcEL.innerHTML;

    }
    set displaycalc(value){

        if ( value.toString().length > 10 ){
            return this.setError();
        }
        this._displaycalcEL.innerHTML = value;
    }

    get dataAtual(){
        return  new Date();
    }

    set _dataAtual (value){
        this._dataAtual = value;
    }

}