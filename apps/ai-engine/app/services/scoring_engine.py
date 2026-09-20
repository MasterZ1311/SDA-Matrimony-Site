from typing import Dict, Any, List, Tuple

class SDAMatchScoringEngine:
    """
    Seventh-day Adventist (SDA) Faith-Centric Match Compatibility Engine.
    Combines strict doctrinal constraints with weighted multi-factor compatibility.
    """

    @staticmethod
    def calculate_compatibility(profile_a: Dict[str, Any], profile_b: Dict[str, Any]) -> Dict[str, Any]:
        p_a = profile_a if isinstance(profile_a, dict) else {}
        p_b = profile_b if isinstance(profile_b, dict) else {}

        factors: List[Dict[str, Any]] = []
        
        # 1. Spiritual & Faith Alignment (Max 40 pts)
        sp_a = p_a.get("spiritualProfile") if isinstance(p_a.get("spiritualProfile"), dict) else {}
        sp_b = p_b.get("spiritualProfile") if isinstance(p_b.get("spiritualProfile"), dict) else {}
        spiritual_score, spiritual_factors = SDAMatchScoringEngine._score_spiritual(sp_a, sp_b)
        factors.extend(spiritual_factors)

        # 2. Lifestyle & Health Message (Max 25 pts)
        ls_a = p_a.get("lifestyleProfile") if isinstance(p_a.get("lifestyleProfile"), dict) else {}
        ls_b = p_b.get("lifestyleProfile") if isinstance(p_b.get("lifestyleProfile"), dict) else {}
        lifestyle_score, lifestyle_factors = SDAMatchScoringEngine._score_lifestyle(ls_a, ls_b)
        factors.extend(lifestyle_factors)

        # 3. Location & Relocation Alignment (Max 20 pts)
        relocation_score, relocation_factors = SDAMatchScoringEngine._score_relocation(p_a, p_b)
        factors.extend(relocation_factors)

        # 4. Education & Career Alignment (Max 15 pts)
        ec_a = p_a.get("educationCareer") if isinstance(p_a.get("educationCareer"), dict) else {}
        ec_b = p_b.get("educationCareer") if isinstance(p_b.get("educationCareer"), dict) else {}
        education_score, education_factors = SDAMatchScoringEngine._score_education(ec_a, ec_b)
        factors.extend(education_factors)

        total_score = round(spiritual_score + lifestyle_score + relocation_score + education_score)
        total_score = max(0, min(100, total_score))

        # Category scores normalized to 0-100%
        cat_spiritual = round((spiritual_score / 40.0) * 100) if spiritual_score > 0 else 0
        cat_lifestyle = round((lifestyle_score / 25.0) * 100) if lifestyle_score > 0 else 0
        cat_relocation = round((relocation_score / 20.0) * 100) if relocation_score > 0 else 0
        cat_education = round((education_score / 15.0) * 100) if education_score > 0 else 0

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
                "spiritualAlignment": max(0, min(100, cat_spiritual)),
                "lifestyleAlignment": max(0, min(100, cat_lifestyle)),
                "locationAndRelocation": max(0, min(100, cat_relocation)),
                "educationAndCareer": max(0, min(100, cat_education)),
            },
            "factors": factors,
            "summary": summary
        }

    @staticmethod
    def _score_spiritual(sp_a: Dict[str, Any], sp_b: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        factors = []

        # Baptism Status (Max 15)
        b_a = str(sp_a.get("baptismStatus") or "").strip().upper()
        b_b = str(sp_b.get("baptismStatus") or "").strip().upper()
        
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
        elif b_a and b_b:
            score += 5.0
            factors.append({
                "factorName": "Baptism Status",
                "weight": 15,
                "score": 5,
                "maxScore": 15,
                "explanation": "Different baptism stages within the Adventist community."
            })
        else:
            score += 3.0
            factors.append({
                "factorName": "Baptism Status",
                "weight": 15,
                "score": 3,
                "maxScore": 15,
                "explanation": "Baptism information partially unstated."
            })

        # Sabbath Observance (Max 15)
        s_a = str(sp_a.get("sabbathObservance") or "").strip().upper()
        s_b = str(sp_b.get("sabbathObservance") or "").strip().upper()
        
        if s_a == "STRICT_SUNSET_TO_SUNSET" and s_b == "STRICT_SUNSET_TO_SUNSET":
            score += 15.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 15,
                "maxScore": 15,
                "explanation": "Shared dedication to strict Friday-to-Saturday sunset Sabbath keeping."
            })
        elif s_a and s_b and s_a == s_b:
            score += 12.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 12,
                "maxScore": 15,
                "explanation": "Harmonious perspective on Sabbath hours and holy time."
            })
        elif s_a and s_b:
            score += 6.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 6,
                "maxScore": 15,
                "explanation": "Varying practices regarding Sabbath activities."
            })
        else:
            score += 4.0
            factors.append({
                "factorName": "Sabbath Observance",
                "weight": 15,
                "score": 4,
                "maxScore": 15,
                "explanation": "Sabbath practice preferences partially unspecified."
            })

        # Church Ministry Engagement (Max 10)
        raw_m_a = sp_a.get("ministries")
        raw_m_b = sp_b.get("ministries")
        list_m_a = [str(x) for x in raw_m_a] if isinstance(raw_m_a, (list, tuple, set)) else []
        list_m_b = [str(x) for x in raw_m_b] if isinstance(raw_m_b, (list, tuple, set)) else []
        
        m_a = set(list_m_a)
        m_b = set(list_m_b)
        common_ministries = m_a.intersection(m_b)
        
        if len(common_ministries) >= 2:
            score += 10.0
            factors.append({
                "factorName": "Ministry Involvement",
                "weight": 10,
                "score": 10,
                "maxScore": 10,
                "explanation": f"Multiple shared church ministries: {', '.join(sorted(common_ministries))}."
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
        d_a = str(ls_a.get("diet") or "").strip().upper()
        d_b = str(ls_b.get("diet") or "").strip().upper()
        vegetarian_set = {"STRICT_VEGAN", "LACTO_OVO_VEGETARIAN"}
        
        if d_a and d_b and d_a == d_b:
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
        elif d_a and d_b:
            score += 6.0
            factors.append({
                "factorName": "Dietary Standards",
                "weight": 15,
                "score": 6,
                "maxScore": 15,
                "explanation": "Different dietary practices; discussion advised for home meal preparation."
            })
        else:
            score += 4.0
            factors.append({
                "factorName": "Dietary Standards",
                "weight": 15,
                "score": 4,
                "maxScore": 15,
                "explanation": "Dietary preferences partially unspecified."
            })

        # Health Habits & Abstinence (Max 10)
        at_a = str(ls_a.get("alcoholTobacco") or "").strip().upper()
        at_b = str(ls_b.get("alcoholTobacco") or "").strip().upper()
        abstinence_set = {"STRICT_ABSTINENCE", "NEVER_USED"}
        
        if at_a in abstinence_set and at_b in abstinence_set:
            score += 10.0
            factors.append({
                "factorName": "Health Message Abstinence",
                "weight": 10,
                "score": 10,
                "maxScore": 10,
                "explanation": "Total alignment on Adventist temperance (no alcohol, tobacco, or illicit substances)."
            })
        elif at_a and at_b:
            score += 4.0
            factors.append({
                "factorName": "Health Message Abstinence",
                "weight": 10,
                "score": 4,
                "maxScore": 10,
                "explanation": "Variations in temperance commitments."
            })
        else:
            score += 3.0
            factors.append({
                "factorName": "Health Message Abstinence",
                "weight": 10,
                "score": 3,
                "maxScore": 10,
                "explanation": "Temperance status not fully specified."
            })

        return score, factors

    @staticmethod
    def _score_relocation(p_a: Dict[str, Any], p_b: Dict[str, Any]) -> Tuple[float, List[Dict[str, Any]]]:
        score = 0.0
        factors = []

        country_a = str(p_a.get("residenceCountry") or "").strip().lower()
        country_b = str(p_b.get("residenceCountry") or "").strip().lower()
        city_a = str(p_a.get("residenceCity") or "").strip().lower()
        city_b = str(p_b.get("residenceCity") or "").strip().lower()

        same_country = bool(country_a and country_b and country_a == country_b)
        same_city = bool(same_country and city_a and city_b and city_a == city_b)

        ec_a = p_a.get("educationCareer") if isinstance(p_a.get("educationCareer"), dict) else {}
        ec_b = p_b.get("educationCareer") if isinstance(p_b.get("educationCareer"), dict) else {}
        
        relo_a = str(ec_a.get("relocationPreference") or "").strip().upper()
        relo_b = str(ec_b.get("relocationPreference") or "").strip().upper()

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
        elif "WITHIN_DIVISION" in [relo_a, relo_b] or "WITHIN_COUNTRY" in [relo_a, relo_b]:
            score = 11.0
            factors.append({
                "factorName": "Relocation Readiness",
                "weight": 20,
                "score": 11,
                "maxScore": 20,
                "explanation": "Open to regional or division-level relocation."
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
        edu_rank = {
            "DOCTORATE": 5,
            "MASTERS": 4,
            "BACHELORS": 3,
            "DIPLOMA": 2,
            "HIGH_SCHOOL": 1,
            "OTHER": 2,
        }

        edu_a = str(ec_a.get("highestEducation") or "").strip().upper()
        edu_b = str(ec_b.get("highestEducation") or "").strip().upper()

        rank_a = edu_rank.get(edu_a, 3)
        rank_b = edu_rank.get(edu_b, 3)

        diff = abs(rank_a - rank_b)
        if diff == 0:
            score = 15.0
            explanation = "Harmonious educational backgrounds and shared professional ambitions."
        elif diff == 1:
            score = 13.0
            explanation = "Complementary educational levels and mutual professional respect."
        elif diff == 2:
            score = 10.0
            explanation = "Different educational backgrounds with potential for mutual growth."
        else:
            score = 8.0
            explanation = "Varied educational trajectories; shared values remain primary."

        # Check for Adventist Higher Education Heritage
        inst_a = str(ec_a.get("institution") or "").lower()
        inst_b = str(ec_b.get("institution") or "").lower()
        sda_institutions = [
            'loma linda', 'andrews', 'oakwood', 'southern', 'walla walla',
            'southwestern', 'pacific union', 'adventist', 'spicer', 'avondale',
            'montemorelos', 'babcock', 'friedensau', 'helderberg', 'weimar'
        ]
        a_is_sda = any(inst in inst_a for inst in sda_institutions)
        b_is_sda = any(inst in inst_b for inst in sda_institutions)
        if a_is_sda and b_is_sda:
            explanation += " Both candidates share recognized Adventist Higher Education collegiate heritage."
            score = min(15.0, score + 2.0)

        factors = [{
            "factorName": "Education & Career Alignment",
            "weight": 15,
            "score": round(score),
            "maxScore": 15,
            "explanation": explanation
        }]
        return score, factors


