/*
 * Mock data for the Kohler Konnect prototype.
 * All values are local: there is no backend in this build.
 * `accent` and `tone` are colour token names; resolve them with KK.c(name) (see js/ui.js).
 * `icon` values are glyph names from js/icons.js.
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
        { id: 'fill', label: 'PerfectFill', icon: 'water-outline', on: true },
        { id: 'sound', label: 'SoundTile', icon: 'volume-high-outline', on: false },
        { id: 'warm', label: 'Warm floor', icon: 'thermometer-outline', on: true },
      ],
    },
    tub: {
      id: 'tub',
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
        { id: 'soak', label: 'Restore soak', icon: 'sparkles-outline', on: false },
        { id: 'heat', label: 'Warm floor', icon: 'thermometer-outline', on: true },
        { id: 'scent', label: 'Scent', icon: 'leaf-outline', on: false },
      ],
    },
    vanity: {
      id: 'vanity',
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
        { id: 'glow', label: 'Mirror glow', icon: 'bulb-outline', on: true },
        { id: 'seam', label: 'Circadian seam', icon: 'sunny-outline', on: true },
        { id: 'sense', label: 'Vanity Sense', icon: 'pulse-outline', on: false },
      ],
    },
    toilet: {
      id: 'toilet',
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
        { id: 'seat', label: 'Seat warmth', icon: 'thermometer-outline', on: true },
        { id: 'stand', label: 'Sit-to-stand', icon: 'accessibility-outline', on: false },
      ],
    },
    faucet: {
      id: 'faucet',
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
        { id: 'save', label: 'Flow saver', icon: 'water-outline', on: true },
        { id: 'hot', label: 'Instant hot', icon: 'flame-outline', on: false },
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

  var stats = [
    {
      id: 'recovery',
      name: 'Recovery',
      value: 78,
      unit: '',
      tone: 'success',
      delta: 'Up 4 this month',
      source: 'Vanity Sense',
      icon: 'pulse-outline',
      series: [62, 66, 61, 70, 74, 72, 78], // 7-day
      highlights: [
        'Resting heart rate drift is easing — a good sign your body is recovering.',
        'Paired with a calmer evening; your 21:00 Restore soak tracks with this trend.',
      ],
      sources: {
        group: 'How this is measured',
        items: ['Vanity Sense · palm read', 'Wearable · overnight', 'Toilet · sit-to-stand'],
      },
    },
    {
      id: 'hydration',
      name: 'Hydration',
      value: 64,
      unit: '%',
      tone: 'primary',
      delta: 'Steady this month',
      source: 'Vanity Sense + Dekoda',
      icon: 'water-outline',
      series: [70, 66, 68, 61, 65, 60, 64],
      highlights: ['Skin hydration dipped mid-week and is recovering.', 'A warmer pre-shower can improve morning readings.'],
      sources: {
        group: 'How this is measured',
        items: ['Vanity Sense · skin hydration', 'Dekoda · per session'],
      },
    },
    {
      id: 'steadiness',
      name: 'Steadiness',
      value: 88,
      unit: '',
      tone: 'success',
      delta: 'Up 2 this month',
      source: 'Shower wall radar',
      icon: 'accessibility-outline',
      series: [82, 84, 80, 86, 85, 87, 88],
      highlights: ['No near-miss events this month.', 'Night path lights reduced night bathroom visits.'],
      sources: {
        group: 'How this is measured',
        items: ['Shower wall radar', 'Floor pressure tiles', 'Night path lights'],
      },
    },
    {
      id: 'stress',
      name: 'Stress',
      value: 31,
      unit: '',
      tone: 'energy',
      delta: 'Down 6 this month',
      source: 'Vanity Sense (HRV)',
      icon: 'flash-outline',
      series: [48, 45, 40, 44, 38, 35, 31],
      highlights: ['HRV trending up — a strong indicator of lower stress.', 'Calmest on days the evening restore routine ran.'],
      sources: {
        group: 'How this is measured',
        items: ['Vanity Sense · HRV', 'Wearable · sleep'],
      },
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
        { label: 'Anthem+ Shower', value: 'Connected' },
        { label: 'Shore Bathtub', value: 'Connected' },
        { label: 'PureWarmth Toilet', value: 'Updating…', badge: 'FW 2.4' },
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
    { icon: 'water-outline', name: 'Anthem+ Shower', room: 'Bathroom', state: 'connected' },
    { icon: 'sparkles-outline', name: 'Shore Bathtub', room: 'Bathroom', state: 'connected' },
    { icon: 'home-outline', name: 'Smart Wall · Mirror', room: 'Bathroom', state: 'connected' },
    { icon: 'thermometer-outline', name: 'PureWarmth Toilet', room: 'Bathroom', state: 'updating' },
    { icon: 'restaurant-outline', name: 'Smart Faucet', room: 'Kitchen', state: 'connected' },
  ];

  KK.data = {
    rooms: rooms,
    products: products,
    roomProducts: roomProducts,
    routines: routines,
    routineSteps: routineSteps,
    stats: stats,
    accountSections: accountSections,
    onboardingDevices: onboardingDevices,
  };
})();
