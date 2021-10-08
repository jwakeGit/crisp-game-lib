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

/** @type { "idle" | "punching" | "blocking" | "hit" } */
let pState;
let px;
/** @type { "idle" | "punching" | "blocking" | "hit" | "defeated" } */
let eState;
let ex;
let leftGoalPos;
let rightGoalPos;

function update() {
  if (!ticks) {
    Initialize();
    
  }
  color("black");
  rect(10, 36, 60, 20);
  char("e", leftGoalPos);
  char("e", rightGoalPos);

  if(pState == "idle"){
    char("c", vec(px, 33));
  }
  
  if(eState == "idle"){
    char("h", vec(ex, 33));
  }
  
}

function Initialize(){
  px = 30;
  ex = 49;
  pState = "idle";
  eState = "idle";
  leftGoalPos = vec(10, 32);
  rightGoalPos = vec(68, 32);


  let state = machine.value
  console.log(`current state: ${state}`)
  state = machine.transition(state, 'startpunch')
  console.log(`current state: ${state}`)
  state = machine.transition(state, 'stoppunch')
  console.log(`current state: ${state}`)
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

const machine = createMachine({
  initialState: 'idle',
  idle: {
    actions: {
      onEnter() {
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
          console.log('transition action for "startpunch" from idle')
        },
      },
      startblock: {
        target: 'block',
        action() {
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

