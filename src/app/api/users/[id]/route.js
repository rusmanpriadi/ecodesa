import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }
        const user = rows[0];
        return NextResponse.json({ status: true, code: 200, message: "Data user", data: user });
    } catch (error) {
        return NextResponse.json({ status: false, code: 500, message: "Error getting user", error: error.message });
    }
}

export async function DELETE(req, context) {
    try {
        const { id } = await context.params;
        const [rows] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
        return NextResponse.json({ status: true, code: 200, message: "User deleted successfully", data: { id } });
    } catch (error) {
        return NextResponse.json({ status: false, code: 500, message: "Error deleting user", error: error.message });
    }
}

// PUT - Update user
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, email, password, level } = await req.json();

    // Validation
    if (!name || !email || !level) {
      return NextResponse.json({ 
        status: false, 
        code: 400,
        message: "Name, email, and level are required" 
      }, { status: 400 });
    }

    // Validasi name
    if (name.trim().length < 3) {
      return NextResponse.json({ 
        status: false, 
        code: 400,
        message: "Name must be at least 3 characters" 
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

    // Password validation (jika diisi)
    if (password && password.trim() && password.length < 6) {
      return NextResponse.json({ 
        status: false, 
        code: 400,
        message: "Password must be at least 6 characters" 
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

    // Check if user exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE id = ?", 
      [id]
    );

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        status: false, 
        code: 404,
        message: "User not found" 
      }, { status: 404 });
    }

    // Check if email already exists (untuk user lain)
    const [emailCheck] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND id != ?", 
      [email, id]
    );

    if (emailCheck.length > 0) {
      return NextResponse.json({ 
        status: false, 
        code: 200, // Keep 200 as per your pattern
        message: "Email already exists" 
      });
    }

    // Build update query
    let updateQuery = "UPDATE users SET name = ?, email = ?, level = ?";
    let updateParams = [name, email, level];

    // Only update password if provided
    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password = ?";
      updateParams.push(hashedPassword);
    }

    updateQuery += " WHERE id = ?";
    updateParams.push(id);

    await pool.query(updateQuery, updateParams);

    return NextResponse.json({ 
      status: true, 
      code: 200,
      message: "User updated successfully",
      data: { id, name, email, level } 
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ 
      status: false, 
      code: 500,
      message: "Failed to update user" 
    }, { status: 500 });
  }
}
