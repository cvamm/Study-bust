import { SUBJECTS } from "./subjects";
import { PHYSICS_CHAPTER_NOTES, TOPPERS_PHYSICS_MASTER_URL } from "./physicsNotes";
import type { Difficulty, Goal, Language, Resource, ResourceType, SourceKind } from "@/lib/types";

export interface ChapterNoteItem {
  chapterNum: number;
  chapterId: string;
  title: string;
  notesUrl: string;
  source: string;
  sourceKind: SourceKind;
  estimatedPages: number;
  keyTopics: string[];
  keyHighlights: string[];
  description: string;
}

export interface SubjectNotesCatalog {
  subjectId: string;
  subjectName: string;
  sourceName: string;
  masterPortalUrl: string;
  description: string;
  chapters: ChapterNoteItem[];
}

// ----------------------------------------------------------------------
// Chemistry Chapter Notes (All 10 Rationalised Chapters)
// ----------------------------------------------------------------------
const CHEM_CHAPTER_NOTES: ChapterNoteItem[] = [
  {
    chapterNum: 1,
    chapterId: "chem-c1",
    title: "Solutions",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-1-solution/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 26,
    keyTopics: ["Types of Solutions & Concentration Terms", "Raoult's Law & Ideal/Non-ideal Solutions", "Colligative Properties", "van 't Hoff Factor & Abnormal Molar Mass"],
    keyHighlights: ["Henry's law constant and solubility graphs", "Relative lowering of vapor pressure (ΔP/P°)", "Elevation in boiling point (ΔT_b = K_b · m)", "Depression in freezing point (ΔT_f = K_f · m)", "Osmotic pressure formula (π = iCRT)"],
    description: "Complete handwritten revision notes covering Raoult's law, positive and negative deviations, azeotropes, colligative properties, and van 't Hoff factor calculations.",
  },
  {
    chapterNum: 2,
    chapterId: "chem-c2",
    title: "Electrochemistry",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-2/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 28,
    keyTopics: ["Galvanic & Electrolytic Cells", "Nernst Equation & Cell EMF", "Kohlrausch's Law of Independent Migration", "Batteries, Fuel Cells & Corrosion"],
    keyHighlights: ["Standard hydrogen electrode (SHE) reference", "Nernst equation for EMF (E_cell = E° - 0.0591/n log Q)", "Relationship between ΔG° and cell EMF (ΔG° = -nFE°)", "Limiting molar conductivity calculation (Λ°_m)", "Lead-acid accumulator reactions & H2-O2 fuel cell"],
    description: "Detailed step-by-step notes on electrochemical series, Nernst equation derivations, molar conductivity vs √C graphs, Faraday's laws, and commercial batteries.",
  },
  {
    chapterNum: 3,
    chapterId: "chem-c3",
    title: "Chemical Kinetics",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-3/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 24,
    keyTopics: ["Rate of Reaction & Rate Law", "Order vs Molecularity", "Integrated Rate Equations (Zero & 1st Order)", "Half-Life & Arrhenius Equation"],
    keyHighlights: ["Zero-order integrated rate law ([R] = [R]₀ - kt)", "First-order integrated rate law (k = 2.303/t log [R]₀/[R])", "Half-life for first-order reactions (t_½ = 0.693/k)", "Arrhenius equation (k = A e^(-Ea/RT))", "Activation energy calculation from two temperatures"],
    description: "Comprehensive notes with log formulas, rate constant units, collision theory, catalyst effects, and all standard numerical methods repeated in board exams.",
  },
  {
    chapterNum: 4,
    chapterId: "chem-c4",
    title: "d- and f-Block Elements",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-7/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 22,
    keyTopics: ["Transition Elements Electronic Configurations", "Variable Oxidation States & Catalytic Action", "Lanthanoid Contraction & Consequences", "Preparation & Properties of K₂Cr₂O₇ and KMnO₄"],
    keyHighlights: ["Anomalous configurations of Cr (3d⁵4s¹) and Cu (3d¹⁰4s¹)", "Paramagnetism & spin-only formula (μ = √(n(n+2)) BM)", "Lanthanoid contraction cause: poor 4f shielding", "Oxidizing reactions of acidified K₂Cr₂O₇ and KMnO₄", "Actinoids vs Lanthanoids comparison table"],
    description: "High-yield revision notes explaining standard electrode potential trends, colored ion formation via d-d transitions, interstitial alloys, and redox reactions.",
  },
  {
    chapterNum: 5,
    chapterId: "chem-c5",
    title: "Coordination Compounds",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-8/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 26,
    keyTopics: ["Werner's Theory & Coordination Entities", "IUPAC Nomenclature of Coordination Complexes", "Structural & Stereoisomerism", "Valence Bond Theory (VBT) & Crystal Field Theory (CFT)"],
    keyHighlights: ["Primary vs Secondary valencies of metal ions", "IUPAC naming rules for cationic/anionic coordination entities", "Geometrical (cis/trans) and optical isomerism in octadral complexes", "Inner vs outer orbital complexes hybridization (d²sp³ vs sp³d²)", "Crystal field splitting in octahedral complexes (Δₒ, t₂g & eg)"],
    description: "Covers spectrochemical series, weak vs strong field ligands, crystal field stabilization energy (CFSE), magnetic behavior, and high-scoring board IUPAC drills.",
  },
  {
    chapterNum: 6,
    chapterId: "chem-c6",
    title: "Haloalkanes and Haloarenes",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-9/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 28,
    keyTopics: ["Nomenclature & C-X Bond Nature", "SN1 and SN2 Reaction Mechanisms", "Stereochemistry: Inversion vs Retention", "Electrophilic Substitution of Haloarenes & Organometallics"],
    keyHighlights: ["SN1 vs SN2 comparison (kinetics, carbocation intermediate, optical activity)", "Saytzeff (Zaitsev) elimination rule for dehydrohalogenation", "Low reactivity of aryl halides toward nucleophilic substitution", "Sandmeyer reaction and Finkelstein / Swarts halogen exchange", "Grignard reagent preparation and handling precautions"],
    description: "Organic foundations guide focusing on SN1/SN2 pathway selection, carbocation stability, optical chirality, named reactions, and conversion roadmap charts.",
  },
  {
    chapterNum: 7,
    chapterId: "chem-c7",
    title: "Alcohols, Phenols and Ethers",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-10/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 28,
    keyTopics: ["Preparation of Alcohols & Phenols", "Acidity of Phenols vs Alcohols", "Distinction Tests (Lucas & Ferric Chloride)", "Williamson Ether Synthesis & Cleavage with HI"],
    keyHighlights: ["Hydroboration-oxidation of alkenes (anti-Markovnikov alcohol)", "Lucas test distinguishing 1°, 2°, 3° alcohols (turbidity test)", "Kolbe's reaction: synthesis of salicylic acid", "Reimer-Tiemann reaction: synthesis of salicylaldehyde", "Williamson ether synthesis mechanism and unsymmetrical ether cleavage"],
    description: "Master notes detailing acid-catalyzed hydration, resonance stabilization of phenoxide ion, electrophilic substitution of phenol with Br₂/water, and ether cleavage mechanisms.",
  },
  {
    chapterNum: 8,
    chapterId: "chem-c8",
    title: "Aldehydes, Ketones and Carboxylic Acids",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-11/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 32,
    keyTopics: ["Nucleophilic Addition Reactions of Carbonyls", "Named Reductions (Clemmensen, Wolff-Kishner, Rosenmund)", "Aldol Condensation & Cannizzaro Reaction", "Acidity of Carboxylic Acids & HVZ Reaction"],
    keyHighlights: ["Rosenmund reduction of acyl chlorides to aldehydes", "Tollens' reagent (silver mirror) & Fehling's test distinction", "Iodoform test for CH₃C=O and CH₃CH(OH) groups", "Cross Aldol condensation mechanism with α-hydrogens", "Hell-Volhard-Zelinsky (HVZ) α-halogenation of carboxylic acids"],
    description: "Highest-weightage organic chapter notes with complete reaction mechanisms, nucleophilic addition-elimination with ammonia derivatives, and distinguishing tests.",
  },
  {
    chapterNum: 9,
    chapterId: "chem-c9",
    title: "Amines",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-12/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 24,
    keyTopics: ["Classification & Basicity of Amines", "Gabriel Phthalimide Synthesis", "Hoffmann Bromamide Degradation", "Hinsberg Reagent & Diazonium Salts Reactions"],
    keyHighlights: ["Basicity order in aqueous solution ((CH₃)₂NH > CH₃NH₂ > (CH₃)₃N)", "Gabriel phthalimide preparation of pure primary aliphatic amines", "Hoffmann bromamide degradation (step-down conversion: RCONH₂ → RNH₂)", "Hinsberg test distinguishing 1°, 2°, and 3° amines with benzenesulfonyl chloride", "Diazonium coupling reactions with phenol and aniline to form azo dyes"],
    description: "Clear revision notes detailing basicity factors (inductive, steric, and hydration effects), carbylamine test for 1° amines, and synthetic routes through diazonium salts.",
  },
  {
    chapterNum: 10,
    chapterId: "chem-c10",
    title: "Biomolecules",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-chemistry-notes-chapter-13/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 22,
    keyTopics: ["Carbohydrates: Glucose Structure & Ring Form", "Proteins: Amino Acids & Peptide Bond", "Protein Denaturation & Structure Levels", "Nucleic Acids: DNA vs RNA & Vitamins"],
    keyHighlights: ["Open chain and Haworth cyclic pyranose structures of D-glucose", "Evidence for glucose functional groups (HI, Br₂ water, HNO₃)", "Essential vs non-essential amino acids & zwitterion structure", "Primary, secondary (α-helix, β-sheet), tertiary & quaternary protein structure", "DNA vs RNA: purine/pyrimidine bases, double helix, and vitamin deficiency table"],
    description: "Concise scoring notes covering reducing vs non-reducing sugars, glycosidic and phosphodiester linkages, denaturation factors, and board-favourite enzyme questions.",
  },
];

