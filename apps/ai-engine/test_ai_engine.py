import unittest
import io
from PIL import Image
from app.services.scoring_engine import SDAMatchScoringEngine
from app.services.nlp_service import NLPContentFilter
from app.services.vision_service import VisionModerationService

class TestSDAMatchScoringEngine(unittest.TestCase):
    def setUp(self):
        self.profile_a = {
            "residenceCountry": "United States",
            "residenceCity": "Silver Spring",
            "spiritualProfile": {
                "baptismStatus": "BAPTIZED_SDA",
                "sabbathObservance": "STRICT_SUNSET_TO_SUNSET",
                "ministries": ["Sabbath School", "Music / Choir", "Pathfinders"]
            },
            "lifestyleProfile": {
                "diet": "LACTO_OVO_VEGETARIAN",
                "alcoholTobacco": "STRICT_ABSTINENCE",
                "musicPreferences": ["Sacred", "Classical"]
            },
            "educationCareer": {
                "highestEducation": "MASTERS",
                "relocationPreference": "WILLING_TO_RELOCATE_ANYWHERE"
            }
        }

        self.profile_b = {
            "residenceCountry": "United States",
            "residenceCity": "Silver Spring",
            "spiritualProfile": {
                "baptismStatus": "BAPTIZED_SDA",
                "sabbathObservance": "STRICT_SUNSET_TO_SUNSET",
                "ministries": ["Sabbath School", "Music / Choir"]
            },
            "lifestyleProfile": {
                "diet": "LACTO_OVO_VEGETARIAN",
                "alcoholTobacco": "STRICT_ABSTINENCE",
                "musicPreferences": ["Sacred"]
            },
            "educationCareer": {
                "highestEducation": "BACHELORS",
                "relocationPreference": "WITHIN_COUNTRY"
            }
        }

    def test_high_compatibility(self):
        result = SDAMatchScoringEngine.calculate_compatibility(self.profile_a, self.profile_b)
        self.assertGreaterEqual(result["overallScore"], 85)
        self.assertEqual(result["categoryScores"]["spiritualAlignment"], 100)
        self.assertEqual(result["categoryScores"]["lifestyleAlignment"], 100)
        self.assertEqual(result["categoryScores"]["locationAndRelocation"], 100)
        self.assertIn("Christ-centered", result["summary"])

    def test_empty_and_null_profiles(self):
        result = SDAMatchScoringEngine.calculate_compatibility({}, {})
        self.assertIsInstance(result["overallScore"], int)
        self.assertGreaterEqual(result["overallScore"], 0)
        self.assertLessEqual(result["overallScore"], 100)

    def test_divergent_faith_profiles(self):
        prof_diff = {
            "residenceCountry": "Kenya",
            "residenceCity": "Nairobi",
            "spiritualProfile": {
                "baptismStatus": "ATTENDING_NON_MEMBER",
                "sabbathObservance": "LEARNING",
                "ministries": []
            },
            "lifestyleProfile": {
                "diet": "NON_VEGETARIAN_CLEAN_ONLY",
                "alcoholTobacco": "OCCASIONAL"
            },
            "educationCareer": {
                "relocationPreference": "NOT_WILLING_TO_RELOCATE"
            }
        }
        result = SDAMatchScoringEngine.calculate_compatibility(self.profile_a, prof_diff)
    def test_null_nested_fields_do_not_crash(self):
        none_profile = {
            "spiritualProfile": None,
            "lifestyleProfile": None,
            "educationCareer": None,
            "residenceCountry": None,
            "residenceCity": None
        }
        res = SDAMatchScoringEngine.calculate_compatibility(none_profile, none_profile)
        self.assertIsInstance(res["overallScore"], int)
        self.assertTrue(0 <= res["overallScore"] <= 100)

    def test_dietary_matrix_domain_accuracy(self):
        # Vegan + Vegan
        p1 = {"lifestyleProfile": {"diet": "STRICT_VEGAN", "alcoholTobacco": "STRICT_ABSTINENCE"}}
        p2 = {"lifestyleProfile": {"diet": "STRICT_VEGAN", "alcoholTobacco": "STRICT_ABSTINENCE"}}
        res = SDAMatchScoringEngine.calculate_compatibility(p1, p2)
        self.assertEqual(res["categoryScores"]["lifestyleAlignment"], 100)

        # Vegan + Vegetarian
        p3 = {"lifestyleProfile": {"diet": "LACTO_OVO_VEGETARIAN", "alcoholTobacco": "STRICT_ABSTINENCE"}}
        res_veg = SDAMatchScoringEngine.calculate_compatibility(p1, p3)
        self.assertEqual(res_veg["categoryScores"]["lifestyleAlignment"], 88)

        # Vegan + Non-Vegetarian Clean
        p4 = {"lifestyleProfile": {"diet": "NON_VEGETARIAN_CLEAN_ONLY", "alcoholTobacco": "STRICT_ABSTINENCE"}}
        res_clean = SDAMatchScoringEngine.calculate_compatibility(p1, p4)
        self.assertEqual(res_clean["categoryScores"]["lifestyleAlignment"], 64)

    def test_ministry_and_sabbath_factors(self):
        p_strict = {
            "spiritualProfile": {
                "baptismStatus": "BAPTIZED_SDA",
                "sabbathObservance": "STRICT_SUNSET_TO_SUNSET",
                "ministries": ["Pathfinders", "Adventist Youth (AY)"]
            }
        }
        p_learning = {
            "spiritualProfile": {
                "baptismStatus": "PLANNING_BAPTISM",
                "sabbathObservance": "LEARNING",
                "ministries": []
            }
        }
        res = SDAMatchScoringEngine.calculate_compatibility(p_strict, p_learning)
        self.assertGreater(res["categoryScores"]["spiritualAlignment"], 0)
        self.assertLess(res["categoryScores"]["spiritualAlignment"], 80)

