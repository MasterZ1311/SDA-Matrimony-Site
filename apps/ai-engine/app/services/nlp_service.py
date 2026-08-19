import re
from typing import Dict, Any, List

class NLPContentFilter:
    """
    NLP and Regex screening for profile bios and pre-match chat messages.
    Detects unauthorized contact details (phone numbers, emails, social handles) and toxic words.
    """

    # Phone number patterns (standard international, local, and spaced-digit evasion)
    PHONE_REGEX = re.compile(
        r'(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4}|(?:\b\d[\s.-]*){10,13}\b',
        re.IGNORECASE
    )
    
    # Email patterns (standard + obfuscated e.g. user [at] example [dot] com)
    EMAIL_REGEX = re.compile(
        r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|'
        r'[a-zA-Z0-9_.+-]+\s*(?:\[at\]|\(at\)|@|\bat\b)\s*[a-zA-Z0-9-]+\s*(?:\[dot\]|\(dot\)|\.|\bdot\b)\s*(?:com|org|net|edu|gov|io|co|in|me|info)\b',
        re.IGNORECASE
    )

    # Social media mentions and messaging apps
    SOCIAL_HANDLES_REGEX = re.compile(
        r'(?:whatsapp|wa\.me|instagram|insta|ig:|snapchat|snap:|telegram|tg:|wechat|signal|tiktok|facebook|fb\.com|discord|skype|call me at|text me at|dm me at|reach me at|message me on)\s*[:@/-]?\s*[a-zA-Z0-9_.-]+',
        re.IGNORECASE
    )

    # External URL patterns
    URL_REGEX = re.compile(
        r'https?://[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*',
        re.IGNORECASE
    )

    # Profanity, toxicity, harassment, and inappropriate solicitation patterns
    TOXIC_PATTERNS = re.compile(
        r'\b(idiot|stupid|moron|loser|scam|scammer|fraud|fake|whore|bitch|slut|fuck|shit|asshole|dick|pussy|porn|nude|nudes|nsfw|send nudes|crypto investment|wire money|cash app|send money|gift card)\b',
        re.IGNORECASE
    )

    @classmethod
    def screen_text(cls, text: str, is_mutual_match: bool = False) -> Dict[str, Any]:
        if not text or not isinstance(text, str):
            return {"isSafe": True, "flags": [], "reason": "Clean", "cleanedText": text or ""}

        text_str = text.strip()
        flags: List[str] = []
        reasons: List[str] = []

        # 1. Absolute Safety & Toxicity Checks (Enforced unconditionally)
        if cls.TOXIC_PATTERNS.search(text_str):
            flags.append("PROFANITY_OR_TOXICITY_DETECTED")
            reasons.append("Inappropriate or abusive language detected.")

        # 2. Contact Privacy Protections (Enforced prior to mutual interest acceptance)
        if not is_mutual_match:
            if cls.PHONE_REGEX.search(text_str):
                flags.append("PHONE_NUMBER_DETECTED")
                reasons.append("Direct phone number detected.")
            if cls.EMAIL_REGEX.search(text_str):
                flags.append("EMAIL_DETECTED")
                reasons.append("Direct email address detected.")
            if cls.SOCIAL_HANDLES_REGEX.search(text_str):
                flags.append("EXTERNAL_CONTACT_HANDLE_DETECTED")
                reasons.append("External social handle or messaging platform detected.")
            if cls.URL_REGEX.search(text_str):
                flags.append("EXTERNAL_LINK_DETECTED")
                reasons.append("External hyperlink detected.")

        is_safe = len(flags) == 0

        # Construct explanation
        if is_safe:
            reason = "Clean"
        else:
            reason = " | ".join(reasons)

        cleaned_text = cls._sanitize(text_str, is_mutual_match)

        return {
            "isSafe": is_safe,
            "flags": flags,
            "reason": reason,
            "cleanedText": cleaned_text
        }

    @classmethod
    def _sanitize(cls, text: str, is_mutual_match: bool = False) -> str:
        s = text
        # Redact toxicity unconditionally
        s = cls.TOXIC_PATTERNS.sub("[Content Moderated]", s)

        # Redact contact info if not mutual match
        if not is_mutual_match:
            s = cls.PHONE_REGEX.sub("[Contact Protected]", s)
            s = cls.EMAIL_REGEX.sub("[Email Protected]", s)
            s = cls.SOCIAL_HANDLES_REGEX.sub("[Handle Protected]", s)
            s = cls.URL_REGEX.sub("[Link Protected]", s)

        return s