// ----------------------------------------------------------------------
// Biology Chapter Notes (All 13 Rationalised Chapters)
// ----------------------------------------------------------------------
const BIO_CHAPTER_NOTES: ChapterNoteItem[] = [
  {
    chapterNum: 1,
    chapterId: "bio-c1",
    title: "Sexual Reproduction in Flowering Plants",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-2/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 26,
    keyTopics: ["Microsporogenesis & Pollen Grain Structure", "Megasporogenesis & 7-Celled 8-Nucleate Embryo Sac", "Pollination Agencies & Outbreeding Devices", "Double Fertilisation & Endosperm Development"],
    keyHighlights: ["Anther wall layers: epidermis, endothecium, middle layers, tapetum", "Structure of anatropous ovule and megaspore mother cell meiosis", "Outbreeding devices preventing inbreeding depression", "Double fertilisation: syngamy + triple fusion forming 3n PEN", "Apomixis and polyembryony significance in hybrid seed industry"],
    description: "Detailed botany revision notes covering floral reproduction stages, pollen-pistil interaction, albuminous vs exalbuminous seeds, and labeled diagrams.",
  },
  {
    chapterNum: 2,
    chapterId: "bio-c2",
    title: "Human Reproduction",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-3/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 28,
    keyTopics: ["Male & Female Reproductive Systems", "Spermatogenesis vs Oogenesis", "Menstrual Cycle Hormonal Regulation", "Fertilisation, Cleavage & Implantation"],
    keyHighlights: ["Seminiferous tubules: Sertoli cells and Leydig cells functions", "Oogenesis vs spermatogenesis differences and polar bodies", "Pituitary (LH, FSH) and ovarian (estrogen, progesterone) hormone curves", "Capacitation, acrosome reaction, and cortical block to polyspermy", "Blastocyst structure, trophoblast, inner cell mass, and placenta functions"],
    description: "Comprehensive handwritten notes with endocrine feedback pathways of the menstrual cycle, gametogenesis flowcharts, and pregnancy/parturition hormones.",
  },
  {
    chapterNum: 3,
    chapterId: "bio-c3",
    title: "Reproductive Health",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-4/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 18,
    keyTopics: ["Population Growth & Contraceptive Methods", "Medical Termination of Pregnancy (MTP Act)", "Sexually Transmitted Infections (STIs)", "Assisted Reproductive Technologies (ART)"],
    keyHighlights: ["Contraceptive classifications: barrier, IUDs (Copper-T, LNG-20), oral pills", "Saheli: once-a-week non-steroidal oral contraceptive developed by CDRI", "MTP Amendment Act rules and legal conditions for termination", "ART methods: IVF-ET, ZIFT (Zygote Intra-Fallopian Transfer), GIFT, ICSI, IUI", "Amniocentesis: purpose, karyotyping, and misuse prevention ban"],
    description: "Concise high-yield revision notes detailing reproductive healthcare strategies, IUD working mechanisms, infertility treatments, and ethical medical guidelines.",
  },
  {
    chapterNum: 4,
    chapterId: "bio-c4",
    title: "Principles of Inheritance and Variation",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-5/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 32,
    keyTopics: ["Mendel's Laws of Inheritance", "Incomplete Dominance & Co-dominance (ABO Blood)", "Chromosomal Theory of Inheritance & Linkage", "Genetic Disorders: Mendelian & Chromosomal"],
    keyHighlights: ["Monohybrid (3:1, 1:2:1) and Dihybrid (9:3:3:1) cross Punnett squares", "Incomplete dominance in Mirabilis jalapa (1:2:1 phenotypic ratio)", "Morgan's linkage and crossing over experiments on Drosophila melanogaster", "Pedigree analysis symbols and autosomal vs sex-linked inheritance", "Mendelian disorders (Sickle cell, Thalassemia, Hemophilia) & Aneuploidies"],
    description: "Detailed genetics masterclass with cross schemes, chromosome mapping principles, sex determination systems (XX-XY, ZZ-ZW, XO, haplo-diploidy), and syndromes.",
  },
  {
    chapterNum: 5,
    chapterId: "bio-c5",
    title: "Molecular Basis of Inheritance",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-6/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 34,
    keyTopics: ["DNA Structure & Packaging (Nucleosome)", "Transforming Principle & Hershey-Chase Experiment", "Semiconservative Replication (Meselson-Stahl)", "Transcription, Genetic Code & Translation (Lac Operon)"],
    keyHighlights: ["Watson-Crick B-DNA double helix dimensions and Chargaff's rules", "Nucleosome model: histone octamer, linker DNA, and solenoid fiber", "Meselson and Stahl's ¹⁵N/¹⁴N density gradient centrifugation experiment", "Transcription unit, RNA polymerase enzymes, post-transcriptional processing", "Lac operon regulation: promoter, operator, repressor protein, and allolactose inducer"],
    description: "Highest-weightage molecular biology notes with step-by-step replication fork enzymes, genetic code salient features, tRNA cloverleaf model, and Human Genome Project.",
  },
  {
    chapterNum: 6,
    chapterId: "bio-c6",
    title: "Evolution",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-7/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 24,
    keyTopics: ["Origin of Life & Miller-Urey Experiment", "Homologous vs Analogous Organs (Divergent/Convergent)", "Adaptive Radiation (Darwin's Finches)", "Hardy-Weinberg Principle & Human Evolution Timeline"],
    keyHighlights: ["Miller-Urey spark discharge apparatus conditions and amino acid synthesis", "Homology (divergent evolution) vs Analogy (convergent evolution) examples", "Industrial melanism in Biston betularia as natural selection proof", "Hardy-Weinberg equilibrium formula (p² + 2pq + q² = 1) and disturbing factors", "Human evolution sequence: Ramapithecus → Australopithecus → Homo erectus → Sapiens"],
    description: "Complete evolutionary biology guide explaining Lamarckism vs Darwinism vs Mutation theory of de Vries, founder effect, genetic drift, and fossil evidence.",
  },
  {
    chapterNum: 7,
    chapterId: "bio-c7",
    title: "Human Health and Disease",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-9/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 28,
    keyTopics: ["Pathogens & Common Infectious Diseases", "Innate vs Acquired Immunity & Antibody Structure", "Life Cycle of Plasmodium (Malaria)", "AIDS (HIV Infection) & Cancer Pathophysiology"],
    keyHighlights: ["Bacterial, viral, protozoan and fungal human diseases overview", "Structure of antibody molecule (H₂L₂ format) with variable and constant regions", "Life cycle of Plasmodium in human liver/RBCs and female Anopheles mosquito", "HIV retroviral replication cycle: reverse transcriptase, integrase, helper T cells", "Cancer characteristics: contact inhibition loss, metastasis, oncogenes, and biopsy"],
    description: "Comprehensive immunology and pathology notes with vaccination mechanisms, allergy IgE responses, autoimmune disorders, and drug/alcohol abuse classifications.",
  },
  {
    chapterNum: 8,
    chapterId: "bio-c8",
    title: "Microbes in Human Welfare",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-10/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 20,
    keyTopics: ["Microbes in Household Food Processing", "Industrial Microbes & Bioactive Molecules", "Sewage Treatment Plant (STP) Stages", "Biogas Production & Biofertilizers"],
    keyHighlights: ["Lactobacillus in curd and baker's/brewer's yeast (Saccharomyces cerevisiae)", "Bioactive molecules: Cyclosporin A (Trichoderma), Statins (Monascus purpureus)", "Primary vs Secondary (biological) sewage treatment: aeration tank, flocs, BOD", "Anaerobic sludge digester and methanogenic bacteria (Methanobacterium) in biogas", "Biofertilizers: Rhizobium, Azotobacter, Azospirillum, Mycorrhiza (Glomus), Anabaena"],
    description: "Concise scoring notes detailing organic acids, antibiotics discovery by Alexander Fleming, biological control of pests (Bt, Trichoderma, Baculoviruses), and biofertilizers.",
  },
  {
    chapterNum: 9,
    chapterId: "bio-c9",
    title: "Biotechnology: Principles and Processes",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-11/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 26,
    keyTopics: ["Recombinant DNA Technology Tools", "Restriction Enzymes (Molecular Scissors)", "Cloning Vectors & pBR322 Plasmid Features", "Polymerase Chain Reaction (PCR) & Bioreactors"],
    keyHighlights: ["Restriction endonucleases palindromic recognition sequences and sticky ends", "pBR322 plasmid diagram: ori, rop, selectable markers (ampʳ, tetʳ)", "Insertional inactivation of β-galactosidase gene (blue-white selection)", "PCR steps: denaturation (94°C), annealing (54°C), extension (72°C) via Taq polymerase", "Simple stirred-tank vs sparged stirred-tank bioreactors and downstream processing"],
    description: "Step-by-step recombinant DNA engineering manual covering gel electrophoresis, competent host transformation methods (heat shock, gene gun, microinjection), and purification.",
  },
  {
    chapterNum: 10,
    chapterId: "bio-c10",
    title: "Biotechnology and its Applications",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-12/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 22,
    keyTopics: ["Bt Cotton & Pest Resistant Plants (RNAi)", "Genetically Engineered Human Insulin (Humulin)", "Gene Therapy for ADA Deficiency", "Transgenic Animals & Biopiracy Regulations"],
    keyHighlights: ["Bt toxin mechanism: Cry protein crystallization, midgut epithelial lysis", "RNA interference (RNAi) silencing of nematode mRNA via dsRNA in tobacco roots", "Eli Lilly commercial production of Humulin using separate A and B chains", "Adenosine deaminase (ADA) gene therapy using retroviral vectors in lymphocytes", "Biopiracy definition, US patent on Basmati rice, and Indian Patent Bill provisions"],
    description: "Applied biotechnology notes covering agricultural yield improvements, molecular diagnosis (ELISA, PCR probes), ethical issues, and GEAC oversight.",
  },
  {
    chapterNum: 11,
    chapterId: "bio-c11",
    title: "Organisms and Populations",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-13/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 22,
    keyTopics: ["Major Abiotic Factors & Adaptations", "Population Attributes & Age Pyramids", "Population Growth Models (Exponential vs Logistic)", "Population Interactions (Mutualism, Competition, etc.)"],
    keyHighlights: ["Regulators, conformers, partial regulators, diapause, and aestivation", "Kangaroo rat water conservation and Allen's rule for cold-climate mammals", "Exponential (J-shaped) vs Logistic (S-shaped: dN/dt = rN(K-N)/K) growth equations", "Gause's competitive exclusion principle and MacArthur's resource partitioning", "Interaction types table: mutualism, commensalism, parasitism, predation, amensalism"],
    description: "Ecology fundamentals guide explaining physiological/behavioral adaptations, carrying capacity K, brood parasitism, and mycorrhizal/lichen symbioses.",
  },
  {
    chapterNum: 12,
    chapterId: "bio-c12",
    title: "Ecosystem",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-14/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 20,
    keyTopics: ["Ecosystem Structure & Productivity", "Decomposition Process & Controlling Factors", "Energy Flow & 10 Percent Law", "Ecological Pyramids (Number, Biomass, Energy)"],
    keyHighlights: ["Gross primary productivity (GPP) vs Net primary productivity (NPP = GPP - R)", "Decomposition steps: fragmentation, leaching, catabolism, humification, mineralization", "Food chains (grazing vs detritus) and Lindeman's 10% trophic efficiency rule", "Ecological pyramids: upright pyramids vs inverted pyramid of biomass in sea", "Limitations of ecological pyramids: omnivore placement and saprophyte exclusion"],
    description: "Structured ecological notes detailing nutrient cycling pathways, trophic level energetics, primary consumers, and standing crop vs standing state definitions.",
  },
  {
    chapterNum: 13,
    chapterId: "bio-c13",
    title: "Biodiversity and Conservation",
    notesUrl: "https://topperscbse.com/revision-notes/cbse-class-12-biology-notes-chapter-15/",
    source: "ToppersCBSE",
    sourceKind: "website",
    estimatedPages: 18,
    keyTopics: ["Levels of Biodiversity & Global Patterns", "Species-Area Relationship (Alexander von Humboldt)", "Causes of Biodiversity Loss (The Evil Quartet)", "In-situ vs Ex-situ Conservation Strategies"],
    keyHighlights: ["Genetic, species, and ecological diversity examples in India", "Species-area rectangular hyperbola equation (log S = log C + Z log A)", "The Evil Quartet: habitat loss/fragmentation, over-exploitation, alien invasion, co-extinctions", "Nile perch, water hyacinth (Eichhornia), and African catfish (Clarias) invasive threats", "In-situ (National parks, Sanctuaries, Biosphere reserves) vs Ex-situ (Zoos, Cryopreservation)"],
    description: "High-scoring conservation biology sheet detailing biodiversity hotspots, sacred groves in India, cryopreservation of gametes, and the Earth Summit in Rio de Janeiro.",
  },
];

