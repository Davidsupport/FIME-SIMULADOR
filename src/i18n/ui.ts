export const LANGUAGES: Record< 
    string,
    { code: string; name : string }
> = {
    es : {
        code: 'es',
        name : 'Español'
    },
    en : {
        code: 'en',
        name : 'English'
    },
};

export const defaultLang = 'es';
export const showDefaultLang = false;

export const ui = {
    es : {
        'nav.marco' : 'Marco Teorico',
        'nav.simulador' : 'Simulador'
    },
    en : {
        'nav.marco' : 'Theoretical Framework',
        'nav.simulador' : 'Simulator'
    },
};

export const routes = {
    es: {
        'Marco-Teorico': 'Marco-Teorico',
        'Simulador': 'Simulador'
    },
    en: {
        'Marco-Teorico': 'Theoretical-Framework',
        'Simulador': 'Simulator'    
    },
};