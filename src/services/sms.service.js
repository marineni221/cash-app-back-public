const { Vonage } = require("@vonage/server-sdk");

require("dotenv").config();

const vonage = new Vonage({
  apiKey: "54b31cf8",
  apiSecret: "uTM5nMm8WcedUPae",
});

class SMSService {
  async sendVonageSMS() {
    const from = "KickOff";
    const to = "221783899860";
    const text = "A text message sent using the Vonage SMS API";

    await vonage.sms
      .send({ to, from, text })
      .then((resp) => {
        console.log("Message sent successfully");
        console.log(resp);
      })
      .catch((err) => {
        console.log("There was an error sending the messages.");
        console.error(err);
      });
  }

  async sendTwilioSMS(code) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_ACCOUNT_SUBACCOUNT_SID;
    const client = require("twilio")(accountSid, authToken);

    client.messages.create({
      body: `Use Verification Code ${code} for KickOff authentication`,
      to: "221783899860",
    });
  }

  async sendRemixSMS(code) {
    const headers = new Headers();
    headers.append(
      "Authorization",
      "App 9ec5087fe8edf728c2053748ab593f4b-7f775b98-9880-4b58-b757-78e0102a1758"
    );
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    const raw = JSON.stringify({
      messages: [
        {
          destinations: [{ to: "221783899860" }],
          from: "ServiceSMS",
          text: `Use Verification Code ${code} for CashApp authentication`,
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers,
      body: raw,
      redirect: "follow",
    };

    fetch("https://l3exdd.api.infobip.com/sms/2/text/advanced", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }
}

module.exports = SMSService;
