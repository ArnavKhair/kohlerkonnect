/*
 * Mock data for the Kohler Konnect prototype.
 * All values are local: there is no backend in this build.
 * `icon` values are glyph names from js/icons.js.
 * A product's `image` is the address of a photo on Kohler's image server (linked, not copied; empty shows
 * the icon fallback). Its `quick` list is the settings you can change on the device page. Each is drawn as
 * a callout at `x` / `y`, in percent of the photo box (4:3, so the square photos lose 12.5% at the top and
 * bottom). One is selected at a time and the stepper below the photo edits it:
 *   steps  the values to choose from, lowest first (numbers, or words such as 'Off', 'Low', 'High')
 *   value  the current one (must be in `steps`)
 *   unit   written after a number ('°C', '%'); leave out for words
 *   scale  what the values are when there is no unit ('Volume', 'Strength'), shown in the control heading
 * The first entry is the product's main setting and is selected when the page opens.
 */
(function () {
  'use strict';
  var KK = (window.KK = window.KK || {});

  var rooms = [
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: 'home',
      headline: 'Warm · ready',
      value: 39,
      unit: '°C',
      energy: 0.82, // 0..1 progress
      energyLabel: '16h 35m',
      status: 'Everyday',
      statusIcon: 'beaker',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: 'wrench-screwdriver',
      headline: 'Holding',
      value: 42,
      unit: '°C',
      energy: 0.5,
      energyLabel: '08h 10m',
      status: 'Holding',
      statusIcon: 'fire',
    },
  ];

  var products = {
    shower: {
      id: 'shower',
      image: 'https://kohler.scene7.com/is/image/PAWEB/GBH_DataDrivenSQTemplate?$product_src=is{PAWEB/28214-ASC-CP_ISO_d2c0089977_rgb}&$PLPDesktop507$&fmt=webp',
      status: 'Ready · 39 °C',
      roomId: 'bathroom',
      name: 'Anthem+ Shower',
      blurb: 'Bathroom · Quick controls',
      icon: 'beaker',
      quick: [
        { id: 'fill', label: 'PerfectFill', icon: 'beaker', x: 30, y: 73, unit: '°C', steps: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], value: 39 },
        { id: 'sound', label: 'SoundTile', icon: 'speaker-wave', x: 80, y: 27, scale: 'Volume', steps: [0, 2, 4, 6, 8, 10], value: 0 },
        { id: 'warm', label: 'Warm floor', icon: 'fire', x: 60, y: 87, unit: '°C', steps: [20, 22, 24, 26, 28, 30], value: 26 },
      ],
    },
    tub: {
      id: 'tub',
      image: 'https://kohler.scene7.com/is/image/PAWEB/GBH_DataDrivenSQTemplate?$product_src=is{PAWEB/25165-0_ISO_d2c0073581_rgb}&$PLPDesktop507$&fmt=webp',
      status: 'Idle',
      roomId: 'bathroom',
      name: 'Shore Bathtub',
      blurb: 'Bathroom · Soak & recovery',
      icon: 'sparkles',
      quick: [
        { id: 'soak', label: 'Restore soak', icon: 'sparkles', x: 40, y: 46, unit: '°C', steps: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44], value: 39 },
        { id: 'heat', label: 'Warm floor', icon: 'fire', x: 66, y: 91, unit: '°C', steps: [20, 22, 24, 26, 28, 30], value: 26 },
        { id: 'scent', label: 'Scent', icon: 'cloud', x: 70, y: 25, scale: 'Strength', steps: ['Off', 'Light', 'Medium', 'Strong'], value: 'Off' },
      ],
    },
    vanity: {
      id: 'vanity',
      image: 'https://kohler.scene7.com/is/image/PAWEB/GBH_DataDrivenSQTemplate?$product_src=is{PAWEB/32760-EMG_ISO_d2c0074427_rgb}&$PLPDesktop507$&fmt=webp',
      status: 'On · 70%',
      roomId: 'bathroom',
      name: 'Smart Wall · Vanity',
      blurb: 'Bathroom · Light & sense',
      icon: 'light-bulb',
      quick: [
        { id: 'glow', label: 'Mirror glow', icon: 'light-bulb', x: 34, y: 15, unit: '%', steps: [10, 25, 40, 55, 70, 85, 100], value: 70 },
        { id: 'seam', label: 'Circadian seam', icon: 'sun', x: 70, y: 34, scale: 'Tone', steps: ['Off', 'Warm', 'Neutral', 'Cool', 'Auto'], value: 'Auto' },
        { id: 'sense', label: 'Vanity Sense', icon: 'signal', x: 34, y: 60, scale: 'Sensing', steps: ['Off', 'On'], value: 'Off' },
      ],
    },
    toilet: {
      id: 'toilet',
      image: 'https://kohler.scene7.com/is/image/PAWEB/GBH_SQTemplate?$product_src=is{PAWEB/5401-PA-HB1_ISO_d2c0020480_rgb}&$PDPDesktopSQ$&fmt=webp',
      status: 'Updating…',
      roomId: 'bathroom',
      name: 'PureWarmth Toilet',
      blurb: 'Bathroom · Comfort',
      icon: 'home',
      quick: [
        { id: 'seat', label: 'Seat warmth', icon: 'fire', x: 44, y: 36, scale: 'Level', steps: ['Off', 'Low', 'Medium', 'High'], value: 'Medium' },
        { id: 'stand', label: 'Sit-to-stand', icon: 'arrow-up-circle', x: 62, y: 70, scale: 'Assist', steps: ['Off', 'Light', 'Full'], value: 'Off' },
      ],
    },
    faucet: {
      id: 'faucet',
      image: 'https://kohler.scene7.com/is/image/PAWEB/GBH_DataDrivenSQTemplate?$product_src=is{PAWEB/77515-CP_ISO_d2c0033632_rgb}&$PLPDesktop507$&fmt=webp',
      status: 'Holding · 42 °C',
      roomId: 'kitchen',
      name: 'Smart Faucet',
      blurb: 'Kitchen · Water',
      icon: 'wrench-screwdriver',
      quick: [
        { id: 'hot', label: 'Instant hot', icon: 'fire', x: 38, y: 86, unit: '°C', steps: [30, 36, 42, 48, 54, 60], value: 42 },
        { id: 'save', label: 'Flow saver', icon: 'beaker', x: 63, y: 58, unit: '%', steps: [40, 55, 70, 85, 100], value: 70 },
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
    { id: 'warm', label: 'Warm floor', icon: 'fire' },
    { id: 'light', label: 'Mirror glow', icon: 'light-bulb' },
    { id: 'shower', label: '40° shower', icon: 'beaker' },
    { id: 'seat', label: 'Seat warm', icon: 'fire' },
  ];

  /*
   * Health areas. Each has a living visual (js/healthVisuals.js) driven by its score.
   * `lowerIsBetter` flips the visual (a low Stress score is calm).
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
      delta: 'Up 4 this month',
      source: 'Vanity Sense',
      icon: 'heart',
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
      delta: 'Up 2 this month',
      source: 'Shower wall radar',
      icon: 'user',
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
      delta: 'Up 5 this month',
      source: 'Dekoda',
      icon: 'sparkles',
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
      delta: 'Steady this month',
      source: 'Vanity Sense + Dekoda',
      icon: 'beaker',
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
      lowerIsBetter: true,
      delta: 'Down 6 this month',
      source: 'Vanity Sense (HRV)',
      icon: 'bolt',
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
      items: [
        { label: 'Sensing', value: 'On', badge: 'Active' },
        { label: 'Cameras', value: 'None — touch sensors only' },
        { label: 'Sensitive data', value: 'Consented per reading' },
      ],
    },
    {
      id: 'products',
      title: 'Kohler products',
      items: [
        { label: 'Anthem+ Shower', value: 'Connected', product: 'shower' },
        { label: 'Shore Bathtub', value: 'Connected', product: 'tub' },
        { label: 'PureWarmth Toilet', value: 'Updating…', badge: 'FW 2.4', product: 'toilet' },
      ],
    },
    {
      id: 'devices',
      title: 'Connected devices',
      items: [
        { label: 'Apple Watch', value: 'Paired' },
        { label: 'iPhone 15', value: 'Paired' },
        { label: 'Vanity tile weight', value: 'Calibrated' },
      ],
    },
    {
      id: 'services',
      title: 'Other services from Kohler',
      items: [
        { label: 'Kohler bathroom design', value: 'Available' },
        { label: 'Kohler Kare', value: 'Member' },
        { label: 'Kohler Pro', value: 'Available' },
      ],
    },
  ];

  /* Devices listed on the onboarding "Connect" step. */
  var onboardingDevices = [
    { product: 'shower', room: 'Bathroom', state: 'connected' },
    { product: 'tub', room: 'Bathroom', state: 'connected' },
    { product: 'vanity', room: 'Bathroom', state: 'connected' },
    { product: 'toilet', room: 'Bathroom', state: 'updating' },
    { product: 'faucet', room: 'Kitchen', state: 'connected' },
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
