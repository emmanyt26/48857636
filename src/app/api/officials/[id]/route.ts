import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OfficialRole, OfficialStatus } from "@prisma/client";

type RouteParams = {
  params: {
    id: string;
  };
};

// GET /api/officials/[id] - Get official by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const official = await prisma.sKOfficial.findUnique({
      where: { id },
    });

    if (!official) {
      return NextResponse.json(
        { error: "Official not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(official, { status: 200 });
  } catch (error) {
    console.error("GET /api/officials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch official" },
      { status: 500 }
    );
  }
}

// PUT /api/officials/[id] - Update official by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if official exists
    const existing = await prisma.sKOfficial.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Official not found" },
        { status: 404 }
      );
    }

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

    // Build update data (only include provided fields)
    const updateData: any = {};

    if (firstName !== undefined) {
      if (typeof firstName !== "string" || !firstName.trim()) {
        return NextResponse.json(
          { error: "firstName must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      if (typeof lastName !== "string" || !lastName.trim()) {
        return NextResponse.json(
          { error: "lastName must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.lastName = lastName.trim();
    }

    if (middleName !== undefined) {
      updateData.middleName = middleName?.trim() || null;
    }

    if (role !== undefined) {
      if (!Object.values(OfficialRole).includes(role as OfficialRole)) {
        return NextResponse.json(
          {
            error: `role must be one of: ${Object.values(OfficialRole).join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateData.role = role as OfficialRole;
    }

    if (status !== undefined) {
      if (!Object.values(OfficialStatus).includes(status as OfficialStatus)) {
        return NextResponse.json(
          {
            error: `status must be one of: ${Object.values(OfficialStatus).join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateData.status = status as OfficialStatus;
    }

    if (termStart !== undefined) {
      const termStartDate = new Date(termStart);
      if (isNaN(termStartDate.getTime())) {
        return NextResponse.json(
          { error: "termStart must be a valid date" },
          { status: 400 }
        );
      }
      updateData.termStart = termStartDate;
    }

    if (termEnd !== undefined) {
      if (termEnd === null) {
        updateData.termEnd = null;
      } else {
        const termEndDate = new Date(termEnd);
        if (isNaN(termEndDate.getTime())) {
          return NextResponse.json(
            { error: "termEnd must be a valid date" },
            { status: 400 }
          );
        }
        updateData.termEnd = termEndDate;
      }
    }

    if (email !== undefined) {
      updateData.email = email?.trim() || null;
    }

    if (contactNo !== undefined) {
      updateData.contactNo = contactNo?.trim() || null;
    }

    if (address !== undefined) {
      updateData.address = address?.trim() || null;
    }

    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existing, { status: 200 });
    }

    const official = await prisma.sKOfficial.update({
      where: { id },
      data: updateData,
    });

    // audit logging removed for officials module

    return NextResponse.json(official, { status: 200 });
  } catch (error) {
    console.error("PUT /api/officials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update official" },
      { status: 500 }
    );
  }
}

// DELETE /api/officials/[id] - Delete official by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if official exists
    const existing = await prisma.sKOfficial.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Official not found" },
        { status: 404 }
      );
    }

    const official = await prisma.sKOfficial.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Official deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/officials/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete official" },
      { status: 500 }
    );
  }
}
