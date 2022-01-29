import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess


#host_name = '192.168.178.44'
host_name = '127.0.0.1'
host_port = 8000
streams = ['https://stream-relay-geo.ntslive.net/stream',
    'https://stream-relay-geo.ntslive.net/stream2',
    'https://www.youtube.com/watch?v=EpjJu7b4UqI' ]


class MyServer(BaseHTTPRequestHandler):
    """ A special implementation of BaseHTTPRequestHander """
    job = 'test'

    def do_HEAD(self):
        """ do_HEAD() can be tested use curl command
            'curl -I http://server-ip-address:port'
        """
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def _redirect(self, path):
        self.send_response(303)
        self.send_header('Content-type', 'text/html')
        self.send_header('Location', path)
        self.end_headers()

    def do_GET(self):
        """ do_GET() can be tested using curl command
            'curl http://server-ip-address:port'
        """
        html = open('index.html', 'r').read()
        self.do_HEAD()
        self.wfile.write(html.encode("utf-8"))

    def do_POST(self):
        """ do_POST() can be tested using curl command
            'curl -d "submit=On" http://server-ip-address:port'
        """
        content_length = int(self.headers['Content-Length'])    # Get the size of data
        post_data = self.rfile.read(content_length).decode("utf-8")   # Get the data
        post_data = post_data.split("=")[1]    # Only keep the value
        post_data = post_data.replace('+', ' ')

        # remove previous stream if any
        if os.path.exists('job.txt'):
            f = open('job.txt', 'r')
            self.job = f.read()
            f.close()
            subprocess.Popen(['kill', self.job])
            os.remove('job.txt')
            # self.job.terminate()
            print(self.job, 'terminated')
        else:
            print('job file does not exist')

        # (optional) start new stream
        if post_data != 'Ausschalten':
            stream_id = -1
            if post_data == 'NTS Live 1':
                print('playing', 'NTS Live 1')
                stream_id = 0
            elif post_data == 'NTS Live 2':
                print('playing', 'NTS Live 2')
                stream_id = 1
            elif post_data == 'Saufen':
                print('playing', 'Saufen')
                stream_id = 2
            self.job = subprocess.Popen(['cvlc', '--play-and-exit', streams[stream_id]])
            # save pid to file
            f = open ('job.txt', 'w')
            f.write(str(self.job.pid))
            f.close()
            
        self._redirect('/')    # Redirect back to the root url


if __name__ == '__main__':
    http_server = HTTPServer((host_name, host_port), MyServer)
    print("Server Starts - %s:%s" % (host_name, host_port))

    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        http_server.server_close()