// ----------------------------------------------------------------------
// General Subject Notes Generator for Maths, Commerce & Humanities
// ----------------------------------------------------------------------
function generateSubjectChapterNotes(
  subjectId: string,
  chapterNames: string[],
  subjectName: string
): ChapterNoteItem[] {
  return chapterNames.map((name, idx) => {
    const num = idx + 1;
    const cid = `${subjectId}-c${num}`;
    return {
      chapterNum: num,
      chapterId: cid,
      title: name,
      notesUrl: `https://cbseacademic.nic.in/`,
      source: "CBSE Academic / NCERT",
      sourceKind: "website",
      estimatedPages: 18 + ((num * 3) % 12),
      keyTopics: [
        `${name} Core Concepts & Theory`,
        `NCERT Exemplar & Textbook Solutions`,
        `CBSE Marking Scheme & Sample Questions`,
        `High-Frequency Board Exam Formulas`,
      ],
      keyHighlights: [
        `Comprehensive revision summary for ${name}`,
        `Step-by-step problem patterns and answer templates`,
        `Previous 10-year board question trends and repeated models`,
        `Important formulas, definitions, and conceptual checkpoints`,
      ],
      description: `Complete CBSE Class 12 ${subjectName} revision notes for ${name}. Covers definitions, conceptual framework, NCERT exercise questions, and high-scoring board exam techniques.`,
    };
  });
}

