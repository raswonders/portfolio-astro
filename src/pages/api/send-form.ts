import type { APIContext } from "astro";
import { URLSearchParams } from "url";

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

const isValidEmail = (email: string | null) => {
  return email ? email.includes("@") : false;
};

async function sendMail(data: FormData) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const message = `Name: ${data.get("name")}\n\n Email: ${data.get(
    "email"
  )}\n\n Message: ${data.get("message")}`;
  const emailData = {
    personalizations: [
      {
        to: [{ email: "rastislav.hepner@gmail.com" }],
      },
    ],
    from: { email: "rastislav.hepner@gmail.com" },
    subject: "Someone reached out from your portfolio",
    content: [
      {
        type: "text/plain",
        value: message,
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: await JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error(`Sending email has failed with status: ${response.status}`);
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/thank-you" },
  });
}
