import { IUser } from "@/types/index.js";

export default class AuthPresenter {
    // This class can be used to format the response data if needed in the future
    // For now, it simply returns the data as is, but it provides a layer of abstraction for any future changes in response formatting.
    static toLoginResponse(user: Partial<IUser>, token: string) {

        const userObject = AuthPresenter.toUserResponse(user).user;;
        return {
            user: userObject,
            token
        }
    }   

    static toUserResponse(user: Partial<IUser>) {
        const userObject = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        return {
            user: userObject
        }
    }

    static toOtpResponse(otp: string,message: string) {

        return {
            otp,
            message
        }
    }

    static toMessageResponse(message: string) {
        return {
            message
        }
    }

}
