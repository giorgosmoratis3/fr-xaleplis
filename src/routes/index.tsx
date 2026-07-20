import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Φιλολογικό Φροντιστήριο Χαλεπλής" },
      { name: "description", content: "Φιλολογικό Φροντιστήριο Χαλεπλής — Πρόγραμμα Σπουδών, Πανελλαδικές, Αποτελέσματα 2025." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);
  return null;
}
