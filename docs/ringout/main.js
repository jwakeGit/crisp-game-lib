title = "RINGOUT";

description = `
[Tap] Punch
[Hold] Block
`;

characters = [
`
   ll
   ll
 llrrr
l b   
 b b
b  b
`,
`
  ll
l ll
llcc
 b  c
b b
b  b
`,
`
  ll
  ll
lll
l bLL
 b b
 b  b
`,
`
ll L
llL
 ll bb
l  b
l   b
   b
`,
`
  rr
  rr
  
  bb
  
  bb
`,
`
 ll
 ll
rrrll
   p l
  p p
  p  p
`,
`
  ll  
  ll l
  ccll
 c  p
   p p
  p  p
`,
`
  ll
  ll
   lll
 LLp l
  p p
 p  p
`,
`
  L ll
   Lll
pp ll
  p  l
 p   l
  p
`,
];

options = {
  viewSize: { x: 80, y: 50 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 18,
};

const S = {
  BLOCK_PRESS_THRESHOLD: 10,
  PUNCH_DURATION: 15,
  FLINCH_DURATION: 60,
}

/**
 * @typedef {{
  * pos: Vector,
  * anims: string[],
  * currAnim: number,
  * animTimer: number
  * state: string
  * }} Fighter
  */
 
 /**
  * @type { Fighter }
  */
 let player;

 /**
  * @type { Fighter }
  */
 let enemy;

 /**
  * @type { Fighter }
  */
 let currFighter;

let ex;
let leftGoalPos;
let rightGoalPos;
let px;

let currAnim = "c";
let animTimer;
let pState;

let pressDuration;

function update() {
  if (!ticks) {
    Initialize();
    
  }
  color("black");
  rect(10, 36, 60, 20);
  char("e", leftGoalPos);
  char("e", rightGoalPos);

  
  currFighter = player;
  MovePlayer();
  char(player.anims[player.currAnim], player.pos);

  currFighter = enemy;
  MoveEnemy();
  char(enemy.anims[enemy.currAnim], enemy.pos);
  
}

function Initialize(){
  player = {
    pos: vec(30, 33),
    anims: ["a", "b", "c", "d"],
    currAnim: 2,
    animTimer: 0,
    state: "idle"
  };
  currFighter = player;
  player.state = pMachine.value;

  enemy = {
    pos: vec(49, 33),
    anims: ["f", "g", "h", "i"],
    currAnim: 2,
    animTimer: 0,
    state: "idle"
  };
  currFighter = enemy;
  enemy.state = eMachine.value;
  
  leftGoalPos = vec(10, 32);
  rightGoalPos = vec(68, 32);


  //pState = machine.value
  //console.log(`current state: ${pState}`)
  //pState = machine.transition(pState, 'startblock')
  //console.log(`current state: ${pState}`)
  //pState = machine.transition(pState, 'stoppunch')
  //console.log(`current state: ${pState}`)
}

function MovePlayer(){
  // disable all input if mid-punch
  if (player.state == 'punch'){
    player.animTimer--;
    if (player.animTimer<= 0){
      player.state = pMachine.transition(player.state, 'stoppunch');
    }
    return;
  }

  // Reset press duration upon button press
  if (input.isJustPressed){
    pressDuration = 0;
  } 
  
  // Decide whether the button press is a punch or a block
  if (input.isPressed){
    pressDuration++;
    if (player.state == "idle" && pressDuration > S.BLOCK_PRESS_THRESHOLD){
      player.state = pMachine.transition(player.state, 'startblock');
    }
  }

  // Decide whether the button release should start a punch
  // or should stop blocking
  if (input.isJustReleased){
    if (pressDuration <= S.BLOCK_PRESS_THRESHOLD){
      player.state = pMachine.transition(player.state, 'startpunch');
    }
    else if (player.state == 'block'){
      player.state = pMachine.transition(player.state, 'stopblock');
    } 
    pressDuration = 0;
  }
}

function MoveEnemy(){
  // TO-DO: Add enemy AI
  console.log(enemy.state);
  if (enemy.state == "idle") enemy.state = eMachine.transition(enemy.state, 'startblock');
  return;

}

function createMachine(stateMachineDefinition) {
  const machine = {
    value: stateMachineDefinition.initialState,
    transition(currentState, event) {
      const currentStateDefinition = stateMachineDefinition[currentState]
      const destinationTransition = currentStateDefinition.transitions[event]
      if (!destinationTransition) {
        return
      }
      const destinationState = destinationTransition.target
      const destinationStateDefinition =
        stateMachineDefinition[destinationState]

      destinationTransition.action()
      currentStateDefinition.actions.onExit()
      destinationStateDefinition.actions.onEnter()

      machine.value = destinationState

      return machine.value
    },
  }
  return machine
}


// FSM Setup: Creating states, transitions, and actions
// actions: onEnter() called when a state is entered
//          onExit() called when a state is exited
//          transition actions can be unique for each transition. 
//
// FSM will update whoever the currFighter variable is 
// set to, enabling multi-character management.


const pMachine = createMachine({
  initialState: 'idle',
  idle: {
    actions: {
      onEnter() {
        currFighter.currAnim = 2;
        //currAnim = "c";
        console.log('idle: onEnter')
      },
      onExit() {
        console.log('idle: onExit')
      },
    },
    transitions: {
      startpunch: {
        target: 'punch',
        action() {
          currFighter.animTimer = S.PUNCH_DURATION;
          console.log('transition action for "startpunch" from idle')
        },
      },
      startblock: {
        target: 'block',
        action() {
          currFighter.currAnim = 1;
          //currAnim = "b";
          console.log('transition action for "startblock" from idle')
        },
      },
      startflinch: {
        target: 'flinch',
        action() {
          console.log('transition action for "startflinch" from idle')
        },
      },
    },
  },
  punch: {
    actions: {
      onEnter() {
        currFighter.currAnim = 0;
        currFighter.pos.x += 1;
        //currAnim = "a";
        console.log('punch: onEnter')
      },
      onExit() {
        console.log('punch: onExit')
      },
    },
    transitions: {
      stoppunch: {
        target: 'idle',
        action() {
          console.log('transition action for "stoppunch" from punch')
        },
      },
      isblocked: {
        target: 'flinch',
        action() {
          console.log('transition action for "isblocked" from punch')
        },
      },
    },
  },
  block: {
    actions: {
      onEnter() {
        console.log('block: onEnter')
      },
      onExit() {
        console.log('block: onExit')
      },
    },
    transitions: {
      stopblock: {
        target: 'idle',
        action() {
          
          console.log('transition action for "stopblock" from block')
        },
      },
    },
  },
  flinch: {
    actions: {
      onEnter() {
        console.log('flinch: onEnter')
      },
      onExit() {
        console.log('flinch: onExit')
      },
    },
    transitions: {
      stopflinch: {
        target: 'idle',
        action() {
          console.log('transition action for "stopflinch" from flinch')
        },
      },
    },
  },
})

const eMachine = createMachine({
  initialState: 'idle',
  idle: {
    actions: {
      onEnter() {
        currFighter.currAnim = 2;
        //currAnim = "c";
        console.log('idle: onEnter')
      },
      onExit() {
        console.log('idle: onExit')
      },
    },
    transitions: {
      startpunch: {
        target: 'punch',
        action() {
          currFighter.animTimer = S.PUNCH_DURATION;
          console.log('transition action for "startpunch" from idle')
        },
      },
      startblock: {
        target: 'block',
        action() {
          currFighter.currAnim = 1;
          //currAnim = "b";
          console.log('transition action for "startblock" from idle')
        },
      },
      startflinch: {
        target: 'flinch',
        action() {
          console.log('transition action for "startflinch" from idle')
        },
      },
    },
  },
  punch: {
    actions: {
      onEnter() {
        currFighter.currAnim = 0;
        //currAnim = "a";
        console.log('punch: onEnter')
      },
      onExit() {
        console.log('punch: onExit')
      },
    },
    transitions: {
      stoppunch: {
        target: 'idle',
        action() {
          console.log('transition action for "stoppunch" from punch')
        },
      },
      isblocked: {
        target: 'flinch',
        action() {
          console.log('transition action for "isblocked" from punch')
        },
      },
    },
  },
  block: {
    actions: {
      onEnter() {
        console.log('block: onEnter')
      },
      onExit() {
        console.log('block: onExit')
      },
    },
    transitions: {
      stopblock: {
        target: 'idle',
        action() {
          
          console.log('transition action for "stopblock" from block')
        },
      },
    },
  },
  flinch: {
    actions: {
      onEnter() {
        console.log('flinch: onEnter')
      },
      onExit() {
        console.log('flinch: onExit')
      },
    },
    transitions: {
      stopflinch: {
        target: 'idle',
        action() {
          console.log('transition action for "stopflinch" from flinch')
        },
      },
    },
  },
})
