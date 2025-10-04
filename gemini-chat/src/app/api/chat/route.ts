export async function POST(request: Request) {
    const body = await request.json();
    const message = body.message;

    if (!message) {
        return new Response("Message is required", { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response("API key is needed", { status: 500});
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const geminiRequestBody = {
        contents: [{ parts: [{ text: message }] }],
    };
    const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiRequestBody),
    });
    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Gemini API Error:", errorText);
        return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
    }
    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        return new Response(JSON.stringify({ error: "No response from gemini api"}), { status: 500 });
    }

    return new Response(JSON.stringify({ text: text }), { status: 200 });
    
}