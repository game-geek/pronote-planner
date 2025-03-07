// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "./axios";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useLocation } from "react-router-dom";
import { OrgContext } from "./context/orgContext";
import { OrgType } from "./lib/formatTimeTable";
import { BACKEND_URL } from "./lib/constants";
import Loader from "./Loader";

function TimeTable() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState(undefined);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [freeSpots, setFreeSpots] = useState(null);
  const location = useLocation();
  // undefined: new user -> show banner, true: loading, false: posted
  const [posting, setPosting] = useState(undefined);
  const [showAll, setShowAll] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState("");

  useEffect(() => {
    const path = location.pathname.split("/");
    const org = path[path.length - 1];
    const unsub = onSnapshot(doc(db, "/organisations/" + org), (doc) => {
      if (doc.exists() === false) return;
      const data = doc.data();
      data.free.sort((a, b) => {
        if (a.starred && b.starred) return 0;
        else if (a.starred) return -1;
        else if (b.starred) return 1;
        else return -Infinity;
      });
      setFreeSpots(data);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setError("⚠️ Missing file");
    } else if (username.length < 3) {
      setError("⚠️ Name must be at least 3 characters");
    } else {
      setError(null);
    }
  }, [selectedFiles, username]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      return setError("⚠️ Please select a timetable file");
    } else if (username.length < 3) {
      return setError("⚠️ Name must be at least 3 characters");
    }

    if (selectedFiles[0].size > 10 * 1024 * 1024) {
      return setError("⚠️ File must be under 10 MB");
    }

    let formData = new FormData();
    const path = location.pathname.split("/");
    const orgToken = path[path.length - 1];
    formData.append("file", selectedFiles[0]);
    formData.append("username", username);
    formData.append("orgToken", orgToken);

    setError("");
    setPosting(true);
    axiosInstance
      .post(BACKEND_URL + "/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((response) => {
        setPosting(false);
        setProgress(undefined);
      })
      .catch((error) => {
        const { code } = error?.response?.data;
        console.log(error);
        setPosting(undefined);
        setProgress(undefined);
        switch (code) {
          case "FILE_MISSING":
            setError("❌ Please select a file before uploading!");
            break;
          case "LIMIT_FILE_SIZE":
            setError(
              "❌ File size is too large. Please upload files below 10MB!"
            );
            break;
          case "INVALID_TYPE":
            setError(
              "❌ This file type is not supported! Only PDF files are allowed"
            );
            break;
          case "INVALID_PDF":
            setError("❌ Invalid file - must be a Pronote timetable");
            break;
          default:
            setError("❌ Sorry! Something went wrong. Please try again later");
            break;
        }
      });
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
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "16px",
              background: "linear-gradient(to right, #1e40af, #7e22ce)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Planning a Meeting for{" "}
            {freeSpots ? freeSpots.orgName : "your organization"}
          </h1>

          {freeSpots && freeSpots.orgInfo && (
            <p
              style={{
                fontSize: "16px",
                maxWidth: "800px",
                margin: "0 auto",
                color: "#475569",
                lineHeight: 1.6,
              }}
            >
              {freeSpots.orgInfo}
            </p>
          )}
        </header>

        {/* Upload Form Section */}
        {posting !== false && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "32px",
              borderRadius: "16px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              maxWidth: "600px",
              margin: "0 auto 32px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "24px",
                color: "#0f172a",
                textAlign: "center",
              }}
            >
              Add Your Timetable
            </h2>

            <form
              onSubmit={submitHandler}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <label
                  htmlFor="file-upload"
                  style={{
                    display: "inline-block",
                    padding: "14px 24px",
                    backgroundColor:
                      selectedFiles.length === 0 ? "#3b82f6" : "#10b981",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s",
                    textAlign: "center",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      selectedFiles.length === 0 ? "#2563eb" : "#059669";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      selectedFiles.length === 0 ? "#3b82f6" : "#10b981";
                  }}
                >
                  {selectedFiles.length === 0
                    ? "Select Pronote Timetable"
                    : "✅ Change Timetable"}
                </label>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setSelectedFiles(e.target.files);
                  }}
                  style={{
                    display: "none",
                  }}
                />

                {selectedFiles.length > 0 && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#475569",
                      marginTop: "8px",
                    }}
                  >
                    Selected: {selectedFiles[0]?.name}
                  </p>
                )}
              </div>

              <div
                style={{
                  width: "100%",
                }}
              >
                <label
                  htmlFor="username"
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#334155",
                  }}
                >
                  Your Name
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "95%",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                />
              </div>

              {!progress ? (
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginTop: "12px",
                  }}
                  onMouseEnter={() => setTooltipVisible("submit")}
                  onMouseLeave={() => setTooltipVisible("")}
                >
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(to right, #3b82f6, #2563eb)",
                      color: "white",
                      border: "none",
                      padding: "14px 32px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      minWidth: "200px",
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
                    Upload Timetable
                  </button>
                  {tooltipVisible === "submit" && (
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
                      Submit your Pronote timetable
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#3b82f6",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Uploading... {progress}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#e2e8f0",
                      borderRadius: "8px",
                      height: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: "#3b82f6",
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div
                  style={{
                    backgroundColor: error.startsWith("❌")
                      ? "rgba(254, 226, 226, 0.5)"
                      : "rgba(254, 240, 138, 0.5)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    color: error.startsWith("❌") ? "#dc2626" : "#ca8a04",
                    width: "100%",
                    textAlign: "center",
                    border: `1px solid ${
                      error.startsWith("❌") ? "#fca5a5" : "#fcd34d"
                    }`,
                  }}
                >
                  {error}
                </div>
              )}
            </form>

            <div
              style={{
                marginTop: "24px",
                textAlign: "center",
                fontSize: "14px",
                color: "#64748b",
                backgroundColor: "rgba(241, 245, 249, 0.5)",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong>Important:</strong> Upload official Pronote timetables
              only
            </div>
          </div>
        )}

        {posting && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "32px",
            }}
          >
            <Loader width="70px" height="70px" />
          </div>
        )}

        {/* Time Slots Table */}
        {freeSpots && freeSpots.free && freeSpots.free.length > 0 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "24px",
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
                      padding: "12px 16px",
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
                      padding: "12px 16px",
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
                      padding: "12px 16px",
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
                {(showAll ? freeSpots.free : freeSpots.free.slice(0, 6)).map(
                  (slot, index) => (
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
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#64748b",
                          textAlign: "center",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {slot.starred && (
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
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          fontWeight: slot.starred ? 600 : 400,
                          color: slot.starred ? "#0f172a" : "#334155",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {slot.time}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
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
                              style={{
                                padding: "6px 12px",
                                borderRadius: "99px",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                border: "1px solid rgba(59, 130, 246, 0.2)",
                                color: "#3b82f6",
                                fontSize: "13px",
                                fontWeight: 500,
                              }}
                            >
                              {user}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {freeSpots.free.length > 6 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "24px",
                }}
              >
                <button
                  onClick={() => setShowAll((prevState) => !prevState)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: "#3b82f6",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
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
                  {showAll ? "Show Less" : "Show All Time Slots"}
                </button>
              </div>
            )}
          </div>
        )}

        {posting !== undefined &&
          (!freeSpots || freeSpots.free.length === 0) && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              No available time slots found yet. Be the first to add your
              timetable!
            </div>
          )}

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
    </div>
  );
}

export default TimeTable;
