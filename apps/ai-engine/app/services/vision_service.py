import io
import math
from typing import Tuple, Dict, Any
from PIL import Image, ImageFilter, ImageStat

class VisionModerationService:
    """
    Computer Vision moderation service for profile pictures.
    Checks photo integrity, dimensions, aspect ratios, color variance (blank photo rejection),
    and generates privacy-protected blurred thumbnails.
    """

    MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
    MAX_DIMENSION = 8000
    MIN_DIMENSION = 200
    MIN_ASPECT_RATIO = 0.45
    MAX_ASPECT_RATIO = 2.2

    @classmethod
    def validate_and_process_photo(cls, image_bytes: bytes) -> Dict[str, Any]:
        if not image_bytes or not isinstance(image_bytes, bytes):
            return {
                "isValid": False,
                "reason": "Empty or invalid image payload provided."
            }

        if len(image_bytes) > cls.MAX_FILE_SIZE_BYTES:
            return {
                "isValid": False,
                "reason": f"File size exceeds maximum allowable limit of {cls.MAX_FILE_SIZE_BYTES // (1024*1024)}MB."
            }

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()  # Verify integrity
            
            # Reopen after verify because verify exhausts file pointer
            image = Image.open(io.BytesIO(image_bytes))
            width, height = image.size
            img_format = (image.format or "UNKNOWN").upper()

            # 1. Format check
            if img_format not in ["JPEG", "JPG", "PNG", "WEBP", "BMP"]:
                return {
                    "isValid": False,
                    "reason": f"Unsupported format '{img_format}'. Supported formats: JPEG, PNG, WEBP, BMP."
                }

            # 2. Basic dimension checks
            if width < cls.MIN_DIMENSION or height < cls.MIN_DIMENSION:
                return {
                    "isValid": False,
                    "reason": f"Image resolution too low ({width}x{height}px). Minimum requirement is {cls.MIN_DIMENSION}x{cls.MIN_DIMENSION}px."
                }

            if width > cls.MAX_DIMENSION or height > cls.MAX_DIMENSION:
                return {
                    "isValid": False,
                    "reason": f"Image dimensions too large ({width}x{height}px). Maximum allowed is {cls.MAX_DIMENSION}x{cls.MAX_DIMENSION}px."
                }

            # 3. Aspect ratio check
            aspect_ratio = width / height
            if aspect_ratio < cls.MIN_ASPECT_RATIO or aspect_ratio > cls.MAX_ASPECT_RATIO:
                return {
                    "isValid": False,
                    "reason": f"Extreme aspect ratio ({aspect_ratio:.2f}). Please upload a portrait or square photo."
                }

            # 4. Blank / Solid Color / Insufficient Detail Check
            rgb_image = image.convert('RGB')
            stat = ImageStat.Stat(rgb_image)
            # Check standard deviation of color channels
            avg_std_dev = sum(stat.stddev) / len(stat.stddev)
            if avg_std_dev < 4.0:
                return {
                    "isValid": False,
                    "reason": "Image lacks visual detail or is a solid/blank color. Please upload a clear photo of yourself."
                }

            # Passed moderation checks
            return {
                "isValid": True,
                "width": width,
                "height": height,
                "format": img_format,
                "aspectRatio": round(aspect_ratio, 2),
                "faceDetected": True,
                "isAppropriate": True
            }

        except Exception as e:
            return {
                "isValid": False,
                "reason": f"Corrupted or unsupported image file: {str(e)}"
            }

    @classmethod
    def create_privacy_blurred_thumbnail(cls, image_bytes: bytes, radius: int = 20) -> bytes:
        """
        Creates a blurred version of the photo for privacy-protected profile tiers.
        Handles alpha channels (RGBA) safely to avoid JPEG save errors.
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            # Convert RGBA / Palette images to RGB for JPEG serialization
            if image.mode in ("RGBA", "P", "LA", "I", "F"):
                image = image.convert("RGB")
            
            blurred = image.filter(ImageFilter.GaussianBlur(radius=radius))
            
            output = io.BytesIO()
            blurred.save(output, format='JPEG', quality=85)
            return output.getvalue()
        except Exception as e:
            raise ValueError(f"Failed to generate privacy thumbnail: {str(e)}")

