import {setGlobalOptions} from "firebase-functions";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as admin from "firebase-admin";
import {Resend} from "resend";

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

const resendApiKey = defineSecret("RESEND_API_KEY");

type SendVoucherRequest = {
  email: string;
};

export const sendVoucherEmail = onCall(
  {
    secrets: [resendApiKey],
  },
  async (request) => {
    const data = request.data as SendVoucherRequest;

    const email = data.email?.trim().toLowerCase();

    if (!email) {
      throw new HttpsError(
        "invalid-argument",
        "An email address is required."
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw new HttpsError(
        "invalid-argument",
        "Please enter a valid email address."
      );
    }

    // Check the actual game result on the server.
    // The app cannot simply claim that the players won.
    const sessionRef = admin
      .firestore()
      .doc("gameSessions/session001");

    const sessionSnapshot = await sessionRef.get();

    if (!sessionSnapshot.exists) {
      throw new HttpsError(
        "not-found",
        "The game session could not be found."
      );
    }

    const session = sessionSnapshot.data();

    const gameFinished =
      session?.gameFinished === true;

    const correctRounds =
      session?.correctRounds ?? 0;

    if (!gameFinished || correctRounds !== 6) {
      throw new HttpsError(
        "failed-precondition",
        "The voucher has not been unlocked."
      );
    }

    const resend = new Resend(
      resendApiKey.value()
    );

    const {data: emailResult, error} =
      await resend.emails.send({
        from: "PERi-PHRASE <onboarding@resend.dev>",
        to: [email],
        subject: "Your PERi-PHRASE Voucher 🌶️",
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 32px;
            "
          >
            <h1>
              Congratulations!
            </h1>

            <p>
              You completed PERi-PHRASE with
              <strong>6 out of 6 rounds correct.</strong>
            </p>

            <h2>
              Voucher Unlocked!
            </h2>

            <p>
              Show this email at the order desk
              to redeem your reward.
            </p>

            <p>
              Show your voucher at the order desk
              to collect your sticker pack.
            </p>

            <hr />

            <p>
              Thanks for playing PERi-PHRASE!
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        "Resend error:",
        error
      );

      throw new HttpsError(
        "internal",
        "The voucher email could not be sent."
      );
    }

    return {
      success: true,
      emailId: emailResult?.id ?? null,
    };
  }
);
