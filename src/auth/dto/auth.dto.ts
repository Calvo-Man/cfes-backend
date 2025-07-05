import { IsString } from "class-validator";

export class AuthDto {
    @IsString()
    user: string;

    @IsString()
    password: string;
}