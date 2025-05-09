// import { promises as fs } from "fs";
// import path from "path";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const filePath = path.join(process.cwd(), "public", "students.json");
//     const fileData = await fs.readFile(filePath, "utf-8");
//     const students = JSON.parse(fileData);

//     const randomStudent = students[Math.floor(Math.random() * students.length)];

//     return NextResponse.json({
//       studentName: randomStudent.name,
//       grade: randomStudent.grade,
//       topic: randomStudent.math_topic
//     });
//   } catch (err) {
//     console.error("Error loading student file:", err);
//     return NextResponse.json({ error: "Failed to load student data" }, { status: 500 });
//   }
// }

import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "students.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const students = JSON.parse(fileData);

    const randomStudent = students[Math.floor(Math.random() * students.length)];

    return NextResponse.json({
      studentName: randomStudent.name,
      grade: randomStudent.grade,
      topic: randomStudent.math_topic,
      project: randomStudent.project // Include project details
    });
  } catch (err) {
    console.error("Error loading student file:", err);
    return NextResponse.json({ error: "Failed to load student data" }, { status: 500 });
  }
}
