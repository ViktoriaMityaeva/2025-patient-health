import { Color } from './color.model';
import { ThemeType, Theme } from './Theme.model';

export const THEMES: Record<ThemeType, Theme> = {
	// light: {
	// 	'--primary': Color.PRIMARY_500,
	// 	'--secondary': Color.DARK_VIOLET,
	// 	'--background': Color.LIGHT_SURFACE_MIXED_100,
	// 	'--white': Color.WHITE,
	// 	'--button': Color.PRIMARY_200,
	// 	'--card': Color.SURFACE_MIXED_200,
	// },
	// dark: {
	// 	'--primary': Color.VIOLET,
	// 	'--secondary': Color.LIGHT_SURFACE_MIXED_600,
	// 	'--background': Color.SURFACE_MIXED_100,
	// 	'--white': Color.WHITE,
	// 	'--button': Color.PRIMARY_200,
	// 	'--card': Color.SURFACE_MIXED_200,
	// }

	light: {
		'--primary': Color.MAIN_LIGHT,
		'--secondary': Color.SECOND_LIGHT,
		'--text': Color.TEXT_LIGHT,
		'--background': Color.BACKGROUND_LIGHT,
		'--white': Color.WHITE,
		'--button': Color.MAIN_LIGHT,
		'--card': Color.CARD_LIGHT,
	},
	dark: {
		'--primary': Color.MAIN,
		'--secondary': Color.SECOND_DARK,
		'--text': Color.TEXT_DARK,
		'--background': Color.BACKGROUND_DARK,
		'--white': Color.WHITE,
		'--button': Color.MAIN,
		'--card': Color.CARD_DARK,
	}
};
