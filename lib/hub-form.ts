export type HubField = {
  id: string;
  label: string;
  options?: string[];
  multi?: boolean;
  required?: boolean;
  type?: string;
};
export type HubQuestion = {
  title: string;
  step: string;
  help?: string;
  fields: HubField[];
  when?: string;
};
const f = (
  id: string,
  label: string,
  options?: string[],
  extra: Partial<HubField> = {},
): HubField => ({ id: "hub_" + id, label, options, ...extra });
const yes = ["Yes", "No", "Unsure"];
export const hubQuestions: HubQuestion[] = [
  {
    step: "About you",
    title: "Who needs help?",
    fields: [
      f(
        "who",
        "Who needs help?",
        [
          "Me",
          "Someone I am helping",
          "Someone I am referring as a professional",
        ],
        { required: true },
      ),
    ],
  },
  {
    step: "About you",
    title: "What name should we use?",
    help: "An estimated age is okay if you do not know the birth date.",
    fields: [
      f("name", "Preferred name", undefined, { required: true }),
      f("legal", "Legal name, if different"),
      f("birth", "Date of birth or estimated age"),
    ],
  },
  {
    step: "About you",
    title: "Where are you staying?",
    help: "You do not need a home address. A city or county is enough.",
    fields: [
      f("location", "City or county", undefined, { required: true }),
      f("state", "State"),
      f("zip", "ZIP code, if known"),
    ],
  },
  {
    step: "About you",
    title: "How can we reach you safely?",
    help: "No steady phone or email? Tell us a safe way to reconnect.",
    fields: [
      f(
        "contact_method",
        "Safe contact method",
        ["Call", "Text", "Email", "Trusted contact", "No safe contact method"],
        { required: true },
      ),
      f("phone", "Phone", undefined, { type: "tel" }),
      f("email", "Email", undefined, { type: "email" }),
      f("contact_plan", "Trusted contact or safe reconnect plan"),
      f("time", "Best day or time"),
      f("voicemail", "May we leave a voicemail?", ["Yes", "No", "Ask first"]),
      f("identify", "May we say the message is from The Lotus Foundation?", [
        "Yes",
        "No",
        "Ask first",
      ]),
    ],
  },
  {
    step: "About you",
    title: "Would any support make this easier?",
    fields: [
      f(
        "access",
        "Language or accessibility support",
        [
          "No support needed",
          "Interpreter",
          "Help reading or completing the form",
          "Hearing, vision, mobility, or communication support",
          "Other",
        ],
        { multi: true },
      ),
      f("language", "Language or other support requested"),
    ],
  },
  {
    step: "Your needs",
    title: "What would you like help with?",
    help: "Choose as many as you want.",
    fields: [
      f(
        "needs",
        "Help requested",
        [
          "Emergency or temporary housing",
          "Recovery housing",
          "Rent assistance",
          "Utility or bill assistance",
          "Food",
          "Clothing or personal-care items",
          "Mental health skill-building",
          "Substance-use treatment or recovery support",
          "Benefits or health coverage",
          "Transportation",
          "Employment",
          "Trade or certification training",
          "CDL training",
          "Peer Recovery Specialist or CSAC pathway",
          "Computer, internet, or AI skills",
          "Childcare or family support",
          "Legal or reentry support",
          "Other",
        ],
        { multi: true, required: true },
      ),
      f("other_need", "Other need, if any"),
    ],
  },
  {
    step: "Your needs",
    title: "Which need matters most right now?",
    fields: [
      f("priority", "Most urgent need", [], { required: true }),
      f("explanation", "Anything you want us to know?"),
    ],
  },
  {
    step: "Your needs",
    title: "Is there a deadline we should know about?",
    help: "For example: leaving housing, a utility shutoff, hospital discharge, court, release, or a program deadline.",
    fields: [
      f("deadline", "Is there a deadline?", ["No", "Yes", "Unsure"], {
        required: true,
      }),
      f("deadline_detail", "Date and reason, if known"),
    ],
  },
  {
    step: "Housing and household",
    title: "Where are you staying tonight?",
    fields: [
      f(
        "housing",
        "Where are you staying tonight?",
        [
          "Own or rented home",
          "With family or friends",
          "Hotel or motel",
          "Shelter",
          "Recovery or transitional housing",
          "Hospital or treatment program",
          "Jail or prison",
          "Outside, vehicle, or place not meant for sleeping",
          "Other",
          "Prefer to discuss with staff",
        ],
        { required: true },
      ),
    ],
  },
  {
    step: "Housing and household",
    title: "Could you lose your housing or utilities?",
    fields: [
      f(
        "risk",
        "Housing or utility loss risk",
        [
          "No",
          "Yes, within 7 days",
          "Yes, within 30 days",
          "Yes, after 30 days",
          "Unsure",
        ],
        { required: true },
      ),
      f("owed", "Amount owed, if known"),
      f("risk_date", "Eviction or shutoff date, if known"),
      f("notice", "Have you received an eviction or shutoff notice?", yes),
    ],
  },
  {
    step: "Housing and household",
    title: "How many people are in your household?",
    help: "A best estimate is okay. Include yourself. We do not need everyone’s names.",
    fields: [
      f("adults", "Adults age 18 or older"),
      f("children", "Children under 18"),
      f("dependents", "Other dependents, if any"),
    ],
  },
  {
    step: "Housing and household",
    title: "Have you been without a steady place to stay?",
    fields: [
      f("unstable", "Are you without stable housing now?", [
        "Yes",
        "No",
        "Unsure",
        "Prefer to discuss with staff",
      ]),
      f("duration", "If yes, about how long?", [
        "Less than 1 month",
        "1–5 months",
        "6–11 months",
        "1–2 years",
        "2 years or more",
        "Unsure",
      ]),
      f("episodes", "About how many separate times in the past five years?", [
        "1",
        "2",
        "3",
        "4 or more",
        "Unsure",
      ]),
    ],
  },
  {
    step: "Money and coverage",
    title: "About how much money comes into your household each month?",
    help: "Before taxes. An estimate is okay, and you can choose not to answer.",
    fields: [
      f("income", "Monthly household income", [
        "$0",
        "$1–$999",
        "$1,000–$1,999",
        "$2,000–$2,999",
        "$3,000–$3,999",
        "$4,000 or more",
        "Unsure",
        "Prefer not to answer",
      ]),
    ],
  },
  {
    step: "Money and coverage",
    title: "What income or benefits do you receive or have pending?",
    fields: [
      f(
        "benefits",
        "Income or benefits",
        [
          "Employment",
          "SSI",
          "SSDI",
          "Social Security or retirement",
          "TANF",
          "SNAP",
          "Child support",
          "Unemployment",
          "Veteran benefits",
          "Housing assistance",
          "Application pending",
          "No current income or benefits",
          "Other",
          "Unsure",
          "Prefer not to answer",
        ],
        { multi: true },
      ),
      f("pending", "Which benefits are pending, if any?"),
    ],
  },
  {
    step: "Money and coverage",
    title: "Do you have health coverage?",
    fields: [
      f(
        "coverage",
        "Health coverage",
        [
          "Medicaid",
          "Medicare",
          "Employer or private insurance",
          "Other",
          "Applied or pending",
          "No coverage",
          "Unsure",
        ],
        { multi: true },
      ),
    ],
  },
  {
    step: "Money and coverage",
    title: "Does a health condition or disability make everyday life harder?",
    help: "Optional. You do not need to name a condition or provide paperwork.",
    fields: [
      f("health", "Effect on daily life, work, or housing", [
        "Yes",
        "No",
        "Unsure",
        "Prefer to discuss with staff",
      ]),
    ],
  },
  {
    step: "Money and coverage",
    title: "Would you like to share a little more about yourself?",
    help: "Optional information helps us understand who we serve and improve funding reports. Your answers do not affect access to help.",
    fields: [
      f(
        "race",
        "Race (choose any that apply)",
        [
          "American Indian or Alaska Native",
          "Asian",
          "Black or African American",
          "Middle Eastern or North African",
          "Native Hawaiian or Pacific Islander",
          "White",
          "I describe myself another way",
          "Prefer not to answer",
        ],
        { multi: true },
      ),
      f("ethnicity", "Hispanic or Latino", [
        "Yes",
        "No",
        "Prefer not to answer",
      ]),
      f("gender", "Gender identity (optional)"),
      f("veteran", "Veteran or active military", [
        "Yes",
        "No",
        "Unsure",
        "Prefer not to answer",
      ]),
    ],
  },
  {
    step: "Support and goals",
    title: "Are you already connected to any services?",
    fields: [
      f(
        "services",
        "Current services",
        [
          "Mental health provider",
          "Substance-use or recovery provider",
          "Medical provider",
          "Housing program",
          "Case manager",
          "Probation, parole, or reentry program",
          "None",
          "Unsure",
        ],
        { multi: true },
      ),
    ],
  },
  {
    step: "Support and goals",
    title: "What is your work or school situation?",
    fields: [
      f(
        "work",
        "Current work or school status",
        [
          "Working full-time",
          "Working part-time",
          "Self-employed or gig work",
          "Unemployed and looking",
          "Not working right now",
          "Student or training participant",
          "Retired",
          "Unable to work right now",
          "Prefer not to answer",
        ],
        { multi: true },
      ),
      f("training", "Training interests, if any"),
    ],
  },
  {
    step: "Support and goals",
    title: "What might make it hard to get help?",
    fields: [
      f(
        "barriers",
        "Barriers",
        [
          "Transportation",
          "Childcare or caregiving",
          "Health or disability",
          "No ID or missing documents",
          "Phone, device, or internet access",
          "Language or literacy",
          "Work schedule",
          "Legal history",
          "Safety concerns",
          "No current barrier",
          "Other",
        ],
        { multi: true },
      ),
    ],
  },
  {
    step: "Support and goals",
    title: "What would you most like to improve in the next 30 days?",
    fields: [f("goal", "Your goal (optional)")],
  },
  {
    step: "Referral and permission",
    title: "How did you hear about The Lotus Foundation?",
    fields: [
      f("source", "Referral source", [
        "Friend or family",
        "Healthcare provider",
        "Hospital or treatment program",
        "Community organization",
        "School or training program",
        "Court, probation, parole, or reentry program",
        "Website or social media",
        "Previous participant",
        "Other",
        "Unsure",
      ]),
    ],
  },
  {
    step: "Referral and permission",
    title: "Tell us about the person helping with this referral.",
    when: "referrer",
    fields: [
      f("referrer", "Your name", undefined, { required: true }),
      f("organization", "Organization or relationship"),
      f("referrer_contact", "Your phone or email", undefined, {
        required: true,
      }),
      f(
        "knows",
        "Does the participant know about this referral?",
        ["Yes", "No"],
        { required: true },
      ),
      f(
        "permission",
        "Has the participant agreed to direct contact?",
        ["Yes", "No"],
        { required: true },
      ),
    ],
  },
  {
    step: "Referral and permission",
    title: "Anything else about the requested support?",
    help: "Please do not include Social Security numbers, medication lists, medical records, or detailed trauma histories. Staff can discuss relevant details privately.",
    fields: [
      f(
        "utility",
        "If requesting utility help: utility type, and is the account in your name?",
      ),
      f("safety", "Is there an urgent safety concern?", [
        "No",
        "Yes",
        "Prefer to discuss with staff",
      ]),
      f("note", "Anything else that would help us plan the next step?"),
    ],
  },
];
export const hubFields = hubQuestions.flatMap((q) => q.fields);
