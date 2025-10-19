import connect from "../../../../dbconfig";
import User from "../../../../schemas/users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req) {
    try {
        await connect();
        const body = await req.json()
        const { email, password } = body
        console.log("Searching for user with Email: ", email)
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return NextResponse.json(
                { success: false, message: "User Not Found" },
                { status: 404 }
            );
        }
        console.log(existingUser.password)
        const checkedPassword = await bcrypt.compare(password, existingUser.password)
        if (!checkedPassword) {
            return NextResponse.json(
                { success: false, message: "Incorrect Password" },
                { status: 404 }
            );
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const res = NextResponse.json(
            { success: true },
            { status: 201 }
        );
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return res;
    } catch (error) {
        console.log(error)
    }
}