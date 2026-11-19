// src/data/taxonomy.ts
var MAJOR_GROUPS = [
  {
    label: "STEM",
    options: [
      "Computer Science",
      "Engineering",
      "Biology",
      "Chemistry",
      "Mathematics",
      "Environmental Science"
    ]
  },
  { label: "Business", options: ["Business", "Economics", "Accounting", "Marketing"] },
  {
    label: "Social science",
    options: [
      "Psychology",
      "Sociology",
      "Political Science",
      "Anthropology",
      "Public Health",
      "Criminology"
    ]
  },
  {
    label: "Liberal arts and humanities",
    options: ["English", "History", "Philosophy", "Communications", "Journalism", "Liberal Studies"]
  },
  { label: "Arts and design", options: ["Design", "Art", "Music", "Theatre"] },
  {
    label: "Education and service",
    options: ["Education", "Social Work", "Nutrition and Kinesiology"]
  },
  { label: "Other", options: ["Undecided / Exploring"] }
];
var INTEREST_GROUPS = [
  {
    label: "Technology and data",
    options: ["Software Engineering", "Data Science", "Product Management", "UX Design"]
  },
  {
    label: "Business and finance",
    options: ["Marketing", "Finance", "Consulting", "Human Resources"]
  },
  {
    label: "Public service and society",
    options: [
      "Social Impact",
      "Public Policy and Government",
      "Law and Legal",
      "Nonprofit Management",
      "Community Organizing",
      "Sustainability"
    ]
  },
  {
    label: "Education, health and care",
    options: ["Education and Teaching", "Healthcare", "Counseling and Social Services"]
  },
  {
    label: "Media, arts and research",
    options: [
      "Journalism and Media",
      "Writing and Content",
      "Arts and Culture",
      "Research and Academia"
    ]
  }
];
var MAJORS = MAJOR_GROUPS.flatMap((group) => group.options);
var INTERESTS = INTEREST_GROUPS.flatMap((group) => group.options);

// src/lib/classify.ts
var RESOURCE_TYPE_RULES = [
  [/\bresum[eé]s?\b|cover letter|\bcv\b/i, "Resume Help"],
  [/\binterview|mock interview/i, "Interview Prep"],
  [/\bmentor|\bcoach/i, "Mentorship"],
  [/\bnetwork|\bclubs?\b|student organizations?|\bassociation\b|\bsociety\b|\bfraternity/i, "Networking"],
  [/\bworkshops?\b|\bacademy\b|\btraining\b|\bseminar|\bcourse\b/i, "Workshop"]
];
var TYPE_GUESS_TAG = "type-guess";
function isGuessedResourceType(text) {
  return !RESOURCE_TYPE_RULES.some(([pattern]) => pattern.test(text));
}
function classifyResourceType(text) {
  return RESOURCE_TYPE_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? "Career Exploration";
}
var INTEREST_RULES = [
  // Patterns use word boundaries and specific phrases: bare words such as "it", "data", "design",
  // "community", "education" or "research" appear in ordinary sentences and tagged half the catalog.
  [/\bsoftware\b|computer science|\bcoding\b|\bprogramming\b|\bcyber|information technology/i, "Software Engineering"],
  [/\bIT\b/, "Software Engineering"],
  [/data science|data scientist|data analy|\banalytics\b|\bstatistics\b|machine learning/i, "Data Science"],
  [/product management|product manager/i, "Product Management"],
  [/\bmarketing\b|advertising/i, "Marketing"],
  [/\bfinance\b|\bfinancial services\b|\bbanking\b|investment|accounting|\bcpa\b/i, "Finance"],
  [/\bconsulting\b|\bconsultant/i, "Consulting"],
  [/\bux\b|user experience|graphic design|product design|interaction design/i, "UX Design"],
  [/\bhealth ?care\b|\bhealth\b|medical|nursing|clinical|kinesiology|nutrition/i, "Healthcare"],
  [/human resources|\bhr\b|talent acquisition|\brecruiter/i, "Human Resources"],
  [/nonprofit|non-profit|social impact|public service|volunteer/i, "Social Impact"],
  [/\bteach(er|ers|ing)\b|\bk-12\b|\btutor|education (career|major|program)|school (counselor|teacher)/i, "Education and Teaching"],
  [/\bpolicy\b|\bgovernment\b|public administration|political|\bcivic\b/i, "Public Policy and Government"],
  [/\blaw\b|\blegal\b|pre-law|attorney/i, "Law and Legal"],
  [/journalis|\bnewsroom|\bbroadcast|\bnews\b|\bmedia\b/i, "Journalism and Media"],
  [/nonprofit management|fundrais/i, "Nonprofit Management"],
  [/academia|graduate school|grad school|\bscholars?\b|\bphd\b|research (assistant|opportunit|program|position)/i, "Research and Academia"],
  [/\barts?\b|museum|theat|\bmusic\b/i, "Arts and Culture"],
  [/community organizing|\borganizing\b|\badvocacy\b|grassroots|activis/i, "Community Organizing"],
  [/sustainab|environmental|climate|renewable|conservation|\bcwea\b|\bwater\b/i, "Sustainability"],
  [/\bstem\b|engineering|tesla/i, "Software Engineering"],
  [/\bstem\b/i, "Data Science"],
  [/counsel|social work|mental health|social services/i, "Counseling and Social Services"],
  [/\bwriting\b|\bwriter|copywrit|\beditor|editorial/i, "Writing and Content"]
];
function classifyInterests(text) {
  const matches = INTEREST_RULES.filter(([pattern]) => pattern.test(text)).map(([, interest]) => interest);
  return INTERESTS.filter((interest) => matches.includes(interest)).slice(0, 4);
}
var MAJOR_RULES = [
  [/computer science|software engineering|\bcs\b/i, ["Computer Science"]],
  [/engineering|aviation|tesla/i, ["Engineering", "Computer Science"]],
  [/\bstem\b/i, ["Engineering", "Computer Science", "Mathematics", "Biology", "Chemistry"]],
  [/social sciences/i, ["Psychology", "Sociology", "Political Science", "Anthropology", "Criminology"]],
  [/\bcwea\b|water/i, ["Environmental Science"]],
  [/biolog|life science/i, ["Biology"]],
  [/chemi/i, ["Chemistry"]],
  [/mathematic|\bmath\b/i, ["Mathematics"]],
  [/environmental/i, ["Environmental Science"]],
  [/accounting/i, ["Accounting"]],
  [/\bbusiness\b/i, ["Business", "Economics", "Accounting", "Marketing"]],
  [/economics/i, ["Economics"]],
  [/psycholog/i, ["Psychology"]],
  [/sociolog/i, ["Sociology"]],
  [/political science|pi sigma alpha/i, ["Political Science"]],
  [/anthropolog/i, ["Anthropology"]],
  [/public health|health science/i, ["Public Health"]],
  [/criminolog|justice studies/i, ["Criminology"]],
  [/\benglish\b/i, ["English"]],
  [/\bhistory\b/i, ["History"]],
  [/philosoph/i, ["Philosophy"]],
  [/journalism|mass communications?/i, ["Journalism", "Communications"]],
  [/\bart\b|\barts\b|\bdesign\b/i, ["Art", "Design"]],
  [/\bmusic\b/i, ["Music"]],
  [/theatre|theater/i, ["Theatre"]],
  [/\beducation\b|teaching/i, ["Education"]],
  [/social work/i, ["Social Work"]],
  [/nutrition|kinesiology/i, ["Nutrition and Kinesiology"]]
];
function classifyMajors(title) {
  const matches = /* @__PURE__ */ new Set();
  for (const [pattern, majors] of MAJOR_RULES) {
    if (pattern.test(title)) majors.forEach((major) => matches.add(major));
  }
  return MAJORS.filter((major) => matches.has(major));
}
function classifyResourceLocation(text, isExternalSite) {
  if (/virtual|online|zoom|website|app\b|platform/i.test(text) || isExternalSite) return "Remote";
  if (/appointment|drop-in|walk-in|visit|on campus|in person|in-person|hall\b|office/i.test(text)) {
    return "In-Person";
  }
  return "Hybrid";
}
function classifyEventType(title) {
  if (/fair|expo/i.test(title)) return "Career Fair";
  if (/panel|speaker series|conversation/i.test(title)) return "Panel";
  if (/network|dinner|mixer|meet|connect|reception|coffee/i.test(title)) return "Networking";
  if (/info session|information session|open house|employer spotlight|presents/i.test(title)) {
    return "Info Session";
  }
  return "Workshop";
}
function classifyEventFormat(title, location) {
  if (/hybrid/i.test(`${title} ${location}`)) return "Hybrid";
  if (/virtual|online|zoom|webinar/i.test(location) || /\bvirtual\b|webinar/i.test(title)) {
    return "Virtual";
  }
  return "In-Person";
}

// node_modules/chrono-node/dist/esm/types.js
var Meridiem;
(function(Meridiem2) {
  Meridiem2[Meridiem2["AM"] = 0] = "AM";
  Meridiem2[Meridiem2["PM"] = 1] = "PM";
})(Meridiem || (Meridiem = {}));
var Weekday;
(function(Weekday2) {
  Weekday2[Weekday2["SUNDAY"] = 0] = "SUNDAY";
  Weekday2[Weekday2["MONDAY"] = 1] = "MONDAY";
  Weekday2[Weekday2["TUESDAY"] = 2] = "TUESDAY";
  Weekday2[Weekday2["WEDNESDAY"] = 3] = "WEDNESDAY";
  Weekday2[Weekday2["THURSDAY"] = 4] = "THURSDAY";
  Weekday2[Weekday2["FRIDAY"] = 5] = "FRIDAY";
  Weekday2[Weekday2["SATURDAY"] = 6] = "SATURDAY";
})(Weekday || (Weekday = {}));
var Month;
(function(Month2) {
  Month2[Month2["JANUARY"] = 1] = "JANUARY";
  Month2[Month2["FEBRUARY"] = 2] = "FEBRUARY";
  Month2[Month2["MARCH"] = 3] = "MARCH";
  Month2[Month2["APRIL"] = 4] = "APRIL";
  Month2[Month2["MAY"] = 5] = "MAY";
  Month2[Month2["JUNE"] = 6] = "JUNE";
  Month2[Month2["JULY"] = 7] = "JULY";
  Month2[Month2["AUGUST"] = 8] = "AUGUST";
  Month2[Month2["SEPTEMBER"] = 9] = "SEPTEMBER";
  Month2[Month2["OCTOBER"] = 10] = "OCTOBER";
  Month2[Month2["NOVEMBER"] = 11] = "NOVEMBER";
  Month2[Month2["DECEMBER"] = 12] = "DECEMBER";
})(Month || (Month = {}));

// node_modules/chrono-node/dist/esm/utils/dates.js
function assignSimilarDate(component, target) {
  component.assign("day", target.getDate());
  component.assign("month", target.getMonth() + 1);
  component.assign("year", target.getFullYear());
}
function assignSimilarTime(component, target) {
  component.assign("hour", target.getHours());
  component.assign("minute", target.getMinutes());
  component.assign("second", target.getSeconds());
  component.assign("millisecond", target.getMilliseconds());
  component.assign("meridiem", target.getHours() < 12 ? Meridiem.AM : Meridiem.PM);
}
function implySimilarDate(component, target) {
  component.imply("day", target.getDate());
  component.imply("month", target.getMonth() + 1);
  component.imply("year", target.getFullYear());
}
function implySimilarTime(component, target) {
  component.imply("hour", target.getHours());
  component.imply("minute", target.getMinutes());
  component.imply("second", target.getSeconds());
  component.imply("millisecond", target.getMilliseconds());
  component.imply("meridiem", target.getHours() < 12 ? Meridiem.AM : Meridiem.PM);
}

// node_modules/chrono-node/dist/esm/timezone.js
var TIMEZONE_ABBR_MAP = {
  ACDT: 630,
  ACST: 570,
  ADT: -180,
  AEDT: 660,
  AEST: 600,
  AFT: 270,
  AKDT: -480,
  AKST: -540,
  ALMT: 360,
  AMST: -180,
  AMT: -240,
  ANAST: 720,
  ANAT: 720,
  AQTT: 300,
  ART: -180,
  AST: -240,
  AWDT: 540,
  AWST: 480,
  AZOST: 0,
  AZOT: -60,
  AZST: 300,
  AZT: 240,
  BNT: 480,
  BOT: -240,
  BRST: -120,
  BRT: -180,
  BST: 60,
  BTT: 360,
  CAST: 480,
  CAT: 120,
  CCT: 390,
  CDT: -300,
  CEST: 120,
  CET: {
    timezoneOffsetDuringDst: 2 * 60,
    timezoneOffsetNonDst: 60,
    dstStart: (year) => getLastWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2),
    dstEnd: (year) => getLastWeekdayOfMonth(year, Month.OCTOBER, Weekday.SUNDAY, 3)
  },
  CHADT: 825,
  CHAST: 765,
  CKT: -600,
  CLST: -180,
  CLT: -240,
  COT: -300,
  CST: -360,
  CT: {
    timezoneOffsetDuringDst: -5 * 60,
    timezoneOffsetNonDst: -6 * 60,
    dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
    dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2)
  },
  CVT: -60,
  CXT: 420,
  ChST: 600,
  DAVT: 420,
  EASST: -300,
  EAST: -360,
  EAT: 180,
  ECT: -300,
  EDT: -240,
  EEST: 180,
  EET: 120,
  EGST: 0,
  EGT: -60,
  EST: -300,
  ET: {
    timezoneOffsetDuringDst: -4 * 60,
    timezoneOffsetNonDst: -5 * 60,
    dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
    dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2)
  },
  FJST: 780,
  FJT: 720,
  FKST: -180,
  FKT: -240,
  FNT: -120,
  GALT: -360,
  GAMT: -540,
  GET: 240,
  GFT: -180,
  GILT: 720,
  GMT: 0,
  GST: 240,
  GYT: -240,
  HAA: -180,
  HAC: -300,
  HADT: -540,
  HAE: -240,
  HAP: -420,
  HAR: -360,
  HAST: -600,
  HAT: -90,
  HAY: -480,
  HKT: 480,
  HLV: -210,
  HNA: -240,
  HNC: -360,
  HNE: -300,
  HNP: -480,
  HNR: -420,
  HNT: -150,
  HNY: -540,
  HOVT: 420,
  ICT: 420,
  IDT: 180,
  IOT: 360,
  IRDT: 270,
  IRKST: 540,
  IRKT: 540,
  IRST: 210,
  IST: 330,
  JST: 540,
  KGT: 360,
  KRAST: 480,
  KRAT: 480,
  KST: 540,
  KUYT: 240,
  LHDT: 660,
  LHST: 630,
  LINT: 840,
  MAGST: 720,
  MAGT: 720,
  MART: -510,
  MAWT: 300,
  MDT: -360,
  MESZ: 120,
  MEZ: 60,
  MHT: 720,
  MMT: 390,
  MSD: 240,
  MSK: 180,
  MST: -420,
  MT: {
    timezoneOffsetDuringDst: -6 * 60,
    timezoneOffsetNonDst: -7 * 60,
    dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
    dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2)
  },
  MUT: 240,
  MVT: 300,
  MYT: 480,
  NCT: 660,
  NDT: -90,
  NFT: 690,
  NOVST: 420,
  NOVT: 360,
  NPT: 345,
  NST: -150,
  NUT: -660,
  NZDT: 780,
  NZST: 720,
  OMSST: 420,
  OMST: 420,
  PDT: -420,
  PET: -300,
  PETST: 720,
  PETT: 720,
  PGT: 600,
  PHOT: 780,
  PHT: 480,
  PKT: 300,
  PMDT: -120,
  PMST: -180,
  PONT: 660,
  PST: -480,
  PT: {
    timezoneOffsetDuringDst: -7 * 60,
    timezoneOffsetNonDst: -8 * 60,
    dstStart: (year) => getNthWeekdayOfMonth(year, Month.MARCH, Weekday.SUNDAY, 2, 2),
    dstEnd: (year) => getNthWeekdayOfMonth(year, Month.NOVEMBER, Weekday.SUNDAY, 1, 2)
  },
  PWT: 540,
  PYST: -180,
  PYT: -240,
  RET: 240,
  SAMT: 240,
  SAST: 120,
  SBT: 660,
  SCT: 240,
  SGT: 480,
  SRT: -180,
  SST: -660,
  TAHT: -600,
  TFT: 300,
  TJT: 300,
  TKT: 780,
  TLT: 540,
  TMT: 300,
  TVT: 720,
  ULAT: 480,
  UTC: 0,
  UYST: -120,
  UYT: -180,
  UZT: 300,
  VET: -210,
  VLAST: 660,
  VLAT: 660,
  VUT: 660,
  WAST: 120,
  WAT: 60,
  WEST: 60,
  WESZ: 60,
  WET: 0,
  WEZ: 0,
  WFT: 720,
  WGST: -120,
  WGT: -180,
  WIB: 420,
  WIT: 540,
  WITA: 480,
  WST: 780,
  WT: 0,
  YAKST: 600,
  YAKT: 600,
  YAPT: 600,
  YEKST: 360,
  YEKT: 360
};
function getNthWeekdayOfMonth(year, month, weekday, n, hour = 0) {
  let dayOfMonth = 0;
  let i = 0;
  while (i < n) {
    dayOfMonth++;
    const date = new Date(year, month - 1, dayOfMonth);
    if (date.getDay() === weekday)
      i++;
  }
  return new Date(year, month - 1, dayOfMonth, hour);
}
function getLastWeekdayOfMonth(year, month, weekday, hour = 0) {
  const oneIndexedWeekday = weekday === 0 ? 7 : weekday;
  const date = new Date(year, month - 1 + 1, 1, 12);
  const firstWeekdayNextMonth = date.getDay() === 0 ? 7 : date.getDay();
  let dayDiff;
  if (firstWeekdayNextMonth === oneIndexedWeekday)
    dayDiff = 7;
  else if (firstWeekdayNextMonth < oneIndexedWeekday)
    dayDiff = 7 + firstWeekdayNextMonth - oneIndexedWeekday;
  else
    dayDiff = firstWeekdayNextMonth - oneIndexedWeekday;
  date.setDate(date.getDate() - dayDiff);
  return new Date(year, month - 1, date.getDate(), hour);
}
function toTimezoneOffset(timezoneInput, date, timezoneOverrides = {}) {
  if (timezoneInput == null) {
    return null;
  }
  if (typeof timezoneInput === "number") {
    return timezoneInput;
  }
  const matchedTimezone = timezoneOverrides[timezoneInput] ?? TIMEZONE_ABBR_MAP[timezoneInput];
  if (matchedTimezone == null) {
    return null;
  }
  if (typeof matchedTimezone == "number") {
    return matchedTimezone;
  }
  if (date == null) {
    return null;
  }
  if (date > matchedTimezone.dstStart(date.getFullYear()) && !(date > matchedTimezone.dstEnd(date.getFullYear()))) {
    return matchedTimezone.timezoneOffsetDuringDst;
  }
  return matchedTimezone.timezoneOffsetNonDst;
}

// node_modules/chrono-node/dist/esm/calculation/duration.js
var EmptyDuration = {
  day: 0,
  second: 0,
  millisecond: 0
};
function addDuration(ref, duration) {
  let date = new Date(ref);
  if (duration["y"]) {
    duration["year"] = duration["y"];
    delete duration["y"];
  }
  if (duration["mo"]) {
    duration["month"] = duration["mo"];
    delete duration["mo"];
  }
  if (duration["M"]) {
    duration["month"] = duration["M"];
    delete duration["M"];
  }
  if (duration["w"]) {
    duration["week"] = duration["w"];
    delete duration["w"];
  }
  if (duration["d"]) {
    duration["day"] = duration["d"];
    delete duration["d"];
  }
  if (duration["h"]) {
    duration["hour"] = duration["h"];
    delete duration["h"];
  }
  if (duration["m"]) {
    duration["minute"] = duration["m"];
    delete duration["m"];
  }
  if (duration["s"]) {
    duration["second"] = duration["s"];
    delete duration["s"];
  }
  if (duration["ms"]) {
    duration["millisecond"] = duration["ms"];
    delete duration["ms"];
  }
  if ("year" in duration) {
    const floor = Math.floor(duration["year"]);
    date.setFullYear(date.getFullYear() + floor);
    const remainingFraction = duration["year"] - floor;
    if (remainingFraction > 0) {
      duration.month = duration?.month ?? 0;
      duration.month += remainingFraction * 12;
    }
  }
  if ("quarter" in duration) {
    const floor = Math.floor(duration["quarter"]);
    date.setMonth(date.getMonth() + floor * 3);
    const remainingFraction = duration["quarter"] - floor;
    if (remainingFraction > 0) {
      duration.month = duration?.month ?? 0;
      duration.month += remainingFraction * 3;
    }
  }
  if ("month" in duration) {
    const floor = Math.floor(duration["month"]);
    date.setMonth(date.getMonth() + floor);
    const remainingFraction = duration["month"] - floor;
    if (remainingFraction > 0) {
      duration.week = duration?.week ?? 0;
      duration.week += remainingFraction * 4;
    }
  }
  if ("week" in duration) {
    const floor = Math.floor(duration["week"]);
    date.setDate(date.getDate() + floor * 7);
    const remainingFraction = duration["week"] - floor;
    if (remainingFraction > 0) {
      duration.day = duration?.day ?? 0;
      duration.day += Math.round(remainingFraction * 7);
    }
  }
  if ("day" in duration) {
    const floor = Math.floor(duration["day"]);
    date.setDate(date.getDate() + floor);
    const remainingFraction = duration["day"] - floor;
    if (remainingFraction > 0) {
      duration.hour = duration?.hour ?? 0;
      duration.hour += Math.round(remainingFraction * 24);
    }
  }
  if ("hour" in duration) {
    const floor = Math.floor(duration["hour"]);
    date.setHours(date.getHours() + floor);
    const remainingFraction = duration["hour"] - floor;
    if (remainingFraction > 0) {
      duration.minute = duration?.minute ?? 0;
      duration.minute += Math.round(remainingFraction * 60);
    }
  }
  if ("minute" in duration) {
    const floor = Math.floor(duration["minute"]);
    date.setMinutes(date.getMinutes() + floor);
    const remainingFraction = duration["minute"] - floor;
    if (remainingFraction > 0) {
      duration.second = duration?.second ?? 0;
      duration.second += Math.round(remainingFraction * 60);
    }
  }
  if ("second" in duration) {
    const floor = Math.floor(duration["second"]);
    date.setSeconds(date.getSeconds() + floor);
    const remainingFraction = duration["second"] - floor;
    if (remainingFraction > 0) {
      duration.millisecond = duration?.millisecond ?? 0;
      duration.millisecond += Math.round(remainingFraction * 1e3);
    }
  }
  if ("millisecond" in duration) {
    const floor = Math.floor(duration["millisecond"]);
    date.setMilliseconds(date.getMilliseconds() + floor);
  }
  return date;
}
function reverseDuration(duration) {
  const reversed = {};
  for (const key in duration) {
    reversed[key] = -duration[key];
  }
  return reversed;
}

// node_modules/chrono-node/dist/esm/results.js
var ReferenceWithTimezone = class _ReferenceWithTimezone {
  instant;
  timezoneOffset;
  constructor(instant, timezoneOffset) {
    this.instant = instant ?? /* @__PURE__ */ new Date();
    this.timezoneOffset = timezoneOffset ?? null;
  }
  static fromDate(date) {
    return new _ReferenceWithTimezone(date);
  }
  static fromInput(input, timezoneOverrides) {
    if (input instanceof Date) {
      return _ReferenceWithTimezone.fromDate(input);
    }
    const instant = input?.instant ?? /* @__PURE__ */ new Date();
    const timezoneOffset = toTimezoneOffset(input?.timezone, instant, timezoneOverrides);
    return new _ReferenceWithTimezone(instant, timezoneOffset);
  }
  getDateWithAdjustedTimezone() {
    const date = new Date(this.instant);
    if (this.timezoneOffset !== null) {
      date.setMinutes(date.getMinutes() - this.getSystemTimezoneAdjustmentMinute(this.instant));
    }
    return date;
  }
  getSystemTimezoneAdjustmentMinute(date, overrideTimezoneOffset) {
    if (!date) {
      date = /* @__PURE__ */ new Date();
    }
    const currentTimezoneOffset = -date.getTimezoneOffset();
    const targetTimezoneOffset = overrideTimezoneOffset ?? this.timezoneOffset ?? currentTimezoneOffset;
    return currentTimezoneOffset - targetTimezoneOffset;
  }
  getTimezoneOffset() {
    return this.timezoneOffset ?? -this.instant.getTimezoneOffset();
  }
};
var ParsingComponents = class _ParsingComponents {
  knownValues;
  impliedValues;
  reference;
  _tags = /* @__PURE__ */ new Set();
  constructor(reference, knownComponents) {
    this.reference = reference;
    this.knownValues = {};
    this.impliedValues = {};
    if (knownComponents) {
      for (const key in knownComponents) {
        this.knownValues[key] = knownComponents[key];
      }
    }
    const date = reference.getDateWithAdjustedTimezone();
    this.imply("day", date.getDate());
    this.imply("month", date.getMonth() + 1);
    this.imply("year", date.getFullYear());
    this.imply("hour", 12);
    this.imply("minute", 0);
    this.imply("second", 0);
    this.imply("millisecond", 0);
  }
  static createRelativeFromReference(reference, duration = EmptyDuration) {
    let date = addDuration(reference.getDateWithAdjustedTimezone(), duration);
    const components = new _ParsingComponents(reference);
    components.addTag("result/relativeDate");
    if ("hour" in duration || "minute" in duration || "second" in duration || "millisecond" in duration) {
      components.addTag("result/relativeDateAndTime");
      assignSimilarTime(components, date);
      assignSimilarDate(components, date);
      components.assign("timezoneOffset", reference.getTimezoneOffset());
    } else {
      implySimilarTime(components, date);
      components.imply("timezoneOffset", reference.getTimezoneOffset());
      if ("day" in duration) {
        components.assign("day", date.getDate());
        components.assign("month", date.getMonth() + 1);
        components.assign("year", date.getFullYear());
        components.assign("weekday", date.getDay());
      } else if ("week" in duration) {
        components.assign("day", date.getDate());
        components.assign("month", date.getMonth() + 1);
        components.assign("year", date.getFullYear());
        components.imply("weekday", date.getDay());
      } else {
        components.imply("day", date.getDate());
        if ("month" in duration) {
          components.assign("month", date.getMonth() + 1);
          components.assign("year", date.getFullYear());
        } else {
          components.imply("month", date.getMonth() + 1);
          if ("year" in duration) {
            components.assign("year", date.getFullYear());
          } else {
            components.imply("year", date.getFullYear());
          }
        }
      }
    }
    return components;
  }
  get(component) {
    if (component in this.knownValues) {
      return this.knownValues[component];
    }
    if (component in this.impliedValues) {
      return this.impliedValues[component];
    }
    return null;
  }
  isCertain(component) {
    return component in this.knownValues;
  }
  getCertainComponents() {
    return Object.keys(this.knownValues);
  }
  imply(component, value) {
    if (component in this.knownValues) {
      return this;
    }
    this.impliedValues[component] = value;
    return this;
  }
  assign(component, value) {
    this.knownValues[component] = value;
    delete this.impliedValues[component];
    return this;
  }
  addDurationAsImplied(duration) {
    const currentDate = this.dateWithoutTimezoneAdjustment();
    const date = addDuration(currentDate, duration);
    if ("day" in duration || "week" in duration || "month" in duration || "year" in duration) {
      this.delete(["day", "weekday", "month", "year"]);
      this.imply("day", date.getDate());
      this.imply("weekday", date.getDay());
      this.imply("month", date.getMonth() + 1);
      this.imply("year", date.getFullYear());
    }
    if ("second" in duration || "minute" in duration || "hour" in duration) {
      this.delete(["second", "minute", "hour"]);
      this.imply("second", date.getSeconds());
      this.imply("minute", date.getMinutes());
      this.imply("hour", date.getHours());
    }
    return this;
  }
  delete(components) {
    if (typeof components === "string") {
      components = [components];
    }
    for (const component of components) {
      delete this.knownValues[component];
      delete this.impliedValues[component];
    }
  }
  clone() {
    const component = new _ParsingComponents(this.reference);
    component.knownValues = {};
    component.impliedValues = {};
    for (const key in this.knownValues) {
      component.knownValues[key] = this.knownValues[key];
    }
    for (const key in this.impliedValues) {
      component.impliedValues[key] = this.impliedValues[key];
    }
    return component;
  }
  isOnlyDate() {
    return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
  }
  isOnlyTime() {
    return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month") && !this.isCertain("year");
  }
  isOnlyWeekdayComponent() {
    return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
  }
  isDateWithUnknownYear() {
    return this.isCertain("month") && !this.isCertain("year");
  }
  isValidDate() {
    const date = new Date(Date.UTC(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond")));
    date.setUTCFullYear(this.get("year"));
    if (date.getUTCFullYear() !== this.get("year"))
      return false;
    if (date.getUTCMonth() !== this.get("month") - 1)
      return false;
    if (date.getUTCDate() !== this.get("day"))
      return false;
    if (this.get("hour") != null && date.getUTCHours() != this.get("hour"))
      return false;
    if (this.get("minute") != null && date.getUTCMinutes() != this.get("minute"))
      return false;
    return true;
  }
  toString() {
    return `[ParsingComponents {
            tags: ${JSON.stringify(Array.from(this._tags).sort())}, 
            knownValues: ${JSON.stringify(this.knownValues)}, 
            impliedValues: ${JSON.stringify(this.impliedValues)}}, 
            reference: ${JSON.stringify(this.reference)}]`;
  }
  date() {
    const timezoneOffset = this.get("timezoneOffset") ?? this.reference.timezoneOffset;
    if (timezoneOffset === null || timezoneOffset === void 0) {
      return this.dateWithoutTimezoneAdjustment();
    }
    const date = new Date(Date.UTC(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond")));
    date.setUTCFullYear(this.get("year"));
    return new Date(date.getTime() - timezoneOffset * 6e4);
  }
  addTag(tag) {
    this._tags.add(tag);
    return this;
  }
  addTags(tags) {
    for (const tag of tags) {
      this._tags.add(tag);
    }
    return this;
  }
  tags() {
    return new Set(this._tags);
  }
  dateWithoutTimezoneAdjustment() {
    const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
    date.setFullYear(this.get("year"));
    return date;
  }
};
var ParsingResult = class _ParsingResult {
  refDate;
  index;
  text;
  reference;
  start;
  end;
  constructor(reference, index, text, start, end) {
    this.reference = reference;
    this.refDate = reference.instant;
    this.index = index;
    this.text = text;
    this.start = start || new ParsingComponents(reference);
    this.end = end;
  }
  clone() {
    const result = new _ParsingResult(this.reference, this.index, this.text);
    result.start = this.start ? this.start.clone() : null;
    result.end = this.end ? this.end.clone() : null;
    return result;
  }
  date() {
    return this.start.date();
  }
  addTag(tag) {
    this.start.addTag(tag);
    if (this.end) {
      this.end.addTag(tag);
    }
    return this;
  }
  addTags(tags) {
    this.start.addTags(tags);
    if (this.end) {
      this.end.addTags(tags);
    }
    return this;
  }
  tags() {
    const combinedTags = new Set(this.start.tags());
    if (this.end) {
      for (const tag of this.end.tags()) {
        combinedTags.add(tag);
      }
    }
    return combinedTags;
  }
  toString() {
    const tags = Array.from(this.tags()).sort();
    return `[ParsingResult {index: ${this.index}, text: '${this.text}', tags: ${JSON.stringify(tags)} ...}]`;
  }
};

// node_modules/chrono-node/dist/esm/utils/pattern.js
function repeatedTimeunitPattern(prefix, singleTimeunitPattern, connectorPattern = "\\s{0,5},?\\s{0,5}") {
  const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
  return `${prefix}${singleTimeunitPatternNoCapture}(?:${connectorPattern}${singleTimeunitPatternNoCapture}){0,10}`;
}
function extractTerms(dictionary) {
  let keys;
  if (dictionary instanceof Array) {
    keys = [...dictionary];
  } else if (dictionary instanceof Map) {
    keys = Array.from(dictionary.keys());
  } else {
    keys = Object.keys(dictionary);
  }
  return keys;
}
function matchAnyPattern(dictionary) {
  const joinedTerms = extractTerms(dictionary).sort((a, b) => b.length - a.length).join("|").replace(/\./g, "\\.");
  return `(?:${joinedTerms})`;
}

// node_modules/chrono-node/dist/esm/calculation/years.js
function findMostLikelyADYear(yearNumber) {
  if (yearNumber < 100) {
    if (yearNumber > 50) {
      yearNumber = yearNumber + 1900;
    } else {
      yearNumber = yearNumber + 2e3;
    }
  }
  return yearNumber;
}
function findYearClosestToRef(refDate, day, month) {
  let date = new Date(refDate);
  date.setMonth(month - 1);
  date.setDate(day);
  const nextYear = addDuration(date, { "year": 1 });
  const lastYear = addDuration(date, { "year": -1 });
  if (Math.abs(nextYear.getTime() - refDate.getTime()) < Math.abs(date.getTime() - refDate.getTime())) {
    date = nextYear;
  } else if (Math.abs(lastYear.getTime() - refDate.getTime()) < Math.abs(date.getTime() - refDate.getTime())) {
    date = lastYear;
  }
  return date.getFullYear();
}

// node_modules/chrono-node/dist/esm/locales/en/constants.js
var WEEKDAY_DICTIONARY = {
  sunday: 0,
  sun: 0,
  "sun.": 0,
  monday: 1,
  mon: 1,
  "mon.": 1,
  tuesday: 2,
  tue: 2,
  "tue.": 2,
  wednesday: 3,
  wed: 3,
  "wed.": 3,
  thursday: 4,
  thurs: 4,
  "thurs.": 4,
  thur: 4,
  "thur.": 4,
  thu: 4,
  "thu.": 4,
  friday: 5,
  fri: 5,
  "fri.": 5,
  saturday: 6,
  sat: 6,
  "sat.": 6
};
var FULL_MONTH_NAME_DICTIONARY = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
};
var MONTH_DICTIONARY = {
  ...FULL_MONTH_NAME_DICTIONARY,
  jan: 1,
  "jan.": 1,
  feb: 2,
  "feb.": 2,
  mar: 3,
  "mar.": 3,
  apr: 4,
  "apr.": 4,
  jun: 6,
  "jun.": 6,
  jul: 7,
  "jul.": 7,
  aug: 8,
  "aug.": 8,
  sep: 9,
  "sep.": 9,
  sept: 9,
  "sept.": 9,
  oct: 10,
  "oct.": 10,
  nov: 11,
  "nov.": 11,
  dec: 12,
  "dec.": 12
};
var INTEGER_WORD_DICTIONARY = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12
};
var ORDINAL_WORD_DICTIONARY = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  "twenty first": 21,
  "twenty-first": 21,
  "twenty second": 22,
  "twenty-second": 22,
  "twenty third": 23,
  "twenty-third": 23,
  "twenty fourth": 24,
  "twenty-fourth": 24,
  "twenty fifth": 25,
  "twenty-fifth": 25,
  "twenty sixth": 26,
  "twenty-sixth": 26,
  "twenty seventh": 27,
  "twenty-seventh": 27,
  "twenty eighth": 28,
  "twenty-eighth": 28,
  "twenty ninth": 29,
  "twenty-ninth": 29,
  "thirtieth": 30,
  "thirty first": 31,
  "thirty-first": 31
};
var TIME_UNIT_DICTIONARY_NO_ABBR = {
  second: "second",
  seconds: "second",
  minute: "minute",
  minutes: "minute",
  hour: "hour",
  hours: "hour",
  day: "day",
  days: "day",
  week: "week",
  weeks: "week",
  month: "month",
  months: "month",
  quarter: "quarter",
  quarters: "quarter",
  year: "year",
  years: "year"
};
var TIME_UNIT_DICTIONARY = {
  s: "second",
  sec: "second",
  second: "second",
  seconds: "second",
  m: "minute",
  min: "minute",
  mins: "minute",
  minute: "minute",
  minutes: "minute",
  h: "hour",
  hr: "hour",
  hrs: "hour",
  hour: "hour",
  hours: "hour",
  d: "day",
  day: "day",
  days: "day",
  w: "week",
  week: "week",
  weeks: "week",
  mo: "month",
  mon: "month",
  mos: "month",
  month: "month",
  months: "month",
  qtr: "quarter",
  quarter: "quarter",
  quarters: "quarter",
  y: "year",
  yr: "year",
  year: "year",
  years: "year",
  ...TIME_UNIT_DICTIONARY_NO_ABBR
};
var NUMBER_PATTERN = `(?:${matchAnyPattern(INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}an?)?|an?\\b(?:\\s{0,2}few)?|few|several|the|a?\\s{0,2}couple\\s{0,2}(?:of)?)`;
function parseNumberPattern(match) {
  const num = match.toLowerCase();
  if (INTEGER_WORD_DICTIONARY[num] !== void 0) {
    return INTEGER_WORD_DICTIONARY[num];
  } else if (num === "a" || num === "an" || num == "the") {
    return 1;
  } else if (num.match(/few/)) {
    return 3;
  } else if (num.match(/half/)) {
    return 0.5;
  } else if (num.match(/couple/)) {
    return 2;
  } else if (num.match(/several/)) {
    return 7;
  }
  return parseFloat(num);
}
var ORDINAL_NUMBER_PATTERN = `(?:${matchAnyPattern(ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
function parseOrdinalNumberPattern(match) {
  let num = match.toLowerCase();
  if (ORDINAL_WORD_DICTIONARY[num] !== void 0) {
    return ORDINAL_WORD_DICTIONARY[num];
  }
  num = num.replace(/(?:st|nd|rd|th)$/i, "");
  return parseInt(num);
}
var YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-9][0-9]{3}|[0-9]{2}(?!\\w|:\\d|\\s+(?:am|pm|o\\s*clock|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)))`;
function parseYear(match) {
  if (/BE/i.test(match)) {
    match = match.replace(/BE/i, "");
    return parseInt(match) - 543;
  }
  if (/BCE?/i.test(match)) {
    match = match.replace(/BCE?/i, "");
    return -parseInt(match);
  }
  if (/(AD|CE)/i.test(match)) {
    match = match.replace(/(AD|CE)/i, "");
    return parseInt(match);
  }
  const rawYearNumber = parseInt(match);
  return findMostLikelyADYear(rawYearNumber);
}
var SINGLE_TIME_UNIT_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(TIME_UNIT_DICTIONARY)})`;
var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
var SINGLE_TIME_UNIT_NO_ABBR_PATTERN = `(${NUMBER_PATTERN})\\s{0,3}(${matchAnyPattern(TIME_UNIT_DICTIONARY_NO_ABBR)})`;
var TIME_UNIT_CONNECTOR_PATTERN = `\\s{0,5},?(?:\\s*and)?\\s{0,5}`;
var TIME_UNITS_PATTERN = repeatedTimeunitPattern(`(?:(?:about|around)\\s{0,3})?`, SINGLE_TIME_UNIT_PATTERN, TIME_UNIT_CONNECTOR_PATTERN);
var TIME_UNITS_NO_ABBR_PATTERN = repeatedTimeunitPattern(`(?:(?:about|around)\\s{0,3})?`, SINGLE_TIME_UNIT_NO_ABBR_PATTERN, TIME_UNIT_CONNECTOR_PATTERN);
function parseDuration(timeunitText) {
  const fragments = {};
  let remainingText = timeunitText;
  let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
  while (match) {
    collectDateTimeFragment(fragments, match);
    remainingText = remainingText.substring(match[0].length).trim();
    match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
  }
  if (Object.keys(fragments).length == 0) {
    return null;
  }
  return fragments;
}
function collectDateTimeFragment(fragments, match) {
  if (match[0].match(/^[a-zA-Z]+$/)) {
    return;
  }
  const num = parseNumberPattern(match[1]);
  const unit = TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
  fragments[unit] = num;
}

// node_modules/chrono-node/dist/esm/common/parsers/AbstractParserWithWordBoundary.js
var AbstractParserWithWordBoundaryChecking = class {
  innerPatternHasChange(context, currentInnerPattern) {
    return this.innerPattern(context) !== currentInnerPattern;
  }
  patternLeftBoundary() {
    return `(\\W|^)`;
  }
  cachedInnerPattern = null;
  cachedPattern = null;
  pattern(context) {
    if (this.cachedInnerPattern) {
      if (!this.innerPatternHasChange(context, this.cachedInnerPattern)) {
        return this.cachedPattern;
      }
    }
    this.cachedInnerPattern = this.innerPattern(context);
    this.cachedPattern = new RegExp(`${this.patternLeftBoundary()}${this.cachedInnerPattern.source}`, this.cachedInnerPattern.flags);
    return this.cachedPattern;
  }
  extract(context, match) {
    const header = match[1] ?? "";
    match.index = match.index + header.length;
    match[0] = match[0].substring(header.length);
    for (let i = 2; i < match.length; i++) {
      match[i - 1] = match[i];
    }
    return this.innerExtract(context, match);
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENTimeUnitWithinFormatParser.js
var PATTERN_WITH_OPTIONAL_PREFIX = new RegExp(`(?:(?:within|in|for)\\s*)?(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
var PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
var PATTERN_WITH_PREFIX_STRICT = new RegExp(`(?:within|in|for)\\s*(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${TIME_UNITS_NO_ABBR_PATTERN})(?=\\W|$)`, "i");
var ENTimeUnitWithinFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  strictMode;
  constructor(strictMode) {
    super();
    this.strictMode = strictMode;
  }
  innerPattern(context) {
    if (this.strictMode) {
      return PATTERN_WITH_PREFIX_STRICT;
    }
    return context.option.forwardDate ? PATTERN_WITH_OPTIONAL_PREFIX : PATTERN_WITH_PREFIX;
  }
  innerExtract(context, match) {
    if (match[0].match(/^for\s*the\s*\w+/i)) {
      return null;
    }
    const timeUnits = parseDuration(match[1]);
    if (!timeUnits) {
      return null;
    }
    return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENMonthNameLittleEndianParser.js
var PATTERN = new RegExp(`(?:on\\s{0,3})?(${ORDINAL_NUMBER_PATTERN})(?:\\s{0,3}(?:to|\\-|\\\u2013|until|through|till)\\s{0,3}(${ORDINAL_NUMBER_PATTERN}))?(?:-|/|\\s{0,3}(?:of)?\\s{0,3})(${matchAnyPattern(MONTH_DICTIONARY)})(?:(?:-|/|,?\\s{0,3})(${YEAR_PATTERN}(?!\\w)))?(?=\\W|$)`, "i");
var DATE_GROUP = 1;
var DATE_TO_GROUP = 2;
var MONTH_NAME_GROUP = 3;
var YEAR_GROUP = 4;
var ENMonthNameLittleEndianParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN;
  }
  innerExtract(context, match) {
    const result = context.createParsingResult(match.index, match[0]);
    const month = MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
    const day = parseOrdinalNumberPattern(match[DATE_GROUP]);
    if (day > 31) {
      match.index = match.index + match[DATE_GROUP].length;
      return null;
    }
    result.start.assign("month", month);
    result.start.assign("day", day);
    if (match[YEAR_GROUP]) {
      const yearNumber = parseYear(match[YEAR_GROUP]);
      result.start.assign("year", yearNumber);
    } else {
      const year = findYearClosestToRef(context.refDate, day, month);
      result.start.imply("year", year);
    }
    if (match[DATE_TO_GROUP]) {
      const endDate = parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
      result.end = result.start.clone();
      result.end.assign("day", endDate);
    }
    return result;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENMonthNameMiddleEndianParser.js
var PATTERN2 = new RegExp(`(${matchAnyPattern(MONTH_DICTIONARY)})(?:-|/|\\s*,?\\s*)(${ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*(?:(?:to|\\-)\\s*(${ORDINAL_NUMBER_PATTERN})\\s*)?(?:(?:-|/|\\s*,\\s*|\\s+)(${YEAR_PATTERN}))?(?=\\W|$)(?!\\:\\d)`, "i");
var MONTH_NAME_GROUP2 = 1;
var DATE_GROUP2 = 2;
var DATE_TO_GROUP2 = 3;
var YEAR_GROUP2 = 4;
var ENMonthNameMiddleEndianParser = class extends AbstractParserWithWordBoundaryChecking {
  shouldSkipYearLikeDate;
  constructor(shouldSkipYearLikeDate) {
    super();
    this.shouldSkipYearLikeDate = shouldSkipYearLikeDate;
  }
  innerPattern() {
    return PATTERN2;
  }
  innerExtract(context, match) {
    const month = MONTH_DICTIONARY[match[MONTH_NAME_GROUP2].toLowerCase()];
    const day = parseOrdinalNumberPattern(match[DATE_GROUP2]);
    if (day > 31) {
      return null;
    }
    if (this.shouldSkipYearLikeDate) {
      if (!match[DATE_TO_GROUP2] && !match[YEAR_GROUP2] && match[DATE_GROUP2].match(/^\d{2}$/)) {
        return null;
      }
    }
    const components = context.createParsingComponents({
      day,
      month
    }).addTag("parser/ENMonthNameMiddleEndianParser");
    if (match[YEAR_GROUP2]) {
      const year = parseYear(match[YEAR_GROUP2]);
      components.assign("year", year);
    } else {
      const year = findYearClosestToRef(context.refDate, day, month);
      components.imply("year", year);
    }
    if (!match[DATE_TO_GROUP2]) {
      return components;
    }
    const endDate = parseOrdinalNumberPattern(match[DATE_TO_GROUP2]);
    const result = context.createParsingResult(match.index, match[0]);
    result.start = components;
    result.end = components.clone();
    result.end.assign("day", endDate);
    return result;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENMonthNameParser.js
var PATTERN3 = new RegExp(`((?:in)\\s*)?(${matchAnyPattern(MONTH_DICTIONARY)})\\s*(?:(?:,|-|of)?\\s*(${YEAR_PATTERN})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, "i");
var PREFIX_GROUP = 1;
var MONTH_NAME_GROUP3 = 2;
var YEAR_GROUP3 = 3;
var ENMonthNameParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN3;
  }
  innerExtract(context, match) {
    const monthName = match[MONTH_NAME_GROUP3].toLowerCase();
    if (match[0].length <= 3 && !FULL_MONTH_NAME_DICTIONARY[monthName]) {
      return null;
    }
    const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
    result.start.imply("day", 1);
    result.start.addTag("parser/ENMonthNameParser");
    const month = MONTH_DICTIONARY[monthName];
    result.start.assign("month", month);
    if (match[YEAR_GROUP3]) {
      const year = parseYear(match[YEAR_GROUP3]);
      result.start.assign("year", year);
    } else {
      const year = findYearClosestToRef(context.refDate, 1, month);
      result.start.imply("year", year);
    }
    return result;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENYearMonthDayParser.js
var PATTERN4 = new RegExp(`([0-9]{4})[-\\.\\/\\s](?:(${matchAnyPattern(MONTH_DICTIONARY)})|([0-9]{1,2}))[-\\.\\/\\s]([0-9]{1,2})(?=\\W|$)`, "i");
var YEAR_NUMBER_GROUP = 1;
var MONTH_NAME_GROUP4 = 2;
var MONTH_NUMBER_GROUP = 3;
var DATE_NUMBER_GROUP = 4;
var ENYearMonthDayParser = class extends AbstractParserWithWordBoundaryChecking {
  strictMonthDateOrder;
  constructor(strictMonthDateOrder) {
    super();
    this.strictMonthDateOrder = strictMonthDateOrder;
  }
  innerPattern() {
    return PATTERN4;
  }
  innerExtract(context, match) {
    const year = parseInt(match[YEAR_NUMBER_GROUP]);
    let day = parseInt(match[DATE_NUMBER_GROUP]);
    let month = match[MONTH_NUMBER_GROUP] ? parseInt(match[MONTH_NUMBER_GROUP]) : MONTH_DICTIONARY[match[MONTH_NAME_GROUP4].toLowerCase()];
    if (month < 1 || month > 12) {
      if (this.strictMonthDateOrder) {
        return null;
      }
      if (day >= 1 && day <= 12) {
        [month, day] = [day, month];
      }
    }
    if (day < 1 || day > 31) {
      return null;
    }
    return {
      day,
      month,
      year
    };
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENYearMonthNameParser.js
var YEAR_PATTERN2 = `(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-9][0-9]{3})`;
var PATTERN5 = new RegExp(`(${YEAR_PATTERN2})(?:\\s*[-.\\/,]?\\s*|\\s+of\\s+)(${matchAnyPattern(MONTH_DICTIONARY)})(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, "i");
var YEAR_GROUP4 = 1;
var MONTH_NAME_GROUP5 = 2;
var ENYearMonthNameParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN5;
  }
  innerExtract(context, match) {
    const year = parseYear(match[YEAR_GROUP4]);
    const monthName = match[MONTH_NAME_GROUP5].toLowerCase();
    const month = MONTH_DICTIONARY[monthName];
    const result = context.createParsingResult(match.index, match[0]);
    result.start.imply("day", 1);
    result.start.assign("month", month);
    result.start.assign("year", year);
    result.start.addTag("parser/ENYearMonthNameParser");
    return result;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENSlashMonthFormatParser.js
var PATTERN6 = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})", "i");
var MONTH_GROUP = 1;
var YEAR_GROUP5 = 2;
var ENSlashMonthFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN6;
  }
  innerExtract(context, match) {
    if (/\d\/?$/.test(context.text.substring(0, match.index))) {
      return null;
    }
    const year = parseInt(match[YEAR_GROUP5]);
    const month = parseInt(match[MONTH_GROUP]);
    return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
  }
};

// node_modules/chrono-node/dist/esm/common/parsers/AbstractTimeExpressionParser.js
function primaryTimePattern(leftBoundary, primaryPrefix, primarySuffix, flags) {
  return new RegExp(`${leftBoundary}${primaryPrefix}(\\d{1,4})(?:(?:\\.|:|\uFF1A)(\\d{1,2})(?:(?::|\uFF1A)(\\d{2})(?:\\.(\\d{1,6}))?)?)?(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?${primarySuffix}`, flags);
}
function followingTimePatten(followingPhase, followingSuffix) {
  return new RegExp(`^(${followingPhase})(\\d{1,4})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:\\.(\\d{1,6}))?)?)?(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?${followingSuffix}`, "i");
}
var HOUR_GROUP = 2;
var MINUTE_GROUP = 3;
var SECOND_GROUP = 4;
var MILLI_SECOND_GROUP = 5;
var AM_PM_HOUR_GROUP = 6;
var AbstractTimeExpressionParser = class {
  strictMode;
  constructor(strictMode = false) {
    this.strictMode = strictMode;
  }
  patternFlags() {
    return "i";
  }
  primaryPatternLeftBoundary() {
    return `(^|\\s|T|\\b)`;
  }
  primarySuffix() {
    return `(?!/)(?=\\W|$)`;
  }
  followingSuffix() {
    return `(?!/)(?=\\W|$)`;
  }
  pattern(context) {
    return this.getPrimaryTimePatternThroughCache();
  }
  extract(context, match) {
    const startComponents = this.extractPrimaryTimeComponents(context, match);
    if (!startComponents) {
      if (match[0].match(/^\d{4}/)) {
        match.index += 4;
        return null;
      }
      match.index += match[0].length;
      return null;
    }
    const index = match.index + match[1].length;
    const text = match[0].substring(match[1].length);
    const result = context.createParsingResult(index, text, startComponents);
    match.index += match[0].length;
    const remainingText = context.text.substring(match.index);
    const followingPattern = this.getFollowingTimePatternThroughCache();
    const followingMatch = followingPattern.exec(remainingText);
    if (text.match(/^\d{3,4}/) && followingMatch) {
      if (followingMatch[0].match(/^\s*([+-])\s*\d{2,4}$/)) {
        return null;
      }
      if (followingMatch[0].match(/^\s*([+-])\s*\d{2}\W\d{2}/)) {
        return null;
      }
    }
    if (!followingMatch || followingMatch[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
      return this.checkAndReturnWithoutFollowingPattern(result);
    }
    result.end = this.extractFollowingTimeComponents(context, followingMatch, result);
    if (result.end) {
      result.text += followingMatch[0];
    }
    return this.checkAndReturnWithFollowingPattern(result);
  }
  extractPrimaryTimeComponents(context, match, strict2 = false) {
    const components = context.createParsingComponents();
    let minute = 0;
    let meridiem = null;
    let hour = parseInt(match[HOUR_GROUP]);
    if (hour > 100) {
      if (match[HOUR_GROUP].length == 4 && match[MINUTE_GROUP] == null && !match[AM_PM_HOUR_GROUP]) {
        return null;
      }
      if (this.strictMode || match[MINUTE_GROUP] != null) {
        return null;
      }
      minute = hour % 100;
      hour = Math.floor(hour / 100);
    }
    if (hour > 24) {
      return null;
    }
    if (match[MINUTE_GROUP] != null) {
      if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
        return null;
      }
      minute = parseInt(match[MINUTE_GROUP]);
    }
    if (minute >= 60) {
      return null;
    }
    if (hour > 12) {
      meridiem = Meridiem.PM;
    }
    if (match[AM_PM_HOUR_GROUP] != null) {
      if (hour > 12)
        return null;
      const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
      if (ampm == "a") {
        meridiem = Meridiem.AM;
        if (hour == 12) {
          hour = 0;
        }
      }
      if (ampm == "p") {
        meridiem = Meridiem.PM;
        if (hour != 12) {
          hour += 12;
        }
      }
    }
    components.assign("hour", hour);
    components.assign("minute", minute);
    if (meridiem !== null) {
      components.assign("meridiem", meridiem);
    } else {
      if (hour < 12) {
        components.imply("meridiem", Meridiem.AM);
      } else {
        components.imply("meridiem", Meridiem.PM);
      }
    }
    if (match[MILLI_SECOND_GROUP] != null) {
      const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
      if (millisecond >= 1e3)
        return null;
      components.assign("millisecond", millisecond);
    }
    if (match[SECOND_GROUP] != null) {
      const second = parseInt(match[SECOND_GROUP]);
      if (second >= 60)
        return null;
      components.assign("second", second);
    }
    return components;
  }
  extractFollowingTimeComponents(context, match, result) {
    const components = context.createParsingComponents();
    if (match[MILLI_SECOND_GROUP] != null) {
      const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
      if (millisecond >= 1e3)
        return null;
      components.assign("millisecond", millisecond);
    }
    if (match[SECOND_GROUP] != null) {
      const second = parseInt(match[SECOND_GROUP]);
      if (second >= 60)
        return null;
      components.assign("second", second);
    }
    let hour = parseInt(match[HOUR_GROUP]);
    let minute = 0;
    let meridiem = -1;
    if (match[MINUTE_GROUP] != null) {
      minute = parseInt(match[MINUTE_GROUP]);
    } else if (hour > 100) {
      minute = hour % 100;
      hour = Math.floor(hour / 100);
    }
    if (minute >= 60 || hour > 24) {
      return null;
    }
    if (hour >= 12) {
      meridiem = Meridiem.PM;
    }
    if (match[AM_PM_HOUR_GROUP] != null) {
      if (hour > 12) {
        return null;
      }
      const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
      if (ampm == "a") {
        meridiem = Meridiem.AM;
        if (hour == 12) {
          hour = 0;
          if (!components.isCertain("day")) {
            components.addDurationAsImplied({ day: 1 });
          }
        }
      }
      if (ampm == "p") {
        meridiem = Meridiem.PM;
        if (hour != 12)
          hour += 12;
      }
      if (!result.start.isCertain("meridiem")) {
        if (meridiem == Meridiem.AM) {
          result.start.imply("meridiem", Meridiem.AM);
          if (result.start.get("hour") == 12) {
            result.start.assign("hour", 0);
          }
        } else {
          result.start.imply("meridiem", Meridiem.PM);
          if (result.start.get("hour") != 12) {
            result.start.assign("hour", result.start.get("hour") + 12);
          }
        }
      }
    }
    components.assign("hour", hour);
    components.assign("minute", minute);
    if (meridiem >= 0) {
      components.assign("meridiem", meridiem);
    } else {
      const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
      if (startAtPM) {
        if (result.start.get("hour") - 12 > hour) {
          components.imply("meridiem", Meridiem.AM);
        } else if (hour <= 12) {
          components.assign("hour", hour + 12);
          components.assign("meridiem", Meridiem.PM);
        }
      } else if (hour > 12) {
        components.imply("meridiem", Meridiem.PM);
      } else if (hour <= 12) {
        components.imply("meridiem", Meridiem.AM);
      }
    }
    if (components.date().getTime() < result.start.date().getTime()) {
      components.addDurationAsImplied({ day: 1 });
    }
    return components;
  }
  checkAndReturnWithoutFollowingPattern(result) {
    if (result.text.match(/^\d$/)) {
      return null;
    }
    if (result.text.match(/^\d\d\d+$/)) {
      return null;
    }
    if (result.text.match(/\d[apAP]$/)) {
      return null;
    }
    const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
    if (endingWithNumbers) {
      const endingNumbers = endingWithNumbers[1];
      if (this.strictMode) {
        return null;
      }
      if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
        return null;
      }
      const endingNumberVal = parseInt(endingNumbers);
      if (endingNumberVal > 24) {
        return null;
      }
    }
    return result;
  }
  checkAndReturnWithFollowingPattern(result) {
    if (result.text.match(/^\d+-\d+$/)) {
      return null;
    }
    const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/);
    if (endingWithNumbers) {
      if (this.strictMode) {
        return null;
      }
      const startingNumbers = endingWithNumbers[1];
      const endingNumbers = endingWithNumbers[2];
      if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
        return null;
      }
      const endingNumberVal = parseInt(endingNumbers);
      const startingNumberVal = parseInt(startingNumbers);
      if (endingNumberVal > 24 || startingNumberVal > 24) {
        return null;
      }
    }
    return result;
  }
  cachedPrimaryPrefix = null;
  cachedPrimarySuffix = null;
  cachedPrimaryTimePattern = null;
  getPrimaryTimePatternThroughCache() {
    const primaryPrefix = this.primaryPrefix();
    const primarySuffix = this.primarySuffix();
    if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
      return this.cachedPrimaryTimePattern;
    }
    this.cachedPrimaryTimePattern = primaryTimePattern(this.primaryPatternLeftBoundary(), primaryPrefix, primarySuffix, this.patternFlags());
    this.cachedPrimaryPrefix = primaryPrefix;
    this.cachedPrimarySuffix = primarySuffix;
    return this.cachedPrimaryTimePattern;
  }
  cachedFollowingPhase = null;
  cachedFollowingSuffix = null;
  cachedFollowingTimePatten = null;
  getFollowingTimePatternThroughCache() {
    const followingPhase = this.followingPhase();
    const followingSuffix = this.followingSuffix();
    if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
      return this.cachedFollowingTimePatten;
    }
    this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
    this.cachedFollowingPhase = followingPhase;
    this.cachedFollowingSuffix = followingSuffix;
    return this.cachedFollowingTimePatten;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENTimeExpressionParser.js
var ENTimeExpressionParser = class extends AbstractTimeExpressionParser {
  constructor(strictMode) {
    super(strictMode);
  }
  followingPhase() {
    return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|to|until|through|till|\\?)\\s*";
  }
  primaryPrefix() {
    return "(?:(?:at|from)\\s*)??";
  }
  primarySuffix() {
    return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)";
  }
  extractPrimaryTimeComponents(context, match) {
    const components = super.extractPrimaryTimeComponents(context, match);
    if (!components) {
      return components;
    }
    if (match[0].endsWith("night")) {
      const hour = components.get("hour");
      if (hour >= 6 && hour < 12) {
        components.assign("hour", components.get("hour") + 12);
        components.assign("meridiem", Meridiem.PM);
      } else if (hour < 6) {
        components.assign("meridiem", Meridiem.AM);
      }
    }
    if (match[0].endsWith("afternoon")) {
      components.assign("meridiem", Meridiem.PM);
      const hour = components.get("hour");
      if (hour >= 0 && hour <= 6) {
        components.assign("hour", components.get("hour") + 12);
      }
    }
    if (match[0].endsWith("morning")) {
      components.assign("meridiem", Meridiem.AM);
      const hour = components.get("hour");
      if (hour < 12) {
        components.assign("hour", components.get("hour"));
      }
    }
    return components.addTag("parser/ENTimeExpressionParser");
  }
  extractFollowingTimeComponents(context, match, result) {
    const followingComponents = super.extractFollowingTimeComponents(context, match, result);
    if (followingComponents) {
      followingComponents.addTag("parser/ENTimeExpressionParser");
    }
    return followingComponents;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENTimeUnitAgoFormatParser.js
var PATTERN7 = new RegExp(`(${TIME_UNITS_PATTERN})\\s{0,5}(?:ago|before|earlier)(?=\\W|$)`, "i");
var STRICT_PATTERN = new RegExp(`(${TIME_UNITS_NO_ABBR_PATTERN})\\s{0,5}(?:ago|before|earlier)(?=\\W|$)`, "i");
var ENTimeUnitAgoFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  strictMode;
  constructor(strictMode) {
    super();
    this.strictMode = strictMode;
  }
  innerPattern() {
    return this.strictMode ? STRICT_PATTERN : PATTERN7;
  }
  innerExtract(context, match) {
    const duration = parseDuration(match[1]);
    if (!duration) {
      return null;
    }
    return ParsingComponents.createRelativeFromReference(context.reference, reverseDuration(duration));
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENTimeUnitLaterFormatParser.js
var PATTERN8 = new RegExp(`(${TIME_UNITS_PATTERN})\\s{0,5}(?:later|after|from now|henceforth|forward|out)(?=(?:\\W|$))`, "i");
var STRICT_PATTERN2 = new RegExp(`(${TIME_UNITS_NO_ABBR_PATTERN})\\s{0,5}(later|after|from now)(?=\\W|$)`, "i");
var GROUP_NUM_TIMEUNITS = 1;
var ENTimeUnitLaterFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  strictMode;
  constructor(strictMode) {
    super();
    this.strictMode = strictMode;
  }
  innerPattern() {
    return this.strictMode ? STRICT_PATTERN2 : PATTERN8;
  }
  innerExtract(context, match) {
    const timeUnits = parseDuration(match[GROUP_NUM_TIMEUNITS]);
    if (!timeUnits) {
      return null;
    }
    return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
  }
};

// node_modules/chrono-node/dist/esm/common/abstractRefiners.js
var Filter = class {
  refine(context, results) {
    return results.filter((r) => this.isValid(context, r));
  }
};
var MergingRefiner = class {
  refine(context, results) {
    if (results.length < 2) {
      return results;
    }
    const mergedResults = [];
    let curResult = results[0];
    let nextResult = null;
    for (let i = 1; i < results.length; i++) {
      nextResult = results[i];
      const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
      if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
        mergedResults.push(curResult);
        curResult = nextResult;
      } else {
        const left = curResult;
        const right = nextResult;
        const mergedResult = this.mergeResults(textBetween, left, right, context);
        context.debug(() => {
          console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
        });
        curResult = mergedResult;
      }
    }
    if (curResult != null) {
      mergedResults.push(curResult);
    }
    return mergedResults;
  }
};

// node_modules/chrono-node/dist/esm/common/refiners/AbstractMergeDateRangeRefiner.js
var AbstractMergeDateRangeRefiner = class extends MergingRefiner {
  shouldMergeResults(textBetween, currentResult, nextResult) {
    return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
  }
  mergeResults(textBetween, fromResult, toResult) {
    if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
      toResult.start.getCertainComponents().forEach((key) => {
        if (!fromResult.start.isCertain(key)) {
          fromResult.start.imply(key, toResult.start.get(key));
        }
      });
      fromResult.start.getCertainComponents().forEach((key) => {
        if (!toResult.start.isCertain(key)) {
          toResult.start.imply(key, fromResult.start.get(key));
        }
      });
    }
    if (fromResult.start.date() > toResult.start.date()) {
      let fromDate = fromResult.start.date();
      let toDate = toResult.start.date();
      if (toResult.start.isOnlyWeekdayComponent() && addDuration(toDate, { day: 7 }) > fromDate) {
        toDate = addDuration(toDate, { day: 7 });
        toResult.start.imply("day", toDate.getDate());
        toResult.start.imply("month", toDate.getMonth() + 1);
        toResult.start.imply("year", toDate.getFullYear());
      } else if (fromResult.start.isOnlyWeekdayComponent() && addDuration(fromDate, { day: -7 }) < toDate) {
        fromDate = addDuration(fromDate, { day: -7 });
        fromResult.start.imply("day", fromDate.getDate());
        fromResult.start.imply("month", fromDate.getMonth() + 1);
        fromResult.start.imply("year", fromDate.getFullYear());
      } else if (toResult.start.isDateWithUnknownYear() && addDuration(toDate, { year: 1 }) > fromDate) {
        toDate = addDuration(toDate, { year: 1 });
        toResult.start.imply("year", toDate.getFullYear());
      } else if (fromResult.start.isDateWithUnknownYear() && addDuration(fromDate, { year: -1 }) < toDate) {
        fromDate = addDuration(fromDate, { year: -1 });
        fromResult.start.imply("year", fromDate.getFullYear());
      } else {
        [toResult, fromResult] = [fromResult, toResult];
      }
    }
    const result = fromResult.clone();
    result.start = fromResult.start;
    result.end = toResult.start;
    result.index = Math.min(fromResult.index, toResult.index);
    if (fromResult.index < toResult.index) {
      result.text = fromResult.text + textBetween + toResult.text;
    } else {
      result.text = toResult.text + textBetween + fromResult.text;
    }
    return result;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENMergeDateRangeRefiner.js
var ENMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner {
  patternBetween() {
    return /^\s*(to|-|–|until|through|till)\s*$/i;
  }
};

// node_modules/chrono-node/dist/esm/calculation/mergingCalculation.js
function mergeDateTimeResult(dateResult, timeResult) {
  const result = dateResult.clone();
  const beginDate = dateResult.start;
  const beginTime = timeResult.start;
  result.start = mergeDateTimeComponent(beginDate, beginTime);
  if (dateResult.end != null || timeResult.end != null) {
    const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
    const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
    const endDateTime = mergeDateTimeComponent(endDate, endTime);
    if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
      const nextDay = new Date(endDateTime.date().getTime());
      nextDay.setDate(nextDay.getDate() + 1);
      if (endDateTime.isCertain("day")) {
        assignSimilarDate(endDateTime, nextDay);
      } else {
        implySimilarDate(endDateTime, nextDay);
      }
    }
    result.end = endDateTime;
  }
  return result;
}
function mergeDateTimeComponent(dateComponent, timeComponent) {
  const dateTimeComponent = dateComponent.clone();
  if (timeComponent.isCertain("hour")) {
    dateTimeComponent.assign("hour", timeComponent.get("hour"));
    dateTimeComponent.assign("minute", timeComponent.get("minute"));
    if (timeComponent.isCertain("second")) {
      dateTimeComponent.assign("second", timeComponent.get("second"));
      if (timeComponent.isCertain("millisecond")) {
        dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
      } else {
        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
      }
    } else {
      dateTimeComponent.imply("second", timeComponent.get("second"));
      dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    }
  } else {
    dateTimeComponent.imply("hour", timeComponent.get("hour"));
    dateTimeComponent.imply("minute", timeComponent.get("minute"));
    dateTimeComponent.imply("second", timeComponent.get("second"));
    dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
  }
  if (timeComponent.isCertain("timezoneOffset")) {
    dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
  }
  const dateHasMeaningfulMeridiem = dateComponent.get("meridiem") != null && (dateComponent.isCertain("meridiem") || Array.from(dateComponent.tags()).some((t) => t.startsWith("casualReference/")));
  if (timeComponent.isCertain("meridiem")) {
    dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
  } else if (timeComponent.get("meridiem") != null && !dateHasMeaningfulMeridiem) {
    dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
  }
  if (dateTimeComponent.get("meridiem") == Meridiem.PM && dateTimeComponent.get("hour") < 12) {
    if (timeComponent.isCertain("hour")) {
      dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
    } else {
      dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
    }
  }
  dateTimeComponent.addTags(dateComponent.tags());
  dateTimeComponent.addTags(timeComponent.tags());
  return dateTimeComponent;
}

// node_modules/chrono-node/dist/esm/common/refiners/AbstractMergeDateTimeRefiner.js
var AbstractMergeDateTimeRefiner = class extends MergingRefiner {
  shouldMergeResults(textBetween, currentResult, nextResult) {
    const isDateThenTime = currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime();
    const isTimeThenDate = currentResult.start.isOnlyTime() && nextResult.start.isOnlyDate();
    if (isTimeThenDate && textBetween.trim() === ":") {
      return false;
    }
    return (isDateThenTime || isTimeThenDate) && textBetween.match(this.patternBetween()) != null;
  }
  mergeResults(textBetween, currentResult, nextResult) {
    const result = currentResult.start.isOnlyDate() ? mergeDateTimeResult(currentResult, nextResult) : mergeDateTimeResult(nextResult, currentResult);
    result.index = currentResult.index;
    result.text = currentResult.text + textBetween + nextResult.text;
    return result;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENMergeDateTimeRefiner.js
var ENMergeDateTimeRefiner = class extends AbstractMergeDateTimeRefiner {
  patternBetween() {
    return new RegExp("^\\s*(T|at|after|before|on|of|,|-|\\.|\u2219|:)?\\s*$");
  }
};

// node_modules/chrono-node/dist/esm/common/refiners/ExtractTimezoneAbbrRefiner.js
var TIMEZONE_NAME_PATTERN = new RegExp("^\\s*,?\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
var ExtractTimezoneAbbrRefiner = class {
  timezoneOverrides;
  constructor(timezoneOverrides) {
    this.timezoneOverrides = timezoneOverrides;
  }
  refine(context, results) {
    const timezoneOverrides = context.option.timezones ?? {};
    results.forEach((result) => {
      const suffix = context.text.substring(result.index + result.text.length);
      const match = TIMEZONE_NAME_PATTERN.exec(suffix);
      if (!match) {
        return;
      }
      const timezoneAbbr = match[1].toUpperCase();
      const refDate = result.start.date() ?? result.refDate ?? /* @__PURE__ */ new Date();
      const tzOverrides = { ...this.timezoneOverrides, ...timezoneOverrides };
      const extractedTimezoneOffset = toTimezoneOffset(timezoneAbbr, refDate, tzOverrides);
      if (extractedTimezoneOffset == null) {
        return;
      }
      context.debug(() => {
        console.log(`Extracting timezone: '${timezoneAbbr}' into: ${extractedTimezoneOffset} for: ${result.start}`);
      });
      const currentTimezoneOffset = result.start.get("timezoneOffset");
      if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
        if (result.start.isCertain("timezoneOffset")) {
          return;
        }
        if (timezoneAbbr != match[1]) {
          return;
        }
      }
      if (result.start.isOnlyDate()) {
        if (timezoneAbbr != match[1]) {
          return;
        }
      }
      result.text += match[0];
      if (!result.start.isCertain("timezoneOffset")) {
        result.start.assign("timezoneOffset", extractedTimezoneOffset);
      }
      if (result.end != null && !result.end.isCertain("timezoneOffset")) {
        result.end.assign("timezoneOffset", extractedTimezoneOffset);
      }
    });
    return results;
  }
};

// node_modules/chrono-node/dist/esm/common/refiners/ExtractTimezoneOffsetRefiner.js
var TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:\\(?(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?\\)?", "i");
var TIMEZONE_OFFSET_SIGN_GROUP = 1;
var TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
var TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
var ExtractTimezoneOffsetRefiner = class {
  refine(context, results) {
    results.forEach(function(result) {
      if (result.start.isCertain("timezoneOffset")) {
        return;
      }
      const suffix = context.text.substring(result.index + result.text.length);
      const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
      if (!match) {
        return;
      }
      context.debug(() => {
        console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
      });
      const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
      const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
      let timezoneOffset = hourOffset * 60 + minuteOffset;
      if (timezoneOffset > 14 * 60) {
        return;
      }
      if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
        timezoneOffset = -timezoneOffset;
      }
      if (result.end != null) {
        result.end.assign("timezoneOffset", timezoneOffset);
      }
      result.start.assign("timezoneOffset", timezoneOffset);
      result.text += match[0];
    });
    return results;
  }
};

// node_modules/chrono-node/dist/esm/common/refiners/OverlapRemovalRefiner.js
var OverlapRemovalRefiner = class {
  refine(context, results) {
    if (results.length < 2) {
      return results;
    }
    const filteredResults = [];
    let prevResult = results[0];
    for (let i = 1; i < results.length; i++) {
      const result = results[i];
      if (result.index >= prevResult.index + prevResult.text.length) {
        filteredResults.push(prevResult);
        prevResult = result;
        continue;
      }
      let kept = null;
      let removed = null;
      if (result.text.length > prevResult.text.length) {
        kept = result;
        removed = prevResult;
      } else {
        kept = prevResult;
        removed = result;
      }
      context.debug(() => {
        console.log(`${this.constructor.name} remove ${removed} by ${kept}`);
      });
      prevResult = kept;
    }
    if (prevResult != null) {
      filteredResults.push(prevResult);
    }
    return filteredResults;
  }
};

// node_modules/chrono-node/dist/esm/calculation/weekdays.js
function createParsingComponentsAtWeekday(reference, weekday, modifier) {
  const refDate = reference.getDateWithAdjustedTimezone();
  const daysToWeekday = getDaysToWeekday(refDate, weekday, modifier);
  let components = new ParsingComponents(reference);
  components = components.addDurationAsImplied({ day: daysToWeekday });
  components.assign("weekday", weekday);
  return components;
}
function getDaysToWeekday(refDate, weekday, modifier) {
  const refWeekday = refDate.getDay();
  switch (modifier) {
    case "this":
      return getDaysForwardToWeekday(refDate, weekday);
    case "last":
      return getBackwardDaysToWeekday(refDate, weekday);
    case "next":
      if (refWeekday == Weekday.SUNDAY) {
        return weekday == Weekday.SUNDAY ? 7 : weekday;
      }
      if (refWeekday == Weekday.SATURDAY) {
        if (weekday == Weekday.SATURDAY)
          return 7;
        if (weekday == Weekday.SUNDAY)
          return 8;
        return 1 + weekday;
      }
      if (weekday < refWeekday && weekday != Weekday.SUNDAY) {
        return getDaysForwardToWeekday(refDate, weekday);
      } else {
        return getDaysForwardToWeekday(refDate, weekday) + 7;
      }
  }
  return getDaysToWeekdayClosest(refDate, weekday);
}
function getDaysToWeekdayClosest(refDate, weekday) {
  const backward = getBackwardDaysToWeekday(refDate, weekday);
  const forward = getDaysForwardToWeekday(refDate, weekday);
  return forward < -backward ? forward : backward;
}
function getDaysForwardToWeekday(refDate, weekday) {
  const refWeekday = refDate.getDay();
  let forwardCount = weekday - refWeekday;
  if (forwardCount < 0) {
    forwardCount += 7;
  }
  return forwardCount;
}
function getBackwardDaysToWeekday(refDate, weekday) {
  const refWeekday = refDate.getDay();
  let backwardCount = weekday - refWeekday;
  if (backwardCount >= 0) {
    backwardCount -= 7;
  }
  return backwardCount;
}

// node_modules/chrono-node/dist/esm/common/refiners/ForwardDateRefiner.js
var ForwardDateRefiner = class {
  refine(context, results) {
    if (!context.option.forwardDate) {
      return results;
    }
    results.forEach((result) => {
      let refDate = context.reference.getDateWithAdjustedTimezone();
      if (result.start.isOnlyTime() && context.reference.instant > result.start.date()) {
        const refDate2 = context.reference.getDateWithAdjustedTimezone();
        const refFollowingDay = new Date(refDate2);
        refFollowingDay.setDate(refFollowingDay.getDate() + 1);
        implySimilarDate(result.start, refFollowingDay);
        context.debug(() => {
          console.log(`${this.constructor.name} adjusted ${result} time from the ref date (${refDate2}) to the following day (${refFollowingDay})`);
        });
        if (result.end && result.end.isOnlyTime()) {
          implySimilarDate(result.end, refFollowingDay);
          if (result.start.date() > result.end.date()) {
            refFollowingDay.setDate(refFollowingDay.getDate() + 1);
            implySimilarDate(result.end, refFollowingDay);
          }
        }
      }
      if (result.start.isOnlyWeekdayComponent() && refDate > result.start.date()) {
        let daysToAdd = getDaysForwardToWeekday(refDate, result.start.get("weekday")) || 7;
        const forwardedWeekday = addDuration(refDate, { day: daysToAdd });
        implySimilarDate(result.start, forwardedWeekday);
        context.debug(() => {
          console.log(`${this.constructor.name} adjusted ${result} weekday (${result.start})`);
        });
        if (result.end && result.start.date() > result.end.date()) {
          let daysToAdd2 = getDaysForwardToWeekday(refDate, result.start.get("weekday")) || 7;
          const forwardedWeekday2 = addDuration(refDate, { day: daysToAdd2 });
          implySimilarDate(result.end, forwardedWeekday2);
          context.debug(() => {
            console.log(`${this.constructor.name} adjusted ${result} weekday (${result.end})`);
          });
        }
      }
      if (result.start.isDateWithUnknownYear() && refDate > result.start.date()) {
        for (let i = 0; i < 3 && refDate > result.start.date(); i++) {
          result.start.imply("year", result.start.get("year") + 1);
          context.debug(() => {
            console.log(`${this.constructor.name} adjusted ${result} year (${result.start})`);
          });
          if (result.end && !result.end.isCertain("year")) {
            result.end.imply("year", result.end.get("year") + 1);
            context.debug(() => {
              console.log(`${this.constructor.name} adjusted ${result} month (${result.start})`);
            });
          }
        }
      }
    });
    return results;
  }
};

// node_modules/chrono-node/dist/esm/common/refiners/UnlikelyFormatFilter.js
var UnlikelyFormatFilter = class extends Filter {
  strictMode;
  constructor(strictMode) {
    super();
    this.strictMode = strictMode;
  }
  isValid(context, result) {
    if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
      context.debug(() => {
        console.log(`Removing unlikely result '${result.text}'`);
      });
      return false;
    }
    if (!result.start.isValidDate()) {
      context.debug(() => {
        console.log(`Removing invalid result: ${result} (${result.start})`);
      });
      return false;
    }
    if (result.end && !result.end.isValidDate()) {
      context.debug(() => {
        console.log(`Removing invalid result: ${result} (${result.end})`);
      });
      return false;
    }
    if (this.strictMode) {
      return this.isStrictModeValid(context, result);
    }
    return true;
  }
  isStrictModeValid(context, result) {
    if (result.start.isOnlyWeekdayComponent()) {
      context.debug(() => {
        console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
      });
      return false;
    }
    return true;
  }
};

// node_modules/chrono-node/dist/esm/common/parsers/ISOFormatParser.js
var PATTERN9 = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})(?:T([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2})(?:\\.(\\d{1,4}))?)?(Z|([+-]\\d{2}):?(\\d{2})?)?)?(?=\\W|$)", "i");
var YEAR_NUMBER_GROUP2 = 1;
var MONTH_NUMBER_GROUP2 = 2;
var DATE_NUMBER_GROUP2 = 3;
var HOUR_NUMBER_GROUP = 4;
var MINUTE_NUMBER_GROUP = 5;
var SECOND_NUMBER_GROUP = 6;
var MILLISECOND_NUMBER_GROUP = 7;
var TZD_GROUP = 8;
var TZD_HOUR_OFFSET_GROUP = 9;
var TZD_MINUTE_OFFSET_GROUP = 10;
var ISOFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN9;
  }
  innerExtract(context, match) {
    const components = context.createParsingComponents({
      "year": parseInt(match[YEAR_NUMBER_GROUP2]),
      "month": parseInt(match[MONTH_NUMBER_GROUP2]),
      "day": parseInt(match[DATE_NUMBER_GROUP2])
    });
    if (match[HOUR_NUMBER_GROUP] != null) {
      components.assign("hour", parseInt(match[HOUR_NUMBER_GROUP]));
      components.assign("minute", parseInt(match[MINUTE_NUMBER_GROUP]));
      if (match[SECOND_NUMBER_GROUP] != null) {
        components.assign("second", parseInt(match[SECOND_NUMBER_GROUP]));
      }
      if (match[MILLISECOND_NUMBER_GROUP] != null) {
        components.assign("millisecond", parseInt(match[MILLISECOND_NUMBER_GROUP]));
      }
      if (match[TZD_GROUP] != null) {
        let offset = 0;
        if (match[TZD_HOUR_OFFSET_GROUP]) {
          const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
          let minuteOffset = 0;
          if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
            minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
          }
          offset = hourOffset * 60;
          if (offset < 0) {
            offset -= minuteOffset;
          } else {
            offset += minuteOffset;
          }
        }
        components.assign("timezoneOffset", offset);
      }
    }
    return components.addTag("parser/ISOFormatParser");
  }
};

// node_modules/chrono-node/dist/esm/common/refiners/MergeWeekdayComponentRefiner.js
var MergeWeekdayComponentRefiner = class extends MergingRefiner {
  mergeResults(textBetween, currentResult, nextResult) {
    const newResult = nextResult.clone();
    newResult.index = currentResult.index;
    newResult.text = currentResult.text + textBetween + newResult.text;
    newResult.start.assign("weekday", currentResult.start.get("weekday"));
    if (newResult.end) {
      newResult.end.assign("weekday", currentResult.start.get("weekday"));
    }
    return newResult;
  }
  shouldMergeResults(textBetween, currentResult, nextResult) {
    const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() && !currentResult.start.isCertain("hour") && nextResult.start.isCertain("day") && !nextResult.start.tags().has("result/relativeDate");
    return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
  }
};

// node_modules/chrono-node/dist/esm/configurations.js
function includeCommonConfiguration(configuration2, strictMode = false) {
  configuration2.parsers.unshift(new ISOFormatParser());
  configuration2.refiners.unshift(new MergeWeekdayComponentRefiner());
  configuration2.refiners.unshift(new ExtractTimezoneOffsetRefiner());
  configuration2.refiners.unshift(new OverlapRemovalRefiner());
  configuration2.refiners.push(new ExtractTimezoneAbbrRefiner());
  configuration2.refiners.push(new OverlapRemovalRefiner());
  configuration2.refiners.push(new ForwardDateRefiner());
  configuration2.refiners.push(new UnlikelyFormatFilter(strictMode));
  return configuration2;
}

// node_modules/chrono-node/dist/esm/common/casualReferences.js
function now(reference) {
  const targetDate = reference.getDateWithAdjustedTimezone();
  const component = new ParsingComponents(reference, {});
  assignSimilarDate(component, targetDate);
  assignSimilarTime(component, targetDate);
  component.assign("timezoneOffset", reference.getTimezoneOffset());
  component.addTag("casualReference/now");
  return component;
}
function today(reference) {
  const targetDate = reference.getDateWithAdjustedTimezone();
  const component = new ParsingComponents(reference, {});
  assignSimilarDate(component, targetDate);
  implySimilarTime(component, targetDate);
  component.delete("meridiem");
  component.addTag("casualReference/today");
  return component;
}
function yesterday(reference) {
  return theDayBefore(reference, 1).addTag("casualReference/yesterday");
}
function tomorrow(reference) {
  return theDayAfter(reference, 1).addTag("casualReference/tomorrow");
}
function theDayBefore(reference, numDay) {
  return theDayAfter(reference, -numDay);
}
function theDayAfter(reference, nDays) {
  const targetDate = reference.getDateWithAdjustedTimezone();
  const component = new ParsingComponents(reference, {});
  const newDate = new Date(targetDate.getTime());
  newDate.setDate(newDate.getDate() + nDays);
  assignSimilarDate(component, newDate);
  implySimilarTime(component, newDate);
  component.delete("meridiem");
  return component;
}
function tonight(reference, implyHour = 22) {
  const targetDate = reference.getDateWithAdjustedTimezone();
  const component = new ParsingComponents(reference, {});
  assignSimilarDate(component, targetDate);
  component.imply("hour", implyHour);
  component.imply("meridiem", Meridiem.PM);
  component.addTag("casualReference/tonight");
  return component;
}
function evening(reference, implyHour = 20) {
  const component = new ParsingComponents(reference, {});
  component.imply("meridiem", Meridiem.PM);
  component.imply("hour", implyHour);
  component.addTag("casualReference/evening");
  return component;
}
function midnight(reference) {
  const component = new ParsingComponents(reference, {});
  if (reference.getDateWithAdjustedTimezone().getHours() > 2) {
    component.addDurationAsImplied({ day: 1 });
  }
  component.assign("hour", 0);
  component.imply("minute", 0);
  component.imply("second", 0);
  component.imply("millisecond", 0);
  component.addTag("casualReference/midnight");
  return component;
}
function morning(reference, implyHour = 6) {
  const component = new ParsingComponents(reference, {});
  component.imply("meridiem", Meridiem.AM);
  component.imply("hour", implyHour);
  component.imply("minute", 0);
  component.imply("second", 0);
  component.imply("millisecond", 0);
  component.addTag("casualReference/morning");
  return component;
}
function afternoon(reference, implyHour = 15) {
  const component = new ParsingComponents(reference, {});
  component.imply("meridiem", Meridiem.PM);
  component.imply("hour", implyHour);
  component.imply("minute", 0);
  component.imply("second", 0);
  component.imply("millisecond", 0);
  component.addTag("casualReference/afternoon");
  return component;
}
function noon(reference) {
  const component = new ParsingComponents(reference, {});
  component.imply("meridiem", Meridiem.AM);
  component.assign("hour", 12);
  component.imply("minute", 0);
  component.imply("second", 0);
  component.imply("millisecond", 0);
  component.addTag("casualReference/noon");
  return component;
}

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENCasualDateParser.js
var PATTERN10 = /(now|today|tonight|tomorrow|overmorrow|tmr|tmrw|yesterday|last\s*night)(?=\W|$)/i;
var ENCasualDateParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern(context) {
    return PATTERN10;
  }
  innerExtract(context, match) {
    let targetDate = context.refDate;
    const lowerText = match[0].toLowerCase();
    let component = context.createParsingComponents();
    switch (lowerText) {
      case "now":
        component = now(context.reference);
        break;
      case "today":
        component = today(context.reference);
        break;
      case "yesterday":
        component = yesterday(context.reference);
        break;
      case "tomorrow":
      case "tmr":
      case "tmrw":
        component = tomorrow(context.reference);
        break;
      case "tonight":
        component = tonight(context.reference);
        break;
      case "overmorrow":
        component = theDayAfter(context.reference, 2);
        break;
      default:
        if (lowerText.match(/last\s*night/)) {
          if (targetDate.getHours() > 6) {
            const previousDay = new Date(targetDate.getTime());
            previousDay.setDate(previousDay.getDate() - 1);
            targetDate = previousDay;
          }
          assignSimilarDate(component, targetDate);
          component.imply("hour", 0);
        }
        break;
    }
    component.addTag("parser/ENCasualDateParser");
    return component;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENCasualTimeParser.js
var PATTERN11 = /(?:this)?\s{0,3}(morning|afternoon|evening|night|midnight|midday|noon)(?=\W|$)/i;
var ENCasualTimeParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN11;
  }
  innerExtract(context, match) {
    let component = null;
    switch (match[1].toLowerCase()) {
      case "afternoon":
        component = afternoon(context.reference);
        break;
      case "evening":
      case "night":
        component = evening(context.reference);
        break;
      case "midnight":
        component = midnight(context.reference);
        break;
      case "morning":
        component = morning(context.reference);
        break;
      case "noon":
      case "midday":
        component = noon(context.reference);
        break;
    }
    if (component) {
      component.addTag("parser/ENCasualTimeParser");
    }
    return component;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENWeekdayParser.js
var PATTERN12 = new RegExp(`(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:on\\s*?)?(?:(this|last|past|next)\\s*)?(${matchAnyPattern(WEEKDAY_DICTIONARY)}|weekend|weekday)(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(?:of\\s*)?(this|last|past|next)\\s*week)?(?=\\W|$)`, "i");
var PREFIX_GROUP2 = 1;
var WEEKDAY_GROUP = 2;
var POSTFIX_GROUP = 3;
var ENWeekdayParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN12;
  }
  innerExtract(context, match) {
    const prefix = match[PREFIX_GROUP2];
    const postfix = match[POSTFIX_GROUP];
    let modifierWord = prefix || postfix;
    modifierWord = modifierWord || "";
    modifierWord = modifierWord.toLowerCase();
    let modifier = null;
    if (modifierWord == "last" || modifierWord == "past") {
      modifier = "last";
    } else if (modifierWord == "next") {
      modifier = "next";
    } else if (modifierWord == "this") {
      modifier = "this";
    }
    const weekday_word = match[WEEKDAY_GROUP].toLowerCase();
    let weekday;
    if (WEEKDAY_DICTIONARY[weekday_word] !== void 0) {
      weekday = WEEKDAY_DICTIONARY[weekday_word];
    } else if (weekday_word == "weekend") {
      weekday = modifier == "last" ? Weekday.SUNDAY : Weekday.SATURDAY;
    } else if (weekday_word == "weekday") {
      const refWeekday = context.reference.getDateWithAdjustedTimezone().getDay();
      if (refWeekday == Weekday.SUNDAY || refWeekday == Weekday.SATURDAY) {
        weekday = modifier == "last" ? Weekday.FRIDAY : Weekday.MONDAY;
      } else {
        weekday = refWeekday - 1;
        weekday = modifier == "last" ? weekday - 1 : weekday + 1;
        weekday = weekday % 5 + 1;
      }
    } else {
      return null;
    }
    return createParsingComponentsAtWeekday(context.reference, weekday, modifier);
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENRelativeDateFormatParser.js
var PATTERN13 = new RegExp(`(this|last|past|next|after\\s*this)\\s*(${matchAnyPattern(TIME_UNIT_DICTIONARY)})(?=\\s*)(?=\\W|$)`, "i");
var MODIFIER_WORD_GROUP = 1;
var RELATIVE_WORD_GROUP = 2;
var ENRelativeDateFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN13;
  }
  innerExtract(context, match) {
    const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
    const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
    const timeunit = TIME_UNIT_DICTIONARY[unitWord];
    if (modifier == "next" || modifier.startsWith("after")) {
      const timeUnits = {};
      timeUnits[timeunit] = 1;
      return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
    if (modifier == "last" || modifier == "past") {
      const timeUnits = {};
      timeUnits[timeunit] = -1;
      return ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
    }
    const components = context.createParsingComponents();
    let date = new Date(context.reference.instant.getTime());
    if (unitWord.match(/week/i)) {
      date.setDate(date.getDate() - date.getDay());
      components.imply("day", date.getDate());
      components.imply("month", date.getMonth() + 1);
      components.imply("year", date.getFullYear());
    } else if (unitWord.match(/month/i)) {
      date.setDate(1);
      components.imply("day", date.getDate());
      components.assign("year", date.getFullYear());
      components.assign("month", date.getMonth() + 1);
    } else if (unitWord.match(/year/i)) {
      date.setDate(1);
      date.setMonth(0);
      components.imply("day", date.getDate());
      components.imply("month", date.getMonth() + 1);
      components.assign("year", date.getFullYear());
    }
    return components;
  }
};

// node_modules/chrono-node/dist/esm/common/parsers/SlashDateFormatParser.js
var PATTERN14 = new RegExp("([^\\d]|^)([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?(\\W|$)", "i");
var OPENING_GROUP = 1;
var ENDING_GROUP = 5;
var FIRST_NUMBERS_GROUP = 2;
var SECOND_NUMBERS_GROUP = 3;
var YEAR_GROUP6 = 4;
var SlashDateFormatParser = class {
  groupNumberMonth;
  groupNumberDay;
  constructor(littleEndian) {
    this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
    this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
  }
  pattern() {
    return PATTERN14;
  }
  extract(context, match) {
    const index = match.index + match[OPENING_GROUP].length;
    const indexEnd = match.index + match[0].length - match[ENDING_GROUP].length;
    if (index > 0) {
      const textBefore = context.text.substring(0, index);
      if (textBefore.match("\\d/?$")) {
        return;
      }
    }
    if (indexEnd < context.text.length) {
      const textAfter = context.text.substring(indexEnd);
      if (textAfter.match("^/?\\d")) {
        return;
      }
    }
    const text = context.text.substring(index, indexEnd);
    if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
      return;
    }
    if (!match[YEAR_GROUP6] && text.indexOf("/") < 0) {
      return;
    }
    const result = context.createParsingResult(index, text);
    let month = parseInt(match[this.groupNumberMonth]);
    let day = parseInt(match[this.groupNumberDay]);
    if (month < 1 || month > 12) {
      if (month > 12) {
        if (day >= 1 && day <= 12 && month <= 31) {
          [day, month] = [month, day];
        } else {
          return null;
        }
      }
    }
    if (day < 1 || day > 31) {
      return null;
    }
    result.start.assign("day", day);
    result.start.assign("month", month);
    if (match[YEAR_GROUP6]) {
      const rawYearNumber = parseInt(match[YEAR_GROUP6]);
      const year = findMostLikelyADYear(rawYearNumber);
      result.start.assign("year", year);
    } else {
      const year = findYearClosestToRef(context.refDate, day, month);
      result.start.imply("year", year);
    }
    return result.addTag("parser/SlashDateFormatParser");
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENTimeUnitCasualRelativeFormatParser.js
var PATTERN15 = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
var PATTERN_NO_ABBR = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${TIME_UNITS_NO_ABBR_PATTERN})(?=\\W|$)`, "i");
var ENTimeUnitCasualRelativeFormatParser = class extends AbstractParserWithWordBoundaryChecking {
  allowAbbreviations;
  constructor(allowAbbreviations = true) {
    super();
    this.allowAbbreviations = allowAbbreviations;
  }
  innerPattern() {
    return this.allowAbbreviations ? PATTERN15 : PATTERN_NO_ABBR;
  }
  innerExtract(context, match) {
    const prefix = match[1].toLowerCase();
    let duration = parseDuration(match[2]);
    if (!duration) {
      return null;
    }
    switch (prefix) {
      case "last":
      case "past":
      case "-":
        duration = reverseDuration(duration);
        break;
    }
    return ParsingComponents.createRelativeFromReference(context.reference, duration);
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENMergeRelativeAfterDateRefiner.js
function IsPositiveFollowingReference(result) {
  return result.text.match(/^[+-]/i) != null;
}
function IsNegativeFollowingReference(result) {
  return result.text.match(/^-/i) != null;
}
var ENMergeRelativeAfterDateRefiner = class extends MergingRefiner {
  shouldMergeResults(textBetween, currentResult, nextResult) {
    if (!textBetween.match(/^\s*$/i)) {
      return false;
    }
    return IsPositiveFollowingReference(nextResult) || IsNegativeFollowingReference(nextResult);
  }
  mergeResults(textBetween, currentResult, nextResult, context) {
    let timeUnits = parseDuration(nextResult.text);
    if (IsNegativeFollowingReference(nextResult)) {
      timeUnits = reverseDuration(timeUnits);
    }
    const components = ParsingComponents.createRelativeFromReference(ReferenceWithTimezone.fromDate(currentResult.start.date()), timeUnits);
    return new ParsingResult(currentResult.reference, currentResult.index, `${currentResult.text}${textBetween}${nextResult.text}`, components);
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENMergeRelativeFollowByDateRefiner.js
function hasImpliedEarlierReferenceDate(result) {
  return result.text.match(/\s+(before|from)$/i) != null;
}
function hasImpliedLaterReferenceDate(result) {
  return result.text.match(/\s+(after|since)$/i) != null;
}
var ENMergeRelativeFollowByDateRefiner = class extends MergingRefiner {
  patternBetween() {
    return /^\s*$/i;
  }
  shouldMergeResults(textBetween, currentResult, nextResult) {
    if (!textBetween.match(this.patternBetween())) {
      return false;
    }
    if (!hasImpliedEarlierReferenceDate(currentResult) && !hasImpliedLaterReferenceDate(currentResult)) {
      return false;
    }
    return !!nextResult.start.get("day") && !!nextResult.start.get("month") && !!nextResult.start.get("year");
  }
  mergeResults(textBetween, currentResult, nextResult) {
    let duration = parseDuration(currentResult.text);
    if (hasImpliedEarlierReferenceDate(currentResult)) {
      duration = reverseDuration(duration);
    }
    const components = ParsingComponents.createRelativeFromReference(ReferenceWithTimezone.fromDate(nextResult.start.date()), duration);
    return new ParsingResult(nextResult.reference, currentResult.index, `${currentResult.text}${textBetween}${nextResult.text}`, components);
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENExtractYearSuffixRefiner.js
var YEAR_SUFFIX_PATTERN = new RegExp(`^\\s*(${YEAR_PATTERN})`, "i");
var YEAR_GROUP7 = 1;
var ENExtractYearSuffixRefiner = class {
  refine(context, results) {
    results.forEach(function(result) {
      if (!result.start.isDateWithUnknownYear()) {
        return;
      }
      const suffix = context.text.substring(result.index + result.text.length);
      const match = YEAR_SUFFIX_PATTERN.exec(suffix);
      if (!match) {
        return;
      }
      if (match[0].trim().length <= 3) {
        return;
      }
      context.debug(() => {
        console.log(`Extracting year: '${match[0]}' into : ${result}`);
      });
      const year = parseYear(match[YEAR_GROUP7]);
      if (result.end != null) {
        result.end.assign("year", year);
      }
      result.start.assign("year", year);
      result.text += match[0];
    });
    return results;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENUnlikelyFormatFilter.js
var ENUnlikelyFormatFilter = class extends Filter {
  constructor() {
    super();
  }
  isValid(context, result) {
    const text = result.text.trim();
    if (text === context.text.trim()) {
      return true;
    }
    if (text.toLowerCase() === "may") {
      const textBefore = context.text.substring(0, result.index).trim();
      if (!textBefore.match(/\b(in)$/i)) {
        context.debug(() => {
          console.log(`Removing unlikely result: ${result}`);
        });
        return false;
      }
    }
    if (text.toLowerCase().endsWith("the second")) {
      const textAfter = context.text.substring(result.index + result.text.length).trim();
      if (textAfter.length > 0) {
        context.debug(() => {
          console.log(`Removing unlikely result: ${result}`);
        });
      }
      return false;
    }
    return true;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/refiners/ENEndOfPeriodRefiner.js
var PREFIX_PATTERN = /\b(?:last\s+day|end)\s+of\s+(?:the\s+)?$/i;
var RELATIVE_PERIOD_PATTERN = /^(this|last|past|next)\s*(week|month|year)$/i;
var RELATIVE_YEAR_SUFFIX_PATTERN = /^\s+(this|last|past|next)\s+year(?=\W|$)/i;
function modifierOffset(modifier) {
  return modifier === "next" ? 1 : modifier === "last" || modifier === "past" ? -1 : 0;
}
var ENEndOfPeriodRefiner = class {
  refine(context, results) {
    results.forEach((result) => {
      const prefix = context.text.substring(0, result.index).match(PREFIX_PATTERN);
      if (!prefix) {
        return;
      }
      const relativePeriod = result.text.match(RELATIVE_PERIOD_PATTERN);
      if (relativePeriod) {
        const modifier = relativePeriod[1].toLowerCase();
        this.moveToEndOfRelativePeriod(context, result, modifier, relativePeriod[2].toLowerCase());
      } else if (result.start.isCertain("month") && !result.start.isCertain("day")) {
        this.moveToEndOfMonth(context, result);
      } else {
        return;
      }
      result.start.imply("hour", 12);
      result.start.imply("minute", 0);
      result.start.imply("second", 0);
      result.start.imply("millisecond", 0);
      if (!result.start.isCertain("timezoneOffset")) {
        result.start.delete("timezoneOffset");
      }
      result.index -= prefix[0].length;
      result.text = prefix[0] + result.text;
      result.addTag("refiner/ENEndOfPeriodRefiner");
    });
    return results;
  }
  moveToEndOfRelativePeriod(context, result, modifier, period) {
    const offset = modifierOffset(modifier);
    const referenceDate = context.reference.getDateWithAdjustedTimezone();
    let lastDay;
    if (period === "week") {
      lastDay = new Date(referenceDate.getTime());
      lastDay.setDate(referenceDate.getDate() + (6 - referenceDate.getDay()) + offset * 7);
    } else if (period === "month") {
      lastDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + offset + 1, 0);
    } else {
      lastDay = new Date(referenceDate.getFullYear() + offset, 11, 31);
    }
    result.start.assign("day", lastDay.getDate());
    result.start.assign("month", lastDay.getMonth() + 1);
    result.start.assign("year", lastDay.getFullYear());
    result.start.delete("weekday");
    result.start.imply("weekday", lastDay.getDay());
  }
  moveToEndOfMonth(context, result) {
    let year = result.start.get("year");
    const month = result.start.get("month");
    const suffix = context.text.substring(result.index + result.text.length).match(RELATIVE_YEAR_SUFFIX_PATTERN);
    if (suffix) {
      const modifier = suffix[1].toLowerCase();
      const referenceYear = context.reference.getDateWithAdjustedTimezone().getFullYear();
      year = referenceYear + modifierOffset(modifier);
      result.start.assign("year", year);
      result.text += suffix[0];
    }
    if (!result.start.isCertain("year")) {
      const lastDayInReferenceYear = new Date(year, month, 0).getDate();
      year = findYearClosestToRef(context.reference.getDateWithAdjustedTimezone(), lastDayInReferenceYear, month);
      result.start.imply("year", year);
    }
    result.start.assign("day", new Date(year, month, 0).getDate());
  }
};

// node_modules/chrono-node/dist/esm/locales/en/parsers/ENEndOfCurrentMonthParser.js
var PATTERN16 = /(?:last\s+day|end)\s+of\s+(?:the\s+)?month(?=\W|$)/i;
var ENEndOfCurrentMonthParser = class extends AbstractParserWithWordBoundaryChecking {
  innerPattern() {
    return PATTERN16;
  }
  innerExtract(context) {
    const targetDate = context.reference.getDateWithAdjustedTimezone();
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    const components = context.createParsingComponents();
    components.assign("day", lastDay);
    components.assign("month", month);
    components.assign("year", year);
    components.addTag("parser/ENEndOfCurrentMonthParser");
    return components;
  }
};

// node_modules/chrono-node/dist/esm/locales/en/configuration.js
var ENDefaultConfiguration = class {
  createCasualConfiguration(littleEndian = false) {
    const option = this.createConfiguration(false, littleEndian);
    option.parsers.push(new ENCasualDateParser());
    option.parsers.push(new ENCasualTimeParser());
    option.parsers.push(new ENEndOfCurrentMonthParser());
    option.parsers.push(new ENMonthNameParser());
    option.parsers.push(new ENRelativeDateFormatParser());
    option.parsers.push(new ENTimeUnitCasualRelativeFormatParser());
    option.refiners.unshift(new ENEndOfPeriodRefiner());
    option.refiners.push(new ENUnlikelyFormatFilter());
    return option;
  }
  createConfiguration(strictMode = true, littleEndian = false) {
    const options = includeCommonConfiguration({
      parsers: [
        new SlashDateFormatParser(littleEndian),
        new ENTimeUnitWithinFormatParser(strictMode),
        new ENMonthNameLittleEndianParser(),
        new ENMonthNameMiddleEndianParser(littleEndian),
        new ENWeekdayParser(),
        new ENSlashMonthFormatParser(),
        new ENTimeExpressionParser(strictMode),
        new ENTimeUnitAgoFormatParser(strictMode),
        new ENTimeUnitLaterFormatParser(strictMode),
        new ENYearMonthNameParser()
      ],
      refiners: [new ENMergeDateTimeRefiner()]
    }, strictMode);
    options.parsers.unshift(new ENYearMonthDayParser(strictMode));
    options.refiners.unshift(new ENMergeRelativeFollowByDateRefiner());
    options.refiners.unshift(new ENMergeRelativeAfterDateRefiner());
    options.refiners.unshift(new OverlapRemovalRefiner());
    options.refiners.push(new ENMergeDateTimeRefiner());
    options.refiners.push(new ENExtractYearSuffixRefiner());
    options.refiners.push(new ENMergeDateRangeRefiner());
    return options;
  }
};

// node_modules/chrono-node/dist/esm/chrono.js
var Chrono = class _Chrono {
  parsers;
  refiners;
  defaultConfig = new ENDefaultConfiguration();
  constructor(configuration2) {
    configuration2 = configuration2 || this.defaultConfig.createCasualConfiguration();
    this.parsers = [...configuration2.parsers];
    this.refiners = [...configuration2.refiners];
  }
  clone() {
    return new _Chrono({
      parsers: [...this.parsers],
      refiners: [...this.refiners]
    });
  }
  parseDate(text, referenceDate, option) {
    const results = this.parse(text, referenceDate, option);
    return results.length > 0 ? results[0].start.date() : null;
  }
  parse(text, referenceDate, option) {
    const context = new ParsingContext(text, referenceDate, option);
    let results = [];
    this.parsers.forEach((parser) => {
      const parsedResults = _Chrono.executeParser(context, parser);
      results = results.concat(parsedResults);
    });
    results.sort((a, b) => {
      return a.index - b.index;
    });
    this.refiners.forEach(function(refiner) {
      results = refiner.refine(context, results);
    });
    return results;
  }
  static executeParser(context, parser) {
    const results = [];
    const pattern = parser.pattern(context);
    const originalText = context.text;
    let remainingText = context.text;
    let match = pattern.exec(remainingText);
    while (match) {
      const index = match.index + originalText.length - remainingText.length;
      match.index = index;
      const result = parser.extract(context, match);
      if (!result) {
        remainingText = originalText.substring(match.index + 1);
        match = pattern.exec(remainingText);
        continue;
      }
      let parsedResult = null;
      if (result instanceof ParsingResult) {
        parsedResult = result;
      } else if (result instanceof ParsingComponents) {
        parsedResult = context.createParsingResult(match.index, match[0]);
        parsedResult.start = result;
      } else {
        parsedResult = context.createParsingResult(match.index, match[0], result);
      }
      const parsedIndex = parsedResult.index;
      const parsedText = parsedResult.text;
      context.debug(() => console.log(`${parser.constructor.name} extracted (at index=${parsedIndex}) '${parsedText}'`));
      results.push(parsedResult);
      remainingText = originalText.substring(parsedIndex + parsedText.length);
      match = pattern.exec(remainingText);
    }
    return results;
  }
};
var ParsingContext = class {
  text;
  option;
  reference;
  refDate;
  constructor(text, refDate, option) {
    this.text = text;
    this.option = option ?? {};
    this.reference = ReferenceWithTimezone.fromInput(refDate, this.option.timezones);
    this.refDate = this.reference.instant;
  }
  createParsingComponents(components) {
    if (components instanceof ParsingComponents) {
      return components;
    }
    return new ParsingComponents(this.reference, components);
  }
  createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
    const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
    const start = startComponents ? this.createParsingComponents(startComponents) : null;
    const end = endComponents ? this.createParsingComponents(endComponents) : null;
    return new ParsingResult(this.reference, index, text, start, end);
  }
  debug(block) {
    if (this.option.debug) {
      if (this.option.debug instanceof Function) {
        this.option.debug(block);
      } else {
        const handler = this.option.debug;
        handler.debug(block);
      }
    }
  }
};

// node_modules/chrono-node/dist/esm/locales/en/index.js
var configuration = new ENDefaultConfiguration();
var casual = new Chrono(configuration.createCasualConfiguration(false));
var strict = new Chrono(configuration.createConfiguration(true, false));
var GB = new Chrono(configuration.createCasualConfiguration(true));

// node_modules/chrono-node/dist/esm/index.js
var casual2 = casual;
function parse(text, ref, option) {
  return casual2.parse(text, ref, option);
}

// src/lib/instagramParse.ts
var EVENT_HINT = /\b(workshop|info\s*session|infosession|career\s*fair|networking|tabling|rsvp|register|registration|hiring|internship|meet\s*(the|&)|panel|speaker|webinar|zoom|office\s*hours|mix(er)?|conference|summit|open\s*house|volunteer)\b/i;
var RECAP_HINT = /\b(thanks?( you)? (so much )?(to )?(all|everyone|every)|this past|recap|throwback|was a (huge |great )?success|last (week|night))\b/i;
var NOT_EVENT_TITLE_HINT = /\bevents?\s+calendar\b/i;
var NOT_EVENT_HINT = /\bofficer\s+applications?\b/i;
var DANGLING_END = /\b(the|a|an|of|at|for|to|and|or|in|on|with|from|by|our|your|this|that)$/i;
var DATE_LINE = /^\s*(?:\u{1F4C5}|\u{1F4C6}|\u{1F5D3}\uFE0F?|date\s*:|when\s*:)\s*(.+)$/imu;
var TIME_LINE = /^\s*(?:\u23F0\uFE0F?|[\u{1F550}-\u{1F567}]|time\s*:)\s*(.+)$/imu;
var LOCATION_PATTERNS = [
  /^\s*\u{1F4CD}\uFE0F?\s*(?<place>.+)$/imu,
  /\blocation\s*:\s*(?<place>.+?)(?:\n|$)/i,
  /\bwhere\s*:\s*(?<place>.+?)(?:\n|$)/i,
  /\s@\s+(?<place>[^\n#@]+)/,
  /\b(?:at|in)\s+(?<place>(?:MLK|King Library|Student Union|Spartan)[^\n,.!]*)/i,
  /(?<place>\b(?:room|rm\.?)\s*[A-Za-z]*\s?\d+[A-Za-z]?\b[^\n]*)/i
];
var DAY_MS = 24 * 60 * 60 * 1e3;
var EARLIEST_BEFORE_POST_MS = 2 * DAY_MS;
var LATEST_AFTER_POST_MS = 183 * DAY_MS;
var DEFAULT_DURATION_MS = 60 * 60 * 1e3;
var MAX_TITLE_LENGTH = 90;
var EMOJI = /[\p{Extended_Pictographic}\uFE0F\u200D]/gu;
function looksLikeEventCaption(caption) {
  const text = caption.trim();
  if (text.length < 12) return false;
  const firstLine = text.split("\n", 1)[0];
  if (NOT_EVENT_TITLE_HINT.test(firstLine) || NOT_EVENT_HINT.test(text)) return false;
  return EVENT_HINT.test(text) && !RECAP_HINT.test(text);
}
function eventTitleFromCaption(caption) {
  const lines = caption.trim().split("\n").map((part) => part.trim());
  const firstIndex = lines.findIndex(Boolean);
  if (firstIndex === -1) return "Club event";
  let line = lines[firstIndex];
  for (let next = firstIndex + 1; DANGLING_END.test(line) && lines[next]; next += 1) {
    line = `${line} ${lines[next]}`;
  }
  const cleaned = line.replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, "").trim();
  if (cleaned.length <= MAX_TITLE_LENGTH) return cleaned || "Club event";
  const firstSentence = cleaned.match(/^.+?[.!?](?=\s|$)/)?.[0];
  if (firstSentence && firstSentence.length <= MAX_TITLE_LENGTH) return firstSentence;
  const cut = cleaned.slice(0, MAX_TITLE_LENGTH - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trimEnd()}\u2026`;
}
function locationFromCaption(caption) {
  for (const pattern of LOCATION_PATTERNS) {
    const place = caption.match(pattern)?.groups?.place;
    if (!place) continue;
    const value = place.replace(EMOJI, "").replace(/^\s*(?:location|where|venue)?\s*:\s*/i, "").replace(/[\s|,.!-]+$/, "").trim();
    if (value.length > 1 && value.length < 120) return value;
  }
  if (/zoom/i.test(caption)) return "Online (Zoom \u2014 see Instagram post)";
  return "See Instagram post for location";
}
function structuredWhen(caption) {
  const date = caption.match(DATE_LINE)?.[1];
  if (!date) return null;
  const time = caption.match(TIME_LINE)?.[1];
  return time ? `${date} ${time}` : date;
}
function parseEventTimes(caption, reference) {
  const earliest = reference.getTime() - EARLIEST_BEFORE_POST_MS;
  const latest = reference.getTime() + LATEST_AFTER_POST_MS;
  const sources = [structuredWhen(caption), caption].filter((text) => !!text);
  for (const text of sources) {
    const normalized = text.replace(EMOJI, " ").replace(/\s+[@|•·]\s+/g, " at ");
    for (const result of parse(normalized, reference, { forwardDate: true })) {
      if (!result.start.isCertain("day")) continue;
      const start = result.start.date();
      if (start.getTime() < earliest || start.getTime() > latest) continue;
      const parsedEnd = result.end?.date();
      const end = parsedEnd && parsedEnd.getTime() > start.getTime() ? parsedEnd : new Date(start.getTime() + DEFAULT_DURATION_MS);
      return { start, end };
    }
  }
  return null;
}
function parseInstagramPost(post) {
  if (!looksLikeEventCaption(post.caption)) return null;
  const reference = new Date(post.takenAt);
  const times = parseEventTimes(post.caption, reference);
  if (!times) return null;
  return {
    id: `ig-${post.shortcode}`,
    title: eventTitleFromCaption(post.caption),
    caption: post.caption.trim(),
    start: times.start.toISOString(),
    end: times.end.toISOString(),
    location: locationFromCaption(post.caption),
    host: post.host,
    handle: post.handle,
    url: post.url,
    takenAt: post.takenAt
  };
}
function parseInstagramPosts(posts) {
  const byId = /* @__PURE__ */ new Map();
  for (const post of posts) {
    const parsed = parseInstagramPost(post);
    if (parsed) byId.set(parsed.id, parsed);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}

// src/data/scraped/instagram-posts.json
var instagram_posts_default = {
  scrapedAt: "2026-11-18T21:06:00.808Z",
  source: "Instagram",
  posts: [
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "Df5Wf52D4ua",
      url: "https://www.instagram.com/p/Df5Wf52D4ua/",
      caption: "\xA1Hola Familia!\n\nThank you for everyone who attended our EY workshop last week! Lots of great insight and guidance from our guest speakers, who were a blast to work with! \n\nMake sure to follow to keep up with the last few events of the semester! \u{1F913}\u{1F4BC}\n#lbsasjsu #sjsu",
      takenAt: "2026-11-18T20:21:13.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "Df5Qur_kybm",
      url: "https://www.instagram.com/p/Df5Qur_kybm/",
      caption: "Registration for Health TechQuity 2027 is now live!! \u2728\u{1F499}\u{1F389}\n \nVisit https://sjsu.edu/chhs/health-techquity to register and learn more about Health TechQuity.",
      takenAt: "2026-11-18T19:30:01.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "Df3YzdbD-MY",
      url: "https://www.instagram.com/p/Df3YzdbD-MY/",
      caption: "\u{1F6A8} Spring 2027 Board Applications are now open!\u{1F6A8} \n\nIf you would like to build your professional skill set, with transferrable and value skills, be more involved with your community, and want to become a leader, then LBSA might be calling your name! \u{1F469}\u200D\u{1F4BC}\u{1F468}\u200D\u{1F4BC}\n\n\u{1F6A8}Deadline for applications are November 29\u{1F6A8}\n\nThe link for applications are in our bio! \n\nMake sure to read the slides and position overviews, as well as your application requirements and prerequisites before applying. \n\nIf you have any questions let us know! \n\nGood luck familia! \u{1FAF6}",
      takenAt: "2026-11-18T02:02:53.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "Df3OLjpPj01",
      url: "https://www.instagram.com/p/Df3OLjpPj01/",
      caption: "You\u2019re invited to Friendsgiving! Join us for this special edition of Global Connections, where we celebrate the community spirit, cultural traditions, and friendships of the harvest season. Sample traditional American Thanksgiving desserts, learn about harvest celebrations in other cultures, and make new global connections. Play games, get crafty, write a Gratitude Gram, or just hang out with us. We look forward to celebrating Friendsgiving with you!",
      takenAt: "2026-11-18T00:30:05.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "Df3L3EbCZAl",
      url: "https://www.instagram.com/p/Df3L3EbCZAl/",
      caption: "Hey Global Spartans!\n\nAre you looking for on-campus jobs this summer or next academic year? \n\nYes?! Then join us and Univ. Housing Services (UHS) for an info session to learn more about the different types of positions available.\n\n\u{1F4C5} Thursday, Nov. 19\n\u23F0 3:00-4:00 PM\n\u{1F4CD}Campus Village 2 (CV2), Multi-Purpose Room (MPR)\n\nAccess MPR from courtyard.",
      takenAt: "2026-11-18T00:09:47.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "Df3G26jvVb8",
      url: "https://www.instagram.com/p/Df3G26jvVb8/",
      caption: "\u{1F57A}\u{1F483}Latin night was a blast! \u{1FAA9}\n\n\u{1FAF6}Thank you to everyone who showed up, showed out, and had a great time!\u{1FAF6}\n\nWe look forward to hosting you next semester!! \n\n#sjsu #latino #sanjose",
      takenAt: "2026-11-17T23:27:30.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "Df3EfS9z_XE",
      url: "https://www.instagram.com/p/Df3EfS9z_XE/",
      caption: "These IDEAS are almost ready for the spotlight \u{1F440}\u{1F3AC}\n\nJust 1 day until y\u2019all find out! \u23F3 Any last guesses? Drop them below \u{1F447}\n\n#sjsu #ideasclub #entrepreneurship #studententrepreneurs #startup",
      takenAt: "2026-11-17T23:05:06.000Z"
    },
    {
      handle: "sjsu_careercenter",
      host: "SJSU Career Center",
      shortcode: "Df2535wzWwc",
      url: "https://www.instagram.com/p/Df2535wzWwc/",
      caption: "What does a career in the semiconductor industry actually look like? \nFind out at NNME Career Lab!\nOn November 20, students and jobseekers are invited to San Jose State University to meet industry professionals, explore\ncareer paths, connect with employers, strengthen their resumes, discover education and training opportunities, and more.\n\nNo semiconductor experience required. Come explore what\u2019s possible.\n\u{1F4C5} November 20, 2026\n\u{1F4CD} San Jose State University | Diaz Compean Student Union\n\u{1F31F} No cost to attend. \n\nRegistration required.\nRegister: https://nnme.org/event/nnme-career-lab-san-jose-state-university/\n#NNME #CareerLab #Semiconductors #Microelectronics #Careers WorkforceDevelopment",
      takenAt: "2026-11-17T21:35:57.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "Df25wXGP_lN",
      url: "https://www.instagram.com/p/Df25wXGP_lN/",
      caption: "Guess we\u2019re promoting this event telepathically",
      takenAt: "2026-11-17T21:31:55.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "Df24Ua8E6qs",
      url: "https://www.instagram.com/p/Df24Ua8E6qs/",
      caption: "\u2728 OFFICER SPOTLIGHT WEEK \u2728\n \nFirst up, we\u2019re spotlighting our Executive Board! Meet our Co-Chapter Presidents, Calvin Tiamzon and Emily Yu; our VP of Internal Affairs, Yhahira Alverez and our VP of Finance, Rosemary Do\u{1F499}\n\nSwipe to learn about each officer \u27A1\uFE0F\n\nStay tuned this week to learn about our other teams\u{1F31F}\n\nAs Co-Chapter President, Calvin leads the teams and officers by overseeing all operations in event planning, finance, professional outreach, engagement, and more. Additionally, he directs organizational strategy and structure by setting goals and supporting the creation of plans and programs to ensure alignment of SHRM@SJSU\u2019s mission, vision, and values.\n\nCalvin also supports all the officers throughout the semester and buys them dinner and food to make them happy :)\n\nLearn more about Calvin!\n\nAs Co-Chapter President of SHRM@SJSU, Emily oversees chapter operations, including events, programs, outreach, and member engagement, while coordinating organizational goals, initiatives, and long-term strategy. She also provides support and guidance to officers and members, collaborates with the executive board to ensure effective chapter operations, and fosters a welcoming and engaged community where members can build meaningful connections, develop friendships, and grow professionally while connecting with HR professionals. Additionally, she serves as the primary point of contact and event liaison between SHRM@SJSU and BAHREC, coordinating communication and event logistics to strengthen the relationship between both organizations.\n\nLearn more about Emily!\n\nThe VP of Internal Affairs oversees SHRM at SJSU\u2019s internal operations, ensures effective officer communication, organizes meetings, tracks projects, and keeps officers accountable for their responsibilities. She also leads the operational side of the Buddy Program by coordinating member pairings, communicating expectations and deadlines, tracking point submissions, and ensuring the program stays organized, fair, and engaging throughout the semester.\n\nLearn more about Yhahira!\n\nThe VP of Finance files reimbursements for approved expenses, monitors income and expenses, and tracks membership payments through",
      takenAt: "2026-11-17T21:19:01.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "Df20_6eTs7_",
      url: "https://www.instagram.com/p/Df20_6eTs7_/",
      caption: "Whether you\u2019re competing for the first time or coming to watch the pitches, this covers the basics. See you on Thursday! \u{1F680}\n\n#sjcg #spartananalytics #consulting #sjsu",
      takenAt: "2026-11-17T20:51:08.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "Df2vnn_ldE3",
      url: "https://www.instagram.com/p/Df2vnn_ldE3/",
      caption: "\u{1F514} Reminder: registration for the 2nd Annual Student Climate Transformation Challenge closes Dec 15! \n\nPresented by the Climate Innovation Coalition, this is a team competition for the best climate solutions, with over $5,000 in prize money. It's open to undergraduate students from any Bay Area campus.\n\nFinalists will present at the showcase in April 2027. \n\nForm your team, start brainstorming, and sign up before finals hit. Scan the QR code on the graphic or register at cic.earth/challenge\n\n#sjsu #sustainability #greencampus #climatetransformationchallenge #climateaction",
      takenAt: "2026-11-17T20:03:34.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "Df2fL6ysUph",
      url: "https://www.instagram.com/p/Df2fL6ysUph/",
      caption: "\u{1F983} NETS FRIENDSGIVING | FOOD, FRIENDS & FUN!\n\nGood food tastes even better with great company! \u2764\uFE0F\n\nJoin NETS for a Friendsgiving celebration! Take a break from classes, enjoy some delicious food, meet fellow members, and celebrate the community we've built together.\n\n\u{1F4C5} Thursday, November 19\n\u23F0 5:00 PM \u2013 7:30 PM\n\u{1F4CD} ENGR 285\n\n\u{1F958} Want to contribute? Bring your favorite dish to share with everyone! Everyone is welcome, so come hungry and ready for a fun evening!\n\nLet's make some memories together! \u{1F9E1}\n\n\u{1F517} RSVP through our Linktree!\n\n#SJSU #NETS #Friendsgiving #Potluck #fypp",
      takenAt: "2026-11-17T17:39:27.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "Df2e_mwsIZ7",
      url: "https://www.instagram.com/p/Df2e_mwsIZ7/",
      caption: "\u{1F3B3} NETS BOWLING SOCIAL | LET'S STRIKE!\n\nEnough studying, it's time to hit the lanes! \u{1F60E}\n\nJoin NETS for an evening of bowling, friendly competition, and fun with fellow members. Whether you're a bowling pro or someone who struggles to hit a single pin, everyone's welcome! \u{1F602}\n\n\u{1F4C5} Wednesday, November 18\n\u23F0 6:00 PM \u2013 8:00 PM\n\u{1F4CD} SJSU Bowling Center (Student Union)\n\nBring your friends, challenge your fellow NETS members, and let's see who's taking home the highest score! \u{1F3C6}\n\n\u26A0\uFE0F Make sure to RSVP so we can plan accordingly!\n\n\u{1F517} RSVP NOW \u2013 Link in Bio!\n\n#SJSU #NETS #BowlingSocial #SpartanLife #StudentSocial #event",
      takenAt: "2026-11-17T17:37:46.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "Df1QST7m0N-",
      url: "https://www.instagram.com/p/Df1QST7m0N-/",
      caption: "Thank you to everyone who joined us for the Exploring Responsible Computing Careers Panel! \u2728\u{1F4BB}\n\nWe had an amazing time bridging tech with ethics, policy, and human-centered design to help students explore how they can build more responsible technology. \u2B50\uFE0F\n\n\u{1F64C} Huge thank you to our incredible academia and industry panelists for sharing their career journeys and insights across AI ethics, software, data, and public policy. \n\nSpecial shoutout to all the amazing clubs that collaborated with us for making this event possible! \u{1F973}\n\nWe hope everyone left feeling inspired about the future of responsible tech! \u{1F680}\n\n#sjsu #rcc #responsiblecomputing #panel #technology",
      takenAt: "2026-11-17T06:09:58.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "Df04-_wNyV7",
      url: "https://www.instagram.com/p/Df04-_wNyV7/",
      caption: "Vibecoding 101 is here \u{1F4BB}\u2728\n\nJoin us for the next workshop in our Agentic AI Series and learn how to turn ideas into working projects by guiding AI coding agents with natural language.\n\nWe\u2019ll cover how to:\n\u{1F916} Work with AI coding agents\n\u{1F6E0}\uFE0F Build real projects from prompts\n\u{1F9ED} Steer agents from idea \u2192 working app\n\u26A1 Get more comfortable with agentic development workflows\n\n\u{1F4C5} Wednesday, November 18\n\u{1F550} 1 PM\n\u{1F4CD} MQH 227\n\n\u{1F512} ACM members only\n\nCome build with us and see what vibe coding actually looks like in practice.\n\n#ACMSJSU #SJSU #VibeCoding #AgenticAI #AIWorkshop",
      takenAt: "2026-11-17T02:47:59.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "Df030WzMNd8",
      url: "https://www.instagram.com/p/Df030WzMNd8/",
      caption: "Fall into giving back to our community! \u{1F341}\n\nJoin us at Jeffrey Fontana Park for our fall planting community service event! Volunteers will work alongside local residents to plant 100+ native plants and trees, help beautify our community and create a greener space for everyone to enjoy. \u{1F333}\u{1F49A}\n\nWater and snacks will be provided. So, let\u2019s RSVP at the link in our bio! \u{1F517}",
      takenAt: "2026-11-17T02:36:25.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "Df0jCoQCdjd",
      url: "https://www.instagram.com/p/Df0jCoQCdjd/",
      caption: "Celebrate international education and cultural exchange! Stop by our booth tomorrow Nov 17th from 10:30am - 1:30pm to play world trivia, learn about opportunities to explore language and culture both at home and abroad, and enjoy a sweet international treat! #globalspartans #IEW2026",
      takenAt: "2026-11-16T23:34:37.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "Df0fHM8TAKm",
      url: "https://www.instagram.com/p/Df0fHM8TAKm/",
      caption: "We\u2019re cooking up some exciting IDEAS for y\u2019all \u{1F440}\u{1F525}\n\nStay tuned for the reveal this Wednesday. Any guesses? Drop them in the comments! \u2B07\uFE0F\n\n#sjsu #ideasclub #entrepreneurship #studentfounder #startup",
      takenAt: "2026-11-16T23:00:08.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "Df0F8L7zXxP",
      url: "https://www.instagram.com/p/Df0F8L7zXxP/",
      caption: "Don\u2019t miss your chance to hear from professionals at @google, @meta, and @rokuplayer right here on campus. We\u2019re thrilled to welcome Kevin Shim, Maksym Omelchenko, Tatyana Gurkivska, and Efe Ekren to SJSU PMA!\xA0 \n\nFeel free to spread the word! \n\n\u{1F4CD} HGH 118\n\u{1F555} 6:00 PM\n\u{1F5D3} Tuesday, Nov 17\n\nSEE YOU THERE \u{1F440}\u{1F440}",
      takenAt: "2026-11-16T23:00:03.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "Df0brWAFz3T",
      url: "https://www.instagram.com/p/Df0brWAFz3T/",
      caption: "Lurie Alumni in Action: Meet Nancy Barajas! \u{1F393}\n\nAfter earning a BA in Child and Adolescent Development in 2024 and a MAT in Teacher Education in 2026, Nancy is beginning her teaching career as a TK teacher with Palo Alto Unified School District.\n\nNancy shared that SJSU helped make her dream of becoming a teacher a reality while providing the support and community she needed to take her next step.\n\nWe\u2019re proud to celebrate Nancy as she creates meaningful learning experiences for young students and puts her Lurie College education into action. \u{1F499}\u{1F49B}\n\n#LurieCollege #SJSULurie #LCOE #SJSU #LCOEAlumni #SpartanPride #WeAreLurieCollege #SJSUAlumni #LurieCollegeAlumni #AlumniUpdates",
      takenAt: "2026-11-16T22:30:24.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DfyoznGhzR8",
      url: "https://www.instagram.com/p/DfyoznGhzR8/",
      caption: "IDEAS Lab is going into SVIC mode for the day! \u{1F601}\n\nApplied to the Silicon Valley Innovation Challenge? Give your IDEAS a practice run before the big day!\n\nJoin us for the SVIC Pitch Workshop to practice your 90-second pitch, get feedback from mentors, and sharpen your presentation skills.\n\n\u{1F4C5} Monday, November 23\n\u23F0 4\u20135 PM\n\u{1F4CD} IDEAS Lab, Student Union\n\nScan the QR code on the flyer to register. All welcomes but priority goes to SVIC participants. \n\n#SJSU #ideassjsu #svic #Entrepreneurship",
      takenAt: "2026-11-16T19:10:04.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "Df0C-rUvD0j",
      url: "https://www.instagram.com/p/Df0C-rUvD0j/",
      caption: "Interested in exploring careers in finance? Join FMA for our FINRA Professional Development event! \n\nHear from senior directors at FINRA, LaTricia Henderson and Patricia Monterosso, as they discuss how FINRA protects investors, maintains market integrity, and share insights into internships and entry level career opportunities in finance. Don\u2019t miss this opportunity to learn, connect, and explore your future in finance!\n\n**RSVP through the link in our bio!** #fma #finance #careerdevelopment #finra",
      takenAt: "2026-11-16T18:55:48.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "Df0Cjp2mifQ",
      url: "https://www.instagram.com/p/Df0Cjp2mifQ/",
      caption: "Happy National Recycling Day, Spartans! \u{1F30E}\u267B\uFE0F \n\nA greener campus starts with small habits, and the 3 R\u2019s are a great place to begin. \n\nSwipe for a quick refresher, then share your best recycling tip below. We\u2019d love to learn from you! \u{1F49B}\u{1F499}\n\n#sjsu #sustainability #greencampus #nationalrecyclingday",
      takenAt: "2026-11-16T18:50:46.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfybP7cOBpS",
      url: "https://www.instagram.com/p/DfybP7cOBpS/",
      caption: "Come to our MAde to create: marketing workshop!\u{1F4A1}\n\nOur very first marketing workshop will dive into different aspects of marketing. We will apply those skills into a Teaspoon-collab activity, where we discover what it takes to create a successful marketing strategy! Plus, there will be a Teaspoon gift basket for the team that wins the best marketing campaign! \u{1F5C2}\uFE0F\u{1F4DA}\n\nLet\u2019s think creatively, work strategically, and market boldly. RSVP at the link in our bio! \u270D\uFE0F",
      takenAt: "2026-11-16T03:48:23.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DfyEHVBmKmv",
      url: "https://www.instagram.com/p/DfyEHVBmKmv/",
      caption: "\u{1F6A8} This workshop is OPEN TO ALL! \n\nExplore the many career paths available to MIS students at our Career Connections Roundtable! \u{1F4BC}\n\nFrom Supply Chain and Finance to GTM Engineering and Implementation Consulting, members will have the opportunity to rotate through interactive stations, participate in hands-on activities, and learn more about the skills and responsibilities involved in each field.\n\n\u{1F4C5} Thursday, November 19\u2028\u23F0 6:00 \u2013 7:30 PM\u2028\u{1F4CD} HGH 118\n\nConnect with industry professionals, ask questions, and gain valuable insights into how your MIS skills can translate into different careers and industries! \u{1F91D}",
      takenAt: "2026-11-16T00:25:54.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfxaRyLv7_z",
      url: "https://www.instagram.com/p/DfxaRyLv7_z/",
      caption: "Super Savings Sunday \u{1F3A1} \n\nSJSU students and others can ride FREE at Winter Wonderland San Jos\xE9 on December 3 from 6\u201310 PM. \n\nTake a break from finals week and bring a friend for a well-deserved BLAST! \n\nCheck the event details before going, as dates and availability may change.#sjsu #college #savings #winter #fma fyp",
      takenAt: "2026-11-15T18:20:21.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "Dfv2dvnBhMr",
      url: "https://www.instagram.com/p/Dfv2dvnBhMr/",
      caption: "And that\u2019s a wrap on our last social from the events committee! \u{1F3AC}\n\nOur members took on four rounds of exciting mini-games, battled it out for bragging rights, and competed for the candy-cash prize! We hope everyone enjoyed their time playing.\u{1F4B0}\n\nStay tuned for a couple of future events before the semester ends! \u{1F440}",
      takenAt: "2026-11-15T03:48:58.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfvlPN0JDjy",
      url: "https://www.instagram.com/p/DfvlPN0JDjy/",
      caption: "Join us as we celebrate the end of our Buddy Program! We hope everyone made fun memories, built meaningful friendships, and enjoyed connecting with their buddy groups.\n\nWe\u2019ll also announce the Buddy Program winners, award prizes, and play Jeopardy against other buddy groups! \u{1F3C6}\u{1F389}\n\n\u{1F5D3}\uFE0FThursday, October 18 \n\u23F06:00 to 7:15 PM\n\u{1F4CD}SU Meeting Room 4B\n\u{1F4CB}Register link in bio \n\nNote: You must be a paid SHRM member to attend or pay a fee of $5 at the door if you are a non-member!\n#shrmatsjsu #sjsu #shrm #sjsubusiness",
      takenAt: "2026-11-15T01:17:42.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DftS4t0G5Jl",
      url: "https://www.instagram.com/p/DftS4t0G5Jl/",
      caption: "@hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu @sjsu.ha",
      takenAt: "2026-11-14T03:58:46.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DftMY8zx1dz",
      url: "https://www.instagram.com/p/DftMY8zx1dz/",
      caption: "Ending the semester with AIB! \u{1F49C}\u2728\nJoin us for our end-of-year social as we celebrate a great semester, connect with fellow students, and enjoy some food and snacks! \u{1F389}\n\u{1F4C5} November 17\n\u23F0 6:00 PM \u2013 7:00 PM\n\u{1F4CD} DMH 356\n\u{1F374} Food & snacks provided!\nRSVP through the link in our bio.\n#AIinBusiness #SJSU #AIBSocial #SpartanLife",
      takenAt: "2026-11-14T03:02:51.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "Dfs-zShlMqd",
      url: "https://www.instagram.com/p/Dfs-zShlMqd/",
      caption: "The MISA Dare Board is back\u2026 \u{1F440}\u{1F3AF}\n\nFrom getting egged to taking a shot of hot sauce, you never know what dare you\u2019ll land on! Come test your luck, take on a challenge, and make some unforgettable memories with us \u{1F929}\n\n\u{1F4CD} 7th Street\n\u{1F5D3} Thursday 11/19 & Tuesday 12/1\n\u23F0 10:00 AM \u2013 3:00 PM\n\nPull up, bring your friends, and see what dare you land on \u{1F440}\u{1F3AF}",
      takenAt: "2026-11-14T01:03:16.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "Dfs8QRTl1nH",
      url: "https://www.instagram.com/p/Dfs8QRTl1nH/",
      caption: "The countdown to commencement is on! \n\nClass of 2026, let\u2019s decorate your graduation cap! \u{1F393}\u{1F3A8}\n\nAdd your own personality to your graduation cap at our upcoming Grad Cap Decorating event. Bring your cap and spend time creating a design that celebrates the people, experiences, and accomplishments that helped bring you to this moment.\n\n\u{1F5D3} Thursday, December 3\n\u23F0 10:00 am to 12:00 pm & 1:00 to 3:30 pm\n\nReserve your spot by scanning the QR code on the flyer, checking out the link in bio, or visiting: forms.gle/WZXFJYH5AQ9BXZS67\n\nWe look forward to supporting your creativity as you prepare to celebrate this upcoming milestone!\n\nWe\u2019ll see you there, Spartans! \u{1F499}\u{1F49B}\n\n#SJSULurie #LurieCollege #SJSU #Classof2026 #GradCapDecorating #SJSUGraduation #SpartanStrong",
      takenAt: "2026-11-14T00:41:08.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfsywOmJq1I",
      url: "https://www.instagram.com/p/DfsywOmJq1I/",
      caption: "\u{1F9CB} GONG CHA FUNDRAISER WITH SHRM @ SJSU \u{1F9CB}\n\nJoin us for a fun Gong Cha fundraiser with SHRMily! \u{1F499} Stop by, grab a delicious drink, and help support our student chapter!\n\nCome mingle with fellow SHRM members, enjoy some fun activities, and treat yourself to some boba! The fundraiser will be running all day, so stop by anytime! Bring your friends and come hang out\u{1F499} \u{1F9CB} We hope to see you there!\n\n\u{1F4C5} November 17\n\u23F0 Activities: 6:00 to 7:15 PM\n\u{1F4CD} 1087 Meridian Ave #10, San Jose, CA 95125\n\u{1F4CB} Register link in bio\n\n#SHRMSJSU #GongChaFundraiser #SHRMily #SJSU",
      takenAt: "2026-11-13T23:18:05.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "Dfs3ojpTUyb",
      url: "https://www.instagram.com/p/Dfs3ojpTUyb/",
      caption: "Consider this your sign to take a study break \u{1F440}\u{1F3B3}\n\nWe\u2019re bringing the big ideas and questionable bowling skills. Come hang with IDEAS for free bowling, free snacks, and a little friendly competition!\n\n\u{1F4C5} November 17 \u2022 4\u20136 PM\n\u{1F4CD} Student Union Bowling Alley\n\nScan the QR code in the reel to claim your spot before they\u2019re gone!\n\n#ideassjsu #sjsu #enterprenuership",
      takenAt: "2026-11-13T22:44:19.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfsjLKlhu8t",
      url: "https://www.instagram.com/p/DfsjLKlhu8t/",
      caption: "Thank you to everyone who joined us for our Sales Info Session with SanDisk! \u{1F499}\n\nOur members had the opportunity to learn more about SanDisk, explore careers in sales, and hear from professionals about their career journeys and experiences in the Commercial Sales team. We also gained valuable insight into internship and new graduate opportunities, the skills needed to succeed in tech sales, and how to navigate early career opportunities.\n\nA special thank you to the SanDisk representatives for sharing your time and advice with us! \u{1F49D}",
      takenAt: "2026-11-13T21:01:54.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DfscmQeTtkK",
      url: "https://www.instagram.com/p/DfscmQeTtkK/",
      caption: "DON\u2019T MISS OUR GUEST SPEAKER EVENT ON TUESDAY! We\u2019ll have speakers from Roku, Google, and Meta \u{1F440}\n\u23F0 Tuesday, November 17\n\u{1F4CD}6-7:30PM @ HGH 118\nSee you there! \n#sjsu #bayarea",
      takenAt: "2026-11-13T20:04:52.000Z"
    },
    {
      handle: "sjsu_careercenter",
      host: "SJSU Career Center",
      shortcode: "Dfscc5Ck8o3",
      url: "https://www.instagram.com/p/Dfscc5Ck8o3/",
      caption: "\u{1F341} Apply to @sjsu on-campus positions on Handshake! Spring semester jobs will begin to open soon so be on the lookout \u{1F440}\n\nDon\u2019t forget to stop by the Career Center to get assistance with your career needs!\n\u{1F4CD}Clark Hall Room 140\n\u{1F5D3}\uFE0F Monday - Friday\n\u23F0 9:00 AM - 4:30 PM\n \n#SanJoseStateUniversity #StudentJobs #SJSU #SJSUCareerCenter #OnCampusJob",
      takenAt: "2026-11-13T20:03:07.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfscSIrz0LC",
      url: "https://www.instagram.com/p/DfscSIrz0LC/",
      caption: "Curious about the intersection of business and technology?\u{1F4A1}\n\nJoin us for MAjor Possibilities! Connect with industry professionals, explore different tech careers, and discover how business and technology come together to solve real-world problems. Through an engaging panel, small-group conversations, and a guided career challenge, you\u2019ll have the chance to ask questions, gain insights, and explore exciting career paths. This event is open to all MAjors! \u{1F31F}\n\nRSVP at the link in the bio, we can\u2019t wait to see you! \u{1F4BB}\u{1F91D}",
      takenAt: "2026-11-13T20:01:41.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfsayRGTkGU",
      url: "https://www.instagram.com/p/DfsayRGTkGU/",
      caption: "We\u2019re kicking our feet and giggling for you to come to Peer Connections to study for finals! Pick up the phone and book an appointment today through Spartan Connect! \u{1F933}\n\n#sjsu #peerconnections #funny",
      takenAt: "2026-11-13T19:49:56.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DfsaayAz27A",
      url: "https://www.instagram.com/p/DfsaayAz27A/",
      caption: "Think you could beat our model? \u{1F440} Ours hit 1st\u2026 then it overfit \u{1F480}\nYour turn. Join NSDC's Kaggle Competition: one dataset, one challenge, one night. Team up or go solo, build a model, and finish #1 to win a prize \u{1F3C6} Beginners welcome, and Olipop will be there too \u{1F964}\n\u{1F4C5} Tue, Nov 17 | 6\u20137 pm\u2028\u{1F4CD} DMH 227\u2028\u{1F4BB} Bring your laptop\nRegister at the link in bio \u{1F517}\n#NSDC #SJSU #Kaggle #datascience",
      takenAt: "2026-11-13T19:46:30.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfsPLwMEwgQ",
      url: "https://www.instagram.com/p/DfsPLwMEwgQ/",
      caption: "NVDA\u2019s CEO Jensen Huang has resigned, sending the stock and broader market lower. A single headline can create major volatility, especially when your portfolio is heavily concentrated in one company or sector. That\u2019s why diversification, risk management, and avoiding emotional decisions are essential to long-term investing. #investing #stocks #nvidia #fyp #FMA",
      takenAt: "2026-11-13T18:07:10.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DfrBNj5uA18",
      url: "https://www.instagram.com/p/DfrBNj5uA18/",
      caption: "Big ideas. Good company. A few gutter balls. \n\nJoin IDEAS for FREE bowling, FREE snacks, and a chance to meet founders, share startup ideas, and make new friends! Whether you\u2019re building something, dreaming something up, or just looking to make new friends, come roll with us. \u{1F642}\n\n\u{1F4C5} Tuesday, November 17\n\u23F0 4\u20136 PM\n\u{1F4CD} Student Union Bowling Alley\n\nLimited spots!! scan the QR code to sign up!\n\n#ideassjsu #sjsu #enterprenuership",
      takenAt: "2026-11-13T18:00:03.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "Dfr0TFesh13",
      url: "https://www.instagram.com/p/Dfr0TFesh13/",
      caption: "Not us casually walking into the event of the season\u2026 \u{1F440}\n\nYeahhhh, we\u2019re staying. \u{1F389}\n\nAdobe Student Academy \nNov 16th - 17th \n10am - 1pm \n\n#sjsu #reel #funny #event #adobe",
      takenAt: "2026-11-13T14:17:56.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfrQdjum_86",
      url: "https://www.instagram.com/p/DfrQdjum_86/",
      caption: "SWEENEY TODD.  Final Dress. @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu",
      takenAt: "2026-11-13T08:59:06.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfrBwKyG1BH",
      url: "https://www.instagram.com/p/DfrBwKyG1BH/",
      caption: "A look back at our Western Digital Pro-Dev event! \u{1F499}\u2728\nOur members gained valuable insights into Western Digital\u2019s technology, AI, internships, and career opportunities while learning tips for navigating the tech industry! \u{1F4BB}\nA huge thank you to Western Digital for sharing their knowledge and to everyone who joined us! \n#WesternDigital #ProfessionalDevelopment #FMA #Networking",
      takenAt: "2026-11-13T06:50:34.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "Dfp3sjWEjLO",
      url: "https://www.instagram.com/p/Dfp3sjWEjLO/",
      caption: "We played bingo, decorated our own diyas, and learned all about the Festival of Lights at our latest Global Connections event, DIY Diyas for Diwali! Here's how it turned out.\n\nAlso, don't forget to join the Crafts of Light event, happening today, Nov 12th at SU Ballroom!",
      takenAt: "2026-11-12T20:03:27.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DfojggagdN5",
      url: "https://www.instagram.com/p/DfojggagdN5/",
      caption: "If you\u2019re curious about Product Management, Software Engineering, or Finance, you do not want to miss this. Join us for Beyond the Job Title: Navigating Your Career, featuring speakers from Google, Roku, and more.\xA0 \n\nNo specific major required! Just pull up with your burning questions about internships, recruiting, and what these jobs actually look like day-to-day.\n\n\u{1F4CD}: HGH 118\n\u{1F5D3}\uFE0F: Tuesday, November 17\n\u23F0: 6 PM\xA0 \n\nDrop a \u{1F983} if we\u2019re seeing you there!",
      takenAt: "2026-11-12T20:00:03.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfpzyZfPxk5",
      url: "https://www.instagram.com/p/DfpzyZfPxk5/",
      caption: "While challenging to talk about, today we will connect over the experiences of immigration and discrimination that international students go through and provide healing and compassion through an expressive arts activity that can also help you manage school stress! This is part 3 of a 3 series workshop focusing on international student wellness.",
      takenAt: "2026-11-12T19:29:21.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfpxWjBzNbN",
      url: "https://www.instagram.com/p/DfpxWjBzNbN/",
      caption: "If you\u2019re feeling stressed and you know it, paint tote bags! \u{1F3A8}\u{1F58C}\uFE0F\nCome join us for a relaxing morning of tote bag painting at Peer Connections (all materials provided!)\u{1F9D8}\u200D\u2640\uFE0F We will talk about the importance of self care and small ways we can practice it \u2728\n\n\u{1F4CD} SSC 602\n\u{1F5D3}\uFE0F Monday, November 16th\n\u23F0 10:00 am - 12:00 pm",
      takenAt: "2026-11-12T19:21:56.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DfpyZwcPDH0",
      url: "https://www.instagram.com/p/DfpyZwcPDH0/",
      caption: "Meet our speaker: Manupriya Gupta \u{1F3A4}\n\nFrom Goldman Sachs to Forward Deployed Engineer at Giga. Come hear her journey into AI and bring your questions!\n\n\u{1F4C5} Mon, Nov 16 | 6:30\u20137:30 pm\u2028\u{1F4CD} DMH 355\n\n#NSDC #SJSU #TechTalk #DataScience #AI SJSUEvents",
      takenAt: "2026-11-12T19:17:52.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfpujNShNbv",
      url: "https://www.instagram.com/p/DfpujNShNbv/",
      caption: "Shh\u2026 you don\u2019t wanna miss our events \u{1F92B}\n\nMore events coming, key an eye out \u{1F440}\nWe\u2019re acting, obviously don\u2019t kidnap people\n\nVC: @chubby.duckies \n\n#sjsu #reelsinstagram\u{1F60D} #reel #event #club",
      takenAt: "2026-11-12T18:45:10.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfpldVIRckK",
      url: "https://www.instagram.com/p/DfpldVIRckK/",
      caption: "SWEENEY TODD.  Second Dress. @sjsu_theatre",
      takenAt: "2026-11-12T17:25:22.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfpfVeBz0Ve",
      url: "https://www.instagram.com/p/DfpfVeBz0Ve/",
      caption: "Update News will be LIVE at 2pm today! Tune in on Youtube with the link in our bio to see the latest news on and off campus. \n\n#news #sjsu #updatenews #journalism #live",
      takenAt: "2026-11-12T16:31:05.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfoFWYcMeSo",
      url: "https://www.instagram.com/p/DfoFWYcMeSo/",
      caption: "\u{1F680} NETS x AI/ML CLUB | CISCO TECH TALK \u{1F310}\n\nWe're excited to announce an upcoming Cisco Tech Talkin collaboration with the AI/ML Club at SJSU!\n\nJoin us for an engaging session exploring the latest developments in Artificial Intelligence, Data Centers, and Networking at Cisco.Discover how AI is transforming modern infrastructure, the evolution of data center technologies, and the critical role networking plays in powering the next generation of technology.\n\n\u{1F4A1} What We'll Explore:\n\u{1F539} AI and AI Infrastructure \n\u{1F539} Modern Data Centers and Architecture \n\u{1F539} Networking Technologies and Innovations \n\u{1F539} The Future of AI-Driven Infrastructure \n\n\u{1F4C5} Friday, November 20, 2026 \n\u23F0 2:00PM \u2013 3:30 PM \n\u{1F4CD} ENGR 285/287\n\n\u{1F39F}\uFE0F RSVP NOW! \n\nWhether you're interested in networking, cybersecurity, cloud computing, or AI/ML, this is a great opportunity to expand your knowledge and gain valuable industry insights.\n\nBring your questions and join us for an afternoon of technology and learning!\n\n\u{1F91D} Hosted by NETS x AI/ML Club\n\n#SJSU #NETS #Cisco #AI #MachineLearning #Networking #DataCenters #ArtificialIntelligence #TechTalk #SiliconValley #Spartans #fypage",
      takenAt: "2026-11-12T03:24:19.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DfnyJC_ICZO",
      url: "https://www.instagram.com/p/DfnyJC_ICZO/",
      caption: "Put your strategy and casing skills to the test on Nov 16th and Nov 19th at the SJCG x Spartan Analytics Case Competition!\u{1F4A1}\n\nCrack real-world business problems, build data-backed recommendations, and pitch your solutions to industry leaders.\n\nRegister now at tinyurl.com/novcasecomp.\n\n#sjcg #spartananalytics #consulting #casecompetition #sjsu",
      takenAt: "2026-11-12T00:38:32.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfncJd8hIE4",
      url: "https://www.instagram.com/p/DfncJd8hIE4/",
      caption: "Join Women in Business for a conversational fireside chat with Klety Kochumon from NVIDIA about her career journey! She\u2019ll share the skills and experiences that helped her land internships and a full-time role, what she\u2019s learned about navigating recruiting, and how she built confidence and found mentors along the way. She\u2019ll also talk about what it\u2019s really like to move from college into the professional world.\n\n\u{1F4C5}Date: Tuesday, November 17th\n\u{1F567}Time: 6:00 PM \u2013 7:00 PM\n\u{1F4CD}Location: Dudley Moorhead Hall (DMH) 234\nRSVP with the link in bio!\n\n*This event is first come, first served and for paid members only!\n**There is a $5 entrance fee if you are not a member.",
      takenAt: "2026-11-11T21:24:19.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfnGOD3GHHC",
      url: "https://www.instagram.com/p/DfnGOD3GHHC/",
      caption: "SWEENEY TODD 1st dress rehearsal  Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsu.ha @sjsumusic @sjsu",
      takenAt: "2026-11-11T18:12:39.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "Dfl8dwTvF_S",
      url: "https://www.instagram.com/p/Dfl8dwTvF_S/",
      caption: "Fuel your future with FMA \xD7 Penske! \u{1F4BC}\u26A1\uFE0F Join us for a professional development session with Penske representatives to explore career opportunities in logistics and management, get leadership and professional growth tips, and learn what it\u2019s like to work with a global transportation leader.\n\u{1F4C5} Thursday, November 12\u2028\u23F0 5\u20136 PM\u2028\u{1F4CD} Student Union, Room 4B\nPlus, FREE Red Bulls available! \u{1F64C}\nScan the QR code to RSVP\u2014we\u2019ll see you there! \u{1F499}\n#SJSUFMA #SJSU #Penske #ProfessionalDevelopment #CareerGrowth",
      takenAt: "2026-11-11T07:29:08.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DflvOEeFIVi",
      url: "https://www.instagram.com/p/DflvOEeFIVi/",
      caption: "It\u2019s your time to step up, stand out, and become a leader in MA! \u2B50\uFE0F\n\nOfficer applications are officially OPEN! \u{1F389} This is an opportunity to bring your ideas to life, collaborate with an amazing team, and gain valuable experience while helping shape the future of MA. Check out the available officer roles and find where you can shine! \u{1F499}\n\nApply through the application form linked in our bio. Don\u2019t miss out on this opportunity! \u{1F609}",
      takenAt: "2026-11-11T05:32:26.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DflsAyCs5MC",
      url: "https://www.instagram.com/p/DflsAyCs5MC/",
      caption: "Alumni Talk? That sounds like a good deal to me!\n\n\u{1F5D3}\uFE0FNovember 12th, 2026\n\u23F01:00 PM - 2:30 PM\n\u{1F4CD}SU Meeting Room 4A\n\n#fypreels #alumnitalk #sjsu #reelsinstagram\u{1F60D}#eventplanner",
      takenAt: "2026-11-11T05:07:22.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "Dflg79_MzvI",
      url: "https://www.instagram.com/p/Dflg79_MzvI/",
      caption: `Get ready to elevate your career! \u{1F680} We are thrilled to host representatives from Ernst & Young (EY) for an exclusive "Ask Me Anything" Workshop.
This is your chance to network directly with seasoned CPAs, get tailored feedback on your resume, and ask all your burning questions about the accounting industry, firm culture, and recruiting. Don't miss out on this opportunity to make lasting connections and stand out to recruiters!
\u{1F4C5} Date: November 12, 2026
\u23F0 Time: 5:00 - 6:30pm
\u{1F4CD} Location: SU Rm 2A
\u{1F454} Dress Code: Business Casual
Bring copies of your resume and your best questions. See you there!
#ErnstAndYoung #EY #Accounting #CPA #Networking #LBSA #sjsu #Spartans`,
      takenAt: "2026-11-11T03:27:40.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DflICO6vnu3",
      url: "https://www.instagram.com/p/DflICO6vnu3/",
      caption: "\u{1F30E}\u{1F37D}\uFE0F Elevate your dining etiquette and explore cultures around the world!\n\nJoin us for an International Dining Etiquette event with Dr. Virpi Outila! Learn about dining customs, cultural traditions, and professional etiquette across different countries while gaining valuable insights you can use in everyday and professional settings.\n\n\u{1F4C5} Wednesday, November 18\n\u23F0 6:00\u20137:00 PM\n\u{1F4CD} BBC 121\n\nWe look forward to seeing you there! \u2728\u{1F49A}\u{1F499}\n\n#SJSU #InternationalBusinessAssociation #DiningEtiquette",
      takenAt: "2026-11-10T23:51:19.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DflBxvqvP4f",
      url: "https://www.instagram.com/p/DflBxvqvP4f/",
      caption: "\u{1FAF6} Hola Familia! \u{1FAF6}\n\n\u{1F6A8}We are having a volleyball social with Santa Clara Universities LBSA! \u{1F3D0}\n\nJoin us for an evening of fun with volleyball, delicious food, and connections! If you want to bring snacks or drinks you\u2019re more than welcome! *if weather permits event will be moved to an indoor location*\n\n\u23F0Join us on Friday, November 13th from 5:30-8:30PM! \n\n\u{1F4CD}Location: Villas Volleyball Court. 1260 Campbell Ave, San Jose! \n\n\u{1F64F}Please make sure to RSVP in our bio!",
      takenAt: "2026-11-10T23:01:29.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "Dfk09-SyvT4",
      url: "https://www.instagram.com/p/Dfk09-SyvT4/",
      caption: "Spartans, ready to level up your r\xE9sum\xE9, portfolio, AND grab free lunch? \u{1F355}\u2728\n\u{1F4CD} Where: Elevate Career Hub (Clark Hall 102)\n\u23F0 When:\xA0Monday, November 16, 2026 & Tuesday, November 17, 2026 - 10:00 AM \u2013 1:00 PM\nPerks: Free food & swag provided!\xA0\nThis free program helps you build digital, creative, and career-ready skills using Adobe tools\u2014leaving you with a stronger personal brand and digital badges for your profile. \u{1F3A8}\u{1F525}\nYou will create and build career-ready skills:\n\u{1F4DD} A stronger, refreshed r\xE9sum\xE9\n\u{1F5BC}\uFE0F Eye-catching LinkedIn visuals & personal branding content\n\u{1F4D1} Reusable templates for class, internships & job hunting\n\u{1F4BB} Real, hands-on creation with Adobe Express\u2014not just a demo!\n\u{1F3C5} LinkedIn-ready digital badges for each session attended\nCan\u2019t make the live session? Register anyway to get access to the recordings! \u{1F3A5}\n\u{1F449} Tag a SJSU student who needs to join you, and register now at bit.ly/studentacademyna26\n\n#SJSU #ElevateCareerHub #AdobeStudentAcademy #AdobeExpress #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F \n\nAdobe Student Academy is back November 16\u201317, and we\u2019re hosting an official live Watch Party right here at SJSU! \u{1F680}",
      takenAt: "2026-11-10T21:10:55.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfkxF-Ll1Be",
      url: "https://www.instagram.com/p/DfkxF-Ll1Be/",
      caption: "In observance of Veterans Day on Wednesday, November 11, our offices will be closed. Regular business hours will resume on Thursday, November 12.\n\nLurie College proudly honors the courage and dedication of veterans.\n\n#SJSULurie #LurieCollege #SJSU #OfficeClosed #VeteransDay #RememberAndHonor #HonoringHeroes #ThankYouVeterans",
      takenAt: "2026-11-10T20:29:41.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfkvDBMF3Vt",
      url: "https://www.instagram.com/p/DfkvDBMF3Vt/",
      caption: "We\u2019re celebrating you, Lurie College fall graduates! \u{1F393}\u{1F499}\u{1F49B}\n\nYour hard work, dedication, and achievements deserve to be celebrated. Scan the QR code on the flyer to complete the update form, then stop by Sweeney Hall 101 to pick up a special graduation gift while supplies last.\n\nPick-up dates:\n\u2022 Dec. 1, 3:30\u20135 pm\n\u2022 Dec. 2, 10:30 am\u201312:30 pm\n\u2022 Dec. 3, 3:30\u20135 pm\n\u2022 Dec. 8, 10 am\u201312 pm\n\u2022 Dec. 10, 1\u20133 pm\n\nCongratulations, graduates! We\u2019re so proud of all you\u2019ve accomplished and look forward to celebrating this milestone with you. \u{1F393}\u2728\n\n#SJSULurie #LurieCollege #SJSUGrad #SpartanStrong #ClassOf2026 #FutureTransformativeLeaders  #FallGraduates #SJSUEducation",
      takenAt: "2026-11-10T20:11:48.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "DfkuJhJFZXQ",
      url: "https://www.instagram.com/p/DfkuJhJFZXQ/",
      caption: "Water conservation starts with the small choices we make every day, and it makes much more of a difference than you realize.\n\nWhether you\u2019re a student or an employee, let's use all the methods we can to conserve whenever possible.\n\nLet\u2019s all do our part to protect our water resources and keep every single drop from going to waste!\n\n#sjsu #sustainability #greencampus #waterconservation",
      takenAt: "2026-11-10T20:04:24.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "Dfkk_UivpyK",
      url: "https://www.instagram.com/p/Dfkk_UivpyK/",
      caption: "Hola Familia! \u2600\uFE0F\n\nWe had a great time linking up with the owner of @la_tacita_cafe in San Jose to learn more about her journey and goals as a business owner!\n\nIf you are ever looking for a new place to grab some Fall coffee or food look no further! \u2615\uFE0F \u{1F924} @la_tacita_cafe is open everyday, except Monday, starting at 8am serving a large variety of different coffees, agua fresca, pastries, and breakfast. \nThe cafe is located on 1948 Alum Rock Ave San Jose and the owner Yasmin would love to meet you all! \u{1F917}\n\nThank you @la_tacita_cafe again for a wonderful evening filled with delicious food, amazing drinks, and great hospitality!\n\n#SanJoseEats #Supportlocal #SanJoseCoffee #smallbusinessspotlight #lbsasjsu",
      takenAt: "2026-11-10T18:48:24.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfVWOMrSfh8",
      url: "https://www.instagram.com/p/DfVWOMrSfh8/",
      caption: "Tomorrow, Peer Connections will be CLOSED in observance of Veteran\u2019s Day. We will be back Thursday. See you then! \u{1FAE1}\n\n#sjsu #peerconnections",
      takenAt: "2026-11-10T18:30:04.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfkhysTxFg7",
      url: "https://www.instagram.com/p/DfkhysTxFg7/",
      caption: "SWEENEY TODD.  costume tech. Opens Nov 13 @ashgnar @sjsu_theatre @sjsumusic @sjsu.ha",
      takenAt: "2026-11-10T18:16:57.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfkVwYlGw4s",
      url: "https://www.instagram.com/p/DfkVwYlGw4s/",
      caption: "Hey Fmaers, Graduation Stoles for Fall 2026 graduates are out!!! Make sure to submit our interest form by Saturday November 14th at 11:59 PM!!",
      takenAt: "2026-11-10T16:30:01.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfkQZqFMhk8",
      url: "https://www.instagram.com/p/DfkQZqFMhk8/",
      caption: "\u{1F4BB} NETS x Kai x IBM | CNSM ALUMNI TALK \u{1F680}\n\nEver wondered what happens after graduating from SJSU with a CNSM degree? Join us for an exciting alumni talk featuring two CNSM alumni, Anh (Ray) Hoang Vu and Darren Lin!\n\nHear about their professional journeys, experiences after graduation, career transitions, and lessons learned along the way. This is a great opportunity to gain industry insights, ask questions, and learn from alumni who have been in your shoes!\n\n\u{1F3A4} Featured Speakers:\n\n* Anh (Ray) Hoang Vu\n* Darren Lin\n\n\u{1F4C5} Date: Thursday, November 12, 2026\n\u23F0 Time: 1:00 PM \u2013 2:30 PM\n\u{1F4CD} Location: SJSU Student Union, Meeting Room 4A\n\n\u2728 What to Expect:\n\n* Real-world experiences from CNSM alumni\n* Career advice and professional insights\n* Lessons learned after graduation\n* Networking and Q&A opportunities\n\n\u{1F517} RSVP NOW: Visit our Linktree (link in bio) to register!\n\nDon\u2019t miss this opportunity to connect with fellow Spartans and learn from alumni who have successfully transitioned into the tech industry!\n\nTag a friend who should attend! \u{1F447}\n\n#SJSU #NETS #fypppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F #ibm",
      takenAt: "2026-11-10T15:45:31.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "DfjKJOYtEXI",
      url: "https://www.instagram.com/p/DfjKJOYtEXI/",
      caption: "\u2328\uFE0F ACM KEYBOARD FUNDRAISER - TOMORROW!\n\nLooking for a new keyboard? Stop by our table on 7th Street tomorrow and grab one of our mechanical keyboards while supporting ACM @ SJSU!\n\n\u2728 All keyboards are mechanical\n\u2328\uFE0F 60% compact keyboard:\n$30 members / $40 non-members\n\u2328\uFE0F 96% full-size keyboard:\n$40 members / $50 non-members\n\u{1F5A5}\uFE0F Desk mats: $10\n\u{1F381} FREE desk mat with any keyboard purchase!\n\n\u{1F4C5} Tuesday, November 10\n\u{1F55A} 11 AM-3 PM\n\u{1F4CD} 7th Street\n\nAvailable in different colors, and black or white while supplies last. Come by and support ACM! \u{1F499}\n\n#ACMSJSU #SJSU #MechanicalKeyboard #Keyboard #fundraiser",
      takenAt: "2026-11-10T05:35:36.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DfiU_lBvkhQ",
      url: "https://www.instagram.com/p/DfiU_lBvkhQ/",
      caption: "NSDC \xD7 Hoplite present: Data Science Resume Workshop \u{1F4C4}\u2728\nBring your resume and learn how to make it stand out for data science roles. Leave with a resume that shows what you can actually do.\n\u{1F4C5} Thu, Nov 12 | 6:30\u20137:30 pm\n\u{1F4CD} DMH 226B\n#NSDC #Hoplite #SJSU #DataScience #ResumeTips",
      takenAt: "2026-11-09T21:46:27.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfiP2gGkhy2",
      url: "https://www.instagram.com/p/DfiP2gGkhy2/",
      caption: "ISSS will be closed on Wednesday Nov 11th in observance of Veteran's Day and will reopen on Thursday Nov 12th",
      takenAt: "2026-11-09T21:00:02.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DfiPD7yP15B",
      url: "https://www.instagram.com/p/DfiPD7yP15B/",
      caption: "Join us for the AI & ML Club\u2019s Final Project Showcase! Student teams will present their completed projects through startup-style pitches to a panel of faculty and industry professionals.\n\nCome see how teams transform ideas into technical solutions, learn about their development process, and hear feedback from experienced leaders. After the presentations, attendees will have the opportunity to network with the judges and connect with professionals in the field.\n\n\u{1F4C5} Mon, November 16, 2026\n\u23F0 3:00 PM \u2013 5:00PM\n\u{1F4CD} SU Theater",
      takenAt: "2026-11-09T20:53:45.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DfiCTmoNzv9",
      url: "https://www.instagram.com/p/DfiCTmoNzv9/",
      caption: "Throughout the semester, we've explored the fundamentals of AI and machine learning, building toward generative AI. Join the Academic Team to discuss the research we've been reading! Our interests span computer vision, optimization, AI hallucinations, model architectures, infrastructure, and real-world applications. Whether you're interested in cutting-edge research, curious about how modern AI systems work, or have lingering questions from previous workshops, come discuss, ask questions, and connect with the community!\n\n\u{1F4C5} Fri, November 13 \n\u23F0 12:00 PM \u2013 1:30 PM \n\u{1F4CD} BBC 103",
      takenAt: "2026-11-09T19:02:18.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DfiB88wRvK9",
      url: "https://www.instagram.com/p/DfiB88wRvK9/",
      caption: "\u{1F4BB}\u{1F512} Are you cyber-safe?\n\nRCC and Women in Cybersecurity (WiC) are teaming up for a fun, interactive Cybersecurity Workshop! Whether you\u2019re a cybersecurity expert or completely new to cybersecurity, this workshop is perfect for you! \u{1F49C}\n\nLearn about:\n\u{1F310} Phishing, cookies, and Wi-Fi security\n\u{1F4F0} Recent cybersecurity events and trends\n\u{1F3C6} A mini competition with fun prizes and activities\n\u{1F355} Plus, enjoy food, snacks! \n\n\u{1F4C5}  Wednesday, November 18\n\u23F0  4:00 PM \u2013 5:30 PM\n\u{1F4CD}  In-person at the Digital Humanities Center, MLK Library or via Zoom!\n\n\u{1F517} RSVP link: https://docs.google.com/forms/d/e/1FAIpQLSdYbaS5sh6Y2aBac5ZoQrinxNl-ZluwbaUdc-pTWTN_S3agvw/viewform?usp=header\n\nCome have fun with us while learning how to stay cyber-safe! \u{1F499}\u{1F497}\n\n#rcc #rccevents #sjsu #sjsuevents #cybersecurity",
      takenAt: "2026-11-09T19:00:39.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "Dfh_rjmRcKw",
      url: "https://www.instagram.com/p/Dfh_rjmRcKw/",
      caption: "Fetch.ai: The Future of AI Agents\n\nJoin us to explore Fetch.ai\u2019s platform, learn how it enables AI-powered autonomous solutions, and discover how intelligent agents are shaping the future of artificial intelligence.\n\n\u{1F4C5} Tues, November 10 \n\u23F0 3:00 PM \u2013 4:30 PM \n\u{1F4CD} SU Room 3A\n\n#aiml #sjsu #fetch #futureai #aimlclub",
      takenAt: "2026-11-09T18:39:21.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfghAT1lC9S",
      url: "https://www.instagram.com/p/DfghAT1lC9S/",
      caption: "Did you know that Full-time students ages 16\u201331 can receive up to 10% off Economy fares, extra baggage, free date changes on eligible fares, and bonus miles. Start saving on costs with flight deals! #fma #savings #college #money #student fyp",
      takenAt: "2026-11-09T04:52:01.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfgVkT4Mrl6",
      url: "https://www.instagram.com/p/DfgVkT4Mrl6/",
      caption: "\u{1F6E1}\uFE0F NETS CYBER DEFENSE CHALLENGE! \u{1F4BB}\n\nReady to put your cybersecurity skills to the test?\n\nJoin NETS for an interactive Cyber Defense Challenge! Tackle simulated security incidents, make critical decisions, manage limited resources, and compete with others on a live leaderboard.\n\n\u{1F525} What to Expect:\n- Simulated cybersecurity incidents and security breaches.\n- Strategic decision-making and resource management.\n- Hands-on problem-solving and incident response.\n- Live leaderboard competition!\n\n\u{1F4C5} Date: Monday, November 9, 2026 \n\u23F0 Time: 1:00 PM \u2013 3:00 PM \n\u{1F4CD} Location: IS 117B - Clubroom\n\nWhether you're experienced in cybersecurity or just curious to learn, everyone is welcome!\n\n\u{1F517} RSVP: https://linktr.ee/sjsu.nets\n\nDon't miss out! Bring your friends and put your skills to the test!\n\n#SJSU #NETS #Cybersecurity #CyberDefense #NetworkSecurity #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F",
      takenAt: "2026-11-09T03:12:07.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfgVXxDs18u",
      url: "https://www.instagram.com/p/DfgVXxDs18u/",
      caption: "\u{1F97E} NETS HIKE SOCIAL! \u{1F33F}\n\nReady to take a break from classes and enjoy the outdoors?\n\nJoin NETS for a morning hike at Alum Rock Park! Meet fellow students, make new connections, enjoy the scenery, and spend some time together outside the classroom.\n\n- A fun morning hiking experience.\n- Opportunities to meet and connect with fellow NETS members.\n- Fresh air, beautiful scenery, and great company!\n\n\u{1F4C5} Date: Saturday, November 14, 2026 \n\u23F0 Time: 7:30 AM \n\u{1F4CD} Location: Alum Rock Park - 15350 Penitencia Creek Trail, San Jose, CA 95127\n\n\u{1F392} What to Bring:\n- Comfortable hiking shoes.\n- Water bottle.\n- Comfortable outdoor clothing.\n\n\u{1F517} RSVP:https://linktr.ee/sjsu.nets\n\nBring your friends and join us for a morning of hiking, fresh air, and good company! We hope to see you there!\n\n#SJSU #NETS #HikeSocial #AlumRockPark #SpartanCommunity #SJSUEvents #fypage",
      takenAt: "2026-11-09T03:10:24.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DfgOjZPgxl5",
      url: "https://www.instagram.com/p/DfgOjZPgxl5/",
      caption: "We just got the inside scoop on Product Management \u{1F440}\u{1F680}\n\nReady to take the next step in your PM journey? Follow us and stay tuned for more events, opportunities, and connections! \u2728\n\n#productmanagement #pma #tech #sjsu",
      takenAt: "2026-11-09T02:11:56.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfgGJ1bmPdr",
      url: "https://www.instagram.com/p/DfgGJ1bmPdr/",
      caption: "\u{1F967} OH MY! PIE SHRM!! \u{1F967}\n\nReady to pie your fellow SHRM officer or SHRMittee member? \u{1F440} Join us for our Oh My! Pie SHRM!! Fundraiser and come support out student chapter! \n\u{1F4C5} November 10\n\u23F0 10:00 AM \u2013 3:30 PM\n\u{1F967} $4 per pie\n\u{1F36B} +$1 for toppings \u2014 strawberry syrup & sprinkles!\n\nCome stop by, choose who you want to pie, and support SHRM at SJSU! \u{1F499}\u{1F967}\n\nCheck the schedule on our flyer to see when each officer and SHRMittee member will be available to get pied! \n\nWho are YOU pieing?\n\n#SHRMatSJSU #SHRMily #OhMyPieSHRM #SJSU #Fundraiser",
      takenAt: "2026-11-09T00:57:23.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DffxSfYvt1K",
      url: "https://www.instagram.com/p/DffxSfYvt1K/",
      caption: "!Hola Familia!\u{1F44B}. You know what time it is\u{1F3D6}\uFE0F\u{1FAB5}\u{1F525}, join us for our LBSA Bonfire this Wednesday on Veteran\u2019s day! \n\nNo classes so take the time to come out and have fun with friends, eat some food, and listen to some music \u{1F3B5}. \n\n(This is a potluck style event so please fill out the RSVP form in our bio)\n\nSee you all there! \u{1F30A}",
      takenAt: "2026-11-08T21:55:34.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DffrFuLkj-G",
      url: "https://www.instagram.com/p/DffrFuLkj-G/",
      caption: "Happy Diwali \u{1FA94}",
      takenAt: "2026-11-08T21:00:02.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfeOGqeBmns",
      url: "https://www.instagram.com/p/DfeOGqeBmns/",
      caption: "Join WIB this Monday, November 9th on 7th Street for our H2H Essentials Fundraiser!!\n\nWe will be selling Assorted SisPads. Each pack includes:\n- 2 Overnight Pads\n- 6 Heavy Flow Pads\n- 8 Regular Pads\n- 4 Herbal Liners\n\nEvery pad in this set features H2H Essentials' 3D Leak Protection Guard, engineered to provide reliable day\u2011and\u2011night coverage so you can move freely with peace of mind.\n\nStop by 7th Street on 11/9 to purchase a pack! Support goes to SJSU Women in Business as well as charity \u{1F497}",
      takenAt: "2026-11-08T07:28:25.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "Dfd5Kc6p81l",
      url: "https://www.instagram.com/p/Dfd5Kc6p81l/",
      caption: "\u{1F6A8} CORRECTION: Form closes Sunday, November 15th\n\u{1F393} Graduating this semester? Celebrate your achievement with a SHRM Graduation Stole! \u{1F393}\n\nSHRM Graduation Stoles are available to purchase and wear at commencement! \u{1F499}\u{1F49B} This is a special way to recognize your involvement, celebrate your accomplishments, and represent Human Resource Management as you walk across the stage. \n\n\u{1F4DD} The order form is NOW OPEN!\n\u{1F4C5} Deadline: November 11th, 2026\n\u{1F517} Order through the link in our bio!\n\nPlease note: You do NOT need to be a SHRM at SJSU member to purchase a Human Resource Management (HRM) stole.\n\n#shrmatsjsu #shrm #sjsu",
      takenAt: "2026-11-08T04:26:39.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfdoQ2_BL1q",
      url: "https://www.instagram.com/p/DfdoQ2_BL1q/",
      caption: "Step inside the world of innovation! \u{1F680}\n\nJoin us for an exclusive tour of Walmart\u2019s Respect Building, the corporate innovation and engineering hub! \u{1F3E2}\u{1F527} Explore how technology, engineering, and innovation come together within one of the world\u2019s largest companies. Learn about the work happening behind the scenes and get an inside look at Walmart\u2019s corporate operations.\n\nRSVP at the link in the bio! \u{1F499}",
      takenAt: "2026-11-08T02:02:43.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfdcbfXGGdO",
      url: "https://www.instagram.com/p/DfdcbfXGGdO/",
      caption: "\u{1F4E3} SHRM Officer Applications are NOW OPEN for Spring 2027! \u{1F4BC}\n\nInterested in getting more involved on campus and becoming a leader with SHRM at SJSU? This is your opportunity! \u{1F31F}\n\nApply to join our Spring 2027 Officer Board and:\n\u{1F91D} Gain hands-on leadership experience\n\u{1F331} Develop valuable professional skills\n\u{1F4BC} Grow your network\n\u{1F499} Work alongside an amazing team\n\u2728 Make a lasting impact on our SHRM student chapter!\n\nA detailed description of each available officer position is also linked in our bio, so you can find the role that\u2019s right for you!\n\n\u{1F517} APPLY NOW THROUGH THE LINK IN OUR BIO!\n\n\u{1F4C5} Applications are due Friday, November 13th.\n\nHave questions about the application process or any of our officer positions? Reach out to us at president@shrmatsjsu.org.\n\nWe can\u2019t wait to see what SHRM at SJSU has in store for the next semester!\u{1F499}",
      takenAt: "2026-11-08T00:14:19.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "DfdNGP5POoO",
      url: "https://www.instagram.com/p/DfdNGP5POoO/",
      caption: "Sports Day Recap \u26BD\uFE0F\u{1F3D0}\u{1F94F}\nThank you all for coming!!",
      takenAt: "2026-11-07T22:01:59.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfdLnS7FyIL",
      url: "https://www.instagram.com/p/DfdLnS7FyIL/",
      caption: "Downtown San Jos\xE9 is going car-free, and Lurie College is joining the fun! \u{1F6B2}\u{1F6F4}\u2600\uFE0F\n\nThis Sunday, November 8, Viva Callecita SJ is bringing open streets, activity hubs, and community energy to Downtown San Jos\xE9 and Japantown. Come explore the city, enjoy the festivities, and stop by the Lurie College booth to say hello!\n\n\u{1F4CD} Find us somewhere along E. Santa Clara St. near City Hall\n\u23F0 Look for the Lurie College canopy and table\n\nWant to join us along the route? Meet us at our booth for one of our casual group meetups:\n\n\u23F0 11:15 am for an 11:30 am. departure\n\u23F0 1:30 pm for a 1:45 pm departure\n\nEveryone is welcome! Join us for one meetup, both meetups, the group ride, or simply stop by our table. No RSVP is required, and there\u2019s no pressure to stay with the group for the entire event.\n\nCheck our Instagram Stories for our exact location once we\u2019re set up. We hope to see you out there! \u{1F499}\u{1F49B}\n\n#VivaCallecitaSJ #SJSULurie #LurieCollege #SJSU #OpenStreets #SanJose #VivaCalleSJ",
      takenAt: "2026-11-07T21:47:42.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfbmxZWR7uv",
      url: "https://www.instagram.com/p/DfbmxZWR7uv/",
      caption: "SWEENEY TODD.  Tech. Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu.ha @sjsu",
      takenAt: "2026-11-07T07:07:40.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DfbM8yCop7T",
      url: "https://www.instagram.com/p/DfbM8yCop7T/",
      caption: "A huge thank you to Dakota Yang for leading such an insightful workshop this past Tuesday! We also want to thank all of our analysts for their thoughtful questions, active participation, and engagement. \u{1F4DD}\n\n#sjcg #consulting #sjsu",
      takenAt: "2026-11-07T03:21:01.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DfbGpZbJTF4",
      url: "https://www.instagram.com/p/DfbGpZbJTF4/",
      caption: "Take AI Beyond the Chat Box!\n\nJoin AI in Business for a hands-on workshop exploring how to connect AI to real-world tools using MCP! Learn how it works and build your own MCP server from scratch. No coding experience needed!\n\n\u{1F3A4} Guest Speaker: Divyank Shah, SWE @ Big Tech\n\n\u{1F4C5} Tuesday, November 10th\n\u23F0 6:00\u20137:30 PM\n\u{1F4CD} BBC 004\n\u{1F4BB} Bring your laptop!\n\nOpen to ALL majors!\n\n\u{1F517} RSVP through the link in our bio!\n\n#AIinBusiness #SJSU #ArtificialIntelligence",
      takenAt: "2026-11-07T02:25:46.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DfbFbVtgwI9",
      url: "https://www.instagram.com/p/DfbFbVtgwI9/",
      caption: "Bello! \u{1F34C} PMA Movie Night is back! Come hang out with us, kick back, and watch Minions on the big screen. Popcorn will be provided :)\u{1F37F}\n\n\u{1F5D3}\uFE0F Tuesday, 11/10\n\u23F0 6:00 PM \u2013 7:30 PM\n\u{1F4CD} DMH 227\xA0 \n\nDon\u2019t miss out!",
      takenAt: "2026-11-07T02:15:22.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfbBHhJB83y",
      url: "https://www.instagram.com/p/DfbBHhJB83y/",
      caption: "Thank you to everyone who came to our career night with Pebble Beach Company! \u{1F334}\n\nOur members had the chance to hear from a company representative about Pebble Beach Company culture, hospitality standards, and what it\u2019s like to work at this iconic destination.\nWe also learned about the SEMT and Company Team Leader programs, including opportunities to how to gain experience and grow within the company. A special thanks to the representatives at Pebble Beach for making this event possible! \u{1F49D}",
      takenAt: "2026-11-07T01:37:13.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "Dfa_o6Fgswg",
      url: "https://www.instagram.com/p/Dfa_o6Fgswg/",
      caption: "\u{1F577}\uFE0F Something exciting is swinging your way! \u{1F578}\uFE0F\n\nJoin MISA for our Save Spider-Man Social where you'll team up with fellow members to solve mysterious clues, crack puzzles, and uncover secrets before time runs out! Put your problem-solving skills and teamwork to the test in an action-packed race to save your friendly neighborhood Spider-Man. \u{1F577}\uFE0F\n\n\u{1F4C5} Thursday, November 12\n\u23F0 6:00 \u2013 7:30 PM\n\u{1F4CD} ISB Lawn\n\nRegister through the link in our bio!",
      takenAt: "2026-11-07T01:25:10.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "Dfa5_Hex-vc",
      url: "https://www.instagram.com/p/Dfa5_Hex-vc/",
      caption: "Celebrating Growth, Connections & Accomplishments!\n\nJoin us for SHRM\u2019s Mentorship Program Celebration as we recognize the growth, dedication, and connections made throughout the semester!\n\nYou don\u2019t have to be part of the mentorship program to attend! Everyone is welcome to join us for an evening of networking, refreshments, and celebrating our mentees\u2019 accomplishments.\n\nCertificates of Recognition will be awarded to mentees who have completed at least 3 meetings with their mentors.\n\n\u{1F4C5} Thursday, November 12th\n\u23F0 6:00 \u2013 7:15 PM\n\u{1F4CD} DMH 234\n\u{1F454} Business Casual\n\u{1F517} RSVP through the link in our bio!\n\nNote: This event is FREE for all SHRM members. There is a $5 fee for non-members.\n\n#shrm#shrmsjsu#professional#mentorship",
      takenAt: "2026-11-07T00:36:52.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "Dfa2on1FzrO",
      url: "https://www.instagram.com/p/Dfa2on1FzrO/",
      caption: "We\u2019re excited to spotlight the CLARION Project as it launches its new LinkedIn page. Be sure to follow the new CLARION Project account for updates, resources, and stories focused on helping students thoughtfully engage with civic issues in today\u2019s digital world.\n\nCLARION, which stands for Civic Literacy and Reasoning in Online Networks, brings educators together to explore civic media literacy, inquiry, deliberation, and student action.\n\nEarlier this semester, educators gathered for a Civic Action on Social Media professional development event to learn more about the project\u2019s four mini-units and discuss ways to bring these topics into their classrooms. The session also created space for educators to consider how students can connect what they\u2019re learning with issues that matter to their communities.\n\nWe\u2019re proud to celebrate the educators contributing to this work and helping students become thoughtful, informed participants in civic life. Follow CLARION Project to stay connected with the project:\nhttps://www.linkedin.com/in/clarion-project/\n\n#SJSULurie #LurieCollege #SJSU #CLARIONproject #CivicMediaLiteracy #CivicEducation #EducationInnovation #SocialMediaEducation",
      takenAt: "2026-11-07T00:08:06.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "Dfavbxsvu4C",
      url: "https://www.instagram.com/p/Dfavbxsvu4C/",
      caption: "One degree, many paths. \u{1F4BB}\u2728\n\nA CS background can open the door to all kinds of careers. Join ACM for a panel featuring professionals across customer success, software engineering, and data engineering and hear what their roles actually look like day to day.\n\n\u{1F3A4} Meet our speakers:\nBreanna Chi \u2014 Customer Success Manager\nAditya Nair \u2014 Software Engineer @ AWS\nSajit N. \u2014 Data Engineer @ Itron\n\nExplore different career paths, hear how they built their careers, and discover where your own interests and skills might fit.\n\n\u{1F355} Free pizza!\n\u{1F4C5} TBD\n\u{1F554} TBD\n\u{1F4CD} TBD\n\n\u{1F4F2} RSVP using the QR code on the flyer / link in bio.\n\u2705 All students welcome!\n\n#ACMSJSU #SJSU #CareerPanel #ComputerScience #techcareers",
      takenAt: "2026-11-06T23:04:36.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfalkO6v4xC",
      url: "https://www.instagram.com/p/DfalkO6v4xC/",
      caption: "Market volatility took center stage on Thursday, November 5, as the Nasdaq-100 fell 6.36%, and nearly 7% intraday\u2014its worst single-day performance since the COVID-19 market crash in March 2020. The sell-off highlights retail fear of an AI bubble. Do you believe it is going to pop?\n\n#FMA #Investing #StockMarket #Ai #college",
      takenAt: "2026-11-06T21:36:28.000Z"
    },
    {
      handle: "sjsuenglishdepartment",
      host: "SJSU English Department",
      shortcode: "Dfajt4ugRPS",
      url: "https://www.instagram.com/p/Dfajt4ugRPS/",
      caption: "Join SJSU's First-Year Writing Program for a Digital Literacy Showcase! SJSU's First-Year Writing students create a wide variety of digital texts, including podcasts, websites, and infographics to accompany formal writing assignments. The Digital Literacy Showcase celebrates this work and helps students connect first-year writing to future writing, academic, and professional goals. \n\nEvent Details:\nDate: Thursday, November 19, 2026\nTime: 2- 4 p.m\nLocation: Digital Humanities Center, MLK Library\nFREE and OPEN TO ALL. There will be FREE FOOD!",
      takenAt: "2026-11-06T21:20:16.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "DfafXGaPNkA",
      url: "https://www.instagram.com/p/DfafXGaPNkA/",
      caption: "ACM is going to Tesla! \u{1F697}\u26A1\n\nJoin us for an exclusive tour of the Tesla Fremont Factory and get a firsthand look at the technology, manufacturing, and innovation driving the future of transportation.\n\n\u{1F39F}\uFE0F ACM MEMBERS ONLY\n\u26A1 Only 22 spots - first come, first served\n\n\u{1F4C5} Friday, November 13 \n\u{1F55A} Meet at 11 AM \n\u{1F4CD} Tesla Fremont Factory \n\u23F0 RSVP by November 10\n\n\u{1F517} RSVP through the link in our bio / QR code on the flyer\n\nNot an ACM member yet? Join ACM first through our membership form in bio!\n\n\u{1FAAA} Bring a photo ID \n\u{1F9E5} Bring a jacket \u2014 the factory can get cold \n\u{1F697} We\u2019ll try to coordinate carpools for attendees - stay tuned for transportation details! \n\u{1F4F8} No photos during the tour, but we\u2019ll grab a group photo outside!\n\nSee you at Tesla! \u26A1\n\n#ACMSJSU #SJSU #Tesla #computerscience #CompanyTour",
      takenAt: "2026-11-06T20:50:49.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfaZ7JihwrL",
      url: "https://www.instagram.com/p/DfaZ7JihwrL/",
      caption: "Thank you so much to everyone who came out to our exclusive LinkedIn Tour and Career Panel event! \u{1F680}\n\nIt was an incredible experience stepping behind the scenes of the LinkedIn Headquarters. We kicked off with a guided campus tour, followed by an engaging career panel where professionals across a diverse range of roles shared their personal career journeys and industry insights! Stay tuned for our next company tour. You don't want to miss it! \u{1F498}",
      takenAt: "2026-11-06T19:54:45.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfaKXRrxleo",
      url: "https://www.instagram.com/p/DfaKXRrxleo/",
      caption: "SWEENEY TODD.  Spacing rehearsal. Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu.ha @sjsu",
      takenAt: "2026-11-06T17:39:46.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfZJL53RD2P",
      url: "https://www.instagram.com/p/DfZJL53RD2P/",
      caption: "SWEENEY TODD.  CRT. \u201CThe Crew\u201D. Opens Nov 13.  @hammertheatrecenter @sjsumusic @sjsu_theatre @sjsu.ha @sjsu",
      takenAt: "2026-11-06T08:11:49.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DfYvvkoIsZp",
      url: "https://www.instagram.com/p/DfYvvkoIsZp/",
      caption: "Stuck on LeetCode? \u{1F9E0}\n\nJoin NSDC for a LeetCode Workshop and learn how to break problems down, spot the pattern and talk through your solution.\n\n\u{1F4C5} Mon, Nov 9 | 6\u20137 pm\u2028\u{1F4CD} DMH 227\u2028\u{1F4BB} Bring your laptop\n\n#NSDC #SJSU #LeetCode #CodingInterview #SJSUEvents",
      takenAt: "2026-11-06T04:28:17.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DfYkyReG7XU",
      url: "https://www.instagram.com/p/DfYkyReG7XU/",
      caption: "AIB OFFICER APPLICATIONS ARE NOW OPEN!\n\nReady to take your leadership skills to the next level? AI in Business at SJSU is looking for motivated students to join our executive board!\n\nWhether you\u2019re interested in marketing, finance, research, AI development, operations, or industry relations, there\u2019s a place for you on our team! \n\nSwipe through to explore our open positions and find the role that fits you best. Applications due NOVEMBER 12 at 11:59 PM!!\n\n\u{1F4CC} Apply now through the following link: https://forms.gle/r2DRBpputhk5H41s7 \n\n#AIinBusiness #SJSU #AIB",
      takenAt: "2026-11-06T02:51:07.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfYHGsGv2jO",
      url: "https://www.instagram.com/p/DfYHGsGv2jO/",
      caption: "Learn how Diwali, or the Festival of Lights, is celebrated in India and create your own clay diya to take home! You can also color and create your own mandala and contribute to the community rangoli!",
      takenAt: "2026-11-05T22:31:49.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "DfYFTsbBhxW",
      url: "https://www.instagram.com/p/DfYFTsbBhxW/",
      caption: "Get ready!\u2728 Registration for Health TechQuity 2027 will be going live next week!\u{1F62E}\u{1F499}\n\n#SJSUHealthTechQuity #sjsu #sanjose #CHHS",
      takenAt: "2026-11-05T22:16:07.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfXwfkhv3s2",
      url: "https://www.instagram.com/p/DfXwfkhv3s2/",
      caption: "Repeat with us: being yourself is \u{1F192}! \nBut if you\u2019re not convinced, come learn essential interpersonal skills that can help build meaningful personal and professional connections \u{1FAC2}\u2728\nThis workshop will cover communication, relationship-building, and networking strategies to support your success in college and beyond! \u{1F64C}\n\n\u{1F4CD} SSC 602\n\u{1F5D3}\uFE0F Thursday, Nov 12th\n\u23F0 11:00 a.m.",
      takenAt: "2026-11-05T19:30:28.000Z"
    },
    {
      handle: "sjsu_careercenter",
      host: "SJSU Career Center",
      shortcode: "DfXj3ijBVlL",
      url: "https://www.instagram.com/p/DfXj3ijBVlL/",
      caption: "Start Your Career with Enterprise Mobility! \n\nHiring for South Bay, Fremont and Santa Cruz!\n\n\u{1F4DA} Are you a recent graduate or senior in college looking to jump start your career in management? The Enterprise Mobility Management Trainee Program is designed to develop future leaders through hands-on experience, mentorship, and structured career growth. This is your opportunity to join a global leader known for promoting from within and developing top talent. \u{1F680}\n\n\u{1F4C5}Date: Tuesday November 10, 2026\n\u23F0Time: 10:00 AM \u2013 2:00 PM\n\u{1F4CD}Location: 815 E. El Camino Real Sunnyvale CA 94087\n\n\u27A1\uFE0FTo register, please visit: Enterprise Mobility - South Bay Management Trainee Hiring Event",
      takenAt: "2026-11-05T17:24:05.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfXeEE4v2Jw",
      url: "https://www.instagram.com/p/DfXeEE4v2Jw/",
      caption: "Here are the November dates for our Language Exchange Club! It's a great way to practice a language, connect with others who are interested in language, and learn more about each others' cultures. Hope to see you there!",
      takenAt: "2026-11-05T16:33:12.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DfXZRpYRXQJ",
      url: "https://www.instagram.com/p/DfXZRpYRXQJ/",
      caption: "\u{1F6A8} RSVP by tonight 11/5 @ 11:59 PM! \n\u{1F916}\u{1F3D9}\uFE0F What do you think the future of AI looks like in our local communities?\n\nJoin RCC for the City of San Jos\xE9 AI Panel! Hear directly from City of San Jos\xE9 professionals about how AI is being used in local government, and discuss topics like AI ethics, privacy, and public trust.\n\nInterested in learning how AI is shaping the public sector? This is a great opportunity to gain real-world insights, learn from professionals, and explore upcoming internship opportunities! \u{1F4BB}\u2728\n\n\u{1F4C5}  Tuesday, November 17\n\u23F0  12:00 PM \u2013 2:00 PM\n\u{1F4CD}  City of San Jos\xE9\n\n\u{1F517} RSVP using the link in our bio or scanning the QR code!\n\nWe hope to see you there! \u{1F499}\u{1F49C}\n\n#sjsu #rcc #sanjose #rccevents #sjsuevents",
      takenAt: "2026-11-05T15:52:58.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfWeGoWxCsX",
      url: "https://www.instagram.com/p/DfWeGoWxCsX/",
      caption: "SWEENEY TODD. spacing rehearsal. Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu.ha",
      takenAt: "2026-11-05T07:16:43.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfWc_9uNcHW",
      url: "https://www.instagram.com/p/DfWc_9uNcHW/",
      caption: "A sneak peak of Latin night \u{1FAE3} \n\nMake sure to not miss out tomorrow night\u203C\uFE0F\nBuy your Latin night tickets for $25 on 7th street from 12 pm - 3 pm (tomorrow is the last day)\n- At the door tickets are $35\n\n\u{1F4C5} Thursday, November 5th\n\u{1F4CD} The Loft Bar & Bistro 90 S 2nd St\n\u23F0 Doors open at 9:30pm!\n\nHope to see you all there in your best throwback outfit!",
      takenAt: "2026-11-05T07:05:21.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfWLN43m7zV",
      url: "https://www.instagram.com/p/DfWLN43m7zV/",
      caption: "How do you romanticize a long week? \u2615\uFE0F\n\nBetween endless assignments, club meetings, and busy school days, it\u2019s easy to get caught up in the stress of it all. But what if you made the little moments something to look forward to? Here are a few ways to make even the longest weeks feel a little more stress-relieving! \u{1F4DD}\n\nFind joy in your everyday routine and romanticize the little moments! \u{1FAF6}\u{1F3FB}",
      takenAt: "2026-11-05T04:29:13.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfV6sz2sZhh",
      url: "https://www.instagram.com/p/DfV6sz2sZhh/",
      caption: "\u{1F3ED}\u{1F916} EXCLUSIVE INTUITIVE HEADQUARTERS TOUR!\n\nNETS is excited to bring students an opportunity to visit Intuitive\u2019s headquarters in Sunnyvale! \u{1F680}\n\nCome explore the workplace, learn more about Intuitive\u2019s operations and technology, and connect with industry professionals.\n\n\u{1F4C5} Friday, November 13, 2026\n\u{1F4CD} Intuitive HQ \u2014 Sunnyvale, CA\n\u23F0 11:30 AM \u2013 2:30 PM\n\n\u{1F4B5} $10 REFUNDABLE SAFETY DEPOSIT\n\nAlready paid a deposit for a previous NETS event? \u267B\uFE0F It rolls over! You do not need to pay again, and you\u2019ll receive your deposit back after this event.\n\n\u{1F4B8} Venmo: @Rishik-Dammannagari\n\u{1F4E7} Send payment confirmation to: nets.sjsu@gmail.com\n\nCash payments can also be made at the NETS club room to Rishik, Quang, or Yipeng.\n\n\u26A0\uFE0F SPOTS ARE LIMITED!\n\nRegistration does not guarantee participation. Selected students will receive a confirmation email by November 8.\n\n\u{1F517} Register ASAP and secure your chance to attend!\n\n#SJSU #NETS #Intuitive #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F #techtour",
      takenAt: "2026-11-05T02:05:39.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DfV6Zr4hzdz",
      url: "https://www.instagram.com/p/DfV6Zr4hzdz/",
      caption: "\u{1F6A8} The countdown is on! SVIC applications close Sunday, November 8!\n\nHave an innovative business idea you've been wanting to bring to life? This is your chance to take the next step!\n\nThe Silicon Valley Innovation Challenge (SVIC) gives SJSU students the opportunity to pitch their ideas to a panel of judges, receive valuable feedback and mentorship, gain exposure for their ventures, and compete for cash prizes! \u{1F3C6}\n\nDon't miss out on the opportunity to turn your idea into something bigger!\n\n\u{1F4C5} Application Deadline: Sunday November 8, 2026\n\n\u{1F4CD} Final Challenge: December 3, 2026 | Student Union Ballroom\n\nApply now and take the first step toward bringing your idea to life!\n\n\u{1F517} Learn more: https://www.sjsu.edu/svic/index.php\n\n#SJSU #SVIC #Entrepreneurship #Innovation #StudentEntrepreneurs #Startups #SiliconValley",
      takenAt: "2026-11-05T02:02:20.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DfVw4n9IgUf",
      url: "https://www.instagram.com/p/DfVw4n9IgUf/",
      caption: "Think you can climb the leaderboard? \u{1F4C8}\n\nJoin us for the NSDC Kaggle Competition: one dataset, one challenge, one night. Team up, build a model, and finish #1 to win a special prize \u{1F3C6} Beginners welcome!\n\n\u{1F4C5} Tue, Nov 17 | 6\u20137 pm\u2028\u{1F4CD} DMH 227\n\n#NSDC #SJSU #Kaggle #DataScience MachineLearning SJSUEvents",
      takenAt: "2026-11-05T00:43:09.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfVr9UYvL8h",
      url: "https://www.instagram.com/p/DfVr9UYvL8h/",
      caption: "Join Women in Business for an exciting Sales Info Session with SanDisk! This event will help you gain insights about SanDisk, how to succeed in a sales career within the technology industry, and internship opportunities with focus on the Commercial Sales team. \n\nWhether you\u2019re interested in sales, business development, or simply exploring career paths in the technology industry, this session is a great opportunity to learn, network, and discover potential career opportunities! \u{1F4BC}\n\n \u{1F5D3}\uFE0F Tuesday, November 10\n \u23F0 6:00\u20137:00 PM\n \u{1F4CD} Student Union, Room 2A\n\n\u{1F31F}Thanks to a collaboration with Good Molecules, each paid member who RSVP\u2019s will also receive a Good Molecules Bundle + Samples! \u{1F31F}\n\nBundles include full-size products with:\n\u{1F9D6}\u200D\u2640\uFE0FDiscoloration Correcting Serum \n\u{1F9D6}\u200D\u2640\uFE0FLightweight Daily Moisturizer \n\u{1F9D6}\u200D\u2640\uFE0FHydrating Facial Cleansing Gel\n\u{1F9D6}\u200D\u2640\uFE0FPimple Patches\n\u{1F9D6}\u200D\u2640\uFE0FEye Cream\n\nMake sure to RSVP using the link in our bio to get your free Good Molecules Bundle and more!\n\n \u{1F496} We\u2019ll also be handing out free WIB merch! \u{1F496}",
      takenAt: "2026-11-04T23:59:03.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfVqcfbPf27",
      url: "https://www.instagram.com/p/DfVqcfbPf27/",
      caption: "Hola Familia!\n\nMake sure to attend our Gallo workshop tomorrow 11/5 from 5 to 6:30 PM! It will be in Dudley Morehead Rm#348. Don\u2019t miss out on a great opportunity to land an internship or possible full-time job. Hope to see you there!\u{1F377}\u{1F942}\n\n*This event will require business casual attire*\n\n#lbsasjsu #sjsu #galo #internships",
      takenAt: "2026-11-04T23:52:03.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfVkciaDxKT",
      url: "https://www.instagram.com/p/DfVkciaDxKT/",
      caption: "FMA and IMA had an amazing opportunity to learn from guest speakers at Gallo! From mastering interview skills and crafting elevator pitches to exploring career opportunities, we gained valuable insights to help prepare us for our professional futures.\nA huge thank you to Gallo for sharing their experiences and advice! \u{1F499}\n#FMA #Gallo #CareerDevelopment #Networking #ProfessionalGrowth",
      takenAt: "2026-11-04T22:50:26.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfVgZi5hNDn",
      url: "https://www.instagram.com/p/DfVgZi5hNDn/",
      caption: "Last week, SHRM had a spooktacular time at our Fright Night Halloween Social! \u{1F383}\u{1F47B} Thank you to everyone who joined us, dressed up, and made the event so much fun. We hope to see you soon!\u{1F499}",
      takenAt: "2026-11-04T22:16:04.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "DfVYPncKcfu",
      url: "https://www.instagram.com/p/DfVYPncKcfu/",
      caption: "\u{1D407}\u{1D41E}\u{1D425}\u{1D425}\u{1D428} \u{1D405}\u{1D40F}\u{1D412}!\n\n\u2500\u2500\u2500\u2500\u2500\u2500 \u22C6\u22C5\u2606\u22C5\u22C6 \u2500\u2500\u2500\u2500\u2500\u2500\nHope everyone had fun watching their projects on the big screen and enjoyed a bite to eat last week! \n\nThis week, we have a set-building activity for y'all! Set building is used commonly in theatre and full scale productions so that they can easily control factors when storytelling across the stage, or during scenes in movies. \n\nWe'll work with flats, clamps, sandbags, and more! So come join us tomorrow at \u{1D407}\u{1D406}\u{1D407} 114 \u{1D422}\u{1D427} \u{1D42D}\u{1D421}\u{1D41E} \u{1D413}\u{1D415} \u{1D412}\u{1D42D}\u{1D42E}\u{1D41D}\u{1D422}\u{1D428} \u{1D41A}\u{1D42D} 6 \u{1D40F}\u{1D40C}, and learn how to build set, stabilize, and breakdown safely.\n\nAll are welcome to join; major does not matter!\n\n\u2757\u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FF}\u{1D5F2}: HGH 114\n\u2757\u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FB}: Thursday, November 5th, 6:00 PM\n\u2757\u{1D5D5}\u{1D5FF}\u{1D5F6}\u{1D5FB}\u{1D5F4}: Yourself & Friends, closed toed shoes for safety \n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
      takenAt: "2026-11-04T21:03:55.000Z"
    },
    {
      handle: "undocuspartans",
      host: "UndocuSpartan Resource Center",
      shortcode: "DfVXSEEyi83",
      url: "https://www.instagram.com/p/DfVXSEEyi83/",
      caption: "Thank you to everyone who was able to make it out to our zine workshop last week in solidarity with I Stand with Immigrants Day of Action\u{1F973}\u{1FAF6}\n\nHere is a small recap of what we did and what we talked about at the event\u{1F92D}\u2728",
      takenAt: "2026-11-04T20:55:56.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DfVWctPyTqa",
      url: "https://www.instagram.com/p/DfVWctPyTqa/",
      caption: "Big thanks to everyone who came out to Imposters After Dark! \u{1F440}\u{1F3AD} Your energy, suspicions, and unexpected plot twists made it a night to remember \u{1F602}\u2728 Hope you had as much fun as we did, and we\u2019ll see you at the next one!",
      takenAt: "2026-11-04T20:48:59.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfVMK06MxY5",
      url: "https://www.instagram.com/p/DfVMK06MxY5/",
      caption: "\u{1F680} BUILD A STRONGER RESUME!\n\nReady to take the next step in your career?\n\nNETS is partnering with the SJSU Career Center to host a Career Development Workshop designed to help you strengthen your resume and prepare for internship and full-time opportunities!\n\n\u2728 What to Expect:\n- Resume tips and strategies to stand out\n- Highlighting your technical skills and projects\n- Preparing for internships and full-time opportunities\n- Career tools and resources for resumes and interviews\n\n\u{1F4C5} Monday, November 16, 2026\n\u23F0 4:30 PM \u2013 5:30 PM\n\u{1F4CD} SJSU Career Hub (Clark Hall)\n\n\u{1F465} Open to ALL SJSU students!\n\n\u{1F517} RSVP through the link in our Linktree!\nhttps://linktr.ee/sjsu.nets\n\nBring your current resume and make the most of this opportunity to invest in your professional development!\n\nHosted by NETS x SJSU Career Center\u{1F499}\n\n#SJSU #NETS #CareerDevelopment #ResumeWorkshop #SJSUCareerCenter #Internships #ProfessionalDevelopment #fyp\u30B7\u309Aviral\u30B7fyp\u30B7\u309A",
      takenAt: "2026-11-04T19:18:20.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfU8cT9GAK0",
      url: "https://www.instagram.com/p/DfU8cT9GAK0/",
      caption: "Lighting Focus.  SWEENEY TODD. Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu.ha @sjsu",
      takenAt: "2026-11-04T17:00:53.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfU7SjaxelW",
      url: "https://www.instagram.com/p/DfU7SjaxelW/",
      caption: "SWEENEY TODD.  Sitzprobe.  Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu.ha @sjsu",
      takenAt: "2026-11-04T16:52:02.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfT1iawzV_c",
      url: "https://www.instagram.com/p/DfT1iawzV_c/",
      caption: "10PM election coverage!\n\n#news #broadcastnews #sjsu #election",
      takenAt: "2026-11-04T06:43:08.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfTxxtRTfW8",
      url: "https://www.instagram.com/p/DfTxxtRTfW8/",
      caption: "[9PM] Some more election coverage!",
      takenAt: "2026-11-04T06:12:01.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfTq2AWT8lw",
      url: "https://www.instagram.com/p/DfTq2AWT8lw/",
      caption: "[8PM PST]: Polls are closed, here\u2019s some information on propositions!\n\n#sjsu #broadcastnews #elections",
      takenAt: "2026-11-04T05:09:03.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfTbsobGy8e",
      url: "https://www.instagram.com/p/DfTbsobGy8e/",
      caption: "That\u2019s a wrap on our MAde to Tap Workshop! \u{1F4B3}\n\nWe explored how FinTech companies turn first-time users into loyal, long-term customers\u2014from attracting new users to creating personalized experiences and measuring what truly drives growth. \n\nA huge thanks to our speakers: Neha Mehrotra, Sweta Sridhar, and Venkat Pullela, for sharing their expertise. We loved hearing their insights on customer loyalty, personalization, meaningful metrics, and making strategic marketing decisions on a budget. \u{1F4C8}\n\nThank you to everyone who joined us, and don\u2019t forget to come to our first Consulting Workshop! \u{1F91D}",
      takenAt: "2026-11-04T02:55:30.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfTXmiST50t",
      url: "https://www.instagram.com/p/DfTXmiST50t/",
      caption: "LIVE: Democratic Senate-Elect Jon Ossoff has won the Senate in Georgia. Polling is still open in California, vote on campus at the Provident Credit Union Center or Martin Luther King Jr. Library.\n\n#sjsu #broadcastnews #updatenews #election",
      takenAt: "2026-11-04T02:23:43.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DfTWKQFEXsG",
      url: "https://www.instagram.com/p/DfTWKQFEXsG/",
      caption: "SWEENEY TODD.  Scenic Load in.  Opens Nov 13 @hammertheatrecenter @sjsu_theatre @sjsumusic @sjsu @sjsu.ha",
      takenAt: "2026-11-04T02:07:07.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfTUdmpuYjr",
      url: "https://www.instagram.com/p/DfTUdmpuYjr/",
      caption: "Hola Familia!\n\nMake sure to buy your tickets for this Thursday\u2019s Latin Night: Throwback Thursday theme\u2757\uFE0FDress up in any outfit from your favorite era 80s, 90s, or 200s! \u{1F576}\uFE0F Going to be a great\nnight so make sure not to miss out! Sign up for presale through our Linktree in our bio & pay during our tabling hours\u203C\uFE0F\n\n#sjsu #Ibsasjsu #latinnight",
      takenAt: "2026-11-04T01:54:16.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfTRWPVJ2Fp",
      url: "https://www.instagram.com/p/DfTRWPVJ2Fp/",
      caption: "We are LIVE! Join us for Election Night \u201826 through the link in our bio. \u{1F5F3}\uFE0F\u{1F5F3}\uFE0F\n\n#sjsu #broadcastnews #updatenews #election",
      takenAt: "2026-11-04T01:27:27.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfTOErtl2qn",
      url: "https://www.instagram.com/p/DfTOErtl2qn/",
      caption: "How can we strengthen childcare systems when public resources are limited?\n\nUPDATED EVENT TIME: 1:30pm - 2:30pm \n\nJoin the Early Childhood Institute at SJSU for a virtual ECI Speaker Series presentation featuring Dr. Heidi Emberling, Director of the Santa Clara County Office of Children and Families Policy.\n\nDr. Emberling will present \u201CThink Globally, Act Locally: Shoring Up Childcare in an Age of Limited Public Resources.\u201D\n\n\u{1F4C5} Monday, November 16\n\u23F0 1:30pm - 2:30pm \n\u{1F4BB} Via Zoom\n\nRegister today at the link in bio or check out: tinyurl.com/ECISpeaker-Nov16\n\n#SJSULurie #LurieCollege #SJSU #EarlyChildhoodEducation #Childcare #ECISpeakerSeries",
      takenAt: "2026-11-04T00:56:36.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DfS8ONHBtSh",
      url: "https://www.instagram.com/p/DfS8ONHBtSh/",
      caption: "Attention continuing Juniors!!! To help your registration and transition into the Spring semester, the H&ASSC is hosting two virtual workshops\u{1F4DA}\n\nThis workshop will be covering Upper Division GEs, Graduation Planning, using MyScheduler, and other resources. \n\n\u{1F4C6}Tuesday, November 10th\n\u23F0WS1: 10AM-11AM, WS2: 2PM-3PM\n\u{1F4CD}Virtual (Zoom)\n\nSign up using the QR codes or through the links in our LinkTree to receive the Zoom link! We hope to see you there \u{1F49B}\u{1F499}",
      takenAt: "2026-11-03T22:23:45.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfS7Tr6EmHK",
      url: "https://www.instagram.com/p/DfS7Tr6EmHK/",
      caption: "\u{1F383}\u{1F369} LAST WEEK WITH NETS! \u{1F499}\n\nA little recap of last week\u2019s fun! \u{1F47B}\u2728\n\n\u{1F383} Halloween Social \u2014 Good vibes, fun times, and a chance to hang out and connect with our NETS community \n\n\u{1F369} Krispy Kreme Fundraiser \u2014 Thank you to everyone who supported our fundraiser and helped us continue bringing more events and opportunities to our members!\n\nWe appreciate everyone who showed up, participated, and supported NETS. \u{1F499} More events and exciting opportunities are coming soon, so stay tuned!\n\n\u{1F4C5} Check out our upcoming events and RSVP through our Linktree: https://linktr.ee/sjsu.nets\n\nThanks for being part of NETS! \u{1F680}\u{1F499}\n\n#SJSU #SJSUNETS #HalloweenSocial #fundraiser #fy",
      takenAt: "2026-11-03T22:12:29.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfSJnlcs6Yp",
      url: "https://www.instagram.com/p/DfSJnlcs6Yp/",
      caption: "\u{1F680} WANT TO JOIN THE NETS LEADERSHIP TEAM? \u{1F499}\n\nOur Spring 2027 Officer Applications are OPEN! \u{1F389}\n\nInterested in helping organize events, lead workshops, connect with industry professionals, and make an impact in the NETS community? This is your chance to get involved!\n\n\u{1F31F} What you can gain:\n\u{1F4BB} Experience in networking, cybersecurity, and tech events\n\u{1F91D} Leadership and teamwork skills\n\u{1F3A4} Opportunities to organize workshops and industry talks\n\u{1F499} A chance to contribute to the NETS community\n\n\u{1F4C5} IMPORTANT DATES\n\u{1F4DD} Applications open: November 2nd\n\u23F3 Application deadline: December 5th\n\u{1F91D} Interviews: January 5th\u201310th\n\u{1F4E3} Final decisions: January 15th\n\n\u{1F517} Ready to apply? Visit our Linktree!\nhttps://linktr.ee/sjsu.nets\n\nDon\u2019t miss your chance to be part of the team! We encourage everyone interested in contributing to NETS to apply. \u{1F680}\u{1F499}\n\n#SJSU #SJSUNETS #OfficerApplications #StudentLeadership #fypage",
      takenAt: "2026-11-03T14:59:23.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfRNmU4TO29",
      url: "https://www.instagram.com/p/DfRNmU4TO29/",
      caption: "Join Update News for Election Night \u201826! Get live coverage of polling and results tomorrow night!\n\n#news #sjsu #elections #polls #updatenews",
      takenAt: "2026-11-03T06:15:26.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfQ_bD-M5BJ",
      url: "https://www.instagram.com/p/DfQ_bD-M5BJ/",
      caption: "\u{1F342} HELLO, NOVEMBER! | NETS EVENTS CALENDAR \u{1F4C5}\u{1F499}\n\nA new month means more opportunities to learn, connect, and have fun with NETS! \u{1F389}\n\nWe have another exciting month ahead filled with workshops, club events, networking opportunities, and more.\n\n\u{1F4C5} Add the NETS Calendar to Your Personal Calendar!\n\nStay on top of our upcoming events by adding the NETS calendar to your personal Google Calendar.\n\n\u{1F517}Calendar Link:*Find it through our bio or visit the link below!\n\nhttps://calendar.google.com/calendar/u/0?cid=ZDgyODI4NmIyOWFlMDZlMWJjZDYzNzAxMDBhZmU5Zjc5OWQyNzA3ZDVmZmJiZjE5MDdmZTFjNWM2Mjg2NDQ2YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t\n\n\u{1F4CC} Please note* Event timings and room locations will be announced approximately one week before each event, so keep an eye on our Discord and Instagram for updates!\n\n\u{1F4DD} RSVP for events:https://linktr.ee/sjsu.nets\n\nSave the dates, stay connected, and we hope to see you throughout November! \u{1F680}\u{1F499}\n\n#SJSU #SJSUNETS #Networking #fypage #SpartanLife #NovemberEvents",
      takenAt: "2026-11-03T04:10:00.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfQq9l3h68U",
      url: "https://www.instagram.com/p/DfQq9l3h68U/",
      caption: "\u{1F3D2} SJ Barracuda Arena Tour & Game Night! \u{1F988}\nWhen: This Friday, Nov 6 @ 4:30 PM\n\u{1F4CD} Where: Tech CU Arena (1500 S. 10th St)\n\u{1F3E2} Exclusive company tour of the Barracuda arena!\n\u{1F39F}\uFE0F Optional: Stay for the SJ Barracuda vs. Bakersfield Condors game with discounted member tickets! Puck drops at 7pm! \n\u{1F517} RSVP at the link in our bio to secure your spot.",
      takenAt: "2026-11-03T01:11:13.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfQlwZKsMJ9",
      url: "https://www.instagram.com/p/DfQlwZKsMJ9/",
      caption: "Be there or be square! \u{1F57A}\u2728 We have Latin Night coming up this Thursday for anyone looking for a great time!\nDon\u2019t forget that it\u2019s Throwback Thursday, so pull up in your best outfit from your favorite era. \u{1F3A7}\u{1F525}\n\u{1F4CD} Where: THE LOFT, 90 s Second St.\n\u{1F4C5} When: Thursday, November 5th\n\u23F0 Time: 9:30pm- 1:30am\n\u{1F3B6} Theme: Throwback Thursday\nBring your friends, your best moves, and your favorite retro looks. You don\u2019t want to miss LBSA\u2019s biggest night of the semester! \u{1F483}\u{1F440}\n#LBSA #LatinNight #ThrowbackThursday #SJSU #Spartans",
      takenAt: "2026-11-03T00:26:39.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DfQhWIhGeKw",
      url: "https://www.instagram.com/p/DfQhWIhGeKw/",
      caption: "\u{1F4A1}\u2728 Want to learn what a career in responsible computing looks like?\n\nJoin RCC for Exploring Responsible Computing Careers Panel! \u{1F310} Hear from professionals working at the intersection of technology, ethics, policy, and social impact. Get real world insights, career advice, and the opportunity to network with professionals who are shaping the future of technology!\n\nWhether you\u2019re interested in AI Ethics, UX Design, Software Engineering, Data Science, Research & Product, or Public Policy, there\u2019s something for everyone! Open to all majors! \u{1F4BB}\u{1F49C}\n\n\u{1F4C5}  Tuesday, November 10\n\u23F0  5:00 PM \u2013 7:00 PM\n\u{1F4CD}  Clark Hall, 1st Floor, Career Hub\n\n\u{1F517} RSVP using the link in our bio or scan the QR code!\n\nBring questions. Hear from professionals. Network! \u{1F49C}\n\n#sjsu #sjsuevents #rcc #panel #rccsjsu",
      takenAt: "2026-11-02T23:47:08.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DfQHs7Wye4M",
      url: "https://www.instagram.com/p/DfQHs7Wye4M/",
      caption: "Come support MISA at our Insomnia Cookies Fundraiser this Thursday! We\u2019ll be tabling on 7th Street, so stop by, grab your favorite cookies, and support the club! \u{1F499}\n\n\u{1F4C5} Thursday, Nov. 5\u2028\u23F0 10:30 AM \u2013 3:00 PM\u2028\u{1F4CD} 7th Street\n\nBring your friends, satisfy your sweet tooth, and come support MISA! \u{1F36A}\u{1F499}",
      takenAt: "2026-11-02T20:03:56.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DfP7SsrvNvY",
      url: "https://www.instagram.com/p/DfP7SsrvNvY/",
      caption: "Join us tomorrow evening for an informative workshop on careers in product, consulting & tech featuring guest speaker, Dakota Yang. Open to all SJSU students! \u{1F4BB}\n\n#sjcg #consulting #sjsu",
      takenAt: "2026-11-02T18:16:14.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfOo0eRJ8ep",
      url: "https://www.instagram.com/p/DfOo0eRJ8ep/",
      caption: "Halloween with SHRM @ SJSU \u{1F383}\u{1F47B}: Take a look at some of the amazing costumes from our Halloween Social! Thank you to everyone who came out and celebrated with us at our Halloween social!",
      takenAt: "2026-11-02T06:15:58.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DfOXxqflPCz",
      url: "https://www.instagram.com/p/DfOXxqflPCz/",
      caption: "\u{1F6A8}LOCATION CHANGE: DMH 355\nJoin MISA for our Fix the Flow Workshop for an exciting evening of product design insights, UX perspectives, and conversations with experienced industry professionals! \u{1F3A8}\n\n\u{1F4C5} Thursday, November 5\n\u23F0 6:00 \u2013 7:30 PM\n\u{1F4CD} MH 520\n\nHear from professionals at companies like Adobe, Meta, Apple, Astera Labs, and VMware as they share their experiences, industry insights, and perspectives on product design and UX. Don't miss this opportunity to learn from industry experts and connect with fellow MISA members! \u{1F91D}\n\nRegister through the link in our bio. We hope to see you there! \u{1F680}",
      takenAt: "2026-11-02T03:45:02.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "DfOW5gKTXSY",
      url: "https://www.instagram.com/p/DfOW5gKTXSY/",
      caption: "The November 3rd election is approaching! Do you want to know what\u2019s on your ballot? Watch Stop for Props with Dhwani Adhishesh.\n\n#election #props #sjsu #broadcastnews \n\n\u{1F3A5}\u270D\uFE0F: @dhwani.divesin",
      takenAt: "2026-11-02T03:39:38.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "DfODRKHtAYr",
      url: "https://www.instagram.com/p/DfODRKHtAYr/",
      caption: "\u{1F3D0}\u{1F3C0} Get ready for SPORTS DAY! \u26BD\u{1F3F8}\n\nTake a break from classes and join ACM SJSU for an afternoon of games, friendly competition, and fun! \u{1F3C6}\n\nCome hang out, meet new people, and enjoy some sports with us! Whether you\u2019re playing or cheering from the sidelines, everyone is welcome! \u{1F49C}\u{1F49B}\n\n\u{1F4C5} Wednesday, November 4\n\u{1F55E} 3:30 PM\n\u{1F4CD} ISB Lawn\n\n\u{1F91D} In collaboration with Hoplite, SCE, PATH, PMA, NETS and MORE!\n\nSee you on the lawn! \u{1F3D0}\u{1F525}",
      takenAt: "2026-11-02T00:47:19.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfNJ-x7vquh",
      url: "https://www.instagram.com/p/DfNJ-x7vquh/",
      caption: "Happy Super Savings Sunday \u{1F4B0}\nSJSU students can earn a $25 bonus when they sign up for a savings account with Excite Credit Union! It\u2019s a simple way to start building your savings and make your money work a little harder. \u{1F499}\nTerms and eligibility requirements may apply.\n#FMA #SJSU #fyp #finance #college",
      takenAt: "2026-11-01T16:25:41.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfLWz09vRR2",
      url: "https://www.instagram.com/p/DfLWz09vRR2/",
      caption: "\xA1Hola Familia! If Halloweekend isn\u2019t enough, keep the party going at Latin Night! This years theme is Throwback Thursday so come in your best y2k \u201Cthrowback\u201D outfit\u{1FAA9}\u{1F483}\n\nQuestion for the girls: what order do you guys get ready in? Is it makeup, hair and then outfit? Let us know in the comments! \u{1F648}\n\n\u{1F4C5} Thursday November 5th\n\u{1F4CD} 90 S Second St, San Jose\n\u23F0 9:30 pm - 1:30 am\n\u203C\uFE0F Tickets are on sale for $25 right now, $35 at the door\u203C\uFE0F",
      takenAt: "2026-10-31T23:46:50.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfLWACuhQPy",
      url: "https://www.instagram.com/p/DfLWACuhQPy/",
      caption: "Join us for an exclusive career night with Pebble Beach Company! \u{1F334} This year, we are pulling back the curtain on what it takes to deliver world-class hospitality, recreation, and legendary guest experiences at one of the most iconic destinations in the world.\n\nThe session will feature a company culture overview and an open Q&A where you can ask hospitality and resort leaders questions directly, alongside practical advice on resumes and interviewing.\n\nKey Takeaways:\nDiscover Pebble Beach Company: Hear from a company representative about its culture, hospitality standards, and what it\u2019s like to work at this iconic destination.\nExplore Early Career Programs: Learn about the SEMT and Company Team Leader programs, including opportunities to gain experience and grow within the company.\nAsk Your Questions: Participate in a Q&A about company culture, career paths, and student opportunities at Pebble Beach\n\n\u{1F4C5}Date: Tuesday, November 3rd\n\u{1F567}Time: 6:00 PM \u2013 7:00 PM\n\u{1F4CD}Location: Student Union Room 2A\nRSVP with the link in bio!\n\n*This event is first come, first served and for paid members only!\n**There is a $5 entrance fee if you are not a member.",
      takenAt: "2026-10-31T23:31:51.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfLMMRMEtLh",
      url: "https://www.instagram.com/p/DfLMMRMEtLh/",
      caption: "Happy Halloween from the Peer Connections Team! \u{1F5A4}\u{1F9E1}\u{1F47B}\n\nSwipe to see this years costume contest winner!!! \u{1F9DB}\u{1F3FD}\u200D\u2640\uFE0F",
      takenAt: "2026-10-31T22:06:05.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfK9zNTkkx_",
      url: "https://www.instagram.com/p/DfK9zNTkkx_/",
      caption: "Happy Halloween\u{1F47B}\u{1F383}",
      takenAt: "2026-10-31T20:00:02.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfKtjKDpjZ1",
      url: "https://www.instagram.com/p/DfKtjKDpjZ1/",
      caption: "Interviews can be intimidating, but preparation can make all the difference!\n\nJoin SHRM at SJSU for our Interview Prep Workshop and learn how to feel more confident walking into your next interview. You\u2019ll learn how to answer commonly asked interview questions, present yourself effectively, and navigate interviews.\n\nYou\u2019ll also get the chance to practice answering interview questions yourself and fine-tune your skills in a supportive environment!\n\n\u{1F5D3}\uFE0FThursday, November 5th\n\u23F06:00 - 7:15 PM\n\u{1F4CD}DMH 234\n\u{1F454}Business Casual\n\nCome prepared to practice, build confidence, and take your interview skills to the next level! \u{1F4BC}\n\nNote: You must be a paid SHRM member to attend or pay a fee of $5 at the door if you are a non-member!",
      takenAt: "2026-10-31T17:38:47.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfKh1WMAbr3",
      url: "https://www.instagram.com/p/DfKh1WMAbr3/",
      caption: "Today\u2019s the day! \n\nThis is the final opportunity to support SJSU\u2019s Spartan Sprint October Rally initiative to equip future inclusive educators with hands-on experience and assistive technology.\n\nYour gift can help prepare future teachers with the tools they need to create more inclusive, accessible learning environments for every student.\n\nMake a gift or share the campaign before it ends today at the link in bio!\n\n#SJSULurie #LurieCollege #SJSU #SpartanSprint #OctoberRally #AssistiveTechnology #InclusiveEducation",
      takenAt: "2026-10-31T16:01:41.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfJPFdTlB4Z",
      url: "https://www.instagram.com/p/DfJPFdTlB4Z/",
      caption: "It\u2019s the end of APM week! Shoutout to our amazing Academic Peer Mentors who do their best to help students navigate Spartan life. We\u2019re grateful for all the work they do! \u{1F499}\u2728\n\n#sjsu #peerconnections #academicpeermentor",
      takenAt: "2026-10-31T03:52:54.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DfJHjLuIpbj",
      url: "https://www.instagram.com/p/DfJHjLuIpbj/",
      caption: "A huge thank you to all the analysts, founders, and IDEAS Club members who joined our workshop this past Tuesday!\n\nA special shout-out to the IDEAS Club for co-hosting and helping us bring this amazing event to life. \u{1F64C}\n\n#sjcg #ideasclub #consulting #sjsu",
      takenAt: "2026-10-31T02:49:54.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfJDkPGNycS",
      url: "https://www.instagram.com/p/DfJDkPGNycS/",
      caption: "Ever wondered how consultants tackle real-world business challenges? \u{1F4BC}\n\nCome to MA\u2019s first-ever consulting workshop for a hands-on session where you\u2019ll learn how to approach, break down, and solve consulting cases with confidence! We\u2019ll also cover the fundamentals of case interviews, including the 5-step framework and why top firms use them in their hiring process. \u{1F4CA}\u{1F50D}\n\nNo experience needed, and all majors are welcome! Come explore the world of consulting by RSVP\u2019ing at the link in the bio! \u{1F517}",
      takenAt: "2026-10-31T02:14:51.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfI5zNDh0Wc",
      url: "https://www.instagram.com/p/DfI5zNDh0Wc/",
      caption: "We're excited to share that Women in Business is continuing our fundraiser with Boba Bar! \n\nFrom NOW through November 9th, 20% of proceeds from purchases at the San Jose downtown location will be donated to Women in Business. Stop by anytime, grab your favorite boba, and support WIB! Prepare to present this flyer when ordering \u2728\n\nLocation: Boba Bar, Downtown San Jose\nDates: October 30th\u2013November 9th\nWe hope to see you there! \u{1F31F}",
      takenAt: "2026-10-31T00:46:57.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfIwAdjvlZM",
      url: "https://www.instagram.com/p/DfIwAdjvlZM/",
      caption: "Join us this Wednesday, November 4th at Yogurtland on 125 E San Carlos St for our fundraiser! Stop by anytime during the day to grab some delicious frozen yogurt and support SJSU Women in Business \u{1F366}\u{1F496}\n\nPresent this flyer at the register!",
      takenAt: "2026-10-30T23:28:27.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DfIhUGbOZ7Q",
      url: "https://www.instagram.com/p/DfIhUGbOZ7Q/",
      caption: "There\u2019s no one way into AI. What\u2019s yours? \n\nAI in Business at SJSU, in collaboration with @sjsuspartananalytics, @imasjsu, and @sjsuacm, presents our Breaking into AI Roundtable!\n\nMeet professionals from Google, Brevian AI, Adobe, and Tesla through small-group conversations, live tool demos, and Q&A. Hear how they built their careers, ask about your own next steps, and stay for open networking \u{1F91D}\n\n\u{1F5D3} Tuesday, November 3\n\u23F0 6:00\u20137:30 PM\n\u{1F4CD} DMH 227\n- Free \u2022 All majors welcome -\nRSVP through the Linktree in our bio!",
      takenAt: "2026-10-30T21:13:00.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfIf4wBksiI",
      url: "https://www.instagram.com/p/DfIf4wBksiI/",
      caption: "Don't forget to change your clocks this Sunday! \u23F0",
      takenAt: "2026-10-30T21:00:03.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfINSPfvvFC",
      url: "https://www.instagram.com/p/DfINSPfvvFC/",
      caption: "Take a break from your busy schedule and join us for an afternoon of fun, games, and new connections! Bring your friends or come meet new ones. Everyone is welcome! \u{1F499}",
      takenAt: "2026-10-30T18:17:58.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfIMMSPD6Iu",
      url: "https://www.instagram.com/p/DfIMMSPD6Iu/",
      caption: "A disciplined approach to investing market downturns can create large long-term results. In this hypothetical example, investing $1,000 at each 10% decline in QQQ would require approximately $31,000 in total contributions and could grow to about $236,000 over 20 years, whereas investing the same principle over twenty years without paying attention to dips would yield just $176,000. Savings account would yield the lowest return at $32,900 if you stacked your money in them over 20 years.\nWhile savings accounts provide stability and liquidity, their long-term growth potential is generally limited compared with investing in the market, with an average national APY of 0.6% The key is patience, and allowing compounding to work over time.\nFor educational purposes only. This is not financial advice. Past performance does not guarantee future results. #investing #fyp #fma #stock #money",
      takenAt: "2026-10-30T18:08:22.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfII465Mkk2",
      url: "https://www.instagram.com/p/DfII465Mkk2/",
      caption: "\u{1F342}\u{1F499} NETS Third General Meeting! \u{1F499}\u{1F342}\n\nHey everyone! Our third general meeting is coming up, and we\u2019d love to see you there! \u{1F60A}\n\nCome hang out with us as we go over our upcoming November events, talk about officer applications for next semester, and share more ways to get involved with NETS. We\u2019ll also have some fun activities and time to catch up with everyone!\n\n\u{1F4C5} Monday, November 2nd\n\u23F0 3:00 PM \u2013 4:00 PM\n\u{1F4CD} SU Meeting Room 4B\n\n\u2728 Here\u2019s what we\u2019ll be talking about:\n\u{1F4BC} Officer applications for next semester\n\u{1F4C6} Upcoming NETS events in November\n\u{1F91D} Ways to get involved and meet other members\n\u{1F389} Fun activities and time to hang out!\n\nWhether you\u2019ve been coming to our meetings all semester or you\u2019re just getting started with NETS, everyone is welcome!\n\n\u{1F4F2} RSVP through the NETS Linktree \u2014 link in bio!\n\nBring a friend, and we\u2019ll see you there! \u{1F341}\u{1F499}\n\n#SJSU #NETS #SpartanLife #Networking #Engineering #StudentOrganizations #fypage",
      takenAt: "2026-10-30T17:39:42.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfIIUzhsN6W",
      url: "https://www.instagram.com/p/DfIIUzhsN6W/",
      caption: "JABIL COMPANY TOUR | NETS \n\nJoin NETS for an exciting opportunity to tour Jabil\u2019s facility, learn more about engineering operations, and connect with industry professionals!\n\n\u{1F4C5} November 5th\n\u23F0 11:00 AM \u2013 1:30 PM\n\u{1F4CD} Jabil Facility (30 Great Oaks Blvd, San Jose, CA 95119) \n\n\u2728 **What to expect:**\n\u{1F539} Jabil facility tour\n\u{1F539} Lunch & Q&A panel with engineering staff\n\u{1F539} Networking and learning opportunities\n\n\u{1F355} Lunch and refreshments will be provided!\n\n\u26A0\uFE0F **Registration closes TONIGHT!** Make sure to scan the QR code on the flyer and complete the RSVP form before the deadline!\n\nWe hope to see you there! \u{1F64C}\n\n#SJSU #NETS #Jabil #CompanyTour #Engineering #Networking #SpartanLife #CareerDevelopment #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F",
      takenAt: "2026-10-30T17:34:37.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfH_DseNqyz",
      url: "https://www.instagram.com/p/DfH_DseNqyz/",
      caption: "Now THIS is HALLOWEEN! \u{1F383}\u{1F47B} From spooky storytelling to Halloween with the Deans, we had a boo-tiful time filled with pumpkin crafts, s\u2019mores, sweet treats, and spooky fun! \u{1F9E1}\u{1F36B}\u2728\n\n#HalloweenWithTheDeans #sjsulurie #luriecollege #sjsu",
      takenAt: "2026-10-30T16:15:43.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DfGp9DrgOVt",
      url: "https://www.instagram.com/p/DfGp9DrgOVt/",
      caption: "\u{1F3E2} Step inside IBM! \u{1F4BB}\n\nJoin MISA for an exclusive company tour and information session at the IBM San Jose Office! Get an inside look at the company, learn more about IBM, and explore potential career opportunities. \u{1F680}\n\nSpots are limited and available on a first-come, first-served basis, so make sure to fill out the registration form ASAP for the best chance of securing your spot!\n\n\u{1F4C5} Friday, November 6\u2028\u23F0 10:45 AM \u2013 12:00 PM\u2028\u{1F4CD} IBM San Jose Office (555 Bailey Ave, San Jose, CA)\n\nRegister in bio!",
      takenAt: "2026-10-30T03:52:05.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfGlSYwhXP2",
      url: "https://www.instagram.com/p/DfGlSYwhXP2/",
      caption: "Hey everyone! \u{1F496} Join us for an inspiring and empowering Women in Leadership Panel hosted in partnership with Rakuten! This event will give you an inside look at the careers, leadership philosophies, and personal journeys of trailblazing women leaders driving innovation across the company!\n\nGain insights from industry leaders, learn how to navigate career journeys, and discover how leaders overcame professional hurdles. We'll also have a direct Q&A!\n\n\u{1F4C5}Date: Monday, November 2nd\n\u{1F567}Time: 6:00 PM \u2013 7:00 PM\n\u{1F4CD}Location: Online via Zoom (Meeting details will be sent via email prior to the event)\n\nThis event is first come, first served and for paid members only! There is a $5 entrance fee if you are NOT a member.",
      takenAt: "2026-10-30T03:09:14.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfGXu4Sk8CX",
      url: "https://www.instagram.com/p/DfGXu4Sk8CX/",
      caption: "Can you all believe that October is almost over?!? \u{1F631} But don\u2019t worry, cause this November we\u2019ll be hosting 3 Cookies for Success Workshops \u{1F57A}\n\nStop by \u{1F4CD}SSC 602 to learn about effectively using AI resources, making connections as a college students, and paint tote bags (for free!!) \u2728\n\n#sjsupride\u{1F499}\u{1F49B} #spartanstrong\u{1F4AA} #peerconnections\n\nAI tech is moving so fast we are running to catch up \u{1F3C3}\u{1F3FB}\u200D\u2640\uFE0F\nThis workshop will help you learn how to effectively and responsibly use AI resources to make the most of your academic, professional, and personal endeavors \u{1F4BB}\u{1F913}\n\n\u{1F4CD} SSC 602\n\u{1F5D3}\uFE0F Wednesday, Nov. 4th\n\u23F0 2:00 p.m.",
      takenAt: "2026-10-30T01:10:02.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfGWXmrBsMb",
      url: "https://www.instagram.com/p/DfGWXmrBsMb/",
      caption: "Graduation season is almost here! \u{1F499}\u{1F393}\n\nIt\u2019s time to get ready to celebrate your MA journey! Whether you\u2019re graduating soon or looking to get your MA stole ahead of time, you should definitely pre-order. If you want to rep MA in style, information for ordering a quarterzip will be announced after the form\u2019s closure. \u{1F455}\n\nFill out our interest form if you\u2019re planning to buy! Make sure to submit your order by Nov 6 at 11:59PM. \u{1F4CC}",
      takenAt: "2026-10-30T00:59:49.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DfGITRfBc5h",
      url: "https://www.instagram.com/p/DfGITRfBc5h/",
      caption: "Thank you to everyone who joined us for our Halloween Social! \u{1F47B}\u2728\n\nWe had a great time meeting new people, building connections, and celebrating the spooky season with WIB through fun games and team challenges.\n\nThank you to everyone who participated and made the event so enjoyable! A special thank you to our event ambassadors, Keira Ebrahimi from Uber One and Sejal Ghanate from Olipop, for helping make the event a success.\n\nWe\u2019re grateful to everyone who came out and celebrated with us! \u{1F49B}",
      takenAt: "2026-10-29T22:55:57.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfGGV8EpUYa",
      url: "https://www.instagram.com/p/DfGGV8EpUYa/",
      caption: "The final days of SJSU\u2019s Spartan Sprint October Rally are here.\n\nHear from Lurie College student Jonathan Coleman as he shares why access to assistive technology and hands-on learning experiences matters for preparing future educators to create more inclusive and accessible classrooms.\n\nThe campaign ends October 31. Consider making a gift or sharing the campaign with your network to help equip future teachers with the tools and experiences they need to support every student.\n\nLearn more or give today at the link in bio!\n\n#SJSULurie #LurieCollege #SJSU #SpartanSprint #OctoberRally #AssistiveTechnology #InclusiveEducation",
      takenAt: "2026-10-29T22:39:22.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DfGB8YaBPFa",
      url: "https://www.instagram.com/p/DfGB8YaBPFa/",
      caption: "GUEST SPEAKER PANEL w/ FREE FOOD AND DRINKS \u{1F355}\u{1F379}\u{1F389}\nTuesday Nov 3, 6-7:30PM @ BBC 004 \u{1F440}\nWelcome to ALL students!\n#sjsu #productmanagement #bayarea",
      takenAt: "2026-10-29T22:00:06.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfF-8DClx4P",
      url: "https://www.instagram.com/p/DfF-8DClx4P/",
      caption: "A little staff appreciation, a lot of Halloween spirit, and a well-deserved win! \u{1F499}\u{1F49B}\u{1F383}\u{1F3C6}\u{1F49B}\u{1F499}\n\nToday, our Lurie College team came together for the 2026 Academic Affairs Division (AAD) Staff Appreciation event, a wonderful opportunity to celebrate the incredible people who keep our college moving forward every day!\n\nBehind every student success story is a community of dedicated staff who work tirelessly throughout the academic year to support our students, faculty, and one another. From the work happening behind the scenes to the everyday moments of care, encouragement, and connection, our staff make a meaningful difference in the Lurie College experience.\n\nAnd of course, we couldn\u2019t leave without a little extra celebration! \u{1F47B} Congratulations to our Lurie College staff for taking home Best Group Halloween Costume! Your creativity, teamwork, and Spartan spirit made this a well-deserved win!\n\nTo our amazing staff: Thank you for all that you do, today and every day. We appreciate you! \u{1F499}\u{1F49B}\n\n#SJSULurie #LurieCollege #SJSU #StaffAppreciation #Halloween2026",
      takenAt: "2026-10-29T21:34:27.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "DfF4kKWy-03",
      url: "https://www.instagram.com/p/DfF4kKWy-03/",
      caption: "AI agents are only as powerful as the tools they can access. \u{1F916}\u26A1\n\nNext up in our Agentic AI Series (2/4): MCP 101!\n\nJoin us for a hands-on workshop exploring the Model Context Protocol (MCP), how it connects AI agents to real-world tools and data, and how to build your very own MCP server!\n\n\u{1F4C5} Tuesday, November 3\n\u23F0 1:00 PM\n\u{1F4CD} MQH 227\n\n\u{1F512} ACM Members Only\n\nSee you there, Spartans! \u{1F499}\n\n#ACMSJSU #AgenticAI #MCP #ArtificialIntelligence #SJSU ComputerScience",
      takenAt: "2026-10-29T20:40:08.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "DfF3SFZOPo0",
      url: "https://www.instagram.com/p/DfF3SFZOPo0/",
      caption: "Join us Nov. 10th to learn about ways to navigate your degree(s) in the health pathways. Hear from CHHS Alumni on their experiences and how they found their pathways! \u2728\u{1F499}\n\nRSVP is required for this event: https://docs.google.com/forms/d/e/1FAIpQLScF81yNWf3qKC0En2tJFz-n4Lqn3kokalyvkaWhb9Brj4Mn3w/viewform?usp=dialog",
      takenAt: "2026-10-29T20:27:14.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "DfFw8HTCpXk",
      url: "https://www.instagram.com/p/DfFw8HTCpXk/",
      caption: "\u203C\uFE0F2nd ANNUAL STUDENT CLIMATE TRANSFORMATION CHALLENGE\u203C\uFE0F\n\nHave an idea for a more sustainable future? This is your chance to turn it into action! Open to all undergraduate students across Bay Area campuses, registration will be from from October 15 to December 15, with over $5,000 in prize money. Build a team, tackle real climate challenges.\n\nRegister at cic.earth/challenge or scan the QR code. We hope to see you there!\n\n#sjsu #sustainability #greencampus",
      takenAt: "2026-10-29T19:32:21.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DfFg7nOva9S",
      url: "https://www.instagram.com/p/DfFg7nOva9S/",
      caption: "Join FMA and Western Digital for an inside look at careers in corporate finance! Hear from professionals across revenue, accounting, investor relations, and early career talent as they share their experiences, discuss internship and rotational program opportunities, and offer advice for launching your career.\n\n\u{1F4C6}November 5 | 4:30-5:30 PM\n\u{1F4CD}SU 3B\n\u{1F355}FREE PIZZA PROVIDED!\n\nConnect. Learn. Explore Your Future in Finance.\n\n#FMA #FinanceWorkshop #Investing #Networking #CareerDevelopment",
      takenAt: "2026-10-29T17:15:30.000Z"
    },
    {
      handle: "bravensjsu",
      host: "Braven at SJSU",
      shortcode: "DfFgexInXFX",
      url: "https://www.instagram.com/p/DfFgexInXFX/",
      caption: "SJSU Fellows, our SY 2025-2026 Impact Report is live. \u{1F499}\u{1F49B}\n\nRead about how SJSU Braven grads were 28 points more likely to have completed an internship than graduates nationally.\nThis report is proof of the hard work you\u2019re putting into your futures.\n\nRead it in full at the link in our bio \u{1F517}",
      takenAt: "2026-10-29T17:07:56.000Z"
    },
    {
      handle: "sjsu_careercenter",
      host: "SJSU Career Center",
      shortcode: "DfFYs3Tm6ku",
      url: "https://www.instagram.com/p/DfFYs3Tm6ku/",
      caption: "Hear inspiring stories from a panel of first-generation SJSU alumni who\u2019ve successfully launched their careers. They\u2019ll share candid insights on transitioning from college to career\u2014building confidence, overcoming challenges, and embracing leadership along the way. \nJoin us to connect, ask questions, and get inspired.\nA networking social with the panelists and food will follow.\nThis event is presented in partnership with the Career Center, LAN, and ASPIRE.\n\nLog into Handshake now to register",
      takenAt: "2026-10-29T15:59:57.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "DfEBP8ShAcn",
      url: "https://www.instagram.com/p/DfEBP8ShAcn/",
      caption: "\u2026All but one camper will receive a marshmallow \u{1F361} \n\nGet ready to bring the drama, as the competition is packed with chaos and fun! Join us for our Total Drama Island-themed social featuring 4 rounds of mini games and a candy prize inspired by the show\u2019s million-dollar prize! \u{1F3D5}\u{1F525}\n\nWill you be the ultimate camper? RSVP at the link in the bio! \u{1F4E3}",
      takenAt: "2026-10-29T03:16:28.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DfD7dG7ADLR",
      url: "https://www.instagram.com/p/DfD7dG7ADLR/",
      caption: "Ever wondered what it takes to break into product management? \u{1F680}\n\nJoin us for Faces of Product Management, an exclusive speaker panel featuring industry professionals from Amazon, Google, and more! Come hear about their career journeys, insights, and advice for aspiring PMs. \n\nBring a friend, ALL STUDENTS WELCOMED! Plus, free Olipop & pizza will be provided!\n\n\u{1F5D3} : Tuesday, November 3, 2026\n\u23F0 : 6:00 PM \u2013 7:30 PM\n\u{1F4CD} : BBC 004\n\nSee you there!",
      takenAt: "2026-10-29T02:26:09.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DfDoGBXD8DX",
      url: "https://www.instagram.com/p/DfDoGBXD8DX/",
      caption: "\xA1Hola Familia!\n\nThank you for everyone who was able to attend our Bakertilly Workshop last week. It was a pleasure hosting the event and so great to see everyone! \u{1F341} \n\nMake sure to follow us to keep up with future events!\n#lbsasjsu",
      takenAt: "2026-10-28T23:35:59.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DfDlS7Bvqx5",
      url: "https://www.instagram.com/p/DfDlS7Bvqx5/",
      caption: "Get into the spooky spirit with Lurie College! \u{1F480}\u2728 \n\n\u{1F47B}Join us for an afternoon of Halloween fun with the Deans TOMORROW, and leave with a pumpkin keepsake! \n\n\u{1F383}October 29, 2:30\u20134:30 PM \n\u{1F4CD}Student Success Center, SH 106\n\n\u{1F39F}\uFE0F RSVP using the QR code or through the link in bio!\n\nWe can\u2019t wait to see you there! \u{1F499}\u{1F49B}\n\n#HalloweenWithTheDeans #SJSU #LurieCollege #SpartanLife #SJSUEvents Halloween \u{1F383}",
      takenAt: "2026-10-28T23:15:20.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DfDKFiNk2nK",
      url: "https://www.instagram.com/p/DfDKFiNk2nK/",
      caption: "Last but certainly not least, let\u2019s learn about SI Leaders! Does this role speak to you? Consider applying for it in the link in our bio! \u{1F4D6}\u2728\n\n#sjsu #peerconnections",
      takenAt: "2026-10-28T19:13:46.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DfDE-VBPqdE",
      url: "https://www.instagram.com/p/DfDE-VBPqdE/",
      caption: "Excited for our 2nd meeting of the Language Exchange Club! Come by Clark 242 on Thursday from 4:30-5:30 PM to connect and gain some language practice. All languages are welcome!",
      takenAt: "2026-10-28T18:29:09.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DfBkZEbxZW4",
      url: "https://www.instagram.com/p/DfBkZEbxZW4/",
      caption: "\u{1F342}\u2728 An event with good food, fun people, and amazing company? \n\nJoin RCC for our Friendsgiving & General Meeting! \u{1F983}\u{1F49C} Come connect, hear the latest RCC updates, and celebrate our amazing community. Everyone is welcome so we\u2019d love to see you there! \u{1FAF6}\n\n\u{1F4C5} Tuesday, November 3\n\u23F0 5:00 - 7:00 pm\n\u{1F4CD}CV2 Multi-Purpose Room\n\n\u{1F39F}\uFE0F RSVP IS REQUIRED! The last day to RSVP is November 1st, so make sure to save your spot before it\u2019s too late! \u{1F5D3}\uFE0F\n\nWe can\u2019t wait to celebrate with you! \u{1F49C}\u2728 \n\n#sjsu #rcc #sjsuevents",
      takenAt: "2026-10-28T04:27:33.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "DfBcMXwJCTB",
      url: "https://www.instagram.com/p/DfBcMXwJCTB/",
      caption: "\u{1F6A8}CORRECTION: This event is on TUESDAY, November 3rd! \nJoin us for \u201CHandshake for Success,\u201D a career event in collaboration with the Career Center!\u{1F4BC}\u{1F499}\n\nCareer Counselor Judi Garcia will share helpful tips on using Handshake to find internships and job opportunities.\n\nDon\u2019t miss this opportunity to learn how to make the most of Handshake!\n\n\u{1F4CB}Register link in bio\n\n\u{1F5D3}\uFE0F Tuesday, November 3rd\n\u23F0 6:15 - 7:30 PM\n\u{1F4CD}BBC 122\n\u{1F454} Business Casual\n\nNote: You must be a paid SHRM member to attend or pay a fee of $5 at the door if you are a non-member!",
      takenAt: "2026-10-28T03:22:28.000Z"
    },
    {
      handle: "htem_sjsu",
      host: "SJSU Hospitality Department",
      shortcode: "DfBMrPQGZnv",
      url: "https://www.instagram.com/p/DfBMrPQGZnv/",
      caption: "Spartan Events Management Club x Meeting Professionals International 2026\n\nPresident Arllete Lorainne Alinea\nVice President George Mitri\nCo-community Relations Kalina Mullinax\n\nBe The Change: A Night of Impact MPICC Gala Night\n\nDinner Preparations \u{1F374}\n\nPasta \u{1F35D}\n\nPresident of MPICC Melanie Lucero's BE THE CHANGE\n\nLorainne Alinea\n\nKalina Mullianx\n\nGeorge Mitri",
      takenAt: "2026-10-28T00:57:55.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DfBGirVvdNA",
      url: "https://www.instagram.com/p/DfBGirVvdNA/",
      caption: "Ready to take your college experience global? \u{1F30D}\u2708\uFE0F Join our Study/Intern Abroad Panel! Hear firsthand experiences, tips, and insights from our amazing speakers: Ethan Nelson, Allie Le, Arlette Lorraine Alinea and Daniel Bonnett. \n\n\u{1F4C5} Date: October 29th \n\u23F0 Time: 6 PM \n\u{1F4CD} Location: BBC 122\nBring your questions and get ready for an inspiring event! See you there! \u{1F64C}\u{1F4BC}\u{1F30F}\n#StudyAbroad #InternAbroad #SJSU #IBA",
      takenAt: "2026-10-28T00:05:16.000Z"
    },
    {
      handle: "sjsuacm",
      host: "ACM - Computer Science Club at San Jos\xE9 State",
      shortcode: "DfA47IZyo4B",
      url: "https://www.instagram.com/p/DfA47IZyo4B/",
      caption: "ACM x SCE \u2014 Intro to Homelab Workshop \u{1F5A5}\uFE0F\n\nCurious about homelabs and how your own hardware can connect with the cloud? Join ACM x SCE to learn the basics of homelabs, cloud computing, GCP, and Terraform and how they all work together.\n\n\u2705 All students welcome! No prior experience needed.\n\n\u{1F4C5} Wednesday, October 28\n\u{1F550} 1:00 PM\n\u{1F4CD} MQH 227\n\nCome learn how to start building your own setup! \u{1F680}",
      takenAt: "2026-10-27T22:11:04.000Z"
    },
    {
      handle: "bravensjsu",
      host: "Braven at SJSU",
      shortcode: "DfAqjc-yk3N",
      url: "https://www.instagram.com/p/DfAqjc-yk3N/",
      caption: "Meet your career coach, Alanna Simao! \u{1F44B}\n\nStruggling to put your experience into words on your resume? You\u2019re not alone. In today\u2019s quick clip, Alanna busts a major resume myth and drops essential tips to help you craft a standout resume that launches your career forward. \u{1F680}\n\u{1F447} Watch the full video to get the inside scoop! \u{1F4CD} \n\n#ResumeAdvice #StudentSupport #CareerGoals #bebraven #sjsu",
      takenAt: "2026-10-27T20:03:09.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DfAhKEpv4uu",
      url: "https://www.instagram.com/p/DfAhKEpv4uu/",
      caption: "Selling donuts on 7th Street today and tomorrow! Come get your special Halloween donuts \u{1F369} \u{1F383}\n\n#SJSU #NETS #HalloweenWeek #KrispyKremeFundraiser #fy",
      takenAt: "2026-10-27T18:39:12.000Z"
    },
    {
      handle: "undocuspartans",
      host: "UndocuSpartan Resource Center",
      shortcode: "DfARhIYmvIM",
      url: "https://www.instagram.com/p/DfARhIYmvIM/",
      caption: "Immigrant voices and stories matter! Join the UndocuSpartan Student Resource Center today for an event honoring Immigrant Day of Action as we stand in solidarity with immigrant communities.\n\n\u{1F4C5} October 27 | 4\u20136 PM\n\u{1F4CD} MOSAIC Cross-Cultural Center\n\nAll SJSU students are welcome!",
      takenAt: "2026-10-27T16:20:59.000Z"
    },
    {
      handle: "sjsu_careercenter",
      host: "SJSU Career Center",
      shortcode: "DfAB4sxG3Tj",
      url: "https://www.instagram.com/p/DfAB4sxG3Tj/",
      caption: "Whether you are starting your very first r\xE9sum\xE9 or preparing for life after college, the SJSU Career Center is here for you. \nWe offer a number of free services for SJSU students and recent alumni to help pave the way of your chosen career path!\nIt\u2019s never too late to ask for help!\nClark Hall 140\nM-F. 9-4:30pm",
      takenAt: "2026-10-27T14:04:24.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "De_UdXtsvHu",
      url: "https://www.instagram.com/p/De_UdXtsvHu/",
      caption: "Don't end up like Divyansh \u{1F47B}, come to the NETS Halloween Social this Wednesday! \u{1F383}\n\nOctober 28th \u{1F36C} \n7:30pm - 9:00pm\nSU Meeting Room 2B\n\n#SJSU #NETS #HalloweenSocial #fy #HalloweenWeek",
      takenAt: "2026-10-27T07:27:56.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "De_CWJvlJMq",
      url: "https://www.instagram.com/p/De_CWJvlJMq/",
      caption: "Introducing our Fall 2026 Board of Directors\u2728",
      takenAt: "2026-10-27T04:49:10.000Z"
    },
    {
      handle: "sjsumarketing",
      host: "SJSU Marketing Association",
      shortcode: "De-rNgYJUZH",
      url: "https://www.instagram.com/p/De-rNgYJUZH/",
      caption: "Let\u2019s MAke the most out of it! \u{1F497}\n\nAll good things must come to an end, but let\u2019s make our last memories together count! Join us for our final mentorship event of the semester as we celebrate with a potluck, letter writing, games, and plenty of time to hang out one last time. \u{1FAF6}\n\nRSVP at the link in the bio. \u{1F4E9}",
      takenAt: "2026-10-27T01:28:02.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "De-pgqBgOm4",
      url: "https://www.instagram.com/p/De-pgqBgOm4/",
      caption: "Trust no one. Suspect everyone. \u{1F575}\uFE0F\n\nJoin us for our Imposters After Dark social where you can put your detective skills, deception, and teamwork to the test in a night filled with mystery, betrayal, and unexpected twists!\n\n\u{1F3AD} Bluff your way to victory\u2028\u{1F50E} Uncover the imposters\u2028\u{1F3C6} Outplay your friends\n\n\u{1F4C5} Date: Thursday, Oct 29\u2028\u23F0 Time: 6:00 - 7:30 PM\u2028\u{1F4CD} Location: BBC 004 + BBC courtyard \n\nMake sure to come out in your Halloween costumes! \u{1F383}\n\u2028\u{1F517} RSVP through the link in our bio!",
      takenAt: "2026-10-27T01:14:30.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "De-jo7IGYaz",
      url: "https://www.instagram.com/p/De-jo7IGYaz/",
      caption: "AI STACK RECAP! \n\nWhat an incredible turnout at our AI Stack event! A huge thank you to our amazing panelists for sharing their experiences, insights, and knowledge about the evolving world of AI and technology!\n\nWe\u2019re so grateful to everyone who joined us, asked questions, and made this event such a success! \u{1F4A1}\n\nStay tuned for more exciting events and opportunities with AI in Business! \n\n#AIinBusiness #AIStack #SJSU #ArtificialIntelligence",
      takenAt: "2026-10-27T00:20:51.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "De-do-tGTpV",
      url: "https://www.instagram.com/p/De-do-tGTpV/",
      caption: "Figuring out what roles at Peer Connections interest you? Learn about what our learning assistants do in this fun infographic! If you feel like you\u2019d be a good fit, we encourage you to apply! \u270D\uFE0F\n\n#sjsu #peerconnections",
      takenAt: "2026-10-26T23:28:26.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "De-XQg0klfF",
      url: "https://www.instagram.com/p/De-XQg0klfF/",
      caption: "We had fun Spooky Crafting today at Global Connections! \u{1F383}\u{1F480}\u{1F47B} Join us next week Monday (Nov. 2nd) for fun and games!",
      takenAt: "2026-10-26T22:32:40.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "De-OnsJErFC",
      url: "https://www.instagram.com/p/De-OnsJErFC/",
      caption: "The Piano Movers.  A baby grand for SWEENEY.",
      takenAt: "2026-10-26T21:17:11.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "De-KP8PsBdg",
      url: "https://www.instagram.com/p/De-KP8PsBdg/",
      caption: "\u{1F383} NETS Halloween Pumpkin Carving Social! \u{1F47B}\n\nTake a break from classes and midterms and join NETS for a fun and festive evening filled with pumpkin carving, games, prizes, a Halloween movie, and more! \u{1F578}\uFE0F\u2728\n\n\u{1F4C5} Wednesday, October 28\n\u23F0 7:00\u20139:30 PM\n\u{1F4CD} Student Union Meeting Room 2B\n\nPumpkins and carving supplies will be provided while supplies last. No carving experience is required\u2014just bring your creativity and come ready to have fun!\n\nEveryone is welcome, so bring your friends and celebrate Halloween with NETS! \u{1F9E1}\n\n\u{1F4DD} RSVP through the link in our bio:\nhttps://linktr.ee/sjsu.nets\n\n#SJSU #NETS #HalloweenSocial #fypage #HalloweenWeek",
      takenAt: "2026-10-26T20:39:03.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "De-J1koMT5Z",
      url: "https://www.instagram.com/p/De-J1koMT5Z/",
      caption: "\u{1F383}\u{1F47B} NETS Halloween Week Is Here! \u{1F47B}\u{1F383}\n\nJoin us for a week filled with delicious treats, fun activities, games, prizes, and spooky Halloween vibes!\n\n\u{1F369} Krispy Kreme Fundraiser\n\u{1F4C5} October 27\u201328\n\u23F0 11:00 AM\u20133:00 PM\n\u{1F4CD} 7th Street Plaza\n\nSupport NETS by stopping by and grabbing some doughnuts! Every purchase helps us continue providing workshops, projects, competitions, and events for the SJSU community.\n\n#SJSU #NETS #HalloweenWeek #HalloweenSocial #PumpkinCarving #KrispyKremeFundraiser #fypp",
      takenAt: "2026-10-26T20:35:27.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "De-EvQDhsuz",
      url: "https://www.instagram.com/p/De-EvQDhsuz/",
      caption: "\u{1F383}\xA1Hola Familia!\u{1F383}\n\nIt\u2019s that time of year! Come join us for a spooky time, meet new people, and paint some pumpkins of course!\u{1F383}\n\n\u{1F4CD}DMH 348\n\u{1F4C6} Thursday 10/29\n\u23F0 5:00 pm - 6:30 pm\n\nHope to see you all there!\u{1F90E}",
      takenAt: "2026-10-26T19:53:03.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "De-CcAUydct",
      url: "https://www.instagram.com/p/De-CcAUydct/",
      caption: "Halloween Social\n\nCelebrate Halloween with the AI/ML Club! Enjoy games, food, spooky vibes, and friendly competition while meeting fellow members!\n\n\u{1F4C5} Date: Wednesday, October 28 \n\u23F0 Time: 3:00 PM\u20135:00 PM \n\u{1F4CD} Location: Student Union, Meeting Room 1B (SU01)\n#sjsu #aiml #halloween #clubsocial #sjsuspartans",
      takenAt: "2026-10-26T19:30:46.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "De-BY9aSUPO",
      url: "https://www.instagram.com/p/De-BY9aSUPO/",
      caption: "Transformer Architecture and Agentic Coding\n\nHow does agentic coding actually work? Explore the Transformer architecture behind *Attention Is All You Need* (2017), learn about AI agents, and solve problems using OpenAI\u2019s agentic interfaces!\n\n\u{1F4C5} Date: Friday, October 30 \n\u23F0 Time: 12:00 PM\u20131:30 PM \n\u{1F4CD} Location: BBC 103\n\n#aiml #agenticai #sjsu #transformerarchitecture #coding",
      takenAt: "2026-10-26T19:21:38.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "De-AqKASEFb",
      url: "https://www.instagram.com/p/De-AqKASEFb/",
      caption: "From AI Research to Production: What Nobody Tells You About Building an AI Career\n\nMounika Kamsali Veera is a Senior Data Scientist at Walmart in Silicon Valley with more than eight years of experience spanning AI research, machine learning, and production AI at scale.\n\nIn this talk, Mounika will share her journey from AI research at IIIT Hyderabad to building large-scale machine-learning systems at Walmart and pursuing entrepreneurship by pitching an AI startup idea at TechCrunch Disrupt.\n\n\u{1F4C5} Date:Friday, November 6 \n\u23F0 Time: 12:00 PM\u20131:30 PM \n\u{1F4CD} Location: BBC 105\n#sjsu #aiml #career #walmart #datascience",
      takenAt: "2026-10-26T19:15:14.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "De9_zv5Ke2h",
      url: "https://www.instagram.com/p/De9_zv5Ke2h/",
      caption: "\u{1D400}\u{1D42D}\u{1D42D}\u{1D41E}\u{1D427}\u{1D42D}\u{1D422}\u{1D428}\u{1D427} \u{1D405}\u{1D40F}\u{1D412}!\n\n\u2727\u02D6\xB0\u{1F4F7} \u0F18 \u22C6\uFF61\nUpdate on our \u{1D40D}\u{1D40E} \u{1D401}\u{1D414}\u{1D403}\u{1D406}\u{1D404}\u{1D413} competition\u2026.We are \u{1D41E}\u{1D431}\u{1D42D}\u{1D41E}\u{1D427}\u{1D41D}\u{1D422}\u{1D427}\u{1D420} \u{1D42D}\u{1D421}\u{1D41E} \u{1D41D}\u{1D41E}\u{1D41A}\u{1D41D}\u{1D425}\u{1D422}\u{1D427}\u{1D41E}! Please submit your completed projects by \u{1D416}\u{1D41E}\u{1D41D}\u{1D427}\u{1D41E}\u{1D42C}\u{1D41D}\u{1D41A}\u{1D432}, \u{1D40E}\u{1D41C}\u{1D42D}\u{1D428}\u{1D41B}\u{1D41E}\u{1D42B} 28, 11:59 \u{1D40F}\u{1D40C}. \n\nPlease submit all projects in the drive link provided here, or in our bio! \n\nLink: https://drive.google.com/drive/folders/1hRLJLiD5lFxCJ-tDBUDtIsElotZH9blv\n\nReminder: \u{1D40D}\u{1D428} \u{1D401}\u{1D42E}\u{1D41D}\u{1D420}\u{1D41E}\u{1D42D} is a competition where members of FPS are only allowed to use what they have, \u{1D430}\u{1D422}\u{1D42D}\u{1D421}\u{1D428}\u{1D42E}\u{1D42D} \u{1D42C}\u{1D429}\u{1D41E}\u{1D427}\u{1D41D}\u{1D422}\u{1D427}\u{1D420} \u{1D41A} \u{1D42C}\u{1D422}\u{1D427}\u{1D420}\u{1D425}\u{1D41E} \u{1D41C}\u{1D41E}\u{1D427}\u{1D42D} \u{1D42D}\u{1D428} \u{1D41C}\u{1D42B}\u{1D41E}\u{1D41A}\u{1D42D}\u{1D41E} \u{1D41A}\u{1D427}\u{1D432} \u{1D420}\u{1D41E}\u{1D427}\u{1D42B}\u{1D41E} \u{1D428}\u{1D41F} \u{1D42C}\u{1D421}\u{1D428}\u{1D42B}\u{1D42D} \u{1D41F}\u{1D422}\u{1D425}\u{1D426}. If you\u2019re looking for more of a challenge, a \u{1D42B}\u{1D41A}\u{1D427}\u{1D41D}\u{1D428}\u{1D426} \u{1D428}\u{1D41B}\u{1D42C}\u{1D42D}\u{1D42B}\u{1D42E}\u{1D41C}\u{1D42D}\u{1D422}\u{1D428}\u{1D427} will be given to you by our officers. There is an \u{1D7D6}-\u{1D426}\u{1D422}\u{1D427}\u{1D42E}\u{1D42D}\u{1D41E} \u{1D41C}\u{1D41A}\u{1D429} on films, so be sure to watch out! \n\nWe will be screening them along with a costume contest for Halloween on \u{1D40E}\u{1D41C}\u{1D42D}\u{1D428}\u{1D41B}\u{1D41E}\u{1D42B} \u{1D7D0}\u{1D7D7}\u{1D42D}\u{1D421} @ \u{1D7D4} \u{1D40F}\u{1D40C}, during our meeting.\n\nMay the odds be ever in your favor, FPS! \n\u2727\u02D6\xB0\u{1F4F7} \u0F18 \u22C6\uFF61",
      takenAt: "2026-10-26T19:07:50.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "De9_e-Dj81h",
      url: "https://www.instagram.com/p/De9_e-Dj81h/",
      caption: "Thank you to everyone who joined us for this amazing event with IMA, FMA, and Ascend! We hope you enjoyed building meaningful career relationships with us. If you did make sure to follow our instagram accounts for more\u{1F499}\nInterested in getting more involved? Join FMA and become part of a community focused on professional growth, networking, and opportunity! Link is in our BIO\n#SJSU #FMA #Student #fyp #spartan\n@imasjsu @ascendsjsu",
      takenAt: "2026-10-26T19:04:55.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "De97LfctphZ",
      url: "https://www.instagram.com/p/De97LfctphZ/",
      caption: "Friday was the annual Responsibility in AI Conference here at San Jose State University!\n\nWe heard from speakers who work in education, technology, research, startups and venture capital, and were able to ask them questions about what the future may hold.\n\nEngaging panels, amazing networking opportunities and free pizza, what more could we ask for?! \u{1F355} \n\n#sjsu #ideasclub #sjsubusiness #entrepreneurship",
      takenAt: "2026-10-26T18:33:50.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "De9yzZYRJv9",
      url: "https://www.instagram.com/p/De9yzZYRJv9/",
      caption: "If you\u2019re a new Fall 26\u2019 transfer student who\u2019s struggling to prepare for the upcoming Spring semester, we have the perfect presentation for you! \n\nJoin us virtually for a workshop to understand your registrations resources and tools \u2692\uFE0F \n\n\u{1F5D3}\uFE0FTuesday, October 27th\n\u23F1\uFE0F10AM-11AM\n\u{1F4CD}Virtual (Zoom) \n\nSign up using the QR code in the video or through the link in our Linktree to receive the Zoom link! Hope to see you there \u{1F49B}\u{1F499}",
      takenAt: "2026-10-26T17:15:06.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "De9nZzIGnse",
      url: "https://www.instagram.com/p/De9nZzIGnse/",
      caption: "Art, culture, and a free day downtown \u{1F3A8}\nSJSU students get FREE admission to the San Jos\xE9 Museum of Art with a valid Tower ID! Go explore, get inspired, and take advantage of one of the perks of being a Spartan \u{1F5BC}\uFE0F\u{1F499}\n#SJSU #Spartans #StudentDiscount #SanJose #art fyp for you",
      takenAt: "2026-10-26T15:34:30.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "De8TdIbRO4v",
      url: "https://www.instagram.com/p/De8TdIbRO4v/",
      caption: "Thank you to IBM, LF AI and Data, the Career Center, and everyone who joined us on October 19 at the Open Source AI: Building Reliable AI Systems! We had an incredible evening learning about open-source AI technologies, connecting with industry experts, and exploring opportunities to contribute to real-world AI projects!\n\nInterested in getting involved? Explore the event materials and learn how to contribute to Mellea, Granite, ASAGO, Bob, Docling, and LF AI & Data!\n\n\u{1F517} Event Materials: https://ibm.box.com/s/jwffd2ixnlqpi62mznipeaf1fyqkhvkn (or link in bio!)\n\n#SJSU #ResponsibleComputing #IBM #OpenSourceAI #ResponsibleAI",
      takenAt: "2026-10-26T03:26:17.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "De8S6c0xBdJ",
      url: "https://www.instagram.com/p/De8S6c0xBdJ/",
      caption: "Join us for an exclusive evening of executive insights, career exploration, leadership development, and professional networking!\n\nHear directly from corporate executives about their career journeys, leadership experiences, and advice for emerging professionals. The panel will be moderated by SJSU Provost Vincent Del Casino Jr., followed by an opportunity to network directly with executives and fellow Spartans!\n\nEvent Details:\n\u{1F4C5} Monday, November 2, 2026, 4:30 PM \u2013 6:30 PM, Clark Hall, Room 102 | Elevate Career Hub\n\u{1F454} Dress Code: Business Formal\n\u{1F355} Free Pizza Provided!\n\nOpen to all SJSU students and alumni, regardless of major or experience level!\n\nRSVP: Link in bio or https://docs.google.com/forms/d/e/1FAIpQLScZtMp62dIN4HsVKNyAh0B9akJoGp_TEWj7u2XlRewd3_Tjyw/viewform",
      takenAt: "2026-10-26T03:17:20.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "De8Dh59GBas",
      url: "https://www.instagram.com/p/De8Dh59GBas/",
      caption: "Our Product Showdown workshop brought everyone together to collaborate, innovate, and showcase their ideas! \u{1F4A1}\u{1F680}\n\nFrom identifying real-world problems to developing creative solutions, participants had the opportunity to put their product thinking skills to the test and bring their ideas to life. Through teamwork, brainstorming, and hands-on collaboration, everyone took a step toward building products that make a difference! \u2728\n\nA huge thank you to everyone who participated and made this event a success! \u{1F499}\n\nStay tuned for more opportunities to learn, connect, and grow with MISA! \u{1F499}",
      takenAt: "2026-10-26T01:01:48.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "De7zDOyScna",
      url: "https://www.instagram.com/p/De7zDOyScna/",
      caption: "\xA1Hola Familia! Here\u2019s a little recap of our time at the pumpkin patch, great way to celebrate the fall season! \u{1F383}\u{1F90E}\u{1F9E1}",
      takenAt: "2026-10-25T22:42:58.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "De7aJ-4hyxF",
      url: "https://www.instagram.com/p/De7aJ-4hyxF/",
      caption: "Join PMA\u203C\uFE0F\u2026and come to our Haunted Shark Tank on Tuesday! \u{1F440}\u{1F608}\u{1F47B}\n#productmanagement #sjsu #pmclubsjsu",
      takenAt: "2026-10-25T19:00:13.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "De53qgUxTwq",
      url: "https://www.instagram.com/p/De53qgUxTwq/",
      caption: "SANCTUARY CITY.  That\u2019s a wrap!!!",
      takenAt: "2026-10-25T04:40:41.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "De5Rr9OB_58",
      url: "https://www.instagram.com/p/De5Rr9OB_58/",
      caption: "Calling all innovators! \u{1F4A1}\n\nPut your product management and pitch skills to the test with a seasonal twist at Haunted Shark Tank. Brainstorm, build, and present spooky product concepts in a fun, collaborative environment.\n\n\u{1F5D3}: Tuesday, October 27\n\u{1F555}: 6:00 \u2013 7:00 PM\n\u{1F4CD}: BBC 120\n\nSee you there!",
      takenAt: "2026-10-24T23:07:51.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "De5M105SW97",
      url: "https://www.instagram.com/p/De5M105SW97/",
      caption: "Volume warning ahead! \u{1F605} Our Pro-Staff are SCREAMING for you to apply! One week left! Link in bio!\n\n#sjsu #peerconnections #funny",
      takenAt: "2026-10-24T22:26:28.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "De46Imxhm8p",
      url: "https://www.instagram.com/p/De46Imxhm8p/",
      caption: "Join us for a masterclass in personal branding on October 29 with Gallo as well an overcrowd of their internship program!\n\nEnjoy a mocktail bar while you'll be hearing directly from E&J Gallo representatives on exactly what they are looking for in an employee. We hope to see you there, so RSVP as soon as you can! #fma #workshop",
      takenAt: "2026-10-24T19:46:23.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "De3lTr5x5Xm",
      url: "https://www.instagram.com/p/De3lTr5x5Xm/",
      caption: "SANCTUARY CITY.  LAST  SHOW OCT 24 730",
      takenAt: "2026-10-24T07:22:34.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "De3iQOymxGE",
      url: "https://www.instagram.com/p/De3iQOymxGE/",
      caption: "\u{1F4B8} FINLIT FRIDAYS: THINK BEFORE YOU SPEND! \u{1F6CD}\uFE0F\nEver bought something you didn\u2019t really need just because it was on sale? Impulse purchases may seem small, but they can add up quickly!\n\u2728 This week\u2019s FinLit Friday is all about making smarter spending decisions! From following the 24-hour rule to setting spending limits, small changes can make a BIG difference in your savings. \u{1F4B0}\nRemember: Just because you can buy it doesn\u2019t mean you need it! \u{1F49B}\u{1F499}\n#FinLitFridays #FinancialLiteracy #SmartSpending #MoneyManagement #FMA",
      takenAt: "2026-10-24T06:54:04.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "De3N7TvzfNO",
      url: "https://www.instagram.com/p/De3N7TvzfNO/",
      caption: "10/22: The California Faculty Association (CFA) and SJSU Faculty went on strike against California State University (CSU) Chancellor Mildred Garc\xEDa for higher pay and job security. The protest was held outside Signia Hilton Hotel close to San Jose State, where Chancellor Garc\xEDa was holding a conference inside.\n#protest #csu #updatenews #union #strike",
      takenAt: "2026-10-24T04:02:53.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "De3Kkd9x9qR",
      url: "https://www.instagram.com/p/De3Kkd9x9qR/",
      caption: "SANCTUARY CITY  Final show Oct 24\nHal Todd Studio Theatre",
      takenAt: "2026-10-24T03:28:41.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "De23y6bh4WE",
      url: "https://www.instagram.com/p/De23y6bh4WE/",
      caption: "\xA1Hola Familia! Here\u2019s what you missed last week\u{1F31F}\n\nWe collaborated with a new business club on campus called Ascend! Huge thank you to everyone who was able to join us. Be sure to follow us to keep up with future events\u{1F499} #sjsu #lbsa",
      takenAt: "2026-10-24T00:44:46.000Z"
    },
    {
      handle: "shrmatsjsu",
      host: "SHRM at SJSU",
      shortcode: "De2kyNzy6jd",
      url: "https://www.instagram.com/p/De2kyNzy6jd/",
      caption: "\u{1F47B} Something spooky is happening at SHRM@SJSU\u2026 \u{1F383}\n\nThink you can handle the night? \u{1F440}Get your costumes on and come ready to meet new people, have some fun, and maybe get a little competitive. There may be a few surprises waiting for you\u2026 but you\u2019ll have to show up to find out. \u{1F578}\uFE0F\n\nBring your friends, bring your Halloween spirit, and come see what we have planned!\xA0\n\n\u{1F4CB} Register link in our bio \n\n\u{1F4C5} Thursday, October 30th\n\u23F0 6 - 7:15pm\n\u{1F4CD} DMH 234\n\u{1F455} Casual/Costumes encouraged\n\n\u{1F383} You won\u2019t want to miss this one. Costumes encouraged! Come ready for a spooky night! \u{1F577}\uFE0F\n\nNote: You must be a paid SHRM member to attend or pay a fee of $2 at the door if you are a non-member!",
      takenAt: "2026-10-23T21:57:13.000Z"
    },
    {
      handle: "sjsuupdatenews",
      host: "SJSU Update News",
      shortcode: "De2WEn1yTbE",
      url: "https://www.instagram.com/p/De2WEn1yTbE/",
      caption: "Want to know what\u2019s on your ballot this upcoming election. Keep watching Stop for Props with Dhwani Adhishesh!\n#sjsu #broadcastnews #updatenews #election \n\u{1F3A5}\u270D\uFE0F: @dhwani.divesin",
      takenAt: "2026-10-23T19:51:11.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "De2PJewvEdK",
      url: "https://www.instagram.com/p/De2PJewvEdK/",
      caption: "\u{1F47B}\u{1F383} Get into the Halloween spirit with ISSS! \u{1F578}\uFE0F\u{1F987}\n\nJoin us for Spooky Crafting & Ghost Stories for an afternoon of Halloween crafts, spooky stories, and fun with fellow Spartans! Whether you love getting creative or enjoy a good ghost story, we\u2019d love to see you there!",
      takenAt: "2026-10-23T18:47:56.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "De2LB2utP94",
      url: "https://www.instagram.com/p/De2LB2utP94/",
      caption: "Want to represent Lurie College at Fall the\n2026 Commencement? \u{1F440}\u{1F499}\u{1F49B}\n\nWe\u2019re looking for ONE student speaker to represent our graduating Spartans on December 16 at 7:00 PM!\n\n\u2728Share your journey\n\u{1F3A4}Celebrate your fellow graduates\n\u{1F499}Make your voice heard\n\nSubmit a 3-4 minute video of your speech (600 words max)!\n\n\u{1F4C5}DEADLINE: Monday, November 9, at 5 PM\n\nTag a friend who should apply or apply now through the link below! \u{1F517}\n\nhttps://forms.gle/EiPFoNGxdgjaCtzG7\n\n#SJSULurie #LurieCollege #SJSU\n#SJSUGrad #Commencement",
      takenAt: "2026-10-23T18:21:42.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "De2BIblGgP7",
      url: "https://www.instagram.com/p/De2BIblGgP7/",
      caption: "Figuring out what roles at Peer Connections interest you? Learn about what our academic peer mentors do in this fun infographic! If you feel like you\u2019d be a good fit, we encourage you to apply! \u270D\uFE0F\n\n#sjsu #peerconnections",
      takenAt: "2026-10-23T16:45:24.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "De05GrCs2HT",
      url: "https://www.instagram.com/p/De05GrCs2HT/",
      caption: "Get ready with NETS for SpartHill Hacks! Buying snacks for over 600 students \u{1F36C}\u{1F37F}\n\n#hackathon #netssjsu #sjsu #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F",
      takenAt: "2026-10-23T06:17:20.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "De0LlTMBZvO",
      url: "https://www.instagram.com/p/De0LlTMBZvO/",
      caption: "Ready to work smarter, not harder?\n\nJoin AI in Business for our Workflow Automations & AI Agents Workshop! \n\nLearn how AI agents can plan, take action, and automate workflows to make everyday tasks more efficient! \n\n\u{1F3A4} Workshop Led By: Jalal Sarabadani, Assistant Professor of Information Systems at SJSU\n\n\u{1F4C5} Tuesday, October 27th\n\u{1F555} 6:00 PM \u2013 8:00 PM\n\u{1F4CD} HGH 118\n\nWhether you\u2019re new to AI or looking to expand your knowledge, this is a great opportunity to explore the power of AI automation!\n\n\u{1F517} Make sure to RSVP through the Linktree in our bio to secure your spot!\n\n#AIinBusiness #SJSU #AIB #WorkflowAutomation",
      takenAt: "2026-10-22T23:39:23.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "De0HV1rBam9",
      url: "https://www.instagram.com/p/De0HV1rBam9/",
      caption: "Hey everyone! \u{1F496} Join Women in Business (WIB), the Management Information Systems Association (MISA), and the Spartan Real Estate Association (SREA) for our Business & Bites: Club Networking Mixer! \u{1F465}\n\nLooking to meet new people, expand your network, or get more involved on campus? \u{1F3EB} Come enjoy an afternoon of great conversations, new connections, and free food! This is a fun, casual opportunity to connect with fellow Spartans \u{1F91D} , learn more about different student organizations, and build friendships beyond your major. Whether you're interested in business, technology, real estate, or simply want to meet new people, there's something for everyone!\n\nDate: Monday, October 26th\nTime: 4:00\u20135:30 PM\nLocation: BBC Courtyard\n\u{1F355} Free pizza, desserts, and drinks!\n\nEvent is FREE and open to all SJSU students! Bring a friend, grab a bite, and make some new connections. We look forward to seeing you there! \u{1F60A}\n\nRSVP using the QR code or the link in our bio!",
      takenAt: "2026-10-22T23:01:14.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "De0AYukBajf",
      url: "https://www.instagram.com/p/De0AYukBajf/",
      caption: "POV: You\u2019re practicing with LBSA\u2019s soccer team \u26BD\uFE0F\u{1F440}\n\n\u26BD\uFE0F A little glimpse into our great soccer team!!! \u{1FAF6}",
      takenAt: "2026-10-22T22:01:16.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DezzeMIyPI0",
      url: "https://www.instagram.com/p/DezzeMIyPI0/",
      caption: "\u{1F440}\u{1F499}\u{1F49A}\n\nCome to our Study/Intern Abroad panel and build your global perspective\u{1F30E}",
      takenAt: "2026-10-22T20:08:49.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "Dezp0CSvNjK",
      url: "https://www.instagram.com/p/Dezp0CSvNjK/",
      caption: "Being a college student is more than just prioritizing your education, but also about growing your financial independence! \u{1F57A}\nIf you missed our collaboration with the BLOC, join us to learn about money saving tools and strategies to help take charge of your finances \u{1F4B5}\u2728 \n\n\u{1F4CD} SSC 602\n\u{1F5D3}\uFE0F Tuesday, October 27th\n\u23F0 3:00 p.m.",
      takenAt: "2026-10-22T18:49:51.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DezZ-5RhwT_",
      url: "https://www.instagram.com/p/DezZ-5RhwT_/",
      caption: "Thank you to everyone who joined us for our Careers in Sports panel! \u{1F49B}\n\nWe kicked off with a networking session and heard from an amazing group of professionals about their beginning, work, and struggles across the sports industry.\n\nThank you to our panelists for sharing your experiences and answering students\u2019 questions. A special thank you to Dr. Mari Fuentes-Martin for moderating the conversation!\n\nWe\u2019re grateful for everyone who came, connected, and joined the discussion. Stay tuned for our Halloween Social next week! \u26A1",
      takenAt: "2026-10-22T16:25:35.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DezYSC8lMMC",
      url: "https://www.instagram.com/p/DezYSC8lMMC/",
      caption: "What does assistive technology mean to a future inclusive classroom teacher?\n\nHear from Lurie College student Yathana Thamotharom \u201927 as they share why hands-on experience with assistive technology is so important to preparing for a future classroom.\n\nThrough SJSU\u2019s Spartan Sprint October Rally, you can help equip future teachers with the tools and experiences they need to create more inclusive, accessible learning environments.\n\n10 days ! Make a gift or share the campaign through October 31.\n\nShare the word with friends or give today at the link in bio!\n\n#SJSULurie #LurieCollege #SJSU #SpartanSprint #OctoberRally #AssistiveTechnology #InclusiveEducation",
      takenAt: "2026-10-22T16:10:39.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DexvNF0DzXr",
      url: "https://www.instagram.com/p/DexvNF0DzXr/",
      caption: "Midterms are in full swing! \n\n\u{1F4DA} Hear how Spartans are preparing, staying focused, and taking care of themselves through one of the busiest times of the semester. \n\nHow are you getting through YOUR midterms?\n\n#SJSULurie #LurieCollege #SJSU #SpartanLife #Midterms #CollegeLife #StudentSuccess #StudyTips #SJSUStudents",
      takenAt: "2026-10-22T00:52:28.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DexnhlMI7CP",
      url: "https://www.instagram.com/p/DexnhlMI7CP/",
      caption: "\u{1F4CA} Ready to add R to your data science toolkit?\n\nJoin NSDC for Intro to R, a beginner-friendly workshop designed to help you get started with one of the most widely used languages in data science, statistics, research, and analytics!\n\n\u{1F4C5} October 27th\n\u23F0 6:00 PM \u2013 7:15 PM\n\u{1F4CD} Zoom\n\nNo prior R experience needed \u2014 just bring your curiosity! \u{1F680}\n\nScan the QR code to register using your SJSU email.\n\n#NSDC #SJSU #DataScience #RProgramming #LearnR",
      takenAt: "2026-10-21T23:45:56.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "Dexh7pSj4Sa",
      url: "https://www.instagram.com/p/Dexh7pSj4Sa/",
      caption: "Tired of having your name mispronounced, shortened, or treated like it does not matter? \n\nJoin us for an open conversation about names, identity, culture, and belonging. Create a personalized keepsake while celebrating the story behind your name. \n\n\u{1F4CD}Mosaic Cross Cultural Center \n\u{1F4C5} Thursday, October 29th\n\u23F0 4:30 pm- 6:00 pm",
      takenAt: "2026-10-21T22:55:49.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "Dexbg4jPhO9",
      url: "https://www.instagram.com/p/Dexbg4jPhO9/",
      caption: "\u{1F30E}\u2708\uFE0F Thinking of studying or interning abroad? \u{1F30D}\n\nJoin IBA for our Study & Intern Abroad Panel! Hear about international opportunities, gain insights from our speakers that we will reveal later, and learn how you can take your academic and professional journey beyond borders. \u{1F4BC}\u{1F4DA}\n\n\u2728 Don\u2019t miss the chance to explore new opportunities and expand your global perspective!\n\n\u{1F4CD} BBC 122\n\u{1F4C5} October 29th, 6PM\n\nWe can\u2019t wait to see you there!\u{1F499}\u{1F49A}\n\n#SJSU #IBA #InternationalBusiness #studyabroad",
      takenAt: "2026-10-21T22:00:08.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DexNjdMEqkf",
      url: "https://www.instagram.com/p/DexNjdMEqkf/",
      caption: "Figuring out what roles at Peer Connections interest you? Learn about what our tutors do in this fun infographic! If you feel like you\u2019d be a good fit, we encourage you to apply! \u270D\uFE0F\n\n#sjsu #peerconnections",
      takenAt: "2026-10-21T19:57:44.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "DexKVDcj9dl",
      url: "https://www.instagram.com/p/DexKVDcj9dl/",
      caption: "Surveillance goes beyond cameras. From Flock to facial recognition and digital tracking, swipe through to learn about the different methods of surveillance. \u{1F933}\u{1FAAA}\n\nJoin us Thursday, October 22nd, from 4:30\u20136:00 PM at the Mosaic Cross Cultural Center to continue the conversation!",
      takenAt: "2026-10-21T19:29:34.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DexGaH3D3cn",
      url: "https://www.instagram.com/p/DexGaH3D3cn/",
      caption: "Spooks, Socials & Solving! \u{1F578}\uFE0F\u{1F497}\n\nGhouls just want to have fun (and network!). Join WIB for a spooky-cute Halloween social filled with fun puzzles, new connections, and a little friendly competition!\n\nPut your problem-solving skills to the test and get ready for a night of tricks, treats, and new connections. Show up in your cutest or spookiest Halloween fit and get ready to compete, connect, and make some spooky-season memories! RSVP to join the fun! \u{1F577}\uFE0F\u{1F48C}",
      takenAt: "2026-10-21T18:55:18.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "Dew_MQRGAKv",
      url: "https://www.instagram.com/p/Dew_MQRGAKv/",
      caption: "\u{1F6A8} 1 DAY TO GO \u2014 SPARTHILL HACKS!\u{1F4BB}\u26A1\n\nThe countdown is ON! \u{1F525} SpartHill Hacks is almost here, and we can\u2019t wait to see everyone come together to build, innovate, and create! \u{1F9D1}\u200D\u{1F4BB}\u{1F680}\n\n\u{1F4E9} CHECK YOUR EMAILS! Make sure to look out for updates regarding:\n\u2705 Confirmed registration\n\u23F3 Waitlist status and updates\n\u{1F4C5} Event timeline and schedule\n\u2753 FAQs and important event details\n\u{1F4E2} Any last-minute announcements\n\nMake sure to check your inbox (and spam/junk folder!) so you don\u2019t miss any important information before the event.\n\nGet ready to collaborate, build something awesome, and make the most of SpartHill Hacks! \u{1F499}\n\n\u{1F310} Website: https://sparthill-hack-2026.vercel.app/\n\nONE DAY LEFT. ARE YOU READY?\u{1F525}\n\n#SpartHillHacks #Hackathon #SJSU #Spartans #TechCommunity #Innovation #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F",
      takenAt: "2026-10-21T17:52:14.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "Dew0yyIg46c",
      url: "https://www.instagram.com/p/Dew0yyIg46c/",
      caption: "From Student \u2192 Data Analyst \u{1F9D1}\u200D\u{1F4BB}\u{1F4CA}\n\nJoin Spartan Analytics for a speaker panel featuring three SJSU alumni, sharing their career journeys, industry experiences, and advice on breaking into analytics and data science! \n\n\u{1F3A4} Meet Our Speakers:\n\n\u2022 Jimmy Nguyen \u2014 Advanced Analytics, Airbnb \n\u2022 Ishika Mutti \u2014 Revenue Enablement Analytics & Measurement Analyst, Adobe\n\u2022 Thanh Huyen Le \u2014 Data Analyst, Cisco\n\n\u203C\uFE0F LOCATION CHANGED TO DMH 150 \u203C\uFE0F\n\n\u{1F4C5} Wednesday, October 21, 2026\n\u23F0 6:00 \u2013 7:00 PM\n\u{1F4CD} DMH 150\n\nRSVP now, link in our bio!\n\n#sjsu #datascience #sjsunetwork #sjsuclub",
      takenAt: "2026-10-21T16:21:36.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "DeveG1qFNgi",
      url: "https://www.instagram.com/p/DeveG1qFNgi/",
      caption: "\u{1D5DB}\u{1D5D8}\u{1D5DF}\u{1D5DF}\u{1D5E2} \u{1D5D9}\u{1D5E3}\u{1D5E6}!\n\n\u2500\u2500\u2500\u2500\u2500\u2500 \u22C6\u22C5\u2606\u22C5\u22C6 \u2500\u2500\u2500\u2500\u2500\u2500\nHope everyone enjoyed the last meeting and had a good weekend! \n\nThis week, our meeting is another fun one for you to create something with your fellow peers! We are doing \u{1D7CF} \u{1D40B}\u{1D422}\u{1D427}\u{1D41E}, \u{1D7CF} \u{1D40F}\u{1D42B}\u{1D428}\u{1D429}, where members will be split into groups and given specific times to brainstorm, record, and edit based on the line and prop they are given! This time, we are also introducing \u{1D7CF} \u{1D428}\u{1D41B}\u{1D42C}\u{1D42D}\u{1D42B}\u{1D42E}\u{1D41C}\u{1D42D}\u{1D422}\u{1D428}\u{1D427}, and this will be a certain camera angle that you have to implement in your film! \n\nThis meeting is one you won\u2019t want to miss! Join us this \u{1D413}\u{1D421}\u{1D42E}\u{1D42B}\u{1D42C}\u{1D41D}\u{1D41A}\u{1D432}, \u{1D40E}\u{1D41C}\u{1D42D} \u{1D7D0}\u{1D7D0} @\u{1D403}\u{1D40C}\u{1D407} \u{1D7D1}\u{1D7D3}\u{1D7D3}, \u{1D41A}\u{1D42D} \u{1D7D4}:\u{1D7CE}\u{1D7CE} \u{1D40F}\u{1D40C}.\n\nAll are welcome to join; major does not matter!\n\n\u2757\u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FF}\u{1D5F2}: DMH 355 \n\u2757\u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FB}: Thursday, October 22nd, @6:00 PM\n\u2757\u{1D5D5}\u{1D5FF}\u{1D5F6}\u{1D5FB}\u{1D5F4}: Yourself & Friends & A Laptop/Device to Edit With.\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
      takenAt: "2026-10-21T03:43:54.000Z"
    },
    {
      handle: "film.and.theatre.sjsu",
      host: "School of Film, Theatre, and Dance",
      shortcode: "DevZ5IBm5IP",
      url: "https://www.instagram.com/p/DevZ5IBm5IP/",
      caption: "SANCTUARY CITY final dress.  Opens Oct 21  Hal Todd Studio Theatre.  @sjsu_theatre @sjsu @sjsu.ha",
      takenAt: "2026-10-21T03:07:05.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DevVeGthF1g",
      url: "https://www.instagram.com/p/DevVeGthF1g/",
      caption: "Our project teams are sharing technical overviews of their work this semester! Projects include ensemble applications in cybersecurity, Minecraft agents,  EEG  to image translation, and more. \n\n\u{1F4C5} Date: Wednesday, October 21st \n\u23F0 Time: 3:00 PM - 4:30 PM \n\u{1F4CD} Location: SU Room 2B\n\n\u{1F4C5} Date: Thursday, October 22nd \n\u23F0 Time: 1:30 PM - 2:30 PM \n\u{1F4CD} Location: SU Room 2B\n\n#ai#aiml#projects #aimlclub #sjsu",
      takenAt: "2026-10-21T02:28:29.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DevI3xVJCB-",
      url: "https://www.instagram.com/p/DevI3xVJCB-/",
      caption: "\u{1F44B} \xA1Hola Familia! \u{1F44B}\n\n\u{1F6A8} THIS THURSDAY\u{1F6A8}\n\n\u{1F3E6} We are having a Tax and Audit Case Study with Bakertilly! Here you will learn hands on perspectives for business challenges on the tax and financial sphere! \n\n\u23F0OCTOBER 22 2026, 5-6:30PM\n\u{1F4CD}SU 4B \n\u{1F454}BUSINESS CASUAL\n\u{1F355} FOOD PROVIDED!",
      takenAt: "2026-10-21T00:43:18.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DevJP0ax1D1",
      url: "https://www.instagram.com/p/DevJP0ax1D1/",
      caption: "Two words: SWEATER. WEATHER.\n\n(Finally!)\n\nStay warm, Spartans!\n\n#SweaterWeather #SJSULurie #LurieCollege #SJSU #LCOE #Fall",
      takenAt: "2026-10-21T00:42:03.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "Deu7PSjFYIr",
      url: "https://www.instagram.com/p/Deu7PSjFYIr/",
      caption: "What is it like to represent Lurie College at commencement? \u{1F393}\n\nHear from three former Lurie College student speakers as they reflect on their experiences, the meaning of sharing their stories, and what the opportunity meant to them.\n\nApplications are now open for one student speaker to represent our Fall 2026 graduating students at the Lurie College Commencement Ceremony on Wednesday, December 16, at 7:00 p.m.\n\nSubmit a 3- to 4-minute video of you reciting your speech, no more than 600 words, by Monday, November 9, at 5:00 p.m.\n\nApply today by visiting: https://forms.gle/EiPFoNGxdgjaCtzG7 or the link in bio by the deadline!\n\n #LurieCollege #SJSU #SJSUCommencement #SJSUGrad #CollegeGraduation #StudentSpeaker #FutureSpartans #SJSULurie #StudentVoices",
      takenAt: "2026-10-20T22:39:59.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DeuzwBtjBJQ",
      url: "https://www.instagram.com/p/DeuzwBtjBJQ/",
      caption: 'EVENT UPDATE: Our upcoming Wednesday, 10/21 listening session has been CANCELLED.\n\nBUT Dean Sanogo is still interested in your feedback! \n\nMake you opinions heard! Share your thoughts and insights by reaching out via email to: luriecollege@sjsu.edu\n\nWhen emailing your feedback please use the subject line: "TED/SPED Listening Session Feedback"\n\n#SJSULurie #LurieCollege #SJSU #MakeYourVoiceHeard #StudentVoice #SpecialEducation #TeacherEducation #SPED #TED #LCOE #ListeningSessions',
      takenAt: "2026-10-20T21:33:55.000Z"
    },
    {
      handle: "sjsulurie",
      host: "Lurie College of Education",
      shortcode: "DeuvX_Pl12z",
      url: "https://www.instagram.com/p/DeuvX_Pl12z/",
      caption: "Interested in preparing to support young children with disabilities? Project EXCELL is recruiting its inaugural cohort of scholars for Spring 2027! \u{1F393}\u2728\n\nProject EXCELL prepares candidates for the Mild to Moderate Support Needs Education Specialist Credential and Added Authorization in Early Childhood Special Education.\n\nScholars will receive additional training and support in developmentally appropriate literacy instruction, along with cohort meetings, Speaker Series events, mini professional development sessions, and a summer practicum through Camp EXCELL.\n\nJoin us for an upcoming Info Session this Friday, October 23, to learn more about Project EXCELL, the scholar experience, and how to apply.\n\n\u{1F4C5} Info Session: Friday, October 23\n\u23F0 Time: 4:00 pm\n\u{1F4CD}ZOOM Link: https://ow.ly/THeZ50ZZvZ0\n\nReminder: The Cal State Apply application deadline is November 1, 2026.\n\nLearn more about Project EXCELL and register for the Info Session at the link in bio!\n\n#SJSULurie #LurieCollege #SJSU #SpecialEducation #EarlyChildhoodEducation #TeacherPreparation #FutureEducators #ProjectEXCELL #SPED",
      takenAt: "2026-10-20T20:55:53.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DeuTLL-GgT7",
      url: "https://www.instagram.com/p/DeuTLL-GgT7/",
      caption: "\u{1F680} WE\u2019RE GETTING CLOSE\u2014ARE YOU READY?\n\nSpartHill Hacks 2026 is only 2 days away! \u{1F331}\u{1F4A1}\n\nGet ready for a free 30+ hour hackathon focused on AI for Sustainable Impact, featuring workshops, mentorship, networking, project showcases, prizes, and five exciting impact tracks! \u{1F3C6}\n\n\u{1F4C5} October 23\u201324, 2026 \n\u{1F4CD} SJSU Spartan Complex (SPX)\n\nRegistration is closing soon\u2014sign up now! \nhttps://sparthillhack2026.vercel.app/\n\n#SpartHillHacks #SJSU #Hackathon #AI #Innovation #fyp\u30B7\u309Aviral\u30B7fyp\u30B7\u309A",
      takenAt: "2026-10-20T16:49:08.000Z"
    },
    {
      handle: "undocuspartans",
      host: "UndocuSpartan Resource Center",
      shortcode: "DeuJ8X4G5xc",
      url: "https://www.instagram.com/p/DeuJ8X4G5xc/",
      caption: "Join the UndocuSpartan Student Resource Center for an afternoon of creativity, reflection, and community! \nNo art or writing experience needed!\n\n\u{1F4C5} October 27 | 4\u20136 PM\n\u{1F4CD} MOSAIC Cross Cultural Center\n\nAll SJSU students are welcome!",
      takenAt: "2026-10-20T15:28:28.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DetFlXflHCV",
      url: "https://www.instagram.com/p/DetFlXflHCV/",
      caption: "This week, we learned about investing, compound interest, budgeting, and making smart financial decisions! \u{1F4C8}\u{1F4B0} We also explored the importance of networking and building skills for career success. A huge thank you to Professor Faulkner for sharing his valuable insights and advice with us! \n#FMA #FinancialLiteracy #Investing #Networking #WeeklyRecap",
      takenAt: "2026-10-20T05:31:08.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "Des43VCm8Fz",
      url: "https://www.instagram.com/p/Des43VCm8Fz/",
      caption: "\u{1F680} RCC x Phygtl Project Intern Positions Open!\n\nLooking for an opportunity to gain hands-on experience, work on meaningful projects, and build your skills? We\u2019re excited to open applications for RCC x Phygtl! \u2B50\uFE0F\n\nStudents will test Lana as real users, find data and insights about how it works, and review how it handles privacy, fairness and accuracy, with a chance to propose changes to the actual codebase. This is a chance to gain a hands-on way to apply responsible computing to a live AI product. \u{1F916}\n\n\u{1F4CC} Positions Available: \nProduct Research Lead\nProduct Research Analyst\nUI/UX Researcher\nAI Engineer\n\nExplore, find the opportunity that\u2019s right for you, and apply! More information in bio\u2728\n\n\u{1F517} Application link: https://docs.google.com/forms/d/e/1FAIpQLSfDYt63td4elkFG4WoAu8N42m1m8Y8K_5CQqOTH27Ijh7H5yQ/viewform\n\nApplications Close: Sunday October 25th, 2026 at 11:59 PM PT\n\n#rcc #sjsu #intern #aisjsu #apply",
      takenAt: "2026-10-20T03:39:59.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DesqAQNMMTt",
      url: "https://www.instagram.com/p/DesqAQNMMTt/",
      caption: "\u{1F499} Thank You Verkada for the Tech Talk! \u{1F4BB}\n\nHuge thank you to Verkada for coming out and speaking with NETS and SCE! \u{1F64C}\n\nOur members got to learn about Verkada\u2019s products, explore internship opportunities, and hear firsthand experiences from interns about working in the tech industry! \u{1F680}\n\nWe appreciate the Verkada team for sharing their insights and connecting with our members!\n\n#SJSUNETS #SJSU #SCE #Verkada #fypreels\u30B7\u309Aviral\u30B7",
      takenAt: "2026-10-20T01:31:04.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DesZxoAGVB6",
      url: "https://www.instagram.com/p/DesZxoAGVB6/",
      caption: "Feeling overwhelmed by Midterms? Needing an appointment ASAP? Fear not: drop-ins are available for certain classes! Swipe to see the options available and how you can book a drop-in! \u{1F4DA}\u2728\n\n#sjsu #peerconnections",
      takenAt: "2026-10-19T23:08:20.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DesS2TUgaDu",
      url: "https://www.instagram.com/p/DesS2TUgaDu/",
      caption: "WEB SCRAPING WITH AI RECAP \u{1F49C}\u{1F49B}\n\nThank you to everyone who joined us for our Web Scraping with AI workshop! We loved seeing everyone come together to learn, collaborate, and explore new ways to use AI.\n\nStay tuned for more exciting events and opportunities with AIB! \n\n#AIBSJSU #WebScraping #ArtificialIntelligence #SJSU #AIinBusiness",
      takenAt: "2026-10-19T22:07:48.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DesR7DzgUP_",
      url: "https://www.instagram.com/p/DesR7DzgUP_/",
      caption: "\u{1F4F8} **NETS WEEKLY RECAP! \u{1F499}**\n\nAnother week of learning, collaboration, and building connections at SJSU! \u{1F680}\n\nHere's a look at what we've been up to:\n\n\u{1F4BB} Cyber Workshop\n\u{1F310} CCNA 2 Workshop\n\u{1F91D} Advising Workshop\n\u{1F3A4} Verkada Talk\n\nHuge thanks to everyone who joined us and helped make these events a success! \u{1F64C}\n\nStay tuned for more workshops, industry talks, and exciting opportunities coming up! \u{1F525}\n\n#SJSU #NETS #fyp\u30B7\u2764\uFE0F\u{1F49E}\u2764\uFE0F #Networking #Cybersecurity #Verkada #TechCommunity #SpartanLife #WeeklyRecap",
      takenAt: "2026-10-19T21:59:43.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "Der-scuv8qN",
      url: "https://www.instagram.com/p/Der-scuv8qN/",
      caption: "\u{1F383} Geared up for spooky season? Find RCC at Spartan Fright Night! \u{1F47B} \n\nJoin us for a thrilling evening filled with fun, games, prizes, free candy, and more! \u{1F36C}\u2728 Make sure to stop by our table to play our Human or AI?: Halloween Edition game and hang out with RCC! \n\n\u{1F4C5} October 26 | \u{1F555} 6\u20139 PM | \u{1F4CD} 7th St.\n\nBring your friends and come celebrate spooky season with us! \u{1F987} We can\u2019t wait to see you there! \u{1F49C}\u{1F499}\u{1FA77}\n\n#rcc #sjsu #sjsuevents #spartanfrightnight #responsiblecomputing",
      takenAt: "2026-10-19T19:13:49.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DerrxxgRBAB",
      url: "https://www.instagram.com/p/DerrxxgRBAB/",
      caption: "\u{1F4C5} Drop-In Advising for Spring 2027 Registration!\nNeed help getting ready to register? The H&A Student Success Center is holding virtual drop-in advising. No appointment needed.\n\n\u{1F5D3} Friday, Oct 30 & Friday, Nov 6\n\u23F0 9:30\u201311:30 AM & 1:30\u20133:30 PM\n\nCheck our website for links: https://www.sjsu.edu/ha-advising/index.php\n\n#SJSU #SpartanUp #SJSUAdvising",
      takenAt: "2026-10-19T16:28:05.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DeqB2NQgCdJ",
      url: "https://www.instagram.com/p/DeqB2NQgCdJ/",
      caption: "Do students at SJSU know what product management is? \u{1F440}\u{1F680}\n\nJoin PMA @ SJSU to learn more about product management where we host workshops, socials, and guest speaker events weekly. Open to all majors\u2014no membership fees! \u{1F525} \n\nSign up to be a member for FREE! Link in bio \u{1F517}\n\n#sjsu #productmanagement #collegeclub #bayarea",
      takenAt: "2026-10-19T01:01:21.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DenWRNAgKEt",
      url: "https://www.instagram.com/p/DenWRNAgKEt/",
      caption: "Craving something sweet? \u{1F36A} Support PMA at SJSU during our Insomnia Cookies Fundraiser! Stop by to treat yourself and support a great cause.\n\n\u{1F5D3} Date: Tuesday, October 20th\n\u23F0 Time: 12:00 PM \u2013 4:00 PM\n\u{1F4CD} Location: 7th Street\n\nBring your friends and come cure those afternoon sugar cravings! \u{1F64C}",
      takenAt: "2026-10-18T19:10:04.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DenWrH4Alrl",
      url: "https://www.instagram.com/p/DenWrH4Alrl/",
      caption: "Join us for our Data Analyst For A Day Workshop, where you\u2019ll work with your team to tackle a real-world data workflow! \n\n\u{1F4BB} From cleaning and analyzing data to creating visualizations and making recommendations, you\u2019ll collaborate to answer a key business question and see how data drives decision-making.\n\n\u{1F4C5} Thursday, October 22\n\u23F0 6:00 \u2013 7:30 PM\n\u{1F4CD} BBC 004\n\n\u{1F4BB} Don\u2019t forget to bring your laptop!\n\n\u{1F517} Register through the link in our bio.",
      takenAt: "2026-10-18T00:05:53.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DenHV8rhCBY",
      url: "https://www.instagram.com/p/DenHV8rhCBY/",
      caption: "Recruiting season is in full swing, but you don\u2019t have to prep alone! \u{1F91D}\n\nBring your resume and your best product mindset to our upcoming workshop. Whether you want to practice mock interview questions or fine-tune your resume bullet points, we\u2019ve got you covered.\n\n**time changed to 6-7pm**\n\n \u{1F4C5} : Tuesday, Oct 20 @ 6:00 - 7PM\n\u{1F4CD}: BBC 120 \n\nSee you there!",
      takenAt: "2026-10-17T21:52:07.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DelgntnG4D9",
      url: "https://www.instagram.com/p/DelgntnG4D9/",
      caption: "\u{1F91D} Where Student Founders Meet Student Consultants\n\nJoin IDEAS Club and San Jose Consulting Group (SJCG) for our Founder Workshop! \u{1F4A1}\n\nThis interactive workshop brings together student founders and student consultants to tackle real business challenges, exchange ideas, and explore ways to grow and improve early-stage ventures.\n\n What to expect:\n\u{1F4A1} Student founders sharing their business ideas and challenges \n\u{1F91D} Interactive breakout sessions with student consultants \n\u{1F4C8} Actionable insights and feedback to help founders move forward \n\u{1F3A4} Group takeaways, discussion, and networking opportunities \n\nWhether you're building a startup, interested in consulting, or simply curious about entrepreneurship, this is a great opportunity to learn, connect, and collaborate!\n\n\u{1F4C5} Tuesday, October 27, 2026 \n\u23F0 6:00 PM \u2013 7:30 PM\n\u{1F4CD}BBC 004, San Jos\xE9 State University\n\n\u{1F517} Scan the QR code on the flyer to register or go to bit.ly/foundersworkshop26\n\nWe look forward to seeing you there!\n\n#SJSU #Entrepreneurship #Consulting #StartupFounders #StudentEntrepreneurs #IDEASSJSU #SJCG",
      takenAt: "2026-10-17T06:53:28.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "Dek4sKIALSX",
      url: "https://www.instagram.com/p/Dek4sKIALSX/",
      caption: "That\u2019s a wrap on PMA\u2019s Trivia & Slime Making Night! \u{1F9E0}\u{1F49A}\u2728\n\nThank you to everyone who came out, joined the fun, and made the night so memorable. \u{1FAF6}\n\nStay tuned for more events from the SJSU Product Management Association! \u{1F680}\n\n#SJSUPMA #ProductManagement #SJSU\xA0\xA0#PMA",
      takenAt: "2026-10-17T01:07:04.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DekigRFkltB",
      url: "https://www.instagram.com/p/DekigRFkltB/",
      caption: "Join AI in Business at SJSU for AI Stack!\n\nAn interactive panel featuring industry professionals from Tesla, Meta, Microsoft, and Google Raxium.\n\nOur speakers will break down the tools, workflows, models, and AI systems they use in their work through live demos, interactive activities, real-world examples, and audience Q&A.\n \n\u{1F4C5} Tuesday, October 20\n\u23F0 6:00\u20137:30 PM\n\u{1F4CD} BBC 004\n\u{1F39F}\uFE0F Free + open to all majors\n\u{1F517} RSVP through the Linktree in our bio",
      takenAt: "2026-10-16T21:50:41.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DekfYu4SpFV",
      url: "https://www.instagram.com/p/DekfYu4SpFV/",
      caption: "Ever heard of research? Or, wanna know what it is? \u{1F914} \nLearn how to find and pursue research opportunities at SJSU. This workshop will cover how to connect with faculty, identify research interests, and take the next steps toward gaining valuable hands-on experience \u{1F50E}\u2728\n\n\u{1F5D3}\uFE0F Monday, Oct. 19th\n\u23F0 3:00 pm\n\u{1F4CD}SSC 602\n\n#research #sjsupride\u{1F499}\u{1F49B} #spartanstrong\u{1F4AA}",
      takenAt: "2026-10-16T21:31:42.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DeketeKhoWa",
      url: "https://www.instagram.com/p/DeketeKhoWa/",
      caption: "A good cup of coffee and great advice, welcome to our Transfer Advising Caf\xE9 \u2615\uFE0F\n\nThe H&ASSC is hosting a two-hour event for brief registration-preparation and general advising.\n\nBagels, coffee, tea, hot cocoa, and other refreshments will be available first come, first served while supplies last. \n\n\u{1F96F} Tuesday, October 25th\n\u{1F375} 1:15-3:15PM (drop in whenever!)\n\u2615\uFE0F Clark Hall 244 \n\nIf you have an dietary needs or accommodations, fill out the form through the QR code or the link in our bio. We hope to see you there! \u{1F499}\u{1F49B}",
      takenAt: "2026-10-16T21:23:16.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DekepUkEqWT",
      url: "https://www.instagram.com/p/DekepUkEqWT/",
      caption: "\u{1F499}\u{1F49A} Thank you to everyone who came to watch Ponyo with IBA! \u{1F420}\u{1F35C}\u{1F9CB}\n\nIt was so great seeing everyone come together to enjoy a fun movie night. We hope you all had an amazing time and enjoyed the chance to relax, connect, and make new memories with us. \u2728\n\nMake sure to fill out membership form in the Linktree in our bio\u{1F30E}\u{1F4BC}\n\nStay tuned for more exciting events coming soon. We can\u2019t wait to see you all again! \u{1F499}\u{1F49A}",
      takenAt: "2026-10-16T21:16:58.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DekaTGhSqfO",
      url: "https://www.instagram.com/p/DekaTGhSqfO/",
      caption: "Are you a Fall 26\u2019 transfer student who needs help enrolling for the Spring 27\u2019 semester?\n\nWe understand that it\u2019s difficult to navigate registration for the first time after orientation, and we want to ensure your success!\n\n\u{1F5D3}\uFE0FTuesday, October 27th \n\u23F1\uFE0F10AM-11AM\n\u{1F4CD}Virtual (Zoom)\n\nSign up through the QR code or the link in our Linktree, so you can receive the Zoom link! We hope to see you there \u{1F49B}\u{1F499}",
      takenAt: "2026-10-16T20:57:24.000Z"
    },
    {
      handle: "lbsa_sjsu",
      host: "LBSA | SJSU",
      shortcode: "DekCgXCmpBj",
      url: "https://www.instagram.com/p/DekCgXCmpBj/",
      caption: "YOU KNOW WHAT TIME IT IS!!!! \u{1FAA9}\u{1F4F8}\n\nINTRODUCING LATIN NIGHT: THROWBACK THURSDAY \u{1F57A}\u{1F60E}\u{1F4F8}\n\nA night of fun, throwbacks from 80s, 90s, 2000s, and 2010s!! Pull up with your squad in throwback attire to dance all night long!! \u{1FAA9}\u{1FAA9}\n\n\u{1F4C6}Thursday, November 5th\n\u{1F4CD}The Loft Bar & Bistro 90 S 2nd St\n\u23F0Doors open at 9:30pm! \n\nTHIS EVENT IS 18+, PLEASE BRING YOUR GOVERNMENT ID \u{1FAAA} \n\nGIVEAWAY INSTRUCTIONS: \n1. Like the post \n2. Follow LBSA on IG \n3. Tag 3 friends \n\u203C\uFE0FWinners announced on story\u203C\uFE0F\n\n\u{1F6A8}Deadline: Monday, October 26 @ 11:59pm\n\n\u{1F39F}\uFE0FCheck the Linktree in our Bio for the presale form!\n\u{1F4B5}Payment is to be collected during our tabling dates at regular price, at the door price will be collected at the door on day of\n\nWE HOPE TO SEE YOU ALL THERE!! \u{1F64F}\u{1FAF6}\n\n#latin #latinnight #sjsu #sj #sanjose",
      takenAt: "2026-10-16T17:11:04.000Z"
    },
    {
      handle: "sjsupeerconnections",
      host: "SJSU Peer Connections",
      shortcode: "DekB35ny3e_",
      url: "https://www.instagram.com/p/DekB35ny3e_/",
      caption: "It\u2019s National Boss Day! Take a look at this parody of the Office that we made to celebrate our incredible Pro-Staff. Share your love for them in the comments! \u{1F389}\u{1F64C}\n\n#sjsu #peerconnections #nationalbossday",
      takenAt: "2026-10-16T17:07:30.000Z"
    },
    {
      handle: "fmasjsu",
      host: "FMA SJSU",
      shortcode: "DejrCaEm0TS",
      url: "https://www.instagram.com/p/DejrCaEm0TS/",
      caption: "Happy Fun-Lit Friday! Compounding is a very important concept to understand if you want to secure financial freedom from a young age. Join the FMA and learn more! #finance #Fma #money",
      takenAt: "2026-10-16T13:46:00.000Z"
    },
    {
      handle: "sjsu_chhs_ssc",
      host: "San Jos\xE9 State University CHHS Student Success Center",
      shortcode: "Deh-I7_ASBC",
      url: "https://www.instagram.com/p/Deh-I7_ASBC/",
      caption: "Spring 2027 enrollment appointments will be viewable in MySJSU on October 19 after 9:00 a.m!!\n\nYour enrollment appointment is the date and time you can begin enrolling in classes, it is not an advising appointment!\n\nTo find yours, log in to MySJSU and select:\n\nAcademic: Enrollment \u2192 Enrollment Dates \u2192 Spring 2027\n\nBe sure to check MySJSU for any holds, as holds may prevent you from enrolling. Swipe through for step-by-step instructions!\n\nArtwork made by the talented @art_zi_ \n\n#SJSU #CHHS #Spring2027",
      takenAt: "2026-10-15T21:54:26.000Z"
    },
    {
      handle: "sjsu_chhs_ssc",
      host: "San Jos\xE9 State University CHHS Student Success Center",
      shortcode: "Dehv6XAEoQ7",
      url: "https://www.instagram.com/p/Dehv6XAEoQ7/",
      caption: "Spring 2027 registration is approaching! \u{1F4DA}\n\nIn-person Group Advising begins October 19 for currently matriculated lower-division CHHS students with 0\u201359 completed units.\n\nThese sessions can help you review your planned schedule, ask registration questions, and prepare for enrollment.\n\n\u{1F4C5} Mondays and Thursdays | October 19\u2013November 19\n\u23F0 9\u201311 a.m. or 1:30\u20133:30 p.m.\n\u{1F4CD} MacQuarrie Hall 533\n\nBefore attending:\n\n\u2022 Review your Roadmap and MyProgress\n\u2022 Create a proposed Spring 2027 schedule\n\u2022 Bring your laptop and registration questions\n\u2022 Arrive 5\u201310 minutes early\n\nEligible students should check their SJSU email for \u201CSpring 2027 Enrollment Appointments Now Viewable \u2013 RSVP for Group Advising!\u201D and use the included link to select a session.\n\nFor full details, visit the link in our bio or scan the QR code. Times may vary, so be sure to check your appointment time.\n\nQuestions? Contact chhssuccesscenter@sjsu.edu or (408) 924-2910.\n\n#SJSU #CHHS #Spring2027",
      takenAt: "2026-10-15T19:50:07.000Z"
    },
    {
      handle: "undocuspartans",
      host: "UndocuSpartan Resource Center",
      shortcode: "DehtxnphxjD",
      url: "https://www.instagram.com/p/DehtxnphxjD/",
      caption: "Spartans! Help us create workshops that reflect your interests! \u{1F499}\u{1F49B}\n\nPlease take 5-7 minutes to complete our survey and share the topics and resources you'd like to see. Your input will help us plan workshops for the UndocuSpartan community.\n\nScan the QR code or use the link bit.ly/4s3DJ5X to take the survey. Thank you for helping shape what's next!\n\n#UndocuSpartans #SJSU #StudentVoices",
      takenAt: "2026-10-15T19:40:00.000Z"
    },
    {
      handle: "htem_sjsu",
      host: "SJSU Hospitality Department",
      shortcode: "DehqzUnPwBM",
      url: "https://www.instagram.com/p/DehqzUnPwBM/",
      caption: "THIS FRIDAY 10/16 !!! Spartan Leadership & Career Conference! Meet Industry professionals and learn about their experiences. Student Union Ballroom from 9:00AM - 6:00PM\u{1F468}\u200D\u{1F4BC}\u{1F469}\u200D\u{1F4BC}",
      takenAt: "2026-10-15T19:05:31.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "Dehjt2YGO99",
      url: "https://www.instagram.com/p/Dehjt2YGO99/",
      caption: "Our project group applications are open! \u{1F680}\n\nJoin Spartan Analytics this semester and get hands-on experience working with real data through Service Scope or RetainAI.\n\nWhether you\u2019re interested in civic analytics, machine learning, customer retention, or just want stronger project experience for your resume and portfolio, we\u2019d love to have you apply. \u{1F913}\n\nYou can apply to one or both projects, whichever interests you most! \n\nApply today, link in our bio. \n\n#spartananalytics #sjsu #datascience #sjsuclub",
      takenAt: "2026-10-15T18:03:33.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DefhojJPupx",
      url: "https://www.instagram.com/p/DefhojJPupx/",
      caption: "Thank you so much to everyone who joined us for our NetApp x WIB Panel! \u{1F496}\nWe loved learning about the different business career paths available in the tech industry and hearing from NetApp professionals about their personal experiences and career journeys.\nA special thank you to the NetApp panelists for sharing your time, insights, and advice with us. We hope you left feeling inspired to explore new opportunities, including the Sales, Support, and Services Academy!\nStay tuned for more WIB events! \u{1F495}",
      takenAt: "2026-10-14T23:09:20.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DefcS_xATXL",
      url: "https://www.instagram.com/p/DefcS_xATXL/",
      caption: "Come hang out with us this Monday Oct 19th to build friendship and community!",
      takenAt: "2026-10-14T22:20:14.000Z"
    },
    {
      handle: "bravensjsu",
      host: "Braven at SJSU",
      shortcode: "DefaRhdhVdM",
      url: "https://www.instagram.com/p/DefaRhdhVdM/",
      caption: "\u{1F393} SJSU\u2019s Senior Kickoff is coming!\n\nFind out where you actually stand in your job search, meet alumni who\u2019ve been there, and leave with people to go through application season with.\n\nPlus: Receive FREE LinkedIn Premium!\n\n\u{1F4C5} October 20th | \u23F0 4:30 pm - 6:00 pm | \u{1F4CD} Student Union Meeting Room 4\n\nSign up, link in bio!",
      takenAt: "2026-10-14T22:06:09.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DefTTMwSEzm",
      url: "https://www.instagram.com/p/DefTTMwSEzm/",
      caption: "Join us for a hands-on workshop next Thursday! Get live tips from a guest speaker on essential tools every business student needs to know. \u{1F4CA}\n\n#sjcg #sjsu #consulting",
      takenAt: "2026-10-14T21:03:51.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "DefHOiyPTXx",
      url: "https://www.instagram.com/p/DefHOiyPTXx/",
      caption: "thank you to everyone who came out to Loter\xEDa night \u{1F973}",
      takenAt: "2026-10-14T19:17:19.000Z"
    },
    {
      handle: "sjsuwib",
      host: "Women in Business at SJSU",
      shortcode: "DedEZDWnRrn",
      url: "https://www.instagram.com/p/DedEZDWnRrn/",
      caption: "Join us for our Networking with Sharks and Barracuda + Women in the Sports Industry Panel on 10/20/2026!\n\nWhether you are interested in business, marketing, operations, events, sports, hospitality, technology, or other career areas, this is a great opportunity to expand your professional network and explore how your skills could translate into the sports and entertainment industry while pursuing potential job and internship opportunities.\n\nNetworking with Sharks and Barracuda Event:\n\u{1F4C5} Tuesday, October 20, 2026\n\u23F0 4:30 PM \u2013 6:30 PM\n\u{1F4CD} Clark Hall Career Hub\n\nPlease stay for the Women in Sports Career Panel happening immediately after!\n\nThe sports industry goes far beyond the field! Join us for an inspiring panel featuring successful women in business, marketing, technology, hospitality, and more as they share their career journeys and advice for breaking into the industry.\n\nCareer Panel:\n\u{1F4C5} Tuesday, October 20, 2026\n\u23F0 6:30 PM \u2013 8:00 PM\n\u{1F4CD} Clark Hall Career Hub\n\nRSVP with the link in our bio!",
      takenAt: "2026-10-14T00:12:52.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "Decg0X0D8kL",
      url: "https://www.instagram.com/p/Decg0X0D8kL/",
      caption: "Join us for our ice cream social! Happening from now until 1PM today! Learn about the departments, campus resources and get some free ice cream! \u{1F366} \u{1F368} \u{1F499}",
      takenAt: "2026-10-13T19:02:01.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DecXEj4NkMB",
      url: "https://www.instagram.com/p/DecXEj4NkMB/",
      caption: "Python libraries allow us to use ML algorithms easily, but how do they work? Join us and find out! Open to students of all majors and experience levels.\n\n\u{1F4C5} Date: Friday, October 16th\n\u23F0 Time: 12:00 PM- 1:30PM\n\u{1F4CD}  Location: BBC 103\n\n#sjsu #aiml #aimlclub #ml #python",
      takenAt: "2026-10-13T17:36:54.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DeahvF3oIEh",
      url: "https://www.instagram.com/p/DeahvF3oIEh/",
      caption: "Will AI take our jobs?\n\nJoin Dr. Etu and AI Engineer Sai Kumar Bysani for an honest conversation about AI, careers, and what the future of work could actually look like.\n\n\u{1F399}\uFE0F Why It Matters \u2014 EP. 003\n\u{1F4C5} October 15th\n\u23F0 4:00 PM\n\u{1F4FA} Live on YouTube\n\nReal data careers. Honest conversations. Tune in!\n\n#NSDC #SJSU #ArtificialIntelligence #AI #datascience",
      takenAt: "2026-10-13T00:32:03.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "DeagQHiHeBl",
      url: "https://www.instagram.com/p/DeagQHiHeBl/",
      caption: "\u{1D5DB}\u{1D5D8}\u{1D5DF}\u{1D5DF}\u{1D5E2} \u{1D5D9}\u{1D5E3}\u{1D5E6}!\n\n\u2500\u2500 \u22C6\u22C5\u{16913}\u22C5\u22C6 \u2500\u2500\nAre you looking to learn more about editing in filmmaking? Look no further, because \u{1D42D}\u{1D421}\u{1D422}\u{1D42C} \u{1D413}\u{1D421}\u{1D42E}\u{1D42B}\u{1D42C}\u{1D41D}\u{1D41A}\u{1D432} @\u{1D7D3}:\u{1D7D1}\u{1D7CE} \u{1D422}\u{1D427} \u{1D403}\u{1D40C}\u{1D407} \u{1D7D1}\u{1D7D3}\u{1D7D5}, we have an editing demonstration from \u{1D415}\u{1D422}\u{1D41C}\u{1D42D}\u{1D428}\u{1D42B}\u{1D422}\u{1D41A} \u{1D405}\u{1D425}\u{1D41E}\u{1D42D}\u{1D41E}\u{1D42C}, an SJSU alum. So if you\u2019re looking to sharpen your skills in editing, or just curious, come sit in on this demonstration! \n\nAll are welcome to join; major does not matter!\n\n\u2757\u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FF}\u{1D5F2}: DMH 357 \n\u2757\u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FB}: Thursday, October 15th, @5:30 PM\n\u2757\u{1D5D5}\u{1D5FF}\u{1D5F6}\u{1D5FB}\u{1D5F4}: Yourself & Friends!",
      takenAt: "2026-10-13T00:18:36.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DeaZYdZvhDg",
      url: "https://www.instagram.com/p/DeaZYdZvhDg/",
      caption: "\u2757\uFE0FROOM CHANGE!!\nCOME TO HGH 118\u2757\uFE0F\n\nSee you there! \u{1F440}\u{1F49A}\u{1F499}\n\n6 PM\nHGH 118 \nWednesday, October 14th",
      takenAt: "2026-10-12T23:19:29.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DeaXvHcj2sx",
      url: "https://www.instagram.com/p/DeaXvHcj2sx/",
      caption: "Thank you to everyone who joined us for our Responsible AI Panel! We loved seeing everyone come together to engage in meaningful conversations, share perspectives, and explore the importance of using AI responsibly.\n\nA special thank you to our amazing panelists for sharing their insights and experiences, and to everyone who participated and asked thoughtful questions!\n\nWe\u2019re excited to continue learning, connecting, and exploring the future of AIB with you all!",
      takenAt: "2026-10-12T23:04:11.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "DeZ8z3CklTv",
      url: "https://www.instagram.com/p/DeZ8z3CklTv/",
      caption: "\u{1D400}\u{1D42D}\u{1D42D}\u{1D41E}\u{1D427}\u{1D42D}\u{1D422}\u{1D428}\u{1D427} \u{1D405}\u{1D40F}\u{1D412}!\n\n\u2727\u02D6\xB0\u{1F4F7} \u0F18 \u22C6\uFF61\nIt\u2019s October, so it\u2019s time for our annual \u{1D40D}\u{1D40E} \u{1D401}\u{1D414}\u{1D403}\u{1D406}\u{1D404}\u{1D413} competition! \n\nNo Budget is a competition where members of FPS are only allowed to use what they have, \u{1D430}\u{1D422}\u{1D42D}\u{1D421}\u{1D428}\u{1D42E}\u{1D42D} \u{1D42C}\u{1D429}\u{1D41E}\u{1D427}\u{1D41D}\u{1D422}\u{1D427}\u{1D420} \u{1D41A} \u{1D42C}\u{1D422}\u{1D427}\u{1D420}\u{1D425}\u{1D41E} \u{1D41C}\u{1D41E}\u{1D427}\u{1D42D} \u{1D42D}\u{1D428} \u{1D41C}\u{1D42B}\u{1D41E}\u{1D41A}\u{1D42D}\u{1D41E} \u{1D41A}\u{1D427}\u{1D432} \u{1D420}\u{1D41E}\u{1D427}\u{1D42B}\u{1D41E} \u{1D428}\u{1D41F} \u{1D42C}\u{1D421}\u{1D428}\u{1D42B}\u{1D42D} \u{1D41F}\u{1D422}\u{1D425}\u{1D426}. If you\u2019re looking for more of a challenge, a \u{1D42B}\u{1D41A}\u{1D427}\u{1D41D}\u{1D428}\u{1D426} \u{1D428}\u{1D41B}\u{1D42C}\u{1D42D}\u{1D42B}\u{1D42E}\u{1D41C}\u{1D42D}\u{1D422}\u{1D428}\u{1D427} will be given to you by our officers. There is an \u{1D7D6}-\u{1D426}\u{1D422}\u{1D427}\u{1D42E}\u{1D42D}\u{1D41E} \u{1D41C}\u{1D41A}\u{1D429} on films, so be sure to watch out! Members will have around 2 weeks to create a short on their own time and submit for consideration. \n\nSubmissions are \u{1D41D}\u{1D42E}\u{1D41E} \u{1D413}\u{1D42E}\u{1D41E}\u{1D42C}\u{1D41D}\u{1D41A}\u{1D432}, \u{1D40E}\u{1D41C}\u{1D42D}\u{1D428}\u{1D41B}\u{1D41E}\u{1D42B} \u{1D7D0}\u{1D7D5}\u{1D42D}\u{1D421}, and we will be screening them along with a costume contest for Halloween on \u{1D40E}\u{1D41C}\u{1D42D}\u{1D428}\u{1D41B}\u{1D41E}\u{1D42B} \u{1D7D0}\u{1D7D7}\u{1D42D}\u{1D421} @ \u{1D7D4} \u{1D40F}\u{1D40C}, during our meeting.\n\nPlease sign up using the \u{1D410}\u{1D411} \u{1D41C}\u{1D428}\u{1D41D}\u{1D41E} located on the poster, or using the \u{1D425}\u{1D422}\u{1D427}\u{1D424} \u{1D429}\u{1D42B}\u{1D428}\u{1D42F}\u{1D422}\u{1D41D}\u{1D41E}\u{1D41D} \u{1D422}\u{1D427} \u{1D428}\u{1D42E}\u{1D42B} \u{1D41B}\u{1D422}\u{1D428}!\n\nMay the odds be ever in your favor, FPS! \n\u2727\u02D6\xB0\u{1F4F7} \u0F18 \u22C6\uFF61",
      takenAt: "2026-10-12T19:08:54.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DeZ5EKwvlQw",
      url: "https://www.instagram.com/p/DeZ5EKwvlQw/",
      caption: "It\u2019s time to take a break from the scrolls and get social \u{1F5E3}\uFE0F\n\nWe\u2019re hosting a Trivia/PMA Jeopardy + Slime Making Social! Supplies WILL be provided, feel free to bring friends.\n\nJoin PMA for a fun and stress-free night of trivia and SLIME ;)\n\n\u{1F5D3}\uFE0F Tuesday, 10/13\n\u23F0 6:00 \u2013 7:30 PM\n\u{1F4CD} BBC 121",
      takenAt: "2026-10-12T18:38:39.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "DeZlI_dFPkB",
      url: "https://www.instagram.com/p/DeZlI_dFPkB/",
      caption: "Are you interested in learning about where our food comes from and how it\u2019s grown? \u{1F331}\n\nJoin SJSU\u2019s Department of Nutrition, Food Science, and Packaging and the Nutrition and Food Science Club for a screening of Groundswell! It will be followed by a panel discussion on regenerative agriculture. @sjsu_nufs_club \n\nWhen: Wednesday, October 21, 2026 (6:00PM\u20138:30 PM)\nWhere: SJSU Student Union Theatre\n\nThis event is free and open to anyone that is interested. Come learn something new and join the conversation!\n\n#sjsu #sustainability #greencampus",
      takenAt: "2026-10-12T15:42:04.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DeYHSOCxsit",
      url: "https://www.instagram.com/p/DeYHSOCxsit/",
      caption: "\u{1F916} Want to learn how to build reliable AI systems?\n\nJoin us for Open Source AI: Building Reliable AI Systems! \n\n\u{1F680} Learn directly from industry professionals from IBM, AWS, and Red Hat as they talk about open-source AI tools.\n\n\u{1F4BB} What to expect:\n - Explore Mellea, used for reliable LLM apps\n - Learn about AI safety and building them safely\n - Discover agentic AI development with Bob\n - Study Docling for preparing documents for GenAI\n - Network with industry professionals, fellow  students and AI enthusiasts!\n\nWhether you want to get hands-on practice with your laptop or simply listen in, learn, and connect, this event is perfect for you!\n\n\u{1F4C5} October 19, 2026 | 5:00\u20137:30 PM\n\u{1F4CD} Clark Hall 102 \u2013 Elevate Career Hub\n\n\u{1F517} RSVP now: https://luma.com/i3mb5jw6\n\n#sjsu #rcc #networking #sjsuevents",
      takenAt: "2026-10-12T02:02:15.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DeU5VpVBS1R",
      url: "https://www.instagram.com/p/DeU5VpVBS1R/",
      caption: "Join us for our Python Workshop series! \u{1F40D}\u{1F468}\u200D\u{1F4BB}\n\nWhether you\u2019re brand new to coding or looking to refresh your skills, join us and dive further into the fundamentals of Python and start writing your own code! \n\n\u203C\uFE0F LOCATION MOVED TO DMH 226B \u203C\uFE0F\n\n\u{1F4C5} Thursday, October 29th\u2028\u{1F554} 6:00-7:00 PM\u2028\u{1F4CD} DMH 226B\n\nNo experience necessary\u2014just bring your laptop and get ready to learn, code, and connect with students interested in tech and data. \n\nTake your first step toward building your Python skills with Spartan Analytics. We\u2019ll see you there! \u{1F929}\n\nRSVP now, link in bio! \n\n#sjsu #datascience #pythonprogramming codingbootca",
      takenAt: "2026-10-11T03:00:04.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DeVTtVXjzjR",
      url: "https://www.instagram.com/p/DeVTtVXjzjR/",
      caption: "Join us for our Product Showdown workshop for an exciting evening of product insights, industry perspectives, and conversations with experienced product professionals! \n\n\u{1F4C5} Thursday, October 15\u2028\u23F0 6:00 \u2013 7:30 PM\u2028\u{1F4CD} BBC 004\n\nDon\u2019t miss this opportunity to learn from industry professionals, gain valuable insights into product management, and connect with fellow MISA members! \u{1F91D}\n\nRegister through the link in our bio and make sure to bring your laptops. We hope to see you there!",
      takenAt: "2026-10-10T23:52:47.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DeVHrwRS-AK",
      url: "https://www.instagram.com/p/DeVHrwRS-AK/",
      caption: "Midterms got you stressed? Taking it out on our Prez + Vice Prez sounds like the logical solution \u{1F967}\n\nCome throw a pie at leadership for a good cause (or just pure entertainment)!\xA0 \n\n\u{1F4CD} 7th Street\n\u{1F4C5} Oct 13 + 14\n\u23F0 12\u20134 PM",
      takenAt: "2026-10-10T22:07:49.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DeU3STFBJy_",
      url: "https://www.instagram.com/p/DeU3STFBJy_/",
      caption: "A quick recap of our first Python Bootcamp session! \u{1F929}\u{1F4BB}\n\nOpen to all experience levels, we explored foundational concepts through interactive instruction and hands-on learning. Whether you\u2019re just getting started or looking to strengthen your skills, this bootcamp is a great opportunity to gain practical, industry-relevant experience and connect with fellow data enthusiasts! \u{1F4CA}\n\nJoin us for our next session, taking place soon: \n\n\u{1F4C5} Date: Monday, October 12th\n\u23F1\uFE0F Time: 5-6 PM \n\u{1F4CD}Location: Student Union Meeting Room 2B \n\nFollow us to stay connected on upcoming events and news!\n\n#analyticsclub #sjsu #datascience #sjsuclub",
      takenAt: "2026-10-10T19:46:01.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DeU2XlbP3Xo",
      url: "https://www.instagram.com/p/DeU2XlbP3Xo/",
      caption: "someone\u2019s gotta hold it down\u2026\u{1F30E}\u2728\n\n#iba #sjsu #2016 #adela",
      takenAt: "2026-10-10T19:37:09.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DeU1R4uv5Ar",
      url: "https://www.instagram.com/p/DeU1R4uv5Ar/",
      caption: "Think you know LeetCode? \n\nPut your problem-solving speed to the test at LeetCode Sprints \u2014 a fast-paced session built around recognizing patterns, thinking quickly, and solving smarter.\n\n\u{1F4C5} October 13th\n\u23F0 6:00\u20137:00 PM\n\u{1F4CD} DMH 227\n\nCome ready to code, compete, and sharpen your interview skills. \n\n#nsdc #sjsu #leetcode #codinginterview #computerscience",
      takenAt: "2026-10-10T19:28:40.000Z"
    },
    {
      handle: "bravensjsu",
      host: "Braven at SJSU",
      shortcode: "DeSfIl_gwJP",
      url: "https://www.instagram.com/p/DeSfIl_gwJP/",
      caption: "This semester students had the opportunity to practice networking at @adobe for Learning Lab 6! A huge shoutout to the volunteers and professionals at Adobe for giving some of our Fellows a tour of their HQ in addition to helping our students develop their networking skills. \u2B50\uFE0F \n\nIf you\u2019re an SJSU student who wants to grow both professionally and as a leader send us a DM to learn more about how this 3-credit course (SSCI 101) can help support your career journey. \u{1F64C}\u{1F3FD}\n\n#SJSU #Braven #SpartanUp #CareerReady #Adobe",
      takenAt: "2026-10-09T21:46:02.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DeSZ2xjkkQP",
      url: "https://www.instagram.com/p/DeSZ2xjkkQP/",
      caption: "Our Make AI Work In Your Sleep workshop gave everyone the opportunity to explore how AI can go beyond simple prompts and become a personalized system for productivity and organization. \n\nFrom learning how to build an AI operating system to getting hands-on experience creating smarter workflows, everyone had the chance to discover new ways to make AI work for them! \u{1F680}\n\nStay tuned for more opportunities to learn new skills and grow with MISA! \u{1F499}",
      takenAt: "2026-10-09T20:48:47.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DeSL_g6v4mr",
      url: "https://www.instagram.com/p/DeSL_g6v4mr/",
      caption: "Struggling to prepare for an upcoming advising appointment? Let\u2019s ask our advisors for some advice! \n\nPrepping for an appointment is very helpful to ensuring an effective and efficient advising session!!\n\nMake an appointment with us through Spartan Connect or contact us through email: ha-successcenter@sjsu.edu or phone: (408)924-5095",
      takenAt: "2026-10-09T18:48:33.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "DeSHeQcDyI-",
      url: "https://www.instagram.com/p/DeSHeQcDyI-/",
      caption: "We\u2019re making history at SJSU! Join CAPISE and MOSAIC for SJSU\u2019s first-ever Filipino American History Month Celebration: Kuwento Natin: Our Stories. \u{1F1F5}\u{1F1ED}\u2728 \n\nThe event is inspired by our theme for Filipino American History Month, \u201CKuwento Natin,\u201D which means \u201COur Stories\u201D in Tagalog, one of the many dialects in the Philippines. \n\nCome through to MLK Library 225 on Tuesday 10/20 at 4:30 PM to\u2026\n\u{1F4AC} Participate in community conversations about culture, family, and the importance of sharing & honoring our stories \n\u{1F35A} Enjoy a delicious Filipino meal from local Filipino vendors\n\u{1F1F5}\u{1F1ED} Explore Filipino culture and heritage through performances\n\u{1F3A4} Listen to & learn from powerful kuwento (stories) from Filipino American students, staff, and leaders in our campus and local community!\n\n\u{1F4C5} Tuesday, October 20\n\u23F0 4:30\u20136:00 PM\n\u{1F4CD} MLK Library, Room 225\n\nTara na - Let\u2019s go! See you there! \u{1F499}\u{1F49B}\u2764\uFE0F",
      takenAt: "2026-10-09T18:08:09.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DeQxm0OG-St",
      url: "https://www.instagram.com/p/DeQxm0OG-St/",
      caption: "\u{1F680} MindWell SSF Project Intern Positions Available!\n\nLooking for an opportunity to gain hands-on experience, work on meaningful projects, and build your skills? We\u2019re excited to open applications for Mindwell SSF!\n\nThis is a chance to gain real-world experience, contribute to impactful projects, and grow alongside a team.\n\n\u{1F4CC} Positions Available: \n - Frontend Development Intern\n - Data & Integration Intern\n - UI/UX & Accessibility Intern\n - Product & QA Intern\n\nInterested in web design, data or testing? Then don\u2019t hesitate!\n\nExplore, find the opportunity that\u2019s right for you, and apply! \u2728\n\nApplications Close: Monday, October 12th, 2026 at 11:59 PM PT\n\nApplication link: https://docs.google.com/forms/d/e 1FAIpQLSeIRLbLTfqxULhwJRXAHOfP9ikqJb9ylWGebjaVNsu4YmqjGg/viewform",
      takenAt: "2026-10-09T05:37:50.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "DeQAclLksv5",
      url: "https://www.instagram.com/p/DeQAclLksv5/",
      caption: "Hello \u{1D405}\u{1D40F}\u{1D412}!!\n\nFPS is tabling at Fire on the Fountain! We have fun interactive activities such as a cable-wrapping race and movie trivia questions! Finish one of these activities and come earn special FOTF prizes, as well as learn more about what FPS has to offer!\n\nWe are located near the library and HGH, @4PM-9 PM.\n\nHope to see you there! ;)",
      takenAt: "2026-10-08T22:28:16.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DeP3vOlErdp",
      url: "https://www.instagram.com/p/DeP3vOlErdp/",
      caption: "Take a study break with us! Come hang out, play games, and connect with our Global Spartan community.",
      takenAt: "2026-10-08T21:12:10.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DePwy0tyDTo",
      url: "https://www.instagram.com/p/DePwy0tyDTo/",
      caption: "Web Scraping with AI \u2014 Our second AI Workshop!\n\nWant to turn websites into organized research without doing everything manually?\n\nJoin AI in Business at SJSU for a hands-on workshop where you\u2019ll use prompt engineering to build a web-scraping AI agent that can collect, summarize, organize, and turn information into useful dashboards.\n\n\u{1F4C5} Tuesday, Oct. 13\n\u23F0 6:00 PM \u2013 7:00 PM\n\u{1F4CD} DMH 234\n\n\u{1F4BB} Bring a laptop\n\u{1F393} All majors welcome\n\u{1F193} Free to attend\n\nRSVP through the link in our bio.",
      takenAt: "2026-10-08T20:12:24.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DePdznJGvQu",
      url: "https://www.instagram.com/p/DePdznJGvQu/",
      caption: "Ready to Feel the Beat & Bring the Heat? \u{1F525}\u{1F3C8} Homecoming Game Day is almost here, Spartans!\n\nJoin us this Friday, Oct. 9 as SJSU Football takes on the Wyoming Cowboys at CEFCU Stadium! Before kickoff, head over to South Campus for the ultimate Student Tailgate.\n\nHere is everything you need to know before you go:\n\n\u23F0 SCHEDULE AT A GLANCE\n\n3:00 PM: Free Shuttles start running from Duncan Hall\n4:00 PM \u2013 6:00 PM: Student Tailgate at South Campus\n6:00 PM: Kickoff at CEFCU Stadium!\n\n\u{1F356} TAILGATE HIGHLIGHTS (4-6 PM)\n\nFREE BBQ spread by Spartan Eats (Pulled pork, chicken, vegan jackfruit, mac & cheese!)\nFREE Rally Towels at check-in\nFace Painting, Photobooth & Lawn Games\n\n\u{1F39F}\uFE0F TICKETS & ENTRY\n\nFree admission for ALL SJSU students with a valid Tower ID + 1 FREE guest!\nAdditional guest tickets are only $10.\n\n\u26A0\uFE0F IMPORTANT RULES\n\nClear Bag Policy: Only clear bags allowed inside CEFCU Stadium.\nBring your physical Tower ID and government ID (if 21+).\n\nSwipe through the slides for full shuttle details and game day perks! \u27A1\uFE0F\n\n#SJSUHomecoming #FeelTheBeatBringTheHeat #SJSU #SpartanSquad",
      takenAt: "2026-10-08T17:25:35.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DeNkwPexqvX",
      url: "https://www.instagram.com/p/DeNkwPexqvX/",
      caption: "Winter Session registration is open. Up to 4 units, Jan 4 \u2013 22. Sign up on MySJSU. More info at sjsu.edu/winter\n\n#SJSU #WinterSession",
      takenAt: "2026-10-07T23:48:40.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DeNgOjMGEM_",
      url: "https://www.instagram.com/p/DeNgOjMGEM_/",
      caption: "Have a startup idea you\u2019re ready to bring to life?\n\nJoin us for the SVIC Info Session to learn how you can apply, gain valuable mentorship and networking opportunities, and compete for a cash prize! \u{1F4B0}\u2728\n\n\u{1F4C5} Wednesday, October 14th\n\u{1F560} 4:30\u20135:30 PM\n\u{1F4CD} IDEAS Lab, Student Union\n\nWhether your idea is just starting to take shape or you\u2019re ready to take the next step, this is your chance to learn more about SVIC and how it can help you turn your idea into something bigger. \u{1F4A1}\n\nSave the date & take your first step toward building a great business! \u{1F61B}\u{1F680}\n\n#innovation #ideasclub #sjsu #svic",
      takenAt: "2026-10-07T23:08:15.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DeNU2LTSa8f",
      url: "https://www.instagram.com/p/DeNU2LTSa8f/",
      caption: "Real connections start in IBA \u2764\uFE0F\nCome to our Fork n\u2019 Film PONYO night and meet some new people. Free boba and ramen bar! See you there! \u{1F30E}\u2728\n\n6 PM\nBBC 122 \nWednesday, October 14th",
      takenAt: "2026-10-07T21:30:51.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "DeNTPMjyc0p",
      url: "https://www.instagram.com/p/DeNTPMjyc0p/",
      caption: "Heard about new surveillance tools like Flock cameras, but don\u2019t know where to start?\nJoin us as we explore the history and technology behind mass surveillance and examine how it impacts all of us, especially marginalized communities. Learn, discuss, and reflect with others as we unpack the narratives and infrastructure surrounding us.\n\n\u{1F4CD} Mosaic Cross Cultural Center\u2028\u{1F4C5} Thursday, October 22nd\n\u23F0 4:30 - 6:00pm\n\nCome learn, ask questions, and engage in the conversation.",
      takenAt: "2026-10-07T21:14:50.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DeNFVF9zDLs",
      url: "https://www.instagram.com/p/DeNFVF9zDLs/",
      caption: "\u{1F5D3}\uFE0FOCTOBER CALENDAR\u{1F5D3}\uFE0F\n\nJoin PMA for some spooky events, from guest speakers and workshops to pieing the prez!!? \n\nMark your calendars and stay alert for any updates!\nNOTE: Tabling on the 15th has been cancelled. \n\nWhich events are you pulling up to? \u{1F440}\u{1F440}",
      takenAt: "2026-10-07T19:13:33.000Z"
    },
    {
      handle: "sjsu_careercenter",
      host: "SJSU Career Center",
      shortcode: "DeMstoNBd0n",
      url: "https://www.instagram.com/p/DeMstoNBd0n/",
      caption: "The Applied Data Science program invites you to join us for \u201CAsk Me Anything: Building a Career in Tech,\u201D featuring:\n\u200B\u{1F31F} Ruchi Bhatia, Technical Product Marketing at AWS and the youngest three-time Kaggle Grandmaster\n\u200B\u{1F31F} Akshat Gupta, Software Engineer working on Search and AI Infrastructure at Amazon\nThe event will include a candid discussion about career paths, essential skills, and opportunities in the technology industry, followed by a robotics and Embodied AI demonstration.\n\nDate: Monday, October 12, 2026\nTime: 5:30\u20138:00 p.m.\nLocation: Student Union Theater and ISB 814\nAdmission: Free and open to all SJSU students\n\nA free T-shirt will be provided to every attendee who registers in advance.",
      takenAt: "2026-10-07T15:39:14.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DeKeoZvD2HW",
      url: "https://www.instagram.com/p/DeKeoZvD2HW/",
      caption: "\u{1F6CD}\uFE0F MISA Thrift Fundraiser is here! \u{1F45A}\n\nLooking to refresh your wardrobe while supporting MISA? \nStop by our thrift on 7th street from 10 AM - 3 PM and find some great pieces at affordable prices! \n\n\u{1F5D3}\uFE0F Tabling Dates \n\u2022 October 13 \n\u2022 October 15 \n\u2022 October 20 \n\u2022 October 22 \n\nBring your friends, stop by, and get some fire clothes!",
      takenAt: "2026-10-06T18:56:35.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DeIzOLtxs7A",
      url: "https://www.instagram.com/p/DeIzOLtxs7A/",
      caption: "That\u2019s a wrap on our recruitment week! \u{1F3AC}\u2728 The energy was absolutely great, a huge thank you to everyone that stopped by! We are hyped & ready to bring more amazing events & opportunities this semester! \u{1F680}\u{1F525}\n\n#rcc #sjsu #sjsuevents #recap",
      takenAt: "2026-10-06T03:19:54.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DeIi5DAxR18",
      url: "https://www.instagram.com/p/DeIi5DAxR18/",
      caption: "\u203C\uFE0F LINK IN BIO \u{1F517} RCC is developing a hands on hardware challenge track\xA0with an industry partner for the Responsible Innovation Hackathon, a Spring 2027 event bringing together 150+ SJSU students from different majors.\xA0\n\nIf you\u2019re a student with an engineering background or interest, we want to hear from YOU about the types of challenges, tools, and hardware you\u2019d be interested in working with!\xA0\n\nYour responses will directly help shape an industry supported challenge track for the hackathon, where they will mentor and judge your hackathon project!\xA0\n\nThis survey should take approximately 2\u20133 minutes to complete.",
      takenAt: "2026-10-06T00:56:08.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "DeITQdEvYIu",
      url: "https://www.instagram.com/p/DeITQdEvYIu/",
      caption: "A glimpse into October at the Mosaic \u{1FAE1}",
      takenAt: "2026-10-05T22:39:25.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DeIRr2dj9yb",
      url: "https://www.instagram.com/p/DeIRr2dj9yb/",
      caption: "Thank you to everyone who joined us for Apply on Autopilot! We loved seeing everyone learn, collaborate, and explore how AI can make the application process smarter and more efficient.\n\nWe appreciate everyone who came out and made the event such a success. Stay tuned, there\u2019s plenty more to come from AIB!",
      takenAt: "2026-10-05T22:24:59.000Z"
    },
    {
      handle: "bravensjsu",
      host: "Braven at SJSU",
      shortcode: "DeIGdH9yoFk",
      url: "https://www.instagram.com/p/DeIGdH9yoFk/",
      caption: "\u{1F3AC} Curious about a career in film, TV, or animation? Join us for Behind the Scenes: Building a Career in Film, TV & Animation, a virtual panel where entertainment professionals will share their career paths, experiences, and advice for getting started.\n\nWhen & Where: Tuesday, October 13 | 1:00\u20132:00 PM | Zoom\n \nRSVP by using the link in our bio! \u2B50\uFE0F",
      takenAt: "2026-10-05T20:50:47.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DeIGd_cyq5Q",
      url: "https://www.instagram.com/p/DeIGd_cyq5Q/",
      caption: "\u2757\uFE0FROOM CHANGE!!\nCOME TO HGH 118\u2757\uFE0F \n\n\u{1F30A}\u{1F35C} IBA PRESENTS: FORK N\u2019 FILM! \u{1F3AC}\u2728\n\nGet ready for an awesome movie-night experience as we bring Ponyo to HGH 118! Join us for an evening of good eats, great company, and one of Studio Ghibli\u2019s most beloved films!\n\nWe will have a ramen bar, boba, and more provided, so come hungry and bring your friends! \u{1F365}\u{1F9CB}\n\n\u{1F4C5} Wednesday, October 14\n\u23F0 6:00 PM\n\u{1F4CD} HGH 118\n\nRSVP using the link in our bio! \u{1F499}\u{1F49A} \n\n#iba #ponyo #ramen #boba #sjsu",
      takenAt: "2026-10-05T20:48:15.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "DeH9OOSEj3t",
      url: "https://www.instagram.com/p/DeH9OOSEj3t/",
      caption: "Speaker event alert! \u{1F331}\n\nJohn Townsend, co-founder of the Climate Innovation Coalition, is coming to SJSU to talk about sustainability and entrepreneurship. He has over 33 years of experience driving technology and innovation, so this is a good one to hear from!\nJoin Us Here!\n\u{1F4CD} Student Union, Room 2B\n\u{1F4C5} October 8\n\u{1F552} 3:00 to 4:00 PM\n\nScan the QR code on the flier for contact info and details. Hosted by @sci_sjsu \u{1F499}\u{1F49B}",
      takenAt: "2026-10-05T19:26:10.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DeH8cxeB8fU",
      url: "https://www.instagram.com/p/DeH8cxeB8fU/",
      caption: "How can we use technology and our careers to serve the public good? \n\nJoin the College of Humanities and the Arts, Career Center, and Responsible Computing Club (RCC) for an interactive Public Interest Technology (PIT) program exploring how technology, community impact, and your career can come together. \u{1F30E}\n\n\u{1F4C5} Wednesday, October 14\n\u23F0 1:00-3:00 PM\n\u{1F4CD} ISB 874 | SJSU\n\u{1F37D}\uFE0F Lunch provided\n\nConnect with students, faculty, and staff, tune into the PIT-UN broadcast, and take part in an interactive \u201CDesign Your Career\u201D activity to explore where your interests, skills, and impact can intersect.\n\nNo prior PIT experience needed! \n\n\u26A0\uFE0F Space is limited!\nRSVP by Thursday, October 8 @ 11:59 PM. Selected participants will receive a confirmation by Friday.\n\nCan\u2019t attend? You can still RSVP to receive resources, event takeaways, and future PIT opportunities!\n\n\u{1F517} RSVP through the link in bio!",
      takenAt: "2026-10-05T19:22:19.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DeHy0TaBpmg",
      url: "https://www.instagram.com/p/DeHy0TaBpmg/",
      caption: "Most of us know AI as something that lives on a screen. Embodied AI is what happens when models leave the screen and interact with the physical world. This session shows you how that works, no matter where you\u2019re starting from.\n\n\u{1F50D} What you\u2019ll explore\n\u25AA\uFE0F An introduction to robotics and embodied AI\n\u25AA\uFE0F How VLM (vision-language) models help robots see\n\u25AA\uFE0F How robots understand instructions\n\u25AA\uFE0F How those instructions turn into action\n\n\u{1F4C5} Event details\n\u{1F5D3} Friday, October 9\n\u{1F55B} 12:00 to 3:00 PM\n\u{1F4CD} BBC 103\n\n\u{1F64C} Who it\u2019s for\nEveryone. No prior experience required, so bring your curiosity and a friend.\n\n#aimlclub #embodiedai #robot #sjsu #fyp",
      takenAt: "2026-10-05T17:57:01.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DeGOEDcAiN2",
      url: "https://www.instagram.com/p/DeGOEDcAiN2/",
      caption: "Python Workshop #1 is here! \u{1F40D}\u{1F4BB}\n\nJoin us for Python Fundamentals, the first workshop in our Python series! Whether you\u2019ve never coded before or just want a refresher, we\u2019ll cover the basics and help you get comfortable writing your own Python code. \u{1F913}\n\n\u{1F4C5} Monday, October 5\n\u{1F554} 5:00\u20136:00 PM\n\u{1F4CD} Student Union, Meeting Room 2B\n\nNo experience required\u2014just bring your laptop and come ready to learn, code, and meet other students interested in tech and data. \n\nStart building your Python skills with Spartan Analytics. See you there! \n\nRSVP - Link in bio\n\n#spartananalytics #sjsu #sjsuclub #dataanalytics",
      takenAt: "2026-10-05T03:15:31.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DeFryAwoH51",
      url: "https://www.instagram.com/p/DeFryAwoH51/",
      caption: "Debunking common consulting myths! Here are the important facts you should know \u{1F4DD}\n\n#sjgc #consulting #sjsu",
      takenAt: "2026-10-04T22:15:39.000Z"
    },
    {
      handle: "rcc.sjsu",
      host: "Responsible Computing Club @ SJSU",
      shortcode: "DeDiNG1G8pz",
      url: "https://www.instagram.com/p/DeDiNG1G8pz/",
      caption: "\u{1F91D} RCC October General Meeting is THIS TUESDAY!\nJoin us as we catch up on everything happening across RCC and dive into some of the biggest conversations happening in responsible technology right now!\n\n\u{1F4AD} Responsible Computing discussions & activities\n\u{1F4AD} Updates from our projects, programs & Ambassador teams\n\u203C\uFE0F NEW project opportunities + how to get involved\n\u{1F4AD} Upcoming October events\n\u{1F355} Food + time to connect with the RCC community!\n\nWe\u2019ll also be joined by AI-ET leadership to share more about the AI Survey and its impact in the broader CSU perspective.\n\nWhether you\u2019ve been involved all semester or are looking for your next way to get involved, come hear what\u2019s happening and help shape the conversations we\u2019re building at RCC!\n\n\u{1F4CD} Digital Humanities Center or Zoom \n\u{1F4C5} Oct 6, 2026 Tuesday \n\u23F0 5:00-6:00 PM\n\nSee you there! \u{1F91D}",
      takenAt: "2026-10-04T02:13:08.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DeDJ7LGv4em",
      url: "https://www.instagram.com/p/DeDJ7LGv4em/",
      caption: "Think you\u2019ve got what it takes to climb the leaderboard?\n\nJoin us for Kaggle Night a beginner-friendly, in-person data science challenge where you\u2019ll get a dataset, tackle a real-world problem, build a model, and explain the reasoning behind your approach.\n\n\u{1F4C5} October 6th\n\u23F0 6:00\u20137:00 PM\n\u{1F4CD} DMH 227\n\nNew to Kaggle? Come learn. Experienced? Come compete. \n\n#NSDC #SJSU #Kaggle #DataScience #MachineLearning",
      takenAt: "2026-10-03T22:42:39.000Z"
    },
    {
      handle: "sjsu.pma",
      host: "Product Management Association @ SJSU",
      shortcode: "DeC7ZLdSqP2",
      url: "https://www.instagram.com/p/DeC7ZLdSqP2/",
      caption: "Want to break into product management but don\u2019t know where to start? We\u2019re bringing you the real, unfiltered side of PM!\u{1F4A1}\n\nJoin PMA for Product Management 101: What They Don\u2019t Tell You, featuring Kevin Nguyen\u2014a seasoned Product Manager who\u2019s seen it all (with experience at Proximo, Intuit & Springboard)!\n\nWhether you\u2019re curious about different PM roles, looking to land an internship, or just want to expand your network, this event is designed for you. Newcomers are fully welcomed!\n\n\u{1F4C5} When: Tuesday, October 6, 2026\n\u23F0 Time: 6:00 PM\n\u{1F4CD} Where: BBC 004\n\u{1F517} RSVP / Info: Link in bio (\u2060linktr.ee/pma.sjsu\u2060)\nBring your questions and bring a friend, see you there! \u{1F64C}",
      takenAt: "2026-10-03T20:34:09.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DeCiNFYSRSu",
      url: "https://www.instagram.com/p/DeCiNFYSRSu/",
      caption: "\u{1F3A4}BIG SHOUT OUT to Scott Moore from Marvell for coming to our Professional Development Workshop and sharing his experience with us. \n\nThank you for helping our members learn, connect, and grow! \u{1F4BC}\u2728\n\nMissed this event? Don\u2019t worry! Stay tuned for our upcoming IBA events and come connect with us at the next one! \u{1F30E}",
      takenAt: "2026-10-03T16:55:03.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DeA2Tp-gOgl",
      url: "https://www.instagram.com/p/DeA2Tp-gOgl/",
      caption: "Thanks for joining us for game night, it was a blast! \u{1F3B2}\u{1F4A5}\n\nIt was great to see everyone having so much fun getting to know each other through Jenga, UNO, Apples to Apples, and the most popular of the night: Heads Up! \n\nFollow us for more exciting events like this, coming soon! \u{1F929}\n\n#analyticsclub #sjsu #datascience #sjsuclub",
      takenAt: "2026-10-03T01:20:06.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "DeATu0Ny1Ha",
      url: "https://www.instagram.com/p/DeATu0Ny1Ha/",
      caption: "Step inside Adobe and get an inside look at the company, its culture, and career opportunities! \u{1F4BB}\u2728 Join us for a company tour and info session featuring a chance to learn more about working in the industry and connect with professionals.\n\n\u{1F4C5} Friday, October 16\n\u23F0 11:30 AM \u2013 1:30 PM\n\u{1F4CD} San Jose Adobe Office (345 Park Ave, San Jose, CA 95110) \n\n\u{1F517} Register through the link in our bio!",
      takenAt: "2026-10-02T20:10:59.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DeALfCfj4Es",
      url: "https://www.instagram.com/p/DeALfCfj4Es/",
      caption: "Need to meet with an advisor? \u{1F4C5} Here\u2019s how to book an appointment on Spartan Connect in 7 quick steps. Swipe to see how \u{1F449}\n\nSave this for when it\u2019s time to plan your classes! \u{1F499}\u{1F49B}\n\n#SJSU #AcademicAdvising #HumanitiesAndTheArts",
      takenAt: "2026-10-02T18:56:53.000Z"
    },
    {
      handle: "sjsuinternational",
      host: "SJSU International Students",
      shortcode: "DeAE-7kmo82",
      url: "https://www.instagram.com/p/DeAE-7kmo82/",
      caption: "What is a Tailgate Party? \u{1F3C8} \u{1F389}\n\nIn American college culture, the fun starts before the game! A tailgate party is a big outdoor celebration right outside the stadium where fans gather to get excited for the match.\n\nExpect lawn games, free food, giveaways, and plenty of school spirit. It\u2019s a casual event, so grab a friend, wear your SJSU colors \u{1F499}\u{1F49B}, and come enjoy the fun before kick-off!\n\n\u{1F389} Homecoming Tailgate!\n\u{1F5D3}\uFE0F Friday, October 9, 2026\n\u23F0 4:00-6:00 PM\n\u{1F4CD} CEFCU Stadium (South Campus)\n\u{1F68D} Shuttle departs from Duncan Hall \n\n\u261D\uFE0FPro Tip: \n1. Bring your Tower ID\n2. Have your Sammy App ready for check-in and giveaways\n3. Going to the game? Review the stadium bag policy. https://sjsuspartans.com/sjsu-clear-bag-policy",
      takenAt: "2026-10-02T18:00:07.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "Dd-jQuPBdfI",
      url: "https://www.instagram.com/p/Dd-jQuPBdfI/",
      caption: "IDEAS Club Game Night!! \u{1F3B2} \u2663\uFE0F\n\n\u{1F5D3}\uFE0F Wednesday, October 7th, 4 - 6 pm\n\u{1F4CD}IDEA Lab in the Student Union\n\nJoin us at the IDEA Lab for our community event next week!\n\nCasual game night with the IDEAS Club members, with Poker, Uno & Flip-7. We will be gambling with monopoly money, the night\u2019s biggest winner will take home a special prize! \u{1F389}\n\nThere will be drinks and snacks as well!!\u{1F964}\n\nBeing an entrepreneur is all about risk assessment, come and get a chance to try your hand at winning the game.",
      takenAt: "2026-10-02T03:47:03.000Z"
    },
    {
      handle: "sjsumisa",
      host: "MIS Association",
      shortcode: "Dd-enVUACQe",
      url: "https://www.instagram.com/p/Dd-enVUACQe/",
      caption: "Join MISA for an exclusive Cadence Company Tour & Info Session and get an inside look at one of Silicon Valley\u2019s leading technology companies. Come learn more about Cadence, explore the workplace, and connect with industry professionals!\n\n\u{1F4C5} Friday, October 9\n\u23F0 11:00 AM \u2013 1:00 PM\n\u{1F4CD} San Jose Cadence Design Systems Office (2655 Seely Ave, San Jose, CA 95134)\n\n\u{1F517} Register through the link in our bio!",
      takenAt: "2026-10-02T03:08:12.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "Dd-QWJnD8wd",
      url: "https://www.instagram.com/p/Dd-QWJnD8wd/",
      caption: "Do you like free ice cream\u{1F366}? How about some free swag\u{1F60E}? Join us for our ice cream social Tuesday, October 13th from 11AM to 1PM! \u2728",
      takenAt: "2026-10-02T01:00:02.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "Dd97zuUkqkt",
      url: "https://www.instagram.com/p/Dd97zuUkqkt/",
      caption: "Join us for our next AI in Business speaker panel: Responsible AI\n\nAs AI becomes more integrated into the way companies operate, questions around ethics, transparency, bias, privacy, and accountability are becoming just as important as the technology itself.\n\nHear from industry professionals as we discuss what responsible AI actually looks like in practice, the challenges companies are facing, and what students should understand as AI continues to shape the workplace.\n\nCome learn, ask questions, and join the conversation on how we can build and use AI responsibly.\n\n\u{1F4CD} San Jos\xE9 State University \n\u{1F3EB} Room: DMH 358 \n\u{1F517} RSVP through our Linktree",
      takenAt: "2026-10-01T22:01:24.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "Dd90KQSkxYu",
      url: "https://www.instagram.com/p/Dd90KQSkxYu/",
      caption: "Join us for our 3rd annual Health TechQuity Conference! \u{1F499}\u2728\n\nFollow us to stay up to date!\n#sjsu #healthtechquity #chhs #sjsuhealthtechquity",
      takenAt: "2026-10-01T20:54:35.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "Dd9nW7Xyql2",
      url: "https://www.instagram.com/p/Dd9nW7Xyql2/",
      caption: "Learn how to extract raw data, transform it, and load it so your models actually perform. You\u2019ll leave with a walked-through data pipeline to customize for your own projects.\n\n\u{1F4C5} Fri, Oct 2\n\u{1F55B} 12:00 to 1:30 PM\n\u{1F4CD} BBC 103\n\n#aimlclub #workshop #sjsu #fyp",
      takenAt: "2026-10-01T19:03:37.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "Dd7TwdwSgEm",
      url: "https://www.instagram.com/p/Dd7TwdwSgEm/",
      caption: "October is Filipino American History Month! \u{1F499}\n\nThis year\u2019s theme, Kuwento Natin: Our Stories, celebrates the stories, experiences, and history that shape the Filipino American community.\n\nThis is the first year we\u2019re celebrating Filipino American History Month across campus, in collaboration with campus and community partners! Stay tuned for our events and offerings throughout the month.\n\nTo learn more and see the full lineup, check out the FAHM website through the link in our Linktree or visit: bit.ly/SJSUFAHM26\n\nWe\u2019ll be ending the month with the Filipino American History Mural Unveiling at the Student Union!\n\nKuwento Natin. Our Stories.",
      takenAt: "2026-09-30T21:33:04.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "Dd4_nEuP28M",
      url: "https://www.instagram.com/p/Dd4_nEuP28M/",
      caption: "What is consulting?\n\nJoin us October 6th for a workshop with guest speaker Nikolas Perez on breaking into the industry, strategy, and management!\n\n#sjcg #sjsu #consulting",
      takenAt: "2026-09-30T00:01:12.000Z"
    },
    {
      handle: "sjsufps",
      host: "SJSU Film Production Society",
      shortcode: "Dd48tUsjzwG",
      url: "https://www.instagram.com/p/Dd48tUsjzwG/",
      caption: ". \u0741\u208A \u22B9 . \u0741 \u27E1 \u0741 . \u22B9 \u208A \u0741. \n\n\u{1D5DB}\u{1D5D8}\u{1D5DF}\u{1D5DF}\u{1D5E2} \u{1D5D9}\u{1D5E3}\u{1D5E6}!\n\nIt\u2019s that time of the semester for an FPS event! The first one, in fact\u2026 \u{1F389}\nWe have a new cabinet, and we thank everyone for their patience while we restructure FPS. \n\nWith that being said, the new FPS cabinet wants to welcome new and returning members to its first meeting, where we are doing \u{1D5E6}\u{1D5F0}\u{1D5EE}\u{1D603}\u{1D5F2}\u{1D5FB}\u{1D5F4}\u{1D5F2}\u{1D5FF} \u{1D5E1}\u{1D5F6}\u{1D5F4}\u{1D5F5}\u{1D601} along with \u{1D5FB}\u{1D5FC}\u{1D601}\u{1D5F2}\u{1D5EF}\u{1D5FC}\u{1D5FC}\u{1D5F8} \u{1D5F0}\u{1D5FF}\u{1D5EE}\u{1D5F3}\u{1D601}\u{1D600}!\n\nPlease join us \u{1D601}\u{1D5F5}\u{1D5F6}\u{1D600} \u{1D5E7}\u{1D5F5}\u{1D602}\u{1D5FF}\u{1D600}\u{1D5F1}\u{1D5EE}\u{1D606} in the \u{1D5D4}\u{1D5F9}\u{1D602}\u{1D5FA}\u{1D5FB}\u{1D5F6} \u{1D5E5}\u{1D5FC}\u{1D5FC}\u{1D5FA} \u{1D5F6}\u{1D5FB} \u{1D5DB}\u{1D602}\u{1D5F4}\u{1D5F5} \u{1D5DA}\u{1D5F6}\u{1D5F9}\u{1D5F9}\u{1D5F6}\u{1D600} \u{1D5DB}\u{1D5EE}\u{1D5F9}\u{1D5F9} @\u{1D7EF}:\u{1D7EF}\u{1D7EC} \u{1D5E3}\u{1D5E0}. All are welcome to join; major does not matter!\n\nWe have a lot in store for you this semester, so we hope you will come join us for some fun activities, laughs, and meeting new friends! \u{1F64C} \n\n\u2757 \u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FF}\u{1D5F2}: HGH 114 (Alumni Room)\n\u2757 \u{1D5EA}\u{1D5F5}\u{1D5F2}\u{1D5FB}: Thursday, October 1st, @3:30 PM \n\u2757\u{1D5D5}\u{1D5FF}\u{1D5F6}\u{1D5FB}\u{1D5F4}: Yourself & Friends!\n\n. \u0741\u208A \u22B9 . \u0741 \u27E1 \u0741 . \u22B9 \u208A \u0741.. \u0741\u208A \u22B9 . \u0741 \u27E1 \u0741 . \u22B9 \u208A \u0741.. \u0741",
      takenAt: "2026-09-29T23:33:04.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "Dd2S1_AD_oC",
      url: "https://www.instagram.com/p/Dd2S1_AD_oC/",
      caption: "We begin our NEW drop in hours with @sjsuwellness this Thursday with CAPS counselor, Hanya Shatara! \n\nHanya Shatara, LCSW (she/they) is a Palestinian-US Citizen Counselor Faculty from CAPS who is excited to provide Let's Talk for Mosaic students. She is from the Bay Area, got her Bachelor's at UC Davis, and her Master's in Social Work at Columbia University, and is passionate about discussing how systems and culture/society affect mental health while using decolonizing therapy/liberation psychology concepts to help refocus on how to live fulfilling lives.\n\nHanya will be posted up at Mosaic every Thursday from 11AM-12PM starting this Thursday 10/1 until Thurs 12/3! \u{1F499} Come by any Thursday this semester! \n\nWe will also have snacks for this first Thursday! \u{1F389}",
      takenAt: "2026-09-28T22:48:46.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "Dd2RhQMj2xj",
      url: "https://www.instagram.com/p/Dd2RhQMj2xj/",
      caption: "Ever wonder how Spotify seems to know what you want to hear next?\n\nThat tiny skip? Yep \u2014 that\u2019s data science IRL\n\nWelcome to Data Science IRL, where we break down the data science hiding in the apps and experiences you use every day.\n\nText her in the comments what should we break down next \n  #NSDC #SJSU #DataScience #spotify #machinelearning",
      takenAt: "2026-09-28T22:37:12.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "Dd1nn7CRSca",
      url: "https://www.instagram.com/p/Dd1nn7CRSca/",
      caption: "Not sure where to start with AI and ML? You\u2019re not alone, and we\u2019ve got you. \u{1F499}\n\nOur president shares what the club is all about and how the Intern Panel will support students at every step. Come grow with us.\n\n#aimlclub #panel #internship #sjsu #fyp",
      takenAt: "2026-09-28T16:32:02.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DdxFDBDSuqK",
      url: "https://www.instagram.com/p/DdxFDBDSuqK/",
      caption: "Securing members by any means necessary. \u{1F440}\n\nCome be part of IBA and see what we\u2019re all about! \u{1F30E}\u2728\nFill out the membership form today, link in bio! \u{1F499}\u{1F49A} \n\n#internationalbusiness #sjsu",
      takenAt: "2026-09-26T22:12:36.000Z"
    },
    {
      handle: "sjsumosaic",
      host: "MOSAIC Cross Cultural Center",
      shortcode: "Ddr_zd4PTOO",
      url: "https://www.instagram.com/p/Ddr_zd4PTOO/",
      caption: "Join us for a hands-on Tatreez Workshop with guest artist Hiba Hashlamoun on October 8th from 3:30\u20136 PM! \u{1F9F5}\n\nLearn about Tatreez, a centuries-old Palestinian embroidery tradition known for its intricate patterns, symbolism, and storytelling. Hiba will guide us through the history, meaning, and techniques behind each stitch while you create your own piece in progress.\n\nCome spend the afternoon learning, creating, and connecting through this beautiful art form. All materials will be provided! \u{1F90D}\n\n\u{1F4CD} Mosaic\n\u{1F4C5} Thursday, October 8\n\u23F0 3:30\u20136 PM\n\nDrop in and stitch with us! \u{1F9F5}",
      takenAt: "2026-09-24T22:50:11.000Z"
    },
    {
      handle: "bravensjsu",
      host: "Braven at SJSU",
      shortcode: "Ddr8qzAh847",
      url: "https://www.instagram.com/p/Ddr8qzAh847/",
      caption: "See you next Tuesday 9/29! \n4:30pm-5:30pm \n\u{1F4CD}Student Union 3A \n\nLink in bio to RSVP! \n#braven #sjsu #resume",
      takenAt: "2026-09-24T22:25:14.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "Ddr4GAekpzf",
      url: "https://www.instagram.com/p/Ddr4GAekpzf/",
      caption: "Thank you to everyone who came out! We loved seeing so many new faces, sharing what AIB has planned, and connecting with students interested in where AI meets business.\n\nThank you to all of our speakers as well as the students who made this event great! We can\u2019t wait to continue to get to know all of you more and see everyone at the next event!",
      takenAt: "2026-09-24T21:42:37.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DdpZLakD0eX",
      url: "https://www.instagram.com/p/DdpZLakD0eX/",
      caption: "Looking to improve your interviewing skills?\n\nJoin IBA for a professional development workshop featuring Scott Moore, Global Head of University Recruiting at Marvell Technology! Learn how to answer common interview questions, structure your responses, build confidence, and stand out during the hiring process. \u{1F4C8}\n\nThe workshop will include interactive interview practice, industry advice, and free snacks. \u{1F440}\u{1F36A}\n\n\u{1F4C5} Wednesday, September 30th\n\u23F0 6:00\u20137:00 PM\n\u{1F4CD} Boccardo Business Center, Room 122\n\nCome build practical skills and learn from an industry recruiting professional. We'll see you there! \u{1F499}\u{1F49A}",
      takenAt: "2026-09-23T22:34:00.000Z"
    },
    {
      handle: "nsdc.sjsu",
      host: "National Student Data Corps SJSU",
      shortcode: "DdpYzIKB2Co",
      url: "https://www.instagram.com/p/DdpYzIKB2Co/",
      caption: "Data can tell a story but what happens when the data itself is biased? \n\nJoin RCC \xD7 NSDC for a beginner-friendly Data Analysis Workshop where we\u2019ll use Pandas & NumPy to explore real datasets, uncover bias, and understand what it can mean downstream.\n\n\u{1F4C5} September 30th\n\u23F0 5:00\u20136:30 PM\n\u{1F4CD} Digital Humanities Center @ MLK Library\n\nNo Pandas experience required\n\n#NSDC #RCC #SJSU #DataScience #DataAnalysis Pandas NumPy ResponsibleComputing",
      takenAt: "2026-09-23T22:32:48.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DdpJ_hGyfMd",
      url: "https://www.instagram.com/p/DdpJ_hGyfMd/",
      caption: "Join Collegiate DECA at SJSU! \u{1F499}\u{1F49B} Build your leadership skills, meet new people, and explore new opportunities.\n\nScan the QR code to become a member!\n\n#SJSU #DECA #SJSUDECA #CollegiateDECA #StudentLeadership",
      takenAt: "2026-09-23T20:22:02.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DdpCRZWvFtl",
      url: "https://www.instagram.com/p/DdpCRZWvFtl/",
      caption: "Join AIB for our first workshop: Apply on Autopilot \n\nYou\u2019ll build an AI agent that fills out the repetitive parts of your job applications for you, so all that\u2019s left is checking its work and answering the company-specific questions. Then we\u2019ll test it on a real Workday application and see whose agent is fastest and most accurate!\n\n\u{1F4C5} Tuesday, Sept 29 \xB7 6:00\u20137:30 PM\n\u{1F4CD} BBC 004\n\u{1F4BB} Bring your laptop\n\nWe\u2019ll show you how to use premium AI models for free with your student perks. Winter and summer internship applications are opening now, so get ready to mass apply \u{1F680}\n\nFree and open to all majors. RSVP through the link in our bio \u{1F517}",
      takenAt: "2026-09-23T19:15:02.000Z"
    },
    {
      handle: "ibasjsu",
      host: "International Business Association @ SJSU",
      shortcode: "DdmimWBSyiY",
      url: "https://www.instagram.com/p/DdmimWBSyiY/",
      caption: "We want to add more smiles to the picture!\n \nTAP\u2728 and join IBA, and become a part of a great community! Our club is about building connections, creating memories and gaining knowledge in global business \u{1F49A}\u{1F499}",
      takenAt: "2026-09-22T19:58:50.000Z"
    },
    {
      handle: "sjsugbsa",
      host: "SJSU GBSA",
      shortcode: "Ddmg38eywyX",
      url: "https://www.instagram.com/p/Ddmg38eywyX/",
      caption: "\u{1F60E}Friday night plans = handled \u{1F3B3}\n\nJoin us for another GSBA Social on Friday, October 2nd! Come bowl, play some billiards, meet fellow grad business students, and kick off the weekend with us.\n\nNot bowling? No problem. Come hang out and meet some new people!\n\nRSVP through the link in our bio so we can save you a spot on a lane! See you soon!\n\n#sjsu #mba #sjsumba #sanjosestateuniversity",
      takenAt: "2026-09-22T19:46:47.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DdjzYmzApED",
      url: "https://www.instagram.com/p/DdjzYmzApED/",
      caption: "Join us for a fun game night to socialize and network with like-minded peers! \u{1F47E}\n\nEnjoy UNO, Jenga, and Codenames and take a look at what our club has to offer for you this semester. Bring your competitive spirit, your friends, and join a community of people who share similar goals and interests as you. Learn and grow while having fun! \u{1F913}\u{1F3B2}\n\nYou won\u2019t want to miss this, RSVP now! Link in our bio. \n\n#sjsu #datascience #sjsustem #sjsubusiness",
      takenAt: "2026-09-21T18:27:41.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DdjgYL0hBs-",
      url: "https://www.instagram.com/p/DdjgYL0hBs-/",
      caption: "Wondering how everyone else landed their internships? Come ask them yourself. \u{1F4AC} Our panelists will share what worked, what they\u2019d do differently, and how to make the most of your own internship journey. Questions welcome!\n\n\u{1F4C5} Wednesday, September 30\n\u{1F552} 2:00 to 5:00 PM\n\u{1F4CD} BBC 032\n\n#aimlclub #intern #panel #sjsu #fyp",
      takenAt: "2026-09-21T15:42:53.000Z"
    },
    {
      handle: "ai.ml.club.sjsu",
      host: "AI & Machine Learning Club @ SJSU",
      shortcode: "DdjgRWWMZ74",
      url: "https://www.instagram.com/p/DdjgRWWMZ74/",
      caption: "Learn how people solve real problems with machine learning. This session gives an overview of the typical ML interview, introduces common ML tools, and ends with a walkthrough of a fully coded solution. No coding experience required.\n\n\u{1F4C5} Friday, September 25\n\u{1F552} 12:00 to 1:30 PM\n\u{1F4CD} BBC 103\n\n#aimlclub #workshop #ml #sjsu #fyp",
      takenAt: "2026-09-21T15:41:16.000Z"
    },
    {
      handle: "aibsjsu",
      host: "AI in Business at SJSU",
      shortcode: "DdebgboG-Q4",
      url: "https://www.instagram.com/p/DdebgboG-Q4/",
      caption: "Join us for our first speaker panel of the semester: AI Beyond the Hype \n\nHear from four professionals working with AI every day as they break down what\u2019s actually changing in business, what\u2019s delivering real results, and what\u2019s still hype!\n\n\u{1F4C5} Tuesday, September 22\u2028\u23F0 6:00 PM \u2013 7:00 PM\u2028\u{1F4CD} BBC 004, SJSU\u2028\u{1F39F}\uFE0F Free + all majors welcome\n\nRSVP through the Linktree in our bio. See you there!",
      takenAt: "2026-09-19T16:22:42.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "DdZ8xB7j9i5",
      url: "https://www.instagram.com/p/DdZ8xB7j9i5/",
      caption: "\u2728Something exciting is on the way... \u{1F92B}\u{1F62E}\n\n#sjsu #sanjose #CHHS #SJSUHealthTechQuity",
      takenAt: "2026-09-17T22:37:07.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DdXqmcUpGWA",
      url: "https://www.instagram.com/p/DdXqmcUpGWA/",
      caption: "Thank you all for attending our first meeting! Hope to see everyone at the next one! \u{1F64C}\n\n#sjcg #consulting #sjsu",
      takenAt: "2026-09-17T01:21:21.000Z"
    },
    {
      handle: "sjsuenglishdepartment",
      host: "SJSU English Department",
      shortcode: "DdXZ-maAdjM",
      url: "https://www.instagram.com/p/DdXZ-maAdjM/",
      caption: "The Center for Literary Arts is pleased to present Tessa Hulls, reading from her nonfiction graphic novel, Feeding Ghosts: A Graphic Memoir. This event takes place next Thursday, September 24, 2026, at Hammer Theatre at 7 PM. Doors open at 6:30 PM.\n\nTessa Hulls is an artist/writer/adventurer illuminating the connections between the present and the past. Her graphic memoir Feeding Ghosts explores the reverberations of her Chinese grandmother's escape from the Communist regime and her subsequent mental illness. Her work addresses racial justice, the immigrant experience, generational trauma, mental health, the creative process, and the surprising feminist history of the bicycle. Her graphic memoir Feeding Ghosts has earned the Pulitzer Prize, the Anisfield-Wolf Book Award, National Book Critics Circle John Leonard Prize for First Book, the Eisner Award, the Washington State Book Award, the 2024 Libby Award and was named a Best Book of 2024 by Time, Forbes, NPR, the Minnesota Star Tribune, LitHub, Publishers Weekly, Library Journal, Chicago Public Library and others.\n\nReserve your free ticket on the Hammer Theatre website!",
      takenAt: "2026-09-16T22:54:39.000Z"
    },
    {
      handle: "sjsu.nets",
      host: "Network Engineering Technology Society",
      shortcode: "DdUV4j5GMPy",
      url: "https://www.instagram.com/p/DdUV4j5GMPy/",
      caption: "\u{1F680} Your next big idea starts here.\n\n30+ hours. 5 impact tracks. Countless possibilities.\n\nWhether you're here to code, create, collaborate, or simply see what you're capable of SpartHill Hacks 2026 is the place to turn ideas into impact.\n\nJoin students from across the Bay Area for a cross-disciplinary hackathon focused on AI for Sustainable Impact. Work alongside innovators, designers, problem-solvers, and industry mentors to tackle real-world sustainability challenges.\n\nWhat to Expect:\n\n\u{1F3AF} 5 Impact Tracks to explore meaningful challenges\n\u{1F4A1} Workshops and mentorship from industry professionals\n\u{1F91D} Networking and collaboration with students and industry partners\n\u{1F3C6} Showcase your project and compete for exciting prizes\n\n\u{1F4C5} October 23\u201324, 2026\n\u{1F4CD} San Jos\xE9 State University \u2013 Spartan Complex (SPX)\n\u23F1\uFE0F 30+ Hours\n\u{1F39F}\uFE0F FREE \u2022 Open to College Students\n\nNo matter your major or experience level, there's a place for you here. Bring your curiosity, creativity, and willingness to build something meaningful.\n\nCome for the challenge. Stay for the connections, learning, and unforgettable experience.\n\nBUILD. INNOVATE. MAKE AN IMPACT.\n\n\u{1F517} Register now: https://sparthillhack2026.vercel.app/\n\n#sjsu #hackathon #StudentInnovation #technology #cloud#sjsu #sjsuspartans #sjsuengineering #fyi #sjsustudentinvolvement #sjsutech #sjsu2026",
      takenAt: "2026-09-15T18:21:09.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DdRm5RKThAL",
      url: "https://www.instagram.com/p/DdRm5RKThAL/",
      caption: "Come to our speaker event happening TONIGHT!\n\n\u{1F5D3}\uFE0F Monday, September 14th, 6:00pm - 7:00pm\n\u{1F4CD} Student Union Theater\n\nHear from John Baird, one of Silicon Valley\u2019s premier executive coaches. With over 25 years spent coaching CEOs and founders, establishing three coaching firms along the way. He has worked with top leaders at Fortune 500 companies like Apple, Nike, and eBay, as well as fast-growing startups such as Masterclass, DoorDash, and Remitly. He has cited his time at Apple during the early iPhone years as some of his most meaningful work. He\u2019s a WSJ Bestselling author, with a new book set to release in September 2026.\n\nThe topic will be \u201CEntrepreneurship in the Age of AI: Toughness, Heart and Human Connection.\u201D Come and learn from a legendary thought leader and founder!\n\nRegister beforehand through QR code or at: \n\nhttps://bit.ly/svce26",
      takenAt: "2026-09-14T17:00:45.000Z"
    },
    {
      handle: "htem_sjsu",
      host: "SJSU Hospitality Department",
      shortcode: "DdQX0_UG0HA",
      url: "https://www.instagram.com/p/DdQX0_UG0HA/",
      caption: "Open to ALL SJSU students! \n\nCome and learn about this amazing program! The Pebble Beach SJSU Special Events Management Team program for 2027!!! \n\nFor more information or questions contact: \nStudent Coordinator - Perla Veduzco perla.verduzco@sjsu.edu\n\nFaculty Member -Terry Thompson\nterry.thompson@sjsu.edu",
      takenAt: "2026-09-14T05:21:11.000Z"
    },
    {
      handle: "undocuspartans",
      host: "UndocuSpartan Resource Center",
      shortcode: "DdKX7P8yiU3",
      url: "https://www.instagram.com/p/DdKX7P8yiU3/",
      caption: "Need answers to immigration related questions? \n\nCentro & the UndocuSpartan Student Resource Center are partnering up with the Immigrant Legal Defense to bring free immigrant legal services right to campus.\n\nMeet with an immigration attorney for a confidential, 1:1 consultation.\n\n\u{1F4C5} Dates: September 15th & October 13th\n\n\u23F0 Time: 10:00 AM \u2013 3:00 PM\n\n\u{1F4CD} Location: Centro (Student Union, SU 1340)\n\nWho can attend?\n	\u2022	All SJSU Students\n	\u2022	SJSU Staff\n	\u2022	Immediate Family \n\n\u{1F517} Head to bit.ly/CentroLS or scan the QR code in the flyer to schedule your appointment.",
      takenAt: "2026-09-11T21:28:11.000Z"
    },
    {
      handle: "sjsuenglishdepartment",
      host: "SJSU English Department",
      shortcode: "DdKVfMEktki",
      url: "https://www.instagram.com/p/DdKVfMEktki/",
      caption: "Please join us for our Fall Department Social on the 24th! All are welcome! Bring your friends!\n\n\u{1F4C5} Thurs., Sept. 24\n\n\u23F0 3:00-5:00pm\n\n\u{1F4CD} Digital Humanities Center, MLK Library, 1st Floor\n\n\u{1F389} RSVP: https://forms.gle/PdS1YUh4PBVnJPo78",
      takenAt: "2026-09-11T21:05:17.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DdKHubRj3Pm",
      url: "https://www.instagram.com/p/DdKHubRj3Pm/",
      caption: "Meet our client, Runway Avenue! \n\n\u{1F5D2}\uFE0F Apply to be an analyst by September 15th @ 11:59 PM\n\u{1F517} https://tinyurl.com/sjcgfall26",
      takenAt: "2026-09-11T19:05:02.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DdKHp8oj5ub",
      url: "https://www.instagram.com/p/DdKHp8oj5ub/",
      caption: "Meet our new client, Goalieo! \n\n\u{1F5D2}\uFE0F Apply to be an analyst by September 15th @ 11:59 PM\n\u{1F517} https://tinyurl.com/sjcgfall26",
      takenAt: "2026-09-11T19:04:25.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DdKHlqpD27D",
      url: "https://www.instagram.com/p/DdKHlqpD27D/",
      caption: "Meet our new client, PACT! \n\n\u{1F5D2}\uFE0F Apply to be an analyst by September 15th @ 11:59 PM\n\u{1F517} https://tinyurl.com/sjcgfall26",
      takenAt: "2026-09-11T19:03:50.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DdKHgxAjyR3",
      url: "https://www.instagram.com/p/DdKHgxAjyR3/",
      caption: "Meet our new client, HFSV! \n\n\u{1F5D2}\uFE0F Apply to be an analyst by September 15th @ 11:59 PM\n\u{1F517} https://tinyurl.com/sjcgfall26",
      takenAt: "2026-09-11T19:03:10.000Z"
    },
    {
      handle: "sjsuconsulting",
      host: "San Jose Consulting Group",
      shortcode: "DdKGmKnv-EU",
      url: "https://www.instagram.com/p/DdKGmKnv-EU/",
      caption: "Interested in becoming an Analyst or getting involved through marketing/fundraising? Applications are officially OPEN!\n\n\u{1F517} Analyst Role: tinyurl.com/sjcgfall26\n\u{1F517} Fundraising Committee Application: tinyurl.com/26fundraising\n\u{1F517} Marketing Committee: tinyurl.com/fall26marketing\n\nApplications close on September 15th.\n\n#SJCG #sjsu #consulting",
      takenAt: "2026-09-11T19:01:46.000Z"
    },
    {
      handle: "sjsugreencampus",
      host: "SJSU Office of Sustainability",
      shortcode: "DdJt-g9FEPe",
      url: "https://www.instagram.com/p/DdJt-g9FEPe/",
      caption: "Join @scvwd to do a Coyote Creek Clean Up / Litter pick up day! SJSU Spartans show pride in our community! #GoSpartans",
      takenAt: "2026-09-11T15:20:02.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "DdDLzuPFG0P",
      url: "https://www.instagram.com/p/DdDLzuPFG0P/",
      caption: "We\u2019re growing our IDEAS team! \u{1F4A1}\u{1F680}\n\nLooking to get involved, build your leadership experience, and make an impact on campus? IDEAS Entrepreneurship Club is now recruiting!\n\nWe\u2019re currently looking for:\n\u{1F4E3} Director of Marketing\n\u{1F91D} Director of Sponsorship Outreach\n\nJoin a community of ambitious students, entrepreneurs, and innovators while gaining hands-on experience in marketing, networking, partnerships, and event planning.\n\n\u{1F4F2} Scan the QR code to apply!\n\nWe can\u2019t wait to welcome our next IDEAS leaders! \u{1F499}\u2728\n\n#IDEAS #SJSU #SJSUClubs #Entrepreneurship #StudentLeadership #NowRecruiting #SanJoseState #SpartanUp",
      takenAt: "2026-09-09T02:26:02.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DdCVcZaPkY1",
      url: "https://www.instagram.com/p/DdCVcZaPkY1/",
      caption: "Start your school year off right by learning more about Spartan Analytics\u203C\uFE0F\u{1F469}\u200D\u{1F4BB}\n\nMeet new people, discover what Spartan Analytics is all about, and start your fall semester strong with exciting projects, workshops, and networking opportunities ahead! \u{1F929}\u{1F64C}\u{1F3FC}\n\nNo experience required, just bring an open mind and a willingness to learn! \n\n#sjsu #SpartanAnalytics #analyticsclub #sanjosestateuniversity #studentorganization",
      takenAt: "2026-09-08T18:35:37.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "DdCNWWlFAMh",
      url: "https://www.instagram.com/p/DdCNWWlFAMh/",
      caption: "SPHERE (Spartans Practicing Health Equity and Interprofessional Education) is a great opportunity to learn, connect, and develop valuable skills in communication, teamwork, ethics, and understanding different professional roles through fun and interactive activities such as IPE simulations and role-plays, AI-based BodySwaps experiences, ethics discussions, film discussions, and board games. \u2728 Everyone is welcome\u2014come be part of SPHERE!",
      takenAt: "2026-09-08T17:20:23.000Z"
    },
    {
      handle: "ase.sjsu",
      host: "Applied Software Engineering",
      shortcode: "Dc42-DYIkTR",
      url: "https://www.instagram.com/p/Dc42-DYIkTR/",
      caption: "\u{1F680} ASE\u2019s First General Meeting!\n\n\u{1F4C5} September 14\n\u23F0 6:00 PM\n\u{1F4CD} DMH 356\n\nCome meet the team, learn about ASE, and discover our upcoming semester projects and opportunities!\n\nEvent registration link in our bio! \n \nSee you there! \u{1F4BB}\u{1F525}",
      takenAt: "2026-09-05T02:12:16.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "Dc1PayeFPtw",
      url: "https://www.instagram.com/p/Dc1PayeFPtw/",
      caption: "IDEAS Club Kickoff! \u{1F389}\n\u{1F5D3}\uFE0F Wednesday, September 9th, 4 - 6pm\n\u{1F4CD} The IDEA Lab in the Student Union\n\nCome to our first meeting of the semester to see what IDEAS has going on this fall! \nWe will be talking about upcoming workshops, speaker events and business competitions we are hosting, as well as ways to get involved in the club.\n\nThere will be pizza, drinks, kahoot & games and more!! \u{1F355} \n\nStop by, say hello, and we would love to welcome you to the club.",
      takenAt: "2026-09-03T16:28:12.000Z"
    },
    {
      handle: "sjsuspartananalytics",
      host: "Spartan Analytics",
      shortcode: "DczYDdmD8Pt",
      url: "https://www.instagram.com/p/DczYDdmD8Pt/",
      caption: "Applications are open for our new Spartan Analytics teams! \u{1F4CA}\u{1F9D1}\u200D\u{1F4BB}\n\nExplore your interests in data science, gain insight into potential career paths, and build credible, hands-on skills through real projects, professional outreach, and collaboration. Whether you\u2019re ready to lead or eager to contribute, join SJSU\u2019s official data analytics club and turn your curiosity into experience.\n\nApplication is now live, apply in our bio!\u203C\uFE0F\n\n*Deadline is Sunday, September 6th @ 11:59PM\n\n#sjsu #datascience #businessanalytics #sanjosestateuniversity #spartananalytics",
      takenAt: "2026-09-02T23:05:11.000Z"
    },
    {
      handle: "ideas.sjsu",
      host: "IDEAS Club",
      shortcode: "Dcw99FpBVT7",
      url: "https://www.instagram.com/p/Dcw99FpBVT7/",
      caption: "\u{1F4A1} WELCOME BACK to the IDEAS Club! \u{1F680}\n\nWe\u2019re excited to kick off another semester filled with new ideas, connections, and opportunities! \u2728\n\nGet ready for exciting events, networking, and opportunities to connect with fellow entrepreneurs and innovators.\n\n\u{1F440} Stay tuned for what\u2019s coming next!\n\n#IDEASClub #SJSU #Entrepreneurship #Innovation #Networking",
      takenAt: "2026-09-02T00:40:42.000Z"
    },
    {
      handle: "ase.sjsu",
      host: "Applied Software Engineering",
      shortcode: "DcwkKxpypgt",
      url: "https://www.instagram.com/p/DcwkKxpypgt/",
      caption: "Our first general meeting is coming up! \u{1F389}\n\nCome meet the team, connect with other members, and learn about the exciting projects we\u2019re planning for this semester. Whether you\u2019re ready to join a project or just curious about the club, we\u2019d love to see you there!\n\n\u{1F4C5} September 14\n\u23F0 6:00 PM\n\u{1F4CD} TBD\n\nFill out the interest form through the link in our bio. Everyone is welcome! \u{1F4BB}\u2728\n\n#SJSU #GeneralMeeting #StudentClub #SoftwareEngineering #ASE",
      takenAt: "2026-09-01T21:21:42.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DcuB4-4khIB",
      url: "https://www.instagram.com/p/DcuB4-4khIB/",
      caption: "Here are some important deadlines to take note of! Remember to take a look at your schedule and check your dates. \n\nIf you need help with scheduling or advising, make an appointment with the H&A Student Success Center via email: ha-successcenter@sjsu.edu or by phone: (408) 924-5095",
      takenAt: "2026-08-31T21:15:19.000Z"
    },
    {
      handle: "sjsuchhs",
      host: "SJSU CHHS",
      shortcode: "DcuAaoTCU1w",
      url: "https://www.instagram.com/p/DcuAaoTCU1w/",
      caption: "Friday Night at the ER (FNER) Board Game Demo Day! \u{1F3E5}\n\nCome join us for Friday Night at the ER, a fun and interactive board game where you\u2019ll work together to solve challenges, strengthen systems thinking and collaboration skills, and experience what it\u2019s like to navigate a complex healthcare system.\n\n\u{1F9E0} No medical knowledge required!\n\u{1F91D} Just come play and have fun!",
      takenAt: "2026-08-31T21:02:34.000Z"
    },
    {
      handle: "sjsuengineering",
      host: "Charles W. Davidson College of Engineering",
      shortcode: "Dcmfh22DP1X",
      url: "https://www.instagram.com/p/Dcmfh22DP1X/",
      caption: "Discover how @sjsu puts you at the heart of Silicon Valley, where engineering, AI innovation, and industry opportunity come together. Remember to join our webinar to explore hands-on learning, cutting-edge programs, and the internships and connections that can help international students launch careers in tomorrow\u2019s technology.",
      takenAt: "2026-08-28T23:00:31.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "DcmMjMlBMVP",
      url: "https://www.instagram.com/p/DcmMjMlBMVP/",
      caption: "\u{1F4CD}Check out the H&A Student Success Center (Clark Hall 244)! If you ever need some help with choosing classes or planning your academic journey, stop by! \n\nAsk questions and we can work together to make your journey in the Humanities & Arts college a successful one! \n\n#sjsu #spartan #sjsuadvising #officetour",
      takenAt: "2026-08-28T20:22:37.000Z"
    },
    {
      handle: "sjsugbsa",
      host: "SJSU GBSA",
      shortcode: "DcetlCnvWrB",
      url: "https://www.instagram.com/p/DcetlCnvWrB/",
      caption: "New year, new board, same study schedule \u{1F91D}\n\n\u2728Meet your 2026-2027 GBSA officers! We\u2019re cooking up some company treks, volunteer opportunities, socials, and more this school year. \n\n\u{1F44B}\u{1F3FD}If you catch us on campus, feel free to say hi! \n\nIf you want to catch us off campus, come meet us in person at our first Fall Social at San Pedro Square this Friday, August 28th! See you there \u{1F60E}\n\n#SJSU #SJSUGBSA #GraduateSchool #SJSUMBA #sjsulcob",
      takenAt: "2026-08-25T22:36:48.000Z"
    },
    {
      handle: "sjsugbsa",
      host: "SJSU GBSA",
      shortcode: "Dcb7wZjSZxp",
      url: "https://www.instagram.com/p/Dcb7wZjSZxp/",
      caption: "\u{1F5E3}\uFE0FJoin us for our first social of the semester at San Pedro Square Market this Friday! \n\nCome connect, mingle, and spend a few hours with fellow SJSU graduate students and the GBSA community. \u2728\n\n\u{1F4CD}San Pedro Square Market\n\u{1F5D3}\uFE0FFriday, August 28th at 6pm \n\u{1F4CC}Meet in front of the glowing San Pedro Square sign! \n\n\u203C\uFE0FRSVP using the link in bio. See you Friday night! \n\n#SJSU #SJSUGBSA #SJSUMBA #SJSUGraduate",
      takenAt: "2026-08-24T20:43:54.000Z"
    },
    {
      handle: "sjsuhassc",
      host: "H&A Student Success Center",
      shortcode: "Dcb7KK7kmFs",
      url: "https://www.instagram.com/p/Dcb7KK7kmFs/",
      caption: "\u{1F36A}\u2728 Cookies for Success is back! \u2728\u{1F36A}\n\nJoin Peer Connections for a fun and engaging workshop focused on tips, tools, and strategies to help you succeed as a Spartan! \u{1F499}\u{1F49B}\n\n\u{1F4C5} Wednesday, August 26th\n\u{1F550} 1 PM\n\u{1F4CD} SSC 602\n\nCome connect with your peers, learn something new, and enjoy some cookies along the way! \u{1F36A}\u{1F91D}\n\n\u{1F393} Attend workshops and earn Silver, Gold, or Platinum certificates!\n\nSee you there, Spartans! \u{1F499}\n\n#SJSU #SpartanSuccess #PeerConnections #CookiesForSuccess #StudentSuccess",
      takenAt: "2026-08-24T20:30:10.000Z"
    },
    {
      handle: "ase.sjsu",
      host: "Applied Software Engineering",
      shortcode: "DcUKnHskqjz",
      url: "https://www.instagram.com/p/DcUKnHskqjz/",
      caption: "We\u2019re hiring for Fall 2026. \u{1F680} Tech Leads & Core Developers wanted links in our bio! \u{1F4BB}",
      takenAt: "2026-08-21T20:11:16.000Z"
    }
  ]
};

// src/data/instagramCatalog.ts
var INSTAGRAM_SCRAPED_AT = instagram_posts_default.scrapedAt;
var loadedAt = Date.now();
var upcomingClubEvents = parseInstagramPosts(instagram_posts_default.posts).filter(
  (item) => new Date(item.end).getTime() >= loadedAt
);
var instagramEvents = upcomingClubEvents.map(
  (item) => {
    const text = `${item.title} ${item.caption}`;
    return {
      id: item.id,
      title: item.title,
      description: `${item.caption.slice(0, 280)}${item.caption.length > 280 ? "\u2026" : ""}

Posted by @${item.handle} on Instagram. Parsed on ${instagram_posts_default.scrapedAt.slice(0, 10)}. Confirm time and location on the post before you go.`,
      eventType: classifyEventType(item.title),
      format: classifyEventFormat(item.title, item.location),
      start: item.start,
      end: item.end,
      location: item.location,
      host: item.host,
      url: item.url,
      majors: classifyMajors(text),
      interests: classifyInterests(text),
      tags: ["instagram", item.handle.replace(/\./g, "-")],
      isDemo: false,
      scraped: true
    };
  }
);

// src/data/scraped/sjsu-events.json
var sjsu_events_default = {
  scrapedAt: "2026-11-10T19:18:35.729Z",
  source: "SJSU Career Center",
  sourceUrl: "https://careercenter.sjsu.edu",
  events: [
    {
      slug: "get-your-network-on-polish-your-skills-for-graduate-students-2",
      title: "Get Your Network On: Polish Your Skills for Graduate Students",
      url: "https://careercenter.sjsu.edu/events/2026/11/10/get-your-network-on-polish-your-skills-for-graduate-students-2/",
      start: "2026-11-10T12:00:00-08:00",
      end: "2026-11-10T13:00:00-08:00",
      location: "Virtual",
      timeText: "12pm - 1pm"
    },
    {
      slug: "career-ready-in-30-hiration-for-customized-ai-interview-practice",
      title: "Career Ready in 30: Hiration for customized AI Interview practice",
      url: "https://careercenter.sjsu.edu/events/2026/11/10/career-ready-in-30-hiration-for-customized-ai-interview-practice/",
      start: "2026-11-10T12:00:00-08:00",
      end: "2026-11-10T12:30:00-08:00",
      location: "Virtual",
      timeText: "12pm - 12:30pm"
    },
    {
      slug: "ace-your-next-interview-workshop-4",
      title: "Ace Your Next Interview Workshop",
      url: "https://careercenter.sjsu.edu/events/2026/11/12/ace-your-next-interview-workshop-4/",
      start: "2026-11-12T12:00:00-08:00",
      end: "2026-11-12T13:00:00-08:00",
      location: "Virtual",
      timeText: "12pm - 1pm"
    },
    {
      slug: "aviation-career-discovery-day-2",
      title: "Aviation Career Discovery Day",
      url: "https://careercenter.sjsu.edu/events/2026/11/13/aviation-career-discovery-day-2/",
      start: "2026-11-13T09:00:00-08:00",
      end: "2026-11-13T17:00:00-08:00",
      location: "Student Union, Ballroom, 211 S 9th St, San Jose, CA 95112, United States",
      timeText: "9am - 5pm"
    },
    {
      slug: "adobe-student-academy-nov-16-17-watch-parties-check-in",
      title: "Adobe Student Academy | Nov 16-17 | Watch Parties Check In",
      url: "https://careercenter.sjsu.edu/events/2026/11/16/adobe-student-academy-nov-16-17-watch-parties-check-in/",
      start: "2026-11-16T10:00:00-08:00",
      end: "2026-11-16T13:00:00-08:00",
      location: "Clark Hall, Room 102, Elevate Career Hub, San Jos\xE9 State University, San Jose, CA 95112, United States",
      timeText: "10am - 1pm"
    },
    {
      slug: "resume-workshop-presented-by-nets-and-career-center",
      title: "Resume Workshop presented by NETS and Career Center",
      url: "https://careercenter.sjsu.edu/events/2026/11/16/resume-workshop-presented-by-nets-and-career-center/",
      start: "2026-11-16T16:30:00-08:00",
      end: "2026-11-16T17:30:00-08:00",
      location: "Clark Hall, Room 102, Elevate Career Hub, San Jos\xE9 State University, San Jose, CA 95112, United States",
      timeText: "4:30pm - 5:30pm"
    },
    {
      slug: "negotiate-with-confidence-workshop-salary-beyond-2",
      title: "Negotiate with Confidence Workshop: Salary & Beyond",
      url: "https://careercenter.sjsu.edu/events/2026/11/18/negotiate-with-confidence-workshop-salary-beyond-2/",
      start: "2026-11-18T12:00:00-08:00",
      end: "2026-11-18T13:00:00-08:00",
      location: "Virtual",
      timeText: "12pm - 1pm"
    },
    {
      slug: "nnme-career-lab-semiconductor-day",
      title: "NNME Career Lab (SemiConductor Day)",
      url: "https://careercenter.sjsu.edu/events/2026/11/20/nnme-career-lab-semiconductor-day/",
      start: "2026-11-20T09:00:00-08:00",
      end: "2026-11-20T12:00:00-08:00",
      location: "Student Union, Ballroom C, 211 S 9th St, San Jose, CA 95112, United States",
      timeText: "9am - 12pm"
    },
    {
      slug: "from-graduate-student-to-professional-build-a-standout-brand-2",
      title: "From Graduate Student to Professional: Build a Standout Brand",
      url: "https://careercenter.sjsu.edu/events/2026/12/01/from-graduate-student-to-professional-build-a-standout-brand-2/",
      start: "2026-12-01T12:00:00-08:00",
      end: "2026-12-01T13:00:00-08:00",
      location: "Virtual",
      timeText: "12pm - 1pm"
    },
    {
      slug: "job-fair-success-workshop-cv2-mpr-cb",
      title: "Job Fair Success Workshop/CV2 MPR/CB",
      url: "https://careercenter.sjsu.edu/events/2027/01/28/job-fair-success-workshop-cv2-mpr-cb/",
      start: "2027-01-28T15:00:00-08:00",
      end: "2027-01-28T16:30:00-08:00",
      location: "Campus Village Building 2 (CV2) Multi- Purpose Room (MPR)",
      timeText: "3pm - 4:30pm"
    },
    {
      slug: "interview-workshop-cv2-mpr-cb",
      title: "Interview Workshop/CV2 MPR/CB",
      url: "https://careercenter.sjsu.edu/events/2027/02/02/interview-workshop-cv2-mpr-cb/",
      start: "2027-02-02T15:00:00-08:00",
      end: "2027-02-02T16:30:00-08:00",
      location: "Campus Village Building 2 (CV2) Multi- Purpose Room (MPR)",
      timeText: "3pm - 4:30pm"
    },
    {
      slug: "sjsu-spring-27-business-financial-services-logistics-job-internship-fair",
      title: "SJSU Spring '27 Business, Financial Services & Logistics Job/Internship Fair",
      url: "https://careercenter.sjsu.edu/events/2027/02/10/sjsu-spring-27-business-financial-services-logistics-job-internship-fair/",
      start: "2027-02-10T11:00:00-08:00",
      end: "2027-02-10T15:00:00-08:00",
      location: "Student Union Ballroom",
      timeText: "11am - 3pm"
    },
    {
      slug: "sjsu-spring-27-stem-undergraduate-students-job-internship-fair-day-1",
      title: "SJSU Spring '27 STEM Undergraduate Students Job/Internship Fair Day 1",
      url: "https://careercenter.sjsu.edu/events/2027/02/16/sjsu-spring-27-stem-undergraduate-students-job-internship-fair-day-1/",
      start: "2027-02-16T12:00:00-08:00",
      end: "2027-02-16T16:00:00-08:00",
      location: "Student union Ballroom",
      timeText: "12pm - 4pm"
    },
    {
      slug: "sjsu-spring-27-stem-undergraduate-students-job-internship-fair-day-2",
      title: "SJSU Spring '27 STEM Undergraduate Students Job/Internship Fair Day 2",
      url: "https://careercenter.sjsu.edu/events/2027/02/17/sjsu-spring-27-stem-undergraduate-students-job-internship-fair-day-2/",
      start: "2027-02-17T12:00:00-08:00",
      end: "2027-02-17T16:00:00-08:00",
      location: "Student Union Ballroom",
      timeText: "12pm - 4pm"
    },
    {
      slug: "careers-in-tech-for-non-tech-majors-spring-2027",
      title: "Careers in Tech for Non-Tech Majors - Spring 2027",
      url: "https://careercenter.sjsu.edu/events/2027/02/25/careers-in-tech-for-non-tech-majors-spring-2027/",
      start: "2027-02-25T17:00:00-08:00",
      end: "2027-02-25T18:00:00-08:00",
      location: "Virtual",
      timeText: "5pm - 6pm"
    },
    {
      slug: "sjsu-spring-27-health-wellness-public-service-job-internship-fair",
      title: "SJSU Spring '27 Health, Wellness & Public Service Job/Internship Fair",
      url: "https://careercenter.sjsu.edu/events/2027/03/10/sjsu-spring-27-health-wellness-public-service-job-internship-fair/",
      start: "2027-03-10T15:00:00-08:00",
      end: "2027-03-10T18:00:00-08:00",
      location: "211 South 9th Street, San Jose, California 95112, United States",
      timeText: "3pm - 6pm"
    },
    {
      slug: "college-of-social-sciences-career-summit-2",
      title: "College of Social Sciences Career Summit",
      url: "https://careercenter.sjsu.edu/events/2027/03/11/college-of-social-sciences-career-summit-2/",
      start: "2027-03-11T15:00:00-08:00",
      end: "2027-03-11T18:30:00-08:00",
      location: "Student Union, Ballroom, 211 S 9th St, San Jose, CA 95112, United States",
      timeText: "3pm - 6:30pm"
    }
  ]
};

// src/data/scraped/sjsu-resources.json
var sjsu_resources_default = {
  scrapedAt: "2026-11-10T19:19:16.096Z",
  source: "SJSU Career Center",
  sourceUrl: "https://careercenter.sjsu.edu",
  resources: [
    {
      slug: "request-a-workshop",
      title: "Request a Workshop",
      url: "https://careercenter.sjsu.edu/resources/request-a-workshop/",
      snippet: "The SJSU Career Center partners with faculty and staff to provide career development workshops that support student success. Whether you're ..."
    },
    {
      slug: "job-search-academy-by-indeed",
      title: "Job Search Academy by Indeed",
      url: "https://careercenter.sjsu.edu/resources/job-search-academy-by-indeed/",
      snippet: "The Job Search Academy is a free, virtual career development program created to help students excel in their job search. ..."
    },
    {
      slug: "faculty-instructor-faqs",
      title: "Faculty & Instructor FAQs",
      url: "https://careercenter.sjsu.edu/resources/hiration-faqs-for-faculty/",
      snippet: "Hiration Training for Faculty Learn how to navigate Hiration, explore its AI-powered career preparation tools, and incorporate the platform into ..."
    },
    {
      slug: "hiration",
      title: "Hiration",
      url: "https://careercenter.sjsu.edu/resources/hiration/",
      snippet: "Hiration helps you build stronger application materials and improve your interview skills with personalized, AI-powered feedback. Whether you're creating your ..."
    },
    {
      slug: "rapid-employment-program",
      title: "Rapid Employment Program",
      url: "https://careercenter.sjsu.edu/resources/students-rapid-employment-program/",
      snippet: "Need a job quickly? Whether you're facing an unexpected financial challenge, looking for immediate income, or simply ready to start ..."
    },
    {
      slug: "application-tracking-worksheet",
      title: "Application Tracking Worksheet",
      url: "https://careercenter.sjsu.edu/resources/application-tracking-worksheet/",
      snippet: "Stay organized throughout your job or internship search with this application tracking worksheet. Keep track of opportunities, application deadlines, follow-up ..."
    },
    {
      slug: "making-the-most-of-career-fairs",
      title: "Making the Most of Career Fairs",
      url: "https://careercenter.sjsu.edu/resources/making-the-most-of-career-fairs/",
      snippet: "Prepare for your next career fair with practical tips for making a strong impression. Learn how to research employers, introduce ..."
    },
    {
      slug: "action-verbs-list",
      title: "Action Verbs List",
      url: "https://careercenter.sjsu.edu/resources/action-verbs-list/",
      snippet: "Strengthen your resume and application materials with this list of action verbs. Find impactful words to describe your skills, experiences, ..."
    },
    {
      slug: "grow-your-career-with-google",
      title: "Grow Your Career with Google",
      url: "https://careercenter.sjsu.edu/resources/google-career-certificates/",
      snippet: "Learn in-demand skills from Google experts and industry professionals at your own pace. San Jose State University offers a growing ..."
    },
    {
      slug: "post-on-campus-jobs",
      title: "Post On-Campus Jobs",
      url: "https://careercenter.sjsu.edu/resources/post-on-campus-jobs/",
      snippet: "Hiring student employees is one of the best ways to support student success while helping your department meet its staffing ..."
    },
    {
      slug: "skills-reflection",
      title: "Skills Reflection",
      url: "https://careercenter.sjsu.edu/resources/skills-reflection/",
      snippet: "Use this guided worksheet to reflect on your experiences, identify the skills you\u2019ve developed, and connect them to your career ..."
    },
    {
      slug: "career-outcomes-report-archive",
      title: "Career Outcomes Report Archive",
      url: "https://careercenter.sjsu.edu/resources/career-outcomes-archive/",
      snippet: "Browse historical Career Outcomes reports and supplemental data from previous graduating classes. Prior to the current Career Outcomes Report format, ..."
    },
    {
      slug: "digital-career-tools",
      title: "Digital Career Tools",
      url: "https://careercenter.sjsu.edu/resources/free-digital-career-tools/",
      snippet: "Whether you're exploring career options, searching for internships, preparing application materials, or developing professional skills, SJSU offers a collection of ..."
    },
    {
      slug: "career-navigation-recommendations-october-2024",
      title: "Career Navigation Recommendations - October 2024",
      url: "https://careercenter.sjsu.edu/resources/career-navigation-recommendations-october-2024/",
      snippet: "This report provides a strategic framework to enhance career navigation for learners transitioning from education into full-time, living-wage employment. Synthesizing ..."
    },
    {
      slug: "nace-job-outlook-2025",
      title: "NACE Job Outlook 2025",
      url: "https://careercenter.sjsu.edu/resources/nace-job-outlook-2025/",
      snippet: "The NACE Job Outlook 2025 report provides a comprehensive forecast of hiring intentions and employment trends for college graduates from ..."
    },
    {
      slug: "nace-2024-student-survey-report",
      title: "NACE 2024 Student Survey Report",
      url: "https://careercenter.sjsu.edu/resources/nace-2024-student-survey-report/",
      snippet: "The NACE 2024 Student Survey Report (Four-Year Schools) provides key insights into the career attitudes, job search behaviors, experiential learning ..."
    },
    {
      slug: "nace-2024-student-survey-report-executive-summary",
      title: "NACE 2024 Student Survey Report - Executive Summary",
      url: "https://careercenter.sjsu.edu/resources/nace-2024-student-survey-executive-summary/",
      snippet: "Published by the National Association of Colleges and Employers (NACE), this executive summary explores the attitudes, preferences, and career outcomes ..."
    },
    {
      slug: "nace-salary-survey-winter-2024",
      title: "NACE Salary Survey - Winter 2024",
      url: "https://careercenter.sjsu.edu/resources/winter-2024-nace-salary-survey/",
      snippet: "The Winter 2024 NACE Salary Survey report provides starting salary projections for Class of 2024 new college graduates based on ..."
    },
    {
      slug: "nace-2023-internship-co-op-report-executive-summary",
      title: "NACE 2023 Internship & Co-Op Report - Executive Summary",
      url: "https://careercenter.sjsu.edu/resources/nace-2023-internship-and-co-op-report-executive-summary/",
      snippet: "Explore key employer benchmarks and hiring projections for experiential learning programs in the 2022\u201323 academic year. Published by the National ..."
    },
    {
      slug: "nace-salary-survey-summer-2023",
      title: "NACE Salary Survey - Summer 2023",
      url: "https://careercenter.sjsu.edu/resources/summer-2023-nace-salary-survey/",
      snippet: "Explore salary trends for recent college graduates with data from the NACE Summer 2023 Salary Survey. Use this report to ..."
    },
    {
      slug: "nace-2021-brief-inequity-in-internships",
      title: "NACE 2021 Brief: Inequity in Internships",
      url: "https://careercenter.sjsu.edu/resources/nace-2021-brief-inequity-in-internships/",
      snippet: "This research brief from the National Association of Colleges and Employers (NACE) examines how internship opportunities\u2014particularly paid internships\u2014are distributed across ..."
    },
    {
      slug: "career-center-engagement-dashboard",
      title: "Career Center Engagement Dashboard",
      url: "https://careercenter.sjsu.edu/resources/student-engagement-dashboard/",
      snippet: "Explore comprehensive, interactive data on student engagement with Career Center programs, services, events, and digital career resources. The dashboard helps ..."
    },
    {
      slug: "rapid-employment-program-2",
      title: "Rapid Employment Program",
      url: "https://careercenter.sjsu.edu/resources/rapid-employment-program/",
      snippet: "The Rapid Employment Program helps employers quickly connect with SJSU students who are actively seeking immediate employment. Through targeted promotion, ..."
    },
    {
      slug: "empower-api-futures-navigating-careers-with-purpose-and-identity",
      title: "Empower API Futures: Navigating Careers with Purpose and Identity",
      url: "https://careercenter.sjsu.edu/resources/empower-api-futures-navigating-careers-with-purpose-and-identity/",
      snippet: ""
    },
    {
      slug: "career-champions-program",
      title: "Career Champions Program",
      url: "https://careercenter.sjsu.edu/resources/career-champions-program-2/",
      snippet: "The Career Champions Program is a partnership between the SJSU Career Center and academic colleges that equips faculty and staff ..."
    },
    {
      slug: "career-champions-program-flyer",
      title: "Career Champions Program Flyer",
      url: "https://careercenter.sjsu.edu/resources/career-champions-program-flyer/",
      snippet: "An initiative driven by the SJSU Career Center and Colleges to provide faculty and staff with career development resources and ..."
    },
    {
      slug: "work2future",
      title: "work2future",
      url: "https://careercenter.sjsu.edu/resources/work-2-future/",
      snippet: "work2future, the Silicon Valley Workforce Investment Network, operates three one-stop career centers in the areas of San Jose, Campbell and ..."
    },
    {
      slug: "sjpl-works",
      title: "SJPL Works",
      url: "https://careercenter.sjsu.edu/resources/sjpl-works/",
      snippet: "SJPL Works is a network of resources available through the San Jose Public Library, providing work and conference spaces, career ..."
    },
    {
      slug: "novaworks",
      title: "NOVAworks",
      url: "http://www.novaworks.org/",
      snippet: "NOVAworks is a nonprofit, federally-funded employment and training agency that provides customer-focused workforce development services."
    },
    {
      slug: "careeronestop",
      title: "CareerOneStop",
      url: "http://www.careeronestop.org/",
      snippet: "CareerOneStop provides tools to help job seekers, students, business, and career professionals. Sponsored by the U.S. Department of Labor."
    },
    {
      slug: "sjsu-22-23-fds-career-outcomes-embark",
      title: "SJSU 22-23 FDS Career Outcomes (EMBARK)",
      url: "https://careercenter.sjsu.edu/resources/sjsu-22-23-fds-career-outcomes-embark/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2022\u20132023 ..."
    },
    {
      slug: "ay-22-23-career-center-annual-report",
      title: "AY 22/23 Career Center Annual Report",
      url: "https://careercenter.sjsu.edu/resources/ay-22-23-career-outcomes-report/",
      snippet: "This annual outcomes report highlights key milestones, engagement metrics, and impact data from the San Jos\xE9 State University Career Center ..."
    },
    {
      slug: "resume-samples-by-major",
      title: "Resume Samples by Major",
      url: "https://careercenter.sjsu.edu/resources/resume-samples-by-major/",
      snippet: "Use these resume samples by major to see how resumes can be tailored to different career fields. Review a sample ..."
    },
    {
      slug: "sjsu-20-21-fds-career-outcomes",
      title: "SJSU 20-21 FDS Career Outcomes",
      url: "https://careercenter.sjsu.edu/resources/sjsu-20-21-fds-career-outcomes/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2020\u20132021 ..."
    },
    {
      slug: "what-can-i-do-with-this-major",
      title: "What Can I Do With This Major?",
      url: "https://careercenter.sjsu.edu/resources/what-can-i-do-with-this-major/",
      snippet: "What Can I Do With This Major? is a website featuring 106 major profiles with information on common career paths, ..."
    },
    {
      slug: "industrial-design-clubs",
      title: "Industrial Design Clubs",
      url: "https://www.sjsu.edu/design/undergraduate-programs/industrial-design/clubs.php",
      snippet: "Student organizations within the Department of Design."
    },
    {
      slug: "neo-graphic-design-club",
      title: "NEO Graphic Design Club",
      url: "https://www.instagram.com/neodesignclub/?hl=en",
      snippet: "Student organization created to promote creative growth and awareness of graphic design as a culture and a community."
    },
    {
      slug: "shrunkenheadman-club",
      title: "Shrunkenheadman Club",
      url: "https://careercenter.sjsu.edu/resources/shrunkenheadman-club/",
      snippet: "SJSU's Animation/Illustration student organization. The club provides a multitude of services, including hosting guest presentations, weekly figure drawing sessions, and ..."
    },
    {
      slug: "department-of-geology-professional-organizations",
      title: "Department of Geology Professional Organizations",
      url: "https://www.sjsu.edu/geology/student-resources/links.php",
      snippet: "Comprehensive list of professional societies and affinity groups"
    },
    {
      slug: "geology-club-speaker-series",
      title: "Geology Club Speaker Series",
      url: "https://careercenter.sjsu.edu/resources/geology-club-speaker-series/",
      snippet: "Geology Club's weekly event, which gives students and faculty the opportunity to hear geology-related talks from guest professionals and educators ..."
    },
    {
      slug: "department-of-computer-science-clubs",
      title: "Department of Computer Science Clubs",
      url: "https://www.sjsu.edu/cs/community-and-events/resources/computer-science-club.php",
      snippet: "Allow students to socialize, build community, gain skills, and develop leadership."
    },
    {
      slug: "silicon-valley-acs-american-chemical-society",
      title: "Silicon Valley ACS (American Chemical Society)",
      url: "https://www.siliconvalleyacs.org/",
      snippet: "Engages the chemistry community by providing professional development, educational opportunities, networking, and recognition."
    },
    {
      slug: "biology-students-association-bsa",
      title: "Biology Students Association (BSA)",
      url: "https://careercenter.sjsu.edu/resources/biology-students-association-bsa/",
      snippet: "Designed for students with a wide variety of interests in the vast field of biology, from ecology and evolutionary biology, ..."
    },
    {
      slug: "college-of-business-student-organizations",
      title: "College of Business Student Organizations",
      url: "https://careercenter.sjsu.edu/resources/college-of-business-student-organizations/",
      snippet: "Student organizations that help enrich students' academic experience while engaging in an aspect of business that appeals to their career ..."
    },
    {
      slug: "college-of-engineering-student-organizations",
      title: "College of Engineering Student Organizations",
      url: "https://www.sjsu.edu/engineering/student-success/studentprograms/student-orgs/index.php",
      snippet: "Student Organizations Directory including competition/project-based and discipline/major-specific groups, honor societies and fraternities, and special interest/multicultural groups."
    },
    {
      slug: "college-of-education-student-organizations-and-leadership",
      title: "College of Education Student Organizations and Leadership",
      url: "https://careercenter.sjsu.edu/resources/college-of-education-student-organizations-and-leadership/",
      snippet: "Opportunities for SJSU Lurie College of Education undergraduate, graduate, credential, and doctoral students to get involved in the community through ..."
    },
    {
      slug: "pi-sigma-alpha",
      title: "Pi Sigma Alpha",
      url: "https://careercenter.sjsu.edu/resources/pi-sigma-alpha/",
      snippet: "The National Political Science Honor Society and the only honor society for college students of political science and government in ..."
    },
    {
      slug: "urban-regional-planning-student-groups",
      title: "Urban & Regional Planning Student Groups",
      url: "https://www.sjsu.edu/urbanplanning/about-us/student-groups.php",
      snippet: "Student-run organizations that aims to enrich the academic experience for all students interested in urban and regional planning."
    },
    {
      slug: "the-banking-and-investment-association-bia",
      title: "The Banking and Investment Association (BIA)",
      url: "https://careercenter.sjsu.edu/resources/the-banking-and-investment-association-bia/",
      snippet: "Bringing students together to form a powerful learning environment through informative speakers, networking opportunities, community involvement, and exclusive internships that ..."
    },
    {
      slug: "alpha-kappa-psi-akp",
      title: "Alpha Kappa Psi (AKP)",
      url: "https://www.sjsuakpsi.com/#intro-1",
      snippet: "Alpha Kappa Psi is a co-ed organization that provides resources for the educational experience of future business leaders."
    },
    {
      slug: "aiesec",
      title: "AIESEC",
      url: "https://careercenter.sjsu.edu/resources/aiesec/",
      snippet: "AIESEC is a global platform that shapes leaders for tomorrow by helping young people develop their leadership potential through international ..."
    },
    {
      slug: "advancement-institute-for-management-aim",
      title: "Advancement Institute for Management (AIM)",
      url: "https://careercenter.sjsu.edu/resources/advancement-institute-for-management-aim/",
      snippet: "Advancement Institute for Management provides an opportunity for members to increase management skills and expertise through participation in programs and ..."
    },
    {
      slug: "canvas-resources-assignments",
      title: "Canvas Resources & Assignments",
      url: "https://careercenter.sjsu.edu/resources/canvas-resources/",
      snippet: "The Career Center offers ready-to-use career preparation resources developed by Career Center professionals and grounded in career development and design ..."
    },
    {
      slug: "higher-ed-s-next-chapter-23-24-wiley-report",
      title: "Higher Ed's Next Chapter - 23-24 Wiley Report",
      url: "https://careercenter.sjsu.edu/resources/higher-eds-next-chapter-23-24-wiley-report/",
      snippet: "Discover key insights into the evolving higher education landscape with Wiley\u2019s Higher Ed\u2019s Next Chapter (2023\u20132024) report. Based on surveys ..."
    },
    {
      slug: "american-occupational-therapy-association-aota",
      title: "American Occupational Therapy Association (AOTA)",
      url: "https://www.aota.org",
      snippet: "The representative professional body for occupational therapy."
    },
    {
      slug: "american-therapeutic-recreation-association-atra",
      title: "American Therapeutic Recreation Association (ATRA)",
      url: "https://www.atra-online.com",
      snippet: "Supports the profession of therapeutic recreation by providing education, certification, and resources."
    },
    {
      slug: "national-recreation-and-park-association-nrpa",
      title: "National Recreation and Park Association (NRPA)",
      url: "https://www.nrpa.org",
      snippet: "Advances the profession of parks and recreation by providing education, research, and advocacy."
    },
    {
      slug: "american-academy-of-nursing-aan",
      title: "American Academy of Nursing (AAN)",
      url: "https://www.aannet.org/home",
      snippet: "A preeminent organization for nursing scholars, practitioners, and health policy leaders."
    },
    {
      slug: "american-nurses-association-ana",
      title: "American Nurses Association (ANA)",
      url: "https://www.nursingworld.org",
      snippet: "The largest nursing organization in the world."
    },
    {
      slug: "american-public-health-association-apha",
      title: "American Public Health Association (APHA)",
      url: "https://www.apha.org",
      snippet: "A public health organization that works to promote health and well-being for all people."
    },
    {
      slug: "american-nutrition-association-ana",
      title: "American Nutrition Association (ANA)",
      url: "https://theana.org",
      snippet: "Provides education and resources for nutrition professionals and the general public."
    },
    {
      slug: "national-association-for-nutrition-professionals-nanp",
      title: "National Association for Nutrition Professionals (NANP)",
      url: "https://nanp.org",
      snippet: "Supports and advocates for nutrition professionals."
    },
    {
      slug: "american-society-for-nutrition-asn",
      title: "American Society for Nutrition (ASN)",
      url: "https://nutrition.org",
      snippet: "Advances the science of nutrition to improve the health of people worldwide."
    },
    {
      slug: "academy-of-nutrition-and-dietetics-and",
      title: "Academy of Nutrition and Dietetics (AND)",
      url: "https://www.eatright.org",
      snippet: "The world's largest organization of food and nutrition professionals."
    },
    {
      slug: "north-american-society-for-sport-management-nassm",
      title: "North American Society for Sport Management (NASSM)",
      url: "https://nassm.org",
      snippet: "Advances the field of sport management by providing education, research, and networking opportunities."
    },
    {
      slug: "national-strength-and-conditioning-association-nsca",
      title: "National Strength and Conditioning Association (NSCA)",
      url: "https://www.nsca.com",
      snippet: "Supports and promotes the profession of strength and conditioning by providing education, certification, and resources."
    },
    {
      slug: "american-kinesiology-association-aka",
      title: "American Kinesiology Association (AKA)",
      url: "https://americankinesiology.org",
      snippet: "Promotes the study and practice of kinesiology, the science of human movement."
    },
    {
      slug: "society-of-health-and-physical-educators-shape-america",
      title: "Society of Health and Physical Educators (SHAPE America)",
      url: "https://www.shapeamerica.org/",
      snippet: "Advances the profession of health and physical education by providing resources, professional development, and advocacy."
    },
    {
      slug: "national-athletic-trainers-association-nata",
      title: "National Athletic Trainers' Association (NATA)",
      url: "https://www.nata.org/",
      snippet: "Provides support and resources for athletic trainers to help them provide the best possible care for their patients."
    },
    {
      slug: "student-nurse-organizations",
      title: "Student Nurse Organizations",
      url: "https://www.sjsu.edu/nursing/current-students/student-organizations.php",
      snippet: "SJSU has nine student nurse organizations serving a variety of populations."
    },
    {
      slug: "sigma-theta-tau-international-alpha-gamma-chapter",
      title: "Sigma Theta Tau International, Alpha Gamma Chapter",
      url: "https://careercenter.sjsu.edu/resources/sigma-theta-tau-international-alpha-gamma-chapter/",
      snippet: "Alpha Gamma is a chapter of Sigma Theta Tau International, a nursing's honor society. Its purpose is to recognize the ..."
    },
    {
      slug: "public-health-student-associations",
      title: "Public Health Student Associations",
      url: "https://careercenter.sjsu.edu/resources/public-health-student-associations/",
      snippet: "The various Public Health Student Associations promote and facilitate professional development, communication, and peer support among Public Health students and ..."
    },
    {
      slug: "pi-theta-epsilon-pte",
      title: "Pi Theta Epsilon (PTE)",
      url: "https://careercenter.sjsu.edu/resources/pi-theta-epsilon-pte/",
      snippet: "The Pi Theta Epsilon (PTE) Gamma Mu Chapter is the National Occupational Therapy Honor Society at San Jose State University. ..."
    },
    {
      slug: "student-occupational-therapy-association-sota",
      title: "Student Occupational Therapy Association (SOTA)",
      url: "https://careercenter.sjsu.edu/resources/student-occupational-therapy-association-sota/",
      snippet: "SOTA provides students in the Occupational Therapy major exposure to a pre-professional program, as well as educational opportunities to students ..."
    },
    {
      slug: "nutrition-and-food-science-club",
      title: "Nutrition and Food Science Club",
      url: "https://careercenter.sjsu.edu/resources/nutrition-and-food-science-club/",
      snippet: "The Nutrition and Food Science Club aims to support students interested in the field of nutrition and food science by ..."
    },
    {
      slug: "department-of-kinesiology-student-clubs",
      title: "Department of Kinesiology - Student Clubs",
      url: "https://careercenter.sjsu.edu/resources/department-of-kinesiology-student-clubs/",
      snippet: "The Department of Kinesiology has many opportunities for students to become professionally involved including participation in student clubs and attendance ..."
    },
    {
      slug: "transferable-skills",
      title: "Transferable Skills",
      url: "https://careercenter.sjsu.edu/resources/transferable-skills/",
      snippet: "Identify the transferable skills you\u2019ve developed through work, academics, activities, and other experiences. Use this worksheet to recognize your strengths ..."
    },
    {
      slug: "skills-inventory",
      title: "Skills Inventory",
      url: "https://careercenter.sjsu.edu/resources/skills-inventory/",
      snippet: "Skills can be developed and applied to all aspects of our lives including education, internships, volunteering, jobs, careers, and leisure ..."
    },
    {
      slug: "career-values-assessment",
      title: "Career Values Assessment",
      url: "https://careercenter.sjsu.edu/resources/career-values-assessment/",
      snippet: "Our values are the core principles which give meaning to our lives. When our values are aligned with our work ..."
    },
    {
      slug: "elevate-career-hub-sponsored-by-adobe",
      title: "Elevate Career Hub, Sponsored by Adobe",
      url: "https://careercenter.sjsu.edu/resources/career-hub/",
      snippet: "The Elevate Career Hub, sponsored by Adobe, is a collaborative learning space where SJSU students can develop in-demand digital skills ..."
    },
    {
      slug: "sjsu-21-22-fds-career-outcomes-embark",
      title: "SJSU 21-22 FDS Career Outcomes (EMBARK)",
      url: "https://careercenter.sjsu.edu/resources/sjsu-21-22-fds-career-outcomes-embark/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2021\u20132022 ..."
    },
    {
      slug: "sjsu-19-20-fds-career-outcomes",
      title: "SJSU 19-20 FDS Career Outcomes",
      url: "https://careercenter.sjsu.edu/resources/sjsu-19-20-fds-career-outcomes/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2019\u20132020 ..."
    },
    {
      slug: "sjsu-18-19-fds-career-outcomes",
      title: "SJSU 18-19 FDS Career Outcomes",
      url: "https://careercenter.sjsu.edu/resources/sjsu-18-19-fds-career-outcomes/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2018\u20132019 ..."
    },
    {
      slug: "sjsu-17-18-fds-career-outcomes",
      title: "SJSU 17-18 FDS Career Outcomes",
      url: "https://careercenter.sjsu.edu/resources/sjsu-17-18-fds-career-outcomes/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2017\u20132018 ..."
    },
    {
      slug: "sjsu-16-17-fds-career-outcomes",
      title: "SJSU 16-17 FDS Career Outcomes",
      url: "https://careercenter.sjsu.edu/resources/sjsu-16-17-fds-career-outcomes/",
      snippet: "This report summarizes the initial career outcomes for San Jos\xE9 State University (SJSU) undergraduate and graduate students in the 2016\u20132017 ..."
    },
    {
      slug: "sjsu-20-21-fds-salary-survey",
      title: "SJSU 20-21 FDS Salary Survey",
      url: "https://careercenter.sjsu.edu/resources/sjsu-20-21-fds-salary-survey/",
      snippet: "This document provides salary data reported by San Jos\xE9 State University graduates from the 2020\u20132021 academic year. Prepared by the ..."
    },
    {
      slug: "sjsu-19-20-fds-salary-survey",
      title: "SJSU 19-20 FDS Salary Survey",
      url: "https://careercenter.sjsu.edu/resources/sjsu-19-20-fds-salary-survey/",
      snippet: "This document provides salary data reported by San Jos\xE9 State University graduates from the 2019\u20132020 academic year. Prepared by the ..."
    },
    {
      slug: "sjsu-18-19-fds-salary-survey",
      title: "SJSU 18-19 FDS Salary Survey",
      url: "https://careercenter.sjsu.edu/resources/sjsu-18-19-fds-salary-survey/",
      snippet: "This document provides salary data reported by San Jos\xE9 State University graduates from the 2018\u20132019 academic year. Prepared by the ..."
    },
    {
      slug: "sjsu-17-18-fds-salary-survey",
      title: "SJSU 17-18 FDS Salary Survey",
      url: "https://careercenter.sjsu.edu/resources/sjsu-17-18-fds-salary-survey/",
      snippet: "This document provides salary data reported by San Jos\xE9 State University graduates from the 2017\u20132018 academic year. Prepared by the ..."
    },
    {
      slug: "sjsu-16-17-fds-salary-survey",
      title: "SJSU 16-17 FDS Salary Survey",
      url: "https://careercenter.sjsu.edu/resources/sjsu-16-17-fds-salary-survey/",
      snippet: "This document provides salary data reported by San Jos\xE9 State University graduates from the 2016\u20132017 academic year. Prepared by the ..."
    },
    {
      slug: "sjsu-20-21-fds-top-employers-and-industries",
      title: "SJSU 20-21 FDS Top Employers and Industries",
      url: "https://careercenter.sjsu.edu/resources/sjsu-20-21-fds-top-employers-and-industries/",
      snippet: "This document highlights the top employers and primary hiring industries for San Jose State University graduates from the 2020\u20132021 academic ..."
    },
    {
      slug: "sjsu-19-20-fds-top-employers-and-industries",
      title: "SJSU 19-20 FDS Top Employers and Industries",
      url: "https://careercenter.sjsu.edu/resources/sjsu-19-20-fds-top-employers-and-industries/",
      snippet: "This document highlights the top employers and primary hiring industries for San Jose State University graduates from the 2019\u20132020 academic ..."
    },
    {
      slug: "sjsu-18-19-fds-top-employers-and-industries",
      title: "SJSU 18-19 FDS Top Employers and Industries",
      url: "https://careercenter.sjsu.edu/resources/sjsu-18-19-fds-top-employers-and-industries/",
      snippet: "This document highlights the top employers and primary hiring industries for San Jose State University graduates from the 2018\u20132019 academic ..."
    },
    {
      slug: "sjsu-17-18-fds-top-employers-and-industries",
      title: "SJSU 17-18 FDS Top Employers and Industries",
      url: "https://careercenter.sjsu.edu/resources/sjsu-17-18-fds-top-employers-and-industries/",
      snippet: "This document highlights the top employers and primary hiring industries for San Jose State University graduates from the 2017\u20132018 academic ..."
    },
    {
      slug: "sjsu-16-17-fds-top-employers-and-industries",
      title: "SJSU 16-17 FDS Top Employers and Industries",
      url: "https://careercenter.sjsu.edu/resources/sjsu-16-17-fds-top-employers-and-industries/",
      snippet: "This document highlights the top employers and primary hiring industries for San Jose State University graduates from the 2016\u20132017 academic ..."
    },
    {
      slug: "sjsu-20-21-fds-top-job-functions-and-titles",
      title: "SJSU 20-21 FDS Top Job Functions and Titles",
      url: "https://careercenter.sjsu.edu/resources/sjsu-20-21-fds-top-job-functions-and-titles/",
      snippet: "Discover the key career paths and entry-level roles for San Jose State University graduates. Based on data collected by the ..."
    },
    {
      slug: "sjsu-19-20-fds-top-job-functions-and-titles",
      title: "SJSU 19-20 FDS Top Job Functions and Titles",
      url: "https://careercenter.sjsu.edu/resources/sjsu-19-20-fds-top-job-functions-and-titles/",
      snippet: "Discover the key career paths and entry-level roles for San Jose State University graduates. Based on data collected by the ..."
    },
    {
      slug: "sjsu-17-18-fds-top-job-functions-and-titles",
      title: "SJSU 17-18 FDS Top Job Functions and Titles",
      url: "https://careercenter.sjsu.edu/resources/sjsu-17-18-fds-top-job-functions-and-titles/",
      snippet: "Discover the key career paths and entry-level roles for San Jose State University graduates. Based on data collected by the ..."
    },
    {
      slug: "sjsu-16-17-fds-top-job-functions-and-titles",
      title: "SJSU 16-17 FDS Top Job Functions and Titles",
      url: "https://careercenter.sjsu.edu/resources/sjsu-16-17-fds-top-job-functions-and-titles/",
      snippet: "Discover the key career paths and entry-level roles for San Jose State University graduates. Based on data collected by the ..."
    },
    {
      slug: "sjsu-20-21-fds-top-graduate-and-professional-school-destinations",
      title: "SJSU 20-21 FDS Top Graduate and Professional School Destinations",
      url: "https://careercenter.sjsu.edu/resources/sjsu-20-21-fds-top-graduate-and-professional-school-destinations/",
      snippet: "Discover where San Jos\xE9 State University graduates continue their education. This document highlights the top master\u2019s and doctoral degree destinations ..."
    },
    {
      slug: "sjsu-19-20-fds-top-graduate-and-professional-school-destinations",
      title: "SJSU 19-20 FDS Top Graduate and Professional School Destinations",
      url: "https://careercenter.sjsu.edu/resources/sjsu-19-20-fds-top-graduate-and-professional-school-destinations/",
      snippet: "Discover where San Jos\xE9 State University graduates continue their education. This document highlights the top master\u2019s and doctoral degree destinations ..."
    },
    {
      slug: "sjsu-18-19-fds-top-graduate-and-professional-school-destinations",
      title: "SJSU 18-19 FDS Top Graduate and Professional School Destinations",
      url: "https://careercenter.sjsu.edu/resources/sjsu-18-19-fds-top-graduate-and-professional-school-destinations/",
      snippet: "Discover where San Jos\xE9 State University graduates continue their education. This document highlights the top master\u2019s and doctoral degree destinations ..."
    },
    {
      slug: "sjsu-17-18-fds-top-graduate-and-professional-school-destinations",
      title: "SJSU 17-18 FDS Top Graduate and Professional School Destinations",
      url: "https://careercenter.sjsu.edu/resources/sjsu-17-18-fds-top-graduate-and-professional-school-destinations/",
      snippet: "Discover where San Jos\xE9 State University graduates continue their education. This document highlights the top master\u2019s and doctoral degree destinations ..."
    },
    {
      slug: "sjsu-16-17-fds-top-graduate-and-professional-school-destinations",
      title: "SJSU 16-17 FDS Top Graduate and Professional School Destinations",
      url: "https://careercenter.sjsu.edu/resources/sjsu-16-17-fds-top-graduate-and-professional-school-destinations/",
      snippet: "Discover where San Jos\xE9 State University graduates continue their education. This document highlights the top master\u2019s and doctoral degree destinations ..."
    },
    {
      slug: "career-center-reports-outcomes",
      title: "Career Center Reports & Outcomes",
      url: "https://careercenter.sjsu.edu/resources/career-success-outcomes/",
      snippet: "Explore Career Center reports and interactive data on student engagement and graduate outcomes, and external research on employment trends. Use ..."
    },
    {
      slug: "job-shadow-program",
      title: "Job Shadow Program",
      url: "https://careercenter.sjsu.edu/resources/students-job-shadow-program/",
      snippet: "The SJSU Job Shadow Program is an opportunity for students to connect with a professional in order to learn about ..."
    },
    {
      slug: "career-treks",
      title: "Career Treks",
      url: "https://careercenter.sjsu.edu/resources/students-career-treks/",
      snippet: "Career Treks are hands-on experiences where groups of 15-30 students have the opportunity to visit different companies and organizations, learn ..."
    },
    {
      slug: "sjsu-handshake-guide",
      title: "SJSU Handshake Guide",
      url: "https://careercenter.sjsu.edu/resources/sjsu-handshake-guide/",
      snippet: "View our SJSU Handshake Guide to learn how to find jobs and internships and register for career fairs, employer-connection events, ..."
    },
    {
      slug: "career-counselors-college-liaisons",
      title: "Career Counselors & College Liaisons",
      url: "https://careercenter.sjsu.edu/resources/career-counselors-college-liaisons/",
      snippet: "Use the Career Counselor & College Liaisons guide to find your Career Counselor. Students are welcome to meet with a ..."
    },
    {
      slug: "employer-services-expectations",
      title: "Employer Services & Expectations",
      url: "https://careercenter.sjsu.edu/resources/employer-services-expectations/",
      snippet: "The SJSU Career Center is committed to providing students and employers with services, programs, and opportunities that foster equity and ..."
    },
    {
      slug: "focus2-student-guide",
      title: "Focus2 Student Guide",
      url: "https://careercenter.sjsu.edu/resources/focus2-student-guide/",
      snippet: "Focus2 is an online major/career planning assessment tool that can help you identify potential majors/career paths to explore. View our ..."
    },
    {
      slug: "career-guides",
      title: "Career Guides",
      url: "https://careercenter.sjsu.edu/resources/career-guides/",
      snippet: "Career Center guides are designed to help students explore career paths, build experience, and successfully launch after graduation. Each interactive ..."
    },
    {
      slug: "explore-guide-focus2",
      title: "Explore Guide & Focus2",
      url: "https://youtu.be/lDR_625MUso",
      snippet: "Introduces the Major & Career Exploration Guide, self-assessment - Focus2, values, & skills"
    },
    {
      slug: "interviewing-guide",
      title: "Interviewing Guide",
      url: "https://careercenter.sjsu.edu/resources/interviewing-guide/",
      snippet: "An interview is more than answering questions. It's your opportunity to tell your story and show employers how your skills, ..."
    },
    {
      slug: "job-internship-search-guide",
      title: "Job/Internship Search Guide",
      url: "https://careercenter.sjsu.edu/resources/job-internship-search-guide/",
      snippet: "A successful job or internship search is not about submitting as many applications as possible. It is about finding opportunities ..."
    },
    {
      slug: "skills-gap-analysis",
      title: "Skills Gap Analysis",
      url: "https://careercenter.sjsu.edu/resources/skills-gap-analysis/",
      snippet: "Use this handout to analyze the requirements of a prospective job or internship, identify the skills and experiences needed, and ..."
    },
    {
      slug: "career-readiness-roadmap",
      title: "Career Readiness Roadmap",
      url: "https://careercenter.sjsu.edu/resources/career-readiness-roadmap/",
      snippet: "Stay on track by following the 3 essential milestones outlined in our career readiness roadmap. Key resources and activities are ..."
    },
    {
      slug: "build-experience-guide",
      title: "Build Experience Guide",
      url: "https://careercenter.sjsu.edu/resources/build-experience-guide/",
      snippet: "Identify your existing skills and strengths, and discover the various way to build new career-related skills through co-curricular programs, internships, ..."
    },
    {
      slug: "virtual-job-fairs-sjsu-handshake",
      title: "Virtual Job Fairs & SJSU Handshake",
      url: "https://careercenter.sjsu.edu/resources/job-fairs-sjsu-handshake/",
      snippet: "Introduces virtual job fairs, Handshake, & how to help students prepare."
    },
    {
      slug: "indigenous-journalists-association",
      title: "Indigenous Journalists Association",
      url: "https://careercenter.sjsu.edu/resources/indigenous-journalists-association/",
      snippet: "Empowers the Indigenous voice through journalism with programs and actions designed to enrich journalism and promote the accurate portrayal of ..."
    },
    {
      slug: "training-content-planning-session-recording",
      title: "Training/Content Planning Session Recording",
      url: "https://us-75844.app.gong.io/e/c-share/?tkn=1rtpvg1dr4mi3y7w2u9l6g0jo",
      snippet: ""
    },
    {
      slug: "resume-cv-cover-letter-guide",
      title: "Resume, CV & Cover Letter Guide",
      url: "https://careercenter.sjsu.edu/resources/resume-cover-letter-guide/",
      snippet: "Jump to: Resume | Curriculum Vitae (CV) | Cover Letter | Additional Resources Resume Your resume is often an employer's first impression of ..."
    },
    {
      slug: "professional-headshots",
      title: "Professional Headshots",
      url: "https://careercenter.sjsu.edu/resources/professional-headshots/",
      snippet: "Get a free professional headshot at the SJSU Career Center's Iris Photo Booth. Who Can Use the Photo Booth? Current ..."
    },
    {
      slug: "career-center-liaisons",
      title: "Career Center Liaisons",
      url: "https://careercenter.sjsu.edu/resources/career-center-liasions/",
      snippet: "Every academic college at San Jos\xE9 State University has a dedicated Career Counselor who partners with faculty and staff to ..."
    },
    {
      slug: "mentor-students",
      title: "Mentor Students",
      url: "https://careercenter.sjsu.edu/resources/mentor-students-alumni/",
      snippet: "Make a meaningful difference in students' professional development by engaging in our professional mentoring opportunities. Note: Our mentorship platform is ..."
    },
    {
      slug: "job-shadow-program-2",
      title: "Job Shadow Program",
      url: "https://careercenter.sjsu.edu/resources/job-shadow-program/",
      snippet: "The Job Shadow Program is an opportunity for professionals to connect with students either in-person or virtually to help them ..."
    },
    {
      slug: "career-treks-2",
      title: "Career Treks",
      url: "https://careercenter.sjsu.edu/resources/career-treks/",
      snippet: "Career Treks are hands-on experiences where groups of 15-30 students have the opportunity to visit your company and learn about ..."
    },
    {
      slug: "on-campus-interviews",
      title: "On-Campus Interviews",
      url: "https://careercenter.sjsu.edu/resources/on-campus-interviews/",
      snippet: "Conduct interviews in a convenient, professional setting at the SJSU Career Center. Our on-campus interview program allows employers to connect ..."
    },
    {
      slug: "student-organization-partner-program-sopp",
      title: "Student Organization Partner Program (SOPP)",
      url: "https://careercenter.sjsu.edu/resources/student-organization-partner-program-sopp/",
      snippet: "The Student Organization Partner Program (SOPP) connects employers with San Jos\xE9 State University's Recognized Student Organizations (RSOs) to create meaningful ..."
    },
    {
      slug: "employer-partner-program",
      title: "Employer Partner Program",
      url: "https://careercenter.sjsu.edu/resources/employer-partner-program/",
      snippet: "The Employer Partner Program is designed to help organizations build a strong, sustained presence at San Jos\xE9 State University while ..."
    },
    {
      slug: "employer-connection-events",
      title: "Employer Connection Events",
      url: "https://careercenter.sjsu.edu/resources/employer-connection-events/",
      snippet: "Employer Connection Events provide flexible ways to connect with SJSU students outside of career fairs. Whether you're introducing your organization, ..."
    },
    {
      slug: "career-fairs",
      title: "Career Fairs",
      url: "https://careercenter.sjsu.edu/resources/career-fair-info-for-employers/",
      snippet: "Career fairs are one of the most effective ways to recruit San Jos\xE9 State University students and alumni for internships, ..."
    },
    {
      slug: "post-opportunities",
      title: "Post Opportunities",
      url: "https://careercenter.sjsu.edu/resources/post-opportunities/",
      snippet: "Connect with talented SJSU students and alumni by posting opportunities in Handshake, the Career Center's online recruiting platform. Whether you're ..."
    },
    {
      slug: "spartan-career-closet",
      title: "Spartan Career Closet",
      url: "https://careercenter.sjsu.edu/resources/career-closet/",
      snippet: "Find free professional clothing for interviews, career fairs, networking events, and the workplace. Who Can Use the Career Closet? Current ..."
    },
    {
      slug: "career-counseling-appointments",
      title: "Career Counseling & Appointments",
      url: "https://careercenter.sjsu.edu/resources/career-counseling-appointments/",
      snippet: "Whether you're exploring majors, preparing for an internship, or negotiating a job offer, our career counselors provide personalized guidance to ..."
    },
    {
      slug: "career-fairs-events",
      title: "Career Fairs & Events",
      url: "https://careercenter.sjsu.edu/resources/career-fairs-events/",
      snippet: "The Career Center hosts a variety of events to help students network with employers, discover career paths, and find jobs ..."
    },
    {
      slug: "national-association-of-the-deaf",
      title: "National Association of the Deaf",
      url: "https://www.nad.org/",
      snippet: "Nation\u2019s premier civil rights organization of, by and for deaf and hard of hearing individuals in the U.S."
    },
    {
      slug: "american-council-of-the-blind",
      title: "American Council of the Blind",
      url: "https://www.acb.org/",
      snippet: "Increase the independence, security, equality of opportunity, and quality of life for all blind and visually impaired people."
    },
    {
      slug: "american-association-of-people-with-disabilities",
      title: "American Association of People with Disabilities",
      url: "https://www.aapd.com/",
      snippet: "Increasing the political and economic power of people with disabilities."
    },
    {
      slug: "american-association-on-intellectual-and-developmental-disabilities",
      title: "American Association on Intellectual and Developmental Disabilities",
      url: "https://www.aaidd.org/",
      snippet: "Promotes progressive policies, sound research, effective practices, and universal human rights for people with intellectual and developmental disabilities."
    },
    {
      slug: "abilitypath",
      title: "AbilityPath",
      url: "https://abilitypath.org/",
      snippet: "Support services for children, adults, and seniors with developmental disabilities and their families in the greater Bay Area."
    },
    {
      slug: "lime-connect",
      title: "Lime Connect",
      url: "https://careercenter.sjsu.edu/resources/lime-connect/",
      snippet: "Largest network of high-achieving students and professionals with visible and non-visible disabilities. Contact the organization to networking events, scholarships, internships, ..."
    },
    {
      slug: "job-accommodation-network-jan",
      title: "Job Accommodation Network (JAN)",
      url: "https://askjan.org/",
      snippet: "Leading source of free, expert, and confidential guidance on workplace accommodations and disability employment issues."
    },
    {
      slug: "inclusively",
      title: "Inclusively",
      url: "https://www.inclusively.com/",
      snippet: "Connects candidates with disabilities to employers cultivating diverse and inclusive workplaces."
    },
    {
      slug: "entry-point",
      title: "Entry Point",
      url: "https://careercenter.sjsu.edu/resources/entry-point/",
      snippet: "Encourages and develops talent among undergraduate and graduate students with disabilities who have demonstrated an interest in pursuing a STEM ..."
    },
    {
      slug: "ca-department-of-rehabilitation-dor",
      title: "CA Department of Rehabilitation (DOR)",
      url: "https://www.dor.ca.gov/",
      snippet: "Provide services and advocacy resulting in employment, independent living, and equality for individuals with disabilities."
    },
    {
      slug: "abilityjobs",
      title: "abilityJOBS",
      url: "https://abilityjobs.com/",
      snippet: "Largest job site for people with disabilities."
    },
    {
      slug: "vrc-veterans-alumni-panel",
      title: "VRC Veterans Alumni Panel",
      url: "https://careercenter.sjsu.edu/resources/vrc-veterans-alumni-panel/",
      snippet: ""
    },
    {
      slug: "student-veterans-of-america",
      title: "Student Veterans of America",
      url: "https://studentveterans.org/",
      snippet: "Provide resources, network support and advocacy to support student veteran success."
    },
    {
      slug: "military-officers-association-of-america",
      title: "Military Officers Association of America",
      url: "https://www.moaa.org/",
      snippet: "Nation's largest and most influential association of military officers."
    },
    {
      slug: "veteran-student-organization",
      title: "Veteran Student Organization",
      url: "https://careercenter.sjsu.edu/resources/veteran-student-organization/",
      snippet: "Promote, unify and support the military veteran voice on and off campus by bringing past, present, and future veterans of ..."
    },
    {
      slug: "veteran-jobs-mission",
      title: "Veteran Jobs Mission",
      url: "https://www.veteranjobsmission.com/",
      snippet: "Address the most pressing needs of veterans and military spouses in finding and keeping jobs."
    },
    {
      slug: "vetjobs",
      title: "VetJobs",
      url: "https://vetjobs.org/browse-jobs/home",
      snippet: "Provides Military & Veteran Communities exclusive access to their job board & job placement program."
    },
    {
      slug: "military-friendly",
      title: "Military Friendly",
      url: "https://www.militaryfriendly.com/",
      snippet: "Provides a list of military friendly employers."
    },
    {
      slug: "hire-vets-medallion-program",
      title: "Hire Vets Medallion Program",
      url: "https://www.hirevets.gov/",
      snippet: "Recognize employers for their investments in recruiting, employing, and retaining our nation\u2019s heroes."
    },
    {
      slug: "careeronestop-veteran-and-military-transition-center",
      title: "CareerOneStop: Veteran and Military Transition Center",
      url: "https://www.careeronestop.org/Veterans/default.aspx",
      snippet: "One-stop website for employment, training, and financial help after military service."
    },
    {
      slug: "adobe-sjsu-veterans-career-panel",
      title: "Adobe-SJSU Veterans Career Panel",
      url: "https://careercenter.sjsu.edu/resources/adobe-sjsu-veterans-career-panel/",
      snippet: "Watch this panel to learn about different career paths veteran employees at Adobe have pursued."
    },
    {
      slug: "undocublack-network",
      title: "UndocuBlack Network",
      url: "https://undocublack.org/",
      snippet: "Create space for currently and formerly undocumented Black immigrants to not only survive but thrive."
    },
    {
      slug: "united-we-dream",
      title: "United We Dream",
      url: "https://unitedwedream.org/",
      snippet: "Largest immigrant youth-led network."
    },
    {
      slug: "pre-health-dreamers",
      title: "Pre-Health Dreamers",
      url: "https://www.phdreamers.org/",
      snippet: "Network for undocumented students pursuing careers in health and science."
    },
    {
      slug: "dream-bar-association",
      title: "DREAM Bar Association",
      url: "https://dreambarassociation.wordpress.com/",
      snippet: "National bar association for undocumented lawyers and law students."
    },
    {
      slug: "undocuprofessionals",
      title: "Undocuprofessionals",
      url: "https://www.undocuprofessionals.net/about",
      snippet: "A national community for and by undocumented communities in all career fields."
    },
    {
      slug: "my-undocumented-life",
      title: "My Undocumented Life",
      url: "https://mydocumentedlife.org/",
      snippet: "Up-to-date information and resources for undocumented immigrants, including scholarships and job listing."
    },
    {
      slug: "micro-internships",
      title: "Micro-Internships",
      url: "https://careercenter.sjsu.edu/resources/micro-internships/",
      snippet: "TheDream.US has partnered with Parker Dewey to help Scholars from all majors connect with employers through professional projects to build ..."
    },
    {
      slug: "immigrants-rising",
      title: "Immigrants Rising",
      url: "https://careercenter.sjsu.edu/resources/immigrants-rising/",
      snippet: "Empower undocumented young people to achieve educational and career goals through personal, institutional and policy transformation. Check out their Life ..."
    },
    {
      slug: "association-of-american-indian-physicians",
      title: "Association of American Indian Physicians",
      url: "https://careercenter.sjsu.edu/resources/association-of-american-indian-physicians/",
      snippet: "Motivate American Indian and Alaskan Native students to remain in the academic pipeline and to pursue a career in the ..."
    },
    {
      slug: "american-indigenous-business-leaders-aibl",
      title: "American Indigenous Business Leaders (AIBL)",
      url: "https://www.aibl.org/",
      snippet: "Dedicated to empowering business students in the United States."
    },
    {
      slug: "american-indian-science-and-engineering-society-aises",
      title: "American Indian Science and Engineering Society (AISES)",
      url: "https://www.aises.org/",
      snippet: "Focused on substantially increasing the representation of Indigenous peoples of North America and the Pacific Islands STEM studies and careers."
    },
    {
      slug: "native-american-student-organization",
      title: "Native American Student Organization",
      url: "https://careercenter.sjsu.edu/resources/native-american-student-organization/",
      snippet: "Creates a space to learn and share common interests with each other\u2019s culture that bridges our communities and bonds everlasting ..."
    },
    {
      slug: "native-hire",
      title: "Native Hire",
      url: "https://www.nativehire.org/",
      snippet: "Tribal employment database working with companies specifically looking to hire Native Americans, includes training and apprenticeships."
    },
    {
      slug: "national-congress-of-american-indians",
      title: "National Congress of American Indians",
      url: "https://www.ncai.org/",
      snippet: "American Indian and Alaska Native indigenous rights organization, includes job listings."
    },
    {
      slug: "native-american-jobs",
      title: "Native American Jobs",
      url: "http://www.nativeamericanjobs.com/?_ga=2.217706773.241311103.1515473406-1791355361.1515473406",
      snippet: "Employment opportunities for all people from diverse, indigenous, and minority cultures."
    },
    {
      slug: "startout",
      title: "StartOut",
      url: "https://startout.org/",
      snippet: "Champion for the LGBTQ+ entrepreneurial community providing the resources entrepreneurs need to succeed."
    },
    {
      slug: "reaching-out-mba",
      title: "Reaching Out MBA",
      url: "https://reachingoutmba.org/",
      snippet: "Biggest and best known organization focused on supporting the LGBT+ MBA Community."
    },
    {
      slug: "pride-veterinary-medical-community",
      title: "PRIDE Veterinary Medical Community",
      url: "https://pridevmc.org/",
      snippet: "Create a better world for the LGBTQ+ veterinary community."
    },
    {
      slug: "ostem",
      title: "oSTEM",
      url: "https://careercenter.sjsu.edu/resources/ostem/",
      snippet: "Empowering LGBTQ+ people in the STEM community to achieve success in a safe and supportive environment that celebrates their diversity ..."
    },
    {
      slug: "out-to-innovate",
      title: "Out to Innovate",
      url: "https://noglstp.org/",
      snippet: "Professional society and global community of LGBTQ+ students and professionals in STEM."
    },
    {
      slug: "gay-and-lesbian-medical-association",
      title: "Gay and Lesbian Medical Association",
      url: "https://glma.org/",
      snippet: "Ensuring health equity for LGBTQ individuals and equality for LGBTQ healthcare professionals."
    },
    {
      slug: "queer-and-asian-sjsu",
      title: "Queer and Asian @ SJSU",
      url: "https://www.sjsu.edu/pride/organizations/student-organizations/qna.php",
      snippet: "Encourage students to raise positive awareness of queer, and pan-Asian communities at the SJSU campus."
    },
    {
      slug: "out-in-science-technology-engineering-and-mathematics-ostem-at-sjsu",
      title: "Out in Science, Technology, Engineering, and Mathematics (oSTEM) at SJSU",
      url: "https://www.sjsu.edu/pride/organizations/student-organizations/ostem.php",
      snippet: "Dedicated to educating and fostering leadership for LGBTQIA communities in the STE(A)M fields."
    },
    {
      slug: "sf-lgbt-center",
      title: "SF LGBT Center",
      url: "https://careercenter.sjsu.edu/resources/sf-lgbt-center/",
      snippet: "Connect a diverse community to opportunities, resources and each other to achieve a stronger, healthier, and more equitable world for ..."
    },
    {
      slug: "out-for-undergrad-o4u",
      title: "Out for Undergrad (O4U)",
      url: "https://www.outforundergrad.org/",
      snippet: "Help LGBTQ+ undergraduates reach their full potential by hosting three annual conferences where they're inspired to pursue ambitious careers."
    },
    {
      slug: "out-equal-workplace-advocates",
      title: "Out & Equal Workplace Advocates",
      url: "https://outandequal.org/",
      snippet: "Premier organization working exclusively on LGBTQ workplace equality."
    },
    {
      slug: "human-rights-campaign-corporate-equality-index",
      title: "Human Rights Campaign Corporate Equality Index",
      url: "https://www.hrc.org/resources/corporate-equality-index",
      snippet: "National benchmarking tool for rating workplaces on lesbian, gay, bisexual, transgender, and queer equality."
    },
    {
      slug: "first-gen-in-grad-school",
      title: "First Gen in Grad School",
      url: "https://careercenter.sjsu.edu/resources/first-gen-in-grad-school/",
      snippet: ""
    },
    {
      slug: "first-generation-professionals",
      title: "First Generation Professionals",
      url: "https://www.linkedin.com/groups/8317267/",
      snippet: "LinkedIn group that facilitates networking opportunities between first generation law students and first generation lawyers around the country."
    },
    {
      slug: "empowering-first-generation-college-students",
      title: "Empowering First Generation College Students",
      url: "https://www.linkedin.com/groups/12796372/",
      snippet: "LinkedIn Group that provides resources to support first-generation college students and to build community."
    },
    {
      slug: "firstgen-society",
      title: "FirstGen Society",
      url: "https://careercenter.sjsu.edu/resources/firstgen-society/",
      snippet: "National Leadership Society of First Generation College Students unites, empowers, builds confidence, and celebrates first generation college students and alumni ..."
    },
    {
      slug: "rise-first",
      title: "Rise First",
      url: "https://careercenter.sjsu.edu/resources/rise-first/",
      snippet: "Empower first-generation and/or low-income (FGLI) students and professionals nationwide to achieve their full potential by providing life and career advice, ..."
    },
    {
      slug: "basta",
      title: "Basta",
      url: "https://careercenter.sjsu.edu/resources/basta/",
      snippet: "Dedicated to closing the employment gap for first-generation students of color and to change the face of workplace leadership. Basta ..."
    },
    {
      slug: "first-gen-fellows",
      title: "First Gen Fellows",
      url: "https://careercenter.sjsu.edu/resources/first-gen-fellows/",
      snippet: "Paid summer program for undergraduate students who are the first in their immediate families to attend college and who intend ..."
    },
    {
      slug: "latinx-professionals-presente-2022",
      title: "Latinx Professionals, Presente! 2022",
      url: "https://careercenter.sjsu.edu/resources/latinx-professionals-presente-2022/",
      snippet: ""
    },
    {
      slug: "society-of-hispanic-professional-engineers",
      title: "Society of Hispanic Professional Engineers",
      url: "https://shpe.org/",
      snippet: "Supporting Hispanic students and professionals in STEM for nearly 50 years."
    },
    {
      slug: "society-for-advancement-of-chicanos-hispanics-and-native-americans-in-science-sacnas",
      title: "Society for Advancement of Chicanos/Hispanics and Native Americans in Science (SACNAS)",
      url: "https://www.sacnas.org/",
      snippet: "Dedicated to fostering the success of Chicanos/Hispanics and Native Americans in science."
    },
    {
      slug: "latin-business-association",
      title: "Latin Business Association",
      url: "https://lbausa.com/",
      snippet: "Building economic wealth and opportunity for Latin business and the community."
    },
    {
      slug: "society-of-latino-engineers-and-scientists-soles-sjsu-chapter",
      title: "Society of Latino Engineers and Scientists (SOLES) - SJSU Chapter",
      url: "https://www.linkedin.com/company/solessjsu/about/",
      snippet: "Empower the community to reach its full potential by advancing Latino success in STEM at San Jose State University."
    },
    {
      slug: "society-of-advancement-for-chicanos-and-native-americans-in-science-sacnas-sjsu-chapter",
      title: "Society of Advancement for Chicanos and Native Americans in Science (SACNAS) - SJSU Chapter",
      url: "https://careercenter.sjsu.edu/resources/society-of-advancement-for-chicanos-and-native-americans-in-science-sacnas-sjsu-chapter/",
      snippet: "Dedicated to fostering the success of Latinx & Indigenous students, in attaining advanced degrees, careers, and positions of leadership in ..."
    },
    {
      slug: "sjsu-latino-alumni-network-lan",
      title: "SJSU Latino Alumni Network (LAN)",
      url: "https://careercenter.sjsu.edu/resources/sjsu-latino-alumni-network-lan/",
      snippet: "Strives to create a network of Latinos who are committed to fostering relationships, creating opportunities, and providing support for the ..."
    },
    {
      slug: "latino-business-student-association",
      title: "Latino Business Student Association",
      url: "https://www.lbsasjsu.org/",
      snippet: "Empower the next generation of diverse leaders through professional development workshops, company tours, social events, and community outreaches."
    },
    {
      slug: "united-states-hispanic-chamber-of-commerce",
      title: "United States Hispanic Chamber of Commerce",
      url: "https://www.ushcc.com/",
      snippet: "Promotes the economic growth, development and interests of Hispanic- owned businesses."
    },
    {
      slug: "latpro",
      title: "Latpro",
      url: "https://www.latpro.com/",
      snippet: "Connect Hispanics and Latinx with employers who embrace diversity."
    },
    {
      slug: "hispanic-today",
      title: "Hispanic Today",
      url: "https://hispanic-today.com/",
      snippet: "Share news and opportunities concerning the Hispanic-American community and connect them with employers who foster affirmative action and equal opportunity."
    },
    {
      slug: "hispanic-foundation-of-silicon-valley",
      title: "Hispanic Foundation of Silicon Valley",
      url: "https://careercenter.sjsu.edu/resources/hispanic-foundation-of-silicon-valley/",
      snippet: "Dedicated to inspiring community philanthropy and engaging people to invest in the educational achievement and leadership development of a thriving ..."
    },
    {
      slug: "hispanic-association-of-colleges-universities-hacu",
      title: "Hispanic Association of Colleges & Universities (HACU)",
      url: "https://www.hacu.net/hacu/default.asp",
      snippet: "Provide internships, scholarships, college retention and advancement programs, precollegiate support, and career development opportunities and programs."
    },
    {
      slug: "hispanic-alliance-for-career-enhancement",
      title: "Hispanic Alliance for Career Enhancement",
      url: "https://haceonline.org/#close",
      snippet: "Dedicated to the employment, development, and advancement of current and aspiring Latino professionals."
    },
    {
      slug: "ihispano",
      title: "iHispano",
      url: "https://www.ihispano.com/",
      snippet: "Search for jobs at companies recruiting talented Hispanic professionals."
    },
    {
      slug: "exploring-careers-with-api-professionals",
      title: "Exploring Careers with API Professionals",
      url: "https://careercenter.sjsu.edu/resources/exploring-careers-with-api-professionals/",
      snippet: ""
    },
    {
      slug: "society-of-asian-scientists-and-engineers",
      title: "Society of Asian Scientists and Engineers",
      url: "https://www.facebook.com/groups/287309985009907/?hc_ref=ARS83SL00T01l0I8nLvbYU0Ni1UxCPa_XnurseT1QchGMFWamaFxkoQTvI7_iG5bc3E",
      snippet: "Dedicated to the advancement of Asian heritage scientists and engineers in education and employment."
    },
    {
      slug: "national-asian-american-pacific-bar-association",
      title: "National Asian American Pacific Bar Association",
      url: "https://www.napaba.org/",
      snippet: "Provide optimal representation and influence of Asian American and Pacific Islander attorneys."
    },
    {
      slug: "national-association-of-asian-american-professionals-naaap",
      title: "National Association of Asian American Professionals (NAAAP)",
      url: "https://www.naaap.org/",
      snippet: "Cultivates and empowers Asian & Pacific Islander leaders."
    },
    {
      slug: "asian-pacific-american-medical-student-association",
      title: "Asian Pacific American Medical Student Association",
      url: "https://www.apamsa.org/",
      snippet: "Committed to addressing the unique health challenges of Asian American, Native Hawaiian, & Pacific Islander (AANHPI) communities."
    },
    {
      slug: "asian-american-journalists-associations",
      title: "Asian American Journalists Associations",
      url: "https://careercenter.sjsu.edu/resources/asia-american-journalists-associations/",
      snippet: "Advancing visibility and inclusion of AAPI journalists in newsroom leadership, and equitable and accurate coverage of Asian Americans and Pacific ..."
    },
    {
      slug: "asian-american-architects-engineers-association",
      title: "Asian American Architects/Engineers Association",
      url: "https://aaaesc.org/",
      snippet: "Provide a platform for empowering professionals working in the built environment."
    },
    {
      slug: "south-asian-student-association",
      title: "South Asian Student Association",
      url: "https://www.facebook.com/SASAsjsu/",
      snippet: "Bring together the South Asian student population at San Jos\xE9 State University and spread cultural awareness."
    },
    {
      slug: "society-of-asian-scientists-and-engineers-sase-sjsu-chapter",
      title: "Society of Asian Scientists and Engineers (SASE) - SJSU Chapter",
      url: "https://sase-sjsu.weebly.com/",
      snippet: "Help Asian heritage science and engineering professionals achieve their full potential."
    },
    {
      slug: "goldsea",
      title: "Goldsea",
      url: "http://goldsea.com/Text/index.php?id=2223",
      snippet: "Provides information on choosing a career, career building strategies, and jobs at Asian-friendly employers."
    },
    {
      slug: "asian-jobs",
      title: "Asian Jobs",
      url: "http://www.asian-jobs.com/",
      snippet: "Jobs for bilingual/Asian speaking professionals."
    },
    {
      slug: "national-society-of-black-engineers-nsbe",
      title: "National Society of Black Engineers (NSBE)",
      url: "https://www.nsbe.org/",
      snippet: "Dedicate to serving culturally responsible black engineers who excel academically, succeed professionally, and positively impact the community."
    },
    {
      slug: "black-women-in-science-and-engineering-bwise",
      title: "Black Women in Science and Engineering (BWISE)",
      url: "http://www.bwiseusa.org/",
      snippet: "Organization for African American females who have degrees in the sciences, math, and engineering."
    },
    {
      slug: "association-of-black-women-physicians",
      title: "Association of Black Women Physicians",
      url: "https://www.blackwomenphysicians.org/",
      snippet: "Network of black women physicians committed to the improvement of public health and health equity."
    },
    {
      slug: "association-of-black-psychologists-abpsi",
      title: "Association of Black Psychologists (ABPsi)",
      url: "https://abpsi.org/",
      snippet: "Promotes and advances the profession of African Psychology."
    },
    {
      slug: "american-association-of-blacks-in-higher-education-aabhe",
      title: "American Association of Blacks in Higher Education (AABHE)",
      url: "https://aabhe.education/",
      snippet: "Dedicated to serving as the voice for African Americans in higher education."
    },
    {
      slug: "black-honor-society",
      title: "Black Honor Society",
      url: "https://sjsubhs.wordpress.com/",
      snippet: "Dedicated to building a collective and united academic and community-driven Black student body at SJSU."
    },
    {
      slug: "black-alliance-of-scientists-and-engineers-base",
      title: "Black Alliance of Scientists and Engineers (BASE)",
      url: "https://sjsubasetelecom.wixsite.com/sjsubase",
      snippet: "Increase the number of culturally responsible Black engineers and scientists who excel academically, succeed professionally and positively impact the community."
    },
    {
      slug: "united-negro-college-fund-uncf",
      title: "United Negro College Fund (UNCF)",
      url: "https://uncf.org/",
      snippet: "Provide scholarships, internships, and fellowships."
    },
    {
      slug: "the-black-perspective",
      title: "The Black Perspective",
      url: "https://blackperspective.com/",
      snippet: "Find news and information, job opportunities, and employment-related resources."
    },
    {
      slug: "black-news",
      title: "Black News",
      url: "http://jobs.blacknews.com/",
      snippet: "Daily news for black professionals, including job/internship postings."
    },
    {
      slug: "black-enterprise",
      title: "Black Enterprise",
      url: "https://www.blackenterprise.com/",
      snippet: "Premier business, investing, and wealth-building resource for African-Americans."
    },
    {
      slug: "black-leadership-and-opportunity-center",
      title: "Black Leadership and Opportunity Center",
      url: "https://www.sjsu.edu/thebloc/index.php?utm_source=africanamericanblackssc&#038;utm_medium=301&#038;utm_campaign=thebloc-rebrand",
      snippet: "Provides cultural programming, professional development and academic initiatives that promote community building and overall success of all Black SJSU students."
    },
    {
      slug: "black-in-stem-panel",
      title: "Black in STEM Panel",
      url: "https://careercenter.sjsu.edu/resources/black-in-stem-panel/",
      snippet: ""
    },
    {
      slug: "linkedin-learning",
      title: "LinkedIn Learning",
      url: "https://careercenter.sjsu.edu/resources/linkedin-learning/",
      snippet: "LinkedIn Learning provides SJSU students with free access to thousands of expert-led courses designed to help you develop technical, business, ..."
    },
    {
      slug: "forage",
      title: "Forage",
      url: "https://careercenter.sjsu.edu/resources/forage/",
      snippet: "Forage offers free virtual job simulations created by leading employers, allowing you to explore careers, develop practical skills, and gain ..."
    },
    {
      slug: "sjsu-mentoring-meetups",
      title: "SJSU\xB2 Mentoring & Meetups",
      url: "https://careercenter.sjsu.edu/resources/sjsu2/",
      snippet: "Our mentorship platform is getting an upgrade. The original SJSU\xB2 PeopleGrove portal was retired on June 30, 2026 . A new ..."
    },
    {
      slug: "focus2",
      title: "Focus2",
      url: "https://careercenter.sjsu.edu/resources/focus2/",
      snippet: "Focus2 is SJSU's online career exploration platform that helps you understand your work interests and personality through self-assessments so you ..."
    },
    {
      slug: "sjsu-handshake",
      title: "SJSU Handshake",
      url: "https://careercenter.sjsu.edu/resources/sjsu-handshake/",
      snippet: "Handshake is San Jos\xE9 State University's official career platform, connecting students and alumni with employers, internships, on-campus jobs, career fairs, ..."
    }
  ]
};

// src/data/sjsuCatalog.ts
var SOURCE = "SJSU Career Center";
var RESOURCES_URL = "https://careercenter.sjsu.edu/resources/";
var SJSU_SCRAPED_AT = sjsu_resources_default.scrapedAt;
function isExternal(url) {
  return !new URL(url).hostname.endsWith("careercenter.sjsu.edu");
}
var sjsuResources = sjsu_resources_default.resources.map((item) => {
  const text = `${item.title} ${item.snippet}`;
  const summary = item.snippet || `Listed on the ${SOURCE} resources page.`;
  return {
    id: `sjsu-${item.slug}`,
    title: item.title,
    summary,
    description: `${summary}

This listing was collected from the ${SOURCE} website on ${sjsu_resources_default.scrapedAt.slice(0, 10)}. Open the original page for the full description, eligibility and current details.`,
    whoItsFor: ["SJSU students"],
    resourceType: classifyResourceType(text),
    source: SOURCE,
    sourceUrl: RESOURCES_URL,
    url: item.url,
    majors: classifyMajors(item.title),
    interests: classifyInterests(text),
    location: classifyResourceLocation(text, isExternal(item.url)),
    tags: isGuessedResourceType(text) ? ["sjsu", "career center", TYPE_GUESS_TAG] : ["sjsu", "career center"],
    featured: false,
    isDemo: false,
    scraped: true,
    lastVerified: sjsu_resources_default.scrapedAt
  };
});
var COMMUNITY_PREFIX = /^COMMUNITY EVENT:\s*/i;
var FULL_SUFFIX = /\s*\(event full\)\s*$/i;
var sjsuEvents = sjsu_events_default.events.map((item) => {
  const isCommunity = COMMUNITY_PREFIX.test(item.title);
  const title = item.title.replace(COMMUNITY_PREFIX, "").replace(FULL_SUFFIX, "");
  return {
    id: `sjsu-${item.slug}`,
    title,
    description: (isCommunity ? "Hosted by an outside organization and listed by the SJSU Career Center. " : "") + `Listed on the ${SOURCE} events page (${item.timeText}). Collected on ${sjsu_events_default.scrapedAt.slice(0, 10)}. Open the original page for the description and registration, and confirm the time before you go.`,
    eventType: classifyEventType(title),
    format: classifyEventFormat(title, item.location),
    start: item.start,
    end: item.end,
    location: item.location,
    host: SOURCE,
    url: item.url,
    majors: classifyMajors(title),
    interests: classifyInterests(title),
    tags: isCommunity ? ["sjsu", "career center", "community"] : ["sjsu", "career center"],
    isDemo: false,
    scraped: true,
    isFull: FULL_SUFFIX.test(item.title)
  };
});

// src/data/events.ts
var merged = [...sjsuEvents];
var seen = new Set(merged.map((event) => event.id));
for (const event of instagramEvents) {
  if (seen.has(event.id)) continue;
  seen.add(event.id);
  merged.push(event);
}
var FIRST_SHOWN_AT = Date.parse("2026-11-20T00:00:00-08:00");
var events = merged.filter((event) => new Date(event.start).getTime() >= FIRST_SHOWN_AT).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

// src/lib/linkedinJobs.ts
var SOURCE2 = "LinkedIn";
var SOURCE_URL = "https://www.linkedin.com/jobs/";
var TAG_RULES = [
  {
    pattern: /software|front-?end|back-?end|full[- ]?stack|devops|distributed systems|firmware|technical staff|product engineering/i,
    majors: ["Computer Science", "Engineering"],
    interests: ["Software Engineering"]
  },
  {
    pattern: /computer|cyber|\bsecurity\b|robotics|perception|neural|multimodal|graphics/i,
    majors: ["Computer Science"]
  },
  {
    pattern: /\bdata\b|analytics|machine learning|\bml\b|(?<!& )\bai\b|agentic|computational|business intelligence/i,
    majors: ["Computer Science", "Mathematics"],
    interests: ["Data Science"]
  },
  {
    pattern: /mechanical|electrical|electromechanical|civil|materials|manufacturing|thermal|mechatronics|automation|optical|hardware (engineer|development)|systems engineering|robotics|displays engineer|engineering division|power electronics|transportation|\bengineer(ing)?\b/i,
    majors: ["Engineering"]
  },
  {
    pattern: /finance|financial|fp&a|\bfraud\b|\brisk\b/i,
    majors: ["Business", "Economics", "Accounting"],
    interests: ["Finance"]
  },
  { pattern: /accounting|audit|\btax\b/i, majors: ["Accounting", "Business"], interests: ["Finance"] },
  {
    pattern: /marketing|brand|influencer|social media|\bgrowth\b/i,
    majors: ["Marketing", "Business", "Communications"],
    interests: ["Marketing"]
  },
  {
    pattern: /content|video|editorial|copywrit/i,
    majors: ["Communications"],
    interests: ["Writing and Content"]
  },
  {
    pattern: /business (analy|operations|undergraduate)|strategy|strategic|supply chain/i,
    majors: ["Business"]
  },
  {
    pattern: /strategy|strategic (?!finance)|consult/i,
    majors: ["Business", "Economics"],
    interests: ["Consulting"]
  },
  {
    pattern: /product manage|program manage/i,
    majors: ["Business", "Computer Science"],
    interests: ["Product Management"]
  },
  {
    pattern: /human resources|\bhr\b|people (products|operations|partner|team)|talent (acquisition|sourcing)|recruiter|recruit(ing|ment)|learning and development/i,
    exclude: /area manager|operations manager|recruitment program/i,
    majors: ["Psychology", "Business", "Sociology"],
    interests: ["Human Resources"]
  },
  {
    pattern: /\bux\b|\bui\b|user research|human[- ](computer|machine) interaction/i,
    majors: ["Psychology", "Design"],
    interests: ["UX Design"]
  },
  { pattern: /product design/i, majors: ["Design"], interests: ["UX Design"] },
  { pattern: /graphic design|creative|illustrat/i, majors: ["Design", "Art"] },
  { pattern: /\bart\b|animation/i, majors: ["Art", "Design"], interests: ["Arts and Culture"] },
  {
    pattern: /biolog|biotech|\blab\b|laboratory|genom|sequencing|clinical (research|scientist)/i,
    majors: ["Biology"],
    interests: ["Research and Academia"]
  },
  { pattern: /chemi|clinical scientist|\bbioprocess/i, majors: ["Chemistry"] },
  {
    pattern: /clinical|(?<!mental )health|medical|patient/i,
    majors: ["Public Health"],
    interests: ["Healthcare"]
  },
  {
    pattern: /nutrition|dietit|kinesiolog|fitness/i,
    majors: ["Nutrition and Kinesiology", "Public Health"],
    interests: ["Healthcare"]
  },
  {
    pattern: /health economics|heor/i,
    majors: ["Public Health", "Economics"],
    interests: ["Healthcare"]
  },
  {
    pattern: /\bESH\b|environment(al)?,? (health|safety)/i,
    majors: ["Environmental Science", "Public Health"]
  },
  {
    pattern: /psycholog|behavioral (health|science|research)|human behavior|counsel(or|ing)|mental health/i,
    majors: ["Psychology"],
    interests: ["Counseling and Social Services"]
  },
  {
    pattern: /mental health|social work|case manag|nonprofit|non-profit|outreach|social services|family services|victim|patient advocate|youth advocate|community (outreach|health|organi[sz]|services|program)/i,
    majors: ["Social Work", "Sociology"],
    interests: ["Social Impact", "Community Organizing"]
  },
  {
    pattern: /policy|government|council|legislat|city of|public affairs/i,
    majors: ["Political Science"],
    interests: ["Public Policy and Government"]
  },
  {
    pattern: /education|teach|tutor|youth|instruction|curriculum/i,
    exclude: /medical education|continuing education/i,
    majors: ["Education"],
    interests: ["Education and Teaching"]
  },
  {
    pattern: /legal|paralegal|law clerk|criminal|justice|attorney/i,
    majors: ["Criminology", "Political Science"],
    interests: ["Law and Legal"]
  },
  {
    pattern: /journalis|public relations|\bpr\b|communications|editorial|newsroom|reporter/i,
    majors: ["Journalism", "Communications", "English"],
    interests: ["Journalism and Media"]
  },
  {
    pattern: /sustainab|environment|climate/i,
    majors: ["Environmental Science"],
    interests: ["Sustainability"]
  },
  {
    pattern: /\bphd\b|research scientist|research intern/i,
    majors: [],
    interests: ["Research and Academia"]
  }
];
function tagLinkedinTitle(title) {
  const majors = /* @__PURE__ */ new Set();
  const interests = /* @__PURE__ */ new Set();
  for (const rule of TAG_RULES) {
    if (!rule.pattern.test(title) || rule.exclude?.test(title)) continue;
    rule.majors.forEach((major) => majors.add(major));
    rule.interests?.forEach((interest) => interests.add(interest));
  }
  return { majors: [...majors], interests: [...interests] };
}
var GRADUATE_ONLY_TITLE = /\bph\.?d\b|\bmba\b/i;
var dedupeKey = (job) => `${job.title}|${job.company}`.toLowerCase().replace(/\s+/g, " ");
function selectLinkedinJobs(jobs2) {
  const seen2 = /* @__PURE__ */ new Set();
  return jobs2.filter((job) => {
    if (GRADUATE_ONLY_TITLE.test(job.title)) return false;
    const key = dedupeKey(job);
    if (seen2.has(key)) return false;
    seen2.add(key);
    return true;
  });
}
function locationFormat(workplaceType, title = "") {
  const text = `${workplaceType ?? ""} ${title}`.toLowerCase();
  if (/\bremote\b/.test(text)) return "Remote";
  if (/\bhybrid\b/.test(text)) return "Hybrid";
  return "In-Person";
}
function linkedinJobToResource(job, scrapedAt, kind = "Internship") {
  const postedNote = job.postedAt ? ` Posted ${job.postedAt.slice(0, 10)}.` : "";
  const place = job.location ? ` in ${job.location}` : "";
  const { majors, interests } = tagLinkedinTitle(job.title);
  return {
    id: `linkedin-${job.id}`,
    title: job.company ? `${job.title} at ${job.company}` : job.title,
    summary: [job.company, job.location].filter(Boolean).join(" \xB7 ") || `${kind} on LinkedIn`,
    description: `${job.title}${place}.${postedNote} Listed on LinkedIn and collected on ${scrapedAt.slice(0, 10)}. Open the LinkedIn posting to confirm it is still open, the requirements and how to apply.`,
    whoItsFor: [kind === "Job" ? "Graduates looking for entry-level jobs" : "Students looking for internships"],
    resourceType: kind,
    source: SOURCE2,
    sourceUrl: SOURCE_URL,
    url: job.url,
    majors,
    interests,
    location: locationFormat(job.workplaceType, job.title),
    place: job.location || void 0,
    tags: ["linkedin", kind.toLowerCase()],
    featured: false,
    isDemo: false,
    scraped: true,
    lastVerified: scrapedAt
  };
}

// src/data/scraped/linkedin-internships.json
var linkedin_internships_default = {
  scrapedAt: "2026-11-19T02:30:04.800Z",
  source: "LinkedIn",
  jobs: [
    {
      id: "4491347908",
      title: "Winter Software Engineering Intern",
      company: "Truveta",
      location: "Greater Seattle Area",
      url: "https://www.linkedin.com/jobs/view/winter-software-engineering-intern-at-truveta-4491347908",
      postedAt: "2026-11-19T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490907963",
      title: "AI Engineering Intern (Generative & Agentic AI)",
      company: "Boston Scientific",
      location: "Marlborough, MA",
      url: "https://www.linkedin.com/jobs/view/ai-engineering-intern-generative-agentic-ai-at-boston-scientific-4490907963",
      postedAt: "2026-11-19T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492228808",
      title: "Software Engineering Intern",
      company: "Sage",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-at-sage-4492228808",
      postedAt: "2026-11-19T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492001097",
      title: "Data & Analytics Spring Intern",
      company: "National Basketball Players Association (NBPA)",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/data-analytics-spring-intern-at-national-basketball-players-association-nbpa-4492001097",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491082721",
      title: "Grad Intern - Knowledge Graph Applications (Summer 2027)",
      company: "Amgen",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/grad-intern-knowledge-graph-applications-summer-2027-at-amgen-4491082721",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492064687",
      title: "DIRECTV for Business Pricing, Offers & Profitability Intern",
      company: "DIRECTV",
      location: "El Segundo, CA",
      url: "https://www.linkedin.com/jobs/view/directv-for-business-pricing-offers-profitability-intern-at-directv-4492064687",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491404775",
      title: "Digital Marketing Intern",
      company: "Flourish By Sage",
      location: "East Orange, NJ",
      url: "https://www.linkedin.com/jobs/view/digital-marketing-intern-at-flourish-by-sage-4491404775",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458198950",
      title: "2027 BNY Summer Internship Program - Engineering (Developer) - Jersey City, NJ",
      company: "BNY",
      location: "Jersey City, NJ",
      url: "https://www.linkedin.com/jobs/view/2027-bny-summer-internship-program-engineering-developer-jersey-city-nj-at-bny-4458198950",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492098150",
      title: "Talent Acquisition Intern - paid",
      company: "American Plastics",
      location: "Greater Cleveland",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-intern-paid-at-american-plastics-4492098150",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491868076",
      title: "Recruiting Intern-CLTI",
      company: "Career Launch Tech Initiative",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/recruiting-intern-clti-at-career-launch-tech-initiative-4491868076",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490354391",
      title: "Recruiting Internship",
      company: "Career Launch Tech Initiative",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/recruiting-internship-at-career-launch-tech-initiative-4490354391",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476539010",
      title: "Summer Internship - Customer Experience Analytics",
      company: "PACCAR Parts",
      location: "Renton, WA",
      url: "https://www.linkedin.com/jobs/view/summer-internship-customer-experience-analytics-at-paccar-parts-4476539010",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491888732",
      title: "2027 Internship - Software Engineer (AI/ML)",
      company: "Cirrus Logic",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/2027-internship-software-engineer-ai-ml-at-cirrus-logic-4491888732",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467790623",
      title: "Software Engineering Intern - ADG System R&D",
      company: "Emerson",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-adg-system-r-d-at-emerson-4467790623",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483766561",
      title: "Sales and Operations Planning Intern",
      company: "Emerson",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/sales-and-operations-planning-intern-at-emerson-4483766561",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458212073",
      title: "2027 BNY Summer Internship Program - Office of the CFO - Finance & Strategy (New York, NY)",
      company: "BNY",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-bny-summer-internship-program-office-of-the-cfo-finance-strategy-new-york-ny-at-bny-4458212073",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491458223",
      title: "Offer Management Intern",
      company: "Schneider Electric",
      location: "Foxborough (Foxboro), MA",
      url: "https://www.linkedin.com/jobs/view/offer-management-intern-at-schneider-electric-4491458223",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492111233",
      title: "Intern, Corporate Communications: June-August 2027 (Hybrid)",
      company: "Insulet Corporation",
      location: "Acton, MA",
      url: "https://www.linkedin.com/jobs/view/intern-corporate-communications-june-august-2027-hybrid-at-insulet-corporation-4492111233",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492109244",
      title: "Digital AEO Intern",
      company: "Wilson Sporting Goods Co.",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/digital-aeo-intern-at-wilson-sporting-goods-co-4492109244",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490923246",
      title: "Product Data Analyst Intern",
      company: "Boston Scientific",
      location: "Marlborough, MA",
      url: "https://www.linkedin.com/jobs/view/product-data-analyst-intern-at-boston-scientific-4490923246",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491849861",
      title: "Marketing & Content Intern",
      company: "Evoq Technologies, Inc.",
      location: "Boston, MA",
      url: "https://www.linkedin.com/jobs/view/marketing-content-intern-at-evoq-technologies-inc-4491849861",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491870686",
      title: "Marketing Internship Program",
      company: "Schneider Electric",
      location: "Boston, MA",
      url: "https://www.linkedin.com/jobs/view/marketing-internship-program-at-schneider-electric-4491870686",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491896757",
      title: "Digital Marketing Intern",
      company: "Centric Brands",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/digital-marketing-intern-at-centric-brands-4491896757",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467270791",
      title: "Data Engineering Intern",
      company: "Ibotta",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/data-engineering-intern-at-ibotta-4467270791",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483817597",
      title: "2027 Software Engineering Intern",
      company: "Chatham Financial",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/2027-software-engineering-intern-at-chatham-financial-4483817597",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492068338",
      title: "Integrated Communications Intern",
      company: "The Shipyard",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/integrated-communications-intern-at-the-shipyard-4492068338",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492205265",
      title: "Intern, Influencer Marketing",
      company: "Avon",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/intern-influencer-marketing-at-avon-4492205265",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491863674",
      title: "Operations AI Process Innovation Intern",
      company: "Revelyst",
      location: "Irvine, CA",
      url: "https://www.linkedin.com/jobs/view/operations-ai-process-innovation-intern-at-revelyst-4491863674",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476354109",
      title: "Robotics Software Engineer Intern",
      company: "Relativity Space",
      location: "Long Beach, CA",
      url: "https://www.linkedin.com/jobs/view/robotics-software-engineer-intern-at-relativity-space-4476354109",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492069399",
      title: "Social Media Internship",
      company: "Families4Families",
      location: "Bethesda, MD",
      url: "https://www.linkedin.com/jobs/view/social-media-internship-at-families4families-4492069399",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460211028",
      title: "UPS Technology Group Summer 2027 Internship \u2013 GA",
      company: "UPS",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/ups-technology-group-summer-2027-internship-%E2%80%93-ga-at-ups-4460211028",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474619481",
      title: "Business Operations and Leadership Internship",
      company: "IDEMIA Public Security",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/business-operations-and-leadership-internship-at-idemia-public-security-4474619481",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491861966",
      title: "2027 Summer Intern, Media Coordinator (DC/MD/VA; NY)",
      company: "ICF",
      location: "Fairfax, VA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-media-coordinator-dc-md-va-ny-at-icf-4491861966",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467726049",
      title: "Summer 2027: Software Engineering Intern - Full Stack",
      company: "Intuit",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-software-engineering-intern-full-stack-at-intuit-4467726049",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474630193",
      title: "Business Development Internship",
      company: "IDEMIA Public Security",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/business-development-internship-at-idemia-public-security-4474630193",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467726052",
      title: "Summer 2027: MS Fraud & Risk Intern",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-ms-fraud-risk-intern-at-intuit-4467726052",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476578847",
      title: "Data Scientist Intern, Product Analytics (Summer 2027)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-intern-product-analytics-summer-2027-at-meta-4476578847",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470114096",
      title: "Machine Learning Engineer Intern (CapCut) - 2027 Start",
      company: "TikTok USDS Joint Venture",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-engineer-intern-capcut-2027-start-at-tiktok-usds-joint-venture-4470114096",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465257461",
      title: "Software Engineer, Intern (Summer 2027) - US",
      company: "DoorDash",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-us-at-doordash-4465257461",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483811539",
      title: "Intern",
      company: "Cytek Biosciences",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/intern-at-cytek-biosciences-4483811539",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491331051",
      title: "Analog Design Engineer Intern",
      company: "Analog Devices",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/analog-design-engineer-intern-at-analog-devices-4491331051",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484280897",
      title: "Mechanical Engineer Intern (Summer 2027)",
      company: "Scout AI",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-intern-summer-2027-at-scout-ai-4484280897",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491320556",
      title: "Product Engineering Intern - Falcon Guardian",
      company: "CrowdStrike",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/product-engineering-intern-falcon-guardian-at-crowdstrike-4491320556",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484294812",
      title: "Internship - Frontend Developer",
      company: "ASML",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/internship-frontend-developer-at-asml-4484294812",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490829824",
      title: "2027 Product Management Intern, US",
      company: "Uber",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-product-management-intern-us-at-uber-4490829824",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4456040280",
      title: "Intern - Safety",
      company: "Southland Industries",
      location: "Union City, CA",
      url: "https://www.linkedin.com/jobs/view/intern-safety-at-southland-industries-4456040280",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490892012",
      title: "Research Scientist Intern, Perception, Displays and Graphics (PhD)",
      company: "Meta",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/research-scientist-intern-perception-displays-and-graphics-phd-at-meta-4490892012",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491485680",
      title: "2027 Summer Intern - Translational Medicine Oncology",
      company: "Genentech",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-translational-medicine-oncology-at-genentech-4491485680",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492055342",
      title: "Platform Partnerships Intern",
      company: "AppLovin",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/platform-partnerships-intern-at-applovin-4492055342",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492081889",
      title: "Peer Specialist",
      company: "Abode",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/peer-specialist-at-abode-4492081889",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492098147",
      title: "Resident Services Coordinator",
      company: "Abode",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/resident-services-coordinator-at-abode-4492098147",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466122134",
      title: "Product Design Intern (2027)",
      company: "Figma",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-2027-at-figma-4466122134",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475140343",
      title: "PhD Research Intern, Cross-Disciplinary Vision Science - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/phd-research-intern-cross-disciplinary-vision-science-summer-2027-at-nvidia-4475140343",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491449731",
      title: "Career Advance Internship",
      company: "San Francisco International Airport",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/career-advance-internship-at-san-francisco-international-airport-4491449731",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492011438",
      title: "Spring/Summer Marketing Intern",
      company: "Ephemeris Net",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/spring-summer-marketing-intern-at-ephemeris-net-4492011438",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491793906",
      title: "Battery Modeling Intern - Santa Clara, CA - Spring 2027",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/battery-modeling-intern-santa-clara-ca-spring-2027-at-nissan-motor-corporation-4491793906",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485602359",
      title: "Accelerated Science Intern, Representation Learning for Molecules and Materials",
      company: "Toyota Research Institute",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/accelerated-science-intern-representation-learning-for-molecules-and-materials-at-toyota-research-institute-4485602359",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4437287376",
      title: "Summer 2027 Intern - Americas Division [UG/Masters]",
      company: "Simon-Kucher",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-americas-division-ug-masters-at-simon-kucher-4437287376",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465240902",
      title: "Winemaking Intern - Ripon",
      company: "The Wine Group",
      location: "Ripon, CA",
      url: "https://www.linkedin.com/jobs/view/winemaking-intern-ripon-at-the-wine-group-4465240902",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467715984",
      title: "Summer 2027: Software Engineering Intern - Cybersecurity",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-software-engineering-intern-cybersecurity-at-intuit-4467715984",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491180732",
      title: "Backend Developer Intern (Restaurant OS) \u2014 Fully Remote",
      company: "ZOVU",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/backend-developer-intern-restaurant-os-%E2%80%94-fully-remote-at-zovu-4491180732",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466120874",
      title: "2027 Summer Marketing Intern (Remote)",
      company: "Constellation",
      location: "Annapolis, MD",
      url: "https://www.linkedin.com/jobs/view/2027-summer-marketing-intern-remote-at-constellation-4466120874",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465457536",
      title: "Campaign Marketing Intern - Summer 2027",
      company: "Veeam Software",
      location: "Georgia, United States",
      url: "https://www.linkedin.com/jobs/view/campaign-marketing-intern-summer-2027-at-veeam-software-4465457536",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482115443",
      title: "Laneige Brand Marketing Intern",
      company: "AMOREPACIFIC",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/laneige-brand-marketing-intern-at-amorepacific-4482115443",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490197853",
      title: "Influencer & PR Intern (Then I Met You)",
      company: "Then I Met You",
      location: "Brooklyn, NY",
      url: "https://www.linkedin.com/jobs/view/influencer-pr-intern-then-i-met-you-at-then-i-met-you-4490197853",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458216043",
      title: "2027 BNY Summer Internship Program - Engineering (Developer) - New York, NY",
      company: "BNY",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-bny-summer-internship-program-engineering-developer-new-york-ny-at-bny-4458216043",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491100584",
      title: "Intern",
      company: "NYSERDA",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/intern-at-nyserda-4491100584",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483717065",
      title: "Intern - Business Analyst",
      company: "T\xDCV S\xDCD",
      location: "Woodbridge, NJ",
      url: "https://www.linkedin.com/jobs/view/intern-business-analyst-at-t%C3%BCv-s%C3%BCd-4483717065",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491149233",
      title: "SHF - Internship - 2027",
      company: "Shee Atik\xE1 Government Services",
      location: "Sitka, AK",
      url: "https://www.linkedin.com/jobs/view/shf-internship-2027-at-shee-atik%C3%A1-government-services-4491149233",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490412374",
      title: "Security Specialist, Intern",
      company: "Filevine",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/security-specialist-intern-at-filevine-4490412374",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491577028",
      title: "Internship: Content Marketing Writing",
      company: "MCA",
      location: "North Canton, OH",
      url: "https://www.linkedin.com/jobs/view/internship-content-marketing-writing-at-mca-4491577028",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490804825",
      title: "Influencer Marketing Intern",
      company: "Bloom Nutrition",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/influencer-marketing-intern-at-bloom-nutrition-4490804825",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491110668",
      title: "Intern, Social Media Recruiting and Talent Analytics",
      company: "Holland America/Princess Alaska-Yukon Land Operations",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/intern-social-media-recruiting-and-talent-analytics-at-holland-america-princess-alaska-yukon-land-operations-4491110668",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491102951",
      title: "Intern, Content & Integrated Marketing (SBN)",
      company: "Seabourn Cruise Line",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/intern-content-integrated-marketing-sbn-at-seabourn-cruise-line-4491102951",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491121256",
      title: "Intern, Paid Social Media",
      company: "Holland America Line",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/intern-paid-social-media-at-holland-america-line-4491121256",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491712357",
      title: "Software Engineering Intern",
      company: "Emerson",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-at-emerson-4491712357",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491579225",
      title: "Marketing Intern",
      company: "Four Hands",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-four-hands-4491579225",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491756502",
      title: "ComEd Business Analyst (GIS) Intern",
      company: "Exelon",
      location: "Villa Park, IL",
      url: "https://www.linkedin.com/jobs/view/comed-business-analyst-gis-intern-at-exelon-4491756502",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483701145",
      title: "University - 2027 Summer Games Software Developer Intern - Lexington, MA",
      company: "Booz Allen Hamilton",
      location: "Lexington, MA",
      url: "https://www.linkedin.com/jobs/view/university-2027-summer-games-software-developer-intern-lexington-ma-at-booz-allen-hamilton-4483701145",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491716314",
      title: "2027 Summer Co op Scientific Data Support Analyst Vaccines Waltham MA",
      company: "Sanofi",
      location: "Waltham, MA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-co-op-scientific-data-support-analyst-vaccines-waltham-ma-at-sanofi-4491716314",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483700183",
      title: "University - 2027 Summer Games Data Scientist Intern - Lexington, MA",
      company: "Booz Allen Hamilton",
      location: "Lexington, MA",
      url: "https://www.linkedin.com/jobs/view/university-2027-summer-games-data-scientist-intern-lexington-ma-at-booz-allen-hamilton-4483700183",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491147756",
      title: "Demand Systems Analyst Intern",
      company: "Ahold Delhaize USA",
      location: "Quincy, MA",
      url: "https://www.linkedin.com/jobs/view/demand-systems-analyst-intern-at-ahold-delhaize-usa-4491147756",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491549444",
      title: "Digital Marketing Intern",
      company: "Sallie Mae",
      location: "Newton, MA",
      url: "https://www.linkedin.com/jobs/view/digital-marketing-intern-at-sallie-mae-4491549444",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485760628",
      title: "Energy Market Analyst Intern - EDA Official Posting",
      company: "East Daley Analytics",
      location: "Greenwood Village, CO",
      url: "https://www.linkedin.com/jobs/view/energy-market-analyst-intern-eda-official-posting-at-east-daley-analytics-4485760628",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490441278",
      title: "Embedded Software Development Intern - Summer 2027",
      company: "CACI International Inc",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/embedded-software-development-intern-summer-2027-at-caci-international-inc-4490441278",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491192528",
      title: "Marketing Intern",
      company: "EchoStar Corporation",
      location: "Englewood, CO",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-echostar-corporation-4491192528",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474611927",
      title: "Software Engineer Internship - Summer 2027",
      company: "IDEMIA Public Security",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-internship-summer-2027-at-idemia-public-security-4474611927",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491434297",
      title: "Managed Application Services Consulting Intern - Summer 2027",
      company: "RSM US LLP",
      location: "Greenwood Village, CO",
      url: "https://www.linkedin.com/jobs/view/managed-application-services-consulting-intern-summer-2027-at-rsm-us-llp-4491434297",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491184732",
      title: "Business Administration Intern",
      company: "EchoStar Corporation",
      location: "Englewood, CO",
      url: "https://www.linkedin.com/jobs/view/business-administration-intern-at-echostar-corporation-4491184732",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491190700",
      title: "Intern, Digital Properties and Innovation - Digital Media (Summer 2027)",
      company: "Southern Poverty Law Center",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/intern-digital-properties-and-innovation-digital-media-summer-2027-at-southern-poverty-law-center-4491190700",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491403117",
      title: "PhD Data Visualization Intern - Summer 2027",
      company: "Epsilon",
      location: "Westminster, CO",
      url: "https://www.linkedin.com/jobs/view/phd-data-visualization-intern-summer-2027-at-epsilon-4491403117",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491434435",
      title: "Intern",
      company: "The Vertex Companies LLC",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/intern-at-the-vertex-companies-llc-4491434435",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491772383",
      title: "Firmware Development Engineer Intern, Cooper Lighting Solutions - Spring 2027",
      company: "Signify",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/firmware-development-engineer-intern-cooper-lighting-solutions-spring-2027-at-signify-4491772383",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491765649",
      title: "Firmware Development Engineer Intern, Cooper Lighting Solutions - Spring 2027",
      company: "Signify",
      location: "Peachtree City, GA",
      url: "https://www.linkedin.com/jobs/view/firmware-development-engineer-intern-cooper-lighting-solutions-spring-2027-at-signify-4491765649",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467725071",
      title: "Summer 2027: Software Engineering Intern - Full Stack",
      company: "Intuit",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-software-engineering-intern-full-stack-at-intuit-4467725071",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491742768",
      title: "CREATIVE CONTENT CREATOR INTERN - UNPAID",
      company: "EduBud International Inc.",
      location: "Atlanta Metropolitan Area",
      url: "https://www.linkedin.com/jobs/view/creative-content-creator-intern-unpaid-at-edubud-international-inc-4491742768",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483262291",
      title: "2027 Summer Intern - Brand Marketing",
      company: "Papa Johns",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-brand-marketing-at-papa-johns-4483262291",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474616692",
      title: "Marketing & Events Internship - Jan 2027",
      company: "IDEMIA Public Security",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/marketing-events-internship-jan-2027-at-idemia-public-security-4474616692",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491410154",
      title: "Summer 2027 Data Analytics Intern",
      company: "Attain Partners",
      location: "McLean, VA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-data-analytics-intern-at-attain-partners-4491410154",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469373679",
      title: "2027 Summer Digital Marketing Intern (Baltimore, MD)",
      company: "Constellation",
      location: "Baltimore, MD",
      url: "https://www.linkedin.com/jobs/view/2027-summer-digital-marketing-intern-baltimore-md-at-constellation-4469373679",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491402449",
      title: "Summer 2027 Consulting Intern",
      company: "Attain Partners",
      location: "McLean, VA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-consulting-intern-at-attain-partners-4491402449",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464101558",
      title: "2027 Summer Commercial Business Solutions Intern (Baltimore, MD)",
      company: "Constellation",
      location: "Baltimore, MD",
      url: "https://www.linkedin.com/jobs/view/2027-summer-commercial-business-solutions-intern-baltimore-md-at-constellation-4464101558",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481382368",
      title: "2027 IT Development Intern - San Diego, CA",
      company: "Constellation",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/2027-it-development-intern-san-diego-ca-at-constellation-4481382368",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491106570",
      title: "Internship - Data Science & Analytics",
      company: "Lumentum",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/internship-data-science-analytics-at-lumentum-4491106570",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467737012",
      title: "Summer 2027: AI Science Intern",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-ai-science-intern-at-intuit-4467737012",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491742964",
      title: "Electrical Design Engineer Intern",
      company: "Matic Robots",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-design-engineer-intern-at-matic-robots-4491742964",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490784424",
      title: "PMIC Analog Intern",
      company: "Renesas Electronics",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/pmic-analog-intern-at-renesas-electronics-4490784424",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491748664",
      title: "Mechanical Engineering Intern (Spring 2027)",
      company: "Marathon Fusion",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineering-intern-spring-2027-at-marathon-fusion-4491748664",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490975199",
      title: "Internship, Mechanical Engineer, Cell Engineering (Winter/Spring 2027)",
      company: "Tesla",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/internship-mechanical-engineer-cell-engineering-winter-spring-2027-at-tesla-4490975199",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490966576",
      title: "Internship, Mechanical Design Engineer, Vehicle Power Electronics, Energy Engineering (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-mechanical-design-engineer-vehicle-power-electronics-energy-engineering-winter-spring-2027-at-tesla-4490966576",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490968551",
      title: "Product Marketing Manager MBA Intern, Digital Health AI - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-manager-mba-intern-digital-health-ai-summer-2027-at-nvidia-4490968551",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490826111",
      title: "Accounting Intern, BS - Summer 2027",
      company: "Marvell Technology",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/accounting-intern-bs-summer-2027-at-marvell-technology-4490826111",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485235249",
      title: "Robotics Intern, Human-Machine Interaction Research",
      company: "Toyota Research Institute",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/robotics-intern-human-machine-interaction-research-at-toyota-research-institute-4485235249",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490974221",
      title: "Internship, HR Partner, Energy & Engineering (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-hr-partner-energy-engineering-winter-spring-2027-at-tesla-4490974221",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490976120",
      title: "Internship, FP&A & Business Operations (Summer 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-fp-a-business-operations-summer-2027-at-tesla-4490976120",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490963645",
      title: "Internship, HR & People Teams (Winter/Spring 2027)",
      company: "Tesla",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/internship-hr-people-teams-winter-spring-2027-at-tesla-4490963645",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481882187",
      title: "Battery Engineering Intern, Cell Engineering (PhD)",
      company: "Meta",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/battery-engineering-intern-cell-engineering-phd-at-meta-4481882187",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483284299",
      title: "Intern - LCLS Research Support",
      company: "SLAC National Accelerator Laboratory",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/intern-lcls-research-support-at-slac-national-accelerator-laboratory-4483284299",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490149979",
      title: "Summer 2027 Materials Science Internship",
      company: "Pacific Fusion",
      location: "San Leandro, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-materials-science-internship-at-pacific-fusion-4490149979",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485792132",
      title: "Metrology Development Intern (Spring 2027)",
      company: "First Solar",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/metrology-development-intern-spring-2027-at-first-solar-4485792132",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490400203",
      title: "ESH Undergraduate Intern - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/esh-undergraduate-intern-summer-2027-at-lawrence-livermore-national-laboratory-4490400203",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490966143",
      title: "Student Intern/Graduate Student Intern (Part-Time) - Department of Transportation",
      company: "City of San Jos\xE9",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/student-intern-graduate-student-intern-part-time-department-of-transportation-at-city-of-san-jos%C3%A9-4490966143",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489401792",
      title: "Clinical Leader Intern - Santa Clara",
      company: "Center for Social Dynamics",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/clinical-leader-intern-santa-clara-at-center-for-social-dynamics-4489401792",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490187794",
      title: "ESH Graduate Intern - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/esh-graduate-intern-summer-2027-at-lawrence-livermore-national-laboratory-4490187794",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490830992",
      title: "Sustainability Intern IV",
      company: "City of Cupertino",
      location: "Cupertino, CA",
      url: "https://www.linkedin.com/jobs/view/sustainability-intern-iv-at-city-of-cupertino-4490830992",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490418539",
      title: "Intern - Data Collection",
      company: "Xtreme Management Solutions Pvt Ltd",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/intern-data-collection-at-xtreme-management-solutions-pvt-ltd-4490418539",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483774809",
      title: "Research Associate Intern",
      company: "BillionToOne",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-intern-at-billiontoone-4483774809",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491734839",
      title: "Future Product Innovation Research Intern, Computational Cognitive Science",
      company: "Toyota Research Institute",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/future-product-innovation-research-intern-computational-cognitive-science-at-toyota-research-institute-4491734839",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490977162",
      title: "Applied Research Scientist Intern, Agentic Biology - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/applied-research-scientist-intern-agentic-biology-summer-2027-at-nvidia-4490977162",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491785010",
      title: "Public Information Representative (Communication) Intern - Office of Retirement Services",
      company: "City of San Jos\xE9",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/public-information-representative-communication-intern-office-of-retirement-services-at-city-of-san-jos%C3%A9-4491785010",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491598410",
      title: "Intern, Scouting and Academia - Spring 2027 - Summer 2027",
      company: "BMW Group",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/intern-scouting-and-academia-spring-2027-summer-2027-at-bmw-group-4491598410",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491737481",
      title: "2027 Summer Associate (1L)",
      company: "General Legal (YC26)",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-associate-1l-at-general-legal-yc26-4491737481",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490811888",
      title: "Internship - SW Developer Support - Program Management Office",
      company: "Lumentum",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/internship-sw-developer-support-program-management-office-at-lumentum-4490811888",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491591328",
      title: "PhD Research Intern, AI Lab",
      company: "InterDigital, Inc.",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/phd-research-intern-ai-lab-at-interdigital-inc-4491591328",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475523179",
      title: "Student Researcher - (Seed Model - LLM) - 2026 Start (PhD)",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/student-researcher-seed-model-llm-2026-start-phd-at-bytedance-4475523179",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491408447",
      title: "Curriculum Packaging Intern (Hybrid, San Jose, CA)",
      company: "Cultivating Literacy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/curriculum-packaging-intern-hybrid-san-jose-ca-at-cultivating-literacy-4491408447",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491108028",
      title: "UX Designer Intern [Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/ux-designer-intern-summer-2027-at-zoox-4491108028",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490193324",
      title: "San Francisco Public Utilities Commission Summer 2027 Student Design Trainee Program",
      company: "San Francisco Public Utilities Commission",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/san-francisco-public-utilities-commission-summer-2027-student-design-trainee-program-at-san-francisco-public-utilities-commission-4490193324",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491153904",
      title: "Intern - Segment Marketing Data Analyst",
      company: "Micron Technology",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-segment-marketing-data-analyst-at-micron-technology-4491153904",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491760898",
      title: "Content and Social Media Marketing Intern",
      company: "Crusoe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/content-and-social-media-marketing-intern-at-crusoe-4491760898",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491725416",
      title: "Volunteer Coordinator Intern",
      company: "Sierra Club",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/volunteer-coordinator-intern-at-sierra-club-4491725416",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490954233",
      title: "Summer 2027 Community Science Partnerships Intern",
      company: "Natural Resources Defense Council (NRDC)",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-community-science-partnerships-intern-at-natural-resources-defense-council-nrdc-4490954233",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483748289",
      title: "Software Engineering Intern (Summer 2027)",
      company: "Cohesity",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-summer-2027-at-cohesity-4483748289",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490964576",
      title: "Internship, Grid Compliance Test Engineer, Energy Engineering (Winter/Spring 2027)",
      company: "Tesla",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/internship-grid-compliance-test-engineer-energy-engineering-winter-spring-2027-at-tesla-4490964576",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490964605",
      title: "Student Internship - Winter/Spring 2026 - San Francisco",
      company: "Gensler",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/student-internship-winter-spring-2026-san-francisco-at-gensler-4490964605",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489799173",
      title: "Front-End Developer Intern (Remote)",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/front-end-developer-intern-remote-at-webstaurantstore-4489799173",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489790752",
      title: "Product Design Intern - Marketing Sites (Remote)",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-marketing-sites-remote-at-webstaurantstore-4489790752",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490107093",
      title: "Data Science Summer Intern",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/data-science-summer-intern-at-webstaurantstore-4490107093",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490101284",
      title: "Outbound Logistics Summer Intern (Remote Friendly)",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/outbound-logistics-summer-intern-remote-friendly-at-webstaurantstore-4490101284",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490530839",
      title: "Summer 2027 Data Product Internship",
      company: "T-Mobile",
      location: "Bellevue, WA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-data-product-internship-at-t-mobile-4490530839",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474506957",
      title: "Data Analyst, Intern",
      company: "Stripe",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/data-analyst-intern-at-stripe-4474506957",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490155323",
      title: "Focus Features Publicity & Marketing Internships \u2013 Summer 2027",
      company: "Focus Features",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/focus-features-publicity-marketing-internships-%E2%80%93-summer-2027-at-focus-features-4490155323",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490952368",
      title: "Data Science & Analytics Intern",
      company: "EchoStar Corporation",
      location: "Englewood, CO",
      url: "https://www.linkedin.com/jobs/view/data-science-analytics-intern-at-echostar-corporation-4490952368",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490945725",
      title: "Software Engineering Intern",
      company: "EchoStar Corporation",
      location: "Englewood, CO",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-at-echostar-corporation-4490945725",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491102441",
      title: "Intern, Partnership Marketing & Media Sales",
      company: "Kroenke Sports & Entertainment",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/intern-partnership-marketing-media-sales-at-kroenke-sports-entertainment-4491102441",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490908300",
      title: "Universal Film Global Distribution Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/universal-film-global-distribution-internships-%E2%80%93-summer-2027-at-nbcuniversal-4490908300",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490906379",
      title: "Digital Transformation AR/VR Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/digital-transformation-ar-vr-internships-%E2%80%93-summer-2027-at-nbcuniversal-4490906379",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490101781",
      title: "Publicis Media Summer 2027 Internship - Los Angeles",
      company: "Publicis Media",
      location: "El Segundo, CA",
      url: "https://www.linkedin.com/jobs/view/publicis-media-summer-2027-internship-los-angeles-at-publicis-media-4490101781",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490942919",
      title: "Underwriting Intern - Summer 2027",
      company: "Elevance Health",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/underwriting-intern-summer-2027-at-elevance-health-4490942919",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490116116",
      title: "Publicis Media Summer 2027 Internship - Atlanta",
      company: "Publicis Media",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/publicis-media-summer-2027-internship-atlanta-at-publicis-media-4490116116",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465148333",
      title: "SAP iXp - Global Revenue Operations Intern - Project Management and Business Analysis",
      company: "SAP",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/sap-ixp-global-revenue-operations-intern-project-management-and-business-analysis-at-sap-4465148333",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474524268",
      title: "Data Analyst, Intern",
      company: "Stripe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/data-analyst-intern-at-stripe-4474524268",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481468687",
      title: "Signal and Power Integrity Intern, MS - Summer 2027",
      company: "Marvell Technology",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/signal-and-power-integrity-intern-ms-summer-2027-at-marvell-technology-4481468687",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490610263",
      title: "GMC Field & Partner Marketing Intern",
      company: "Hewlett Packard Enterprise",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/gmc-field-partner-marketing-intern-at-hewlett-packard-enterprise-4490610263",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490619085",
      title: "GMC Brand & Corporate Marketing Intern",
      company: "Hewlett Packard Enterprise",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/gmc-brand-corporate-marketing-intern-at-hewlett-packard-enterprise-4490619085",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489788900",
      title: "Displays Engineer Intern (Summer 2027)",
      company: "Reliable Robotics Corporation",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/displays-engineer-intern-summer-2027-at-reliable-robotics-corporation-4489788900",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490609209",
      title: "GMC Finance & Operations Intern",
      company: "Hewlett Packard Enterprise",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/gmc-finance-operations-intern-at-hewlett-packard-enterprise-4490609209",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481779431",
      title: "Finance & Accounting Internship (Bachelors, Summer 2027)",
      company: "Sandisk",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/finance-accounting-internship-bachelors-summer-2027-at-sandisk-4481779431",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490949570",
      title: "2027 Process Engineering Intern - PhD (6 months)",
      company: "Lam Research",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/2027-process-engineering-intern-phd-6-months-at-lam-research-4490949570",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491543477",
      title: "2027 Summer Intern - GCS ML Sequencing",
      company: "Roche",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-gcs-ml-sequencing-at-roche-4491543477",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485241010",
      title: "Robotics Intern, Human-Machine Interaction Research",
      company: "Toyota Research Institute",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/robotics-intern-human-machine-interaction-research-at-toyota-research-institute-4485241010",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490606491",
      title: "GMC Product & Solutions Marketing Intern",
      company: "Hewlett Packard Enterprise",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/gmc-product-solutions-marketing-intern-at-hewlett-packard-enterprise-4490606491",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490139068",
      title: "Clinical Research Engineering Intern",
      company: "Intuitive",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/clinical-research-engineering-intern-at-intuitive-4490139068",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489754115",
      title: "Cost Advisory Intern (Summer 2027)",
      company: "Arup",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/cost-advisory-intern-summer-2027-at-arup-4489754115",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489749359",
      title: "Resilience Engineer Intern (Summer 2027)",
      company: "Arup",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/resilience-engineer-intern-summer-2027-at-arup-4489749359",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491532269",
      title: "Service Designer Intern [Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/service-designer-intern-summer-2027-at-zoox-4491532269",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490151348",
      title: "Finance Intern",
      company: "Dublin San Ramon Services District",
      location: "Dublin, CA",
      url: "https://www.linkedin.com/jobs/view/finance-intern-at-dublin-san-ramon-services-district-4490151348",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490917265",
      title: "Internship - Strength & Performance Coach",
      company: "Efficiency Sports Performance",
      location: "San Ramon, CA",
      url: "https://www.linkedin.com/jobs/view/internship-strength-performance-coach-at-efficiency-sports-performance-4490917265",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490602709",
      title: "HPE Labs - Systems Architecture Lab Research Associate Intern",
      company: "Hewlett Packard Enterprise",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/hpe-labs-systems-architecture-lab-research-associate-intern-at-hewlett-packard-enterprise-4490602709",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474517714",
      title: "PhD Data Scientist, Intern",
      company: "Stripe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/phd-data-scientist-intern-at-stripe-4474517714",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490613290",
      title: "GMC Customer Advocacy & Engagement Intern",
      company: "Hewlett Packard Enterprise",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/gmc-customer-advocacy-engagement-intern-at-hewlett-packard-enterprise-4490613290",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465195532",
      title: "Data Analytics & Programs Intern - Summer 2027",
      company: "Veeam Software",
      location: "Georgia, United States",
      url: "https://www.linkedin.com/jobs/view/data-analytics-programs-intern-summer-2027-at-veeam-software-4465195532",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473144547",
      title: "Software Engineer Intern",
      company: "ShopBack",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-shopback-4473144547",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489383087",
      title: "Equity Research Intern",
      company: "Wall Street Oasis",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/equity-research-intern-at-wall-street-oasis-4489383087",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466321148",
      title: "Summer 2027 Finance Intern",
      company: "Voya Financial",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/summer-2027-finance-intern-at-voya-financial-4466321148",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489385672",
      title: "Investment Banking Intern",
      company: "Wall Street Oasis",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/investment-banking-intern-at-wall-street-oasis-4489385672",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491269327",
      title: "Content & Social Media Intern (NYC)",
      company: "Glowie By Her",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/content-social-media-intern-nyc-at-glowie-by-her-4491269327",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491268388",
      title: "SOC Analyst Internship Program - LSU Students Only",
      company: "C3",
      location: "Baton Rouge, LA",
      url: "https://www.linkedin.com/jobs/view/soc-analyst-internship-program-lsu-students-only-at-c3-4491268388",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475069915",
      title: "Marketing Intern",
      company: "Cboe Global Markets",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-cboe-global-markets-4475069915",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475086206",
      title: "Technical Business Analyst Intern",
      company: "Cboe Global Markets",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/technical-business-analyst-intern-at-cboe-global-markets-4475086206",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474572309",
      title: "Summer Intern \u2013 Credit Risk Management",
      company: "The Options Clearing Corporation (OCC)",
      location: "Greater Chicago Area",
      url: "https://www.linkedin.com/jobs/view/summer-intern-%E2%80%93-credit-risk-management-at-the-options-clearing-corporation-occ-4474572309",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466450020",
      title: "Software Engineer Intern",
      company: "Ibotta",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-ibotta-4466450020",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466366688",
      title: "D2C Marketing Intern",
      company: "Ibotta",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/d2c-marketing-intern-at-ibotta-4466366688",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465698962",
      title: "Data Analytics Intern (Spring 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/data-analytics-intern-spring-2027-at-zipline-4465698962",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491217097",
      title: "Internship, Electrical Engineer, High Speed Hardware Design, Optimus (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-electrical-engineer-high-speed-hardware-design-optimus-winter-spring-2027-at-tesla-4491217097",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464557871",
      title: "Field/Office Engineer Intern - Underground District - Summer 2027",
      company: "Kiewit",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/field-office-engineer-intern-underground-district-summer-2027-at-kiewit-4464557871",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475049192",
      title: "Summer 2027: Finance Transformation & Analytics Intern",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-finance-transformation-analytics-intern-at-intuit-4475049192",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475050719",
      title: "Datacenter Procurement Project Intern (Data Center Development) - 2026 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/datacenter-procurement-project-intern-data-center-development-2026-start-at-bytedance-4475050719",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489710339",
      title: "Summer 2027 International Tax Intern",
      company: "Baker Tilly US",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-international-tax-intern-at-baker-tilly-us-4489710339",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489378836",
      title: "Strategic Sourcing Manager, Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/strategic-sourcing-manager-intern-at-meta-4489378836",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4456003913",
      title: "Rotational Accounting Internship - Summer 2027 - San Jose",
      company: "Frank, Rimerman + Co. LLP",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/rotational-accounting-internship-summer-2027-san-jose-at-frank-rimerman-%2B-co-llp-4456003913",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473400182",
      title: "AI Product Manager - MBA Intern (Summer 2027)",
      company: "C3 AI",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/ai-product-manager-mba-intern-summer-2027-at-c3-ai-4473400182",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466328241",
      title: "Legal Summer Intern Rising 2L  (Intern) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/legal-summer-intern-rising-2l-intern-united-states-at-cisco-4466328241",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463984844",
      title: "Product Design, Intern (Summer 2027)",
      company: "DoorDash",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-summer-2027-at-doordash-4463984844",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465105173",
      title: "Global Content Ecosystem Policy Operation Intern (TikTok-Product-Content Ecosystem) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/global-content-ecosystem-policy-operation-intern-tiktok-product-content-ecosystem-2027-summer-at-tiktok-4465105173",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475060236",
      title: "Software Engineer Project Intern (Security-Data) - 2026 Start (BS/MS)",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-project-intern-security-data-2026-start-bs-ms-at-bytedance-4475060236",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466354432",
      title: "Data Science Intern, Algorithms (Summer 2027 - SF/NYC)",
      company: "Lyft",
      location: "San Francisco County, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-algorithms-summer-2027-sf-nyc-at-lyft-4466354432",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473140603",
      title: "Software Engineer Intern",
      company: "ShopBack",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-shopback-4473140603",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488993813",
      title: "Summer Marketing Internship",
      company: "Tapestry",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/summer-marketing-internship-at-tapestry-4488993813",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483125446",
      title: "2027 - Software Engineering Intern, AMER",
      company: "MongoDB",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-software-engineering-intern-amer-at-mongodb-4483125446",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471171648",
      title: "Software Engineer - Internship",
      company: "SeatGeek",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/software-engineer-internship-at-seatgeek-4471171648",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489842647",
      title: "Talent Acquisition Intern",
      company: "Rollins, Inc.",
      location: "Logan, UT",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-intern-at-rollins-inc-4489842647",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491097775",
      title: "Cybersecurity Internship (Remote) \u2013 Summer 2027 (Undergraduate)",
      company: "Molina Healthcare",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/cybersecurity-internship-remote-%E2%80%93-summer-2027-undergraduate-at-molina-healthcare-4491097775",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489370001",
      title: "Content Creation and Writing Intern (Spring & Summer 2027)",
      company: "Aegon",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/content-creation-and-writing-intern-spring-summer-2027-at-aegon-4489370001",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491078734",
      title: "Marketing MBA Internship Opportunities, United States",
      company: "Microsoft",
      location: "Redmond, WA",
      url: "https://www.linkedin.com/jobs/view/marketing-mba-internship-opportunities-united-states-at-microsoft-4491078734",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473373323",
      title: "Software Engineering Intern \u2013 Self-Service Directory Diagnostics",
      company: "Docusign",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-%E2%80%93-self-service-directory-diagnostics-at-docusign-4473373323",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474784663",
      title: "Business Operations Intern",
      company: "Emerson",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/business-operations-intern-at-emerson-4474784663",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491072553",
      title: "Housekeeping Operations and Analytics Intern",
      company: "Holland America Line",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/housekeeping-operations-and-analytics-intern-at-holland-america-line-4491072553",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491060934",
      title: "Intern, Maritime Business Data Analytics (HAL)",
      company: "Holland America Line",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/intern-maritime-business-data-analytics-hal-at-holland-america-line-4491060934",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491035097",
      title: "Internship - EUV Data Science and Analytics",
      company: "ASML",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/internship-euv-data-science-and-analytics-at-asml-4491035097",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474323820",
      title: "University - 2027 Summer Games Software Developer Intern - Annapolis Junction, MD",
      company: "Booz Allen Hamilton",
      location: "Annapolis Junction, MD",
      url: "https://www.linkedin.com/jobs/view/university-2027-summer-games-software-developer-intern-annapolis-junction-md-at-booz-allen-hamilton-4474323820",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489897350",
      title: "Artificial Intelligence Intern",
      company: "Aligned Recruitment Co.",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/artificial-intelligence-intern-at-aligned-recruitment-co-4489897350",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481925735",
      title: "2027 Summer Intern - FP&A",
      company: "Papa Johns",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-fp-a-at-papa-johns-4481925735",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474335088",
      title: "University - 2027 Summer Games Data Scientist Intern - Annapolis Junction, MD",
      company: "Booz Allen Hamilton",
      location: "Annapolis Junction, MD",
      url: "https://www.linkedin.com/jobs/view/university-2027-summer-games-data-scientist-intern-annapolis-junction-md-at-booz-allen-hamilton-4474335088",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473155559",
      title: "SAP iXp Intern - Digital Value Advisor",
      company: "SAP",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/sap-ixp-intern-digital-value-advisor-at-sap-4473155559",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465808852",
      title: "Data Analytics Intern (Summer 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/data-analytics-intern-summer-2027-at-zipline-4465808852",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474366446",
      title: "PhD Data Science Internship 2027 (USA)",
      company: "Pinterest",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/phd-data-science-internship-2027-usa-at-pinterest-4474366446",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455918307",
      title: "Area Manager Intern - Summer 2027 (California), University Recruiting",
      company: "Amazon",
      location: "Tracy, CA",
      url: "https://www.linkedin.com/jobs/view/area-manager-intern-summer-2027-california-university-recruiting-at-amazon-4455918307",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483313899",
      title: "Summer 2027: Marketing Intern, AI Tooling for Marketing Efficiency",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-marketing-intern-ai-tooling-for-marketing-efficiency-at-intuit-4483313899",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491010678",
      title: "Structured Finance Summer Associate (MBA Intern)",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/structured-finance-summer-associate-mba-intern-at-bloom-energy-4491010678",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491024014",
      title: "Process Development Engineering Intern",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/process-development-engineering-intern-at-bloom-energy-4491024014",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454149506",
      title: "Legal Intern - Fall 2026",
      company: "Lambda",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/legal-intern-fall-2026-at-lambda-4454149506",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491026802",
      title: "Strategic Operations Intern (Summer 2027 - Masters Degree)",
      company: "ServiceNow",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/strategic-operations-intern-summer-2027-masters-degree-at-servicenow-4491026802",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474549489",
      title: "Language Specialist Project Intern (PMO-Language Center) - 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/language-specialist-project-intern-pmo-language-center-2027-start-at-bytedance-4474549489",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491003895",
      title: "Energy Transition Solutions Intern",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/energy-transition-solutions-intern-at-bloom-energy-4491003895",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483107162",
      title: "Graduate Associate, Public Relations (Paid Internship)",
      company: "Method Communications",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/graduate-associate-public-relations-paid-internship-at-method-communications-4483107162",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4457088136",
      title: "Operations Experience Intern (Summer 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/operations-experience-intern-summer-2027-at-zipline-4457088136",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455474236",
      title: "NVIDIA 2027 Internships: Systems Software Engineering",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/nvidia-2027-internships-systems-software-engineering-at-nvidia-4455474236",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474561093",
      title: "Security Engineering Project Intern (Watermark) - 2026 Start (BS/MS)",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/security-engineering-project-intern-watermark-2026-start-bs-ms-at-bytedance-4474561093",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482385374",
      title: "Building Automation Systems Specialist Internship",
      company: "Siemens",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/building-automation-systems-specialist-internship-at-siemens-4482385374",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491008705",
      title: "Microgrid Commissioning Support Intern (MSEE)",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/microgrid-commissioning-support-intern-msee-at-bloom-energy-4491008705",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491026981",
      title: "Industrial Design Intern [Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/industrial-design-intern-summer-2027-at-zoox-4491026981",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474353778",
      title: "PhD Data Science Internship 2027 (USA)",
      company: "Pinterest",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/phd-data-science-internship-2027-usa-at-pinterest-4474353778",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488970683",
      title: "AI Research Engineer Intern",
      company: "Lockheed Martin",
      location: "Mobile, AL",
      url: "https://www.linkedin.com/jobs/view/ai-research-engineer-intern-at-lockheed-martin-4488970683",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488979383",
      title: "Business Analyst- Intern",
      company: "Lockheed Martin",
      location: "Philadelphia, PA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-intern-at-lockheed-martin-4488979383",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488979384",
      title: "Business Analyst- Intern",
      company: "Lockheed Martin",
      location: "Eighty Four, PA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-intern-at-lockheed-martin-4488979384",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472611818",
      title: "Summer 2027 Digital Banking Intern (Remote)",
      company: "SouthState Bank",
      location: "Winter Haven, FL",
      url: "https://www.linkedin.com/jobs/view/summer-2027-digital-banking-intern-remote-at-southstate-bank-4472611818",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488982256",
      title: "Price Analysis (Finance) Supply Chain Intern",
      company: "Lockheed Martin",
      location: "Lansing, MI",
      url: "https://www.linkedin.com/jobs/view/price-analysis-finance-supply-chain-intern-at-lockheed-martin-4488982256",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488978444",
      title: "Price Analysis (Finance) Supply Chain Intern",
      company: "Lockheed Martin",
      location: "Four Towns, MI",
      url: "https://www.linkedin.com/jobs/view/price-analysis-finance-supply-chain-intern-at-lockheed-martin-4488978444",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465318343",
      title: "Summer Associate Internship (Product Security Engineer)",
      company: "Navy Federal Credit Union",
      location: "Vienna, VA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-product-security-engineer-at-navy-federal-credit-union-4465318343",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490792308",
      title: "Talent Acquisition Intern",
      company: "Fox Pest Control",
      location: "Logan, UT",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-intern-at-fox-pest-control-4490792308",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488980775",
      title: "Intern, Human Resources",
      company: "USA Football",
      location: "Indianapolis, IN",
      url: "https://www.linkedin.com/jobs/view/intern-human-resources-at-usa-football-4488980775",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488986319",
      title: "Cyber Security Intern",
      company: "RegScale",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/cyber-security-intern-at-regscale-4488986319",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489828285",
      title: "Content Creation and Writing Intern (Spring & Summer 2027)",
      company: "Transamerica",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/content-creation-and-writing-intern-spring-summer-2027-at-transamerica-4489828285",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489824578",
      title: "Content Creation and Writing Intern (Spring & Summer 2027)",
      company: "Transamerica",
      location: "Philadelphia, PA",
      url: "https://www.linkedin.com/jobs/view/content-creation-and-writing-intern-spring-summer-2027-at-transamerica-4489824578",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4425567572",
      title: "Campaign Operation Project Intern (TikTok Shop - Fashion) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/campaign-operation-project-intern-tiktok-shop-fashion-2026-start-bs-ms-at-tiktok-4425567572",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481640408",
      title: "Transportation Data Analyst Intern - Summer 2027",
      company: "WSP in the U.S.",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/transportation-data-analyst-intern-summer-2027-at-wsp-in-the-u-s-4481640408",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470983130",
      title: "Software Development Engineer (Seattle) - Internship 2027",
      company: "Qumulo",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-seattle-internship-2027-at-qumulo-4470983130",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491016265",
      title: "Life Sciences Marketing Intern",
      company: "Emerson",
      location: "Round Rock, TX",
      url: "https://www.linkedin.com/jobs/view/life-sciences-marketing-intern-at-emerson-4491016265",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490566553",
      title: "Operations - 2027 Summer Internship",
      company: "Motorola Solutions",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/operations-2027-summer-internship-at-motorola-solutions-4490566553",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465098956",
      title: "Financial Planning and Analysis Intern (F&II)",
      company: "Ingredion Incorporated",
      location: "Westchester, IL",
      url: "https://www.linkedin.com/jobs/view/financial-planning-and-analysis-intern-f-ii-at-ingredion-incorporated-4465098956",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489824169",
      title: "Summer Intern 2027, OSD Process Data Analytics",
      company: "Vertex Pharmaceuticals",
      location: "Boston, MA",
      url: "https://www.linkedin.com/jobs/view/summer-intern-2027-osd-process-data-analytics-at-vertex-pharmaceuticals-4489824169",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464149013",
      title: "Application Software Engineering Intern",
      company: "Shure",
      location: "Niles, IL",
      url: "https://www.linkedin.com/jobs/view/application-software-engineering-intern-at-shure-4464149013",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489812494",
      title: "Consulting Bachelor's Intern",
      company: "Kaiser Permanente",
      location: "Pasadena, CA",
      url: "https://www.linkedin.com/jobs/view/consulting-bachelor-s-intern-at-kaiser-permanente-4489812494",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488957926",
      title: "Software Development Intern - Summer 2027",
      company: "Lockheed Martin",
      location: "Rockville, MD",
      url: "https://www.linkedin.com/jobs/view/software-development-intern-summer-2027-at-lockheed-martin-4488957926",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488970583",
      title: "Software Development Intern - Summer 2027",
      company: "Lockheed Martin",
      location: "Bethesda, MD",
      url: "https://www.linkedin.com/jobs/view/software-development-intern-summer-2027-at-lockheed-martin-4488970583",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489818347",
      title: "Consulting Master's Intern",
      company: "Kaiser Permanente",
      location: "Pasadena, CA",
      url: "https://www.linkedin.com/jobs/view/consulting-master-s-intern-at-kaiser-permanente-4489818347",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4450366952",
      title: "Business Analysis and Strategy Project Intern (TikTok Shop - Operations Center) - 2026 Start",
      company: "TikTok",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/business-analysis-and-strategy-project-intern-tiktok-shop-operations-center-2026-start-at-tiktok-4450366952",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474144835",
      title: "Summer 2027: Digital Procurement & AI Solutions Intern",
      company: "Intuit",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-digital-procurement-ai-solutions-intern-at-intuit-4474144835",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488975144",
      title: "Software Engineer (AMMM) - Intern",
      company: "Lockheed Martin",
      location: "Marietta, GA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-ammm-intern-at-lockheed-martin-4488975144",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465309419",
      title: "Summer Associate Internship (Consumer Lending Business Intelligence Analyst)",
      company: "Navy Federal Credit Union",
      location: "Vienna, VA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-consumer-lending-business-intelligence-analyst-at-navy-federal-credit-union-4465309419",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488110220",
      title: "Business Intelligence Intern \u2014 Reporting and QA",
      company: "Deltek",
      location: "Herndon, VA",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-intern-%E2%80%94-reporting-and-qa-at-deltek-4488110220",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4441429705",
      title: "2027 Business Analyst Intern",
      company: "Solar Turbines",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/2027-business-analyst-intern-at-solar-turbines-4441429705",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491006333",
      title: "Summer 2027 - Software Engineer Intern",
      company: "Shield",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-software-engineer-intern-at-shield-4491006333",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465309410",
      title: "Summer Associate Internship (Associate Business Intelligence Analyst)",
      company: "Navy Federal Credit Union",
      location: "Vienna, VA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-associate-business-intelligence-analyst-at-navy-federal-credit-union-4465309410",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474720730",
      title: "Summer 2027: Business Data Analyst Intern, Strategy & Planning",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-business-data-analyst-intern-strategy-planning-at-intuit-4474720730",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463819999",
      title: "Global Customer Experience Business Analytics Project Intern (TikTok Shop-Governance and Experience) - 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/global-customer-experience-business-analytics-project-intern-tiktok-shop-governance-and-experience-2026-start-at-tiktok-4463819999",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490557138",
      title: "Sales Analytics Intern 2027 (USA)",
      company: "Pinterest",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/sales-analytics-intern-2027-usa-at-pinterest-4490557138",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480090775",
      title: "Data Science Intern (2027 Start)",
      company: "Databricks",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-2027-start-at-databricks-4480090775",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474352883",
      title: "Master's Data Science Internship 2027 (USA)",
      company: "Pinterest",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/master-s-data-science-internship-2027-usa-at-pinterest-4474352883",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472991448",
      title: "Machine Learning Engineer Intern (Risk & Integrity) - 2027 Start (PhD)",
      company: "TikTok USDS Joint Venture",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-engineer-intern-risk-integrity-2027-start-phd-at-tiktok-usds-joint-venture-4472991448",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474575961",
      title: "2027 Summer Intern \u2013 AI/ML Engineer, Autonomous Vehicles: Simulation (PhD)",
      company: "General Motors",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-%E2%80%93-ai-ml-engineer-autonomous-vehicles-simulation-phd-at-general-motors-4474575961",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481642525",
      title: "Software Engineering Intern - Connected Systems (Summer 2027)",
      company: "Rivian and Volkswagen Group Technologies",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-connected-systems-summer-2027-at-rivian-and-volkswagen-group-technologies-4481642525",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491010095",
      title: "Avionics Intern (Summer 2027)",
      company: "Reliable Robotics Corporation",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/avionics-intern-summer-2027-at-reliable-robotics-corporation-4491010095",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455483200",
      title: "NVIDIA 2027 Internships: Digital Circuit Design",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/nvidia-2027-internships-digital-circuit-design-at-nvidia-4455483200",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491010028",
      title: "Electrical Systems Integration Intern (Summer 2027)",
      company: "Reliable Robotics Corporation",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-systems-integration-intern-summer-2027-at-reliable-robotics-corporation-4491010028",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486289539",
      title: "Electrical Engineering Intern - Equipment Engineering Team",
      company: "Seagate Technology",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineering-intern-equipment-engineering-team-at-seagate-technology-4486289539",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481620503",
      title: "Business and Administrative Intern - Strategy Analyst",
      company: "Rivian",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/business-and-administrative-intern-strategy-analyst-at-rivian-4481620503",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464125863",
      title: "2027 Spring Mechanical Engineering Intern (R20828)",
      company: "MKS Inc.",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/2027-spring-mechanical-engineering-intern-r20828-at-mks-inc-4464125863",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490711552",
      title: "Security Engineering Intern (Summer 2027)",
      company: "Climactic",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/security-engineering-intern-summer-2027-at-climactic-4490711552",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490563000",
      title: "Security Engineering Intern (Summer 2027)",
      company: "Muon Space",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/security-engineering-intern-summer-2027-at-muon-space-4490563000",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474541221",
      title: "Mechanical Engineer I (Intern) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-i-intern-united-states-at-cisco-4474541221",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480073462",
      title: "Mechanical Engineering, Intern - Labs (Summer 2027)",
      company: "DoorDash",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineering-intern-labs-summer-2027-at-doordash-4480073462",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488987608",
      title: "Indirect Procurement Intern",
      company: "Rambus",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/indirect-procurement-intern-at-rambus-4488987608",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455789302",
      title: "Global Supply Management Intern (Spring 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/global-supply-management-intern-spring-2027-at-zipline-4455789302",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474549563",
      title: "Product Management Project Intern (Global Payment) - 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-management-project-intern-global-payment-2027-start-at-bytedance-4474549563",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462548846",
      title: "Summer 2027 Intern - Human Resources",
      company: "WD",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-human-resources-at-wd-4462548846",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462548842",
      title: "Summer 2027 Intern - Financial Analyst - Undergraduate & MBA",
      company: "WD",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-financial-analyst-undergraduate-mba-at-wd-4462548842",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473056449",
      title: "University Recruitment Ambassador Internship",
      company: "Tacit",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/university-recruitment-ambassador-internship-at-tacit-4473056449",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472851478",
      title: "Aviation Planning Intern",
      company: "Kimley-Horn",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/aviation-planning-intern-at-kimley-horn-4472851478",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490548174",
      title: "NPI Engineering Development Intern",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/npi-engineering-development-intern-at-bloom-energy-4490548174",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490784029",
      title: "Clinical Research Intern",
      company: "Intuitive",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/clinical-research-intern-at-intuitive-4490784029",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490799892",
      title: "2027 Summer Intern - Computational Science",
      company: "Roche",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-computational-science-at-roche-4490799892",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488770703",
      title: "Translational Sciences undergrad intern (Summer 2027)",
      company: "Amgen",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/translational-sciences-undergrad-intern-summer-2027-at-amgen-4488770703",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474556225",
      title: "Developer Advocacy Project Intern (PICO) - 2026 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/developer-advocacy-project-intern-pico-2026-start-at-bytedance-4474556225",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490780940",
      title: "Legal Intern",
      company: "Menlo Security Inc.",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/legal-intern-at-menlo-security-inc-4490780940",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465890204",
      title: "Legal Rising 3L  (Intern) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/legal-rising-3l-intern-united-states-at-cisco-4465890204",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474539980",
      title: "Student Researcher (Video Quality Analysis & Coding Strategy) - 2026 Start (PhD)",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/student-researcher-video-quality-analysis-coding-strategy-2026-start-phd-at-bytedance-4474539980",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488604618",
      title: "Hatch's Summer 2027 Internship Program",
      company: "Hatch",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/hatch-s-summer-2027-internship-program-at-hatch-4488604618",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452901153",
      title: "Open Platform Product Project Intern (TikTok-Product-Open Platform) - 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/open-platform-product-project-intern-tiktok-product-open-platform-2026-start-at-tiktok-4452901153",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480638615",
      title: "Research Scientist Intern, Central Applied Science (PhD)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-scientist-intern-central-applied-science-phd-at-meta-4480638615",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489294819",
      title: "Graduate Internship (Year-Round) - AI/Machine Learning Time Series Modeling",
      company: "National Laboratory of the Rockies",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/graduate-internship-year-round-ai-machine-learning-time-series-modeling-at-national-laboratory-of-the-rockies-4489294819",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471785405",
      title: "Summer 2027 Loan Closing Intern (Remote)",
      company: "SouthState Bank",
      location: "Winter Haven, FL",
      url: "https://www.linkedin.com/jobs/view/summer-2027-loan-closing-intern-remote-at-southstate-bank-4471785405",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463802022",
      title: "Product Design Intern, 2027 Summer U.S.",
      company: "Atlassian",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-2027-summer-u-s-at-atlassian-4463802022",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471788129",
      title: "Summer 2027 Quantitative Intern (Remote)",
      company: "SouthState Bank",
      location: "Winter Haven, FL",
      url: "https://www.linkedin.com/jobs/view/summer-2027-quantitative-intern-remote-at-southstate-bank-4471788129",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488587191",
      title: "Spring Intern, Content Marketing & Partnerships - Part-Time",
      company: "SiriusXM",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/spring-intern-content-marketing-partnerships-part-time-at-siriusxm-4488587191",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488571948",
      title: "Spring Intern, Promotions & Events Marketing - Part Time",
      company: "SiriusXM",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/spring-intern-promotions-events-marketing-part-time-at-siriusxm-4488571948",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462573802",
      title: "Software Engineer Intern",
      company: "Cboe Global Markets",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-cboe-global-markets-4462573802",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481140955",
      title: "Sales Operations Intern",
      company: "Trace3",
      location: "Grand Rapids, MI",
      url: "https://www.linkedin.com/jobs/view/sales-operations-intern-at-trace3-4481140955",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481153506",
      title: "Project Operations Specialist Intern",
      company: "Trace3",
      location: "Irvine, CA",
      url: "https://www.linkedin.com/jobs/view/project-operations-specialist-intern-at-trace3-4481153506",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482173865",
      title: "Communications Intern",
      company: "AARP",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/communications-intern-at-aarp-4482173865",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490080784",
      title: "Software Engineer, Intern (Summer)",
      company: "Stripe",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-at-stripe-4490080784",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482165698",
      title: "Software Development Engineer - Intern",
      company: "Zillow",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-intern-at-zillow-4482165698",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473530994",
      title: "2027 Summer Marketing Internships",
      company: "Hasbro",
      location: "Renton, WA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-marketing-internships-at-hasbro-4473530994",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4445438581",
      title: "Product Solutions and Operations project Intern (Ads Interface and Platform Product ) - 2026 Start",
      company: "TikTok",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/product-solutions-and-operations-project-intern-ads-interface-and-platform-product-2026-start-at-tiktok-4445438581",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464911743",
      title: "Credit Risk Intern",
      company: "Coinbase",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/credit-risk-intern-at-coinbase-4464911743",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484376774",
      title: "2027 Data Analytics & Business Operations Spring Co-Op or Summer Intern- Bachelor's/Master's (Austin, TX)",
      company: "Applied Materials",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/2027-data-analytics-business-operations-spring-co-op-or-summer-intern-bachelor-s-master-s-austin-tx-at-applied-materials-4484376774",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4382816786",
      title: "Seller Strategy Business Analyst Project Intern (TikTok Shop - US Operation) - 2025 Start (BS/MS)",
      company: "TikTok",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/seller-strategy-business-analyst-project-intern-tiktok-shop-us-operation-2025-start-bs-ms-at-tiktok-4382816786",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463563356",
      title: "Software Engineering Internship - Summer 2027",
      company: "Epsilon",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internship-summer-2027-at-epsilon-4463563356",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489069153",
      title: "Finance Intern",
      company: "Lenovo",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/finance-intern-at-lenovo-4489069153",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484382423",
      title: "Summer 2027 Data Scientist Intern -Bachelor's (Austin, TX)",
      company: "Applied Materials",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/summer-2027-data-scientist-intern-bachelor-s-austin-tx-at-applied-materials-4484382423",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482086533",
      title: "Newhouse LA Study Away Internship, Social Media - Spectrum News",
      company: "Spectrum News",
      location: "El Segundo, CA",
      url: "https://www.linkedin.com/jobs/view/newhouse-la-study-away-internship-social-media-spectrum-news-at-spectrum-news-4482086533",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4426933589",
      title: "Creator Growth Project Intern (TikTok Shop - US Operation) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/creator-growth-project-intern-tiktok-shop-us-operation-2026-start-bs-ms-at-tiktok-4426933589",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481150572",
      title: "Full Stack Software Engineering Internship",
      company: "IDEMIA Public Security",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/full-stack-software-engineering-internship-at-idemia-public-security-4481150572",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455330026",
      title: "Implementation Intern",
      company: "Fast Enterprises, LLC",
      location: "Centennial, CO",
      url: "https://www.linkedin.com/jobs/view/implementation-intern-at-fast-enterprises-llc-4455330026",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481159273",
      title: "Social Media Intern - Spring 2027",
      company: "Golden Hippo\xAE",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/social-media-intern-spring-2027-at-golden-hippo%C2%AE-4481159273",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4317752471",
      title: "Business Analyst Project Intern(TikTok- Operations) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-project-intern-tiktok-operations-2026-start-bs-ms-at-tiktok-4317752471",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469628255",
      title: "Software Engineer - Intern",
      company: "ZipRecruiter",
      location: "Santa Monica, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-ziprecruiter-4469628255",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465318336",
      title: "Summer Associate Internship (Member Associate - Navy Federal Investment Services)",
      company: "Navy Federal Credit Union",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-member-associate-navy-federal-investment-services-at-navy-federal-credit-union-4465318336",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465311416",
      title: "Summer Associate Internship (Social Media Strategist - Influencer Program)",
      company: "Navy Federal Credit Union",
      location: "Vienna, VA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-social-media-strategist-influencer-program-at-navy-federal-credit-union-4465311416",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465326295",
      title: "Summer Associate Internship (Business Intelligence Analyst)",
      company: "Navy Federal Credit Union",
      location: "Vienna, VA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-business-intelligence-analyst-at-navy-federal-credit-union-4465326295",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452831608",
      title: "Asset Management Intern- Atlanta",
      company: "SitusAMC",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/asset-management-intern-atlanta-at-situsamc-4452831608",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465306463",
      title: "Summer Associate Internship (Product Strategist/Business Analyst)",
      company: "Navy Federal Credit Union",
      location: "Vienna, VA",
      url: "https://www.linkedin.com/jobs/view/summer-associate-internship-product-strategist-business-analyst-at-navy-federal-credit-union-4465306463",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484390188",
      title: "Summer 2027 Business Intelligence Analyst Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-business-intelligence-analyst-intern-master-s-santa-clara-ca-at-applied-materials-4484390188",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484699554",
      title: "Summer 2027 Data Intelligence/Technical Program Management Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-data-intelligence-technical-program-management-intern-master-s-santa-clara-ca-at-applied-materials-4484699554",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454711489",
      title: "Data Science Project Intern (Advertisement Team) - 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-project-intern-advertisement-team-2026-start-at-tiktok-4454711489",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4448990233",
      title: "Data Scientist Intern (VOD Data) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-intern-vod-data-2027-summer-at-tiktok-4448990233",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490075214",
      title: "Data Science Intern",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-at-bloom-energy-4490075214",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484385343",
      title: "Summer 2027 Data Scientist Intern - Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-data-scientist-intern-master-s-santa-clara-ca-at-applied-materials-4484385343",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479426397",
      title: "Enterprise Security Engineer, Intern (Summer 2027)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/enterprise-security-engineer-intern-summer-2027-at-meta-4479426397",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486272051",
      title: "2027 Summer Electrical Engineer Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-electrical-engineer-intern-master-s-santa-clara-ca-at-applied-materials-4486272051",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490061884",
      title: "Service Operations Intern",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/service-operations-intern-at-bloom-energy-4490061884",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490070049",
      title: "Utilities Analyst Intern",
      company: "Bloom Energy",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/utilities-analyst-intern-at-bloom-energy-4490070049",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484373857",
      title: "2027 Summer Intern - Electrical Engineer - BS/MS Degree, (Santa Clara)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-electrical-engineer-bs-ms-degree-santa-clara-at-applied-materials-4484373857",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4435857047",
      title: "Security Software Engineer Project Intern (Network Security) - 2026 Start (BS/MS)",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/security-software-engineer-project-intern-network-security-2026-start-bs-ms-at-bytedance-4435857047",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4366561915",
      title: "Security Software Engineer Project Intern (Product Security) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/security-software-engineer-project-intern-product-security-2026-start-bs-ms-at-tiktok-4366561915",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479434038",
      title: "Product Security Engineer, Intern (Summer 2027)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/product-security-engineer-intern-summer-2027-at-meta-4479434038",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484384366",
      title: "2027 Summer Intern - Mechanical Engineer - BS/MS Degree, (Santa Clara)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-mechanical-engineer-bs-ms-degree-santa-clara-at-applied-materials-4484384366",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489280646",
      title: "Communication and Social Media Intern (unpaid)",
      company: "CASA of San Mateo County",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/communication-and-social-media-intern-unpaid-at-casa-of-san-mateo-county-4489280646",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484378553",
      title: "Summer 2027 Industrial Engineer Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-industrial-engineer-intern-master-s-santa-clara-ca-at-applied-materials-4484378553",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481110656",
      title: "Intern - Semiconductor Global Category Supplier Management",
      company: "Micron Technology",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-semiconductor-global-category-supplier-management-at-micron-technology-4481110656",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484376772",
      title: "Summer 2027 Supply Chain Materials Project Manager Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-supply-chain-materials-project-manager-intern-master-s-santa-clara-ca-at-applied-materials-4484376772",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4428895682",
      title: "Social Commerce Intern",
      company: "Logitech",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/social-commerce-intern-at-logitech-4428895682",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482158677",
      title: "University Recruiting Intern",
      company: "Rakuten International",
      location: "San Mateo, CA",
      url: "https://www.linkedin.com/jobs/view/university-recruiting-intern-at-rakuten-international-4482158677",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484385322",
      title: "Summer 2027 Associate Finance Intern (MBA - Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-associate-finance-intern-mba-santa-clara-ca-at-applied-materials-4484385322",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490310040",
      title: "Talent Acquisition Partner - Intern (Data) - 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-partner-intern-data-2027-start-at-bytedance-4490310040",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473756333",
      title: "Summer 2027: MBA Strategic Finance Intern, GBSG",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-mba-strategic-finance-intern-gbsg-at-intuit-4473756333",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4390421365",
      title: "HR Business Partner Project Intern (GMPT) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/hr-business-partner-project-intern-gmpt-2026-start-bs-ms-at-tiktok-4390421365",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464908146",
      title: "Associate Product Manager Intern",
      company: "Coinbase",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/associate-product-manager-intern-at-coinbase-4464908146",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490320063",
      title: "Summer 2027 Financial Analyst Internship",
      company: "McGrath RentCorp",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-financial-analyst-internship-at-mcgrath-rentcorp-4490320063",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484386334",
      title: "Summer 2027 Process Engineer Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-process-engineer-intern-master-s-santa-clara-ca-at-applied-materials-4484386334",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489292439",
      title: "Program Intern (unpaid)",
      company: "CASA of San Mateo County",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/program-intern-unpaid-at-casa-of-san-mateo-county-4489292439",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4447323835",
      title: "AI Product Design Intern (TikTok-Design) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/ai-product-design-intern-tiktok-design-2027-summer-at-tiktok-4447323835",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4448292103",
      title: "Data Science Intern (TikTok Integrity and Safety) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-tiktok-integrity-and-safety-2027-summer-at-tiktok-4448292103",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464419981",
      title: "2027 Future Talent Program \u2013 Discovery Oncology \u2013 Intern (South San Francisco, CA)",
      company: "Merck",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-future-talent-program-%E2%80%93-discovery-oncology-%E2%80%93-intern-south-san-francisco-ca-at-merck-4464419981",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490529821",
      title: "Community Intern",
      company: "MeshyAI",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/community-intern-at-meshyai-4490529821",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4447343085",
      title: "Effect Design Intern (TikTok-Design) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/effect-design-intern-tiktok-design-2027-summer-at-tiktok-4447343085",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4443165435",
      title: "Data Scientist Project Intern (TikTok Integrity and Safety) - 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-project-intern-tiktok-integrity-and-safety-2026-start-at-tiktok-4443165435",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4387327666",
      title: "(General Hire) Designer Project Intern (TikTok-Design) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/general-hire-designer-project-intern-tiktok-design-2026-start-bs-ms-at-tiktok-4387327666",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484692916",
      title: "Summer 2027 Technical Project/Program Management Intern- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-technical-project-program-management-intern-master-s-santa-clara-ca-at-applied-materials-4484692916",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464901470",
      title: "Product Design Intern",
      company: "Coinbase",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-at-coinbase-4464901470",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454482548",
      title: "MBA Intern",
      company: "Republic Services",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/mba-intern-at-republic-services-4454482548",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473545709",
      title: "Summer 2027: MBA Product Marketing Intern, Payments",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-mba-product-marketing-intern-payments-at-intuit-4473545709",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488574700",
      title: "MBA Intern, Platform Strategy (Summer 2027)",
      company: "Electronic Arts (EA)",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/mba-intern-platform-strategy-summer-2027-at-electronic-arts-ea-4488574700",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490538084",
      title: "Marketing & Content Intern (Part-Time)",
      company: "Kinelo",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-content-intern-part-time-at-kinelo-4490538084",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489066326",
      title: "Growth Marketing Intern, Sixtyfour",
      company: "Sixtyfour",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/growth-marketing-intern-sixtyfour-at-sixtyfour-4489066326",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4426560529",
      title: "Applied Research Intern, Proactive Intelligence & Customer World Models (PhD / Graduate Co-op)",
      company: "Block",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/applied-research-intern-proactive-intelligence-customer-world-models-phd-graduate-co-op-at-block-4426560529",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473551597",
      title: "Summer 2027: MBA Pricing & Monetization Strategy Intern",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-mba-pricing-monetization-strategy-intern-at-intuit-4473551597",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4440202281",
      title: "Leave of Absence Analyst Project Intern (HROP) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/leave-of-absence-analyst-project-intern-hrop-2026-start-bs-ms-at-tiktok-4440202281",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4409698724",
      title: "Global Agency Acquisition Project Intern (Scaled Growth) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/global-agency-acquisition-project-intern-scaled-growth-2026-start-bs-ms-at-tiktok-4409698724",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471723462",
      title: "Payment Partnership Project Intern (Global Payment) - 2026 Start (BS/MS)",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/payment-partnership-project-intern-global-payment-2026-start-bs-ms-at-bytedance-4471723462",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481174366",
      title: "PhD Research Intern, AI for Climate and Weather Simulation - 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/phd-research-intern-ai-for-climate-and-weather-simulation-2027-at-nvidia-4481174366",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490300141",
      title: "Experience Design Intern (Summer 2027)",
      company: "HP IQ",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/experience-design-intern-summer-2027-at-hp-iq-4490300141",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488248814",
      title: "Insights Analyst Intern, League of Legends - Summer 2027",
      company: "Riot Games",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/insights-analyst-intern-league-of-legends-summer-2027-at-riot-games-4488248814",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480756565",
      title: "Software Engineer Intern - Summer 2027",
      company: "Siemens",
      location: "Raleigh, NC",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-siemens-4480756565",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489987323",
      title: "Investment Intern - 2027 Spring Internship",
      company: "Globe Life",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/investment-intern-2027-spring-internship-at-globe-life-4489987323",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478192839",
      title: "Corporate Strategy Intern",
      company: "Arcesium",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/corporate-strategy-intern-at-arcesium-4478192839",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489644201",
      title: "Software Engineering Intern - Summer 2027",
      company: "Addepar",
      location: "New York City Metropolitan Area",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-summer-2027-at-addepar-4489644201",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480769028",
      title: "Production Operations (ProdOps) Intern - Summer 2027",
      company: "Siemens",
      location: "Raleigh, NC",
      url: "https://www.linkedin.com/jobs/view/production-operations-prodops-intern-summer-2027-at-siemens-4480769028",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4443723893",
      title: "Brand Campaign Project Intern (TikTok Shop - US Operation) - 2026 Start",
      company: "TikTok",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/brand-campaign-project-intern-tiktok-shop-us-operation-2026-start-at-tiktok-4443723893",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481768400",
      title: "Summer 2027 - Marketing Communications Intern",
      company: "Kenworth Truck Co.",
      location: "Kirkland, WA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-marketing-communications-intern-at-kenworth-truck-co-4481768400",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473041824",
      title: "Marketing Communications Intern",
      company: "Ingredion Incorporated",
      location: "Westchester, IL",
      url: "https://www.linkedin.com/jobs/view/marketing-communications-intern-at-ingredion-incorporated-4473041824",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488258386",
      title: "2027 Summer Intern: Business Analyst Intern RC&S",
      company: "UL Solutions",
      location: "Northbrook, IL",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-business-analyst-intern-rc-s-at-ul-solutions-4488258386",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470897619",
      title: "2027 Summer Intern: Marketing Intern",
      company: "UL Solutions",
      location: "Northbrook, IL",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-marketing-intern-at-ul-solutions-4470897619",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462576102",
      title: "Software Engineer Intern",
      company: "Cboe Global Markets",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-cboe-global-markets-4462576102",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4407666559",
      title: "Travel Demand Modeling Intern - Traffic & Planning",
      company: "DCCM",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/travel-demand-modeling-intern-traffic-planning-at-dccm-4407666559",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490029956",
      title: "Product Marketing Co-Op",
      company: "IANS",
      location: "Boston, MA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-co-op-at-ians-4490029956",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490049163",
      title: "Software Engineering Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internships-%E2%80%93-summer-2027-at-nbcuniversal-4490049163",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480720548",
      title: "Ratings Analytical Intern",
      company: "S&P Global",
      location: "Boulder, CO",
      url: "https://www.linkedin.com/jobs/view/ratings-analytical-intern-at-s-p-global-4480720548",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473598040",
      title: "Business Intelligence Intern",
      company: "Ibotta",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-intern-at-ibotta-4473598040",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4437967967",
      title: "Category User Growth Project Intern (TikTok Shop - US Operation) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/category-user-growth-project-intern-tiktok-shop-us-operation-2026-start-bs-ms-at-tiktok-4437967967",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480737389",
      title: "Research Intern",
      company: "FleishmanHillard",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/research-intern-at-fleishmanhillard-4480737389",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481797579",
      title: "Marketing Intern",
      company: "Mativ",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-mativ-4481797579",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4449965605",
      title: "Software Engineer Intern (Media Engine) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-media-engine-2027-summer-at-tiktok-4449965605",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4343679484",
      title: "Software Engineer Project Intern (Lead Ads) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-project-intern-lead-ads-2026-start-bs-ms-at-tiktok-4343679484",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480729402",
      title: "Security Research, Intern",
      company: "Illumio",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/security-research-intern-at-illumio-4480729402",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489652039",
      title: "Internship- Configuration Management",
      company: "ASML",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/internship-configuration-management-at-asml-4489652039",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480709263",
      title: "Security Intern",
      company: "Docusign",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/security-intern-at-docusign-4480709263",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482049330",
      title: "Mechanical Engineer Intern, Autonomy (Summer 2027)",
      company: "Joby Aviation",
      location: "San Carlos, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-intern-autonomy-summer-2027-at-joby-aviation-4482049330",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488659631",
      title: "Financial Analyst Intern, Hardware FP&A - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/financial-analyst-intern-hardware-fp-a-summer-2027-at-nvidia-4488659631",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4440207036",
      title: "Payroll Analyst Project Intern (HROP) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/payroll-analyst-project-intern-hrop-2026-start-bs-ms-at-tiktok-4440207036",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489054308",
      title: "Supply Chain Internship - Summer 2027",
      company: "Lightmatter",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/supply-chain-internship-summer-2027-at-lightmatter-4489054308",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455774428",
      title: "Global Supply Management Intern (Summer 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/global-supply-management-intern-summer-2027-at-zipline-4455774428",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454257385",
      title: "Product Design Intern (Monetization Ads) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-monetization-ads-2027-summer-at-tiktok-4454257385",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4447341096",
      title: "Product Design Intern (TikTok-Design) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-tiktok-design-2027-summer-at-tiktok-4447341096",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490049362",
      title: "Future Product Innovation Research Intern, Human Computer Interaction",
      company: "Toyota Research Institute",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/future-product-innovation-research-intern-human-computer-interaction-at-toyota-research-institute-4490049362",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473761252",
      title: "Summer 2027: MBA Strategic Finance Intern, Consumer Group",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-mba-strategic-finance-intern-consumer-group-at-intuit-4473761252",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488639857",
      title: "Learning & Development Intern",
      company: "Patelco Credit Union",
      location: "Dublin, CA",
      url: "https://www.linkedin.com/jobs/view/learning-development-intern-at-patelco-credit-union-4488639857",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489904161",
      title: "Finance & Accounting Internship (BS, Summer 2027)",
      company: "Sandisk",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/finance-accounting-internship-bs-summer-2027-at-sandisk-4489904161",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463103534",
      title: "Finance Intern - Undergrad Summer 2027",
      company: "ServiceNow",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/finance-intern-undergrad-summer-2027-at-servicenow-4463103534",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482010674",
      title: "MBA Product Management Internship, Summer 2027",
      company: "GoFundMe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/mba-product-management-internship-summer-2027-at-gofundme-4482010674",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452370784",
      title: "Product Manager Intern (Signal and Identity Product) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-manager-intern-signal-and-identity-product-2027-summer-at-tiktok-4452370784",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490025911",
      title: "Research Intern",
      company: "Pramaana Labs",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/research-intern-at-pramaana-labs-4490025911",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481591230",
      title: "AI Autonomous Driving Verification & Validation Intern - Summer 2027 - Santa Clara, CA",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/ai-autonomous-driving-verification-validation-intern-summer-2027-santa-clara-ca-at-nissan-motor-corporation-4481591230",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452902145",
      title: "Design System Design Intern (Monetization Ads) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/design-system-design-intern-monetization-ads-2027-summer-at-tiktok-4452902145",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4453902176",
      title: "Content Design Intern (Monetization Ads) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/content-design-intern-monetization-ads-2027-summer-at-tiktok-4453902176",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488705620",
      title: "Undergraduate Intern-R&D -Oncology Research (Summer 2027)",
      company: "Amgen",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/undergraduate-intern-r-d-oncology-research-summer-2027-at-amgen-4488705620",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489939557",
      title: "GTM Intern \u2013 Developer Relations & Technical Content",
      company: "NeuroSpark AI",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/gtm-intern-%E2%80%93-developer-relations-technical-content-at-neurospark-ai-4489939557",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489910269",
      title: "Translational Sciences undergrad intern (Summer 2027)",
      company: "BioSpace",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/translational-sciences-undergrad-intern-summer-2027-at-biospace-4489910269",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4404425338",
      title: "Applied Scientist Intern - Business Integrity - Global Frontier Tech Recruitment Program - 2027 Start (PhD)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/applied-scientist-intern-business-integrity-global-frontier-tech-recruitment-program-2027-start-phd-at-tiktok-4404425338",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489038984",
      title: "Intern, Program Management Office (PMO)",
      company: "Ayar Labs",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-program-management-office-pmo-at-ayar-labs-4489038984",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4413673142",
      title: "CEGIU Demo Data Strategy Intern - OVIP",
      company: "Oracle",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/cegiu-demo-data-strategy-intern-ovip-at-oracle-4413673142",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489025097",
      title: "J-1 Culinary program with The Ritz-Carlton, Half Moon Bay",
      company: "Hospitaliti",
      location: "Half Moon Bay, CA",
      url: "https://www.linkedin.com/jobs/view/j-1-culinary-program-with-the-ritz-carlton-half-moon-bay-at-hospitaliti-4489025097",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489043854",
      title: "Intern, AI Automation - HR and Global Operations",
      company: "Ayar Labs",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-ai-automation-hr-and-global-operations-at-ayar-labs-4489043854",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452915627",
      title: "Data Science Intern (Advertisement Team) - 2027 Start (PhD)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-advertisement-team-2027-start-phd-at-tiktok-4452915627",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4400087232",
      title: "Talent Acquisition Project Intern (E-Commerce) - 2026 Summer (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-project-intern-e-commerce-2026-summer-bs-ms-at-tiktok-4400087232",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480265998",
      title: "Summer 2027: Data Analytics Intern",
      company: "Amplify",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/summer-2027-data-analytics-intern-at-amplify-4480265998",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478611532",
      title: "Supply Chain Optimization Intern",
      company: "Foot Locker",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/supply-chain-optimization-intern-at-foot-locker-4478611532",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488649231",
      title: "Data Analytics Intern",
      company: "Arista Networks",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/data-analytics-intern-at-arista-networks-4488649231",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487808964",
      title: "Business Analytics Intern",
      company: "Stealth Startup",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/business-analytics-intern-at-stealth-startup-4487808964",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480279517",
      title: "Summer 2027: AI Scientist Intern",
      company: "Amplify",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/summer-2027-ai-scientist-intern-at-amplify-4480279517",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480289027",
      title: "Summer 2027: Product Design Intern",
      company: "Amplify",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/summer-2027-product-design-intern-at-amplify-4480289027",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489424436",
      title: "Product Design Intern (USA)",
      company: "Pinterest",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-usa-at-pinterest-4489424436",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489498053",
      title: "UI/UX Design Intern",
      company: "DMS International",
      location: "Silver Spring, MD",
      url: "https://www.linkedin.com/jobs/view/ui-ux-design-intern-at-dms-international-4489498053",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489417661",
      title: "Product Design Intern (USA)",
      company: "Pinterest",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-usa-at-pinterest-4489417661",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480272826",
      title: "Summer 2027: Product Management Intern",
      company: "Amplify",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/summer-2027-product-management-intern-at-amplify-4480272826",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487845701",
      title: "Data Science Intern",
      company: "Enveda",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-at-enveda-4487845701",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481255972",
      title: "Social Media Intern",
      company: "David Yurman",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/social-media-intern-at-david-yurman-4481255972",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488608685",
      title: "AI Solutions Intern",
      company: "Judi Health",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/ai-solutions-intern-at-judi-health-4488608685",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488302682",
      title: "INTERN",
      company: "Four Hundred",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/intern-at-four-hundred-4488302682",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481257526",
      title: "Summer Internship - Digital Marketing",
      company: "PACCAR Parts",
      location: "Renton, WA",
      url: "https://www.linkedin.com/jobs/view/summer-internship-digital-marketing-at-paccar-parts-4481257526",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459992638",
      title: "Cloud Developer Intern - Storage - Austin, TX - 2027",
      company: "IBM",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/cloud-developer-intern-storage-austin-tx-2027-at-ibm-4459992638",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471230594",
      title: "Customer Experience & Operations Intern - Summer 2027",
      company: "Electronic Arts (EA)",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/customer-experience-operations-intern-summer-2027-at-electronic-arts-ea-4471230594",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481289565",
      title: "Intern - Localization Systems Analyst",
      company: "Nintendo",
      location: "Redmond, WA",
      url: "https://www.linkedin.com/jobs/view/intern-localization-systems-analyst-at-nintendo-4481289565",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489937510",
      title: "Business Analyst Intern - Summer 2027",
      company: "ACCA Careers",
      location: "Bellevue, WA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-intern-summer-2027-at-acca-careers-4489937510",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489411516",
      title: "Application Development Intern",
      company: "MonoSol, A Kuraray Company",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/application-development-intern-at-monosol-a-kuraray-company-4489411516",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481245726",
      title: "Intern - Corporate Sustainability",
      company: "Akamai Technologies",
      location: "Cambridge, MA",
      url: "https://www.linkedin.com/jobs/view/intern-corporate-sustainability-at-akamai-technologies-4481245726",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488393995",
      title: "Software Engineer, Internship - Connectivity Platform and Product",
      company: "Palantir Technologies",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/software-engineer-internship-connectivity-platform-and-product-at-palantir-technologies-4488393995",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481523142",
      title: "Global Marketing Intern",
      company: "Prologis",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/global-marketing-intern-at-prologis-4481523142",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481246231",
      title: "Vehicle Software Engineer - Summer Internship 2027",
      company: "Inversion",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/vehicle-software-engineer-summer-internship-2027-at-inversion-4481246231",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488477536",
      title: "Summer Internship, Data Analytics",
      company: "Kestra Financial",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/summer-internship-data-analytics-at-kestra-financial-4488477536",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487835631",
      title: "Network Planning & Data Analytics Intern",
      company: "AstraZeneca",
      location: "California, MD",
      url: "https://www.linkedin.com/jobs/view/network-planning-data-analytics-intern-at-astrazeneca-4487835631",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480410143",
      title: "2027 Summer Intern - Growth Marketing",
      company: "Papa Johns",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-growth-marketing-at-papa-johns-4480410143",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488605137",
      title: "Intern, Analytics",
      company: "Weber Shandwick",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/intern-analytics-at-weber-shandwick-4488605137",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489185656",
      title: "Internship- Co-Op: AI Engineer",
      company: "ASML",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/internship-co-op-ai-engineer-at-asml-4489185656",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480295707",
      title: "2027 Summer Intern - Revenue Management",
      company: "Papa Johns",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-revenue-management-at-papa-johns-4480295707",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471394790",
      title: "Data and AI Intern - Flexible",
      company: "Acuity",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/data-and-ai-intern-flexible-at-acuity-4471394790",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489198107",
      title: "Internship-Co-Op: AI Engineer",
      company: "ASML",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/internship-co-op-ai-engineer-at-asml-4489198107",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480295835",
      title: "Software Engineering Intern - Summer 2027",
      company: "Patreon",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-summer-2027-at-patreon-4480295835",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481294842",
      title: "Electrical Engineer - Intern (Summer 2027)",
      company: "Joby Aviation",
      location: "San Carlos, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-intern-summer-2027-at-joby-aviation-4481294842",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487434655",
      title: "Business Undergraduate Intern - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/business-undergraduate-intern-summer-2027-at-lawrence-livermore-national-laboratory-4487434655",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487431697",
      title: "Intern",
      company: "Rambus",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-at-rambus-4487431697",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454218980",
      title: "Tax Summer Internship 2027",
      company: "Withum",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/tax-summer-internship-2027-at-withum-4454218980",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454233932",
      title: "Audit Summer Internship 2027",
      company: "Withum",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/audit-summer-internship-2027-at-withum-4454233932",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492089688",
      title: "HR Intern - Mandarin Required",
      company: "Think Academy U.S",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/hr-intern-mandarin-required-at-think-academy-u-s-4492089688",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480410020",
      title: "Product Manager MBA Intern, Enterprise AI - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/product-manager-mba-intern-enterprise-ai-summer-2027-at-nvidia-4480410020",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478295997",
      title: "Product Management Intern (Summer 2027)",
      company: "Databricks",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-management-intern-summer-2027-at-databricks-4478295997",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478299793",
      title: "Product Management Intern (Summer 2027)",
      company: "Databricks",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/product-management-intern-summer-2027-at-databricks-4478299793",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4464422961",
      title: "2027 Future Talent Program - Discovery Chemistry & Process Research - Intern",
      company: "Merck",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-future-talent-program-discovery-chemistry-process-research-intern-at-merck-4464422961",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489199590",
      title: "MENTAL HEALTH INTERN",
      company: "Axis Community Health",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/mental-health-intern-at-axis-community-health-4489199590",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489432181",
      title: "Undergraduate Intern-R&D -Oncology Research (Summer 2027)",
      company: "BioSpace",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/undergraduate-intern-r-d-oncology-research-summer-2027-at-biospace-4489432181",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480281463",
      title: "2027 Summer Intern, PhD, Research, Behavior Post-training",
      company: "Waymo",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-phd-research-behavior-post-training-at-waymo-4480281463",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489606234",
      title: "Summer 2027 Intern - AI Research Incubator",
      company: "Salesforce",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-ai-research-incubator-at-salesforce-4489606234",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478618078",
      title: "Product Design Intern (2027 Start)",
      company: "Databricks",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-2027-start-at-databricks-4478618078",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487833776",
      title: "Intern - Optics Customer Success",
      company: "Keysight Technologies",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/intern-optics-customer-success-at-keysight-technologies-4487833776",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487824631",
      title: "Summer 2027 Intern - Software Engineering",
      company: "WD",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-software-engineering-at-wd-4487824631",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487920962",
      title: "Logistics Data Analyst Intern (Remote Friendly)",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/logistics-data-analyst-intern-remote-friendly-at-webstaurantstore-4487920962",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487932182",
      title: "UX Product Design Intern",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/ux-product-design-intern-at-webstaurantstore-4487932182",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489103781",
      title: "Advertising & Partnerships: Ad Products Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/advertising-partnerships-ad-products-internships-%E2%80%93-summer-2027-at-nbcuniversal-4489103781",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487961728",
      title: "Talent Acquisition Operations Intern - Spring 2027",
      company: "Thrivent",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-operations-intern-spring-2027-at-thrivent-4487961728",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487686750",
      title: "2027 Intern - Software Engineer",
      company: "Adobe",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/2027-intern-software-engineer-at-adobe-4487686750",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488897556",
      title: "Finance Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/finance-internships-%E2%80%93-summer-2027-at-nbcuniversal-4488897556",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488798900",
      title: "Paid Summer Internship | Portfolio Management, Real Estate",
      company: "LIHTC Leaders",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/paid-summer-internship-portfolio-management-real-estate-at-lihtc-leaders-4488798900",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488885867",
      title: "Robotics Intern, Teleoperation and Spatial Computing",
      company: "Toyota Research Institute",
      location: "Cambridge, MA",
      url: "https://www.linkedin.com/jobs/view/robotics-intern-teleoperation-and-spatial-computing-at-toyota-research-institute-4488885867",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487119898",
      title: "Summer 2027 Intern Program: Data, Analytics & Technology - Waltham, MA",
      company: "National Grid",
      location: "Waltham, MA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-program-data-analytics-technology-waltham-ma-at-national-grid-4487119898",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488888389",
      title: "Media Tech: Data, AI & Machine Learning Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/media-tech-data-ai-machine-learning-internships-%E2%80%93-summer-2027-at-nbcuniversal-4488888389",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488883443",
      title: "Studio Operations, Data Analytics Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/studio-operations-data-analytics-internships-%E2%80%93-summer-2027-at-nbcuniversal-4488883443",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489104168",
      title: "Software Development & AI Internship (Undergrad/Graduate)",
      company: "Biodesix, Inc.",
      location: "Louisville, CO",
      url: "https://www.linkedin.com/jobs/view/software-development-ai-internship-undergrad-graduate-at-biodesix-inc-4489104168",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487320329",
      title: "2027 Summer Internship - Revenue Intelligence",
      company: "Vizient",
      location: "Centennial, CO",
      url: "https://www.linkedin.com/jobs/view/2027-summer-internship-revenue-intelligence-at-vizient-4487320329",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488832987",
      title: "Marketing Intern",
      company: "DUAL North America",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-dual-north-america-4488832987",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489109068",
      title: "Data Analytics & Business Intelligence Internship (Undergrad/Graduate)",
      company: "Biodesix, Inc.",
      location: "Louisville, CO",
      url: "https://www.linkedin.com/jobs/view/data-analytics-business-intelligence-internship-undergrad-graduate-at-biodesix-inc-4489109068",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487958533",
      title: "Social Media Marketing Intern",
      company: "Komodo",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/social-media-marketing-intern-at-komodo-4487958533",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488876325",
      title: "Universal Television Entertainment Finance Transformation Internships \u2013 Summer 2027",
      company: "NBCUniversal",
      location: "Universal City, CA",
      url: "https://www.linkedin.com/jobs/view/universal-television-entertainment-finance-transformation-internships-%E2%80%93-summer-2027-at-nbcuniversal-4488876325",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487975542",
      title: "Pricing Development Intern",
      company: "Sompo",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/pricing-development-intern-at-sompo-4487975542",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480910192",
      title: "Underwriting Internship (Financial Lines)",
      company: "MSIG",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/underwriting-internship-financial-lines-at-msig-4480910192",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4453797194",
      title: "Mechanical Engineer Intern (Spring 2027)",
      company: "Astranis Space Technologies",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-intern-spring-2027-at-astranis-space-technologies-4453797194",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487917956",
      title: "Engineering Intern Level 2",
      company: "San Francisco Municipal Transportation Agency (SFMTA)",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/engineering-intern-level-2-at-san-francisco-municipal-transportation-agency-sfmta-4487917956",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487937258",
      title: "Engineer Intern",
      company: "San Francisco Municipal Transportation Agency (SFMTA)",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/engineer-intern-at-san-francisco-municipal-transportation-agency-sfmta-4487937258",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487973677",
      title: "Internship, Mechanical Engineering (Summer 2027)",
      company: "Pivotal",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-mechanical-engineering-summer-2027-at-pivotal-4487973677",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483264622",
      title: "Development Engineering Intern (Spring 2027)",
      company: "First Solar",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/development-engineering-intern-spring-2027-at-first-solar-4483264622",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486468371",
      title: "Mid-Level Supervisor Intern - Menlo Park",
      company: "Center for Social Dynamics",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/mid-level-supervisor-intern-menlo-park-at-center-for-social-dynamics-4486468371",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487933246",
      title: "Planning Intern",
      company: "San Francisco Municipal Transportation Agency (SFMTA)",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/planning-intern-at-san-francisco-municipal-transportation-agency-sfmta-4487933246",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467595653",
      title: "2027 Summer Intern, MS/PhD, Conflict Behavior",
      company: "Waymo",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-ms-phd-conflict-behavior-at-waymo-4467595653",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489140894",
      title: "2027 Summer Intern - In Vitro Safety & Neurotoxicology",
      company: "Genentech",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-in-vitro-safety-neurotoxicology-at-genentech-4489140894",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487937528",
      title: "Planning Intern",
      company: "San Francisco Municipal Transportation Agency (SFMTA)",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/planning-intern-at-san-francisco-municipal-transportation-agency-sfmta-4487937528",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486462665",
      title: "Mid-Level Supervisor Intern ABA - South Bay",
      company: "Center for Social Dynamics",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/mid-level-supervisor-intern-aba-south-bay-at-center-for-social-dynamics-4486462665",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487656712",
      title: "Electrical Engineering Intern, Test and Characterization",
      company: "RadianX",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineering-intern-test-and-characterization-at-radianx-4487656712",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4451268814",
      title: "Delivery Consultant Intern - Entry Level Sales Program 2027",
      company: "IBM",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/delivery-consultant-intern-entry-level-sales-program-2027-at-ibm-4451268814",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472091649",
      title: "Relationship Marketing Intern",
      company: "LogRocket",
      location: "Boston, MA",
      url: "https://www.linkedin.com/jobs/view/relationship-marketing-intern-at-logrocket-4472091649",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4451280756",
      title: "Delivery Consultant Intern - Entry Level Sales Program 2027",
      company: "IBM",
      location: "Research Park, CA",
      url: "https://www.linkedin.com/jobs/view/delivery-consultant-intern-entry-level-sales-program-2027-at-ibm-4451280756",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470186728",
      title: "Machine Learning Intern (Masters) - Summer 2027",
      company: "DoorDash",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-intern-masters-summer-2027-at-doordash-4470186728",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454090252",
      title: "Field Engineer Intern",
      company: "FlatironDragados",
      location: "Morgan Hill, CA",
      url: "https://www.linkedin.com/jobs/view/field-engineer-intern-at-flatirondragados-4454090252",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4451270846",
      title: "Delivery Consultant Intern - Entry Level Sales Program 2027",
      company: "IBM",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/delivery-consultant-intern-entry-level-sales-program-2027-at-ibm-4451270846",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4435517024",
      title: "Internship Opportunities for All Telecare Locations! FY27",
      company: "Telecare Corporation",
      location: "Alameda, CA",
      url: "https://www.linkedin.com/jobs/view/internship-opportunities-for-all-telecare-locations%21-fy27-at-telecare-corporation-4435517024",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486674532",
      title: "Battery Algorithms Engineering Intern",
      company: "Meta",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/battery-algorithms-engineering-intern-at-meta-4486674532",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488747950",
      title: "Global Talent Sourcing Intern",
      company: "Tencent",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/global-talent-sourcing-intern-at-tencent-4488747950",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479659558",
      title: "Intern Managed Care Analytics",
      company: "Ascension",
      location: "St Louis, MO",
      url: "https://www.linkedin.com/jobs/view/intern-managed-care-analytics-at-ascension-4479659558",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463338673",
      title: "Software Development Engineer Intern/Co-Op, ROBOTICS - 2027",
      company: "Amazon",
      location: "Bellevue, WA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-intern-co-op-robotics-2027-at-amazon-4463338673",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461378862",
      title: "Global Marketing Intern (Events & Content Small Scale)",
      company: "Shure",
      location: "Niles, IL",
      url: "https://www.linkedin.com/jobs/view/global-marketing-intern-events-content-small-scale-at-shure-4461378862",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480384767",
      title: "Business Intelligence Intern",
      company: "Wellness Pet Company",
      location: "Burlington, MA",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-intern-at-wellness-pet-company-4480384767",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488704970",
      title: "2027 Summer Intern - Digital Media",
      company: "Charles River Laboratories",
      location: "Wilmington, MA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-digital-media-at-charles-river-laboratories-4488704970",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479643090",
      title: "Strategy Intern",
      company: "Epsilon",
      location: "Westminster, CO",
      url: "https://www.linkedin.com/jobs/view/strategy-intern-at-epsilon-4479643090",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488493166",
      title: "Business Analytics & Strategy Intern",
      company: "Johns Manville",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/business-analytics-strategy-intern-at-johns-manville-4488493166",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488480772",
      title: "Safety Reporting Intern [Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/safety-reporting-intern-summer-2027-at-zoox-4488480772",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488472217",
      title: "Internship, Data Analyst, People Products (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-data-analyst-people-products-winter-spring-2027-at-tesla-4488472217",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470192577",
      title: "Machine Learning Intern (Masters) - Summer 2027",
      company: "DoorDash",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-intern-masters-summer-2027-at-doordash-4470192577",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461987035",
      title: "Project Engineer Intern",
      company: "Swinerton",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/project-engineer-intern-at-swinerton-4461987035",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461906283",
      title: "Civil Engineering Intern",
      company: "Kimley-Horn",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/civil-engineering-intern-at-kimley-horn-4461906283",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462494158",
      title: "Site Design Engineering Intern",
      company: "Westwood Professional Services",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/site-design-engineering-intern-at-westwood-professional-services-4462494158",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471678825",
      title: "Security Engineer Intern, 2027 Summer U.S.",
      company: "Atlassian",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/security-engineer-intern-2027-summer-u-s-at-atlassian-4471678825",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479647314",
      title: "Product Marketing Management MBA Intern - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-management-mba-intern-summer-2027-at-nvidia-4479647314",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460733320",
      title: "Human Resource Intern",
      company: "KLA",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/human-resource-intern-at-kla-4460733320",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488498055",
      title: "Process Improvement Intern [ Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/process-improvement-intern-summer-2027-at-zoox-4488498055",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461670407",
      title: "Payroll Tax Project Intern(HROP)- 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/payroll-tax-project-intern-hrop-2026-start-at-tiktok-4461670407",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488464613",
      title: "Marketing Events Intern",
      company: "Intuitive",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-events-intern-at-intuitive-4488464613",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479639559",
      title: "Engineering Intern - Technical Program Management (Spring 2027 Co-op)",
      company: "Rivian",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/engineering-intern-technical-program-management-spring-2027-co-op-at-rivian-4479639559",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488466393",
      title: "UX Quantitative Research Intern (USA)",
      company: "Pinterest",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/ux-quantitative-research-intern-usa-at-pinterest-4488466393",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4413672129",
      title: "CEGIU Demo Data Strategy Intern - OVIP",
      company: "Oracle",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/cegiu-demo-data-strategy-intern-ovip-at-oracle-4413672129",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472092328",
      title: "Cloud Media Services Intern",
      company: "Tencent",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/cloud-media-services-intern-at-tencent-4472092328",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479660701",
      title: "Search Safety & Operations Project Intern\uFF08TikTok-Platform Responsibility-Search\uFF09- 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/search-safety-operations-project-intern%EF%BC%88tiktok-platform-responsibility-search%EF%BC%89-2026-start-at-tiktok-4479660701",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488490634",
      title: "Strategy Intern",
      company: "HP",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/strategy-intern-at-hp-4488490634",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487371767",
      title: "Marketing Generalist Internship",
      company: "Campfire",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-generalist-internship-at-campfire-4487371767",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461143168",
      title: "Public Service Aide - Associate to Professionals - SFPUC Internship, 2026 (9922)",
      company: "San Francisco Public Utilities Commission",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/public-service-aide-associate-to-professionals-sfpuc-internship-2026-9922-at-san-francisco-public-utilities-commission-4461143168",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488701137",
      title: "San Francisco Municipal Transportation Agency Student Intern Program, Summer 2027 \u2013 5380 Planning Intern (Level 1)",
      company: "City and County of San Francisco",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/san-francisco-municipal-transportation-agency-student-intern-program-summer-2027-%E2%80%93-5380-planning-intern-level-1-at-city-and-county-of-san-francisco-4488701137",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488492688",
      title: "San Francisco Municipal Transportation Agency Student Intern Program, Summer 2027 \u2013 5381 Planning Intern (Level 2)",
      company: "City and County of San Francisco",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/san-francisco-municipal-transportation-agency-student-intern-program-summer-2027-%E2%80%93-5381-planning-intern-level-2-at-city-and-county-of-san-francisco-4488492688",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480599985",
      title: "Engineering Technical Sales Intern",
      company: "Ecolab",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/engineering-technical-sales-intern-at-ecolab-4480599985",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487305959",
      title: "Strategic Decision Support Summer Intern",
      company: "Penn Medicine, University of Pennsylvania Health System",
      location: "Philadelphia, PA",
      url: "https://www.linkedin.com/jobs/view/strategic-decision-support-summer-intern-at-penn-medicine-university-of-pennsylvania-health-system-4487305959",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488069423",
      title: "ServiceNow Business Systems Analyst Intern (Undergraduate Summer 2027)",
      company: "Centene Corporation",
      location: "Missouri, United States",
      url: "https://www.linkedin.com/jobs/view/servicenow-business-systems-analyst-intern-undergraduate-summer-2027-at-centene-corporation-4488069423",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462718150",
      title: "Graduate Student Intern - Space Remote Sensing and Data Science",
      company: "Los Alamos National Laboratory",
      location: "Los Alamos, NM",
      url: "https://www.linkedin.com/jobs/view/graduate-student-intern-space-remote-sensing-and-data-science-at-los-alamos-national-laboratory-4462718150",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477327358",
      title: "Product Management Intern, Aftermarket Parts",
      company: "Hillphoenix",
      location: "Conyers, GA",
      url: "https://www.linkedin.com/jobs/view/product-management-intern-aftermarket-parts-at-hillphoenix-4477327358",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487356492",
      title: "Intern, Editorial (Summer 2027)",
      company: "Southern Poverty Law Center",
      location: "Jackson, MS",
      url: "https://www.linkedin.com/jobs/view/intern-editorial-summer-2027-at-southern-poverty-law-center-4487356492",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487354531",
      title: "Intern, Editorial (Summer 2027)",
      company: "Southern Poverty Law Center",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/intern-editorial-summer-2027-at-southern-poverty-law-center-4487354531",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471188458",
      title: "Data Scientist Intern, 2027 Summer U.S.",
      company: "Atlassian",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-intern-2027-summer-u-s-at-atlassian-4471188458",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488169739",
      title: "Technology Summer Fintern",
      company: "Apex Fintech Solutions",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/technology-summer-fintern-at-apex-fintech-solutions-4488169739",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488438493",
      title: "AI Content Creator Intern \u2013 Generative AI & Digital Media",
      company: "MIRA Safety",
      location: "Cedar Park, TX",
      url: "https://www.linkedin.com/jobs/view/ai-content-creator-intern-%E2%80%93-generative-ai-digital-media-at-mira-safety-4488438493",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486288402",
      title: "Business and Technology Intern: Live and VIP Product",
      company: "Electronic Arts (EA)",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/business-and-technology-intern-live-and-vip-product-at-electronic-arts-ea-4486288402",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479723095",
      title: "Amplify Marketing Specialist I (Intern) - United States",
      company: "Cisco",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/amplify-marketing-specialist-i-intern-united-states-at-cisco-4479723095",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487362091",
      title: "2027 Summer Analyst Intern, Valuations & Opinions Group",
      company: "Lincoln International",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-summer-analyst-intern-valuations-opinions-group-at-lincoln-international-4487362091",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461395376",
      title: "Global Marketing Intern \u2013 ShureCloud & Customer Value Streams",
      company: "Shure",
      location: "Niles, IL",
      url: "https://www.linkedin.com/jobs/view/global-marketing-intern-%E2%80%93-shurecloud-customer-value-streams-at-shure-4461395376",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470054970",
      title: "Marketing Intern",
      company: "Shorr Packaging Corp.",
      location: "Aurora, IL",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-shorr-packaging-corp-4470054970",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462429656",
      title: "Agile Software Intern",
      company: "Jacobs",
      location: "Nashua, NH",
      url: "https://www.linkedin.com/jobs/view/agile-software-intern-at-jacobs-4462429656",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477318749",
      title: "2027 Summer Internship - Finance",
      company: "Q2",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/2027-summer-internship-finance-at-q2-4477318749",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461388762",
      title: "Cloud Software Engineering Intern",
      company: "Shure",
      location: "Niles, IL",
      url: "https://www.linkedin.com/jobs/view/cloud-software-engineering-intern-at-shure-4461388762",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466571944",
      title: "2027 Summer Intern, MBA, Salesforce Product Owner",
      company: "Waymo",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-mba-salesforce-product-owner-at-waymo-4466571944",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488082918",
      title: "Denver \u2013 Regional Affairs Economics, Internship \u2013 Summer 2027",
      company: "Federal Reserve Bank of Kansas City",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/denver-%E2%80%93-regional-affairs-economics-internship-%E2%80%93-summer-2027-at-federal-reserve-bank-of-kansas-city-4488082918",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486229858",
      title: "Investments Technology Research Intern",
      company: "Janus Henderson Investors",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/investments-technology-research-intern-at-janus-henderson-investors-4486229858",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488193102",
      title: "Software Engineering Internship - San Francisco",
      company: "Samsara",
      location: "Alexandria, VA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internship-san-francisco-at-samsara-4488193102",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460644806",
      title: "2027 Business Technology Advisory Consulting Intern",
      company: "Plante Moran",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/2027-business-technology-advisory-consulting-intern-at-plante-moran-4460644806",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486992627",
      title: "Product Marketing Intern",
      company: "Tinder",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-intern-at-tinder-4486992627",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486984762",
      title: "Social Marketing Intern",
      company: "Tinder",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/social-marketing-intern-at-tinder-4486984762",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488176800",
      title: "Software Engineering Internship - San Francisco",
      company: "Samsara",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internship-san-francisco-at-samsara-4488176800",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486986751",
      title: "Backend Engineer Intern",
      company: "Tinder",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/backend-engineer-intern-at-tinder-4486986751",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486903731",
      title: "2027 Summer Internship - Pharmacy Aggregation",
      company: "Vizient",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-internship-pharmacy-aggregation-at-vizient-4486903731",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487300422",
      title: "Android Engineer Intern",
      company: "Tinder",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/android-engineer-intern-at-tinder-4487300422",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487345866",
      title: "2027 Summer Analyst Intern, Valuations & Opinions Group",
      company: "Lincoln International",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-analyst-intern-valuations-opinions-group-at-lincoln-international-4487345866",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487315754",
      title: "Intern, Social & Influencer",
      company: "Weber Shandwick",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/intern-social-influencer-at-weber-shandwick-4487315754",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460424056",
      title: "Software Engineering Intern III, Summer 2027 (Onsite)",
      company: "BAE Systems, Inc.",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-iii-summer-2027-onsite-at-bae-systems-inc-4460424056",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486933894",
      title: "Software Engineer Intern, Autonomy Software [Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-autonomy-software-summer-2027-at-zoox-4486933894",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488152122",
      title: "Applied AI & Analytics Summer Intern",
      company: "Moody's Corporation",
      location: "Newark, CA",
      url: "https://www.linkedin.com/jobs/view/applied-ai-analytics-summer-intern-at-moody-s-corporation-4488152122",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479840391",
      title: "Machine Learning Research Intern - Spring 2027 - Santa Clara, CA",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-research-intern-spring-2027-santa-clara-ca-at-nissan-motor-corporation-4479840391",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486978923",
      title: "Machine Learning Engineer Intern",
      company: "Tinder",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-engineer-intern-at-tinder-4486978923",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479828836",
      title: "Machine Learning Research Perception Intern - Spring 2027 - Santa Clara, CA",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-research-perception-intern-spring-2027-santa-clara-ca-at-nissan-motor-corporation-4479828836",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486933893",
      title: "Software Engineer Intern, Software Systems [Summer 2027]",
      company: "Zoox",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-software-systems-summer-2027-at-zoox-4486933893",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488187296",
      title: "Software Engineering Internship - San Francisco",
      company: "Samsara",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internship-san-francisco-at-samsara-4488187296",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488191189",
      title: "Software Engineering Internship - San Francisco",
      company: "Samsara",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internship-san-francisco-at-samsara-4488191189",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486282566",
      title: "People Team Intern, HR Transformation (Winter 2027)",
      company: "Cloudflare",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/people-team-intern-hr-transformation-winter-2027-at-cloudflare-4486282566",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480318681",
      title: "Summer 2027: MBA Marketing Intern, Out-Market Investment Diagnostic (NTTF)",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-mba-marketing-intern-out-market-investment-diagnostic-nttf-at-intuit-4480318681",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479708633",
      title: "Amplify Marketing Specialist I (Intern) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/amplify-marketing-specialist-i-intern-united-states-at-cisco-4479708633",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452731013",
      title: "Global Talent Acquisition - San Francisco \uFF08Intern / Contract\uFF09",
      company: "Plaud",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/global-talent-acquisition-san-francisco-%EF%BC%88intern-contract%EF%BC%89-at-plaud-4452731013",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470029750",
      title: "Mission Applications Intern (Winter 2027)",
      company: "Astranis Space Technologies",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/mission-applications-intern-winter-2027-at-astranis-space-technologies-4470029750",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479115318",
      title: "Intern - Micron Ventures",
      company: "Micron Technology",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-micron-ventures-at-micron-technology-4479115318",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488190230",
      title: "Software Engineering Internship - San Francisco",
      company: "Samsara",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-internship-san-francisco-at-samsara-4488190230",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486962258",
      title: "Human Resources Intern - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-intern-summer-2027-at-nvidia-4486962258",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479304069",
      title: "Product Management MBA Intern, Laptop - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/product-management-mba-intern-laptop-summer-2027-at-nvidia-4479304069",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4450195097",
      title: "Product Manager Intern 2027",
      company: "IBM",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-manager-intern-2027-at-ibm-4450195097",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4435503870",
      title: "(SCHOOL GROUP ROTATIONS ONLY) Internship Opportunities for All Telecare Locations! FY27",
      company: "Telecare Corporation",
      location: "Alameda, CA",
      url: "https://www.linkedin.com/jobs/view/school-group-rotations-only-internship-opportunities-for-all-telecare-locations%21-fy27-at-telecare-corporation-4435503870",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486070713",
      title: "Legal Intern",
      company: "Travelers",
      location: "Walnut Creek, CA",
      url: "https://www.linkedin.com/jobs/view/legal-intern-at-travelers-4486070713",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488101679",
      title: "Product Design Intern",
      company: "Stripe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-intern-at-stripe-4488101679",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488422952",
      title: "UX Product Design Intern - Winter 2027",
      company: "Skydio",
      location: "San Mateo, CA",
      url: "https://www.linkedin.com/jobs/view/ux-product-design-intern-winter-2027-at-skydio-4488422952",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488114321",
      title: "Center for Global Security Research (CGSR) Undergraduate Research Associate - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/center-for-global-security-research-cgsr-undergraduate-research-associate-summer-2027-at-lawrence-livermore-national-laboratory-4488114321",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488176097",
      title: "Youth Lead Intern, 67 Sue\xF1os",
      company: "American Friends Service Committee",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/youth-lead-intern-67-sue%C3%B1os-at-american-friends-service-committee-4488176097",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469714450",
      title: "Technical Project Management Intern (Winter 2027)",
      company: "Astranis Space Technologies",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/technical-project-management-intern-winter-2027-at-astranis-space-technologies-4469714450",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470676017",
      title: "Business Systems Analyst Internship Summer 2027",
      company: "Motorola Solutions",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/business-systems-analyst-internship-summer-2027-at-motorola-solutions-4470676017",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470639008",
      title: "Customer Engagement Marketing Intern, 2027 Summer U.S.",
      company: "Atlassian",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/customer-engagement-marketing-intern-2027-summer-u-s-at-atlassian-4470639008",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461397116",
      title: "Strategic Student Program: Search Marketing Intern (CMMK, Spring 2027)",
      company: "Siemens Digital Industries Software",
      location: "St Louis, MO",
      url: "https://www.linkedin.com/jobs/view/strategic-student-program-search-marketing-intern-cmmk-spring-2027-at-siemens-digital-industries-software-4461397116",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486755535",
      title: "Marketing & Digital Media Intern, Luxury Travel Brand (Remote)",
      company: "Estes Energetics",
      location: "Garden City, NY",
      url: "https://www.linkedin.com/jobs/view/marketing-digital-media-intern-luxury-travel-brand-remote-at-estes-energetics-4486755535",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461387753",
      title: "User Experience Design (UX) Intern",
      company: "Shure",
      location: "Niles, IL",
      url: "https://www.linkedin.com/jobs/view/user-experience-design-ux-intern-at-shure-4461387753",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462156518",
      title: "Product Management Intern, 2027 Summer U.S.",
      company: "Atlassian",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-management-intern-2027-summer-u-s-at-atlassian-4462156518",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486758988",
      title: "2027 Summer Intern, Human Resources",
      company: "Zimmer Biomet",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-human-resources-at-zimmer-biomet-4486758988",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478484226",
      title: "Intern - Software Engineer",
      company: "LSEG",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/intern-software-engineer-at-lseg-4478484226",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469645276",
      title: "Software Engineering Intern, iOS",
      company: "Ramp",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-ios-at-ramp-4469645276",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487716446",
      title: "Software Internship Roles - HP Solutions (HPS)",
      company: "HP",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/software-internship-roles-hp-solutions-hps-at-hp-4487716446",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487708562",
      title: "Software Engineer Intern - Summer 2027",
      company: "PayPal",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-paypal-4487708562",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470991282",
      title: "C++ Software Intern",
      company: "Oceaneering",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/c%2B%2B-software-intern-at-oceaneering-4470991282",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487598915",
      title: "Mobile Engineer Intern - Summer 2027",
      company: "PayPal",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/mobile-engineer-intern-summer-2027-at-paypal-4487598915",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479556963",
      title: "Investment Management Internship",
      company: "Talcott Financial Group",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/investment-management-internship-at-talcott-financial-group-4479556963",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462050887",
      title: "Intern \u2013 Product Analyst, Digital Commerce (Hybrid: Onsite & Remote)",
      company: "US Foods",
      location: "Rosemont, IL",
      url: "https://www.linkedin.com/jobs/view/intern-%E2%80%93-product-analyst-digital-commerce-hybrid-onsite-remote-at-us-foods-4462050887",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487700838",
      title: "Mobile Engineer Intern - Summer 2027",
      company: "PayPal",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/mobile-engineer-intern-summer-2027-at-paypal-4487700838",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487712243",
      title: "Software Engineer Intern - Summer 2027",
      company: "PayPal",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-paypal-4487712243",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487278811",
      title: "Pharmacy Growth and Innovation Corporate Internship \u2013 Summer 2027 (Graduate)",
      company: "CVS Health",
      location: "Woonsocket, RI",
      url: "https://www.linkedin.com/jobs/view/pharmacy-growth-and-innovation-corporate-internship-%E2%80%93-summer-2027-graduate-at-cvs-health-4487278811",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476685031",
      title: "Project Controls & Business Systems Intern",
      company: "Loenbro",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/project-controls-business-systems-intern-at-loenbro-4476685031",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471169696",
      title: "University Intern, Disputes & Economics",
      company: "Ankura",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/university-intern-disputes-economics-at-ankura-4471169696",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473366513",
      title: "2027 Summer Internship (Technical)",
      company: "Palomar",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-internship-technical-at-palomar-4473366513",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487784382",
      title: "University, Digital Transformation Analyst - Summer Intern",
      company: "Booz Allen Hamilton",
      location: "Arlington, VA",
      url: "https://www.linkedin.com/jobs/view/university-digital-transformation-analyst-summer-intern-at-booz-allen-hamilton-4487784382",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487794003",
      title: "University, Digital Transformation Analyst - Spring Intern",
      company: "Booz Allen Hamilton",
      location: "Arlington, VA",
      url: "https://www.linkedin.com/jobs/view/university-digital-transformation-analyst-spring-intern-at-booz-allen-hamilton-4487794003",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469732167",
      title: "Supply Chain Intern, BS - Summer 2027",
      company: "Marvell Technology",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/supply-chain-intern-bs-summer-2027-at-marvell-technology-4469732167",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485844683",
      title: "Sales Data Analytics Intern",
      company: "CrowdStrike",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/sales-data-analytics-intern-at-crowdstrike-4485844683",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487701762",
      title: "Data Scientist Intern - Summer 2027",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-intern-summer-2027-at-paypal-4487701762",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487712250",
      title: "Machine Learning Engineer PhD Intern - Summer 2027",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-engineer-phd-intern-summer-2027-at-paypal-4487712250",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488030782",
      title: "Last Minute AI-Machine Learning Summer Internship (Gen AI - Multimodal)",
      company: "Eluvio",
      location: "Berkeley, CA",
      url: "https://www.linkedin.com/jobs/view/last-minute-ai-machine-learning-summer-internship-gen-ai-multimodal-at-eluvio-4488030782",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486577484",
      title: "VLSI Timing Methodology Intern - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/vlsi-timing-methodology-intern-summer-2027-at-nvidia-4486577484",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487715366",
      title: "Software Engineer Intern - Summer 2027",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-paypal-4487715366",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487720022",
      title: "Cybersecurity Intern - Summer 2027",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/cybersecurity-intern-summer-2027-at-paypal-4487720022",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479847210",
      title: "AV Mechanical Engineering Intern - Spring 2027 - Santa Clara, CA",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/av-mechanical-engineering-intern-spring-2027-santa-clara-ca-at-nissan-motor-corporation-4479847210",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479751004",
      title: "Marketing Intern",
      company: "Tencent",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-tencent-4479751004",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461266736",
      title: "Product Management Intern",
      company: "Blackhawk Network",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/product-management-intern-at-blackhawk-network-4461266736",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486338150",
      title: "Financial Analyst/Accounting Internship",
      company: "Sanmina",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/financial-analyst-accounting-internship-at-sanmina-4486338150",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479828833",
      title: "Battery Experimental Intern - Summer 2027 - Santa Clara, CA",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/battery-experimental-intern-summer-2027-santa-clara-ca-at-nissan-motor-corporation-4479828833",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488057315",
      title: "Electrolyte Research Intern",
      company: "Anthro Energy",
      location: "Alameda, CA",
      url: "https://www.linkedin.com/jobs/view/electrolyte-research-intern-at-anthro-energy-4488057315",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479840390",
      title: "Machine Learning Research Perception Intern - Spring 2027 - Santa Clara, CA",
      company: "Nissan Motor Corporation",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/machine-learning-research-perception-intern-spring-2027-santa-clara-ca-at-nissan-motor-corporation-4479840390",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469074413",
      title: "PhD Research Intern, Learning Embodied Skills from Human Data - 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/phd-research-intern-learning-embodied-skills-from-human-data-2027-at-nvidia-4469074413",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4277122877",
      title: "Product Designer Project Intern (TikTok-Design-UX) - 2026 Start (BS/MS)",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-designer-project-intern-tiktok-design-ux-2026-start-bs-ms-at-tiktok-4277122877",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466129533",
      title: "2027 Summer Intern, PhD, Safety Research, Human Behavior Analytics",
      company: "Waymo",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-phd-safety-research-human-behavior-analytics-at-waymo-4466129533",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488085193",
      title: "Student Intern (Unbenefited, Part-Time) - Council District 3 Office",
      company: "City of San Jos\xE9",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/student-intern-unbenefited-part-time-council-district-3-office-at-city-of-san-jos%C3%A9-4488085193",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469722323",
      title: "Technical Project Management Intern (Summer 2027)",
      company: "Astranis Space Technologies",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/technical-project-management-intern-summer-2027-at-astranis-space-technologies-4469722323",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479812243",
      title: "2027 1L Patent Litigation Summer Associate (JD Class 2029)",
      company: "Fish & Richardson P.C.",
      location: "Silicon Valley, CA",
      url: "https://www.linkedin.com/jobs/view/2027-1l-patent-litigation-summer-associate-jd-class-2029-at-fish-richardson-p-c-4479812243",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485581787",
      title: "Research Scientist Intern, GenAI Safety (PhD)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-scientist-intern-genai-safety-phd-at-meta-4485581787",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485581339",
      title: "Political Data Intern - Spring 2027",
      company: "WeVote",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/political-data-intern-spring-2027-at-wevote-4485581339",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488060588",
      title: "Sales & Operations Internship (Summer 2027)",
      company: "Sandisk",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/sales-operations-internship-summer-2027-at-sandisk-4488060588",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488023664",
      title: "NBC Sports Bay Area & California - Production Assistant Intern - Summer 2027",
      company: "NBCUniversal",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/nbc-sports-bay-area-california-production-assistant-intern-summer-2027-at-nbcuniversal-4488023664",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488029522",
      title: "NBC Sports Bay Area & California - Programming Intern - Summer 2027",
      company: "NBCUniversal",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/nbc-sports-bay-area-california-programming-intern-summer-2027-at-nbcuniversal-4488029522",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4453054370",
      title: "Strategic Engagements & Events Intern (Spring 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/strategic-engagements-events-intern-spring-2027-at-zipline-4453054370",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4453071236",
      title: "Strategic Engagements & Events Intern (Summer 2027)",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/strategic-engagements-events-intern-summer-2027-at-zipline-4453071236",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487599856",
      title: "Mobile Engineer Intern - Summer 2027",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/mobile-engineer-intern-summer-2027-at-paypal-4487599856",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479821093",
      title: "2027 1L Patent Litigation Summer Associate with 1L Fellowship (JD Class 2029)",
      company: "Fish & Richardson P.C.",
      location: "Silicon Valley, CA",
      url: "https://www.linkedin.com/jobs/view/2027-1l-patent-litigation-summer-associate-with-1l-fellowship-jd-class-2029-at-fish-richardson-p-c-4479821093",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462040559",
      title: "2027 Design Internship \u2013 San Francisco",
      company: "Williams-Sonoma, Inc.",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-design-internship-%E2%80%93-san-francisco-at-williams-sonoma-inc-4462040559",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485258308",
      title: "Clinical Leader Intern - Salinas",
      company: "Center for Social Dynamics",
      location: "Salinas, CA",
      url: "https://www.linkedin.com/jobs/view/clinical-leader-intern-salinas-at-center-for-social-dynamics-4485258308",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483883877",
      title: "Intern - Business Systems Analyst",
      company: "Blue Cross & Blue Shield of Rhode Island",
      location: "Providence, RI",
      url: "https://www.linkedin.com/jobs/view/intern-business-systems-analyst-at-blue-cross-blue-shield-of-rhode-island-4483883877",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468182726",
      title: "Applied Scientist Intern",
      company: "Upstart",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/applied-scientist-intern-at-upstart-4468182726",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459534189",
      title: "Quote to Cash Intern 2027",
      company: "IBM",
      location: "Armonk, NY",
      url: "https://www.linkedin.com/jobs/view/quote-to-cash-intern-2027-at-ibm-4459534189",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460202618",
      title: "Software Engineer Intern (Summer 2027)",
      company: "Whatnot",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-whatnot-4460202618",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461513360",
      title: "Cyber Security Intern - Summer 2027",
      company: "Honeywell Aerospace",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/cyber-security-intern-summer-2027-at-honeywell-aerospace-4461513360",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487231037",
      title: "Pharmacy Operations Internship (Remote) \u2013 Summer 2027 (Undergraduate)",
      company: "Molina Healthcare",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/pharmacy-operations-internship-remote-%E2%80%93-summer-2027-undergraduate-at-molina-healthcare-4487231037",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487282725",
      title: "Software Engineer, Teamwork Experiences Internship Opportunities",
      company: "Microsoft",
      location: "Redmond, WA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-teamwork-experiences-internship-opportunities-at-microsoft-4487282725",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487576021",
      title: "Software Product Management Intern",
      company: "HP",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/software-product-management-intern-at-hp-4487576021",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478185702",
      title: "Business Operations & Growth Intern",
      company: "Electric Power Engineers",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/business-operations-growth-intern-at-electric-power-engineers-4478185702",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469990592",
      title: "Marketing Communications Intern",
      company: "Emerson",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/marketing-communications-intern-at-emerson-4469990592",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487544907",
      title: "Data Management Intern",
      company: "Texas Department of Transportation",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/data-management-intern-at-texas-department-of-transportation-4487544907",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485075956",
      title: "BI and Reporting Intern",
      company: "Janus Henderson Investors",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/bi-and-reporting-intern-at-janus-henderson-investors-4485075956",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467688913",
      title: "Summer 2027: Brand Management Intern, MBA",
      company: "Danone",
      location: "Louisville, CO",
      url: "https://www.linkedin.com/jobs/view/summer-2027-brand-management-intern-mba-at-danone-4467688913",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460652621",
      title: "2027 Business Analytics Consulting Intern",
      company: "Plante Moran",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/2027-business-analytics-consulting-intern-at-plante-moran-4460652621",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487294350",
      title: "Trade Marketing Intern",
      company: "InComm Payments",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/trade-marketing-intern-at-incomm-payments-4487294350",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459251666",
      title: "Data Science - Intern (Summer 2027)",
      company: "C3 AI",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-summer-2027-at-c3-ai-4459251666",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460094745",
      title: "Software Engineer Intern (Summer 2027)",
      company: "Whatnot",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-whatnot-4460094745",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469410335",
      title: "2027 Summer Intern, PhD, Data Science",
      company: "Waymo",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-phd-data-science-at-waymo-4469410335",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482774592",
      title: "Business Systems Analyst Undergraduate Intern - 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/business-systems-analyst-undergraduate-intern-2027-at-lawrence-livermore-national-laboratory-4482774592",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4394638874",
      title: "DoW SkillBridge Internship",
      company: "Mott MacDonald",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/dow-skillbridge-internship-at-mott-macdonald-4394638874",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487211808",
      title: "Cybersecurity Graduate Intern - Cyber and Critical Infrastructure Summer Institute - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/cybersecurity-graduate-intern-cyber-and-critical-infrastructure-summer-institute-summer-2027-at-lawrence-livermore-national-laboratory-4487211808",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487217538",
      title: "Cybersecurity Undergraduate Intern - Cyber and Critical Infrastructure Summer Institute - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/cybersecurity-undergraduate-intern-cyber-and-critical-infrastructure-summer-institute-summer-2027-at-lawrence-livermore-national-laboratory-4487217538",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482775450",
      title: "Procurement Analyst Undergraduate Intern - 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/procurement-analyst-undergraduate-intern-2027-at-lawrence-livermore-national-laboratory-4482775450",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461543302",
      title: "2027 Inventory Management Internship - San Francisco",
      company: "Williams-Sonoma, Inc.",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-inventory-management-internship-san-francisco-at-williams-sonoma-inc-4461543302",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487084547",
      title: "Internship, Product Management, Megapack Services (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-product-management-megapack-services-winter-spring-2027-at-tesla-4487084547",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476601790",
      title: "PIC Process Integration Intern",
      company: "Nokia",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/pic-process-integration-intern-at-nokia-4476601790",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485045799",
      title: "Research Scientist Intern PhD, PAR Safety Evals and Red Teaming",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-scientist-intern-phd-par-safety-evals-and-red-teaming-at-meta-4485045799",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487751368",
      title: "MBA Intern - Growth Marketing & Content Strategy",
      company: "Tierra",
      location: "Stanford, CA",
      url: "https://www.linkedin.com/jobs/view/mba-intern-growth-marketing-content-strategy-at-tierra-4487751368",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4402895275",
      title: "SkillBridge Fellowship",
      company: "TurbineOne",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/skillbridge-fellowship-at-turbineone-4402895275",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487212607",
      title: "Critical Infrastructure Analysis Undergraduate Intern - Cyber and Critical Infrastructure Summer Institute - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/critical-infrastructure-analysis-undergraduate-intern-cyber-and-critical-infrastructure-summer-institute-summer-2027-at-lawrence-livermore-national-laboratory-4487212607",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478182403",
      title: "Enterprise Platform Technical Marketing Engineer Intern - Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/enterprise-platform-technical-marketing-engineer-intern-summer-2027-at-nvidia-4478182403",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486503862",
      title: "Strategic Social Media and Communications Intern",
      company: "Docusign",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/strategic-social-media-and-communications-intern-at-docusign-4486503862",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487524450",
      title: "Content Enablement Intern 2027 (USA)",
      company: "Pinterest",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/content-enablement-intern-2027-usa-at-pinterest-4487524450",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479085518",
      title: "Internal Communications Intern",
      company: "Prologis",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/internal-communications-intern-at-prologis-4479085518",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487544674",
      title: "Spring 2027 Central Pacific Regional Intern",
      company: "Anti-Defamation League",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/spring-2027-central-pacific-regional-intern-at-anti-defamation-league-4487544674",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487748580",
      title: "MBA Intern - Commercial Strategy",
      company: "Tierra",
      location: "Berkeley, CA",
      url: "https://www.linkedin.com/jobs/view/mba-intern-commercial-strategy-at-tierra-4487748580",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487220365",
      title: "Power Systems Undergraduate Intern - Cyber and Critical Infrastructure Summer Institute - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/power-systems-undergraduate-intern-cyber-and-critical-infrastructure-summer-institute-summer-2027-at-lawrence-livermore-national-laboratory-4487220365",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470224812",
      title: "Intern/Co-op \u2013 Landscape Architecture + Planning (Summer 2027)",
      company: "Langan Engineering & Environmental Services",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-co-op-%E2%80%93-landscape-architecture-%2B-planning-summer-2027-at-langan-engineering-environmental-services-4470224812",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487211776",
      title: "Power Systems Graduate Intern - Cyber and Critical Infrastructure Summer Institute - Summer 2027",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/power-systems-graduate-intern-cyber-and-critical-infrastructure-summer-institute-summer-2027-at-lawrence-livermore-national-laboratory-4487211776",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476650426",
      title: "Materials Regulatory Compliance (MRC) Intern",
      company: "Meta",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/materials-regulatory-compliance-mrc-intern-at-meta-4476650426",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485072749",
      title: "Research Scientist Intern, Ads Quality (PhD)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-scientist-intern-ads-quality-phd-at-meta-4485072749",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469970065",
      title: "PhD Intern, Data Science (2027)",
      company: "Figma",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/phd-intern-data-science-2027-at-figma-4469970065",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485046766",
      title: "Summer Intern - Interior Design",
      company: "Skidmore, Owings & Merrill (SOM)",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/summer-intern-interior-design-at-skidmore-owings-merrill-som-4485046766",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483905945",
      title: "Influencer Marketing & Content Creation Internship",
      company: "JUNOCO",
      location: "Burlingame, CA",
      url: "https://www.linkedin.com/jobs/view/influencer-marketing-content-creation-internship-at-junoco-4483905945",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478707177",
      title: "Product Analyst Intern (Part Time)",
      company: "Valmont Industries, Inc.",
      location: "Nebraska, United States",
      url: "https://www.linkedin.com/jobs/view/product-analyst-intern-part-time-at-valmont-industries-inc-4478707177",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486812561",
      title: "Intern, Full Stack Engineer",
      company: "Constellation Brands",
      location: "Rochester, NY",
      url: "https://www.linkedin.com/jobs/view/intern-full-stack-engineer-at-constellation-brands-4486812561",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484622415",
      title: "Marketing Intern",
      company: "Establishment Labs",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-establishment-labs-4484622415",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "3605428329",
      title: "Editorial Intern, Military Times",
      company: "Sightline Media Group",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/editorial-intern-military-times-at-sightline-media-group-3605428329",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478738296",
      title: "Student Intern, Administration and Communications",
      company: "Foundation for California Community Colleges",
      location: "California, United States",
      url: "https://www.linkedin.com/jobs/view/student-intern-administration-and-communications-at-foundation-for-california-community-colleges-4478738296",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477963012",
      title: "Deployment Intern",
      company: "Ascension",
      location: "St Louis, MO",
      url: "https://www.linkedin.com/jobs/view/deployment-intern-at-ascension-4477963012",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477949517",
      title: "Strategic Sourcing Contracting Operations Intern",
      company: "Ascension",
      location: "St Louis, MO",
      url: "https://www.linkedin.com/jobs/view/strategic-sourcing-contracting-operations-intern-at-ascension-4477949517",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487067837",
      title: "Digital Asset Management (DAM) Operations Intern, 2027 Summer U.S.",
      company: "Atlassian",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/digital-asset-management-dam-operations-intern-2027-summer-u-s-at-atlassian-4487067837",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486094721",
      title: "Sales & Marketing Communications Intern (Spring 2027)\nNew York City, NY",
      company: "GigFinesse",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/sales-marketing-communications-intern-spring-2027-%0Anew-york-city-ny-at-gigfinesse-4486094721",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486072275",
      title: "2028 Summer Analyst Intern | CAG",
      company: "Lincoln International",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2028-summer-analyst-intern-cag-at-lincoln-international-4486072275",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487066662",
      title: "Marketing & Communications Intern",
      company: "Paradromics",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/marketing-communications-intern-at-paradromics-4487066662",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461262076",
      title: "Procurement Tools & Systems Intern",
      company: "Ingredion Incorporated",
      location: "Westchester, IL",
      url: "https://www.linkedin.com/jobs/view/procurement-tools-systems-intern-at-ingredion-incorporated-4461262076",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486070278",
      title: "2028 Summer Analyst Intern | M&A",
      company: "Lincoln International",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/2028-summer-analyst-intern-m-a-at-lincoln-international-4486070278",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486069298",
      title: "2028 Summer Analyst Intern | CAG",
      company: "Lincoln International",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/2028-summer-analyst-intern-cag-at-lincoln-international-4486069298",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485040185",
      title: "Environmental Data Analyst Intern - Summer 2027",
      company: "Tepa Companies",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/environmental-data-analyst-intern-summer-2027-at-tepa-companies-4485040185",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481059137",
      title: "Cleared Software Engineer Intern - Summer 2027",
      company: "CACI International Inc",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/cleared-software-engineer-intern-summer-2027-at-caci-international-inc-4481059137",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486482936",
      title: "Intern",
      company: "Yardi",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/intern-at-yardi-4486482936",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460039007",
      title: "2027 Go-To-Market Intern",
      company: "Plante Moran",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/2027-go-to-market-intern-at-plante-moran-4460039007",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478725800",
      title: "Technology Intern - Multiple Opportunities",
      company: "Realty Income Corporation",
      location: "Del Mar, CA",
      url: "https://www.linkedin.com/jobs/view/technology-intern-multiple-opportunities-at-realty-income-corporation-4478725800",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487050400",
      title: "Marketing Intern",
      company: "butter LONDON",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-butter-london-4487050400",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478736488",
      title: "Commercial Real Estate Intern - Multiple Opportunities",
      company: "Realty Income Corporation",
      location: "Del Mar, CA",
      url: "https://www.linkedin.com/jobs/view/commercial-real-estate-intern-multiple-opportunities-at-realty-income-corporation-4478736488",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477922743",
      title: "SAP iXp Intern - Digital Value Advisory",
      company: "SAP",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/sap-ixp-intern-digital-value-advisory-at-sap-4477922743",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470229482",
      title: "Internal Audit Analytics Intern",
      company: "Coinbase",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/internal-audit-analytics-intern-at-coinbase-4470229482",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477974073",
      title: "Business and Administrative Intern - Strategy Analyst, CCO Strategy and Program Management",
      company: "Rivian",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/business-and-administrative-intern-strategy-analyst-cco-strategy-and-program-management-at-rivian-4477974073",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481391079",
      title: "Intern - Sandia/DOE Science Undergrad Laboratory Intern (SULI) - RD Undergrad Summer",
      company: "Sandia National Laboratories",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/intern-sandia-doe-science-undergrad-laboratory-intern-suli-rd-undergrad-summer-at-sandia-national-laboratories-4481391079",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481637974",
      title: "Intern - Sandia/CA DOE Community College Internship (CCI) - Technical Undergrad Summer",
      company: "Sandia National Laboratories",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/intern-sandia-ca-doe-community-college-internship-cci-technical-undergrad-summer-at-sandia-national-laboratories-4481637974",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486038029",
      title: "Product Marketing MBA Intern, AI Infrastructure \u2014 Summer 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-mba-intern-ai-infrastructure-%E2%80%94-summer-2027-at-nvidia-4486038029",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478574383",
      title: "Carrier Operations Intern (Operations)",
      company: "SageSure",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/carrier-operations-intern-operations-at-sagesure-4478574383",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481219023",
      title: "Predictive Science Academic Alliance Program IV Student Intern (PSAAP IV)",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/predictive-science-academic-alliance-program-iv-student-intern-psaap-iv-at-lawrence-livermore-national-laboratory-4481219023",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486492621",
      title: "Sales Intern - Sunnyvale",
      company: "Alibaba Cloud",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/sales-intern-sunnyvale-at-alibaba-cloud-4486492621",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486894176",
      title: "Accelerated Science Intern, Bridging Atomistic Modeling to Real Electrochemical Systems",
      company: "Toyota Research Institute",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/accelerated-science-intern-bridging-atomistic-modeling-to-real-electrochemical-systems-at-toyota-research-institute-4486894176",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487059594",
      title: "Product & Motion Design (Co-op / extended internship)",
      company: "Engramme",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/product-motion-design-co-op-extended-internship-at-engramme-4487059594",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486474842",
      title: "Spring 2027 Internship",
      company: "Perkins&Will",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/spring-2027-internship-at-perkins-will-4486474842",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487070415",
      title: "Founding Brand Design Intern",
      company: "Skild AI",
      location: "San Mateo, CA",
      url: "https://www.linkedin.com/jobs/view/founding-brand-design-intern-at-skild-ai-4487070415",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485740616",
      title: "2027 Full Stack Development Summer Internship",
      company: "WebstaurantStore",
      location: "Lititz, PA",
      url: "https://www.linkedin.com/jobs/view/2027-full-stack-development-summer-internship-at-webstaurantstore-4485740616",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486113980",
      title: "Summer Intern \u2013 Quality Systems & Business Processes",
      company: "BioSpace",
      location: "Bridgewater, NJ",
      url: "https://www.linkedin.com/jobs/view/summer-intern-%E2%80%93-quality-systems-business-processes-at-biospace-4486113980",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485737763",
      title: "SOC Intern",
      company: "WebstaurantStore",
      location: "Lancaster, PA",
      url: "https://www.linkedin.com/jobs/view/soc-intern-at-webstaurantstore-4485737763",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484374634",
      title: "SAP Concur iXp Intern - Data Strategy",
      company: "SAP",
      location: "Bellevue, WA",
      url: "https://www.linkedin.com/jobs/view/sap-concur-ixp-intern-data-strategy-at-sap-4484374634",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484602409",
      title: "Social Media/Content Creation Intern",
      company: "Chicago Union",
      location: "Elmhurst, IL",
      url: "https://www.linkedin.com/jobs/view/social-media-content-creation-intern-at-chicago-union-4484602409",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484619180",
      title: "IMA Advisors Intern - Summer 2027",
      company: "IMA Financial Group, Inc.",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/ima-advisors-intern-summer-2027-at-ima-financial-group-inc-4484619180",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482163544",
      title: "Digital Systems Internship (CO)",
      company: "Tetra Tech",
      location: "Denver, CO",
      url: "https://www.linkedin.com/jobs/view/digital-systems-internship-co-at-tetra-tech-4482163544",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460583665",
      title: "Supply Chain Data & Analytics Intern (2027 Summer Internship)",
      company: "Northwood",
      location: "Torrance, CA",
      url: "https://www.linkedin.com/jobs/view/supply-chain-data-analytics-intern-2027-summer-internship-at-northwood-4460583665",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467336508",
      title: "Early Interest Internship Application",
      company: "Cosm",
      location: "Los Angeles Metropolitan Area",
      url: "https://www.linkedin.com/jobs/view/early-interest-internship-application-at-cosm-4467336508",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4450736904",
      title: "Flight Software Internship - Spring 2027",
      company: "Varda Space Industries",
      location: "El Segundo, CA",
      url: "https://www.linkedin.com/jobs/view/flight-software-internship-spring-2027-at-varda-space-industries-4450736904",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468087944",
      title: "Automotive Engineering Internship \u2013 Summer 2027",
      company: "Qualcomm",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/automotive-engineering-internship-%E2%80%93-summer-2027-at-qualcomm-4468087944",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474613537",
      title: "Patient Access Intern (Summer 2027)",
      company: "Travere Therapeutics",
      location: "San Diego Metropolitan Area",
      url: "https://www.linkedin.com/jobs/view/patient-access-intern-summer-2027-at-travere-therapeutics-4474613537",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474626005",
      title: "Commercial Insights & Operations Intern (Summer 2027)",
      company: "Travere Therapeutics",
      location: "San Diego Metropolitan Area",
      url: "https://www.linkedin.com/jobs/view/commercial-insights-operations-intern-summer-2027-at-travere-therapeutics-4474626005",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485729155",
      title: "Intern, Social Media & Digital Strategy",
      company: "FGS Global",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/intern-social-media-digital-strategy-at-fgs-global-4485729155",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477296081",
      title: "2027 Summer Civil Engineering Intern",
      company: "BKF Engineers",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-civil-engineering-intern-at-bkf-engineers-4477296081",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477280726",
      title: "2027 Summer Civil Engineering Intern",
      company: "BKF Engineers",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-civil-engineering-intern-at-bkf-engineers-4477280726",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486465210",
      title: "Propulsion Engineering Intern",
      company: "Astro Mechanica",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/propulsion-engineering-intern-at-astro-mechanica-4486465210",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486406896",
      title: "Summer Law Clerk",
      company: "Lawrence Livermore National Laboratory",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/summer-law-clerk-at-lawrence-livermore-national-laboratory-4486406896",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484352981",
      title: "Student Intern (Part-Time)",
      company: "EBMUD",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/student-intern-part-time-at-ebmud-4484352981",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486441982",
      title: "Research Intern",
      company: "The Voleon Group",
      location: "Berkeley, CA",
      url: "https://www.linkedin.com/jobs/view/research-intern-at-the-voleon-group-4486441982",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484615446",
      title: "Summer Intern - City Design",
      company: "Skidmore, Owings & Merrill (SOM)",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/summer-intern-city-design-at-skidmore-owings-merrill-som-4484615446",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485948000",
      title: "Customer Experience & Analytics Internship (Remote) \u2013 Summer 2027 (Undergraduate)",
      company: "Molina Healthcare",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/customer-experience-analytics-internship-remote-%E2%80%93-summer-2027-undergraduate-at-molina-healthcare-4485948000",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472954448",
      title: "Intern - Merchandising Leadership Development Program",
      company: "Harbor Freight Tools",
      location: "Calabasas, CA",
      url: "https://www.linkedin.com/jobs/view/intern-merchandising-leadership-development-program-at-harbor-freight-tools-4472954448",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4391891329",
      title: "Talent Acquisition Intern",
      company: "DigiCert",
      location: "Lehi, UT",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-intern-at-digicert-4391891329",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485946230",
      title: "Provider Network  & Operations  Internship \u2013 Summer 2027 (Undergraduate)",
      company: "Molina Healthcare",
      location: "Wisconsin, United States",
      url: "https://www.linkedin.com/jobs/view/provider-network-operations-internship-%E2%80%93-summer-2027-undergraduate-at-molina-healthcare-4485946230",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458991090",
      title: "2027 Data & Analytics Consulting Intern",
      company: "West Monroe",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/2027-data-analytics-consulting-intern-at-west-monroe-4458991090",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458975354",
      title: "2027 Platforms & Business Consulting Intern",
      company: "West Monroe",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/2027-platforms-business-consulting-intern-at-west-monroe-4458975354",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458979311",
      title: "2027 Platforms & Customer Strategy Consulting Intern",
      company: "West Monroe",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/2027-platforms-customer-strategy-consulting-intern-at-west-monroe-4458979311",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478069377",
      title: "2027 Summer Intern - Field Sales Operations Internship \u2013 District Manager, Parts & Service",
      company: "General Motors",
      location: "Westlake Village, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-field-sales-operations-internship-%E2%80%93-district-manager-parts-service-at-general-motors-4478069377",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458985180",
      title: "2027 Data & Analytics Consulting Intern",
      company: "West Monroe",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/2027-data-analytics-consulting-intern-at-west-monroe-4458985180",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478077168",
      title: "2027 Summer Intern - Field Sales Operations Internship \u2013 District Manager, Parts & Service",
      company: "General Motors",
      location: "Alpharetta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-field-sales-operations-internship-%E2%80%93-district-manager-parts-service-at-general-motors-4478077168",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485959174",
      title: "Early Career Intern - Marketing (Email Team)",
      company: "Invesco",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/early-career-intern-marketing-email-team-at-invesco-4485959174",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468085933",
      title: "Multimedia Engineering Internship \u2013 Summer 2027",
      company: "Qualcomm",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/multimedia-engineering-internship-%E2%80%93-summer-2027-at-qualcomm-4468085933",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466938481",
      title: "Software Engineer Intern (Payment) - 2027 Summer",
      company: "TikTok USDS Joint Venture",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-payment-2027-summer-at-tiktok-usds-joint-venture-4466938481",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466946334",
      title: "Software Engineer Intern (Tech and Product) - 2027 Summer",
      company: "TikTok USDS Joint Venture",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-tech-and-product-2027-summer-at-tiktok-usds-joint-venture-4466946334",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468088820",
      title: "RF/Analog Design/Mixed-Signal Engineering Internship \u2013 Summer 2027",
      company: "Qualcomm",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/rf-analog-design-mixed-signal-engineering-internship-%E2%80%93-summer-2027-at-qualcomm-4468088820",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460530361",
      title: "Project Engineer Intern \u2013 Summer 2027 (Livermore, CA)",
      company: "Goodfellow Bros.",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/project-engineer-intern-%E2%80%93-summer-2027-livermore-ca-at-goodfellow-bros-4460530361",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485191037",
      title: "Audit Intern \u2013 Summer 2027",
      company: "Sensiba LLP",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/audit-intern-%E2%80%93-summer-2027-at-sensiba-llp-4485191037",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458620147",
      title: "Intern - CDBU Marketing",
      company: "Micron Technology",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-cdbu-marketing-at-micron-technology-4458620147",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458987323",
      title: "(2028 Bachelor's/Master's graduates) Economics Consulting Analyst/Associate Intern (Summer 2027)",
      company: "Charles River Associates",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/2028-bachelor-s-master-s-graduates-economics-consulting-analyst-associate-intern-summer-2027-at-charles-river-associates-4458987323",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458976511",
      title: "(2028 Bachelor's/Master's graduates) Accounting/Business/Finance Consulting Analyst/Associate Intern (Summer 2027)",
      company: "Charles River Associates",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/2028-bachelor-s-master-s-graduates-accounting-business-finance-consulting-analyst-associate-intern-summer-2027-at-charles-river-associates-4458976511",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476888088",
      title: "IT Engineer Intern (Early Careers Summer 2027)",
      company: "Affirm",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/it-engineer-intern-early-careers-summer-2027-at-affirm-4476888088",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468809382",
      title: "Year-Round Intern - CX",
      company: "The Options Clearing Corporation (OCC)",
      location: "Greater Chicago Area",
      url: "https://www.linkedin.com/jobs/view/year-round-intern-cx-at-the-options-clearing-corporation-occ-4468809382",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478001273",
      title: "Software Product Management Intern",
      company: "SageSure",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/software-product-management-intern-at-sagesure-4478001273",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460142329",
      title: "Offering Management \u2013 Summer 2027 Intern",
      company: "Honeywell Technologies",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/offering-management-%E2%80%93-summer-2027-intern-at-honeywell-technologies-4460142329",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467584525",
      title: "Analytics Engineering Intern",
      company: "Greystar",
      location: "Georgia, United States",
      url: "https://www.linkedin.com/jobs/view/analytics-engineering-intern-at-greystar-4467584525",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467582538",
      title: "Analytics Engineering Intern",
      company: "Greystar",
      location: "Michigan, United States",
      url: "https://www.linkedin.com/jobs/view/analytics-engineering-intern-at-greystar-4467582538",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458986158",
      title: "2027 Platforms & Business Consulting Intern",
      company: "West Monroe",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-platforms-business-consulting-intern-at-west-monroe-4458986158",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458981216",
      title: "2027 Platforms & Customer Strategy Consulting Intern",
      company: "West Monroe",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-platforms-customer-strategy-consulting-intern-at-west-monroe-4458981216",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478043627",
      title: "Business Analyst Intern \u2013 Summer 2027",
      company: "Amazon",
      location: "Bellevue, WA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-intern-%E2%80%93-summer-2027-at-amazon-4478043627",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468818169",
      title: "Summer Intern - Agile Management Solutions",
      company: "The Options Clearing Corporation (OCC)",
      location: "Greater Chicago Area",
      url: "https://www.linkedin.com/jobs/view/summer-intern-agile-management-solutions-at-the-options-clearing-corporation-occ-4468818169",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468810353",
      title: "Year-Round Intern - Stress Testing & Liquidity Management",
      company: "The Options Clearing Corporation (OCC)",
      location: "Greater Chicago Area",
      url: "https://www.linkedin.com/jobs/view/year-round-intern-stress-testing-liquidity-management-at-the-options-clearing-corporation-occ-4468810353",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458990121",
      title: "2027 Insurance Consulting Intern",
      company: "West Monroe",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/2027-insurance-consulting-intern-at-west-monroe-4458990121",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458979312",
      title: "2027 Platforms & Business Consulting Intern",
      company: "West Monroe",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/2027-platforms-business-consulting-intern-at-west-monroe-4458979312",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4449900820",
      title: "Finance Intern",
      company: "Winland Foods",
      location: "Oak Brook, IL",
      url: "https://www.linkedin.com/jobs/view/finance-intern-at-winland-foods-4449900820",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485107857",
      title: "Impact Investments Intern - Summer 2027",
      company: "MacArthur Foundation",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/impact-investments-intern-summer-2027-at-macarthur-foundation-4485107857",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476852990",
      title: "Software Engineer Intern",
      company: "Docusign",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-docusign-4476852990",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485119817",
      title: "Financial Planning & Analysis Intern - Summer 2027",
      company: "MacArthur Foundation",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/financial-planning-analysis-intern-summer-2027-at-macarthur-foundation-4485119817",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469179449",
      title: "Marketing, Creative & eCommerce Intern Summer Opportunities (May-Aug 2027)",
      company: "SharkNinja",
      location: "Needham, MA",
      url: "https://www.linkedin.com/jobs/view/marketing-creative-ecommerce-intern-summer-opportunities-may-aug-2027-at-sharkninja-4469179449",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460516339",
      title: "University - 2027 Summer Games Software Developer Intern - Atlanta, GA",
      company: "Booz Allen Hamilton",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/university-2027-summer-games-software-developer-intern-atlanta-ga-at-booz-allen-hamilton-4460516339",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476834599",
      title: "2027 Summer Intern - Digital Development",
      company: "Papa Johns",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-digital-development-at-papa-johns-4476834599",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459829472",
      title: "University - 2027 Summer Games Software Developer Intern - San Diego, CA",
      company: "Booz Allen Hamilton",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/university-2027-summer-games-software-developer-intern-san-diego-ca-at-booz-allen-hamilton-4459829472",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476865430",
      title: "Software Engineering - Summer 2027 Internships",
      company: "Rivian",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-summer-2027-internships-at-rivian-4476865430",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485632952",
      title: "Internship, Distributed Systems Software Engineer, Energy Engineering (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-distributed-systems-software-engineer-energy-engineering-winter-spring-2027-at-tesla-4485632952",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485637828",
      title: "Internship, Megapack Business Development, Energy (Winter/Spring 2027)",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/internship-megapack-business-development-energy-winter-spring-2027-at-tesla-4485637828",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477893552",
      title: "Software Product Management Intern",
      company: "SageSure",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/software-product-management-intern-at-sagesure-4477893552",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476853761",
      title: "Cybersecurity - Summer 2027 Internships",
      company: "Rivian",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/cybersecurity-summer-2027-internships-at-rivian-4476853761",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458301777",
      title: "Family Office Accounting Internship - Summer 2027 - San Jose",
      company: "Frank, Rimerman + Co. LLP",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/family-office-accounting-internship-summer-2027-san-jose-at-frank-rimerman-%2B-co-llp-4458301777",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479242044",
      title: "Summer 2027 Internship -  Member of Technical Staff -  Frontend",
      company: "Armadin",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-internship-member-of-technical-staff-frontend-at-armadin-4479242044",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458927176",
      title: "Talent Acquisition Project Intern (Product & Design) - 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-project-intern-product-design-2026-start-at-tiktok-4458927176",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485673227",
      title: "Chemistry Intern",
      company: "Capable",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/chemistry-intern-at-capable-4485673227",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477883372",
      title: "Communications Specialist I (Intern) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/communications-specialist-i-intern-united-states-at-cisco-4477883372",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485141210",
      title: "TD Memory Quality and Reliability PhD Intern",
      company: "Intel",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/td-memory-quality-and-reliability-phd-intern-at-intel-4485141210",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470941038",
      title: "Summer 2027 Internship - Member of Technical Staff - Agent Systems",
      company: "Armadin",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-internship-member-of-technical-staff-agent-systems-at-armadin-4470941038",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458960045",
      title: "Talent Acquisition Project Intern (Corporate Functions) - 2026 Fall",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-project-intern-corporate-functions-2026-fall-at-tiktok-4458960045",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479156382",
      title: "Digital Marketing Intern - Spring 2027",
      company: "Hamilton Beach Brands Inc.",
      location: "Glen Allen, VA",
      url: "https://www.linkedin.com/jobs/view/digital-marketing-intern-spring-2027-at-hamilton-beach-brands-inc-4479156382",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483098683",
      title: "UX Design Internship",
      company: "Biasly",
      location: "Salt Lake City, UT",
      url: "https://www.linkedin.com/jobs/view/ux-design-internship-at-biasly-4483098683",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485373088",
      title: "Product Management MBA Intern",
      company: "Teamworks",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/product-management-mba-intern-at-teamworks-4485373088",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459040052",
      title: "Software Engineer Intern - (Summer 2027)",
      company: "The Voleon Group",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-at-the-voleon-group-4459040052",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474865085",
      title: "Summer Intern \u2013 Quality Systems & Business Processes",
      company: "Insmed Incorporated",
      location: "Bridgewater, NJ",
      url: "https://www.linkedin.com/jobs/view/summer-intern-%E2%80%93-quality-systems-business-processes-at-insmed-incorporated-4474865085",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487594033",
      title: "Communications Intern",
      company: "Equality Texas",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/communications-intern-at-equality-texas-4487594033",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468676782",
      title: "2027 Quantitative Masters Internship Program - Investments - Global Capital Markets - New York",
      company: "BlackRock",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/2027-quantitative-masters-internship-program-investments-global-capital-markets-new-york-at-blackrock-4468676782",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477443257",
      title: "Early Careers - Systems Analyst Intern",
      company: "Health Care Service Corporation",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/early-careers-systems-analyst-intern-at-health-care-service-corporation-4477443257",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485304461",
      title: "Winds & Strings Marketing Intern",
      company: "Yamaha Corporation",
      location: "Buena Park, CA",
      url: "https://www.linkedin.com/jobs/view/winds-strings-marketing-intern-at-yamaha-corporation-4485304461",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485295751",
      title: "Drums and Percussion Marketing Intern",
      company: "Yamaha Corporation",
      location: "Buena Park, CA",
      url: "https://www.linkedin.com/jobs/view/drums-and-percussion-marketing-intern-at-yamaha-corporation-4485295751",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485616578",
      title: "Summer Internship Program - Marketing",
      company: "Tria Federal (Tria)",
      location: "Arlington, VA",
      url: "https://www.linkedin.com/jobs/view/summer-internship-program-marketing-at-tria-federal-tria-4485616578",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485387160",
      title: "Strada Education Foundation Internship: Clear Outcomes and Data Science Intern",
      company: "Strada Education Foundation",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/strada-education-foundation-internship-clear-outcomes-and-data-science-intern-at-strada-education-foundation-4485387160",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485621484",
      title: "Summer Internship Program - Defense Health Agency (DHA) Uniform Business Office (UBO)",
      company: "Tria Federal (Tria)",
      location: "Arlington, VA",
      url: "https://www.linkedin.com/jobs/view/summer-internship-program-defense-health-agency-dha-uniform-business-office-ubo-at-tria-federal-tria-4485621484",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485365653",
      title: "Master's Machine Learning Engineer, Intern",
      company: "Stripe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/master-s-machine-learning-engineer-intern-at-stripe-4485365653",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485356898",
      title: "PhD Machine Learning Engineer, Intern",
      company: "Stripe",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/phd-machine-learning-engineer-intern-at-stripe-4485356898",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476219067",
      title: "Summer 2027 - Electrical Engineering Intern - BS",
      company: "Lam Research",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-electrical-engineering-intern-bs-at-lam-research-4476219067",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485384866",
      title: "Transportation Internship (Summer 2027)",
      company: "Fehr & Peers",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/transportation-internship-summer-2027-at-fehr-peers-4485384866",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483437961",
      title: "Intern of BeyondStyle Content Marketing",
      company: "BorderX Lab",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/intern-of-beyondstyle-content-marketing-at-borderx-lab-4483437961",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485307699",
      title: "Marketing Intern (North America Cloud & AI) - Sunnyvale",
      company: "Alibaba Cloud",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-north-america-cloud-ai-sunnyvale-at-alibaba-cloud-4485307699",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459080943",
      title: "Human Resources Intern",
      company: "FlatironDragados",
      location: "Concord, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-intern-at-flatirondragados-4459080943",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4462065368",
      title: "Tencent Cloud CPaaS Product Management Intern",
      company: "Tencent",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/tencent-cloud-cpaas-product-management-intern-at-tencent-4462065368",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485113428",
      title: "Product Manager - Project Intern (Global Monetization Product and Technology) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-manager-project-intern-global-monetization-product-and-technology-2027-start-at-tiktok-4485113428",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466800600",
      title: "Safety Intern - Summer 2027",
      company: "Granite Construction",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/safety-intern-summer-2027-at-granite-construction-4466800600",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485603137",
      title: "Transportation Internship (Summer 2027)",
      company: "Fehr & Peers",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/transportation-internship-summer-2027-at-fehr-peers-4485603137",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485388859",
      title: "Transportation Internship (Summer 2027)",
      company: "Fehr & Peers",
      location: "Walnut Creek, CA",
      url: "https://www.linkedin.com/jobs/view/transportation-internship-summer-2027-at-fehr-peers-4485388859",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4385384801",
      title: "Growth Ops Intern",
      company: "Etched",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/growth-ops-intern-at-etched-4385384801",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484828706",
      title: "Community Management Intern \u2014 San Francisco",
      company: "XClub",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/community-management-intern-%E2%80%94-san-francisco-at-xclub-4484828706",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484844051",
      title: "Fundraising Associate Intern \u2014 San Francisco",
      company: "XClub",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/fundraising-associate-intern-%E2%80%94-san-francisco-at-xclub-4484844051",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483488102",
      title: "Research Scientist Intern, Scam and Trust (PhD)",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-scientist-intern-scam-and-trust-phd-at-meta-4483488102",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475979703",
      title: "[2027] Data Scientist - PhD Intern",
      company: "Roblox",
      location: "San Mateo, CA",
      url: "https://www.linkedin.com/jobs/view/2027-data-scientist-phd-intern-at-roblox-4475979703",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475498976",
      title: "Software Engineer Intern",
      company: "Docusign",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-docusign-4475498976",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485254844",
      title: "Quality & Customer Experience Intern",
      company: "Emerson",
      location: "Round Rock, TX",
      url: "https://www.linkedin.com/jobs/view/quality-customer-experience-intern-at-emerson-4485254844",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459387129",
      title: "Data Science Intern - Summer 2027",
      company: "WhiteWater",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-summer-2027-at-whitewater-4459387129",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466595081",
      title: "2027 IT Business Systems Intern",
      company: "Mercury Systems",
      location: "Andover, MA",
      url: "https://www.linkedin.com/jobs/view/2027-it-business-systems-intern-at-mercury-systems-4466595081",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484990578",
      title: "Intern",
      company: "Children's Hospital Colorado",
      location: "Aurora, CO",
      url: "https://www.linkedin.com/jobs/view/intern-at-children-s-hospital-colorado-4484990578",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4468328071",
      title: "People Movement Intern - New York, Los Angeles, San Diego or Boston - Summer 2027",
      company: "Buro Happold",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/people-movement-intern-new-york-los-angeles-san-diego-or-boston-summer-2027-at-buro-happold-4468328071",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475478800",
      title: "Communications Internship - Summer 2027",
      company: "IDEMIA Public Security",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/communications-internship-summer-2027-at-idemia-public-security-4475478800",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4457279447",
      title: "Supply Chain Analyst Intern",
      company: "Analog Devices",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/supply-chain-analyst-intern-at-analog-devices-4457279447",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474471926",
      title: "Business Process Mining & Intelligence Analyst Intern, BS - Summer 2027",
      company: "Marvell Technology",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/business-process-mining-intelligence-analyst-intern-bs-summer-2027-at-marvell-technology-4474471926",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4457414759",
      title: "Client Solutions Intern (GBS-NA) - 2027 Summer",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/client-solutions-intern-gbs-na-2027-summer-at-tiktok-4457414759",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466565940",
      title: "Engineer Intern - Summer 2027",
      company: "Granite Construction",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/engineer-intern-summer-2027-at-granite-construction-4466565940",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484174105",
      title: "PhD Intern, Security Engineer (2027)",
      company: "Figma",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/phd-intern-security-engineer-2027-at-figma-4484174105",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484579519",
      title: "Procurement Intern (Winter 2027)",
      company: "Astranis Space Technologies",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/procurement-intern-winter-2027-at-astranis-space-technologies-4484579519",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484780200",
      title: "Digital Assurance & Transparency (DAT) - Data - Intern - Summer 2027",
      company: "PwC",
      location: "Silicon Valley, CA",
      url: "https://www.linkedin.com/jobs/view/digital-assurance-transparency-dat-data-intern-summer-2027-at-pwc-4484780200",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484586331",
      title: "Marketing Summer Intern",
      company: "SproutsAI",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-summer-intern-at-sproutsai-4484586331",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485234937",
      title: "UI/UX Design Intern (Summer 2027)",
      company: "PTC",
      location: "San Mateo County, CA",
      url: "https://www.linkedin.com/jobs/view/ui-ux-design-intern-summer-2027-at-ptc-4485234937",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485242301",
      title: "Arena Engineering Intern (Summer 2027)",
      company: "PTC",
      location: "San Mateo County, CA",
      url: "https://www.linkedin.com/jobs/view/arena-engineering-intern-summer-2027-at-ptc-4485242301",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467180599",
      title: "People Operations Intern",
      company: "Etched",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/people-operations-intern-at-etched-4467180599",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484996890",
      title: "Summer 2027 Product Manager Intern",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-product-manager-intern-at-intuit-4484996890",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484774410",
      title: "Medical Education & Communication Intern",
      company: "Intuitive",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/medical-education-communication-intern-at-intuitive-4484774410",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4410874474",
      title: "Applied Deep Learning PhD Research Intern, Reinforcement Learning for LLMs - Fall 2026",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/applied-deep-learning-phd-research-intern-reinforcement-learning-for-llms-fall-2026-at-nvidia-4410874474",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472856429",
      title: "Transportation Planning Intern",
      company: "Kimley-Horn",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/transportation-planning-intern-at-kimley-horn-4472856429",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484965371",
      title: "Public Relations Intern (Post-Graduate)",
      company: "Highwire",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/public-relations-intern-post-graduate-at-highwire-4484965371",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4457904582",
      title: "Talent Acquisition Project Intern (GMPT) - 2026 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition-project-intern-gmpt-2026-start-at-tiktok-4457904582",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459055873",
      title: "Social Media & Content Marketing Intern",
      company: "Arcade",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/social-media-content-marketing-intern-at-arcade-4459055873",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484735894",
      title: "Marketing Intern (Advertising)",
      company: "CivicScience",
      location: "Pittsburgh, PA",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-advertising-at-civicscience-4484735894",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476352320",
      title: "3d Subsea Simulator Software Intern",
      company: "Oceaneering",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/3d-subsea-simulator-software-intern-at-oceaneering-4476352320",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471227448",
      title: "Software Engineer Intern (2027) - Austin, TX",
      company: "Cloudflare",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-2027-austin-tx-at-cloudflare-4471227448",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476531286",
      title: "Summer Internship - Customer Experience Analytics (Vehicle Support Center)",
      company: "PACCAR Parts",
      location: "Renton, WA",
      url: "https://www.linkedin.com/jobs/view/summer-internship-customer-experience-analytics-vehicle-support-center-at-paccar-parts-4476531286",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476385937",
      title: "Software Development Engineer Intern (Seattle, WA)",
      company: "F5",
      location: "Greater Seattle Area",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-intern-seattle-wa-at-f5-4476385937",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465267296",
      title: "Technology Internship Program (Software Engineering)",
      company: "CNA Insurance",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/technology-internship-program-software-engineering-at-cna-insurance-4465267296",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484721542",
      title: "Early Careers - Customer Service Business Analyst Intern",
      company: "Health Care Service Corporation",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/early-careers-customer-service-business-analyst-intern-at-health-care-service-corporation-4484721542",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484487934",
      title: "Social Media Intern",
      company: "Walker Sands",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/social-media-intern-at-walker-sands-4484487934",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4458281408",
      title: "Android Applications Developer Intern - Summer 2027",
      company: "Motorola Solutions",
      location: "Chicago, IL",
      url: "https://www.linkedin.com/jobs/view/android-applications-developer-intern-summer-2027-at-motorola-solutions-4458281408",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484133861",
      title: "Marketing and Events Co-Op",
      company: "Cultural Care Au Pair",
      location: "Boston, MA",
      url: "https://www.linkedin.com/jobs/view/marketing-and-events-co-op-at-cultural-care-au-pair-4484133861",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484467851",
      title: "Software Engineer Intern",
      company: "Sedaro",
      location: "Arlington, VA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-sedaro-4484467851",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484485071",
      title: "Compiler Intern, Simulator",
      company: "Sedaro",
      location: "Arlington, VA",
      url: "https://www.linkedin.com/jobs/view/compiler-intern-simulator-at-sedaro-4484485071",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476337648",
      title: "Software Engineer Intern",
      company: "Relativity Space",
      location: "Long Beach, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-at-relativity-space-4476337648",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482532306",
      title: "Business Analyst Intern",
      company: "Axos Bank",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-intern-at-axos-bank-4482532306",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484702707",
      title: "2027 Summer Intern - Commercial Banking",
      company: "CIBC US",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-commercial-banking-at-cibc-us-4484702707",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465267257",
      title: "Software Engineer, Intern (Summer 2027) - US",
      company: "DoorDash",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-intern-summer-2027-us-at-doordash-4465267257",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4448658904",
      title: "Security Analyst Intern",
      company: "Monolithic Power Systems",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/security-analyst-intern-at-monolithic-power-systems-4448658904",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484720408",
      title: "Powertrain Mechanical Engineer, Battery (Intern Summer 2027)",
      company: "Joby Aviation",
      location: "San Carlos, CA",
      url: "https://www.linkedin.com/jobs/view/powertrain-mechanical-engineer-battery-intern-summer-2027-at-joby-aviation-4484720408",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467900516",
      title: "Summer 2027: Product Design Intern",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-product-design-intern-at-intuit-4467900516",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4465214006",
      title: "Investment Analyst MBA Intern, Robinhood Ventures (Summer 2027)",
      company: "Robinhood",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/investment-analyst-mba-intern-robinhood-ventures-summer-2027-at-robinhood-4465214006",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483877374",
      title: "Intern \u2013 CMBU Product Management",
      company: "Micron Technology",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-%E2%80%93-cmbu-product-management-at-micron-technology-4483877374",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484729151",
      title: "Health Economics & Outcomes Research (HEOR) Intern",
      company: "Intuitive",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/health-economics-outcomes-research-heor-intern-at-intuitive-4484729151",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477360389",
      title: "Short Drama Creative Editor Intern",
      company: "NewsBreak",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/short-drama-creative-editor-intern-at-newsbreak-4477360389",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467406896",
      title: "Product Marketing Engineer Intern",
      company: "Monolithic Power Systems",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-engineer-intern-at-monolithic-power-systems-4467406896",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4437287377",
      title: "Summer 2027 Intern - Healthcare & Life Sciences Division - US/LATAM [UG/Masters]",
      company: "Simon-Kucher",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-healthcare-life-sciences-division-us-latam-ug-masters-at-simon-kucher-4437287377",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484232754",
      title: "Security Specialist, Intern",
      company: "Filevine",
      location: "Salt Lake City, UT",
      url: "https://www.linkedin.com/jobs/view/security-specialist-intern-at-filevine-4484232754",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475983653",
      title: "IT Cybersecurity Intern - Fort Huachuca, AZ",
      company: "Peraton",
      location: "United States",
      url: "https://www.linkedin.com/jobs/view/it-cybersecurity-intern-fort-huachuca-az-at-peraton-4475983653",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484012130",
      title: "Data Science Intern",
      company: "Zillow",
      location: "Seattle, WA",
      url: "https://www.linkedin.com/jobs/view/data-science-intern-at-zillow-4484012130",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484262283",
      title: "Investment Banking Summer Analyst",
      company: "MACA Advisors LLC",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/investment-banking-summer-analyst-at-maca-advisors-llc-4484262283",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483769932",
      title: "Retail Operations Strategy Corporate Internship (Graduate) - Summer 2027",
      company: "CVS Health",
      location: "Woonsocket, RI",
      url: "https://www.linkedin.com/jobs/view/retail-operations-strategy-corporate-internship-graduate-summer-2027-at-cvs-health-4483769932",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484251939",
      title: "Software Engineering Intern",
      company: "Protagonist",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/software-engineering-intern-at-protagonist-4484251939",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483769583",
      title: "Corporate Intern - Purchasing",
      company: "White Cap",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/corporate-intern-purchasing-at-white-cap-4483769583",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483761830",
      title: "Corporate Intern - Operations - Customer Delivery Hub",
      company: "White Cap",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/corporate-intern-operations-customer-delivery-hub-at-white-cap-4483761830",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484057532",
      title: "Industrial Design Internship",
      company: "leManoosh",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/industrial-design-internship-at-lemanoosh-4484057532",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483736396",
      title: "Marketing Intern",
      company: "UtiliSave LLC",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/marketing-intern-at-utilisave-llc-4483736396",
      postedAt: "2026-10-26T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482923914",
      title: "Services Analytics Graduate Intern",
      company: "Dell Technologies",
      location: "Round Rock, TX",
      url: "https://www.linkedin.com/jobs/view/services-analytics-graduate-intern-at-dell-technologies-4482923914",
      postedAt: "2026-10-26T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479604396",
      title: "Business Analyst Intern - Atlanta, GA",
      company: "CarMax",
      location: "Kennesaw, GA",
      url: "https://www.linkedin.com/jobs/view/business-analyst-intern-atlanta-ga-at-carmax-4479604396",
      postedAt: "2026-10-26T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483389833",
      title: "Data Analyst Internship",
      company: "ConnectPrep",
      location: "Washington, DC",
      url: "https://www.linkedin.com/jobs/view/data-analyst-internship-at-connectprep-4483389833",
      postedAt: "2026-10-25T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483174076",
      title: "Corporate Intern - Operations",
      company: "White Cap",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/corporate-intern-operations-at-white-cap-4483174076",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483101192",
      title: "Data Analytics & Data Science Intern \u2014 Spring & Summer 2027",
      company: "Simbe",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/data-analytics-data-science-intern-%E2%80%94-spring-summer-2027-at-simbe-4483101192",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483113024",
      title: "Computer Vision / Applied AI Intern \u2014 Summer 2027",
      company: "Simbe",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/computer-vision-applied-ai-intern-%E2%80%94-summer-2027-at-simbe-4483113024",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482894784",
      title: "Hardware / Mechanical Engineering Intern \u2014 Spring & Summer 2027",
      company: "Simbe",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/hardware-mechanical-engineering-intern-%E2%80%94-spring-summer-2027-at-simbe-4482894784",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460649727",
      title: "2027 Summer Intern, MBA, Operations Planning",
      company: "Waymo",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-mba-operations-planning-at-waymo-4460649727",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481002086",
      title: "Marketing Coordinator Intern",
      company: "Keysight Technologies",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-coordinator-intern-at-keysight-technologies-4481002086",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481370687",
      title: "Digital Marketing Internship (Fall 2026) - Remote",
      company: "Retensa Employee Retention",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/digital-marketing-internship-fall-2026-remote-at-retensa-employee-retention-4481370687",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481386024",
      title: "AI Product Intern: Fall 2026",
      company: "Retensa Employee Retention",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/ai-product-intern-fall-2026-at-retensa-employee-retention-4481386024",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481604823",
      title: "Intern, Marketing (multiple Hackensack Meridian locations)",
      company: "Hackensack Meridian Health",
      location: "Edison, NJ",
      url: "https://www.linkedin.com/jobs/view/intern-marketing-multiple-hackensack-meridian-locations-at-hackensack-meridian-health-4481604823",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481631006",
      title: "IT Business Analyst Intern - 2027 Summer Intern",
      company: "Wilton Re",
      location: "Norwalk, CT",
      url: "https://www.linkedin.com/jobs/view/it-business-analyst-intern-2027-summer-intern-at-wilton-re-4481631006",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481550778",
      title: "2027 Summer Human Resources & Workplace Experience Internship",
      company: "T-Mobile",
      location: "Bellevue, WA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-human-resources-workplace-experience-internship-at-t-mobile-4481550778",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474467659",
      title: "2027 Summer Intern- Equipment Finance",
      company: "Apple Bank",
      location: "Iselin, NJ",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-equipment-finance-at-apple-bank-4474467659",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480069171",
      title: "Software Engineering AI Intern",
      company: "Vimo",
      location: "Atlanta, GA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-ai-intern-at-vimo-4480069171",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482428476",
      title: "Marketing & Video Intern",
      company: "SemiAnalysis",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/marketing-video-intern-at-semianalysis-4482428476",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480083436",
      title: "INTERN",
      company: "Community Bridges",
      location: "Watsonville, CA",
      url: "https://www.linkedin.com/jobs/view/intern-at-community-bridges-4480083436",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481155534",
      title: "Full Stack Developer Internship (Restaurant OS) \u2014 Fully Remote",
      company: "ZOVU",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/full-stack-developer-internship-restaurant-os-%E2%80%94-fully-remote-at-zovu-4481155534",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481164128",
      title: "UI/UX Design Intern (Restaurant OS) Miami",
      company: "ZOVU",
      location: "Miami, FL",
      url: "https://www.linkedin.com/jobs/view/ui-ux-design-intern-restaurant-os-miami-at-zovu-4481164128",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481159413",
      title: "UI/UX Design Intern (Restaurant OS) LA",
      company: "ZOVU",
      location: "Los Angeles, CA",
      url: "https://www.linkedin.com/jobs/view/ui-ux-design-intern-restaurant-os-la-at-zovu-4481159413",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479416695",
      title: "Copywriter Intern",
      company: "Hiebing",
      location: "Austin, TX",
      url: "https://www.linkedin.com/jobs/view/copywriter-intern-at-hiebing-4479416695",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482128805",
      title: "Fund Finance Summer Intern",
      company: "Sumitomo Mitsui Trust Bank Limited New York Branch",
      location: "New York, NY",
      url: "https://www.linkedin.com/jobs/view/fund-finance-summer-intern-at-sumitomo-mitsui-trust-bank-limited-new-york-branch-4482128805",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481168470",
      title: "2027 Summer Intern, Outreach Enablement (Reston, VA; New York, NY)",
      company: "ICF",
      location: "Reston, VA",
      url: "https://www.linkedin.com/jobs/view/2027-summer-intern-outreach-enablement-reston-va-new-york-ny-at-icf-4481168470",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482006869",
      title: "Summer 2027 Intern - AI Research",
      company: "Salesforce",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-intern-ai-research-at-salesforce-4482006869",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480704992",
      title: "Supply Chain Business Analytics Intern",
      company: "Advantage Solutions",
      location: "Greater St. Louis",
      url: "https://www.linkedin.com/jobs/view/supply-chain-business-analytics-intern-at-advantage-solutions-4480704992",
      postedAt: "2026-10-20T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482004170",
      title: "HR Intern",
      company: "Surya Sangam",
      location: "Delhi, OH",
      url: "https://www.linkedin.com/jobs/view/hr-intern-at-surya-sangam-4482004170",
      postedAt: "2026-10-20T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472374328",
      title: "Summer 2027 Business Analyst Intern",
      company: "Peraton",
      location: "San Diego, CA",
      url: "https://www.linkedin.com/jobs/view/summer-2027-business-analyst-intern-at-peraton-4472374328",
      postedAt: "2026-10-20T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480481291",
      title: "Intern Engineering Designer, Roads & Highways",
      company: "TYLin",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/intern-engineering-designer-roads-highways-at-tylin-4480481291",
      postedAt: "2026-10-20T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480293828",
      title: "GTM Intern",
      company: "Arcafeed (Acq. by Whop)",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/gtm-intern-at-arcafeed-acq-by-whop-4480293828",
      postedAt: "2026-10-20T00:00:00.000Z",
      workplaceType: null
    }
  ]
};

// src/data/scraped/linkedin-jobs.json
var linkedin_jobs_default = {
  scrapedAt: "2026-11-18T22:26:45.709Z",
  source: "LinkedIn",
  jobs: [
    {
      id: "4465226718",
      title: "Platform Full-Stack Engineer, New Grad 2027",
      company: "C3 AI",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/platform-full-stack-engineer-new-grad-2027-at-c3-ai-4465226718",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491881339",
      title: "Junior Full-Stack Software Engineer (Bilingual Mandarin/English)",
      company: "TalentXM AI",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/junior-full-stack-software-engineer-bilingual-mandarin-english-at-talentxm-ai-4491881339",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491779472",
      title: "Data Statistician",
      company: "Tesla",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/data-statistician-at-tesla-4491779472",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491771505",
      title: "Associate Clinical Information Analyst",
      company: "Abbott",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/associate-clinical-information-analyst-at-abbott-4491771505",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4476118044",
      title: "Software Development Engineer II \u2013 Life Hub (Super App) (New Grad / Early Career)",
      company: "IDMe",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-ii-%E2%80%93-life-hub-super-app-new-grad-early-career-at-idme-4476118044",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491791466",
      title: "Business Operations Analyst (Human Data)",
      company: "SpaceX Super Intelligence",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/business-operations-analyst-human-data-at-spacex-super-intelligence-4491791466",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474409095",
      title: "Software Business Analyst",
      company: "UL Solutions",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/software-business-analyst-at-ul-solutions-4474409095",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491883402",
      title: "Real Estate Marketing & Operations Assistant",
      company: "Spring Valley Partners",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/real-estate-marketing-operations-assistant-at-spring-valley-partners-4491883402",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475879887",
      title: "Mechanical Engineer I",
      company: "Therma",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-i-at-therma-4475879887",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484436262",
      title: "Recruiting Coordinator",
      company: "SpaceX Super Intelligence",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/recruiting-coordinator-at-spacex-super-intelligence-4484436262",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491801104",
      title: "Human Resources Coordinator - Security",
      company: "GardaWorld",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-coordinator-security-at-gardaworld-4491801104",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492084776",
      title: "Human Resources Payroll Coordinator",
      company: "4LEAF, Inc.",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-payroll-coordinator-at-4leaf-inc-4492084776",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492090409",
      title: "Human Resources Coordinator",
      company: "4LEAF, Inc.",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-coordinator-at-4leaf-inc-4492090409",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491895059",
      title: "Project Support Coordinator",
      company: "Sciens Building Solutions",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/project-support-coordinator-at-sciens-building-solutions-4491895059",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491324443",
      title: "Junior Project Coordinator - Construction",
      company: "Jobot",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/junior-project-coordinator-construction-at-jobot-4491324443",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490887929",
      title: "Founding Content Marketer",
      company: "Closr",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/founding-content-marketer-at-closr-4490887929",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491813148",
      title: "Materials Characterization Technician",
      company: "Carbon",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/materials-characterization-technician-at-carbon-4491813148",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492085771",
      title: "Resident Services Coordinator",
      company: "Abode",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/resident-services-coordinator-at-abode-4492085771",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491309758",
      title: "Consultant, Business Consulting - Banking & Digital",
      company: "Infosys",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/consultant-business-consulting-banking-digital-at-infosys-4491309758",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491816339",
      title: "Alcohol and Other Drug Prevention Coordinator - (Health Educator, Range I) - Health Promotion & Wellness",
      company: "San Francisco State University",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/alcohol-and-other-drug-prevention-coordinator-health-educator-range-i-health-promotion-wellness-at-san-francisco-state-university-4491816339",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491789320",
      title: "Paraeducator Life Skills, Special Ed - Santa Clara HS (QSS # 6851)",
      company: "Santa Clara Unified School District",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/paraeducator-life-skills-special-ed-santa-clara-hs-qss-%23-6851-at-santa-clara-unified-school-district-4491789320",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491876881",
      title: "Litigation Legal Assistant",
      company: "Robert Half",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/litigation-legal-assistant-at-robert-half-4491876881",
      postedAt: "2026-11-18T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490979233",
      title: "Junior Full Stack Software Engineer",
      company: "iSoftstone Malaysia",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/junior-full-stack-software-engineer-at-isoftstone-malaysia-4490979233",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483767136",
      title: "Software Engineer",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-at-paypal-4483767136",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490475875",
      title: "Engineering Analyst",
      company: "Russell Tobin",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/engineering-analyst-at-russell-tobin-4490475875",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491727163",
      title: "Early Careers: Software Developer Engineer",
      company: "Fortinet",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/early-careers-software-developer-engineer-at-fortinet-4491727163",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490967841",
      title: "Recruiting Coordinator",
      company: "Etched",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/recruiting-coordinator-at-etched-4490967841",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491424096",
      title: "Human Resources Coordinator",
      company: "Quanta Manufacturing Fremont",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-coordinator-at-quanta-manufacturing-fremont-4491424096",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490192885",
      title: "Business Operations Coordinator (GTM & Marketing)",
      company: "AB180 - \uC5D0\uC774\uBE44\uC77C\uD314\uACF5",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/business-operations-coordinator-gtm-marketing-at-ab180-%EC%97%90%EC%9D%B4%EB%B9%84%EC%9D%BC%ED%8C%94%EA%B3%B5-4490192885",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479438453",
      title: "Financial Analyst",
      company: "Air Apps",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/financial-analyst-at-air-apps-4479438453",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490465455",
      title: "Financial Management Asc - Early Career",
      company: "Lockheed Martin",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/financial-management-asc-early-career-at-lockheed-martin-4490465455",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4492012881",
      title: "Accounting Professional (AP)",
      company: "LG Display America, Inc.",
      location: "Cupertino, CA",
      url: "https://www.linkedin.com/jobs/view/accounting-professional-ap-at-lg-display-america-inc-4492012881",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491442606",
      title: "Program Coordinator",
      company: "Cadence",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/program-coordinator-at-cadence-4491442606",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491435763",
      title: "Project Coordinator, Engineering Operations",
      company: "Celestica",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-engineering-operations-at-celestica-4491435763",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490825540",
      title: "Utility Conservation/Efficiency Coordinator",
      company: "City of Santa Clara",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/utility-conservation-efficiency-coordinator-at-city-of-santa-clara-4490825540",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491735603",
      title: "Research Associate \u2013 Spatial Biology",
      company: "Omicsveu",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-%E2%80%93-spatial-biology-at-omicsveu-4491735603",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481473278",
      title: "Behavior Paraprofessional (26-27)",
      company: "Alpha Public Schools",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/behavior-paraprofessional-26-27-at-alpha-public-schools-4481473278",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483781583",
      title: "Research Associate",
      company: "BillionToOne",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-at-billiontoone-4483781583",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491434864",
      title: "\u{1F31F} Teacher Assistant \u2013 Autism Paraprofessional",
      company: "The Creekside School",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/%F0%9F%8C%9F-teacher-assistant-%E2%80%93-autism-paraprofessional-at-the-creekside-school-4491434864",
      postedAt: "2026-11-17T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491502827",
      title: "SmartCare Sales Operations Associate",
      company: "GForce Life Sciences",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/smartcare-sales-operations-associate-at-gforce-life-sciences-4491502827",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483186582",
      title: "Associate Software Engineer",
      company: "ServiceNow",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/associate-software-engineer-at-servicenow-4483186582",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490111270",
      title: "Opto-Mechanical Design Engineer (Precision Mechanism Design)",
      company: "KLA",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/opto-mechanical-design-engineer-precision-mechanism-design-at-kla-4490111270",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490605352",
      title: "Mechanical Hardware Engineer I Graduate",
      company: "Hewlett Packard Enterprise",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-hardware-engineer-i-graduate-at-hewlett-packard-enterprise-4490605352",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489741887",
      title: "Graduate Mechanical Engineer (Available 2027)",
      company: "Arup",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/graduate-mechanical-engineer-available-2027-at-arup-4489741887",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490940904",
      title: "Recruiting Coordinator",
      company: "Astranis Space Technologies",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/recruiting-coordinator-at-astranis-space-technologies-4490940904",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491543464",
      title: "Digital Communications Social Media Specialist I (Full-Time) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/digital-communications-social-media-specialist-i-full-time-united-states-at-cisco-4491543464",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490919538",
      title: "Marketing Operations Specialist",
      company: "InnoActive Group",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/marketing-operations-specialist-at-innoactive-group-4490919538",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4376567852",
      title: "Environmental Health Specialist I-II-III - Consumer Protection Programs",
      company: "County of San Mateo",
      location: "San Mateo County, CA",
      url: "https://www.linkedin.com/jobs/view/environmental-health-specialist-i-ii-iii-consumer-protection-programs-at-county-of-san-mateo-4376567852",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490955348",
      title: "Community Safety Ambassador",
      company: "Wu Yee Children's Services",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/community-safety-ambassador-at-wu-yee-children-s-services-4490955348",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489750158",
      title: "Graduate Electrical Engineer (Available 2027)",
      company: "Arup",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/graduate-electrical-engineer-available-2027-at-arup-4489750158",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490902645",
      title: "Paralegal/Administrative Assistant",
      company: "Barr & Douds Attorneys",
      location: "Danville, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-administrative-assistant-4490902645",
      postedAt: "2026-11-16T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475060264",
      title: "Software Engineer Graduate (Traffic Infrastructure)- 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-graduate-traffic-infrastructure-2027-start-at-bytedance-4475060264",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454659121",
      title: "Associate Supply Chain Analyst",
      company: "Analog Devices",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/associate-supply-chain-analyst-at-analog-devices-4454659121",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491204585",
      title: "Project Coordinator, External Programs, Optimus",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-external-programs-optimus-at-tesla-4491204585",
      postedAt: "2026-11-15T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475054517",
      title: "Software Development Engineer Graduate (Intent-Based Networking) - 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-graduate-intent-based-networking-2027-start-at-bytedance-4475054517",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4475042955",
      title: "Organizational Effectiveness Graduate (RD Mid-Platform) - 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/organizational-effectiveness-graduate-rd-mid-platform-2027-start-at-bytedance-4475042955",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489885943",
      title: "Data Scientist (PGC) - TikTok",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-pgc-tiktok-at-tiktok-4489885943",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4434149314",
      title: "Software Engineer, New Grad - Infrastructure",
      company: "Palantir Technologies",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-new-grad-infrastructure-at-palantir-technologies-4434149314",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4455922608",
      title: "Software Development Engineer \u2013 Embedded Systems 2026 (US)",
      company: "Amazon",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-%E2%80%93-embedded-systems-2026-us-at-amazon-4455922608",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491038465",
      title: "Human Resources Coordinator",
      company: "Stanford University School of Medicine",
      location: "Stanford, CA",
      url: "https://www.linkedin.com/jobs/view/human-resources-coordinator-at-stanford-university-school-of-medicine-4491038465",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483139636",
      title: "Analyst - Real Estate Investment",
      company: "Northwestern Mutual",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/analyst-real-estate-investment-at-northwestern-mutual-4483139636",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491033023",
      title: "Analyst, FP&A Business Operations",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/analyst-fp-a-business-operations-at-tesla-4491033023",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483105265",
      title: "Asset Management Analyst",
      company: "Prometheus Real Estate Group",
      location: "San Mateo, CA",
      url: "https://www.linkedin.com/jobs/view/asset-management-analyst-at-prometheus-real-estate-group-4483105265",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491096522",
      title: "Project Coordinator",
      company: "Mathews Mechanical",
      location: "Newark, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-at-mathews-mechanical-4491096522",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491083813",
      title: "Assistant Account Executive, Technology",
      company: "Zeno Group",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/assistant-account-executive-technology-at-zeno-group-4491083813",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488987779",
      title: "Product Marketing New College Grad - Masters Degree (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-new-college-grad-masters-degree-santa-clara-ca-at-applied-materials-4488987779",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466038372",
      title: "Hardware Design Engineer",
      company: "Supermicro",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/hardware-design-engineer-at-supermicro-4466038372",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489864502",
      title: "Research Associate, Biology",
      company: "Integrated Biosciences, Inc.",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-biology-at-integrated-biosciences-inc-4489864502",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4410910053",
      title: "Legal Support Specialist (IP)",
      company: "Pillsbury Winthrop Shaw Pittman LLP",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/legal-support-specialist-ip-at-pillsbury-winthrop-shaw-pittman-llp-4410910053",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4437433081",
      title: "Paralegal - Corporate",
      company: "DLA Piper",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/paralegal-corporate-at-dla-piper-4437433081",
      postedAt: "2026-11-14T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474587891",
      title: "Business Intelligence Analyst",
      company: "Snowflake",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-analyst-at-snowflake-4474587891",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454295809",
      title: "Audit Entry Level Accountant 2027",
      company: "Withum",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/audit-entry-level-accountant-2027-at-withum-4454295809",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489826902",
      title: "Marketing Coordinator - Full Time - Oakmont of Silver Creek",
      company: "Oakmont Senior Living",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-coordinator-full-time-oakmont-of-silver-creek-at-oakmont-senior-living-4489826902",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479219018",
      title: "Accounting Analyst",
      company: "3 Bridge Networks",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/accounting-analyst-at-3-bridge-networks-4479219018",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479159609",
      title: "Investments Analyst",
      company: "Interstate Equities Corporation",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/investments-analyst-at-interstate-equities-corporation-4479159609",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489587888",
      title: "Project Coordinator",
      company: "Infotree Global Solutions",
      location: "Cupertino, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-at-infotree-global-solutions-4489587888",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479600374",
      title: "Technical PR & Communications Specialist - AI & Enterprise Solutions",
      company: "ASUS",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/technical-pr-communications-specialist-ai-enterprise-solutions-at-asus-4479600374",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488596047",
      title: "Electrical Engineer New College Grad - BS/MS Degree (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-new-college-grad-bs-ms-degree-santa-clara-ca-at-applied-materials-4488596047",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4472329152",
      title: "Product Designer",
      company: "LangChain",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/product-designer-at-langchain-4472329152",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474560129",
      title: "Hardware UX Designer Graduate (PICO-Edge AI & Spatial Computing) - 2027 Start",
      company: "ByteDance",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/hardware-ux-designer-graduate-pico-edge-ai-spatial-computing-2027-start-at-bytedance-4474560129",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4447901616",
      title: "Product Designer Graduate (TikTok-Design) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-designer-graduate-tiktok-design-2027-start-at-tiktok-4447901616",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490557043",
      title: "Paralegal",
      company: "Modern Family Law",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-at-modern-family-law-4490557043",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489833345",
      title: "Preschool Teacher's Aide",
      company: "Kimber Hills Preschool",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/preschool-teacher-s-aide-at-kimber-hills-preschool-4489833345",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490540737",
      title: "Paralegal",
      company: "Modern Family Law",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-at-modern-family-law-4490540737",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482752382",
      title: "Corporate Paralegal",
      company: "SpaceX Super Intelligence",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/corporate-paralegal-at-spacex-super-intelligence-4482752382",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489581473",
      title: "Instructional Assistant",
      company: "Redwood City School District",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/instructional-assistant-at-redwood-city-school-district-4489581473",
      postedAt: "2026-11-13T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490080205",
      title: "Software Engineer - Virtual Platform",
      company: "Rubrik",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-virtual-platform-at-rubrik-4490080205",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4434142462",
      title: "Software Engineer, New Grad - Defense",
      company: "Palantir Technologies",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-new-grad-defense-at-palantir-technologies-4434142462",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484385338",
      title: "Logistics Automation New College Grad- Bachelor's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/logistics-automation-new-college-grad-bachelor-s-santa-clara-ca-at-applied-materials-4484385338",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4449977510",
      title: "Software Engineer Graduate (Global CRM) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-graduate-global-crm-2027-start-at-tiktok-4449977510",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481199551",
      title: "Analyst, Early Career (Full Stack)",
      company: "Affirm",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/analyst-early-career-full-stack-at-affirm-4481199551",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484378542",
      title: "Business Intelligence Analyst I, New College Grad- Bachelor's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-analyst-i-new-college-grad-bachelor-s-santa-clara-ca-at-applied-materials-4484378542",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454704486",
      title: "Associate Software Engineer - 2027 Start Dates",
      company: "Veeva Systems",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/associate-software-engineer-2027-start-dates-at-veeva-systems-4454704486",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4446281814",
      title: "Software Engineer Graduate (Transaction Platform) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-graduate-transaction-platform-2027-start-at-tiktok-4446281814",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489074049",
      title: "Mechanical Engineer",
      company: "LMK Recruiting Solutions",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-at-lmk-recruiting-solutions-4489074049",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484380511",
      title: "Mechanical / Systems Engineer (NCG)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-systems-engineer-ncg-at-applied-materials-4484380511",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484380529",
      title: "Mechanical Engineer New College Grad - Masters Degree (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-new-college-grad-masters-degree-santa-clara-ca-at-applied-materials-4484380529",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490505985",
      title: "Human Resources Assistant",
      company: "Pathways Personnel",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/human-resources-assistant-at-pathways-personnel-4490505985",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479445657",
      title: "2027 Investment Banking Analyst \u2013 Healthcare Biotech",
      company: "Piper Sandler",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-investment-banking-analyst-%E2%80%93-healthcare-biotech-at-piper-sandler-4479445657",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490525804",
      title: "Community Relations Representative",
      company: "Essex Property Trust",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/community-relations-representative-at-essex-property-trust-4490525804",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490058979",
      title: "Associate Scientist I",
      company: "Vaxcyte",
      location: "San Carlos, CA",
      url: "https://www.linkedin.com/jobs/view/associate-scientist-i-at-vaxcyte-4490058979",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4490523149",
      title: "Associate Engineer - Electrical",
      company: "Vector Atomic",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/associate-engineer-electrical-at-vector-atomic-4490523149",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484383381",
      title: "RF Electrical Engineer New College Grad- Master's (Santa Clara, CA)",
      company: "Applied Materials",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/rf-electrical-engineer-new-college-grad-master-s-santa-clara-ca-at-applied-materials-4484383381",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4473549548",
      title: "Product Designer",
      company: "Kikoff",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/product-designer-at-kikoff-4473549548",
      postedAt: "2026-11-12T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488229824",
      title: "Entry Level Software Developer-Different locations",
      company: "IBM",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/entry-level-software-developer-different-locations-at-ibm-4488229824",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454349781",
      title: "Data Scientist \u2013 Analytics",
      company: "AppLovin",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-%E2%80%93-analytics-at-applovin-4454349781",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489964547",
      title: "Software Engineering AMTS (College Grad)",
      company: "Salesforce",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineering-amts-college-grad-at-salesforce-4489964547",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452901177",
      title: "Software Engineer Graduate (Foundation Platform) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-graduate-foundation-platform-2027-start-at-tiktok-4452901177",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489989262",
      title: "Mechanical Engineer (New Grad 2027)",
      company: "Eight Sleep",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-engineer-new-grad-2027-at-eight-sleep-4489989262",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4447905369",
      title: "AI Product Designer Graduate (TikTok-Design) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/ai-product-designer-graduate-tiktok-design-2027-start-at-tiktok-4447905369",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4437421857",
      title: "Paralegal - Corporate",
      company: "DLA Piper",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-corporate-at-dla-piper-4437421857",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489691735",
      title: "11/12 Info Session Portal",
      company: "Think Academy U.S",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/11-12-info-session-portal-at-think-academy-u-s-4489691735",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489935592",
      title: "Grades Teaching Assistant (Full-Time)",
      company: "Waldorf School of the Peninsula",
      location: "Los Altos, CA",
      url: "https://www.linkedin.com/jobs/view/grades-teaching-assistant-full-time-at-waldorf-school-of-the-peninsula-4489935592",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481778183",
      title: "Paralegal",
      company: "Tenderloin Housing Clinic",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-at-tenderloin-housing-clinic-4481778183",
      postedAt: "2026-11-11T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488623374",
      title: "Operations Research Analyst",
      company: "PHI Hong USA",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/operations-research-analyst-at-phi-hong-usa-4488623374",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487826561",
      title: "Software Engineer",
      company: "WD",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-at-wd-4487826561",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481558846",
      title: "Software Development Engineer, Early Career - 2027 (US)",
      company: "Amazon",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-early-career-2027-us-at-amazon-4481558846",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487838380",
      title: "Cryogenic Mechanical Engineer",
      company: "PsiQuantum",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/cryogenic-mechanical-engineer-at-psiquantum-4487838380",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489191003",
      title: "Mechanical Design Engineer, Optimus Battery, Battery Engineering",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-design-engineer-optimus-battery-battery-engineering-at-tesla-4489191003",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487984826",
      title: "Associate, Business Operations & Analytics",
      company: "Jerry",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/associate-business-operations-analytics-at-jerry-4487984826",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488991823",
      title: "18 Reasons Program Coordinator VISTA",
      company: "AmeriCorps",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/18-reasons-program-coordinator-vista-at-americorps-4488991823",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487970987",
      title: "HEALTH PROGRAM SPECIALIST I JC-538461",
      company: "California Department of Public Health",
      location: "Contra Costa County, CA",
      url: "https://www.linkedin.com/jobs/view/health-program-specialist-i-jc-538461-at-california-department-of-public-health-4487970987",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478611891",
      title: "Communication Specialist",
      company: "Equinix",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/communication-specialist-at-equinix-4478611891",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489408404",
      title: "COMMUNITY HEALTH WORKER",
      company: "Axis Community Health",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/community-health-worker-at-axis-community-health-4489408404",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488645352",
      title: "Research Associate / Associate Scientist, Data Generation",
      company: "Divergence Labs",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/research-associate-associate-scientist-data-generation-at-divergence-labs-4488645352",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471568750",
      title: "ASIC Design Engineer - New College Grad 2027",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/asic-design-engineer-new-college-grad-2027-at-nvidia-4471568750",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471252270",
      title: "Electrical Engineer, Power Distribution",
      company: "KLA",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-power-distribution-at-kla-4471252270",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488396427",
      title: "Electrical Engineer 1",
      company: "Lam Research",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-1-at-lam-research-4488396427",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489196723",
      title: "Paraeducator (SLC) SPED",
      company: "Redwood City School District",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/paraeducator-slc-sped-at-redwood-city-school-district-4489196723",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488611209",
      title: "Paralegal",
      company: "Robert Half",
      location: "Berkeley, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-at-robert-half-4488611209",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489193200",
      title: "Paraeducator Student Attendant - Huerta (QSS 8152)",
      company: "Santa Clara Unified School District",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/paraeducator-student-attendant-huerta-qss-8152-at-santa-clara-unified-school-district-4489193200",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481241765",
      title: "Legal Writing Clerk",
      company: "Kimball, Tirey & St. John LLP",
      location: "Concord, CA",
      url: "https://www.linkedin.com/jobs/view/legal-writing-clerk-at-kimball-tirey-st-john-llp-4481241765",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478651249",
      title: "Paralegal",
      company: "Kahana Feld",
      location: "Walnut Creek, CA",
      url: "https://www.linkedin.com/jobs/view/paralegal-at-kahana-feld-4478651249",
      postedAt: "2026-11-10T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487171523",
      title: "Associate Data Scientist",
      company: "Jerry",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/associate-data-scientist-at-jerry-4487171523",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488827207",
      title: "Growth Associate",
      company: "Encord",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/growth-associate-at-encord-4488827207",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487938452",
      title: "Investment Analyst",
      company: "RETS Associates",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/investment-analyst-at-rets-associates-4487938452",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454246028",
      title: "Tax Entry Level Accountant 2027",
      company: "Withum",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/tax-entry-level-accountant-2027-at-withum-4454246028",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4489184104",
      title: "Outreach Specialist",
      company: "Insight Housing",
      location: "Martinez, CA",
      url: "https://www.linkedin.com/jobs/view/outreach-specialist-at-insight-housing-4489184104",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4491025076",
      title: "Community Health Worker",
      company: "Serene Health",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/community-health-worker-at-serene-health-4491025076",
      postedAt: "2026-11-09T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4454584413",
      title: "New Graduate Engineer, Software - '26/'27 (Starlink)",
      company: "SpaceX",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/new-graduate-engineer-software-26-27-starlink-at-spacex-4454584413",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488808096",
      title: "Resident Services Coordinator",
      company: "Abode",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/resident-services-coordinator-at-abode-4488808096",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486682728",
      title: "AI E-Commerce Content & Customer Success Specialist",
      company: "Jobot",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/ai-e-commerce-content-customer-success-specialist-at-jobot-4486682728",
      postedAt: "2026-11-08T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4444216120",
      title: "Software Engineer - Platform & Application",
      company: "Boson AI",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-platform-application-at-boson-ai-4444216120",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480524206",
      title: "Software Engineer 1",
      company: "Intuit",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-1-at-intuit-4480524206",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4461176162",
      title: "Software Engineer I, Entry-Level (Graduation Date: Fall 2026-Summer 2027) - US",
      company: "DoorDash",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-i-entry-level-graduation-date-fall-2026-summer-2027-us-at-doordash-4461176162",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487389637",
      title: "Early Career R&D Mechanical Engineer - National Security Products Center, NM/CA, Onsite",
      company: "Sandia National Laboratories",
      location: "Livermore, CA",
      url: "https://www.linkedin.com/jobs/view/early-career-r-d-mechanical-engineer-national-security-products-center-nm-ca-onsite-at-sandia-national-laboratories-4487389637",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470730494",
      title: "October 2027 Tax Associate - San Jose",
      company: "Frank, Rimerman + Co. LLP",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/october-2027-tax-associate-san-jose-at-frank-rimerman-%2B-co-llp-4470730494",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488474145",
      title: "Associate NVH Test Engineer",
      company: "Tesla",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/associate-nvh-test-engineer-at-tesla-4488474145",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4442918369",
      title: "RTL Power Optimization Engineer \u2013 New College Grad 2026",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/rtl-power-optimization-engineer-%E2%80%93-new-college-grad-2026-at-nvidia-4442918369",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4470103129",
      title: "Product Designer",
      company: "C3 AI",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/product-designer-at-c3-ai-4470103129",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487613050",
      title: "Teacher Assistant - Palm Academy",
      company: "Christian Career Center",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/teacher-assistant-palm-academy-at-christian-career-center-4487613050",
      postedAt: "2026-11-07T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4414662269",
      title: "Business Intelligence Data Analyst",
      company: "Hyve Solutions",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-data-analyst-at-hyve-solutions-4414662269",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480122576",
      title: "Product Design Engineer (Early Career)",
      company: "Skydio",
      location: "San Mateo, CA",
      url: "https://www.linkedin.com/jobs/view/product-design-engineer-early-career-at-skydio-4480122576",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4452767437",
      title: "Entry-level Mechanical Engineer",
      company: "Salas O'Brien",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/entry-level-mechanical-engineer-at-salas-o-brien-4452767437",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487338669",
      title: "Social Media Coordinator",
      company: "k2o",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/social-media-coordinator-at-k2o-4487338669",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486268064",
      title: "Youth Prevention Navigator",
      company: "Public Health Institute",
      location: "Berkeley, CA",
      url: "https://www.linkedin.com/jobs/view/youth-prevention-navigator-at-public-health-institute-4486268064",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488413683",
      title: "Event Communications Coordinator",
      company: "cred.",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/event-communications-coordinator-at-cred-4488413683",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488454567",
      title: "Public Information Representative I/ II - Library Department",
      company: "City of San Jos\xE9",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/public-information-representative-i-ii-library-department-at-city-of-san-jos%C3%A9-4488454567",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469072068",
      title: "Electronic Engineer I",
      company: "Advanced Energy",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/electronic-engineer-i-at-advanced-energy-4469072068",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479890437",
      title: "Electrical Engineer, Avionics",
      company: "Zipline",
      location: "South San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-avionics-at-zipline-4479890437",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460455049",
      title: "Product Designer, Meta",
      company: "Meta",
      location: "Menlo Park, CA",
      url: "https://www.linkedin.com/jobs/view/product-designer-meta-at-meta-4460455049",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487329765",
      title: "Product Designer",
      company: "Moxo",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/product-designer-at-moxo-4487329765",
      postedAt: "2026-11-06T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488039504",
      title: "Clinical Data Analyst",
      company: "MaximaTek",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/clinical-data-analyst-at-maximatek-4488039504",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479723612",
      title: "MRT Data Analysis Specialist - Mental Health 353",
      company: "Telecare Corporation",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/mrt-data-analysis-specialist-mental-health-353-at-telecare-corporation-4479723612",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481756467",
      title: "Project Analyst",
      company: "Quick Release_",
      location: "Newark, CA",
      url: "https://www.linkedin.com/jobs/view/project-analyst-at-quick-release-4481756467",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486932248",
      title: "Marketing Coordinator - Ivy Park at San Jose",
      company: "Oakmont Senior Living",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-coordinator-ivy-park-at-san-jose-at-oakmont-senior-living-4486932248",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4488028811",
      title: "Marketing Coordinator",
      company: "groundcover",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/marketing-coordinator-at-groundcover-4488028811",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486787582",
      title: "Park Interpreter",
      company: "County of Santa Clara",
      location: "Santa Clara County, CA",
      url: "https://www.linkedin.com/jobs/view/park-interpreter-at-county-of-santa-clara-4486787582",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4479594197",
      title: "Community Outreach Coordinator",
      company: "Fleet Feet",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/community-outreach-coordinator-at-fleet-feet-4479594197",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486573546",
      title: "2027 Campus_Analog and Mixed Signal Design",
      company: "MediaTek",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/2027-campus-analog-and-mixed-signal-design-at-mediatek-4486573546",
      postedAt: "2026-11-05T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467962883",
      title: "Data Scientist",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-at-paypal-4467962883",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4449548361",
      title: "Software Engineer Graduate (Search) - 2027 Start",
      company: "TikTok USDS Joint Venture",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-graduate-search-2027-start-at-tiktok-usds-joint-venture-4449548361",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469047841",
      title: "(General Hire) HR Operations Lifecycle Graduate (Global HR Operation) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/general-hire-hr-operations-lifecycle-graduate-global-hr-operation-2027-start-at-tiktok-4469047841",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4460044993",
      title: "2027 Full-Time Analyst, Valuations & Opinions Group",
      company: "Lincoln International",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-full-time-analyst-valuations-opinions-group-at-lincoln-international-4460044993",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486325748",
      title: "Laboratory Technician",
      company: "Centrillion Tech",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/laboratory-technician-at-centrillion-tech-4486325748",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478596774",
      title: "Research Technician (tissue processing and cell culture)",
      company: "Retro Biosciences",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/research-technician-tissue-processing-and-cell-culture-at-retro-biosciences-4478596774",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4463249226",
      title: "Product Designer (UX/UI)",
      company: "Wanderboat AI",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/product-designer-ux-ui-at-wanderboat-ai-4463249226",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486532556",
      title: "Paraeducator - High School (26-27)",
      company: "KIPP Public Schools Northern California",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/paraeducator-high-school-26-27-at-kipp-public-schools-northern-california-4486532556",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487208870",
      title: "Life Science Research Professional 1",
      company: "Stanford University School of Medicine",
      location: "Stanford, CA",
      url: "https://www.linkedin.com/jobs/view/life-science-research-professional-1-at-stanford-university-school-of-medicine-4487208870",
      postedAt: "2026-11-04T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4466433020",
      title: "Business Immigration Data and Content Analyst",
      company: "Fragomen",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/business-immigration-data-and-content-analyst-at-fragomen-4466433020",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486055895",
      title: "Associate, GMS Tax Technology Business Analyst",
      company: "KPMG US",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/associate-gms-tax-technology-business-analyst-at-kpmg-us-4486055895",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483325065",
      title: "Referral Coordinator",
      company: "Premise Health",
      location: "Foster City, CA",
      url: "https://www.linkedin.com/jobs/view/referral-coordinator-at-premise-health-4483325065",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4487071183",
      title: "Street Health Outreach Community Health Worker",
      company: "Tiburcio Vasquez Health Center",
      location: "Union City, CA",
      url: "https://www.linkedin.com/jobs/view/street-health-outreach-community-health-worker-at-tiburcio-vasquez-health-center-4487071183",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486494925",
      title: "Financial Analyst I",
      company: "Williams-Sonoma, Inc.",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/financial-analyst-i-at-williams-sonoma-inc-4486494925",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467184016",
      title: "Content Designer I",
      company: "Illumio",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/content-designer-i-at-illumio-4467184016",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4414655977",
      title: "Business Immigration Analyst (Paralegal)",
      company: "Fragomen",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/business-immigration-analyst-paralegal-at-fragomen-4414655977",
      postedAt: "2026-11-03T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477684324",
      title: "Field Marketing Operations Coordinator",
      company: "Renewal by Andersen Metro & Midwest",
      location: "Hayward, CA",
      url: "https://www.linkedin.com/jobs/view/field-marketing-operations-coordinator-at-renewal-by-andersen-metro-midwest-4477684324",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4421867040",
      title: "Analyst - Healthcare",
      company: "Lazard",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/analyst-healthcare-at-lazard-4421867040",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485268126",
      title: "Accountant I/II",
      company: "City of San Jos\xE9",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/accountant-i-ii-at-city-of-san-jos%C3%A9-4485268126",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485760832",
      title: "Family Resource Specialist-Bilingual",
      company: "East Bay Agency for Children",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/family-resource-specialist-bilingual-at-east-bay-agency-for-children-4485760832",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486441324",
      title: "Research Associate",
      company: "AccuScan Sciences",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-at-accuscan-sciences-4486441324",
      postedAt: "2026-11-02T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485928306",
      title: "Robotics Mechanical Design Engineer, Structures & Mechanisms, Optimus",
      company: "Tesla",
      location: "Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/robotics-mechanical-design-engineer-structures-mechanisms-optimus-at-tesla-4485928306",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485926349",
      title: "Operations Coordinator, People Systems & Analytics",
      company: "Tesla",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/operations-coordinator-people-systems-analytics-at-tesla-4485926349",
      postedAt: "2026-11-01T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485689739",
      title: "Software Development Engineer (Database) Early Career- 2027 (US)",
      company: "Amazon",
      location: "East Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/software-development-engineer-database-early-career-2027-us-at-amazon-4485689739",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4450736912",
      title: "Construction Assistant",
      company: "HITT Contracting Inc.",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/construction-assistant-at-hitt-contracting-inc-4450736912",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469275385",
      title: "Instructional Aide",
      company: "Spectrum Center Schools and Programs",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/instructional-aide-at-spectrum-center-schools-and-programs-4469275385",
      postedAt: "2026-10-31T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4478378313",
      title: "Associate Software Engineer - Consumer Application",
      company: "Sandisk",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/associate-software-engineer-consumer-application-at-sandisk-4478378313",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4459611323",
      title: "Product Marketing Specialist",
      company: "Delta Electronics Americas",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/product-marketing-specialist-at-delta-electronics-americas-4459611323",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4456968944",
      title: "2027 July Strategic Insights Full Time Analyst (San Francisco)",
      company: "Financial Technology Partners / FT Partners",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/2027-july-strategic-insights-full-time-analyst-san-francisco-at-financial-technology-partners-ft-partners-4456968944",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485277338",
      title: "Coordinator, Email Marketing",
      company: "TATCHA",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/coordinator-email-marketing-at-tatcha-4485277338",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481902669",
      title: "Financial Analyst - Portfolio Management",
      company: "MAVERIQ Capital Group LLC",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/financial-analyst-portfolio-management-at-maveriq-capital-group-llc-4481902669",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483495958",
      title: "Health Educator I",
      company: "Public Health Institute",
      location: "Oakland, CA",
      url: "https://www.linkedin.com/jobs/view/health-educator-i-at-public-health-institute-4483495958",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485390693",
      title: "Community Health Worker",
      company: "COPE Health Solutions",
      location: "Salinas, CA",
      url: "https://www.linkedin.com/jobs/view/community-health-worker-at-cope-health-solutions-4485390693",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485646314",
      title: "Project Coordinator",
      company: "Vector Atomic",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-at-vector-atomic-4485646314",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483456163",
      title: "Project Assistant",
      company: "Foxsemicon Technology LLC",
      location: "Union City, CA",
      url: "https://www.linkedin.com/jobs/view/project-assistant-at-foxsemicon-technology-llc-4483456163",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4486484305",
      title: "Community Health Worker",
      company: "Serene Health",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/community-health-worker-at-serene-health-4486484305",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485643320",
      title: "Environmental Outreach Coordinator",
      company: "GreenWaste",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/environmental-outreach-coordinator-at-greenwaste-4485643320",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4448923600",
      title: "Marketing Assistant",
      company: "The Whiting-Turner Contracting Company",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/marketing-assistant-at-the-whiting-turner-contracting-company-4448923600",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485102631",
      title: "Research Associate- Analytical Chemistry",
      company: "Sapho Bio",
      location: "San Carlos, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-analytical-chemistry-at-sapho-bio-4485102631",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485284525",
      title: "Electrical Engineer (Early Career)",
      company: "Noble Machines",
      location: "Sunnyvale, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-early-career-at-noble-machines-4485284525",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4388400374",
      title: "Special Education School Aide",
      company: "Pacific Autism Center for Education",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/special-education-school-aide-at-pacific-autism-center-for-education-4388400374",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485623515",
      title: "Immigration Paralegal (FT)",
      company: "Chugh, LLP",
      location: "Santa Clara, CA",
      url: "https://www.linkedin.com/jobs/view/immigration-paralegal-ft-at-chugh-llp-4485623515",
      postedAt: "2026-10-30T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4450031020",
      title: "Associate Software Engineer (College Grad 2027)",
      company: "Solace",
      location: "Redwood City, CA",
      url: "https://www.linkedin.com/jobs/view/associate-software-engineer-college-grad-2027-at-solace-4450031020",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4467957285",
      title: "Data Scientist - Payments Risk Management & Data analytics",
      company: "PayPal",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/data-scientist-payments-risk-management-data-analytics-at-paypal-4467957285",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484566160",
      title: "Business Intelligence Technical Analyst - Trust and Safety",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/business-intelligence-technical-analyst-trust-and-safety-at-tiktok-4484566160",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4446630171",
      title: "Software Engineer Graduate (Tech and Product, USDS) - 2027 Start",
      company: "TikTok USDS Joint Venture",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/software-engineer-graduate-tech-and-product-usds-2027-start-at-tiktok-usds-joint-venture-4446630171",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4474136165",
      title: "Mechanical Design Engineer",
      company: "Cooler Master USA",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/mechanical-design-engineer-at-cooler-master-usa-4474136165",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482035067",
      title: "Franchise Field Marketing Coordinator",
      company: "OHG Brands",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/franchise-field-marketing-coordinator-at-ohg-brands-4482035067",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484770679",
      title: "Financial Accounting Operations Controllership Consultant",
      company: "Deloitte",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/financial-accounting-operations-controllership-consultant-at-deloitte-4484770679",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4485202278",
      title: "Hardware Engineer I (Full-Time) - United States",
      company: "Cisco",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/hardware-engineer-i-full-time-united-states-at-cisco-4485202278",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484524831",
      title: "Forward Deployed UX Designer",
      company: "Air",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/forward-deployed-ux-designer-at-air-4484524831",
      postedAt: "2026-10-29T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484147230",
      title: "Product Strategist Graduate (TikTok - Product - Business Analytics) - 2027 Start",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/product-strategist-graduate-tiktok-product-business-analytics-2027-start-at-tiktok-4484147230",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484114459",
      title: "Strategic Events Coordinator",
      company: "MaintainX",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/strategic-events-coordinator-at-maintainx-4484114459",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482514343",
      title: "Design Technologist",
      company: "Abaka AI",
      location: "Mountain View, CA",
      url: "https://www.linkedin.com/jobs/view/design-technologist-at-abaka-ai-4482514343",
      postedAt: "2026-10-28T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4471529479",
      title: "Human Resources Coordinator",
      company: "Serena & Lily",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/human-resources-coordinator-at-serena-lily-4471529479",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483806581",
      title: "Project Coordinator",
      company: "Underground Construction Co., Inc.",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-at-underground-construction-co-inc-4483806581",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4484224332",
      title: "Electrical Engineer (Early Career)",
      company: "Farcast",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/electrical-engineer-early-career-at-farcast-4484224332",
      postedAt: "2026-10-27T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483206165",
      title: "Project Coordinator",
      company: "Sciens Building Solutions",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/project-coordinator-at-sciens-building-solutions-4483206165",
      postedAt: "2026-10-26T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481431734",
      title: "Legal Assistant",
      company: "Phillips Spallas & Angstadt LLP",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/legal-assistant-at-phillips-spallas-angstadt-llp-4481431734",
      postedAt: "2026-10-26T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483186095",
      title: "Recruiting Coordinator",
      company: "Muon Space",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/recruiting-coordinator-at-muon-space-4483186095",
      postedAt: "2026-10-24T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4483110039",
      title: "Technical Operations & Workforce Program Analyst \u2013 Trainee",
      company: "Iron Systems, Inc",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/technical-operations-workforce-program-analyst-%E2%80%93-trainee-at-iron-systems-inc-4483110039",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482806682",
      title: "HR Business Partner Associate \u2013 Field Workforce",
      company: "Iron Systems, Inc",
      location: "Pleasanton, CA",
      url: "https://www.linkedin.com/jobs/view/hr-business-partner-associate-%E2%80%93-field-workforce-at-iron-systems-inc-4482806682",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481950881",
      title: "Accounting Specialist",
      company: "Robert Half",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/accounting-specialist-at-robert-half-4481950881",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482756477",
      title: "Financial Analyst",
      company: "Precise Financial Management Services Ltd.",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/financial-analyst-at-precise-financial-management-services-ltd-4482756477",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481962828",
      title: "User Researcher",
      company: "TikTok",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/user-researcher-at-tiktok-4481962828",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482835234",
      title: "Research Associate I",
      company: "SeqMatic LLC.",
      location: "Fremont, CA",
      url: "https://www.linkedin.com/jobs/view/research-associate-i-at-seqmatic-llc-4482835234",
      postedAt: "2026-10-23T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482198407",
      title: "In-House Marketing Coordinator",
      company: "Travel + Leisure Co.",
      location: "San Francisco, CA",
      url: "https://www.linkedin.com/jobs/view/in-house-marketing-coordinator-at-travel-%2B-leisure-co-4482198407",
      postedAt: "2026-10-22T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4481132779",
      title: "Business System Analyst (French)",
      company: "Odoo",
      location: "San Francisco Bay Area",
      url: "https://www.linkedin.com/jobs/view/business-system-analyst-french-at-odoo-4481132779",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4482157446",
      title: "Human Resource Associate",
      company: "Sagent Management",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/human-resource-associate-at-sagent-management-4482157446",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4477882040",
      title: "Bachelors - Finance & Accounting Rotation Program (2027 New College Graduates)",
      company: "Sandisk",
      location: "Milpitas, CA",
      url: "https://www.linkedin.com/jobs/view/bachelors-finance-accounting-rotation-program-2027-new-college-graduates-at-sandisk-4477882040",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4469799477",
      title: "Academic Interventionist (26-27)",
      company: "Alpha Public Schools",
      location: "San Jose, CA",
      url: "https://www.linkedin.com/jobs/view/academic-interventionist-26-27-at-alpha-public-schools-4469799477",
      postedAt: "2026-10-21T00:00:00.000Z",
      workplaceType: null
    },
    {
      id: "4480411394",
      title: "Paraeducator - K-8 (26-27)",
      company: "KIPP Public Schools Northern California",
      location: "East Palo Alto, CA",
      url: "https://www.linkedin.com/jobs/view/paraeducator-k-8-26-27-at-kipp-public-schools-northern-california-4480411394",
      postedAt: "2026-10-20T00:00:00.000Z",
      workplaceType: null
    }
  ]
};

// src/data/linkedinCatalog.ts
var LINKEDIN_SCRAPED_AT = linkedin_internships_default.scrapedAt;
var internships = selectLinkedinJobs(linkedin_internships_default.jobs).map(
  (job) => linkedinJobToResource(job, linkedin_internships_default.scrapedAt, "Internship")
);
var jobs = selectLinkedinJobs(linkedin_jobs_default.jobs).map(
  (job) => linkedinJobToResource(job, linkedin_jobs_default.scrapedAt, "Job")
);
var linkedinResources = [...internships, ...jobs];

// src/data/resources.ts
var BRAVEN_URL = "https://bebraven.org/";
var SJSU_URL = "https://www.sjsu.edu/careercenter/";
var HANDSHAKE_URL = "https://joinhandshake.com/";
var IDEALIST_URL = "https://www.idealist.org/";
var curatedResources = [
  {
    id: "braven-career-accelerator",
    title: "Braven Career Accelerator Course",
    summary: "A course that builds the skills, confidence, and network to land a strong first job.",
    description: "Braven partners with universities to offer a Career Accelerator course focused on career readiness. Students work in small cohorts on skills like storytelling, networking, and interviewing. Check Braven's site for details on partner campuses.",
    whoItsFor: [
      "Undergraduates at partner universities",
      "First-generation college students",
      "Students unsure where to start"
    ],
    resourceType: "Workshop",
    source: "Braven",
    sourceUrl: BRAVEN_URL,
    url: BRAVEN_URL,
    majors: MAJORS,
    interests: ["Social Impact", "Consulting", "Product Management", "Marketing"],
    location: "Hybrid",
    tags: ["career readiness", "cohort", "skills"],
    featured: true,
    isDemo: false
  },
  {
    id: "braven-leadership-coaching",
    title: "Braven Leadership Coaching",
    summary: "Work with a volunteer professional coach who guides a small cohort through career milestones.",
    description: "Braven pairs student cohorts with volunteer Leadership Coaches from a range of industries. Coaches offer feedback, accountability, and real-world perspective as students plan their next steps.",
    whoItsFor: ["Braven Fellows", "Students who want a mentor", "Career changers"],
    resourceType: "Mentorship",
    source: "Braven",
    sourceUrl: BRAVEN_URL,
    url: BRAVEN_URL,
    majors: MAJORS,
    interests: ["Social Impact", "Human Resources", "Consulting"],
    location: "Hybrid",
    tags: ["mentorship", "coaching", "feedback"],
    featured: false,
    isDemo: false
  },
  {
    id: "braven-professional-network",
    title: "Braven Professional Network",
    summary: "Connect with Braven alumni, coaches, and employer partners to grow your network.",
    description: "Braven helps students build social capital by connecting them with professionals and employer partners. Building relationships early can open doors to informational interviews, referrals, and internships.",
    whoItsFor: ["Braven Fellows and alumni", "Students building a network"],
    resourceType: "Networking",
    source: "Braven",
    sourceUrl: BRAVEN_URL,
    url: BRAVEN_URL,
    majors: MAJORS,
    interests: ["Social Impact", "Finance", "Marketing", "Software Engineering"],
    location: "Remote",
    tags: ["networking", "alumni", "social capital"],
    featured: false,
    isDemo: false
  },
  {
    id: "sjsu-resume-review",
    title: "SJSU Career Center Resume Review",
    summary: "Get personalized feedback on your resume and cover letter from SJSU career staff.",
    description: "The SJSU Career Center offers resume and cover letter support for students. Advisors can help you tailor your materials to specific roles. Visit the Career Center site for current ways to book a review.",
    whoItsFor: ["SJSU students", "Anyone applying for internships", "First-time job seekers"],
    resourceType: "Resume Help",
    source: "SJSU Career Center",
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ["Software Engineering", "Marketing", "Finance", "Healthcare"],
    location: "In-Person",
    tags: ["resume", "cover letter", "feedback", "advising"],
    featured: true,
    isDemo: false
  },
  {
    id: "sjsu-mock-interviews",
    title: "SJSU Mock Interviews",
    summary: "Practice interviewing and get constructive feedback before the real thing.",
    description: "The SJSU Career Center provides mock interview practice so students can rehearse answers and build confidence. Feedback can cover both content and delivery.",
    whoItsFor: ["SJSU students", "Students with upcoming interviews"],
    resourceType: "Interview Prep",
    source: "SJSU Career Center",
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ["Consulting", "Finance", "Product Management", "Human Resources"],
    location: "In-Person",
    tags: ["interviews", "practice", "feedback"],
    featured: false,
    isDemo: false
  },
  {
    id: "sjsu-career-fairs",
    title: "SJSU Career Fairs",
    summary: "Meet employers recruiting SJSU students for internships and full-time roles.",
    description: "The SJSU Career Center hosts career fairs where students can meet recruiters across industries. Prepare your elevator pitch and resume ahead of time. Check the Career Center site for upcoming fair dates.",
    whoItsFor: ["SJSU students", "Job and internship seekers"],
    resourceType: "Networking",
    source: "SJSU Career Center",
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ["Software Engineering", "Data Science", "Finance", "Marketing", "Healthcare"],
    location: "In-Person",
    tags: ["career fair", "recruiters", "employers"],
    featured: false,
    isDemo: false
  },
  {
    id: "sjsu-career-advising",
    title: "SJSU Career Advising & Exploration",
    summary: "Meet with a career advisor to explore majors, careers, and next steps.",
    description: "Career advisors at SJSU help students connect their interests and strengths to possible career paths. Advising is a good first step if you are undecided or considering a change.",
    whoItsFor: ["Undecided students", "SJSU students exploring options"],
    resourceType: "Career Exploration",
    source: "SJSU Career Center",
    sourceUrl: SJSU_URL,
    url: SJSU_URL,
    majors: MAJORS,
    interests: ["Product Management", "Consulting", "Human Resources", "Social Impact"],
    location: "Hybrid",
    tags: ["advising", "exploration", "planning"],
    featured: false,
    isDemo: false
  },
  {
    id: "handshake-job-board",
    title: "Handshake Job & Internship Board",
    summary: "Search internships and entry-level jobs from employers recruiting college students.",
    description: "Handshake is a career platform where students can find jobs, internships, and employer events. Many universities use it for campus recruiting. Complete your profile so employers can find you.",
    whoItsFor: ["College students", "Recent graduates", "Internship seekers"],
    resourceType: "Job",
    source: "Handshake",
    sourceUrl: HANDSHAKE_URL,
    url: HANDSHAKE_URL,
    majors: MAJORS,
    interests: ["Software Engineering", "Data Science", "Marketing", "Finance", "UX Design"],
    location: "Remote",
    tags: ["jobs", "internships", "job board", "recruiting"],
    featured: true,
    isDemo: false
  },
  {
    id: "linkedin-learning",
    title: "LinkedIn Learning Courses",
    summary: "On-demand video courses on business, technology, and creative skills.",
    description: "LinkedIn Learning offers a large library of courses taught by industry experts. Topics range from spreadsheets and project management to design and programming. Some universities and libraries provide free access.",
    whoItsFor: ["Students building job skills", "Self-paced learners"],
    resourceType: "Workshop",
    source: "LinkedIn Learning",
    sourceUrl: "https://www.linkedin.com/learning/",
    url: "https://www.linkedin.com/learning/",
    majors: MAJORS,
    interests: ["Marketing", "Product Management", "UX Design", "Human Resources"],
    location: "Remote",
    tags: ["online courses", "skills", "self-paced"],
    featured: false,
    isDemo: false
  },
  {
    id: "google-interview-warmup",
    title: "Google Interview Warmup",
    summary: "Practice answering interview questions out loud and get AI-powered insights.",
    description: "Interview Warmup is a free tool from Google that lets you practice answering common interview questions. It transcribes your answers and highlights patterns to help you improve.",
    whoItsFor: ["Anyone preparing for interviews", "Students new to interviewing"],
    resourceType: "Interview Prep",
    source: "Google",
    sourceUrl: "https://grow.google/",
    url: "https://grow.google/certificates/interview-warmup/",
    majors: MAJORS,
    interests: ["Software Engineering", "Data Science", "UX Design", "Marketing"],
    location: "Remote",
    tags: ["interviews", "practice", "free"],
    featured: true,
    isDemo: false
  },
  {
    id: "onet-online",
    title: "O*NET OnLine Career Explorer",
    summary: "Explore detailed occupation profiles, skills, and related careers.",
    description: "O*NET OnLine, sponsored by the U.S. Department of Labor, describes the tasks, skills, and knowledge required for hundreds of occupations. Use it to compare careers and discover related paths.",
    whoItsFor: ["Undecided students", "Anyone researching careers"],
    resourceType: "Career Exploration",
    source: "U.S. Department of Labor",
    sourceUrl: "https://www.onetonline.org/",
    url: "https://www.onetonline.org/",
    majors: MAJORS,
    interests: ["Healthcare", "Human Resources", "Consulting", "Social Impact"],
    location: "Remote",
    tags: ["career research", "occupations", "skills"],
    featured: false,
    isDemo: false
  },
  {
    id: "bls-occupational-outlook",
    title: "BLS Occupational Outlook Handbook",
    summary: "Look up pay, job outlook, and education requirements for hundreds of careers.",
    description: "The Occupational Outlook Handbook from the U.S. Bureau of Labor Statistics covers what workers do, typical pay, and projected job growth. It is a reliable starting point for comparing career options.",
    whoItsFor: ["Students comparing careers", "Anyone curious about salaries"],
    resourceType: "Career Exploration",
    source: "U.S. Department of Labor",
    sourceUrl: "https://www.bls.gov/",
    url: "https://www.bls.gov/ooh/",
    majors: MAJORS,
    interests: ["Finance", "Healthcare", "Data Science", "Software Engineering"],
    location: "Remote",
    tags: ["salary data", "job outlook", "career research"],
    featured: false,
    isDemo: false
  },
  {
    id: "kaggle-learn",
    title: "Kaggle Learn Micro-Courses",
    summary: "Free, hands-on micro-courses in Python, SQL, machine learning, and data viz.",
    description: "Kaggle Learn offers short, practical courses that run in the browser. They are a quick way to build data skills and start a portfolio of notebooks.",
    whoItsFor: ["Aspiring data scientists", "Students learning Python or SQL"],
    resourceType: "Workshop",
    source: "Kaggle",
    sourceUrl: "https://www.kaggle.com/",
    url: "https://www.kaggle.com/learn",
    majors: ["Computer Science", "Economics", "Engineering", "Biology", "Business"],
    interests: ["Data Science", "Software Engineering"],
    location: "Remote",
    tags: ["python", "sql", "machine learning", "free"],
    featured: false,
    isDemo: false
  },
  {
    id: "leetcode-practice",
    title: "LeetCode Coding Interview Practice",
    summary: "Practice data structures and algorithms problems common in technical interviews.",
    description: "LeetCode hosts a large set of coding problems used to prepare for technical interviews. Many problems are free, and community discussions show multiple approaches.",
    whoItsFor: ["CS and engineering students", "Software internship applicants"],
    resourceType: "Interview Prep",
    source: "LeetCode",
    sourceUrl: "https://leetcode.com/",
    url: "https://leetcode.com/",
    majors: ["Computer Science", "Engineering"],
    interests: ["Software Engineering", "Data Science"],
    location: "Remote",
    tags: ["coding", "algorithms", "technical interviews"],
    featured: false,
    isDemo: false
  },
  {
    id: "idealist-social-impact",
    title: "Idealist Nonprofit Jobs & Internships",
    summary: "Find jobs, internships, and volunteer roles at nonprofits and mission-driven orgs.",
    description: "Idealist lists opportunities with nonprofits and social-impact organizations. It is a strong option for students who want their work to serve a community cause.",
    whoItsFor: ["Students interested in nonprofits", "Volunteers", "Social-impact seekers"],
    resourceType: "Internship",
    source: "Idealist",
    sourceUrl: IDEALIST_URL,
    url: IDEALIST_URL,
    majors: ["Psychology", "Communications", "Business", "Economics", "Biology"],
    interests: ["Social Impact", "Human Resources", "Marketing"],
    location: "Hybrid",
    tags: ["nonprofit", "volunteer", "social impact"],
    featured: true,
    isDemo: false
  },
  {
    id: "usajobs-pathways",
    title: "USAJOBS Pathways for Students",
    summary: "Explore federal internships and early-career roles through the Pathways Programs.",
    description: "USAJOBS is the official job site of the U.S. federal government. Its Pathways Programs are designed for students and recent graduates interested in public service careers.",
    whoItsFor: ["U.S. citizens in college", "Recent graduates", "Public service seekers"],
    resourceType: "Internship",
    source: "USAJOBS",
    sourceUrl: "https://www.usajobs.gov/",
    url: "https://www.usajobs.gov/",
    majors: MAJORS,
    interests: ["Social Impact", "Healthcare", "Finance", "Data Science"],
    location: "In-Person",
    tags: ["government", "federal", "public service", "internships"],
    featured: false,
    isDemo: false
  }
];
var curatedIds = new Set(curatedResources.map((resource) => resource.id));
var resources = [
  ...curatedResources,
  // A hand-written entry wins if a scraped listing has the same id.
  ...sjsuResources.filter((resource) => !curatedIds.has(resource.id)),
  ...linkedinResources
];

// src/lib/chat/server.ts
var NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
var DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";
var MAX_MESSAGES = 20;
var MAX_TOKENS = 1200;
var MAX_CONTENT = 800;
var MAX_ASSISTANT_CONTENT = 3e3;
var MAX_INTERESTS = 8;
var RATE_LIMIT = 20;
var RATE_WINDOW_MS = 10 * 60 * 1e3;
var TIMEOUT_MS = 25e3;
var STREAM_TIMEOUT_MS = 6e4;
var UPSTREAM_ERROR = "The assistant could not answer right now. Please try again.";
var STOPWORDS = /* @__PURE__ */ new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "has",
  "him",
  "his",
  "how",
  "its",
  "who",
  "did",
  "get",
  "may",
  "new",
  "now",
  "see",
  "way",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "about",
  "any",
  "does",
  "have",
  "that",
  "this",
  "there",
  "their",
  "they",
  "them",
  "then",
  "than",
  "from",
  "into",
  "some",
  "tell",
  "give",
  "want",
  "need",
  "looking",
  "find",
  "help",
  "should",
  "could",
  "like",
  "just",
  "me",
  "please",
  "know",
  "more",
  "much",
  "many",
  "your",
  "i",
  "am",
  "is"
]);
var BRAVEN_TRIGGERS = ["braven", "coach", "mentor", "contact", "staff"];
var requestLog = /* @__PURE__ */ new Map();
function resetRateLimits() {
  requestLog.clear();
}
function isRateLimited(clientId, now2) {
  const recent = (requestLog.get(clientId) ?? []).filter((time) => now2 - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    requestLog.set(clientId, recent);
    return true;
  }
  recent.push(now2);
  requestLog.set(clientId, recent);
  return false;
}
function fail(status, error) {
  return { status, body: { error } };
}
function parseProfile(raw) {
  if (typeof raw !== "object" || raw === null) return void 0;
  const { major, interests, year, goal } = raw;
  const text = (value) => typeof value === "string" && value.trim() ? value.trim().slice(0, 100) : null;
  const list = Array.isArray(interests) ? interests.filter((item) => typeof item === "string" && item.trim() !== "").map((item) => item.trim().slice(0, 100)).slice(0, MAX_INTERESTS) : [];
  return { major: text(major), interests: list, year: text(year), goal: text(goal) };
}
function validate(input) {
  if (typeof input !== "object" || input === null) {
    return { error: "Please send a question." };
  }
  const { messages, profile } = input;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    return { error: `Please send between 1 and ${MAX_MESSAGES} messages.` };
  }
  const cleaned = [];
  for (const item of messages) {
    if (typeof item !== "object" || item === null) return { error: "Each message must be an object." };
    const { role, content } = item;
    if (role !== "user" && role !== "assistant") return { error: "Each message needs a valid role." };
    if (typeof content !== "string" || content.trim() === "") {
      return { error: "Messages cannot be empty." };
    }
    const trimmed = content.trim();
    if (role === "user" && trimmed.length > MAX_CONTENT) {
      return { error: `Messages must be ${MAX_CONTENT} characters or fewer.` };
    }
    cleaned.push({ role, content: role === "assistant" ? trimmed.slice(0, MAX_ASSISTANT_CONTENT) : trimmed });
  }
  if (cleaned[cleaned.length - 1].role !== "user") {
    return { error: "The last message must be from you." };
  }
  return { messages: cleaned, profile: parseProfile(profile) };
}
function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (word) => word.length >= 3 && !STOPWORDS.has(word)
  );
}
function countMatches(tokens, text) {
  const haystack = new Set(tokenize(text));
  return tokens.filter((token) => haystack.has(token)).length;
}
function profileBoost(item, profile) {
  if (!profile) return 0;
  let boost = 0;
  if (profile.major && item.majors.includes(profile.major)) boost += 1;
  if (item.interests.some((interest) => profile.interests.includes(interest))) boost += 1;
  return boost;
}
function scoreResource(tokens, item) {
  return countMatches(tokens, item.title) * 3 + countMatches(tokens, `${item.tags.join(" ")} ${item.source}`) * 2 + countMatches(tokens, item.summary);
}
function scoreEvent(tokens, item) {
  return countMatches(tokens, item.title) * 3 + countMatches(tokens, `${item.tags.join(" ")} ${item.host}`) * 2 + countMatches(tokens, item.description);
}
function topScored(items, score, limit) {
  return items.map((item) => ({ item, score: score(item) })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((entry) => entry.item);
}
function retrieveContext(query, profile, now2 = Date.now()) {
  const tokens = tokenize(query);
  const upcoming = events.filter((event) => {
    const end = new Date(event.end).getTime();
    return Number.isNaN(end) || end >= now2;
  });
  if (tokens.length === 0) {
    const byFit = topScored(resources, (item) => profileBoost(item, profile), 3);
    return { resources: byFit, events: [] };
  }
  const picked = topScored(
    resources,
    (item) => {
      const base = scoreResource(tokens, item);
      return base > 0 ? base + profileBoost(item, profile) : 0;
    },
    6
  );
  if (tokens.some((token) => BRAVEN_TRIGGERS.includes(token))) {
    const chosen = new Set(picked.map((item) => item.id));
    for (const item of resources) {
      const mentionsBraven = item.source.toLowerCase().includes("braven") || item.title.toLowerCase().includes("braven");
      if (mentionsBraven && !chosen.has(item.id)) {
        picked.push(item);
        chosen.add(item.id);
      }
    }
  }
  const pickedEvents = topScored(
    upcoming,
    (item) => {
      const base = scoreEvent(tokens, item);
      return base > 0 ? base + profileBoost(item, profile) : 0;
    },
    4
  );
  return { resources: picked, events: pickedEvents };
}
function formatDate(iso) {
  return iso.slice(0, 10);
}
function buildSystemPrompt(profile, context) {
  const resourceLines = context.resources.map(
    (item) => `- ${item.title} (${item.resourceType}, ${item.location}) ${item.url}`
  );
  const eventLines = context.events.map(
    (item) => `- ${item.title} (event: ${item.eventType}, ${item.format}, ${formatDate(item.start)}) ${item.url}`
  );
  const contextLines = [...resourceLines, ...eventLines];
  const profileLines = [];
  if (profile?.major) profileLines.push(`Major: ${profile.major}`);
  if (profile?.interests.length) profileLines.push(`Interests: ${profile.interests.join(", ")}`);
  if (profile?.year) profileLines.push(`Year: ${profile.year}`);
  if (profile?.goal) profileLines.push(`Goal: ${profile.goal}`);
  return [
    'You are "Career Compass Assistant", a warm, direct and knowledgeable career coach for SJSU students, built into a student capstone project site.',
    "Talk like a modern chat assistant: conversational, natural sentences, no stiff template. Remember the whole conversation and build on it. When it genuinely helps, ask one brief follow-up question.",
    "",
    "What you help with:",
    "- Braven, the nonprofit program. Only state Braven facts that appear in the context below; otherwise say you are not sure and suggest asking Braven staff.",
    '- This website. Pages: My journey, Internships (internships and entry-level jobs from LinkedIn and the SJSU Career Center, with an "I applied" button and an application tracker), Resources, Events, Alumni, Assistant.',
    "- Companies: answer from your general knowledge and be specific and useful: what the company does, typical intern and entry-level roles, the skills they value, and how to prepare. Add one short note that details can be out of date and are worth confirming on the company's careers page.",
    "- Anything in a student's career life: resumes, cover letters, LinkedIn and outreach messages, interview practice (you may run a mock interview, asking one question at a time), internship and job search strategy, networking, choosing a path, skills to learn, and offers and negotiation basics.",
    "- You may write and improve resume bullets, cover letters and outreach emails.",
    "",
    "Rules:",
    "- Politely decline unrelated requests (homework answers, unrelated code, medical, legal or financial advice, anything harmful) in one friendly sentence, then steer back to careers.",
    "- Never invent listings, deadlines, links or Braven facts.",
    "- Recommend a listing only from the context below, and mention its exact title.",
    "- Use the student profile to personalize answers.",
    "",
    "Formatting: Markdown is rendered, so use it naturally. Short paragraphs, **bold** for key terms, bullet or numbered lists, a heading only for long answers, code blocks only for code. No emoji unless the student uses them. Match length to the question: short for simple questions, thorough for planning or writing tasks, never padded. Do not repeat disclaimers; mention that you are an AI and can be wrong only once in a while, when stating company or career facts, not in every reply.",
    "",
    "Student profile:",
    profileLines.length ? profileLines.join("\n") : "Not provided.",
    "",
    "Context items:",
    contextLines.length ? contextLines.join("\n") : "None found for this question."
  ].join("\n");
}
function stripThinking(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}
function buildSources(context, reply) {
  const lowerReply = reply.toLowerCase();
  const all = [
    ...context.resources.map((item) => ({ title: item.title, url: item.url, kind: "resource" })),
    ...context.events.map((item) => ({ title: item.title, url: item.url, kind: "event" }))
  ];
  return all.filter((source) => lowerReply.includes(source.title.toLowerCase())).slice(0, 4);
}
function extractContent(data) {
  const choices = data?.choices;
  if (!Array.isArray(choices)) return "";
  const content = choices[0]?.message?.content;
  return typeof content === "string" ? content : "";
}
function prepareRequest(input, options) {
  const valid = validate(input);
  if ("error" in valid) return fail(400, valid.error);
  if (!options.apiKey) return fail(503, "The assistant is not set up yet.");
  const now2 = options.now ?? Date.now();
  if (isRateLimited(options.clientId ?? "anon", now2)) {
    return fail(429, "Too many questions. Please wait a few minutes.");
  }
  const lastQuestion = valid.messages[valid.messages.length - 1].content;
  const context = retrieveContext(lastQuestion, valid.profile, now2);
  return { messages: valid.messages, context, systemPrompt: buildSystemPrompt(valid.profile, context) };
}
function upstreamInit(options, prepared, stream, signal) {
  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: options.model ?? DEFAULT_MODEL,
      messages: [{ role: "system", content: prepared.systemPrompt }, ...prepared.messages],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: MAX_TOKENS,
      stream,
      chat_template_kwargs: { enable_thinking: false }
    }),
    signal
  };
}
async function handleChatRequest(input, options) {
  const prepared = prepareRequest(input, options);
  if ("status" in prepared) return prepared;
  const fetchFn = options.fetchFn ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchFn(NVIDIA_URL, upstreamInit(options, prepared, false, controller.signal));
    if (!response.ok) return fail(502, UPSTREAM_ERROR);
    const reply = stripThinking(extractContent(await response.json()));
    if (!reply) return fail(502, UPSTREAM_ERROR);
    return { status: 200, body: { reply, sources: buildSources(prepared.context, reply) } };
  } catch {
    return fail(502, UPSTREAM_ERROR);
  } finally {
    clearTimeout(timer);
  }
}
var THINK_OPEN = "<think>";
var THINK_CLOSE = "</think>";
function partialTagLength(text, tag) {
  const lower = text.toLowerCase();
  for (let length = Math.min(tag.length - 1, lower.length); length > 0; length -= 1) {
    if (tag.startsWith(lower.slice(lower.length - length))) return length;
  }
  return 0;
}
function createThinkFilter() {
  let pending = "";
  let inThink = false;
  let started = false;
  const emit = (text) => {
    const visible = started ? text : text.trimStart();
    if (visible) started = true;
    return visible;
  };
  return {
    push(chunk) {
      pending += chunk;
      let out = "";
      for (; ; ) {
        const lower = pending.toLowerCase();
        const tag = inThink ? THINK_CLOSE : THINK_OPEN;
        const index = lower.indexOf(tag);
        if (index >= 0) {
          if (!inThink) out += pending.slice(0, index);
          pending = pending.slice(index + tag.length);
          inThink = !inThink;
          continue;
        }
        const keep = partialTagLength(pending, tag);
        if (!inThink) out += pending.slice(0, pending.length - keep);
        pending = pending.slice(pending.length - keep);
        break;
      }
      return emit(out);
    },
    flush() {
      const rest = inThink ? "" : pending;
      pending = "";
      return emit(rest);
    }
  };
}
function parseSseContent(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return { done: false, content: "" };
  const payload = trimmed.slice(5).trim();
  if (payload === "[DONE]") return { done: true, content: "" };
  try {
    const choices = JSON.parse(payload)?.choices;
    if (!Array.isArray(choices)) return { done: false, content: "" };
    const content = choices[0]?.delta?.content;
    return { done: false, content: typeof content === "string" ? content : "" };
  } catch {
    return { done: false, content: "" };
  }
}
async function* runStream(options, prepared) {
  const fetchFn = options.fetchFn ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);
  const onClientAbort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener("abort", onClientAbort);
  let reader;
  try {
    const response = await fetchFn(NVIDIA_URL, upstreamInit(options, prepared, true, controller.signal));
    if (!response.ok || !response.body) {
      yield { type: "error", error: UPSTREAM_ERROR };
      return;
    }
    reader = response.body.getReader();
    const decoder = new TextDecoder();
    const filter = createThinkFilter();
    let buffer = "";
    let reply = "";
    let finished = false;
    const consume = (line) => {
      const parsed = parseSseContent(line);
      if (parsed.done) finished = true;
      return parsed.content ? filter.push(parsed.content) : "";
    };
    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const text = consume(line);
        if (text) {
          reply += text;
          yield { type: "delta", text };
        }
        if (finished) break;
      }
    }
    if (!finished && buffer) {
      const text = consume(buffer);
      if (text) {
        reply += text;
        yield { type: "delta", text };
      }
    }
    const tail = filter.flush();
    if (tail) {
      reply += tail;
      yield { type: "delta", text: tail };
    }
    if (!reply.trim()) {
      yield { type: "error", error: UPSTREAM_ERROR };
      return;
    }
    yield { type: "done", sources: buildSources(prepared.context, reply) };
  } catch {
    yield { type: "error", error: UPSTREAM_ERROR };
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onClientAbort);
    controller.abort();
    reader?.cancel().catch(() => void 0);
  }
}
async function streamChatRequest(input, options) {
  const prepared = prepareRequest(input, options);
  if ("status" in prepared) return { status: prepared.status, body: prepared.body };
  return { status: 200, events: runStream(options, prepared) };
}
export {
  buildSystemPrompt,
  handleChatRequest,
  resetRateLimits,
  retrieveContext,
  streamChatRequest
};
