import { compare, genSalt, hash } from "bcrypt-ts"

export const comparePassword = async(password: string,hashPassword: string) => {

    const isMatch = await compare(password,hashPassword);
    return isMatch;
}

export const hashPassword = async(password: string,saltRound = 10) => {

    const salt = await genSalt(saltRound);
    const hashedPassword = await hash(password,salt);
    return hashedPassword;
}