
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  X,
  Calendar,
  Inbox,
  ArrowLeft,
} from "lucide-react";

import { messageAPI } from "../../services/api";
import "../../style/adminMessages.css";

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await messageAPI.getAll();

      setConversations(
        Array.isArray(response.conversations)
          ? response.conversations
          : []
      );
    } catch (err) {
      setError(err.message || "Unable to load conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) return conversations;

    return conversations.filter((conversation) => {
      const emailMatch = conversation.email
        ?.toLowerCase()
        .includes(searchTerm);

      const messageMatch = conversation.messages?.some((message) => {
        return (
          message.name?.toLowerCase().includes(searchTerm) ||
          message.phone?.toLowerCase().includes(searchTerm) ||
          message.message?.toLowerCase().includes(searchTerm)
        );
      });

      return emailMatch || messageMatch;
    });
  }, [conversations, search]);

  const totalMessages = useMemo(
    () =>
      conversations.reduce(
        (total, conversation) =>
          total + (conversation.messages?.length || 0),
        0
      ),
    [conversations]
  );

  const openConversation = async (conversation) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await messageAPI.getById(conversation._id);

      setSelectedConversation(
        response.conversation || conversation
      );
    } catch (err) {
      setError(err.message || "Unable to open conversation.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeConversation = () => {
    setSelectedConversation(null);
  };

  const handleDelete = async (conversation) => {
    const confirmed = window.confirm(
      `Delete the complete conversation from ${conversation.email}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await messageAPI.delete(conversation._id);

      setConversations((prev) =>
        prev.filter((item) => item._id !== conversation._id)
      );

      setSelectedConversation((prev) =>
        prev?._id === conversation._id ? null : prev
      );

      setSuccess("Conversation deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete conversation.");
    }
  };

  return (
    <section className="messages-admin">
      {/* Header */}
      <div className="messages-header">
        <div>
          <span className="messages-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>
          <h1>Messages</h1>
          <p>Manage contact form conversations and enquiries.</p>
        </div>

        <button
          className="messages-refresh-btn"
          type="button"
          onClick={fetchConversations}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "messages-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="messages-alert messages-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="messages-alert messages-success" role="status">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="messages-stats">
        <div className="messages-stat-card">
          <div className="messages-stat-icon">
            <Inbox size={21} />
          </div>
          <div>
            <strong>{conversations.length}</strong>
            <span>Total Conversations</span>
          </div>
        </div>

        <div className="messages-stat-card">
          <div className="messages-stat-icon">
            <MessageSquare size={21} />
          </div>
          <div>
            <strong>{totalMessages}</strong>
            <span>Total Messages</span>
          </div>
        </div>

        <div className="messages-stat-card">
          <div className="messages-stat-icon">
            <Mail size={21} />
          </div>
          <div>
            <strong>
              {
                conversations.filter(
                  (conversation) =>
                    (conversation.messages?.length || 0) > 0
                ).length
              }
            </strong>
            <span>Active Conversations</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="messages-toolbar">
        <div className="messages-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search by name, email, phone or message..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {/* Conversations */}
      {loading ? (
        <div className="messages-loading">
          <RefreshCw size={26} className="messages-spin" />
          <p>Loading conversations...</p>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="messages-empty">
          <Inbox size={42} />
          <h3>No conversations found</h3>
          <p>
            {search
              ? "Try another search term."
              : "Contact form messages will appear here."}
          </p>
        </div>
      ) : (
        <div className="messages-list">
          {filteredConversations.map((conversation) => {
            const messages = conversation.messages || [];
            const latestMessage = messages[messages.length - 1];

            return (
              <article
                className="message-conversation-card"
                key={conversation._id}
              >
                <div className="message-avatar">
                  {(latestMessage?.name || conversation.email || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="message-conversation-content">
                  <div className="message-conversation-top">
                    <h3>
                      {latestMessage?.name || "Unknown sender"}
                    </h3>

                    <span className="message-count">
                      {messages.length}{" "}
                      {messages.length === 1 ? "message" : "messages"}
                    </span>
                  </div>

                  <div className="message-email">
                    <Mail size={14} />
                    <span>{conversation.email}</span>
                  </div>

                  <p className="message-preview">
                    {latestMessage?.message ||
                      "No message content available"}
                  </p>

                  <div className="message-card-footer">
                    <span>
                      <Calendar size={13} />
                      {formatDate(
                        latestMessage?.createdAt || conversation.updatedAt
                      )}
                    </span>

                    <div className="message-card-actions">
                      <button
                        type="button"
                        onClick={() => openConversation(conversation)}
                      >
                        <MessageSquare size={15} />
                        View
                      </button>

                      <button
                        type="button"
                        className="message-delete-btn"
                        onClick={() => handleDelete(conversation)}
                        aria-label={`Delete conversation from ${conversation.email}`}
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Conversation Details Modal */}
      {selectedConversation && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="message-modal-header">
              <div>
                <span>CONVERSATION DETAILS</span>
                <h2>Message History</h2>
              </div>

              <button
                type="button"
                onClick={closeConversation}
                aria-label="Close conversation"
              >
                <X size={21} />
              </button>
            </div>

            <div className="message-sender-info">
              <div className="message-avatar">
                {(selectedConversation.messages?.[0]?.name ||
                  selectedConversation.email ||
                  "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>
                  {selectedConversation.messages?.[0]?.name ||
                    "Unknown sender"}
                </h3>

                <p>
                  <Mail size={14} />
                  {selectedConversation.email}
                </p>

                {selectedConversation.messages?.[0]?.phone && (
                  <p>
                    <Phone size={14} />
                    {selectedConversation.messages[0].phone}
                  </p>
                )}
              </div>
            </div>

            <div className="message-history">
              {detailsLoading ? (
                <div className="messages-loading">
                  <RefreshCw size={24} className="messages-spin" />
                  <p>Loading conversation...</p>
                </div>
              ) : selectedConversation.messages?.length ? (
                [...selectedConversation.messages]
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt) - new Date(b.createdAt)
                  )
                  .map((message, index) => (
                    <article
                      className="message-history-item"
                      key={message._id || index}
                    >
                      <div className="message-history-top">
                        <strong>{message.name}</strong>
                        <span>{formatDate(message.createdAt)}</span>
                      </div>

                      <p>{message.message}</p>

                      {message.phone && (
                        <span className="message-history-phone">
                          <Phone size={13} />
                          {message.phone}
                        </span>
                      )}
                    </article>
                  ))
              ) : (
                <div className="messages-empty">
                  <MessageSquare size={32} />
                  <p>No messages in this conversation.</p>
                </div>
              )}
            </div>

            <div className="message-modal-footer">
              <button
                type="button"
                className="message-back-btn"
                onClick={closeConversation}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="button"
                className="message-delete-btn"
                onClick={() => handleDelete(selectedConversation)}
              >
                <Trash2 size={16} />
                Delete Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Messages;
