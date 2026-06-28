import { useRef, useState } from "react";
import { useAppContext } from "../AppContext";
import { Icon } from "./Icon";

export function FileUploadModal() {
  const { state, dispatch } = useAppContext();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!state.msgShowFileModal) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        dispatch({
          type: "setMsgPendingAttachment",
          payload: {
            id: Math.random().toString(36).slice(2),
            name: file.name,
            size: file.size,
            type: file.type,
          },
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        dispatch({
          type: "setMsgPendingAttachment",
          payload: {
            id: Math.random().toString(36).slice(2),
            name: file.name,
            size: file.size,
            type: file.type,
          },
        });
      }
    }
  };

  const handleConfirm = () => {
    if (state.msgPendingAttachment) {
      // TODO: Send file or attach to compose area
      console.log("File selected:", state.msgPendingAttachment);
      dispatch({ type: "setMsgShowFileModal", payload: false });
      dispatch({ type: "setMsgPendingAttachment", payload: null });
    }
  };

  const handleCancel = () => {
    dispatch({ type: "setMsgShowFileModal", payload: false });
    dispatch({ type: "setMsgPendingAttachment", payload: null });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleCancel}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          backgroundColor: "var(--r-sf)",
          borderRadius: "10px",
          border: "1px solid var(--r-bd)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--r-bd)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--r-t1)",
            }}
          >
            Upload file
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: "none",
              border: "none",
              color: "var(--r-t2)",
              cursor: "pointer",
              fontSize: "20px",
              padding: "0",
            }}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {!state.msgPendingAttachment ? (
            <>
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "40px 20px",
                  border: `2px dashed ${dragOver ? "var(--r-acc)" : "var(--r-bd)"}`,
                  borderRadius: "8px",
                  backgroundColor: dragOver ? "var(--r-accd)" : "var(--r-bg)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 150ms",
                }}
              >
                <div
                  style={{
                    marginBottom: "12px",
                  }}
                >
                  <Icon name="inbox" size={32} />
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--r-t1)",
                    marginBottom: "4px",
                  }}
                >
                  Drag & drop your file
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--r-t3)",
                  }}
                >
                  or click to browse
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </>
          ) : (
            /* File Selected Display */
            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--r-bg)",
                borderRadius: "6px",
                border: "1px solid var(--r-bd)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <Icon name="notes" size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--r-t1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {state.msgPendingAttachment.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--r-t3)",
                    }}
                  >
                    {formatFileSize(state.msgPendingAttachment.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: "setMsgPendingAttachment",
                      payload: null,
                    });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--r-t3)",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0",
                  }}
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--r-bd)",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid var(--r-bd)",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!state.msgPendingAttachment}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: state.msgPendingAttachment
                ? "var(--r-acc)"
                : "var(--r-t3)",
              color: "white",
              cursor: state.msgPendingAttachment ? "pointer" : "default",
              fontSize: "13px",
              fontWeight: "500",
              opacity: state.msgPendingAttachment ? 1 : 0.5,
            }}
          >
            Attach
          </button>
        </div>
      </div>
    </>
  );
}