class TestNLPContentFilter(unittest.TestCase):
    def test_clean_text(self):
        res = NLPContentFilter.screen_text("I love church ministry and pathfinder leadership.")
        self.assertTrue(res["isSafe"])
        self.assertEqual(len(res["flags"]), 0)

    def test_phone_number_blocked_prematch(self):
        res = NLPContentFilter.screen_text("Call me directly at 301-555-0199 or 909-558-4570", is_mutual_match=False)
        self.assertFalse(res["isSafe"])
        self.assertIn("PHONE_NUMBER_DETECTED", res["flags"])
        self.assertIn("[Contact Protected]", res["cleanedText"])

    def test_spaced_phone_blocked_prematch(self):
        res = NLPContentFilter.screen_text("Call me at 9 8 7 6 5 4 3 2 1 0 immediately", is_mutual_match=False)
        self.assertFalse(res["isSafe"])
        self.assertIn("PHONE_NUMBER_DETECTED", res["flags"])

    def test_phone_number_allowed_postmatch(self):
        res = NLPContentFilter.screen_text("Here is my phone number: 301-555-0199", is_mutual_match=True)
        self.assertTrue(res["isSafe"])
        self.assertEqual(len(res["flags"]), 0)

    def test_email_and_socials_blocked_prematch(self):
        res = NLPContentFilter.screen_text("Message me on instagram: @sda_user or email test@example.com", is_mutual_match=False)
        self.assertFalse(res["isSafe"])
        self.assertIn("EMAIL_DETECTED", res["flags"])
        self.assertIn("EXTERNAL_CONTACT_HANDLE_DETECTED", res["flags"])

    def test_obfuscated_email_blocked_prematch(self):
        cases = [
            "Contact me at user [at] adventist [dot] org",
            "My address is member (at) gmail (dot) com",
            "Write to pastor at church dot org"
        ]
        for c in cases:
            res = NLPContentFilter.screen_text(c, is_mutual_match=False)
            self.assertFalse(res["isSafe"])
            self.assertIn("EMAIL_DETECTED", res["flags"])

    def test_toxicity_and_profanity_blocked_always(self):
        toxic_samples = [
            "You are an idiot and a scammer",
            "Wire money for crypto investment now",
            "Send nudes please"
        ]
        for sample in toxic_samples:
            res_pre = NLPContentFilter.screen_text(sample, is_mutual_match=False)
            res_post = NLPContentFilter.screen_text(sample, is_mutual_match=True)
            self.assertFalse(res_pre["isSafe"])
            self.assertFalse(res_post["isSafe"])
            self.assertIn("PROFANITY_OR_TOXICITY_DETECTED", res_pre["flags"])
            self.assertIn("PROFANITY_OR_TOXICITY_DETECTED", res_post["flags"])
            self.assertIn("[Content Moderated]", res_pre["cleanedText"])

class TestVisionModerationService(unittest.TestCase):
    def test_valid_image(self):
        # Create an image with variance/details
        img = Image.new('RGB', (400, 400), color=(73, 109, 137))
        for x in range(400):
            for y in range(50):
                img.putpixel((x, y), (200, x % 255, y % 255))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        res = VisionModerationService.validate_and_process_photo(buf.getvalue())
        self.assertTrue(res["isValid"])
        self.assertEqual(res["width"], 400)
        self.assertEqual(res["height"], 400)

    def test_solid_blank_image_rejected(self):
        # Create flat solid color image
        img = Image.new('RGB', (400, 400), color=(255, 255, 255))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        res = VisionModerationService.validate_and_process_photo(buf.getvalue())
        self.assertFalse(res["isValid"])
        self.assertIn("lacks visual detail", res["reason"])

    def test_too_small_image(self):
        img = Image.new('RGB', (100, 100), color=(73, 109, 137))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        res = VisionModerationService.validate_and_process_photo(buf.getvalue())
        self.assertFalse(res["isValid"])
        self.assertIn("too low", res["reason"])

    def test_corrupted_bytes(self):
        res = VisionModerationService.validate_and_process_photo(b"not an image")
        self.assertFalse(res["isValid"])

    def test_privacy_blurred_thumbnail(self):
        img = Image.new('RGBA', (300, 300), color=(100, 150, 200, 255))
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        blurred_bytes = VisionModerationService.create_privacy_blurred_thumbnail(buf.getvalue())
        self.assertGreater(len(blurred_bytes), 0)
        blurred_img = Image.open(io.BytesIO(blurred_bytes))
        self.assertEqual(blurred_img.size, (300, 300))

