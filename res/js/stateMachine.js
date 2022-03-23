class StateMachine
{
    constructor(numberOfStates = 1) {
        this.maxState = numberOfStates - 1;
        this.state = 0;
    }

    nextState() {
        this.state = this.state >= this.maxState? 0 : this.state + 1;
    }
}