// ----------------------------------------------------------------------
// Build Catalog for All 15 Subjects
// ----------------------------------------------------------------------
export function getSubjectNotesCatalog(subjectId: string): SubjectNotesCatalog | null {
  const subject = SUBJECTS.find((s) => s.id === subjectId);
  if (!subject) return null;

  if (subjectId === "phy") {
    return {
      subjectId: "phy",
      subjectName: "Physics",
      sourceName: "ToppersCBSE",
      masterPortalUrl: TOPPERS_PHYSICS_MASTER_URL,
      description:
        "Comprehensive chapterwise handwritten notes, diagrams, formula charts, and step-by-step derivations for CBSE Class 12 Physics.",
      chapters: PHYSICS_CHAPTER_NOTES.map((n) => ({
        chapterNum: n.chapterNum,
        chapterId: n.chapterId,
        title: n.title,
        notesUrl: n.toppersUrl,
        source: "ToppersCBSE",
        sourceKind: "website",
        estimatedPages: n.pageCount,
        keyTopics: n.keyTopics,
        keyHighlights: n.keyDerivations,
        description: n.description,
      })),
    };
  }

  if (subjectId === "chem") {
    return {
      subjectId: "chem",
      subjectName: "Chemistry",
      sourceName: "ToppersCBSE",
      masterPortalUrl: "https://topperscbse.com/cbse-class-12th-notes/chemistry-notes-for-class-12/",
      description:
        "Chapter-by-chapter revision notes covering physical chemistry numerical formulas, inorganic d-f block and coordination complexes, and organic reaction mechanisms.",
      chapters: CHEM_CHAPTER_NOTES,
    };
  }

  if (subjectId === "bio") {
    return {
      subjectId: "bio",
      subjectName: "Biology",
      sourceName: "ToppersCBSE",
      masterPortalUrl: "https://topperscbse.com/cbse-class-12th-notes/biology-notes-for-class-12/",
      description:
        "Thorough NCERT-aligned revision notes with labeled diagrams, genetic crosses, endocrine hormone curves, biotechnology workflows, and ecological models.",
      chapters: BIO_CHAPTER_NOTES,
    };
  }

  // Maths, English, Accounts, BST, Eco, CS, IP, History, Pol Science, Geography, Psychology, Sociology
  const generated = generateSubjectChapterNotes(
    subjectId,
    subject.chapters.map((c) => c.name),
    subject.name
  );

  return {
    subjectId,
    subjectName: subject.name,
    sourceName: "CBSE Academic & NCERT",
    masterPortalUrl: "https://cbseacademic.nic.in/",
    description: `Official chapter-by-chapter revision notes, NCERT line-by-line concept breakdown, formulas, and board examination materials for Class 12 ${subject.name}.`,
    chapters: generated,
  };
}

