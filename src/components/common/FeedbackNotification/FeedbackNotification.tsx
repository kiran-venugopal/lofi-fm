import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, ExternalLink, Heart } from "lucide-react";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../../recoil/atoms/PlayerState";
import { SongsState } from "../../../recoil/atoms/SongsState";
import { trackEvent } from "../../../utils/ga";
import {
  getFeedbackEligibility,
  recordVisitDay,
} from "../../../utils/feedbackEligibility";
import "./feedback-notification.css";

export const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf8nofioPe8ALm5wFhzdCkZnzJXfHclCEQNj8jGJEUQU5lwyA/viewform?usp=preview";
const STORAGE_KEY = "lofifm_feedback_done";

export const FeedbackNotification: React.FC = () => {
  const [playerData] = useRecoilState(PlayerState);
  const [songsData] = useRecoilState(SongsState);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasTrackedImpressionRef = useRef(false);

  useEffect(() => {
    // Record today's visit on mount
    recordVisitDay();
  }, []);

  useEffect(() => {
    // Check if the user has already submitted or dismissed the feedback form
    const isDone = window.localStorage.getItem(STORAGE_KEY);
    if (isDone || isVisible || isClosing) {
      return;
    }

    // Check eligibility:
    // - added custom songs
    // - starred any songs
    // - visited the app at least 2 different days
    // - added custom image url in background
    const { isEligible, reasons } = getFeedbackEligibility(
      playerData.bgImgUrl,
      songsData.starredIds
    );

    if (isEligible) {
      // Small delay before showing so it introduces itself smoothly
      const timer = setTimeout(() => {
        setIsVisible(true);
        if (!hasTrackedImpressionRef.current) {
          hasTrackedImpressionRef.current = true;
          trackEvent("Feedback Notification Displayed", {
            formUrl: FEEDBACK_FORM_URL,
            source: "top_left_banner",
            eligibilityReasons: reasons.join(","),
          });
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [playerData.bgImgUrl, songsData.starredIds, isVisible, isClosing]);

  const handleDismiss = (source: "close_icon" | "dismiss_button" = "dismiss_button") => {
    trackEvent("Feedback Notification Dismissed", { source });
    window.localStorage.setItem(STORAGE_KEY, "dismissed");
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleSubmit = () => {
    trackEvent("Feedback Notification Clicked", {
      formUrl: FEEDBACK_FORM_URL,
      action: "give_feedback",
    });
    trackEvent("Feedback Form Submitted", {
      formUrl: FEEDBACK_FORM_URL,
    });
    window.localStorage.setItem(STORAGE_KEY, "submitted");
    window.open(FEEDBACK_FORM_URL, "_blank", "noopener,noreferrer");
    setIsSubmitted(true);
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }, 2000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className={`feedback-notification ${isClosing ? "feedback-closing" : ""}`}
      aria-label="Feedback notification"
    >
      {isSubmitted ? (
        <div className="feedback-content feedback-thankyou">
          <div className="feedback-header">
            <Heart size={16} className="feedback-heart-icon" />
            <span className="feedback-title">Thank you!</span>
          </div>
          <p className="feedback-description">
            Your feedback helps make LoFi Fm better for everyone.
          </p>
        </div>
      ) : (
        <div className="feedback-content">
          <div className="feedback-header">
            <div className="feedback-icon-badge">
              <MessageSquare size={14} />
            </div>
            <span className="feedback-title">Help us improve LoFi Fm</span>
          </div>

          <p className="feedback-description">
            Have a suggestion or request? Share your feedback in a quick 30s survey.
          </p>

          <div className="feedback-actions">
            <button
              type="button"
              className="feedback-submit-btn"
              onClick={handleSubmit}
            >
              <span>Give Feedback</span>
              <ExternalLink size={13} />
            </button>
            <button
              type="button"
              className="feedback-dismiss-text-btn"
              onClick={() => handleDismiss("dismiss_button")}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FeedbackNotification;
