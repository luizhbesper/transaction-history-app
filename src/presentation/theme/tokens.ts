import type { TextStyle } from "react-native";

/**
 * Every visual constant the app draws with: colours, type scale, spacing, radii, sizes,
 * shadows and durations. Components import from here and never hard-code a value, so the
 * whole look changes from one file.
 */

export const colors = {
	brandBlue: "#B1D5EB",
	surface: "#FFFFFF",
	surfaceTint: "#F5F8FB",
	surfaceTintBlue: "#F0F7FC",
	ink: "#14213D",
	inkOnBlue: "#3F5B78",
	textSecondary: "#7A8AA0",
	textMuted: "#8B99AD",
	textFaint: "#A3AEBE",
	textOnCard: "#5C6B80",
	coral: "#F1656B",
	income: "#1E8F5F",
	incomeBg: "#E4F5EC",
	expense: "#E14B4B",
	divider: "#EBF0F5",
	dividerStrong: "#E9EFF5",
	rowPressed: "#F2F7FB",
	clearButton: "#C3CDDA",
	avatarOnBlue: "rgba(255,255,255,0.65)",
	scrim: "rgba(15,26,45,0.42)",
	skeleton: { base: "#DFE6EE", cool: "#DDE8F0", light: "#E7EDF3" },
} as const;

/** Avatar background and foreground for a transaction category. */
export type CategoryColors = { bg: string; fg: string };

const CATEGORY_COLORS: Record<string, CategoryColors> = {
	Income: { bg: "#E4F5EC", fg: "#1E8F5F" },
	"Food & Drink": { bg: "#FFECE7", fg: "#D9603F" },
	Shopping: { bg: "#EDEBFC", fg: "#5A4FD1" },
	Transport: { bg: "#E6F1FC", fg: "#2C6FBF" },
	"Bills & Utilities": { bg: "#FDF0DC", fg: "#B07A16" },
	Entertainment: { bg: "#FBE9F3", fg: "#B44080" },
	Groceries: { bg: "#E9F5E4", fg: "#4F8B3B" },
	Health: { bg: "#E7F4F5", fg: "#2B8A93" },
};

const CATEGORY_FALLBACK: CategoryColors = { bg: "#EDEBFC", fg: "#5A4FD1" };

/**
 * Picks the avatar colours for a category. Colours are a presentation concern, which is
 * why the mapping lives here and not next to the category in the domain.
 *
 * @param {string} category - The transaction's category, as it comes from the API.
 * @returns {CategoryColors} The pair for that category, or the Shopping pair when unknown.
 */
export const categoryColorsFor = (category: string): CategoryColors =>
	CATEGORY_COLORS[category] ?? CATEGORY_FALLBACK;

export const font = {
	size: {
		amountXl: 33,
		title: 29,
		stateTitle: 18,
		sheetTitle: 17,
		summaryValue: 17,
		cta: 16,
		body: 15,
		bodySm: 13.5,
		caption: 12.5,
		captionSm: 12,
		time: 11.5,
		sectionHeader: 10.5,
		overline: 9.5,
	},
	weight: {
		regular: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
		black: "800",
	},
	letterSpacing: {
		title: -0.7,
		amountXl: -1,
		stateTitle: -0.3,
		sectionHeader: 1,
		overline: 0.9,
	},
} as const;

/** Keeps digits from shifting width as amounts change. */
export const tabular: TextStyle["fontVariant"] = ["tabular-nums"];

export const space = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 26,
	screenTop: 62,
	listBottom: 40,
	gapRow: 12,
	gapChips: 8,
} as const;

export const radius = {
	grabber: 3,
	skeletonBar: 6,
	input: 14,
	optionCard: 18,
	summaryCard: 20,
	stateCard: 22,
	listSheet: 26,
	sheet: 28,
	pill: 999,
} as const;

export const size = {
	rowHeight: 60,
	sectionHeaderHeight: 33,
	avatarRow: 42,
	avatarHeader: 38,
	avatarSheet: 54,
	stateIcon: 60,
	searchBar: 44,
} as const;

/** `boxShadow` strings — one cross-platform value instead of the four `shadow*` props. */
export const shadow = {
	summaryCard: "0px 2px 10px rgba(20,33,61,0.06)",
	chip: "0px 1px 3px rgba(20,33,61,0.05)",
	listSheet: "0px -3px 14px rgba(20,33,61,0.07)",
	sheet: "0px -8px 30px rgba(15,26,45,0.18)",
	ctaCoral: "0px 4px 12px rgba(241,101,107,0.3)",
	ctaCoralLarge: "0px 5px 14px rgba(241,101,107,0.32)",
} as const;

export const motion = {
	sheetIn: 280,
	scrimFade: 200,
	skeletonPulse: 1300,
	skeletonFrom: 0.45 as number,
	skeletonTo: 0.85 as number,
	chipSwap: 180,
	rowFadeIn: 180,
} as const;
