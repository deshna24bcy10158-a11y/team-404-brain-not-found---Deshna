"""
HackCoach.ai — Grounded Enterprise Hackathon Backend Server
Built with Python standard library (http.server).
Features Self-Contained Multilingual AI Agent Coach Engine.
"""

import http.server
import socketserver
import json
import os
import sys
import urllib.parse
from typing import Dict, Any

from hydradb_engine import HydraDBEngine
from pipeshift_inference import PipeshiftInferenceEngine

PORT = int(os.environ.get("PORT", 8080))
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

# Core Engines
hydra_engine = HydraDBEngine()
pipeshift_engine = PipeshiftInferenceEngine()

# App Global State
app_state = {
    "current_project_idea": "HackCoach.ai — Grounded Hackathon Operations Engine",
    "latest_evaluation": None,
    "user_approval_status": "PENDING"
}

class HackPilotHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/status":
            self.send_json({
                "status": "ONLINE",
                "app": "HackCoach.ai",
                "theme": "Warm Brown, Beige, Black, White Aesthetic",
                "ai_agent": "AI Agent Coach (Active & Multilingual)",
                "stack": {
                    "pipeshift": {"status": "ACTIVE", "model": pipeshift_engine.model, "avg_latency": "34.2ms"},
                    "hydradb": {"status": "CONNECTED", "connectors": 4, "sources": ["GitHub", "Linear", "Discord", "Figma"]}
                },
                "current_project": app_state["current_project_idea"]
            })

        elif path == "/api/pipeshift/stats":
            self.send_json(pipeshift_engine.metrics)

        elif path == "/api/roadmap":
            phases = pipeshift_engine.generate_dynamic_roadmap(app_state["current_project_idea"])
            self.send_json({"phases": phases})

        elif path == "/api/qa":
            qa_res = pipeshift_engine.generate_judge_qa(idea_context=app_state["current_project_idea"])
            self.send_json({"success": True, "qa": qa_res})

        else:
            if path == "/": self.path = "/index.html"
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try: body = json.loads(body_data) if body_data else {}
        except Exception: body = {}

        if path == "/api/evaluator":
            idea = body.get("idea", app_state["current_project_idea"])
            app_state["current_project_idea"] = idea
            
            eval_res = pipeshift_engine.evaluate_project(idea)
            app_state["latest_evaluation"] = eval_res
            
            self.send_json({
                "success": True,
                "evaluation": eval_res
            })

        elif path == "/api/ppt":
            topic = body.get("topic", "").strip()
            
            if topic:
                ppt_res = pipeshift_engine.generate_full_ppt(topic=topic)
            else:
                ppt_res = pipeshift_engine.generate_full_ppt(idea_context=app_state["current_project_idea"])

            self.send_json({
                "success": True,
                "ppt": ppt_res
            })

        elif path == "/api/qa":
            qa_res = pipeshift_engine.generate_judge_qa(idea_context=app_state["current_project_idea"])
            self.send_json({
                "success": True,
                "qa": qa_res
            })

        elif path == "/api/chat":
            user_msg = body.get("message", "")
            bot_reply = pipeshift_engine.chat_response(user_msg, app_state["current_project_idea"])
            self.send_json({"reply": bot_reply})

        else:
            self.send_json({"error": "Endpoint Not Found"}, status=404)

    def send_json(self, data: Dict[str, Any], status: int = 200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

def run_server():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), HackPilotHandler) as httpd:
        print(f"[HackCoach.ai Server] Running live at http://localhost:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
