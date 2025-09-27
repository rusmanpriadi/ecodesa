



// PUT update session
export async function PUT(req) {
  try {
    const { id, nama } = await req.json();
    const [rows] = await pool.query(
      "UPDATE ahp_session SET nama = ? WHERE id = ?",
      [nama, id]
    );

    return NextResponse.json({
      status: true,
      code: rows.affectedRows === 1 ? 200 : 404,
      message:
        rows.affectedRows === 1
          ? "Session updated successfully"
          : "Session not found",
      data: { id, nama },
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error updating session",
      error: error.message,
    });
  }
}

// DELETE hapus session
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const [rows] = await pool.query("DELETE FROM ahp_session WHERE id = ?", [
      id,
    ]);

    return NextResponse.json({
      status: true,
      code: rows.affectedRows === 1 ? 200 : 404,
      message:
        rows.affectedRows === 1
          ? "Session deleted successfully"
          : "Session not found",
      data: { id },
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error deleting session",
      error: error.message,
    });
  }
}
