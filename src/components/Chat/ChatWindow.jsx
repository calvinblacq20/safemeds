"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeMessage from "./WelcomeMessage";
import VideoCall from "./VideoCall";
import { subscribeChatMessages, sendChatMessage } from "@/lib/chatService";

// `sender` = who this client is in the conversation ("user" = student,
// "pharmacist" = pharmacist). Both sides share the room by chatId.
const ChatWindow = ({
  chatId,
  onMessageCountChange,
  sender = "user",
  senderName,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pharmacistTyping] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    setIsLoading(true);
    try {
      await sendChatMessage(chatId, { text, sender, senderName });
    } catch (error) {
      console.error("Error sending message:", error);
      setInput(text); // restore on failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Live subscription to the shared room — real two-way messaging, no polling.
  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = subscribeChatMessages(chatId, (msgs) => {
      const transformed = msgs.map((m) => ({
        text: m.text,
        sender: m.sender,
        timestamp: m.createdAt,
      }));
      setMessages(transformed);
      if (onMessageCountChange) onMessageCountChange(transformed.length);
    });
    return () => unsubscribe();
  }, [chatId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, pharmacistTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative flex h-[70vh] flex-col bg-surface">
      <AnimatePresence>
        {isVideoCallActive && (
          <VideoCall
            pharmacistName="Dr. Sarah Johnson, PharmD"
            roomId={chatId}
            useLiveSignaling={true}
            role="caller"
            callerName="Student (Patient)"
            onEndCall={async (duration) => {
              setIsVideoCallActive(false);
              try {
                await sendChatMessage(chatId, {
                  text: `Video consultation ended. Duration: ${duration}.`,
                  sender: "system",
                });
              } catch (err) {
                console.error("Error saving system call message:", err);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Chat Header */}
      <div className="bg-brand p-4 text-brand-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-3 w-3 rounded-full bg-ok"
            />
            <div>
              <h3 className="font-semibold">Dr. Sarah Johnson, PharmD</h3>
              <p className="text-sm opacity-90">Licensed Pharmacist</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVideoCallActive(true)}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-brand-ink/15 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-brand-ink/25"
            >
              📹 <span className="hidden sm:inline">Start Video Call</span>
            </button>
            <div className="text-right">
              <p className="text-sm opacity-90">Online</p>
              <p className="text-xs opacity-75">
                Usually responds in 2-3 minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={chatRef}
        className="flex-1 space-y-4 overflow-y-auto bg-bg p-4"
      >
        {/* Welcome Message for New Sessions */}
        {messages.length === 0 && <WelcomeMessage />}

        <AnimatePresence>
          {Array.isArray(messages) &&
            messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className={`flex ${
                  msg.sender === "system"
                    ? "justify-center w-full"
                    : msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`${
                    msg.sender === "system"
                      ? "max-w-[85%]"
                      : "max-w-[70%]"
                  } ${
                    msg.sender === "user" ? "order-2" : "order-1"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-2xl shadow-sm ${
                      msg.sender === "system"
                        ? "flex items-center justify-center gap-2 border border-line bg-surface-muted text-center text-xs font-semibold text-ink-muted"
                        : msg.sender === "user"
                        ? "bg-brand text-brand-ink"
                        : "border border-line bg-surface text-ink"
                    }`}
                  >
                    {msg.sender === "system" && <span className="text-base">📹</span>}
                    <div>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      {msg.sender !== "system" && (
                        <p
                          className={`text-xs mt-2 ${
                            msg.sender === "user"
                              ? "text-brand-ink/70"
                              : "text-ink-muted"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Avatar */}
                {msg.sender !== "system" && (
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-brand-ink ${
                      msg.sender === "user"
                        ? "order-1 ml-2 bg-brand"
                        : "order-2 mr-2 bg-ok"
                    }`}
                  >
                    {msg.sender === "user" ? "U" : "P"}
                  </div>
                )}
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Pharmacist Typing Indicator */}
        <AnimatePresence>
          {pharmacistTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="order-1">
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="h-2 w-2 rounded-full bg-ink-faint"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="h-2 w-2 rounded-full bg-ink-faint"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="h-2 w-2 rounded-full bg-ink-faint"
                      />
                    </div>
                    <span className="text-sm text-ink-muted">
                      Pharmacist is typing...
                    </span>
                  </div>
                </div>
              </div>
              <div className="order-2 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-ok text-sm font-medium text-white">
                P
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="border-t border-line bg-surface p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full resize-none rounded-2xl border border-line bg-surface-muted p-3 pr-12 text-ink transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              rows="1"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button className="cursor-pointer text-ink-faint transition-colors hover:text-ink">
                😊
              </button>
              <button className="cursor-pointer text-ink-faint transition-colors hover:text-ink">
                📎
              </button>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              input.trim() && !isLoading
                ? "bg-brand text-brand-ink hover:bg-brand-hover"
                : "cursor-not-allowed bg-surface-muted text-ink-faint"
            }`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
              />
            ) : (
              "Send"
            )}
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Medication questions",
            "Side effects",
            "Dosage concerns",
            "Drug interactions",
          ].map((action, index) => (
            <motion.button
              key={action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInput(action)}
              className="cursor-pointer rounded-full bg-surface-muted px-3 py-1.5 text-xs text-ink transition-colors hover:bg-surface-sunken"
            >
              {action}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
