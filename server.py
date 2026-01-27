#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Jednoduchý Python server pre svadobnú stránku
Spustenie: python server.py
Potom otvor: http://localhost:8000
"""

import http.server
import socketserver
import os

# Port
PORT = 8000

# Zmena adresára na aktuálny (kde je index.html)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Povolenie CORS pre Google Apps Script
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

# Spustenie servera
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✅ Server beží na: http://localhost:{PORT}")
    print(f"📂 Adresár: {os.getcwd()}")
    print(f"🌐 Otvor v prehliadači: http://localhost:{PORT}")
    print(f"⛔ Zastavenie: Ctrl+C")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server zastavený")
