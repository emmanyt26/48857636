import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OfficialRole, OfficialStatus } from "@prisma/client";

// GET /api/officials - List officials with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const take = parseInt(searchParams.get("take") || "50", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    // Validate take parameter
    const safeTake = Math.min(Math.max(take, 1), 200);

    // Build filter
    const where: any = {};

    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ];
    }

    if (role && Object.values(OfficialRole).includes(role as OfficialRole)) {
      where.role = role;
    }

    if (
      status &&
      Object.values(OfficialStatus).includes(status as OfficialStatus)
    ) {
      where.status = status;
    }

    const [officials, total] = await Promise.all([
      prisma.sKOfficial.findMany({
        where,
        take: safeTake,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sKOfficial.count({ where }),
    ]);

    return NextResponse.json(
      {
        data: officials,
        pagination: {
          total,
          take: safeTake,
          skip,
          pages: Math.ceil(total / safeTake),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/officials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch officials" },
      { status: 500 }
    );
  }
}

// POST /api/officials - Create new official
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      middleName,
      role,
      status,
      termStart,
      termEnd,
      email,
      contactNo,
      address,
    } = body;

    // Validate required fields
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json(
        { error: "firstName is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      return NextResponse.json(
        { error: "lastName is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!role || !Object.values(OfficialRole).includes(role as OfficialRole)) {
      return NextResponse.json(
        {
          error: `role is required and must be one of: ${Object.values(OfficialRole).join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!termStart) {
      return NextResponse.json(
        { error: "termStart is required" },
        { status: 400 }
      );
    }

    // Validate termStart as valid date
    const termStartDate = new Date(termStart);
    if (isNaN(termStartDate.getTime())) {
      return NextResponse.json(
        { error: "termStart must be a valid date" },
        { status: 400 }
      );
    }

    // Validate termEnd if provided
    let termEndDate = null;
    if (termEnd) {
      termEndDate = new Date(termEnd);
      if (isNaN(termEndDate.getTime())) {
        return NextResponse.json(
          { error: "termEnd must be a valid date" },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    const finalStatus =
      status && Object.values(OfficialStatus).includes(status as OfficialStatus)
        ? status
        : OfficialStatus.ACTIVE;

    // Create official
    const official = await prisma.sKOfficial.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName?.trim() || null,
        role: role as OfficialRole,
        status: finalStatus as OfficialStatus,
        termStart: termStartDate,
        termEnd: termEndDate,
        email: email?.trim() || null,
        contactNo: contactNo?.trim() || null,
        address: address?.trim() || null,
      },
    });

    return NextResponse.json(official, { status: 201 });
  } catch (error) {
    console.error("POST /api/officials error:", error);
    return NextResponse.json(
      { error: "Failed to create official" },
      { status: 500 }
    );
  }
}
