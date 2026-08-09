import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

type SendVoucherResponse = {
  success: boolean;
  emailId: string | null;
};

export async function sendVoucherEmail(
  email: string
): Promise<SendVoucherResponse> {
  const callable = httpsCallable<
    { email: string },
    SendVoucherResponse
  >(
    functions,
    "sendVoucherEmail"
  );

  const result = await callable({
    email,
  });

  return result.data;
}