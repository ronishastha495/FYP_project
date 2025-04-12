import React, { Component } from "react";

// ErrorBoundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate that an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error and error information (optional)
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI here
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Something went wrong. Please try again later.</h1>
        </div>
      );
    }

    return this.props.children; // Render the children components
  }
}

export default ErrorBoundary;
