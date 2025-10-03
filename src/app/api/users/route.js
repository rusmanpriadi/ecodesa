import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Install: npm install bcryptjs

export async function GET(req) {
    try {
        // Exclude password from response
        const [rows] = await pool.query(
            "SELECT id, name, email, level FROM users"
        );
        return NextResponse.json({ 
            status: true, 
            code: 200,
            data: rows 
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ 
            status: false, 
            code: 500,
            message: "Failed to fetch users" 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, email, password, level } = await req.json();

        // Validation
        if (!name || !email || !password || !level) {
            return NextResponse.json({ 
                status: false, 
                code: 400,
                message: "All fields are required" 
            }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ 
                status: false, 
                code: 400,
                message: "Invalid email format" 
            }, { status: 400 });
        }

        // Level validation
        if (!["admin", "petani"].includes(level)) {
            return NextResponse.json({ 
                status: false, 
                code: 400,
                message: "Invalid level. Must be 'admin' or 'petani'" 
            }, { status: 400 });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(
            "SELECT id FROM users WHERE email = ?", 
            [email]
        );

        if (existingUser.length > 0) {
            return NextResponse.json({ 
                status: false, 
                code: 200, // Keep 200 as per your existing pattern
                message: "Email already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password, level) VALUES (?, ?, ?, ?)", 
            [name, email, hashedPassword, level]
        );

        return NextResponse.json({ 
            status: true, 
            code: 201,
            message: "User created successfully",
            data: { 
                id: result.insertId, 
                name, 
                email, 
                level 
                // Don't return password
            } 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ 
            status: false, 
            code: 500,
            message: "Failed to create user" 
        }, { status: 500 });
    }
}