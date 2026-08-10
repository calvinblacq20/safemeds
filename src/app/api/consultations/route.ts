import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, ConsultationStatus } from "@/lib/prisma-client";
import { auth } from "@/app/auth";

// GET - Fetch consultations (for pharmacists and admins)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ConsultationWhereInput = {};

    if (status) {
      where.status = status as ConsultationStatus;
    }

    if (type) {
      where.type = type;
    }

    // Scope every role explicitly. Without this a CLIENT fell through with an
    // empty `where` and read every patient's consultation — symptoms,
    // medications and allergies included.
    if (session.user.role === "CLIENT") {
      where.userId = session.user.id;
    } else if (session.user.role === "PHARMACY") {
      // Their own queue plus anything not yet picked up.
      where.OR = [
        { assignedPharmacistId: session.user.id },
        { assignedPharmacistId: null },
      ];
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const consultations = await prisma.consultation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignedPharmacist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: true,
            prescriptions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.consultation.count({ where });

    return NextResponse.json({
      consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}

// POST - Create new consultation (supports anonymous)
export async function POST(request: NextRequest) {
  try {
    // Anonymous consultations are intentionally unauthenticated, so a missing
    // session is not an error here — it just decides which branch we take.
    const session = await auth();
    const body = await request.json();
    const {
      type,
      description,
      symptoms,
      medications,
      allergies,
      age,
      gender,
      isAnonymous = false,
      anonymousId,
    } = body;

    // Validate required fields
    if (!type || !description) {
      return NextResponse.json(
        { error: "Type and description are required" },
        { status: 400 }
      );
    }

    // Treat it as anonymous only when the caller asked for it AND there's no
    // session — otherwise a signed-in user's consultation was created with a
    // null userId and they could never see it again.
    const anonymous = isAnonymous || !session?.user;

    let finalAnonymousId = anonymousId;
    if (anonymous && !anonymousId) {
      finalAnonymousId = `anon_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 11)}`;
    }

    const consultation = await prisma.consultation.create({
      data: {
        type,
        description,
        symptoms,
        medications,
        allergies,
        age: age ? parseInt(age) : null,
        gender,
        isAnonymous: anonymous,
        anonymousId: anonymous ? finalAnonymousId : null,
        userId: anonymous ? null : session!.user.id,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      consultation,
      message: "Consultation created successfully",
    });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 }
    );
  }
}
