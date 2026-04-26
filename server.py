import os
import http.server
import socketserver
from pathlib import Path

PORT = int(os.environ.get('PORT', 3000))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        return super().end_headers()

    def do_GET(self):
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        return super().do_GET()

print(f"🚀 Servidor AppGrid corriendo en puerto {PORT}")
print(f"📱 Abrí http://localhost:{PORT} en tu navegador")

with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
    httpd.serve_forever()
