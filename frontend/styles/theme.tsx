import { color, extendTheme } from "@chakra-ui/react"
import "@fontsource/montserrat";


const activeLabelStyles = {
    transform: "scale(0.85) translateY(-24px)"
};

const theme = extendTheme({
    styles: {
		global: (props: any) => ({
			body: {
				bg: '#0a0a0a',
				color: 'white'
			},
			'::-webkit-scrollbar': {
				width: '5px',
			},
			'::-webkit-scrollbar-track': {
				background: 'transparent'
			},
			'::-webkit-scrollbar-thumb': {
				background: "#444" 
			},
		})
    }, 
    fonts: {
		heading: `'Montserrat', sans-serif`,
		body: `'Montserrat', sans-serif`,
    },
	components: {
		Form: {
			variants: {
				floating: {
					container: {
						_focusWithin: {
							label: {
								...activeLabelStyles
							}
						},
						"input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
							...activeLabelStyles
						},
						label: {
							top: 0,
							left: 0,
							zIndex: 2,
							position: "absolute",
							backgroundColor: "blue.300",
							pointerEvents: "none",
							mx: 3,
							px: 1,
							my: 2,
							transformOrigin: "left top"
						}
					}
				}
			}
		}
	}
})

export default theme