# Intonarumori

Intonarumori is a project to explore creating sounds, rhythms and music with simulated machines.

[Intonarumori](https://en.wikipedia.org/wiki/Intonarumori) was the name of the experimental musical instruments invented and built by the Italian futurist artist [Luigi Russolo](https://en.wikipedia.org/wiki/Luigi_Russolo) in the early twentieth century.

<div style="display: flex; justify-content: space-between;">
<div style="max-width:49%;">

![Russolo's laboratory](assets/img/art_2130_1_intonarumori.jpg 'Russolo\'s laboratory')

</div>
<div style="max-width:49%;">

![Jean Tinguely](assets/img/jean-tinguely.jpg 'Jean Tinguely')

</div>
</div>

This project takes inspiration from Russolo and his Intonarumori, as well as from [Jean Tinguely](https://en.wikipedia.org/wiki/Jean_Tinguely), an artist known for his kinetic art sculptures. Machinelike artworks that often produced repetitive noise and sounds.

In this project the aim is to create virtual machines that run in a web browser. They generate their sounds through the computer's speaker and are operated by mouse click, a device's touch screen or externally via MIDI signals.

## Kodaly Kibo

![Kodaly Kibo](assets/img/kibo-bb-prospettiva.png 'Kodaly Kibo')

For MIDI control the machines are especially designed to work with the [Kodaly Kibo](https://www.kodaly.app/). The Kibo is a MIDI controller with eight wooden shapes that can be played like drum pads or piano keys. MIDI transmits wireless over Bluetooth LE or over USB cable.

Only common MIDI messages are used however, so other MIDI controllers can be used as well.

## Machine #1

<div style="max-width:648px;">

![Machine 1](assets/img/machine1.jpg 'Machine 1')

</div>

Demo online here: [https://www.hisschemoller.com/intonarumori/1/](https://www.hisschemoller.com/intonarumori/1/)

Machine 1 has eight spinning wheels with protrusions that hit free floating sticks. When hit they trigger eight samples of Indonesian Gamelan instrument sounds. Each wheel spins at it's own speed. This creates interesting continually changing patterns.

The speed of each wheel can be set individually by eight sliders in the control panel, or by incoming MIDI continuous controllers 1 to 8 on any MIDI channel.

The toggle buttons below the sliders switch the wheels on and off.

### MIDI implementation

On any MIDI channel:

- CC 1 to 8 - Rotation speed of the eight wheels.
- CC 102 TO 109 - On / Off toggle for each wheel, where:
  - Value 127 switches the wheel on.
  - Values 126 and below switch the wheel off.

## Code

This project is written in [TypeScript](https://www.typescriptlang.org/). It's built on the [Vue 3](https://v3.vuejs.org/) framework with [VueX](https://vuex.vuejs.org/) and the [PrimeVUE](https://www.primefaces.org/primevue/) components library. The machines are made with [three.js](https://threejs.org/) and the [ammo.js](https://github.com/kripken/ammo.js/) physics engine.
