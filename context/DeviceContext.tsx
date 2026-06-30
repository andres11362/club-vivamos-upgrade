/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { BREAKPOINTS } from "@/constants/breakpoints";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { createContext, useEffect, useState } from "react";

// Declare the context
const DeviceContext = createContext({
	isDesktop: true,
	isTablet: false,
	isMobile: false,
});
/**
 * Context provider for the device dimensions
 * @param props - Props to pass to the provider *
 * @returns - Context provider
 */
const DeviceProvider = (props: any) => {
	// State for desktop, tablet, and mobile breakpoints
	const [isDesktop, setDesktop] = useState<boolean>(true);
	const [isTablet, setTablet] = useState<boolean>(false);
	const [isMobile, setMobile] = useState<boolean>(false);
	// Get the window dimensions
	const { width } = useWindowDimensions();
	// Check the window dimensions and set the breakpoints
	useEffect(() => {
		// Verify if the width is a number
		if (typeof width === "number") {
			// Check if the width is greater than the desktop breakpoint
			if (width >= BREAKPOINTS.large) {
				setDesktop(true);
				setTablet(false);
				setMobile(false);
			}
			// Check if the width is greater than the tablet breakpoint
			else if (width >= BREAKPOINTS.medium && width < BREAKPOINTS.large) {
				setDesktop(false);
				setTablet(true);
				setMobile(false);
			}
			// Check if the width is greater than the mobile breakpoint
			else if (width < BREAKPOINTS.medium) {
				setDesktop(false);
				setTablet(false);
				setMobile(true);
			}
		}
	}, [width]);

	// Return the context provider
	return (
		<DeviceContext.Provider value={{ isDesktop, isTablet, isMobile }}>
			{props.children}
		</DeviceContext.Provider>
	);
};

export { DeviceProvider, DeviceContext };
