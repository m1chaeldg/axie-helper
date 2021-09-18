import {axieClasses} from "./constants";

type ClassColor = {
    [key: string]: string;
}


const classColor: ClassColor = {
    plant: '#6CC000',
    reptile: '#C88AE0',
    beast: '#FFB812',
    bird: '#FF8BBD',
    bug: '#FF5341',
    aquatic: '#00B8CE'
}

export const deriveClassColor = (axieClass: string): string => {
    if (!axieClasses.includes(axieClass)) {
        return 'darkgrey'
    }

    return classColor[axieClass]
}