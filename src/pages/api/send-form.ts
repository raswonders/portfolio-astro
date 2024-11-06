import type { APIContext } from "astro";
import { URLSearchParams } from "url";
import { isValidEmail, sendMail } from "../../utils";

export async function POST(context: APIContext) {
  let searchParams;

  try {
    const formData = await context.request.formData();
    searchParams = new URLSearchParams({
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    });

    let isFormValid = true;
    if (typeof formData.get("name") !== "string") {
      searchParams.append("nameError", "Invalid name");
      isFormValid = false;
    }
    if (
      typeof formData.get("email") !== "string" ||
      !isValidEmail(formData.get("email") as string | null)
    ) {
      searchParams.append("emailError", "Invalid email");
      isFormValid = false;
    }
    if (typeof formData.get("message") !== "string") {
      searchParams.append("message", "Invalid message");
      isFormValid = false;
    }

    if (!isFormValid) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/?${searchParams.toString()}#contact`,
        },
      });
    }

    return sendMail(formData);
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 303,
      headers: { Location: `/oops?${searchParams}` },
    });
  }
}
