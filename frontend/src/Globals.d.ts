declare module '*.module.scss'{
    interface IClassNames {
        [classname: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module '*.module.css';
declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.svg';
declare module '*.gif';
declare module '*.pdf';
declare module '*.js';
declare module 'lucide-react';
declare module 'date-fns';
declare module 'react-calendar';
