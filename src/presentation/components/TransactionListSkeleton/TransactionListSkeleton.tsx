import { motion } from "@presentation/theme";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { styles } from "./TransactionListSkeleton.styles";

const ROWS = [0, 1, 2, 3, 4];

/**
 * The list's loading state: a day header and five rows, pulsing.
 *
 * It mirrors the real row geometry so the list does not jump when the data lands.
 *
 * @returns {React.JSX.Element} The ghost list.
 */
export function TransactionListSkeleton(): React.JSX.Element {
	const pulse = useSharedValue(motion.skeletonFrom);

	useEffect(() => {
		pulse.value = withRepeat(
			withTiming(motion.skeletonTo, {
				duration: motion.skeletonPulse,
				easing: Easing.inOut(Easing.ease),
			}),
			-1,
			true,
		);
	}, [pulse]);

	const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

	return (
		<Animated.View
			style={[styles.container, pulseStyle]}
			accessibilityLabel="Loading transactions"
		>
			<View style={styles.headerBar} />
			{ROWS.map((row) => (
				<View key={row} style={styles.row}>
					<View style={styles.avatar} />
					<View style={styles.main}>
						<View style={[styles.barLarge, { width: "44%" }]} />
						<View style={[styles.barSmall, { width: "28%" }]} />
					</View>
					<View style={styles.side}>
						<View style={[styles.barLarge, { width: 54 }]} />
						<View style={[styles.barSmall, { width: 34 }]} />
					</View>
				</View>
			))}
		</Animated.View>
	);
}