// ----------------------------------------------------------------------
// Export All Chapter Notes as App Resources
// ----------------------------------------------------------------------
export const ALL_CHAPTER_NOTES_RESOURCES: Resource[] = SUBJECTS.flatMap((subject) => {
  const catalog = getSubjectNotesCatalog(subject.id);
  if (!catalog) return [];

  // Master Subject Notes Resource (Full Syllabus)
  const masterResource: Resource = {
    id: `notes-master-${subject.id}`,
    title: `CBSE Class 12 ${subject.name} Complete Notes & Syllabus Revision`,
    subjectId: subject.id,
    chapterId: null,
    type: "notes" as ResourceType,
    source: catalog.sourceName,
    sourceKind: "website" as SourceKind,
    language: "English" as Language,
    difficulty: "Intermediate" as Difficulty,
    goal: "Revision" as Goal,
    duration: null,
    description: catalog.description,
    url: catalog.masterPortalUrl,
    recommended: true,
    addedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    views: 380000 + ((subject.id.charCodeAt(0) * 1234) % 150000),
  };

  // Chapter-level Notes Resources
  const chapterResources: Resource[] = catalog.chapters.map((ch) => ({
    id: `notes-${subject.id}-c${ch.chapterNum}`,
    title: `${ch.title} — Class 12 ${subject.short} Revision Notes`,
    subjectId: subject.id,
    chapterId: ch.chapterId,
    type: "notes" as ResourceType,
    source: ch.source,
    sourceKind: ch.sourceKind,
    language: "English" as Language,
    difficulty: "Intermediate" as Difficulty,
    goal: "Revision" as Goal,
    duration: null,
    description: ch.description,
    url: ch.notesUrl,
    recommended: ch.chapterNum <= 3,
    addedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    views: 220000 + ((ch.chapterNum * 8321) % 120000),
  }));

  return [masterResource, ...chapterResources];
});
