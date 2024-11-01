import type { APIContext } from "astro";

export async function POST(context: APIContext) {
  try {
    const formData = await context.request.formData();
    const errors = { name: "", email: "", message: "" };
    let isFormValid = true;

    if (typeof formData.get("name") !== "string") {
      errors.name = "Invalid name";
      isFormValid = false;
    }
    if (typeof formData.get("email") !== "string" || !isValidEmail(formData.get("email") as string | null)) {
      errors.email = "Invalid email";
      isFormValid = false;
    }
    if (typeof formData.get("message") !== "string") {
      errors.message = "Invalid message";
      isFormValid = false;
    }

    // TODO test redirect in case of invalid form
    if (!isFormValid) {
      const errorParams = new URLSearchParams(Object.entries(errors));
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/${errorParams}`
        }
      })
    }

    return sendMail(formData);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}


const isValidEmail = (email: string | null) => {
  return email ? email.includes("@") : false;
};

async function sendMail(data: FormData) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const message = `Name: ${data.get("name")}\n\n Email: ${data.get("email")}\n\n Message: ${data.get("message")}`;
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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: await JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`status ${response.status}`);
      return response;
    }

    return new Response(null, { status: 303, headers: { "Location": "/thank-you" } })
  } catch (error) {
    console.error(error);
    // TODO handle send error gracefully
  }
}


