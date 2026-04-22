const strings = {
  en: {
    // App
    appName: 'JobMart',
    tagline: 'Find local jobs near you',

    // Roles
    iAm: 'I am a...',
    worker: 'Worker',
    workerSub: 'Find jobs near you',
    provider: 'Provider',
    providerSub: 'Post jobs & hire',

    // Auth forms
    yourName: 'Your Name',
    phoneNumber: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    minPassword: 'Min 6 characters',
    repeatPassword: 'Repeat password',
    securityWord: 'Security Word',
    securityWordHint: "Remembered if you forget your password (e.g. your pet's name)",
    signInBtn: 'Sign In',
    createAccount: 'Create Account',
    continueGoogle: 'Continue with Google',
    orDivider: 'or',
    signInTab: 'Sign In',
    registerTab: 'Register',
    phonePlaceholder: '9876543210',

    // Forgot password
    forgotPassword: 'Forgot Password?',
    forgotTitle: 'Reset Password',
    forgotPhone: 'Your registered phone number',
    forgotKeyword: 'Your security word',
    forgotNew: 'New password',
    forgotConfirm: 'Confirm new password',
    forgotSubmit: 'Reset Password',
    forgotBack: 'Back to Sign In',
    forgotSuccess: 'Password reset! Please sign in.',

    // Validation
    validPhone: 'Please enter a valid 10-digit phone number',
    fillAll: 'Please fill in all fields',
    passwordMismatch: 'Passwords do not match',
    passwordShort: 'Password must be at least 6 characters',

    // Landing page
    landingHero: 'Local Work, Done Right',
    landingSubhero: 'Connecting workers & providers in your area — fast, simple, trusted',
    landingWorkerSub: 'Daily wage & gig work near you',
    landingProviderSub: 'Find reliable help, fast',
    landingW1: 'Find jobs within your village or town',
    landingW2: 'Apply with one tap, no paperwork',
    landingW3: 'Get paid fairly — negotiate salary',
    landingP1: 'Post a job in under 2 minutes',
    landingP2: 'Browse local workers instantly',
    landingP3: 'Hire trusted, rated workers only',
    landingWorkerCTA: "I'm a Worker — Find Jobs",
    landingProviderCTA: "I'm a Provider — Post Jobs",
    landingAlready: 'Already have an account?',
    landingSignIn: 'Sign In',

    // Header / greetings
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    hello: 'Hello',

    // Status
    available: 'Available',
    busy: 'Busy',

    // General UI
    save: 'Save',
    cancel: 'Cancel',
    apply: 'Apply',
    connect: 'Connect',
    connected: 'Connected',
    pending: 'Pending',
    back: 'Back',
    loading: 'Loading...',
    noResults: 'No results found',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    submit: 'Submit',
    update: 'Update',
    done: 'Done',
    post: 'Post',
    search: 'Search',
    logout: 'Logout',
    all: 'All',
    chat: 'Chat',
    per: 'per',
    left: 'left',
    filled: 'Filled',

    // Job & application statuses
    statusOpen: 'Open',
    statusAssigned: 'Assigned',
    statusCompleted: 'Completed',
    statusClosed: 'Closed',
    statusPending: 'Pending',
    statusAccepted: 'Accepted',
    statusRejected: 'Rejected',
    statusWithdrawn: 'Withdrawn',
    statusFilled: 'Filled',

    // Job types / modes
    partTime: 'Part-time',
    fullTime: 'Full-time',
    remote: 'Remote',
    offline: 'Offline',

    // Salary periods
    hourly: 'Hour',
    daily: 'Day',
    monthly: 'Month',
    fixed: 'Fixed',

    // Navigation
    navHome: 'Home',
    navBrowseJobs: 'Browse Jobs',
    navMyApplications: 'My Applications',
    navSavedJobs: 'Saved Jobs',
    navConnections: 'Connections',
    navNotifications: 'Notifications',
    navMyProfile: 'My Profile',
    navMyJobPosts: 'My Job Posts',
    navPostJob: 'Post a Job',
    navJobs: 'Jobs',
    navApplied: 'Applied',
    navAlerts: 'Alerts',
    navProfile: 'Profile',
    navMyJobs: 'My Jobs',

    // Dashboard — Worker
    applied: 'Applied',
    saved: 'Saved',
    myRating: 'My Rating',
    browseJobs: 'Browse Jobs',
    myActiveJobs: 'My Active Jobs',
    active: 'Active',
    completeProfile: 'Complete your profile',
    addSkillsLocation: 'Add skills & location to get noticed',
    latestJobs: 'Latest Jobs',
    viewAll: 'View all',
    noJobsYet: 'No jobs posted yet. Check back soon!',

    // Dashboard — Provider
    totalPosts: 'Total Posts',
    openJobs: 'Open Jobs',
    newJob: 'New Job',
    needWorkersFast: 'Need workers fast?',
    postJobQuick: 'Post a job and get applicants quickly',
    myRecentPosts: 'My Recent Posts',
    noJobsPosted: 'No jobs posted yet.',
    postFirstJob: 'Post your first job →',
    postJob: 'Post Job',

    // Browse Jobs
    searchJobs: 'Search jobs...',
    filters: 'Filters',
    clearAll: 'Clear all',
    loadingJobs: 'Loading jobs...',
    minSalary: 'Min ₹',
    maxSalary: 'Max ₹',
    allCategories: 'All Categories',
    allTypes: 'All Types',
    allModes: 'All Modes',

    // Categories
    catCleaning: 'Cleaning',
    catDelivery: 'Delivery',
    catCooking: 'Cooking',
    catGardening: 'Gardening',
    catSecurity: 'Security',
    catDriving: 'Driving',
    catConstruction: 'Construction',
    catShopAssistant: 'Shop Assistant',
    catBabysitting: 'Babysitting',
    catOther: 'Other',

    // Post Job
    postAJob: 'Post a Job',
    fillDetails: 'Fill in the details to find the right worker',
    basicInfo: 'Basic Info',
    jobTitle: 'Job Title',
    jobTitlePlaceholder: 'e.g. House Cleaner, Delivery Boy',
    category: 'Category',
    selectCategory: 'Select a category',
    vacancies: 'Vacancies',
    whatsappNo: 'WhatsApp No.',
    salaryWorkType: 'Salary & Work Type',
    amount: 'Amount (₹)',
    jobType: 'Job Type',
    workMode: 'Work Mode',
    locationLabel: 'Location',
    locationAreaPlaceholder: 'Area, City (e.g. Mangaluru, Karnataka)',
    workDuration: 'Work Duration (Optional)',
    startDate: 'Start Date',
    endDate: 'End Date',
    aiDescription: 'AI Job Description',
    aiDescriptionHint: 'AI will automatically generate a description based on your job details',
    writeDescription: 'Write your job description here...',
    posting: 'Posting...',

    // Profile
    editProfile: 'Edit Profile',
    personalDetails: 'Personal Details',
    fullName: 'Full Name',
    age: 'Age',
    whatsapp: 'WhatsApp',
    language: 'Language',
    bio: 'Bio',
    bioPlaceholder: 'Tell employers a bit about yourself...',
    professionalDetails: 'Professional Details',
    qualification: 'Qualification',
    qualificationPlaceholder: 'e.g. 10th Pass, ITI',
    jobCategory: 'Job Category',
    jobCategoryPlaceholder: 'e.g. Cleaning',
    skills: 'Skills',
    skillsPlaceholder: 'Type a skill and press Enter',
    locationPlaceholder: 'Your area / city',
    noRatings: 'No ratings yet',
    ratings: 'Ratings',
    myProfile: 'My Profile',

    // Job Detail
    salary: 'Salary',
    status: 'Status',
    spotLeft: 'spot left',
    spotsLeft: 'spots left',
    locationTBD: 'Location TBD',
    aboutJob: 'About this job',
    postedBy: 'Posted by',
    locationNotSet: 'Location not set',
    connectForContact: 'Connect with this provider to get contact details',
    alreadyApplied: 'You have already applied for this job',
    coverNote: 'Write a short note (optional)',
    coverNotePlaceholder: "Tell the provider why you're a good fit...",
    negotiateSalary: 'Negotiate salary',
    expectedSalary: 'Your expected salary',
    salaryHint: 'The provider will see your proposed rate',
    submitApplication: 'Submit Application',
    applyForJob: 'Apply for this Job',
    yourJobPost: 'Your Job Post',
    positionsFilled: 'positions filled',
    applicants: 'Applicants',
    noApplicants: 'No applicants yet',

    // My Applications
    myApplications: 'My Applications',
    noApplications: 'No applications yet',
    browseAndApply: 'Browse jobs and apply to get started',
    jobFilledMsg: 'All vacancies for this job have been filled. Keep applying — new jobs are posted daily!',
    rateProvider: 'Rate the Provider',

    // My Jobs
    myJobPosts: 'My Job Posts',
    markComplete: 'Mark as Completed',
    deleteJob: 'Delete Job',
    noApplicantsYet: 'No applicants yet',

    // Saved Jobs
    savedJobs: 'Saved Jobs',
    noSavedJobs: 'No saved jobs yet',
    tapBookmark: 'Tap the bookmark icon on any job to save it',
    removeSaved: 'Remove from saved',

    // Notifications
    notificationsTitle: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications yet',
    notificationHint: "We'll let you know when something happens",
    justNow: 'just now',

    // Connections
    connectionsTitle: 'Connections',
    discover: 'Discover',
    nearby: 'Nearby',
    mine: 'Mine',
    requests: 'Requests',
    searchByName: 'Search by name or skill...',
    noUsersFound: 'No users found',
    wantsToConnect: 'Wants to connect with you',
    noNearby: 'nearby',
    tryRadius: 'Try increasing the radius or update your location in Profile',
    foundNearby: 'found nearby',
    noPendingRequests: 'No pending requests',
    discoverPeople: 'Discover people',
    noConnections: 'No connections yet',
    requestSent: 'Request sent',
    noWhatsApp: 'No WhatsApp number available',
    away: 'away',
    ratings: 'ratings',
  },

  kn: {
    // App
    appName: 'ಜಾಬ್‌ಮಾರ್ಟ್',
    tagline: 'ನಿಮ್ಮ ಹತ್ತಿರ ಕೆಲಸ ಹುಡುಕಿ',

    // Roles
    iAm: 'ನಾನು...',
    worker: 'ಕೆಲಸಗಾರ',
    workerSub: 'ಹತ್ತಿರದ ಕೆಲಸ ಹುಡುಕಿ',
    provider: 'ಉದ್ಯೋಗದಾತ',
    providerSub: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',

    // Auth forms
    yourName: 'ನಿಮ್ಮ ಹೆಸರು',
    phoneNumber: 'ಫೋನ್ ನಂಬರ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ',
    minPassword: 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು',
    repeatPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತೆ ನಮೂದಿಸಿ',
    securityWord: 'ಸುರಕ್ಷಾ ಪದ',
    securityWordHint: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತರೆ ಇದನ್ನು ಉಪಯೋಗಿಸಲಾಗುತ್ತದೆ (ಉದಾ: ನಿಮ್ಮ ಸಾಕುಪ್ರಾಣಿಯ ಹೆಸರು)',
    signInBtn: 'ಸೈನ್ ಇನ್',
    createAccount: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    continueGoogle: 'Google ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ',
    orDivider: 'ಅಥವಾ',
    signInTab: 'ಸೈನ್ ಇನ್',
    registerTab: 'ನೋಂದಣಿ',
    phonePlaceholder: '9876543210',

    // Forgot password
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    forgotTitle: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    forgotPhone: 'ನೋಂದಾಯಿತ ಫೋನ್ ನಂಬರ್',
    forgotKeyword: 'ನಿಮ್ಮ ಸುರಕ್ಷಾ ಪದ',
    forgotNew: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
    forgotConfirm: 'ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ',
    forgotSubmit: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    forgotBack: 'ಹಿಂದೆ ಹೋಗಿ',
    forgotSuccess: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲಾಗಿದೆ! ಮತ್ತೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.',

    // Validation
    validPhone: 'ದಯವಿಟ್ಟು 10-ಅಂಕಿಯ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ',
    fillAll: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ತುಂಬಿಸಿ',
    passwordMismatch: 'ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ',
    passwordShort: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು',

    // Landing page
    landingHero: 'ಊರಿನ ಕೆಲಸ, ಸರಳವಾಗಿ',
    landingSubhero: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಕೆಲಸಗಾರರು ಮತ್ತು ಉದ್ಯೋಗದಾತರನ್ನು ಜೋಡಿಸುತ್ತದೆ',
    landingWorkerSub: 'ಹತ್ತಿರದ ದಿನಗೂಲಿ ಕೆಲಸ ಹುಡುಕಿ',
    landingProviderSub: 'ನಂಬಿಗಸ್ತ ಕೆಲಸಗಾರರನ್ನು ಶೀಘ್ರವಾಗಿ ಹುಡುಕಿ',
    landingW1: 'ನಿಮ್ಮ ಊರು ಅಥವಾ ಪಟ್ಟಣದಲ್ಲಿ ಕೆಲಸ ಹುಡುಕಿ',
    landingW2: 'ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    landingW3: 'ನ್ಯಾಯಯುತ ವೇತನ ಪಡೆಯಿರಿ — ಸಂಬಳ ಮಾತನಾಡಿ',
    landingP1: '2 ನಿಮಿಷದಲ್ಲಿ ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
    landingP2: 'ಸ್ಥಳೀಯ ಕೆಲಸಗಾರರನ್ನು ತಕ್ಷಣ ನೋಡಿ',
    landingP3: 'ರೇಟ್ ಮಾಡಲಾದ ನಂಬಿಗಸ್ತ ಕೆಲಸಗಾರರನ್ನು ಮಾತ್ರ ನೇಮಿಸಿ',
    landingWorkerCTA: 'ನಾನು ಕೆಲಸಗಾರ — ಕೆಲಸ ಹುಡುಕಿ',
    landingProviderCTA: 'ನಾನು ಉದ್ಯೋಗದಾತ — ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
    landingAlready: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    landingSignIn: 'ಸೈನ್ ಇನ್',

    // Header / greetings
    goodMorning: 'ಶುಭ ಬೆಳಗ್ಗೆ',
    goodAfternoon: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    goodEvening: 'ಶುಭ ಸಂಜೆ',
    hello: 'ನಮಸ್ಕಾರ',

    // Status
    available: 'ಲಭ್ಯ',
    busy: 'ಬ್ಯುಸಿ',

    // General UI
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    apply: 'ಅರ್ಜಿ ಹಾಕಿ',
    connect: 'ಸಂಪರ್ಕಿಸಿ',
    connected: 'ಸಂಪರ್ಕಿಸಲಾಗಿದೆ',
    pending: 'ಬಾಕಿ ಇದೆ',
    back: 'ಹಿಂದೆ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    noResults: 'ಫಲಿತಾಂಶ ಸಿಗಲಿಲ್ಲ',
    view: 'ನೋಡಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    update: 'ನವೀಕರಿಸಿ',
    done: 'ಮುಗಿಯಿತು',
    post: 'ಪೋಸ್ಟ್',
    search: 'ಹುಡುಕಿ',
    logout: 'ಹೊರಗೆ ಹೋಗಿ',
    all: 'ಎಲ್ಲ',
    chat: 'ಚಾಟ್',
    per: 'ಪ್ರತಿ',
    left: 'ಉಳಿದಿದೆ',
    filled: 'ತುಂಬಿದೆ',

    // Job & application statuses
    statusOpen: 'ತೆರೆದಿದೆ',
    statusAssigned: 'ನಿಯೋಜಿಸಲಾಗಿದೆ',
    statusCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    statusClosed: 'ಮುಚ್ಚಲಾಗಿದೆ',
    statusPending: 'ಬಾಕಿ ಇದೆ',
    statusAccepted: 'ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ',
    statusRejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    statusWithdrawn: 'ಹಿಂಪಡೆಯಲಾಗಿದೆ',
    statusFilled: 'ತುಂಬಿದೆ',

    // Job types / modes
    partTime: 'ಅರೆಕಾಲಿಕ',
    fullTime: 'ಪೂರ್ಣ ಕಾಲಿಕ',
    remote: 'ದೂರಸ್ಥ',
    offline: 'ಸ್ಥಳದಲ್ಲಿ',

    // Salary periods
    hourly: 'ಗಂಟೆ',
    daily: 'ದಿನ',
    monthly: 'ತಿಂಗಳು',
    fixed: 'ನಿಗದಿತ',

    // Navigation
    navHome: 'ಮನೆ',
    navBrowseJobs: 'ಕೆಲಸ ಹುಡುಕಿ',
    navMyApplications: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    navSavedJobs: 'ಉಳಿಸಿದ ಕೆಲಸಗಳು',
    navConnections: 'ಸಂಪರ್ಕಗಳು',
    navNotifications: 'ಅಧಿಸೂಚನೆಗಳು',
    navMyProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    navMyJobPosts: 'ನನ್ನ ಕೆಲಸದ ಪೋಸ್ಟ್‌ಗಳು',
    navPostJob: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
    navJobs: 'ಕೆಲಸಗಳು',
    navApplied: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ',
    navAlerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    navMyJobs: 'ನನ್ನ ಕೆಲಸಗಳು',

    // Dashboard — Worker
    applied: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ',
    saved: 'ಉಳಿಸಿದ',
    myRating: 'ನನ್ನ ರೇಟಿಂಗ್',
    browseJobs: 'ಕೆಲಸ ಹುಡುಕಿ',
    myActiveJobs: 'ನನ್ನ ಸಕ್ರಿಯ ಕೆಲಸಗಳು',
    active: 'ಸಕ್ರಿಯ',
    completeProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ',
    addSkillsLocation: 'ಕೆಲಸ ಸಿಗಲು ಕೌಶಲ್ಯ ಮತ್ತು ಸ್ಥಳ ಸೇರಿಸಿ',
    latestJobs: 'ಹೊಸ ಕೆಲಸಗಳು',
    viewAll: 'ಎಲ್ಲ ನೋಡಿ',
    noJobsYet: 'ಇನ್ನೂ ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿಲ್ಲ. ಶೀಘ್ರದಲ್ಲಿ ನೋಡಿ!',

    // Dashboard — Provider
    totalPosts: 'ಒಟ್ಟು ಪೋಸ್ಟ್‌ಗಳು',
    openJobs: 'ತೆರೆದ ಕೆಲಸಗಳು',
    newJob: 'ಹೊಸ ಕೆಲಸ',
    needWorkersFast: 'ಕೆಲಸಗಾರರು ಬೇಕೇ?',
    postJobQuick: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ ಶೀಘ್ರದಲ್ಲಿ ಅರ್ಜಿದಾರರನ್ನು ಪಡೆಯಿರಿ',
    myRecentPosts: 'ನನ್ನ ಇತ್ತೀಚಿನ ಪೋಸ್ಟ್‌ಗಳು',
    noJobsPosted: 'ಇನ್ನೂ ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿಲ್ಲ.',
    postFirstJob: 'ನಿಮ್ಮ ಮೊದಲ ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ →',
    postJob: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',

    // Browse Jobs
    searchJobs: 'ಕೆಲಸ ಹುಡುಕಿ...',
    filters: 'ಫಿಲ್ಟರ್‌ಗಳು',
    clearAll: 'ಎಲ್ಲ ತೆರವುಗೊಳಿಸಿ',
    loadingJobs: 'ಕೆಲಸಗಳನ್ನು ಲೋಡ್ ಮಾಡುತ್ತಿದೆ...',
    minSalary: 'ಕನಿಷ್ಠ ₹',
    maxSalary: 'ಗರಿಷ್ಠ ₹',
    allCategories: 'ಎಲ್ಲ ವಿಭಾಗಗಳು',
    allTypes: 'ಎಲ್ಲ ವಿಧಗಳು',
    allModes: 'ಎಲ್ಲ ವಿಧಾನಗಳು',

    // Categories
    catCleaning: 'ಸ್ವಚ್ಛಗೊಳಿಸುವ ಕೆಲಸ',
    catDelivery: 'ಡೆಲಿವರಿ',
    catCooking: 'ಅಡುಗೆ',
    catGardening: 'ತೋಟಗಾರಿಕೆ',
    catSecurity: 'ಭದ್ರತೆ',
    catDriving: 'ಚಾಲಕ',
    catConstruction: 'ಕಟ್ಟಡ ಕಾಮಗಾರಿ',
    catShopAssistant: 'ಅಂಗಡಿ ಸಹಾಯಕ',
    catBabysitting: 'ಮಕ್ಕಳ ಪಾಲನೆ',
    catOther: 'ಇತರ',

    // Post Job
    postAJob: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
    fillDetails: 'ಸರಿಯಾದ ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಲು ವಿವರಗಳನ್ನು ತುಂಬಿಸಿ',
    basicInfo: 'ಮೂಲ ಮಾಹಿತಿ',
    jobTitle: 'ಕೆಲಸದ ಶೀರ್ಷಿಕೆ',
    jobTitlePlaceholder: 'ಉದಾ: ಮನೆ ಸ್ವಚ್ಛಗೊಳಿಸುವವರು, ಡೆಲಿವರಿ ಬಾಯ್',
    category: 'ವಿಭಾಗ',
    selectCategory: 'ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ',
    vacancies: 'ಖಾಲಿ ಹುದ್ದೆಗಳು',
    whatsappNo: 'WhatsApp ನಂ.',
    salaryWorkType: 'ಸಂಬಳ ಮತ್ತು ಕೆಲಸದ ವಿಧ',
    amount: 'ಮೊತ್ತ (₹)',
    jobType: 'ಕೆಲಸದ ವಿಧ',
    workMode: 'ಕೆಲಸದ ವಿಧಾನ',
    locationLabel: 'ಸ್ಥಳ',
    locationAreaPlaceholder: 'ಪ್ರದೇಶ, ನಗರ (ಉದಾ: ಮಂಗಳೂರು, ಕರ್ನಾಟಕ)',
    workDuration: 'ಕೆಲಸದ ಅವಧಿ (ಐಚ್ಛಿಕ)',
    startDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
    endDate: 'ಅಂತ್ಯ ದಿನಾಂಕ',
    aiDescription: 'AI ಕೆಲಸದ ವಿವರಣೆ',
    aiDescriptionHint: 'AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಿಮ್ಮ ಕೆಲಸದ ವಿವರಣೆ ರಚಿಸುತ್ತದೆ',
    writeDescription: 'ನಿಮ್ಮ ಕೆಲಸದ ವಿವರಣೆ ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
    posting: 'ಪೋಸ್ಟ್ ಮಾಡುತ್ತಿದೆ...',

    // Profile
    editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    personalDetails: 'ವ್ಯಕ್ತಿಗತ ವಿವರಗಳು',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    age: 'ವಯಸ್ಸು',
    whatsapp: 'WhatsApp',
    language: 'ಭಾಷೆ',
    bio: 'ಪರಿಚಯ',
    bioPlaceholder: 'ಉದ್ಯೋಗದಾತರಿಗೆ ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ...',
    professionalDetails: 'ವೃತ್ತಿ ವಿವರಗಳು',
    qualification: 'ಅರ್ಹತೆ',
    qualificationPlaceholder: 'ಉದಾ: 10ನೇ ತರಗತಿ, ITI',
    jobCategory: 'ಕೆಲಸದ ವಿಭಾಗ',
    jobCategoryPlaceholder: 'ಉದಾ: ಸ್ವಚ್ಛಗೊಳಿಸುವ ಕೆಲಸ',
    skills: 'ಕೌಶಲ್ಯಗಳು',
    skillsPlaceholder: 'ಕೌಶಲ್ಯ ಟೈಪ್ ಮಾಡಿ ಮತ್ತು Enter ಒತ್ತಿ',
    locationPlaceholder: 'ನಿಮ್ಮ ಪ್ರದೇಶ / ನಗರ',
    noRatings: 'ಇನ್ನೂ ರೇಟಿಂಗ್ ಇಲ್ಲ',
    ratings: 'ರೇಟಿಂಗ್‌ಗಳು',
    myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',

    // Job Detail
    salary: 'ಸಂಬಳ',
    status: 'ಸ್ಥಿತಿ',
    spotLeft: 'ಸ್ಥಳ ಉಳಿದಿದೆ',
    spotsLeft: 'ಸ್ಥಳಗಳು ಉಳಿದಿವೆ',
    locationTBD: 'ಸ್ಥಳ ನಿರ್ಧಾರ ಆಗಿಲ್ಲ',
    aboutJob: 'ಈ ಕೆಲಸದ ಬಗ್ಗೆ',
    postedBy: 'ಪೋಸ್ಟ್ ಮಾಡಿದವರು',
    locationNotSet: 'ಸ್ಥಳ ಹೊಂದಿಸಿಲ್ಲ',
    connectForContact: 'ಸಂಪರ್ಕ ವಿವರಗಳಿಗಾಗಿ ಈ ಉದ್ಯೋಗದಾತರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
    alreadyApplied: 'ನೀವು ಈ ಕೆಲಸಕ್ಕೆ ಈಗಾಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದೀರಿ',
    coverNote: 'ಒಂದು ಸಣ್ಣ ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ (ಐಚ್ಛಿಕ)',
    coverNotePlaceholder: 'ನೀವು ಏಕೆ ಸೂಕ್ತರು ಎಂದು ಹೇಳಿ...',
    negotiateSalary: 'ಸಂಬಳ ಮಾತನಾಡಿ',
    expectedSalary: 'ನಿಮ್ಮ ನಿರೀಕ್ಷಿತ ಸಂಬಳ',
    salaryHint: 'ಉದ್ಯೋಗದಾತರು ನಿಮ್ಮ ಪ್ರಸ್ತಾವಿತ ದರ ನೋಡುತ್ತಾರೆ',
    submitApplication: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    applyForJob: 'ಈ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಿ',
    yourJobPost: 'ನಿಮ್ಮ ಕೆಲಸದ ಪೋಸ್ಟ್',
    positionsFilled: 'ಹುದ್ದೆಗಳು ತುಂಬಿದೆ',
    applicants: 'ಅರ್ಜಿದಾರರು',
    noApplicants: 'ಇನ್ನೂ ಅರ್ಜಿದಾರರಿಲ್ಲ',

    // My Applications
    myApplications: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    noApplications: 'ಇನ್ನೂ ಅರ್ಜಿಗಳಿಲ್ಲ',
    browseAndApply: 'ಕೆಲಸ ಹುಡುಕಿ ಮತ್ತು ಅರ್ಜಿ ಹಾಕಿ',
    jobFilledMsg: 'ಈ ಕೆಲಸದ ಎಲ್ಲ ಹುದ್ದೆಗಳು ತುಂಬಿದೆ. ಮುಂದುವರಿಯಿರಿ — ಪ್ರತಿ ದಿನ ಹೊಸ ಕೆಲಸಗಳು ಬರುತ್ತವೆ!',
    rateProvider: 'ಉದ್ಯೋಗದಾತರನ್ನು ರೇಟ್ ಮಾಡಿ',

    // My Jobs
    myJobPosts: 'ನನ್ನ ಕೆಲಸದ ಪೋಸ್ಟ್‌ಗಳು',
    markComplete: 'ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    deleteJob: 'ಕೆಲಸ ಅಳಿಸಿ',
    noApplicantsYet: 'ಇನ್ನೂ ಅರ್ಜಿದಾರರಿಲ್ಲ',

    // Saved Jobs
    savedJobs: 'ಉಳಿಸಿದ ಕೆಲಸಗಳು',
    noSavedJobs: 'ಇನ್ನೂ ಕೆಲಸಗಳನ್ನು ಉಳಿಸಿಲ್ಲ',
    tapBookmark: 'ಯಾವುದೇ ಕೆಲಸದ ಮೇಲೆ ಬುಕ್‌ಮಾರ್ಕ್ ಒತ್ತಿ ಉಳಿಸಿ',
    removeSaved: 'ಉಳಿಸಿದ ಪಟ್ಟಿಯಿಂದ ತೆಗೆಯಿರಿ',

    // Notifications
    notificationsTitle: 'ಅಧಿಸೂಚನೆಗಳು',
    markAllRead: 'ಎಲ್ಲ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    noNotifications: 'ಇನ್ನೂ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ',
    notificationHint: 'ಏನಾದರೂ ಆದಾಗ ತಿಳಿಸುತ್ತೇವೆ',
    justNow: 'ಈಗ ತಾನೇ',

    // Connections
    connectionsTitle: 'ಸಂಪರ್ಕಗಳು',
    discover: 'ಹುಡುಕಿ',
    nearby: 'ಹತ್ತಿರದ',
    mine: 'ನನ್ನದು',
    requests: 'ವಿನಂತಿಗಳು',
    searchByName: 'ಹೆಸರು ಅಥವಾ ಕೌಶಲ್ಯದಿಂದ ಹುಡುಕಿ...',
    noUsersFound: 'ಬಳಕೆದಾರರು ಸಿಗಲಿಲ್ಲ',
    wantsToConnect: 'ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಲು ಬಯಸುತ್ತಿದ್ದಾರೆ',
    noNearby: 'ಹತ್ತಿರ ಯಾರೂ ಇಲ್ಲ',
    tryRadius: 'ರೇಡಿಯಸ್ ಹೆಚ್ಚಿಸಿ ಅಥವಾ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಸ್ಥಳ ನವೀಕರಿಸಿ',
    foundNearby: 'ಹತ್ತಿರ ಸಿಕ್ಕಿದ',
    noPendingRequests: 'ಬಾಕಿ ವಿನಂತಿಗಳಿಲ್ಲ',
    discoverPeople: 'ಜನರನ್ನು ಹುಡುಕಿ',
    noConnections: 'ಇನ್ನೂ ಸಂಪರ್ಕಗಳಿಲ್ಲ',
    requestSent: 'ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ',
    noWhatsApp: 'WhatsApp ನಂಬರ್ ಇಲ್ಲ',
    away: 'ದೂರ',
    ratings: 'ರೇಟಿಂಗ್‌ಗಳು',
  },
};

export const t = (lang, key) => strings[lang]?.[key] || strings.en[key] || key;

// Translate job/application status values from API
export const tStatus = (lang, status) => {
  const map = {
    open: 'statusOpen', assigned: 'statusAssigned', completed: 'statusCompleted',
    closed: 'statusClosed', pending: 'statusPending', accepted: 'statusAccepted',
    rejected: 'statusRejected', withdrawn: 'statusWithdrawn', filled: 'statusFilled',
  };
  return t(lang, map[status] || status);
};

// Translate job type
export const tJobType = (lang, type) => {
  const map = { 'part-time': 'partTime', 'full-time': 'fullTime' };
  return t(lang, map[type] || type);
};

// Translate work mode
export const tWorkMode = (lang, mode) => {
  const map = { remote: 'remote', offline: 'offline' };
  return t(lang, map[mode] || mode);
};

// Translate salary period
export const tPeriod = (lang, period) => {
  const map = { hourly: 'hourly', daily: 'daily', monthly: 'monthly', fixed: 'fixed' };
  return t(lang, map[period] || period);
};

// Time ago helper (translated)
export const tTimeAgo = (lang, dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return t(lang, 'justNow');
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};
