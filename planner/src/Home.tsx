import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "./firebase";
import { OrgContext } from "./context/orgContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Loader";

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const { LogIn, SignUp, pending, error } = useContext(OrgContext);
  const [start, setStart] = useState(false);
  // @ts-ignore
  function handleSignin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    // @ts-ignore
    LogIn(formObject.token.trim());
    setStart(true);
  }

  useEffect(() => {
    if (start && !pending && error) {
      toast("❌ Error: " + error);
      setStart(false);
    }
  }, [pending]);

  console.log(start, pending, error);

  // @ts-ignore
  async function handleCreate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    // @ts-ignore
    SignUp(formObject.username.trim());
    setStart(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: `
                linear-gradient(135deg, rgba(240, 249, 255, 0.6) 0%, rgba(214, 240, 253, 0.6) 100%),
                repeating-linear-gradient(45deg, rgba(191, 219, 254, 0.1) 0px, rgba(191, 219, 254, 0.1) 40px, transparent 40px, transparent 80px)
            `,
        color: "#1e293b",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)",
          top: "-100px",
          right: "-100px",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.1) 100%)",
          bottom: "-200px",
          left: "-200px",
          zIndex: 0,
        }}
      ></div>

      {/* Content Container */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              background: "linear-gradient(to right, #3b82f6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Planner
          </div>
        </header>

        {/* Hero Section */}
        <section
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 800,
              marginBottom: "24px",
              lineHeight: 1.2,
              background: "linear-gradient(to right, #1e40af, #7e22ce)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Find the Perfect Meeting Time, Effortlessly
          </h1>
          <p
            style={{
              fontSize: "20px",
              maxWidth: "800px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
              color: "#475569",
            }}
          >
            Planner automatically analyzes{" "}
            <span style={{ fontWeight: "bold" }}>Pronote</span> timetables to
            find the best available time slots for everyone. No more
            back-and-forth scheduling.
          </p>

          {/* Call to Action */}
          <button
            onClick={() => setIsOpen((prevState) => !prevState)}
            style={{
              background: "linear-gradient(to right, #3b82f6, #2563eb)",
              color: "white",
              border: "none",
              padding: "16px 32px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginBottom: "40px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
            }}
          >
            {isOpen ? "Close" : "Get Started"}
          </button>

          {/* Forms Container */}
          {isOpen && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                maxWidth: "800px",
                margin: "0 auto",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            >
              <div style={{ marginBottom: "40px" }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    marginBottom: "24px",
                    color: "#1e293b",
                  }}
                >
                  Access Your Schedule
                </h2>
                <form
                  onSubmit={handleSignin}
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    autoComplete="off"
                    name="token"
                    style={{
                      flexGrow: 1,
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                      outline: "none",
                      boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                    }}
                    type="text"
                    placeholder="Enter your schedule token"
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#3b82f6")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#cbd5e1")
                    }
                  />
                  {pending ? (
                    <Loader width="40px" height="40px" />
                  ) : (
                    <button
                      style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "14px 24px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "background-color 0.2s",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2563eb")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#3b82f6")
                      }
                    >
                      Access Schedule
                    </button>
                  )}
                </form>
              </div>

              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    marginBottom: "24px",
                    color: "#1e293b",
                  }}
                >
                  Create New Schedule
                </h2>
                <form
                  onSubmit={handleCreate}
                  style={{
                    display: "flex",

                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    autoComplete="off"
                    name="username"
                    style={{
                      flexGrow: 1,
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "16px",
                      transition: "border-color 0.2s",
                      outline: "none",
                      boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                    }}
                    type="text"
                    placeholder="Enter your name"
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#3b82f6")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#cbd5e1")
                    }
                  />
                  {pending ? (
                    <Loader width="40px" height="40px" />
                  ) : (
                    <button
                      style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "14px 24px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "background-color 0.2s",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2563eb")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#3b82f6")
                      }
                    >
                      Create Schedule
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </section>

        {/* Features */}
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "32px",
            marginBottom: "60px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1",
              minWidth: "250px",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "16px",
                color: "#334155",
              }}
            >
              Synchronize with Pronote
            </h3>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.6 }}>
              Automatically imports everyone's schedules from Pronote to find
              the best meeting times.
            </p>
          </div>
          <div
            style={{
              flex: "1",
              minWidth: "250px",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "16px",
                color: "#334155",
              }}
            >
              Quick & Simple
            </h3>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.6 }}>
              Set up in seconds. No complicated registration. Just enter your
              name and start planning.
            </p>
          </div>
          <div
            style={{
              flex: "1",
              minWidth: "250px",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "16px",
                color: "#334155",
              }}
            >
              Free Forever
            </h3>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.6 }}>
              Planner is completely free to use with no limitations or hidden
              costs.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            marginTop: "60px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          © {new Date().getFullYear()} Planner - Find the best time for
          everyone, effortlessly.
        </footer>
      </div>
      <ToastContainer />
    </div>
  );
};
