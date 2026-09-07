import { User, Note, Comment, Report, NotificationItem, SubjectInfo } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex.chen@stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'CS Senior @ Stanford. Passionate about Distributed Systems, AI, and teaching. TA for CS161.',
    university: 'Stanford University',
    role: 'student',
    createdAt: '2024-09-01T10:00:00.000Z',
    updatedAt: '2024-09-01T10:00:00.000Z',
  },
  {
    id: 'user-admin',
    name: 'Sarah Mitchell',
    email: 'sarah.admin@notenest.edu',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform Lead & Academic Advisor. Ensuring academic integrity and quality study materials.',
    university: 'MIT',
    role: 'admin',
    createdAt: '2024-08-15T09:00:00.000Z',
    updatedAt: '2024-08-15T09:00:00.000Z',
  },
  {
    id: 'user-2',
    name: 'Marcus Vance',
    email: 'marcus.v@berkeley.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'EECS Junior @ UC Berkeley. Specializing in computer architecture, VLSI, and RISC-V design.',
    university: 'UC Berkeley',
    role: 'student',
    createdAt: '2024-09-05T11:20:00.000Z',
    updatedAt: '2024-09-05T11:20:00.000Z',
  },
  {
    id: 'user-3',
    name: 'Elena Rostova',
    email: 'e.rostova@harvard.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Applied Math & Economics double major. Keen on econometrics, game theory, and financial modeling.',
    university: 'Harvard University',
    role: 'student',
    createdAt: '2024-09-10T14:30:00.000Z',
    updatedAt: '2024-09-10T14:30:00.000Z',
  },
  {
    id: 'user-4',
    name: 'David Kim',
    email: 'david.kim@cmu.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Robotics & ML Master student @ Carnegie Mellon. Making deep learning intuitive.',
    university: 'Carnegie Mellon',
    role: 'student',
    createdAt: '2024-09-12T16:45:00.000Z',
    updatedAt: '2024-09-12T16:45:00.000Z',
  },
  {
    id: 'user-5',
    name: 'Priya Sharma',
    email: 'psharma@mit.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Physics & Quantum Computing Researcher. Notes created with rigorous LaTeX typesetting.',
    university: 'MIT',
    role: 'student',
    createdAt: '2024-09-15T08:15:00.000Z',
    updatedAt: '2024-09-15T08:15:00.000Z',
  },
  {
    id: 'user-6',
    name: 'Jordan Hayes',
    email: 'jordan.h@uw.edu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Biochemistry @ UW. Pre-med student sharing synthesized organic chemistry & metabolic pathway maps.',
    university: 'University of Washington',
    role: 'student',
    createdAt: '2024-09-18T12:00:00.000Z',
    updatedAt: '2024-09-18T12:00:00.000Z',
  },
  {
    id: 'user-7',
    name: 'Chloe Dubois',
    email: 'chloe.d@columbia.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Cognitive Neuroscience & Psychology. Summaries of experimental methods and neural correlates.',
    university: 'Columbia University',
    role: 'student',
    createdAt: '2024-09-20T10:10:00.000Z',
    updatedAt: '2024-09-20T10:10:00.000Z',
  },
  {
    id: 'user-8',
    name: 'Lucas Wright',
    email: 'lucas.w@gatech.edu',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Mechanical & Aerospace Eng @ Georgia Tech. Heat transfer, thermodynamics, and aerodynamics.',
    university: 'Georgia Tech',
    role: 'student',
    createdAt: '2024-09-22T15:30:00.000Z',
    updatedAt: '2024-09-22T15:30:00.000Z',
  },
  {
    id: 'user-9',
    name: 'Aisha Patel',
    email: 'aisha.p@utexas.edu',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a1714f3b53c7?w=150&auto=format&fit=crop&q=80',
    bio: 'Information Systems & Data Science. Big Data frameworks, SQL queries, and Python notebooks.',
    university: 'UT Austin',
    role: 'student',
    createdAt: '2024-09-25T14:20:00.000Z',
    updatedAt: '2024-09-25T14:20:00.000Z',
  },
  {
    id: 'user-10',
    name: 'Tyler Reed',
    email: 'treed@cornell.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Civil & Environmental Engineering. Structural analysis, fluid mechanics, and sustainable systems.',
    university: 'Cornell University',
    role: 'student',
    createdAt: '2024-09-28T09:40:00.000Z',
    updatedAt: '2024-09-28T09:40:00.000Z',
  }
];

export const SEED_SUBJECTS: SubjectInfo[] = [
  {
    name: 'Computer Science',
    iconName: 'Code',
    noteCount: 84,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    description: 'Algorithms, OS, Distributed Systems, Web Dev, AI/ML'
  },
  {
    name: 'Mathematics',
    iconName: 'Sigma',
    noteCount: 62,
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    description: 'Calculus, Linear Algebra, Real Analysis, Discrete Math'
  },
  {
    name: 'Electrical Engineering',
    iconName: 'Cpu',
    noteCount: 45,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Circuits, Signal Processing, Embedded Systems, VLSI'
  },
  {
    name: 'Physics',
    iconName: 'Atom',
    noteCount: 38,
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    description: 'Classical Mechanics, Electromagnetism, Quantum Mechanics'
  },
  {
    name: 'Economics',
    iconName: 'TrendingUp',
    noteCount: 51,
    color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
    description: 'Microeconomics, Macroeconomics, Econometrics, Finance'
  },
  {
    name: 'Biology & Medicine',
    iconName: 'Dna',
    noteCount: 40,
    color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    description: 'Cell Biology, Genetics, Biochemistry, Physiology'
  },
  {
    name: 'Psychology',
    iconName: 'Brain',
    noteCount: 29,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
    description: 'Cognitive Psychology, Behavioral Neuroscience, Statistics'
  },
  {
    name: 'Chemistry',
    iconName: 'FlaskConical',
    noteCount: 33,
    color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
    description: 'Organic Chemistry, Physical Chemistry, Thermodynamics'
  }
];

