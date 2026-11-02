/* ======================================================================
   config.js  —  YOUR CONTENT LIVES HERE  (this is the file you'll edit most)
   ----------------------------------------------------------------------
   Change the text between the quotes "like this". Don't delete the
   commas, quotes or brackets — they are part of how the code is written.
   Save the file (Ctrl+S / Cmd+S) and refresh the browser to see changes.
   ====================================================================== */

const SITE = {
  /* ---------- BASIC INFO ---------- */
  name: "Abenezer Ashenafi",                         // appears in the menu, intro and footer
  initials: "",                            // shown in the little logo box
  role: "Graphic Designer",
  location: "Adiss Ababa, Ethiopia",
  availability: "Available for new projects", // the pulsing green line at the top
  email: "abenezerashenafi50@gmail.com",               // used for the "mailto" links and the form

  /* ---------- SOCIAL LINKS ----------
     Paste the full link to each profile.
     Leave a link as "" (empty quotes) and that button is hidden automatically. */
  socials: {
    behance: "",
    dribbble: "",
    instagram: "https://www.instagram.com/abenezerab9638",
    linkedin: "",
    x: "",
  },

  /* ---------- FEATURED IMAGE (the big picture under the intro) ----------
     1. Put the image in the folder  assets/projects/
     2. Write its path here.  Wide images (16:9) look best, about 1920 px wide. */
  featured: "assets/projects/profile.jpg",
  featuredTitle: "Featured work",

  /* ---------- NUMBERS in the About section ----------
     value = the number that counts up, suffix = what comes after it (+, %, k…) */
  stats: [
   // { value: 120, suffix: "+", label: "Projects completed" },
    { value: 2,   suffix: "",  label: "Years of experience" },
    //{ value: 40,  suffix: "+", label: "Happy clients" },
    //{ value: 15,  suffix: "+", label: "Brands launched" },
  ],

  /* ---------- MY COLOUR PALETTE (About section) ----------
     A fun detail for designers: visitors can click a swatch to copy its colour code.
     name = what you call it,  hex = the colour code (must start with #).
     Delete the whole "palette" list if you don't want this part. */
  palette: [
    { name: "Ink",   hex: "#0b0b0c" },
    { name: "Paper", hex: "#f6f4ee" },
    { name: "Green", hex: "#22c55e" },
    { name: "Sky",   hex: "#38bdf8" },
    { name: "Sun",   hex: "#facc15" },
  ],

  /* ---------- SOFTWARE ----------
     Used in the scrolling strip under the intro AND the "Tools I work with" chips. */
  tools: [
    "Photoshop",
    "Illustrator",
    // "Figma",
    // "InDesign",
    "After Effects",
    // "Procreate",
  ],

  /* ---------- YOUR PROJECTS ----------
     Every { ... } block below is ONE project card on the site.

       title        the name shown under the picture
       category     used for the filter buttons (Branding, Poster, Packaging…).
                    Use the same spelling for projects that belong together.
       year         (optional) shown on the card, e.g. "2026"
       client       (optional) shown in the pop-up, e.g. "Fresh Roast Coffee"
       tools        (optional) shown in the pop-up, e.g. "Illustrator, Photoshop"
       description  one or two sentences about the project
       images       the pictures of this project (1 or more). The FIRST one is the
                    card picture. Click the card and visitors can flip through all of them.
                    Put the files in assets/projects/ and write their paths here.
       ratio        (optional) the shape of the card picture: "4 / 5" (tall),
                    "1 / 1" (square), "4 / 3" (normal), "16 / 9" (wide). Default "4 / 3".
       wide         (optional) true = the card is twice as wide (nice for a big project)

     TO ADD A PROJECT:    copy one whole { ... }, block, paste it below the last one.
     TO REMOVE A PROJECT: delete its whole { ... }, block.
     TO REORDER:          cut and paste blocks — the first one is shown first.
     If an image file is missing or spelled wrong, the card shows a "placeholder"
     look instead — a sign to check the file name!
     File names are case-sensitive and should have no spaces:  cover.jpg ✓   My Cover.JPG ✗ */
  projects: [
    {
    //   title: "Coffee brand identity",
    //   category: "Branding",
    //   year: "2026",
    //   client: "Your Client",
    //   tools: "Illustrator, Photoshop",
    //   description: "Logo, colour system, typography and packaging for a neighbourhood coffee roaster.",
      images: [
         "assets/projects/tle/tlahun.jpg",
    //     "assets/projects/coffee-brand/02.jpg",
    //     "assets/projects/coffee-brand/03.jpg",
       ],
      wide: true,
    },
    {
      // title: "Music festival poster",
      // category: "Poster",
      // year: "2026",
      // client: "Your Client",
      // tools: "Photoshop",
      // description: "A bold, type-led poster for a weekend music festival.",
      images: ["assets/projects/God/god.jpg"],
      // ratio: "4 / 5",
    },
    {
      // title: "Social media campaign",
      // category: "Social Media",
      // year: "2025",
      // client: "Your Client",
      // tools: "Figma, Photoshop",
      // description: "A set of consistent posts and stories that tripled engagement in two months.",
       images: [
         "assets/projects/sp/hire.jpg",
      //   "assets/projects/social-campaign/02.jpg",
      //   "assets/projects/social-campaign/03.jpg",
       ],
       ratio: "3/ 4",
    },
    {
      // title: "Skincare packaging",
      // category: "Packaging",
      // year: "2025",
      // client: "Your Client",
      // tools: "Illustrator, InDesign",
      // description: "Minimal packaging for a natural skincare range, designed for print.",
       images: [
         "assets/projects/nat/DANAT.jpg",
      //   "assets/projects/skincare-packaging/02.jpg",
       ],
      // ratio: "4 / 5",
    },
    {
      // title: "Logo collection",
      // category: "Branding",
      // year: "2025",
      // client: "Various",
      // tools: "Illustrator",
      // description: "Selected logos and marks created for startups and small businesses.",
       images: ["assets/projects/da/DA.jpg"],
      // ratio: "1 / 1",
    },
    {
      // title: "Magazine layout",
      // category: "Editorial",
      // year: "2024",
      // client: "Your Client",
      // tools: "InDesign",
      // description: "Editorial design with a clear grid, strong typography and generous white space.",
       images: [
        "assets/projects/are/log.jpg",
      //   "assets/projects/magazine-layout/02.jpg",
       ],
      //  ratio: "4 / 3",
    },
  ],
};
