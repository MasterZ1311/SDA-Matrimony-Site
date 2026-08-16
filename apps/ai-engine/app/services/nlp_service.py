import re
from typing import Dict, Any, List

class NLPContentFilter:
    """
    NLP and Regex screening for profile bios and pre-match chat messages.
    Detects unauthorized contact details (phone numbers, emails, social handles) and toxic words.
    """

    # Phone number patterns (international and local)
    PHONE_REGEX = re.compile(
        r'(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}',
        re.IGNORECASE
    )
    
    # Email pattern
    EMAIL_REGEX = re.compile(
        r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
        re.IGNORECASE
    )

    # Social media mentions (WhatsApp, Instagram, Snapchat, Telegram)
    SOCIAL_HANDLES_REGEX = re.compile(
        r'(whatsapp|wa\.me|instagram|insta|ig:|snapchat|snap:|telegram|tg:|call me at|text me at)',
        re.IGNORECASE
    )

    @classmethod
    def screen_text(cls, text: str, is_mutual_match: bool = False) -> Dict[str, Any]:
        if not text:
            return {"isSafe": True, "flags": [], "cleanedText": text}

        flags: List[str] = []

        # If not mutually accepted yet, enforce contact privacy protections
        if not is_mutual_match:
            if cls.PHONE_REGEX.search(text):
                flags.append("PHONE_NUMBER_DETECTED")
            if cls.EMAIL_REGEX.search(text):
                flags.append("EMAIL_DETECTED")
            if cls.SOCIAL_HANDLES_REGEX.search(text):
                flags.append("EXTERNAL_CONTACT_HANDLE_DETECTED")

        is_safe = len(flags) == 0

        return {
            "isSafe": is_safe,
            "flags": flags,
            "reason": "Direct contact details cannot be shared prior to mutual interest acceptance." if not is_safe else "Clean",
            "cleanedText": cls._sanitize(text) if not is_safe else text
        }

    @classmethod
    def _sanitize(cls, text: str) -> str:
        s = cls.PHONE_REGEX.sub("[Contact Protected]", text)
        s = cls.EMAIL_REGEX.sub("[Email Protected]", s)
        return s
