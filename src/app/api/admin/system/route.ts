import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      hostname: os.hostname(),
      dbType: process.env.DB_TYPE || "sqlite",
    };

    return NextResponse.json({ data: systemInfo });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch system info" },
      { status: 500 }
    );
  }
}
