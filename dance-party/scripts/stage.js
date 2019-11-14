// Another way to do that was commented

// function Dancer (top, left) {
//   const dancer = {};
//   dancer._node = document.createElement('div');
//   dancer._node.classList.add('dancer');
//   dancer.setPosition = (top, left) => {
//     // Use css top and left properties to position our <div> tag
//     // where it belongs on the page.
//     dancer._node.style.top = top;
//     dancer._node.style.left = left;
//   };
//   // Now that we have defined the dancer object, we can start setting up
//   // important parts of it by calling the methods we wrote. This one
//   // sets the position to some random default point within the body.

//   const stage = document.getElementById('stage');
//   const random = max => Math.floor(Math.random() * max);

//   dancer.setPosition(random(stage.offsetHeight), random(stage.offsetWidth));
//   return dancer;
// }


// Let the code start

// Utility function to generate random numbers
const random = max => Math.floor(Math.random() * max);

// Global stage object
const stage = {
  _node: document.getElementById('stage'),
  state: 'stopped',
  dancer: [],
  interval: [],
  height: document.getElementById('stage').offsetHeight,
  width: document.getElementById('stage').offsetWidth,
  followMouse: false,
  render(dancer) {
    this._node.append(dancer._node);
    this.dancer.push(dancer);
    this.getCenterOfMass();
  },
  moveAll() {
    this.stopAll();
    this.dancer.forEach((dancer) => {
      this.interval.push(setInterval(() => {
        const chance = this.followMouse ? 4 : 7;
        random(10) < chance ? dancer.move() : dancer.moveTo(this.comY, this.comX);
        this.getCenterOfMass();
      }, 60));
    });
    this.state = 'moving';
  },
  stopAll() {
    this.interval.forEach(i => clearInterval(i));
    this.state = 'stopped';
  },
  restAll() {
    this.stopAll();
    this.dancer.forEach((dancer) => {
      this.interval.push(setInterval(() => dancer.move(6), 60));
    });
    this.state = 'resting';
  },
  update() {
    switch (this.state) {
    case 'moving':
      this.moveAll();
      break;
    case 'resting':
      this.restAll();
      break;
    case 'stopped':
    default:
      this.stopAll();
    }
  },
  getCenterOfMass() {
    if (this.followMouse) {
      const headerHeight = document.getElementById('header').offsetHeight;
      onmousemove = (e) => {
        this.comX = e.clientX;
        this.comY = e.clientY - headerHeight;
      };
    } else {
      const l = this.dancer.length;
      const comX = this.dancer.reduce((a, { left }) => a + left, 0) / l;
      const comY = this.dancer.reduce((a, { top }) => a + top, 0) / l;
      this.comX = Math.round(comX);
      this.comY = Math.round(comY);
    }
  },
  toggleMouseFollow() {
    this.followMouse = !this.followMouse;
  }
};

// CLASSES
// Mr. Dancer
class Dancer {
  constructor() {
    this._node = document.createElement('div');
    this._node.classList.add('dancer');
    this.top = random(stage.height);
    this.left = random(stage.width);
    this._node.style.top = this.top;
    this._node.style.left = this.left;
    stage.render(this);
    stage.update();
  }

  updatePosition() {
    this._node.style.top = this.top;
    this._node.style.left = this.left;
  }

  getRandomValue() {
    const randomValues = [-6, -4, -2, 2, 4, 6];
    return randomValues[random(randomValues.length)];
  }

  move(y, x) {
    y = y !== undefined ? this.top + y : this.top + this.getRandomValue();
    x = x !== undefined ? this.left + x : this.left + this.getRandomValue();
    this.top = y < 0 || y > stage.height - 15 ? this.top : y;
    this.left = x < 0 || x > stage.width - 15 ? this.left : x;
    this.updatePosition();
  }

  moveTo(comY, comX) {
    const ySign = comY < this.top ? -1 : 1;
    const xSign = comX < this.left ? -1 : 1;
    const dy = Math.abs(this.top - comY);
    const dx = Math.abs(this.left - comX);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const da = Math.abs(angle % 90);
    let x = 6 - Math.round(da / 15);
    let y = 6 + x;
    this.move(ySign * y, xSign * x);
  }
}

// TapDancer that is sub-class of a Dancer
class TapDancer extends Dancer {
  constructor () {
    super();
    this._node.classList.add('tap-dancer');
  }
}

// RainbowDancer that is sub-class of a Dancer
class RainbowDancer extends Dancer {
  constructor () {
    super();
    this._node.classList.add('rainbow-dancer');
  }
}
