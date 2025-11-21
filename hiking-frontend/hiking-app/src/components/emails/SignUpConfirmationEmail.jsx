import React, { useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";

const SignUpConfirmationEmail = ({ email, name }) => {
  const form = useRef();

  const SignUpConfirmationEmail = (e, email, name) => {
    e.preventDefault();

    emailjs
      .sendForm("service_8zw734r", "template_a2glu8w", form.current, {
        to_email: email,
        publicKey: "ep3Vw8glFIWt6Mzvk",
      })
      .then(
        () => {
          console.log("Confirmation email sent successfully!");
        },
        (error) => {
          console.log("Failed to send confirmation email:", error.text);
        }
      );
  };

  useEffect(() => {
    SignUpConfirmationEmail(email, name);
  }, []);

  return (
    <form ref={form} onSubmit={SignUpConfirmationEmail}>
      <input type="hidden" name="to_name" value={name} />
      <input type="hidden" name="to_email" value={email} />
      <input type="hidden" name="message" value="Thank you for signing up!" />
      <input type="submit" style={{ display: "none" }} />{" "}
      {/* Hidden submit button */}
    </form>
  );
};

export default SignUpConfirmationEmail;
