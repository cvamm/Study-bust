export interface PhysicsChapterNote {
  chapterNum: number;
  chapterId: string;
  title: string;
  toppersUrl: string;
  pageCount: number;
  derivationsCount: number;
  keyTopics: string[];
  keyDerivations: string[];
  description: string;
}

export const TOPPERS_PHYSICS_MASTER_URL =
  "https://topperscbse.com/cbse-class-12th-notes/class-12-physics-notes/";

export const PHYSICS_CHAPTER_NOTES: PhysicsChapterNote[] = [
  {
    chapterNum: 1,
    chapterId: "phy-c1",
    title: "Electric Charges and Fields",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-1-electric-charges-and-fields/",
    pageCount: 28,
    derivationsCount: 5,
    keyTopics: [
      "Quantisation & Conservation of Charge",
      "Coulomb's Law in Vector Form",
      "Electric Dipole & Dipole Moment",
      "Electric Flux & Gauss's Theorem",
    ],
    keyDerivations: [
      "Electric field on axial & equatorial line of dipole",
      "Torque on dipole in uniform field (τ = p × E)",
      "Field due to infinite straight wire (E = λ / 2πε₀r)",
      "Field due to infinite plane sheet (E = σ / 2ε₀)",
      "Field due to thin spherical shell",
    ],
    description:
      "Detailed handwritten revision notes covering Coulomb's law, dipole field derivations, electric flux, and all 3 classic applications of Gauss's theorem with diagrams.",
  },
  {
    chapterNum: 2,
    chapterId: "phy-c2",
    title: "Electrostatic Potential and Capacitance",
    toppersUrl:
      "https://topperscbse.com/revision-notes/class-12-physics-notes-of-chapter-2-electrostatic-potential-and-capacitance/",
    pageCount: 30,
    derivationsCount: 6,
    keyTopics: [
      "Electrostatic Potential due to Point Charge",
      "Equipotential Surfaces & Properties",
      "Parallel Plate Capacitor & Dielectrics",
      "Energy Stored in Capacitor & Energy Loss",
    ],
    keyDerivations: [
      "Potential due to point charge & dipole (V = kp cos θ / r²)",
      "Capacitance of parallel plate capacitor (C = ε₀A / d)",
      "Capacitor with conducting & dielectric slab",
      "Energy stored in capacitor (U = ½ CV²)",
      "Common potential and energy redistribution loss",
    ],
    description:
      "Comprehensive notes featuring potential gradient, equipotential surfaces, capacitor combinations, polarization, dielectric insertion effects, and energy calculations.",
  },
  {
    chapterNum: 3,
    chapterId: "phy-c3",
    title: "Current Electricity",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-of-chapter-3-current-electricity/",
    pageCount: 32,
    derivationsCount: 5,
    keyTopics: [
      "Drift Velocity & Mobility of Electrons",
      "Ohm's Law Vector Form & Resistivity",
      "Cells in Series & Parallel Combinations",
      "Kirchhoff's Laws & Wheatstone Bridge",
    ],
    keyDerivations: [
      "Relation between current and drift velocity (I = n e A v_d)",
      "Vector form of Ohm's law (J = σ E)",
      "Equivalent EMF & internal resistance of cells in parallel",
      "Balanced condition of Wheatstone Bridge (P/Q = R/S)",
    ],
    description:
      "High-scoring chapter notes detailing microscopic electron drift, temperature dependence of resistance, EMF vs terminal potential difference, and circuit analysis with Kirchhoff's rules.",
  },
  {
    chapterNum: 4,
    chapterId: "phy-c4",
    title: "Moving Charges and Magnetism",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-notes-of-chapter-4-moving-charges-and-magnetism/",
    pageCount: 34,
    derivationsCount: 6,
    keyTopics: [
      "Biot-Savart Law & Magnetic Permeability",
      "Ampere's Circuital Law & Solenoid",
      "Force between Two Parallel Currents (1 Ampere)",
      "Moving Coil Galvanometer Conversion",
    ],
    keyDerivations: [
      "Magnetic field on axis of circular current loop",
      "Magnetic field inside long straight solenoid (B = μ₀nI)",
      "Force between parallel current carrying wires (F/L = μ₀I₁I₂ / 2πd)",
      "Torque on rectangular current loop in magnetic field",
      "Conversion of Galvanometer into Ammeter and Voltmeter",
    ],
    description:
      "Covers Oersted experiment, Lorentz magnetic force, helical motion, circular loop field proofs, toroid/solenoid rules, and moving coil galvanometer sensitivity with step-by-step math.",
  },
  {
    chapterNum: 5,
    chapterId: "phy-c5",
    title: "Magnetism and Matter",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-of-chapter-5-magnetism-and-matter/",
    pageCount: 22,
    derivationsCount: 3,
    keyTopics: [
      "Bar Magnet as an Equivalent Solenoid",
      "Magnetic Field Lines Properties",
      "Dia, Para, and Ferromagnetic Materials",
      "Curie's Law & Temperature Dependence",
    ],
    keyDerivations: [
      "Magnetic field on axial line of bar magnet",
      "Torque and potential energy of dipole in magnetic field",
      "Comparison table of Dia, Para and Ferromagnetic properties",
    ],
    description:
      "Concise exam revision notes comparing magnetic materials, magnetic susceptibility, permeability, magnetic dipole moments, and high-frequency conceptual board reasoning questions.",
  },
  {
    chapterNum: 6,
    chapterId: "phy-c6",
    title: "Electromagnetic Induction",
    toppersUrl:
      "https://topperscbse.com/revision-notes/class-12-physics-notes-of-chapter-6-electromagnetic-induction/",
    pageCount: 26,
    derivationsCount: 5,
    keyTopics: [
      "Faraday's Laws & Lenz's Law Direction",
      "Motional EMF in Moving & Rotating Rods",
      "Self and Mutual Inductance",
      "AC Generator Working Principle",
    ],
    keyDerivations: [
      "Motional EMF expression (e = B v l)",
      "EMF induced in a rotating rod (e = ½ B ω l²)",
      "Self-inductance of a long solenoid (L = μ₀ n² A l)",
      "Mutual inductance between two concentric coaxial solenoids",
      "AC generator induced voltage equation (e = N B A ω sin ωt)",
    ],
    description:
      "Complete revision notes explaining magnetic flux, Lenz's law conservation of energy, eddy currents, inductors, energy stored in magnetic fields, and generator mechanics with diagrams.",
  },
  {
    chapterNum: 7,
    chapterId: "phy-c7",
    title: "Alternating Current",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-7-alternating-current/",
    pageCount: 30,
    derivationsCount: 5,
    keyTopics: [
      "Peak vs RMS Values of AC",
      "AC through Resistor, Inductor, and Capacitor",
      "Series LCR Circuit & Phasor Diagrams",
      "Electrical Resonance & Transformers",
    ],
    keyDerivations: [
      "Relation between RMS and peak values (I_rms = I₀ / √2)",
      "Impedance & phase angle in series LCR circuit",
      "Resonant frequency and condition (ω_r = 1 / √(LC))",
      "Power in AC circuit & Wattless current (P_avg = V_rms I_rms cos φ)",
      "Transformer turn ratio & efficiency (V_s / V_p = N_s / N_p)",
    ],
    description:
      "Structured guide covering pure R, L, and C circuit responses, inductive and capacitive reactances, impedance triangle, resonance bandwidth, Q-factor, and transformer energy losses.",
  },
  {
    chapterNum: 8,
    chapterId: "phy-c8",
    title: "Electromagnetic Waves",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-8-electromagnetic-waves/",
    pageCount: 18,
    derivationsCount: 2,
    keyTopics: [
      "Displacement Current & Maxwell's Fix",
      "Transverse Nature of EM Waves",
      "Velocity, Momentum & Energy Density",
      "Electromagnetic Spectrum Mnemonic & Uses",
    ],
    keyDerivations: [
      "Displacement current formula (I_d = ε₀ dΦ_E / dt)",
      "Wave velocity relation with amplitudes (c = E₀ / B₀ = 1 / √(μ₀ε₀))",
    ],
    description:
      "Concise revision sheet detailing Maxwell-Ampere circuital law, properties of EM radiation, and an all-in-one reference table of frequency bands, production methods, and practical uses.",
  },
  {
    chapterNum: 9,
    chapterId: "phy-c9",
    title: "Ray Optics and Optical Instruments",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-9-ray-optics-and-optical-instruments/",
    pageCount: 36,
    derivationsCount: 6,
    keyTopics: [
      "Total Internal Reflection & Critical Angle",
      "Refraction at Spherical Surfaces",
      "Lens Maker's Formula & Thin Lens Formula",
      "Prism Refraction & Minimum Deviation",
      "Compound Microscope & Astronomical Telescope",
    ],
    keyDerivations: [
      "Refraction at single spherical surface (μ₂/v - μ₁/u = (μ₂-μ₁)/R)",
      "Lens Maker's formula (1/f = (μ-1)(1/R₁ - 1/R₂))",
      "Equivalent focal length of two lenses in contact (1/F = 1/f₁ + 1/f₂)",
      "Prism formula (μ = sin((A + D_m)/2) / sin(A/2))",
      "Magnifying power of Compound Microscope (Normal & D adjustment)",
      "Magnifying power of Astronomical Telescope (Refracting & Reflecting)",
    ],
    description:
      "Top-scoring high-weightage chapter notes with clear ray diagrams for prism minimum deviation, compound microscope, Cassegrain reflecting telescope, and all standard lens derivations.",
  },
  {
    chapterNum: 10,
    chapterId: "phy-c10",
    title: "Wave Optics",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-10-wave-optics/",
    pageCount: 28,
    derivationsCount: 4,
    keyTopics: [
      "Huygens' Principle & Wavefront Geometry",
      "Laws of Reflection & Refraction on Wave Theory",
      "Young's Double Slit Experiment (YDSE)",
      "Single Slit Fraunhofer Diffraction",
    ],
    keyDerivations: [
      "Proof of law of reflection using Huygens' construction",
      "Proof of Snell's law of refraction using Huygens' construction",
      "Fringe width derivation in YDSE (β = λ D / d)",
      "Central maximum angular width in diffraction (2θ = 2λ / a)",
    ],
    description:
      "Clear geometric wavefront derivations, coherent sources criteria, path difference conditions for constructive/destructive interference, intensity distribution, and diffraction comparison.",
  },
  {
    chapterNum: 11,
    chapterId: "phy-c11",
    title: "Dual Nature of Radiation and Matter",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-11-dual-nature-of-radiation-and-matter/",
    pageCount: 22,
    derivationsCount: 3,
    keyTopics: [
      "Photoelectric Effect Observations & Laws",
      "Einstein's Photoelectric Equation",
      "Photoelectric Characteristic Graphs",
      "de-Broglie Matter Waves & Wavelength",
    ],
    keyDerivations: [
      "Einstein's equation (K_max = hν - φ₀ = e V₀)",
      "Slope and intercepts of V₀ vs ν graph (Slope = h/e)",
      "de-Broglie wavelength for electron accelerated by V (λ = 1.227 / √V nm)",
    ],
    description:
      "Masterclass notes on work function, threshold frequency, stopping potential, failure of classical wave theory, photon quantum characteristics, and all 6 standard CBSE graph problems.",
  },
  {
    chapterNum: 12,
    chapterId: "phy-c12",
    title: "Atoms",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-12-atoms/",
    pageCount: 24,
    derivationsCount: 4,
    keyTopics: [
      "Geiger-Marsden α-Scattering Experiment",
      "Distance of Closest Approach & Impact Parameter",
      "Bohr's Postulates for Hydrogen Atom",
      "Hydrogen Emission Spectral Series",
    ],
    keyDerivations: [
      "Distance of closest approach (r₀ = 2Ze² / 4πε₀K)",
      "Radius of nth stationary orbit (r_n = ε₀n²h² / πme² ∝ n²)",
      "Speed and kinetic/potential/total energy of electron (E_n = -13.6/n² eV)",
      "Rydberg formula for spectral wavelengths (1/λ = R (1/n₁² - 1/n₂²))",
    ],
    description:
      "Detailed revision notes explaining Rutherford's planetary model flaws, Bohr's quantization condition via de-Broglie standing waves, energy level ladders, and Lyman/Balmer transitions.",
  },
  {
    chapterNum: 13,
    chapterId: "phy-c13",
    title: "Nuclei",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-13-nuclei/",
    pageCount: 20,
    derivationsCount: 3,
    keyTopics: [
      "Nuclear Size & Constant Density (R = R₀ A⅓)",
      "Mass Defect (Δm) & Binding Energy",
      "Binding Energy per Nucleon Curve",
      "Nuclear Forces Properties & Fission / Fusion",
    ],
    keyDerivations: [
      "Nuclear density calculation and proof of constancy",
      "Mass defect and binding energy relation (BE = Δm × 931.5 MeV)",
      "Q-value calculation for nuclear disintegration reactions",
    ],
    description:
      "Concise rationalized syllabus notes covering atomic mass unit, isotopes, isobars, isotones, nuclear force saturation, stability inferences from the binding energy curve, and nuclear reactors.",
  },
  {
    chapterNum: 14,
    chapterId: "phy-c14",
    title: "Semiconductor Electronics: Materials, Devices and Simple Circuits",
    toppersUrl:
      "https://topperscbse.com/revision-notes/cbse-class-12-physics-notes-chapter-14-semiconductor-devices/",
    pageCount: 30,
    derivationsCount: 4,
    keyTopics: [
      "Energy Band Theory (Valence, Conduction, Band Gap)",
      "Intrinsic vs Extrinsic Semiconductors (p-type & n-type)",
      "p-n Junction Diode Formation (Depletion Layer, Barrier)",
      "Forward & Reverse Bias V-I Curves",
      "Half-Wave & Full-Wave Rectifiers",
    ],
    keyDerivations: [
      "Mass-action law in semiconductors (n_e · n_h = n_i²)",
      "Diode dynamic and static resistance calculation",
      "Working & efficiency of Half-Wave Rectifier circuit",
      "Working & efficiency of Center-Tapped Full-Wave Rectifier circuit",
    ],
    description:
      "High-yield notes with diagrams for semiconductor doping, majority/minority carriers, drift and diffusion current, knee voltage, breakdown voltage, and full rectifier input/output waveforms.",
  },
];
