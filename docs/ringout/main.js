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
  BLOCKED_FLINCH_DURATION: 2,
  PUNCHED_FLINCH_DURATION: 10,
  FLINCH_MOVE_SPEED: 1,
  BLOCK_MOVE_DISTANCE: 1,
  PUNCH_MOVE_DISTANCE: 2,
}

const AI = {
  PUNCH_WEIGHT: 2,
  BLOCK_WEIGHT: 1,
  BLOCK_MIN_TIME: 10,
  BLOCK_MAX_TIME: 60,
  IDLE_MIN_TIME: 10,
  IDLE_MAX_TIME: 30,
}

/**
 * @typedef {{
  * pos: Vector,
  * anims: string[],
  * currAnim: number,
  * animTimer: number
  * state: string
  * moveDir: number
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
let enemyTimer;
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

  currFighter = enemy;
  MoveEnemy();
  char(enemy.anims[enemy.currAnim], enemy.pos);

  currFighter = player;
  MovePlayer();
  let collision = char(player.anims[player.currAnim], player.pos);
  
  if (collision.isColliding.char.g){
    player.state = pMachine.transition('punch', 'isblocked');
    enemy.pos.x += S.BLOCKED_FLINCH_DURATION;
  }
  else if (collision.isColliding.char.h){
    if (player.state == 'punch'){
      currFighter = enemy;
      enemy.state = eMachine.transition('idle', 'startflinch');
      currFighter = player;
    }
  }
  else if (collision.isColliding.char.f){
    if (player.state == 'idle'){
      player.state = pMachine.transition('idle', 'startflinch');
    } else {
      currFighter = enemy;
      enemy.state = eMachine.transition('punch', 'isblocked');
    }
    if (player.state == 'punch'){
      currFighter = player;
      player.state = pMachine.transition('punch', 'isblocked');
    } else if (player.state == 'block'){

    }
  }


}

function Initialize(){
  player = {
    pos: vec(30, 33),
    anims: ["a", "b", "c", "d"],
    currAnim: 2,
    animTimer: 0,
    state: "idle",
    moveDir: 1,
  };
  currFighter = player;
  player.state = pMachine.value;

  enemy = {
    pos: vec(49, 33),
    anims: ["f", "g", "h", "i"],
    currAnim: 2,
    animTimer: 0,
    state: "idle",
    moveDir: -1,
  };
  currFighter = enemy;
  enemy.state = eMachine.value;
  
  leftGoalPos = vec(10, 32);
  rightGoalPos = vec(68, 32);
  enemyTimer = 0;


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
      player.state = pMachine.transition(player.state, 'startidle');
    }
    return;
  }

  // disable input if player is flinching
  if (player.state == 'flinch'){
    player.animTimer--;
    player.pos.x -= S.FLINCH_MOVE_SPEED;
    if (player.animTimer<= 0){
      player.state = pMachine.transition(player.state, 'startidle');
    }
    return;
  }

  if (player.state == 'block'){
    //player.pos.x -= S.BLOCK_MOVE_SPEED;
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
      player.state = pMachine.transition(player.state, 'startidle');
    } 
    pressDuration = 0;
  }
}

function MoveEnemy(){
  // TO-DO: Add enemy AI

  if (enemy.state == 'punch'){
    enemy.animTimer--;
    if (enemy.animTimer<= 0){
      enemy.state = eMachine.transition(enemy.state, 'startidle');
    }
    return;
  }

  // disable input if player is flinching
  if (enemy.state == 'flinch'){
    enemy.animTimer--;
    enemy.pos.x += S.FLINCH_MOVE_SPEED;
    if (enemy.animTimer<= 0){
      enemy.state = eMachine.transition(enemy.state, 'startidle');
    }
    return;
  }

  enemyTimer--;

  if (enemyTimer <= 0){
    if (enemy.state != 'idle'){
      enemy.state = eMachine.transition(enemy.state, 'startidle');
      enemyTimer = rndi(AI.IDLE_MIN_TIME, AI.IDLE_MAX_TIME);
    }
    else {
      let rand = rndi(0, AI.PUNCH_WEIGHT + AI.BLOCK_WEIGHT);
      if (rand < AI.PUNCH_WEIGHT){
        enemy.state = eMachine.transition('idle', 'startpunch');
        enemyTimer = S.PUNCH_DURATION;
      } else {
        enemy.state = eMachine.transition('idle', 'startblock');
        enemyTimer = rndi(AI.BLOCK_MIN_TIME, AI.BLOCK_MAX_TIME)
      }
    }
  }

    
  


  //console.log(enemy.state);
  //if (enemy.state == "idle") enemy.state = eMachine.transition(enemy.state, 'startblock');
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
          
          //currAnim = "b";
          console.log('transition action for "startblock" from idle')
        },
      },
      startflinch: {
        target: 'flinch',
        action() {
          currFighter.animTimer = S.PUNCHED_FLINCH_DURATION;
          play("explosion");
          console.log('transition action for "startflinch" from idle')
        },
      },
    },
  },
  punch: {
    actions: {
      onEnter() {
        currFighter.currAnim = 0;
        currFighter.pos.x += S.PUNCH_MOVE_DISTANCE * currFighter.moveDir;
        //currAnim = "a";
        console.log('punch: onEnter')
      },
      onExit() {
        console.log('punch: onExit')
      },
    },
    transitions: {
      startidle: {
        target: 'idle',
        action() {
          console.log('transition action for "stoppunch" from punch')
        },
      },
      isblocked: {
        target: 'flinch',
        action() {
          currFighter.animTimer = S.BLOCKED_FLINCH_DURATION;
          play("select");
          console.log('transition action for "isblocked" from punch')
        },
      },
    },
  },
  block: {
    actions: {
      onEnter() {
        currFighter.currAnim = 1;
        console.log('block: onEnter')
      },
      onExit() {
        console.log('block: onExit')
      },
    },
    transitions: {
      startidle: {
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
        currFighter.currAnim = 3;
        console.log('flinch: onEnter')
      },
      onExit() {
        console.log('flinch: onExit')
      },
    },
    transitions: {
      startidle: {
        target: 'idle',
        action() {
          console.log('transition action for "stopflinch" from flinch')
        },
      },
    },
  },
})

// Enemy FSM

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
          
          //currAnim = "b";
          console.log('transition action for "startblock" from idle')
        },
      },
      startflinch: {
        target: 'flinch',
        action() {
          currFighter.animTimer = S.PUNCHED_FLINCH_DURATION;
          console.log('transition action for "startflinch" from idle')
        },
      },
    },
  },
  punch: {
    actions: {
      onEnter() {
        currFighter.currAnim = 0;
        currFighter.pos.x += S.PUNCH_MOVE_DISTANCE * currFighter.moveDir;
        //currAnim = "a";
        console.log('punch: onEnter')
      },
      onExit() {
        console.log('punch: onExit')
      },
    },
    transitions: {
      startidle: {
        target: 'idle',
        action() {
          console.log('transition action for "stoppunch" from punch')
        },
      },
      isblocked: {
        target: 'flinch',
        action() {
          currFighter.animTimer = S.BLOCKED_FLINCH_DURATION;
          play("select");
          console.log('transition action for "isblocked" from punch')
        },
      },
    },
  },
  block: {
    actions: {
      onEnter() {
        currFighter.currAnim = 1;
        console.log('block: onEnter')
      },
      onExit() {
        console.log('block: onExit')
      },
    },
    transitions: {
      startidle: {
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
        currFighter.currAnim = 3;
        console.log('flinch: onEnter')
      },
      onExit() {
        console.log('flinch: onExit')
      },
    },
    transitions: {
      startidle: {
        target: 'idle',
        action() {
          console.log('transition action for "stopflinch" from flinch')
        },
      },
    },
  },
})
