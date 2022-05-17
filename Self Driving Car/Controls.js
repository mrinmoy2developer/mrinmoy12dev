class Control{
    constructor(type="KEYS"){
        this.f=false;
        this.l=false;
        this.r=false;
        this.b=false;
        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "FAKE":
                this.f=1;
        }
    }
    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.l=1;
                    break;
                case "ArrowUp":
                    this.f=1;
                    break;
                case "ArrowRight":
                    this.r=1;
                    break;
                case "ArrowDown":
                    this.b=1;
                    break;

            }
            // console.table(this);
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.l=0;
                    break;
                case "ArrowUp":
                    this.f=0;
                    break;
                case "ArrowRight":
                    this.r=0;
                    break;
                case "ArrowDown":
                    this.b=0;
                    break;

            }
            // console.table(this);
        }
    }
}
