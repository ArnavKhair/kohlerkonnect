/*
 * Mock data for the Kohler Konnect prototype.
 * All values are local: there is no backend in this build.
 * `accent` and `tone` are colour token names; resolve them with KK.c(name) (see js/ui.js).
 * `icon` values are glyph names from js/icons.js.
 * A product's `quick` controls are drawn as callouts on its photo at `x` / `y` (percent of the photo).
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  var rooms = [
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: 'home',
      accent: 'room-bathroom',
      headline: 'Warm · ready',
      value: 39,
      unit: '°C',
      energy: 0.82, // 0..1 progress
      energyLabel: '16h 35m',
      status: 'Everyday',
      statusIcon: 'water-outline',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: 'restaurant-outline',
      accent: 'room-kitchen',
      headline: 'Holding',
      value: 42,
      unit: '°C',
      energy: 0.5,
      energyLabel: '08h 10m',
      status: 'Holding',
      statusIcon: 'flame-outline',
    },
  ];

  var products = {
    shower: {
      id: 'shower',
      image: '', // address of a photo on Kohler's image server; empty shows the icon fallback
      status: 'Ready · 39 °C',
      roomId: 'bathroom',
      name: 'Anthem+ Shower',
      blurb: 'Bathroom · Quick controls',
      icon: 'water-outline',
      accent: 'room-bathroom',
      unit: '°C',
      min: 34,
      max: 46,
      steps: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
      quick: [
        { id: 'fill', label: 'PerfectFill', icon: 'water-outline', on: true, x: 30, y: 70 },
        { id: 'sound', label: 'SoundTile', icon: 'volume-high-outline', on: false, x: 72, y: 26 },
        { id: 'warm', label: 'Warm floor', icon: 'thermometer-outline', on: true, x: 62, y: 84 },
      ],
    },
    tub: {
      id: 'tub',
      image: '', // address of a photo on Kohler's image server; empty shows the icon fallback
      status: 'Idle',
      roomId: 'bathroom',
      name: 'Shore Bathtub',
      blurb: 'Bathroom · Soak & recovery',
      icon: 'sparkles-outline',
      accent: 'room-bathroom',
      unit: '°C',
      min: 35,
      max: 44,
      steps: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
      quick: [
        { id: 'soak', label: 'Restore soak', icon: 'sparkles-outline', on: false, x: 34, y: 52 },
        { id: 'heat', label: 'Warm floor', icon: 'thermometer-outline', on: true, x: 70, y: 84 },
        { id: 'scent', label: 'Scent', icon: 'leaf-outline', on: false, x: 70, y: 24 },
      ],
    },
    vanity: {
      id: 'vanity',
      image: '', // address of a photo on Kohler's image server; empty shows the icon fallback
      status: 'On · 70%',
      roomId: 'bathroom',
      name: 'Smart Wall · Vanity',
      blurb: 'Bathroom · Light & sense',
      icon: 'bulb-outline',
      accent: 'room-bathroom',
      unit: '%',
      min: 10,
      max: 100,
      steps: [10, 25, 40, 55, 70, 85, 100],
      quick: [
        { id: 'glow', label: 'Mirror glow', icon: 'bulb-outline', on: true, x: 50, y: 22 },
        { id: 'seam', label: 'Circadian seam', icon: 'sunny-outline', on: true, x: 24, y: 50 },
        { id: 'sense', label: 'Vanity Sense', icon: 'pulse-outline', on: false, x: 72, y: 66 },
      ],
    },
    toilet: {
      id: 'toilet',
      image: '', // address of a photo on Kohler's image server; empty shows the icon fallback
      status: 'Updating…',
      roomId: 'bathroom',
      name: 'PureWarmth Toilet',
      blurb: 'Bathroom · Comfort',
      icon: 'home-outline',
      accent: 'room-bathroom',
      unit: '°',
      min: 0,
      max: 3,
      steps: [0, 1, 2, 3],
      quick: [
        { id: 'seat', label: 'Seat warmth', icon: 'thermometer-outline', on: true, x: 36, y: 46 },
        { id: 'stand', label: 'Sit-to-stand', icon: 'accessibility-outline', on: false, x: 68, y: 70 },
      ],
    },
    faucet: {
      id: 'faucet',
      image: '', // address of a photo on Kohler's image server; empty shows the icon fallback
      status: 'Holding · 42 °C',
      roomId: 'kitchen',
      name: 'Smart Faucet',
      blurb: 'Kitchen · Water',
      icon: 'restaurant-outline',
      accent: 'room-kitchen',
      unit: '°C',
      min: 20,
      max: 60,
      steps: [20, 30, 40, 50, 60],
      quick: [
        { id: 'save', label: 'Flow saver', icon: 'water-outline', on: true, x: 36, y: 34 },
        { id: 'hot', label: 'Instant hot', icon: 'flame-outline', on: false, x: 66, y: 62 },
      ],
    },
  };

  var roomProducts = {
    bathroom: ['shower', 'tub', 'vanity', 'toilet'],
    kitchen: ['faucet'],
  };

  var routines = [
    { id: 'r1', name: 'Morning reset', when: 'Daily · 7:00', desc: 'Warm floor, bright mirror, 40° shower', active: true },
    { id: 'r2', name: 'Evening restore', when: 'Daily · 21:00', desc: 'Restore soak, dim glow, warm seat', active: true },
    { id: 'r3', name: 'Guest visit', when: 'Scheduled', desc: 'Standard mode, sense off', active: false },
  ];

  /* Building blocks offered by the "Create my own" routine card. */
  var routineSteps = [
    { id: 'warm', label: 'Warm floor', icon: 'thermometer-outline' },
    { id: 'light', label: 'Mirror glow', icon: 'bulb-outline' },
    { id: 'shower', label: '40° shower', icon: 'water-outline' },
    { id: 'seat', label: 'Seat warm', icon: 'flame-outline' },
  ];

  /*
   * Health areas. Each has a living visual (js/healthVisuals.js) driven by its score.
   * `color` is a colour token. `lowerIsBetter` flips the visual (a low Stress score is calm).
   * `series` is the last 7 days; longer ranges are derived from it (mock data).
   */
  var health = [
    {
      id: 'wellness',
      name: 'Wellness',
      visual: 'flower',
      visualCaption: 'The flower opens as your recovery improves.',
      value: 78,
      unit: '',
      color: 'success',
      delta: 'Up 4 this month',
      source: 'Vanity Sense',
      icon: 'pulse-outline',
      series: [62, 66, 61, 70, 74, 72, 78],
      todayNote: 'Resting heart rate drift is easing — a good sign your body is recovering.',
      trendNote: 'Paired with a calmer evening; your 21:00 Restore soak tracks with this trend.',
      sources: ['Vanity Sense · palm read', 'Wearable · overnight', 'Toilet · sit-to-stand'],
    },
    {
      id: 'mobility',
      name: 'Mobility',
      visual: 'horse',
      visualCaption: 'The smoother the stride, the steadier you have been moving.',
      value: 88,
      unit: '',
      color: 'health-mobility',
      delta: 'Up 2 this month',
      source: 'Shower wall radar',
      icon: 'accessibility-outline',
      series: [82, 84, 80, 86, 85, 87, 88],
      todayNote: 'No near-miss events this month.',
      trendNote: 'Night path lights reduced night bathroom visits.',
      sources: ['Shower wall radar', 'Floor pressure tiles', 'Night path lights'],
    },
    {
      id: 'gut',
      name: 'Gut health',
      visual: 'ripples',
      visualCaption: 'Small, even ripples mean a settled gut.',
      value: 69,
      unit: '',
      color: 'health-gut',
      delta: 'Up 5 this month',
      source: 'Dekoda',
      icon: 'leaf-outline',
      series: [61, 64, 60, 66, 65, 68, 69],
      todayNote: 'Readings have been regular for nine days in a row.',
      trendNote: 'Your steadiest weeks line up with better hydration.',
      sources: ['Dekoda · per session', 'Vanity Sense · hydration trend'],
    },
    {
      id: 'hydration',
      name: 'Hydration',
      visual: 'vessel',
      visualCaption: 'The water level is today’s hydration.',
      value: 64,
      unit: '%',
      color: 'primary',
      delta: 'Steady this month',
      source: 'Vanity Sense + Dekoda',
      icon: 'water-outline',
      series: [70, 66, 68, 61, 65, 60, 64],
      todayNote: 'Skin hydration dipped mid-week and is recovering.',
      trendNote: 'A warmer pre-shower can improve morning readings.',
      sources: ['Vanity Sense · skin hydration', 'Dekoda · per session'],
    },
    {
      id: 'stress',
      name: 'Stress',
      visual: 'flame',
      visualCaption: 'A tall, steady flame means a calm day.',
      value: 31,
      unit: '',
      color: 'energy',
      lowerIsBetter: true,
      delta: 'Down 6 this month',
      source: 'Vanity Sense (HRV)',
      icon: 'flash-outline',
      series: [48, 45, 40, 44, 38, 35, 31],
      todayNote: 'HRV trending up — a strong indicator of lower stress.',
      trendNote: 'Calmest on days the evening restore routine ran.',
      sources: ['Vanity Sense · HRV', 'Wearable · sleep'],
    },
  ];

  var accountSections = [
    {
      id: 'privacy',
      title: 'Privacy',
      icon: 'shield-checkmark-outline',
      items: [
        { label: 'Sensing', value: 'On', badge: 'Active' },
        { label: 'Cameras', value: 'None — touch sensors only' },
        { label: 'Sensitive data', value: 'Consented per reading' },
      ],
    },
    {
      id: 'products',
      title: 'Kohler products',
      icon: 'home-outline',
      items: [
        { label: 'Anthem+ Shower', value: 'Connected', product: 'shower' },
        { label: 'Shore Bathtub', value: 'Connected', product: 'tub' },
        { label: 'PureWarmth Toilet', value: 'Updating…', badge: 'FW 2.4', product: 'toilet' },
      ],
    },
    {
      id: 'devices',
      title: 'Connected devices',
      icon: 'phone-portrait-outline',
      items: [
        { label: 'Apple Watch', value: 'Paired' },
        { label: 'iPhone 15', value: 'Paired' },
        { label: 'Vanity tile weight', value: 'Calibrated' },
      ],
    },
    {
      id: 'services',
      title: 'Other services from Kohler',
      icon: 'sparkles-outline',
      items: [
        { label: 'Kohler bathroom design', value: 'Available' },
        { label: 'Kohler Kare', value: 'Member' },
        { label: 'Kohler Pro', value: 'Available' },
      ],
    },
  ];

  /* Devices listed on the onboarding "Connect" step. */
  var onboardingDevices = [
    { icon: 'water-outline', name: 'Anthem+ Shower', product: 'shower', room: 'Bathroom', state: 'connected' },
    { icon: 'sparkles-outline', name: 'Shore Bathtub', product: 'tub', room: 'Bathroom', state: 'connected' },
    { icon: 'home-outline', name: 'Smart Wall · Mirror', product: 'vanity', room: 'Bathroom', state: 'connected' },
    { icon: 'thermometer-outline', name: 'PureWarmth Toilet', product: 'toilet', room: 'Bathroom', state: 'updating' },
    { icon: 'restaurant-outline', name: 'Smart Faucet', product: 'faucet', room: 'Kitchen', state: 'connected' },
  ];

  KK.data = {
    rooms: rooms,
    products: products,
    roomProducts: roomProducts,
    routines: routines,
    routineSteps: routineSteps,
    health: health,
    accountSections: accountSections,
    onboardingDevices: onboardingDevices,
  };
})();
