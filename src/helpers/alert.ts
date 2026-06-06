export class Alert {

    constructor() {

    }

    // async sendDiscordMessage(message: string, webhookUrl: string) {
    //     const response = await fetch(webhookUrl, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             content: message,
    //         }),
    //     });

    //     if (!response.ok) {
    //         throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    //     }
    // }
}

export async function sendDiscordMessage(message: string, webhookUrl: string) {
    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: message,
        }),
    });

    if (!response.ok) {
        throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }
}