export const SEED_UNIVERSITIES = [
  'Stanford University',
  'MIT',
  'UC Berkeley',
  'Harvard University',
  'Carnegie Mellon',
  'University of Washington',
  'Columbia University',
  'Georgia Tech',
  'UT Austin',
  'Cornell University'
];

export const SEED_SEMESTERS = [
  'Semester 1 (Freshman Fall)',
  'Semester 2 (Freshman Spring)',
  'Semester 3 (Sophomore Fall)',
  'Semester 4 (Sophomore Spring)',
  'Semester 5 (Junior Fall)',
  'Semester 6 (Junior Spring)',
  'Semester 7 (Senior Fall)',
  'Semester 8 (Senior Spring)'
];

export const SEED_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Advanced Database Management & Distributed Storage Systems',
    description: 'Complete synthesis of ACID guarantees, Two-Phase Locking (2PL), MVCC concurrency control, B+ Tree index structures, Raft consensus algorithm, and distributed partitioning strategies. Includes sample exam questions with step-by-step proofs.',
    fileUrl: '/mock/advanced_database_notes.pdf',
    fileName: 'CS145_Advanced_Databases_Full_Notes.pdf',
    fileSize: 4820000,
    fileType: 'application/pdf',
    subject: 'Computer Science',
    university: 'Stanford University',
    course: 'CS145',
    semester: 'Semester 5 (Junior Fall)',
    tags: ['Databases', 'SQL', 'Distributed Systems', 'MVCC', 'Raft', 'Indexes'],
    visibility: 'public',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: 'Stanford University'
    },
    views: 1420,
    downloads: 532,
    likesCount: 124,
    bookmarksCount: 88,
    pageCount: 38,
    previewPages: [
      '# Advanced Database Management & Distributed Storage\n## Lecture 1-4 Overview: Storage Engines & Indexing\n\n### 1. B+ Trees vs LSM Trees\n* **B+ Tree**: High read throughput (O(log N)). Leaf nodes linked for fast sequential scans. Inner nodes hold keys only, maximizing fan-out.\n* **LSM Tree (Log-Structured Merge-tree)**: Optimized for fast write throughput. Writes append to MemTable in RAM, flushed sequentially to SSTables on disk.\n\n### 2. Concurrency Control Mechanisms\n* Strict Two-Phase Locking (Strict 2PL): Cascading abort prevention.\n* Multi-Version Concurrency Control (MVCC): Readers never block writers, writers never block readers by maintaining tuple snapshots.\n\n### 3. Distributed Transactions & Consensus\n* Two-Phase Commit (2PC): Coordinator sends Prepare -> Commit. Vulnerable to coordinator crash.\n* Raft: Leader election, log replication, safety property guarantees majority quorum.',
      '## Chapter 2: Query Optimization & Cost Estimation\n\n```sql\nEXPLAIN ANALYZE SELECT u.name, count(n.id) \nFROM users u \nJOIN notes n ON u.id = n.author_id \nWHERE n.created_at > NOW() - INTERVAL \'30 days\' \nGROUP BY u.name;\n```\n\nKey optimization metrics:\n1. Hash Join vs Nested Loop Join vs Sort-Merge Join\n2. Cardinality estimation using histograms and HyperLogLog counters\n3. Push-down predicates to minimize intermediate relation size\n4. Buffer pool hit ratios and asynchronous dirty page flushes.',
      '## Chapter 3: Raft Consensus In-Depth\n\n* **Term numbers**: Logical clocks detecting stale leaders or split votes.\n* **Heartbeat interval**: Must be significantly smaller than election timeout (e.g. 50ms vs 300ms).\n* **Commit rule**: Leader commits entry once replicated on majority of followers in current term.\n\nSummary cheat sheet provided for Midterm review.'
    ],
    createdAt: '2024-10-12T14:32:00.000Z',
    updatedAt: '2024-10-12T14:32:00.000Z'
  },
  {
    id: 'note-2',
    title: 'Design and Analysis of Algorithms - CS161 Exam Survival Guide',
    description: 'Master dynamic programming, graph algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall), Network Flow (Ford-Fulkerson, Edmonds-Karp), NP-completeness reductions, and amortized potential functions. Includes visual trace diagrams.',
    fileUrl: '/mock/algorithms_cs161_notes.pdf',
    fileName: 'CS161_Algorithms_Survival_Guide.pdf',
    fileSize: 6200000,
    fileType: 'application/pdf',
    subject: 'Computer Science',
    university: 'Stanford University',
    course: 'CS161',
    semester: 'Semester 4 (Sophomore Spring)',
    tags: ['Algorithms', 'Dynamic Programming', 'Graphs', 'Big-O', 'NP-Complete'],
    visibility: 'public',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: 'Stanford University'
    },
    views: 2890,
    downloads: 1140,
    likesCount: 310,
    bookmarksCount: 245,
    pageCount: 52,
    previewPages: [
      '# CS161: Design and Analysis of Algorithms\n## Comprehensive Final Exam Blueprint\n\n### 1. Master Method & Recurrence Relations\n$$T(n) = a T(n/b) + f(n)$$\n* Case 1: $f(n) = O(n^{\\log_b a - \\epsilon}) \\implies T(n) = \\Theta(n^{\\log_b a})$\n* Case 2: $f(n) = \\Theta(n^{\\log_b a} \\log^k n) \\implies T(n) = \\Theta(n^{\\log_b a} \\log^{k+1} n)$\n* Case 3: $f(n) = \\Omega(n^{\\log_b a + \\epsilon}) \\implies T(n) = \\Theta(f(n))$\n\n### 2. Graph Algorithms Complexity Comparison\n| Algorithm | Single Source? | Negative Edges? | Complexity |\n|---|---|---|---|\n| BFS / DFS | Yes | Unweighted | O(V + E) |\n| Dijkstra (Min-Heap) | Yes | No | O((V + E) log V) |\n| Bellman-Ford | Yes | Yes (detects cycles) | O(V * E) |\n| Floyd-Warshall | All-pairs | Yes | O(V^3) |',
      '## Section 4: Dynamic Programming Patterns\n\n1. **Subproblem Definition**: Define $DP[i][j]$ with crystal clear English semantics.\n2. **Base Cases**: Identify edge boundaries ($i=0$ or $j=0$).\n3. **Transition Function**: Explicit state recurrence.\n4. **Computation Order**: Bottom-up topological ordering.\n5. **Reconstruction**: Backtrack pointers to reconstruct optimal assignment.\n\nClassic examples solved: Longest Common Subsequence (LCS), Knapsack 0/1, Edit Distance, and Matrix Chain Multiplication.'
    ],
    createdAt: '2024-09-28T09:15:00.000Z',
    updatedAt: '2024-09-28T09:15:00.000Z'
  },
  {
    id: 'note-3',
    title: 'Linear Algebra and Multivariable Calculus (18.02 & 18.06)',
    description: 'LaTeX-rendered summary of Eigenvalues, SVD (Singular Value Decomposition), Positive Definite Matrices, Orthogonal Projections, Gradient Vector Fields, Stokes Theorem, and Divergence Theorem with 3D coordinate visualizations.',
    fileUrl: '/mock/linear_algebra_multivar.pdf',
    fileName: 'MIT_1802_1806_Math_Consolidated.pdf',
    fileSize: 7450000,
    fileType: 'application/pdf',
    subject: 'Mathematics',
    university: 'MIT',
    course: '18.06 / 18.02',
    semester: 'Semester 2 (Freshman Spring)',
    tags: ['Linear Algebra', 'Calculus', 'SVD', 'Eigenvalues', 'Vectors', 'Stokes Theorem'],
    visibility: 'public',
    authorId: 'user-5',
    author: {
      id: 'user-5',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      university: 'MIT'
    },
    views: 3410,
    downloads: 1480,
    likesCount: 420,
    bookmarksCount: 312,
    pageCount: 64,
    previewPages: [
      '# MIT 18.06 Linear Algebra: The Four Fundamental Subspaces\n\nFor an $m \\times n$ matrix $A$ of rank $r$:\n\n1. **Column Space $C(A)$**: Subspace of $\\mathbb{R}^m$, dimension $r$.\n2. **Nullspace $N(A)$**: Subspace of $\\mathbb{R}^n$, dimension $n - r$.\n3. **Row Space $C(A^T)$**: Subspace of $\\mathbb{R}^n$, dimension $r$.\n4. **Left Nullspace $N(A^T)$**: Subspace of $\\mathbb{R}^m$, dimension $m - r$.\n\n*Fundamental Theorem*: $C(A^T) \\perp N(A)$ and $C(A) \\perp N(A^T)$.\n\n### Singular Value Decomposition (SVD)\n$$A = U \\Sigma V^T$$\n* Columns of $V$ are eigenvectors of $A^T A$\n* Columns of $U$ are eigenvectors of $A A^T$\n* Singular values $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$',
      '# Vector Calculus: Fundamental Theorems of Integration\n\n### Green\'s Theorem (Planar)\n$$\\oint_C (L dx + M dy) = \\iint_D \\left(\\frac{\\partial M}{\\partial x} - \\frac{\\partial L}{\\partial y}\\right) dA$$\n\n### Stokes\' Theorem (Surface to Boundary)\n$$\\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r}$$\n\n### Divergence Theorem (Volume to Surface)\n$$\\iiint_V (\\nabla \\cdot \\mathbf{F}) dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}$$'
    ],
    createdAt: '2024-10-04T16:20:00.000Z',
    updatedAt: '2024-10-04T16:20:00.000Z'
  },
  {
    id: 'note-4',
    title: 'Computer Architecture & RISC-V Pipeline Implementation (CS61C)',
    description: 'Hardware concepts from C code to transistor logic. Covers 5-stage classic RISC-V pipeline, data hazards, branch prediction, caches (direct-mapped, set associative), virtual memory (TLB, page tables), and SIMD parallelization.',
    fileUrl: '/mock/riscv_architecture_cs61c.pdf',
    fileName: 'Berkeley_CS61C_Full_Course_Pack.pdf',
    fileSize: 5120000,
    fileType: 'application/pdf',
    subject: 'Electrical Engineering',
    university: 'UC Berkeley',
    course: 'CS61C',
    semester: 'Semester 3 (Sophomore Fall)',
    tags: ['Architecture', 'RISC-V', 'Pipelining', 'Caches', 'Hardware', 'Assembly'],
    visibility: 'public',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley'
    },
    views: 1980,
    downloads: 780,
    likesCount: 195,
    bookmarksCount: 140,
    pageCount: 44,
    previewPages: [
      '# UC Berkeley CS61C: Great Ideas in Computer Architecture\n## 5-Stage RISC-V Pipeline Breakdown\n\n1. **IF (Instruction Fetch)**: Read instruction at PC from Instruction Memory, update PC = PC + 4.\n2. **ID (Instruction Decode & Register Read)**: Read operands from Register File, generate control signals.\n3. **EX (Execute / Address Calculation)**: ALU performs operation or calculates memory effective address.\n4. **MEM (Memory Access)**: Read/write Data Memory for loads/stores.\n5. **WB (Write Back)**: Commit result back to destination register $rd$.\n\n### Hazard Resolution Strategies\n* **Structural Hazard**: Separate I-Cache and D-Cache.\n* **Data Hazard (RAW)**: Forwarding from EX/MEM or MEM/WB stage. 1-cycle stall for load-use.\n* **Control Hazard**: 2-bit saturating counter branch predictor, flush pipeline on mispredict.',
      '## Memory Hierarchy: Cache Calculations\n\nGiven 32-bit address, 64KB 4-way set-associative cache with 64-byte block size:\n* Block offset: $\\log_2(64) = 6$ bits\n* Number of lines: $64\\text{KB} / 64\\text{B} = 1024$ lines\n* Number of sets: $1024 / 4 = 256$ sets $\\implies$ Set Index = $\\log_2(256) = 8$ bits\n* Tag bits: $32 - 8 - 6 = 18$ bits\n\nCache hit formula: $T_{avg} = T_{hit} + (\\text{Miss Rate} \\times \\text{Miss Penalty})$'
    ],
    createdAt: '2024-09-18T13:40:00.000Z',
    updatedAt: '2024-09-18T13:40:00.000Z'
  },
  {
    id: 'note-5',
    title: 'Deep Learning & Neural Architectures (10-701 / CS231n)',
    description: 'Comprehensive math derivations and PyTorch snippets for Convolutional Neural Networks, ResNets, Transformers (Self-Attention mechanism), Backpropagation calculus, Adam optimizer equations, and Diffusion models.',
    fileUrl: '/mock/deep_learning_cmu_notes.pdf',
    fileName: 'CMU_10701_Deep_Learning_Notes.pdf',
    fileSize: 8900000,
    fileType: 'application/pdf',
    subject: 'Computer Science',
    university: 'Carnegie Mellon',
    course: '10-701',
    semester: 'Semester 6 (Junior Spring)',
    tags: ['Deep Learning', 'Transformers', 'CNN', 'PyTorch', 'Machine Learning', 'Attention'],
    visibility: 'public',
    authorId: 'user-4',
    author: {
      id: 'user-4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      university: 'Carnegie Mellon'
    },
    views: 4120,
    downloads: 1890,
    likesCount: 560,
    bookmarksCount: 420,
    pageCount: 78,
    previewPages: [
      '# CMU 10-701: Modern Deep Learning Architectures\n## Chapter 7: The Scaled Dot-Product Attention\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$\n\nWhere:\n* $Q = X W_Q$ (Queries)\n* $K = X W_K$ (Keys)\n* $V = X W_V$ (Values)\n* Division by $\\sqrt{d_k}$ prevents gradients from vanishing into saturated regions of softmax for large dimensions.\n\n### Multi-Head Attention\n$$\\text{MHA}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$\nAllows model to jointly attend to information at different positions from different representation subspaces.',
      '## Optimization: Adam (Adaptive Moment Estimation)\n\n1. Biased first moment estimate: $m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$\n2. Biased second raw moment: $v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$\n3. Bias correction:\n   $$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$$\n4. Parameter update:\n   $$\\theta_t = \\theta_{t-1} - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$'
    ],
    createdAt: '2024-10-18T18:10:00.000Z',
    updatedAt: '2024-10-18T18:10:00.000Z'
  },
  {
    id: 'note-6',
    title: 'Microeconomic Theory & Game Theory (Econ 2010A)',
    description: 'Rigorous consumer utility maximization (Marshallian vs Hicksian demand, Slutsky equation), production functions, Nash equilibrium, Subgame Perfect Equilibrium, Bayesian games, and mechanism design.',
    fileUrl: '/mock/microeconomic_theory_harvard.pdf',
    fileName: 'Harvard_Econ2010_Microeconomic_Theory.pdf',
    fileSize: 3950000,
    fileType: 'application/pdf',
    subject: 'Economics',
    university: 'Harvard University',
    course: 'ECON 2010',
    semester: 'Semester 3 (Sophomore Fall)',
    tags: ['Economics', 'Microeconomics', 'Game Theory', 'Nash Equilibrium', 'Consumer Theory'],
    visibility: 'public',
    authorId: 'user-3',
    author: {
      id: 'user-3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      university: 'Harvard University'
    },
    views: 1650,
    downloads: 640,
    likesCount: 178,
    bookmarksCount: 119,
    pageCount: 42,
    previewPages: [
      '# Harvard Econ 2010: Advanced Microeconomic Theory\n## Part 1: Consumer Optimization & Duality\n\n### Primal: Utility Maximization Problem (UMP)\n$$\\max_{x} u(x) \\quad \\text{s.t.} \\quad p \\cdot x \\le w$$\nYields Marshallian demand $x(p, w)$ and indirect utility function $v(p, w) = u(x(p, w))$.\n\n### Dual: Expenditure Minimization Problem (EMP)\n$$\\min_{x} p \\cdot x \\quad \\text{s.t.} \\quad u(x) \\ge u$$\nYields Hicksian demand $h(p, u)$ and expenditure function $e(p, u) = p \\cdot h(p, u)$.\n\n### Slutsky Decomposition\n$$\\frac{\\partial x_i(p,w)}{\\partial p_j} = \\underbrace{\\frac{\\partial h_i(p, u)}{\\partial p_j}}_{\\text{Substitution Effect (}\\le 0\\text{)}} - \\underbrace{x_j(p,w) \\frac{\\partial x_i(p,w)}{\\partial w}}_{\\text{Income Effect}}$$'
    ],
    createdAt: '2024-09-14T11:00:00.000Z',
    updatedAt: '2024-09-14T11:00:00.000Z'
  },
  {
    id: 'note-7',
    title: 'Biochemistry & Metabolic Pathways Complete Master Map',
    description: 'High-resolution diagrammatic notes of Glycolysis, Krebs Cycle (TCA), Oxidative Phosphorylation, Gluconeogenesis, Beta-Oxidation of fatty acids, and enzyme regulation with clinical correlations.',
    fileUrl: '/mock/biochemistry_metabolic_pathways.pdf',
    fileName: 'UW_BIOC405_Metabolic_Pathways_Master.pdf',
    fileSize: 9200000,
    fileType: 'application/pdf',
    subject: 'Biology & Medicine',
    university: 'University of Washington',
    course: 'BIOC 405',
    semester: 'Semester 4 (Sophomore Spring)',
    tags: ['Biochemistry', 'Metabolism', 'Glycolysis', 'Krebs Cycle', 'Pre-Med', 'Enzymes'],
    visibility: 'public',
    authorId: 'user-6',
    author: {
      id: 'user-6',
      name: 'Jordan Hayes',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      university: 'University of Washington'
    },
    views: 2430,
    downloads: 980,
    likesCount: 285,
    bookmarksCount: 210,
    pageCount: 56,
    previewPages: [
      '# BIOC 405: Integrated Human Metabolism\n## Lecture 6: Regulation of Cellular Respiration\n\n### 1. Glycolysis Regulatory Checkpoints\n* **Hexokinase**: Inhibited by Glucose-6-Phosphate (product inhibition).\n* **Phosphofructokinase-1 (PFK-1)**: Committed step! Activated by AMP, Fructose-2,6-bisphosphate; inhibited by ATP, Citrate.\n* **Pyruvate Kinase**: Activated by F-1,6-BP; inhibited by ATP, Acetyl-CoA, Alanine.\n\n### 2. Electron Transport Chain Yields\n* Complex I $\\rightarrow$ CoQ $\\rightarrow$ Complex III $\\rightarrow$ Cytochrome c $\\rightarrow$ Complex IV $\\rightarrow$ $O_2$\n* Total ATP generated per glucose molecule: ~30-32 ATP under aerobic conditions.',
      '## Lipid Metabolism: Beta-Oxidation Steps\n1. Dehydrogenation (Acyl-CoA Dehydrogenase $\\rightarrow FADH_2$)\n2. Hydration (Enoyl-CoA Hydratase)\n3. Oxidation (3-Hydroxyacyl-CoA Dehydrogenase $\\rightarrow NADH$)\n4. Thiolysis (Thiolase $\\rightarrow$ releases Acetyl-CoA)\n\nNet yield for Palmitate (16C): 7 rounds = 8 Acetyl-CoA + 7 FADH2 + 7 NADH = 106 ATP.'
    ],
    createdAt: '2024-09-30T10:50:00.000Z',
    updatedAt: '2024-09-30T10:50:00.000Z'
  },
  {
    id: 'note-8',
    title: 'Quantum Mechanics I - Wave Mechanics & Harmonic Oscillator (8.04)',
    description: 'Derivations of time-dependent Schrödinger equation, particle in a 1D/3D box, Dirac bra-ket notation, ladder operators for quantum harmonic oscillator, and perturbation theory basics.',
    fileUrl: '/mock/quantum_mechanics_804.pdf',
    fileName: 'MIT_804_Quantum_Mechanics_I.pdf',
    fileSize: 6100000,
    fileType: 'application/pdf',
    subject: 'Physics',
    university: 'MIT',
    course: '8.04',
    semester: 'Semester 5 (Junior Fall)',
    tags: ['Physics', 'Quantum Mechanics', 'Schrodinger', 'Harmonic Oscillator', 'Wavefunctions'],
    visibility: 'public',
    authorId: 'user-5',
    author: {
      id: 'user-5',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      university: 'MIT'
    },
    views: 1840,
    downloads: 710,
    likesCount: 230,
    bookmarksCount: 165,
    pageCount: 48,
    previewPages: [
      '# MIT 8.04: Quantum Physics I\n## Postulates of Quantum Mechanics\n\n1. State space is a complex Hilbert space $\\mathcal{H}$. Normalized state vector $|\\psi\\rangle$.\n2. Observables correspond to Hermitian operators $\\hat{A} = \\hat{A}^\\dagger$.\n3. Measurement outcome is an eigenvalue $a_n$ with probability $P(a_n) = |\\langle u_n | \\psi \\rangle|^2$.\n4. Time evolution obeys Schrödinger equation:\n   $$i\\hbar \\frac{d}{dt}|\\psi(t)\\rangle = \\hat{H}|\\psi(t)\\rangle$$\n\n### The Quantum Harmonic Oscillator: Ladder Operator Method\n$$\\hat{a} = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat{x} + \\frac{i}{m\\omega}\\hat{p}\\right), \\quad \\hat{a}^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat{x} - \\frac{i}{m\\omega}\\hat{p}\\right)$$\n$$[\\hat{a}, \\hat{a}^\\dagger] = 1, \\quad \\hat{H} = \\hbar\\omega\\left(\\hat{a}^\\dagger \\hat{a} + \\frac{1}{2}\\right)$$\nEnergy levels: $E_n = \\hbar\\omega(n + 1/2)$ for $n \\in \\{0, 1, 2, \\dots\\}$.'
    ],
    createdAt: '2024-10-08T15:00:00.000Z',
    updatedAt: '2024-10-08T15:00:00.000Z'
  },
  {
    id: 'note-9',
    title: 'Cognitive Neuroscience & Human Memory Models (PSYC 2200)',
    description: 'Detailed analysis of Hippocampal long-term potentiation (LTP), Baddeley\'s working memory model, fMRI experimental paradigms, semantic vs episodic dissociation, and executive function in the prefrontal cortex.',
    fileUrl: '/mock/cognitive_neuroscience_notes.pdf',
    fileName: 'Columbia_PSYC2200_Cognitive_Neuro.pdf',
    fileSize: 4200000,
    fileType: 'application/pdf',
    subject: 'Psychology',
    university: 'Columbia University',
    course: 'PSYC 2200',
    semester: 'Semester 4 (Sophomore Spring)',
    tags: ['Psychology', 'Neuroscience', 'Memory', 'Brain', 'Cognition', 'Hippocampus'],
    visibility: 'public',
    authorId: 'user-7',
    author: {
      id: 'user-7',
      name: 'Chloe Dubois',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      university: 'Columbia University'
    },
    views: 1190,
    downloads: 410,
    likesCount: 145,
    bookmarksCount: 92,
    pageCount: 36,
    previewPages: [
      '# PSYC 2200: Cognitive Neuroscience of Memory\n## Synaptic Plasticity & LTP Mechanism\n\n1. High-frequency stimulation of Schaffer collateral axons.\n2. Depolarization expels $Mg^{2+}$ block from NMDA receptors.\n3. Massive $Ca^{2+}$ influx activates CaMKII and PKC.\n4. Retrograde messengers increase presynaptic glutamate release.\n5. AMPA receptor insertion into postsynaptic density increases EPSP amplitude.\n\n### Double Dissociation: Patient H.M. vs K.F.\n* **H.M.**: Bilateral medial temporal lobectomy. Severe anterograde amnesia, intact working memory and procedural learning.\n* **K.F.**: Left perisylvian damage. Impaired verbal working memory (digit span = 2), normal long-term consolidation.'
    ],
    createdAt: '2024-10-15T09:20:00.000Z',
    updatedAt: '2024-10-15T09:20:00.000Z'
  },
  {
    id: 'note-10',
    title: 'Organic Chemistry II - Mechanisms and Synthesis Strategies (CHEM 20B)',
    description: 'Reaction mechanism compendium including Aldol condensation, Diels-Alder cycloadditions, Wittig reactions, Grignard reagents, protecting groups, and multistep retrosynthetic analysis with arrow-pushing guides.',
    fileUrl: '/mock/organic_chemistry_mechanisms.pdf',
    fileName: 'Berkeley_CHEM20B_Organic_Synthesis.pdf',
    fileSize: 7800000,
    fileType: 'application/pdf',
    subject: 'Chemistry',
    university: 'UC Berkeley',
    course: 'CHEM 20B',
    semester: 'Semester 3 (Sophomore Fall)',
    tags: ['Chemistry', 'Organic Chemistry', 'Synthesis', 'Mechanisms', 'Carbonyls'],
    visibility: 'public',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley'
    },
    views: 2150,
    downloads: 870,
    likesCount: 260,
    bookmarksCount: 180,
    pageCount: 50,
    previewPages: [
      '# CHEM 20B: Organic Chemistry Mechanisms\n## Carbonyl Chemistry & Enolate Chemistry\n\n### 1. The Aldol Reaction\n* Base-catalyzed enolization of aldehyde/ketone.\n* Nucleophilic addition to second carbonyl molecule.\n* Dehydration via $E1cB$ to $\\alpha,\\beta$-unsaturated carbonyl (conjugated product).\n\n### 2. Diels-Alder [4+2] Cycloaddition\n* Concerted pericyclic mechanism with 6 $\\pi$ electrons.\n* Stereospecificity: cis-dienophile yields cis-adduct.\n* Endo rule: Secondary orbital overlap favors endo transition state over exo.\n\nComplete list of 45 arrow-pushing mechanisms included.'
    ],
    createdAt: '2024-10-02T13:10:00.000Z',
    updatedAt: '2024-10-02T13:10:00.000Z'
  },
  {
    id: 'note-11',
    title: 'Operating Systems & Concurrency In-Depth (CS 162)',
    description: 'Threads, processes, deadlock detection (Banker\'s algorithm), semaphores, monitors, virtual memory page replacement (LRU, Clock), file systems (FAT, FFS, Ext4, Log-structured), and OS security isolation.',
    fileUrl: '/mock/operating_systems_cs162.pdf',
    fileName: 'Berkeley_CS162_Operating_Systems.pdf',
    fileSize: 5800000,
    fileType: 'application/pdf',
    subject: 'Computer Science',
    university: 'UC Berkeley',
    course: 'CS 162',
    semester: 'Semester 4 (Sophomore Spring)',
    tags: ['Operating Systems', 'Concurrency', 'Virtual Memory', 'Threads', 'File Systems'],
    visibility: 'public',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley'
    },
    views: 3200,
    downloads: 1390,
    likesCount: 380,
    bookmarksCount: 290,
    pageCount: 62,
    previewPages: [
      '# UC Berkeley CS162: Operating Systems and System Programming\n## Synchronization Primitives & Deadlock Conditions\n\n### Coffman Conditions for Deadlock:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\n\n### Semaphore Implementation\n```c\ntypedef struct {\n    int value;\n    struct process_queue *queue;\n} semaphore;\n\nvoid P(semaphore *s) { // wait\n    s->value--;\n    if (s->value < 0) {\n        add_to_queue(s->queue, current_process);\n        block();\n    }\n}\n\nvoid V(semaphore *s) { // signal\n    s->value++;\n    if (s->value <= 0) {\n        process *p = remove_from_queue(s->queue);\n        wakeup(p);\n    }\n}\n```'
    ],
    createdAt: '2024-09-22T17:40:00.000Z',
    updatedAt: '2024-09-22T17:40:00.000Z'
  },
  {
    id: 'note-12',
    title: 'Probability and Statistics for Engineers & Scientists (MATH 218)',
    description: 'Random variables, Joint probability density functions, Central Limit Theorem (CLT), Hypothesis testing (t-test, ANOVA, chi-square), Maximum Likelihood Estimation (MLE), and Bayesian inference.',
    fileUrl: '/mock/probability_statistics_math218.pdf',
    fileName: 'CMU_MATH218_Probability_Stats.pdf',
    fileSize: 4500000,
    fileType: 'application/pdf',
    subject: 'Mathematics',
    university: 'Carnegie Mellon',
    course: 'MATH 218',
    semester: 'Semester 3 (Sophomore Fall)',
    tags: ['Probability', 'Statistics', 'Bayes', 'Hypothesis Testing', 'MLE'],
    visibility: 'public',
    authorId: 'user-4',
    author: {
      id: 'user-4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      university: 'Carnegie Mellon'
    },
    views: 1720,
    downloads: 690,
    likesCount: 190,
    bookmarksCount: 145,
    pageCount: 40,
    previewPages: [
      '# CMU MATH 218: Applied Probability & Statistics\n## Maximum Likelihood Estimation (MLE)\n\nGiven independent observations $X_1, \\dots, X_n \\sim f(x; \\theta)$:\n\nLikelihood function:\n$$L(\\theta) = \\prod_{i=1}^n f(X_i; \\theta)$$\n\nLog-Likelihood:\n$$\\ell(\\theta) = \\sum_{i=1}^n \\ln f(X_i; \\theta)$$\n\nSet score function to zero:\n$$\\frac{\\partial \\ell(\\theta)}{\\partial \\theta} = 0 \\implies \\hat{\\theta}_{MLE}$$\n\nVerify negative second derivative for concavity: $\\frac{\\partial^2 \\ell(\\theta)}{\\partial \\theta^2} < 0$.'
    ],
    createdAt: '2024-10-06T12:00:00.000Z',
    updatedAt: '2024-10-06T12:00:00.000Z'
  },
  {
    id: 'note-13',
    title: 'Econometrics & Causal Inference with R (Econ 1120)',
    description: 'Instrumental Variables (2SLS), Difference-in-Differences (DiD), Regression Discontinuity Design (RDD), Fixed Effects Panel Data, and heteroskedasticity-robust standard errors with reproducible R script snippets.',
    fileUrl: '/mock/econometrics_causal_inference.pdf',
    fileName: 'Harvard_Econ1120_Causal_Inference.pdf',
    fileSize: 4950000,
    fileType: 'application/pdf',
    subject: 'Economics',
    university: 'Harvard University',
    course: 'ECON 1120',
    semester: 'Semester 5 (Junior Fall)',
    tags: ['Econometrics', 'Causal Inference', 'Regression', 'R', 'Economics'],
    visibility: 'public',
    authorId: 'user-3',
    author: {
      id: 'user-3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      university: 'Harvard University'
    },
    views: 1380,
    downloads: 520,
    likesCount: 155,
    bookmarksCount: 110,
    pageCount: 46,
    previewPages: [
      '# ECON 1120: Econometrics and Modern Causal Inference\n## Quasi-Experimental Identification Methods\n\n### 1. Difference-in-Differences (DiD)\n$$Y_{it} = \\beta_0 + \\beta_1 \\text{Treated}_i + \\beta_2 \\text{Post}_t + \\delta (\\text{Treated}_i \\times \\text{Post}_t) + \\epsilon_{it}$$\nKey assumption: **Parallel Trends**. Visual checks and event-study specifications.\n\n### 2. Instrumental Variables (IV)\nTwo conditions for valid instrument $Z$:\n1. **Relevance**: $\\text{Cov}(Z, X) \\ne 0$ (First-stage F-statistic > 10)\n2. **Exogeneity (Exclusion Restriction)**: $\\text{Cov}(Z, \\epsilon) = 0$'
    ],
    createdAt: '2024-10-10T14:45:00.000Z',
    updatedAt: '2024-10-10T14:45:00.000Z'
  },
  {
    id: 'note-14',
    title: 'Signals & Systems: Fourier, Laplace, and Z-Transforms (EE 120)',
    description: 'Continuous and Discrete-time signals, LTI systems convolution, frequency response, Bode plots, sampling theorem (Nyquist-Shannon), aliasing artifacts, and state-space stability analysis.',
    fileUrl: '/mock/signals_systems_ee120.pdf',
    fileName: 'Berkeley_EE120_Signals_Systems.pdf',
    fileSize: 6700000,
    fileType: 'application/pdf',
    subject: 'Electrical Engineering',
    university: 'UC Berkeley',
    course: 'EE 120',
    semester: 'Semester 4 (Sophomore Spring)',
    tags: ['Signals', 'Fourier', 'Laplace', 'Bode Plots', 'DSP', 'Filter Design'],
    visibility: 'public',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley'
    },
    views: 1890,
    downloads: 740,
    likesCount: 205,
    bookmarksCount: 150,
    pageCount: 54,
    previewPages: [
      '# EE 120: Signals & Systems\n## The Fourier Transform Pairs & LTI Filtering\n\nContinuous-Time Fourier Transform (CTFT):\n$$X(j\\omega) = \\int_{-\\infty}^{\\infty} x(t) e^{-j\\omega t} dt$$\n\nInverse CTFT:\n$$x(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} X(j\\omega) e^{j\\omega t} d\\omega$$\n\nConvolution in time corresponds to multiplication in frequency:\n$$y(t) = x(t) * h(t) \\iff Y(j\\omega) = X(j\\omega) H(j\\omega)$$'
    ],
    createdAt: '2024-09-26T16:00:00.000Z',
    updatedAt: '2024-09-26T16:00:00.000Z'
  },
  {
    id: 'note-15',
    title: 'Molecular Genetics & CRISPR Technology Primer (BIO 102)',
    description: 'DNA replication fidelity, RNA processing (splicing, polyadenylation), chromatin remodeling, operon regulation, CRISPR-Cas9 genome editing mechanisms, and Next-Gen Sequencing (NGS) workflows.',
    fileUrl: '/mock/molecular_genetics_bio102.pdf',
    fileName: 'UW_BIO102_Molecular_Genetics.pdf',
    fileSize: 5300000,
    fileType: 'application/pdf',
    subject: 'Biology & Medicine',
    university: 'University of Washington',
    course: 'BIO 102',
    semester: 'Semester 2 (Freshman Spring)',
    tags: ['Genetics', 'CRISPR', 'DNA', 'RNA', 'Biology', 'Molecular'],
    visibility: 'public',
    authorId: 'user-6',
    author: {
      id: 'user-6',
      name: 'Jordan Hayes',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      university: 'University of Washington'
    },
    views: 1540,
    downloads: 590,
    likesCount: 168,
    bookmarksCount: 125,
    pageCount: 42,
    previewPages: [
      '# BIO 102: Molecular Genetics & Gene Regulation\n## CRISPR-Cas9 Mechanism & Applications\n\n1. **sgRNA (single guide RNA)**: Engineered fusion of crRNA and tracrRNA with 20nt targeting sequence.\n2. **PAM sequence**: SpCas9 requires 5\'-NGG-3\' immediately downstream of target site.\n3. **Double-Strand Break (DSB)**: HNH and RuvC endonuclease domains cleave target strands 3bp upstream of PAM.\n4. **Repair pathways**:\n   * Non-Homologous End Joining (NHEJ): Error-prone insertions/deletions $\\rightarrow$ gene knockout.\n   * Homology-Directed Repair (HDR): Precise template insertion.'
    ],
    createdAt: '2024-10-14T08:30:00.000Z',
    updatedAt: '2024-10-14T08:30:00.000Z'
  }
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    noteId: 'note-1',
    userId: 'user-2',
    content: 'The section on MVCC snapshots saved my grade on yesterday’s midterm! The diagram comparing B+ Tree leaf pointers to LSM Memtables was clearer than the professor’s textbook.',
    author: {
      id: 'user-2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley'
    },
    createdAt: '2024-10-13T10:15:00.000Z',
    updatedAt: '2024-10-13T10:15:00.000Z'
  },
  {
    id: 'comment-2',
    noteId: 'note-1',
    userId: 'user-4',
    content: 'Super clean notes. Do you have any extra notes on Paxos vs Raft leader lease handling?',
    author: {
      id: 'user-4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      university: 'Carnegie Mellon'
    },
    createdAt: '2024-10-13T14:22:00.000Z',
    updatedAt: '2024-10-13T14:22:00.000Z'
  },
  {
    id: 'comment-3',
    noteId: 'note-2',
    userId: 'user-5',
    content: 'The Master Theorem decision tree on page 3 is gold! Bookmarking this for the qualification exam next week.',
    author: {
      id: 'user-5',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      university: 'MIT'
    },
    createdAt: '2024-10-01T16:05:00.000Z',
    updatedAt: '2024-10-01T16:05:00.000Z'
  },
  {
    id: 'comment-4',
    noteId: 'note-3',
    userId: 'user-1',
    content: 'Priya’s LaTeX notes are legendary at MIT. SVD step-by-step intuition is the best I’ve seen anywhere.',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: 'Stanford University'
    },
    createdAt: '2024-10-05T19:30:00.000Z',
    updatedAt: '2024-10-05T19:30:00.000Z'
  }
];

export const SEED_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-3',
    reporterName: 'Elena Rostova',
    noteId: 'note-1',
    noteTitle: 'Advanced Database Management & Distributed Storage Systems',
    reason: 'Page 23 references a copyrighted proprietary university exam question without solution attribution.',
    details: 'Requesting author to redact question 4 from 2022 midterm archive.',
    status: 'pending',
    createdAt: '2024-10-14T11:20:00.000Z'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'like',
    title: 'New Like!',
    message: 'Marcus Vance and 12 others liked your note: Advanced Database Management',
    read: false,
    noteId: 'note-1',
    createdAt: '2024-10-18T10:00:00.000Z'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'comment',
    title: 'New Comment',
    message: 'David Kim commented on your note: Advanced Database Management',
    read: false,
    noteId: 'note-1',
    createdAt: '2024-10-18T11:30:00.000Z'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'upload',
    title: 'Note Published',
    message: 'Your study guide "CS161 Algorithms Survival Guide" has been successfully published!',
    read: true,
    noteId: 'note-2',
    createdAt: '2024-09-28T09:15:00.000Z'
  }
];
