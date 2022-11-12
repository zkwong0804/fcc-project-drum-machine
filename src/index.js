import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const PAD_KEYS = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
const AUDIO_LINKS = [
  Audio('Heater 1', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'),
  Audio('Heater 2', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'),
  Audio('Heater 3', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'),
  Audio('Heater 4', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'),
  Audio('Clap', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'),
  Audio('Open-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'),
  Audio('Kick-n\'-Hat', 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'),
  Audio('Kick', 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'),
  Audio('Closed-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3')
];
const DRUM_PAD_PRESSED = 'drum-pad-pressed';

function Audio(name, url) {
  return { name, url };
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'Play something!'
    }

    this.handlePadClick = this.handlePadClick.bind(this);
    this.handleKeyboardKeyDown = this.handleKeyboardKeyDown.bind(this);
    this.handleKeyboardKeyUp = this.handleKeyboardKeyUp.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyboardKeyDown);
    document.addEventListener('keyup', this.handleKeyboardKeyUp)
  }

  handlePadClick(event) {
    const targetPadKey = event.target.dataset.padkey;
    const audioPad = document.querySelector(`#${targetPadKey}`);
    if (!audioPad) {
      console.error(`Pad key: ${targetPadKey} is not bind with any audio element!`);
    }
    // play audio
    this.playAudio(audioPad);

    // apply mouse click effect
    const parentClassList = audioPad.parentElement.classList;
    if (parentClassList.contains(DRUM_PAD_PRESSED)) {
      parentClassList.remove(DRUM_PAD_PRESSED);
    }
    parentClassList.add(DRUM_PAD_PRESSED);
    setTimeout(function () {
      parentClassList.remove(DRUM_PAD_PRESSED);
    }, 100); //remove drum-pad-pressed after 100ms

  }

  handleKeyboardKeyDown(event) {
    const key = event.key.toUpperCase();
    const targetElement = document.querySelector(`#${key}`);
    if (!targetElement) {
      console.error(`key ${key} is not bind to any pad!`);
      return;
    }

    // apply keydown effect
    const parentClassList = targetElement.parentElement.classList;
    if (!parentClassList.contains(DRUM_PAD_PRESSED)) {
      parentClassList.add(DRUM_PAD_PRESSED);
    }

    // play audio
    this.playAudio(targetElement);
  }

  handleKeyboardKeyUp(event) { // no need to play audio
    const key = event.key.toUpperCase();
    const targetElement = document.querySelector(`#${key}`);
    if (!targetElement) {
      console.error(`key ${key} is not bind to any pad!`);
      return;
    }

    // apply keyup effect
    const parentClassList = targetElement.parentElement.classList;
    if (parentClassList.contains(DRUM_PAD_PRESSED)) {
      parentClassList.remove(DRUM_PAD_PRESSED);
    }
  }

  playAudio(audioElement) {
    audioElement.currentTime = 0;
    this.setState({ displayName: audioElement.dataset.name });
    audioElement.play();
  }

  render() {
    const pads = (new Array(9)).fill(undefined).map((x, i) => {
      return <DrumPad key={`PAD_KEY_${PAD_KEYS[i]}`} padKey={PAD_KEYS[i]} handleClick={this.handlePadClick} audio={AUDIO_LINKS[i]} />;
    });

    return (
      <div id='drum-machine'>
        <div className='pad-bank'>
          {pads}
        </div>
        <DrumDisplay displayName={this.state.displayName} />
      </div>
    );
  }
}

function DrumDisplay(props) {
  return (
    <div className='display-panel'>
      <p id='display'>{props.displayName}</p>
    </div>
  );
}

function DrumPad(props) {
  return (
    <div onClick={props.handleClick} data-padkey={props.padKey} className='drum-pad' id={`drum-pad-${props.padKey}`}>
      <audio src={props.audio.url} className='clip' data-name={props.audio.name} id={props.padKey}></audio>
      {props.padKey}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DrumMachine />);
