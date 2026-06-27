import { useAppContext } from "../AppContext";
import { CONTACTS } from "../data";

export function ContactDetail() {
  const { state } = useAppContext();

  const contact = CONTACTS.find((c) => c.id === state.selectedContact);

  if (!contact) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--r-t3)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "48px" }}>👥</div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>
          Select a contact to view profile
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "var(--r-bg)",
          borderBottom: "1px solid var(--r-bd)",
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: contact.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "600",
            color: "white",
            flexShrink: 0,
          }}
        >
          {contact.initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--r-t1)",
              margin: "0 0 4px 0",
            }}
          >
            {contact.name}
          </h2>
          <div
            style={{
              fontSize: "14px",
              color: "var(--r-t2)",
              marginBottom: "8px",
            }}
          >
            {contact.handle}
          </div>
          {contact.onRelay && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#22C55E",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#22C55E",
                }}
              />
              On Relay
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{ flex: 1, padding: "20px" }}>
        <section style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--r-t2)",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Contact Info
          </h3>
          <div
            style={{
              backgroundColor: "var(--r-sf)",
              borderRadius: "8px",
              padding: "16px",
              border: "1px solid var(--r-bd)",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--r-t3)",
                  marginBottom: "4px",
                }}
              >
                Email
              </div>
              <div style={{ fontSize: "14px", color: "var(--r-t1)" }}>
                {contact.handle}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--r-t3)",
                  marginBottom: "4px",
                }}
              >
                Network
              </div>
              <div style={{ fontSize: "14px", color: "var(--r-t1)" }}>
                {contact.onRelay ? "Relay" : "External"}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--r-t2)",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Actions
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "1px solid var(--r-bd)",
                backgroundColor: "transparent",
                color: "var(--r-t1)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              Send Message
            </button>
            <button
              type="button"
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "1px solid var(--r-bd)",
                backgroundColor: "transparent",
                color: "var(--r-t1)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              Start Group
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
