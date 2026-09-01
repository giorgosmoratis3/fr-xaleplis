import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Φιλολογικό Φροντιστήριο Χαλεπλής | Λαμία" },
      {
        name: "description",
        content:
          "Φιλολογικό Φροντιστήριο Χαλεπλής στη Λαμία — Πρόγραμμα Σπουδών, Πανελλαδικές, Αποτελέσματα 2025 & 2026.",
      },
      {
        name: "google-site-verification",
        content: "Vxs9UBvPSAB5r2_LlQXzapaqNFpFwiLWfkhCzg35DcU",
      },
      { property: "og:title", content: "Φιλολογικό Φροντιστήριο Χαλεπλής | Λαμία" },
      {
        property: "og:description",
        content:
          "Φιλολογικό Φροντιστήριο Χαλεπλής στη Λαμία — Πρόγραμμα Σπουδών, Πανελλαδικές, Αποτελέσματα 2025 & 2026.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://fr-xaleplis.gr/" },
      {
        property: "og:image",
        content: "https://fr-xaleplis.gr/site/chalepelis-logo.jpeg",
      },
      {
        property: "og:image:alt",
        content: "Φιλολογικό Φροντιστήριο Χαλεπλής",
      },
      {
        name: "twitter:image",
        content: "https://fr-xaleplis.gr/site/chalepelis-logo.jpeg",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://fr-xaleplis.gr/" }],
  }),

  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);
  return null;
}
