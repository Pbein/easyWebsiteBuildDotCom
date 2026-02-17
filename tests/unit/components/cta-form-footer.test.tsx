// tests/unit/components/cta-form-footer.test.tsx
//
// Requirements-first tests for CtaBanner, FormContact, and FooterStandard.
//
// @requirements
// - FormContact: Custom validation (noValidate), required field errors
//   ("[Label] is required"), email format validation ("Please enter a valid
//   email"), success state on valid submission, label-input association via
//   htmlFor/id, required asterisk indicator, configurable submitText and
//   successMessage props.
// - CtaBanner: Primary CTA as navigable link with href, accessible section
//   with aria-label, optional secondary CTA, variant rendering.
// - FooterStandard: Column links as <a> with correct hrefs, social links
//   open in new tab (target="_blank"), semantic <footer> element, renders
//   gracefully without social links.

import { describe, it, expect } from "vitest";
import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../helpers/render-with-theme";
import {
  createCtaBannerProps,
  createFormContactProps,
  createFooterStandardProps,
} from "../../helpers/component-fixtures";
import { CtaBanner, FormContact, FooterStandard } from "@/components/library";

/* ================================================================
 * FormContact
 * ================================================================ */

describe("FormContact", () => {
  // @requirement: Submitting with empty required fields shows validation errors.
  // The form uses custom validation (noValidate) and checks each required field
  // on submit. Empty required fields produce "[Label] is required" error messages.
  it("shows validation errors when submitting with empty required fields", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FormContact {...createFormContactProps()} />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  // @requirement: Each required field shows "[Label] is required" when that
  // specific field is left empty while others are filled. Validates that error
  // messages are per-field, not a single generic error.
  it("shows a per-field error only for the empty required field", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FormContact {...createFormContactProps()} />);

    // Fill name and message but leave email empty
    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/message/i), "Hello there");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Only email should show an error
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Message is required")).not.toBeInTheDocument();
  });

  // @requirement: Invalid email format shows "Please enter a valid email".
  // The regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ rejects strings missing @ or domain.
  it("shows email format error for an invalid email address", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FormContact {...createFormContactProps()} />);

    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/message/i), "Hello there");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  // @requirement: Valid submission shows success message and hides the form.
  // After all validation passes, the form is replaced by a success message
  // containing the default text "Thank you! We'll get back to you soon."
  it("shows success message and hides the form on valid submission", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FormContact {...createFormContactProps()} />);

    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Success message should appear
    await waitFor(() => {
      expect(screen.getByText("Thank you! We'll get back to you soon.")).toBeInTheDocument();
    });

    // Form fields should no longer be in the document
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send message/i })).not.toBeInTheDocument();
  });

  // @requirement: Custom successMessage prop is displayed after valid submission.
  // The successMessage prop overrides the default success text.
  it("displays custom successMessage prop after valid submission", async () => {
    const user = userEvent.setup();
    const customMessage = "We received your inquiry!";
    renderWithTheme(<FormContact {...createFormContactProps({ successMessage: customMessage })} />);

    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  // @contract: Labels are associated with inputs via htmlFor/id pairing.
  // Each label's htmlFor matches the input's id (both set to field.name),
  // so getByLabelText can resolve the correct input.
  it("associates labels with inputs via htmlFor and id", () => {
    renderWithTheme(<FormContact {...createFormContactProps()} />);

    // getByLabelText relies on the htmlFor→id connection
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.tagName).toBe("INPUT");

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.tagName).toBe("INPUT");

    const messageInput = screen.getByLabelText(/message/i);
    expect(messageInput).toBeInTheDocument();
    expect(messageInput.tagName).toBe("TEXTAREA");
  });

  // @requirement: Required fields display an asterisk (*) indicator after the label.
  // The asterisk is a <span> inside the <label> element for each required field.
  it("displays asterisk indicator for required fields", () => {
    renderWithTheme(<FormContact {...createFormContactProps()} />);

    // All three fixture fields are required, so each label should contain *
    const labels = screen.getAllByText("*");
    expect(labels.length).toBe(3);
  });

  // @contract: Form element uses noValidate attribute to disable browser
  // validation in favor of custom validation logic.
  it("uses noValidate on the form element to disable browser validation", () => {
    const { container } = renderWithTheme(<FormContact {...createFormContactProps()} />);

    const form = container.querySelector("form");
    expect(form).toBeTruthy();
    expect(form!.noValidate).toBe(true);
  });

  // @boundary: Non-required fields do not trigger validation errors when empty.
  // Only required fields produce errors; optional fields are silently accepted.
  it("does not show errors for non-required fields left empty", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FormContact
        {...createFormContactProps({
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel", required: false },
            { name: "message", label: "Message", type: "textarea", required: true },
          ],
        })}
      />
    );

    // Fill all required fields, leave Phone (optional) empty
    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    // No validation errors should appear — submission should succeed
    await waitFor(() => {
      expect(screen.getByText("Thank you! We'll get back to you soon.")).toBeInTheDocument();
    });
    expect(screen.queryByText("Phone is required")).not.toBeInTheDocument();
  });

  // @requirement: Submit button shows the submitText prop value.
  // The button text is configurable via the submitText prop.
  it("renders the submit button with the submitText prop value", () => {
    renderWithTheme(<FormContact {...createFormContactProps({ submitText: "Contact Us" })} />);

    expect(screen.getByRole("button", { name: /contact us/i })).toBeInTheDocument();
  });
});

