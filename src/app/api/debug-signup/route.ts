import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("=== Debug Signup Request ===");
    
    // Log headers
    console.log("Headers:", Object.fromEntries(request.headers.entries()));
    
    // Get raw body
    const rawBody = await request.text();
    console.log("Raw body:", rawBody);
    
    // Try to parse JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
      console.log("Parsed body:", parsedBody);
    } catch (jsonError) {
      console.log("JSON parse error:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON", rawBody },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      receivedData: parsedBody,
      rawBody: rawBody
    });
    
  } catch (error) {
    console.error("Debug endpoint error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
