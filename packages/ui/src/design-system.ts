export const paneninColors = {
  primary: {
    pr40: "#1A4D1A",
    pr30: "#2D6A2D",
    pr20: "#3D8B3D",
    pr10: "#C6DFC6",
    pr00: "#EBF5EB",
  },
  alert: {
    al30: "#7A6200",
    al20: "#C8A800",
    al10: "#E8D87A",
    al00: "#FFFBEA",
  },
  profit: {
    pf30: "#EBF5EB",
    pf20: "#2D6A2D",
    pf10: "#FFF0F0",
    pf00: "#B82C2C",
  },
  neutral: {
    ne50: "#1A1A18",
    ne40: "#3D3D3A",
    ne30: "#6B6B68",
    ne20: "#E0E0DE",
    ne10: "#F7F7F5",
    ne00: "#FFFFFF",
  },
} as const;

export const paneninTypography = {
  display: {
    bold: { fontSize: 22, lineHeight: 29, fontWeight: 700 },
    semibold: { fontSize: 22, lineHeight: 29, fontWeight: 600 },
    medium: { fontSize: 22, lineHeight: 29, fontWeight: 500 },
    regular: { fontSize: 22, lineHeight: 29, fontWeight: 400 },
    light: { fontSize: 22, lineHeight: 29, fontWeight: 300 },
  },
  heading: {
    h1ExtraBold: { fontSize: 18, lineHeight: 27, fontWeight: 800 },
    h1Bold: { fontSize: 18, lineHeight: 27, fontWeight: 700 },
    h2Regular: { fontSize: 15, lineHeight: 22.5, fontWeight: 400 },
    h2Bold: { fontSize: 15, lineHeight: 22.5, fontWeight: 700 },
    h2Medium: { fontSize: 15, lineHeight: 22.5, fontWeight: 500 },
  },
  body: {
    bold: { fontSize: 14, lineHeight: 21, fontWeight: 700 },
    medium: { fontSize: 14, lineHeight: 21, fontWeight: 500 },
    regular: { fontSize: 14, lineHeight: 21, fontWeight: 400 },
  },
  label: {
    regular: { fontSize: 12, lineHeight: 18, fontWeight: 400 },
    medium: { fontSize: 12, lineHeight: 18, fontWeight: 500 },
  },
  micro: {
    regular: { fontSize: 10, lineHeight: 15, fontWeight: 400 },
    extraBold: { fontSize: 10, lineHeight: 15, fontWeight: 800 },
  },
  productSpecific: {
    splashTitle: { fontSize: 28, lineHeight: 28, fontWeight: 800 },
  },
} as const;

export const paneninComponentSpecs = {
  button: {
    height: 57,
    radius: 10,
    paddingX: 10,
    paddingY: 15,
    label: "heading.h1.bold",
    variants: ["ver1", "ver2"] as const,
  },
  cardVegetables: {
    radius: 10,
    borderColor: "neutral.ne20",
    selectedBorderColor: "primary.pr30",
    selectedBackground: "primary.pr00",
    gridGap: 10,
    columns: 2,
  },
  bottomNav: {
    height: 77,
    itemRadius: 10,
    itemCount: 3,
    borderTopColor: "neutral.ne20",
  },
  toggle: {
    width: 66,
    height: 31,
    knobSize: 25,
    radius: 999,
  },
  guideCard: {
    radius: 20,
    paddingX: 20,
    paddingY: 15,
    gap: 15,
    borderColor: "neutral.ne20",
  },
} as const;

export const paneninDesignReferences = {
  figmaFileKey: "SRkaHr4GLZO8RMSYbIkiPp",
  nodes: {
    colors: "1:26",
    typography: "1:157",
    button: "4:104",
    cardVegetables: "14:172",
    bottomNav: "63:534",
    toggle: "94:2639",
    guideLayout: "76:753",
  },
} as const;
