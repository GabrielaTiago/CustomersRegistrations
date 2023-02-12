import { Chance } from 'chance';
import { ICustomer } from '../../src/interfaces/customerInterface';

const chance = Chance();

export function __wrongBody() {
    return {
        [chance.string()]: chance.string(),
        [chance.string()]: chance.string(),
        [chance.string()]: chance.string(),
    };
}

export function __customer(): ICustomer {
    const birth_date = __birthDate();
    const cpf = __cpf();

    return {
        name: chance.name(),
        cpf,
        birth_date,
    };
}

export function __birthDate() {
    const monthDay = chance.integer({ min: 1, max: 31 });
    const { numeric } = chance.month({ raw: true });
    const year = chance.year({ min: 1000, max: 2022 });
    let day: string;

    if (monthDay < 10) day = `0${monthDay}`;
    else day = `${monthDay}`;

    return `${day}/${numeric}/${year}`;
}

export function __cpf() {
    return chance.cpf();
}

export function __cpfFormatted() {
    return chance.cpf().replace(/[.-]/g, '');
}

export function __invalidCPF() {
    const number = chance.integer({ min: 1, max: 20 });
    return chance.string({ length: number, alpha: true });
}

export function __cpfInvalidFirstDigit() {
    let cpf = __cpfFormatted();
    let newCpf = cpf.split('').map((value) => Number(value));
    let randomNum = Math.floor(Math.random() * 10);
    while (newCpf[newCpf.length - 2] === randomNum) {
        randomNum = Math.floor(Math.random() * 10);
    }
    newCpf[newCpf.length - 2] = randomNum;
    return newCpf.join('');
}

export function __cpfInvalidSecondDigit() {
    let cpf = __cpfFormatted();
    let newCpf = cpf.split('').map((value) => Number(value));
    let randomNum = Math.floor(Math.random() * 10);
    while (newCpf[newCpf.length - 1] === randomNum) {
        randomNum = Math.floor(Math.random() * 10);
    }
    newCpf[newCpf.length - 1] = randomNum;
    return newCpf.join('');
}

export function __invalidBirthDateCaracters() {
    return chance.string({ length: 10, alpha: true });
}

export function __invalidBirthDateTodaysDate() {
    let birth_date = __birthDate();
    const year = chance.year({ min: 2050, max: 3000 });

    return birth_date.substring(0, birth_date.length - 4) + year;
}

export function __randomNumber() {
    return chance.integer({ min: 0, max: 3 });
}

export function __randomLargeNumber() {
    const number1 = chance.integer({ min: 100 });
    const number2 = chance.integer({ min: 2, max: 9 });
    return number1 * number2;
}

export function __randomNegativeNumber() {
    return chance.integer({ max: -1 });
}

export function __string() {
    return chance.string();
}
