// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useContext, useEffect, useRef, useState } from "react";
import { OrgContext } from "./context/orgContext";
import Modal from "react-modal";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
// icons
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Loader from "./Loader";
import OrgDetails from "./OrgDetails";
import { FaCopy } from "react-icons/fa";

const Dashboard = () => {
  const { LogOut, scheduleData, userTokens, authIsReady } =
    useContext(OrgContext);
  const [canUpdate, setCanUpdate] = useState(false);
  const ref = useRef(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [deletingUser, setDeletingUser] = useState(false);
  const [editing, setEditing] = useState(false);
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [logoutWarningModalOpen, setLogoutWarningModalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState("");
  const [orgName, setOrgName] = useState(scheduleData?.orgName || "");
  const [orgInfo, setOrgInfo] = useState(scheduleData?.orgInfo || "");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define a constant for mobile breakpoint
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    if (scheduleData) {
      setOrgName(scheduleData.orgName || "");
      setOrgInfo(scheduleData.orgInfo || "");
    }
  }, [scheduleData]);

  useEffect(() => {
    if (!userTokens && authIsReady) {
      console.log("redirecting");
      navigate("/");
    }
  }, [userTokens, authIsReady]);

  function handleDeleteUser() {
    setIsOpen(false);
    if (!auth.currentUser)
      return toast("❌ Please sign in", {
        autoClose: 2000,
        hideProgressBar: true,
      });

    setDeletingUser(true);
    // delete user
    deleteDoc(
      doc(db, "organisations/" + auth.currentUser.uid + "/persons/" + user)
    )
      .then(() => {
        toast("✅ User deleted successfully", {
          autoClose: 2000,
          hideProgressBar: true,
        });
        setDeletingUser(false);
      })
      .catch((err) => {
        toast("❗ Couldn't delete user: " + err.code, {
          autoClose: 2000,
          hideProgressBar: true,
        });
        setDeletingUser(false);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!auth.currentUser)
      return toast("❌ Please sign in", {
        autoClose: 2000,
        hideProgressBar: true,
      });
    if (!scheduleData || !scheduleData.free) {
      return;
    }

    const formData = new FormData(ref.current);
    const formKeys = Object.keys(Object.fromEntries(formData.entries()));

    // modified data
    const newData = {
      ...scheduleData,
      free: scheduleData.free.map((option, index) => {
        return {
          ...option,
          starred: formKeys.includes(String(index)),
        };
      }),
      orgName: orgName,
      orgInfo: orgInfo,
    };

    updateDoc(doc(db, "organisations/" + auth.currentUser.uid), {
      free: newData.free,
      orgName: orgName,
      orgInfo: orgInfo,
    })
      .then(() => {
        toast("✅ Schedule updated successfully", {
          autoClose: 2000,
          hideProgressBar: true,
        });
      })
      .catch((err) => {
        toast("❗ Couldn't update schedule: " + err.code, {
          autoClose: 2000,
          hideProgressBar: true,
        });
      });

    setCanUpdate(false);
    setEditing(false);
  }

  function handleChange(e) {
    const formData = new FormData(ref.current);
    const formKeys = Object.keys(Object.fromEntries(formData.entries()));

    let changed = false;
    const simplified = scheduleData?.free.reduce((total, el, index) => {
      if (el.starred) total.push(index);
      return total;
    }, []);

    for (const key of formKeys) {
      if (simplified.includes(Number(key))) {
        // not modified
      } else {
        // is not
        changed = true;
        break;
      }
    }

    if (formKeys.length !== simplified.length) {
      changed = true;
    }

    if (
      changed ||
      orgName !== scheduleData?.orgName ||
      orgInfo !== scheduleData?.orgInfo
    ) {
      setCanUpdate(true);
    } else {
      setCanUpdate(false);
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  function copyToClipBoard(text, message = "Copied!") {
    navigator.clipboard.writeText(text);
    toast(message, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  }

  function resetForm() {
    setCanUpdate(false);
    ref.current?.reset();
    setEditing(false);
    setOrgName(scheduleData?.orgName || "");
    setOrgInfo(scheduleData?.orgInfo || "");
  }

  const shareUrl = userTokens
    ? `https://pronote-planner.web.app/org/${userTokens[0]}`
    : "";
  const credentials = userTokens ? `${userTokens[0]}:${userTokens[1]}` : "";

  // Modal styles with mobile improvements
  const customModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(5px)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      borderRadius: "16px",
      padding: isMobile ? "20px" : "32px",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: "none",
      width: isMobile ? "85%" : "90%",
      maxWidth: "500px",
      maxHeight: "80vh", // Limit height to enable scrolling
      overflow: "auto", // Enable scrolling within modal
      position: "absolute", // Ensure the modal has its own scroll context
    },
  };

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

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px 16px" : "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "24px",
            gap: "16px",
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
            Planner Dashboard
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "12px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: isMobile ? "100%" : "auto",
              }}
              onMouseEnter={() => setTooltipVisible("credentials")}
              onMouseLeave={() => setTooltipVisible("")}
            >
              <button
                onClick={() => setCredentialModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "linear-gradient(to right, #0ea5e9, #0284c7)",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <FaKey /> Credentials
              </button>
              {tooltipVisible === "credentials" && !isMobile && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    zIndex: 100,
                  }}
                >
                  View your account credentials
                </div>
              )}
            </div>

            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: isMobile ? "100%" : "auto",
              }}
              onMouseEnter={() => setTooltipVisible("logout")}
              onMouseLeave={() => setTooltipVisible("")}
            >
              <button
                onClick={() => setLogoutWarningModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "linear-gradient(to right, #ef4444, #dc2626)",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
              {tooltipVisible === "logout" && !isMobile && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    zIndex: 100,
                  }}
                >
                  Sign out of your account
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Share URL Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "12px",
            marginBottom: "32px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                Share Link
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  marginBottom: "12px",
                }}
              >
                Share this link with others to add their timetables
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    isMobile && windowWidth < 550 ? "column" : "row",
                  alignItems:
                    isMobile && windowWidth < 550 ? "stretch" : "center",
                  gap: "12px",
                }}
              >
                <input
                  readOnly
                  value={shareUrl}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    width: "89%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    flexShrink: 0,
                    width: isMobile && windowWidth < 550 ? "100%" : "auto",
                  }}
                  onMouseEnter={() => setTooltipVisible("copyLink")}
                  onMouseLeave={() => setTooltipVisible("")}
                >
                  <button
                    onClick={() =>
                      copyToClipBoard(shareUrl, "✅ Share link copied!")
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(to right, #0ea5e9, #0284c7)",
                      padding: "12px 16px",
                      fontSize: "14px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      width: isMobile && windowWidth < 550 ? "100%" : "42px",
                      height: isMobile && windowWidth < 550 ? "auto" : "42px",
                    }}
                  >
                    <FaCopy />
                  </button>
                  {tooltipVisible === "copyLink" && !isMobile && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        zIndex: 100,
                      }}
                    >
                      Copy share link
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "12px",
            marginBottom: "32px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              marginBottom: isMobile ? "24px" : "16px",
              gap: isMobile ? "16px" : "0",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Organization Details
            </h2>

            {!editing ? (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: isMobile ? "100%" : "auto",
                }}
                onMouseEnter={() => setTooltipVisible("editMode")}
                onMouseLeave={() => setTooltipVisible("")}
              >
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "linear-gradient(to right, #3b82f6, #2563eb)",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <MdEdit /> Edit Mode
                </button>
                {tooltipVisible === "editMode" && !isMobile && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      zIndex: 100,
                    }}
                  >
                    Enable schedule editing
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "12px",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: isMobile ? "100%" : "auto",
                  }}
                  onMouseEnter={() => setTooltipVisible("save")}
                  onMouseLeave={() => setTooltipVisible("")}
                >
                  <button
                    onClick={handleSubmit}
                    disabled={!canUpdate}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: canUpdate
                        ? "linear-gradient(to right, #10b981, #059669)"
                        : "linear-gradient(to right, #9ca3af, #6b7280)",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: canUpdate ? "pointer" : "not-allowed",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      opacity: canUpdate ? 1 : 0.7,
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <FaRegSave /> Save Changes
                  </button>
                  {tooltipVisible === "save" && !isMobile && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        zIndex: 100,
                      }}
                    >
                      Save your changes
                    </div>
                  )}
                </div>

                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: isMobile ? "100%" : "auto",
                  }}
                  onMouseEnter={() => setTooltipVisible("cancel")}
                  onMouseLeave={() => setTooltipVisible("")}
                >
                  <button
                    onClick={resetForm}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "linear-gradient(to right, #ef4444, #dc2626)",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <IoMdClose /> Cancel
                  </button>
                  {tooltipVisible === "cancel" && !isMobile && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        zIndex: 100,
                      }}
                    >
                      Cancel editing
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "#334155",
                }}
              >
                Meeting Name (appears first for users)
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  setCanUpdate(true);
                }}
                disabled={!editing}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  backgroundColor: editing ? "white" : "#f1f5f9",
                  color: editing ? "#0f172a" : "#64748b",
                  outline: "none",
                  transition: "all 0.2s",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "#334155",
                }}
              >
                Description
              </label>
              <textarea
                value={orgInfo}
                onChange={(e) => {
                  setOrgInfo(e.target.value);
                  setCanUpdate(true);
                }}
                disabled={!editing}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  backgroundColor: editing ? "white" : "#f1f5f9",
                  color: editing ? "#0f172a" : "#64748b",
                  outline: "none",
                  minHeight: "60px",
                  resize: "vertical",
                  transition: "all 0.2s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: isMobile ? "16px" : "24px",
            borderRadius: "12px",
            marginBottom: "32px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Available Time Slots
            </h2>
          </div>

          {scheduleData && scheduleData.free ? (
            <form ref={ref} onChange={handleChange} onSubmit={handleSubmit}>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderSpacing: 0,
                    marginTop: "8px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      <th
                        style={{
                          padding: isMobile ? "8px 12px" : "12px 16px",
                          textAlign: "left",
                          backgroundColor: "rgba(241, 245, 249, 0.5)",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#334155",
                          width: "80px",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "8px 12px" : "12px 16px",
                          textAlign: "left",
                          backgroundColor: "rgba(241, 245, 249, 0.5)",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        Time Slot
                      </th>
                      <th
                        style={{
                          padding: isMobile ? "8px 12px" : "12px 16px",
                          textAlign: "left",
                          backgroundColor: "rgba(241, 245, 249, 0.5)",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        Available People
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.free.map((slot, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: slot.starred
                            ? "rgba(254, 249, 195, 0.3)"
                            : "transparent",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <td
                          style={{
                            padding: isMobile ? "8px 12px" : "12px 16px",
                            fontSize: "14px",
                            color: "#64748b",
                            textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {slot.starred ? (
                            <div
                              style={{
                                color: "#eab308",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="16"
                                height="16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : editing ? (
                            <div
                              style={{
                                color: "#94a3b8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                width="16"
                                height="16"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                            </div>
                          ) : null}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "8px 12px" : "12px 16px",
                            fontSize: "14px",
                            fontWeight: slot.starred ? 600 : 400,
                            color: slot.starred ? "#0f172a" : "#334155",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <span>{slot.time}</span>

                          {editing && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                                width: "20px",
                                height: "20px",
                              }}
                            >
                              <input
                                name={String(index)}
                                type="checkbox"
                                defaultChecked={slot.starred}
                                style={{
                                  position: "absolute",
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                  zIndex: 2,
                                  opacity: 0, // Hide the checkbox but keep it clickable
                                }}
                              />
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  border: "2px solid #cbd5e1",
                                  borderRadius: "4px",
                                  backgroundColor: slot.starred
                                    ? "#3b82f6"
                                    : "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  pointerEvents: "none", // Allow clicks to pass through to the checkbox
                                }}
                              >
                                {slot.starred && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="16"
                                    height="16"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "8px 12px" : "12px 16px",
                            fontSize: "14px",
                            color: "#334155",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            {slot.users.map((user) => (
                              <div
                                key={user}
                                onClick={() => {
                                  setIsOpen(true);
                                  setUser(user);
                                }}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "99px",
                                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                                  border: "1px solid rgba(59, 130, 246, 0.2)",
                                  color: "#3b82f6",
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "rgba(59, 130, 246, 0.2)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "rgba(59, 130, 246, 0.1)";
                                }}
                              >
                                {user}
                                <FaTrashAlt
                                  size={12}
                                  style={{ opacity: 0.7 }}
                                />
                              </div>
                            ))}
                            {deletingUser && (
                              <Loader width="20px" height="20px" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(!scheduleData || scheduleData.free.length === 0) && (
                <div
                  style={{
                    padding: "40px 0",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "16px",
                  }}
                >
                  No available time slots found. Share your schedule link to get
                  started.
                </div>
              )}
            </form>
          ) : (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              No schedule data available. Share your schedule link to get
              started.
            </div>
          )}
        </div>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            marginTop: "60px",
            color: "#64748b",
            fontSize: "14px",
            paddingBottom: "20px",
          }}
        >
          © {new Date().getFullYear()} Planner - Find the best time for
          everyone, effortlessly.
        </footer>
      </div>

      {/* Delete User Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={"Delete User: " + user}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <div
          style={{
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "#ef4444",
            }}
          >
            <FaTrashAlt size={24} />
          </div>

          <h2
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Delete User Timetable
          </h2>

          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              marginBottom: "24px",
              color: "#475569",
            }}
          >
            Are you sure you want to delete <strong>{user}</strong>'s timetable?
            This action cannot be undone.
          </p>

          <p
            style={{
              fontSize: "14px",
              marginBottom: "24px",
              color: "#64748b",
            }}
          >
            Note: It might take up to a minute for changes to reflect.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteUser}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Credentials Modal */}
      <Modal
        isOpen={credentialModalOpen}
        onRequestClose={() => setCredentialModalOpen(false)}
        contentLabel="Your Secret Credentials"
        style={customModalStyles}
        ariaHideApp={false}
      >
        <div
          style={{
            textAlign: "center",
            color: "#0f172a",
            maxHeight: "calc(80vh - 40px)",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "#3b82f6",
            }}
          >
            <FaKey size={24} />
          </div>

          <h2
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Your Account Credentials
          </h2>

          <div
            style={{
              padding: "16px",
              backgroundColor: "rgba(241, 245, 249, 0.5)",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #e2e8f0",
              wordBreak: "break-all",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          >
            {credentials}
          </div>

          <p
            style={{
              fontSize: "14px",
              marginBottom: "24px",
              color: "#ef4444",
              fontWeight: 500,
            }}
          >
            Your credentials are not resetable, so please keep them extremely
            secret
          </p>

          <p
            style={{
              fontSize: "14px",
              marginBottom: "24px",
              color: "#64748b",
            }}
          >
            Note: Your credentials are stored in your browser's local storage
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "8px",
            }}
          >
            <button
              onClick={() =>
                copyToClipBoard(credentials, "✅ Credentials copied!")
              }
              style={{
                padding: "10px 20px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <FaRegCopy /> Copy Credentials
            </button>

            <button
              onClick={() => setCredentialModalOpen(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Logout Warning Modal */}
      <Modal
        isOpen={logoutWarningModalOpen}
        onRequestClose={() => setLogoutWarningModalOpen(false)}
        contentLabel="Logout Confirmation"
        style={customModalStyles}
        ariaHideApp={false}
      >
        <div
          style={{
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "#ef4444",
            }}
          >
            <FaSignOutAlt size={24} />
          </div>

          <h2
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Confirm Logout
          </h2>

          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              marginBottom: "24px",
              color: "#475569",
            }}
          >
            Are you sure you want to log out? Make sure you have saved your
            credentials.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={LogOut}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <FaSignOutAlt /> Logout
            </button>

            <button
              onClick={() => setLogoutWarningModalOpen(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
