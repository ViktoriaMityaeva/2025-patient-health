import { Color } from './color.model';

export type ThemeType = 'dark' | 'light';

export interface Theme {
    '--primary': Color;
    '--secondary': Color;
    '--text': Color;
    '--background': Color;
    '--white': Color;
    '--button': Color;
    '--card': Color;
}
