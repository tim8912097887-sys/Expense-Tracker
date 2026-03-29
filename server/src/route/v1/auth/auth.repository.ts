import { AuthModelType, UserModelType } from "@/types/index.js";
import { CreateUserType } from "./schema/signup.js";

export default class AuthRepository {
    
    constructor(
        private readonly userQuery: UserModelType,
        private readonly authQuery: AuthModelType
    ) {}

    getUserByEmail = async(email: string,hasPassword: boolean) => {
        let existUser; 
        if(hasPassword) {
            existUser = await this.userQuery.findOne({ email }).select("+password");
        } else {
            existUser = await this.userQuery.findOne({ email });
        }
        return existUser;
    }

    getUserById = async(id: string,hasPassword: boolean) => {
        let existUser; 
        if(hasPassword) {
            existUser = await this.userQuery.findOne({ _id: id }).select("+password");
        } else {
            existUser = await this.userQuery.findOne({ _id: id });
        }
        return existUser;
    }

    updateUserByEmail = async(email: string,updateInfo: object) => {
        const updatedUser = this.userQuery.findOneAndUpdate({ email },{
            ...updateInfo
        },{
            returnDocument: "after",
            runValidators: true
        })
        return updatedUser;
    }

    createUser = async(userInfo: CreateUserType) => {
        const createdUser = await this.userQuery.create(userInfo);
        const userObject = createdUser.toObject();
        const { password,...withoutPassword } = userObject;
        if(password) return withoutPassword; 
        return userObject;
    }

    createOtp = async(email: string,otp: string,expiredAt: Date) => {
        const createdOtp = await this.authQuery.create({
            email,
            otp,
            expiredAt
        })
        return createdOtp;
    }

    getOtp = async(email: string,otp: string) => {
        
        const currentTime = new Date();
        const totp = await this.authQuery.findOne({
            email,
            otp,
            expiredAt: {
                $gt: currentTime
            }
        });  
        return totp;
    }

}