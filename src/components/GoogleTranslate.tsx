import React, { useEffect, useState } from "react";
import languages from "../lib/data";

const GoogleTranslate = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = sessionStorage.getItem("selectedLanguage") || "en";
      setSelectedLanguage(storedLanguage);
    }

    // Check if the script is already added
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    // Define Google Translate element initialization function globally
    (window as any).googleTranslateElementInit = () => {
      if (!document.querySelector("#google_translate_element div")) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: languages.map((lang) => lang.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // Apply stored language right after initialization
        setTimeout(() => {
          applyStoredLanguage();
        }, 500);
      }
    };
  }, []);

  useEffect(() => {
    const hideToolbar = () => {
      const iframe = document.querySelector(
        "iframe.goog-te-banner-frame"
      ) as HTMLElement | null;
      if (iframe) iframe.style.display = "none";
      document.documentElement.style.top = "0px";
      document.body.style.top = "0px";
    };

    // Hide now
    hideToolbar();

    // Hide whenever DOM changes (e.g., after Google injects the banner)
    const observer = new MutationObserver(hideToolbar);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // Apply the stored language to Google Translate after initialization
  const applyStoredLanguage = () => {
    if (typeof window !== "undefined") {
      const storedLanguage = sessionStorage.getItem("selectedLanguage");
      if (storedLanguage) {
        const translateCombo: HTMLSelectElement | null =
          document.querySelector(".goog-te-combo");
        if (translateCombo) {
          translateCombo.value = storedLanguage;
          translateCombo.dispatchEvent(new Event("change"));
        }
      }
    }
  };

  // Handle language switch
  const changeLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedLanguage", languageCode);
    }

    const translateCombo: HTMLSelectElement | null =
      document.querySelector(".goog-te-combo");
    if (translateCombo) {
      translateCombo.value = languageCode;
      translateCombo.dispatchEvent(new Event("change"));
    }
    setIsOpen(false);
  };

  // Get the selected language name
  const getSelectedLanguageName = () => {
    const selectedLang = languages.find(
      (lang) => lang.code === selectedLanguage
    );
    return selectedLang ? selectedLang.name : "Select Language";
  };

  return (
    <div>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          translate="no"
          className="border h-full border-white text-white rounded-none bg-transparent px-3 py-1"
        >
          {getSelectedLanguageName()}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <ul className="py-1">
              {languages.map((language) => (
                <li key={language.code}>
                  <button
                    onClick={() => changeLanguage(language.code)}
                    translate="no"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {language.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Google Translate hidden container */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </div>
  );
};

export default GoogleTranslate;
