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
    px = 30;
    ex = 49;
    pState = "idle";
    eState = "idle";
    leftGoalPos = vec(10, 32);
    rightGoalPos = vec(68, 32);
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
