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
        self.assertLess(result["overallScore"], 60)

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

    def test_phone_number_allowed_postmatch(self):
        res = NLPContentFilter.screen_text("Here is my phone number: 301-555-0199", is_mutual_match=True)
        self.assertTrue(res["isSafe"])
        self.assertEqual(len(res["flags"]), 0)

    def test_email_and_socials_blocked_prematch(self):
        res = NLPContentFilter.screen_text("Message me on instagram: @sda_user or email test@example.com", is_mutual_match=False)
        self.assertFalse(res["isSafe"])
        self.assertIn("EMAIL_DETECTED", res["flags"])
        self.assertIn("EXTERNAL_CONTACT_HANDLE_DETECTED", res["flags"])

class TestVisionModerationService(unittest.TestCase):
    def test_valid_image(self):
        img = Image.new('RGB', (400, 400), color=(73, 109, 137))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        res = VisionModerationService.validate_and_process_photo(buf.getvalue())
        self.assertTrue(res["isValid"])
        self.assertEqual(res["width"], 400)
        self.assertEqual(res["height"], 400)

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

if __name__ == "__main__":
    unittest.main()
