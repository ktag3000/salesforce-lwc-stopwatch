import { LightningElement } from 'lwc';

export default class StopWatch extends LightningElement {
    timer = '00:00:00';
    hoursDecimal = '0.00';
    timerRef;
    startTime = null; // actual timestamp when the timer started (minus elapsed)
    elapsed = 0;      // elapsed time in milliseconds

    actionHandler(event) {
        const { label } = event.target;

        if (label === 'Start') {
            this.startTimer();
        }

        if (label === 'Stop') {
            this.stopTimer();
        }

        if (label === 'Reset') {
            this.resetTimer();
        }
    }

    startTimer() {
        if (this.timerRef) return; // Avoid starting multiple intervals

        // Resume from elapsed if paused, or set new start time
        const now = Date.now();
        this.startTime = now - this.elapsed;

        this.timerRef = setInterval(() => {
            this.elapsed = Date.now() - this.startTime;

            // Running timer
            this.timer = this.secondToHms(Math.floor(this.elapsed / 1000));
            console.log('this.timer');
            console.log(this.timer);
            
            // Decimal hours
            this.hoursDecimal = ((this.elapsed / 1000) / 3600).toFixed(2);
            console.log('this.decimalTimer');
            console.log(this.hoursDecimal);
        }, 1000);

        // Persist start and elapsed
        window.localStorage.setItem('startTime', this.startTime);
        window.localStorage.setItem('elapsed', this.elapsed);
    }

    stopTimer() {
        clearInterval(this.timerRef);
        this.timerRef = null;

        // Persist elapsed
        window.localStorage.setItem('elapsed', this.elapsed);
    }

    resetTimer() {
        clearInterval(this.timerRef);
        this.timerRef = null;

        this.elapsed = 0;
        this.timer = '00:00:00';
        this.hoursDecimal = '0.00';
        this.startTime = null;

        // Clear storage
        window.localStorage.removeItem('startTime');
        window.localStorage.removeItem('elapsed');
    }

    secondToHms(d) {
        d = Number(d);
        const h = String(Math.floor(d / 3600)).padStart(2, '0');
        const m = String(Math.floor((d % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(d % 60)).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    connectedCallback() {
        const storedStart = window.localStorage.getItem("startTime");
        const storedElapsed = window.localStorage.getItem("elapsed");

        if (storedStart && storedElapsed) {
            this.startTime = parseInt(storedStart, 10);
            this.elapsed = parseInt(storedElapsed, 10);

            // Resume timer only if it was running before (optional logic)
            this.timer = this.secondToHms(Math.floor(this.elapsed / 1000));
        }
    }
}
