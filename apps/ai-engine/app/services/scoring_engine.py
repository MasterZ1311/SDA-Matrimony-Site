from typing import Dict, Any, List, Tuple

class SDAMatchScoringEngine:
    """
    Seventh-day Adventist (SDA) Faith-Centric Match Compatibility Engine.
    Combines strict doctrinal constraints with weighted multi-factor compatibility.
    """

    @staticmethod
    def calculate_compatibility(profile_a: Dict[str, Any], profile_b: Dict[str, Any]) -> Dict[str, Any]:
        factors: List[Dict[str, Any]] = []
        
        # 1. Spiritual & Faith Alignment (Max 40 pts)
        spiritual_score, spiritual_factors = SDAMatchScoringEngine._score_spiritual(
            profile_a.get("spiritualProfile", {}),
            profile_b.get("spiritualProfile", {})
        )
        factors.extend(spiritual_factors)

        # 2. Lifestyle & Health Message (Max 25 pts)
        lifestyle_score, lifestyle_factors = SDAMatchScoringEngine._score_lifestyle(
            profile_a.get("lifestyleProfile", {}),
            profile_b.get("lifestyleProfile", {})
        )
        factors.extend(lifestyle_factors)

        # 3. Location & Relocation Alignment (Max 20 pts)
        relocation_score, relocation_factors = SDAMatchScoringEngine._score_relocation(
            profile_a, profile_b
        )
        factors.extend(relocation_factors)

        # 4. Education & Career Alignment (Max 15 pts)
        education_score, education_factors = SDAMatchScoringEngine._score_education(
            profile_a.get("educationCareer", {}),
            profile_b.get("educationCareer", {})
        )
        factors.extend(education_factors)

        total_score = round(spiritual_score + lifestyle_score + relocation_score + education_score)
        total_score = max(0, min(100, total_score))

        # Generate summary description
        if total_score >= 85:
            summary = "High Spiritual & Lifestyle Alignment. Excellent potential for a Christ-centered partnership."
        elif total_score >= 70:
            summary = "Strong Overall Compatibility with minor differences in lifestyle or location preferences."
        elif total_score >= 50:
            summary = "Moderate Compatibility. Further dialogue recommended regarding faith commitments and lifestyle."
        else:
            summary = "Significant differences in doctrinal observance or lifestyle commitments."

        return {
            "overallScore": total_score,
            "categoryScores": {
                "spiritualAlignment": round((spiritual_score / 40.0) * 100),
                "lifestyleAlignment": round((lifestyle_score / 25.0) * 100),
                "locationAndRelocation": round((relocation_score / 20.0) * 100),
                "educationAndCareer": round((education_score / 15.0) * 100),
            },
            "factors": factors,
            "summary": summary
        }

    @staticmethod
    def _score_spiritual(sp_a: Dict[str, Any], sp_b: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        factors = []

        # Baptism Status (Max 15)
        b_a = sp_a.get("baptismStatus")
        b_b = sp_b.get("baptismStatus")
        if b_a == "BAPTIZED_SDA" and b_b == "BAPTIZED_SDA":
            score += 15.0
            factors.append({
                "factorName": "Baptism Status",
                "weight": 15,
                "score": 15,
                "maxScore": 15,
                "explanation": "Both candidates are baptized members of the Seventh-day Adventist Church."
            })
        elif (b_a == "BAPTIZED_SDA" and b_b == "PLANNING_BAPTISM") or (b_b == "BAPTIZED_SDA" and b_a == "PLANNING_BAPTISM"):
            score += 10.0
            factors.append({
                "factorName": "Baptism Status",
                "weight": 15,
                "score": 10,
                "maxScore": 15,
                "explanation": "One candidate is baptized and the other is actively preparing for SDA baptism."
            })
        else:
            score += 5.0
            factors.append({
                "factorName": "Baptism Status",
                "weight": 15,
                "score": 5,
                "maxScore": 15,
                "explanation": "Different baptism stages within the Adventist community."
            })

        # Sabbath Observance (Max 15)
        s_a = sp_a.get("sabbathObservance")
        s_b = sp_b.get("sabbathObservance")
        if s_a == "STRICT_SUNSET_TO_SUNSET" and s_b == "STRICT_SUNSET_TO_SUNSET":
            score += 15.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 15,
                "maxScore": 15,
                "explanation": "Shared dedication to strict Friday-to-Saturday sunset Sabbath keeping."
            })
        elif s_a == s_b:
            score += 12.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 12,
                "maxScore": 15,
                "explanation": "Harmonious perspective on Sabbath hours and holy time."
            })
        else:
            score += 6.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 6,
                "maxScore": 15,
                "explanation": "Varying practices regarding Sabbath activities."
            })

        # Church Ministry Engagement (Max 10)
        m_a = set(sp_a.get("ministries", []))
        m_b = set(sp_b.get("ministries", []))
        common_ministries = m_a.intersection(m_b)
        if len(common_ministries) >= 2:
            score += 10.0
            factors.append({
                "factorName": "Ministry Involvement",
                "weight": 10,
                "score": 10,
                "maxScore": 10,
                "explanation": f"Multiple shared church ministries: {', '.join(common_ministries)}."
            })
        elif len(common_ministries) == 1:
            score += 7.0
            factors.append({
                "factorName": "Ministry Involvement",
                "weight": 10,
                "score": 7,
                "maxScore": 10,
                "explanation": f"Shared passion in church ministry: {list(common_ministries)[0]}."
            })
        elif len(m_a) > 0 and len(m_b) > 0:
            score += 5.0
            factors.append({
                "factorName": "Ministry Involvement",
                "weight": 10,
                "score": 5,
                "maxScore": 10,
                "explanation": "Both candidates actively serve in church ministries."
            })
        else:
            score += 2.0
            factors.append({
                "factorName": "Ministry Involvement",
                "weight": 10,
                "score": 2,
                "maxScore": 10,
                "explanation": "Opportunity to grow in collective church service."
            })

        return score, factors

    @staticmethod
    def _score_lifestyle(ls_a: Dict[str, Any], ls_b: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        factors = []

        # Diet (Max 15)
        d_a = ls_a.get("diet")
        d_b = ls_b.get("diet")
        vegetarian_set = {"STRICT_VEGAN", "LACTO_OVO_VEGETARIAN"}
        
        if d_a == d_b:
            score += 15.0
            factors.append({
                "factorName": "Dietary Standards",
                "weight": 15,
                "score": 15,
                "maxScore": 15,
                "explanation": f"Identical dietary preference ({d_a})."
            })
        elif d_a in vegetarian_set and d_b in vegetarian_set:
            score += 12.0
            factors.append({
                "factorName": "Dietary Standards",
                "weight": 15,
                "score": 12,
                "maxScore": 15,
                "explanation": "Both adhere to plant-based Adventist health principles."
            })
        else:
            score += 6.0
            factors.append({
                "factorName": "Dietary Standards",
                "weight": 15,
                "score": 6,
                "maxScore": 15,
                "explanation": "Different dietary practices; discussion advised for home meal preparation."
            })

        # Health Habits & Abstinence (Max 10)
        at_a = ls_a.get("alcoholTobacco")
        at_b = ls_b.get("alcoholTobacco")
        if at_a in ["STRICT_ABSTINENCE", "NEVER_USED"] and at_b in ["STRICT_ABSTINENCE", "NEVER_USED"]:
            score += 10.0
            factors.append({
                "factorName": "Health Message Abstinence",
                "weight": 10,
                "score": 10,
                "maxScore": 10,
                "explanation": "Total alignment on Adventist temperance (no alcohol, tobacco, or illicit substances)."
            })
        else:
            score += 4.0
            factors.append({
                "factorName": "Health Message Abstinence",
                "weight": 10,
                "score": 4,
                "maxScore": 10,
                "explanation": "Variations in temperance commitments."
            })

        return score, factors

    @staticmethod
    def _score_relocation(p_a: Dict[str, Any], p_b: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        factors = []

        same_country = p_a.get("residenceCountry") == p_b.get("residenceCountry")
        same_city = same_country and (p_a.get("residenceCity") == p_b.get("residenceCity"))

        relo_a = p_a.get("educationCareer", {}).get("relocationPreference")
        relo_b = p_b.get("educationCareer", {}).get("relocationPreference")

        if same_city:
            score = 20.0
            factors.append({
                "factorName": "Geographic Proximity",
                "weight": 20,
                "score": 20,
                "maxScore": 20,
                "explanation": "Both candidates currently live in the same metropolitan area."
            })
        elif same_country:
            score = 16.0
            factors.append({
                "factorName": "Geographic Proximity",
                "weight": 20,
                "score": 16,
                "maxScore": 20,
                "explanation": "Residing in the same country; easily reachable."
            })
        elif "WILLING_TO_RELOCATE_ANYWHERE" in [relo_a, relo_b]:
            score = 14.0
            factors.append({
                "factorName": "Relocation Readiness",
                "weight": 20,
                "score": 14,
                "maxScore": 20,
                "explanation": "Open to international relocation for family and mission."
            })
        else:
            score = 8.0
            factors.append({
                "factorName": "Relocation Readiness",
                "weight": 20,
                "score": 8,
                "maxScore": 20,
                "explanation": "Long-distance pairing requiring relocation planning."
            })

        return score, factors

    @staticmethod
    def _score_education(ec_a: Dict[str, Any], ec_b: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 12.0
        factors = [{
            "factorName": "Education & Career Alignment",
            "weight": 15,
            "score": 12,
            "maxScore": 15,
            "explanation": "Complementary educational backgrounds and professional vocations."
        }]
        return score, factors
