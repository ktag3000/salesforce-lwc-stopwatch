import { LightningElement } from 'lwc';

export default class StopWatch extends LightningElement {

    timer = '00:00:00'
    timerRef 
    
    actionHandler(event){
        const {label} = event.target
        if(label === 'Start'){
            this.setTimer() 
        }
        if(label === 'Stop'){
            window.clearInterval(this.timerRef)
            window.localStorage.removeItem('startTimer') 
        }
        if(label === 'Reset'){
            this.timer='00:00:00'
            window.clearInterval(this.timerRef) 
            window.localStorage.removeItem('startTimer') 
        }
        
    }

    StartTimerHandler(){
        const startTime = new Date() 
        window.localStorage.setItem('startTimer', startTime)
        return startTime
    }
    
    setTimer(){
        const startTime = new Date( window.localStorage.getItem("startTimer") || this.StartTimerHandler())
        this.timerRef = window.setInterval(()=>{
            const secsDiff = new Date().getTime() - startTime.getTime()
            this.timer = this.secondToHms(Math.floor(secsDiff/1000))
        }, 1000)
    }

secondToHms(d) {
    d = Number(d);
    const h = String(Math.floor(d / 3600)).padStart(2, '0');
    const m = String(Math.floor((d % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(d % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

    // What does this do?
    connectedCallback(){
        if(window.localStorage.getItem("startTimer")){
            this.setTimer()
        }
    }
}