import asyncio
from fastapi import HTTPException
from app.core.config import settings
from app.core.security import verify_api_key
try:
    from fastapi.testclient import TestClient
    from app.main import app
    HAS_TESTCLIENT = True
except ImportError:
    HAS_TESTCLIENT = False

class TestAPISecurity(unittest.TestCase):
    def test_verify_api_key_valid_header(self):
        token = asyncio.run(verify_api_key(x_api_key=settings.AI_SERVICE_SECRET, authorization=None))
        self.assertEqual(token, settings.AI_SERVICE_SECRET)

    def test_verify_api_key_valid_bearer(self):
        token = asyncio.run(verify_api_key(x_api_key=None, authorization=f"Bearer {settings.AI_SERVICE_SECRET}"))
        self.assertEqual(token, settings.AI_SERVICE_SECRET)

    def test_verify_api_key_missing(self):
        with self.assertRaises(HTTPException) as ctx:
            asyncio.run(verify_api_key(x_api_key=None, authorization=None))
        self.assertEqual(ctx.exception.status_code, 401)

    def test_verify_api_key_invalid(self):
        with self.assertRaises(HTTPException) as ctx:
            asyncio.run(verify_api_key(x_api_key="invalid_token", authorization=None))
        self.assertEqual(ctx.exception.status_code, 401)

    def test_fastapi_endpoints_auth(self):
        if not HAS_TESTCLIENT:
            return
        client = TestClient(app)
        # Health check is public
        health_res = client.get("/health")
        self.assertEqual(health_res.status_code, 200)

        # Compatibility score unauthenticated -> 401
        score_payload = {"profileA": {}, "profileB": {}}
        unauth_score = client.post("/api/v1/compatibility/score", json=score_payload)
        self.assertEqual(unauth_score.status_code, 401)

        # Compatibility score invalid auth -> 401
        bad_auth_score = client.post(
            "/api/v1/compatibility/score",
            json=score_payload,
            headers={"X-API-Key": "wrong_key"},
        )
        self.assertEqual(bad_auth_score.status_code, 401)

        # Compatibility score valid X-API-Key -> 200
        valid_header_score = client.post(
            "/api/v1/compatibility/score",
            json=score_payload,
            headers={"X-API-Key": settings.AI_SERVICE_SECRET},
        )
        self.assertEqual(valid_header_score.status_code, 200)

        # Compatibility score valid Bearer token -> 200
        valid_bearer_score = client.post(
            "/api/v1/compatibility/score",
            json=score_payload,
            headers={"Authorization": f"Bearer {settings.AI_SERVICE_SECRET}"},
        )
        self.assertEqual(valid_bearer_score.status_code, 200)

        # Moderation unauthenticated -> 401
        mod_payload = {"text": "Hello, testing faith moderation", "isMutualMatch": False}
        unauth_mod = client.post("/api/v1/moderation/screen-text", json=mod_payload)
        self.assertEqual(unauth_mod.status_code, 401)

        # Moderation valid X-API-Key -> 200
        valid_mod = client.post(
            "/api/v1/moderation/screen-text",
            json=mod_payload,
            headers={"X-API-Key": settings.AI_SERVICE_SECRET},
        )
        self.assertEqual(valid_mod.status_code, 200)

        # Icebreakers endpoint -> 200
        ice_payload = {
            "targetProfile": {
                "firstName": "Hannah",
                "educationCareer": {"occupation": "Pediatric Nurse", "institution": "Loma Linda University"},
                "residenceCity": "Loma Linda"
            }
        }
        valid_ice = client.post(
            "/api/v1/compatibility/icebreakers",
            json=ice_payload,
            headers={"X-API-Key": settings.AI_SERVICE_SECRET},
        )
        self.assertEqual(valid_ice.status_code, 200)
        ice_data = valid_ice.json()
        self.assertEqual(ice_data["targetName"], "Hannah")
        self.assertGreaterEqual(len(ice_data["icebreakers"]), 3)


if __name__ == "__main__":
    unittest.main()
