"""
Flexprice Usage-Based Monetization & Billing Engine — HackPilot AI Domain
Tracks Hackathon Coaching task executions (Scope Audit, Emergency Pivot, Pitch Deck Generator),
manages FLX credit balances, and records usage transactions.
"""

import time
import uuid
from typing import Dict, Any, List

class FlexpriceEngine:
    def __init__(self, api_key: str = None, endpoint: str = None):
        self.api_key = api_key or "flex_hackpilot_billing_88"
        self.endpoint = endpoint or "https://api.flexprice.io/v1"
        self.credit_balance = 290.0
        self.total_usage_count = 12
        
        self.ledger: List[Dict[str, Any]] = [
            {
                "id": "tx-901",
                "timestamp": "2026-07-30 16:10:00",
                "task": "Hackathon Project Scope Audit",
                "credits_deducted": 2.0,
                "balance_after": 298.0,
                "status": "SETTLED"
            },
            {
                "id": "tx-902",
                "timestamp": "2026-07-30 16:30:00",
                "task": "Emergency 3 AM Blocker Pivot",
                "credits_deducted": 5.0,
                "balance_after": 293.0,
                "status": "SETTLED"
            }
        ]

    def set_config(self, api_key: str = None, endpoint: str = None):
        if api_key: self.api_key = api_key
        if endpoint: self.endpoint = endpoint

    def meter_usage(self, task_id: str, credits: float = 2.0, task_name: str = "HackPilot Coaching Action") -> Dict[str, Any]:
        self.credit_balance = max(0.0, round(self.credit_balance - credits, 2))
        self.total_usage_count += 1
        
        tx_id = f"tx-{uuid.uuid4().hex[:6]}"
        record = {
            "id": tx_id,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "task_id": task_id,
            "task": task_name,
            "credits_deducted": credits,
            "balance_after": self.credit_balance,
            "status": "SETTLED"
        }
        
        self.ledger.insert(0, record)
        if len(self.ledger) > 20: self.ledger.pop()

        return {
            "success": True,
            "tx_id": tx_id,
            "credits_deducted": credits,
            "remaining_credits": self.credit_balance,
            "total_tasks_billed": self.total_usage_count
        }

    def get_ledger(self) -> Dict[str, Any]:
        return {
            "credit_balance": self.credit_balance,
            "total_tasks_billed": self.total_usage_count,
            "currency": "HackPilot Credits (FLX)",
            "rate_per_task": "2.0 - 5.0 FLX / task",
            "ledger": self.ledger
        }
