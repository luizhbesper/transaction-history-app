import { motion } from "@presentation/theme";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./BottomSheet.styles";

/** Options a caller can pass alongside the sheet content. */
export type BottomSheetOptions = {
	/** Runs once the sheet is fully closed, however it was dismissed. */
	onDismiss?: () => void;
};

type Presenter = (content: ReactNode, options?: BottomSheetOptions) => void;

// The host registers itself here on mount. Keeping the handles at module level is what
// lets any component open a sheet without threading state or context through the tree.
let present: Presenter | null = null;
let close: (() => void) | null = null;

/**
 * Opens and closes the app's single bottom sheet from anywhere.
 *
 * `<BottomSheetHost />` must be mounted once, above the screen, for these to do anything.
 */
export const BottomSheetUtil = {
	/**
	 * Shows a sheet with the given content, replacing whatever is open.
	 *
	 * @param {ReactNode} content - What to render inside the sheet shell.
	 * @param {BottomSheetOptions} [options] - Dismissal callback.
	 * @returns {void}
	 */
	show(content: ReactNode, options?: BottomSheetOptions): void {
		present?.(content, options);
	},
	/**
	 * Closes the open sheet, playing the exit animation.
	 *
	 * @returns {void}
	 */
	hide(): void {
		close?.();
	},
};

const EASING = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Hosts the one bottom sheet the app uses: the scrim, the shell and its animation.
 *
 * Mount it once next to the screen — everything else goes through {@link BottomSheetUtil}.
 *
 * @returns {React.JSX.Element | null} The modal while a sheet is open, nothing otherwise.
 */
export function BottomSheetHost(): React.JSX.Element | null {
	const insets = useSafeAreaInsets();
	const [content, setContent] = useState<ReactNode | null>(null);
	const onDismiss = useRef<(() => void) | undefined>(undefined);
	const progress = useSharedValue(0);
	const height = useSharedValue(400);

	const forget = useCallback(() => {
		setContent(null);
		onDismiss.current?.();
		onDismiss.current = undefined;
	}, []);

	const hide = useCallback(() => {
		progress.value = withTiming(
			0,
			{ duration: motion.sheetIn, easing: EASING },
			(finished) => {
				if (finished) runOnJS(forget)();
			},
		);
	}, [forget, progress]);

	useEffect(() => {
		present = (next, options) => {
			onDismiss.current = options?.onDismiss;
			setContent(next);
			progress.value = withTiming(1, {
				duration: motion.sheetIn,
				easing: EASING,
			});
		};
		close = hide;
		return () => {
			present = null;
			close = null;
		};
	}, [hide, progress]);

	const scrimStyle = useAnimatedStyle(() => ({
		opacity: withTiming(progress.value > 0 ? progress.value : 0, {
			duration: motion.scrimFade,
		}),
	}));

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: (1 - progress.value) * height.value }],
	}));

	if (content === null) return null;

	return (
		<Modal transparent animationType="none" onRequestClose={hide} visible>
			<View style={styles.container}>
				<Animated.View style={[styles.fill, styles.scrim, scrimStyle]}>
					<Pressable
						style={styles.fill}
						onPress={hide}
						accessibilityRole="button"
						accessibilityLabel="Close"
					/>
				</Animated.View>
				<Animated.View
					style={[
						styles.sheet,
						{ paddingBottom: 30 + insets.bottom },
						sheetStyle,
					]}
					onLayout={(event) => {
						height.value = event.nativeEvent.layout.height;
					}}
				>
					<View style={styles.grabber} />
					{content}
				</Animated.View>
			</View>
		</Modal>
	);
}
