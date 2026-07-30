"""
InsForge Enterprise Intent Infrastructure Engine — HackPilot AI Domain
Defines agent intent profiles for Hackathon Coaching:
INTENT_SCOPE_AUDIT, INTENT_BLOCKER_PIVOT, INTENT_PITCH_BUILDER.
"""

import json
from typing import Dict, Any, List

class InsForgeEngine:
    def __init__(self, api_key: str = None, endpoint: str = None):
        self.api_key = api_key or "insforge_hackpilot_ent_4411"
        self.endpoint = endpoint or "https://api.insforge.dev/v1"
        self.environment = "Production (Managed InsForge Cluster)"

        self.intent_profiles = {
            "INTENT_SCOPE_AUDIT": {
                "name": "Hackathon Project Scope Audit",
                "description": "Evaluates project idea feasibility, strips luxury features, and creates a 24-hour MVP timeline.",
                "lifecycle_stage": "PRODUCTION_DEPLOYED",
                "auth_level": "Hackathon Lead / Coach",
                "database_binding": "hackpilot_entity_graph_v1",
                "target_model": "pipeshift/hackathon-coach-8b-v2",
                "max_compute_timeout": "20s",
                "requires_user_approval": True, # Mandatory approval flag
                "schema": {
                    "required_sources": ["github", "linear", "discord", "figma"],
                    "min_confidence_score": 85.0,
                    "enforce_user_approval": True
                }
            },
            "INTENT_BLOCKER_PIVOT": {
                "name": "Emergency 3 AM Blocker Pivot",
                "description": "Triggered when a technical blocker is logged. Recalculates remaining milestones to ensure demo deadline is met.",
                "lifecycle_stage": "PRODUCTION_DEPLOYED",
                "auth_level": "Hackathon Team Member",
                "database_binding": "discord_linear_connector",
                "target_model": "pipeshift/hackathon-coach-8b-v2",
                "max_compute_timeout": "15s",
                "requires_user_approval": False,
                "schema": {
                    "required_sources": ["discord", "github"],
                    "min_confidence_score": 80.0
                }
            },
            "INTENT_PITCH_BUILDER": {
                "name": "2-Minute Pitch Deck & PPT Generator",
                "description": "Compiles completed GitHub commits, Linear tasks, and Figma specs into a presentation deck and script.",
                "lifecycle_stage": "PRODUCTION_DEPLOYED",
                "auth_level": "Hackathon Presenter",
                "database_binding": "figma_github_connector",
                "target_model": "pipeshift/hackathon-coach-8b-v2",
                "max_compute_timeout": "30s",
                "requires_user_approval": True, # Mandatory approval flag
                "schema": {
                    "required_sources": ["figma", "github", "linear"],
                    "min_confidence_score": 90.0
                }
            }
        }

    def set_config(self, api_key: str = None, endpoint: str = None):
        if api_key: self.api_key = api_key
        if endpoint: self.endpoint = endpoint

    def evaluate_intent(self, intent_id: str, grounding_context: Dict[str, Any]) -> Dict[str, Any]:
        profile = self.intent_profiles.get(intent_id, self.intent_profiles["INTENT_SCOPE_AUDIT"])
        confidence = grounding_context.get("confidence_score", 0)
        min_required = profile["schema"]["min_confidence_score"]
        is_valid = confidence >= min_required

        return {
            "intent_id": intent_id,
            "profile_name": profile["name"],
            "lifecycle_stage": profile["lifecycle_stage"],
            "database_binding": profile["database_binding"],
            "requires_user_approval": profile.get("requires_user_approval", True),
            "valid": is_valid,
            "confidence_score": confidence,
            "min_required": min_required,
            "status": "INTENT_BOUND_SUCCESS" if is_valid else "INTENT_DEGRADED_BELOW_THRESHOLD",
            "compute_cluster": self.environment
        }

    def get_profiles(self) -> Dict[str, Any]:
        return {
            "environment": self.environment,
            "api_key_status": "AUTHENTICATED",
            "profiles": self.intent_profiles
        }
