import { useState, useRef, useEffect } from "react";
import styles from "./main.module.css";
import { FaUserPlus } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { GrAddCircle } from "react-icons/gr";
import { GrAttachment } from "react-icons/gr";

const ChatbotLayout = () => {
  const [showText, setShowText] = useState(true);
  const [messages, setMessages] = useState([]); // Start with an empty array
  const [userInput, setUserInput] = useState("");
  const chatWindowRef = useRef(null);
  const fileInputRef = useRef(null); // Reference to the file input element
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [recentChats, setRecentChats] = useState([]); // Holds recent chat history
  const [showRecentChats, setShowRecentChats] = useState(false); // Toggle visibility of recent chats

  const handleNewChat = () => {
    setMessages([]); // Clear chatbox
    setUserInput(""); // Clear input box

    // Example of adding the current chat to recent chats
    setRecentChats((prevChats) => [
      { id: Date.now(), messages }, // Save the chat with a unique id
      ...prevChats.slice(0, 5), // Limit the number of recent chats
    ]);
  };
  const handleRecentChatsClick = () => {
    setShowRecentChats(!showRecentChats);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getRandomResponse = () => {
    const responses = [
      "Nice image! How can I assist you further?",
      "Great choice of image!",
      "Thanks for sharing the image. How can I help?",
      "That's a nice image! What else can I do for you?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    // Determine time of day for greeting
    if (hours >= 5 && hours < 12) {
      greeting = "Good morning";
    } else if (hours >= 12 && hours < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    if (message.includes("hello") || message.includes("hi")) {
      return `${greeting}! How can I assist you today?`;
    } else if (message.includes("time")) {
      return `The current time is ${now.toLocaleTimeString()}`;
    } else if (message.includes("weather")) {
      return "I'm not sure about the weather, but I can help with other questions!";
    } else if (message.includes("name")) {
      return "I'm your friendly chatbot here to help you. What can I do for you?";
    } else if (message.includes("help")) {
      return "I can assist with various queries. Just let me know what you need!";
    } else if (message.includes("joke")) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "How does a penguin build its house? Igloos it together!",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    } else if (message.includes("good morning")) {
      return `${greeting}! How can I assist you today?`;
    } else {
      return "I see! How may I further assist you?";
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim() !== "") {
      const userMessage = { role: "user", content: userInput };
      const botMessage = {
        role: "bot",
        content: generateBotResponse(userInput),
      };
      setShowText(false);
      // Update the messages state with user and bot messages
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
      setUserInput("");
      if (userInput.toLowerCase().includes("change color")) {
        setBackgroundColor("#e0f7fa"); // Example color
      } else {
        setBackgroundColor("#ffffff"); // Default color
      }
    }
  };

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: "You uploaded an image." },
          {
            role: "user",
            content: (
              <img
                src={reader.result}
                alt="Uploaded"
                style={{ maxWidth: "100%" }}
              />
            ),
          },
          { role: "bot", content: getRandomResponse() }, // Random bot response
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="relative">
      {/* Navbar */}
      <nav className={`${styles.navbar}`}>
        <div className={`${styles.logo}`}>Logo</div>
        <button className={`${styles.loginButton}`}>Login</button>
        {!isSidebarVisible && (
          <button className={styles.navToggleButton} onClick={toggleSidebar}>
            {isSidebarVisible ? "Close" : "Open"}
          </button>
        )}
      </nav>

      {/* Main Layout */}
      <div className={`${styles.mainContainer}`}>
        {/* Sidebar */}

        <div
          className={`${styles.sidebar} ${
            isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
          }
           d-flex flex-wrap justify-content-between `}
        >
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {isSidebarVisible ? "Close" : "Open"}
          </button>
          <div>
            <button
              className={styles.newChatButton}
              onClick={() => {
                setMessages([]); // Clear chatbox
                setUserInput(""); // Clear input box
              }}
            >
              <span className={styles.plusSign}>
                <GrAddCircle />
              </span>{" "}
              New Chat
            </button>

            <button
              className={styles.recentChatButton}
              // onClick={() => setShowRecentChats(!showRecentChats)}
              onClick={handleRecentChatsClick}
            >
              Recent Chats
            </button>

            {showRecentChats && (
              <div
                className={`${styles.recentChatsContainer} mt-3 text-center`}
              >
                {recentChats.length > 0 ? (
                  <ul>
                    {recentChats.map((chat) => (
                      <li key={chat.id}>
                        {chat.messages.map((msg, index) => (
                          <div key={index} className={`message ${msg.role}`}>
                            {msg.content}
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent chats</p>
                )}
              </div>
            )}
          </div>

          <div className={styles.bottomButtonWrapper}>
            <button className={styles.signUpLoginButton}>
              <FaUserPlus className={styles.signupIcon} /> Sign Up / Login
            </button>
          </div>
        </div>

        {/* Full-width Content */}
        <div className={`${styles.content} text-center`}>
          {showText && (
            <div>
              <div>
                <p className="mb-0 fw-normal fs-3"> Welcome to LOGO Ai</p>
                <h1>Good afternoon! How can I help you today?</h1>
              </div>
              <div
                className={`${styles.main_content} d-flex flex-wrap justify-content-center gap-1 gap-md-5 mt-4`}
              >
                <Card className={`${styles.card}`}>
                  <Card.Header
                    className={`${styles.title}`}
                    style={{ backgroundColor: "#ffc107" }}
                  >
                    CREATE
                  </Card.Header>
                  <ListGroup variant="flush" className="text-start">
                    <ListGroup.Item> Mini Volcano Project</ListGroup.Item>
                    <ListGroup.Item>Make Scented Candles</ListGroup.Item>
                    <ListGroup.Item>Home Workout Routine</ListGroup.Item>
                  </ListGroup>
                </Card>

                <Card className={`${styles.card}`}>
                  <Card.Header
                    className={`${styles.title}`}
                    style={{ backgroundColor: "#17a2b8" }}
                  >
                    LEARN
                  </Card.Header>
                  <ListGroup variant="flush" className="text-start">
                    <ListGroup.Item>Style Saree</ListGroup.Item>
                    <ListGroup.Item>Public Speaking</ListGroup.Item>
                    <ListGroup.Item>Artificial Intelligence</ListGroup.Item>
                  </ListGroup>
                </Card>

                <Card className={`${styles.card}`}>
                  <Card.Header
                    className={`${styles.title}`}
                    style={{ backgroundColor: "#28a745" }}
                  >
                    DISCOVER
                  </Card.Header>
                  <ListGroup variant="flush" className="text-start">
                    <ListGroup.Item>Cultural Festivals</ListGroup.Item>
                    <ListGroup.Item>Famous Street Foods</ListGroup.Item>
                    <ListGroup.Item>Historical Places</ListGroup.Item>
                  </ListGroup>
                </Card>
              </div>
            </div>
          )}

          <div className={`${styles.chatbot} `}>
            <div className={`${styles.chat_window}`} ref={chatWindowRef}>
              {/* Render all messages */}
              {messages.length > 0 &&
                messages.map((message, index) => (
                  <div key={index} className={`message ${message.role}`}>
                    {typeof message.content === "string"
                      ? message.content
                      : message.content}
                  </div>
                ))}
            </div>
            <div className={`${styles.input_area} border`}>
              <div className={`${styles.input_container}`}>
                <input
                  type="text"
                  placeholder="Ask me anything"
                  value={userInput}
                  onChange={handleInputChange}
                  style={{
                    width: `${Math.max(200, userInput.length * 10)}px`, // Dynamically adjust width
                    transition: "width 0.2s ease", // Smooth transition for width change
                  }}
                />
                <label className={`${styles.pin_button}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef} // Assign the file input ref
                    style={{ display: "none" }} // Hide the file input
                  />
                  <GrAttachment
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "55%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </label>
                <button className={`${styles.btn}`} onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotLayout;
