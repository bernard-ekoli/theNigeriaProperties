import connect from "../../../../dbconfig";
import bcrypt from "bcryptjs";
import User from "../../../../schemas/users";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(req) {
    try {
        await connect();
        const body = await req.json();
        console.log('Body recieved', body)
        const { firstName, lastName, email, phone, password } = body;

        console.log("Checking for user with email:", email);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 400 }
            );
        }
        console.log("Existing user found?", !!existingUser);
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        });

        await user.save()
        console.log("Created this user in the db:", user)

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
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Error creating user", error: error.message },
            { status: 500 }
        );
    }
}