/* ================================================================
 * CtaBanner
 * ================================================================ */

describe("CtaBanner", () => {
  // @requirement: Primary CTA renders as a navigable link (<a>) with the
  // correct href attribute from ctaPrimary.href.
  it("renders primary CTA as a link with correct href", () => {
    renderWithTheme(<CtaBanner {...createCtaBannerProps()} />);

    const ctaLink = screen.getByRole("link", { name: "Start Free" });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/signup");
  });

  // @contract: The section element has an accessible aria-label matching the
  // headline prop, so screen readers can identify the banner region.
  it("renders section with aria-label matching the headline", () => {
    renderWithTheme(<CtaBanner {...createCtaBannerProps()} />);

    const section = screen.getByLabelText("Ready to Get Started?");
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe("SECTION");
  });

  // @requirement: Secondary CTA renders when the ctaSecondary prop is provided.
  // The secondary CTA is an <a> element with the correct href and text.
  it("renders secondary CTA when ctaSecondary is provided", () => {
    renderWithTheme(
      <CtaBanner
        {...createCtaBannerProps({
          ctaSecondary: { text: "Learn More", href: "/about" },
        })}
      />
    );

    const secondaryLink = screen.getByRole("link", { name: "Learn More" });
    expect(secondaryLink).toBeInTheDocument();
    expect(secondaryLink).toHaveAttribute("href", "/about");
  });

  // @contract: All variants ("full-width" and "contained") render without
  // crashing. This ensures variant-specific styling logic doesn't break rendering.
  it.each(["full-width", "contained"] as const)(
    'variant="%s" renders without crashing',
    (variant) => {
      const { container } = renderWithTheme(<CtaBanner {...createCtaBannerProps({ variant })} />);
      expect(container.querySelector("section")).toBeTruthy();
      expect(screen.getByText("Ready to Get Started?")).toBeInTheDocument();
    }
  );
});

/* ================================================================
 * FooterStandard
 * ================================================================ */

describe("FooterStandard", () => {
  // @requirement: Column links render as navigable <a> elements with correct
  // href attributes. Each column's links must be accessible and point to the
  // right destination.
  it("renders column links as <a> elements with correct hrefs", () => {
    renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);

    const featuresLink = screen.getByRole("link", { name: "Features" });
    expect(featuresLink).toHaveAttribute("href", "/features");

    const pricingLink = screen.getByRole("link", { name: "Pricing" });
    expect(pricingLink).toHaveAttribute("href", "/pricing");

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/about");

    const contactLink = screen.getByRole("link", { name: "Contact" });
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  // @requirement: Social links open in a new tab with target="_blank" and
  // rel="noopener noreferrer" for security. Social links use aria-label for
  // the platform name.
  it("renders social links with target=_blank and rel=noopener noreferrer", () => {
    renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);

    const twitterLink = screen.getByRole("link", { name: "twitter" });
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com/testbrand");

    const githubLink = screen.getByRole("link", { name: "github" });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(githubLink).toHaveAttribute("href", "https://github.com/testbrand");
  });

  // @contract: Footer renders as a semantic <footer> element with
  // role="contentinfo" for proper document structure and accessibility.
  it("renders as a semantic <footer> element", () => {
    const { container } = renderWithTheme(<FooterStandard {...createFooterStandardProps()} />);

    const footer = container.querySelector("footer");
    expect(footer).toBeTruthy();
    expect(footer!.getAttribute("role")).toBe("contentinfo");
  });

  // @boundary: Renders without crashing when socialLinks is undefined.
  // The footer should still display logo, tagline, columns, and copyright
  // even when no social links are provided.
  it("renders without social links when none are provided", () => {
    renderWithTheme(<FooterStandard {...createFooterStandardProps({ socialLinks: undefined })} />);

    // Core content still renders
    expect(screen.getByText("TestBrand")).toBeInTheDocument();
    expect(screen.getByText("Building better websites, faster.")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("2026 TestBrand. All rights reserved.")).toBeInTheDocument();

    // Social links should not be present
    expect(screen.queryByRole("link", { name: "twitter" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "github" })).not.toBeInTheDocument();
  });
});
